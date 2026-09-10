import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Download,
  Headphones,
  Mic,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Radio,
  BookOpen,
} from 'lucide-react';
import { AudioWaveformVisualizer, WaveformMode } from './AudioWaveformVisualizer';

interface DevotionalAudioPlayerProps {
  audioUrl?: string;
  title: string;
  scriptureReference?: string;
  scriptureText?: string;
  bibleBook?: string;
  bibleChapter?: number | string;
  bibleVerses?: string;
  prayer?: string;
  transcript?: string;
  durationText?: string;
  voiceName?: string;
  onRegenerateAudio?: () => Promise<void>;
  isGeneratingAudio?: boolean;
  className?: string;
  compact?: boolean;
}

export const DevotionalAudioPlayer: React.FC<DevotionalAudioPlayerProps> = ({
  audioUrl,
  title,
  scriptureReference,
  scriptureText,
  bibleBook,
  bibleChapter,
  bibleVerses,
  prayer,
  transcript,
  durationText = '2:15',
  voiceName = 'ElevenLabs Custom (nPczCjzI2devNBz1zQrb)',
  onRegenerateAudio,
  isGeneratingAudio = false,
  className = '',
  compact = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Fallback sample audio if no custom URL
  const effectiveAudioUrl =
    audioUrl ||
    'https://cdn.jsdelivr.net/gh/rafaelreis-hotmart/Audio-Sample-files@master/sample.mp3';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsAudioLoaded(true);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      console.warn('Audio playback load warning on:', effectiveAudioUrl);
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [effectiveAudioUrl]);

  // Pause audio when unmounted or url changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [effectiveAudioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((err) => {
          console.warn('Audio playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const skipTime = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration || 100, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 0.9];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const effectiveTranscript =
    transcript ||
    `${title}. Scripture foundation: ${scriptureReference || 'Holy Bible'}. “${
      scriptureText || ''
    }”. Prayer of Faith: ${prayer || 'Lord, guard our hearts and minds today with Your peace. Amen.'}`;

  if (compact) {
    return (
      <div
        className={`bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800 shadow-md flex items-center justify-between gap-3 ${className}`}
        id="compact-devotional-audio-player"
      >
        <audio ref={audioRef} src={effectiveAudioUrl} preload="metadata" />

        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={togglePlayPause}
            disabled={isGeneratingAudio}
            className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
            title={isPlaying ? 'Pause Narration' : 'Listen with ElevenLabs'}
          >
            {isGeneratingAudio ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold uppercase tracking-wider">
              <Headphones className="w-3 h-3" />
              <span>ElevenLabs Audio Devotional</span>
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate">
              {title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : durationText}
          </span>
          <button
            onClick={cyclePlaybackRate}
            className="text-[11px] font-bold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono transition-colors"
            title="Playback Speed"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white rounded-2xl p-5 sm:p-6 border border-amber-500/20 shadow-xl space-y-4 relative overflow-hidden ${className}`}
      id="devotional-audio-player-card"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      {/* Hidden audio element */}
      <audio ref={audioRef} src={effectiveAudioUrl} preload="metadata" />

      {/* Top Header & Badges */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Headphones className="w-3.5 h-3.5" />
            <span>Audio Devotional Narration</span>
          </span>
          {(bibleBook || scriptureReference) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-200 text-xs font-bold border border-amber-500/40 shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {bibleBook && bibleChapter
                  ? `${bibleBook} ${bibleChapter}: ${bibleVerses || '1'}`
                  : scriptureReference}
              </span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
            <Mic className="w-3 h-3 text-amber-400" />
            <span>ElevenLabs Voice (nPczCjzI2devNBz1zQrb)</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onRegenerateAudio && (
            <button
              onClick={onRegenerateAudio}
              disabled={isGeneratingAudio}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-50"
              title="Regenerate audio narration with ElevenLabs"
              id="regenerate-devotional-audio-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAudio ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isGeneratingAudio ? 'Generating...' : 'Re-synthesize'}</span>
            </button>
          )}

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            id="toggle-audio-transcript-btn"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Transcript</span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <a
            href={effectiveAudioUrl}
            download={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-audio-devotional.mp3`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Download Devotional MP3 Audio"
            id="download-devotional-audio-btn"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Devotional Title & Scripture Info */}
      <div className="relative z-10 space-y-1">
        <h4 className="font-serif text-lg sm:text-xl font-bold text-white leading-snug">
          {title}
        </h4>
        {scriptureReference && (
          <p className="text-xs text-amber-400/90 font-medium">
            Scripture Reading & Prayer of Faith • {scriptureReference}
          </p>
        )}
      </div>

      {/* Synchronized Audio Waveform Visualization */}
      <div className="relative z-10">
        <AudioWaveformVisualizer
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration || 135}
          volume={isMuted ? 0 : volume}
          playbackRate={playbackRate}
          seedTitle={title}
          onSeek={(newTime) => {
            setCurrentTime(newTime);
            if (audioRef.current) {
              audioRef.current.currentTime = newTime;
            }
          }}
        />
      </div>

      {/* Playback Controls Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Left: Speed & 10s skips */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => skipTime(-10)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Rewind 10 seconds"
            id="rewind-10s-btn"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isGeneratingAudio}
            className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 transition-transform active:scale-95 disabled:opacity-50"
            title={isPlaying ? 'Pause' : 'Play Narration'}
            id="play-pause-devotional-btn"
          >
            {isGeneratingAudio ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => skipTime(10)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Forward 10 seconds"
            id="forward-10s-btn"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={cyclePlaybackRate}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-mono font-bold border border-slate-700 transition-colors"
            title="Change Playback Speed"
            id="playback-speed-btn"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Right: Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
            id="volume-mute-btn"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 sm:w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            id="volume-slider-range"
            title="Volume"
          />
        </div>
      </div>

      {/* Expandable Spoken Transcript */}
      {showTranscript && (
        <div
          className="relative z-10 mt-3 pt-3 border-t border-slate-800 space-y-2 animate-fadeIn"
          id="spoken-transcript-drawer"
        >
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Narration Script (ElevenLabs Audio)</span>
            </span>
            <span className="text-slate-400 font-normal">
              Voice: {voiceName}
            </span>
          </div>
          <div className="bg-slate-950/70 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto border border-slate-800/80 font-sans">
            <p className="whitespace-pre-line">{effectiveTranscript}</p>
          </div>
        </div>
      )}
    </div>
  );
};
