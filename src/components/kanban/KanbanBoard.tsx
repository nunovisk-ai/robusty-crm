import React, { useState } from 'react';
import { Lead, FunnelStage } from '../../types';
import { 
  Search, 
  UserPlus, 
  Package, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  Check,
  Truck,
  Car,
  Filter
} from 'lucide-react';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { currencyFormatter } from '../../utils/currencyFormatter';

interface KanbanBoardProps {
  leads: Lead[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectLead: (lead: Lead) => void;
  onNewLead: () => void;
  onMoveLead: (leadId: string, newStatus: FunnelStage) => void;
  onScheduleVisit?: (lead: Lead) => void;
  onOpenChat?: (leadId: string) => void;
  activeFunnelType: 'leads' | 'pedidos';
  onFunnelTypeChange: (type: 'leads' | 'pedidos') => void;
  onConvertToOrder?: (leadId: string) => void;
}

interface ColumnConfig {
  id: FunnelStage;
  title: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  topBorder: string;
  responsible: 'Norlando' | 'Igor' | 'Loja';
}

// 1. Funil de Leads (10 etapas oficiais da Robusty)
const LEADS_COLUMNS: ColumnConfig[] = [
  { id: 'novo_lead', title: 'Novo Lead', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', dotColor: 'bg-blue-500', topBorder: 'border-t-blue-500', responsible: 'Norlando' },
  { id: 'em_qualificacao', title: 'Em Qualificação', badgeBg: 'bg-cyan-50', badgeText: 'text-cyan-700', dotColor: 'bg-cyan-500', topBorder: 'border-t-cyan-500', responsible: 'Norlando' },
  { id: 'aguardando_atendimento', title: 'Aguard. Atendimento', badgeBg: 'bg-amber-50', badgeText: 'text-amber-700', dotColor: 'bg-amber-500', topBorder: 'border-t-amber-500', responsible: 'Norlando' },
  { id: 'aguardando_cotacao', title: 'Aguard. Cotação (Igor)', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', dotColor: 'bg-blue-600', topBorder: 'border-t-blue-600', responsible: 'Igor' },
  { id: 'preparacao_orcamento', title: 'Prep. Orçamento', badgeBg: 'bg-orange-50', badgeText: 'text-brand-700', dotColor: 'bg-brand-500', topBorder: 'border-t-brand-500', responsible: 'Norlando' },
  { id: 'orcamento_enviado', title: 'Orçamento Enviado', badgeBg: 'bg-indigo-50', badgeText: 'text-indigo-700', dotColor: 'bg-indigo-500', topBorder: 'border-t-indigo-500', responsible: 'Norlando' },
  { id: 'em_negociacao', title: 'Em Negociação', badgeBg: 'bg-purple-50', badgeText: 'text-purple-700', dotColor: 'bg-purple-500', topBorder: 'border-t-purple-500', responsible: 'Norlando' },
  { id: 'aguardando_pagamento', title: 'Aguard. Pagto / Link', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', dotColor: 'bg-blue-600', topBorder: 'border-t-blue-600', responsible: 'Igor' },
  { id: 'venda_ganha', title: 'Venda Ganha', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700', dotColor: 'bg-emerald-500', topBorder: 'border-t-emerald-500', responsible: 'Norlando' },
  { id: 'venda_perdida', title: 'Venda Perdida', badgeBg: 'bg-slate-100', badgeText: 'text-slate-600', dotColor: 'bg-slate-400', topBorder: 'border-t-slate-400', responsible: 'Norlando' }
];

// 2. Funil de Pedidos & Operação (9 etapas oficiais da Robusty)
const PEDIDOS_COLUMNS: ColumnConfig[] = [
  { id: 'pedido_definido', title: 'Pedido Definido', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', dotColor: 'bg-blue-500', topBorder: 'border-t-blue-500', responsible: 'Norlando' },
  { id: 'modalidade_definida', title: 'Modalidade Definida', badgeBg: 'bg-cyan-50', badgeText: 'text-cyan-700', dotColor: 'bg-cyan-500', topBorder: 'border-t-cyan-500', responsible: 'Norlando' },
  { id: 'aguardando_preparacao', title: 'Aguard. Preparação', badgeBg: 'bg-purple-50', badgeText: 'text-purple-700', dotColor: 'bg-purple-500', topBorder: 'border-t-purple-500', responsible: 'Loja' },
  { id: 'em_preparacao', title: 'Em Preparação', badgeBg: 'bg-purple-50', badgeText: 'text-purple-700', dotColor: 'bg-purple-600', topBorder: 'border-t-purple-600', responsible: 'Loja' },
  { id: 'aguardando_entrega_instalacao', title: 'Aguard. Entrega/Instal.', badgeBg: 'bg-sky-50', badgeText: 'text-sky-700', dotColor: 'bg-sky-600', topBorder: 'border-t-sky-600', responsible: 'Igor' },
  { id: 'em_entrega_instalacao', title: 'Em Entrega / Instalação', badgeBg: 'bg-sky-50', badgeText: 'text-sky-700', dotColor: 'bg-sky-600', topBorder: 'border-t-sky-600', responsible: 'Loja' },
  { id: 'aguardando_finalizacao', title: 'Aguard. NF / Conclusão', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', dotColor: 'bg-blue-600', topBorder: 'border-t-blue-600', responsible: 'Igor' },
  { id: 'pedido_concluido', title: 'Pedido Concluído', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700', dotColor: 'bg-emerald-500', topBorder: 'border-t-emerald-500', responsible: 'Igor' },
  { id: 'pedido_cancelado', title: 'Pedido Cancelado', badgeBg: 'bg-slate-100', badgeText: 'text-slate-600', dotColor: 'bg-slate-400', topBorder: 'border-t-slate-400', responsible: 'Igor' }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  isLoading,
  onRefresh,
  onSelectLead,
  onNewLead,
  onMoveLead,
  onScheduleVisit,
  onOpenChat,
  activeFunnelType,
  onFunnelTypeChange,
  onConvertToOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL');
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);

  const columns = activeFunnelType === 'leads' ? LEADS_COLUMNS : PEDIDOS_COLUMNS;

  // Filtragem de itens do funil atual
  const filteredLeads = leads.filter(lead => {
    // 1. Funil Ativo
    const leadFunnel = lead.funilAtual || (lead.id.startsWith('ped') ? 'pedidos' : 'leads');
    if (leadFunnel !== activeFunnelType) return false;

    // 2. Filtro de Responsável
    if (ownerFilter !== 'ALL' && lead.responsavelAtual !== ownerFilter) return false;

    // 3. Filtro de Veículo
    if (vehicleFilter !== 'ALL' && lead.veiculoLinha !== vehicleFilter) return false;

    // 4. Busca por texto
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      lead.nome?.toLowerCase().includes(term) ||
      lead.telefone?.toLowerCase().includes(term) ||
      lead.produtoNome?.toLowerCase().includes(term) ||
      lead.veiculoLinha?.toLowerCase().includes(term) ||
      lead.cidadeUf?.toLowerCase().includes(term)
    );
  });

  const handleDragStart = (leadId: string) => {
    setDraggingLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStage: FunnelStage) => {
    if (draggingLeadId) {
      onMoveLead(draggingLeadId, targetStage);
      setDraggingLeadId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-[calc(100vh-4rem)] select-none">
      
      {/* ======================================================== */}
      {/* 1. BARRA SUPERIOR DE FILTROS E CONTROLES                 */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 space-y-3">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Alternador de Funis (Leads vs Pedidos) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onFunnelTypeChange('leads')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFunnelType === 'leads'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>1. Funil de Leads (Comercial)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeFunnelType === 'leads' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {leads.filter(l => (l.funilAtual || 'leads') === 'leads').length}
              </span>
            </button>

            <button
              onClick={() => onFunnelTypeChange('pedidos')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFunnelType === 'pedidos'
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>2. Funil de Pedidos (Loja & Logística)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeFunnelType === 'pedidos' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {leads.filter(l => (l.funilAtual || 'leads') === 'pedidos').length}
              </span>
            </button>
          </div>

          {/* Botão Novo Lead / Pedido */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
              title="Atualizar dados"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-500' : ''}`} />
            </button>

            <button
              onClick={onNewLead}
              className="py-2 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{activeFunnelType === 'pedidos' ? '+ Novo Pedido' : '+ Novo Lead'}</span>
            </button>
          </div>

        </div>

        {/* Linha 2: Busca e Filtros Rápidos */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          
          {/* Busca por Texto */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente, telefone, cidade..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
            />
          </div>

          {/* Filtro por Responsável (Norlando / Igor / Loja) */}
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:bg-white focus:border-brand-500 focus:outline-none font-medium"
          >
            <option value="ALL">👥 Todos os Responsáveis</option>
            <option value="Norlando">🟠 Norlando (Comercial)</option>
            <option value="Igor">🔵 Igor (Cotação / NF / Logística)</option>
            <option value="Loja">🟣 Loja (Preparação & Instalação)</option>
          </select>

          {/* Filtro por Veículo */}
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:bg-white focus:border-brand-500 focus:outline-none font-medium"
          >
            <option value="ALL">🚗 Todas as Linhas de Veículos</option>
            <option value="Kombi">VW Kombi</option>
            <option value="Kangoo">Renault Kangoo</option>
            <option value="Fiorino">Fiat Fiorino</option>
            <option value="Doblo">Fiat Doblo</option>
            <option value="Jumpy/Expert/Scudo">Jumpy / Expert / Scudo</option>
            <option value="Ducato">Fiat Ducato</option>
            <option value="Saveiro">VW Saveiro</option>
            <option value="Decks & Acessórios">Decks & Acessórios</option>
          </select>

          {/* Indicador de Responsabilidade */}
          <div className="ml-auto text-[11px] text-slate-500 hidden xl:flex items-center gap-3 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/60">
            <span className="flex items-center gap-1 font-semibold text-brand-700"><span className="w-2 h-2 rounded-full bg-brand-500"></span> Norlando (Comercial)</span>
            <span className="flex items-center gap-1 font-semibold text-blue-700"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Igor (Gestão & NF)</span>
            <span className="flex items-center gap-1 font-semibold text-purple-700"><span className="w-2 h-2 rounded-full bg-purple-600"></span> Loja (Instalação)</span>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. ÁREA DAS COLUNAS DO KANBAN                            */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-6">
        <div className="flex gap-4 items-start min-h-[580px]">
          
          {columns.map((col, colIdx) => {
            const colLeads = filteredLeads.filter(l => l.statusFunil === col.id);
            const prevCol = colIdx > 0 ? columns[colIdx - 1].id : null;
            const nextCol = colIdx < columns.length - 1 ? columns[colIdx + 1].id : null;
            const colTotal = colLeads.reduce((acc, curr) => acc + (Number(curr.valorTotal) || 0), 0);

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.id)}
                className={`w-[290px] flex-shrink-0 bg-slate-100/90 rounded-2xl border border-slate-200/90 border-t-4 ${col.topBorder} flex flex-col max-h-[calc(100vh-14rem)] shadow-2xs`}
              >
                {/* Column Header */}
                <div className="p-3 bg-white border-b border-slate-200/80 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                      <h3 className="font-heading font-bold text-xs text-slate-800 tracking-tight">
                        {col.title}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg} ${col.badgeText}`}>
                      {colLeads.length}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Total:</span>
                    <span className="font-bold text-slate-800">{currencyFormatter(colTotal)}</span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {colLeads.map((lead) => {
                    const isWon = lead.statusFunil === 'venda_ganha';

                    return (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead.id)}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/90 hover:border-brand-500 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing group space-y-2.5"
                      >
                        {/* Linha 1: Linha de Veículo + Responsável */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            {lead.veiculoLinha || 'Veículo'}
                          </span>
                          
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            lead.responsavelAtual === 'Igor'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : lead.responsavelAtual === 'Loja'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-orange-50 text-brand-700 border-orange-200'
                          }`}>
                            {lead.responsavelAtual === 'Igor' ? '🔵 Igor' : lead.responsavelAtual === 'Loja' ? '🟣 Loja' : '🟠 Norlando'}
                          </span>
                        </div>

                        {/* Linha 2: Nome do Cliente + Valor */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 
                            onClick={() => onSelectLead(lead)}
                            className="font-heading font-bold text-xs text-slate-900 hover:text-brand-600 transition-colors cursor-pointer leading-snug line-clamp-2"
                          >
                            {lead.nome}
                          </h4>
                          <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                            {currencyFormatter(lead.valorTotal || 0)}
                          </span>
                        </div>

                        {/* Linha 3: Modelo do Bagageiro */}
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] space-y-0.5">
                          <p className="font-medium text-slate-800 truncate">{lead.produtoNome || 'Bagageiro Robusty'}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>{lead.modalidade || 'A definir'}</span>
                            <span className="font-mono">{lead.corBagageiro || 'Preto Epóxi'}</span>
                          </div>
                        </div>

                        {/* Linha 4: Tags do Processo (Cotação Igor / Link / NF) */}
                        <div className="flex flex-wrap gap-1">
                          {lead.solicitarCotacaoIgor && (
                            <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200 font-medium">
                              📦 Cotação Igor
                            </span>
                          )}
                          {lead.solicitouLinkPagamento && (
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200 font-medium">
                              💳 Link Pagto
                            </span>
                          )}
                          {lead.necessitaNotaFiscal && (
                            <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200 font-medium">
                              🧾 Nota Fiscal
                            </span>
                          )}
                        </div>

                        {/* Botão Mágico: Venda Ganha -> Encaminhar para Pedido de Produção */}
                        {isWon && activeFunnelType === 'leads' && (
                          <button
                            onClick={() => onConvertToOrder && onConvertToOrder(lead.id)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>➔ Enviar p/ Funil de Pedidos</span>
                          </button>
                        )}

                        {/* Linha 5: Ações Rápidas (WhatsApp, Detalhes e Setas) */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            {onOpenChat && (
                              <button
                                onClick={() => onOpenChat(lead.id)}
                                title="Abrir conversa no WhatsApp"
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onSelectLead(lead)}
                              className="text-[11px] text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
                            >
                              Detalhes
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {prevCol && (
                              <button
                                onClick={() => onMoveLead(lead.id, prevCol)}
                                title="Voltar etapa"
                                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {nextCol && (
                              <button
                                onClick={() => onMoveLead(lead.id, nextCol)}
                                title="Avançar etapa"
                                className="p-1 bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white rounded transition-colors cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}

                  {colLeads.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200/80 rounded-xl">
                      Nenhum card nesta etapa
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
};
