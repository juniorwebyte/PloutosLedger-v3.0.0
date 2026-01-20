import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function authMiddleware(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
      if (required) return res.status(401).json({ error: 'missing token' });
      return next();
    }
    const token = header.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.id, role: payload.role, username: payload.username };
      next();
    } catch {
      return res.status(401).json({ error: 'invalid token' });
    }
  };
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Proxy de consulta de CNPJ (server-side para evitar CORS/rate limit no browser)
app.get('/api/cnpj/:cnpj', async (req, res) => {
  try {
    const cnpj = String(req.params.cnpj || '').replace(/\D/g, '');
    if (cnpj.length !== 14) {
      return res.status(400).json({ error: 'CNPJ inválido (deve ter 14 dígitos)' });
    }

    // Preferir BrasilAPI (estável) e cair para ReceitaWS se necessário
    const tryFetchJson = async (url) => {
      const r = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!r.ok) return null;
      return await r.json();
    };

    let data = await tryFetchJson(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    if (!data) data = await tryFetchJson(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
    if (!data) return res.status(404).json({ error: 'CNPJ não encontrado' });

    // Melhor esforço para Inscrição Estadual (nem toda API pública retorna)
    const extractIE = (raw) => {
      const direct =
        raw?.inscricao_estadual ||
        raw?.inscricaoEstadual ||
        raw?.ie ||
        raw?.inscricao ||
        '';
      if (typeof direct === 'string' && direct.trim()) return direct.trim();

      const arr = raw?.inscricoes_estaduais || raw?.inscricoesEstaduais || raw?.inscricoes;
      if (Array.isArray(arr) && arr.length) {
        const pick =
          arr.find((x) => String(x?.ativo ?? x?.active ?? '').toLowerCase() === 'true') ||
          arr.find((x) => String(x?.situacao ?? x?.status ?? '').toLowerCase().includes('habil')) ||
          arr[0];
        const ie = pick?.inscricao_estadual || pick?.inscricaoEstadual || pick?.ie || pick?.inscricao;
        if (typeof ie === 'string' && ie.trim()) return ie.trim();
      }
      return '';
    };

    const inscricao_estadual = extractIE(data);

    // Normalizar para o formato esperado pelo frontend (CNPJResponse simplificado)
    const normalized = {
      cnpj: data.cnpj || cnpj,
      tipo: data.descricao_identificador_matriz_filial || data.tipo || '',
      abertura: data.data_inicio_atividade || data.abertura || '',
      nome: data.razao_social || data.nome || '',
      fantasia: data.nome_fantasia || data.fantasia || '',
      inscricao_estadual,
      atividade_principal: [],
      atividades_secundarias: [],
      natureza_juridica: data.natureza_juridica || '',
      logradouro: data.logradouro || '',
      numero: data.numero || '',
      complemento: data.complemento || '',
      cep: data.cep || '',
      bairro: data.bairro || '',
      municipio: data.municipio || '',
      uf: data.uf || '',
      email: data.email || '',
      telefone: data.ddd_telefone_1 || data.telefone || '',
      efr: '',
      situacao: data.descricao_situacao_cadastral || data.situacao || '',
      data_situacao: data.data_situacao_cadastral || data.data_situacao || '',
      motivo_situacao: data.descricao_motivo_situacao_cadastral || data.motivo_situacao || '',
      situacao_especial: data.situacao_especial || '',
      data_situacao_especial: data.data_situacao_especial || '',
      capital_social: String(data.capital_social || data.capital_social || ''),
      qsa: (data.qsa || []).map((q) => ({ nome: q.nome_socio || q.nome || '', qual: q.qualificacao_socio || q.qual || '' })),
      status: 'OK',
    };

    // ReceitaWS pode retornar status ERROR / message quando limita
    if (data.status === 'ERROR' || data.message) {
      return res.status(429).json({ error: data.message || 'Serviço de CNPJ indisponível' });
    }

    return res.json(normalized);
  } catch (e) {
    console.error('Erro no proxy de CNPJ:', e);
    return res.status(500).json({ error: 'Erro ao consultar CNPJ' });
  }
});

// Simple login endpoint for testing
app.post('/api/auth/login', async (req, res) => {
  try {
    const body = z.object({ username: z.string(), password: z.string() }).safeParse(req.body);
    if (!body.success) return res.status(400).json(body.error);
    
    const { username, password } = body.data;
    
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ error: 'invalid credentials' });
    }
    
    // Check password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log(`Invalid password for user: ${username}`);
      return res.status(401).json({ error: 'invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
    
    console.log(`Login successful for user: ${username}`);
    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Seed users endpoint
app.post('/api/seed/users', async (_req, res) => {
  try {
    console.log('Creating users...');
    
    // Create Webyte user
    const webyteUser = await prisma.user.upsert({
      where: { username: 'Webyte' },
      update: {},
      create: {
        username: 'Webyte',
        password: await bcrypt.hash('Webyte', 10),
        role: 'user',
      },
    });

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'superadmin',
      },
    });

    // Create demo user
    const demoUser = await prisma.user.upsert({
      where: { username: 'demo' },
      update: {},
      create: {
        username: 'demo',
        password: await bcrypt.hash('demo123', 10),
        role: 'user',
      },
    });

    // Create caderno user
    const cadernoUser = await prisma.user.upsert({
      where: { username: 'caderno' },
      update: {},
      create: {
        username: 'caderno',
        password: await bcrypt.hash('caderno2025', 10),
        role: 'user',
      },
    });

    console.log('Users created successfully');
    res.json({ 
      message: 'Usuários criados com sucesso',
      users: [
        { username: webyteUser.username, role: webyteUser.role },
        { username: adminUser.username, role: adminUser.role },
        { username: demoUser.username, role: demoUser.role },
        { username: cadernoUser.username, role: cadernoUser.role },
      ]
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to create users', details: error.message });
  }
});

// List users endpoint for debugging
app.get('/api/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users.map(u => ({ username: u.username, role: u.role, id: u.id })));
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to list users', details: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`🌱 Seed endpoint: http://localhost:${PORT}/api/seed/users`);
  console.log(`👥 Users endpoint: http://localhost:${PORT}/api/users`);
});
