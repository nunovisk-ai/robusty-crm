-- ==============================================================================
-- SCHEMA DO BANCO DE DADOS - ROBUSTY CRM (BAGAGEIROS AUTOMOTIVOS)
-- ==============================================================================
-- Copie e cole este script no SQL Editor do seu projeto Supabase:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMERAÇÕES DO FUNIL ROBUSTY (LEADS E PEDIDOS)
DO $$ BEGIN
    CREATE TYPE robusty_funil_etapa AS ENUM (
        -- Funil 1: Leads Comerciais (10 etapas)
        'novo_lead',
        'em_qualificacao',
        'aguardando_atendimento',
        'aguardando_cotacao',
        'preparacao_orcamento',
        'orcamento_enviado',
        'em_negociacao',
        'aguardando_pagamento',
        'venda_ganha',
        'venda_perdida',
        -- Funil 2: Pedidos / Operação & Loja (9 etapas)
        'pedido_definido',
        'modalidade_definida',
        'aguardando_preparacao',
        'em_preparacao',
        'aguardando_entrega_instalacao',
        'em_entrega_instalacao',
        'aguardando_finalizacao',
        'pedido_concluido',
        'pedido_cancelado'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABELA DE PERFIS DE USUÁRIOS (NORLANDO, IGOR, LOJA, ADMIN)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    cargo TEXT NOT NULL DEFAULT 'comercial' CHECK (cargo IN ('comercial', 'gestao', 'loja', 'admin')),
    whatsapp_conectado BOOLEAN DEFAULT false,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir equipe padrão da Robusty caso ainda não exista
INSERT INTO public.profiles (nome, email, telefone, cargo)
VALUES 
  ('Norlando', 'norlando@robusty.com.br', '(11) 96620-0052', 'comercial'),
  ('Igor', 'igor@robusty.com.br', '(11) 3774-4674', 'gestao'),
  ('Equipe Loja & Fábrica', 'fabrica@robusty.com.br', '(11) 3774-4674', 'loja'),
  ('Ricardo Faria (Diretoria)', 'ricardo@robusty.com.br', '(11) 96620-0052', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 4. TABELA DE PRODUTOS DO CATÁLOGO ROBUSTY (FEV/2026)
CREATE TABLE IF NOT EXISTS public.produtos_catalogo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    veiculo TEXT NOT NULL,
    nome TEXT NOT NULL,
    medidas TEXT,
    preco_10x NUMERIC(12, 2) NOT NULL,
    preco_avista NUMERIC(12, 2) NOT NULL,
    preco_max10 NUMERIC(12, 2) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Carga inicial de todos os produtos reais do Catálogo 2026
INSERT INTO public.produtos_catalogo (veiculo, nome, medidas, preco_10x, preco_avista, preco_max10)
VALUES
  ('Kombi', 'Bagageiro Kombi MX 100 (Sem Aba)', '3,30m x 1,28m x 0,30m', 2220.00, 2109.00, 1998.00),
  ('Kombi', 'Bagageiro Kombi MX 100 PLUS (Aba Dupla)', '3,30m x 1,28m x 0,38m', 2600.00, 2470.00, 2340.00),
  ('Kombi', 'Bagageiro Kombi MX 200 PLUS (Aba Lateral)', '3,30m x 1,28m x 0,38m', 2600.00, 2470.00, 2340.00),
  ('Kombi', 'Bagageiro Kombi MX 80 PLUS', '2,20m x 1,28m x 0,38m', 2300.00, 2185.00, 2070.00),
  ('Kombi', 'Bagageiro Kombi MX 50 PLUS s/ Madeira', '1,00m x 1,30m x 0,40m', 1720.00, 1582.40, 1548.00),
  ('Kombi', 'Escada Removível para Kombi', '1,35m x 0,30m x 0,16m', 620.00, 589.00, 558.00),
  ('Kangoo', 'Bagageiro Renault Kangoo KX 100 (Aba Dupla)', '1,95m x 1,12m x 0,10m', 2100.00, 1995.00, 1890.00),
  ('Kangoo', 'Bagageiro Renault Kangoo KX 200 (Aba Lateral)', '1,95m x 1,12m x 0,10m', 2100.00, 1995.00, 1890.00),
  ('Kangoo', 'Bagageiro Nova Renault Kangoo KX 200 – Nova', '2,00m x 1,17m x 0,10m', 2300.00, 2185.00, 2070.00),
  ('Fiorino', 'Bagageiro Fiat Fiorino FX 100 (Aba Dupla)', '1,80m x 1,25m x 0,10m', 2200.00, 2090.00, 1980.00),
  ('Fiorino', 'Bagageiro Fiat Fiorino FX 200 (Aba Lateral)', '1,80m x 1,25m x 0,10m', 2200.00, 2090.00, 1980.00),
  ('Doblo', 'Bagageiro Doblo DX 100', '2,00m x 1,32m x 0,10m', 2300.00, 2185.00, 2070.00),
  ('Doblo', 'Bagageiro Doblo DX 200', '2,00m x 1,32m x 0,10m', 2300.00, 2185.00, 2070.00),
  ('Jumpy/Expert/Scudo', 'Bagageiro Jumpy/Expert/Scudo MX 120', '2,65m x 1,30m x 0,16m', 2680.00, 2546.00, 2412.00),
  ('Jumpy/Expert/Scudo', 'Bagageiro Jumpy/Expert/Scudo (Aba Dupla)', '2,65m x 1,30m x 0,16m', 2970.00, 2821.50, 2673.00),
  ('Jumpy/Expert/Scudo', 'Bagageiro Jumpy/Expert/Scudo Modelo EXTREME', '3,30m x 1,30m x 0,16m', 3470.00, 3296.50, 3123.00),
  ('Ducato', 'Bagageiro Ducato Max Cargo 2023 (Aba Lateral)', '3,65m x 1,70m x 0,10m', 4820.00, 4579.00, 4338.00),
  ('Saveiro', 'Bagageiro Saveiro Cabine Simples', 'Estrutura Reforçada CS', 3900.00, 3705.00, 3510.00),
  ('Saveiro', 'Bagageiro Saveiro Cabine Dupla', 'Estrutura Reforçada CD', 3500.00, 3325.00, 3150.00),
  ('Saveiro', 'Guia de Rolete Especial Saveiro', '1,00m x 0,30m x 0,16m', 780.00, 634.80, 702.00)
ON CONFLICT DO NOTHING;

-- 5. TABELA PRINCIPAL DE LEADS E PEDIDOS
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    cidade_uf TEXT,
    
    -- Veículo & Catálogo Robusty
    veiculo_linha TEXT NOT NULL DEFAULT 'Kombi',
    veiculo_ano TEXT,
    produto_nome TEXT NOT NULL,
    condicao_preco TEXT NOT NULL DEFAULT '10x',
    valor_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    custo_instalacao NUMERIC(12, 2) DEFAULT 0.00,
    cor_bagageiro TEXT DEFAULT 'Preto Epóxi',
    
    -- Fluxo Operacional
    modalidade TEXT DEFAULT 'Caminho B: Instalação na Loja',
    solicitar_cotacao_igor BOOLEAN DEFAULT false,
    solicitou_link_pagamento BOOLEAN DEFAULT false,
    necessita_nota_fiscal BOOLEAN DEFAULT true,
    responsavel_atual TEXT DEFAULT 'Norlando' CHECK (responsavel_atual IN ('Norlando', 'Igor', 'Loja')),
    
    -- Funil e Status
    funil_atual TEXT DEFAULT 'leads' CHECK (funil_atual IN ('leads', 'pedidos')),
    status_funil robusty_funil_etapa DEFAULT 'novo_lead' NOT NULL,
    origem TEXT DEFAULT 'whatsapp',
    
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ultima_interacao_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABELA DE AGENDAMENTOS (INSTALAÇÕES NA FÁBRICA & COLETAS)
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL DEFAULT 'Instalação na Fábrica' CHECK (tipo IN ('Instalação na Fábrica', 'Coleta Transportadora')),
    local_endereco TEXT DEFAULT 'Fábrica Robusty: Av. Aricanduva, 5.541 - São Paulo/SP',
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    realizado BOOLEAN DEFAULT null,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABELA DE MENSAGENS DO WHATSAPP
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    from_me BOOLEAN NOT NULL,
    text TEXT,
    media_url TEXT,
    media_type TEXT,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_catalogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura/Escrita Liberadas para Usuários Autenticados e Anon (para demonstração)
CREATE POLICY "Permitir leitura pública catálogo" ON public.produtos_catalogo FOR SELECT USING (true);
CREATE POLICY "Permitir tudo leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Permitir tudo perfis" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Permitir tudo agendamentos" ON public.agendamentos FOR ALL USING (true);
CREATE POLICY "Permitir tudo whatsapp" ON public.whatsapp_messages FOR ALL USING (true);
