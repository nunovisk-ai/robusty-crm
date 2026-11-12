import React, { useState } from 'react';
import { Lead, FunnelStage } from '../../types';
import { X, UserPlus, Car, DollarSign } from 'lucide-react';
import { formatPhoneBR } from '../../utils/phoneMask';
import { CATALOGO_ROBUSTY_2026, ProdutoRobusty } from '../../services/empreendimentosService';
import { currencyFormatter } from '../../utils/currencyFormatter';

interface NewLeadModalProps {
  initialValues?: Partial<Lead>;
  onClose: () => void;
  onCreate: (newLead: Partial<Lead>) => Promise<void>;
  defaultFunnel?: 'leads' | 'pedidos';
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  initialValues,
  onClose,
  onCreate,
  defaultFunnel = 'leads'
}) => {
  const [nome, setNome] = useState(initialValues?.nome || '');
  const [telefone, setTelefone] = useState(initialValues?.telefone ? formatPhoneBR(initialValues.telefone) : '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [cidadeUf, setCidadeUf] = useState(initialValues?.cidadeUf || 'São Paulo / SP');
  const [origemLead, setOrigemLead] = useState<'whatsapp' | 'instagram' | 'facebook' | 'loja_presencial' | 'indicacao' | 'outro'>(
    (initialValues?.origemLead as any) || 'whatsapp'
  );

  // Veículo e Catálogo
  const [veiculoLinha, setVeiculoLinha] = useState<any>(initialValues?.veiculoLinha || 'Kombi');
  const [veiculoAno, setVeiculoAno] = useState(initialValues?.veiculoAno || '');
  const [produtoNome, setProdutoNome] = useState(initialValues?.produtoNome || 'Bagageiro Kombi MX 100 PLUS (Aba Dupla)');
  const [condicaoPreco, setCondicaoPreco] = useState<'10x' | 'avista' | 'max10'>('10x');
  const [custoInstalacao, setCustoInstalacao] = useState<number>(0);
  const [corBagageiro, setCorBagageiro] = useState(initialValues?.corBagageiro || 'Preto Epóxi');

  // Operação / Processo
  const [modalidade, setModalidade] = useState<any>(initialValues?.modalidade || 'Caminho B: Instalação na Loja');
  const [responsavelAtual, setResponsavelAtual] = useState<'Norlando' | 'Igor' | 'Loja'>('Norlando');
  const [solicitarCotacaoIgor, setSolicitarCotacaoIgor] = useState(false);
  const [solicitouLinkPagamento, setSolicitouLinkPagamento] = useState(false);
  const [necessitaNotaFiscal, setNecessitaNotaFiscal] = useState(true);
  const [observacoes, setObservacoes] = useState(initialValues?.observacoes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Produtos filtrados pelo veículo
  const produtosDisponiveis = CATALOGO_ROBUSTY_2026.filter(p => p.veiculo === veiculoLinha);

  // Cálculo do preço conforme tabela do catálogo
  const prodAtual = CATALOGO_ROBUSTY_2026.find(p => p.nome === produtoNome) || produtosDisponiveis[0] || CATALOGO_ROBUSTY_2026[0];
  let precoBase = prodAtual.preco10x;
  if (condicaoPreco === 'avista') precoBase = prodAtual.precoAvista;
  if (condicaoPreco === 'max10') precoBase = prodAtual.precoMax10;
  const valorTotalFinal = precoBase + custoInstalacao;

  const handleVeiculoChange = (novoVeiculo: any) => {
    setVeiculoLinha(novoVeiculo);
    const primeiroProd = CATALOGO_ROBUSTY_2026.find(p => p.veiculo === novoVeiculo);
    if (primeiroProd) setProdutoNome(primeiroProd.nome);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) {
      alert('Nome e WhatsApp são obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim() || undefined,
        cidadeUf: cidadeUf.trim() || undefined,
        veiculoLinha,
        veiculoAno: veiculoAno.trim() || undefined,
        produtoNome,
        condicaoPreco,
        valorTotal: valorTotalFinal,
        custoInstalacao,
        corBagageiro,
        modalidade,
        solicitarCotacaoIgor,
        solicitouLinkPagamento,
        necessitaNotaFiscal,
        responsavelAtual,
        funilAtual: defaultFunnel,
        statusFunil: defaultFunnel === 'pedidos' ? 'pedido_definido' : 'novo_lead',
        origemLead,
        observacoes: observacoes.trim() || undefined,
      });
      onClose();
    } catch (err) {
      console.error('Error creating lead:', err);
      alert('Erro ao cadastrar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-brand-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-900">
                {defaultFunnel === 'pedidos' ? 'Novo Pedido de Produção' : 'Novo Atendimento Comercial'}
              </h3>
              <p className="text-xs text-slate-500">Robusty Bagageiros Automotivos</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          
          {/* Seção 1: Dados do Cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Nome do Cliente *</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Carlos Eduardo"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">WhatsApp / Telefone *</label>
              <input
                type="text"
                required
                value={telefone}
                onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
                placeholder="(11) 99999-9999"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Cidade / UF</label>
              <input
                type="text"
                value={cidadeUf}
                onChange={(e) => setCidadeUf(e.target.value)}
                placeholder="Ex: São Paulo / SP"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Origem do Contato</label>
              <select
                value={origemLead}
                onChange={(e) => setOrigemLead(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
              >
                <option value="whatsapp">🟢 WhatsApp</option>
                <option value="instagram">🟣 Instagram</option>
                <option value="facebook">🔵 Facebook</option>
                <option value="loja_presencial">🏪 Presencial na Loja</option>
                <option value="indicacao">🤝 Indicação</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Responsável Inicial</label>
              <select
                value={responsavelAtual}
                onChange={(e) => setResponsavelAtual(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none font-semibold"
              >
                <option value="Norlando">🟠 Norlando (Comercial)</option>
                <option value="Igor">🔵 Igor (Gestão & NF)</option>
                <option value="Loja">🟣 Loja (Instalação)</option>
              </select>
            </div>
          </div>

          {/* Seção 2: Veículo & Produto Oficial do Catálogo */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-heading font-bold text-xs text-slate-900 uppercase">
              <Car className="w-3.5 h-3.5 text-brand-600" />
              <span>Veículo e Modelo (Catálogo Fev/2026)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Linha do Veículo *</label>
                <select
                  value={veiculoLinha}
                  onChange={(e) => handleVeiculoChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-brand-500 focus:outline-none font-semibold"
                >
                  <option value="Kombi">VW Kombi</option>
                  <option value="Kangoo">Renault Kangoo</option>
                  <option value="Fiorino">Fiat Fiorino</option>
                  <option value="Doblo">Fiat Doblo</option>
                  <option value="Jumpy/Expert/Scudo">Jumpy / Expert / Scudo</option>
                  <option value="Ducato">Fiat Ducato Max Cargo</option>
                  <option value="Saveiro">VW Saveiro</option>
                  <option value="Decks & Acessórios">Decks & Acessórios</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Modelo de Bagageiro *</label>
                <select
                  value={produtoNome}
                  onChange={(e) => setProdutoNome(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-brand-500 focus:outline-none font-semibold"
                >
                  {produtosDisponiveis.map(p => (
                    <option key={p.id} value={p.nome}>
                      {p.nome} — 10x {currencyFormatter(p.preco10x)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condição de Preço e Taxa */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Condição Catálogo</label>
                <select
                  value={condicaoPreco}
                  onChange={(e) => setCondicaoPreco(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="10x">💳 10x Sem Juros</option>
                  <option value="avista">💵 À Vista (5% desc.)</option>
                  <option value="max10">🔥 Desconto Máximo (10% MAX)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Instalação / Serviço</label>
                <select
                  value={custoInstalacao}
                  onChange={(e) => setCustoInstalacao(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value={0}>Grátis na Fábrica (R$ 0)</option>
                  <option value={200}>Fiorino / Doblo (+ R$ 200)</option>
                  <option value={340}>Rebite c/ Forração (+ R$ 340)</option>
                  <option value={170}>Toldo Leroy (+ R$ 170)</option>
                  <option value={140}>Corte Climatizador (+ R$ 140)</option>
                  <option value={390}>Zincagem (+ R$ 390)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Valor Calculado</label>
                <div className="w-full bg-white border border-emerald-300 text-emerald-800 font-mono font-bold text-sm rounded-xl px-3 py-2 flex items-center justify-between">
                  <span>{currencyFormatter(valorTotalFinal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 3: Modalidade e Fluxograma Oficial */}
          <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-brand-800 uppercase">
                Modalidade de Atendimento & Decisões do Fluxograma
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Modalidade (Caminho A ou B)</label>
                <select
                  value={modalidade}
                  onChange={(e) => setModalidade(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-brand-500 focus:outline-none font-medium"
                >
                  <option value="Caminho B: Instalação na Loja">🟣 Caminho B: Instalação na Loja (Av. Aricanduva)</option>
                  <option value="Caminho A: Entrega Transportadora">🔵 Caminho A: Entrega por Transportadora</option>
                  <option value="A Definir">⏳ A Definir</option>
                </select>
              </div>

              <div className="flex flex-col justify-center space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={solicitarCotacaoIgor}
                    onChange={(e) => setSolicitarCotacaoIgor(e.target.checked)}
                    className="accent-brand-500 rounded"
                  />
                  <span className="text-slate-800 font-medium">Solicitar cotação de frete ao Igor?</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={solicitouLinkPagamento}
                    onChange={(e) => setSolicitouLinkPagamento(e.target.checked)}
                    className="accent-brand-500 rounded"
                  />
                  <span className="text-slate-800 font-medium">Cliente solicitou Link de Pagamento (Igor)?</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={necessitaNotaFiscal}
                    onChange={(e) => setNecessitaNotaFiscal(e.target.checked)}
                    className="accent-brand-500 rounded"
                  />
                  <span className="text-slate-800 font-medium">Necessita Nota Fiscal (Igor emitirá)?</span>
                </label>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Observações / Histórico de Conversa</label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Cliente quer viajar em dezembro. Pagamento no PIX. Kombi Clipper com teto alto..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar no CRM'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
