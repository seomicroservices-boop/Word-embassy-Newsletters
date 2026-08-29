import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Sparkles, BookOpen, Send, Eye } from 'lucide-react';
import { Subscriber } from '../types';

interface SubscribePageProps {
  onSubscribe: (name: string, email: string) => Subscriber;
  onNavigate: (view: string, slug?: string) => void;
}

export const SubscribePage: React.FC<SubscribePageProps> = ({
  onSubscribe,
  onNavigate,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribedUser, setSubscribedUser] = useState<Subscriber | null>(null);
  const [showWelcomeEmailPreview, setShowWelcomeEmailPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subscriber = onSubscribe(name || 'Faithful Reader', email);
    setSubscribedUser(subscriber);
    setShowWelcomeEmailPreview(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-[#B45309] text-xs font-semibold uppercase tracking-wider border border-amber-200">
            <Mail className="w-3.5 h-3.5" />
            <span>Join Our Global Community</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#1E293B] tracking-tight">
            Subscribe to Word Embassy
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light">
            Receive pure, biblically grounded scripture teachings, prayer guides, and multimedia devotionals delivered directly to your inbox every Wednesday.
          </p>
        </div>

        {/* Subscription Form Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-md max-w-2xl mx-auto">
          {subscribedUser ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#1E293B]">
                  Welcome to the Word Embassy Family!
                </h3>
                <p className="text-sm text-slate-600">
                  We have added <strong className="text-slate-800">{subscribedUser.Email}</strong> to our active subscriber list. A confirmation and welcome blessing has been generated for you.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setShowWelcomeEmailPreview(!showWelcomeEmailPreview)}
                  className="w-full sm:w-auto bg-[#1E293B] hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  id="toggle-welcome-email-preview-btn"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showWelcomeEmailPreview ? 'Hide Welcome Email' : 'Preview Your Welcome Email'}</span>
                </button>
                <button
                  onClick={() => onNavigate('newsletter', 'the-power-of-persistent-prayer')}
                  className="w-full sm:w-auto bg-amber-50 hover:bg-amber-100 text-[#B45309] border border-amber-200 px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Latest Edition Now</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" id="subscribe-page-form">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Michael)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-4 rounded-xl font-bold text-base shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2"
                id="submit-subscribe-btn"
              >
                <Send className="w-4 h-4" />
                <span>Subscribe Free Forever</span>
              </button>

              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safe & Secure
                </span>
                <span>•</span>
                <span>No Spam Guarantee</span>
              </div>
            </form>
          )}
        </div>

        {/* Welcome Email Interactive Preview */}
        {showWelcomeEmailPreview && subscribedUser && (
          <div className="max-w-2xl mx-auto bg-slate-900 text-white p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
              <span className="text-amber-400 font-bold uppercase tracking-wider">
                Interactive Welcome Email Simulator
              </span>
              <span className="text-slate-400">To: {subscribedUser.Email}</span>
            </div>

            <div className="bg-[#FDFBF7] text-[#1E293B] p-6 rounded-xl border border-slate-200 space-y-4 font-sans text-sm">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-serif text-xl font-bold text-[#1E293B]">
                  Welcome to Word Embassy Newsletter! 🕊️
                </h3>
                <p className="text-xs text-[#B45309] font-medium mt-1">
                  From: Word Embassy Editorial &lt;embassyword@gmail.com&gt;
                </p>
              </div>

              <p>Dear {subscribedUser.Name},</p>
              <p>
                Welcome to Word Embassy! We are blessed to have you in our worldwide family of readers seeking deeper intimacy with God and steady encouragement through His living Word.
              </p>
              <p>
                Every Wednesday morning, you will receive our latest digital publication featuring in-depth scripture exposition, downloadable study infographics, and video devotionals.
              </p>

              <div className="bg-[#FEF3C7] p-4 rounded-lg border border-[#FDE68A] text-xs space-y-1">
                <strong>Your Subscriber Details:</strong>
                <p>Subscriber ID: {subscribedUser.SubscriberID}</p>
                <p>Cohort Group: {subscribedUser.Group || 'Weekly Devotional Readers'}</p>
                <p>Lead Editor: embassyword@gmail.com</p>
                <p>Status: ACTIVE</p>
                <p>Unsubscribe Security Token: {subscribedUser.UnsubscribeToken}</p>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => onNavigate('newsletter', 'the-power-of-persistent-prayer')}
                  className="bg-[#1E293B] text-white px-5 py-2.5 rounded-lg text-xs font-bold"
                >
                  Explore Current Edition
                </button>
              </div>

              <hr className="border-slate-200 my-3" />
              <p className="text-[10px] text-slate-400 text-center">
                Word Embassy Ministries • You received this because you subscribed on our website.<br />
                <button
                  onClick={() => onNavigate('unsubscribe', subscribedUser.UnsubscribeToken)}
                  className="text-slate-500 underline"
                >
                  Unsubscribe
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
