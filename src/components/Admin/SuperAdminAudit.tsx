import React, { useEffect, useState } from 'react';
import { Card } from '../UI/BaseComponents';
import { supabase } from '../../services/supabaseClient';

export const SuperAdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('ploutos_audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (!error) setLogs(data);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Painel de Auditoria Global</h2>
      
      <Card title="Atividades Recentes">
        {loading ? (
          <p className="text-center py-4">Carregando logs...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 font-semibold text-slate-600">Data</th>
                  <th className="py-3 font-semibold text-slate-600">Ação</th>
                  <th className="py-3 font-semibold text-slate-600">Usuário</th>
                  <th className="py-3 font-semibold text-slate-600">Entidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.action.includes('ERROR') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{log.user_id || 'Sistema'}</td>
                    <td className="py-3 text-slate-600">{log.entity_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
