import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Filter, 
  CalendarDays, 
  Truck,
  Package,
  Users,
  LogOut, 
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isWhatsAppConnected?: boolean;
  whatsappPhone?: string;
  unreadWhatsAppCount?: number;
  onOpenWhatsAppModal?: () => void;
  activeFunnelType?: 'leads' | 'pedidos';
  onFunnelTypeChange?: (type: 'leads' | 'pedidos') => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  isWhatsAppConnected = true,
  whatsappPhone = '(11) 96620-0052',
  unreadWhatsAppCount = 2,
  onOpenWhatsAppModal,
  activeFunnelType = 'leads',
  onFunnelTypeChange
}) => {
  const { user, logout, loginAs, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    kanban: { 
      title: activeFunnelType === 'pedidos' ? 'Funil de Pedidos & Operação' : 'Funil de Leads Comerciais', 
      subtitle: activeFunnelType === 'pedidos' 
        ? 'Acompanhamento de fabricação, coletas e instalações na fábrica' 
        : 'Gestão de orçamentos, cotações e propostas com Norlando & Igor' 
    },
    whatsapp: { title: 'WhatsApp Comercial Robusty', subtitle: 'Atendimento direto ao cliente e envio de orçamentos' },
    agenda: { title: 'Agenda de Instalações & Coletas', subtitle: 'Agendamentos na loja (Av. Aricanduva) e coletas de transportadora' },
    empreendimentos: { title: 'Catálogo de Bagageiros (Fev/2026)', subtitle: 'Modelos oficiais para Kombi, Kangoo, Fiorino, Doblo, Jumpy, Ducato e Saveiro' },
    usuarios: { title: 'Equipe Operacional Robusty', subtitle: 'Responsabilidades: Norlando (Comercial), Igor (Gestão & NF) e Loja (Fábrica)' },
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Robusty CRM', subtitle: 'Painel Comercial & Operacional' };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      
      {/* ======================================================== */}
      {/* 1. DESKTOP SIDEBAR (MENU LATERAL)                        */}
      {/* ======================================================== */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-slate-200/90 shadow-2xs z-30 transition-all duration-300 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand / Logo Section */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
          <button 
            onClick={() => onTabChange('kanban')} 
            className="flex items-center gap-2.5 focus:outline-none cursor-pointer overflow-hidden"
          >
            <div className="h-9 w-9 rounded-xl bg-slate-900 border-b-2 border-brand-500 flex items-center justify-center font-heading font-extrabold text-white text-base shadow-xs flex-shrink-0">
              R
            </div>
            {!isCollapsed && (
              <div className="text-left">
                <p className="font-heading font-extrabold text-sm text-slate-900 leading-none tracking-tight">
                  ROBUSTY
                </p>
                <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-orange-100 text-brand-700 border border-orange-200">
                  CRM Bagageiros
                </span>
              </div>
            )}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto overflow-x-hidden">
          
          {/* Group 1: Gestão de Vendas & Operação */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-heading">
                Funis de Negócio
              </p>
            )}

            {/* Funil de Leads */}
            <button
              onClick={() => {
                if (onFunnelTypeChange) onFunnelTypeChange('leads');
                onTabChange('kanban');
              }}
              title={isCollapsed ? 'Funil de Leads (Comercial)' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'kanban' && activeFunnelType === 'leads'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Filter className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>1. Funil de Leads</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10">Norlando</span>
                </div>
              )}
            </button>

            {/* Funil de Pedidos & Operação */}
            <button
              onClick={() => {
                if (onFunnelTypeChange) onFunnelTypeChange('pedidos');
                onTabChange('kanban');
              }}
              title={isCollapsed ? 'Funil de Pedidos (Fábrica & Loja)' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'kanban' && activeFunnelType === 'pedidos'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Truck className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>2. Funil de Pedidos</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">Loja/Igor</span>
                </div>
              )}
            </button>
          </div>

          {/* Group 2: Ferramentas do Dia a Dia */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-heading">
                Operação & Vendas
              </p>
            )}

            {/* Catálogo de Bagageiros */}
            <button
              onClick={() => onTabChange('empreendimentos')}
              title={isCollapsed ? 'Catálogo de Bagageiros' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'empreendimentos'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Package className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>Catálogo Fev/2026</span>}
            </button>

            {/* Agenda de Instalações */}
            <button
              onClick={() => onTabChange('agenda')}
              title={isCollapsed ? 'Agenda de Instalações' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'agenda'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <CalendarDays className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>Agenda Instalações</span>}
            </button>

            {/* WhatsApp Inbox */}
            <button
              onClick={() => onTabChange('whatsapp')}
              title={isCollapsed ? `WhatsApp Inbox (${unreadWhatsAppCount} não lidas)` : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === 'whatsapp'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>WhatsApp Robusty</span>}
              {unreadWhatsAppCount > 0 && (
                !isCollapsed ? (
                  <span className={`ml-auto text-[10px] font-extrabold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-2xs ${
                    activeTab === 'whatsapp'
                      ? 'bg-white text-brand-600'
                      : 'bg-emerald-500 text-white'
                  }`}>
                    {unreadWhatsAppCount}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-extrabold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-2xs">
                    {unreadWhatsAppCount}
                  </span>
                )
              )}
            </button>
          </div>

          {/* Group 3: Equipe */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-heading">
                Equipe & Papéis
              </p>
            )}

            <button
              onClick={() => onTabChange('usuarios')}
              title={isCollapsed ? 'Equipe Robusty' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'usuarios'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Users className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>Norlando • Igor • Loja</span>}
            </button>
          </div>

        </div>

        {/* Bottom Sidebar: WhatsApp Status & Perfil */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          
          {!isCollapsed ? (
            <div 
              onClick={onOpenWhatsAppModal || (() => onTabChange('whatsapp'))}
              className="p-2.5 rounded-xl border text-xs cursor-pointer transition-all bg-emerald-50/80 border-emerald-200/90 text-emerald-900 hover:bg-emerald-100"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500 animate-pulse" />
                <WhatsAppIcon className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
                <span className="font-semibold truncate">
                  (11) 96620-0052 • Ativo
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenWhatsAppModal || (() => onTabChange('whatsapp'))}
              className="w-full py-2.5 flex items-center justify-center rounded-xl border transition-all cursor-pointer bg-emerald-50 border-emerald-200 text-emerald-700"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
            </button>
          )}

          {/* User Profile Card */}
          <div className={`flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 ${isCollapsed ? 'flex-col gap-2' : ''}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-amber-500 text-white flex items-center justify-center font-heading font-bold text-xs shadow-2xs flex-shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() || 'RO'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
                    {user?.cargo || 'Robusty Bagageiros'}
                  </p>
                </div>
              )}
            </div>
            
            <button 
              onClick={logout}
              title="Sair"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. ÁREA PRINCIPAL DA PÁGINA (HEADER SUPERIOR + CONTEÚDO) */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between z-20 shadow-2xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                {currentTabInfo.title}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                {currentTabInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Troca Rápida de Usuário no Header */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 hidden lg:inline">Acessando como:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button 
                onClick={() => loginAs('comercial')}
                className={`px-2.5 py-1 rounded-md transition-all ${user?.role === 'comercial' ? 'bg-brand-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🟠 Norlando
              </button>
              <button 
                onClick={() => loginAs('gestao')}
                className={`px-2.5 py-1 rounded-md transition-all ${user?.role === 'gestao' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🔵 Igor
              </button>
              <button 
                onClick={() => loginAs('loja')}
                className={`px-2.5 py-1 rounded-md transition-all ${user?.role === 'loja' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🟣 Loja
              </button>
            </div>
          </div>

        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50">
          {children}
        </div>

      </div>

    </div>
  );
};
