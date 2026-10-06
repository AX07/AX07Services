import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Linkedin, 
  Github, 
  ArrowUpRight, 
  ShieldCheck, 
  FileText, 
  Cookie, 
  Mail, 
  MessageSquare, 
  X, 
  Sparkles, 
  MapPin, 
  Check,
  Globe
} from 'lucide-react';
import { useApp } from '../context/ThemeLanguageContext';
import { appleGestures, appleSprings } from '../lib/design-system';
import { BrandLogo } from './BrandLogo';

type PolicyType = 'cookies' | 'terms' | 'privacy' | 'contact' | null;

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.053 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

export function Footer() {
  const { t, lang } = useApp();
  const [activeModal, setActiveModal] = useState<PolicyType>(null);

  const isPt = lang === 'pt';
  const whatsappNumber = '353894419127';

  const handleNavClick = (e: React.MouseEvent, targetIdOrPath: string) => {
    if (targetIdOrPath.startsWith('#')) {
      const elId = targetIdOrPath.substring(1);
      const el = document.getElementById(elId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // If navigating to page routes like /about or /work
    if (targetIdOrPath.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', targetIdOrPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const navLinks = [
    { label: isPt ? 'Projetos Selecionados' : 'Selected Works', target: '#project-showcase' },
    { label: isPt ? 'O Nosso Processo' : 'Our Process', target: '#process' },
    { label: isPt ? 'Tabela de Preços' : 'Transparent Pricing', target: '#pricing' },
    { label: isPt ? 'Perguntas Frequentes' : 'FAQ', target: '#faq' },
    { label: isPt ? 'Sobre o Estúdio' : 'About Studio', target: isPt ? '/pt/about' : '/ie/about' },
    { label: isPt ? 'Painel Admin' : 'Admin Management', target: '/admin' },
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      handle: 'Alex Pinto Smollahan',
      subtext: isPt ? 'Rede Profissional & Fundador' : 'Professional Profile & Updates',
      href: 'https://www.linkedin.com/in/alexpintosmollahan/',
      icon: <Linkedin className="w-4 h-4 text-blue-500" />,
    },
    {
      name: 'Google',
      handle: 'Google Business Profile',
      subtext: isPt ? 'Avaliações Verificadas & Localização' : 'Verified Reviews & Search Presence',
      href: 'https://share.google/1em5V7FtwTtUx9awY',
      icon: <GoogleIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />,
    },
    {
      name: 'GitHub',
      handle: 'AX07',
      subtext: isPt ? 'Repositórios & Shaders WebGL' : 'Open Shaders & WebGL Repos',
      href: 'https://github.com/AX07',
      icon: <Github className="w-4 h-4 text-zinc-800 dark:text-white" />,
    },
  ];

  return (
    <footer className="relative z-20 border-t border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Subtle top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 dark:via-emerald-400/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-14 border-b border-zinc-200 dark:border-white/10">
          
          {/* Column 1: Brand & Identity (Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BrandLogo imgClassName="w-8 h-8 object-contain" className="flex items-center" />
                <span className="text-2xl font-bold font-display tracking-tight text-zinc-950 dark:text-white">
                  ax07.dev
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-white/40">
                  {t.footer.brandSub || 'High-Motion Spec Studio'}
                </span>
              </div>

              <p className="text-sm text-zinc-600 dark:text-white/60 font-sans leading-relaxed max-w-sm mb-6">
                {isPt
                  ? 'Estúdio criativo especializado em experiências web 3D imersivas, carregamento edge ultrarrápido na Vercel e conversão direta por WhatsApp.'
                  : 'Bespoke high-converting 3D web systems, sub-second Vercel edge deployment, and direct WhatsApp booking engines engineered for modern businesses.'}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-white/50">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{isPt ? 'Tavira, Algarve (PT) · Dublin (IE)' : 'Tavira, Algarve (PT) · Dublin (IE)'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-white/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{t.footer.edgeStatus || 'Vercel Edge Active · 100% Uptime'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links (Span 2) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-white/40 mb-4 font-semibold">
              {isPt ? 'Navegação' : 'Navigation'}
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              {navLinks.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.target}
                    onClick={(e) => handleNavClick(e, item.target)}
                    className="text-zinc-600 dark:text-white/70 hover:text-zinc-950 dark:hover:text-white transition-colors inline-flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-emerald-500 transition-colors" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Direct Desk (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-white/40 mb-4 font-semibold">
              {isPt ? 'Contacto Direto' : 'Contact Desk'}
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    isPt ? 'Olá AX07, gostaria de pedir informações sobre o protótipo 3D.' : 'Hello AX07, I would like to chat about a 3D spec build.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-700 dark:text-white/80 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500 stroke-[1.75]" />
                  <span>WhatsApp 24/7</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:ax07.dev@gmail.com"
                  className="text-zinc-700 dark:text-white/80 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-2 group cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-zinc-400 dark:text-white/50 stroke-[1.75]" />
                  <span>ax07.dev@gmail.com</span>
                </a>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveModal('contact')}
                  className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {isPt ? 'Ver Horário e SLA →' : 'View Desk SLA →'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Links (Only LinkedIn, Google, GitHub) (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-white/40 mb-4 font-semibold">
              {isPt ? 'Perfis & Redes' : 'Social & Profiles'}
            </h4>
            <div className="space-y-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.07] hover:border-zinc-300 dark:hover:border-white/20 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center border border-zinc-200 dark:border-white/10 group-hover:scale-105 transition-transform">
                      {social.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-display text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <span>{social.name}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-white/40 font-mono">
                        {social.handle}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 dark:text-white/40 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Tier: Attribution & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          {/* Attribution */}
          <div className="text-zinc-500 dark:text-white/50 text-center sm:text-left">
            <span>© {new Date().getFullYear()} ax07.dev. </span>
            <span className="font-semibold text-zinc-800 dark:text-white/80">Developed by ax07.dev.</span>
            <span className="hidden md:inline"> {isPt ? 'Todos os direitos reservados.' : 'All rights reserved.'}</span>
          </div>

          {/* Legal Policies (Cookies, Terms, Privacy, Contact) */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-zinc-600 dark:text-white/60">
            <button
              type="button"
              onClick={() => setActiveModal('cookies')}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {isPt ? 'Política de Cookies' : 'Cookies Policies'}
            </button>
            <span className="text-zinc-300 dark:text-white/20">·</span>
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {isPt ? 'Termos de Serviço' : 'Terms of Service'}
            </button>
            <span className="text-zinc-300 dark:text-white/20">·</span>
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {isPt ? 'Privacidade' : 'Privacy'}
            </button>
            <span className="text-zinc-300 dark:text-white/20">·</span>
            <button
              type="button"
              onClick={() => setActiveModal('contact')}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {isPt ? 'Contacto' : 'Contact'}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Apple-Style Glass Policy Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-text">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={appleSprings.snappy}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/15 rounded-[32px] p-6 sm:p-10 text-zinc-900 dark:text-white shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col justify-between overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-white/70 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4 stroke-[1.75]" />
              </button>

              {/* Modal Content Switcher */}
              <div className="overflow-y-auto pr-2 space-y-5 flex-1">
                {activeModal === 'cookies' && (
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3 border border-amber-500/20">
                      <Cookie className="w-3.5 h-3.5 stroke-[1.75]" />
                      <span>{isPt ? 'POLÍTICA DE COOKIES' : 'COOKIES POLICY'}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-3">
                      {isPt ? 'Como Utilizamos os Cookies' : 'Cookie & Storage Policy'}
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-white/40 mb-4">
                      {isPt ? 'Última atualização: Setembro de 2026' : 'Last updated: September 2026'}
                    </p>

                    <div className="space-y-4 text-sm text-zinc-600 dark:text-white/70 font-sans leading-relaxed">
                      <p>
                        {isPt
                          ? 'A ax07.dev compromete-se com a máxima privacidade e respeito digital. Não utilizamos cookies invasivos de rastreamento de terceiros nem vendemos os seus dados de navegação a anunciantes.'
                          : 'ax07.dev adheres to strict European ePrivacy and GDPR standards. We do not employ intrusive third-party cross-site advertising trackers or data-broker cookies.'}
                      </p>
                      <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-2">
                        <h4 className="text-xs font-mono uppercase font-bold text-zinc-900 dark:text-white">
                          {isPt ? 'Cookies Estritamente Necessários' : 'Essential Functional Storage'}
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600 dark:text-white/60">
                          <li><strong>ax07_lang</strong>: {isPt ? 'Memoriza o idioma preferido (Português ou Inglês).' : 'Remembers your language choice (EN / PT).'}</li>
                          <li><strong>ax07_theme</strong>: {isPt ? 'Memoriza o modo claro ou escuro do utilizador.' : 'Stores your active light/dark color scheme.'}</li>
                          <li><strong>WebGL Context</strong>: {isPt ? 'Cache de renderização 3D para GPU suave.' : 'Local 3D asset caching to ensure 60fps rendering.'}</li>
                        </ul>
                      </div>
                      <p>
                        {isPt
                          ? 'Pode desativar ou apagar cookies a qualquer momento através das definições do seu navegador (Safari, Chrome, Firefox). O site continuará a funcionar plenamente.'
                          : 'You can disable or delete storage items anytime via your browser settings. The website will continue to function seamlessly.'}
                      </p>
                    </div>
                  </div>
                )}

                {activeModal === 'terms' && (
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3 border border-blue-500/20">
                      <FileText className="w-3.5 h-3.5 stroke-[1.75]" />
                      <span>{isPt ? 'TERMOS DE SERVIÇO' : 'TERMS OF SERVICE'}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-3">
                      {isPt ? 'Termos e Condições do Serviço' : 'Terms of Service & Spec Guarantee'}
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-white/40 mb-4">
                      {isPt ? 'Protocolo ax07.dev 48h // Sem Depósito' : 'ax07.dev Protocol // Zero-Deposit Delivery'}
                    </p>

                    <div className="space-y-4 text-sm text-zinc-600 dark:text-white/70 font-sans leading-relaxed">
                      <p>
                        {isPt
                          ? '1. <strong>Protocolo de Amostra em 48 Horas:</strong> Construímos o protótipo 3D completo sem qualquer adiantamento ou depósito. Se o cliente não aprovar a versão de teste no seu telemóvel, encerra-se o processo sem qualquer cobrança.'
                          : '1. <strong>Zero-Deposit Staging Protocol:</strong> We design and build the complete 3D interactive staging version upfront. If you do not approve the staging link on your phone, you walk away paying €0.'}
                      </p>
                      <p>
                        {isPt
                          ? '2. <strong>Propriedade Integral:</strong> Após o pagamento da taxa acordada, o cliente detém 100% dos direitos de código, domínio, conteúdos e ficheiros fonte. Sem contratos de fidelização obrigatória.'
                          : '2. <strong>100% Asset Ownership:</strong> Once approved and invoiced, the client retains 100% intellectual property ownership of source code, domains, and brand assets with zero vendor lock-in.'}
                      </p>
                      <p>
                        {isPt
                          ? '3. <strong>Alojamento Edge & Suporte:</strong> A subscrição mensal cobre alojamento global de alta velocidade na Vercel Edge, certificados SSL automáticos, monitorização 24/7 e atualizações contínuas de conteúdos.'
                          : '3. <strong>Edge Operations & Maintenance:</strong> The monthly fee covers high-speed Vercel global CDN distribution, automated SSL certificates, 24/7 uptime monitoring, and continuous content updates.'}
                      </p>
                    </div>
                  </div>
                )}

                {activeModal === 'privacy' && (
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5 stroke-[1.75]" />
                      <span>{isPt ? 'POLÍTICA DE PRIVACIDADE' : 'PRIVACY POLICY'}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-3">
                      {isPt ? 'Privacidade e Proteção de Dados' : 'Privacy & Data Protection (GDPR)'}
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-white/40 mb-4">
                      {isPt ? 'Conformidade RGPD // União Europeia' : 'EU GDPR & Data Minimization Standard'}
                    </p>

                    <div className="space-y-4 text-sm text-zinc-600 dark:text-white/70 font-sans leading-relaxed">
                      <p>
                        {isPt
                          ? 'A ax07.dev cumpre integralmente o Regulamento Geral sobre a Proteção de Dados (RGPD). Recolhemos apenas os dados estritamente necessários para desenvolver a sua solução digital (ex: nome, link do negócio e número de WhatsApp para contacto direto).'
                          : 'ax07.dev complies strictly with the General Data Protection Regulation (GDPR). We collect only necessary contact details to build your private 3D preview and coordinate project specifications.'}
                      </p>
                      <p>
                        {isPt
                          ? 'Nunca partilhamos, vendemos ou transferimos os seus dados para listas de marketing ou intermediários de publicidade.'
                          : 'We never sell, rent, or transfer your contact information to third-party advertisers or telemarketers.'}
                      </p>
                      <p>
                        {isPt
                          ? 'Para solicitar a eliminação ou consulta dos seus dados, envie um email para <strong>ax07.dev@gmail.com</strong>.'
                          : 'To exercise your rights to review, modify, or permanently erase your data, contact our lead engineer directly at <strong>ax07.dev@gmail.com</strong>.'}
                      </p>
                    </div>
                  </div>
                )}

                {activeModal === 'contact' && (
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3 border border-emerald-500/20">
                      <MessageSquare className="w-3.5 h-3.5 stroke-[1.75]" />
                      <span>{isPt ? 'CONTACTO DIRETO' : 'DIRECT CONTACT DESK'}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-3">
                      {isPt ? 'Fale com o Engenheiro Criativo' : 'Direct Engineering Line'}
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-white/40 mb-4">
                      {isPt ? 'Sem intermediários nem formulários lentos' : 'No sales reps, ticketing queues, or bots'}
                    </p>

                    <div className="space-y-4 text-sm text-zinc-600 dark:text-white/70 font-sans leading-relaxed">
                      <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-zinc-500 dark:text-white/40">{isPt ? 'Canal Principal' : 'Primary Channel'}</span>
                          <span className="text-xs font-mono text-emerald-500 font-semibold">{isPt ? 'Resposta em < 2h' : 'SLA < 2h'}</span>
                        </div>
                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                            isPt ? 'Olá AX07, gostaria de falar sobre o desenvolvimento de um site 3D.' : 'Hello AX07, I would like to discuss building a 3D website.'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{isPt ? 'Abrir Chat no WhatsApp' : 'Open WhatsApp Desk'}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>

                      <div className="space-y-2 text-xs font-mono text-zinc-600 dark:text-white/60">
                        <p><strong>Email:</strong> ax07.dev@gmail.com</p>
                        <p><strong>{isPt ? 'Localizações' : 'Locations'}:</strong> Tavira, Algarve (PT) &amp; Dublin (IE)</p>
                        <p><strong>{isPt ? 'Horário de Suporte' : 'Hours'}:</strong> 08:00 - 20:00 WET / GMT</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Action */}
              <div className="pt-6 border-t border-zinc-200 dark:border-white/10 flex items-center justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {isPt ? 'Entendido' : 'Understood'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}

export default Footer;
