// Catálogo Oficial Robusty — Fevereiro 2026
// Extraído de Catalogo_Robusty_2026_(FEV-2026).docx

export interface ProdutoRobusty {
  id: string;
  nome: string;
  veiculo: 'Kombi' | 'Kangoo' | 'Fiorino' | 'Doblo' | 'Jumpy/Expert/Scudo' | 'Ducato' | 'Saveiro' | 'Decks & Acessórios' | 'Instalação & Serviços';
  medidas: string;
  preco10x: number;
  precoAvista: number;
  precoMax10: number;
  descricao?: string;
  ativo: boolean;
}

export const CATALOGO_ROBUSTY_2026: ProdutoRobusty[] = [
  // VW Kombi
  { id: 'k-mx100', veiculo: 'Kombi', nome: 'Bagageiro Kombi MX 100 (Sem Aba)', medidas: '3,30m x 1,28m x 0,30m (Vãos: 19cm)', preco10x: 2220.00, precoAvista: 2109.00, precoMax10: 1998.00, ativo: true },
  { id: 'k-mx100p', veiculo: 'Kombi', nome: 'Bagageiro Kombi MX 100 PLUS (Aba Dupla)', medidas: '3,30m x 1,28m x 0,38m', preco10x: 2600.00, precoAvista: 2470.00, precoMax10: 2340.00, ativo: true },
  { id: 'k-mx200p', veiculo: 'Kombi', nome: 'Bagageiro Kombi MX 200 PLUS (Aba Lateral)', medidas: '3,30m x 1,28m x 0,38m', preco10x: 2600.00, precoAvista: 2470.00, precoMax10: 2340.00, ativo: true },
  { id: 'k-mx80p', veiculo: 'Kombi', nome: 'Bagageiro Kombi MX 80 PLUS', medidas: '2,20m x 1,28m x 0,38m', preco10x: 2300.00, precoAvista: 2185.00, precoMax10: 2070.00, ativo: true },
  { id: 'k-mx50p', veiculo: 'Kombi', nome: 'Bagageiro Kombi MX 50 PLUS s/ Madeira', medidas: '1,00m x 1,30m x 0,40m', preco10x: 1720.00, precoAvista: 1582.40, precoMax10: 1548.00, ativo: true },
  { id: 'k-escada', veiculo: 'Kombi', nome: 'Escada Removível para Kombi', medidas: '1,35m x 0,30m x 0,16m', preco10x: 620.00, precoAvista: 589.00, precoMax10: 558.00, ativo: true },

  // Renault Kangoo
  { id: 'kg-kx100', veiculo: 'Kangoo', nome: 'Bagageiro Renault Kangoo KX 100 (Aba Dupla)', medidas: '1,95m x 1,12m x 0,10m', preco10x: 2100.00, precoAvista: 1995.00, precoMax10: 1890.00, ativo: true },
  { id: 'kg-kx200', veiculo: 'Kangoo', nome: 'Bagageiro Renault Kangoo KX 200 (Aba Lateral)', medidas: '1,95m x 1,12m x 0,10m', preco10x: 2100.00, precoAvista: 1995.00, precoMax10: 1890.00, ativo: true },
  { id: 'kg-novakx200', veiculo: 'Kangoo', nome: 'Bagageiro Nova Renault Kangoo KX 200 – Nova', medidas: '2,00m x 1,17m x 0,10m', preco10x: 2300.00, precoAvista: 2185.00, precoMax10: 2070.00, ativo: true },

  // Fiat Fiorino
  { id: 'fi-fx100', veiculo: 'Fiorino', nome: 'Bagageiro Fiat Fiorino FX 100 (Aba Dupla)', medidas: '1,80m x 1,25m x 0,10m', preco10x: 2200.00, precoAvista: 2090.00, precoMax10: 1980.00, ativo: true },
  { id: 'fi-fx200', veiculo: 'Fiorino', nome: 'Bagageiro Fiat Fiorino FX 200 (Aba Lateral)', medidas: '1,80m x 1,25m x 0,10m', preco10x: 2200.00, precoAvista: 2090.00, precoMax10: 1980.00, ativo: true },

  // Fiat Doblo
  { id: 'db-dx100', veiculo: 'Doblo', nome: 'Bagageiro Doblo DX 100', medidas: '2,00m x 1,32m x 0,10m', preco10x: 2300.00, precoAvista: 2185.00, precoMax10: 2070.00, ativo: true },
  { id: 'db-dx200', veiculo: 'Doblo', nome: 'Bagageiro Doblo DX 200', medidas: '2,00m x 1,32m x 0,10m', preco10x: 2300.00, precoAvista: 2185.00, precoMax10: 2070.00, ativo: true },

  // Jumpy / Expert / Scudo
  { id: 'je-mx120', veiculo: 'Jumpy/Expert/Scudo', nome: 'Bagageiro Jumpy/Expert/Scudo MX 120', medidas: '2,65m x 1,30m x 0,16m', preco10x: 2680.00, precoAvista: 2546.00, precoMax10: 2412.00, ativo: true },
  { id: 'je-abadupla', veiculo: 'Jumpy/Expert/Scudo', nome: 'Bagageiro Jumpy/Expert/Scudo (Aba Dupla)', medidas: '2,65m x 1,30m x 0,16m', preco10x: 2970.00, precoAvista: 2821.50, precoMax10: 2673.00, ativo: true },
  { id: 'je-extreme', veiculo: 'Jumpy/Expert/Scudo', nome: 'Bagageiro Jumpy/Expert/Scudo Modelo EXTREME', medidas: '3,30m x 1,30m x 0,16m', preco10x: 3470.00, precoAvista: 3296.50, precoMax10: 3123.00, ativo: true },
  { id: 'je-escada', veiculo: 'Jumpy/Expert/Scudo', nome: 'Escada Jumpy/Expert/Scudo MX 120', medidas: '1,80m x 0,30m x 0,30m', preco10x: 730.00, precoAvista: 693.50, precoMax10: 657.00, ativo: true },
  { id: 'je-deck', veiculo: 'Jumpy/Expert/Scudo', nome: 'Aplicação Deck p/ Bagageiro MX 120', medidas: 'Sob medida Jumpy', preco10x: 1960.00, precoAvista: 1862.00, precoMax10: 1764.00, ativo: true },

  // Fiat Ducato
  { id: 'du-max2023', veiculo: 'Ducato', nome: 'Bagageiro Ducato Max Cargo 2023 (Aba Lateral)', medidas: '3,65m x 1,70m x 0,10m', preco10x: 4820.00, precoAvista: 4579.00, precoMax10: 4338.00, ativo: true },

  // VW Saveiro
  { id: 'sv-simples', veiculo: 'Saveiro', nome: 'Bagageiro Saveiro Cabine Simples', medidas: 'Estrutura Reforçada CS', preco10x: 3900.00, precoAvista: 3705.00, precoMax10: 3510.00, ativo: true },
  { id: 'sv-dupla', veiculo: 'Saveiro', nome: 'Bagageiro Saveiro Cabine Dupla', medidas: 'Estrutura Reforçada CD', preco10x: 3500.00, precoAvista: 3325.00, precoMax10: 3150.00, ativo: true },
  { id: 'sv-rolete', veiculo: 'Saveiro', nome: 'Guia de Rolete Especial Saveiro', medidas: '1,00m x 0,30m x 0,16m', preco10x: 780.00, precoAvista: 634.80, precoMax10: 702.00, ativo: true },

  // Acessórios
  { id: 'ac-deck100', veiculo: 'Decks & Acessórios', nome: 'Aplicação de Deck MX 100 / 200 PLUS', medidas: '3,30m', preco10x: 1960.00, precoAvista: 1529.50, precoMax10: 1575.00, ativo: true },
  { id: 'ac-meiodeck', veiculo: 'Decks & Acessórios', nome: 'Aplicação de Meio Deck MX 100 / 200 PLUS', medidas: '3,30m', preco10x: 1080.00, precoAvista: 1026.00, precoMax10: 972.00, ativo: true },
  { id: 'ac-deck80', veiculo: 'Decks & Acessórios', nome: 'Aplicação de Deck MX 80 PLUS', medidas: '2,20m', preco10x: 1570.00, precoAvista: 1491.50, precoMax10: 1413.00, ativo: true },
  { id: 'ac-estepe', veiculo: 'Decks & Acessórios', nome: 'Suporte para Estepe', medidas: '0,25m x 0,18m x 0,19m', preco10x: 380.00, precoAvista: 361.00, precoMax10: 342.00, ativo: true },
  { id: 'ac-solar', veiculo: 'Decks & Acessórios', nome: 'Barra Fixação Placa Solar (Par)', medidas: '1,35m x 0,10m', preco10x: 340.00, precoAvista: 323.00, precoMax10: 306.00, ativo: true },
  { id: 'ac-toldo', veiculo: 'Decks & Acessórios', nome: 'Suporte Base para Toldo', medidas: '0,16m x 0,12m', preco10x: 330.00, precoAvista: 313.50, precoMax10: 297.00, ativo: true },
  { id: 'ac-toldoleroy', veiculo: 'Decks & Acessórios', nome: 'Suporte Base Toldo Leroy', medidas: '0,16m x 0,12m', preco10x: 370.00, precoAvista: 351.50, precoMax10: 333.00, ativo: true },

  // Instalação & Serviços
  { id: 'sv-inst-fiorino', veiculo: 'Instalação & Serviços', nome: 'Instalação Doblo Cargo / Fiorino', medidas: 'Serviço na Loja', preco10x: 200.00, precoAvista: 200.00, precoMax10: 200.00, ativo: true },
  { id: 'sv-inst-rebite', veiculo: 'Instalação & Serviços', nome: 'Instalação c/ Rebite (c/ Forração)', medidas: 'Serviço na Loja', preco10x: 340.00, precoAvista: 340.00, precoMax10: 340.00, ativo: true },
  { id: 'sv-inst-leroy', veiculo: 'Instalação & Serviços', nome: 'Instalação Toldo Leroy', medidas: 'Serviço na Loja', preco10x: 170.00, precoAvista: 170.00, precoMax10: 170.00, ativo: true },
  { id: 'sv-corte-clima', veiculo: 'Instalação & Serviços', nome: 'Corte p/ Climatizador', medidas: 'Personalização', preco10x: 140.00, precoAvista: 140.00, precoMax10: 140.00, ativo: true },
  { id: 'sv-zincagem', veiculo: 'Instalação & Serviços', nome: 'Tratamento de Zincagem (Até 30kg)', medidas: 'Tratamento Químico', preco10x: 390.00, precoAvista: 390.00, precoMax10: 390.00, ativo: true }
];

