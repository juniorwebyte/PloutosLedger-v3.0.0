import React, { useEffect, useState } from 'react';
import { healthCheck, SystemStatus } from '../../services/healthCheckService';
import { Card } from '../UI/BaseComponents';

export const HealthDashboard: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStatus = async () => {
    setLoading(true);
    const newStatus = await healthCheck.checkStatus();
    setStatus(newStatus);
    setLoading(false);
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  if (!status && loading) return <div className="p-8 text-center">Carregando status do sistema...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">Saúde do Sistema</h2>
        <button 
          onClick={refreshStatus}
          className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Atualizar Agora
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Banco de Dados">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${status?.database === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className="font-medium uppercase">{status?.database}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Conexão ativa com Supabase PostgreSQL.</p>
        </Card>

        <Card title="Latência da API">
          <div className="text-2xl font-bold text-emerald-600">
            {status?.latency} <span className="text-sm font-normal text-gray-400">ms</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tempo de resposta médio para requisições críticas.</p>
        </Card>

        <Card title="Versão do Sistema">
          <div className="text-2xl font-bold text-blue-600">
            v{status?.version}
          </div>
          <p className="text-xs text-gray-500 mt-2">Build: Startup Edition (Stable)</p>
        </Card>
      </div>

      <div className="text-center text-xs text-gray-400">
        Última verificação: {status?.lastCheck ? new Date(status.lastCheck).toLocaleString() : '-'}
      </div>
    </div>
  );
};
