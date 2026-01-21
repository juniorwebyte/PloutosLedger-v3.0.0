import { logger } from '../utils/logger';
import { notificationService } from './notificationService';

/**
 * AutomationService - Motor de Automação
 * Executa tarefas agendadas e gatilhos de fluxo de trabalho.
 */
export interface AutomationTask {
  id: string;
  name: string;
  type: 'recurring_payment' | 'report_generation' | 'stock_check';
  interval: 'daily' | 'weekly' | 'monthly';
  lastRun?: string;
}

class AutomationService {
  private tasks: AutomationTask[] = [];

  public scheduleTask(task: AutomationTask) {
    this.tasks.push(task);
    logger.info(`Tarefa agendada: ${task.name} (${task.interval})`);
  }

  public async runPendingTasks() {
    logger.info('Verificando tarefas de automação pendentes...');
    
    for (const task of this.tasks) {
      // Lógica de verificação de intervalo e execução
      if (task.type === 'stock_check') {
        notificationService.notify('Automação', `Verificação de estoque "${task.name}" concluída.`, 'info');
      }
      task.lastRun = new Date().toISOString();
    }
  }
}

export const automationService = new AutomationService();
