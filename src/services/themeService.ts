import { logger } from '../utils/logger';

/**
 * ThemeService - Personalização Visual (White Label)
 * Gerencia temas e cores customizadas do sistema.
 */
export interface ThemeConfig {
  primaryColor: string;
  darkMode: boolean;
  borderRadius: string;
}

class ThemeService {
  private currentTheme: ThemeConfig = {
    primaryColor: '#10b981', // Emerald 500
    darkMode: false,
    borderRadius: '1rem'
  };

  public applyTheme(config: Partial<ThemeConfig>) {
    this.currentTheme = { ...this.currentTheme, ...config };
    
    // Aplica variáveis CSS dinamicamente
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', this.currentTheme.primaryColor);
      root.style.setProperty('--border-radius', this.currentTheme.borderRadius);
      
      if (this.currentTheme.darkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    logger.info('Novo tema aplicado com sucesso.');
  }

  public getTheme() {
    return this.currentTheme;
  }
}

export const themeService = new ThemeService();
