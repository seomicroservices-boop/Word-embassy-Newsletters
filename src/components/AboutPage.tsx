import React, { useEffect } from 'react';
import { BookOpen, ShieldCheck, Heart, Sparkles, Database, Mail, CheckCircle2, FileText, Lock } from 'lucide-react';
import { setStandardPageSEO, trackSEOEvent } from '../services/seoManager';

interface AboutPageProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    setStandardPageSEO(
      'About Living Word Embassy & Editorial Standards',
      'Learn about Living Word Embassy Ministry, our pastoral editorial council, theological orthodoxy, and mission to spread biblical exegesis and daily devotionals globally.',
      '/about'
    );
    trackSEOEvent('page_view', { page: 'about' });
  }, []);
  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-[#B45309] text-xs font-semibold uppercase tracking-wider border border-amber-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Living Word Embassy Ministry</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#1E293B] tracking-tight">
            About Living Word Embassy Newsletter
          </h1>
          <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
            A digital publication committed to equipping believers worldwide with scripturally sound Bible teaching, fervent prayer, and practical Christian discipleship.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B] border-b border-slate-100 pb-4">
            Our Purpose & Calling
          </h2>
          <div className="text-slate-700 leading-relaxed text-base sm:text-lg space-y-4 font-light">
            <p>
              In a culture crowded with distractions, superficial soundbites, and anxious noise, <strong>Living Word Embassy</strong> exists to serve as an anchor of unchanging biblical truth.
            </p>
            <p>
              Every week, our editorial and theological team crafts in-depth scripture meditations designed not merely to inform the intellect, but to transform the heart, renew the mind, and empower faithful obedience in everyday life.
            </p>
          </div>
        </div>

        {/* 4 Core Editorial Standards */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E293B] border-b border-slate-100 pb-4">
            Editorial & Biblical Standards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2 p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-[#1E293B]">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>1. Strict Biblical Fidelity</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every newsletter is rooted directly in the Holy Scriptures, distinguishing God’s inspired Word from human commentary.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-[#1E293B]">
                <Heart className="w-5 h-5 text-rose-600" />
                <span>2. Christ-Centered & Reverent</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We avoid sensationalism, commercial hype, and divisive speculation, keeping the spotlight on the Gospel of Jesus Christ.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-[#1E293B]">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
                <span>3. Practical Discipleship</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Each edition includes three clear biblical pillars, actionable daily application steps, and a pastoral prayer.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-[#1E293B]">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>4. Accessible Multimedia</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We harness Google-stack automation (Google Sheets, Gemini, Veo, Drive) to produce infographics, audio narration, and video reels.
              </p>
            </div>
          </div>
        </div>

        {/* Trust, Orthodoxy & Legal Governance */}
        <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-xs space-y-4">
          <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Theological Governance & Transparency
          </h3>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            Living Word Embassy is committed to complete theological clarity and reader privacy. Read our detailed governance documents:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => onNavigate('statement-of-faith')}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-left transition-colors flex items-center gap-2 group"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">Statement of Faith</span>
            </button>
            <button
              onClick={() => onNavigate('editorial-policy')}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-left transition-colors flex items-center gap-2 group"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">Editorial Policy</span>
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-left transition-colors flex items-center gap-2 group"
            >
              <Lock className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">Privacy Policy</span>
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-left transition-colors flex items-center gap-2 group"
            >
              <FileText className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">Terms of Use</span>
            </button>
          </div>
        </div>

        {/* Google Stack Automation Explanation */}
        <div className="bg-[#1E293B] text-white rounded-2xl p-8 sm:p-10 border border-slate-700 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold">
                The Google-First Tech Engine
              </h3>
              <p className="text-xs text-amber-300">
                How Living Word Embassy Automates Multi-Platform Distribution
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Living Word Embassy runs on a custom Google-stack automation engine: from a single topic in <strong>Google Sheets</strong>, the system uses <strong>Gemini 3.7 Flash</strong> and <strong>Google Veo</strong> to generate complete web articles, batch email campaigns, high-res infographics, social posts, and YouTube shorts, archiving each package cleanly in <strong>Google Drive</strong>.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('subscribe')}
              className="bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Subscribe to Living Word Embassy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
