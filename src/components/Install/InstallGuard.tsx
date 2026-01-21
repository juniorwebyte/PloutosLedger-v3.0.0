import React from 'react';
import { Navigate } from 'react-router-dom';
import { installService } from '../../services/installService';

interface InstallGuardProps {
  children: React.ReactNode;
}

/**
 * InstallGuard - Proteção de Configuração
 * Redireciona para /install se o sistema não estiver configurado.
 */
export const InstallGuard: React.FC<InstallGuardProps> = ({ children }) => {
  const isInstalled = installService.isInstalled();
  const isEnvConfigured = !!import.meta.env.VITE_SUPABASE_URL;

  if (!isInstalled && !isEnvConfigured) {
    return <Navigate to="/install" replace />;
  }

  return <>{children}</>;
};
