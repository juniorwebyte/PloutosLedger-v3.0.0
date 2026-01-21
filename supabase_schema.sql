-- SCRIPT DE CRIAÇÃO DO BANCO DE DATAS - PLOUTOSLEDGER V3.0.0
-- Execute este script no SQL Editor do seu painel Supabase.

-- 1. Tabela de Transações (CashFlow)
CREATE TABLE IF NOT EXISTS ploutos_cashflow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(15,2) NOT NULL,
  type TEXT CHECK (type IN ('entry', 'exit')),
  category_id TEXT,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabela de Estoque (Inventory)
CREATE TABLE IF NOT EXISTS ploutos_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(15,2),
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  category_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela de Auditoria (Audit Log)
CREATE TABLE IF NOT EXISTS ploutos_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  payload JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE ploutos_cashflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE ploutos_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ploutos_audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Segurança (Exemplo para CashFlow)
-- Permite que usuários vejam apenas suas próprias transações
CREATE POLICY "Users can view their own transactions" 
ON ploutos_cashflow FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON ploutos_cashflow FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 6. Índices para Performance
CREATE INDEX IF NOT EXISTS idx_cashflow_user ON ploutos_cashflow(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON ploutos_inventory(sku);
