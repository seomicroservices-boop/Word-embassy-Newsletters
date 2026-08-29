import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
  Archive,
} from 'lucide-react';
import { Newsletter } from '../types';

interface NewsletterArchiveProps {
  newsletters: Newsletter[];
  onNavigate: (view: string, slug?: string) => void;
}

export const NewsletterArchive: React.FC<NewsletterArchiveProps> = ({
  newsletters,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Extract themes
  const themes = useMemo(() => {
    const list = newsletters.map((n) => n.Theme).filter(Boolean);
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
        // Search term filter
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          !term ||
          n.Title.toLowerCase().includes(term) ||
          n.ScriptureReference.toLowerCase().includes(term) ||
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
  }, [newsletters, searchTerm, selectedTheme, selectedYear, sortBy]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-[#B45309] text-xs font-semibold uppercase tracking-wider border border-amber-200">
            <Archive className="w-3.5 h-3.5" />
            <span>Digital Theological Library</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#1E293B] tracking-tight">
            Word Embassy Newsletter Archive
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light">
            Search and explore our complete catalog of weekly biblical expositions, devotional reflections, prayer guides, and multimedia teachings.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by topic, scripture (e.g. Luke 18:1, Psalm 91), or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                id="archive-search-input"
              />
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
            <div className="md:col-span-3 flex gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-1/2 px-3 py-3 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 font-medium"
              >
                <option value="ALL">All Years</option>
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
                className="w-1/2 px-3 py-3 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Active Count & Clear */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredNewsletters.length}</strong> of{' '}
              {newsletters.length} editions
            </span>
            {(searchTerm || selectedTheme !== 'ALL' || selectedYear !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
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
            {filteredNewsletters.map((nl) => (
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
