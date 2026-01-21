import React from 'react';
import { TrendingUp, TrendingDown, Calculator, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface CashFlowSummaryProps {
  totalEntradas: number;
  totalSaidasRetiradas: number;
  total: number;
  isDark: boolean;
}

export const CashFlowSummary: React.FC<CashFlowSummaryProps> = ({
  totalEntradas,
  totalSaidasRetiradas,
  total,
  isDark
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} p-4 rounded-2xl shadow-sm border flex items-center gap-4`}>
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Entradas</p>
          <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalEntradas)}</p>
        </div>
      </div>

      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-red-100'} p-4 rounded-2xl shadow-sm border flex items-center gap-4`}>
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <TrendingDown className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Saídas</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalSaidasRetiradas)}</p>
        </div>
      </div>

      <div className={`${isDark ? 'bg-slate-900 border-purple-500/30' : 'bg-gradient-to-br from-purple-600 to-indigo-700'} p-4 rounded-2xl shadow-lg flex items-center gap-4 text-white`}>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">Saldo em Caixa</p>
          <p className="text-2xl font-bold">{formatCurrency(total)}</p>
        </div>
      </div>
    </section>
  );
};
