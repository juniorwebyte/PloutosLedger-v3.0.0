import { logger } from '../utils/logger';

/**
 * LicenseControlService - Gestão de Monetização
 * Controla o acesso baseado em licenças e períodos de teste.
 */
export interface LicenseStatus {
  active: boolean;
  type: 'trial' | 'pro' | 'enterprise' | 'expired';
  expiresAt: string;
  daysRemaining: number;
}

class LicenseControlService {
  private storageKey = 'ploutos_license_info';

  public getStatus(): LicenseStatus {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      // Se não houver licença, inicia um trial de 14 dias
      return this.startTrial(14);
    }

    const info = JSON.parse(stored);
    const expiresAt = new Date(info.expiresAt);
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      return { ...info, active: false, type: 'expired', daysRemaining: 0 };
    }

    return { ...info, active: true, daysRemaining };
  }

  private startTrial(days: number): LicenseStatus {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    
    const status: LicenseStatus = {
      active: true,
      type: 'trial',
      expiresAt: expiresAt.toISOString(),
      daysRemaining: days
    };

    localStorage.setItem(this.storageKey, JSON.stringify(status));
    logger.info(`Trial de ${days} dias iniciado.`);
    return status;
  }

  public activateLicense(key: string): boolean {
    // Lógica de validação de chave (simulada para v3.0)
    if (key.startsWith('PLOUTOS-PRO-')) {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 ano de licença
      
      const status: LicenseStatus = {
        active: true,
        type: 'pro',
        expiresAt: expiresAt.toISOString(),
        daysRemaining: 365
      };

      localStorage.setItem(this.storageKey, JSON.stringify(status));
      return true;
    }
    return false;
  }
}

export const licenseControl = new LicenseControlService();
