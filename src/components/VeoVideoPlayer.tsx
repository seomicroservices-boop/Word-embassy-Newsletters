import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Video, Sparkles, Youtube } from 'lucide-react';
import { Newsletter } from '../types';

interface VeoVideoPlayerProps {
  newsletter: Newsletter;
}

export const VeoVideoPlayer: React.FC<VeoVideoPlayerProps> = ({ newsletter }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<'hook' | 'narration' | 'cta'>('hook');
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hookText = newsletter.YouTubeShortHook || `Why does God ask us to persist in prayer?`;
  const narrationText =
    newsletter.YouTubeShortNarration ||
    `In ${newsletter.ScriptureReference}, God reminds us that when we seek Him with all our heart, we will find Him. When answers seem delayed, faith grows stronger. Never give up on what God has promised you.`;
  const ctaText = newsletter.YouTubeShortCTA || 'Subscribe to Word Embassy for weekly Bible teachings.';

  useEffect(() => {
    if (isPlaying) {
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
  }, [isPlaying, isMuted, hookText, narrationText, ctaText]);

  const handleTogglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
      setCurrentSegment('hook');
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentSegment('hook');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm my-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
            <Youtube className="w-4 h-4" />
            <span>Veo Video & YouTube Short</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1E293B] mt-0.5">
            Vertical Devotional Reel (9:16)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-50 text-[#B45309] font-semibold px-2.5 py-1 rounded-full border border-amber-200">
            Google Veo Generated
          </span>
          <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">
            Gemini Script
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-slate-900 rounded-2xl p-6 sm:p-8 text-white">
        {/* 9:16 Vertical Video Frame */}
        <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 flex flex-col justify-between p-5 select-none">
          {/* Background image & gradient overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{
              backgroundImage: `url(${newsletter.FeaturedImageURL})`,
              filter: 'brightness(0.4) saturate(1.2)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80" />

          {/* Top Info Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#B45309] text-white flex items-center justify-center text-xs font-bold font-serif shadow-sm">
                WE
              </div>
              <div>
                <span className="font-serif text-xs font-bold block text-white tracking-tight">
                  WORD EMBASSY
                </span>
                <span className="text-[10px] text-amber-300 font-medium">
                  {newsletter.ScriptureReference}
                </span>
              </div>
            </div>
            <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Devotional
            </div>
          </div>

          {/* Center: Dynamic Subtitles / Script animation */}
          <div className="relative z-10 text-center my-auto px-2">
            {currentSegment === 'hook' && (
              <div className="animate-fade-in space-y-2">
                <span className="inline-block bg-amber-400 text-slate-900 text-xs font-black uppercase px-2.5 py-1 rounded shadow-md tracking-wider">
                  QUESTION OF FAITH
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                  “{hookText}”
                </h4>
              </div>
            )}

            {currentSegment === 'narration' && (
              <div className="animate-fade-in space-y-3">
                <p className="font-scripture text-lg sm:text-xl text-[#FEF3C7] leading-relaxed drop-shadow-lg italic font-medium">
                  {narrationText}
                </p>
                <div className="inline-block text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-slate-200 border border-slate-700">
                  {newsletter.ScriptureReference}
                </div>
              </div>
            )}

            {currentSegment === 'cta' && (
              <div className="animate-fade-in space-y-3 bg-black/70 backdrop-blur-md p-4 rounded-xl border border-amber-400/30">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                <h4 className="font-serif text-lg font-bold text-white leading-snug">
                  {ctaText}
                </h4>
                <p className="text-xs text-amber-300">www.wordembassy.org</p>
              </div>
            )}
          </div>

          {/* Bottom Controls inside vertical reel */}
          <div className="relative z-10 space-y-3">
            {/* Progress bar */}
            <div className="w-full bg-slate-700/80 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white/90">
              <button
                onClick={handleTogglePlay}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors"
                id="veo-toggle-play-btn"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                id="veo-toggle-mute-btn"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                id="veo-reset-btn"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Information & Generation Transcript */}
        <div className="flex-1 space-y-4 max-w-md">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Multi-Platform Video Output
            </span>
            <h4 className="font-serif text-2xl font-bold text-white">
              {newsletter.YouTubeTitle || `${newsletter.Title} (YouTube Short)`}
            </h4>
            <p className="text-sm text-slate-300">
              Generated with Gemini high-retention hook and video prompt synthesized for Google Veo.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-3 text-xs">
            <div>
              <span className="text-amber-300 font-semibold block mb-1">
                Hook (0-3s):
              </span>
              <p className="text-slate-300 italic">{hookText}</p>
            </div>
            <div>
              <span className="text-amber-300 font-semibold block mb-1">
                Spoken Narration (3-45s):
              </span>
              <p className="text-slate-300 leading-relaxed">{narrationText}</p>
            </div>
            <div>
              <span className="text-amber-300 font-semibold block mb-1">
                Veo AI Video Prompt:
              </span>
              <p className="text-slate-400 font-mono text-[11px] bg-slate-900/80 p-2.5 rounded border border-slate-800">
                {newsletter.VeoVideoPrompt ||
                  'Cinematic 9:16 vertical video of serene golden sunrise over quiet mountains, soft ambient lighting, high definition, 45 seconds.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleTogglePlay}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Devotional' : 'Play Devotional Reel'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
