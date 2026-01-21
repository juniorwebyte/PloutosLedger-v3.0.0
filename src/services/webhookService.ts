import { logger } from '../utils/logger';

/**
 * WebhookService - Integrações Externas
 * Permite notificar sistemas externos sobre eventos no PloutosLedger.
 */
class WebhookService {
  private webhooks: string[] = [];

  public addWebhook(url: string) {
    this.webhooks.push(url);
    logger.info(`Webhook adicionado: ${url}`);
  }

  public async notify(event: string, payload: any) {
    const promises = this.webhooks.map(url => 
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, payload, timestamp: new Date().toISOString() })
      }).catch(err => logger.error(`Falha ao notificar webhook ${url}:`, err))
    );

    await Promise.all(promises);
  }
}

export const webhookService = new WebhookService();
