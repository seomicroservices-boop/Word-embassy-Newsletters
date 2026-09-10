import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Video,
  Sparkles,
  Youtube,
  BookOpen,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Film,
  Sliders,
  Send,
  Loader2,
  Layers,
  Palette,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Newsletter } from '../types';
import { formatBibleCitation, parseScriptureReference } from '../services/bibleScripture';
import {
  CREATOMATE_CONFIG,
  buildDevotionalCreatomatePayload,
  generateCreatomateCurlCommand,
  getSampleCreatomateCurl,
  submitCreatomateRender,
  CreatomateModifications,
} from '../services/creatomateService';

export interface VideoBackgroundTheme {
  id: string;
  name: string;
  hex: string;
  secondaryHex: string;
  textClass: string;
  borderClass: string;
  cardBg: string;
  accent: string;
  reelGradient: string;
  isDark: boolean;
}

export const VIDEO_BG_THEMES: VideoBackgroundTheme[] = [
  {
    id: 'ivory',
    name: 'Warm Ivory (Attached)',
    hex: '#FAF8F5',
    secondaryHex: '#FFFDF9',
    textClass: 'text-slate-900',
    borderClass: 'border-amber-200/90',
    cardBg: '#FAF8F5',
    accent: '#B45309',
    reelGradient: 'linear-gradient(to top, rgba(250, 248, 245, 0.96) 0%, rgba(250, 248, 245, 0.65) 50%, rgba(250, 248, 245, 0.94) 100%)',
    isDark: false,
  },
  {
    id: 'obsidian',
    name: 'Obsidian Midnight',
    hex: '#0B0F19',
    secondaryHex: '#131B2E',
    textClass: 'text-slate-100',
    borderClass: 'border-slate-800',
    cardBg: '#111827',
    accent: '#F59E0B',
    reelGradient: 'linear-gradient(to top, rgba(11, 15, 25, 0.95), rgba(0, 0, 0, 0.45), rgba(11, 15, 25, 0.85))',
    isDark: true,
  },
  {
    id: 'royalNavy',
    name: 'Royal Navy',
    hex: '#0A1526',
    secondaryHex: '#102444',
    textClass: 'text-slate-100',
    borderClass: 'border-blue-900/60',
    cardBg: '#0F2038',
    accent: '#38BDF8',
    reelGradient: 'linear-gradient(to top, rgba(10, 21, 38, 0.96), rgba(6, 13, 26, 0.45), rgba(10, 21, 38, 0.88))',
    isDark: true,
  },
  {
    id: 'burgundy',
    name: 'Imperial Burgundy',
    hex: '#1F0A12',
    secondaryHex: '#33101E',
    textClass: 'text-slate-100',
    borderClass: 'border-rose-900/60',
    cardBg: '#2E101D',
    accent: '#FB7185',
    reelGradient: 'linear-gradient(to top, rgba(31, 10, 18, 0.96), rgba(20, 5, 11, 0.45), rgba(31, 10, 18, 0.88))',
    isDark: true,
  },
  {
    id: 'emerald',
    name: 'Kingdom Emerald',
    hex: '#061C14',
    secondaryHex: '#0E2E21',
    textClass: 'text-slate-100',
    borderClass: 'border-emerald-900/60',
    cardBg: '#0C2B1F',
    accent: '#34D399',
    reelGradient: 'linear-gradient(to top, rgba(6, 28, 20, 0.96), rgba(3, 16, 11, 0.45), rgba(6, 28, 20, 0.88))',
    isDark: true,
  },
  {
    id: 'amethyst',
    name: 'Sacred Amethyst',
    hex: '#160B24',
    secondaryHex: '#25133D',
    textClass: 'text-slate-100',
    borderClass: 'border-purple-900/60',
    cardBg: '#221236',
    accent: '#C084FC',
    reelGradient: 'linear-gradient(to top, rgba(22, 11, 36, 0.96), rgba(13, 6, 22, 0.45), rgba(22, 11, 36, 0.88))',
    isDark: true,
  },
  {
    id: 'warmAmber',
    name: 'Warm Amber Gold',
    hex: '#1C1307',
    secondaryHex: '#2E1E0B',
    textClass: 'text-slate-100',
    borderClass: 'border-amber-900/60',
    cardBg: '#2B1C0B',
    accent: '#FBBF24',
    reelGradient: 'linear-gradient(to top, rgba(28, 19, 7, 0.96), rgba(18, 12, 4, 0.45), rgba(28, 19, 7, 0.88))',
    isDark: true,
  },
  {
    id: 'pureBlack',
    name: 'Studio Black',
    hex: '#000000',
    secondaryHex: '#121212',
    textClass: 'text-slate-100',
    borderClass: 'border-neutral-800',
    cardBg: '#121212',
    accent: '#E5E7EB',
    reelGradient: 'linear-gradient(to top, rgba(0, 0, 0, 0.96), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.88))',
    isDark: true,
  },
];

