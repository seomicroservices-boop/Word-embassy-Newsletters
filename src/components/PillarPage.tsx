import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Share2,
  Bookmark,
  Layers,
  FileText,
  Mail,
  Check,
} from 'lucide-react';
import { PillarData, SEO_PILLARS } from '../data/seoPillarsData';
import { setPillarSEO, trackSEOEvent } from '../services/seoManager';

interface PillarPageProps {
  pillarSlug: string;
  onNavigate: (view: string, slugOrParam?: string) => void;
  onSubscribe: (name: string, email: string) => void;
}

export const PillarPage: React.FC<PillarPageProps> = ({
  pillarSlug,
  onNavigate,
  onSubscribe,
}) => {
  const pillar = SEO_PILLARS.find((p) => p.slug === pillarSlug) || SEO_PILLARS[0];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPillarSEO({
      id: pillar.id,
      slug: pillar.slug,
      title: pillar.title,
      metaTitle: pillar.metaTitle,
      metaDescription: pillar.metaDescription,
      keywords: [pillar.primaryKeyword, ...pillar.secondaryKeywords],
      featuredImage: pillar.featuredImage,
      faqs: pillar.faqs,
    });
    trackSEOEvent('pillar_view', { pillarId: pillar.id, slug: pillar.slug });
  }, [pillar]);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleInlineSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    onSubscribe(subName || 'Faithful Reader', subEmail);
    trackSEOEvent('newsletter_signup', { source: 'pillar_page', pillar: pillar.slug });
    setSubSuccess(true);
  };

  return (
    <div className="min-h-screen bg-transparent py-8 sm:py-12" id="pillar-page-container">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Semantic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
            <li>
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-amber-700 transition-colors"
                id="breadcrumb-home"
              >
                Home
              </button>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li>
              <button
                onClick={() => onNavigate('topics')}
                className="hover:text-amber-700 transition-colors"
                id="breadcrumb-topics"
              >
                Theological Pillars
              </button>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li className="text-amber-800 font-semibold truncate max-w-[240px] sm:max-w-xs">
              {pillar.title.split(':')[0]}
            </li>
          </ol>
        </nav>

        {/* Pillar Header Card */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200/80 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Core Theological Pillar</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              Comprehensive Study Guide
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight" id="pillar-h1-heading">
            {pillar.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 font-light leading-relaxed">
            {pillar.leadParagraph}
          </p>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <BookOpen className="w-4 h-4 text-amber-600" />
                {pillar.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Updated {pillar.lastUpdated}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                12 min deep exegesis
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 font-medium"
                id="copy-pillar-link-btn"
                title="Copy Canonical URL"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Guide'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-10 rounded-2xl overflow-hidden shadow-md border border-slate-200">
          <img
            src={pillar.featuredImage}
            alt={pillar.title}
            className="w-full h-72 sm:h-96 object-cover"
            loading="lazy"
            id="pillar-featured-image"
          />
        </div>

        {/* Table of Contents Box */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 mb-12 shadow-2xs">
          <h2 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>Guide Outline & Table of Contents</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
            <a href="#what-is" className="hover:text-amber-800 transition-colors py-0.5">
              1. {pillar.whatIsSection.heading}
            </a>
            <a href="#how-it-works" className="hover:text-amber-800 transition-colors py-0.5">
              2. {pillar.howItWorksSection.heading}
            </a>
            <a href="#types-dimensions" className="hover:text-amber-800 transition-colors py-0.5">
              3. {pillar.typesSection.heading}
            </a>
            <a href="#benefits" className="hover:text-amber-800 transition-colors py-0.5">
              4. Spiritual & Practical Benefits
            </a>
            <a href="#costs" className="hover:text-amber-800 transition-colors py-0.5">
              5. The Spiritual Cost of Neglect
            </a>
            <a href="#discernment" className="hover:text-amber-800 transition-colors py-0.5">
              6. Discernment & Daily Application
            </a>
            <a href="#common-problems" className="hover:text-amber-800 transition-colors py-0.5">
              7. Common Hindrances & Misconceptions
            </a>
            <a href="#comparison-table" className="hover:text-amber-800 transition-colors py-0.5">
              8. Biblical Exegesis Comparison Table
            </a>
            <a href="#cluster-articles" className="hover:text-amber-800 transition-colors py-0.5">
              9. Supporting Devotionals & Expositions
            </a>
            <a href="#faqs" className="hover:text-amber-800 transition-colors py-0.5">
              10. Frequently Asked Questions
            </a>
          </div>
        </div>

        {/* Section 1: What is [Topic]? */}
        <section id="what-is" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {pillar.whatIsSection.heading}
          </h2>
          <div className="text-slate-700 leading-relaxed text-base sm:text-lg space-y-4 font-light">
            {pillar.whatIsSection.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500 block mb-2">
              Key Scripture Anchors:
            </span>
            <div className="flex flex-wrap gap-2">
              {pillar.whatIsSection.scriptureAnchors.map((verse, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 font-serif text-xs font-semibold border border-amber-300/40"
                >
                  {verse}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: How It Works */}
        <section id="how-it-works" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {pillar.howItWorksSection.heading}
          </h2>
          <div className="text-slate-700 leading-relaxed text-base font-light space-y-3">
            {pillar.howItWorksSection.content.map((c, i) => (
              <p key={i}>{c}</p>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {pillar.howItWorksSection.theologicalPillars.map((tp, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-base leading-snug">
                  {tp.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tp.explanation}
                </p>
                <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  {tp.ref}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Types / Dimensions */}
        <section id="types-dimensions" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {pillar.typesSection.heading}
          </h2>
          <div className="space-y-4">
            {pillar.typesSection.dimensions.map((dim, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-serif font-bold text-slate-900 text-lg">
                    {dim.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {dim.description}
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200/70 self-start">
                  {dim.keyVerse}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Benefits */}
        <section id="benefits" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {pillar.benefitsSection.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60">
              <h3 className="font-serif font-bold text-emerald-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Spiritual Benefits</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {pillar.benefitsSection.spiritual.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-blue-50/50 border border-blue-200/60">
              <h3 className="font-serif font-bold text-blue-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Practical & Emotional Benefits</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {pillar.benefitsSection.practical.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Costs & Investments */}
        <section id="costs" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {pillar.costsSection.heading}
          </h2>
          <p className="text-slate-700 text-base font-light leading-relaxed">
            {pillar.costsSection.explanation}
          </p>
          <div className="space-y-2 pt-2">
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
              Essential Spiritual Disciplines Required:
            </span>
            <ul className="space-y-2 text-sm text-slate-700">
              {pillar.costsSection.investments.map((inv, idx) => (
                <li key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-amber-50/60 border border-amber-200/50">
                  <div className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                  <span>{inv}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 6: Discernment & Choosing */}
        <section id="discernment" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {pillar.howToChooseSection.heading}
          </h2>
          <div className="space-y-3">
            {pillar.howToChooseSection.discernmentSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Common Problems */}
        <section id="common-problems" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {pillar.commonProblemsSection.heading}
          </h2>
          <div className="space-y-4">
            {pillar.commonProblemsSection.pitfalls.map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/70 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Misconception: {p.mistake}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-4 border-l-2 border-rose-300">
                  <strong className="text-slate-900 font-semibold">Biblical Truth:</strong> {p.biblicalCorrection}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Exegesis Comparison Table */}
        <section id="comparison-table" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
            {pillar.comparisonTable.title}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-serif text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3 font-bold">Theological Dimension</th>
                  <th className="p-3 font-bold">Old Testament Anchor</th>
                  <th className="p-3 font-bold">New Testament Fulfillment</th>
                  <th className="p-3 font-bold">Daily Christian Walk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pillar.comparisonTable.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-3 font-semibold text-slate-900 align-top">{row.aspect}</td>
                    <td className="p-3 text-slate-600 align-top">{row.oldTestamentContext}</td>
                    <td className="p-3 text-slate-700 font-medium align-top bg-amber-50/20">{row.newTestamentFulfillment}</td>
                    <td className="p-3 text-emerald-800 font-medium align-top">{row.practicalDailyWalk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 9: Hub-and-Spoke Cluster Articles */}
        <section id="cluster-articles" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Supporting Devotionals & Expositions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore in-depth studies and audio narrations connected to this theological pillar.
              </p>
            </div>
            <button
              onClick={() => onNavigate('archive')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillar.clusterArticles.map((cl, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('newsletter', cl.slug)}
                className="group cursor-pointer p-5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 transition-all shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {cl.edition === 'DAILY_DEVOTIONAL' ? 'Daily' : 'Weekly Exegesis'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 font-serif">
                      {cl.scripture}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-amber-800 transition-colors leading-snug">
                    {cl.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {cl.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
                  <span>Read Full Teaching</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 10: Frequently Asked Questions (FAQPage Schema) */}
        <section id="faqs" className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <HelpCircle className="w-6 h-6 text-amber-600" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {pillar.faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left font-serif font-bold text-slate-900 hover:text-amber-800 text-base sm:text-lg flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={openFaqIndex === idx}
                >
                  <span>{faq.question}</span>
                  <span className="text-amber-600 font-sans text-xl shrink-0">
                    {openFaqIndex === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === idx && (
                  <div className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-light pl-2 border-l-2 border-amber-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Conversion CTA Box */}
        <section className="bg-gradient-to-br from-[#1E293B] to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-700 shadow-xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-400/30">
            <Mail className="w-3.5 h-3.5" />
            <span>Free Christian Digital Newsletter</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            {pillar.ctaTitle}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            {pillar.ctaDescription}
          </p>

          {subSuccess ? (
            <div className="bg-emerald-900/60 border border-emerald-500/60 text-emerald-200 p-4 rounded-xl max-w-md mx-auto flex items-center justify-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Thank you! You are now subscribed to this theological series.</span>
            </div>
          ) : (
            <form onSubmit={handleInlineSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-amber-400 flex-1"
              />
              <input
                type="email"
                required
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="Your Email Address"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-amber-400 flex-1"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors whitespace-nowrap"
              >
                Join Free
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-400">
            Zero spam. Unsubscribe anytime in one click. Respecting your privacy completely.
          </p>
        </section>
      </article>
    </div>
  );
};
