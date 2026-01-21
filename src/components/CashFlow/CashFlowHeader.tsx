import React from 'react';
import { Calculator, Building, LogOut } from 'lucide-react';

interface CashFlowHeaderProps {
  isDemo: boolean;
  onBackToLanding?: () => void;
  user: string | null;
  companySegment: any;
  logout: () => void;
  setShowOwnerPanel: (show: boolean) => void;
}

export const CashFlowHeader: React.FC<CashFlowHeaderProps> = ({
  isDemo,
  onBackToLanding,
  user,
  companySegment,
  logout,
  setShowOwnerPanel
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-lg border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-3 sm:py-0 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-all duration-300 relative overflow-hidden group">
                <Calculator className="w-5 h-5 text-white relative z-10" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isDemo ? 'Demonstração - Movimento de Caixa' : 'Movimento de Caixa'}
              </h1>
              <p className="text-purple-200 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                {companySegment?.segment?.nome ? (
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {companySegment.segment.nome}
                  </span>
                ) : (
                  isDemo ? 'Teste todas as funcionalidades' : 'Controle financeiro automatizado'
                )}
              </p>
            </div>
          </div>
          
          <div className="flex flex-row items-center gap-2">
            {isDemo && onBackToLanding ? (
              <button
                onClick={onBackToLanding}
                className="group flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
              >
                <span>←</span>
                <span className="hidden sm:inline">Voltar</span>
              </button>
            ) : (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-purple-200 text-xs">Usuário</p>
                  <p className="font-semibold text-white text-sm">{user}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowOwnerPanel(true)}
                    className="flex items-center space-x-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-200 text-xs font-medium"
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Proprietário</span>
                  </button>
                  {!onBackToLanding && (
                    <button
                      onClick={logout}
                      className="flex items-center space-x-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all duration-200 text-xs font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sair</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
