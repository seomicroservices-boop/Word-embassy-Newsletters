import React, { useState, useEffect } from 'react';
import { Mountain, Image as ImageIcon, Eye, Sun, Sparkles, Check, ChevronDown, Sliders, X, Droplets, Compass } from 'lucide-react';

export interface NaturalScenery {
  id: string;
  title: string;
  scriptureRef: string;
  description: string;
  imageUrl: string;
  themeColor: string;
}

export const NATURAL_SCENERIES: NaturalScenery[] = [
  {
    id: 'green-pastures',
    title: 'Green Pastures & Still Waters',
    scriptureRef: 'Psalm 23:2',
    description: 'Tranquil emerald valley meadow with quiet flowing stream and morning mist',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85',
    themeColor: '#059669',
  },
  {
    id: 'mount-olives-dawn',
    title: 'Mount of Olives at Dawn',
    scriptureRef: 'Luke 22:39',
    description: 'Golden morning light filtering through ancient olive trees and rolling hills',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2400&q=85',
    themeColor: '#D97706',
  },
  {
    id: 'sea-of-galilee',
    title: 'Sea of Galilee at Sunrise',
    scriptureRef: 'Matthew 14:25',
    description: 'Peaceful dawn reflection over serene still waters and distant mountain ridge',
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2400&q=85',
    themeColor: '#0284C7',
  },
  {
    id: 'mountain-sanctuary',
    title: 'Mountain Sanctuary & Cedars',
    scriptureRef: 'Psalm 104:16-18',
    description: 'Majestic mountain ridges crowned with evergreen pines and heavenly clouds',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85',
    themeColor: '#475569',
  },
  {
    id: 'golden-harvest',
    title: 'Golden Fields of Harvest',
    scriptureRef: 'John 4:35',
    description: 'Warm sunset casting radiant golden light across ripening fields of grain',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=85',
    themeColor: '#B45309',
  },
  {
    id: 'tranquil-brook',
    title: 'Living Waters Woodland Brook',
    scriptureRef: 'Psalm 42:1',
    description: 'Pure clear brook cascading over smooth stones beneath a sunlit forest canopy',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=85',
    themeColor: '#0D9488',
  },
];

export interface ScenerySettings {
  sceneryId: string;
  intensity: 'subtle' | 'balanced' | 'immersive' | 'off';
  blur: 'none' | 'soft' | 'dreamy';
  panEffect: boolean;
}

interface NaturalSceneryBackgroundProps {
  currentSceneryId: string;
  intensity: 'subtle' | 'balanced' | 'immersive' | 'off';
  blur: 'none' | 'soft' | 'dreamy';
  panEffect: boolean;
  onUpdateSettings: (settings: Partial<ScenerySettings>) => void;
}

export const NaturalSceneryBackground: React.FC<NaturalSceneryBackgroundProps> = ({
  currentSceneryId,
  intensity,
  blur,
  panEffect,
  onUpdateSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeScenery =
    NATURAL_SCENERIES.find((s) => s.id === currentSceneryId) || NATURAL_SCENERIES[0];

  // Opacity mapping for optimal reading contrast
  const opacityMap: Record<string, number> = {
    off: 0,
    subtle: 0.18,
    balanced: 0.35,
    immersive: 0.6,
  };

  const blurClassMap: Record<string, string> = {
    none: '',
    soft: 'backdrop-blur-[2px]',
    dreamy: 'backdrop-blur-[5px]',
  };

  const currentOpacity = opacityMap[intensity] ?? 0.18;

  return (
    <>
      {/* Fixed Ambient Natural Scenery Layer */}
      {intensity !== 'off' && (
        <div
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          aria-hidden="true"
          id="natural-scenery-backdrop-container"
        >
          {/* High-definition scenic image with optional gentle slow pan */}
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform ${
              panEffect ? 'scale-105 motion-safe:animate-pulse' : 'scale-100'
            }`}
            style={{
              backgroundImage: `url(${activeScenery.imageUrl})`,
              opacity: currentOpacity,
              transition: 'opacity 0.8s ease-in-out, background-image 1s ease-in-out',
            }}
          />

          {/* Warm editorial vignette & legibility gradient wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/75 via-[#FDFBF7]/60 to-[#FDFBF7]/85" />
          
          {/* Subtle perimeter vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#FDFBF7]/40 to-[#FDFBF7]/80" />

          {/* Optional backdrop blur layer for soft focus */}
          {blur !== 'none' && (
            <div className={`absolute inset-0 ${blurClassMap[blur]}`} />
          )}
        </div>
      )}

      {/* Floating Scenery Switcher Widget */}
      <div className="fixed bottom-5 right-5 z-40">
        <div className="relative">
          {/* Toggle pill button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center gap-2.5 px-3.5 py-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-full shadow-lg border border-amber-200/80 backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 text-xs font-semibold"
            id="natural-scenery-toggle-btn"
            title="Choose Biblical Natural Scenery & Atmosphere"
          >
            <span className="w-6 h-6 rounded-full overflow-hidden border border-amber-400/60 shadow-2xs shrink-0 flex items-center justify-center bg-amber-100 text-amber-800">
              <Mountain className="w-3.5 h-3.5" />
            </span>
            <span className="hidden sm:inline text-slate-700">
              Scenery:{' '}
              <strong className="text-amber-900 font-bold">
                {intensity === 'off' ? 'Minimal' : activeScenery.title.split('&')[0].trim()}
              </strong>
            </span>
            <span className="sm:hidden text-slate-700 font-bold">Scenery</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Scenery Selection & Control Panel Popover */}
          {isOpen && (
            <div
              className="absolute bottom-12 right-0 w-[320px] sm:w-[360px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-4 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200 z-50 text-slate-800"
              id="natural-scenery-control-panel"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900 leading-none">
                      Natural Sceneries
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tranquil Biblical backdrops of God’s creation
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label="Close scenery panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scenery Grid */}
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {NATURAL_SCENERIES.map((scenery) => {
                  const isSelected = activeScenery.id === scenery.id && intensity !== 'off';
                  return (
                    <button
                      key={scenery.id}
                      onClick={() => {
                        onUpdateSettings({
                          sceneryId: scenery.id,
                          intensity: intensity === 'off' ? 'subtle' : intensity,
                        });
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-amber-50 border border-amber-300 shadow-2xs'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div
                        className="w-12 h-10 rounded-lg bg-cover bg-center shrink-0 border border-slate-200 shadow-2xs overflow-hidden relative"
                        style={{ backgroundImage: `url(${scenery.imageUrl})` }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-900/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {scenery.title}
                          </p>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded-full shrink-0">
                            {scenery.scriptureRef}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {scenery.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Intensity Presets */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-slate-400" />
                    <span>Backdrop Presence</span>
                  </span>
                  <span className="text-amber-800 uppercase font-bold text-[10px]">
                    {intensity}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-medium">
                  {(['off', 'subtle', 'balanced', 'immersive'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => onUpdateSettings({ intensity: lvl })}
                      className={`py-1.5 rounded-lg capitalize transition-all text-[11px] ${
                        intensity === lvl
                          ? 'bg-amber-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus / Blur and Subtle Motion */}
              {intensity !== 'off' && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span>Soft Blur:</span>
                    {(['none', 'soft', 'dreamy'] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => onUpdateSettings({ blur: b })}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                          blur === b
                            ? 'bg-slate-900 text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => onUpdateSettings({ panEffect: !panEffect })}
                    className={`text-[10px] px-2 py-1 rounded-md font-semibold transition-all ${
                      panEffect
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {panEffect ? 'Motion: ON' : 'Motion: OFF'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
