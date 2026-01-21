import { useState, useCallback, useEffect } from 'react';
import { Cancelamento, Cheque, SaidaRetirada, ValeRefeicaoAlimentacao } from '../types';
import { getCashFlowStorageKey, getLegacyCashFlowStorageKey } from '../utils/cashFlowStorage';
import { preciseCurrency } from '../utils/currency';
import { useCashFlowEntries } from './useCashFlowEntries';
import { useCashFlowExits } from './useCashFlowExits';
import { useCashFlowCalculations } from './useCashFlowCalculations';

export const useCashFlow = () => {
  const { entries, setEntries, updateEntries, ...entryActions } = useCashFlowEntries();
  const { exits, setExits, updateExits, ...exitActions } = useCashFlowExits();
  const calculations = useCashFlowCalculations(entries, exits);
  
  const [total, setTotal] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [cancelamentos, setCancelamentos] = useState<Cancelamento[]>([]);

  // Atualizar total sempre que o totalFinal mudar
  useEffect(() => {
    setTotal(calculations.totalFinal);
  }, [calculations.totalFinal]);

  // Funções de validação
  const validateSaidaValues = useCallback(() => {
    if (exits.saida > 0) {
      const totalSaidasRetiradas = Array.isArray(exits.saidasRetiradas)
        ? exits.saidasRetiradas.reduce((sum, sr) => preciseCurrency.add(sum, Number(sr.valor) || 0), 0)
        : 0;
      const totalLegado = preciseCurrency.add(exits.valorCompra || 0, exits.valorSaidaDinheiro || 0);
      const totalJustificativas = totalSaidasRetiradas > 0 ? totalSaidasRetiradas : totalLegado;
      return preciseCurrency.equals(totalJustificativas, exits.saida);
    }
    return true;
  }, [exits.saida, exits.valorCompra, exits.valorSaidaDinheiro, exits.saidasRetiradas]);

  const validatePixContaValues = useCallback(() => {
    if (entries.pixConta <= 0) return true;
    if (!Array.isArray(entries.pixContaClientes) || entries.pixContaClientes.length === 0) return false;
    const totalClientes = entries.pixContaClientes.reduce((sum, c) => preciseCurrency.add(sum, Number(c.valor) || 0), 0);
    return preciseCurrency.equals(totalClientes, Number(entries.pixConta) || 0);
  }, [entries.pixConta, entries.pixContaClientes]);

  const validateCartaoLinkValues = useCallback(() => {
    if (entries.cartaoLink <= 0) return true;
    if (!Array.isArray(entries.cartaoLinkClientes) || entries.cartaoLinkClientes.length === 0) return false;
    const totalClientes = entries.cartaoLinkClientes.reduce((sum, c) => preciseCurrency.add(sum, Number(c.valor) || 0), 0);
    return preciseCurrency.equals(totalClientes, Number(entries.cartaoLink) || 0);
  }, [entries.cartaoLink, entries.cartaoLinkClientes]);

  const validateBoletosValues = useCallback(() => {
    if (entries.boletos <= 0) return true;
    if (!Array.isArray(entries.boletosClientes) || entries.boletosClientes.length === 0) return false;
    const totalClientes = entries.boletosClientes.reduce((sum, c) => preciseCurrency.add(sum, Number(c.valor) || 0), 0);
    return preciseCurrency.equals(totalClientes, Number(entries.boletos) || 0);
  }, [entries.boletos, entries.boletosClientes]);

  const validateCrediarioValues = useCallback(() => {
    if ((entries.crediario || 0) <= 0) return true;
    if (!entries.crediarioClientes || entries.crediarioClientes.length === 0) return false;
    const totalClientes = entries.crediarioClientes.reduce((sum, c) => preciseCurrency.add(sum, Number(c.valor) || 0), 0);
    return preciseCurrency.equals(totalClientes, Number(entries.crediario) || 0);
  }, [entries.crediario, entries.crediarioClientes]);

  const validateCartaoPresenteValues = useCallback(() => {
    if ((entries.cartaoPresente || 0) <= 0) return true;
    if (!entries.cartaoPresenteClientes || entries.cartaoPresenteClientes.length === 0) return false;
    const totalClientes = entries.cartaoPresenteClientes.reduce((sum, c) => preciseCurrency.add(sum, Number(c.valor) || 0), 0);
    return preciseCurrency.equals(totalClientes, Number(entries.cartaoPresente) || 0);
  }, [entries.cartaoPresente, entries.cartaoPresenteClientes]);

  const validateCashBackValues = useCallback(() => {
    if ((entries.cashBack || 0) <= 0) return true;
    if (!entries.cashBackClientes || entries.cashBackClientes.length === 0) return false;
    const totalClientes = entries.cashBackClientes.reduce((sum, c) => preciseCurrency.add(sum, Number(c.valor) || 0), 0);
    return preciseCurrency.equals(totalClientes, Number(entries.cashBack) || 0);
  }, [entries.cashBack, entries.cashBackClientes]);

  const canSave = useCallback(() => {
    return validateSaidaValues() && validatePixContaValues() && validateCartaoLinkValues() && 
           validateBoletosValues() && validateCrediarioValues() && validateCartaoPresenteValues() && 
           validateCashBackValues();
  }, [validateSaidaValues, validatePixContaValues, validateCartaoLinkValues, validateBoletosValues, validateCrediarioValues, validateCartaoPresenteValues, validateCashBackValues]);

  // Persistência
  const saveToLocal = useCallback((observacoes?: string) => {
    const dataToSave: any = { entries, exits, cancelamentos };
    if (observacoes !== undefined) dataToSave.observacoes = observacoes;
    localStorage.setItem(getCashFlowStorageKey(), JSON.stringify(dataToSave));
    setHasChanges(false);
  }, [entries, exits, cancelamentos]);

  const loadFromLocal = useCallback(() => {
    const key = getCashFlowStorageKey();
    let savedData = localStorage.getItem(key);
    if (!savedData) {
      const legacy = localStorage.getItem(getLegacyCashFlowStorageKey());
      if (legacy) {
        localStorage.setItem(key, legacy);
        localStorage.removeItem(getLegacyCashFlowStorageKey());
        savedData = legacy;
      }
    }
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.entries) setEntries(parsed.entries);
        if (parsed.exits) setExits(parsed.exits);
        if (parsed.cancelamentos) setCancelamentos(parsed.cancelamentos);
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    }
  }, [setEntries, setExits]);

  const clearForm = useCallback(() => {
    // Reset manual para garantir limpeza completa
    localStorage.removeItem(getCashFlowStorageKey());
    window.location.reload(); // Forma mais segura de limpar estados complexos
  }, []);

  useEffect(() => {
    loadFromLocal();
  }, [loadFromLocal]);

  // Funções de negócio adicionais
  const obterCashBackDisponivel = useCallback((cpf: string): number => {
    try {
      const cashBacks = JSON.parse(localStorage.getItem('cashback_descontos') || '[]');
      const cb = cashBacks.find((c: any) => c.cpf === cpf);
      return cb ? cb.valor - (cb.valorUtilizado || 0) : 0;
    } catch { return 0; }
  }, []);

  const utilizarCashBack = useCallback((cpf: string, valor: number) => {
    try {
      const cashBacks = JSON.parse(localStorage.getItem('cashback_descontos') || '[]');
      const idx = cashBacks.findIndex((c: any) => c.cpf === cpf);
      if (idx >= 0 && (cashBacks[idx].valor - (cashBacks[idx].valorUtilizado || 0)) >= valor) {
        cashBacks[idx].valorUtilizado = (cashBacks[idx].valorUtilizado || 0) + valor;
        localStorage.setItem('cashback_descontos', JSON.stringify(cashBacks));
        return true;
      }
    } catch { return false; }
    return false;
  }, []);

  return {
    entries,
    exits,
    total,
    ...calculations,
    cancelamentos,
    setCancelamentos,
    updateEntries: (f: any, v: any) => { updateEntries(f, v); setHasChanges(true); },
    updateExits: (f: any, v: any) => { updateExits(f, v); setHasChanges(true); },
    clearForm,
    hasChanges,
    saveToLocal,
    loadFromLocal,
    validateSaidaValues,
    validatePixContaValues,
    validateCartaoLinkValues,
    validateBoletosValues,
    validateCrediarioValues,
    validateCartaoPresenteValues,
    validateCashBackValues,
    canSave,
    ...entryActions,
    ...exitActions,
    obterCashBackDisponivel,
    utilizarCashBack
  };
};
