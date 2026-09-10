import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Video,
  Volume2,
} from 'lucide-react';
import { Newsletter } from '../types';
import { SEO_PILLARS } from '../data/seoPillarsData';
import { setStandardPageSEO, trackSEOEvent } from '../services/seoManager';

interface TopicHubProps {
  newsletters: Newsletter[];
  onNavigate: (view: string, slugOrParam?: string) => void;
  selectedTopicFilter?: string;
}

export const TOPIC_CATEGORIES = [
  {
    id: 'all',
    name: 'All Topics',
    pillarSlug: '',
    description: 'All biblical exegesis, daily devotional teachings, and expository guides.',
  },
  {
    id: 'protection',
    name: 'Divine Protection',
    pillarSlug: 'divine-protection',
    description: 'Abiding under the shadow of the Almighty, angelic ministry, and spiritual warfare.',
  },
  {
    id: 'peace',
    name: 'Supernatural Peace',
    pillarSlug: 'supernatural-peace',
    description: 'Overcoming anxiety, casting cares, and biblical thought transformation.',
  },
  {
    id: 'prayer',
    name: 'Persistent Prayer',
    pillarSlug: 'persistent-prayer',
    description: 'Prevailing intercession, tenacious faith, and communion with God.',
  },
  {
    id: 'healing',
    name: 'Divine Healing',
    pillarSlug: 'divine-healing',
    description: 'Covenant healing, physical restoration, and Jehovah Rapha’s promises.',
  },
  {
    id: 'guidance',
    name: 'Divine Guidance',
    pillarSlug: 'guidance-and-purpose',
    description: 'Hearing God’s voice, discovering purpose, and ordering your steps.',
  },
  {
    id: 'faith',
    name: 'Mountain-Moving Faith',
    pillarSlug: 'mountain-moving-faith',
    description: 'Operating in unwavering faith, overcoming doubt, and speaking God’s Word.',
  },
  {
    id: 'provision',
    name: 'Covenant Provision',
    pillarSlug: 'covenant-provision',
    description: 'Kingdom stewardship, supernatural supply, and Jehovah Jireh’s storehouses.',
  },
  {
    id: 'grace',
    name: 'Grace & Forgiveness',
    pillarSlug: 'grace-and-forgiveness',
    description: 'Freedom from condemnation, cleansing of conscience, and reconciling grace.',
  },
];

