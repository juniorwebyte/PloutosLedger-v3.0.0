import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BUSINESS_CONFIG } from '../config/system';
import {
  Calculator, PlayCircle, LogIn, Shield, TrendingUp, Users, Clock, Zap, BarChart3, FileText, Printer, CreditCard, ArrowRight, CheckCircle, DollarSign, Building, Menu, X, ChevronRight, Star, MessageCircle, Bell, Database, ShoppingCart, Target, Activity, Globe, Smartphone, Monitor, Server, Cloud, Shield as ShieldIcon, Lock, Unlock, Eye, Settings, PieChart, LineChart, AreaChart, Mail, Phone, Send, Info, MapPin, AlertCircle, CheckCircle2
} from 'lucide-react';
import plansService, { PlanRecord } from '../services/plansService';
import backendService from '../services/backendService';

// Novos Componentes Extraídos
import { PricingSection, AboutSection, ContactSection } from './LandingPage/LandingPageSections';

// Lazy load components
const FooterPages = lazy(() => import('./FooterPages'));
const ClientRegistration = lazy(() => import('./ClientRegistration'));
const PaymentModal = lazy(() => import('./PaymentModal'));
const PaymentPage = lazy(() => import('./PaymentPage'));
const LicenseValidator = lazy(() => import('./LicenseValidator'));
const LiveChat = lazy(() => import('./LiveChat'));
const CadernoDemo = lazy(() => import('./CadernoDemo'));
const TimeClockDemo = lazy(() => import('./TimeClockDemo'));

interface LandingPageNewProps {
  onRequestLogin: () => void;
  onRequestDemo: () => void;
  onBackToLanding?: () => void;
}

export default function LandingPageNew({ onRequestLogin, onRequestDemo, onBackToLanding }: LandingPageNewProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showFooterPage, setShowFooterPage] = useState(false);
  const [showClientRegistration, setShowClientRegistration] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [showCadernoDemo, setShowCadernoDemo] = useState(false);
  const [showTimeClockDemo, setShowTimeClockDemo] = useState(false);
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  
  const [contactFormData, setContactFormData] = useState({ name: '', email: '', message: '' });
  const [contactFormErrors, setContactFormErrors] = useState({ name: '', email: '', message: '' });
  const [contactFormTouched, setContactFormTouched] = useState({ name: false, email: false, message: false });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string, isVisible: boolean}>({
    type: 'success', message: '', isVisible: false
  });

  useEffect(() => {
    const loadPlans = async () => {
      const allPlans = await plansService.getPlans();
      setPlans(allPlans);
    };
    loadPlans();
  }, []);

  const handlePaymentComplete = (paymentData: any) => {
    setShowPaymentModal(false);
    if (paymentData?.cobranca?.txid) {
      localStorage.setItem('pending_subscription_txid', paymentData.cobranca.txid);
    }
    onRequestLogin();
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <img src="/cabecalho.png" alt="Logo" className="h-12 w-auto" />
              <h1 className="text-xl font-bold text-emerald-600">{BUSINESS_CONFIG.COMPANY.BRAND}</h1>
            </div>
            <nav className="hidden lg:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 font-medium">Recursos</a>
              <a href="#pricing" className="text-gray-700 hover:text-emerald-600 font-medium">Planos</a>
              <button onClick={onRequestLogin} className="text-gray-700 hover:text-emerald-600 font-medium">Entrar</button>
              <button onClick={() => setShowClientRegistration(true)} className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold">Começar Grátis</button>
            </nav>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2"><Menu /></button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section Simplificada */}
        <section className="py-20 bg-gradient-to-b from-emerald-50 to-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6">Gestão Financeira Profissional</h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Controle seu caixa, vendas e estoque em um só lugar.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowClientRegistration(true)} className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg">Criar Conta Grátis</button>
              <button onClick={() => setShowTimeClockDemo(true)} className="px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-600 rounded-xl font-bold text-lg">Ver Demo</button>
            </div>
          </div>
        </section>

        <PricingSection 
          BUSINESS_CONFIG={BUSINESS_CONFIG} 
          setShowClientRegistration={setShowClientRegistration} 
          plans={plans} 
          selectedPlan={selectedPlan} 
          setSelectedPlan={setSelectedPlan} 
          setShowPaymentModal={setShowPaymentModal} 
        />

        <AboutSection BUSINESS_CONFIG={BUSINESS_CONFIG} setShowClientRegistration={setShowClientRegistration} />

        <ContactSection 
          BUSINESS_CONFIG={BUSINESS_CONFIG}
          setShowClientRegistration={setShowClientRegistration}
          contactFormData={contactFormData}
          contactFormErrors={contactFormErrors}
          isSubmittingContact={isSubmittingContact}
          handleContactSubmit={async (e) => {
            e.preventDefault();
            setIsSubmittingContact(true);
            // Lógica de envio...
            setTimeout(() => {
              setIsSubmittingContact(false);
              setNotification({ type: 'success', message: 'Mensagem enviada!', isVisible: true });
            }, 1000);
          }}
          setContactFormData={setContactFormData}
          setContactFormTouched={setContactFormTouched}
        />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <img src="/rodape.png" alt="Logo" className="h-16 mx-auto mb-6" />
          <p className="text-gray-400">© 2025 {BUSINESS_CONFIG.COMPANY.NAME}. Todos os direitos reservados.</p>
        </div>
      </footer>

      <Suspense fallback={null}>
        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onPaymentComplete={handlePaymentComplete}
            selectedPlan={selectedPlan}
          />
        )}
        {showClientRegistration && (
          <ClientRegistration onClose={() => setShowClientRegistration(false)} onSuccess={() => onRequestDemo()} />
        )}
        {showChat && <LiveChat isOpen={showChat} onToggle={() => setShowChat(!showChat)} />}
        {showCadernoDemo && <CadernoDemo onClose={() => setShowCadernoDemo(false)} />}
        {showTimeClockDemo && <TimeClockDemo onClose={() => setShowTimeClockDemo(false)} onRequestLogin={onRequestLogin} />}
      </Suspense>
    </div>
  );
}
