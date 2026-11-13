import React, { useState, useEffect } from 'react';
import { Visit, Lead } from '../../types';
import { Empreendimento } from '../../services/empreendimentosService';
import { visitsService } from '../../services/visitsService';
import { ScheduleVisitModal } from './ScheduleVisitModal';
import { RescheduleVisitModal } from './RescheduleVisitModal';
import { 
  Clock, 
  MapPin, 
  Plus, 
  Search, 
  RotateCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  CalendarDays,
  Calendar,
  Check,
  Wrench,
  Car
} from 'lucide-react';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';

interface AgendaViewProps {
  leads: Lead[];
  empreendimentos: Empreendimento[];
  onSelectLead?: (lead: Lead) => void;
  onLeadStatusChanged?: () => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  leads,
  empreendimentos,
  onSelectLead,
  onLeadStatusChanged
}) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterEmp, setSelectedFilterEmp] = useState('all');
  const [activeTab, setActiveTab] = useState<'proximas' | 'aguardando_baixa' | 'realizadas' | 'nao_compareceu' | 'todas'>('proximas');

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [rescheduleTargetVisit, setRescheduleTargetVisit] = useState<Visit | null>(null);

  const loadVisits = async () => {
    setIsLoading(true);
    try {
      const data = await visitsService.getVisits();
      setVisits(data);
    } catch (err) {
      console.error('Falha ao carregar instalações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const now = new Date();

  // Categorização das instalações
  const proximasInstalacoes = visits.filter(v => v.realizada === null && new Date(v.dataHora) >= now);
  const instalacoesPendentes = visits.filter(v => v.realizada === null && new Date(v.dataHora) < now);
  const instalacoesConcluidas = visits.filter(v => v.realizada === true);
  const instalacoesCanceladas = visits.filter(v => v.realizada === false);

  // Filtragem conforme aba e busca
  const getFilteredVisits = () => {
    let list: Visit[] = [];
    if (activeTab === 'proximas') list = proximasInstalacoes;
    else if (activeTab === 'aguardando_baixa') list = instalacoesPendentes;
    else if (activeTab === 'realizadas') list = instalacoesConcluidas;
    else if (activeTab === 'nao_compareceu') list = instalacoesCanceladas;
    else list = visits;

    return list.filter(v => {
      const matchesSearch = 
        (v.leadNome && v.leadNome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.leadTelefone && v.leadTelefone.includes(searchTerm)) ||
        (v.empreendimentoNome && v.empreendimentoNome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.enderecoPlantao && v.enderecoPlantao.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesEmp = selectedFilterEmp === 'all' || v.empreendimentoNome === selectedFilterEmp;

      return matchesSearch && matchesEmp;
    });
  };

  const filteredVisits = getFilteredVisits();

  // Marcar instalação como concluída
  const handleMarkRealizada = async (visit: Visit) => {
    try {
      await visitsService.updateVisitOutcome(visit.id, true);
      await loadVisits();
      if (onLeadStatusChanged) onLeadStatusChanged();
    } catch (err) {
      console.error('Erro ao marcar instalação como concluída:', err);
      alert('Erro ao atualizar status da instalação.');
    }
  };

  // Abrir WhatsApp com mensagem oficial de confirmação na fábrica
  const handleOpenWhatsApp = (visit: Visit) => {
    const visitDate = new Date(visit.dataHora);
    const dataFmt = visitDate.toLocaleDateString('pt-BR');
    const horaFmt = visitDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const msg = `Olá, ${visit.leadNome}! Tudo bem? Aqui é da Robusty Bagageiros Automotivos.\n\nConfirmamos o agendamento da instalação do seu bagageiro:\n📅 Data: ${dataFmt} às ${horaFmt}\n📍 Local: Av. Aricanduva, 5.541 - Vila Aricanduva, São Paulo - SP\n🚗 Modelo: ${visit.empreendimentoNome}\n\nQualquer dúvida estamos à disposição!`;
    
    const cleanPhone = (visit.leadTelefone || '').replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6 select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-brand-600 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-slate-900 tracking-tight">Agenda de Instalações</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Acompanhe as próximas instalações, instalações concluídas, pendentes e canceladas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadVisits}
            title="Atualizar agenda"
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-brand-600 rounded-2xl hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-600' : ''}`} />
          </button>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agendar Nova Instalação</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas Operacionais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* 1. Próximas Instalações */}
        <div 
          onClick={() => setActiveTab('proximas')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'proximas'
              ? 'bg-orange-50/70 border-brand-300 ring-2 ring-brand-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-brand-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Próximas Instalações</span>
            <span className="p-2 rounded-xl bg-orange-100 text-brand-700">
              <CalendarDays className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{proximasInstalacoes.length}</p>
          <span className="text-[10px] text-brand-700 font-semibold">Agendadas na fábrica</span>
        </div>

        {/* 2. Instalações Pendentes (Atenção) */}
        <div 
          onClick={() => setActiveTab('aguardando_baixa')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'aguardando_baixa'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-200 shadow-2xs'
          }`}
        >
          {instalacoesPendentes.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Instalações Pendentes</span>
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{instalacoesPendentes.length}</p>
          <span className={`text-[10px] font-semibold ${instalacoesPendentes.length > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
            {instalacoesPendentes.length > 0 ? '⚠️ Horário expirou! Dar baixa' : 'Tudo em dia'}
          </span>
        </div>

        {/* 3. Instalações Concluídas */}
        <div 
          onClick={() => setActiveTab('realizadas')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'realizadas'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Instalações Concluídas</span>
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{instalacoesConcluidas.length}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">Veículos liberados</span>
        </div>

        {/* 4. Canceladas / Não Compareceu */}
        <div 
          onClick={() => setActiveTab('nao_compareceu')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'nao_compareceu'
              ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-rose-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Canceladas / Faltou</span>
            <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{instalacoesCanceladas.length}</p>
          <span className="text-[10px] text-rose-700 font-semibold">Reagendar atendimento</span>
        </div>

      </div>

      {/* Abas e Filtros de Pesquisa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Abas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('proximas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'proximas'
                ? 'bg-brand-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Próximas ({proximasInstalacoes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('aguardando_baixa')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'aguardando_baixa'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>⏳ Pendentes ({instalacoesPendentes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('realizadas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'realizadas'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ✅ Concluídas ({instalacoesConcluidas.length})
          </button>

          <button
            onClick={() => setActiveTab('nao_compareceu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'nao_compareceu'
                ? 'bg-rose-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ❌ Canceladas ({instalacoesCanceladas.length})
          </button>

          <button
            onClick={() => setActiveTab('todas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'todas'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas ({visits.length})
          </button>
        </div>

        {/* Busca & Filtro de Modelo */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente, veículo ou modelo..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-800"
            />
          </div>

          <div className="relative">
            <select
              value={selectedFilterEmp}
              onChange={(e) => setSelectedFilterEmp(e.target.value)}
              className="pl-2.5 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700 cursor-pointer font-medium"
            >
              <option value="all">Todos os Modelos</option>
              {empreendimentos.map(emp => (
                <option key={emp.id} value={emp.nome}>{emp.nome}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Lista de Instalações */}
      <div className="space-y-3.5">
        {isLoading ? (
          <div className="space-y-3.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200/90 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse shadow-2xs">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 flex-shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-44" />
                    <div className="h-3 bg-slate-100 rounded w-64" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredVisits.map(visit => {
              const visitDate = new Date(visit.dataHora);
              const isPast = visitDate < now;
              const isPendingOutcome = visit.realizada === null && isPast;
              const leadObj = leads.find(l => l.id === visit.leadId);

              return (
                <div
                  key={visit.id}
                  className={`bg-white rounded-3xl border transition-all shadow-2xs hover:shadow-md p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isPendingOutcome
                      ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/20'
                      : visit.realizada === true
                      ? 'border-emerald-200/80'
                      : visit.realizada === false
                      ? 'border-rose-200/80 bg-rose-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Bloco de Data e Hora */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-center shadow-xs ${
                      visit.realizada === true
                        ? 'bg-emerald-500 text-white'
                        : visit.realizada === false
                        ? 'bg-rose-500 text-white'
                        : isPendingOutcome
                        ? 'bg-amber-500 text-white'
                        : 'bg-brand-500 text-white'
                    }`}>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">
                        {visitDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                      </span>
                      <span className="text-xl font-black leading-none my-0.5">
                        {visitDate.getDate()}
                      </span>
                      <span className="text-[10px] font-semibold opacity-90">
                        {visitDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Detalhes da Instalação */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {visit.realizada === true && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Instalação Concluída
                          </span>
                        )}
                        {visit.realizada === false && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Cancelada / Não Compareceu
                          </span>
                        )}
                        {visit.realizada === null && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                            isPendingOutcome
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-orange-100 text-brand-800 border-orange-200'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {isPendingOutcome ? 'Aguardando Baixa' : 'Instalação Agendada'}
                          </span>
                        )}

                        <span className="text-xs text-slate-400">
                          {visitDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <h3 
                          onClick={() => leadObj && onSelectLead && onSelectLead(leadObj)}
                          className={`text-sm font-bold text-slate-900 ${leadObj && onSelectLead ? 'hover:text-brand-600 cursor-pointer underline-offset-2 hover:underline' : ''}`}
                        >
                          {visit.leadNome}
                        </h3>
                        {visit.leadTelefone && (
                          <span className="text-xs text-slate-500 font-mono">
                            • {visit.leadTelefone}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap pt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Car className="w-3.5 h-3.5 text-brand-600" />
                          {visit.empreendimentoNome}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {visit.enderecoPlantao || 'Fábrica Robusty: Av. Aricanduva, 5.541 - SP'}
                        </span>
                      </div>

                      {visit.observacoes && (
                        <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          "{visit.observacoes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ações da Instalação */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleOpenWhatsApp(visit)}
                      title="Enviar confirmação de agendamento no WhatsApp"
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Confirmar WhatsApp</span>
                    </button>

                    <button
                      onClick={() => setRescheduleTargetVisit(visit)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3 text-slate-500" />
                      <span>Reagendar</span>
                    </button>

                    {visit.realizada === null && (
                      <button
                        onClick={() => handleMarkRealizada(visit)}
                        title="Marcar instalação como concluída"
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Concluir</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {filteredVisits.length === 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 text-brand-600 flex items-center justify-center mx-auto">
                  <Wrench className="w-8 h-8 text-brand-600" />
                </div>
                <div>
                  <h4 className="text-base font-heading font-extrabold text-slate-800">
                    Nenhuma instalação encontrada nesta categoria
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Agende a instalação dos bagageiros na fábrica (Av. Aricanduva, 5.541 - SP) com seus clientes para organizar a baia de atendimento da Loja.
                  </p>
                </div>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="px-4 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-600 transition-all cursor-pointer"
                >
                  + Agendar Primeira Instalação
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal: Agendar Nova Instalação */}
      {isScheduleModalOpen && (
        <ScheduleVisitModal
          leads={leads}
          empreendimentos={empreendimentos}
          onClose={() => setIsScheduleModalOpen(false)}
          onSuccess={() => {
            loadVisits();
            if (onLeadStatusChanged) onLeadStatusChanged();
          }}
        />
      )}

      {/* Modal: Reagendar / Baixa */}
      {rescheduleTargetVisit && (
        <RescheduleVisitModal
          visit={rescheduleTargetVisit}
          onClose={() => setRescheduleTargetVisit(null)}
          onSuccess={() => {
            loadVisits();
            if (onLeadStatusChanged) onLeadStatusChanged();
          }}
        />
      )}

    </div>
  );
};
