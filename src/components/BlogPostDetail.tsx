import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  Tag,
  Copy,
  Layers,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Send,
  ExternalLink,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data/blogPostsData';
import { setStandardPageSEO, trackSEOEvent } from '../services/seoManager';

interface BlogPostDetailProps {
  slug: string;
  onNavigate: (view: string, slugOrParam?: string) => void;
  onSubscribe?: (name: string, email: string) => void;
}

export const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
  slug,
  onNavigate,
  onSubscribe,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPrayer, setCopiedPrayer] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subName, setSubName] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  useEffect(() => {
    if (post) {
      setStandardPageSEO(
        post.metaTitle,
        post.metaDescription,
        `https://livingwordembassy.org/blog/${post.slug}`,
        post.featuredImageUrl
      );
      trackSEOEvent('blog_post_view', {
        slug: post.slug,
        primary_keyword: post.primaryKeyword,
        topic: post.topic,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [post]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCopyPrayer = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(post.prayerDeclaration);
      setCopiedPrayer(true);
      setTimeout(() => setCopiedPrayer(false), 3000);
    }
  };

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

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.topic === post.topic).concat(
    BLOG_POSTS.filter((p) => p.slug !== post.slug && p.topic !== post.topic)
  ).slice(0, 3);

  return (
    <article className="bg-[#FDFBF7] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex-wrap">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-amber-700 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('blog')}
            className="hover:text-amber-700 transition-colors"
          >
            Blog
          </button>
          <span>/</span>
          <span className="text-amber-700 font-bold">{post.topic}</span>
        </nav>

        {/* Header Metadata */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {post.topic}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishDate}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-light leading-relaxed">
            {post.subtitle}
          </p>

          {/* Target Keyword Banner */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <Tag className="w-4 h-4 text-amber-700" />
              <span className="font-semibold">Target Search Query:</span>
              <span className="font-bold underline decoration-amber-400">{post.primaryKeyword}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Share Article</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Author Card */}
          <div className="flex items-center gap-4 pt-2 border-t border-slate-200/80">
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
            />
            <div>
              <p className="text-sm font-bold text-slate-900">{post.author.name}</p>
              <p className="text-xs text-slate-500">{post.author.role}</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 relative">
          <img
            src={post.featuredImageUrl}
            alt={post.featuredImageAlt}
            className="w-full h-80 sm:h-96 object-cover"
          />
          <div className="p-3 bg-slate-900/90 text-slate-300 text-xs text-center">
            {post.featuredImageAlt}
          </div>
        </div>

        {/* Scripture Anchor Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-l-4 border-amber-600 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Anchor Scripture
            </span>
            <span className="text-xs font-serif font-bold text-slate-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              {post.scriptureReference}
            </span>
          </div>
          <blockquote className="font-serif text-lg sm:text-xl text-slate-800 italic leading-relaxed">
            “{post.scriptureText}”
          </blockquote>
        </div>

        {/* Hebrew / Greek Word Study Spotlight */}
        {post.hebrewGreekWordStudy && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl p-6 border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Original Language Exegesis Spotlight</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-bold font-serif text-amber-950">
                {post.hebrewGreekWordStudy.term}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                ({post.hebrewGreekWordStudy.transliteration} • Strong’s {post.hebrewGreekWordStudy.strongsNumber})
              </span>
            </div>
            <p className="text-sm text-slate-700">
              <strong className="text-slate-900">Biblical Definition:</strong>{' '}
              {post.hebrewGreekWordStudy.definition}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed italic border-t border-amber-200/60 pt-2">
              <strong className="text-slate-800 not-italic">Theological Significance:</strong>{' '}
              {post.hebrewGreekWordStudy.theologicalSignificance}
            </p>
          </div>
        )}

        {/* Table of Contents */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Table of Contents & Study Outline</span>
          </h2>
          <ul className="space-y-1.5 text-sm text-slate-600 pl-2">
            {post.tableOfContents.map((toc, i) => (
              <li key={toc.id} className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-600 font-bold">{i + 1}.</span>
                <a
                  href={`#${toc.id}`}
                  className="hover:text-amber-800 hover:underline transition-colors"
                >
                  {toc.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-10 text-slate-800 leading-relaxed font-sans text-base sm:text-lg">
          {post.contentSections.map((sec) => (
            <section key={sec.id} id={sec.id} className="space-y-5 scroll-mt-24">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight border-b border-slate-200/80 pb-2">
                {sec.heading}
              </h2>

              {sec.paragraphs.map((p, idx) => (
                <p key={idx} className="text-slate-700 leading-relaxed">
                  {p}
                </p>
              ))}

              {sec.callout && (
                <div className="my-6 p-5 sm:p-6 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs space-y-2">
                  <p className="font-serif text-base sm:text-lg text-amber-950 font-medium italic">
                    “{sec.callout.text}”
                  </p>
                  {sec.callout.citation && (
                    <p className="text-xs font-bold text-amber-800 text-right uppercase tracking-wider">
                      — {sec.callout.citation}
                    </p>
                  )}
                </div>
              )}

              {sec.subsections && sec.subsections.length > 0 && (
                <div className="space-y-4 pt-2">
                  {sec.subsections.map((sub, sIdx) => (
                    <div key={sIdx} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-1.5">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                        {sub.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {sub.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Key Takeaways Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <span>Summary & Key Takeaways</span>
          </h3>
          <ul className="space-y-2.5">
            {post.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Scriptural Prayer Declaration */}
        <div className="bg-gradient-to-br from-amber-500/15 via-amber-100/30 to-amber-50/10 rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Guided Scriptural Prayer Declaration
            </span>
            <button
              onClick={handleCopyPrayer}
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
            >
              {copiedPrayer ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Prayer Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-700" />
                  <span>Copy Prayer</span>
                </>
              )}
            </button>
          </div>

          <p className="font-serif text-base sm:text-lg text-slate-900 leading-relaxed italic bg-white/70 p-5 rounded-2xl border border-amber-200">
            “{post.prayerDeclaration}”
          </p>

          <p className="text-xs text-slate-600">
            *Tip: Speak this prayer aloud every morning to align your vocal confession with God’s eternal Word.
          </p>
        </div>

        {/* Frequently Asked Questions (FAQ) */}
        {post.faqItems && post.faqItems.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3">
              {post.faqItems.map((faq, fIdx) => (
                <div key={fIdx} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                    {faq.question}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-Link Cards to Pillar & Daily Devotional */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Deepen Your Scripture Study</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold">
            Connect with the Complete Theological Pillar
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            This article is part of our comprehensive curriculum on <strong>{post.topic}</strong>. Explore our master pillar compendium for verse-by-verse exegesis, Old vs. New Covenant comparison charts, and printable prayer protocols.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            {post.pillarSlug && (
              <button
                onClick={() => onNavigate('pillar', post.pillarSlug)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Read Master Pillar Guide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {post.relatedNewsletterSlug && (
              <button
                onClick={() => onNavigate('newsletter', post.relatedNewsletterSlug)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-colors border border-white/20 flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>View Daily Devotional</span>
              </button>
            )}
          </div>
        </div>

        {/* In-Article Newsletter Subscription */}
        <div className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200 text-center space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            Enjoyed this expository study?
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Subscribe free to receive weekly scripture breakdowns, theological analysis, and prayer declarations in your email.
          </p>
          {subSuccess ? (
            <div className="bg-emerald-100 text-emerald-800 p-3 rounded-xl font-medium text-xs sm:text-sm max-w-sm mx-auto">
              Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="Name"
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
              />
              <input
                type="email"
                required
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="Email Address"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Related Articles in this Cluster */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Related Expository Articles
            </h3>
            <button
              onClick={() => onNavigate('blog')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <span>View All Articles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onNavigate('blog-post', rel.slug)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <img
                    src={rel.featuredImageUrl}
                    alt={rel.featuredImageAlt}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                      {rel.topic}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-slate-900 line-clamp-2 hover:text-amber-700 transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0 text-[11px] font-semibold text-slate-500 flex items-center justify-between border-t border-slate-100 mt-2">
                  <span>{rel.readTimeMinutes} min read</span>
                  <span className="text-amber-700 flex items-center gap-0.5">
                    Read <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Blog Button */}
        <div className="pt-6 text-center">
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blog Articles</span>
          </button>
        </div>
      </div>
    </article>
  );
};
