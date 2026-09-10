import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  Tag,
  Share2,
  CheckCircle,
  Layers,
  ChevronRight,
  HelpCircle,
  Flame,
  Bookmark,
  Send,
} from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data/blogPostsData';
import { setStandardPageSEO, trackSEOEvent } from '../services/seoManager';

interface BlogHubProps {
  onNavigate: (view: string, slugOrParam?: string) => void;
  onSubscribe?: (name: string, email: string) => void;
}

export const BlogHub: React.FC<BlogHubProps> = ({ onNavigate, onSubscribe }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [subEmail, setSubEmail] = useState('');
  const [subName, setSubName] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  useEffect(() => {
    setStandardPageSEO(
      'Biblical Teaching Blog & Expository Articles | Living Word Embassy',
      'Explore in-depth Bible study articles, scripture exegesis, healing promises, prayers for anxiety, and theological guides covering all covenant topics.',
      'https://livingwordembassy.org/blog',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80'
    );
    trackSEOEvent('blog_view', { article_count: BLOG_POSTS.length });
  }, []);

  const topicsList = [
    { id: 'ALL', name: 'All Topics' },
    { id: 'Divine Healing', name: 'Divine Healing' },
    { id: 'Anxiety & Peace', name: 'Anxiety & Peace' },
    { id: 'Divine Protection', name: 'Divine Protection' },
    { id: 'Guidance & Purpose', name: 'Guidance & Purpose' },
    { id: 'Persistent Prayer', name: 'Persistent Prayer' },
    { id: 'Mountain-Moving Faith', name: 'Faith & Doubt' },
    { id: 'Covenant Provision', name: 'Covenant Provision' },
    { id: 'Grace & Forgiveness', name: 'Grace & Forgiveness' },
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesTopic = selectedTopic === 'ALL' || post.topic === selectedTopic;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(q) ||
      post.subtitle.toLowerCase().includes(q) ||
      post.primaryKeyword.toLowerCase().includes(q) ||
      post.secondaryKeywords.some((k) => k.toLowerCase().includes(q)) ||
      post.scriptureReference.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q);

    return matchesTopic && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    if (onSubscribe) {
      onSubscribe(subName.trim() || 'Faithful Reader', subEmail.trim());
    }
    setSubSuccess(true);
    setTimeout(() => {
      setSubSuccess(false);
      setSubEmail('');
      setSubName('');
    }, 4000);
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Header */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-amber-700 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-amber-800">Blog & Study Articles</span>
        </nav>

        {/* Page Hero Title & Subtitle */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold tracking-wide">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>LIVING WORD EMBASSY EXPOSITORY BLOG</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            Scripture Exegesis, Theology & Daily Faith Articles
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            In-depth theological studies, original language word insights (Hebrew & Greek), practical life applications, and scriptural prayers organized by covenant themes.
          </p>
        </header>

        {/* Search & Topic Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. 'healing scriptures', 'anxiety', 'proverbs 3', 'mark 11', 'psalm 91')..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm sm:text-base transition-all"
            />
          </div>

          {/* Topic Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {topicsList.map((top) => {
              const active = selectedTopic === top.id;
              return (
                <button
                  key={top.id}
                  onClick={() => setSelectedTopic(top.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-amber-600 text-white shadow-sm font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {active && <Sparkles className="w-3.5 h-3.5" />}
                  <span>{top.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Article Spotlight (shown if on ALL and no search) */}
        {selectedTopic === 'ALL' && !searchQuery.trim() && featuredPost && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12 gap-0 group">
            <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden">
              <img
                src={featuredPost.featuredImageUrl}
                alt={featuredPost.featuredImageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                <Flame className="w-3.5 h-3.5" />
                <span>Featured Exegesis</span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                  <span>{featuredPost.topic}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTimeMinutes} min read
                  </span>
                </div>

                <h2
                  onClick={() => onNavigate('blog-post', featuredPost.slug)}
                  className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 hover:text-amber-700 cursor-pointer transition-colors leading-tight"
                >
                  {featuredPost.title}
                </h2>

                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                {/* Primary Keyword Badge */}
                <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Target Keyword:
                  </span>
                  <span className="inline-block bg-amber-100 text-amber-900 text-xs font-medium px-2.5 py-0.5 rounded-md">
                    {featuredPost.primaryKeyword}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredPost.author.avatarUrl}
                    alt={featuredPost.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{featuredPost.author.name}</p>
                    <p className="text-[11px] text-slate-500">{featuredPost.publishDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('blog-post', featuredPost.slug)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-amber-700 text-xs font-bold transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              {selectedTopic === 'ALL' ? 'All Biblical Expository Articles' : `${selectedTopic} Articles`}
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredPosts.length} article{filteredPosts.length === 1 ? '' : 's'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-slate-800">No articles matched your query</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try clearing your search or switching to another category pill to explore all covenant topics.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTopic('ALL');
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div
                      onClick={() => onNavigate('blog-post', post.slug)}
                      className="relative h-48 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={post.featuredImageUrl}
                        alt={post.featuredImageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#1E293B]/90 text-amber-300 backdrop-blur-xs shadow-xs">
                          {post.topic}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 text-slate-800 shadow-xs flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {post.readTimeMinutes} min
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-3">
                      <div className="text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Keyword: {post.primaryKeyword}</span>
                      </div>

                      <h4
                        onClick={() => onNavigate('blog-post', post.slug)}
                        className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-700 cursor-pointer transition-colors leading-snug line-clamp-2"
                      >
                        {post.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="pt-2 text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/60">
                        Anchor: {post.scriptureReference}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs text-slate-600 font-medium">{post.author.name}</span>
                    </div>

                    <button
                      onClick={() => onNavigate('blog-post', post.slug)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors"
                    >
                      <span>Read Article</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Cross-Link Exploration Banner */}
        <section className="bg-gradient-to-br from-[#1E293B] to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>THEOLOGICAL PILLARS & DAILY DEVOTIONALS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Looking for Master Guides or Daily Expositions?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every blog post connects directly to our 8 Topical Pillar Compendiums and our daily scripture newsletter. Dive deeper into verse-by-verse exegesis, audio narrations, and printable PDF prayer declarations.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('topics')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-md flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Explore 8 Pillar Guides</span>
              </button>
              <button
                onClick={() => onNavigate('archive')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-colors border border-white/20 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Devotional Archive</span>
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription Box */}
        <section className="bg-amber-50/60 rounded-3xl p-8 sm:p-10 border border-amber-200/80 text-center max-w-3xl mx-auto space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Receive New Expository Articles in Your Inbox
          </h3>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Join thousands of faithful believers who receive our biblical teaching, original Greek/Hebrew word studies, and prayer declarations weekly.
          </p>

          {subSuccess ? (
            <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 max-w-md mx-auto">
              <CheckCircle className="w-4 h-4" />
              <span>Thank you for subscribing! Check your inbox shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <input
                type="text"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="Your Name"
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <input
                type="email"
                required
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="Your Email Address"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
