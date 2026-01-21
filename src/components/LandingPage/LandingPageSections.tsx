import React from 'react';
import { 
  Shield, Database, Clock, Zap, TrendingUp, Users, Target, Info, Mail, Phone, MapPin, Send, AlertCircle, CheckCircle2, ArrowRight 
} from 'lucide-react';

interface SectionProps {
  BUSINESS_CONFIG: any;
  setShowClientRegistration: (show: boolean) => void;
}

export const PricingSection: React.FC<SectionProps & { plans: any[], selectedPlan: any, setSelectedPlan: (plan: any) => void, setShowPaymentModal: (show: boolean) => void }> = ({ 
  plans, selectedPlan, setSelectedPlan, setShowPaymentModal, setShowClientRegistration 
}) => (
  <section id="pricing" className="py-24 bg-gray-50 relative overflow-hidden">
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Planos que cabem no seu bolso</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Escolha a melhor opção para o seu momento</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-500 transform hover:scale-105 ${plan.isRecommended ? 'border-emerald-500 scale-105 z-10' : 'border-transparent'}`}>
            {plan.isRecommended && <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold absolute -top-4 left-1/2 -translate-x-1/2">RECOMENDADO</span>}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="mb-6"><span className="text-4xl font-bold text-gray-900">R$ {(plan.priceCents / 100).toFixed(2)}</span><span className="text-gray-500">/{plan.interval === 'monthly' ? 'mês' : 'ano'}</span></div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature: string, fIndex: number) => (
                <li key={fIndex} className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="h-5 w-5 text-emerald-500" />{feature}</li>
              ))}
            </ul>
            <button onClick={() => { setSelectedPlan(plan); setShowPaymentModal(true); }} className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.isRecommended ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>Assinar Agora</button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const AboutSection: React.FC<SectionProps> = ({ BUSINESS_CONFIG }) => (
  <section id="about-section" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">Sobre o {BUSINESS_CONFIG.COMPANY.BRAND}</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Transformando a gestão financeira de pequenas e médias empresas</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="bg-emerald-50 p-8 rounded-2xl">
            <Info className="w-12 h-12 text-emerald-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
            <p className="text-gray-700">Democratizar o acesso a ferramentas profissionais de gestão financeira.</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-2xl">
            <Target className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Nossa Visão</h3>
            <p className="text-gray-700">Ser referência nacional em sistemas de gestão financeira.</p>
          </div>
        </div>
        <div className="space-y-6">
          {[
            { icon: TrendingUp, title: "Inovação Constante", color: "emerald" },
            { icon: Shield, title: "Segurança Total", color: "blue" },
            { icon: Users, title: "Suporte Especializado", color: "purple" },
            { icon: Zap, title: "Simplicidade", color: "orange" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-${item.color}-100 rounded-lg flex items-center justify-center`}><item.icon className={`text-${item.color}-600`} /></div>
              <h4 className="text-lg font-semibold">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const ContactSection: React.FC<SectionProps & { contactFormData: any, contactFormErrors: any, isSubmittingContact: boolean, handleContactSubmit: (e: any) => void, setContactFormData: (data: any) => void, setContactFormTouched: (touched: any) => void }> = ({
  contactFormData, contactFormErrors, isSubmittingContact, handleContactSubmit, setContactFormData, setContactFormTouched
}) => (
  <section id="contact-section" className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
        <p className="text-xl text-gray-600">Estamos aqui para ajudar você</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4"><Mail className="text-emerald-600" /><span>contato@ploutosledger.com</span></div>
          <div className="flex items-center gap-4"><Phone className="text-blue-600" /><span>(11) 98480-1839</span></div>
          <div className="flex items-center gap-4"><MapPin className="text-purple-600" /><span>São Paulo, SP - Brasil</span></div>
        </div>
        <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
          <input 
            type="text" placeholder="Seu Nome" className="w-full p-3 border rounded-lg" 
            value={contactFormData.name} onChange={e => setContactFormData({...contactFormData, name: e.target.value})}
            onBlur={() => setContactFormTouched(prev => ({...prev, name: true}))}
          />
          {contactFormErrors.name && <p className="text-red-500 text-xs">{contactFormErrors.name}</p>}
          <input 
            type="email" placeholder="Seu E-mail" className="w-full p-3 border rounded-lg" 
            value={contactFormData.email} onChange={e => setContactFormData({...contactFormData, email: e.target.value})}
            onBlur={() => setContactFormTouched(prev => ({...prev, email: true}))}
          />
          {contactFormErrors.email && <p className="text-red-500 text-xs">{contactFormErrors.email}</p>}
          <textarea 
            placeholder="Sua Mensagem" className="w-full p-3 border rounded-lg h-32" 
            value={contactFormData.message} onChange={e => setContactFormData({...contactFormData, message: e.target.value})}
            onBlur={() => setContactFormTouched(prev => ({...prev, message: true}))}
          />
          {contactFormErrors.message && <p className="text-red-500 text-xs">{contactFormErrors.message}</p>}
          <button type="submit" disabled={isSubmittingContact} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
            {isSubmittingContact ? 'Enviando...' : <><Send className="w-4 h-4" /> Enviar Mensagem</>}
          </button>
        </form>
      </div>
    </div>
  </section>
);
