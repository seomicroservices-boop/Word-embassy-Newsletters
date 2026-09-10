import React, { useState, useEffect } from 'react';
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
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Newsletter } from '../types';
import { InfographicCanvas } from './InfographicCanvas';
import { VeoVideoPlayer } from './VeoVideoPlayer';
import { DevotionalAudioPlayer } from './DevotionalAudioPlayer';
import { BiblePassageViewer } from './BiblePassageViewer';
import { parseScriptureReference } from '../services/bibleScripture';
import { setNewsletterSEO, trackSEOEvent } from '../services/seoManager';

interface NewsletterDetailProps {
  newsletter: Newsletter;
  allNewsletters: Newsletter[];
  onNavigate: (view: string, slug?: string) => void;
  onSubscribe: (name: string, email: string) => void;
  onUpdateNewsletter?: (id: string, updates: Partial<Newsletter>) => void;
}

export const NewsletterDetail: React.FC<NewsletterDetailProps> = ({
  newsletter,
  allNewsletters,
  onNavigate,
  onSubscribe,
  onUpdateNewsletter,
}) => {
  const [copied, setCopied] = useState(false);
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subscribedMessage, setSubscribedMessage] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setNewsletterSEO(newsletter);
    trackSEOEvent('scripture_read', {
      slug: newsletter.Slug,
      title: newsletter.Title,
      reference: newsletter.ScriptureReference,
    });
  }, [newsletter]);

  // Determine parent pillar for hub-and-spoke internal linking
  let parentPillar = {
    slug: 'persistent-prayer',
    title: 'The Doctrine of Persistent Prayer',
  };
  if (
    newsletter.Slug === 'divine-protection' ||
    newsletter.Slug === 'the-lord-is-my-shepherd-psalm-23' ||
    newsletter.Slug === 'the-armor-of-god'
  ) {
    parentPillar = {
      slug: 'divine-protection',
      title: 'The Biblical Doctrine of Divine Protection (Psalm 91)',
    };
  } else if (
    newsletter.Slug === 'the-peace-of-god' ||
    newsletter.Slug === 'casting-all-your-cares' ||
    newsletter.Slug === 'renewing-your-mind'
  ) {
    parentPillar = {
      slug: 'supernatural-peace',
      title: 'Supernatural Peace in Seasons of Anxiety',
    };
  }

  // Find related cluster newsletters (excluding current)
  const relatedClusterStudies = allNewsletters
    .filter((n) => n.Slug !== newsletter.Slug && n.Theme === newsletter.Theme)
    .slice(0, 3);
  const fallbackRelated = allNewsletters
    .filter((n) => n.Slug !== newsletter.Slug)
    .slice(0, 3);
  const clusterDisplayList = relatedClusterStudies.length > 0 ? relatedClusterStudies : fallbackRelated;

  // Parse Scripture Reference into Book, Chapter, and Verses
  const parsedScripture = parseScriptureReference(newsletter.ScriptureReference);
  const displayBook = newsletter.BibleBook || parsedScripture.book;
  const displayChapter =
    newsletter.BibleChapter !== undefined ? String(newsletter.BibleChapter) : parsedScripture.chapter;
  const displayVerses = newsletter.BibleVerses || parsedScripture.verses;

  const handleRegenerateAudio = async () => {
    setIsGeneratingAudio(true);
    try {
      const spokenScript = `${newsletter.Title}. Scripture foundation: ${newsletter.ScriptureReference}. “${newsletter.ScriptureText}”. In our devotional meditation today, we reflect on God’s word: ${newsletter.Opening || newsletter.Excerpt}. Let us pray together: ${newsletter.Prayer} In the precious name of Jesus Christ our Lord, Amen.`;

      const res = await fetch('/api/audio/generate-narration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: spokenScript,
          title: newsletter.Title,
          scripture: newsletter.ScriptureReference,
          verseText: newsletter.ScriptureText,
          prayer: newsletter.Prayer,
          voiceId: 'nPczCjzI2devNBz1zQrb',
          newsletterId: newsletter.NewsletterID,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioUrl) {
          onUpdateNewsletter?.(newsletter.NewsletterID, {
            AudioURL: data.audioUrl,
            AudioNarrationDuration: data.duration || '2:15',
            AudioVoice: `${data.provider || 'ElevenLabs'} (nPczCjzI2devNBz1zQrb)`,
            AudioTranscript: data.transcript || spokenScript,
          });
        }
      }
    } catch (err) {
      console.warn('Failed to regenerate audio narration:', err);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

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
    <div className="min-h-screen bg-transparent py-8 sm:py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Semantic Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
            <li>
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-amber-700 transition-colors"
                id="breadcrumb-article-home"
              >
                Home
              </button>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li>
              <button
                onClick={() => onNavigate('archive')}
                className="hover:text-amber-700 transition-colors"
                id="breadcrumb-article-archive"
              >
                Devotionals Archive
              </button>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li>
              <button
                onClick={() => onNavigate('pillar', parentPillar.slug)}
                className="hover:text-amber-700 transition-colors"
                id="breadcrumb-article-pillar"
              >
                {parentPillar.title.split(':')[0]}
              </button>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li className="text-amber-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {newsletter.Title}
            </li>
          </ol>
        </nav>

        {/* Top Return & Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 mb-6 font-medium">
          <button
            onClick={() => onNavigate('archive')}
            className="flex items-center gap-1 hover:text-[#B45309] transition-colors self-start"
            id="back-to-archive-btn"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Editions</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold shadow-2xs ${
                newsletter.Edition === 'DAILY_DEVOTIONAL'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {newsletter.Edition === 'DAILY_DEVOTIONAL'
                ? '☀️ Daily Devotional (Tue–Sun)'
                : '📖 Weekly Deep Exegesis (Mon)'}
            </span>
            <span className="bg-amber-100 text-[#92400E] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-amber-300/60 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {displayBook} {displayChapter}: {displayVerses}
              </span>
            </span>
            <span className="bg-amber-50 text-[#B45309] px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-200">
              {newsletter.Theme}
            </span>
            <span className="flex items-center gap-1 text-slate-600 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(newsletter.PublishDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Hub-and-Spoke Pillar Link Banner */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Part of Core Scripture Pillar:
              </span>
              <span className="text-xs sm:text-sm font-serif font-bold text-slate-900">
                {parentPillar.title}
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('pillar', parentPillar.slug)}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 shrink-0 self-end sm:self-center group"
          >
            <span>Read Complete Pillar Guide</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-8 text-center sm:text-left">
          {/* Prominent Bible Chapter & Verse Tag */}
          <div className="inline-flex items-center gap-2 bg-[#FEF3C7] border border-[#FDE68A] px-3.5 py-1.5 rounded-xl text-amber-900 shadow-2xs">
            <BookOpen className="w-4 h-4 text-[#B45309]" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Bible Chapter & Verse:
            </span>
            <span className="font-serif font-black text-sm sm:text-base text-slate-900">
              {displayBook} {displayChapter}: {displayVerses}
            </span>
          </div>

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
              <span>Living Word Embassy Official Publication</span>
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
                href={`mailto:?subject=${encodeURIComponent(newsletter.Title)}&body=${encodeURIComponent(`Read this wonderful Bible devotional from Living Word Embassy:\n\n${currentUrl}`)}`}
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
            Living Word Embassy Visual Meditation • {newsletter.Theme}
          </div>
        </div>

        {/* ElevenLabs Devotional Audio Narration Player */}
        <div className="mb-10">
          <DevotionalAudioPlayer
            audioUrl={newsletter.AudioURL}
            title={newsletter.Title}
            scriptureReference={newsletter.ScriptureReference}
            scriptureText={newsletter.ScriptureText}
            bibleBook={displayBook}
            bibleChapter={displayChapter}
            bibleVerses={displayVerses}
            prayer={newsletter.Prayer}
            transcript={newsletter.AudioTranscript}
            durationText={newsletter.AudioNarrationDuration || '2:15'}
            voiceName={newsletter.AudioVoice || 'ElevenLabs Voice (nPczCjzI2devNBz1zQrb)'}
            onRegenerateAudio={handleRegenerateAudio}
            isGeneratingAudio={isGeneratingAudio}
          />
        </div>

        {/* Interactive Bible Chapter & Verses Foundation */}
        <div className="mb-10">
          <BiblePassageViewer
            scriptureReference={newsletter.ScriptureReference}
            scriptureText={newsletter.ScriptureText}
            bibleBook={displayBook}
            bibleChapter={displayChapter}
            bibleVerses={displayVerses}
            bibleTranslation={newsletter.BibleTranslation || 'NIV'}
            fullChapterContext={newsletter.FullChapterContext}
            versesBreakdown={newsletter.VersesBreakdown}
          />
        </div>

        {/* Main Body Content */}
        <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-10">
          {/* Devotional Scripture Anchor with Chapter & Verses */}
          <section className="bg-gradient-to-br from-amber-50/90 via-[#FFFDF8] to-amber-100/50 p-6 sm:p-8 rounded-2xl border border-amber-200/90 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[#92400E]">
              <span className="inline-flex items-center gap-1.5 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#B45309]" />
                <span>Devotional Foundation • Chapter & Verses</span>
              </span>
              <span className="font-serif font-black text-sm sm:text-base px-3 py-1 rounded-lg bg-amber-200/80 text-amber-950 border border-amber-300">
                {displayBook} {displayChapter}: {displayVerses} ({newsletter.BibleTranslation || 'NIV'})
              </span>
            </div>
            <p className="font-scripture italic text-xl sm:text-2xl text-[#1E293B] leading-relaxed">
              “{newsletter.ScriptureText}”
            </p>
            <div className="flex flex-wrap items-center justify-between text-xs text-amber-900 font-medium pt-3 border-t border-amber-200/70 gap-2">
              <span>Book: <strong>{displayBook}</strong> &nbsp;•&nbsp; Chapter: <strong>{displayChapter}</strong> &nbsp;•&nbsp; Verse(s): <strong>{displayVerses}</strong></span>
              <span className="font-semibold">— {displayBook} {displayChapter}: {displayVerses}</span>
            </div>
          </section>

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
              Living Word Embassy Editorial & Pastoral Team • www.wordembassy.org
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

        {/* Related Cluster Expositions (Hub-and-Spoke Internal Linking) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs my-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Topical Cluster Connection
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Related Studies in this Series
              </h3>
            </div>
            <button
              onClick={() => onNavigate('pillar', parentPillar.slug)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors"
            >
              <span>View Pillar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clusterDisplayList.map((item) => (
              <div
                key={item.NewsletterID}
                onClick={() => onNavigate('newsletter', item.Slug)}
                className="group cursor-pointer p-4 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-300 transition-all flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-800 font-serif block">
                    {item.ScriptureReference}
                  </span>
                  <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-amber-900 line-clamp-2 leading-snug">
                    {item.Title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.Excerpt}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Study</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inline Subscription CTA */}
        <div className="bg-[#1E293B] text-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-700 text-center space-y-6 my-12">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/30">
            <Mail className="w-6 h-6" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Receive Living Word Embassy Publications Every Week
            </h3>
            <p className="text-sm text-slate-300">
              Join thousands of believers worldwide receiving biblically faithful teachings, prayer devotionals, and infographics directly in their inbox. Free forever.
            </p>
          </div>

          {subscribedMessage ? (
            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 p-4 rounded-xl max-w-md mx-auto text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Thank you! You are now subscribed to Living Word Embassy.</span>
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
