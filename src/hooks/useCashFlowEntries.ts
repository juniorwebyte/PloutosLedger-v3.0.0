import { useState, useCallback } from 'react';
import { CashFlowEntry, Cheque, ValeRefeicaoAlimentacao, OutroLancamento, BrindeLancamento } from '../types';
import { getDefaultFundoCaixa } from '../utils/cashFlowHelpers';

export const useCashFlowEntries = () => {
  const [entries, setEntries] = useState<CashFlowEntry>({
    dinheiro: 0,
    fundoCaixa: getDefaultFundoCaixa(),
    cartao: 0,
    cartaoLink: 0,
    clienteCartaoLink: '',
    parcelasCartaoLink: 0,
    boletos: 0,
    clienteBoletos: '',
    parcelasBoletos: 0,
    pixMaquininha: 0,
    pixConta: 0,
    cliente1Nome: '',
    cliente1Valor: 0,
    cliente2Nome: '',
    cliente2Valor: 0,
    cliente3Nome: '',
    cliente3Valor: 0,
    pixContaClientes: [],
    cartaoLinkClientes: [],
    boletosClientes: [],
    cheque: 0,
    cheques: [],
    taxas: [],
    outros: 0,
    outrosDescricao: '',
    outrosLancamentos: [],
    brindes: 0,
    brindesDescricao: '',
    brindesLancamentos: [],
    crediario: 0,
    crediarioClientes: [],
    cartaoPresente: 0,
    cartaoPresenteClientes: [],
    cashBack: 0,
    cashBackClientes: [],
    valeRefeicao: 0,
    valeAlimentacao: 0,
    vrLancamentos: [],
    vaLancamentos: [],
  });

  const updateEntries = useCallback((field: keyof CashFlowEntry, value: any) => {
    setEntries(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value : 
                typeof value === 'string' ? value : Number(value)
    }));
  }, []);

  const adicionarCheque = useCallback((cheque: Cheque) => {
    setEntries(prev => ({
      ...prev,
      cheques: [...prev.cheques, cheque],
      cheque: prev.cheque + cheque.valor
    }));
  }, []);

  const removerCheque = useCallback((index: number) => {
    setEntries(prev => {
      const chequeRemovido = prev.cheques[index];
      const novosCheques = prev.cheques.filter((_, i) => i !== index);
      return {
        ...prev,
        cheques: novosCheques,
        cheque: prev.cheque - (chequeRemovido?.valor || 0)
      };
    });
  }, []);

  const adicionarPixContaCliente = useCallback((nome: string, valor: number) => {
    setEntries(prev => ({
      ...prev,
      pixContaClientes: [...prev.pixContaClientes, { nome, valor }]
    }));
  }, []);

  const removerPixContaCliente = useCallback((index: number) => {
    setEntries(prev => ({
      ...prev,
      pixContaClientes: prev.pixContaClientes.filter((_, i) => i !== index)
    }));
  }, []);

  const adicionarCartaoLinkCliente = useCallback((nome: string, valor: number, parcelas: number) => {
    setEntries(prev => ({
      ...prev,
      cartaoLinkClientes: [...prev.cartaoLinkClientes, { nome, valor, parcelas }]
    }));
  }, []);

  const removerCartaoLinkCliente = useCallback((index: number) => {
    setEntries(prev => ({
      ...prev,
      cartaoLinkClientes: prev.cartaoLinkClientes.filter((_, i) => i !== index)
    }));
  }, []);

  const adicionarBoletosCliente = useCallback((nome: string, valor: number, parcelas: number) => {
    setEntries(prev => ({
      ...prev,
      boletosClientes: [...prev.boletosClientes, { nome, valor, parcelas }]
    }));
  }, []);

  const removerBoletosCliente = useCallback((index: number) => {
    setEntries(prev => ({
      ...prev,
      boletosClientes: prev.boletosClientes.filter((_, i) => i !== index)
    }));
  }, []);

  const adicionarCrediarioCliente = useCallback((nome: string, valor: number, parcelas: number) => {
    setEntries(prev => ({
      ...prev,
      crediarioClientes: [...(prev.crediarioClientes || []), { nome, valor, parcelas }]
    }));
  }, []);

  const removerCrediarioCliente = useCallback((index: number) => {
    setEntries(prev => ({
      ...prev,
      crediarioClientes: (prev.crediarioClientes || []).filter((_, i) => i !== index)
    }));
  }, []);

  const adicionarCartaoPresenteCliente = useCallback((nome: string, valor: number) => {
    setEntries(prev => ({
      ...prev,
      cartaoPresenteClientes: [...(prev.cartaoPresenteClientes || []), { nome, valor }]
    }));
  }, []);

  const removerCartaoPresenteCliente = useCallback((index: number) => {
    setEntries(prev => ({
      ...prev,
      cartaoPresenteClientes: (prev.cartaoPresenteClientes || []).filter((_, i) => i !== index)
    }));
  }, []);

  const adicionarCashBackCliente = useCallback((nome: string, cpf: string, valor: number) => {
    setEntries(prev => ({
      ...prev,
      cashBackClientes: [...(prev.cashBackClientes || []), { nome, cpf, valor }]
    }));
  }, []);

  const removerCashBackCliente = useCallback((index: number) => {
    setEntries(prev => ({
      ...prev,
      cashBackClientes: (prev.cashBackClientes || []).filter((_, i) => i !== index)
    }));
  }, []);

  const adicionarOutroLancamento = useCallback((descricao: string, valor: number) => {
    const novoLancamento: OutroLancamento = { descricao: descricao.trim(), valor };
    setEntries(prev => ({
      ...prev,
      outrosLancamentos: [...(prev.outrosLancamentos || []), novoLancamento],
      outros: (prev.outros || 0) + valor
    }));
  }, []);

  const removerOutroLancamento = useCallback((index: number) => {
    setEntries(prev => {
      const lancamentoRemovido = (prev.outrosLancamentos || [])[index];
      const novosLancamentos = (prev.outrosLancamentos || []).filter((_, i) => i !== index);
      return {
        ...prev,
        outrosLancamentos: novosLancamentos,
        outros: (prev.outros || 0) - (lancamentoRemovido?.valor || 0)
      };
    });
  }, []);

  const adicionarBrindeLancamento = useCallback((descricao: string, valor: number) => {
    const novoLancamento: BrindeLancamento = { descricao: descricao.trim(), valor };
    setEntries(prev => ({
      ...prev,
      brindesLancamentos: [...(prev.brindesLancamentos || []), novoLancamento],
      brindes: (prev.brindes || 0) + valor
    }));
  }, []);

  const removerBrindeLancamento = useCallback((index: number) => {
    setEntries(prev => {
      const lancamentoRemovido = (prev.brindesLancamentos || [])[index];
      const novosLancamentos = (prev.brindesLancamentos || []).filter((_, i) => i !== index);
      return {
        ...prev,
        brindesLancamentos: novosLancamentos,
        brindes: (prev.brindes || 0) - (lancamentoRemovido?.valor || 0)
      };
    });
  }, []);

  const adicionarVRLancamento = useCallback((lancamento: ValeRefeicaoAlimentacao) => {
    setEntries(prev => ({
      ...prev,
      vrLancamentos: [...(prev.vrLancamentos || []), lancamento],
      valeRefeicao: (prev.valeRefeicao || 0) + lancamento.valor
    }));
  }, []);

  const removerVRLancamento = useCallback((index: number) => {
    setEntries(prev => {
      const lancamentoRemovido = (prev.vrLancamentos || [])[index];
      const novosLancamentos = (prev.vrLancamentos || []).filter((_, i) => i !== index);
      return {
        ...prev,
        vrLancamentos: novosLancamentos,
        valeRefeicao: (prev.valeRefeicao || 0) - (lancamentoRemovido?.valor || 0)
      };
    });
  }, []);

  const adicionarVALancamento = useCallback((lancamento: ValeRefeicaoAlimentacao) => {
    setEntries(prev => ({
      ...prev,
      vaLancamentos: [...(prev.vaLancamentos || []), lancamento],
      valeAlimentacao: (prev.valeAlimentacao || 0) + lancamento.valor
    }));
  }, []);

  const removerVALancamento = useCallback((index: number) => {
    setEntries(prev => {
      const lancamentoRemovido = (prev.vaLancamentos || [])[index];
      const novosLancamentos = (prev.vaLancamentos || []).filter((_, i) => i !== index);
      return {
        ...prev,
        vaLancamentos: novosLancamentos,
        valeAlimentacao: (prev.valeAlimentacao || 0) - (lancamentoRemovido?.valor || 0)
      };
    });
  }, []);

  return {
    entries,
    setEntries,
    updateEntries,
    adicionarCheque,
    removerCheque,
    adicionarPixContaCliente,
    removerPixContaCliente,
    adicionarCartaoLinkCliente,
    removerCartaoLinkCliente,
    adicionarBoletosCliente,
    removerBoletosCliente,
    adicionarCrediarioCliente,
    removerCrediarioCliente,
    adicionarCartaoPresenteCliente,
    removerCartaoPresenteCliente,
    adicionarCashBackCliente,
    removerCashBackCliente,
    adicionarOutroLancamento,
    removerOutroLancamento,
    adicionarBrindeLancamento,
    removerBrindeLancamento,
    adicionarVRLancamento,
    removerVRLancamento,
    adicionarVALancamento,
    removerVALancamento
  };
};
