import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Car, 
  Check, 
  FileText, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CATALOGO_ROBUSTY_2026, ProdutoRobusty } from '../../services/empreendimentosService';
import { currencyFormatter } from '../../utils/currencyFormatter';

interface EmpreendimentosManagerProps {
  onSelectProductForLead?: (produto: ProdutoRobusty) => void;
}

export const EmpreendimentosManager: React.FC<EmpreendimentosManagerProps> = ({
  onSelectProductForLead
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('ALL');

  const filteredProducts = CATALOGO_ROBUSTY_2026.filter(p => {
    if (vehicleFilter !== 'ALL' && p.veiculo !== vehicleFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.nome.toLowerCase().includes(term) ||
      p.veiculo.toLowerCase().includes(term) ||
      p.medidas.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 select-none">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-brand-700 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>CATÁLOGO OFICIAL • FEVEREIRO 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
            Catálogo de Bagageiros & Acessórios Robusty
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Modelos de alta resistência produzidos em aço carbono tubular de 1 polegada com pintura epóxi eletrostática. Tabela oficial de preços em 10x sem juros, À Vista (5% desc.) e Desconto Máximo (10% MAX).
          </p>
        </div>

        {/* Informações da Fábrica */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1">
          <p className="font-bold text-slate-800">Fábrica & Showroom São Paulo</p>
          <p className="text-slate-500">Av. Aricanduva, 5.541 - Vila Aricanduva</p>
          <p className="text-emerald-700 font-semibold font-mono">WhatsApp: (11) 96620-0052</p>
        </div>
      </div>

      {/* Controles de Filtro e Busca */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar modelo, veículo ou medida..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:bg-white focus:border-brand-500 focus:outline-none"
          >
            <option value="ALL">🚗 Todas as Linhas de Veículos</option>
            <option value="Kombi">VW Kombi (MX 100, MX 200, MX 80, MX 50)</option>
            <option value="Kangoo">Renault Kangoo / Nova Kangoo</option>
            <option value="Fiorino">Fiat Fiorino (FX 100 / FX 200)</option>
            <option value="Doblo">Fiat Doblo (DX 100 / DX 200)</option>
            <option value="Jumpy/Expert/Scudo">Jumpy / Expert / Scudo</option>
            <option value="Ducato">Fiat Ducato Max Cargo 2023</option>
            <option value="Saveiro">VW Saveiro (Simples / Dupla)</option>
            <option value="Decks & Acessórios">Decks, Escadas & Suportes</option>
            <option value="Instalação & Serviços">Instalação & Serviços</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Exibindo <strong>{filteredProducts.length}</strong> produtos
        </div>

      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(prod => (
          <div 
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200/90 hover:border-brand-500 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  {prod.veiculo}
                </span>
                <span className="text-[11px] font-mono text-slate-500">{prod.medidas}</span>
              </div>

              <h3 className="font-heading font-extrabold text-sm text-slate-900 leading-snug">
                {prod.nome}
              </h3>

              {/* Tabela de Preço Oficial */}
              <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">💳 10x sem juros:</span>
                  <strong className="font-mono text-slate-900">{currencyFormatter(prod.preco10x)}</strong>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/80 pt-1">
                  <span className="text-emerald-700 font-semibold">💵 À vista (5% desc.):</span>
                  <strong className="font-mono text-emerald-700">{currencyFormatter(prod.precoAvista)}</strong>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/80 pt-1">
                  <span className="text-brand-700 font-semibold">🔥 Com 10% (MAX):</span>
                  <strong className="font-mono text-brand-700">{currencyFormatter(prod.precoMax10)}</strong>
                </div>
              </div>
            </div>

            {/* Ação */}
            {onSelectProductForLead && (
              <button
                onClick={() => onSelectProductForLead(prod)}
                className="w-full bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Usar em Novo Orçamento</span>
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
