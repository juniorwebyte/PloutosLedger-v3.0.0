import React, { useState } from 'react';
import { Card, Button, Input } from '../UI/BaseComponents';
import { logger } from '../../utils/logger';

export const InstallWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    supabaseUrl: '',
    supabaseKey: '',
    adminEmail: '',
    adminPassword: ''
  });

  const handleInstall = async () => {
    logger.info('Iniciando processo de instalação...');
    // Lógica de instalação será implementada na próxima fase
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Instalador Ploutos</h1>
          <p className="text-slate-500">Configuração do ambiente v3.0.0</p>
        </div>

        {step === 1 && (
          <Card title="Passo 1: Banco de Dados">
            <p className="text-sm text-slate-600 mb-4">Insira as credenciais do seu projeto Supabase.</p>
            <div className="space-y-4">
              <Input 
                label="Supabase URL" 
                placeholder="https://xyz.supabase.co" 
                value={config.supabaseUrl}
                onChange={(e) => setConfig({...config, supabaseUrl: e.target.value})}
              />
              <Input 
                label="Supabase Anon Key" 
                placeholder="eyJhbG..." 
                value={config.supabaseKey}
                onChange={(e) => setConfig({...config, supabaseKey: e.target.value})}
              />
              <Button onClick={() => setStep(2)} className="w-full">Próximo Passo</Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card title="Passo 2: Conta Administrador">
            <p className="text-sm text-slate-600 mb-4">Crie a conta mestre para gerenciar o sistema.</p>
            <div className="space-y-4">
              <Input 
                label="E-mail do Admin" 
                type="email"
                value={config.adminEmail}
                onChange={(e) => setConfig({...config, adminEmail: e.target.value})}
              />
              <Input 
                label="Senha" 
                type="password"
                value={config.adminPassword}
                onChange={(e) => setConfig({...config, adminPassword: e.target.value})}
              />
              <div className="flex space-x-2">
                <Button onClick={() => setStep(1)} variant="secondary">Voltar</Button>
                <Button onClick={handleInstall} className="flex-1">Finalizar Instalação</Button>
              </div>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card title="Instalação Concluída!">
            <div className="text-center py-4">
              <div className="text-emerald-500 text-5xl mb-4">✅</div>
              <p className="text-slate-600 mb-6">O PloutosLedger foi configurado com sucesso e está pronto para uso.</p>
              <Button onClick={() => window.location.href = '/'} className="w-full">Ir para o Dashboard</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