interface VeoVideoPlayerProps {
  newsletter: Newsletter;
}

export const VeoVideoPlayer: React.FC<VeoVideoPlayerProps> = ({ newsletter }) => {
  const [activeEngine, setActiveEngine] = useState<'reel' | 'creatomate'>('reel');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<'hook' | 'narration' | 'cta'>('hook');
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Background Customization State (defaults to the attached Warm Ivory Parchment #FAF8F5)
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    return localStorage.getItem('we_video_template_theme_v2') || 'ivory';
  });
  const [customColor, setCustomColor] = useState<string>(() => {
    return localStorage.getItem('we_video_template_custom_color_v2') || '#FAF8F5';
  });
  const [isCustomColor, setIsCustomColor] = useState<boolean>(() => {
    return localStorage.getItem('we_video_template_is_custom_v2') === 'true';
  });
  const [bgStyle, setBgStyle] = useState<'tinted_image' | 'solid' | 'gradient'>(() => {
    return (localStorage.getItem('we_video_template_bg_style_v2') as any) || 'solid';
  });

  // Creatomate Template State
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [creatomateTab, setCreatomateTab] = useState<'devotional' | 'curl' | 'editor'>('devotional');
  const [isRendering, setIsRendering] = useState(false);
  const [renderStatus, setRenderStatus] = useState<{
    success?: boolean;
    jobId?: string;
    url?: string;
    statusText?: string;
    error?: string;
  } | null>(null);

  const parsedScripture = parseScriptureReference(newsletter.ScriptureReference);
  const displayBook = newsletter.BibleBook || parsedScripture.book || 'Scripture';
  const displayChapter =
    newsletter.BibleChapter !== undefined ? String(newsletter.BibleChapter) : parsedScripture.chapter;
  const displayVerses = newsletter.BibleVerses || parsedScripture.verses;
  const citationFormatted = formatBibleCitation(
    newsletter.ScriptureReference,
    displayBook,
    displayChapter,
    displayVerses
  );

  const hookText = newsletter.YouTubeShortHook || `Why does God ask us to persist in prayer?`;
  const narrationText =
    newsletter.YouTubeShortNarration ||
    `In ${citationFormatted}, God reminds us that when we seek Him with all our heart, we will find Him. When answers seem delayed, faith grows stronger. Never give up on what God has promised you.`;
  const ctaText =
    newsletter.YouTubeShortCTA || 'Subscribe to Living Word Embassy for weekly Bible teachings.';

  // Initialized devotional modifications
  const devotionalPayload = buildDevotionalCreatomatePayload(newsletter);
  const [customMods, setCustomMods] = useState<CreatomateModifications>(devotionalPayload.modifications);

  // Sync customMods when newsletter changes
  useEffect(() => {
    setCustomMods(buildDevotionalCreatomatePayload(newsletter).modifications);
  }, [newsletter]);

  useEffect(() => {
    if (isPlaying && activeEngine === 'reel') {
      // Speech synthesis narration if available
      if ('speechSynthesis' in window && !isMuted) {
        window.speechSynthesis.cancel();
        const fullText = `${hookText} ... ${narrationText} ... ${ctaText}`;
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
        };
        window.speechSynthesis.speak(utterance);
      }

      const totalDuration = 25000; // 25 seconds simulation
      const interval = 100;
      let elapsed = 0;

      timerRef.current = setInterval(() => {
        elapsed += interval;
        const currentProgress = (elapsed / totalDuration) * 100;
        setProgress(Math.min(currentProgress, 100));

        if (currentProgress < 25) {
          setCurrentSegment('hook');
        } else if (currentProgress < 85) {
          setCurrentSegment('narration');
        } else {
          setCurrentSegment('cta');
        }

        if (elapsed >= totalDuration) {
          setIsPlaying(false);
          clearInterval(timerRef.current!);
        }
      }, interval);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isPlaying, isMuted, hookText, narrationText, ctaText, activeEngine]);

  const handleTogglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
      setCurrentSegment('hook');
    }
    setIsPlaying(!isPlaying);
  };

  const jumpToSegment = (seg: 'hook' | 'narration' | 'cta') => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentSegment(seg);
    if (seg === 'hook') setProgress(10);
    else if (seg === 'narration') setProgress(45);
    else if (seg === 'cta') setProgress(90);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentSegment('hook');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleTriggerCreatomateRender = async () => {
    setIsRendering(true);
    setRenderStatus(null);
    const activePayload = {
      template_id: CREATOMATE_CONFIG.templateId,
      modifications: customMods,
    };

    const res = await submitCreatomateRender(activePayload);
    setIsRendering(false);

    if (res.success && res.data) {
      const renderItem = Array.isArray(res.data) ? res.data[0] : res.data;
      setRenderStatus({
        success: true,
        jobId: renderItem.id,
        url: renderItem.url,
        statusText: renderItem.status || 'rendering',
      });
    } else {
      setRenderStatus({
        success: false,
        error: res.error,
      });
    }
  };

  const activePayload = {
    template_id: CREATOMATE_CONFIG.templateId,
    modifications: customMods,
  };
  const activeCurlCommand = generateCreatomateCurlCommand(activePayload);
  const sampleCurl = getSampleCreatomateCurl();

  const activeTheme = VIDEO_BG_THEMES.find((t) => t.id === selectedThemeId) || VIDEO_BG_THEMES[0];
  const effectiveBgHex = isCustomColor ? customColor : activeTheme.hex;
  const effectiveCardBg = isCustomColor ? (customColor === '#000000' ? '#121212' : customColor) : activeTheme.cardBg;
  const isLight = !activeTheme.isDark || effectiveBgHex.toLowerCase() === '#faf8f5' || effectiveBgHex.toLowerCase() === '#fdfbf7' || effectiveBgHex.toLowerCase() === '#ffffff';

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    setIsCustomColor(false);
    localStorage.setItem('we_video_template_theme_v2', themeId);
    localStorage.setItem('we_video_template_is_custom_v2', 'false');
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setIsCustomColor(true);
    localStorage.setItem('we_video_template_custom_color_v2', color);
    localStorage.setItem('we_video_template_is_custom_v2', 'true');
  };

  const handleBgStyleChange = (style: 'tinted_image' | 'solid' | 'gradient') => {
    setBgStyle(style);
    localStorage.setItem('we_video_template_bg_style_v2', style);
  };

  const handleResetBg = () => {
    setSelectedThemeId('ivory');
    setCustomColor('#FAF8F5');
    setIsCustomColor(false);
    setBgStyle('solid');
    localStorage.setItem('we_video_template_theme_v2', 'ivory');
    localStorage.setItem('we_video_template_custom_color_v2', '#FAF8F5');
    localStorage.setItem('we_video_template_is_custom_v2', 'false');
    localStorage.setItem('we_video_template_bg_style_v2', 'solid');
  };

  return (
    <div
      className="rounded-2xl p-6 border shadow-sm my-10 space-y-6 transition-colors duration-300"
      style={{
        backgroundColor: isLight ? '#FAF8F5' : effectiveBgHex,
        borderColor: isLight ? '#E2E8F0' : activeTheme.borderClass.includes('border-') ? undefined : '#334155',
      }}
    >
      {/* Top Header & Engine Navigation */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-wider">
            <Youtube className="w-4 h-4" />
            <span>Devotional Video & Multi-Platform Reels</span>
          </div>
          <h3 className={`font-serif text-xl font-bold mt-0.5 ${isLight ? 'text-[#1E293B]' : 'text-white'}`}>
            Video Devotional Studio & Automation
          </h3>
        </div>

        {/* Engine Switcher Tabs */}
        <div className={`flex items-center p-1 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <button
            onClick={() => setActiveEngine('reel')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeEngine === 'reel'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-slate-800 text-amber-400 shadow-xs'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Reel</span>
          </button>
          <button
            onClick={() => setActiveEngine('creatomate')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeEngine === 'creatomate'
                ? 'bg-[#0F172A] text-amber-400 shadow-xs'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Creatomate Template (v2)</span>
            <span className="bg-amber-400/20 text-amber-400 text-[10px] font-mono px-1.5 py-0.2 rounded ml-0.5">
              c67fa002
            </span>
          </button>
        </div>
      </div>

      {/* Video Template Background Customization Toolbar */}
      <div
        className="p-3.5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs transition-colors"
        style={{
          backgroundColor: isLight ? '#F1F5F9' : 'rgba(15, 23, 42, 0.75)',
          borderColor: isLight ? '#CBD5E1' : 'rgba(51, 65, 85, 0.7)',
        }}
      >
        {/* Preset Theme Swatches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            <Palette className="w-4 h-4 text-amber-500" />
            <span>Template Background:</span>
          </span>

          <div className="flex flex-wrap items-center gap-1.5">
            {VIDEO_BG_THEMES.map((theme) => {
              const isSelected = !isCustomColor && selectedThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  title={`${theme.name} (${theme.hex})`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                    isSelected
                      ? 'ring-2 ring-amber-400 border-amber-400 font-bold scale-105 shadow-xs'
                      : 'border-slate-700/60 hover:scale-102 opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: theme.hex,
                    color: theme.isDark ? '#F8FAFC' : '#1E293B',
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <span>{theme.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Dropper & Style Mode */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Hex Color Picker */}
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-slate-700/60">
            <input
              type="color"
              value={isCustomColor ? customColor : effectiveBgHex}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
              title="Pick any custom background color"
            />
            <span className="font-mono text-[11px] text-slate-300">
              {isCustomColor ? customColor.toUpperCase() : effectiveBgHex.toUpperCase()}
            </span>
          </div>

          {/* Background Mode Toggle */}
          <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-slate-700/60 text-[11px]">
            <button
              onClick={() => handleBgStyleChange('tinted_image')}
              className={`px-2 py-0.5 rounded transition-colors ${
                bgStyle === 'tinted_image'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Show scripture background artwork with selected color tint"
            >
              Artwork Tint
            </button>
            <button
              onClick={() => handleBgStyleChange('gradient')}
              className={`px-2 py-0.5 rounded transition-colors ${
                bgStyle === 'gradient'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Show radial gradient background"
            >
              Gradient
            </button>
            <button
              onClick={() => handleBgStyleChange('solid')}
              className={`px-2 py-0.5 rounded transition-colors ${
                bgStyle === 'solid'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Show pure solid background color"
            >
              Solid
            </button>
          </div>

          {/* Reset button */}
          {(selectedThemeId !== 'obsidian' || isCustomColor || bgStyle !== 'tinted_image') && (
            <button
              onClick={handleResetBg}
              className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              title="Reset to default Obsidian background"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Interactive Devotional Reel (9:16) */}
      {activeEngine === 'reel' && (
        <div
          className="flex flex-col lg:flex-row items-center justify-center gap-8 rounded-2xl p-6 sm:p-8 text-white transition-colors duration-300"
          style={{
            backgroundColor: isLight ? '#1E293B' : effectiveCardBg,
            boxShadow: `0 20px 40px -15px ${effectiveBgHex}80`,
          }}
        >
          {/* 9:16 Vertical Video Frame */}
          <div
            className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 flex flex-col justify-between p-5 select-none transition-all duration-500"
            style={{
              backgroundColor: bgStyle === 'solid' ? effectiveBgHex : '#050811',
              borderColor: activeTheme.accent,
            }}
          >
            {/* Background Style: Artwork Image, Gradient, or Solid */}
            {bgStyle === 'tinted_image' && (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                style={{
                  backgroundImage: `url(${newsletter.FeaturedImageURL})`,
                  filter: 'brightness(0.35) saturate(1.2)',
                }}
              />
            )}
            {bgStyle === 'gradient' && (
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 30%, ${activeTheme.secondaryHex} 0%, ${effectiveBgHex} 100%)`,
                }}
              />
            )}
            {bgStyle === 'solid' && (
              <div
                className="absolute inset-0 transition-colors duration-500"
                style={{ backgroundColor: effectiveBgHex }}
              />
            )}

            {/* Gradient Overlay for high-contrast scripture readability */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-500"
              style={{
                background: isCustomColor
                  ? `linear-gradient(to top, ${customColor}fa 0%, ${customColor}50 50%, ${customColor}e6 100%)`
                  : activeTheme.reelGradient,
              }}
            />

            {/* Top Info Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#B45309] text-white flex items-center justify-center text-xs font-bold font-serif shadow-sm">
                  WE
                </div>
                <div>
                  <span className={`font-serif text-xs font-bold block tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    LIVING WORD EMBASSY
                  </span>
                  <span className={`text-[10px] font-medium flex items-center gap-1 ${isLight ? 'text-amber-800 font-semibold' : 'text-amber-300'}`}>
                    <BookOpen className="w-2.5 h-2.5 text-amber-500" />
                    <span>{citationFormatted}</span>
                  </span>
                </div>
              </div>
              <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Devotional
              </div>
            </div>

            {/* Center: Dynamic Subtitles / Script animation */}
            <div className="relative z-10 text-center my-auto px-2">
              {currentSegment === 'hook' && (
                <div className="animate-fade-in space-y-2">
                  <span className={`inline-block text-xs font-black uppercase px-2.5 py-1 rounded shadow-md tracking-wider ${
                    isLight ? 'bg-amber-600 text-white' : 'bg-amber-400 text-slate-900'
                  }`}>
                    QUESTION OF FAITH
                  </span>
                  <h4 className={`font-serif text-xl sm:text-2xl font-black leading-tight ${
                    isLight ? 'text-slate-900' : 'text-white drop-shadow-md'
                  }`}>
                    “{hookText}”
                  </h4>
                </div>
              )}

              {currentSegment === 'narration' && (
                <div className="animate-fade-in space-y-3">
                  <div className={`p-3.5 rounded-xl transition-colors ${
                    isLight ? 'bg-white/80 backdrop-blur-sm border border-amber-200/80 shadow-xs' : ''
                  }`}>
                    <p className={`font-scripture text-lg sm:text-xl leading-relaxed italic font-medium ${
                      isLight ? 'text-slate-900' : 'text-[#FEF3C7] drop-shadow-lg'
                    }`}>
                      {narrationText}
                    </p>
                  </div>
                  <div className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-serif border ${
                    isLight
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                      : 'bg-black/70 backdrop-blur-md text-amber-200 border-amber-500/40'
                  }`}>
                    <BookOpen className="w-3 h-3 text-amber-500" />
                    <span>{citationFormatted}</span>
                  </div>
                </div>
              )}

              {currentSegment === 'cta' && (
                <div className={`animate-fade-in space-y-3 p-4 rounded-xl border ${
                  isLight
                    ? 'bg-white/95 backdrop-blur-md border-amber-300 shadow-md'
                    : 'bg-black/70 backdrop-blur-md border-amber-400/30'
                }`}>
                  <Sparkles className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
                  <h4 className={`font-serif text-lg font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {ctaText}
                  </h4>
                  <p className={`text-xs font-semibold ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                    www.wordembassy.org
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Controls inside vertical reel */}
            <div className="relative z-10 space-y-3">
              {/* Progress bar */}
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-amber-200/80' : 'bg-slate-700/80'}`}>
                <div
                  className={`h-full transition-all duration-100 ease-linear rounded-full ${isLight ? 'bg-amber-600' : 'bg-amber-400'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className={`flex items-center justify-between ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                <button
                  onClick={handleTogglePlay}
                  className={`p-2.5 rounded-full transition-colors ${
                    isLight
                      ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'
                  }`}
                  id="veo-toggle-play-btn"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-full transition-colors ${
                    isLight
                      ? 'bg-slate-200/80 text-slate-800 hover:bg-slate-300'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  id="veo-toggle-mute-btn"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleReset}
                  className={`p-2 rounded-full transition-colors ${
                    isLight
                      ? 'bg-slate-200/80 text-slate-800 hover:bg-slate-300'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  id="veo-reset-btn"
                  title="Reset to beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Sample Clip Segment Selector */}
              <div className="pt-1">
                <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                  <button
                    onClick={() => jumpToSegment('hook')}
                    className={`flex-1 py-1 px-1.5 rounded transition-colors text-center ${
                      currentSegment === 'hook'
                        ? isLight
                          ? 'bg-amber-600 text-white font-black shadow-xs'
                          : 'bg-amber-500 text-slate-950 font-black'
                        : isLight
                        ? 'bg-slate-200/90 text-slate-700 hover:bg-slate-300'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                    title="Jump to 1. Hook (0-3s)"
                  >
                    1. Hook
                  </button>
                  <button
                    onClick={() => jumpToSegment('narration')}
                    className={`flex-1 py-1 px-1.5 rounded transition-colors text-center ${
                      currentSegment === 'narration'
                        ? isLight
                          ? 'bg-amber-600 text-white font-black shadow-xs'
                          : 'bg-amber-500 text-slate-950 font-black'
                        : isLight
                        ? 'bg-slate-200/90 text-slate-700 hover:bg-slate-300'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                    title="Jump to 2. Scripture Narration (3-20s)"
                  >
                    2. Narration
                  </button>
                  <button
                    onClick={() => jumpToSegment('cta')}
                    className={`flex-1 py-1 px-1.5 rounded transition-colors text-center ${
                      currentSegment === 'cta'
                        ? isLight
                          ? 'bg-amber-600 text-white font-black shadow-xs'
                          : 'bg-amber-500 text-slate-950 font-black'
                        : isLight
                        ? 'bg-slate-200/90 text-slate-700 hover:bg-slate-300'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                    title="Jump to 3. Call to Action (20-25s)"
                  >
                    3. CTA
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Information & Multi-Platform Output Actions */}
          <div className="flex-1 space-y-4 max-w-md">
            <div className="space-y-1">
              <span className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-amber-800 font-black' : 'text-amber-400'}`}>
                Multi-Platform Video Output
              </span>
              <h4 className={`font-serif text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {newsletter.YouTubeTitle || `${newsletter.Title} (YouTube Short)`}
              </h4>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Generated with high-retention scripture hooks and cloud video automation with Creatomate and Google Veo.
              </p>
            </div>

            <div className={`rounded-xl p-4 border space-y-3 text-xs ${
              isLight
                ? 'bg-white border-amber-200/80 shadow-xs'
                : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div>
                <span className={`font-semibold block mb-1 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                  Hook (0-3s):
                </span>
                <p className={`italic ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{hookText}</p>
              </div>
              <div>
                <span className={`font-semibold block mb-1 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                  Spoken Narration (3-45s):
                </span>
                <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{narrationText}</p>
              </div>
              <div>
                <span className={`font-semibold block mb-1 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                  Veo AI Video Prompt:
                </span>
                <p className="text-slate-400 font-mono text-[11px] bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  {newsletter.VeoVideoPrompt ||
                    'Cinematic 9:16 vertical video of serene golden sunrise over quiet mountains, soft ambient lighting, high definition, 45 seconds.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleTogglePlay}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Devotional' : 'Play Devotional Reel'}</span>
              </button>

              <button
                onClick={() => setActiveEngine('creatomate')}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 border border-amber-500/30 transition-colors"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Open Creatomate Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Creatomate Cloud Video Template (c67fa002-f471-4603-97bc-329edd25a2b8) */}
      {activeEngine === 'creatomate' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-amber-500/30 text-white space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CREATOMATE V2 TEMPLATE PIPELINE</span>
                </div>
                <h4 className="font-serif text-2xl font-bold text-white">
                  Template ID: <span className="text-amber-300 font-mono text-xl">{CREATOMATE_CONFIG.templateId}</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl font-light leading-relaxed">
                  Direct multi-slide video renderer powered by Creatomate API v2. Automatically maps
                  this devotional's hook, scripture verse, reflection, prayer, and background assets to four dynamic slides.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleTriggerCreatomateRender}
                  disabled={isRendering}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  {isRendering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Render Job...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Render Video with Creatomate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Render Output Alert if triggered */}
            {renderStatus && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  renderStatus.success
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                    : 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                }`}
              >
                {renderStatus.success ? (
                  <div className="space-y-1">
                    <strong className="block text-emerald-400 font-bold text-sm">
                      🎉 Render Request Submitted Successfully!
                    </strong>
                    <p>Job ID: <code className="font-mono bg-emerald-900/60 px-1.5 py-0.5 rounded text-white">{renderStatus.jobId}</code> | Status: <strong>{renderStatus.statusText}</strong></p>
                    {renderStatus.url && (
                      <p className="pt-1">
                        Rendered MP4: <a href={renderStatus.url} target="_blank" rel="noreferrer" className="underline font-bold text-white hover:text-emerald-300">{renderStatus.url}</a>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <strong className="block text-amber-400 font-bold">
                      ℹ️ Direct Browser Call Notice
                    </strong>
                    <p>{renderStatus.error}</p>
                    <p className="text-[11px] text-slate-300">
                      You can copy and execute the exact cURL command below in your terminal, or use the <strong>Google Apps Script Studio</strong> runner!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
            <button
              onClick={() => setCreatomateTab('devotional')}
              className={`pb-2 px-3 transition-colors border-b-2 ${
                creatomateTab === 'devotional'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              4-Slide Storyboard Modifications
            </button>
            <button
              onClick={() => setCreatomateTab('curl')}
              className={`pb-2 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                creatomateTab === 'curl'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Full cURL Command & JSON</span>
            </button>
            <button
              onClick={() => setCreatomateTab('editor')}
              className={`pb-2 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
                creatomateTab === 'editor'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Asset Overrides & Raw Sample</span>
            </button>
          </div>

          {/* TAB 1: 4-Slide Storyboard Modifications */}
          {creatomateTab === 'devotional' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Slide 1: Hook */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-white flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase">
                      <span>Slide 1 • Text-1</span>
                      <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded">0-4s</span>
                    </div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold">
                      Awakening Hook:
                    </label>
                    <textarea
                      rows={4}
                      value={customMods['Text-1.text']}
                      onChange={(e) =>
                        setCustomMods({ ...customMods, 'Text-1.text': e.target.value })
                      }
                      className="w-full bg-slate-950 text-xs p-2.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    BG: <span className="text-slate-300">{customMods['Background-1.source']}</span>
                  </div>
                </div>

                {/* Slide 2: Scripture */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-white flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase">
                      <span>Slide 2 • Text-2</span>
                      <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded">4-8s</span>
                    </div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold">
                      Scripture Declaration:
                    </label>
                    <textarea
                      rows={4}
                      value={customMods['Text-2.text']}
                      onChange={(e) =>
                        setCustomMods({ ...customMods, 'Text-2.text': e.target.value })
                      }
                      className="w-full bg-slate-950 text-xs p-2.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    BG: <span className="text-slate-300">{customMods['Background-2.source']}</span>
                  </div>
                </div>

                {/* Slide 3: Heart Reflection */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-white flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase">
                      <span>Slide 3 • Text-3</span>
                      <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded">8-12s</span>
                    </div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold">
                      Heart Application:
                    </label>
                    <textarea
                      rows={4}
                      value={customMods['Text-3.text']}
                      onChange={(e) =>
                        setCustomMods({ ...customMods, 'Text-3.text': e.target.value })
                      }
                      className="w-full bg-slate-950 text-xs p-2.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    BG: <span className="text-slate-300">{customMods['Background-3.source']}</span>
                  </div>
                </div>

                {/* Slide 4: Prayer & CTA */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-white flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase">
                      <span>Slide 4 • Text-4</span>
                      <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded">12-16s</span>
                    </div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold">
                      Prayer & Ministry Call:
                    </label>
                    <textarea
                      rows={4}
                      value={customMods['Text-4.text']}
                      onChange={(e) =>
                        setCustomMods({ ...customMods, 'Text-4.text': e.target.value })
                      }
                      className="w-full bg-slate-950 text-xs p-2.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    BG: <span className="text-slate-300">{customMods['Background-4.source']}</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-600">
                  Audio Track:{' '}
                  <code className="text-[11px] bg-white px-2 py-0.5 rounded border text-slate-800 font-mono">
                    {customMods['Music.source']}
                  </code>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCustomMods(buildDevotionalCreatomatePayload(newsletter).modifications)
                    }
                    className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white transition-colors"
                  >
                    Reset to Devotional Defaults
                  </button>
                  <button
                    onClick={() => copyToClipboard(activeCurlCommand, 'curl-active')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {copiedType === 'curl-active' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>cURL Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy cURL Command</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Full cURL Command & JSON Payload */}
          {creatomateTab === 'curl' && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Terminal className="w-4 h-4" />
                    <span>cURL Command (Ready to Run in Bash/Terminal)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(activeCurlCommand, 'curl-view')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    {copiedType === 'curl-view' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs text-amber-100 font-mono overflow-x-auto whitespace-pre p-2 leading-relaxed selection:bg-amber-500 selection:text-black">
                  {activeCurlCommand}
                </pre>
              </div>

              {/* JSON Body Only */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-mono text-slate-300">Raw JSON Payload (-d):</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(activePayload, null, 2), 'json-view')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {copiedType === 'json-view' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-300" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre p-2 leading-relaxed">
                  {JSON.stringify(activePayload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Asset Overrides & Raw Sample Template */}
          {creatomateTab === 'editor' && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Background Video Asset Sources</span>
                  <span className="text-slate-500">Creatomate Cloud Assets</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Background-1.source</label>
                    <input
                      type="text"
                      value={customMods['Background-1.source']}
                      onChange={(e) =>
                        setCustomMods({ ...customMods, 'Background-1.source': e.target.value })
                      }
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Background-2.source</label>
                    <input
                      type="text"
                      value={customMods['Background-2.source']}
                      onChange={(e) =>
                        setCustomMods({ ...customMods, 'Background-2.source': e.target.value })
                      }
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Background-3.source</label>
                    <input
                      type="text"
                      value={customMods['Background-3.source']}
                      onChange={(e) =>
                        setCustomMods({ ...customMods, 'Background-3.source': e.target.value })
                      }
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Background-4.source</label>
                    <input
                      type="text"
                      value={customMods['Background-4.source']}
                      onChange={(e) =>
                        setCustomMods({ ...customMods, 'Background-4.source': e.target.value })
                      }
                      className="w-full bg-white px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Exact Sample cURL requested */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400 block">
                      Original Template Reference cURL (Template c67fa002-f471-4603-97bc-329edd25a2b8):
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Matches the exact cURL provided in user specification.
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(sampleCurl, 'curl-sample')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    {copiedType === 'curl-sample' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Sample</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre p-2 leading-relaxed">
                  {sampleCurl}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

