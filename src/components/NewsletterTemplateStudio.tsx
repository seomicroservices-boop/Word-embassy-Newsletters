import React, { useState } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  Layers,
  Copy,
  Check,
  Eye,
  RefreshCw,
  CheckCircle2,
  Code,
  Users,
  Calendar,
  BookOpen,
  FileText,
  Smartphone,
  Monitor,
  ExternalLink,
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Newsletter, Subscriber, SubscriberGroup, AppSettings } from '../types';

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'Devotional' | 'Weekly Digest' | 'Prayer & Intercession' | 'Scripture Focus' | 'Announcement';
  accentColor: string;
  description: string;
  headerTagline: string;
  renderHtml: (nl: Newsletter, recipientEmail: string, unsubscribeToken?: string) => string;
}

export const NEWSLETTER_TEMPLATES: EmailTemplate[] = [
  {
    id: 'cathedral-gold',
    name: 'Cathedral Gold Devotional (Classic)',
    category: 'Devotional',
    accentColor: '#D97706',
    description: 'Refined editorial styling with gold borders, pastoral reflections, and balanced scripture blockquote.',
    headerTagline: 'Word Embassy Pastoral Devotional',
    renderHtml: (nl, recipientEmail, token = 'tok_default') => {
      return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: Georgia, 'Times New Roman', serif;">
  <div style="max-width: 620px; margin: 24px auto; background-color: #fdfbf7; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background-color: #0f172a; padding: 28px 24px; text-align: center; border-bottom: 3px solid #d97706;">
      <span style="font-size: 10px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 2.5px; color: #f59e0b; font-weight: bold; display: block; margin-bottom: 6px;">WORD EMBASSY DIGITAL MINISTRIES</span>
      <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; line-height: 1.3;">${nl.Title}</h1>
      <p style="color: #cbd5e1; font-style: italic; margin: 8px 0 0 0; font-size: 14px;">${nl.ScriptureReference}</p>
    </div>

    <!-- Main Content Body -->
    <div style="padding: 32px 28px; color: #1e293b; font-size: 15px; line-height: 1.75;">
      <!-- Scripture Highlight -->
      <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 16px 20px; margin-bottom: 24px; border-radius: 0 8px 8px 0; font-style: italic; color: #78350f; font-size: 15px;">
        “${nl.ScriptureText}”
        <div style="text-align: right; font-weight: bold; font-style: normal; font-size: 12px; margin-top: 6px; color: #b45309;">— ${nl.ScriptureReference}</div>
      </div>

      <p style="margin-top: 0;"><strong>Dear Ambassador in Christ,</strong></p>
      <p>${nl.Opening || nl.Teaching?.substring(0, 180)}</p>

      <!-- Key Insights -->
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
          ✦ Three Pillars of Truth
        </h3>
        <div style="margin-bottom: 12px;">
          <strong style="color: #b45309;">1. ${nl.KeyPoint1Title}:</strong> ${nl.KeyPoint1Body}
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: #b45309;">2. ${nl.KeyPoint2Title}:</strong> ${nl.KeyPoint2Body}
        </div>
        <div>
          <strong style="color: #b45309;">3. ${nl.KeyPoint3Title}:</strong> ${nl.KeyPoint3Body}
        </div>
      </div>

      <!-- Prayer Section -->
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 8px 0; color: #166534; font-size: 14px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px;">Pastoral Prayer for You</h4>
        <p style="margin: 0; font-style: italic; color: #14532d; font-size: 14px; line-height: 1.6;">${nl.Prayer}</p>
      </div>

      <!-- YouTube / Media CTA -->
      <div style="text-align: center; margin: 30px 0 16px 0;">
        <a href="https://wordembassy.org" target="_blank" style="background-color: #0f172a; color: #f59e0b; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-family: sans-serif; font-size: 13px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          Read Full Exegesis on Word Embassy →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f172a; padding: 20px 24px; text-align: center; color: #94a3b8; font-size: 12px; font-family: sans-serif; border-top: 1px solid #1e293b;">
      <p style="margin: 0 0 6px 0;">Dispatched with prayer from <strong>Word Embassy Ministries</strong></p>
      <p style="margin: 0; font-size: 11px; color: #64748b;">Delivered to: <strong>${recipientEmail}</strong> • <a href="mailto:embassyword@gmail.com" style="color: #f59e0b; text-decoration: none;">embassyword@gmail.com</a></p>
    </div>
  </div>
</body>
</html>`;
    },
  },
  {
    id: 'modern-slate',
    name: 'Modern Grace & Truth (Clean Minimalist)',
    category: 'Weekly Digest',
    accentColor: '#3B82F6',
    description: 'Clean modern sans-serif aesthetic with spacious typographic hierarchy, high contrast, and scripture badges.',
    headerTagline: 'Weekly Word Embassy Digest',
    renderHtml: (nl, recipientEmail) => {
      return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 24px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    <div style="padding: 32px 28px 24px 28px; border-bottom: 1px solid #f1f5f9;">
      <span style="background-color: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px;">
        ${nl.ScriptureReference}
      </span>
      <h1 style="color: #0f172a; font-size: 26px; font-weight: 800; margin: 16px 0 8px 0; line-height: 1.25;">${nl.Title}</h1>
      <p style="color: #64748b; font-size: 14px; margin: 0;">Word Embassy Weekly Reflection</p>
    </div>

    <div style="padding: 28px; color: #334155; font-size: 15px; line-height: 1.7;">
      <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; font-size: 15px; color: #1e293b; margin-bottom: 24px;">
        “${nl.ScriptureText}”
      </div>

      <p>${nl.Teaching}</p>

      <div style="margin: 28px 0; padding: 20px; background-color: #f1f5f9; border-radius: 12px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #475569;">Key Takeaway</h4>
        <p style="margin: 0; font-weight: 600; color: #0f172a;">${nl.KeyPoint1Title}: ${nl.KeyPoint1Body}</p>
      </div>

      <div style="padding: 20px; background-color: #fefce8; border: 1px solid #fef08a; border-radius: 12px; margin-bottom: 24px;">
        <strong style="color: #854d0e; display: block; margin-bottom: 6px;">Prayer of Agreement:</strong>
        <p style="margin: 0; color: #713f12; font-style: italic;">${nl.Prayer}</p>
      </div>
    </div>

    <div style="background-color: #f8fafc; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
      <p style="margin: 0 0 4px 0;">Delivered to <strong>${recipientEmail}</strong> from Word Embassy Editorial.</p>
      <p style="margin: 0;"><a href="mailto:embassyword@gmail.com" style="color: #3b82f6; text-decoration: none;">embassyword@gmail.com</a></p>
    </div>
  </div>
</body>
</html>`;
    },
  },
  {
    id: 'intercession-emerald',
    name: 'Intercession & Prayer Focus (Emerald)',
    category: 'Prayer & Intercession',
    accentColor: '#10B981',
    description: 'Designed specifically for prayer circles, intercessors, and pastoral benedictions with prominent prayer cards.',
    headerTagline: 'Word Embassy Prayer & Intercession Network',
    renderHtml: (nl, recipientEmail) => {
      return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #064e3b; font-family: Georgia, serif;">
  <div style="max-width: 600px; margin: 24px auto; background-color: #f0fdf4; border: 2px solid #34d399; border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #065f46, #047857); padding: 32px 24px; text-align: center; color: white;">
      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #6ee7b7; font-family: sans-serif; font-weight: bold;">PRAYER CIRCLE & INTERCESSION</span>
      <h1 style="font-size: 24px; margin: 10px 0 4px 0;">${nl.Title}</h1>
      <p style="font-size: 14px; margin: 0; color: #a7f3d0;">${nl.ScriptureReference}</p>
    </div>

    <div style="padding: 28px; color: #064e3b; font-size: 15px; line-height: 1.7;">
      <div style="background-color: #ffffff; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; font-style: italic; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
        “${nl.ScriptureText}”
      </div>

      <div style="background-color: #ffffff; border: 1px solid #d1fae5; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; box-shadow: 0 4px 12px rgba(6, 78, 59, 0.06);">
        <h3 style="margin: 0 0 12px 0; color: #047857; font-family: sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px;">Prayer of Covenant Blessing</h3>
        <p style="margin: 0; font-size: 16px; line-height: 1.7; font-style: italic; color: #064e3b;">
          “${nl.Prayer}”
        </p>
      </div>

      <p><strong>Devotional Exegesis:</strong></p>
      <p style="color: #166534;">${nl.Teaching}</p>
    </div>

    <div style="background-color: #065f46; padding: 16px; text-align: center; color: #a7f3d0; font-size: 12px; font-family: sans-serif;">
      Word Embassy Intercession Circle • Sent to ${recipientEmail}
    </div>
  </div>
</body>
</html>`;
    },
  },
];

interface NewsletterTemplateStudioProps {
  newsletters: Newsletter[];
  subscribers: Subscriber[];
  subscriberGroups?: SubscriberGroup[];
  settings?: AppSettings;
  onSendEmailCampaign: (newsletterId: string, batchSize?: number, groupName?: string) => void;
  onSendTestEmail: (newsletterId: string, recipientEmail: string) => void;
}

export const NewsletterTemplateStudio: React.FC<NewsletterTemplateStudioProps> = ({
  newsletters,
  subscribers,
  subscriberGroups = [],
  settings,
  onSendEmailCampaign,
  onSendTestEmail,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(NEWSLETTER_TEMPLATES[0].id);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string>(
    newsletters[0]?.NewsletterID || 'NL-2026-001'
  );
  const [selectedTargetGroup, setSelectedTargetGroup] = useState<string>('ALL');
  const [testRecipient, setTestRecipient] = useState<string>('omicroservices@gmail.com');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHtmlReceipt, setCopiedHtmlReceipt] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSendingCohort, setIsSendingCohort] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [testReceipt, setTestReceipt] = useState<{
    recipient: string;
    newsletterTitle: string;
    timestamp: string;
    messageId: string;
  } | null>(null);
  const [cohortReceipt, setCohortReceipt] = useState<{
    groupName: string;
    count: number;
    newsletterTitle: string;
    timestamp: string;
  } | null>(null);

  const activeNewsletter =
    newsletters.find((n) => n.NewsletterID === selectedNewsletterId) || newsletters[0];
  const activeTemplate =
    NEWSLETTER_TEMPLATES.find((t) => t.id === selectedTemplateId) || NEWSLETTER_TEMPLATES[0];

  const renderedHtml = activeNewsletter
    ? activeTemplate.renderHtml(activeNewsletter, testRecipient)
    : '';

  const emailSubject = `🕊️ [Word Embassy] ${activeNewsletter?.Title || 'Devotional'} — ${activeNewsletter?.ScriptureReference || ''}`;

  const plainTextEmail = `WORD EMBASSY DEVOTIONAL
${activeNewsletter?.Title}
Scripture: ${activeNewsletter?.ScriptureReference}

"${activeNewsletter?.ScriptureText}"

${activeNewsletter?.Opening}

${activeNewsletter?.Teaching}

Key Truths:
1. ${activeNewsletter?.KeyPoint1Title}
${activeNewsletter?.KeyPoint1Body}

2. ${activeNewsletter?.KeyPoint2Title}
${activeNewsletter?.KeyPoint2Body}

3. ${activeNewsletter?.KeyPoint3Title}
${activeNewsletter?.KeyPoint3Body}

Practical Application:
${activeNewsletter?.PracticalApplication}

Pastoral Prayer:
${activeNewsletter?.Prayer}

${activeNewsletter?.Closing}

Word Embassy Editorial
https://www.wordembassy.org | embassyword@gmail.com`;

  const gmailWebComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    testRecipient
  )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(plainTextEmail)}`;

  // Generate ready-to-run Google Apps Script Code
  const generatedGasCode = `function sendWordEmbassyDevotional() {
  var recipientEmail = "${testRecipient}";
  var subject = "🕊️ [Word Embassy] ${activeNewsletter?.Title?.replace(/"/g, '\\"')} — ${activeNewsletter?.ScriptureReference}";
  
  var htmlBody = ${JSON.stringify(renderedHtml)};

  GmailApp.sendEmail(recipientEmail, subject, "Please view in an HTML email client.", {
    htmlBody: htmlBody,
    name: "Word Embassy Editorial",
    replyTo: "embassyword@gmail.com"
  });

  Logger.log("✅ Email successfully sent to " + recipientEmail);
}`;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyGas = () => {
    navigator.clipboard.writeText(generatedGasCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDispatchTest = async () => {
    if (!testRecipient || !testRecipient.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSendingTest(true);
    try {
      await onSendTestEmail(selectedNewsletterId, testRecipient);
      
      const receipt = {
        recipient: testRecipient,
        newsletterTitle: activeNewsletter?.Title || 'Weekly Devotional',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        messageId: `msg_${Date.now().toString().slice(-6)}`,
      };
      setTestReceipt(receipt);
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleConfirmCohortBroadcast = async () => {
    setShowBroadcastModal(false);
    setIsSendingCohort(true);

    const groupLabel = selectedTargetGroup === 'ALL' ? 'All Subscribers' : selectedTargetGroup;
    const recipientCount =
      selectedTargetGroup === 'ALL'
        ? subscribers.filter((s) => s.Status === 'ACTIVE').length
        : subscribers.filter((s) => s.Group === selectedTargetGroup && s.Status === 'ACTIVE').length;

    try {
      await onSendEmailCampaign(selectedNewsletterId, settings?.EmailBatchSize || 25, selectedTargetGroup);
      setCohortReceipt({
        groupName: groupLabel,
        count: recipientCount,
        newsletterTitle: activeNewsletter?.Title || 'Devotional',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    } finally {
      setIsSendingCohort(false);
    }
  };

  const activeAudienceCount =
    selectedTargetGroup === 'ALL'
      ? subscribers.filter((s) => s.Status === 'ACTIVE').length
      : subscribers.filter((s) => s.Group === selectedTargetGroup && s.Status === 'ACTIVE').length;

  return (
    <div className="space-y-6" id="newsletter-template-studio">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Newsletter Template & Broadcast Engine</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Devotional Email Template Studio
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Choose from curated editorial email templates, inspect responsive rendering, copy production Apps Script dispatch code, or broadcast directly to subscriber cohorts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyGas}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            id="copy-template-apps-script-btn"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied Apps Script!' : 'Copy Apps Script for Gmail'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Template Selector & Controls on Left, Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Options & Campaign Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Template Choice Cards */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Email Template Design
            </label>
            <div className="space-y-2.5">
              {NEWSLETTER_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                    id={`select-template-${tmpl.id}-btn`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: tmpl.accentColor }}
                        />
                        <span className="text-xs font-bold text-white">{tmpl.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{tmpl.description}</p>
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {tmpl.category}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Target Newsletter & Cohort */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Content & Recipient Targeting
            </label>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Newsletter Content:</label>
                <select
                  value={selectedNewsletterId}
                  onChange={(e) => setSelectedNewsletterId(e.target.value)}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-medium focus:border-amber-500"
                  id="template-newsletter-select"
                >
                  {newsletters.map((nl) => (
                    <option key={nl.NewsletterID} value={nl.NewsletterID}>
                      {nl.Title} ({nl.ScriptureReference})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Subscriber Cohort:</label>
                <select
                  value={selectedTargetGroup}
                  onChange={(e) => setSelectedTargetGroup(e.target.value)}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-medium focus:border-amber-500"
                  id="template-group-select"
                >
                  <option value="ALL">All Active Subscribers ({subscribers.filter((s) => s.Status === 'ACTIVE').length})</option>
                  {subscriberGroups.map((g) => {
                    const count = subscribers.filter(
                      (s) => s.Group === g.Name && s.Status === 'ACTIVE'
                    ).length;
                    return (
                      <option key={g.GroupID} value={g.Name}>
                        {g.Name} ({count} active)
                      </option>
                    );
                  })}
                </select>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  Active Recipients: <strong>{activeAudienceCount} subscribers</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Send Controls */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                3. Dispatch Actions
              </label>
              <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono">
                From: embassyword@gmail.com
              </span>
            </div>

            {/* Test Email Dispatch */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-400 font-semibold">
                  Send Test Email to Specific Inbox:
                </label>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                  <span>Quick pick:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) setTestRecipient(e.target.value);
                    }}
                    value={testRecipient}
                    className="bg-slate-950 text-amber-300 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono focus:outline-none"
                  >
                    <option value="omicroservices@gmail.com">omicroservices@gmail.com</option>
                    <option value="seomicroservices@gmail.com">seomicroservices@gmail.com</option>
                    <option value="postellsrmichael@yahoo.com">postellsrmichael@yahoo.com</option>
                    <option value="www.chippewa51@gmail.com">www.chippewa51@gmail.com</option>
                    <option value="paulineh_omo@yahoo.com">paulineh_omo@yahoo.com</option>
                    <option value="cathrynehobbs@sbcglobal.net">cathrynehobbs@sbcglobal.net</option>
                    <option value="embassyword@gmail.com">embassyword@gmail.com</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="omicroservices@gmail.com"
                  className="flex-1 bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs focus:border-amber-500 font-mono"
                  id="template-test-email-input"
                />
                <button
                  onClick={handleDispatchTest}
                  disabled={isSendingTest}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shrink-0 transition-all active:scale-95 flex items-center gap-1.5 shadow-md cursor-pointer"
                  id="send-template-test-btn"
                >
                  {isSendingTest ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test</span>
                    </>
                  )}
                </button>
              </div>

              {/* Test Email Dispatch Success Card */}
              {testReceipt && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 space-y-2.5 animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-emerald-500/20 text-emerald-300 rounded-md">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Test Email Dispatched</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-normal">
                            ({testReceipt.timestamp})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Sent to: <span className="font-mono text-amber-300 font-bold">{testReceipt.recipient}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTestReceipt(null)}
                      className="text-slate-400 hover:text-white text-xs"
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-900/50">
                    <a
                      href={gmailWebComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                      id="launch-gmail-draft-btn"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Gmail Draft</span>
                    </a>

                    <button
                      onClick={() => {
                        handleCopyHtml();
                        setCopiedHtmlReceipt(true);
                        setTimeout(() => setCopiedHtmlReceipt(false), 2000);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedHtmlReceipt ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied HTML!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy HTML</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Broadcast */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <button
                onClick={() => setShowBroadcastModal(true)}
                disabled={isSendingCohort}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                id="send-template-campaign-broadcast-btn"
              >
                {isSendingCohort ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to {selectedTargetGroup === 'ALL' ? 'All Subscribers' : selectedTargetGroup}...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Send Out to {selectedTargetGroup === 'ALL' ? 'All Subscribers' : selectedTargetGroup} ({activeAudienceCount})</span>
                  </>
                )}
              </button>

              {/* Cohort Broadcast Success Card */}
              {cohortReceipt && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 space-y-1.5 animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div className="text-xs font-bold text-white">
                        Campaign Dispatched to {cohortReceipt.count} Readers ({cohortReceipt.groupName})
                      </div>
                    </div>
                    <button
                      onClick={() => setCohortReceipt(null)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Logged to System Audit Trail & Email History logs at {cohortReceipt.timestamp}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BROADCAST CONFIRMATION MODAL */}
        {showBroadcastModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                    <Users className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Confirm Campaign Broadcast</h3>
                    <p className="text-xs text-slate-400">Review dispatch parameters before sending</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Newsletter:</span>
                  <span className="text-white font-bold max-w-[200px] truncate">{activeNewsletter?.Title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email Template:</span>
                  <span className="text-amber-300 font-medium">{activeTemplate.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Cohort:</span>
                  <span className="text-indigo-300 font-bold">{selectedTargetGroup === 'ALL' ? 'All Active Subscribers' : selectedTargetGroup}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400">Active Recipients:</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">{activeAudienceCount} subscribers</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCohortBroadcast}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm & Broadcast Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Live Responsive Preview & Code Exporter */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Live Template Preview: {activeTemplate.name}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Target: <span className="text-white font-semibold">{activeNewsletter?.Title}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setPreviewViewport('desktop')}
                    className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
                      previewViewport === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewViewport('mobile')}
                    className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
                      previewViewport === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                    title="Mobile View (400px)"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleCopyHtml}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
                  title="Copy Raw HTML"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCode ? 'Copied' : 'HTML'}</span>
                </button>
              </div>
            </div>

            {/* Email Render Frame */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center overflow-x-auto min-h-[460px]">
              <iframe
                title="Email Template Preview"
                srcDoc={renderedHtml}
                className={`rounded-lg border border-slate-700 bg-white transition-all ${
                  previewViewport === 'mobile' ? 'w-[380px] h-[540px]' : 'w-full max-w-[620px] h-[540px]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
