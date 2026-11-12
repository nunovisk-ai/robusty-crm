import { Lead, FunnelStage } from '../types';

const STORAGE_KEY = 'robusty_crm_leads_data';

const SEED_ROBUSTY_LEADS: Lead[] = [
  {
    id: 'lead-1',
    corretorId: 'norlando-1',
    nome: 'Carlos Eduardo (Kombi Corujinha 74)',
    telefone: '(11) 98834-1122',
    email: 'carlos.kombi@gmail.com',
    cidadeUf: 'São Paulo / SP',
    veiculoLinha: 'Kombi',
    veiculoAno: '1974 - Corujinha',
    produtoNome: 'Bagageiro Kombi MX 100 PLUS (Aba Dupla)',
    condicaoPreco: '10x',
    valorTotal: 2600.00,
    custoInstalacao: 0,
    corBagageiro: 'Preto Epóxi',
    modalidade: 'Caminho B: Instalação na Loja',
    solicitarCotacaoIgor: false,
    solicitouLinkPagamento: false,
    necessitaNotaFiscal: true,
    responsavelAtual: 'Norlando',
    funilAtual: 'leads',
    statusFunil: 'em_negociacao',
    origemLead: 'whatsapp',
    observacoes: 'Cliente quer agendar instalação na fábrica dia 22/11 antes de viajar para a praia.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ultimaInteracaoAt: new Date().toISOString(),
  },
  {
    id: 'lead-2',
    corretorId: 'norlando-1',
    nome: 'Transportadora Vale do Paraíba (Jumpy)',
    telefone: '(12) 99120-4499',
    email: 'frota@valeparaiba.com.br',
    cidadeUf: 'São José dos Campos / SP',
    veiculoLinha: 'Jumpy/Expert/Scudo',
    veiculoAno: '2023 - Citroën Jumpy',
    produtoNome: 'Bagageiro Jumpy/Expert/Scudo Modelo EXTREME',
    condicaoPreco: 'avista',
    valorTotal: 3296.50,
    custoInstalacao: 0,
    corBagageiro: 'Preto Epóxi',
    modalidade: 'Caminho A: Entrega Transportadora',
    solicitarCotacaoIgor: true,
    solicitouLinkPagamento: false,
    necessitaNotaFiscal: true,
    responsavelAtual: 'Igor',
    funilAtual: 'leads',
    statusFunil: 'aguardando_cotacao',
    origemLead: 'instagram',
    observacoes: 'Norlando pediu cotação de frete ao Igor para São José dos Campos.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ultimaInteracaoAt: new Date().toISOString(),
  },
  {
    id: 'lead-3',
    corretorId: 'norlando-1',
    nome: 'Marcos Eletricista (Saveiro)',
    telefone: '(19) 97722-1980',
    email: 'marcos.eletrica@hotmail.com',
    cidadeUf: 'Campinas / SP',
    veiculoLinha: 'Saveiro',
    veiculoAno: '2021 - Cabine Simples',
    produtoNome: 'Bagageiro Saveiro Cabine Simples',
    condicaoPreco: '10x',
    valorTotal: 3900.00,
    custoInstalacao: 0,
    corBagageiro: 'Preto Epóxi',
    modalidade: 'Caminho B: Instalação na Loja',
    solicitarCotacaoIgor: false,
    solicitouLinkPagamento: true,
    necessitaNotaFiscal: true,
    responsavelAtual: 'Igor',
    funilAtual: 'leads',
    statusFunil: 'aguardando_pagamento',
    origemLead: 'facebook',
    observacoes: 'Cliente aprovou proposta! Igor gerando link de pagamento em 10x sem juros.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ultimaInteracaoAt: new Date().toISOString(),
  },
  {
    id: 'lead-4',
    corretorId: 'norlando-1',
    nome: 'Oficina Garagem Clássica (Kombi Flex)',
    telefone: '(11) 94555-8833',
    email: 'contato@garagemclassica.com.br',
    cidadeUf: 'Santo André / SP',
    veiculoLinha: 'Kombi',
    veiculoAno: '2010',
    produtoNome: 'Bagageiro Kombi MX 200 PLUS (Aba Lateral)',
    condicaoPreco: 'max10',
    valorTotal: 2340.00,
    custoInstalacao: 0,
    corBagageiro: 'Branco Epóxi',
    modalidade: 'Caminho B: Instalação na Loja',
    solicitarCotacaoIgor: false,
    solicitouLinkPagamento: false,
    necessitaNotaFiscal: true,
    responsavelAtual: 'Norlando',
    funilAtual: 'leads',
    statusFunil: 'venda_ganha',
    origemLead: 'loja_presencial',
    observacoes: 'Pagamento à vista confirmado! Pronto para enviar para o Funil de Pedidos.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ultimaInteracaoAt: new Date().toISOString(),
  },
  // Pedidos na Operação / Fábrica
  {
    id: 'ped-101',
    corretorId: 'norlando-1',
    nome: 'Cláudio Express (Fiorino 2022)',
    telefone: '(11) 96555-2211',
    email: 'claudio@express.com',
    cidadeUf: 'São Paulo / SP',
    veiculoLinha: 'Fiorino',
    veiculoAno: '2022',
    produtoNome: 'Bagageiro Fiat Fiorino FX 200 (Aba Lateral)',
    condicaoPreco: '10x',
    valorTotal: 2400.00, // 2200 + 200 instalacao
    custoInstalacao: 200.00,
    corBagageiro: 'Preto Epóxi',
    modalidade: 'Caminho B: Instalação na Loja',
    solicitarCotacaoIgor: false,
    solicitouLinkPagamento: true,
    necessitaNotaFiscal: true,
    responsavelAtual: 'Loja',
    funilAtual: 'pedidos',
    statusFunil: 'em_preparacao',
    origemLead: 'whatsapp',
    observacoes: 'Peça no setor de pintura eletrostática a pó. Instalação marcada para quinta 14h na Av. Aricanduva.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ultimaInteracaoAt: new Date().toISOString(),
  },
  {
    id: 'ped-102',
    corretorId: 'norlando-1',
    nome: 'Mercado Central de Minas (Ducato 2023)',
    telefone: '(31) 98777-3322',
    email: 'logistica@mercadomg.com.br',
    cidadeUf: 'Belo Horizonte / MG',
    veiculoLinha: 'Ducato',
    veiculoAno: '2023',
    produtoNome: 'Bagageiro Ducato Max Cargo 2023 (Aba Lateral)',
    condicaoPreco: 'avista',
    valorTotal: 4579.00,
    custoInstalacao: 0,
    corBagageiro: 'Preto Epóxi',
    modalidade: 'Caminho A: Entrega Transportadora',
    solicitarCotacaoIgor: true,
    solicitouLinkPagamento: false,
    necessitaNotaFiscal: true,
    responsavelAtual: 'Igor',
    funilAtual: 'pedidos',
    statusFunil: 'aguardando_entrega_instalacao',
    origemLead: 'whatsapp',
    observacoes: 'Loja embalou. Igor emitiu NF e agendou coleta com a Braspress para amanhã de manhã.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ultimaInteracaoAt: new Date().toISOString(),
  }
];

