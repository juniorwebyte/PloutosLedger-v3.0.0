import { supabase } from './supabaseClient';
import { logger } from '../utils/logger';

/**
 * MigrationService - Transição Local para Nuvem
 * Detecta dados no LocalStorage e sincroniza com o Supabase.
 */
class MigrationService {
  private migrationKey = 'ploutos_migration_status';

  /**
   * Verifica se há dados locais que precisam ser migrados
   */
  public hasLocalData(): boolean {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ploutos_') && !key.includes('migration') && !key.includes('token')) {
        const data = localStorage.getItem(key);
        if (data && data !== '[]' && data !== '{}') return true;
      }
    }
    return false;
  }

  /**
   * Executa a migração de uma tabela específica
   */
  private async migrateTable(storageKey: string, tableName: string): Promise<{ success: boolean; count: number }> {
    try {
      const localData = localStorage.getItem(storageKey);
      if (!localData) return { success: true, count: 0 };

      const items = JSON.parse(localData);
      if (!Array.isArray(items) || items.length === 0) return { success: true, count: 0 };

      logger.info(`Migrando ${items.length} itens de ${storageKey} para ${tableName}...`);

      const { error } = await supabase.from(tableName).upsert(items);

      if (error) throw error;

      return { success: true, count: items.length };
    } catch (error) {
      logger.error(`Falha ao migrar tabela ${tableName}:`, error);
      return { success: false, count: 0 };
    }
  }

  /**
   * Orquestra a migração completa
   */
  public async runFullMigration(): Promise<{ success: boolean; totalMigrated: number }> {
    if (localStorage.getItem(this.migrationKey) === 'completed') {
      return { success: true, totalMigrated: 0 };
    }

    const tablesToMigrate = [
      { key: 'ploutos_cashflow', table: 'ploutos_cashflow' },
      { key: 'ploutos_inventory', table: 'ploutos_inventory' },
      { key: 'ploutos_audit_logs', table: 'ploutos_audit_logs' }
    ];

    let totalMigrated = 0;
    let allSuccess = true;

    for (const item of tablesToMigrate) {
      const result = await this.migrateTable(item.key, item.table);
      if (result.success) {
        totalMigrated += result.count;
      } else {
        allSuccess = false;
      }
    }

    if (allSuccess) {
      localStorage.setItem(this.migrationKey, 'completed');
      logger.info(`Migração concluída com sucesso. Total de itens: ${totalMigrated}`);
    }

    return { success: allSuccess, totalMigrated };
  }
}

export const migrationService = new MigrationService();
