import { logger } from '../utils/logger';

/**
 * PluginService - Arquitetura de Extensibilidade
 * Permite registrar e executar extensões modulares no sistema.
 */
export interface PloutosPlugin {
  id: string;
  name: string;
  version: string;
  execute: (context: any) => void;
}

class PluginService {
  private plugins: Map<string, PloutosPlugin> = new Map();

  public register(plugin: PloutosPlugin) {
    if (this.plugins.has(plugin.id)) {
      logger.warn(`Plugin ${plugin.id} já está registrado.`);
      return;
    }
    this.plugins.set(plugin.id, plugin);
    logger.info(`Plugin registrado com sucesso: ${plugin.name} v${plugin.version}`);
  }

  public runAll(context: any) {
    this.plugins.forEach(plugin => {
      try {
        plugin.execute(context);
      } catch (error) {
        logger.error(`Erro ao executar plugin ${plugin.id}:`, error);
      }
    });
  }

  public getPlugins() {
    return Array.from(this.plugins.values());
  }
}

export const pluginService = new PluginService();
