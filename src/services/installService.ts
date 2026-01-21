import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

/**
 * InstallService - Motor do Instalador Automático
 * Valida credenciais e prepara o ambiente inicial.
 */
class InstallService {
  private configKey = 'ploutos_runtime_config';

  public async validateConnection(url: string, key: string): Promise<boolean> {
    try {
      const client = createClient(url, key);
      // Tenta uma operação simples para validar a chave
      const { error } = await client.from('ploutos_cashflow').select('id').limit(1);
      
      // Se o erro for 404, a tabela não existe mas a conexão é válida
      // Se o erro for 401/403, a chave é inválida
      if (error && (error.code === 'PGRST301' || error.code === '401')) {
        return false;
      }
      
      return true;
    } catch (e) {
      logger.error('Erro na validação de instalação:', e);
      return false;
    }
  }

  public saveRuntimeConfig(url: string, key: string) {
    const config = {
      supabaseUrl: url,
      supabaseKey: key,
      installedAt: new Date().toISOString(),
      status: 'active'
    };
    localStorage.setItem(this.configKey, JSON.stringify(config));
    return true;
  }

  public isInstalled(): boolean {
    const config = localStorage.getItem(this.configKey);
    return !!config;
  }
}

export const installService = new InstallService();
