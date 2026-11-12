import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginCard: React.FC = () => {
  const { login, loginAs, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Credenciais inválidas.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha na autenticação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-[440px] bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-8 sm:p-10 z-10 transition-all overflow-hidden space-y-6">
        
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-amber-500 to-brand-600 rounded-t-3xl" />

        {/* Logo Robusty */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-slate-900 border-b-4 border-brand-500 text-white font-heading font-black text-2xl shadow-xs mb-3">
            R
          </div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 tracking-tight">
            ROBUSTY CRM
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão Comercial, Cotações & Fábrica de Bagageiros
          </p>
        </div>

        {/* Atalhos de Login Rápido (Demonstração da Equipe) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
          <p className="text-[11px] font-heading font-bold uppercase text-slate-500 tracking-wider">
            Acesso Rápido por Perfil:
          </p>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => loginAs('comercial')}
              className="w-full py-2 px-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-brand-500 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                <span>Norlando — Comercial</span>
              </div>
              <span className="text-[10px] text-brand-600 group-hover:translate-x-0.5 transition-transform">➔</span>
            </button>

            <button
              type="button"
              onClick={() => loginAs('gestao')}
              className="w-full py-2 px-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-500 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Igor — Cotações & Logística</span>
              </div>
              <span className="text-[10px] text-blue-600 group-hover:translate-x-0.5 transition-transform">➔</span>
            </button>

            <button
              type="button"
              onClick={() => loginAs('loja')}
              className="w-full py-2 px-3 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-500 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span>Loja — Fábrica & Instalação</span>
              </div>
              <span className="text-[10px] text-purple-600 group-hover:translate-x-0.5 transition-transform">➔</span>
            </button>
          </div>
        </div>

        {/* Divisor */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Ou acesse com e-mail
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        {/* Formulário com E-mail e Senha */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">E-mail corporativo</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="norlando@robusty.com.br"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Senha de acesso</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? 'Entrando...' : 'Entrar no CRM'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400">
          Robusty Bagageiros • Av. Aricanduva, 5.541 - SP
        </p>

      </div>

    </div>
  );
};
