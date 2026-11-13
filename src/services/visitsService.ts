import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Visit } from '../types';

export interface CreateVisitInput {
  leadId: string;
  empreendimentoNome: string;
  enderecoPlantao?: string;
  dataHora: string;
  observacoes?: string;
  corretorId?: string;
}

const STORAGE_KEY = 'robusty_crm_instalacoes_data';

const SEED_VISITS: Visit[] = [
  {
    id: 'visit-seed-1',
    leadId: 'lead-1',
    leadNome: 'Carlos Eduardo (Kombi Corujinha 74)',
    leadTelefone: '(11) 98834-1122',
    empreendimentoNome: 'Bagageiro Kombi MX 100 PLUS (Aba Dupla)',
    enderecoPlantao: 'Fábrica Robusty: Av. Aricanduva, 5.541 - São Paulo/SP',
    dataHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    realizada: null,
    observacoes: 'Instalação agendada na fábrica com montagem completa no teto da Kombi.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function getStoredVisits(): Visit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_VISITS));
      return SEED_VISITS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_VISITS;
  }
}

function saveStoredVisits(visits: Visit[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch (err) {
    console.error('Falha ao salvar no localStorage:', err);
  }
}

export const visitsService = {
  /**
   * Fetches all visits joined with lead details (name, phone)
   */
  async getVisits(): Promise<Visit[]> {
    if (isSupabaseConfigured) {
      // 1. Tentar tabela oficial agendamentos (Robusty)
      try {
        const { data: agData, error: agErr } = await supabase
          .from('agendamentos')
          .select('*, leads(nome, telefone, produto_nome)')
          .order('data_hora', { ascending: true });

        if (!agErr && agData) {
          const list: Visit[] = agData.map(row => {
            const leadInfo = row.leads || {};
            return {
              id: row.id,
              leadId: row.lead_id,
              leadNome: leadInfo.nome || 'Cliente',
              leadTelefone: leadInfo.telefone || '',
              empreendimentoNome: leadInfo.produto_nome || row.tipo || 'Bagageiro Robusty',
              enderecoPlantao: row.local_endereco || 'Fábrica Robusty: Av. Aricanduva, 5.541 - SP',
              dataHora: row.data_hora,
              realizada: row.realizado,
              observacoes: row.observacoes,
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            };
          });
          saveStoredVisits(list);
          return list;
        }
      } catch (err) {
        console.warn('Tentativa com agendamentos:', err);
      }

      // 2. Fallback para tabela visitas se existir
      try {
        const { data, error } = await supabase
          .from('visitas')
          .select('*, leads(nome, telefone)')
          .order('data_hora', { ascending: true });

        if (!error && data && data.length >= 0) {
          const list: Visit[] = data.map(row => {
            const leadInfo = row.leads || {};
            return {
              id: row.id,
              leadId: row.lead_id,
              leadNome: leadInfo.nome || row.empreendimento_nome || 'Cliente',
              leadTelefone: leadInfo.telefone || '',
              corretorId: row.corretor_id,
              empreendimentoNome: row.empreendimento_nome || 'Bagageiro Robusty',
              enderecoPlantao: row.endereco_plantao || 'Fábrica Robusty: Av. Aricanduva, 5.541 - SP',
              dataHora: row.data_hora,
              realizada: row.realizada,
              motivoNaoComparecimento: row.motivo_nao_comparecimento,
              observacoes: row.observacoes,
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            };
          });
          saveStoredVisits(list);
          return list;
        }
      } catch (err) {
        console.warn('Tentativa com visitas:', err);
      }
    }

    return getStoredVisits();
  },

  /**
   * Creates a new scheduled visit and moves lead to 'visita_agendada'
   */
  async createVisit(input: CreateVisitInput): Promise<Visit> {
    const localId = 'inst-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newVisit: Visit = {
      id: localId,
      leadId: input.leadId,
      empreendimentoNome: input.empreendimentoNome || 'Bagageiro Robusty',
      enderecoPlantao: input.enderecoPlantao || 'Fábrica Robusty: Av. Aricanduva, 5.541 - SP',
      dataHora: input.dataHora,
      observacoes: input.observacoes,
      realizada: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Salvar localmente imediatamente
    const current = getStoredVisits();
    const updated = [newVisit, ...current];
    saveStoredVisits(updated);

    // Persistir no Supabase
    if (isSupabaseConfigured) {
      // 1. Inserir em agendamentos
      try {
        const agPayload = {
          lead_id: input.leadId,
          tipo: 'Instalação na Fábrica',
          local_endereco: input.enderecoPlantao || 'Fábrica Robusty: Av. Aricanduva, 5.541 - SP',
          data_hora: input.dataHora,
          realizado: null,
          observacoes: input.observacoes || `${input.empreendimentoNome || 'Bagageiro Robusty'}`
        };

        const { data: agData, error: agErr } = await supabase
          .from('agendamentos')
          .insert([agPayload])
          .select('*, leads(nome, telefone, produto_nome)')
          .single();

        if (!agErr && agData) {
          const leadInfo = agData.leads || {};
          const syncedVisit: Visit = {
            id: agData.id,
            leadId: agData.lead_id,
            leadNome: leadInfo.nome || newVisit.leadNome,
            leadTelefone: leadInfo.telefone || newVisit.leadTelefone,
            empreendimentoNome: leadInfo.produto_nome || input.empreendimentoNome,
            enderecoPlantao: agData.local_endereco || newVisit.enderecoPlantao,
            dataHora: agData.data_hora,
            realizada: agData.realizado,
            observacoes: agData.observacoes,
            createdAt: agData.created_at,
            updatedAt: agData.updated_at,
          };
          const listWithRemote = updated.map(v => v.id === localId ? syncedVisit : v);
          saveStoredVisits(listWithRemote);
          return syncedVisit;
        }
      } catch (err: any) {
        console.warn('Tentativa agendamentos:', err?.message || err);
      }

      // 2. Inserir em visitas (caso exista)
      try {
        const payload = {
          lead_id: input.leadId,
          empreendimento_nome: input.empreendimentoNome,
          endereco_plantao: input.enderecoPlantao || null,
          data_hora: input.dataHora,
          observacoes: input.observacoes || null,
          corretor_id: input.corretorId || null,
          realizada: null,
        };

        const { data, error } = await supabase
          .from('visitas')
          .insert([payload])
          .select('*, leads(nome, telefone)')
          .single();

        if (!error && data) {
          const leadInfo = data.leads || {};
          const syncedVisit: Visit = {
            id: data.id,
            leadId: data.lead_id,
            leadNome: leadInfo.nome || newVisit.leadNome,
            leadTelefone: leadInfo.telefone || newVisit.leadTelefone,
            corretorId: data.corretor_id,
            empreendimentoNome: data.empreendimento_nome,
            enderecoPlantao: data.endereco_plantao || newVisit.enderecoPlantao,
            dataHora: data.data_hora,
            realizada: data.realizada,
            motivoNaoComparecimento: data.motivo_nao_comparecimento,
            observacoes: data.observacoes,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
          const listWithRemote = updated.map(v => v.id === localId ? syncedVisit : v);
          saveStoredVisits(listWithRemote);
          return syncedVisit;
        }
      } catch (err: any) {
        console.warn('Tentativa visitas:', err?.message || err);
      }

      // Atualizar status_funil do lead no Supabase
      try {
        await supabase
          .from('leads')
          .update({
            status_funil: 'aguardando_entrega_instalacao',
            ultima_interacao_at: new Date().toISOString()
          })
          .eq('id', input.leadId);
      } catch (err) {
        // silencioso
      }
    }

    return newVisit;
  },

  /**
   * Records visit outcome: Realizada (true) or Não Compareceu (false with reason)
   */
  async updateVisitOutcome(visitId: string, realizada: boolean, motivoNaoComparecimento?: string): Promise<void> {
    const list = getStoredVisits().map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          realizada,
          motivoNaoComparecimento: realizada ? undefined : (motivoNaoComparecimento || 'Cliente não compareceu'),
          updatedAt: new Date().toISOString()
        };
      }
      return v;
    });
    saveStoredVisits(list);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('agendamentos')
          .update({
            realizado: realizada,
            updated_at: new Date().toISOString(),
          })
          .eq('id', visitId);
      } catch (err) {
        console.warn('Erro ao atualizar agendamentos:', err);
      }

      try {
        await supabase
          .from('visitas')
          .update({
            realizada,
            motivo_nao_comparecimento: realizada ? null : (motivoNaoComparecimento || 'Cliente não compareceu'),
            updated_at: new Date().toISOString(),
          })
          .eq('id', visitId);
      } catch (err) {
        console.warn('Erro ao atualizar visitas:', err);
      }
    }
  },

  /**
   * Reschedules an existing visit to a new date/time and resets status to pending (null)
   */
  async rescheduleVisit(visitId: string, novaDataHora: string, novasObservacoes?: string): Promise<void> {
    const list = getStoredVisits().map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          dataHora: novaDataHora,
          realizada: null,
          motivoNaoComparecimento: undefined,
          observacoes: novasObservacoes ? `${v.observacoes ? v.observacoes + ' | ' : ''}${novasObservacoes}` : v.observacoes,
          updatedAt: new Date().toISOString()
        };
      }
      return v;
    });
    saveStoredVisits(list);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('agendamentos')
          .update({
            data_hora: novaDataHora,
            realizado: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', visitId);
      } catch (err) {
        console.warn('Erro ao reagendar agendamentos:', err);
      }

      try {
        const payload: any = {
          data_hora: novaDataHora,
          realizada: null,
          motivo_nao_comparecimento: null,
          updated_at: new Date().toISOString(),
        };
        if (novasObservacoes) {
          payload.observacoes = novasObservacoes;
        }

        await supabase
          .from('visitas')
          .update(payload)
          .eq('id', visitId);
      } catch (err) {
        console.warn('Erro ao reagendar visitas:', err);
      }
    }
  },

  /**
   * Deletes a scheduled visit
   */
  async deleteVisit(visitId: string): Promise<void> {
    const list = getStoredVisits().filter(v => v.id !== visitId);
    saveStoredVisits(list);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('agendamentos')
          .delete()
          .eq('id', visitId);
      } catch (err) {
        console.warn('Erro ao excluir agendamentos:', err);
      }

      try {
        await supabase
          .from('visitas')
          .delete()
          .eq('id', visitId);
      } catch (err) {
        console.warn('Erro ao excluir visitas:', err);
      }
    }
  },

  /**
   * Generates Google Calendar direct URL with event pre-filled
   */
  getGoogleCalendarUrl(visit: Visit): string {
    const startDate = new Date(visit.dataHora);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration default

    const formatDateUtc = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dates = `${formatDateUtc(startDate)}/${formatDateUtc(endDate)}`;

    const title = `Instalação Robusty - ${visit.empreendimentoNome} (${visit.leadNome || 'Cliente'})`;
    const details = [
      `🚗 Cliente: ${visit.leadNome || 'Cliente'}`,
      `📞 Telefone: ${visit.leadTelefone || 'N/A'}`,
      `📦 Modelo / Bagageiro: ${visit.empreendimentoNome}`,
      `📍 Local: ${visit.enderecoPlantao || 'Fábrica Robusty - Av. Aricanduva, 5.541, SP'}`,
      visit.observacoes ? `📝 Observações: ${visit.observacoes}` : '',
      '\nRobusty Bagageiros & Acessórios Automotivos'
    ].filter(Boolean).join('\n');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: dates,
      details: details,
      location: visit.enderecoPlantao || 'Av. Aricanduva, 5.541 - Vila Aricanduva, São Paulo - SP'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  },

  /**
   * Generates and triggers download of .ics calendar file for Apple Calendar (iPhone/iCloud) & Outlook
   */
  downloadIcsFile(visit: Visit): void {
    const startDate = new Date(visit.dataHora);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatDateIcs = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Robusty Bagageiros//CRM//PT-BR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${visit.id || Date.now()}@robusty.com.br`,
      `DTSTAMP:${formatDateIcs(new Date())}`,
      `DTSTART:${formatDateIcs(startDate)}`,
      `DTEND:${formatDateIcs(endDate)}`,
      `SUMMARY:Instalação Robusty: ${visit.empreendimentoNome} com ${visit.leadNome || 'Cliente'}`,
      `DESCRIPTION:Cliente: ${visit.leadNome || 'Cliente'}\\nTelefone: ${visit.leadTelefone || 'N/A'}\\nBagageiro: ${visit.empreendimentoNome}\\nObs: ${visit.observacoes || 'N/A'}\\n\\nRobusty Bagageiros`,
      `LOCATION:${visit.enderecoPlantao || 'Av. Aricanduva, 5.541 - Vila Aricanduva, São Paulo - SP'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const safeName = (visit.leadNome || 'cliente').toLowerCase().replace(/\s+/g, '_');
    link.setAttribute('download', `instalacao_${safeName}_${visit.empreendimentoNome.toLowerCase().replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Formats a professional WhatsApp confirmation message to send to the lead
   */
  getWhatsAppConfirmationMessage(visit: Visit): string {
    const visitDate = new Date(visit.dataHora);
    const dataFormatada = visitDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const horaFormatada = visitDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const localInstalacao = visit.enderecoPlantao || 'Fábrica Robusty: Av. Aricanduva, 5.541 - Vila Aricanduva, São Paulo - SP';

    return `Olá, *${visit.leadNome}*! Tudo bem? 👋\n\n` +
      `Aqui é da equipe da *Robusty Bagageiros* confirmando o seu agendamento de instalação do *${visit.empreendimentoNome}*! 🚗🔧\n\n` +
      `📅 *Data:* ${dataFormatada}\n` +
      `⏰ *Horário:* ${horaFormatada}\n` +
      `📍 *Local de Instalação:* ${localInstalacao}\n\n` +
      `🗺️ *Localização no Google Maps:* https://maps.google.com/?q=${encodeURIComponent(localInstalacao)}\n\n` +
      `Nossa equipe da fábrica deixará a sua estrutura pronta para instalação rápida e segura no seu veículo. 🛠️✨\n\n` +
      `Por favor, me responda confirmando se o dia e horário continuam certos para você. Até logo! 🤝`;
  }
};
