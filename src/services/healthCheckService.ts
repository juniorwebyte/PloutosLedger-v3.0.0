import { supabase } from './supabaseClient';
import { logger } from '../utils/logger';

/**
 * HealthCheckService - Monitoramento de Integridade
 * Verifica o status dos serviços críticos em tempo real.
 */
export interface SystemStatus {
  database: 'online' | 'offline' | 'degraded';
  latency: number;
  lastCheck: string;
  version: string;
}

class HealthCheckService {
  private version = '3.0.0';

  public async checkStatus(): Promise<SystemStatus> {
    const start = Date.now();
    let dbStatus: SystemStatus['database'] = 'online';

    try {
      // Tenta uma consulta simples no Supabase
      const { error } = await supabase.from('ploutos_cashflow').select('id').limit(1);
      if (error) throw error;
    } catch (e) {
      logger.error('HealthCheck: Falha na conexão com o banco de dados', e);
      dbStatus = 'offline';
    }

    const latency = Date.now() - start;

    return {
      database: dbStatus,
      latency,
      lastCheck: new Date().toISOString(),
      version: this.version
    };
  }

  /**
   * Inicia monitoramento periódico (opcional)
   */
  public startMonitoring(callback: (status: SystemStatus) => void, intervalMs = 60000) {
    const run = async () => {
      const status = await this.checkStatus();
      callback(status);
    };
    
    run();
    return setInterval(run, intervalMs);
  }
}

export const healthCheck = new HealthCheckService();
