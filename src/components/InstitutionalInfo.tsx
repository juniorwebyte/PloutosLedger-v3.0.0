// Componente para exibir informações institucionais (Razão Social, CNPJ, links LGPD)
import React from 'react';
import { Shield, ExternalLink, FileText, Lock } from 'lucide-react';

interface InstitutionalInfoProps {
  className?: string;
}

export default function InstitutionalInfo({ className = '' }: InstitutionalInfoProps) {
  // Informações institucionais - devem ser configuradas
  const razaoSocial = import.meta.env.VITE_RAZAO_SOCIAL || 'PloutosLedger';
  const cnpj = import.meta.env.VITE_CNPJ || '';
  const politicaPrivacidadeUrl = import.meta.env.VITE_POLITICA_PRIVACIDADE_URL || '#';
  const termosUsoUrl = import.meta.env.VITE_TERMOS_USO_URL || '#';

  return (
    <div className={`bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-200 py-4 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {razaoSocial && (
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span className="font-medium">{razaoSocial}</span>
                {cnpj && <span className="text-gray-500">• CNPJ: {cnpj}</span>}
              </div>
            )}
            <div className="flex items-center gap-1 text-emerald-600">
              <Lock className="w-3 h-3" />
              <span className="font-medium">Dados protegidos • Backups automáticos • Conformidade com LGPD</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={politicaPrivacidadeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>Política de Privacidade</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a
              href={termosUsoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>Termos de Uso</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
