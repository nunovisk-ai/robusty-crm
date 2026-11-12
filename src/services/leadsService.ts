import { Lead, FunnelStage } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
    valorTotal: 2400.00,
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

// Mapper de banco (snake_case) para Frontend (camelCase)
function mapDbRowToLead(row: any): Lead {
  return {
    id: row.id,
    corretorId: row.corretor_id || 'norlando-1',
    nome: row.nome,
    telefone: row.telefone,
    email: row.email,
    cidadeUf: row.cidade_uf,
    veiculoLinha: row.veiculo_linha,
    veiculoAno: row.veiculo_ano,
    produtoNome: row.produto_nome,
    condicaoPreco: row.condicao_preco,
    valorTotal: Number(row.valor_total) || 0,
    custoInstalacao: Number(row.custo_instalacao) || 0,
    corBagageiro: row.cor_bagageiro,
    modalidade: row.modalidade,
    solicitarCotacaoIgor: Boolean(row.solicitar_cotacao_igor),
    solicitouLinkPagamento: Boolean(row.solicitou_link_pagamento),
    necessitaNotaFiscal: Boolean(row.necessita_nota_fiscal),
    responsavelAtual: row.responsavel_atual,
    funilAtual: row.funil_atual || 'leads',
    statusFunil: row.status_funil as FunnelStage,
    origemLead: row.origem,
    observacoes: row.observacoes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ultimaInteracaoAt: row.ultima_interacao_at || row.created_at
  };
}

export const leadsService = {
  async getLeads(): Promise<Lead[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('ultima_interacao_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapDbRowToLead);
          saveStoredLeads(mapped);
          return mapped;
        } else if (!error && data && data.length === 0) {
          // Se o banco estiver vazio pela primeira vez, insere as sementes da Robusty no Supabase
          for (const s of SEED_ROBUSTY_LEADS) {
            await this.createLead(s);
          }
        }
      } catch (err) {
        console.warn('Erro ao buscar leads do Supabase, usando fallback local:', err);
      }
    }
    return getStoredLeads();
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

    if (isSupabaseConfigured) {
      try {
        const payload = {
          nome: lead.nome,
          telefone: lead.telefone,
          email: lead.email,
          cidade_uf: lead.cidadeUf,
          veiculo_linha: lead.veiculoLinha,
          veiculo_ano: lead.veiculoAno,
          produto_nome: lead.produtoNome,
          condicao_preco: lead.condicaoPreco,
          valor_total: lead.valorTotal,
          custo_instalacao: lead.custoInstalacao,
          cor_bagageiro: lead.corBagageiro,
          modalidade: lead.modalidade,
          solicitar_cotacao_igor: lead.solicitarCotacaoIgor,
          solicitou_link_pagamento: lead.solicitouLinkPagamento,
          necessita_nota_fiscal: lead.necessitaNotaFiscal,
          responsavel_atual: lead.responsavelAtual,
          funil_atual: lead.funilAtual,
          status_funil: lead.statusFunil,
          origem: lead.origemLead,
          observacoes: lead.observacoes
        };
        const { data, error } = await supabase.from('leads').insert([payload]).select().single();
        if (!error && data) {
          lead.id = data.id;
        }
      } catch (err) {
        console.warn('Erro ao salvar no Supabase:', err);
      }
    }

    leads.unshift(lead);
    saveStoredLeads(leads);
    return lead;
  },

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
    const leads = getStoredLeads();
    const idx = leads.findIndex(l => l.id === leadId);

    const updatedLead: Lead = {
      ...(idx !== -1 ? leads[idx] : {} as Lead),
      ...updates,
      updatedAt: new Date().toISOString(),
      ultimaInteracaoAt: new Date().toISOString()
    };

    if (idx !== -1) {
      leads[idx] = updatedLead;
      saveStoredLeads(leads);
    }

    if (isSupabaseConfigured && !leadId.startsWith('lead-') && !leadId.startsWith('ped-')) {
      try {
        const dbUpdates: any = {};
        if (updates.statusFunil) dbUpdates.status_funil = updates.statusFunil;
        if (updates.funilAtual) dbUpdates.funil_atual = updates.funilAtual;
        if (updates.responsavelAtual) dbUpdates.responsavel_atual = updates.responsavelAtual;
        if (updates.valorTotal !== undefined) dbUpdates.valor_total = updates.valorTotal;
        if (updates.produtoNome) dbUpdates.produto_nome = updates.produtoNome;
        if (updates.observacoes !== undefined) dbUpdates.observacoes = updates.observacoes;
        if (updates.modalidade) dbUpdates.modalidade = updates.modalidade;

        await supabase.from('leads').update(dbUpdates).eq('id', leadId);
      } catch (err) {
        console.warn('Erro ao atualizar no Supabase:', err);
      }
    }

    return updatedLead;
  },

  async deleteLead(leadId: string): Promise<void> {
    const leads = getStoredLeads();
    const filtered = leads.filter(l => l.id !== leadId);
    saveStoredLeads(filtered);

    if (isSupabaseConfigured && !leadId.startsWith('lead-') && !leadId.startsWith('ped-')) {
      try {
        await supabase.from('leads').delete().eq('id', leadId);
      } catch (err) {
        console.warn('Erro ao deletar no Supabase:', err);
      }
    }
  },

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

    if (isSupabaseConfigured) {
      try {
        const payload = {
          nome: newOrder.nome,
          telefone: newOrder.telefone,
          email: newOrder.email,
          cidade_uf: newOrder.cidadeUf,
          veiculo_linha: newOrder.veiculoLinha,
          veiculo_ano: newOrder.veiculoAno,
          produto_nome: newOrder.produtoNome,
          condicao_preco: newOrder.condicaoPreco,
          valor_total: newOrder.valorTotal,
          custo_instalacao: newOrder.custoInstalacao,
          cor_bagageiro: newOrder.corBagageiro,
          modalidade: newOrder.modalidade,
          solicitar_cotacao_igor: newOrder.solicitarCotacaoIgor,
          solicitou_link_pagamento: newOrder.solicitouLinkPagamento,
          necessita_nota_fiscal: newOrder.necessitaNotaFiscal,
          responsavel_atual: newOrder.responsavelAtual,
          funil_atual: 'pedidos',
          status_funil: newOrder.statusFunil,
          origem: newOrder.origemLead,
          observacoes: newOrder.observacoes
        };
        const { data } = await supabase.from('leads').insert([payload]).select().single();
        if (data) newOrder.id = data.id;
      } catch (err) {
        console.warn('Erro ao criar pedido no Supabase:', err);
      }
    }

    leads.unshift(newOrder);
    saveStoredLeads(leads);
    return newOrder;
  }
};
