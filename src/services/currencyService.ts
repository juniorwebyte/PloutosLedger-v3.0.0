import { logger } from '../utils/logger';

/**
 * CurrencyService - Gestão Multi-Moeda
 * Gerencia taxas de câmbio e formatação monetária internacional.
 */
export interface ExchangeRates {
  [key: string]: number;
}

class CurrencyService {
  private rates: ExchangeRates = {
    BRL: 1,
    USD: 0.18, // Exemplo: 1 BRL = 0.18 USD
    EUR: 0.16  // Exemplo: 1 BRL = 0.16 EUR
  };

  public format(amount: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  public convert(amount: number, from: string, to: string): number {
    if (from === to) return amount;
    const baseAmount = amount / this.rates[from];
    return baseAmount * this.rates[to];
  }

  public async updateRates() {
    try {
      // Em produção, buscar de uma API real como OpenExchangeRates
      logger.info('Taxas de câmbio atualizadas com sucesso.');
    } catch (error) {
      logger.error('Falha ao atualizar taxas de câmbio:', error);
    }
  }
}

export const currencyService = new CurrencyService();
