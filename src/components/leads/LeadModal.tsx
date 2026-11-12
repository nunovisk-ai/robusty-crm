import React, { useState } from 'react';
import { Lead, FunnelStage } from '../../types';
import { 
  X, 
  Trash2, 
  Save, 
  Car, 
  Truck, 
  Phone, 
  MapPin, 
  Calendar, 
  Copy, 
  Check, 
  DollarSign 
} from 'lucide-react';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { CATALOGO_ROBUSTY_2026 } from '../../services/empreendimentosService';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { formatPhoneBR } from '../../utils/phoneMask';

interface LeadModalProps {
  lead: Lead;
  empreendimentos?: any[];
  onClose: () => void;
  onSave: (updated: Partial<Lead>) => Promise<void>;
  onDelete: (leadId: string) => Promise<void>;
  onScheduleVisit?: (lead: Lead) => void;
  onOpenChat?: (leadId: string) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  lead,
  onClose,
  onSave,
  onDelete,
  onScheduleVisit,
  onOpenChat
}) => {
  const [formData, setFormData] = useState({
    nome: lead.nome,
    telefone: lead.telefone,
    email: lead.email || '',
    cidadeUf: lead.cidadeUf || '',
    veiculoLinha: lead.veiculoLinha || 'Kombi',
    veiculoAno: lead.veiculoAno || '',
    produtoNome: lead.produtoNome || 'Bagageiro Kombi MX 100 PLUS (Aba Dupla)',
    condicaoPreco: lead.condicaoPreco || '10x',
    valorTotal: lead.valorTotal || 2600.00,
    custoInstalacao: lead.custoInstalacao || 0,
    corBagageiro: lead.corBagageiro || 'Preto Epóxi',
    modalidade: lead.modalidade || 'Caminho B: Instalação na Loja',
    solicitarCotacaoIgor: !!lead.solicitarCotacaoIgor,
    solicitouLinkPagamento: !!lead.solicitouLinkPagamento,
    necessitaNotaFiscal: !!lead.necessitaNotaFiscal,
    responsavelAtual: lead.responsavelAtual || 'Norlando',
    statusFunil: lead.statusFunil,
    observacoes: lead.observacoes || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(formData.telefone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRecalculatePrice = (novoVeiculo?: string, novoProduto?: string, novaCondicao?: '10x' | 'avista' | 'max10', novaInstal?: number) => {
    const vLinha = novoVeiculo || formData.veiculoLinha;
    const pNome = novoProduto || formData.produtoNome;
    const cond = novaCondicao || formData.condicaoPreco;
    const inst = novaInstal !== undefined ? novaInstal : formData.custoInstalacao;

    const prod = CATALOGO_ROBUSTY_2026.find(p => p.nome === pNome);
    if (!prod) return;

    let base = prod.preco10x;
    if (cond === 'avista') base = prod.precoAvista;
    if (cond === 'max10') base = prod.precoMax10;

    setFormData(prev => ({
      ...prev,
      veiculoLinha: vLinha as any,
      produtoNome: pNome,
      condicaoPreco: cond,
      custoInstalacao: inst,
      valorTotal: base + inst
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Error saving lead:', err);
      alert('Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Deseja realmente excluir o cadastro de ${formData.nome}?`)) {
      await onDelete(lead.id);
      onClose();
    }
  };

  const produtosDisponiveis = CATALOGO_ROBUSTY_2026.filter(p => p.veiculo === formData.veiculoLinha);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-heading font-extrabold text-base shadow-xs">
              {formData.nome.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900">{formData.nome}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white uppercase">
                  {formData.veiculoLinha}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                <span>{formData.telefone}</span>
                {formData.cidadeUf && <span>• {formData.cidadeUf}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenChat && (
              <button
                onClick={() => onOpenChat(lead.id)}
                className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Conversar</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          
          {/* Seção 1: Dados de Contato */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Nome do Cliente</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">WhatsApp / Telefone</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: formatPhoneBR(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                  title="Copiar número"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Cidade / Estado</label>
              <input
                type="text"
                value={formData.cidadeUf}
                onChange={(e) => setFormData({ ...formData, cidadeUf: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Seção 2: Especificação do Veículo & Bagageiro */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between font-heading font-bold text-xs text-slate-900">
              <span className="flex items-center gap-1.5 uppercase">
                <Car className="w-4 h-4 text-brand-600" />
                <span>Veículo & Modelo de Bagageiro Robusty</span>
              </span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 text-sm font-bold">
                {currencyFormatter(formData.valorTotal)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Linha do Veículo</label>
                <select
                  value={formData.veiculoLinha}
                  onChange={(e) => {
                    const novoV = e.target.value;
                    const primeiroP = CATALOGO_ROBUSTY_2026.find(p => p.veiculo === novoV);
                    handleRecalculatePrice(novoV, primeiroP ? primeiroP.nome : formData.produtoNome);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-semibold focus:border-brand-500 focus:outline-none"
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
                <label className="block text-slate-700 font-bold mb-1">Modelo de Bagageiro (Fev/2026)</label>
                <select
                  value={formData.produtoNome}
                  onChange={(e) => handleRecalculatePrice(undefined, e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-semibold focus:border-brand-500 focus:outline-none"
                >
                  {produtosDisponiveis.map(p => (
                    <option key={p.id} value={p.nome}>
                      {p.nome} — 10x {currencyFormatter(p.preco10x)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condições de Pagamento e Instalação */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Tabela Catálogo</label>
                <select
                  value={formData.condicaoPreco}
                  onChange={(e) => handleRecalculatePrice(undefined, undefined, e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="10x">💳 10x Sem Juros</option>
                  <option value="avista">💵 À Vista (5% Desconto)</option>
                  <option value="max10">🔥 Com 10% (MAX)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Serviço de Instalação</label>
                <select
                  value={formData.custoInstalacao}
                  onChange={(e) => handleRecalculatePrice(undefined, undefined, undefined, Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value={0}>Grátis na Fábrica (R$ 0)</option>
                  <option value={200}>Fiorino/Doblo (+ R$ 200)</option>
                  <option value={340}>Rebite c/ Forração (+ R$ 340)</option>
                  <option value={170}>Toldo Leroy (+ R$ 170)</option>
                  <option value={140}>Corte Climatizador (+ R$ 140)</option>
                  <option value={390}>Zincagem (+ R$ 390)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cor do Bagageiro</label>
                <select
                  value={formData.corBagageiro}
                  onChange={(e) => setFormData({ ...formData, corBagageiro: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="Preto Epóxi">Preto Epóxi</option>
                  <option value="Branco Epóxi">Branco Epóxi</option>
                  <option value="Sem Pintura (Zinco)">Zinco / Sem Pintura</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção 3: Fluxograma Oficial (Norlando, Igor & Loja) */}
          <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200 space-y-3">
            <span className="font-heading font-bold text-xs text-brand-800 uppercase block">
              Controle Operacional (Norlando • Igor • Loja)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Responsável Atual</label>
                <select
                  value={formData.responsavelAtual}
                  onChange={(e) => setFormData({ ...formData, responsavelAtual: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-semibold focus:border-brand-500 focus:outline-none"
                >
                  <option value="Norlando">🟠 Norlando (Comercial / Vendedor)</option>
                  <option value="Igor">🔵 Igor (Cotação / Link / Logística / NF)</option>
                  <option value="Loja">🟣 Loja (Preparação / Instalação)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Modalidade Definida</label>
                <select
                  value={formData.modalidade}
                  onChange={(e) => setFormData({ ...formData, modalidade: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-medium focus:border-brand-500 focus:outline-none"
                >
                  <option value="Caminho B: Instalação na Loja">🟣 Caminho B: Instalação na Loja (Av. Aricanduva)</option>
                  <option value="Caminho A: Entrega Transportadora">🔵 Caminho A: Entrega por Transportadora</option>
                  <option value="A Definir">⏳ A Definir</option>
                </select>
              </div>
            </div>

            {/* Checkboxes de alinhamento com Igor */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-orange-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.solicitarCotacaoIgor}
                  onChange={(e) => setFormData({ ...formData, solicitarCotacaoIgor: e.target.checked })}
                  className="accent-brand-500 rounded"
                />
                <span className="text-slate-800 font-medium">Cotação c/ Igor</span>
              </label>

              <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-orange-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.solicitouLinkPagamento}
                  onChange={(e) => setFormData({ ...formData, solicitouLinkPagamento: e.target.checked })}
                  className="accent-brand-500 rounded"
                />
                <span className="text-slate-800 font-medium">Link de Pagamento</span>
              </label>

              <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-orange-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.necessitaNotaFiscal}
                  onChange={(e) => setFormData({ ...formData, necessitaNotaFiscal: e.target.checked })}
                  className="accent-brand-500 rounded"
                />
                <span className="text-slate-800 font-medium">Nota Fiscal (NF)</span>
              </label>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Anotações / Histórico</label>
            <textarea
              rows={3}
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir Cadastro</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="py-2.5 px-5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
