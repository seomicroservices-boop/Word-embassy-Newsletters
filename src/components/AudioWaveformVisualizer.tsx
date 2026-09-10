import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  BarChart2,
  Waves,
  Sparkles,
  Volume2,
  Radio,
} from 'lucide-react';

export type WaveformMode = 'bars' | 'wave' | 'spectrum';

interface AudioWaveformVisualizerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume?: number;
  playbackRate?: number;
  onSeek?: (time: number) => void;
  className?: string;
  seedTitle?: string;
  defaultMode?: WaveformMode;
  accentColor?: 'amber' | 'emerald' | 'cyan';
}

// Generate pseudo-deterministic, organic voice speech waveform data
function generateVoiceProfile(count: number, seed: string): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const profile: number[] = [];
  for (let i = 0; i < count; i++) {
    // Combine multiple sine frequencies to simulate spoken cadence with pauses
    const t = i / count;
    const baseEnvelope = Math.sin(t * Math.PI); // Devotional bell curve
    const speechCadence =
      Math.sin(i * 0.45 + (hash % 17)) * 0.35 +
      Math.sin(i * 1.1 + (hash % 23)) * 0.25 +
      Math.sin(i * 2.3 + (hash % 31)) * 0.15;

    // Introduce natural conversational vocal breath pauses
    const pauseFactor = (i % 9 === 0 || i % 14 === 0) ? 0.3 : 1.0;

    let val = (baseEnvelope * 0.65 + speechCadence * 0.35) * pauseFactor;
    // Normalize between 0.15 and 0.95
    val = Math.max(0.18, Math.min(0.95, Math.abs(val) + 0.15));
    profile.push(val);
  }
  return profile;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume = 0.85,
  playbackRate = 1.0,
  onSeek,
  className = '',
  seedTitle = 'devotional',
  defaultMode = 'bars',
  accentColor = 'amber',
}) => {
  const [mode, setMode] = useState<WaveformMode>(defaultMode);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [animatedOffset, setAnimatedOffset] = useState(0);

  const barCount = 56;
  const baseProfile = useMemo(
    () => generateVoiceProfile(barCount, seedTitle || 'LivingWord'),
    [seedTitle, barCount]
  );

  // Real-time animation loop for canvas & bar oscillation
  useEffect(() => {
    let lastTimestamp = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setAnimatedOffset((prev) => (prev + delta * 3.5 * playbackRate) % (Math.PI * 2));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackRate]);

  // Canvas wave rendering
  useEffect(() => {
    if (mode !== 'wave' && mode !== 'spectrum') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
    const playheadX = width * progressRatio;

    if (mode === 'wave') {
      // Fluid Waveform rendering with glowing gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.9)'); // amber-500
      gradient.addColorStop(Math.min(1, progressRatio), 'rgba(251, 191, 36, 1)'); // amber-400
      if (progressRatio < 1) {
        gradient.addColorStop(Math.min(1, progressRatio + 0.01), 'rgba(71, 85, 105, 0.5)'); // slate-600
        gradient.addColorStop(1, 'rgba(51, 65, 85, 0.3)');
      }

      // Fill area under curve
      const areaGradient = ctx.createLinearGradient(0, 0, 0, height);
      areaGradient.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
      areaGradient.addColorStop(0.5, 'rgba(217, 119, 6, 0.1)');
      areaGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

      // Draw baseline wave path
      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      const segments = 80;
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        const norm = i / segments;
        const envelope = Math.sin(norm * Math.PI); // taper at edges

        // Dynamic harmonic amplitude
        const amp = isPlaying ? (volume * 16 + 6) : 6;
        const wave1 = Math.sin(norm * 12 + animatedOffset) * amp;
        const wave2 = Math.cos(norm * 20 - animatedOffset * 1.3) * (amp * 0.5);
        const wave3 = Math.sin(norm * 6 + animatedOffset * 0.5) * (amp * 0.35);

        const y = height / 2 + (wave1 + wave2 + wave3) * envelope;
        ctx.lineTo(x, y);
      }

      // Stroke wave
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = isPlaying ? 'rgba(245, 158, 11, 0.6)' : 'transparent';
      ctx.shadowBlur = isPlaying ? 12 : 0;
      ctx.stroke();

      // Complete area path and fill
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = areaGradient;
      ctx.fill();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw playhead vertical guide & beacon
      if (progressRatio > 0 && progressRatio < 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#FDE68A'; // amber-200
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glowing center dot
        ctx.beginPath();
        ctx.arc(playheadX, height / 2, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    } else if (mode === 'spectrum') {
      // Frequency bands spectrum rendering (Voice EQ simulation)
      const bands = 40;
      const bandWidth = (width / bands) * 0.65;
      const gap = (width / bands) * 0.35;

      for (let i = 0; i < bands; i++) {
        const x = i * (bandWidth + gap);
        const norm = i / bands;

        // Vocal spectrum curve: higher in speech presence (300Hz - 3kHz), lower at extremes
        const formant = Math.sin(norm * Math.PI) * 0.85 + 0.15;
        const dynamicBoost = isPlaying
          ? Math.abs(Math.sin(i * 0.8 + animatedOffset * 1.5) * 0.4 + Math.cos(i * 0.3 - animatedOffset) * 0.3)
          : 0.08;

        const totalHeightRatio = Math.min(0.92, (formant * 0.5 + dynamicBoost * 0.5) * volume);
        const barH = totalHeightRatio * (height - 8);
        const y = height - barH - 4;

        const isPast = x <= playheadX;

        // Rounded bar
        ctx.beginPath();
        ctx.roundRect(x, y, bandWidth, barH, [4, 4, 1, 1]);

        if (isPast) {
          const barGrad = ctx.createLinearGradient(0, y, 0, height);
          barGrad.addColorStop(0, '#FCD34D'); // amber-300
          barGrad.addColorStop(1, '#D97706'); // amber-600
          ctx.fillStyle = barGrad;
          ctx.shadowColor = isPlaying ? 'rgba(245, 158, 11, 0.4)' : 'transparent';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = 'rgba(51, 65, 85, 0.5)';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  }, [mode, currentTime, duration, isPlaying, volume, animatedOffset]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = offsetX / rect.width;
    setHoverTime(ratio * duration);
    setHoverPosition(offsetX);
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setHoverTime(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration <= 0 || !onSeek) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = offsetX / rect.width;
    onSeek(ratio * duration);
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className={`bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-inner relative select-none ${className}`}
      id="devotional-waveform-visualizer"
    >
      {/* Top Status & Controls Toolbar */}
      <div className="flex items-center justify-between gap-2 mb-3 text-xs">
        {/* Left: Active Voice Detection Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-pulse'
                  : 'bg-slate-600'
              }`}
            />
            <span className="font-mono text-[11px] font-semibold text-slate-300">
              {isPlaying ? 'VOICEOVER ACTIVE' : 'DEVOTIONAL READY'}
            </span>
          </div>

          {isPlaying && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-400/90 font-mono">
              <Radio className="w-3 h-3 animate-spin" />
              <span>Synced Playback</span>
            </div>
          )}
        </div>

        {/* Right: Waveform Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('bars')}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
              mode === 'bars'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Interactive Audio Waveform Bars"
            id="waveform-mode-bars-btn"
          >
            <BarChart2 className="w-3 h-3" />
            <span className="hidden xs:inline">Bars</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('wave')}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
              mode === 'wave'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Fluid Sine Waveform Canvas"
            id="waveform-mode-wave-btn"
          >
            <Waves className="w-3 h-3" />
            <span className="hidden xs:inline">Wave</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('spectrum')}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
              mode === 'spectrum'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Devotional Frequency Spectrum EQ"
            id="waveform-mode-spectrum-btn"
          >
            <Activity className="w-3 h-3" />
            <span className="hidden xs:inline">Spectrum</span>
          </button>
        </div>
      </div>

      {/* Main Waveform Interaction Stage */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        className="relative h-16 sm:h-20 w-full cursor-pointer flex items-center rounded-lg overflow-hidden bg-slate-950/60 border border-slate-800/80 px-2 group"
        title="Click anywhere to jump to timestamp"
        id="waveform-scrubber-stage"
      >
        {/* Hover Time Tooltip */}
        {isHovered && hoverTime !== null && (
          <div
            className="absolute -top-7 pointer-events-none transform -translate-x-1/2 z-30 bg-amber-400 text-slate-950 text-[10px] font-bold font-mono px-2 py-0.5 rounded shadow-md border border-amber-300 flex items-center gap-1"
            style={{ left: `${hoverPosition}px` }}
          >
            <span>Jump to {formatSeconds(hoverTime)}</span>
          </div>
        )}

        {/* Hover ghost line */}
        {isHovered && (
          <div
            className="absolute top-0 bottom-0 w-px bg-amber-300/70 z-20 pointer-events-none"
            style={{ left: `${hoverPosition}px` }}
          />
        )}

        {/* Mode 1: Interactive Discrete Bars */}
        {mode === 'bars' && (
          <div className="w-full h-full flex items-center justify-between gap-[2px] sm:gap-[3px] py-2">
            {baseProfile.map((baseHeight, idx) => {
              const barProgressRatio = idx / (barCount - 1);
              const isPast = barProgressRatio <= (progressPercent / 100);
              const isCurrent =
                Math.abs(barProgressRatio - (progressPercent / 100)) < 0.025;

              // Dynamic real-time height modulation when playing
              let dynamicMultiplier = 1.0;
              if (isPlaying) {
                const phase = idx * 0.35 + animatedOffset;
                const waveMod = Math.sin(phase) * 0.25 + Math.cos(idx * 0.7 - animatedOffset) * 0.15;
                dynamicMultiplier = Math.max(0.35, 1.0 + waveMod * (isPast || isCurrent ? 1.1 : 0.4));
              }

              const finalHeightPercent = Math.max(
                12,
                Math.min(95, baseHeight * dynamicMultiplier * 100)
              );

              return (
                <div
                  key={idx}
                  className="flex-1 h-full flex items-center justify-center"
                >
                  <div
                    className={`w-full rounded-full transition-all duration-150 ${
                      isCurrent
                        ? 'bg-white ring-2 ring-amber-400 shadow-[0_0_10px_#F59E0B]'
                        : isPast
                        ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300 shadow-[0_0_4px_rgba(245,158,11,0.5)]'
                        : 'bg-slate-700/60 hover:bg-slate-600'
                    }`}
                    style={{
                      height: `${finalHeightPercent}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Mode 2 & 3: HTML5 Canvas (Fluid Wave / Spectrum) */}
        {(mode === 'wave' || mode === 'spectrum') && (
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />
        )}
      </div>

      {/* Waveform Footer: Time Readout & Dynamic Meter */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">{formatSeconds(currentTime)}</span>
          <span className="text-slate-600">/</span>
          <span>{formatSeconds(duration || 135)}</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            ({Math.round(progressPercent)}% complete)
          </span>
        </div>

        {/* Dynamic VU level indicator */}
        <div className="flex items-center gap-1.5" title="Vocal Dynamics Monitor">
          <Volume2 className="w-3 h-3 text-slate-500" />
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5, 6].map((i) => {
              const activeCount = isPlaying ? Math.min(6, Math.max(1, Math.round(volume * 6))) : 0;
              const isActive = i <= activeCount;
              return (
                <div
                  key={i}
                  className={`w-1 h-2.5 rounded-xs transition-all ${
                    isActive
                      ? i > 4
                        ? 'bg-rose-500 shadow-[0_0_4px_#f43f5e]'
                        : i > 2
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                      : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-[10px] text-slate-500 font-sans hidden md:inline">
            {isPlaying ? '48kHz HD' : 'Standby'}
          </span>
        </div>
      </div>
    </div>
  );
};
