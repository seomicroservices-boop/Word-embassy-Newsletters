import React, { useState } from 'react';
import {
  BookOpen,
  Headphones,
  FileText,
  Sparkles,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  MessageSquare,
  Search,
  Quote,
  CheckCircle2,
  Bookmark,
  Share2,
  Copy,
  Trash2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import {
  NotebookSource,
  AudioOverviewEpisode,
  NotebookStudyGuide,
  NotebookChatMessage,
  DEFAULT_NOTEBOOK_SOURCES,
  generateTheologicalStudyGuide,
  generateAudioOverviewEpisode,
} from '../services/notebookLlm';

export const NotebookLlmWorkspace: React.FC = () => {
  const [sources, setSources] = useState<NotebookSource[]>(DEFAULT_NOTEBOOK_SOURCES);
  const [selectedSource, setSelectedSource] = useState<NotebookSource | null>(sources[0]);
  const [activeTab, setActiveTab] = useState<'study_guide' | 'audio_overview' | 'grounded_chat'>('study_guide');

  // New source modal
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceType, setNewSourceType] = useState<NotebookSource['type']>('Scripture');
  const [newSourceContent, setNewSourceContent] = useState('');

  // Study guide state
  const [studyGuide, setStudyGuide] = useState<NotebookStudyGuide | null>(null);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);

  // Audio overview state
  const [audioEpisode, setAudioEpisode] = useState<AudioOverviewEpisode | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);

  // Grounded Chat state
  const [chatMessages, setChatMessages] = useState<NotebookChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Welcome to the Word Embassy NotebookLM research workspace. I have analyzed your ${sources.length} theological sources (Scriptures, Greek Lexicons, Patristic Commentaries, and Pastoral Archives). Ask any doctrinal, hermeneutical, or expository question!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSearchingChat, setIsSearchingChat] = useState(false);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceTitle.trim() || !newSourceContent.trim()) return;
    const newSrc: NotebookSource = {
      id: `src-${Date.now()}`,
      title: newSourceTitle.trim(),
      type: newSourceType,
      content: newSourceContent.trim(),
      wordCount: newSourceContent.trim().split(/\s+/).length,
      addedAt: new Date().toISOString().split('T')[0],
      citations: [newSourceTitle.trim()],
    };
    setSources((prev) => [newSrc, ...prev]);
    setSelectedSource(newSrc);
    setShowAddSource(false);
    setNewSourceTitle('');
    setNewSourceContent('');
  };

  const handleGenerateStudyGuide = async () => {
    setIsGeneratingGuide(true);
    try {
      const guide = await generateTheologicalStudyGuide('Rooted in Divine Love (Ephesians 3)', sources);
      setStudyGuide(guide);
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const handleGenerateAudioOverview = async () => {
    setIsGeneratingAudio(true);
    try {
      const ep = await generateAudioOverviewEpisode('Rooted in Divine Love', sources);
      setAudioEpisode(ep);
      setCurrentDialogueIndex(0);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleTogglePlayAudio = () => {
    if (!audioEpisode) return;
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlayingAudio(true);
      playDialogueStep(currentDialogueIndex);
    }
  };

  const playDialogueStep = (index: number) => {
    if (!audioEpisode || index >= audioEpisode.dialogue.length) {
      setIsPlayingAudio(false);
      setCurrentDialogueIndex(0);
      return;
    }

    setCurrentDialogueIndex(index);
    const line = audioEpisode.dialogue[index];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.rate = audioSpeed;
      utterance.pitch = line.speaker.includes('David') ? 0.9 : 1.15;
      utterance.onend = () => {
        if (isPlayingAudio) {
          playDialogueStep(index + 1);
        }
      };
      utterance.onerror = () => {
        setTimeout(() => {
          if (isPlayingAudio) playDialogueStep(index + 1);
        }, 3000);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer if speech synth unavailable
      setTimeout(() => {
        if (isPlayingAudio) playDialogueStep(index + 1);
      }, 4000);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg: NotebookChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputQuery.trim(),
      timestamp: 'Just now',
    };
    setChatMessages((prev) => [...prev, userMsg]);
    const currentInput = inputQuery.trim();
    setInputQuery('');
    setIsSearchingChat(true);

    setTimeout(() => {
      let reply = `Based on your grounding sources [1] and [2]: Paul's concept of being strengthened with power (dunamis) in the inner being demonstrates that spiritual stamina is inward and supernatural. Augustine [3] reinforces that this root system anchors believers against anxious striving.`;
      if (currentInput.toLowerCase().includes('greek') || currentInput.toLowerCase().includes('word')) {
        reply = `According to the Greek Lexicon source [2], the term dunamis (δύναμις) denotes inherent resurrection vitality. Combined with huper ekperissou in Ephesians 3:20, Paul indicates God's work operates beyond finite human measurement.`;
      }

      const assistantMsg: NotebookChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: reply,
        citations: [
          { sourceId: 'src-1', sourceTitle: 'Ephesians 3:14-21', quote: 'strengthened with power through his Spirit in your inner being' },
          { sourceId: 'src-2', sourceTitle: 'Greek Lexicon', quote: 'Dunamis: inherent power, resurrection energy' },
          { sourceId: 'src-3', sourceTitle: 'Augustine on Divine Illumination', quote: 'Love provides the root system that anchors the soul' },
        ],
        timestamp: 'Just now',
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsSearchingChat(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <span>NotebookLM Theological Studio</span>
              <span className="text-xs font-sans font-semibold bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                Grounded Exegesis AI
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Curate scripture sources, generate deep doctrinal study guides, dual-host audio overviews, and grounded research citations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddSource(true)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Source Document</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Grounding Sources Panel */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>Grounding Sources ({sources.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Grounded</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {sources.map((src) => (
              <div
                key={src.id}
                onClick={() => setSelectedSource(src)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedSource?.id === src.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-serif text-xs font-bold text-white line-clamp-1">{src.title}</h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 shrink-0">
                    {src.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-sans">{src.content}</p>
                <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>{src.wordCount} words</span>
                  <span>{src.addedAt}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedSource && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-300">
                <span>Active Source Inspector</span>
                <span className="text-[10px] text-slate-500">{selectedSource.type}</span>
              </div>
              <div className="text-xs text-slate-300 font-serif leading-relaxed max-h-36 overflow-y-auto">
                {selectedSource.content}
              </div>
            </div>
          )}
        </div>

        {/* Center & Right Column: Research Studio Workspace */}
        <div className="lg:col-span-3 space-y-4">
          {/* Workspace Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-700/80 pb-3">
            <button
              onClick={() => setActiveTab('study_guide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'study_guide'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Theological Study Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('audio_overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'audio_overview'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Audio Overview (2-Host Podcast)</span>
            </button>

            <button
              onClick={() => setActiveTab('grounded_chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'grounded_chat'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Grounded Research Chat</span>
            </button>
          </div>

          {/* VIEW 1: THEOLOGICAL STUDY GUIDE */}
          {activeTab === 'study_guide' && (
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>Comprehensive Exegetical Study Guide</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Synthesized from your active scripture manuscripts, Greek morphology notes, and pastoral commentary.
                  </p>
                </div>

                <button
                  onClick={handleGenerateStudyGuide}
                  disabled={isGeneratingGuide}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingGuide ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingGuide ? 'Synthesizing with Gemini...' : 'Generate New Study Guide'}</span>
                </button>
              </div>

              {studyGuide ? (
                <div className="space-y-5 bg-slate-950 p-6 rounded-xl border border-slate-800">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">NotebookLM Master Exegesis</span>
                    <h2 className="font-serif text-2xl font-bold text-white mt-1">{studyGuide.title}</h2>
                    <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800 italic">
                      "{studyGuide.executiveSummary}"
                    </p>
                  </div>

                  {/* Key Themes */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-sm font-bold text-cyan-300 uppercase tracking-wide">Key Theological Themes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {studyGuide.keyThemes.map((t, idx) => (
                        <div key={idx} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                          <h5 className="font-serif text-xs font-bold text-white">{t.theme}</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{t.explanation}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {t.scriptureCitations.map((c, i) => (
                              <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hermeneutics */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="font-serif text-xs font-bold text-amber-300 uppercase tracking-wide">Hermeneutical & Linguistic Analysis</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <strong className="text-slate-300 block mb-1">Historical Context:</strong>
                        <p className="text-slate-400 text-[11px]">{studyGuide.hermeneuticAnalysis.historicalContext}</p>
                      </div>
                      <div>
                        <strong className="text-slate-300 block mb-1">Original Language (Greek):</strong>
                        <p className="text-slate-400 text-[11px]">{studyGuide.hermeneuticAnalysis.originalLanguageInsight}</p>
                      </div>
                      <div>
                        <strong className="text-slate-300 block mb-1">Theological Significance:</strong>
                        <p className="text-slate-400 text-[11px]">{studyGuide.hermeneuticAnalysis.theologicalSignificance}</p>
                      </div>
                    </div>
                  </div>

                  {/* 3-Point Sermon Outline */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wide">3-Point Homiletical Outline</h4>
                    <div className="space-y-2">
                      {studyGuide.sermonOutline.map((item, i) => (
                        <div key={i} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-serif text-xs font-bold text-amber-300">{item.point}</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.application}</p>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300 px-2 py-1 bg-slate-950 rounded border border-slate-800 shrink-0">
                            {item.scripture}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-12 rounded-xl border border-slate-800 text-center space-y-3">
                  <BookOpen className="w-12 h-12 text-cyan-500/40 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-white">Generate Your Grounded Study Guide</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    NotebookLM will cross-reference your {sources.length} sources to produce a full ministerial exegesis, sermon outline, and discussion questions.
                  </p>
                  <button
                    onClick={handleGenerateStudyGuide}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md mt-2 inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Exegetical Guide</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: AUDIO OVERVIEW (TWO-HOST PODCAST) */}
          {activeTab === 'audio_overview' && (
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-amber-400" />
                    <span>NotebookLM Audio Overview Generator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate an engaging, two-host theological discussion with interactive voice synthesis and transcript synchronization.
                  </p>
                </div>

                <button
                  onClick={handleGenerateAudioOverview}
                  disabled={isGeneratingAudio}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAudio ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAudio ? 'Synthesizing Dialogue...' : 'Generate Audio Overview'}</span>
                </button>
              </div>

              {audioEpisode ? (
                <div className="space-y-6">
                  {/* Audio Player Card */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/30 shadow-xl space-y-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                          NotebookLM Deep Dive Audio
                        </span>
                        <h3 className="font-serif text-lg font-bold text-white mt-0.5">{audioEpisode.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{audioEpisode.summary}</p>
                      </div>
                      <span className="text-xs font-mono px-3 py-1 bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/30">
                        {audioEpisode.durationMinutes}
                      </span>
                    </div>

                    {/* Interactive Playback Controls */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleTogglePlayAudio}
                          className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                        >
                          {isPlayingAudio ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                        </button>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{isPlayingAudio ? 'Playing Episode Audio...' : 'Audio Ready to Play'}</span>
                            {isPlayingAudio && (
                              <div className="flex items-center gap-0.5">
                                <span className="w-1 h-3 bg-amber-400 animate-pulse" />
                                <span className="w-1 h-4 bg-amber-400 animate-pulse delay-75" />
                                <span className="w-1 h-2 bg-amber-400 animate-pulse delay-150" />
                              </div>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Speaking: <strong>{audioEpisode.dialogue[currentDialogueIndex]?.speaker || 'Host'}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAudioSpeed(audioSpeed === 1 ? 1.25 : audioSpeed === 1.25 ? 1.5 : 1)}
                          className="px-2.5 py-1 bg-slate-800 text-amber-300 rounded-lg text-xs font-mono font-bold border border-slate-700"
                        >
                          {audioSpeed}x
                        </button>
                        <button
                          onClick={() => playDialogueStep(0)}
                          className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg"
                          title="Restart from beginning"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Synchronized Dialogue Transcript */}
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {audioEpisode.dialogue.map((item, idx) => {
                        const isCurrent = idx === currentDialogueIndex;
                        const isDavid = item.speaker.includes('David');
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setCurrentDialogueIndex(idx);
                              if (isPlayingAudio) playDialogueStep(idx);
                            }}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-amber-950/40 border-amber-500/60 shadow-md'
                                : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-xs font-bold ${isDavid ? 'text-amber-400' : 'text-cyan-400'}`}>
                                {item.speaker}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-12 rounded-xl border border-slate-800 text-center space-y-3">
                  <Headphones className="w-12 h-12 text-amber-500/40 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-white">Generate 2-Host Audio Overview</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    NotebookLM creates a conversational podcast breakdown between two theological scholars analyzing your sources.
                  </p>
                  <button
                    onClick={handleGenerateAudioOverview}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md mt-2 inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Podcast Episode</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: GROUNDED RESEARCH CHAT */}
          {activeTab === 'grounded_chat' && (
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4 shadow-lg flex flex-col h-[580px]">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Interactive Grounded Q&A Assistant</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">Strictly Source-Grounded</span>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-950/50 border border-purple-500/30 text-white ml-12'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 mr-8 space-y-3'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold">{msg.role === 'user' ? 'Researcher' : 'NotebookLM Exegete'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="font-sans">{msg.content}</p>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Grounding Citations:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((cit, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-cyan-300 rounded border border-cyan-800/60"
                              title={cit.quote}
                            >
                              [{idx + 1}] {cit.sourceTitle}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isSearchingChat && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Searching grounding sources and formulating theological synthesis...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask a theological, Greek word study, or exegesis question grounded in sources..."
                  className="flex-1 bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-700 text-xs focus:outline-hidden focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isSearchingChat}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all"
                >
                  Ask
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              <span>Add New Grounding Source</span>
            </h3>

            <form onSubmit={handleAddSource} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Source Title / Reference:</label>
                <input
                  type="text"
                  value={newSourceTitle}
                  onChange={(e) => setNewSourceTitle(e.target.value)}
                  placeholder="e.g. Colossians 2:6-10 Greek Text & Word Studies"
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-lg border border-slate-700 text-xs focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Source Type:</label>
                <select
                  value={newSourceType}
                  onChange={(e: any) => setNewSourceType(e.target.value)}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-lg border border-slate-700 text-xs focus:outline-hidden"
                >
                  <option value="Scripture">Scripture</option>
                  <option value="Lexicon">Lexicon / Word Study</option>
                  <option value="Commentary">Theological Commentary</option>
                  <option value="Newsletter">Pastoral Newsletter Archive</option>
                  <option value="Document">Ministry Document</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Source Text / Excerpt:</label>
                <textarea
                  value={newSourceContent}
                  onChange={(e) => setNewSourceContent(e.target.value)}
                  rows={5}
                  placeholder="Paste the scripture verses, translation notes, Greek parsing, or theological text here..."
                  className="w-full bg-slate-950 text-white p-3 rounded-lg border border-slate-700 text-xs focus:outline-hidden focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSource(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md"
                >
                  Ingest Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
