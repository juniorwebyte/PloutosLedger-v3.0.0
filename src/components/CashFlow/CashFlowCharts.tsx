import React from 'react';
import { 
  X, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { formatCurrency } from '../../utils/cashFlowHelpers';

interface CashFlowChartsProps {
  isOpen: boolean;
  onClose: () => void;
  chartPeriod: 'daily' | 'weekly' | 'monthly';
  setChartPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  dailyHistory: any[];
  entries: any;
  totalCheques: number;
}

export const CashFlowCharts: React.FC<CashFlowChartsProps> = ({
  isOpen,
  onClose,
  chartPeriod,
  setChartPeriod,
  dailyHistory,
  entries,
  totalCheques
}) => {
  if (!isOpen) return null;

  // Lógica de processamento de dados (simplificada para a refatoração)
  const chartData = dailyHistory.map(record => ({
    ...record,
    dateFormatted: new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }));

  const pieData = [
    { name: 'Dinheiro', value: entries.dinheiro || 0 },
    { name: 'Cartão', value: entries.cartao || 0 },
    { name: 'PIX', value: entries.pix || 0 },
    { name: 'Cheques', value: totalCheques || 0 }
  ].filter(item => item.value > 0);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">Gráficos e Visualizações</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="h-80 w-full">
            <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase">Fluxo de Caixa (Entradas vs Saídas)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dateFormatted" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="entradas" stroke="#10b981" strokeWidth={3} name="Entradas" />
                <Line type="monotone" dataKey="saidas" stroke="#ef4444" strokeWidth={3} name="Saídas" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64">
              <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase">Distribuição de Entradas</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase">Saldo Médio por Período</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dateFormatted" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="saldo" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Saldo" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
