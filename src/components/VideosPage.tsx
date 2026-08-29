import React, { useState } from 'react';
import { Play, Video, Youtube, ExternalLink, Calendar, Eye, Sparkles } from 'lucide-react';
import { VideoItem, Newsletter } from '../types';

interface VideosPageProps {
  videos: VideoItem[];
  newsletters: Newsletter[];
  onNavigate: (view: string, slug?: string) => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({
  videos,
  newsletters,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'veo' | 'shorts'>('all');

  const filteredVideos = videos.filter((v) => {
    if (activeTab === 'veo') return v.Type === 'Veo Devotional';
    if (activeTab === 'shorts') return v.Type === 'Short';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider border border-red-200">
            <Youtube className="w-3.5 h-3.5" />
            <span>Word Embassy Multimedia Channel</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#1E293B] tracking-tight">
            Video Teachings & Veo Devotionals
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light">
            Watch vertical 9:16 devotional reels, biblical expositions, and video reflections generated through the Google Veo pipeline.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#1E293B] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveTab('veo')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                activeTab === 'veo'
                  ? 'bg-[#1E293B] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Veo Devotionals
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((vid) => {
            const relatedNl = newsletters.find((n) => n.NewsletterID === vid.NewsletterID);
            return (
              <div
                key={vid.VideoID}
                onClick={() => {
                  if (relatedNl) {
                    onNavigate('newsletter', relatedNl.Slug);
                  }
                }}
                className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={vid.ThumbnailURL}
                      alt={vid.Title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-[11px] font-mono font-bold px-2 py-0.5 rounded text-white">
                      {vid.Duration}
                    </span>
                    <span className="absolute top-2 left-2 bg-red-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      {vid.Type}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(vid.PublishDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {vid.Views.toLocaleString()} views
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#1E293B] group-hover:text-[#B45309] transition-colors leading-snug line-clamp-2">
                      {vid.Title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2 font-light leading-relaxed">
                      {vid.Description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#B45309]">
                  <span>Watch Devotional & Read Study</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
