// Utilitário para gerenciar regras de formas de pagamento por ramo de atuação
import { BusinessSegmentCategory } from '../types/businessSegment';

// Formas de pagamento que devem ser ocultadas no ramo alimentício
export const PAYMENT_METHODS_HIDDEN_IN_FOOD = [
  'cartaoLink',
  'boletos',
  'cheques',
  'taxas',
  'transportadora',
  'comissaoPuxador',
  'correios'
];

// Tipos de campos que devem ser ocultados
export type HiddenPaymentMethod = 
  | 'cartaoLink'
  | 'boletos'
  | 'cheques'
  | 'taxas'
  | 'transportadora'
  | 'comissaoPuxador'
  | 'correios';

/**
 * Verifica se uma forma de pagamento deve ser exibida baseado no ramo de atuação
 */
export function shouldShowPaymentMethod(
  method: string,
  segmentCategory?: BusinessSegmentCategory
): boolean {
  // Se não há categoria definida, mostrar todos (compatibilidade retroativa)
  if (!segmentCategory) {
    return true;
  }

  // Para ramo alimentício, ocultar formas específicas
  if (segmentCategory === 'alimentacao_bebidas') {
    return !PAYMENT_METHODS_HIDDEN_IN_FOOD.includes(method as HiddenPaymentMethod);
  }

  // Para outros ramos, mostrar todas
  return true;
}

/**
 * Verifica se VR/VA devem ser exibidos baseado no ramo de atuação
 */
export function shouldShowVRVA(
  segmentCategory?: BusinessSegmentCategory
): boolean {
  // VR/VA só aparecem no ramo alimentício
  return segmentCategory === 'alimentacao_bebidas';
}

/**
 * Obtém a lista de formas de pagamento ocultas para um ramo
 */
export function getHiddenPaymentMethods(
  segmentCategory?: BusinessSegmentCategory
): HiddenPaymentMethod[] {
  if (segmentCategory === 'alimentacao_bebidas') {
    return [...PAYMENT_METHODS_HIDDEN_IN_FOOD];
  }
  return [];
}

/**
 * Verifica se o ramo é alimentício
 */
export function isFoodSegment(
  segmentCategory?: BusinessSegmentCategory
): boolean {
  return segmentCategory === 'alimentacao_bebidas';
}
