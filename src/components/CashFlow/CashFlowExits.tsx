import React from 'react';
import { 
  TrendingDown, ChevronDown, ChevronUp, Trash2, Plus, Search, Filter, FileText, Truck, Mail, AlertCircle 
} from 'lucide-react';
import { formatCurrency } from '../../utils/cashFlowHelpers';

export const CashFlowExits: React.FC<any> = ({
  exits,
  updateExits,
  mostrarSaidas,
  setMostrarSaidas,
  showSaidasResumo,
  setShowSaidasResumo,
  saidasResumo,
  saidasSearchTerm,
  setSaidasSearchTerm,
  saidasFilterCategory,
  setSaidasFilterCategory,
  handleExitChange,
  formatCurrencyInput
}) => {
  if (!mostrarSaidas) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Saídas
          </h2>
          <button onClick={() => setMostrarSaidas(true)} className="text-white/80 hover:text-white">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingDown className="w-5 h-5" />
          Saídas
        </h2>
        <button onClick={() => setMostrarSaidas(false)} className="text-white/80 hover:text-white">
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {showSaidasResumo && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-red-600 font-medium uppercase">Descontos</p>
              <p className="text-lg font-bold text-red-900">{formatCurrency(saidasResumo.descontos)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-red-600 font-medium uppercase">Retiradas</p>
              <p className="text-lg font-bold text-red-900">{formatCurrency(saidasResumo.retiradas)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-red-600 font-medium uppercase">Vales</p>
              <p className="text-lg font-bold text-red-900">{formatCurrency(saidasResumo.vales)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-red-600 font-medium uppercase">Total</p>
              <p className="text-lg font-bold text-red-900">{formatCurrency(saidasResumo.total)}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Descontos Concedidos</label>
              <input 
                type="text" 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formatCurrency(exits.descontos)}
                onChange={(e) => handleExitChange('descontos', formatCurrencyInput(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Devoluções</label>
              <input 
                type="text" 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formatCurrency(exits.devolucoes)}
                onChange={(e) => handleExitChange('devolucoes', formatCurrencyInput(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Outras Saídas</label>
              <input 
                type="text" 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={formatCurrency(exits.outrasSaidas)}
                onChange={(e) => handleExitChange('outrasSaidas', formatCurrencyInput(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
