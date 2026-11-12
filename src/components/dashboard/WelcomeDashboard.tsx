import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Filter, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Truck,
  Package,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { currencyFormatter } from '../../utils/currencyFormatter';

interface WelcomeDashboardProps {
  onGoToKanban: (funnel?: 'leads' | 'pedidos') => void;
  onGoToAgenda: () => void;
  onGoToWhatsApp: () => void;
  unreadWhatsAppCount?: number;
  totalLeads?: number;
  totalPedidos?: number;
  totalVendasMes?: number;
}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({ 
  onGoToKanban, 
  onGoToAgenda, 
  onGoToWhatsApp,
  unreadWhatsAppCount = 2,
  totalLeads = 4,
  totalPedidos = 2,
  totalVendasMes = 35800.00
}) => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(#ff6701_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Robusty CRM • Catálogo Fev/2026 Integrado</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Olá, {user?.name}! Bem-vindo ao CRM Robusty.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Gestão integrada de vendas de bagageiros automotivos para Kombi, Kangoo, Fiorino, Doblo, Jumpy, Ducato e Saveiro. Conectando Norlando (Comercial), Igor (Cotações, Pagamentos & NF) e Loja (Fábrica e Instalação).
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onGoToKanban('leads')}
              className="py-2.5 px-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>1. Funil de Leads (Norlando)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onGoToKanban('pedidos')}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4 text-purple-400" />
              <span>2. Funil de Pedidos (Loja & Igor)</span>
            </button>

            <button
              onClick={onGoToWhatsApp}
              className="py-2.5 px-4 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Robusty</span>
              {unreadWhatsAppCount > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {unreadWhatsAppCount} novas
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Leads no Funil Comercial</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-brand-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
          <p className="text-[11px] text-brand-600 font-medium flex items-center gap-1">
            <span>Comercial • Norlando</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pedidos em Fabricação / Coleta</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalPedidos}</p>
          <p className="text-[11px] text-purple-600 font-medium flex items-center gap-1">
            <span>Loja & Igor</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Instalações na Fábrica</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">3 agendadas</p>
          <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
            <span>Av. Aricanduva, 5.541</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Vendas Realizadas (Mês)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{currencyFormatter(totalVendasMes)}</p>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fevereiro 2026</span>
          </p>
        </div>

      </div>

    </div>
  );
};
