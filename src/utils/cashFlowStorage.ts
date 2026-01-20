/**
 * Chaves e helpers de persistência do Movimento de Caixa no localStorage.
 * Objetivo: separar por dia para evitar sobrescrita e melhorar confiabilidade.
 */

const BASE_KEY = 'cashFlowData';

export function getCashFlowStorageKey(dateISO?: string): string {
  const date = dateISO && /^\d{4}-\d{2}-\d{2}$/.test(dateISO)
    ? dateISO
    : new Date().toISOString().slice(0, 10);
  return `${BASE_KEY}:${date}`;
}

export function getLegacyCashFlowStorageKey(): string {
  return BASE_KEY;
}

