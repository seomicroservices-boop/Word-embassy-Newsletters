import React, { useEffect } from 'react';
import {
  ShieldCheck,
  BookOpen,
  FileText,
  Lock,
  ChevronRight,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { setStandardPageSEO, trackSEOEvent } from '../services/seoManager';

export type PolicyType = 'editorial-policy' | 'statement-of-faith' | 'privacy' | 'terms';

interface TrustPolicyPageProps {
  policyType: PolicyType;
  onNavigate: (view: string, slugOrParam?: string) => void;
}

export const TrustPolicyPage: React.FC<TrustPolicyPageProps> = ({
  policyType,
  onNavigate,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const titles: Record<PolicyType, string> = {
      'editorial-policy': 'Editorial Policy & Biblical Exegesis Standards | Living Word Embassy',
      'statement-of-faith': 'Statement of Faith & Theological Foundations | Living Word Embassy',
      privacy: 'Privacy Policy & Subscriber Protection | Living Word Embassy',
      terms: 'Terms of Use & Ministry Guidelines | Living Word Embassy',
    };
    const descriptions: Record<PolicyType, string> = {
      'editorial-policy':
        'Read the editorial integrity guidelines, biblical hermeneutic standards, and review process of Living Word Embassy.',
      'statement-of-faith':
        'The biblical and theological convictions guiding Living Word Embassy: orthodox, historic Christian faith.',
      privacy:
        'Our commitment to privacy: zero spam, secure email delivery, and complete subscriber control.',
      terms:
        'Terms of use and copyright information for Living Word Embassy digital publications and audio devotionals.',
    };

    setStandardPageSEO(titles[policyType], descriptions[policyType], `/${policyType}`);
    trackSEOEvent('page_view', { page: policyType });
  }, [policyType]);

  return (
    <div className="min-h-screen bg-transparent py-8 sm:py-12" id="trust-policy-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-amber-700 transition-colors">
                Home
              </button>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li className="text-amber-800 font-semibold capitalize">
              {policyType.replace(/-/g, ' ')}
            </li>
          </ol>
        </nav>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <button
            onClick={() => onNavigate('editorial-policy')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              policyType === 'editorial-policy'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Editorial Standards</span>
          </button>
          <button
            onClick={() => onNavigate('statement-of-faith')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              policyType === 'statement-of-faith'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Statement of Faith</span>
          </button>
          <button
            onClick={() => onNavigate('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              policyType === 'privacy'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => onNavigate('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              policyType === 'terms'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Use</span>
          </button>
        </div>

        {/* Policy Content View */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-8">
          {policyType === 'editorial-policy' && (
            <div className="space-y-6">
              <header className="border-b border-slate-100 pb-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>E-E-A-T Standards</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-black text-slate-900">
                  Editorial Policy & Exegetical Integrity
                </h1>
                <p className="text-sm text-slate-500 font-light">
                  Published by the Pastoral & Theological Editorial Council • Updated September 2026
                </p>
              </header>

              <section className="space-y-4 text-slate-700 leading-relaxed font-light text-base">
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  1. Scriptural Inerrancy and Expository Priority
                </h2>
                <p>
                  At <strong>Living Word Embassy</strong>, we believe the Holy Scriptures of the Old and New Testaments to be the inspired, infallible, and authoritative Word of God. Every devotional, weekly exegesis, audio script, and visual infographic begins with meticulous verse examination.
                </p>
                <p>
                  We practice grammatical-historical exegesis: interpreting scripture in its original linguistic (Hebrew, Aramaic, Greek), cultural, and covenantal context before deriving modern pastoral applications.
                </p>
              </section>

              <section className="space-y-4 text-slate-700 leading-relaxed font-light text-base">
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  2. Peer Theological Review Process
                </h2>
                <p>
                  Before publication to our global readership, all newsletter editions undergo a two-tier theological review:
                </p>
                <ul className="space-y-2 text-sm pl-4 list-disc text-slate-700">
                  <li><strong>Textual Integrity Verification:</strong> Checking cross-references across historic manuscripts (Masoretic Text, Septuagint, Textus Receptus, and Nestle-Aland Novum Testamentum Graece).</li>
                  <li><strong>Orthodoxy & Christocentric Alignment:</strong> Ensuring every teaching magnifies the finished work of Jesus Christ and avoids theological speculation or sensationalism.</li>
                  <li><strong>Practical Pastoral Application:</strong> Formulating three actionable, biblically sound key takeaways and a structured pastoral prayer.</li>
                </ul>
              </section>

              <section className="space-y-4 text-slate-700 leading-relaxed font-light text-base">
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  3. Responsible AI Assistance & Human Authorship
                </h2>
                <p>
                  We leverage modern technological tools (including language models and synthesis tools) strictly as an accelerated research and multimedia production aid. Every thesis, doctrinal assertion, and prayer point is drafted, curated, reviewed, and approved by human pastoral leadership prior to distribution.
                </p>
              </section>
            </div>
          )}

          {policyType === 'statement-of-faith' && (
            <div className="space-y-6">
              <header className="border-b border-slate-100 pb-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold uppercase tracking-wide">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Theological Foundations</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-black text-slate-900">
                  Statement of Faith
                </h1>
                <p className="text-sm text-slate-500 font-light">
                  Aligned with historic Christian orthodoxy and the Apostolic Creeds.
                </p>
              </header>

              <div className="space-y-5 text-slate-700 leading-relaxed font-light text-base">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>The Holy Scriptures</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We believe the 66 books of the Old and New Testaments are verbally inspired by the Holy Spirit, inerrant in the original manuscripts, and the supreme and final authority in all matters of faith and conduct (2 Timothy 3:16-17; 2 Peter 1:20-21).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>The Triune God</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We believe in one God, eternally existing in three co-equal persons: Father, Son, and Holy Spirit (Matthew 28:19; 2 Corinthians 13:14).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Jesus Christ the Lord</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We believe in the deity of our Lord Jesus Christ, His virgin birth, His sinless life, His miracles, His vicarious and atoning death through His shed blood, His bodily resurrection, His ascension to the right hand of the Father, and His personal return in power and glory.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Salvation by Grace through Faith</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We believe that salvation is the free gift of God offered to humanity through grace alone and received through personal repentance and faith in Jesus Christ alone (Ephesians 2:8-9; Romans 10:9-10).
                  </p>
                </div>
              </div>
            </div>
          )}

          {policyType === 'privacy' && (
            <div className="space-y-6">
              <header className="border-b border-slate-100 pb-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wide">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Subscriber Protection</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-black text-slate-900">
                  Privacy Policy & Data Security
                </h1>
                <p className="text-sm text-slate-500 font-light">
                  Effective Date: September 2026 • Zero-Commercialization Pledge
                </p>
              </header>

              <section className="space-y-4 text-slate-700 leading-relaxed font-light text-base">
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  1. Zero Commercialization Pledge
                </h2>
                <p>
                  Living Word Embassy operates as a Christian ministry. We never sell, rent, monetize, or disclose your personal contact information, email address, or reading history to third-party advertisers, data brokers, or commercial marketers.
                </p>
              </section>

              <section className="space-y-4 text-slate-700 leading-relaxed font-light text-base">
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  2. Information We Collect
                </h2>
                <p>
                  When subscribing to our daily or weekly email newsletter, we collect only your first name (optional) and email address (mandatory). This data is stored securely in our Google Workspace / Cloud infrastructure and utilized exclusively to deliver requested devotional publications and essential ministry updates.
                </p>
              </section>

              <section className="space-y-4 text-slate-700 leading-relaxed font-light text-base">
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  3. One-Click Instant Unsubscribe
                </h2>
                <p>
                  Every email dispatched by Living Word Embassy contains an immediate, functional unsubscribe link. You may also update your edition preferences (switching between Daily Devotional and Weekly Exegesis) at any time.
                </p>
              </section>
            </div>
          )}

          {policyType === 'terms' && (
            <div className="space-y-6">
              <header className="border-b border-slate-100 pb-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wide">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>Legal Terms</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-black text-slate-900">
                  Terms of Use & Ministry Guidelines
                </h1>
                <p className="text-sm text-slate-500 font-light">
                  Terms governing usage of Living Word Embassy publications and multimedia assets.
                </p>
              </header>

              <section className="space-y-4 text-slate-700 leading-relaxed font-light text-base">
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  1. Educational & Non-Commercial Church Use
                </h2>
                <p>
                  Pastors, Sunday school teachers, small-group leaders, and believers worldwide are warmly encouraged to share, print, and distribute our written devotionals, exegeses, and infographic outlines for non-commercial ministry, Bible study, and personal encouragement, provided proper attribution to Living Word Embassy is maintained.
                </p>
              </section>

              <section className="space-y-4 text-slate-700 leading-relaxed font-light text-base">
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  2. Intellectual Property & Multimedia Content
                </h2>
                <p>
                  Audio narrations, Veo video devotionals, and branding assets remain the copyrighted property of Living Word Embassy Ministries. Commercial resale, monetization without explicit permission, or deceptive re-branding is strictly prohibited.
                </p>
              </section>

              <section className="space-y-4 text-slate-700 leading-relaxed font-light text-base">
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  3. Contact & Pastoral Inquiries
                </h2>
                <p>
                  For theological questions, prayer requests, or permission inquiries, contact our pastoral desk directly at:
                </p>
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3 text-sm text-amber-950 font-medium">
                  <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>embassyword@gmail.com</span>
                </div>
              </section>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
