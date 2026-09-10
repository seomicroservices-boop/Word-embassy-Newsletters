import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Sparkles,
  Layers,
  Compass,
  FileText,
} from 'lucide-react';
import { BibleVerseItem } from '../types';
import {
  parseScriptureReference,
  getVersesBreakdown,
  getScriptureTranslation,
  getChapterContext,
  getBibleStudyLinks,
  BIBLE_TRANSLATIONS,
} from '../services/bibleScripture';

interface BiblePassageViewerProps {
  scriptureReference: string;
  scriptureText: string;
  bibleBook?: string;
  bibleChapter?: number | string;
  bibleVerses?: string;
  bibleTranslation?: string;
  fullChapterContext?: string;
  versesBreakdown?: BibleVerseItem[];
  className?: string;
}

export const BiblePassageViewer: React.FC<BiblePassageViewerProps> = ({
  scriptureReference,
  scriptureText,
  bibleBook,
  bibleChapter,
  bibleVerses,
  bibleTranslation = 'NIV',
  fullChapterContext,
  versesBreakdown,
  className = '',
}) => {
  // Parse reference if not explicitly passed
  const parsed = parseScriptureReference(scriptureReference);
  const book = bibleBook || parsed.book;
  const chapter = bibleChapter !== undefined ? String(bibleChapter) : parsed.chapter;
  const verses = bibleVerses || parsed.verses;

  const [activeTranslation, setActiveTranslation] = useState<string>(bibleTranslation || 'NIV');
  const [showChapterContext, setShowChapterContext] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedVerseIndex, setCopiedVerseIndex] = useState<number | null>(null);

  // Retrieve translation text or fallback
  const translatedText = getScriptureTranslation(scriptureReference, activeTranslation, scriptureText);

  // Retrieve verses breakdown
  const versesList: BibleVerseItem[] = getVersesBreakdown(
    scriptureReference,
    translatedText,
    activeTranslation === (bibleTranslation || 'NIV') ? versesBreakdown : undefined
  );

  // Retrieve chapter commentary context
  const chapterContext = fullChapterContext || getChapterContext(book, chapter);

  // External study links
  const studyLinks = getBibleStudyLinks(book, chapter, verses, activeTranslation);

  const handleCopyFullPassage = async () => {
    try {
      const textToCopy = `“${translatedText}” — ${book} ${chapter}:${verses} (${activeTranslation})`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  const handleCopySingleVerse = async (v: BibleVerseItem, index: number) => {
    try {
      const textToCopy = `“${v.verseText}” — ${book} ${chapter}:${v.verseNumber} (${activeTranslation})`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedVerseIndex(index);
      setTimeout(() => setCopiedVerseIndex(null), 2000);
    } catch (e) {
      console.warn('Verse copy error:', e);
    }
  };

  return (
    <div
      className={`bg-[#FEF3C7] rounded-2xl p-6 sm:p-8 border-2 border-[#FDE68A] shadow-xs space-y-6 relative overflow-hidden ${className}`}
      id="bible-chapter-and-verses-card"
    >
      {/* Decorative Bible background watermark */}
      <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-5 pointer-events-none text-[#B45309]">
        <BookOpen className="w-64 h-64" />
      </div>

      {/* Top Header Strip: Book, Chapter, Verses & Translation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-200/80">
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Key Scripture Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Key Scripture Foundation</span>
          </div>

          {/* Book Pill */}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/90 border border-amber-300/80 text-[#92400E] text-xs font-bold shadow-2xs">
            <Bookmark className="w-3 h-3 text-amber-600" />
            <span>Book: {book}</span>
          </span>

          {/* Chapter Pill */}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/90 border border-amber-300/80 text-[#92400E] text-xs font-bold shadow-2xs">
            <Compass className="w-3 h-3 text-amber-600" />
            <span>Chapter: {chapter}</span>
          </span>

          {/* Verses Pill */}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/90 border border-amber-300/80 text-[#92400E] text-xs font-bold shadow-2xs">
            <Layers className="w-3 h-3 text-amber-600" />
            <span>Verses: {verses}</span>
          </span>
        </div>

        {/* Translation Switcher & Copy All */}
        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center p-1 bg-amber-200/60 rounded-xl border border-amber-300/80 text-[11px] font-bold"
            title="Switch Bible Translation"
          >
            {Object.keys(BIBLE_TRANSLATIONS).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTranslation(key)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  activeTranslation === key
                    ? 'bg-[#1E293B] text-white shadow-2xs'
                    : 'text-amber-900 hover:text-amber-950 hover:bg-amber-300/50'
                }`}
                title={BIBLE_TRANSLATIONS[key].name}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyFullPassage}
            className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-amber-300/80 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Copy Passage with Reference"
            id="copy-bible-passage-btn"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-700" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prominent Citation Banner for Bible Chapter and Verses (e.g. Psalm 23: 1) */}
      <div className="bg-white/80 border border-amber-300 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Bible Chapter & Verse Citation
            </div>
            <div className="font-serif font-black text-xl sm:text-2xl text-slate-900 tracking-tight flex items-center gap-2">
              <span>{book} {chapter}: {verses}</span>
              <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900">
                {activeTranslation}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-900">
          <span className="bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
            Book: <strong className="font-bold text-amber-950">{book}</strong>
          </span>
          <span className="bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
            Chapter: <strong className="font-bold text-amber-950">{chapter}</strong>
          </span>
          <span className="bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
            Verse: <strong className="font-bold text-amber-950">{verses}</strong>
          </span>
        </div>
      </div>

      {/* Main Scripture Text: Verse-by-Verse Presentation */}
      <div className="space-y-4">
        <div className="space-y-3">
          {versesList.map((item, index) => {
            const isSingleVerseCopied = copiedVerseIndex === index;
            return (
              <div
                key={index}
                className="group relative bg-white/60 hover:bg-white/90 p-3.5 sm:p-4 rounded-xl border border-amber-200/70 transition-all flex items-start gap-3.5 shadow-2xs"
              >
                {/* Verse Number Pill */}
                <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#1E293B] text-amber-300 font-sans font-black text-xs shadow-2xs">
                  v.{item.verseNumber}
                </span>

                {/* Verse Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-scripture text-lg sm:text-xl text-[#1E293B] italic font-medium leading-relaxed">
                    “{item.verseText}”
                  </p>
                </div>

                {/* Quick copy single verse button */}
                <button
                  onClick={() => handleCopySingleVerse(item, index)}
                  className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-amber-800 hover:bg-amber-100 transition-colors opacity-0 group-hover:opacity-100"
                  title={`Copy Verse ${item.verseNumber}`}
                >
                  {isSingleVerseCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Translation Citation Line */}
        <div className="flex items-center justify-between text-xs text-amber-900 font-medium pt-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {BIBLE_TRANSLATIONS[activeTranslation]?.name || activeTranslation} (
              {activeTranslation})
            </span>
          </div>
          <span className="font-sans font-black text-sm text-[#92400E]">
            — {book} {chapter}: {verses}
          </span>
        </div>
      </div>

      {/* Chapter Deep Dive Accordion & Study Bar */}
      <div className="pt-2 border-t border-amber-200/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowChapterContext(!showChapterContext)}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors group"
            id="toggle-chapter-context-btn"
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>{book} Chapter {chapter} Context & Setting</span>
            {showChapterContext ? (
              <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            )}
          </button>

          {/* External Bible Study Links */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={studyLinks.bibleGatewayChapterUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[11px] font-semibold text-slate-700 hover:text-slate-950 border border-amber-300/70 transition-colors shadow-2xs"
              title={`Read all of ${book} ${chapter} on BibleGateway`}
            >
              <span>BibleGateway (Full Ch. {chapter})</span>
              <ExternalLink className="w-3 h-3 text-amber-600" />
            </a>

            <a
              href={studyLinks.youVersionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[11px] font-semibold text-slate-700 hover:text-slate-950 border border-amber-300/70 transition-colors shadow-2xs"
              title="Open in YouVersion Bible App"
            >
              <span>YouVersion</span>
              <ExternalLink className="w-3 h-3 text-amber-600" />
            </a>

            <a
              href={studyLinks.blueLetterBibleUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-[11px] font-semibold text-slate-700 hover:text-slate-950 border border-amber-300/70 transition-colors shadow-2xs"
              title="Original Greek / Hebrew Exegesis on Blue Letter Bible"
            >
              <span>Greek/Hebrew Study</span>
              <ExternalLink className="w-3 h-3 text-amber-600" />
            </a>
          </div>
        </div>

        {/* Expandable Chapter Commentary Context */}
        {showChapterContext && (
          <div className="bg-white/85 p-5 rounded-xl border border-amber-200 text-slate-700 text-sm leading-relaxed space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#B45309] uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Full Chapter {chapter} Theological Narrative & Setting</span>
            </div>
            <p className="font-light text-slate-800 leading-relaxed">{chapterContext}</p>
            <div className="pt-2 text-[11px] text-slate-500 italic border-t border-amber-100 flex items-center justify-between">
              <span>Living Word Embassy Scriptural Exegesis</span>
              <a
                href={studyLinks.bibleGatewayChapterUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-800 font-bold hover:underline inline-flex items-center gap-1"
              >
                Read entire {book} {chapter} online &rarr;
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
