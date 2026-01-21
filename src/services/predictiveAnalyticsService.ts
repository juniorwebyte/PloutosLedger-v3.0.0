/**
 * PredictiveAnalyticsService - Inteligência Preditiva
 * Analisa tendências históricas para projetar o futuro financeiro.
 */
class PredictiveAnalyticsService {
  /**
   * Projeta o saldo para os próximos 30 dias baseado na média diária
   */
  public projectNext30Days(transactions: any[], currentBalance: number) {
    const last30Days = transactions.filter(t => {
      const date = new Date(t.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    });

    const dailyAverage = last30Days.reduce((acc, curr) => {
      return acc + (curr.type === 'entry' ? curr.amount : -curr.amount);
    }, 0) / 30;

    const projection = [];
    for (let i = 1; i <= 30; i++) {
      projection.push({
        day: i,
        projectedBalance: currentBalance + (dailyAverage * i)
      });
    }

    return {
      projection,
      trend: dailyAverage >= 0 ? 'up' : 'down',
      estimatedBalanceEndMonth: currentBalance + (dailyAverage * 30)
    };
  }
}

export const predictiveAnalytics = new PredictiveAnalyticsService();
