const FUNDO_CAIXA_KEY = 'fundoCaixaPadrao';
const DEFAULT_PIM = '1536';

/**
 * Obtém o valor padrão do Fundo de Caixa do localStorage
 */
export const getDefaultFundoCaixa = (): number => {
  if (typeof window === 'undefined') return 400;
  const saved = localStorage.getItem(FUNDO_CAIXA_KEY);
  if (saved) {
    const value = parseFloat(saved);
    return isNaN(value) ? 400 : value;
  }
  return 400;
};

/**
 * Salva o valor padrão do Fundo de Caixa no localStorage
 */
export const saveFundoCaixaPadrao = (valor: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FUNDO_CAIXA_KEY, valor.toString());
  }
};

/**
 * Valida o código PIM
 */
export const validatePIM = (pim: string): boolean => {
  return pim === DEFAULT_PIM;
};
