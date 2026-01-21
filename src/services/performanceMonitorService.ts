import { logger } from '../utils/logger';

/**
 * PerformanceMonitorService - Telemetria de Performance
 * Monitora métricas de Core Web Vitals e tempo de resposta.
 */
class PerformanceMonitorService {
  public captureMetrics() {
    if (typeof window !== 'undefined' && window.performance) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

      const metrics = {
        loadTime: `${loadTime}ms`,
        domReady: `${domReady}ms`,
        timestamp: new Date().toISOString()
      };

      logger.info('Métricas de Performance capturadas:', metrics);
      return metrics;
    }
    return null;
  }

  public logLCP(value: number) {
    logger.info(`Largest Contentful Paint (LCP): ${value}ms`);
  }
}

export const performanceMonitor = new PerformanceMonitorService();
