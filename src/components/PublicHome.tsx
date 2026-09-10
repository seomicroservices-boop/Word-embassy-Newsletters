import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Play,
  Mail,
  CheckCircle2,
  Share2,
  Video,
  ShieldCheck,
  Quote,
  Youtube,
  Facebook,
  Users,
  Tv,
  Smartphone,
  Instagram,
  Twitter,
  ExternalLink,
  Sun,
  Layers,
} from 'lucide-react';
import { Newsletter, VideoItem } from '../types';
import { formatBibleCitation, parseScriptureReference } from '../services/bibleScripture';
import { setStandardPageSEO, trackSEOEvent } from '../services/seoManager';

interface PublicHomeProps {
  newsletters: Newsletter[];
  videos: VideoItem[];
  onNavigate: (view: string, slug?: string) => void;
  onSubscribe: (
    name: string,
    email: string,
    editionPreference?: 'ALL' | 'DAILY_DEVOTIONAL' | 'WEEKLY_EXEGESIS'
  ) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  newsletters,
  videos,
  onNavigate,
  onSubscribe,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editionPref, setEditionPref] = useState<'ALL' | 'DAILY_DEVOTIONAL' | 'WEEKLY_EXEGESIS'>('ALL');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedEditionTab, setSelectedEditionTab] = useState<'ALL' | 'DAILY_DEVOTIONAL' | 'WEEKLY_EXEGESIS'>('ALL');

  useEffect(() => {
    setStandardPageSEO(
      'Living Word Embassy — Christian Daily Devotionals & Scripture Exegesis',
      'Read biblically sound Christian devotionals, verse-by-verse Greek and Hebrew exegesis, audio narrations, and prayer declarations from Living Word Embassy Ministries.',
      '/'
    );
    trackSEOEvent('page_view', { page: 'home' });
  }, []);

  // Filtered newsletters based on selected tab
  const filteredNewsletters = newsletters.filter((n) => {
    if (n.Status !== 'PUBLISHED') return false;
    if (selectedEditionTab === 'ALL') return true;
    return n.Edition === selectedEditionTab;
  });

  const latestNewsletter =
    filteredNewsletters[0] ||
    newsletters.find((n) => n.Status === 'PUBLISHED') ||
    newsletters[0];

  const recentNewsletters = filteredNewsletters
    .filter((n) => n.NewsletterID !== latestNewsletter?.NewsletterID)
    .slice(0, 6);

  const dailyCount = newsletters.filter((n) => n.Status === 'PUBLISHED' && n.Edition === 'DAILY_DEVOTIONAL').length;
  const weeklyCount = newsletters.filter((n) => n.Status === 'PUBLISHED' && n.Edition === 'WEEKLY_EXEGESIS').length;

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubscribe(name || 'Faithful Reader', email, editionPref);
    setIsSubscribed(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white/80 to-[#FDFBF7]/85 backdrop-blur-xs py-16 sm:py-24 border-b border-[#E2E8F0]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7]/90 text-[#B45309] text-xs font-semibold uppercase tracking-wider mb-6 border border-amber-300/60 shadow-2xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Two Distinct Publications • One Faithful Ministry</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-[#1E293B] tracking-tight max-w-4xl mx-auto leading-tight">
            Scriptural Wisdom for Your Daily Journey of Faith
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Experience our <strong>Daily Devotional (Tue–Sun)</strong> for morning spiritual nourishment, and our <strong>Weekly Deep Exegesis (Mondays)</strong> for verse-by-verse theological studies.
          </p>

          {/* Hero Subscription Box */}
          <div className="mt-10 max-w-xl mx-auto">
            {isSubscribed ? (
              <div className="bg-emerald-50/95 backdrop-blur-xs border border-emerald-200 text-emerald-800 p-5 rounded-2xl shadow-sm text-center flex items-center justify-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-left text-sm font-semibold">
                  <span>
                    Praise God! You have successfully subscribed to Living Word Embassy (
                    {editionPref === 'ALL'
                      ? 'Both Daily & Weekly Editions'
                      : editionPref === 'DAILY_DEVOTIONAL'
                      ? 'Daily Devotional (Tue–Sun)'
                      : 'Weekly Exegesis (Mondays)'}
                    ).
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-3xl shadow-lg border border-slate-200/90 space-y-3">
                {/* Edition Selector Pill in Hero */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditionPref('ALL')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      editionPref === 'ALL'
                        ? 'bg-[#1E293B] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ✦ Both Editions (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditionPref('DAILY_DEVOTIONAL')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      editionPref === 'DAILY_DEVOTIONAL'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ☀️ Daily (Tue–Sun)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditionPref('WEEKLY_EXEGESIS')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      editionPref === 'WEEKLY_EXEGESIS'
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📖 Weekly (Mondays)
                  </button>
                </div>

                <form
                  onSubmit={handleHeroSubmit}
                  className="flex flex-col sm:flex-row items-center gap-2 pt-1"
                  id="hero-subscribe-form"
                >
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full sm:w-1/3 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 sm:bg-transparent rounded-xl border sm:border-0 border-slate-200 focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full sm:w-2/3 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 sm:bg-transparent rounded-xl border sm:border-0 border-slate-200 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-3.5 rounded-xl font-bold text-sm shrink-0 transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
                    id="hero-subscribe-submit-btn"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Subscribe Free</span>
                  </button>
                </form>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free Forever
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No Spam
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Choose Your Frequency
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TWO SEPARATE EDITIONS OVERVIEW CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] uppercase tracking-wider bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Dual Publication Architecture</span>
          </div>
          <h2 className="font-serif text-3xl font-black text-[#1E293B]">
            Two Dedicated Editorial Streams
          </h2>
          <p className="text-sm text-slate-600">
            Select an edition stream below to filter recent archives or explore their distinct format.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Edition 1: Daily Devotional */}
          <div
            onClick={() => setSelectedEditionTab(selectedEditionTab === 'DAILY_DEVOTIONAL' ? 'ALL' : 'DAILY_DEVOTIONAL')}
            className={`p-8 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group shadow-sm ${
              selectedEditionTab === 'DAILY_DEVOTIONAL'
                ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-md'
                : 'bg-white border-[#E2E8F0] hover:border-amber-400 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Sun className="w-6 h-6" />
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                Daily • Tue–Sun
              </span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#1E293B] group-hover:text-[#B45309] transition-colors mb-2">
              Daily Devotional
            </h3>
            <p className="text-sm text-slate-600 font-light leading-relaxed mb-6">
              5-minute spiritual nourishment for your morning routine: daily key verse, inspiring reflection, faith confession declarations, and targeted morning prayers.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-semibold text-[#B45309]">
              <span>
                {selectedEditionTab === 'DAILY_DEVOTIONAL' ? 'Currently Filtering Daily Editions' : `Filter Daily Devotionals (${dailyCount})`}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Edition 2: Weekly Exegesis */}
          <div
            onClick={() => setSelectedEditionTab(selectedEditionTab === 'WEEKLY_EXEGESIS' ? 'ALL' : 'WEEKLY_EXEGESIS')}
            className={`p-8 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group shadow-sm ${
              selectedEditionTab === 'WEEKLY_EXEGESIS'
                ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/40 shadow-md'
                : 'bg-white border-[#E2E8F0] hover:border-indigo-400 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 uppercase tracking-wider">
                Weekly • Mondays
              </span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#1E293B] group-hover:text-indigo-700 transition-colors mb-2">
              Weekly Deep Exegesis
            </h3>
            <p className="text-sm text-slate-600 font-light leading-relaxed mb-6">
              In-depth theological exposition: original Hebrew/Greek word studies, 3 structured key pillars of truth, actionable life applications, infographics, and full video studies.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-semibold text-indigo-600">
              <span>
                {selectedEditionTab === 'WEEKLY_EXEGESIS' ? 'Currently Filtering Weekly Editions' : `Filter Weekly Exegesis (${weeklyCount})`}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 THEOLOGICAL STUDY PILLARS (CORE TOPICAL AUTHORITY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-200/60 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wide">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>Topical Authority & Systematic Exegesis</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-slate-900">
                Core Theological Pillars
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-light max-w-2xl">
                Comprehensive, verse-by-verse scriptural guidebooks synthesizing Greek/Hebrew morphology, historic church confessions, and practical faith applications.
              </p>
            </div>

            <button
              onClick={() => onNavigate('topics')}
              className="text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 shrink-0 self-start md:self-auto group bg-amber-100/70 hover:bg-amber-100 px-4 py-2.5 rounded-xl transition-all"
            >
              <span>Explore All Topics Directory</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div
              onClick={() => onNavigate('pillar', 'divine-protection')}
              className="group cursor-pointer bg-white rounded-2xl p-6 border border-amber-200/70 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                  Psalm 91 • Ephesians 6
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                  The Biblical Doctrine of Divine Protection
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light line-clamp-3">
                  Examine Elyon (Most High), Shaddai (Almighty), angelic guardianship, and abiding under the shadow of the Almighty in times of danger.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700 group-hover:text-amber-900">
                <span>Read Pillar Guidebook</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div
              onClick={() => onNavigate('pillar', 'supernatural-peace')}
              className="group cursor-pointer bg-white rounded-2xl p-6 border border-amber-200/70 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 inline-block">
                  Philippians 4 • John 14
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-indigo-800 transition-colors leading-snug">
                  Supernatural Peace in Seasons of Anxiety
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light line-clamp-3">
                  A theological treatise on divine tranquillity (Eirene), casting burdens (Merimna), and cognitive renewal through Christ Jesus.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-700 group-hover:text-indigo-900">
                <span>Read Pillar Guidebook</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div
              onClick={() => onNavigate('pillar', 'persistent-prayer')}
              className="group cursor-pointer bg-white rounded-2xl p-6 border border-amber-200/70 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                  Luke 18 • 1 Thess 5
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  The Doctrine of Persistent Prayer
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light line-clamp-3">
                  Intercessory importunity, prevailing faith, unceasing petition, and unlocking spiritual victory through steadfast communion.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-900">
                <span>Read Pillar Guidebook</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LATEST NEWSLETTER SPOTLIGHT BANNER */}
      {latestNewsletter && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Featured Edition</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1E293B]">
                {selectedEditionTab === 'DAILY_DEVOTIONAL'
                  ? 'Latest Daily Devotional Spotlight'
                  : selectedEditionTab === 'WEEKLY_EXEGESIS'
                  ? 'Latest Weekly Exegesis Spotlight'
                  : 'Latest Publication Spotlight'}
              </h2>
            </div>

            {/* Quick Tab Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setSelectedEditionTab('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedEditionTab === 'ALL'
                    ? 'bg-[#1E293B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({newsletters.length})
              </button>
              <button
                onClick={() => setSelectedEditionTab('DAILY_DEVOTIONAL')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  selectedEditionTab === 'DAILY_DEVOTIONAL'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Daily ({dailyCount})</span>
              </button>
              <button
                onClick={() => setSelectedEditionTab('WEEKLY_EXEGESIS')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  selectedEditionTab === 'WEEKLY_EXEGESIS'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Weekly ({weeklyCount})</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-md grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image Col */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-slate-900 overflow-hidden group">
              <img
                src={latestNewsletter.FeaturedImageURL}
                alt={latestNewsletter.Title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                      latestNewsletter.Edition === 'DAILY_DEVOTIONAL'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {latestNewsletter.Edition === 'DAILY_DEVOTIONAL'
                      ? '☀️ Daily Devotional • Tue–Sun'
                      : '📖 Weekly Exegesis • Mondays'}
                  </span>
                  <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {latestNewsletter.Theme}
                  </span>
                </div>
                <p className="text-xs text-slate-200">
                  Published {new Date(latestNewsletter.PublishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Content Col */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold ${
                      latestNewsletter.Edition === 'DAILY_DEVOTIONAL'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {latestNewsletter.Edition === 'DAILY_DEVOTIONAL' ? 'Daily Morning Devotion' : 'Monday Theological Study'}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    Gemini AI Scripted
                  </span>
                </div>

                <h3
                  onClick={() => onNavigate('newsletter', latestNewsletter.Slug)}
                  className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E293B] hover:text-[#B45309] cursor-pointer transition-colors leading-tight"
                >
                  {latestNewsletter.Title}
                </h3>

                {/* Key Scripture Quote Box */}
                <div className="bg-[#FEF3C7]/85 p-4 sm:p-5 rounded-xl border-2 border-[#FDE68A] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#92400E]">
                    <span className="inline-flex items-center gap-1.5 uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      <span>Bible Chapter & Verse</span>
                    </span>
                    <span className="font-serif font-black text-sm px-2.5 py-0.5 rounded-md bg-amber-200/80 text-amber-950 border border-amber-300">
                      {formatBibleCitation(
                        latestNewsletter.ScriptureReference,
                        latestNewsletter.BibleBook,
                        latestNewsletter.BibleChapter,
                        latestNewsletter.BibleVerses
                      )}
                    </span>
                  </div>
                  <p className="font-scripture italic text-base sm:text-lg text-[#1E293B] leading-relaxed">
                    “{latestNewsletter.ScriptureText}”
                  </p>
                  <p className="text-right text-xs font-bold text-[#92400E]">
                    — {formatBibleCitation(
                      latestNewsletter.ScriptureReference,
                      latestNewsletter.BibleBook,
                      latestNewsletter.BibleChapter,
                      latestNewsletter.BibleVerses
                    )}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                  {latestNewsletter.Excerpt}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('newsletter', latestNewsletter.Slug)}
                  className="bg-[#1E293B] hover:bg-[#334155] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
                  id="read-featured-newsletter-btn"
                >
                  <span>Read Full Edition</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('newsletter', latestNewsletter.Slug)}
                  className="bg-amber-50 hover:bg-amber-100 text-[#B45309] border border-amber-200 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
                  id="watch-featured-video-btn"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Devotional Reel</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. RECENT NEWSLETTERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>
                {selectedEditionTab === 'DAILY_DEVOTIONAL'
                  ? 'Recent Daily Devotionals'
                  : selectedEditionTab === 'WEEKLY_EXEGESIS'
                  ? 'Recent Weekly Exegesis Editions'
                  : 'Recent Publications'}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1E293B]">
              Browse Recent Releases
            </h2>
          </div>
          <button
            onClick={() => onNavigate('archive')}
            className="text-xs sm:text-sm font-semibold text-[#B45309] hover:underline flex items-center gap-1"
          >
            <span>Browse Full Archive ({newsletters.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentNewsletters.map((nl) => {
            const isDaily = nl.Edition === 'DAILY_DEVOTIONAL';
            const parsedScripture = parseScriptureReference(nl.ScriptureReference);
            const cardBook = nl.BibleBook || parsedScripture.book || 'Scripture';
            const cardChapter = nl.BibleChapter !== undefined ? String(nl.BibleChapter) : parsedScripture.chapter;
            const cardVerses = nl.BibleVerses || parsedScripture.verses;
            return (
              <div
                key={nl.NewsletterID}
                onClick={() => onNavigate('newsletter', nl.Slug)}
                className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={nl.FeaturedImageURL}
                      alt={nl.Title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Edition Pill Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider ${
                          isDaily
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {isDaily ? '☀️ Daily (Tue–Sun)' : '📖 Weekly (Mon)'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-xs font-bold px-2.5 py-1 rounded-full text-slate-900 shadow-xs flex items-center gap-1 border border-amber-300/60">
                      <BookOpen className="w-3 h-3 text-amber-600" />
                      <span>
                        {formatBibleCitation(
                          nl.ScriptureReference,
                          nl.BibleBook,
                          nl.BibleChapter,
                          nl.BibleVerses
                        )}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#1E293B]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                      {nl.Theme}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(nl.PublishDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                        {cardBook} {cardChapter ? `Ch. ${cardChapter}` : ''}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#1E293B] group-hover:text-[#B45309] transition-colors leading-snug line-clamp-2">
                      {nl.Title}
                    </h3>

                    {/* Explicit Scripture Chapter & Verses Callout */}
                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#92400E]">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-amber-600" />
                          <span>{cardBook} {cardChapter ? `${cardChapter}: ${cardVerses}` : cardVerses}</span>
                        </span>
                        <span className="text-[10px] uppercase font-semibold bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded">
                          {nl.BibleTranslation || 'NIV'}
                        </span>
                      </div>
                      <p className="font-scripture italic text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        “{nl.ScriptureText}”
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 font-light leading-relaxed">
                      {nl.Excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#B45309]">
                  <span>Read Edition & Scripture Context</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LATEST VIDEOS & VEO DEVOTIONALS */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Video className="w-4 h-4" />
                <span>Multimedia Ministry</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-white mt-1">
                Living Word Embassy Video & Shorts Gallery
              </h2>
            </div>
            <button
              onClick={() => onNavigate('videos')}
              className="text-xs sm:text-sm font-semibold text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>View All Videos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 3).map((vid) => (
              <div
                key={vid.VideoID}
                onClick={() => onNavigate('newsletter', newsletters.find(n => n.NewsletterID === vid.NewsletterID)?.Slug || 'the-power-of-persistent-prayer')}
                className="bg-slate-800/90 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-amber-400 transition-all cursor-pointer group shadow-lg"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={vid.ThumbnailURL}
                    alt={vid.Title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-[11px] font-mono font-bold px-2 py-0.5 rounded text-white">
                    {vid.Duration}
                  </span>
                  <span className="absolute top-2 left-2 bg-red-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white">
                    {vid.Type}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h4 className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {vid.Title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-light">
                    {vid.Description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OFFICIAL CHANNELS & FELLOWSHIP COMMUNITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] rounded-3xl p-8 sm:p-12 text-white border border-slate-700/60 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multichannel Digital Ministry</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-white">
                Follow Living Word Embassy Channels
              </h2>
              <p className="text-sm text-slate-300">
                Watch full video teachings on YouTube, participate in daily devotionals, and join our Facebook fellowship group for prayer and community encouragement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {/* Channel 1: YouTube Main */}
              <a
                href="https://www.youtube.com/channel/UCAsSQvaTy6ZUPpLeLjbOA6g"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500/50 p-4 rounded-2xl transition-all group flex flex-col justify-between shadow-xs"
                id="home-channel-yt-main"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    YouTube
                  </span>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1 mb-1">
                    Living Word Embassy Main
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Weekly video devotionals & reels.
                  </p>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-red-400 group-hover:text-red-300">
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Channel 2: YouTube Secondary */}
              <a
                href="https://www.youtube.com/channel/UCymieOPsE0wPoPjS-vC57LA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500/50 p-4 rounded-2xl transition-all group flex flex-col justify-between shadow-xs"
                id="home-channel-yt-secondary"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Tv className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                    Broadcasts
                  </span>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1 mb-1">
                    Pastoral Teachings
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    In-depth expository sermon archives.
                  </p>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-red-400 group-hover:text-red-300">
                  <span>Watch</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Channel 3: TikTok Shorts */}
              <a
                href="https://www.tiktok.com/@paulinefaith67?_r=1&_t=ZT-99IFvhsT9w6"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-pink-500/50 p-4 rounded-2xl transition-all group flex flex-col justify-between shadow-xs"
                id="home-channel-tiktok"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                    TikTok
                  </span>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1 mb-1">
                    @paulinefaith67
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Quick daily scripture moments & reels.
                  </p>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-pink-400 group-hover:text-pink-300">
                  <span>Follow</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Channel 4: Instagram */}
              <a
                href="https://www.instagram.com/embassyword02/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-fuchsia-500/50 p-4 rounded-2xl transition-all group flex flex-col justify-between shadow-xs"
                id="home-channel-instagram"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-400">
                    Instagram
                  </span>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1 mb-1">
                    @embassyword02
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Scripture art, daily quotes & visual inspiration.
                  </p>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-fuchsia-400 group-hover:text-fuchsia-300">
                  <span>Follow</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Channel 5: X / Twitter */}
              <a
                href="https://x.com/Wordembass76269"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500/50 p-4 rounded-2xl transition-all group flex flex-col justify-between shadow-xs"
                id="home-channel-x-twitter"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    X (Twitter)
                  </span>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1 mb-1">
                    @Wordembass76269
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Scripture declarations, threads & quick updates.
                  </p>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-sky-400 group-hover:text-sky-300">
                  <span>Follow</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Channel 6: Facebook Page */}
              <a
                href="https://www.facebook.com/profile.php?id=61570922167817"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 p-4 rounded-2xl transition-all group flex flex-col justify-between shadow-xs"
                id="home-channel-fb-page"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Facebook Page
                  </span>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1 mb-1">
                    Living Word Embassy Page
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Daily verse graphics & ministry announcements.
                  </p>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-blue-400 group-hover:text-blue-300">
                  <span>Follow</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Channel 7: Facebook Group */}
              <a
                href="https://www.facebook.com/groups/1421329093238399"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 p-4 rounded-2xl transition-all group flex flex-col justify-between shadow-xs"
                id="home-channel-fb-group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Community
                  </span>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition-colors mt-1 mb-1">
                    Fellowship Group
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Prayer requests & believer encouragement.
                  </p>
                </div>
                <div className="pt-2.5 mt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Join</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
