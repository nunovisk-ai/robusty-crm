import React from 'react';
import { Users, Shield, Phone, Mail, Award, CheckCircle2, Truck, Package, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UserManagerView: React.FC = () => {
  const { loginAs, user } = useAuth();

  const team = [
    {
      id: 'norlando-1',
      name: 'Norlando',
      role: 'Comercial & Atendimento',
      roleType: 'comercial' as const,
      email: 'norlando@robusty.com.br',
      phone: '(11) 96620-0052',
      color: 'bg-orange-50 border-orange-200 text-brand-700',
      badge: '🟠 COMERCIAL',
      responsibilities: [
        'Recebe todos os clientes de WhatsApp, Instagram, Facebook e Loja',
        'Atende o cliente e esclarece dúvidas técnicas de carga e fixação',
        'Identifica o veículo (Kombi, Jumpy, Fiorino, etc.) e modelo adequado',
        'Elabora e envia orçamento em 10x, à vista ou desconto máximo',
        'Quando necessário, solicita apoio do Igor para realizar cotação de frete',
        'Encaminha os pedidos após a venda para a Loja e Igor',
        'Comunica a Loja sobre os agendamentos de instalação'
      ]
    },
    {
      id: 'igor-1',
      name: 'Igor',
      role: 'Gestão, Cotações, Logística & NF',
      roleType: 'gestao' as const,
      email: 'igor@robusty.com.br',
      phone: '(11) 3774-4674',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      badge: '🔵 GESTÃO & OPERAÇÃO',
      responsibilities: [
        'Acompanha o processo comercial e operacional de ponta a ponta',
        'Realiza as cotações de frete/transportadora solicitadas pelo Norlando',
        'Cria links de pagamento quando solicitados e retorna ao Norlando',
        'Coordena informações de coleta entre a Loja e as transportadoras',
        'Agenda coletas com transportadoras parceiras (Caminho A)',
        'Providencia a emissão da Nota Fiscal do pedido destinado à coleta',
        'Emite a NF após a instalação na fábrica quando solicitada (Caminho B)'
      ]
    },
    {
      id: 'loja-1',
      name: 'Equipe Loja & Fábrica',
      role: 'Operação, Fabricação & Instalação',
      roleType: 'loja' as const,
      email: 'fabrica@robusty.com.br',
      phone: '(11) 3774-4674',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      badge: '🟣 FÁBRICA & INSTALAÇÃO',
      responsibilities: [
        'Encaminha ao Norlando os contatos recebidos presencialmente na loja',
        'Alinha a preparação dos pedidos destinados à coleta por transportadora',
        'Prepara a peça (estruturação tubular, pintura eletrostática a pó e estufa)',
        'Organiza a baia de atendimento para veículos agendados na Av. Aricanduva',
        'Realiza a instalação técnica do bagageiro com parafusos e porcas em Inox'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 select-none">
      
      {/* Banner de Apresentação */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
          Equipe Operacional & Matriz de Responsabilidades
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          Conforme o fluxograma oficial da Robusty, cada membro desempenha um papel crítico e sincronizado entre o atendimento comercial, o suporte logístico e a fábrica.
        </p>
      </div>

      {/* Cards da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {team.map((member) => {
          const isCurrent = user?.email === member.email;

          return (
            <div 
              key={member.id}
              className={`bg-white rounded-3xl border ${isCurrent ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200/90'} p-6 shadow-xs flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${member.color}`}>
                    {member.badge}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Você está aqui
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-extrabold text-lg text-slate-900">{member.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{member.role}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.email}</span>
                  </p>
                  <p className="flex items-center gap-2 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </p>
                </div>

                {/* Atribuições Oficiais do Fluxograma */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Atribuições no Fluxo:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {member.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => loginAs(member.roleType)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-slate-100 text-slate-500 cursor-default' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
              >
                {isCurrent ? 'Perfil Selecionado' : `Acessar como ${member.name}`}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