function getStoredLeads(): Lead[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ROBUSTY_LEADS));
    return SEED_ROBUSTY_LEADS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return SEED_ROBUSTY_LEADS;
  }
}

function saveStoredLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export const leadsService = {
  async getLeads(userId?: string, role?: string): Promise<Lead[]> {
    return getStoredLeads();
  },

  async getLeadById(id: string): Promise<Lead | null> {
    const leads = getStoredLeads();
    return leads.find(l => l.id === id) || null;
  },

  async createLead(newLeadData: Partial<Lead>): Promise<Lead> {
    const leads = getStoredLeads();
    const lead: Lead = {
      id: 'lead-' + Date.now(),
      corretorId: newLeadData.corretorId || 'norlando-1',
      nome: newLeadData.nome || 'Novo Cliente',
      telefone: newLeadData.telefone || '',
      email: newLeadData.email || '',
      cidadeUf: newLeadData.cidadeUf || 'São Paulo / SP',
      veiculoLinha: newLeadData.veiculoLinha || 'Kombi',
      veiculoAno: newLeadData.veiculoAno || '',
      produtoNome: newLeadData.produtoNome || 'Bagageiro Kombi MX 100 PLUS (Aba Dupla)',
      condicaoPreco: newLeadData.condicaoPreco || '10x',
      valorTotal: Number(newLeadData.valorTotal) || 2600.00,
      custoInstalacao: Number(newLeadData.custoInstalacao) || 0,
      corBagageiro: newLeadData.corBagageiro || 'Preto Epóxi',
      modalidade: newLeadData.modalidade || 'Caminho B: Instalação na Loja',
      solicitarCotacaoIgor: !!newLeadData.solicitarCotacaoIgor,
      solicitouLinkPagamento: !!newLeadData.solicitouLinkPagamento,
      necessitaNotaFiscal: !!newLeadData.necessitaNotaFiscal,
      responsavelAtual: newLeadData.responsavelAtual || 'Norlando',
      funilAtual: newLeadData.funilAtual || 'leads',
      statusFunil: newLeadData.statusFunil || 'novo_lead',
      origemLead: newLeadData.origemLead || 'whatsapp',
      observacoes: newLeadData.observacoes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ultimaInteracaoAt: new Date().toISOString(),
    };

    leads.unshift(lead);
    saveStoredLeads(leads);
    return lead;
  },

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
    const leads = getStoredLeads();
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx === -1) throw new Error('Lead não encontrado');

    const updatedLead: Lead = {
      ...leads[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
      ultimaInteracaoAt: new Date().toISOString()
    };

    leads[idx] = updatedLead;
    saveStoredLeads(leads);
    return updatedLead;
  },

  async deleteLead(leadId: string): Promise<void> {
    const leads = getStoredLeads();
    const filtered = leads.filter(l => l.id !== leadId);
    saveStoredLeads(filtered);
  },

  // Ação especial do fluxograma: Converter Lead Ganho em Pedido de Produção
  async convertLeadToOrder(leadId: string): Promise<Lead> {
    const leads = getStoredLeads();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead não encontrado');

    const newOrder: Lead = {
      ...lead,
      id: 'ped-' + Date.now(),
      funilAtual: 'pedidos',
      statusFunil: lead.modalidade.includes('Caminho') ? 'modalidade_definida' : 'pedido_definido',
      responsavelAtual: lead.modalidade.includes('Transportadora') ? 'Igor' : 'Loja',
      observacoes: `[Venda confirmada por Norlando] ${lead.observacoes || ''}`,
      updatedAt: new Date().toISOString(),
      ultimaInteracaoAt: new Date().toISOString()
    };

    leads.unshift(newOrder);
    saveStoredLeads(leads);
    return newOrder;
  }
};
