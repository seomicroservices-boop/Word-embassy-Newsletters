import React from 'react';
import { BookOpen, Mail, ExternalLink, ShieldCheck, Youtube, Facebook, Users, Tv, Smartphone, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, slug?: string) => void;
  onOpenAdmin: () => void;
}

export const OFFICIAL_CHANNELS = [
  {
    id: 'yt-main',
    name: 'Word Embassy YouTube Channel',
    category: 'YouTube Channel',
    url: 'https://www.youtube.com/channel/UCAsSQvaTy6ZUPpLeLjbOA6g',
    description: 'Devotionals, multimedia video series & weekly word',
    icon: Youtube,
    colorClass: 'text-red-400 group-hover:text-red-300 bg-red-500/10 border-red-500/20',
  },
  {
    id: 'yt-secondary',
    name: 'Word Embassy Broadcasts',
    category: 'YouTube Broadcasts',
    url: 'https://www.youtube.com/channel/UCymieOPsE0wPoPjS-vC57LA',
    description: 'Pastoral teachings, scripture studies & ministry archives',
    icon: Tv,
    colorClass: 'text-red-400 group-hover:text-red-300 bg-red-500/10 border-red-500/20',
  },
  {
    id: 'tiktok-main',
    name: 'Word Embassy TikTok',
    category: 'TikTok Shorts & Reels',
    url: 'https://www.tiktok.com/@paulinefaith67?_r=1&_t=ZT-99IFvhsT9w6',
    description: 'Daily faith moments, short devotionals & inspiring messages',
    icon: Smartphone,
    colorClass: 'text-pink-400 group-hover:text-pink-300 bg-pink-500/10 border-pink-500/20',
  },
  {
    id: 'instagram-main',
    name: 'Word Embassy Instagram',
    category: 'Instagram Visual Word',
    url: 'https://www.instagram.com/embassyword02/',
    description: 'Scripture art, daily quotes, reels & faith inspiration',
    icon: Instagram,
    colorClass: 'text-fuchsia-400 group-hover:text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20',
  },
  {
    id: 'x-twitter-main',
    name: 'Word Embassy X (Twitter)',
    category: 'X / Twitter Feed',
    url: 'https://x.com/Wordembass76269',
    description: 'Daily scripture declarations, threads & ministry alerts',
    icon: Twitter,
    colorClass: 'text-sky-400 group-hover:text-sky-300 bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'fb-page',
    name: 'Word Embassy Facebook Page',
    category: 'Official Page',
    url: 'https://www.facebook.com/profile.php?id=61570922167817',
    description: 'Daily scripture updates, ministry news & announcements',
    icon: Facebook,
    colorClass: 'text-blue-400 group-hover:text-blue-300 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'fb-group',
    name: 'Word Embassy Fellowship Group',
    category: 'Community Group',
    url: 'https://www.facebook.com/groups/1421329093238399',
    description: 'Prayer requests, discussions & ambassador fellowship',
    icon: Users,
    colorClass: 'text-indigo-400 group-hover:text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
  },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer className="bg-[#1E293B] text-slate-300 border-t border-slate-700/60 pt-16 pb-12 mt-20" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-700/60">
          {/* Col 1: Mission & Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-[#FEF3C7] flex items-center justify-center border border-amber-400/30">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  WORD EMBASSY
                </span>
                <span className="block text-xs text-amber-400/90 font-medium tracking-wide">
                  Bible Teaching • Faith • Prayer
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Word Embassy is dedicated to publishing clear, reverent, and biblically sound devotional teachings, multimedia devotionals, and practical encouragement to strengthen your daily walk with the Lord Jesus Christ.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Biblically Grounded
              </span>
              <span>•</span>
              <span>Free Forever</span>
            </div>
          </div>

          {/* Col 2: Publication Links */}
          <div>
            <h4 className="font-serif text-white font-semibold text-base mb-4 tracking-wide flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Publication Links</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5 text-left"
                >
                  <span>Home Page</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('newsletter', 'the-power-of-persistent-prayer')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5 text-left"
                >
                  <span>Latest Newsletter</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('archive')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5 text-left"
                >
                  <span>Newsletter Archive</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('videos')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5 text-left"
                >
                  <span>Video Devotionals</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5 text-left"
                >
                  <span>About & Statement of Faith</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Ministry Channels & Social Media */}
          <div>
            <h4 className="font-serif text-white font-semibold text-base mb-4 tracking-wide flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-400" />
              <span>Official Channels</span>
            </h4>
            <ul className="space-y-3 text-sm">
              {OFFICIAL_CHANNELS.map((ch) => {
                const IconComp = ch.icon;
                return (
                  <li key={ch.id}>
                    <a
                      href={ch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2.5 p-2 -mx-2 rounded-lg hover:bg-slate-800/80 transition-colors"
                      id={`footer-channel-${ch.id}`}
                    >
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border ${ch.colorClass}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200 group-hover:text-amber-300 transition-colors">
                          <span className="truncate">{ch.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-70 group-hover:opacity-100" />
                        </div>
                        <span className="block text-[11px] text-slate-400 truncate">
                          {ch.category}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 4: Reader Care & Administration */}
          <div>
            <h4 className="font-serif text-white font-semibold text-base mb-4 tracking-wide flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Reader Care & Tech</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('subscribe')}
                  className="hover:text-amber-400 transition-colors text-slate-300 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Subscribe to Newsletter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('unsubscribe')}
                  className="hover:text-slate-400 transition-colors text-slate-400 text-xs"
                >
                  Manage / Unsubscribe
                </button>
              </li>
              <li className="pt-2 border-t border-slate-700/50">
                <button
                  onClick={onOpenAdmin}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded border border-slate-600 transition-colors flex items-center gap-1.5 font-medium"
                  id="footer-admin-login-btn"
                  title="Admin Login & Editorial Control Center"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Login</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connect with our community on YouTube & Facebook for live prayer and daily words.
              </p>
            </div>
          </div>
        </div>

        {/* Channels Quick Bar */}
        <div className="py-6 border-b border-slate-700/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-amber-400">Join our online community:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://www.youtube.com/channel/UCAsSQvaTy6ZUPpLeLjbOA6g"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>YouTube Main</span>
              <ExternalLink className="w-3 h-3 text-red-400/70" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCymieOPsE0wPoPjS-vC57LA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              <Tv className="w-3.5 h-3.5 text-red-400" />
              <span>YouTube Broadcasts</span>
              <ExternalLink className="w-3 h-3 text-red-400/70" />
            </a>
            <a
              href="https://www.tiktok.com/@paulinefaith67?_r=1&_t=ZT-99IFvhsT9w6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-pink-950/40 hover:bg-pink-900/60 text-pink-300 border border-pink-800/50 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              <Smartphone className="w-3.5 h-3.5 text-pink-400" />
              <span>TikTok @paulinefaith67</span>
              <ExternalLink className="w-3 h-3 text-pink-400/70" />
            </a>
            <a
              href="https://www.instagram.com/embassyword02/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-fuchsia-950/40 hover:bg-fuchsia-900/60 text-fuchsia-300 border border-fuchsia-800/50 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              <Instagram className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Instagram @embassyword02</span>
              <ExternalLink className="w-3 h-3 text-fuchsia-400/70" />
            </a>
            <a
              href="https://x.com/Wordembass76269"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-800/50 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              <Twitter className="w-3.5 h-3.5 text-sky-400" />
              <span>X @Wordembass76269</span>
              <ExternalLink className="w-3 h-3 text-sky-400/70" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61570922167817"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800/50 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              <Facebook className="w-3.5 h-3.5 text-blue-400" />
              <span>Facebook Page</span>
              <ExternalLink className="w-3 h-3 text-blue-400/70" />
            </a>
            <a
              href="https://www.facebook.com/groups/1421329093238399"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Facebook Group</span>
              <ExternalLink className="w-3 h-3 text-indigo-400/70" />
            </a>
          </div>
        </div>

        {/* Bottom copyright & verse */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="font-scripture italic text-slate-300 text-center md:text-left">
            “Your word is a lamp for my feet, a light on my path.” — Psalm 119:105
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>© {new Date().getFullYear()} Word Embassy Ministries. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

