import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAs: (role: 'comercial' | 'gestao' | 'loja' | 'admin') => void;
  logout: () => Promise<void>;
  isFirstAccess: boolean;
  completeFirstAccess: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isManager: boolean;
  isPasswordRecoveryMode: boolean;
  saveRecoveredPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  cancelPasswordRecovery: () => Promise<void>;
}

const DEFAULT_ROBUSTY_USER: UserProfile = {
  id: 'norlando-1',
  name: 'Norlando',
  email: 'norlando@robusty.com.br',
  role: 'comercial',
  cargo: 'Comercial & Atendimento',
  phone: '(11) 96620-0052',
  status: 'ativo',
  whatsappConnected: true,
  createdAt: new Date().toISOString()
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('robusty_auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(DEFAULT_ROBUSTY_USER);
      }
    } else {
      // Inicia por padrão com Norlando logado para comodidade de teste
      setUser(DEFAULT_ROBUSTY_USER);
      localStorage.setItem('robusty_auth_user', JSON.stringify(DEFAULT_ROBUSTY_USER));
    }
    setIsLoading(false);
  }, []);

  const loginAs = (roleType: 'comercial' | 'gestao' | 'loja' | 'admin') => {
    let profile: UserProfile = DEFAULT_ROBUSTY_USER;

    if (roleType === 'gestao') {
      profile = {
        id: 'igor-1',
        name: 'Igor',
        email: 'igor@robusty.com.br',
        role: 'gestao',
        cargo: 'Gestão, Cotações, Logística & NF',
        phone: '(11) 3774-4674',
        status: 'ativo',
        whatsappConnected: true
      };
    } else if (roleType === 'loja') {
      profile = {
        id: 'loja-1',
        name: 'Equipe Loja & Fábrica',
        email: 'fabrica@robusty.com.br',
        role: 'loja',
        cargo: 'Preparação, Instalação & Expedição',
        phone: '(11) 3774-4674',
        status: 'ativo'
      };
    } else if (roleType === 'admin') {
      profile = {
        id: 'admin-1',
        name: 'Ricardo Faria (Diretoria)',
        email: 'ricardo@robusty.com.br',
        role: 'admin',
        cargo: 'Diretor de Projetos Robusty',
        phone: '(11) 96620-0052',
        status: 'ativo'
      };
    }

    setUser(profile);
    localStorage.setItem('robusty_auth_user', JSON.stringify(profile));
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail.includes('igor')) {
      loginAs('gestao');
      return { success: true };
    }
    if (cleanEmail.includes('loja') || cleanEmail.includes('fabrica')) {
      loginAs('loja');
      return { success: true };
    }
    if (cleanEmail.includes('admin') || cleanEmail.includes('ricardo')) {
      loginAs('admin');
      return { success: true };
    }

    loginAs('comercial');
    return { success: true };
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('robusty_auth_user');
  };

  const completeFirstAccess = async (newPassword: string) => {
    return { success: true };
  };

  const refreshProfile = async () => {};

  const saveRecoveredPassword = async (newPassword: string) => {
    setIsPasswordRecoveryMode(false);
    return { success: true };
  };

  const cancelPasswordRecovery = async () => {
    setIsPasswordRecoveryMode(false);
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'admin' || user?.role === 'gestao';

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginAs,
      logout,
      isFirstAccess: false,
      completeFirstAccess,
      refreshProfile,
      isAdmin,
      isManager,
      isPasswordRecoveryMode,
      saveRecoveredPassword,
      cancelPasswordRecovery
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
