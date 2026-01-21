import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { 
  LogOut, Calculator, TrendingUp, TrendingDown, Save, RotateCcw, Download, FileText, 
  Building, Info, CheckCircle2, XCircle, AlertCircle, BarChart3, X, Filter, Bell, 
  AlertTriangle, ExternalLink, Maximize2, Minimize2, Search, Keyboard, FileSpreadsheet, 
  Clock, Lock, Unlock, CreditCard, LogOut as LogOutIcon, Zap, RefreshCcw, CheckCircle
} from 'lucide-react';

// Hooks e Contextos
import { useAuth } from '../contexts/AuthContext';
import { useCashFlow } from '../hooks/useCashFlow';
import { useDemoTimer } from '../hooks/useDemoTimer';
import { useAccessControl } from '../hooks/useAccessControl';
import { useDarkMode } from '../hooks/useDarkMode';
import { useBusinessSegment } from '../hooks/useBusinessSegment';

// Utilitários e Serviços
import { formatCurrency, formatCurrencyInput, preciseCurrency } from '../utils/currency';
import { cashFlowAlertsService } from '../services/cashFlowAlertsService';
import pixService from '../services/pixService';

// Componentes Modulares (Carregamento Direto para Seções Principais)
import { CashFlowHeader } from './CashFlow/CashFlowHeader';
import { CashFlowQuickActions } from './CashFlow/CashFlowQuickActions';
import { CashFlowSummary } from './CashFlow/CashFlowSummary';
import { CashFlowEntries } from './CashFlow/CashFlowEntries';
import { CashFlowExits } from './CashFlow/CashFlowExits';
import Notification from './Notification';
import DemoTimer from './DemoTimer';

// Lazy Load de Modais e Componentes Pesados
const CashFlowCharts = lazy(() => import('./CashFlow/CashFlowCharts').then(m => ({ default: m.CashFlowCharts })));
const CashFlowDashboard = lazy(() => import('./CashFlowDashboard'));
const OwnerPanel = lazy(() => import('./OwnerPanel'));
const AlertCenter = lazy(() => import('./AlertCenter'));
const BackupRestoreModal = lazy(() => import('./BackupRestoreModal'));
const ValidationModal = lazy(() => import('./ValidationModal'));
const TemplatesModal = lazy(() => import('./TemplatesModal'));
const PDVIntegrationModal = lazy(() => import('./PDVIntegrationModal'));
const WebhooksModal = lazy(() => import('./WebhooksModal'));

interface CashFlowProps {
  isDemo?: boolean;
  onBackToLanding?: () => void;
}

export default function CashFlow({ isDemo = false, onBackToLanding }: CashFlowProps) {
  const { logout, user } = useAuth();
  const { companySegment, refreshSegment } = useBusinessSegment();
  const { timeInfo } = useDemoTimer();
  
  // Estados de UI
  const [showDashboard, setShowDashboard] = useState(false);
  const [showChartsModal, setShowChartsModal] = useState(false);
  const [showOwnerPanel, setShowOwnerPanel] = useState(false);
  const [showAlertCenter, setShowAlertCenter] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showPDVIntegrationModal, setShowPDVIntegrationModal] = useState(false);
  const [showWebhooksModal, setShowWebhooksModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSavedRecords, setShowSavedRecords] = useState(false);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const systemContainerRef = useRef<HTMLDivElement>(null);

  // Hook de Lógica Principal
  const cashFlow = useCashFlow();
  const { 
    entries, exits, total, totalEntradas, totalSaidasCalculado, 
    updateEntries, updateExits, handleEntryChange, handleExitChange 
  } = cashFlow;

  // Efeito para Alertas
  useEffect(() => {
    const updateUnreadCount = () => setUnreadAlertsCount(cashFlowAlertsService.getUnreadCount());
    updateUnreadCount();
    return cashFlowAlertsService.subscribe(updateUnreadCount);
  }, []);

  return (
    <div ref={systemContainerRef} className={`min-h-screen bg-slate-50 ${isFullscreen ? 'h-screen overflow-y-auto' : ''}`}>
      <CashFlowHeader 
        isDemo={isDemo} 
        onBackToLanding={onBackToLanding} 
        user={user} 
        logout={logout} 
        companySegment={companySegment}
        setShowOwnerPanel={setShowOwnerPanel}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {isDemo && <DemoTimer timeInfo={timeInfo} />}

        <CashFlowQuickActions 
          setShowDashboard={setShowDashboard}
          setShowSavedRecords={setShowSavedRecords}
          setShowAlertCenter={setShowAlertCenter}
          unreadAlertsCount={unreadAlertsCount}
          setShowBackupModal={setShowBackupModal}
          setShowValidationModal={setShowValidationModal}
          setShowTemplatesModal={setShowTemplatesModal}
          setShowPDVIntegrationModal={setShowPDVIntegrationModal}
          setShowWebhooksModal={setShowWebhooksModal}
          setShowChartsModal={setShowChartsModal}
          setShowSearchModal={setShowSearchModal}
        />

        <CashFlowSummary 
          totalEntradas={totalEntradas}
          totalSaidas={totalSaidasCalculado}
          saldo={total}
        />

        <div className="grid grid-cols-1 gap-6">
          <CashFlowEntries 
            entries={entries}
            updateEntries={updateEntries}
            handleEntryChange={handleEntryChange}
            formatCurrencyInput={formatCurrencyInput}
            mostrarEntradas={true}
            setMostrarEntradas={() => {}}
            showEntradasResumo={true}
            setShowEntradasResumo={() => {}}
            entradasResumo={{
              dinheiro: entries.dinheiro,
              cartao: entries.cartao,
              pix: entries.pix,
              total: totalEntradas
            }}
          />

          <CashFlowExits 
            exits={exits}
            updateExits={updateExits}
            handleExitChange={handleExitChange}
            formatCurrencyInput={formatCurrencyInput}
            mostrarSaidas={true}
            setMostrarSaidas={() => {}}
            showSaidasResumo={true}
            setShowSaidasResumo={() => {}}
            saidasResumo={{
              descontos: exits.descontos,
              retiradas: exits.retiradas,
              vales: exits.vales,
              total: totalSaidasCalculado
            }}
          />
        </div>
      </main>

      {/* Modais em Suspense */}
      <Suspense fallback={null}>
        {showChartsModal && (
          <CashFlowCharts 
            isOpen={showChartsModal}
            onClose={() => setShowChartsModal(false)}
            chartPeriod={chartPeriod}
            setChartPeriod={setChartPeriod}
            dailyHistory={[]} // Seria carregado do localStorage ou API
            entries={entries}
            totalCheques={0}
          />
        )}
        {showDashboard && (
          <CashFlowDashboard 
            isOpen={showDashboard}
            onClose={() => setShowDashboard(false)}
          />
        )}
        {showOwnerPanel && (
          <OwnerPanel 
            isOpen={showOwnerPanel}
            onClose={() => setShowOwnerPanel(false)}
            onConfigUpdate={() => {}}
          />
        )}
        {/* Outros modais seriam adicionados aqui conforme necessário */}
      </Suspense>
    </div>
  );
}
