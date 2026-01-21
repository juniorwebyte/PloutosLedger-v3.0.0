import { logger } from '../utils/logger';

/**
 * ErrorMonitoringService - Telemetria e Diagnóstico
 * Captura erros em produção e envia para serviços de monitoramento.
 */
class ErrorMonitoringService {
  private isProd = import.meta.env.PROD;

  public init() {
    if (!this.isProd) return;

    // Captura erros globais não tratados
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureException(error || new Error(String(message)), { source, lineno, colno });
    };

    // Captura promessas rejeitadas não tratadas
    window.onunhandledrejection = (event) => {
      this.captureException(event.reason, { type: 'unhandled_rejection' });
    };

    logger.info('Monitoramento de erros inicializado em modo produção.');
  }

  public captureException(error: Error, context?: Record<string, any>) {
    logger.error(`[TELEMETRIA] ${error.message}`, { ...context, stack: error.stack });

    if (this.isProd) {
      // Aqui seria a integração real:
      // Sentry.captureException(error, { extra: context });
      
      // Fallback: Salvar no banco de dados de auditoria via Supabase
      this.logErrorToDatabase(error, context);
    }
  }

  private async logErrorToDatabase(error: Error, context?: any) {
    try {
      // Importação dinâmica para evitar dependência circular
      const { supabase } = await import('./supabaseClient');
      await supabase.from('ploutos_audit_logs').insert({
        action: 'SYSTEM_ERROR',
        entity_type: 'ERROR_MONITORING',
        payload: {
          message: error.message,
          stack: error.stack,
          context,
          userAgent: navigator.userAgent
        }
      });
    } catch (e) {
      // Se até o log falhar, não há muito o que fazer além do console
      console.error('Falha crítica no sistema de monitoramento:', e);
    }
  }
}

export const errorMonitoring = new ErrorMonitoringService();
