/**
 * AnalyticsService - Inteligência de Negócio
 * Processa dados financeiros para gerar insights estratégicos.
 */
class AnalyticsService {
  public calculateGrowth(currentPeriod: number, previousPeriod: number): number {
    if (previousPeriod === 0) return 0;
    return ((currentPeriod - previousPeriod) / previousPeriod) * 100;
  }

  public getProfitMargin(revenue: number, costs: number): number {
    if (revenue === 0) return 0;
    return ((revenue - costs) / revenue) * 100;
  }

  public groupByCategory(transactions: any[]) {
    return transactions.reduce((acc, curr) => {
      const cat = curr.category_id || 'Outros';
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const analyticsService = new AnalyticsService();
