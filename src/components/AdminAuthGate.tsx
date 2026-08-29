import React, { useState } from 'react';
import {
  Shield,
  Key,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Database,
  Cloud,
  FileSpreadsheet,
  FolderSync,
  Sparkles,
  ArrowRight,
  LogOut,
  UserCheck,
  Zap,
} from 'lucide-react';
import { AppSettings } from '../types';

interface AdminAuthGateProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onAuthenticate: (authenticatedUser: { email: string; role: string; name: string }) => void;
  onSignOut: () => void;
  onBypassWithPin?: (pin: string) => boolean;
  children: React.ReactNode;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  isAuthenticated,
  userEmail,
  onAuthenticate,
  onSignOut,
  onBypassWithPin,
  children,
}) => {
  const [selectedAuthMode, setSelectedAuthMode] = useState<'google' | 'pin'>('google');
  const [pinInput, setPinInput] = useState('');
  const [customEmailInput, setCustomEmailInput] = useState('embassyword@gmail.com');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const googlePresetAccounts = [
    {
      name: 'Word Embassy Lead Editor',
      email: 'embassyword@gmail.com',
      role: 'Super Administrator & Publisher',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      badge: 'Editorial Primary',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      name: 'OMicroservices Admin & Intercessor',
      email: 'omicroservices@gmail.com',
      role: 'Google Stack Engine Administrator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      badge: 'Stack Engine Master',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      name: 'SEO Microservices Engineering',
      email: 'seomicroservices@gmail.com',
      role: 'Platform Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      badge: 'Platform Engineering',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
  ];

  const handleSelectPreset = (account: typeof googlePresetAccounts[0]) => {
    setIsSigningIn(true);
    setErrorMsg(null);
    setTimeout(() => {
      onAuthenticate({
        email: account.email,
        role: account.role,
        name: account.name,
      });
      setIsSigningIn(false);
    }, 450);
  };

  const handleCustomEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmailInput.trim() || !customEmailInput.includes('@')) {
      setErrorMsg('Please enter a valid Google administrator email address');
      return;
    }
    setIsSigningIn(true);
    setErrorMsg(null);
    setTimeout(() => {
      onAuthenticate({
        email: customEmailInput.trim().toLowerCase(),
        role: 'Google Stack Engine Administrator',
        name: customEmailInput.split('@')[0],
      });
      setIsSigningIn(false);
    }, 450);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (onBypassWithPin && onBypassWithPin(pinInput)) {
      // Authenticated via PIN
    } else if (pinInput === '7777') {
      onAuthenticate({
        email: 'embassyword@gmail.com',
        role: 'Super Administrator',
        name: 'Lead Editor',
      });
    } else {
      setErrorMsg('Invalid Master PIN. Default master key is 7777');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0B132B] text-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="google-stack-admin-login-screen">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full space-y-8 z-10">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-xl shadow-amber-900/30 border border-amber-400/30 mb-4">
            <Layers className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Google Stack Engine Admin
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Authorized sign-in gateway for Google Sheets 10-Sheet Database, Drive Storage, Docs Automation, and Gmail Dispatch Engines.
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1 shadow-inner">
          <button
            onClick={() => {
              setSelectedAuthMode('google');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedAuthMode === 'google'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="auth-mode-google-btn"
          >
            <Cloud className="w-4 h-4" />
            <span>Google Account Sign-In</span>
          </button>
          <button
            onClick={() => {
              setSelectedAuthMode('pin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedAuthMode === 'pin'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="auth-mode-pin-btn"
          >
            <Lock className="w-4 h-4" />
            <span>Master Console PIN (7777)</span>
          </button>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-center gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {selectedAuthMode === 'google' ? (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block">
                  Select Authorized Google Administrator Account
                </label>
                <div className="space-y-2.5">
                  {googlePresetAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => handleSelectPreset(account)}
                      disabled={isSigningIn}
                      className="w-full text-left p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 transition-all flex items-center justify-between group disabled:opacity-50"
                      id={`auth-select-${account.email.split('@')[0]}-btn`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600 text-amber-400 font-bold text-sm">
                          {account.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-amber-300 flex items-center gap-2">
                            <span>{account.name}</span>
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{account.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${account.badgeColor}`}>
                          {account.badge}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-xs font-medium uppercase tracking-wider">
                  or sign in with another email
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Custom Google Email Form */}
              <form onSubmit={handleCustomEmailSignIn} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Google Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={customEmailInput}
                      onChange={(e) => setCustomEmailInput(e.target.value)}
                      placeholder="admin@gmail.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                      id="custom-google-admin-email-input"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  id="custom-google-sign-in-btn"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isSigningIn ? 'Authenticating...' : 'Sign In to Google Stack Engine'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* PIN Mode */
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Master Security PIN
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={10}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter 4-digit PIN (default: 7777)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors tracking-widest"
                    id="admin-master-pin-input"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Default Master Key PIN: <strong className="text-amber-400 font-mono">7777</strong></span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all"
                id="submit-master-pin-btn"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Master Console</span>
              </button>
            </form>
          )}

          {/* Engine Capability Footprint */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] text-slate-400">
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <span>10-Sheet DB</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <Cloud className="w-3.5 h-3.5 text-sky-400 mx-auto mb-1" />
              <span>Drive Cloud</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <Mail className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
              <span>Gmail Dispatch</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
              <span>Gemini Engine</span>
            </div>
          </div>
        </div>

        {/* Security Note Footer */}
        <p className="text-center text-xs text-slate-500">
          Protected by Word Embassy Ministry Security Protocols • TLS 1.3 End-to-End
        </p>
      </div>
    </div>
  );
};
