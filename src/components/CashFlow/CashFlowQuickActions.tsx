import React from 'react';
import { BarChart3, FileText, Bell, Settings, Database, Layout, Share2, Printer } from 'lucide-react';

interface CashFlowQuickActionsProps {
  unreadAlertsCount: number;
  setShowDashboard: (show: boolean) => void;
  setShowSavedRecords: (show: boolean) => void;
  setShowAlertCenter: (show: boolean) => void;
  setShowBackupModal: (show: boolean) => void;
  setShowValidationModal: (show: boolean) => void;
  setShowTemplatesModal: (show: boolean) => void;
  setShowPDVIntegrationModal: (show: boolean) => void;
  setShowWebhooksModal: (show: boolean) => void;
  setShowCategoryManager: (show: boolean) => void;
}

export const CashFlowQuickActions: React.FC<CashFlowQuickActionsProps> = ({
  unreadAlertsCount,
  setShowDashboard,
  setShowSavedRecords,
  setShowAlertCenter,
  setShowBackupModal,
  setShowValidationModal,
  setShowTemplatesModal,
  setShowPDVIntegrationModal,
  setShowWebhooksModal,
  setShowCategoryManager
}) => {
  return (
    <section className="mb-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 p-2.5">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setShowDashboard(true)}
            className="flex items-center justify-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-all duration-200 text-xs font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setShowSavedRecords(true)}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-all duration-200 text-xs font-medium"
          >
            <FileText className="w-4 h-4" />
            <span>Registros</span>
          </button>
          <button
            onClick={() => setShowAlertCenter(true)}
            className="relative flex items-center justify-center gap-1.5 bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-all duration-200 text-xs font-medium"
          >
            <Bell className="w-4 h-4" />
            <span>Alertas</span>
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowBackupModal(true)}
            className="flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-xs font-medium"
          >
            <Database className="w-4 h-4" />
            <span>Backup</span>
          </button>
          <button
            onClick={() => setShowTemplatesModal(true)}
            className="flex items-center justify-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-200 text-xs font-medium"
          >
            <Layout className="w-4 h-4" />
            <span>Templates</span>
          </button>
          <button
            onClick={() => setShowCategoryManager(true)}
            className="flex items-center justify-center gap-1.5 bg-slate-600 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-all duration-200 text-xs font-medium"
          >
            <Settings className="w-4 h-4" />
            <span>Categorias</span>
          </button>
          <button
            onClick={() => setShowWebhooksModal(true)}
            className="flex items-center justify-center gap-1.5 bg-cyan-600 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-700 transition-all duration-200 text-xs font-medium"
          >
            <Share2 className="w-4 h-4" />
            <span>Webhooks</span>
          </button>
        </div>
      </div>
    </section>
  );
};
