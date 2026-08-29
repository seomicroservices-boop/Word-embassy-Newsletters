import React, { useState } from 'react';
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
  Heart,
  Quote,
  Youtube,
  Facebook,
  Users,
  Tv,
  Smartphone,
  Instagram,
  Twitter,
  ExternalLink,
} from 'lucide-react';
import { Newsletter, VideoItem } from '../types';

interface PublicHomeProps {
  newsletters: Newsletter[];
  videos: VideoItem[];
  onNavigate: (view: string, slug?: string) => void;
  onSubscribe: (name: string, email: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  newsletters,
  videos,
  onNavigate,
  onSubscribe,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Latest published newsletter
  const latestNewsletter = newsletters.find((n) => n.Status === 'PUBLISHED') || newsletters[0];
  const recentNewsletters = newsletters
    .filter((n) => n.Status === 'PUBLISHED' && n.NewsletterID !== latestNewsletter?.NewsletterID)
    .slice(0, 6);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubscribe(name || 'Faithful Reader', email);
    setIsSubscribed(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/40 via-white to-[#FDFBF7] py-16 sm:py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-semibold uppercase tracking-wider mb-6 border border-amber-300/60 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly Christian Publication & Devotional</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-[#1E293B] tracking-tight max-w-4xl mx-auto leading-tight">
            Scriptural Wisdom for Your Daily Journey of Faith
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Reverent Bible teaching, heartfelt prayers, actionable Christian living guides, and multimedia devotionals delivered directly to your inbox every Wednesday.
          </p>

          {/* Hero Subscription Box */}
          <div className="mt-10 max-w-lg mx-auto">
            {isSubscribed ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl shadow-sm text-center flex items-center justify-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-left text-sm font-semibold">
                  <span>Praise God! You have successfully subscribed to Word Embassy.</span>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleHeroSubmit}
                className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
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
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1-Click Unsubscribe
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LATEST NEWSLETTER SPOTLIGHT BANNER */}
      {latestNewsletter && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Featured Edition</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1E293B]">
                Latest Newsletter Spotlight
              </h2>
            </div>
            <button
              onClick={() => onNavigate('archive')}
              className="text-xs sm:text-sm font-semibold text-[#B45309] hover:underline flex items-center gap-1"
            >
              <span>View All Past Editions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-1 shadow-sm">
                  {latestNewsletter.Theme}
                </span>
                <p className="text-xs text-slate-200">
                  Published {new Date(latestNewsletter.PublishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Content Col */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                  <span className="bg-amber-100 text-[#B45309] px-2.5 py-0.5 rounded-full font-bold">
                    Veo Generated Reel
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
                <div className="bg-[#FEF3C7]/70 p-4 rounded-xl border border-[#FDE68A]">
                  <p className="font-scripture italic text-sm sm:text-base text-[#1E293B]">
                    “{latestNewsletter.ScriptureText}”
                  </p>
                  <p className="text-right text-xs font-bold text-[#92400E] mt-1">
                    — {latestNewsletter.ScriptureReference}
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
                  <span>Read Full Newsletter</span>
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

      {/* 3. RECENT NEWSLETTERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Recent Teachings</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1E293B]">
              Past Weekly Newsletters
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
          {recentNewsletters.map((nl) => (
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
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-xs font-bold px-2.5 py-1 rounded-full text-slate-800 shadow-xs">
                    {nl.ScriptureReference}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#1E293B]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                    {nl.Theme}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(nl.PublishDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1E293B] group-hover:text-[#B45309] transition-colors leading-snug line-clamp-2">
                    {nl.Title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-3 font-light leading-relaxed">
                    {nl.Excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#B45309]">
                <span>Read Edition</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
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
                Word Embassy Video & Shorts Gallery
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
                Follow Word Embassy Channels
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
                    Word Embassy Main
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
                    Word Embassy Page
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

      {/* 6. READER REFLECTIONS / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-current text-rose-500" />
            <span>Community of Faith</span>
          </div>
          <h2 className="font-serif text-3xl font-black text-[#1E293B]">
            Encouraging Believers Worldwide
          </h2>
          <p className="text-sm text-slate-500">
            Read how Word Embassy’s weekly devotionals are strengthening faith across generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <Quote className="w-8 h-8 text-amber-300" />
            <p className="text-sm text-slate-600 italic leading-relaxed">
              “Word Embassy has become my Wednesday morning sanctuary. The study on Persistent Prayer gave me fresh endurance during a heavy season of waiting.”
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#1E293B]">Sarah M.</span>
              <span className="text-slate-400">Subscriber since 2026</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <Quote className="w-8 h-8 text-amber-300" />
            <p className="text-sm text-slate-600 italic leading-relaxed">
              “The downloadable infographics and Veo video devotionals are so easy to share with my small group. Pure biblical truth without sensationalism.”
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#1E293B]">Pastor Jonathan K.</span>
              <span className="text-slate-400">Small Group Leader</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <Quote className="w-8 h-8 text-amber-300" />
            <p className="text-sm text-slate-600 italic leading-relaxed">
              “I love that each edition provides practical application steps alongside deep Scripture exposition. It has genuinely helped me walk in greater peace.”
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#1E293B]">Evelyn R.</span>
              <span className="text-slate-400">Daily Reader</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
