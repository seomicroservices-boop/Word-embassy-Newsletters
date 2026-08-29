import React, { useState, useEffect } from 'react';
import { MailX, CheckCircle2, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';
import { Subscriber } from '../types';

interface UnsubscribePageProps {
  tokenParam?: string;
  subscribers: Subscriber[];
  onUnsubscribe: (tokenOrEmail: string) => boolean;
  onResubscribe: (email: string) => boolean;
  onNavigate: (view: string, slug?: string) => void;
}

export const UnsubscribePage: React.FC<UnsubscribePageProps> = ({
  tokenParam,
  subscribers,
  onUnsubscribe,
  onResubscribe,
  onNavigate,
}) => {
  const [tokenInput, setTokenInput] = useState(tokenParam || '');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  useEffect(() => {
    if (tokenParam) {
      setTokenInput(tokenParam);
      handleUnsubscribe(tokenParam);
    }
  }, [tokenParam]);

  const handleUnsubscribe = (tokenOrEmail: string) => {
    if (!tokenOrEmail) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid unsubscribe token or email address.' });
      return;
    }

    const success = onUnsubscribe(tokenOrEmail);
    if (success) {
      setIsUnsubscribed(true);
      setStatusMessage({
        type: 'success',
        text: 'You have been successfully removed from our weekly mailing list. We are grateful for the time you spent with us.',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: 'No active subscription was found matching that token or email.',
      });
    }
  };

  const handleResubscribe = () => {
    if (!tokenInput) return;
    const success = onResubscribe(tokenInput);
    if (success) {
      setIsUnsubscribed(false);
      setStatusMessage({
        type: 'success',
        text: 'Welcome back! Your subscription status has been reactivated.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-16 flex items-center justify-center">
      <div className="max-w-lg w-full mx-4 bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-md space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center mx-auto border border-amber-200">
          <MailX className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1E293B]">
            Manage Your Subscription
          </h1>
          <p className="text-sm text-slate-600 font-light">
            We honor your inbox and privacy. You can unsubscribe or modify your preferences at any time.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold text-left flex items-start gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {!isUnsubscribed ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUnsubscribe(tokenInput);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-left">
                Unsubscribe Token or Email Address
              </label>
              <input
                type="text"
                required
                placeholder="tok_... or your email"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                id="unsubscribe-input"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors"
              id="confirm-unsubscribe-btn"
            >
              Confirm Unsubscribe
            </button>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <button
              onClick={handleResubscribe}
              className="w-full bg-[#B45309] hover:bg-[#92400E] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              id="resubscribe-btn"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Resubscribe to Word Embassy</span>
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-[#B45309]">
            Return Home
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('archive')} className="hover:text-[#B45309]">
            Browse Web Archive
          </button>
        </div>
      </div>
    </div>
  );
};
