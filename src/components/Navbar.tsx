import React from 'react';
import { BookOpen, Shield, Video, Archive, Info, Sparkles, Mail, Database } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdmin,
  onToggleAdmin,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-[#1E293B] text-slate-200 text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>WORD EMBASSY DIGITAL MINISTRY • BIBLE TEACHING • FAITH • PRAYER</span>
        <button
          onClick={onToggleAdmin}
          className="ml-3 text-[11px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-0.5 rounded border border-amber-400/40 transition-colors flex items-center gap-1 font-semibold"
          id="toggle-admin-top-btn"
          title="Admin Login & Editorial Control Center"
        >
          <Shield className="w-3 h-3" />
          {isAdmin ? 'Switch to Reader Site' : 'Admin Login'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Subtitle */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer group flex items-center gap-3.5"
            id="brand-logo-btn"
          >
            <div className="w-11 h-11 rounded-lg bg-[#1E293B] text-[#FEF3C7] flex items-center justify-center shadow-md group-hover:bg-[#B45309] transition-colors border border-amber-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-[#1E293B] tracking-tight flex items-center gap-1.5">
                <span>WORD EMBASSY</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-[#B45309] font-sans font-semibold">
                  NEWSLETTER
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                Bible Teaching • Faith • Prayer • Christian Living
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-[#1E293B]">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-2 rounded-md transition-colors ${
                currentView === 'home'
                  ? 'bg-amber-50 text-[#B45309] font-semibold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              id="nav-home-btn"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('newsletter', 'the-power-of-persistent-prayer')}
              className={`px-3.5 py-2 rounded-md transition-colors ${
                currentView === 'newsletter'
                  ? 'bg-amber-50 text-[#B45309] font-semibold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              id="nav-latest-btn"
            >
              Latest Edition
            </button>
            <button
              onClick={() => onNavigate('archive')}
              className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                currentView === 'archive'
                  ? 'bg-amber-50 text-[#B45309] font-semibold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              id="nav-archive-btn"
            >
              <Archive className="w-4 h-4 text-slate-400" />
              Archive
            </button>
            <button
              onClick={() => onNavigate('videos')}
              className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                currentView === 'videos'
                  ? 'bg-amber-50 text-[#B45309] font-semibold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              id="nav-videos-btn"
            >
              <Video className="w-4 h-4 text-slate-400" />
              Videos
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                currentView === 'about'
                  ? 'bg-amber-50 text-[#B45309] font-semibold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              id="nav-about-btn"
            >
              <Info className="w-4 h-4 text-slate-400" />
              About
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('subscribe')}
              className="bg-[#B45309] hover:bg-[#92400E] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs flex items-center gap-2 transition-transform active:scale-95"
              id="nav-subscribe-cta-btn"
            >
              <Mail className="w-4 h-4" />
              <span>Subscribe Free</span>
            </button>

            <button
              onClick={onToggleAdmin}
              title="Open Google Stack Backend Control Center"
              className={`p-2 rounded-lg border text-sm font-semibold transition-all ${
                isAdmin
                  ? 'bg-[#1E293B] text-amber-300 border-[#1E293B]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              id="nav-admin-toggle-icon-btn"
            >
              <Database className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
