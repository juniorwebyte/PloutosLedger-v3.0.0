import { supabase } from './supabaseClient';
import { exportService } from './exportService';
import { logger } from '../utils/logger';

/**
 * BackupService - Salvaguarda de Dados
 * Permite exportar todos os dados do usuário em um único arquivo.
 */
class BackupService {
  public async createFullSnapshot() {
    try {
      logger.info('Iniciando snapshot completo de dados...');
      
      const tables = ['ploutos_cashflow', 'ploutos_inventory', 'ploutos_audit_logs'];
      const snapshot: Record<string, any> = {
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        data: {}
      };

      for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*');
        if (!error) {
          snapshot.data[table] = data;
        }
      }

      exportService.exportToJSON(snapshot, `ploutos_backup_${new Date().getTime()}`);
      logger.info('Snapshot concluído e baixado.');
      return true;
    } catch (error) {
      logger.error('Falha ao criar snapshot:', error);
      return false;
    }
  }
}

export const backupService = new BackupService();
