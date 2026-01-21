import { logger } from '../utils/logger';

/**
 * NotificationService - Central de Alertas
 * Gerencia notificações in-app para o usuário.
 */
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

class NotificationService {
  private notifications: AppNotification[] = [];

  public notify(title: string, message: string, type: AppNotification['type'] = 'info') {
    const notification: AppNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };

    this.notifications.unshift(notification);
    logger.info(`Nova notificação: ${title}`);
    
    // Limita a 50 notificações
    if (this.notifications.length > 50) {
      this.notifications.pop();
    }

    return notification;
  }

  public getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  public markAsRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
  }

  public getAll() {
    return this.notifications;
  }
}

export const notificationService = new NotificationService();
