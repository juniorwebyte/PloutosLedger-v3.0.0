import React from 'react';
import { 
  BarChart3, Search, X, Plus, Trash2, ChevronDown, ChevronUp, DollarSign, CreditCard, QrCode, FileText, Wallet, Gift, Users, RefreshCcw 
} from 'lucide-react';
import { formatCurrency } from '../../utils/cashFlowHelpers';

interface CashFlowEntriesProps {
  entries: any;
  updateEntries: (field: string, value: any) => void;
  mostrarEntradas: boolean;
  setMostrarEntradas: (v: boolean) => void;
  showEntradasResumo: boolean;
  setShowEntradasResumo: (v: boolean) => void;
  entradasResumo: any;
  entradasSearchTerm: string;
  setEntradasSearchTerm: (v: string) => void;
  entradasFilterCategory: string;
  setEntradasFilterCategory: (v: string) => void;
  showEntradasTemplates: boolean;
  setShowEntradasTemplates: (v: boolean) => void;
  entradasTemplates: any[];
  handleEntryChange: (field: string, value: number) => void;
  // ... outras props necessárias
}

export const CashFlowEntries: React.FC<any> = ({
  entries,
  updateEntries,
  mostrarEntradas,
  setMostrarEntradas,
  showEntradasResumo,
  setShowEntradasResumo,
  entradasResumo,
  entradasSearchTerm,
  setEntradasSearchTerm,
  entradasFilterCategory,
  setEntradasFilterCategory,
  showEntradasTemplates,
  setShowEntradasTemplates,
  entradasTemplates,
  handleEntryChange,
  formatCurrencyInput,
  showToast
}) => {
  if (!mostrarEntradas) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Entradas
          </h2>
          <button onClick={() => setMostrarEntradas(true)} className="text-white/80 hover:text-white">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Entradas
        </h2>
        <button onClick={() => setMostrarEntradas(false)} className="text-white/80 hover:text-white">
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {showEntradasResumo && (
          <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-emerald-600 font-medium uppercase">Dinheiro</p>
              <p className="text-lg font-bold text-emerald-900">{formatCurrency(entradasResumo.dinheiro)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-emerald-600 font-medium uppercase">Cartão</p>
              <p className="text-lg font-bold text-emerald-900">{formatCurrency(entradasResumo.cartao)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-emerald-600 font-medium uppercase">PIX</p>
              <p className="text-lg font-bold text-emerald-900">{formatCurrency(entradasResumo.pix)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-emerald-600 font-medium uppercase">Total</p>
              <p className="text-lg font-bold text-emerald-900">{formatCurrency(entradasResumo.total)}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Campos de entrada simplificados para a refatoração */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Dinheiro em Espécie</label>
              <input 
                type="text" 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formatCurrency(entries.dinheiro)}
                onChange={(e) => handleEntryChange('dinheiro', formatCurrencyInput(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Cartão de Crédito/Débito</label>
              <input 
                type="text" 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formatCurrency(entries.cartao)}
                onChange={(e) => handleEntryChange('cartao', formatCurrencyInput(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">PIX / Transferência</label>
              <input 
                type="text" 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formatCurrency(entries.pix)}
                onChange={(e) => handleEntryChange('pix', formatCurrencyInput(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
