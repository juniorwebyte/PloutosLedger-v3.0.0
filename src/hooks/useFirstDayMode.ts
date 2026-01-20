// Hook para gerenciar o modo "Primeiro dia de uso"
import { useState, useEffect, useCallback } from 'react';

const FIRST_DAY_KEY = 'ploutos_first_day_mode';
const FIRST_DAY_COMPLETED_KEY = 'ploutos_first_day_completed';

export const useFirstDayMode = () => {
  const [isFirstDay, setIsFirstDay] = useState(false);
  const [showTooltips, setShowTooltips] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Verificar se é o primeiro dia de uso
    const firstDayCompleted = localStorage.getItem(FIRST_DAY_COMPLETED_KEY);
    if (!firstDayCompleted) {
      setIsFirstDay(true);
      setShowTooltips(true);
    }

    // Carregar passos completados
    const savedSteps = localStorage.getItem(FIRST_DAY_COMPLETED_KEY);
    if (savedSteps) {
      try {
        const steps = JSON.parse(savedSteps);
        setCompletedSteps(new Set(steps));
      } catch (e) {
        // Ignorar erros de parse
      }
    }
  }, []);

  const completeStep = useCallback((stepId: string) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      newSet.add(stepId);
      localStorage.setItem(FIRST_DAY_COMPLETED_KEY, JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  }, []);

  const completeFirstDay = useCallback(() => {
    setIsFirstDay(false);
    setShowTooltips(false);
    localStorage.setItem(FIRST_DAY_COMPLETED_KEY, 'true');
  }, []);

  const hasCompletedStep = useCallback((stepId: string) => {
    return completedSteps.has(stepId);
  }, [completedSteps]);

  return {
    isFirstDay,
    showTooltips,
    completeStep,
    completeFirstDay,
    hasCompletedStep
  };
};
