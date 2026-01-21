import { useState, useCallback } from 'react';
import { CashFlowExit, SaidaRetirada } from '../types';

export const useCashFlowExits = () => {
  const [exits, setExits] = useState<CashFlowExit>({
    descontos: 0,
    saida: 0,
    justificativaSaida: '',
    justificativaCompra: '',
    valorCompra: 0,
    justificativaSaidaDinheiro: '',
    valorSaidaDinheiro: 0,
    saidasRetiradas: [],
    devolucoes: [],
    enviosCorreios: [],
    enviosTransportadora: [],
    valesFuncionarios: [],
    valesIncluidosNoMovimento: false,
    puxadorNome: '',
    puxadorPorcentagem: 0,
    puxadorValor: 0,
    puxadorTotalVendas: 0,
    puxadorClientes: [],
    puxadores: [],
    creditoDevolucao: 0,
    cpfCreditoDevolucao: '',
    creditoDevolucaoIncluido: false,
    correiosFrete: 0,
    correiosTipo: '',
    correiosEstado: '',
    correiosClientes: [],
  });

  const updateExits = useCallback((field: keyof CashFlowExit, value: any) => {
    setExits(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value : 
                typeof value === 'string' ? value : 
                typeof value === 'boolean' ? value : Number(value)
    }));
  }, []);

  const adicionarSaidaRetirada = useCallback((saida: SaidaRetirada) => {
    setExits(prev => ({
      ...prev,
      saidasRetiradas: [...prev.saidasRetiradas, saida]
    }));
  }, []);

  const removerSaidaRetirada = useCallback((index: number) => {
    setExits(prev => ({
      ...prev,
      saidasRetiradas: prev.saidasRetiradas.filter((_, i) => i !== index)
    }));
  }, []);

  const atualizarSaidaRetirada = useCallback((index: number, saida: SaidaRetirada) => {
    setExits(prev => ({
      ...prev,
      saidasRetiradas: prev.saidasRetiradas.map((s, i) => i === index ? saida : s)
    }));
  }, []);

  return {
    exits,
    setExits,
    updateExits,
    adicionarSaidaRetirada,
    removerSaidaRetirada,
    atualizarSaidaRetirada
  };
};
