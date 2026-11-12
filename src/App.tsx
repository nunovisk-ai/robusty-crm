import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginCard } from './components/auth/LoginCard';
import { AppLayout } from './components/layout/AppLayout';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { LeadModal } from './components/leads/LeadModal';
import { NewLeadModal } from './components/leads/NewLeadModal';
import { EmpreendimentosManager } from './components/empreendimentos/EmpreendimentosManager';
import { AgendaView } from './components/agenda/AgendaView';
import { ScheduleVisitModal } from './components/agenda/ScheduleVisitModal';
import { WhatsAppInboxView } from './components/whatsapp/WhatsAppInboxView';
import { WhatsAppConnectModal } from './components/whatsapp/WhatsAppConnectModal';
import { UserManagerView } from './components/users/UserManagerView';
import { Lead, FunnelStage, WhatsAppInstance } from './types';
import { leadsService } from './services/leadsService';
import { empreendimentosService, Empreendimento } from './services/empreendimentosService';

const AppContent: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'kanban' | 'empreendimentos' | 'agenda' | 'whatsapp' | 'usuarios'>('kanban');
  const [activeFunnelType, setActiveFunnelType] = useState<'leads' | 'pedidos'>('leads');

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // Catálogo state
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);

  // Agendamento de Instalação na Fábrica
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
  const [leadForVisit, setLeadForVisit] = useState<Lead | null>(null);

  // WhatsApp
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [chatTargetLeadId, setChatTargetLeadId] = useState<string | null>(null);
  const [whatsappInstance, setWhatsappInstance] = useState<WhatsAppInstance | null>({
    id: 'inst-robusty-1',
    sessionName: 'robusty_comercial',
    phoneNumber: '5511966200052',
    status: 'connected',
    connectedAt: new Date().toISOString()
  });

  const loadData = async () => {
    setIsLeadsLoading(true);
    try {
      const [leadsData, empsData] = await Promise.all([
        leadsService.getLeads(),
        empreendimentosService.getEmpreendimentos()
      ]);
      setLeads(leadsData);
      setEmpreendimentos(empsData);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setIsLeadsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleMoveLead = async (leadId: string, newStatus: FunnelStage) => {
    // Atualização otimista
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, statusFunil: newStatus } : l));
    try {
      await leadsService.updateLead(leadId, { statusFunil: newStatus });
      await loadData();
    } catch (err) {
      console.error('Error moving lead:', err);
      await loadData();
    }
  };

  const handleConvertToOrder = async (leadId: string) => {
    try {
      await leadsService.convertLeadToOrder(leadId);
      await loadData();
      setActiveFunnelType('pedidos');
      setActiveTab('kanban');
    } catch (err) {
      console.error('Error converting to order:', err);
    }
  };

  const handleCreateLead = async (newLead: Partial<Lead>) => {
    await leadsService.createLead(newLead);
    await loadData();
  };

  const handleUpdateLead = async (updated: Partial<Lead>) => {
    if (!selectedLead) return;
    await leadsService.updateLead(selectedLead.id, updated);
    setSelectedLead(null);
    await loadData();
  };

  const handleDeleteLead = async (leadId: string) => {
    await leadsService.deleteLead(leadId);
    setSelectedLead(null);
    await loadData();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginCard />;
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={(tab: any) => setActiveTab(tab)}
      activeFunnelType={activeFunnelType}
      onFunnelTypeChange={(type) => {
        setActiveFunnelType(type);
        setActiveTab('kanban');
      }}
      onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
      unreadWhatsAppCount={2}
    >
      {activeTab === 'kanban' && (
        <KanbanBoard
          leads={leads}
          isLoading={isLeadsLoading}
          onRefresh={loadData}
          onSelectLead={(lead) => setSelectedLead(lead)}
          onNewLead={() => setIsNewLeadModalOpen(true)}
          onMoveLead={handleMoveLead}
          onScheduleVisit={(lead) => {
            setLeadForVisit(lead);
            setIsScheduleVisitOpen(true);
          }}
          onOpenChat={(leadId) => {
            setChatTargetLeadId(leadId);
            setActiveTab('whatsapp');
          }}
          activeFunnelType={activeFunnelType}
          onFunnelTypeChange={setActiveFunnelType}
          onConvertToOrder={handleConvertToOrder}
        />
      )}

      {activeTab === 'empreendimentos' && (
        <EmpreendimentosManager
          onSelectProductForLead={(prod) => {
            setIsNewLeadModalOpen(true);
          }}
        />
      )}

      {activeTab === 'agenda' && (
        <AgendaView
          leads={leads}
          empreendimentos={empreendimentos}
          onSelectLead={(lead) => setSelectedLead(lead)}
          onLeadStatusChanged={loadData}
        />
      )}

      {activeTab === 'whatsapp' && (
        <WhatsAppInboxView
          leads={leads}
          initialSelectedLeadId={chatTargetLeadId}
          instance={whatsappInstance}
          empreendimentos={empreendimentos}
          onSelectLeadForCRM={(lead) => setSelectedLead(lead)}
          onScheduleVisit={(lead) => {
            setLeadForVisit(lead);
            setIsScheduleVisitOpen(true);
          }}
          onLeadStageChange={handleMoveLead}
          onOpenConnectModal={() => setIsWhatsAppModalOpen(true)}
        />
      )}

      {activeTab === 'usuarios' && (
        <UserManagerView />
      )}

      {/* Modal Novo Lead */}
      {isNewLeadModalOpen && (
        <NewLeadModal
          onClose={() => setIsNewLeadModalOpen(false)}
          onCreate={handleCreateLead}
          defaultFunnel={activeFunnelType}
        />
      )}

      {/* Modal Detalhes do Lead */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSave={handleUpdateLead}
          onDelete={handleDeleteLead}
          onOpenChat={() => {
            setChatTargetLeadId(selectedLead.id);
            setSelectedLead(null);
            setActiveTab('whatsapp');
          }}
        />
      )}

      {/* Modal Agendamento de Instalação na Fábrica */}
      {isScheduleVisitOpen && (
        <ScheduleVisitModal
          lead={leadForVisit}
          leads={leads}
          empreendimentos={empreendimentos}
          onClose={() => {
            setIsScheduleVisitOpen(false);
            setLeadForVisit(null);
          }}
          onSuccess={() => {
            setIsScheduleVisitOpen(false);
            setLeadForVisit(null);
            loadData();
          }}
        />
      )}

      {/* Modal Conectar WhatsApp */}
      {isWhatsAppModalOpen && (
        <WhatsAppConnectModal
          instance={whatsappInstance}
          corretorEmail={user?.email || 'norlando@robusty.com.br'}
          onClose={() => setIsWhatsAppModalOpen(false)}
          onStatusChanged={loadData}
        />
      )}
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