// Compatibilidade de interface com o projeto 3cimobiliaria
export interface Empreendimento {
  id: string;
  nome: string;
  construtora: string; // Veículo / Linha
  regiaoSp: string; // Medidas
  enderecoPlantao: string; // Fábrica SP
  faixaPrecoDe: number; // 10x sem juros
  faixaPrecoAte?: number; // À vista
  linkBookPdf?: string;
  ativo: boolean;
  createdAt?: string;
}

export const empreendimentosService = {
  async getEmpreendimentos(): Promise<Empreendimento[]> {
    return CATALOGO_ROBUSTY_2026.map(p => ({
      id: p.id,
      nome: p.nome,
      construtora: p.veiculo,
      regiaoSp: p.medidas,
      enderecoPlantao: 'Fábrica Robusty: Av. Aricanduva, 5.541 - SP',
      faixaPrecoDe: p.preco10x,
      faixaPrecoAte: p.precoAvista,
      ativo: p.ativo,
      createdAt: '2026-02-01'
    }));
  },

  async createEmpreendimento(emp: any): Promise<Empreendimento> {
    return {
      id: 'custom-' + Date.now(),
      nome: emp.nome,
      construtora: emp.construtora || 'Outro',
      regiaoSp: emp.regiaoSp || '',
      enderecoPlantao: 'Fábrica Robusty: Av. Aricanduva, 5.541 - SP',
      faixaPrecoDe: emp.faixaPrecoDe || 0,
      faixaPrecoAte: emp.faixaPrecoAte || emp.faixaPrecoDe,
      ativo: true,
      createdAt: new Date().toISOString()
    };
  },

  async updateEmpreendimento(id: string, updates: any): Promise<void> {
    const p = CATALOGO_ROBUSTY_2026.find(x => x.id === id);
    if (p) {
      if (updates.nome) p.nome = updates.nome;
      if (updates.faixaPrecoDe) p.preco10x = updates.faixaPrecoDe;
    }
  },

  async deleteEmpreendimento(id: string): Promise<void> {
    // mock delete
  }
};
