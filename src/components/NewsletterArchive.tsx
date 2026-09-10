import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
  Archive,
  Sun,
  Bookmark,
  Layers,
} from 'lucide-react';
import { Newsletter } from '../types';
import { formatBibleCitation, parseScriptureReference } from '../services/bibleScripture';
import { setStandardPageSEO, trackSEOEvent } from '../services/seoManager';

interface NewsletterArchiveProps {
  newsletters: Newsletter[];
  onNavigate: (view: string, slug?: string) => void;
}

export const NewsletterArchive: React.FC<NewsletterArchiveProps> = ({
  newsletters,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEdition, setSelectedEdition] = useState<'ALL' | 'DAILY_DEVOTIONAL' | 'WEEKLY_EXEGESIS'>('ALL');
  const [selectedTheme, setSelectedTheme] = useState('ALL');
  const [selectedBook, setSelectedBook] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const dailyCount = newsletters.filter((n) => n.Edition === 'DAILY_DEVOTIONAL').length;
  const weeklyCount = newsletters.filter((n) => n.Edition === 'WEEKLY_EXEGESIS').length;

  useEffect(() => {
    window.scrollTo(0, 0);
    setStandardPageSEO(
      'Biblical Devotionals & Scripture Archive | Living Word Embassy',
      'Explore our complete chronological archive of daily Christian devotionals, weekly theological studies, and verse-by-verse scripture exegesis.',
      '/archive'
    );
    trackSEOEvent('page_view', { page: 'archive' });
  }, []);

  // Extract themes
  const themes = useMemo(() => {
    const list = newsletters.map((n) => n.Theme).filter(Boolean);
    return ['ALL', ...Array.from(new Set(list))];
  }, [newsletters]);

  // Extract distinct Bible books
  const bibleBooks = useMemo(() => {
    const list = newsletters
      .map((n) => n.BibleBook || parseScriptureReference(n.ScriptureReference).book)
      .filter(Boolean);
    return ['ALL', ...Array.from(new Set(list))];
  }, [newsletters]);

  // Extract years
  const years = useMemo(() => {
    const list = newsletters.map((n) => new Date(n.PublishDate).getFullYear().toString());
    return ['ALL', ...Array.from(new Set(list))];
  }, [newsletters]);

  // Filtered newsletters
  const filteredNewsletters = useMemo(() => {
    return newsletters
      .filter((n) => {
        // Edition filter
        if (selectedEdition !== 'ALL' && n.Edition !== selectedEdition) {
          return false;
        }

        // Bible Book filter
        const book = n.BibleBook || parseScriptureReference(n.ScriptureReference).book;
        if (selectedBook !== 'ALL' && book !== selectedBook) {
          return false;
        }

        // Search term filter across Title, Scripture Reference, Bible Book, Chapter, Verses, and text
        const term = searchTerm.toLowerCase().trim();
        const parsed = parseScriptureReference(n.ScriptureReference);
        const bookStr = (n.BibleBook || parsed.book || '').toLowerCase();
        const chapterStr = String(n.BibleChapter || parsed.chapter || '').toLowerCase();
        const versesStr = String(n.BibleVerses || parsed.verses || '').toLowerCase();

        const matchesSearch =
          !term ||
          n.Title.toLowerCase().includes(term) ||
          n.ScriptureReference.toLowerCase().includes(term) ||
          bookStr.includes(term) ||
          chapterStr.includes(term) ||
          versesStr.includes(term) ||
          `chapter ${chapterStr}`.includes(term) ||
          `verse ${versesStr}`.includes(term) ||
          `verses ${versesStr}`.includes(term) ||
          n.ScriptureText.toLowerCase().includes(term) ||
          n.Teaching.toLowerCase().includes(term) ||
          n.Excerpt.toLowerCase().includes(term);

        // Theme filter
        const matchesTheme = selectedTheme === 'ALL' || n.Theme === selectedTheme;

        // Year filter
        const nYear = new Date(n.PublishDate).getFullYear().toString();
        const matchesYear = selectedYear === 'ALL' || nYear === selectedYear;

        return matchesSearch && matchesTheme && matchesYear;
      })
      .sort((a, b) => {
        const timeA = new Date(a.PublishDate).getTime();
        const timeB = new Date(b.PublishDate).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [newsletters, selectedEdition, selectedBook, searchTerm, selectedTheme, selectedYear, sortBy]);

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-[#B45309] text-xs font-semibold uppercase tracking-wider border border-amber-200">
            <Archive className="w-3.5 h-3.5" />
            <span>Digital Theological Library</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#1E293B] tracking-tight">
            Living Word Embassy Newsletter Archive
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light">
            Search and explore our complete catalog of Daily Devotionals (Tue–Sun) and Weekly Deep Exegesis (Mondays).
          </p>

          {/* Quick Edition Segment Filter */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/80 text-xs font-semibold gap-1">
              <button
                onClick={() => setSelectedEdition('ALL')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  selectedEdition === 'ALL'
                    ? 'bg-[#1E293B] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                All Editions ({newsletters.length})
              </button>
              <button
                onClick={() => setSelectedEdition('DAILY_DEVOTIONAL')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  selectedEdition === 'DAILY_DEVOTIONAL'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Daily Devotionals ({dailyCount})</span>
              </button>
              <button
                onClick={() => setSelectedEdition('WEEKLY_EXEGESIS')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  selectedEdition === 'WEEKLY_EXEGESIS'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Weekly Exegesis ({weeklyCount})</span>
              </button>
            </div>
          </div>

          {/* Cross-Link to Topical Study Pillars */}
          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={() => onNavigate('topics')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-300/70 text-amber-900 text-xs font-semibold transition-all shadow-2xs group"
              id="archive-to-topics-hub-btn"
            >
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Explore Systematic Topical Pillars & Study Guides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by topic, scripture (e.g. Psalm 23, Luke 18:1, Chapter 4), verses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                id="archive-search-input"
              />
            </div>

            {/* Bible Book Filter */}
            <div className="md:col-span-3">
              <div className="relative">
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 font-medium appearance-none pr-8"
                  id="archive-bible-book-filter"
                >
                  <option value="ALL">📖 All Scripture Books ({bibleBooks.length - 1})</option>
                  {bibleBooks
                    .filter((b) => b !== 'ALL')
                    .map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                </select>
                <Bookmark className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Theme Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 font-medium"
                id="archive-theme-filter"
              >
                <option value="ALL">All Spiritual Themes</option>
                {themes
                  .filter((t) => t !== 'ALL')
                  .map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sort & Year Filter */}
            <div className="md:col-span-2 flex gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-1/2 px-2.5 py-3 text-xs text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 font-medium"
              >
                <option value="ALL">Years</option>
                {years
                  .filter((y) => y !== 'ALL')
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-1/2 px-2 py-3 text-xs text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 font-medium"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {/* Active Count & Clear */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredNewsletters.length}</strong> of{' '}
              {newsletters.length} editions
              {selectedBook !== 'ALL' && <span className="ml-2 text-amber-700 font-semibold">• Book: {selectedBook}</span>}
            </span>
            {(searchTerm || selectedEdition !== 'ALL' || selectedBook !== 'ALL' || selectedTheme !== 'ALL' || selectedYear !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedEdition('ALL');
                  setSelectedBook('ALL');
                  setSelectedTheme('ALL');
                  setSelectedYear('ALL');
                }}
                className="text-[#B45309] font-bold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {filteredNewsletters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNewsletters.map((nl) => {
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
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-xs font-bold px-2.5 py-1 rounded-full text-slate-800 shadow-xs flex items-center gap-1 border border-amber-300/60">
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
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#1E293B]">
              No editions matched your search
            </h3>
            <p className="text-sm text-slate-500">
              Try searching with a different scripture keyword, or clear your filters to view all past editions.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedEdition('ALL');
                setSelectedTheme('ALL');
                setSelectedYear('ALL');
              }}
              className="bg-[#1E293B] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
