import React, { Suspense, lazy } from 'react';
import { Lock, Crown, Users, FileText, Settings } from 'lucide-react';

// Lazy Load de Módulos Pesados
const CashFlow = lazy(() => import('../CashFlow'));
const FinancialTools = lazy(() => import('../FinancialTools'));
const TimeClockModule = lazy(() => import('../TimeClockModule'));
const CadernoNotas = lazy(() => import('../CadernoNotas'));

interface DashboardContentProps {
  activeTab: string;
  accessControl: any;
  setActiveTab: (tab: string) => void;
  renderDashboard: () => React.ReactNode;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  accessControl,
  setActiveTab,
  renderDashboard
}) => {
  const renderPremiumLock = (title: string, feature: string, description: string) => (
    <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-amber-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
          <Lock className="h-6 w-6 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <Crown className="h-5 w-5 text-amber-500 ml-auto" />
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <p className="text-amber-800 font-semibold mb-2">🔒 Funcionalidade Premium</p>
        <p className="text-amber-700 text-sm">{description}</p>
      </div>
      <button 
        onClick={() => setActiveTab('meuplano')}
        className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all"
      >
        Ver Planos Disponíveis
      </button>
    </div>
  );

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      {(() => {
        switch (activeTab) {
          case 'dashboard': return renderDashboard();
          case 'caixa': return <CashFlow />;
          case 'ferramentas-financeiras': return <FinancialTools />;
          case 'controle-ponto': return <TimeClockModule />;
          case 'notas': 
            return accessControl.canAccessFeature('notas') 
              ? <div className="p-8 text-center">Módulo de Notas Fiscais em breve</div>
              : renderPremiumLock('Notas Fiscais', 'notas', 'A emissão de notas fiscais está disponível apenas para planos avançados.');
          case 'clientes':
            return <div className="p-8 text-center"><Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />Módulo de Clientes em breve</div>;
          case 'configuracoes':
            return <div className="p-8 text-center"><Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />Configurações em breve</div>;
          default: return renderDashboard();
        }
      })()}
    </Suspense>
  );
};
