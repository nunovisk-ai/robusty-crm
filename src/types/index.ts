export type UserRole = 'comercial' | 'gestao' | 'loja' | 'admin' | 'corretor' | 'gerente';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cargo?: string;
  phone?: string;
  avatarUrl?: string;
  whatsappConnected?: boolean;
  status?: 'ativo' | 'inativo';
  primeiroAcesso?: boolean;
  ultimoAcesso?: string | null;
  createdAt?: string;
}

// Etapas do Funil de Leads da Robusty (10 etapas oficiais)
export type LeadsFunnelStage = 
  | 'novo_lead'
  | 'em_qualificacao'
  | 'aguardando_atendimento'
  | 'aguardando_cotacao'
  | 'preparacao_orcamento'
  | 'orcamento_enviado'
  | 'em_negociacao'
  | 'aguardando_pagamento'
  | 'venda_ganha'
  | 'venda_perdida';

// Etapas do Funil de Pedidos & Operação da Robusty (9 etapas oficiais)
export type PedidosFunnelStage =
  | 'pedido_definido'
  | 'modalidade_definida'
  | 'aguardando_preparacao'
  | 'em_preparacao'
  | 'aguardando_entrega_instalacao'
  | 'em_entrega_instalacao'
  | 'aguardando_finalizacao'
  | 'pedido_concluido'
  | 'pedido_cancelado';

export type FunnelStage = LeadsFunnelStage | PedidosFunnelStage | string;

export interface LeadChecklistItem {
  id: string;
  leadId: string;
  codigoDoc: string;
  titulo: string;
  descricao?: string;
  obrigatorio: boolean;
  coletado: boolean;
  statusAnalise: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  motivoRejeicao?: string;
  arquivoUrl?: string;
  nomeArquivo?: string;
  updatedAt: string;
}

export type ChecklistItem = LeadChecklistItem;

export interface LeadDocument {
  id: string;
  leadId: string;
  name: string;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'other';
  status: 'pendente' | 'aprovado' | 'reprovado';
  rejectionReason?: string;
  uploadedAt: string;
}

// Modelo de Lead / Oportunidade Robusty
export interface Lead {
  id: string;
  corretorId: string; // Vendedor / Responsável ID
  nome: string;
  telefone: string;
  email?: string;
  cpf?: string;
  cidadeUf?: string;
  
  // Dados do Veículo & Bagageiro Robusty (Catálogo Fev/2026)
  veiculoLinha: 'Kombi' | 'Kangoo' | 'Fiorino' | 'Doblo' | 'Jumpy/Expert/Scudo' | 'Ducato' | 'Saveiro' | 'Decks & Acessórios' | 'Outro';
  veiculoAno?: string;
  produtoNome: string;
  condicaoPreco: '10x' | 'avista' | 'max10';
  valorTotal: number;
  custoInstalacao: number;
  corBagageiro?: string;
  
  // Fluxo Operacional (Norlando • Igor • Loja)
  modalidade: 'Caminho A: Entrega Transportadora' | 'Caminho B: Instalação na Loja' | 'A Definir';
  solicitarCotacaoIgor: boolean;
  solicitouLinkPagamento: boolean;
  necessitaNotaFiscal: boolean;
  responsavelAtual: 'Norlando' | 'Igor' | 'Loja';
  
  // Funil e Status
  funilAtual: 'leads' | 'pedidos';
  statusFunil: FunnelStage;
  origemLead: any;
  
  motivoDescarte?: string;
  motivoRejeicaoCredito?: string;
  observacoes?: string;
  checklistProgress?: {
    coletados: number;
    total: number;
    aprovados: number;
    temRejeitado: boolean;
  };
  
  // Compatibilidade com componentes imobiliários existentes
  dataNascimento?: string;
  rendaMensal?: number;
  fgtsValor?: number;
  fgtsAprovado?: boolean;
  empreendimentoInteresse?: string;

  createdAt: string;
  updatedAt: string;
  ultimaInteracaoAt: string;
}

export interface Visit {
  id: string;
  leadId: string;
  leadNome?: string;
  leadTelefone?: string;
  corretorId?: string;
  empreendimentoNome: string; // Veículo / Produto Robusty
  tipoAgendamento?: 'Instalação na Fábrica' | 'Coleta Transportadora';
  enderecoPlantao?: string; // Fábrica Av. Aricanduva ou Galpão
  dataHora: string;
  realizada: boolean | null;
  motivoNaoComparecimento?: string;
  observacoes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WhatsAppMessage {
  id: string;
  leadId: string;
  corretorId?: string;
  fromMe: boolean;
  text: string;
  senderName?: string;
  mediaUrl?: string;
  audioUrl?: string;
  audioDuration?: number;
  mediaType?: 'image' | 'pdf' | 'audio' | 'document' | 'sticker' | 'video' | 'gif';
  mediaName?: string;
  caption?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface WhatsAppInstance {
  id: string;
  corretorId?: string;
  sessionName: string;
  phoneNumber?: string;
  status: 'disconnected' | 'qrcode_ready' | 'connecting' | 'connected';
  qrcodeBase64?: string;
  connectedAt?: string;
  lastSyncAt?: string;
}