export const TopicHub: React.FC<TopicHubProps> = ({
  newsletters,
  onNavigate,
  selectedTopicFilter = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedTopicFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setStandardPageSEO(
      'Bible Study Topics & Exegetical Scripture Hub | Living Word Embassy',
      'Explore theological topic clusters, verse-by-verse exegesis, audio narrations, and biblical guides on divine protection, healing, faith, and grace.',
      '/topics'
    );
    trackSEOEvent('page_view', { page: 'topics_hub' });
  }, []);

  const filteredNewsletters = newsletters.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ScriptureReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'protection') {
      return (
        item.Slug === 'divine-protection' ||
        item.Slug === 'the-lord-is-my-shepherd-psalm-23' ||
        item.Slug === 'the-armor-of-god' ||
        item.Theme.toLowerCase().includes('protection') ||
        item.Theme.toLowerCase().includes('shepherd')
      );
    }
    if (activeTab === 'peace') {
      return (
        item.Slug === 'the-peace-of-god' ||
        item.Slug === 'casting-all-your-cares' ||
        item.Slug === 'renewing-your-mind' ||
        item.Theme.toLowerCase().includes('peace') ||
        item.Theme.toLowerCase().includes('anxiety')
      );
    }
    if (activeTab === 'prayer') {
      return (
        item.Slug === 'the-power-of-persistent-prayer' ||
        item.Slug === 'walking-by-faith' ||
        item.Slug === 'standing-firm-in-faith-and-love' ||
        item.Theme.toLowerCase().includes('prayer')
      );
    }
    if (activeTab === 'healing') {
      return (
        item.Slug === 'healing-scriptures-psalm-103' ||
        item.Theme.toLowerCase().includes('healing') ||
        item.Theme.toLowerCase().includes('wholeness')
      );
    }
    if (activeTab === 'guidance') {
      return (
        item.Slug === 'trust-in-the-lord-proverbs-3' ||
        item.Slug === 'the-lord-is-my-shepherd-psalm-23' ||
        item.Theme.toLowerCase().includes('guidance') ||
        item.Theme.toLowerCase().includes('purpose')
      );
    }
    if (activeTab === 'faith') {
      return (
        item.Slug === 'speaking-to-the-mountain-mark-11' ||
        item.Slug === 'walking-by-faith' ||
        item.Slug === 'standing-firm-in-faith-and-love' ||
        item.Theme.toLowerCase().includes('faith')
      );
    }
    if (activeTab === 'provision') {
      return (
        item.Slug === 'god-shall-supply-all-your-need' ||
        item.Slug === 'the-lord-is-my-shepherd-psalm-23' ||
        item.Theme.toLowerCase().includes('provision') ||
        item.Theme.toLowerCase().includes('stewardship')
      );
    }
    if (activeTab === 'grace') {
      return (
        item.Slug === 'no-condemnation-romans-8' ||
        item.Slug === 'renewing-your-mind' ||
        item.Theme.toLowerCase().includes('grace') ||
        item.Theme.toLowerCase().includes('forgiveness')
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-transparent py-8 sm:py-12" id="topic-hub-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-amber-700 transition-colors">
                Home
              </button>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li className="text-amber-800 font-semibold">Theological Topic Hubs</li>
          </ol>
        </nav>

        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Topical Expository Directory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Scripture Topic Clusters & In-Depth Exegesis
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light max-w-3xl leading-relaxed">
            Every edition of Living Word Embassy is structured into cohesive theological pillars. Explore verse-by-verse Greek and Hebrew insights, devotional audio narrations, and companion prayer declarations.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scripture, theme, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500 text-sm placeholder-slate-400 bg-slate-50"
            />
          </div>
        </div>

        {/* The 8 Core Comprehensive Pillar Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>8 Comprehensive Theological Pillar Guides</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Authoritative, Long-Form Expository Compendiums
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SEO_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                onClick={() => onNavigate('pillar', pillar.slug)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-amber-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={pillar.featuredImage}
                      alt={pillar.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-400/30">
                      Pillar Guide
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="font-serif font-bold text-slate-900 text-lg group-hover:text-amber-800 transition-colors leading-snug">
                      {pillar.title.split(':')[0]}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {pillar.metaDescription}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between text-xs font-semibold text-amber-700">
                  <span>Explore Pillar Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex flex-wrap gap-2">
              {TOPIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id);
                    trackSEOEvent('topic_filter', { category: cat.id });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    activeTab === cat.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {filteredNewsletters.length} Expositions
            </span>
          </div>

          {/* Devotionals in this Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNewsletters.map((nl) => (
              <article
                key={nl.NewsletterID}
                onClick={() => onNavigate('newsletter', nl.Slug)}
                className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        nl.Edition === 'DAILY_DEVOTIONAL'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-indigo-100 text-indigo-900'
                      }`}
                    >
                      {nl.Edition === 'DAILY_DEVOTIONAL' ? 'Daily Devotional' : 'Weekly Exegesis'}
                    </span>
                    <span className="text-xs font-serif font-bold text-amber-800">
                      {nl.ScriptureReference}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors leading-snug">
                    {nl.Title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {nl.Excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {nl.AudioURL && (
                      <span className="flex items-center gap-1 text-amber-700 font-medium">
                        <Volume2 className="w-3.5 h-3.5" /> Audio
                      </span>
                    )}
                    {nl.YouTubeURL && (
                      <span className="flex items-center gap-1 text-red-600 font-medium">
                        <Video className="w-3.5 h-3.5" /> Video
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Study <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
