import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Save,
  RotateCcw,
  Check,
  Copy,
  Eye,
  Layers,
  ArrowUpDown,
  Sliders,
  Download,
  HelpCircle,
  CheckCheck,
  FileText,
  RefreshCw,
  Edit3,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  X,
  Target,
} from 'lucide-react';
import { Newsletter, NewsletterEdition } from '../types';
import { SITE_CANONICAL_DOMAIN } from '../services/seoManager';

interface AdminSeoConfigPanelProps {
  newsletters: Newsletter[];
  onUpdateNewsletter: (id: string, updates: Partial<Newsletter>) => void;
  onNavigateToPublic: (view: string, slug?: string) => void;
  onNavigateToKeywordsTab?: () => void;
}

interface NewsletterSeoDraft {
  MetaTitle: string;
  MetaDescription: string;
  CanonicalURL: string;
  isDirty: boolean;
}

export const AdminSeoConfigPanel: React.FC<AdminSeoConfigPanelProps> = ({
  newsletters,
  onUpdateNewsletter,
  onNavigateToPublic,
  onNavigateToKeywordsTab,
}) => {
  // Configured Base Domain for Canonicals
  const [baseDomain, setBaseDomain] = useState<string>(SITE_CANONICAL_DOMAIN);
  const [isEditingBaseDomain, setIsEditingBaseDomain] = useState(false);

  // Local draft edits state indexed by NewsletterID
  const [drafts, setDrafts] = useState<Record<string, NewsletterSeoDraft>>({});
  
  // Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [editionFilter, setEditionFilter] = useState<'ALL' | NewsletterEdition>('ALL');
  const [seoHealthFilter, setSeoHealthFilter] = useState<
    'ALL' | 'NEEDS_ATTENTION' | 'MISSING_CANONICAL' | 'SUBOPTIMAL_TITLE' | 'SUBOPTIMAL_DESC' | 'OPTIMIZED' | 'MODIFIED'
  >('ALL');
  const [sortBy, setSortBy] = useState<'publishDate' | 'title' | 'issues'>('publishDate');

  // Bulk Generator Presets Modal / Drawer
  const [showBulkPresetsModal, setShowBulkPresetsModal] = useState(false);
  const [titlePreset, setTitlePreset] = useState<'standard' | 'exegesis' | 'scripture_first'>('standard');
  const [descPreset, setDescPreset] = useState<'excerpt_cta' | 'theological_summary'>('excerpt_cta');
  const [bulkSetCanonical, setBulkSetCanonical] = useState(true);

  // Find & Replace Modal
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [findReplaceField, setFindReplaceField] = useState<'all' | 'title' | 'description' | 'canonical'>('all');

  // Preview Drawer Modal
  const [previewNewsletterId, setPreviewNewsletterId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'social'>('desktop');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize initial drafts from newsletters
  useEffect(() => {
    const initialDrafts: Record<string, NewsletterSeoDraft> = {};
    newsletters.forEach((nl) => {
      const currentDraft = drafts[nl.NewsletterID];
      // Keep existing dirty edits if present
      if (currentDraft && currentDraft.isDirty) {
        initialDrafts[nl.NewsletterID] = currentDraft;
      } else {
        initialDrafts[nl.NewsletterID] = {
          MetaTitle: nl.MetaTitle || `${nl.Title} | Scripture Exegesis & Prayer | Living Word Embassy`,
          MetaDescription:
            nl.MetaDescription ||
            `${nl.ScriptureReference} devotional: ${nl.Excerpt?.substring(0, 140) || ''}... Read full teaching and prayer.`,
          CanonicalURL: nl.CanonicalURL || `${baseDomain}/newsletter/${nl.Slug}`,
          isDirty: false,
        };
      }
    });
    setDrafts(initialDrafts);
  }, [newsletters, baseDomain]);

  // Handle single field change
  const handleFieldChange = (
    id: string,
    field: 'MetaTitle' | 'MetaDescription' | 'CanonicalURL',
    value: string
  ) => {
    setDrafts((prev) => {
      const existing = prev[id] || {
        MetaTitle: '',
        MetaDescription: '',
        CanonicalURL: '',
        isDirty: false,
      };
      return {
        ...prev,
        [id]: {
          ...existing,
          [field]: value,
          isDirty: true,
        },
      };
    });
  };

  // Revert single newsletter draft
  const handleRevertDraft = (nl: Newsletter) => {
    setDrafts((prev) => ({
      ...prev,
      [nl.NewsletterID]: {
        MetaTitle: nl.MetaTitle || `${nl.Title} | Scripture Exegesis & Prayer | Living Word Embassy`,
        MetaDescription:
          nl.MetaDescription ||
          `${nl.ScriptureReference} devotional: ${nl.Excerpt?.substring(0, 140) || ''}... Read full teaching and prayer.`,
        CanonicalURL: nl.CanonicalURL || `${baseDomain}/newsletter/${nl.Slug}`,
        isDirty: false,
      },
    }));
    showToast(`Reverted changes for ${nl.Title}`);
  };

  // Save single newsletter draft
  const handleSaveSingle = (id: string) => {
    const draft = drafts[id];
    if (!draft) return;

    onUpdateNewsletter(id, {
      MetaTitle: draft.MetaTitle.trim(),
      MetaDescription: draft.MetaDescription.trim(),
      CanonicalURL: draft.CanonicalURL.trim(),
    });

    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], isDirty: false },
    }));

    showToast(`Saved SEO metadata for ${id}`);
  };

  // Count modified items
  const dirtyCount = useMemo(() => {
    return (Object.values(drafts) as NewsletterSeoDraft[]).filter((d) => d.isDirty).length;
  }, [drafts]);

  // Save All Modified
  const handleSaveAllModified = () => {
    let count = 0;
    (Object.entries(drafts) as [string, NewsletterSeoDraft][]).forEach(([id, draft]) => {
      if (draft.isDirty) {
        onUpdateNewsletter(id, {
          MetaTitle: draft.MetaTitle.trim(),
          MetaDescription: draft.MetaDescription.trim(),
          CanonicalURL: draft.CanonicalURL.trim(),
        });
        count++;
      }
    });

    setDrafts((prev) => {
      const updated: Record<string, NewsletterSeoDraft> = {};
      (Object.entries(prev) as [string, NewsletterSeoDraft][]).forEach(([id, d]) => {
        updated[id] = { ...d, isDirty: false };
      });
      return updated;
    });

    showToast(`Successfully published SEO configurations for ${count} newsletter(s)!`);
  };

  // Character analysis helpers
  const getTitleStatus = (title: string) => {
    const len = title?.trim().length || 0;
    if (len === 0) return { status: 'error', label: 'Missing (0)', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
    if (len < 40) return { status: 'warning', label: `Short (${len}/60)`, color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' };
    if (len <= 65) return { status: 'optimal', label: `Optimal (${len}/60)`, color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40' };
    return { status: 'warning', label: `Truncated (${len}/60)`, color: 'text-orange-300 bg-orange-500/20 border-orange-500/40' };
  };

  const getDescStatus = (desc: string) => {
    const len = desc?.trim().length || 0;
    if (len === 0) return { status: 'error', label: 'Missing (0)', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
    if (len < 120) return { status: 'warning', label: `Short (${len}/160)`, color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' };
    if (len <= 165) return { status: 'optimal', label: `Optimal (${len}/160)`, color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40' };
    return { status: 'warning', label: `Truncated (${len}/160)`, color: 'text-orange-300 bg-orange-500/20 border-orange-500/40' };
  };

  const getCanonicalStatus = (url: string, slug: string) => {
    if (!url || !url.trim()) {
      return { status: 'error', label: 'Missing', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
    }
    if (!url.startsWith('https://')) {
      return { status: 'warning', label: 'Non-HTTPS', color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' };
    }
    if (!url.includes(slug)) {
      return { status: 'warning', label: 'Slug Mismatch', color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' };
    }
    return { status: 'optimal', label: 'Valid HTTPS', color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40' };
  };

  // Filter and Sort Newsletters
  const filteredNewsletters = useMemo(() => {
    return newsletters.filter((nl) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesText =
          nl.Title.toLowerCase().includes(q) ||
          nl.ScriptureReference.toLowerCase().includes(q) ||
          nl.Slug.toLowerCase().includes(q) ||
          nl.Theme.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // Edition Filter
      if (editionFilter !== 'ALL' && nl.Edition !== editionFilter) {
        return false;
      }

      // Health Filter
      const draft = drafts[nl.NewsletterID];
      const title = draft ? draft.MetaTitle : nl.MetaTitle;
      const desc = draft ? draft.MetaDescription : nl.MetaDescription;
      const canon = draft ? draft.CanonicalURL : nl.CanonicalURL;

      const titleStat = getTitleStatus(title || '');
      const descStat = getDescStatus(desc || '');
      const canonStat = getCanonicalStatus(canon || '', nl.Slug);

      if (seoHealthFilter === 'MODIFIED') {
        return draft?.isDirty === true;
      }
      if (seoHealthFilter === 'MISSING_CANONICAL') {
        return !canon || canonStat.status === 'error';
      }
      if (seoHealthFilter === 'SUBOPTIMAL_TITLE') {
        return titleStat.status !== 'optimal';
      }
      if (seoHealthFilter === 'SUBOPTIMAL_DESC') {
        return descStat.status !== 'optimal';
      }
      if (seoHealthFilter === 'NEEDS_ATTENTION') {
        return titleStat.status !== 'optimal' || descStat.status !== 'optimal' || canonStat.status !== 'optimal';
      }
      if (seoHealthFilter === 'OPTIMIZED') {
        return titleStat.status === 'optimal' && descStat.status === 'optimal' && canonStat.status === 'optimal';
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.Title.localeCompare(b.Title);
      }
      if (sortBy === 'issues') {
        const aIssues = (drafts[a.NewsletterID]?.isDirty ? 10 : 0) + (a.MetaTitle ? 0 : 2) + (a.CanonicalURL ? 0 : 2);
        const bIssues = (drafts[b.NewsletterID]?.isDirty ? 10 : 0) + (b.MetaTitle ? 0 : 2) + (b.CanonicalURL ? 0 : 2);
        return bIssues - aIssues;
      }
      // default: publishDate desc
      return (b.PublishDate || '').localeCompare(a.PublishDate || '');
    });
  }, [newsletters, drafts, searchTerm, editionFilter, seoHealthFilter, sortBy]);

  // Global SEO Health Metrics
  const healthMetrics = useMemo(() => {
    let optimalCount = 0;
    let missingCanonicalCount = 0;
    let suboptimalTitleCount = 0;
    let suboptimalDescCount = 0;

    newsletters.forEach((nl) => {
      const draft = drafts[nl.NewsletterID];
      const title = draft?.MetaTitle || nl.MetaTitle || '';
      const desc = draft?.MetaDescription || nl.MetaDescription || '';
      const canon = draft?.CanonicalURL || nl.CanonicalURL || '';

      const tStat = getTitleStatus(title);
      const dStat = getDescStatus(desc);
      const cStat = getCanonicalStatus(canon, nl.Slug);

      if (tStat.status !== 'optimal') suboptimalTitleCount++;
      if (dStat.status !== 'optimal') suboptimalDescCount++;
      if (cStat.status !== 'optimal') missingCanonicalCount++;

      if (tStat.status === 'optimal' && dStat.status === 'optimal' && cStat.status === 'optimal') {
        optimalCount++;
      }
    });

    const score = newsletters.length > 0 ? Math.round((optimalCount / newsletters.length) * 100) : 100;

    return {
      total: newsletters.length,
      optimalCount,
      score,
      suboptimalTitleCount,
      suboptimalDescCount,
      missingCanonicalCount,
    };
  }, [newsletters, drafts]);

  // Select all filtered items
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredNewsletters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNewsletters.map((n) => n.NewsletterID));
    }
  };

  const handleToggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk preset generator application
  const handleApplyBulkPresets = () => {
    const targetIds = selectedIds.length > 0 ? selectedIds : filteredNewsletters.map((n) => n.NewsletterID);
    if (targetIds.length === 0) return;

    const updated = { ...drafts };
    let affectedCount = 0;

    targetIds.forEach((id) => {
      const nl = newsletters.find((n) => n.NewsletterID === id);
      if (!nl) return;

      let newTitle = '';
      if (titlePreset === 'standard') {
        newTitle = `${nl.Title} | ${nl.ScriptureReference} | Living Word Embassy`;
      } else if (titlePreset === 'exegesis') {
        newTitle = `${nl.Title} — Biblical Exegesis & Prayer (${nl.ScriptureReference})`;
      } else if (titlePreset === 'scripture_first') {
        newTitle = `${nl.ScriptureReference}: ${nl.Title} — Daily Devotional`;
      }

      // Truncate if exceeds 65 chars to maintain SERP cleanliness
      if (newTitle.length > 65) {
        newTitle = `${nl.Title} | ${nl.ScriptureReference} | Word Embassy`;
        if (newTitle.length > 65) {
          newTitle = `${nl.Title} — ${nl.ScriptureReference}`.substring(0, 62) + '...';
        }
      }

      let newDesc = '';
      const cleanExcerpt = nl.Excerpt?.replace(/\s+/g, ' ').trim() || '';
      if (descPreset === 'excerpt_cta') {
        newDesc = `${nl.ScriptureReference} study on ${nl.Title}: ${cleanExcerpt.substring(0, 85)}... Read full teaching, audio narration & prayer points.`;
      } else if (descPreset === 'theological_summary') {
        newDesc = `Biblical exposition of ${nl.ScriptureReference} (${nl.Theme}). Discover verse-by-verse Hebrew/Greek insights, daily declarations & spiritual victory in Christ.`;
      }

      // Ensure length conforms to 130-160
      if (newDesc.length > 165) {
        newDesc = newDesc.substring(0, 160) + '...';
      }

      const newCanonical = bulkSetCanonical ? `${baseDomain}/newsletter/${nl.Slug}` : (updated[id]?.CanonicalURL || nl.CanonicalURL || `${baseDomain}/newsletter/${nl.Slug}`);

      updated[id] = {
        MetaTitle: newTitle,
        MetaDescription: newDesc,
        CanonicalURL: newCanonical,
        isDirty: true,
      };
      affectedCount++;
    });

    setDrafts(updated);
    setShowBulkPresetsModal(false);
    showToast(`Generated high-visibility SEO presets for ${affectedCount} newsletter(s)! Review and click Save.`);
  };

  // Find & Replace Handler
  const handleExecuteFindReplace = () => {
    if (!findText) return;
    const targetIds = selectedIds.length > 0 ? selectedIds : filteredNewsletters.map((n) => n.NewsletterID);
    if (targetIds.length === 0) return;

    let count = 0;
    const updated = { ...drafts };

    targetIds.forEach((id) => {
      const existing = updated[id];
      if (!existing) return;

      let changed = false;
      let newTitle = existing.MetaTitle;
      let newDesc = existing.MetaDescription;
      let newCanon = existing.CanonicalURL;

      if ((findReplaceField === 'all' || findReplaceField === 'title') && newTitle.includes(findText)) {
        newTitle = newTitle.split(findText).join(replaceText);
        changed = true;
      }
      if ((findReplaceField === 'all' || findReplaceField === 'description') && newDesc.includes(findText)) {
        newDesc = newDesc.split(findText).join(replaceText);
        changed = true;
      }
      if ((findReplaceField === 'all' || findReplaceField === 'canonical') && newCanon.includes(findText)) {
        newCanon = newCanon.split(findText).join(replaceText);
        changed = true;
      }

      if (changed) {
        updated[id] = {
          MetaTitle: newTitle,
          MetaDescription: newDesc,
          CanonicalURL: newCanon,
          isDirty: true,
        };
        count++;
      }
    });

    setDrafts(updated);
    setShowFindReplaceModal(false);
    showToast(`Replaced occurrences in ${count} newsletter(s).`);
  };

  // Export Manifest
  const handleExportSeoManifest = () => {
    const data = newsletters.map((nl) => {
      const draft = drafts[nl.NewsletterID] || {};
      return {
        NewsletterID: nl.NewsletterID,
        Title: nl.Title,
        ScriptureReference: nl.ScriptureReference,
        Edition: nl.Edition || 'DAILY_DEVOTIONAL',
        Slug: nl.Slug,
        MetaTitle: draft.MetaTitle || nl.MetaTitle || '',
        MetaTitleLength: (draft.MetaTitle || nl.MetaTitle || '').length,
        MetaDescription: draft.MetaDescription || nl.MetaDescription || '',
        MetaDescriptionLength: (draft.MetaDescription || nl.MetaDescription || '').length,
        CanonicalURL: draft.CanonicalURL || nl.CanonicalURL || `${baseDomain}/newsletter/${nl.Slug}`,
        PublishDate: nl.PublishDate,
      };
    });

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `living_word_embassy_seo_manifest_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Exported complete SEO Manifest JSON file.');
  };

  // Preview target newsletter
  const previewNewsletter = useMemo(() => {
    if (!previewNewsletterId) return null;
    return newsletters.find((n) => n.NewsletterID === previewNewsletterId) || null;
  }, [previewNewsletterId, newsletters]);

  const previewDraft = previewNewsletterId ? drafts[previewNewsletterId] : null;

  return (
    <div className="space-y-6" id="admin-seo-configuration-panel">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & SEO Performance Command Card */}
      <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/80 pb-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Search Engine Optimization Studio</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Devotional SEO & Metadata Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Configure meta titles, meta descriptions, and canonical URLs across all devotionals in bulk.
              Ensure every scripture study achieves optimal click-through rates and indexation on Google, Bing, and social crawlers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {dirtyCount > 0 && (
              <button
                onClick={handleSaveAllModified}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95 animate-pulse"
                id="save-all-seo-changes-btn"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes ({dirtyCount} modified)</span>
              </button>
            )}

            {onNavigateToKeywordsTab && (
              <button
                onClick={onNavigateToKeywordsTab}
                className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-sky-500/30 transition-colors"
                id="seo-to-keyword-opp-btn"
              >
                <Target className="w-4 h-4 text-sky-400" />
                <span>Keyword Opportunities</span>
              </button>
            )}

            <button
              onClick={() => setShowBulkPresetsModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95"
              id="bulk-generate-seo-presets-btn"
            >
              <Sparkles className="w-4 h-4" />
              <span>Bulk Auto-Generate Presets</span>
            </button>

            <button
              onClick={() => setShowFindReplaceModal(true)}
              className="bg-slate-700/80 hover:bg-slate-600 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-600 transition-colors"
              id="seo-find-replace-btn"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Find & Replace</span>
            </button>

            <button
              onClick={handleExportSeoManifest}
              className="bg-slate-700/80 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-600 transition-colors"
              title="Download SEO metadata manifest as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* SEO Health Score & Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {/* Health Score */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">SEO Visibility Score</span>
              <ShieldCheck className={`w-4 h-4 ${healthMetrics.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
            </div>
            <div className="text-2xl font-black font-mono text-white flex items-baseline gap-1">
              <span>{healthMetrics.score}%</span>
              <span className="text-[10px] text-slate-400 font-normal">health</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  healthMetrics.score >= 80 ? 'bg-emerald-400' : healthMetrics.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${healthMetrics.score}%` }}
              />
            </div>
          </div>

          {/* Total Articles */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Total Devotionals</span>
            <div className="text-2xl font-black font-mono text-white">{healthMetrics.total}</div>
            <div className="text-[10px] text-slate-400">Indexed & in system</div>
          </div>

          {/* Optimal Titles */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Title Health</span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {healthMetrics.total - healthMetrics.suboptimalTitleCount}
              <span className="text-xs text-slate-400 font-normal"> / {healthMetrics.total}</span>
            </div>
            <div className="text-[10px] text-slate-400">40–65 chars optimal</div>
          </div>

          {/* Optimal Descriptions */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Description Health</span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {healthMetrics.total - healthMetrics.suboptimalDescCount}
              <span className="text-xs text-slate-400 font-normal"> / {healthMetrics.total}</span>
            </div>
            <div className="text-[10px] text-slate-400">120–165 chars optimal</div>
          </div>

          {/* Missing Canonicals */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Valid Canonicals</span>
            <div className="text-2xl font-black font-mono text-sky-400">
              {healthMetrics.total - healthMetrics.missingCanonicalCount}
              <span className="text-xs text-slate-400 font-normal"> / {healthMetrics.total}</span>
            </div>
            <div className="text-[10px] text-slate-400">Prevents duplicate content</div>
          </div>

          {/* Unsaved Edits */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Unsaved Edits</span>
            <div className={`text-2xl font-black font-mono ${dirtyCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {dirtyCount}
            </div>
            <div className="text-[10px] text-slate-400">Pending publisher save</div>
          </div>
        </div>

        {/* Canonical Base Domain Configuration Banner */}
        <div className="bg-slate-900/70 rounded-xl p-3.5 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300">Root Canonical URL Domain:</span>
            {!isEditingBaseDomain ? (
              <span className="font-mono text-amber-300 font-semibold bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                {baseDomain}
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={baseDomain}
                  onChange={(e) => setBaseDomain(e.target.value)}
                  className="bg-slate-800 text-white font-mono px-2.5 py-1 rounded-md border border-amber-500/50 text-xs w-64 focus:outline-hidden"
                  placeholder="https://wordpastorai.com"
                />
                <button
                  onClick={() => setIsEditingBaseDomain(false)}
                  className="bg-amber-500 text-slate-950 font-bold px-2 py-1 rounded-md text-[11px]"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditingBaseDomain && (
              <button
                onClick={() => setIsEditingBaseDomain(true)}
                className="text-slate-400 hover:text-white underline text-[11px]"
              >
                Change Domain
              </button>
            )}
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">
              Canonical format: <code className="text-slate-300">{baseDomain}/newsletter/{'{slug}'}</code>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Selection Action Bar */}
      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-4 shadow-md">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Left: Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, scripture (e.g. Psalm 23), slug, or theme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-xs focus:outline-hidden focus:border-amber-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Filters and Sort */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Health Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-[11px]">Filter:</span>
              <select
                value={seoHealthFilter}
                onChange={(e) => setSeoHealthFilter(e.target.value as any)}
                className="bg-transparent text-white font-medium text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">All Newsletters ({newsletters.length})</option>
                <option value="NEEDS_ATTENTION" className="bg-slate-900">⚠️ Needs Attention</option>
                <option value="MISSING_CANONICAL" className="bg-slate-900">🔗 Missing Canonical</option>
                <option value="SUBOPTIMAL_TITLE" className="bg-slate-900">🏷️ Suboptimal Title</option>
                <option value="SUBOPTIMAL_DESC" className="bg-slate-900">📝 Suboptimal Description</option>
                <option value="OPTIMIZED" className="bg-slate-900">✅ 100% Fully Optimized</option>
                <option value="MODIFIED" className="bg-slate-900">🟡 Has Unsaved Edits ({dirtyCount})</option>
              </select>
            </div>

            {/* Edition Filter */}
            <select
              value={editionFilter}
              onChange={(e) => setEditionFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Editions</option>
              <option value="DAILY_DEVOTIONAL">Daily Devotionals</option>
              <option value="WEEKLY_EXEGESIS">Weekly Exegesis</option>
            </select>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white text-xs font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="publishDate" className="bg-slate-900">Newest Date First</option>
                <option value="issues" className="bg-slate-900">Most Issues / Unsaved</option>
                <option value="title" className="bg-slate-900">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Multi-Select Action Bar (shown when items are selected or all are visible) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/60 text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={selectedIds.length > 0 && selectedIds.length === filteredNewsletters.length}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded-sm bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <span>
                Select All Filtered ({selectedIds.length} of {filteredNewsletters.length} selected)
              </span>
            </label>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="text-[11px] text-slate-400 hover:text-white underline"
              >
                Clear Selection
              </button>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <span className="text-slate-400 text-[11px] mr-1">Batch Actions on {selectedIds.length}:</span>
              
              <button
                onClick={() => setShowBulkPresetsModal(true)}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Presets</span>
              </button>

              <button
                onClick={() => {
                  const updated = { ...drafts };
                  selectedIds.forEach((id) => {
                    const nl = newsletters.find((n) => n.NewsletterID === id);
                    if (nl) {
                      updated[id] = {
                        ...updated[id],
                        CanonicalURL: `${baseDomain}/newsletter/${nl.Slug}`,
                        isDirty: true,
                      };
                    }
                  });
                  setDrafts(updated);
                  showToast(`Assigned default canonical URLs to ${selectedIds.length} newsletters.`);
                }}
                className="bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Batch set canonical URL to standard domain structure"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Fix Canonical URLs</span>
              </button>

              <button
                onClick={() => {
                  selectedIds.forEach((id) => handleSaveSingle(id));
                  showToast(`Saved all ${selectedIds.length} selected items.`);
                }}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Save Selected</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bulk SEO Editor Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="p-4 w-10 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="p-4 w-64">Newsletter & Scripture</th>
                <th className="p-4 min-w-[280px]">
                  <div className="flex items-center justify-between">
                    <span>Meta Title (Search Heading)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Rec: 40–60 Chars</span>
                  </div>
                </th>
                <th className="p-4 min-w-[340px]">
                  <div className="flex items-center justify-between">
                    <span>Meta Description (SERP Snippet)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Rec: 120–160 Chars</span>
                  </div>
                </th>
                <th className="p-4 min-w-[260px]">
                  <div className="flex items-center justify-between">
                    <span>Canonical URL</span>
                    <span className="text-[10px] text-slate-500 font-normal">Definitive URL</span>
                  </div>
                </th>
                <th className="p-4 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredNewsletters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-3">
                      <Search className="w-8 h-8 text-slate-500 mx-auto" />
                      <div className="font-bold text-white text-sm">No newsletters match your filter criteria</div>
                      <p className="text-xs text-slate-400">
                        Try resetting your search query or selecting &quot;All Newsletters&quot; in the filter dropdown.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSeoHealthFilter('ALL');
                          setEditionFilter('ALL');
                        }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNewsletters.map((nl) => {
                  const draft = drafts[nl.NewsletterID] || {
                    MetaTitle: nl.MetaTitle || '',
                    MetaDescription: nl.MetaDescription || '',
                    CanonicalURL: nl.CanonicalURL || `${baseDomain}/newsletter/${nl.Slug}`,
                    isDirty: false,
                  };

                  const titleStatus = getTitleStatus(draft.MetaTitle);
                  const descStatus = getDescStatus(draft.MetaDescription);
                  const canonStatus = getCanonicalStatus(draft.CanonicalURL, nl.Slug);
                  const isSelected = selectedIds.includes(nl.NewsletterID);

                  return (
                    <tr
                      key={nl.NewsletterID}
                      className={`hover:bg-slate-700/25 transition-colors ${
                        draft.isDirty ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectId(nl.NewsletterID)}
                          className="w-4 h-4 rounded-sm bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Info column */}
                      <td className="p-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                nl.Edition === 'DAILY_DEVOTIONAL'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              }`}
                            >
                              {nl.Edition === 'DAILY_DEVOTIONAL' ? '☀️ Daily' : '📖 Weekly'}
                            </span>
                            {draft.isDirty && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                                Unsaved
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-white text-xs leading-snug line-clamp-2" title={nl.Title}>
                            {nl.Title}
                          </div>
                          <div className="text-amber-400 text-[11px] font-serif flex items-center gap-1">
                            <span>{nl.ScriptureReference}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]" title={nl.Slug}>
                            /{nl.Slug}
                          </div>
                        </div>
                      </td>

                      {/* Meta Title column */}
                      <td className="p-4 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${titleStatus.color}`}>
                              {titleStatus.label}
                            </span>
                            <button
                              onClick={() =>
                                handleFieldChange(
                                  nl.NewsletterID,
                                  'MetaTitle',
                                  `${nl.Title} | ${nl.ScriptureReference} | Living Word Embassy`
                                )
                              }
                              className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                              title="Set suggested standard title"
                            >
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Auto</span>
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={draft.MetaTitle}
                            onChange={(e) => handleFieldChange(nl.NewsletterID, 'MetaTitle', e.target.value)}
                            className="w-full bg-slate-900/90 text-white font-serif text-xs p-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:outline-hidden transition-colors resize-none leading-relaxed"
                            placeholder="Enter high-CTR Google meta title..."
                          />
                        </div>
                      </td>

                      {/* Meta Description column */}
                      <td className="p-4 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${descStatus.color}`}>
                              {descStatus.label}
                            </span>
                            <button
                              onClick={() => {
                                const cleanExcerpt = nl.Excerpt?.replace(/\s+/g, ' ').trim() || '';
                                const autoDesc = `${nl.ScriptureReference} study on ${nl.Title}: ${cleanExcerpt.substring(0, 80)}... Read full teaching, audio narration & prayer.`;
                                handleFieldChange(nl.NewsletterID, 'MetaDescription', autoDesc);
                              }}
                              className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                              title="Auto-draft from excerpt and scripture"
                            >
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Auto</span>
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={draft.MetaDescription}
                            onChange={(e) => handleFieldChange(nl.NewsletterID, 'MetaDescription', e.target.value)}
                            className="w-full bg-slate-900/90 text-slate-200 text-xs p-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:outline-hidden transition-colors resize-none leading-relaxed"
                            placeholder="Enter concise SERP description snippet with call to action..."
                          />
                        </div>
                      </td>

                      {/* Canonical URL column */}
                      <td className="p-4 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${canonStatus.color}`}>
                              {canonStatus.label}
                            </span>
                            <button
                              onClick={() =>
                                handleFieldChange(
                                  nl.NewsletterID,
                                  'CanonicalURL',
                                  `${baseDomain}/newsletter/${nl.Slug}`
                                )
                              }
                              className="text-[10px] text-slate-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                              title="Reset to default canonical domain + slug"
                            >
                              <Globe className="w-3 h-3 text-sky-400" />
                              <span>Default</span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={draft.CanonicalURL}
                            onChange={(e) => handleFieldChange(nl.NewsletterID, 'CanonicalURL', e.target.value)}
                            className="w-full bg-slate-900/90 text-white font-mono text-[11px] px-2.5 py-2 rounded-xl border border-slate-700 focus:border-sky-500 focus:outline-hidden transition-colors"
                            placeholder="https://wordpastorai.com/newsletter/..."
                          />
                          <div className="flex items-center gap-2 pt-1 text-[10px]">
                            <button
                              onClick={() => onNavigateToPublic('newsletter', nl.Slug)}
                              className="text-amber-400 hover:underline flex items-center gap-1"
                              title="View published devotional on website"
                            >
                              <span>Public Page</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-slate-600">•</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(draft.CanonicalURL);
                                showToast('Copied Canonical URL to clipboard!');
                              }}
                              className="text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              <Copy className="w-2.5 h-2.5" />
                              <span>Copy URL</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Actions column */}
                      <td className="p-4 align-top text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          {draft.isDirty ? (
                            <button
                              onClick={() => handleSaveSingle(nl.NewsletterID)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all shadow-md active:scale-95"
                              title="Save changes for this newsletter"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                          ) : (
                            <div className="text-[11px] text-emerald-400 flex items-center gap-1 py-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Synced</span>
                            </div>
                          )}

                          <button
                            onClick={() => setPreviewNewsletterId(nl.NewsletterID)}
                            className="bg-slate-700/80 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors border border-slate-600"
                            title="Preview in Google SERP simulator"
                          >
                            <Eye className="w-3 h-3 text-amber-400" />
                            <span>SERP</span>
                          </button>

                          {draft.isDirty && (
                            <button
                              onClick={() => handleRevertDraft(nl)}
                              className="text-slate-500 hover:text-rose-400 text-[10px] flex items-center gap-1 transition-colors"
                              title="Discard unsaved edits"
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              <span>Revert</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL: Bulk SEO Presets Generator */}
      {showBulkPresetsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Bulk SEO Auto-Generator</h3>
                  <p className="text-xs text-slate-400">
                    Apply high-converting, Google-optimized templates to{' '}
                    <strong className="text-amber-300">
                      {selectedIds.length > 0 ? `${selectedIds.length} selected items` : `all ${filteredNewsletters.length} filtered items`}
                    </strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkPresetsModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Meta Title Template */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold block">Meta Title Formula</label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'standard',
                      label: '[Title] | [Scripture] | Living Word Embassy',
                      example: 'The Lord is My Shepherd | Psalm 23:1 | Living Word Embassy',
                    },
                    {
                      id: 'exegesis',
                      label: '[Title] — Biblical Exegesis & Prayer ([Scripture])',
                      example: 'The Lord is My Shepherd — Biblical Exegesis & Prayer (Psalm 23:1)',
                    },
                    {
                      id: 'scripture_first',
                      label: '[Scripture]: [Title] — Daily Devotional',
                      example: 'Psalm 23:1: The Lord is My Shepherd — Daily Devotional',
                    },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        titlePreset === option.id
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="titlePreset"
                        checked={titlePreset === option.id}
                        onChange={() => setTitlePreset(option.id as any)}
                        className="mt-0.5 text-amber-500 focus:ring-0"
                      />
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs">{option.label}</div>
                        <div className="text-[11px] text-slate-400 font-serif italic">{option.example}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Meta Description Template */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold block">Meta Description Formula</label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'excerpt_cta',
                      label: 'Scripture + Excerpt Extract + Multi-Media CTA',
                      example:
                        'Psalm 23:1 devotional: The Lord is my shepherd; I shall not want... Read full teaching, audio narration & prayer points.',
                    },
                    {
                      id: 'theological_summary',
                      label: 'Theological Exegesis + Original Language Exposition',
                      example:
                        'Biblical exposition of Psalm 23:1 (Divine Protection & Guidance). Discover verse-by-verse Hebrew insights, morning prayer declarations & peace in Christ.',
                    },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        descPreset === option.id
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="descPreset"
                        checked={descPreset === option.id}
                        onChange={() => setDescPreset(option.id as any)}
                        className="mt-0.5 text-amber-500 focus:ring-0"
                      />
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs">{option.label}</div>
                        <div className="text-[11px] text-slate-400 leading-relaxed font-light">{option.example}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Canonical Check */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bulkSetCanonical}
                    onChange={(e) => setBulkSetCanonical(e.target.checked)}
                    className="w-4 h-4 rounded-sm bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>
                    Also set canonical URLs to <code className="text-amber-300">{baseDomain}/newsletter/{'{slug}'}</code>
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowBulkPresetsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyBulkPresets}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply Presets to Selection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: Find & Replace Across SEO Fields */}
      {showFindReplaceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Find & Replace SEO Text</h3>
                  <p className="text-xs text-slate-400">
                    Replace domains, taglines, or keywords across meta titles and descriptions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFindReplaceModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Find Text</label>
                <input
                  type="text"
                  placeholder="e.g. Word Pastor AI or old domain"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="w-full bg-slate-800 text-white px-3 py-2.5 rounded-xl border border-slate-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Replace With</label>
                <input
                  type="text"
                  placeholder="e.g. Living Word Embassy"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="w-full bg-slate-800 text-white px-3 py-2.5 rounded-xl border border-slate-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Target Scope</label>
                <select
                  value={findReplaceField}
                  onChange={(e) => setFindReplaceField(e.target.value as any)}
                  className="w-full bg-slate-800 text-white px-3 py-2.5 rounded-xl border border-slate-700 text-xs focus:outline-hidden"
                >
                  <option value="all">All Fields (Titles, Descriptions & Canonicals)</option>
                  <option value="title">Meta Titles Only</option>
                  <option value="description">Meta Descriptions Only</option>
                  <option value="canonical">Canonical URLs Only</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-400">
                Will apply to{' '}
                <strong className="text-amber-300">
                  {selectedIds.length > 0 ? `${selectedIds.length} selected items` : `all ${filteredNewsletters.length} filtered items`}
                </strong>
                . You can review changes before saving.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowFindReplaceModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteFindReplace}
                disabled={!findText}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg"
              >
                <span>Replace in Selection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: Google SERP Snippet Preview Simulator */}
      {previewNewsletter && previewDraft && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Google SERP Snippet Simulator</h3>
                  <p className="text-xs text-slate-400">
                    Live visual render of how this devotional appears on search engine results pages
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewNewsletterId(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    previewDevice === 'desktop' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Desktop SERP
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    previewDevice === 'mobile' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Mobile SERP
                </button>
                <button
                  onClick={() => setPreviewDevice('social')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    previewDevice === 'social' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Open Graph Card
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                {previewNewsletter.NewsletterID}
              </div>
            </div>

            {/* Visual Simulator Canvas */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-slate-900 shadow-inner">
              {previewDevice === 'desktop' && (
                <div className="space-y-1.5 max-w-xl font-sans">
                  {/* Google Breadcrumb */}
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px] text-amber-800 font-bold">
                      ✝
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[13px] text-slate-900 leading-tight">Living Word Embassy</span>
                      <span className="text-[11px] text-slate-500 truncate leading-tight font-mono">
                        {previewDraft.CanonicalURL || `https://wordpastorai.com/newsletter/${previewNewsletter.Slug}`}
                      </span>
                    </div>
                  </div>

                  {/* Google Blue Link Title */}
                  <h4 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug pt-1">
                    {previewDraft.MetaTitle.length > 65
                      ? `${previewDraft.MetaTitle.substring(0, 62)}...`
                      : previewDraft.MetaTitle}
                  </h4>

                  {/* Google Snippet Description */}
                  <p className="text-[14px] text-[#4d5156] leading-normal pt-0.5">
                    {previewDraft.MetaDescription.length > 165
                      ? `${previewDraft.MetaDescription.substring(0, 160)}...`
                      : previewDraft.MetaDescription}
                  </p>
                </div>
              )}

              {previewDevice === 'mobile' && (
                <div className="max-w-sm mx-auto bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 font-sans shadow-xs">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                      ✝
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Living Word Embassy</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[220px]">
                        {previewDraft.CanonicalURL || `https://wordpastorai.com/newsletter/${previewNewsletter.Slug}`}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-base text-[#1a0dab] font-medium leading-tight">
                    {previewDraft.MetaTitle}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {previewDraft.MetaDescription}
                  </p>
                </div>
              )}

              {previewDevice === 'social' && (
                <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    <img
                      src={previewNewsletter.FeaturedImageURL || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80'}
                      alt={previewNewsletter.Title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-slate-950/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Open Graph Card
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="text-[11px] uppercase font-bold text-slate-400 font-mono">
                      wordpastorai.com
                    </div>
                    <div className="font-bold text-sm text-slate-900 leading-snug">
                      {previewDraft.MetaTitle}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {previewDraft.MetaDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Character Analysis Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                <span className="text-slate-400 text-[11px]">Title Character Count:</span>
                <div className="font-mono text-sm font-bold text-white">
                  {previewDraft.MetaTitle.length} characters
                </div>
                <div className="text-[10px] text-slate-400">
                  {previewDraft.MetaTitle.length > 65
                    ? '⚠️ Truncated by Google (>65 chars)'
                    : previewDraft.MetaTitle.length < 40
                    ? '⚠️ Slightly short (<40 chars)'
                    : '✅ Optimal Google SERP display width'}
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                <span className="text-slate-400 text-[11px]">Description Character Count:</span>
                <div className="font-mono text-sm font-bold text-white">
                  {previewDraft.MetaDescription.length} characters
                </div>
                <div className="text-[10px] text-slate-400">
                  {previewDraft.MetaDescription.length > 165
                    ? '⚠️ Truncated by Google (>165 chars)'
                    : previewDraft.MetaDescription.length < 120
                    ? '⚠️ Slightly short (<120 chars)'
                    : '✅ Optimal Google SERP snippet width'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  const googleTestUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(previewDraft.CanonicalURL)}`;
                  window.open(googleTestUrl, '_blank');
                }}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test in Google Rich Results</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewNewsletterId(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
