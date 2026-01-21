import { useMemo } from 'react';
import { CashFlowEntry, CashFlowExit } from '../types';
import { preciseCurrency } from '../utils/currency';

export const useCashFlowCalculations = (entries: CashFlowEntry, exits: CashFlowExit) => {
  const totalTaxas = useMemo(() => {
    if (!Array.isArray(entries.taxas)) return 0;
    return entries.taxas.reduce((sum, taxa) => preciseCurrency.add(sum, Number(taxa.valor) || 0), 0);
  }, [entries.taxas]);

  const totalOutrosLancamentos = useMemo(() => {
    if (!Array.isArray(entries.outrosLancamentos)) return 0;
    return entries.outrosLancamentos.reduce((sum, lancamento) => preciseCurrency.add(sum, Number(lancamento.valor) || 0), 0);
  }, [entries.outrosLancamentos]);

  const totalBrindesLancamentos = useMemo(() => {
    if (!Array.isArray(entries.brindesLancamentos)) return 0;
    return entries.brindesLancamentos.reduce((sum, lancamento) => preciseCurrency.add(sum, Number(lancamento.valor) || 0), 0);
  }, [entries.brindesLancamentos]);

  const totalVRLancamentos = useMemo(() => {
    if (!Array.isArray(entries.vrLancamentos)) return 0;
    return entries.vrLancamentos.reduce((sum, lancamento) => preciseCurrency.add(sum, Number(lancamento.valor) || 0), 0);
  }, [entries.vrLancamentos]);

  const totalVALancamentos = useMemo(() => {
    if (!Array.isArray(entries.vaLancamentos)) return 0;
    return entries.vaLancamentos.reduce((sum, lancamento) => preciseCurrency.add(sum, Number(lancamento.valor) || 0), 0);
  }, [entries.vaLancamentos]);

  const totalEntradas = useMemo(() => {
    const outrosValor = totalOutrosLancamentos > 0 ? totalOutrosLancamentos : (entries.outros || 0);
    const brindesValor = totalBrindesLancamentos > 0 ? totalBrindesLancamentos : (entries.brindes || 0);
    
    return preciseCurrency.add(
      entries.dinheiro || 0,
      entries.fundoCaixa || 0,
      entries.cartao || 0,
      entries.cartaoLink || 0,
      entries.boletos || 0,
      entries.pixMaquininha || 0,
      entries.pixConta || 0,
      outrosValor,
      brindesValor,
      entries.crediario || 0,
      entries.cartaoPresente || 0,
      entries.cashBack || 0,
      totalTaxas,
      totalVRLancamentos,
      totalVALancamentos
    );
  }, [entries, totalTaxas, totalOutrosLancamentos, totalBrindesLancamentos, totalVRLancamentos, totalVALancamentos]);

  const totalDevolucoes = useMemo(() => {
    if (!Array.isArray(exits.devolucoes)) return 0;
    return exits.devolucoes
      .filter(devolucao => devolucao.incluidoNoMovimento)
      .reduce((sum, devolucao) => preciseCurrency.add(sum, Number(devolucao.valor) || 0), 0);
  }, [exits.devolucoes]);

  const totalEnviosCorreios = useMemo(() => {
    if (!Array.isArray(exits.enviosCorreios)) return 0;
    return exits.enviosCorreios
      .filter(envio => envio.incluidoNoMovimento)
      .reduce((sum, envio) => preciseCurrency.add(sum, Number(envio.valor) || 0), 0);
  }, [exits.enviosCorreios]);

  const totalValesFuncionarios = useMemo(() => {
    if (!Array.isArray(exits.valesFuncionarios)) return 0;
    return exits.valesFuncionarios.reduce((sum, item) => preciseCurrency.add(sum, Number(item.valor) || 0), 0);
  }, [exits.valesFuncionarios]);

  const totalSaidasRetiradas = useMemo(() => {
    if (!Array.isArray(exits.saidasRetiradas)) return 0;
    return exits.saidasRetiradas
      .filter(saida => saida.incluidoNoMovimento)
      .reduce((sum, saida) => preciseCurrency.add(sum, Number(saida.valor) || 0), 0);
  }, [exits.saidasRetiradas]);

  const valesImpactoEntrada = useMemo(() => {
    return exits.valesIncluidosNoMovimento ? totalValesFuncionarios : 0;
  }, [exits.valesIncluidosNoMovimento, totalValesFuncionarios]);

  const totalCheques = useMemo(() => {
    if (!Array.isArray(entries.cheques)) return 0;
    return entries.cheques.reduce((sum, cheque) => preciseCurrency.add(sum, Number(cheque.valor) || 0), 0);
  }, [entries.cheques]);

  const totalFinal = useMemo(() => {
    const entradasComAdicionais = preciseCurrency.add(
      totalEntradas,
      totalCheques,
      totalDevolucoes,
      totalEnviosCorreios,
      valesImpactoEntrada
    );
    return preciseCurrency.subtract(entradasComAdicionais, totalSaidasRetiradas);
  }, [totalEntradas, totalCheques, totalDevolucoes, totalEnviosCorreios, valesImpactoEntrada, totalSaidasRetiradas]);

  return {
    totalTaxas,
    totalOutrosLancamentos,
    totalBrindesLancamentos,
    totalVRLancamentos,
    totalVALancamentos,
    totalEntradas,
    totalDevolucoes,
    totalEnviosCorreios,
    totalValesFuncionarios,
    totalSaidasRetiradas,
    valesImpactoEntrada,
    totalCheques,
    totalFinal
  };
};
