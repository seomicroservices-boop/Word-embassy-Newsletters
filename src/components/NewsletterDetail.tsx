import React, { useState } from 'react';
import {
  Calendar,
  Share2,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Send,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Newsletter } from '../types';
import { InfographicCanvas } from './InfographicCanvas';
import { VeoVideoPlayer } from './VeoVideoPlayer';

interface NewsletterDetailProps {
  newsletter: Newsletter;
  allNewsletters: Newsletter[];
  onNavigate: (view: string, slug?: string) => void;
  onSubscribe: (name: string, email: string) => void;
}

export const NewsletterDetail: React.FC<NewsletterDetailProps> = ({
  newsletter,
  allNewsletters,
  onNavigate,
  onSubscribe,
}) => {
  const [copied, setCopied] = useState(false);
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subscribedMessage, setSubscribedMessage] = useState(false);

  // Find prev/next newsletters
  const currentIndex = allNewsletters.findIndex((n) => n.Slug === newsletter.Slug);
  const prevNewsletter = currentIndex > 0 ? allNewsletters[currentIndex - 1] : null;
  const nextNewsletter =
    currentIndex < allNewsletters.length - 1 ? allNewsletters[currentIndex + 1] : null;

  const currentUrl = `https://www.wordembassy.org/newsletter/${newsletter.Slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInlineSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    onSubscribe(subName || 'Faithful Reader', subEmail);
    setSubscribedMessage(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-8 font-medium">
          <button
            onClick={() => onNavigate('archive')}
            className="flex items-center gap-1 hover:text-[#B45309] transition-colors"
            id="back-to-archive-btn"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Editions</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-[#B45309] px-2.5 py-1 rounded-full font-semibold">
              {newsletter.Theme}
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(newsletter.PublishDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-8 text-center sm:text-left">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#1E293B] leading-tight tracking-tight">
            {newsletter.Title}
          </h1>

          <p className="text-lg text-slate-600 font-light leading-relaxed">
            {newsletter.Excerpt}
          </p>

          {/* Social Share Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-slate-200 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <BookOpen className="w-4 h-4 text-[#B45309]" />
              <span>Word Embassy Official Publication</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Copy Link"
                id="copy-newsletter-link-btn"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${newsletter.Title} - ${currentUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 transition-colors shadow-2xs"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(newsletter.Title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-sky-50 hover:text-sky-600 text-slate-700 transition-colors shadow-2xs"
                title="Share on X"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-colors shadow-2xs"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(newsletter.Title)}&body=${encodeURIComponent(`Read this wonderful Bible devotional from Word Embassy:\n\n${currentUrl}`)}`}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-amber-50 hover:text-[#B45309] text-slate-700 transition-colors shadow-2xs"
                title="Share via Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-10 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
          <img
            src={newsletter.FeaturedImageURL}
            alt={newsletter.Title}
            className="w-full h-auto max-h-[460px] object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="bg-white/90 backdrop-blur-xs px-4 py-2 text-xs text-slate-500 italic border-t border-slate-100 text-right">
            Word Embassy Visual Meditation • {newsletter.Theme}
          </div>
        </div>

        {/* Key Scripture Callout Box */}
        <div className="bg-[#FEF3C7] rounded-2xl p-6 sm:p-8 border-2 border-[#FDE68A] shadow-xs mb-10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase tracking-widest mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Key Scripture Foundation</span>
          </div>
          <blockquote className="font-scripture text-xl sm:text-2xl text-[#1E293B] italic font-medium leading-relaxed mb-4">
            “{newsletter.ScriptureText}”
          </blockquote>
          <div className="text-right font-sans font-bold text-sm text-[#92400E]">
            — {newsletter.ScriptureReference}
          </div>
        </div>

        {/* Main Body Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-10">
          {/* Opening Section */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#1E293B] border-b border-slate-100 pb-3">
              Opening Reflection
            </h2>
            <div className="text-slate-700 text-lg leading-relaxed space-y-4">
              <p>{newsletter.Opening}</p>
            </div>
          </section>

          {/* In-depth Biblical Teaching */}
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#1E293B] border-b border-slate-100 pb-3">
              Biblical Exposition & Teaching
            </h2>
            <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-line space-y-4 font-light">
              <p>{newsletter.Teaching}</p>
            </div>
          </section>

          {/* Three Key Transformative Points */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#1E293B] border-b border-slate-100 pb-3">
              Three Scriptural Pillars
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {/* Point 1 */}
              <div className="bg-[#FDFBF7] p-6 rounded-xl border border-slate-200 flex items-start gap-4">
                <span className="w-10 h-10 rounded-lg bg-[#1E293B] text-[#FEF3C7] flex items-center justify-center font-bold text-base shrink-0 font-sans shadow-xs">
                  01
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#1E293B]">
                    {newsletter.KeyPoint1Title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {newsletter.KeyPoint1Body}
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="bg-[#FDFBF7] p-6 rounded-xl border border-slate-200 flex items-start gap-4">
                <span className="w-10 h-10 rounded-lg bg-[#1E293B] text-[#FEF3C7] flex items-center justify-center font-bold text-base shrink-0 font-sans shadow-xs">
                  02
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#1E293B]">
                    {newsletter.KeyPoint2Title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {newsletter.KeyPoint2Body}
                  </p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="bg-[#FDFBF7] p-6 rounded-xl border border-slate-200 flex items-start gap-4">
                <span className="w-10 h-10 rounded-lg bg-[#1E293B] text-[#FEF3C7] flex items-center justify-center font-bold text-base shrink-0 font-sans shadow-xs">
                  03
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#1E293B]">
                    {newsletter.KeyPoint3Title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {newsletter.KeyPoint3Body}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Practical Application */}
          <section className="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4" />
              <span>Living the Truth</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1E293B]">
              Practical Application for Daily Life
            </h2>
            <div className="text-slate-700 leading-relaxed whitespace-pre-line space-y-2 text-base">
              {newsletter.PracticalApplication}
            </div>
          </section>

          {/* Prayer Section with Illuminated Styling */}
          <section className="relative bg-gradient-to-br from-amber-50/80 via-white to-amber-100/40 p-6 sm:p-8 rounded-xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#92400E] uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sincere Pastoral Prayer</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1E293B]">
              Let Us Pray Together
            </h2>
            <div className="font-scripture text-lg text-slate-800 italic leading-relaxed bg-white/70 p-5 rounded-lg border border-amber-100">
              {newsletter.Prayer}
            </div>
          </section>

          {/* Closing Benediction */}
          <section className="text-center pt-4 border-t border-slate-100 space-y-2">
            <p className="font-serif text-xl italic font-semibold text-[#1E293B]">
              “{newsletter.Closing}”
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Word Embassy Editorial & Pastoral Team • www.wordembassy.org
            </p>
          </section>
        </div>

        {/* Infographic Summary Canvas */}
        <InfographicCanvas newsletter={newsletter} />

        {/* Veo Video Player Reel */}
        <VeoVideoPlayer newsletter={newsletter} />

        {/* Next/Prev Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
          {prevNewsletter ? (
            <button
              onClick={() => onNavigate('newsletter', prevNewsletter.Slug)}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-left transition-all shadow-xs group"
              id="prev-newsletter-btn"
            >
              <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 font-semibold group-hover:text-[#B45309]">
                <ChevronLeft className="w-4 h-4" /> Previous Edition
              </div>
              <h4 className="font-serif text-base font-bold text-[#1E293B] line-clamp-1">
                {prevNewsletter.Title}
              </h4>
            </button>
          ) : (
            <div />
          )}

          {nextNewsletter ? (
            <button
              onClick={() => onNavigate('newsletter', nextNewsletter.Slug)}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-right transition-all shadow-xs group"
              id="next-newsletter-btn"
            >
              <div className="flex items-center justify-end gap-1 text-xs text-slate-500 mb-1 font-semibold group-hover:text-[#B45309]">
                Next Edition <ChevronRight className="w-4 h-4" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#1E293B] line-clamp-1">
                {nextNewsletter.Title}
              </h4>
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Inline Subscription CTA */}
        <div className="bg-[#1E293B] text-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-700 text-center space-y-6 my-12">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/30">
            <Mail className="w-6 h-6" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Receive Word Embassy Every Wednesday
            </h3>
            <p className="text-sm text-slate-300">
              Join thousands of believers worldwide receiving biblically faithful teachings, prayer devotionals, and infographics directly in their inbox. Free forever.
            </p>
          </div>

          {subscribedMessage ? (
            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 p-4 rounded-xl max-w-md mx-auto text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Thank you! You are now subscribed to Word Embassy.</span>
            </div>
          ) : (
            <form
              onSubmit={handleInlineSubscribe}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="text"
                placeholder="Your Name"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full sm:w-1/3 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
              />
              <input
                type="email"
                required
                placeholder="Your Email Address"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                className="w-full sm:w-2/3 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-3 rounded-lg font-bold text-sm shrink-0 transition-transform active:scale-95 shadow-md"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </article>
    </div>
  );
};
