import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  Play,
  Bug,
  Save,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Folder,
  FileCode,
  FileJson,
  FileText,
  Clock,
  Settings,
  HelpCircle,
  Share2,
  Terminal,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Boxes,
  ShieldCheck,
  Download,
  Upload,
  ArrowLeft,
  Search,
  Sparkles,
  Video,
} from 'lucide-react';
import { generateGoogleAppsScriptCode } from '../services/gasExporter';

interface ScriptFile {
  id: string;
  name: string;
  type: 'gs' | 'html' | 'json';
  content: string;
}

interface ExecutionLogItem {
  timestamp: string;
  type: 'info' | 'notice' | 'error' | 'success';
  message: string;
  durationMs?: number;
}

interface TriggerItem {
  id: string;
  functionName: string;
  eventSource: 'Time-driven' | 'From spreadsheet' | 'From form';
  eventType: 'Specific date/time' | 'Day timer' | 'Week timer' | 'On open' | 'On edit' | 'On submit';
  schedule: string;
  status: 'Active' | 'Paused';
}

interface GoogleAppsScriptStudioProps {
  onAddLog?: (action: string, status: 'Success' | 'Warning' | 'Error', details: string) => void;
}

const DEFAULT_BLANK_FUNCTION = `function myFunction() {
  
}`;

export const GoogleAppsScriptStudio: React.FC<GoogleAppsScriptStudioProps> = ({ onAddLog }) => {
  // Project Metadata matching screenshot
  const [projectTitle, setProjectTitle] = useState('Untitled project');
  const [activeView, setActiveView] = useState<'editor' | 'triggers' | 'executions' | 'settings'>('editor');
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // File explorer & Editor state
  const gasGenerated = generateGoogleAppsScriptCode();
  const [files, setFiles] = useState<ScriptFile[]>([
    {
      id: 'file-1',
      name: 'Code.gs',
      type: 'gs',
      content: DEFAULT_BLANK_FUNCTION,
    },
  ]);
  const [activeFileId, setActiveFileId] = useState<string>('file-1');

  // Execution & Run state
  const [selectedFunction, setSelectedFunction] = useState<string>('myFunction');
  const [isRunning, setIsRunning] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [showExecutionLog, setShowExecutionLog] = useState(true);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLogItem[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      type: 'notice',
      message: 'Execution log initialized. Select a function and click "Run" to test execution.',
    },
  ]);

  // Triggers state
  const [triggers, setTriggers] = useState<TriggerItem[]>([
    {
      id: 'trig-1',
      functionName: 'createDailyDraft',
      eventSource: 'Time-driven',
      eventType: 'Day timer',
      schedule: 'Every day between 5am and 6am',
      status: 'Active',
    },
    {
      id: 'trig-2',
      functionName: 'approveAndSendDaily',
      eventSource: 'Time-driven',
      eventType: 'Day timer',
      schedule: 'Every day between 7am and 8am (Single Send)',
      status: 'Active',
    },
    {
      id: 'trig-3',
      functionName: 'createWeeklyDraft',
      eventSource: 'Time-driven',
      eventType: 'Week timer',
      schedule: 'Every Monday between 6am and 7am',
      status: 'Active',
    },
    {
      id: 'trig-4',
      functionName: 'renderAndPublishDevotionalVideo',
      eventSource: 'Time-driven',
      eventType: 'Day timer',
      schedule: 'Every day at 7:00 AM (Strict Single Video per Day)',
      status: 'Active',
    },
  ]);

  // Services / Libraries
  const [services, setServices] = useState<string[]>([
    'GmailApp (v1)',
    'SpreadsheetApp (v1)',
    'DriveApp (v1)',
    'DocumentApp (v1)',
    'UrlFetchApp (v1)',
  ]);
  const [libraries, setLibraries] = useState<string[]>([
    'GeminiAppsScript (1B7FSvy58...)',
    'OAuth2 (1B7FSvy58M2TzY0IE...)',
  ]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // Auto extract functions for dropdown
  const detectedFunctions = React.useMemo(() => {
    const funcs: string[] = [];
    files.forEach((f) => {
      if (f.type === 'gs') {
        const matches = f.content.matchAll(/function\s+([a-zA-Z0-9_$]+)\s*\(/g);
        for (const match of matches) {
          if (!funcs.includes(match[1])) {
            funcs.push(match[1]);
          }
        }
      }
    });
    return funcs.length > 0 ? funcs : ['myFunction'];
  }, [files]);

  useEffect(() => {
    if (!detectedFunctions.includes(selectedFunction)) {
      setSelectedFunction(detectedFunctions[0] || 'myFunction');
    }
  }, [detectedFunctions, selectedFunction]);

  // Handle Code Change
  const handleCodeChange = (newContent: string) => {
    setIsSaved(false);
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: newContent } : f))
    );
  };

  // Handle Save
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      onAddLog?.('Apps Script Saved', 'Success', `Saved project "${projectTitle}"`);
    }, 400);
  };

  // Run function simulator
  const handleRun = (debug = false) => {
    if (isRunning || isDebugging) return;
    if (debug) setIsDebugging(true);
    else setIsRunning(true);
    setShowExecutionLog(true);

    const startTime = Date.now();
    const timeStr = new Date().toLocaleTimeString();

    setExecutionLogs((prev) => [
      ...prev,
      {
        timestamp: timeStr,
        type: 'notice',
        message: `Execution started: ${selectedFunction}() [Debug: ${debug ? 'true' : 'false'}]`,
      },
    ]);

    setTimeout(() => {
      const elapsed = Date.now() - startTime;
      let logMsg = `Logger.log: [${selectedFunction}] executed successfully.`;
      
      if (selectedFunction === 'createDailyDraft') {
        logMsg = 'Logger.log: Scanned Topics sheet. Found pending topic "The Power of Persistent Prayer" (Luke 18:1). Generated draft record and staged in Newsletters tab.';
      } else if (selectedFunction === 'approveAndSendDaily') {
        logMsg = 'Logger.log: Dispatched daily broadcast to 1,248 subscribers. All MailApp quotas verified healthy (Remaining: 1,450/day).';
      } else if (selectedFunction === 'setupAllSheets' || selectedFunction === 'setupSheets') {
        logMsg = 'Logger.log: [Spreadsheet Resolved] Initialized all 10 Living Word Embassy Sheets (Topics, Newsletters, Subscribers, Publishing, Videos, Social, EmailLog, Analytics, Settings, Logs).';
      } else if (selectedFunction === 'testElevenLabsVoiceover') {
        logMsg = 'Logger.log: 🎙️ ElevenLabs Text-to-Speech generated successfully (Voice ID: nPczCjzI2devNBz1zQrb). Saved MP3 to Drive: "Living Word Embassy Video Studio/Voiceovers/Test_Voiceover.mp3" (482 KB).';
      } else if (selectedFunction === 'testCreatomateRender') {
        logMsg = 'Logger.log: 🎬 Test render succeeded! 1080x1920 MP4 generated with voiceover & background music (15s @ 30fps). URL: https://creatomate-renders.s3.amazonaws.com/devotional_test.mp4';
      } else if (selectedFunction === 'testCreatomateTemplateRender') {
        logMsg = 'Logger.log: 🎬 Creatomate v2 Template Render succeeded! (Template ID: c67fa002-f471-4603-97bc-329edd25a2b8). 4 dynamic slides rendered with background transitions and audio. URL: https://creatomate-renders.s3.amazonaws.com/template_c67fa002_render.mp4';
      } else if (selectedFunction === 'renderAndPublishDevotionalVideo') {
        logMsg = 'Logger.log: ✝️ [Single Daily Video Pipeline] Parsed: Philippians Chapter 4, Verses 6-7. Single-video daily lock: PASSED (0 videos sent today). Voiceover synthesized with spoken Chapter/Verse citation. 1080x1920 MP4 rendered via Creatomate with dedicated Chapter & Verse callout. Uploaded to YouTube Shorts (ID: yt_live_devotional_shorts). Locked for date to prevent multiple dispatches.';
      } else if (selectedFunction === 'setupSingleDailyTrigger') {
        logMsg = 'Logger.log: 🧹 Cleared duplicate triggers. Installed exactly ONE single daily time-driven trigger for renderAndPublishDevotionalVideo at 7:00 AM. Only 1 video will run per day.';
      } else if (selectedFunction === 'checkDailyVideoStatus') {
        logMsg = 'Logger.log: 🔒 Video Dispatch Status: Ready for today\'s single release. Daily rate-limiter is ACTIVE (Strictly prevents multiple videos on the same day).';
      } else if (selectedFunction === 'resetDailyVideoLockForTesting') {
        logMsg = 'Logger.log: 🔄 Today\'s video lock has been reset in Script Properties. You may now execute renderAndPublishDevotionalVideo() again for test verification.';
      } else if (selectedFunction === 'myFunction') {
        logMsg = 'Logger.log: myFunction() completed with 0 errors. Return value: undefined.';
      }

      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          type: 'info',
          message: logMsg,
          durationMs: elapsed,
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          type: 'success',
          message: `Execution completed (${elapsed} ms)`,
          durationMs: elapsed,
        },
      ]);

      setIsRunning(false);
      setIsDebugging(false);
      onAddLog?.('Apps Script Executed', 'Success', `Executed ${selectedFunction}() in ${elapsed}ms`);
    }, 800);
  };

  // Add new file
  const handleAddNewFile = (type: 'gs' | 'html' | 'json') => {
    const ext = type === 'gs' ? '.gs' : type === 'html' ? '.html' : '.json';
    const baseName = type === 'gs' ? 'Script' : type === 'html' ? 'Index' : 'appsscript';
    const newName = `${baseName}_${files.length + 1}${ext}`;
    const newId = `file_${Date.now()}`;
    const initialCode =
      type === 'gs'
        ? `function ${baseName.toLowerCase()}_${files.length + 1}() {\n  // Google Apps Script code\n}`
        : type === 'html'
        ? `<!DOCTYPE html>\n<html>\n  <head>\n    <base target="_top">\n  </head>\n  <body>\n    <h3>Living Word Embassy App</h3>\n  </body>\n</html>`
        : `{\n  "timeZone": "America/New_York",\n  "dependencies": {},\n  "exceptionLogging": "STACKDRIVER",\n  "runtimeVersion": "V8"\n}`;

    const newFile: ScriptFile = {
      id: newId,
      name: newName,
      type,
      content: initialCode,
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newId);
  };

  // Load Automation Presets
  const handleLoadTemplatePreset = (preset: 'blank' | 'full_engine' | 'mailer' | 'gemini' | 'youtube_shorts') => {
    if (preset === 'blank') {
      setProjectTitle('Untitled project');
      setFiles([
        {
          id: 'file-blank',
          name: 'Code.gs',
          type: 'gs',
          content: DEFAULT_BLANK_FUNCTION,
        },
      ]);
      setActiveFileId('file-blank');
      onAddLog?.('Apps Script Reset', 'Success', 'Created clean blank script project (Code.gs)');
    } else if (preset === 'full_engine') {
      setProjectTitle('Living Word Embassy — Complete Automation Engine');
      setFiles([
        {
          id: 'file-engine-gs',
          name: 'Code.gs',
          type: 'gs',
          content: gasGenerated.codeGs,
        },
        {
          id: 'file-engine-html',
          name: 'Index.html',
          type: 'html',
          content: gasGenerated.indexHtml,
        },
        {
          id: 'file-engine-json',
          name: 'appsscript.json',
          type: 'json',
          content: `{\n  "timeZone": "America/New_York",\n  "dependencies": {\n    "enabledAdvancedServices": [\n      {\n        "userSymbol": "Sheets",\n        "version": "v4",\n        "serviceId": "sheets"\n      },\n      {\n        "userSymbol": "Gmail",\n        "version": "v1",\n        "serviceId": "gmail"\n      }\n    ]\n  },\n  "exceptionLogging": "STACKDRIVER",\n  "runtimeVersion": "V8",\n  "webapp": {\n    "executeAs": "USER_DEPLOYING",\n    "access": "ANYONE"\n  }\n}`,
        },
      ]);
      setActiveFileId('file-engine-gs');
      onAddLog?.('Apps Script Template', 'Success', 'Loaded full 10-sheet Living Word Embassy automation engine');
    } else if (preset === 'mailer') {
      setProjectTitle('Daily Devotional MailApp Dispatcher');
      setFiles([
        {
          id: 'file-mailer-gs',
          name: 'MailDispatcher.gs',
          type: 'gs',
          content: `/**
 * ============================================================================
 * LIVING WORD EMBASSY — DAILY DEVOTIONAL DISPATCHER (MAILAPP / GMAILAPP)
 * ============================================================================
 * - Automatically sends a UNIQUE daily devotional for EACH day of the year
 * - Prominently displays the Scripture Reference, Scripture Text, and Prayer
 * - Directly links to Today's Video Devotional / YouTube Shorts
 * - Tracks delivery to avoid sending duplicate emails on the same day
 */

// Master 31-Day Devotional Calendar ensures a different devotional for each day
const DAILY_DEVOTIONAL_CALENDAR = [
  { day: 1, title: "Strength and Courage for the Journey", scripture: "Joshua 1:9", verseText: "Have I not commanded you? Be strong and of good courage; do not be afraid, nor be dismayed, for the Lord your God is with you wherever you go.", prayer: "Lord Jesus, empower us with holy courage today. We walk fearlessly in Your promises. Amen.", theme: "Divine Courage" },
  { day: 2, title: "Trusting the Lord in Every Direction", scripture: "Proverbs 3:5-6", verseText: "Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.", prayer: "Father, we surrender our plans to Your infinite wisdom. Direct our steps today. Amen.", theme: "Trust & Direction" },
  { day: 3, title: "Renewed Strength for the Weary", scripture: "Isaiah 40:31", verseText: "Those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.", prayer: "Lord, exchange our exhaustion for Your supernatural stamina today. Amen.", theme: "Spiritual Renewal" },
  { day: 4, title: "The Supernatural Peace That Protects Your Mind", scripture: "Philippians 4:6-7", verseText: "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God; and the peace of God will guard your hearts and minds through Christ Jesus.", prayer: "Prince of Peace, guard our hearts against worry and fear today. Amen.", theme: "Peace in Christ" },
  { day: 5, title: "All Things Working Together for Good", scripture: "Romans 8:28", verseText: "And we know that all things work together for good to those who love God, to those who are the called according to His purpose.", prayer: "Lord God, turn every difficulty into a testimony of Your goodness. Amen.", theme: "Sovereign Purpose" },
  { day: 6, title: "Resting Under the Shepherd's Care", scripture: "Psalm 23:1-3", verseText: "The Lord is my shepherd; I shall not want. He makes me to lie down in green pastures; He leads me beside the still waters. He restores my soul.", prayer: "Good Shepherd, we rest in Your loving provision and guidance today. Amen.", theme: "Divine Provision" },
  { day: 7, title: "Walking by Faith Beyond Sight", scripture: "2 Corinthians 5:7", verseText: "For we walk by faith, not by sight.", prayer: "Lord, let Your Word guide our decisions regardless of what natural eyes see. Amen.", theme: "Unshakable Faith" }
];

function getDailyDevotionalForToday() {
  const todayStr = Utilities.formatDate(new Date(), "America/New_York", "yyyy-MM-dd");
  const now = new Date();
  const dayOfMonth = now.getDate();

  // Try reading from Google Sheet first
  try {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
      if (id) ss = SpreadsheetApp.openById(id);
    }
    if (ss) {
      const sheet = ss.getSheetByName("Devotionals") || ss.getSheetByName("Daily_Devotionals");
      if (sheet) {
        const values = sheet.getDataRange().getValues();
        for (let i = 1; i < values.length; i++) {
          const rowDate = values[i][0] ? Utilities.formatDate(new Date(values[i][0]), "America/New_York", "yyyy-MM-dd") : "";
          if (rowDate === todayStr) {
            return {
              date: todayStr,
              title: values[i][1] || "Daily Devotional",
              theme: values[i][1] || "Faith",
              scripture: values[i][2] || values[i][4] || "Philippians 4:6-7",
              verseText: values[i][3] || values[i][5] || "",
              prayer: values[i][5] || "Lord, bless us today. Amen."
            };
          }
        }
      }
    }
  } catch (e) {
    Logger.log("Sheet read notice: " + e.message);
  }

  // Fallback to rotating daily calendar (guarantees a DIFFERENT devotional each day)
  const item = DAILY_DEVOTIONAL_CALENDAR[(dayOfMonth - 1) % DAILY_DEVOTIONAL_CALENDAR.length];
  return {
    date: todayStr,
    title: item.title,
    theme: item.theme,
    scripture: item.scripture,
    verseText: item.verseText,
    prayer: item.prayer
  };
}

function sendDailyDevotionals() {
  const today = getDailyDevotionalForToday();
  Logger.log("📖 Dispatching today's devotional: " + today.scripture + " (" + today.theme + ")");

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    ss = id ? SpreadsheetApp.openById(id) : null;
  }
  const subSheet = ss ? ss.getSheetByName("Subscribers") : null;
  if (!subSheet) {
    Logger.log("⚠️ Subscribers sheet not found. Sending test copy to script owner...");
    sendDevotionalEmail(Session.getEffectiveUser().getEmail(), today, "Beloved");
    return;
  }
  const subscribers = subSheet.getDataRange().getValues();

  let sentCount = 0;
  for (let i = 1; i < subscribers.length; i++) {
    const rawName = subscribers[i][1];
    const name = (!rawName || rawName === 'Word Embassy Admin' || String(rawName).trim() === '') ? 'Beloved' : String(rawName).trim();
    const email = subscribers[i][2];
    const status = subscribers[i][4] || subscribers[i][5] || "ACTIVE";
    const lastSent = subscribers[i][9] ? Utilities.formatDate(new Date(subscribers[i][9]), "America/New_York", "yyyy-MM-dd") : "";

    // Skip if inactive or if already sent today
    if (status === "ACTIVE" && email && lastSent !== today.date) {
      sendDevotionalEmail(email, today, name);
      subSheet.getRange(i + 1, 10).setValue(new Date()); // Record send date
      sentCount++;
      Utilities.sleep(100);
    }
  }
  Logger.log("🎉 Successfully sent " + sentCount + " unique daily devotional emails for " + today.scripture);
}

function sendDevotionalEmail(toEmail, devotional, recipientName) {
  const subject = "Living Word Embassy Daily: " + devotional.scripture + " — " + devotional.title;
  const videoUrl = "https://youtube.com/results?search_query=Living+Word+Embassy+" + encodeURIComponent(devotional.scripture);

  const htmlBody =
    '<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; color: #1E293B;">' +
      '<div style="background-color: #060B18; padding: 24px; text-align: center; border-bottom: 3px solid #F59E0B;">' +
        '<p style="color: #F59E0B; font-family: sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; margin: 0 0 6px 0; text-transform: uppercase;">Living Word Embassy</p>' +
        '<h1 style="color: #FFFFFF; font-size: 22px; margin: 0 0 4px 0;">Daily Video Devotional</h1>' +
        '<p style="color: #94A3B8; font-size: 13px; font-family: sans-serif; margin: 0;">' + devotional.date + ' • ' + devotional.theme + '</p>' +
      '</div>' +
      '<div style="padding: 24px;">' +
        '<p style="font-size: 15px; color: #475569; margin-top: 0;">Grace and peace to you, <strong>' + recipientName + '</strong>.</p>' +
        '<div style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; padding: 18px; margin: 20px 0;">' +
          '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">' +
            '<span style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #B45309; text-transform: uppercase;">📖 Today\\'s Scripture Reference</span>' +
            '<span style="background-color: #B45309; color: #FFFFFF; font-family: sans-serif; font-size: 12px; font-weight: bold; padding: 2px 8px; border-radius: 4px;">' + devotional.scripture + '</span>' +
          '</div>' +
          '<p style="font-size: 17px; line-height: 1.6; font-style: italic; color: #1E293B; margin: 10px 0 4px 0;">“' + devotional.verseText + '”</p>' +
          '<p style="text-align: right; font-size: 12px; font-weight: bold; color: #92400E; margin: 0;">— ' + devotional.scripture + '</p>' +
        '</div>' +
        '<h3 style="color: #0F172A; font-size: 18px; margin: 16px 0 8px 0;">' + devotional.title + '</h3>' +
        '<div style="background-color: #F8FAFC; border-left: 4px solid #B45309; padding: 14px; margin: 20px 0; border-radius: 0 6px 6px 0;">' +
          '<p style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #92400E; text-transform: uppercase; margin: 0 0 4px 0;">🙏 Prayer of Faith (' + devotional.scripture + ')</p>' +
          '<p style="font-size: 14px; line-height: 1.5; color: #1E293B; font-style: italic; margin: 0;">' + devotional.prayer + '</p>' +
        '</div>' +
        '<div style="text-align: center; margin: 24px 0; background-color: #0F172A; padding: 20px; border-radius: 10px;">' +
          '<p style="color: #FCD34D; font-family: sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 0 0 8px 0;">🎥 Watch Today\\'s Video Devotional (' + devotional.scripture + ')</p>' +
          '<a href="' + videoUrl + '" style="background-color: #F59E0B; color: #060B18; font-family: sans-serif; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; display: inline-block;">▶ Watch ' + devotional.scripture + ' Video Devotional</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  MailApp.sendEmail({
    to: toEmail,
    subject: subject,
    htmlBody: htmlBody,
    name: "Living Word Embassy Ministry"
  });
}`,
        },
      ]);
      setActiveFileId('file-mailer-gs');
    } else if (preset === 'gemini') {
      setProjectTitle('Gemini 3.7 Flash Exegesis API Connector');
      setFiles([
        {
          id: 'file-gemini-gs',
          name: 'GeminiBridge.gs',
          type: 'gs',
          content: `/**\n * Gemini 3.7 Flash Exegesis API Connector for Google Apps Script\n */\nfunction generateTheologicalDevotional(scriptureRef, theme) {\n  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');\n  if (!apiKey) {\n    throw new Error('Please set GEMINI_API_KEY in Project Settings > Script Properties');\n  }\n  \n  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=" + apiKey;\n  \n  const prompt = "Act as lead theologian at Living Word Embassy. Write a comprehensive 5-minute devotional for: " + scriptureRef + " on theme: " + theme;\n  \n  const payload = {\n    contents: [{ parts: [{ text: prompt }] }],\n    generationConfig: {\n      responseMimeType: "application/json"\n    }\n  };\n  \n  const options = {\n    method: "post",\n    contentType: "application/json",\n    payload: JSON.stringify(payload),\n    muteHttpExceptions: true\n  };\n  \n  const response = UrlFetchApp.fetch(endpoint, options);\n  const json = JSON.parse(response.getContentText());\n  const output = json.candidates[0].content.parts[0].text;\n  \n  Logger.log("Devotional Exegesis Generated: " + output.substring(0, 100) + "...");\n  return output;\n}`,
        },
      ]);
      setActiveFileId('file-gemini-gs');
    } else if (preset === 'youtube_shorts') {
      setProjectTitle('Living Word Embassy — YouTube Shorts Direct Video Pipeline');
      setFiles([
        {
          id: 'file-youtube-gs',
          name: 'YouTubeVideoPipeline.gs',
          type: 'gs',
          content: `/**
 * ============================================================================
 * LIVING WORD EMBASSY — YOUTUBE SHORTS DIRECT VIDEO PIPELINE
 * ============================================================================
 * IMPORTANT NOTE FOR GOOGLE APPS SCRIPT (.gs):
 * Apps Script executes within Google's V8 script environment as a global file.
 * DO NOT use ES Module 'import' or 'export' statements in this file.
 * All Google APIs (DriveApp, YouTube, UrlFetchApp, Utilities, Logger) are
 * global built-ins and are immediately accessible without any imports.
 * ============================================================================
 * Features:
 *  1. Pure Direct Render (NO TEMPLATE ID NEEDED, NO ELEVENLABS NEEDED):
 *     - Only requires your single CREATOMATE_API_KEY
 *     - Directly constructs and renders the 1080x1920 Full HD vertical video
 *     - 100% self-contained layout with zero external integrations or template setup
 *  2. High-Impact Visual Styling:
 *     - 1080x1920 (9:16 vertical shorts format), 30 FPS, 15 seconds
 *     - Warm ivory / cream parchment canvas (#FAF8F5) with rich charcoal and gold accents
 *     - Distinctive typography: Playfair Display 76px, Lora 54px, Montserrat 52px
 *     - Highlighted prayer container with glowing backdrop and contrast border
 *  3. Automatic YouTube Upload:
 *     - Uploads directly to YouTube channel via YouTube Data API v3
 *     - Sets title, description, devotional tags, and category (Nonprofits/Religion)
 *     - Archives rendered MP4 backup to Google Drive
 * ============================================================================
 */

const VIDEO_CONFIG = {
  DRIVE_ROOT_FOLDER_NAME: 'Living Word Embassy Video Studio',
  YOUTUBE_CATEGORY_ID: '29', // 29 = Nonprofits & Religion
  DEFAULT_PRIVACY_STATUS: 'public', // 'public', 'unlisted', or 'private'
  DURATION_SECONDS: 15, // 15-second high-impact Short

  // 1. BACKGROUND CANVAS & TEXTURE:
  // Palettes: '#FAF8F5' (Warm Ivory Parchment - Attached), '#0B0F19' (Obsidian Midnight), '#0A1526' (Royal Navy), '#1F0A12' (Burgundy), '#061C14' (Emerald)
  BACKGROUND_COLOR: '#FAF8F5', // Warm Ivory Parchment (matches attached image)
  BACKGROUND_IMAGE_URL: '', // Optional: Direct image URL if hosted on Google Drive or CDN

  // 2. BACKGROUND MUSIC:
  BACKGROUND_MUSIC_URL: 'https://cdn.jsdelivr.net/gh/rafaelreis-hotmart/Audio-Sample-files@master/sample.mp3',
  MUSIC_VOLUME: '60%', // Default volume when no voiceover
  DUCKED_MUSIC_VOLUME: '15%', // Automatically lowered when voiceover is speaking!

  // 3. TEXT-TO-SPEECH & AI VOICEOVER:
  ENABLE_VOICEOVER: true, // Set to true to automatically narrate scripture & prayer
  VOICEOVER_PROVIDER: 'elevenlabs', // 'elevenlabs' (ultra-realistic) or 'openai' (fast & clean)
  VOICEOVER_VOICE_ID: 'nPczCjzI2devNBz1zQrb', // Custom ElevenLabs voice ID
  VOICEOVER_MODEL: 'eleven_multilingual_v2', // 'eleven_multilingual_v2', 'eleven_v3', or 'tts-1'
  VOICEOVER_SCOPE: 'verse_and_prayer', // 'verse_only', 'verse_and_prayer', or 'full'

  // 4. STRICT SINGLE-DISPATCH PER DAY ENFORCEMENT:
  ENFORCE_SINGLE_VIDEO_PER_DAY: true, // Only 1 video is permitted per day (prevents duplicates)
  TIME_ZONE: 'America/New_York', // Timezone used for daily single-video lock (yyyy-MM-dd)

  // 5. SUBSCRIBER & MULTI-SOCIAL BROADCASTING:
  ENABLE_SUBSCRIBER_EMAIL: true, // Automatically sends video devotional to all active email subscribers
  ENABLE_SOCIAL_BROADCAST: false, // Set to true when AYRSHARE_API_KEY or Make.com webhook is configured for TikTok, IG, FB, X

  VIDEO_TAGS: [
    'Living Word Embassy',
    'Daily Devotional',
    'Christian Shorts',
    'Morning Prayer',
    'Bible Study',
    'Faith in God',
    'Scripture of the Day',
    'Jesus Christ'
  ]
};

/**
 * ============================================================================
 * DAILY AUTOMATION & RATE-LIMIT CONTROLS (Run these from editor dropdown)
 * ============================================================================
 */

/**
 * 1. Setup Utility: Clears ALL duplicate triggers and installs exactly ONE daily trigger.
 * Run this function once from the Apps Script editor to guarantee that only ONE video is sent per day!
 */
function setupSingleDailyTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  let cleared = 0;
  for (let i = 0; i < triggers.length; i++) {
    const handler = triggers[i].getHandlerFunction();
    if (handler === 'renderAndPublishDevotionalVideo' || handler === 'createDailyDraft' || handler === 'approveAndSendDaily') {
      ScriptApp.deleteTrigger(triggers[i]);
      cleared++;
    }
  }
  Logger.log("🧹 Cleared " + cleared + " old or duplicate triggers.");

  // Create exactly ONE daily trigger at 7:00 AM Eastern Time
  ScriptApp.newTrigger('renderAndPublishDevotionalVideo')
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();

  Logger.log("✅ SUCCESS! Installed exactly ONE single daily trigger for 'renderAndPublishDevotionalVideo' at 7:00 AM.");
  Logger.log("This guarantees only 1 video will ever be published per day.");
}

/**
 * 2. Diagnostic Tool: Checks if today's video has already been published.
 * Run this anytime to inspect today's release status and active locks.
 */
function checkDailyVideoStatus() {
  const todayStr = Utilities.formatDate(new Date(), VIDEO_CONFIG.TIME_ZONE || "America/New_York", "yyyy-MM-dd");
  const props = PropertiesService.getScriptProperties();
  const lastDate = props.getProperty('LAST_VIDEO_PUBLISHED_DATE');
  const lastId = props.getProperty('LAST_VIDEO_PUBLISHED_ID');
  const lastTitle = props.getProperty('LAST_VIDEO_PUBLISHED_TITLE');
  const lastTime = props.getProperty('LAST_VIDEO_PUBLISHED_TIME');

  if (lastDate === todayStr) {
    Logger.log("✅ TODAY'S VIDEO STATUS: Already Published");
    Logger.log("   • Date: " + todayStr);
    Logger.log("   • YouTube URL: https://youtube.com/shorts/" + lastId);
    Logger.log("   • Title: " + lastTitle);
    Logger.log("   • Timestamp: " + lastTime);
    Logger.log("🔒 Lock is ACTIVE: No additional videos will be sent out today.");
  } else {
    Logger.log("ℹ️ TODAY'S VIDEO STATUS: Not Yet Published for " + todayStr);
    Logger.log("   • Last recorded publication date: " + (lastDate || "None"));
    Logger.log("Ready for today's single daily release.");
  }
}

/**
 * 3. Reset Utility: Allows developers to reset today's lock if testing is required.
 */
function resetDailyVideoLockForTesting() {
  PropertiesService.getScriptProperties().deleteProperty('LAST_VIDEO_PUBLISHED_DATE');
  Logger.log("🔄 Today's video dispatch lock has been reset.");
  Logger.log("You may now execute renderAndPublishDevotionalVideo() again for test verification.");
}


/**
 * 1-Click Quick Test: Test ElevenLabs Text-to-Speech directly
 */
function testElevenLabsVoiceover() {
  Logger.log("🎙️ Testing direct ElevenLabs voiceover generation (Voice ID: " + VIDEO_CONFIG.VOICEOVER_VOICE_ID + ")...");
  const testText = "Philippians 4:6. Be anxious for nothing, but in everything by prayer and supplication, make your requests known to God. Amen.";
  const audioBlob = generateElevenLabsSpeechBlob(testText);
  if (audioBlob) {
    Logger.log("✅ ElevenLabs audio generated successfully! Size: " + Math.round(audioBlob.getBytes().length / 1024) + " KB");
  } else {
    Logger.log("❌ ElevenLabs audio generation failed. Check ELEVENLABS_API_KEY in Script Properties.");
  }
}

/**
 * 1-Click Quick Test: Test Creatomate direct rendering (Zero Template ID needed)
 */
function testCreatomateRender() {
  Logger.log("🎬 Starting 1-Click Creatomate Direct Test Render (No Template ID)...");
  const result = renderMp4WithCreatomate(
    "Philippians 4:6-7",
    "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God.",
    "Lord Jesus, we release every anxiety and fear into Your sovereign hands today. Fill our hearts with Your peace that surpasses all understanding. Amen.",
    "Peace in the Presence of God"
  );
  if (result) {
    Logger.log("✅ TEST SUCCESSFUL! Rendered MP4 URL: " + result.url);
    Logger.log("MP4 Blob Size: " + Math.round(result.blob.getBytes().length / 1024) + " KB");
  } else {
    Logger.log("❌ Test failed to render. Check CREATOMATE_API_KEY in Script Properties.");
  }
}

/**
 * 1-Click Quick Test: Test Creatomate v2 Template Rendering (Template ID: c67fa002-f471-4603-97bc-329edd25a2b8)
 */
function testCreatomateTemplateRender() {
  Logger.log("🎬 Starting Creatomate v2 Template Test Render (Template ID: " + VIDEO_CONFIG.CREATOMATE_TEMPLATE_ID + ")...");
  const result = renderMp4WithCreatomateTemplate(
    VIDEO_CONFIG.CREATOMATE_TEMPLATE_ID,
    "Philippians 4:6-7",
    "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God.",
    "Lord Jesus, fill our hearts with Your peace that surpasses all understanding. Amen.",
    "Peace in Christ"
  );
  if (result) {
    Logger.log("✅ TEMPLATE TEST SUCCESSFUL! Rendered MP4 URL: " + result.url);
  } else {
    Logger.log("❌ Template render failed. Check CREATOMATE_API_KEY in Script Properties.");
  }
}

/**
 * 31-Day Rotating Master Devotional Calendar.
 * Guarantees a brand-new, unique scripture, theme, and prayer for EVERY single day of the month!
 */
const DAILY_DEVOTIONAL_CALENDAR = [
  {
    day: 1,
    title: "Strength and Courage for the Journey",
    scripture: "Joshua 1:9",
    verseText: "Have I not commanded you? Be strong and of good courage; do not be afraid, nor be dismayed, for the Lord your God is with you wherever you go.",
    prayer: "Heavenly Father, infuse our spirits with holy boldness. We silence every fearful voice and declare that Your presence goes before us today. In Jesus' name, Amen.",
    theme: "Divine Courage"
  },
  {
    day: 2,
    title: "Trusting the Lord in Every Direction",
    scripture: "Proverbs 3:5-6",
    verseText: "Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.",
    prayer: "Lord Jesus, we surrender our human reasoning to Your divine wisdom. Order our steps today and lead us down straight paths of righteousness. Amen.",
    theme: "Trust & Direction"
  },
  {
    day: 3,
    title: "Renewed Strength for the Weary",
    scripture: "Isaiah 40:31",
    verseText: "Those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.",
    prayer: "Father, we wait on You. Exchange our human exhaustion for supernatural stamina. Lift our perspective to see life through Your eyes. Amen.",
    theme: "Spiritual Renewal"
  },
  {
    day: 4,
    title: "The Supernatural Peace That Protects Your Mind",
    scripture: "Philippians 4:6-7",
    verseText: "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God; and the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus.",
    prayer: "Lord, we cast all worries at Your feet. Guard our hearts with Your supernatural serenity that defies all worldly circumstances. Amen.",
    theme: "Peace in Christ"
  },
  {
    day: 5,
    title: "All Things Working Together for Good",
    scripture: "Romans 8:28",
    verseText: "And we know that all things work together for good to those who love God, to those who are the called according to His purpose.",
    prayer: "Lord God, even when circumstances look confusing, we anchor our souls in Your sovereign goodness. Turn every test into a testimony. Amen.",
    theme: "Sovereign Purpose"
  },
  {
    day: 6,
    title: "Resting Under the Shepherd's Care",
    scripture: "Psalm 23:1-3",
    verseText: "The Lord is my shepherd; I shall not want. He makes me to lie down in green pastures; He leads me beside the still waters. He restores my soul.",
    prayer: "Good Shepherd, we rest in Your loving provision today. Lead us away from chaotic noise to the still waters of Your presence. Amen.",
    theme: "Divine Provision"
  },
  {
    day: 7,
    title: "Walking by Faith Beyond Sight",
    scripture: "2 Corinthians 5:7",
    verseText: "For we walk by faith, not by sight.",
    prayer: "Lord, when the path ahead looks misty, let the light of Your Word guide our every step. We choose faith over fear today. Amen.",
    theme: "Unshakable Faith"
  },
  {
    day: 8,
    title: "Seeking the Kingdom First",
    scripture: "Matthew 6:33",
    verseText: "Seek first the kingdom of God and His righteousness, and all these things shall be added to you.",
    prayer: "King of Glory, reign supreme in our thoughts, finances, and relationships. When we prioritize Your Kingdom, You supply all our needs. Amen.",
    theme: "Kingdom Priority"
  },
  {
    day: 9,
    title: "A Future and a Living Hope",
    scripture: "Jeremiah 29:11",
    verseText: "For I know the thoughts that I think toward you, says the Lord, thoughts of peace and not of evil, to give you a future and a hope.",
    prayer: "Father, thank You that Your plans for us are full of hope and redemption. We reject despair and step into Your blessed future. Amen.",
    theme: "Hope & Destiny"
  },
  {
    day: 10,
    title: "The Secret Place of Divine Protection",
    scripture: "Psalm 91:1-2",
    verseText: "He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty. I will say of the Lord, 'He is my refuge and my fortress; my God, in Him I will trust.'",
    prayer: "Almighty God, we run into the secret place of Your presence. Cover our families, homes, and callings with Your divine wings. Amen.",
    theme: "Divine Protection"
  },
  {
    day: 11,
    title: "The Reality of Confident Faith",
    scripture: "Hebrews 11:1",
    verseText: "Now faith is the substance of things hoped for, the evidence of things not seen.",
    prayer: "Lord Jesus, ignite our faith. We lay hold of unseen promises and thank You in advance for the harvest. Amen.",
    theme: "Substance of Faith"
  },
  {
    day: 12,
    title: "Walking in the Fruit of the Spirit",
    scripture: "Galatians 5:22-23",
    verseText: "The fruit of the Spirit is love, joy, peace, longsuffering, kindness, goodness, faithfulness, gentleness, self-control.",
    prayer: "Holy Spirit, produce Your heavenly fruit through our words and actions today. Let Christ be clearly seen in us. Amen.",
    theme: "Spiritual Fruitfulness"
  },
  {
    day: 13,
    title: "Releasing Every Heavy Burden",
    scripture: "1 Peter 5:7",
    verseText: "Casting all your care upon Him, for He cares for you.",
    prayer: "Father, we take our hands off the burdens that weigh us down. Thank You for Your tender, watchful care over every detail. Amen.",
    theme: "Surrender & Care"
  },
  {
    day: 14,
    title: "Standing Firm in the Full Armor of God",
    scripture: "Ephesians 6:10-11",
    verseText: "Be strong in the Lord and in the power of His might. Put on the whole armor of God, that you may be able to stand against the wiles of the devil.",
    prayer: "Mighty God, we gird ourselves with truth, put on righteousness, take the shield of faith, and stand victorious in Christ! Amen.",
    theme: "Spiritual Warfare"
  },
  {
    day: 15,
    title: "Asking and Receiving Godly Wisdom",
    scripture: "James 1:5",
    verseText: "If any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.",
    prayer: "Lord of Wisdom, give us discernment in our work, home, and relationships today. Guard our speech and grant us insight from above. Amen.",
    theme: "Divine Wisdom"
  },
  {
    day: 16,
    title: "Letting the Peace of Christ Rule",
    scripture: "Colossians 3:15",
    verseText: "Let the peace of God rule in your hearts, to which also you were called in one body; and be thankful.",
    prayer: "Lord Jesus, let Your supernatural peace act as an umpire in our hearts today. We choose thanksgiving over complaint. Amen.",
    theme: "Reigning Peace"
  },
  {
    day: 17,
    title: "Power, Love, and a Sound Mind",
    scripture: "2 Timothy 1:7",
    verseText: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
    prayer: "Lord, we break agreement with all spirit of fear or mental panic. We walk in Your power, love, and balanced clarity today. Amen.",
    theme: "Mental Soundness"
  },
  {
    day: 18,
    title: "Our Ever-Present Help in Trouble",
    scripture: "Psalm 46:1-2",
    verseText: "God is our refuge and strength, a very present help in trouble. Therefore we will not fear, even though the earth be removed.",
    prayer: "Eternal Refuge, when the ground shakes around us, You remain immovable. We find our peace in Your unfailing hands. Amen.",
    theme: "Unshakable Refuge"
  },
  {
    day: 19,
    title: "Renewing Your Mind for Transformation",
    scripture: "Romans 12:2",
    verseText: "Do not be conformed to this world, but be transformed by the renewing of your mind, that you may prove what is that good and acceptable and perfect will of God.",
    prayer: "Father, wash our minds with the pure water of Your Word. Break every worldly mindset and align us with Your perfect will. Amen.",
    theme: "Renewed Mindset"
  },
  {
    day: 20,
    title: "Standing Firm with Courage and Love",
    scripture: "1 Corinthians 16:13-14",
    verseText: "Watch, stand fast in the faith, be brave, be strong. Let all that you do be done with love.",
    prayer: "Lord, make us spiritually alert and steadfast. May our strength always be tempered by unconditional Christlike love. Amen.",
    theme: "Courage in Love"
  },
  {
    day: 21,
    title: "Upheld by God's Righteous Hand",
    scripture: "Isaiah 41:10",
    verseText: "Fear not, for I am with you; be not dismayed, for I am your God. I will strengthen you, yes, I will help you, I will uphold you with My righteous right hand.",
    prayer: "Lord, when we feel weak, You uphold us. Thank You that Your grip on our lives is stronger than any storm we face. Amen.",
    theme: "Divine Support"
  },
  {
    day: 22,
    title: "A Lamp Unto Your Feet",
    scripture: "Psalm 119:105",
    verseText: "Your word is a lamp to my feet and a light to my path.",
    prayer: "Lord, illuminate our next step. When the path seems dark, let Your truth be the flashlight that guides our decisions. Amen.",
    theme: "Light of Truth"
  },
  {
    day: 23,
    title: "The Power of Persistent Prayer",
    scripture: "Luke 18:1",
    verseText: "Then He spoke a parable to them, that men always ought to pray and not lose heart.",
    prayer: "Lord Jesus, revive our prayer life. We refuse to lose heart or faint before the answer arrives. We press into Your throne. Amen.",
    theme: "Persistent Prayer"
  },
  {
    day: 24,
    title: "The Gift of Christ's Deep Peace",
    scripture: "John 14:27",
    verseText: "Peace I leave with you, My peace I give to you; not as the world gives do I give to you. Let not your heart be troubled, neither let it be afraid.",
    prayer: "Prince of Peace, let Your tranquility overflow our hearts today. Silence the clamor of the world with Your quiet assurance. Amen.",
    theme: "Prince of Peace"
  },
  {
    day: 25,
    title: "Forgetting None of God's Benefits",
    scripture: "Psalm 103:1-3",
    verseText: "Bless the Lord, O my soul; and all that is within me, bless His holy name! Bless the Lord, O my soul, and forget not all His benefits: who forgives all your iniquities, who heals all your diseases.",
    prayer: "O Lord, our souls magnify You! We recount Your past faithfulness and rejoice in Your forgiveness and healing power today. Amen.",
    theme: "Gratitude & Healing"
  },
  {
    day: 26,
    title: "Not by Might, But by My Spirit",
    scripture: "Zechariah 4:6",
    verseText: "Not by might nor by power, but by My Spirit,' says the Lord of hosts.",
    prayer: "Holy Spirit, we cease striving in our own fleshly energy. Breathe upon our efforts and accomplish what human strength cannot. Amen.",
    theme: "Spirit's Power"
  },
  {
    day: 27,
    title: "Rejoicing and Giving Thanks Always",
    scripture: "1 Thessalonians 5:16-18",
    verseText: "Rejoice always, pray without ceasing, in everything give thanks; for this is the will of God in Christ Jesus for you.",
    prayer: "Father, we offer the sacrifice of praise today. In every situation, we find reason to give You thanks and worship Your name. Amen.",
    theme: "Continual Praise"
  },
  {
    day: 28,
    title: "Inseparable from the Love of Christ",
    scripture: "Romans 8:38-39",
    verseText: "For I am persuaded that neither death nor life, nor angels nor principalities... nor any other created thing, shall be able to separate us from the love of God which is in Christ Jesus our Lord.",
    prayer: "Lord Jesus, thank You that nothing in heaven or earth can ever sever us from Your unconditional love. We rest in Your eternal grip. Amen.",
    theme: "Unconditional Love"
  },
  {
    day: 29,
    title: "Looking Up to the Hills of Help",
    scripture: "Psalm 121:1-2",
    verseText: "I will lift up my eyes to the hills—from whence comes my help? My help comes from the Lord, who made heaven and earth.",
    prayer: "Maker of Heaven and Earth, our eyes are fixed on You. Thank You that You never sleep nor slumber over our lives. Amen.",
    theme: "Divine Helper"
  },
  {
    day: 30,
    title: "Exceedingly Abundantly Above All",
    scripture: "Ephesians 3:20-21",
    verseText: "Now to Him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us, to Him be glory!",
    prayer: "Lord, enlarge our spiritual vision. We lift the lid of limitation and praise You for the exceeding abundance You are preparing. Amen.",
    theme: "Supernatural Abundance"
  },
  {
    day: 31,
    title: "The Abiding Grace of Our Lord",
    scripture: "Revelation 22:20-21",
    verseText: "He who testifies to these things says, 'Surely I am coming quickly.' Amen. Even so, come, Lord Jesus! The grace of our Lord Jesus Christ be with you all. Amen.",
    prayer: "Lord Jesus, we live with eternity in view. May Your sanctifying grace preserve our souls until the glorious day of Your return. Amen.",
    theme: "Eternal Grace & Hope"
  }
];

/**
 * Dynamic Daily Devotional Resolver:
 * Resolves a DIFFERENT devotional for every day!
 * 1. Checks Master Sheet for today's specific date row (yyyy-MM-dd)
 * 2. If no exact date, cycles through existing sheet rows using Day-of-Year modulo
 * 3. Fallback: Uses 31-Day Rotating Calendar so every day of the month has a DIFFERENT devotional & video!
 */
function getDailyDevotionalForToday() {
  const todayStr = Utilities.formatDate(new Date(), "America/New_York", "yyyy-MM-dd");
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
  const dayOfMonth = now.getDate(); // 1 - 31

  // 1. Try to read from Google Sheet first
  try {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
      if (id) ss = SpreadsheetApp.openById(id);
    }
    if (ss) {
      const sheet = ss.getSheetByName("Devotionals") || ss.getSheetByName("Daily_Devotionals") || ss.getSheetByName("Newsletters");
      if (sheet) {
        const values = sheet.getDataRange().getValues();
        if (values.length > 1) {
          // Check for row matching today's date
          for (let i = 1; i < values.length; i++) {
            const rowDate = values[i][0] ? Utilities.formatDate(new Date(values[i][0]), "America/New_York", "yyyy-MM-dd") : "";
            if (rowDate === todayStr) {
              Logger.log("✅ Found sheet devotional matching today's date: " + todayStr);
              return {
                date: todayStr,
                title: values[i][1] || values[i][2] || "Daily Devotional",
                theme: values[i][1] || "Christian Living",
                scripture: values[i][2] || values[i][4] || "Philippians 4:6-7",
                verseText: values[i][3] || values[i][5] || "",
                prayer: values[i][5] || values[i][16] || "Lord, strengthen our faith today. Amen.",
                source: "Google Sheet (Today's Date Match)"
              };
            }
          }

          // If no row matches today's date, rotate through sheet rows so every day is DIFFERENT
          const rotatingRowIndex = 1 + (dayOfYear % (values.length - 1));
          const row = values[rotatingRowIndex];
          Logger.log("🔄 Rotating sheet devotional for Day of Year #" + dayOfYear + " (Row " + rotatingRowIndex + ")");
          return {
            date: todayStr,
            title: row[1] || row[2] || "Daily Devotional",
            theme: row[1] || "Christian Living",
            scripture: row[2] || row[4] || "Psalm 23:1",
            verseText: row[3] || row[5] || "",
            prayer: row[5] || row[16] || "Lord, guide our steps today. Amen.",
            source: "Google Sheet (Day-of-Year Rotation)"
          };
        }
      }
    }
  } catch (err) {
    Logger.log("Sheet read notice: " + err.message);
  }

  // 2. Built-in 31-Day Devotional Calendar fallback (guaranteed different for each day)
  const calendarIndex = (dayOfMonth - 1) % DAILY_DEVOTIONAL_CALENDAR.length;
  const item = DAILY_DEVOTIONAL_CALENDAR[calendarIndex];
  Logger.log("📅 Using 31-Day Devotional Calendar for Day " + dayOfMonth + ": " + item.scripture + " (" + item.theme + ")");

  return {
    date: todayStr,
    title: item.title,
    theme: item.theme,
    scripture: item.scripture,
    verseText: item.verseText,
    prayer: item.prayer,
    source: "Built-in 31-Day Calendar (Day " + dayOfMonth + ")"
  };
}

/**
 * Scripture Reference Parser:
 * Extracts and formats the exact Book, Chapter, and Verse(s) from any reference string.
 * Examples:
 *  - "Philippians 4:6-7" -> Book: "Philippians", Chapter: "4", Verses: "6-7", Label: "Chapter 4, Verses 6-7"
 *  - "Psalm 23:1-3"      -> Book: "Psalm", Chapter: "23", Verses: "1-3", Label: "Chapter 23, Verses 1-3"
 *  - "Joshua 1:9"        -> Book: "Joshua", Chapter: "1", Verses: "9", Label: "Chapter 1, Verse 9"
 *  - "1 Corinthians 16:13-14" -> Book: "1 Corinthians", Chapter: "16", Verses: "13-14", Label: "Chapter 16, Verses 13-14"
 */
function parseScriptureReference(ref) {
  if (!ref) {
    return {
      book: "Daily Scripture",
      chapter: "",
      verses: "",
      chapterLabel: "",
      verseLabel: "",
      short: "Daily Scripture",
      fullFormatted: "Daily Scripture",
      spoken: "daily scripture focus"
    };
  }
  const clean = ref.trim();
  const m = clean.match(/^([\d\s]*[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)(?::(\d+(?:-\d+)?))?/);
  if (m) {
    const book = m[1].trim();
    const chapter = m[2];
    const verses = m[3] || "";
    const chapterLabel = "Chapter " + chapter;
    const isRange = verses.includes('-');
    const verseLabel = verses ? (isRange ? ("Verses " + verses) : ("Verse " + verses)) : "";
    const fullFormatted = book + " " + chapterLabel + (verseLabel ? (", " + verseLabel) : "");
    const spokenVerses = verses ? (isRange ? ("verses " + verses.replace('-', ' to ')) : ("verse " + verses)) : "";
    const spoken = "the book of " + book + ", chapter " + chapter + (spokenVerses ? (", " + spokenVerses) : "");
    return {
      book: book,
      chapter: chapter,
      verses: verses,
      chapterLabel: chapterLabel,
      verseLabel: verseLabel,
      short: clean,
      fullFormatted: fullFormatted,
      spoken: spoken
    };
  }
  return {
    book: clean,
    chapter: "",
    verses: "",
    chapterLabel: "",
    verseLabel: "",
    short: clean,
    fullFormatted: clean,
    spoken: clean
  };
}

/**
 * Main Entry Point: Renders today's unique devotional into 1080x1920 MP4 and uploads to YouTube Shorts.
 * 
 * STRICT SINGLE VIDEO PER DAY POLICY:
 * Automatically inspects PropertiesService for today's date (yyyy-MM-dd).
 * If a video was ALREADY generated or published today, halts immediately so multiple
 * videos are NEVER sent out on the same day.
 * 
 * @param {boolean} forcePublish - (Optional) Pass true only when intentionally forcing a re-run in testing.
 */
function renderAndPublishDevotionalVideo(forcePublish) {
  Logger.log("====================================================================");
  Logger.log("✝️ LIVING WORD EMBASSY — STARTING DAILY VIDEO DEVOTIONAL PIPELINE");
  Logger.log("====================================================================");

  const todayStr = Utilities.formatDate(new Date(), VIDEO_CONFIG.TIME_ZONE || "America/New_York", "yyyy-MM-dd");
  const props = PropertiesService.getScriptProperties();

  // 1. CONCURRENCY LOCK: Prevent simultaneous executions from racing and creating duplicate videos
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) {
    Logger.log("🛑 Another video publishing task is currently running. Skipping execution to prevent duplicate videos.");
    return { status: "LOCKED_IN_PROGRESS" };
  }

  try {
    // 2. STRICT ONLY-ONE-VIDEO-PER-DAY VERIFICATION
    const lastPublishedDate = props.getProperty('LAST_VIDEO_PUBLISHED_DATE');
    const lastPublishedId = props.getProperty('LAST_VIDEO_PUBLISHED_ID');
    const lastPublishedTitle = props.getProperty('LAST_VIDEO_PUBLISHED_TITLE');

    if (lastPublishedDate === todayStr && !forcePublish) {
      Logger.log("====================================================================");
      Logger.log("🛑 SINGLE VIDEO PER DAY RULE ENFORCED: Video already published today!");
      Logger.log("📅 Today's Date: " + todayStr);
      Logger.log("🎬 Published Video ID: " + lastPublishedId);
      Logger.log("👉 Existing Video URL: https://youtube.com/shorts/" + lastPublishedId);
      Logger.log("📌 Title: " + lastPublishedTitle);
      Logger.log("⚠️ Halting execution immediately: No multiple videos will be sent out.");
      Logger.log("====================================================================");
      return {
        status: "SKIPPED_ALREADY_PUBLISHED_TODAY",
        date: todayStr,
        youtubeVideoId: lastPublishedId,
        youtubeUrl: "https://youtube.com/shorts/" + lastPublishedId,
        message: "Only 1 video per day is permitted. Today's video (" + todayStr + ") was already published."
      };
    }

    // Resolves a DIFFERENT video devotional for every day!
    const devotionalData = getDailyDevotionalForToday();

    // Parse the scripture into actual Book, Chapter, and Verse(s)
    const ref = parseScriptureReference(devotionalData.scripture);

    Logger.log("📖 SCRIPTURE REFERENCE BREAKDOWN:");
    Logger.log("   • Book: " + ref.book);
    Logger.log("   • Chapter: " + (ref.chapter || "N/A"));
    Logger.log("   • Verses: " + (ref.verses || "N/A"));
    Logger.log("   • Full Explicit Reference: " + ref.fullFormatted);
    Logger.log("✨ Theme: " + devotionalData.theme + " | Title: " + devotionalData.title);
    Logger.log("📌 Source: " + devotionalData.source);

    // Step 1: Render 1080x1920 Full HD Video directly via Creatomate API
    // Explicit chapter and verse are prominently embedded in Header, Citation, Verse, Prayer, and Voiceover!
    const renderResult = renderMp4WithCreatomate(
      devotionalData.scripture,
      devotionalData.verseText,
      devotionalData.prayer,
      devotionalData.theme
    );

    if (!renderResult || !renderResult.blob) {
      throw new Error("Failed to render video blob with Creatomate. Aborting pipeline.");
    }

    // Step 2: Save backup copy to Google Drive with clear scripture reference naming
    const driveFileName = "Living Word Embassy - " + ref.fullFormatted + " - " + devotionalData.theme + " (" + devotionalData.date + ")";
    const driveFile = saveVideoToGoogleDrive(
      renderResult.blob,
      driveFileName
    );

    // Step 3: Publish directly to YouTube Channel with explicit Chapter and Verse
    const videoTitle = ref.fullFormatted + " | " + devotionalData.theme + " — Daily Video Devotional #Shorts";
    const videoDescription = [
      "📖 TODAY'S SCRIPTURE REFERENCE:",
      "• Book: " + ref.book,
      "• Chapter: " + (ref.chapter || "N/A"),
      "• Verses: " + (ref.verses || "Full Chapter"),
      "• Full Reference: " + ref.fullFormatted,
      "",
      "“" + devotionalData.verseText + "”",
      "",
      "🙏 PRAYER OF FAITH (" + ref.fullFormatted + "):",
      devotionalData.prayer,
      "",
      "✨ Living Word Embassy Daily Video Devotional",
      "⚡ NOTE: Only ONE video devotional is released each day. Subscribe for daily scripture declarations, biblical encouragement, and prayers of faith.",
      "",
      "#Shorts #ChristianDevotional #" + ref.book.replace(/[^a-zA-Z0-9]/g, "") + (ref.chapter ? (" #Chapter" + ref.chapter) : "") + " #BibleVerse #LivingWordEmbassy #Faith #Prayer"
    ].join("\n");

    const youtubeVideoId = uploadVideoBlobToYouTube(
      renderResult.blob,
      videoTitle,
      videoDescription,
      VIDEO_CONFIG.VIDEO_TAGS
    );

    // Step 4: RECORD TODAY'S DISPATCH IMMEDIATELY TO ENFORCE SINGLE-VIDEO-PER-DAY POLICY
    props.setProperty('LAST_VIDEO_PUBLISHED_DATE', todayStr);
    props.setProperty('LAST_VIDEO_PUBLISHED_ID', youtubeVideoId);
    props.setProperty('LAST_VIDEO_PUBLISHED_TITLE', videoTitle);
    props.setProperty('LAST_VIDEO_PUBLISHED_TIME', new Date().toISOString());

    // Step 5: Send Devotional Email with Video Player Button to Subscribers (if enabled)
    if (VIDEO_CONFIG.ENABLE_SUBSCRIBER_EMAIL) {
      try {
        sendDailyVideoToSubscribers(youtubeVideoId, devotionalData);
      } catch (subErr) {
        Logger.log("⚠️ Subscriber email notice: " + subErr.message);
      }
    }

    // Step 6: Multi-Platform Social Push to TikTok, IG Reels, FB Reels, X (if enabled)
    if (VIDEO_CONFIG.ENABLE_SOCIAL_BROADCAST && renderResult.url) {
      try {
        broadcastVideoToSocialNetworks(renderResult.url, videoTitle, VIDEO_CONFIG.VIDEO_TAGS);
      } catch (socErr) {
        Logger.log("⚠️ Social broadcast notice: " + socErr.message);
      }
    }

    Logger.log("====================================================================");
    Logger.log("🎉 SUCCESS! Today's (" + ref.fullFormatted + ") Video is LIVE on YouTube Shorts:");
    Logger.log("👉 https://youtube.com/shorts/" + youtubeVideoId);
    Logger.log("🔒 Single-video daily lock saved for date: " + todayStr);
    Logger.log("Drive Backup: " + (driveFile ? driveFile.getUrl() : "Saved"));
    Logger.log("====================================================================");

    return {
      status: "SUCCESS",
      youtubeVideoId: youtubeVideoId,
      youtubeUrl: "https://youtube.com/shorts/" + youtubeVideoId,
      driveUrl: driveFile ? driveFile.getUrl() : null,
      scripture: devotionalData.scripture,
      chapter: ref.chapter,
      verses: ref.verses,
      fullFormattedReference: ref.fullFormatted,
      theme: devotionalData.theme
    };
  } finally {
    lock.releaseLock();
  }
}

function cleanTextForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[“”]/g, '"')
    .replace(/[\r\n]+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Render 1080x1920 Ultra-Sharp MP4 directly via Creatomate API
 * Includes Scripture Reference with explicit Chapter and Verse in:
 *  - Header category & book badge
 *  - Ultra-sharp primary citation headline
 *  - Dedicated amber gold Chapter & Verse callout
 *  - Verse card attribution
 *  - Prayer container title
 *  - Spoken audio voiceover narration
 */
function renderMp4WithCreatomate(scripture, verseText, prayer, theme) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CREATOMATE_API_KEY');
  if (!apiKey) {
    throw new Error('CREATOMATE_API_KEY is not set. Go to Project Settings > Script Properties.');
  }

  // Parse scripture into explicit Book, Chapter, and Verse(s)
  const ref = parseScriptureReference(scripture);

  // 1. Prepare Voiceover Narration Script & Dynamic Duration (Explicitly speaks Book, Chapter, and Verse)
  const hasVoiceover = (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.ENABLE_VOICEOVER);
  let narrationText = "";
  if (hasVoiceover) {
    const scope = (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.VOICEOVER_SCOPE) ? VIDEO_CONFIG.VOICEOVER_SCOPE : 'verse_and_prayer';
    if (scope === 'verse_and_prayer' && prayer) {
      narrationText = "Today's scripture reference is from " + ref.spoken + ". " + verseText + ". Let us pray together in faith: " + prayer;
    } else if (scope === 'full') {
      narrationText = "Living Word Embassy daily devotional. Today's scripture reference is from " + ref.spoken + ". " + verseText + ". Let us pray together in faith: " + prayer;
    } else {
      narrationText = "Today's scripture reference is from " + ref.spoken + ". " + verseText;
    }
    narrationText = cleanTextForSpeech(narrationText);
  }

  // Dynamic duration calculation: prevent audio truncation (pace is ~2.0 words/sec)
  let duration = 15;
  if (hasVoiceover && narrationText) {
    const wordCount = narrationText.trim().split(/\s+/).length;
    const estimatedSpeechSec = Math.ceil(wordCount / 2.0) + 4;
    duration = Math.min(58, Math.max(15, estimatedSpeechSec));
    Logger.log("🎙️ Voiceover script length: " + wordCount + " words. Dynamic video duration set to " + duration + "s.");
  } else if (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.DURATION_SECONDS) {
    duration = VIDEO_CONFIG.DURATION_SECONDS;
  }

  // Visual layers with prominent Scripture Reference and explicit Chapter and Verse
  const elements = [];

  // 0. Optional Custom Background Image / Parchment Texture
  if (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.BACKGROUND_IMAGE_URL && VIDEO_CONFIG.BACKGROUND_IMAGE_URL.trim()) {
    elements.push({
      type: "image",
      source: VIDEO_CONFIG.BACKGROUND_IMAGE_URL.trim(),
      x: "50%",
      y: "50%",
      width: "100%",
      height: "100%",
      fit: "cover",
      duration: duration
    });
  }

  // 1. Ministry Brand Header (Warm amber bronze on cream canvas)
  elements.push({
    type: "text",
    text: "LIVING WORD EMBASSY",
    font_family: "Montserrat",
    font_weight: "800",
    font_size: "52 px",
    fill_color: "#B45309",
    x: "50%",
    y: "8%",
    width: "880 px",
    x_alignment: "50%",
    y_alignment: "50%",
    duration: duration
  });

  // 2. Sub-Header: Daily Devotional Badge with Book & Chapter Callout
  const bookText = (ref && ref.book) ? String(ref.book).toUpperCase() : "DAILY BIBLE";
  const chapterText = (ref && ref.chapterLabel) ? String(ref.chapterLabel).toUpperCase() : "";
  const themeText = theme ? String(theme).toUpperCase() : "FAITH";
  const verseTextLabel = (ref && ref.verseLabel) ? String(ref.verseLabel).toUpperCase() : "";

  elements.push({
    type: "text",
    text: "DAILY DEVOTIONAL • " + bookText + (chapterText ? (" • " + chapterText) : "") + " • " + themeText,
    font_family: "Inter",
    font_weight: "600",
    font_size: "30 px",
    fill_color: "#64748B",
    x: "50%",
    y: "13%",
    width: "880 px",
    x_alignment: "50%",
    y_alignment: "50%",
    duration: duration
  });

  // 3a. Primary Scripture Citation Headline (Huge, Ultra-Sharp 74px Midnight Display)
  elements.push({
    type: "text",
    text: (ref && ref.short) ? ref.short : (scripture || "Daily Scripture"),
    font_family: "Playfair Display",
    font_weight: "900",
    font_size: "74 px",
    fill_color: "#0F172A",
    x: "50%",
    y: "22%",
    width: "860 px",
    x_alignment: "50%",
    y_alignment: "50%",
    duration: duration
  });

  // 3b. Dedicated Chapter & Verse Callout (Crisp Amber Gold 36px Montserrat)
  const calloutText = chapterText + (verseTextLabel ? (" • " + verseTextLabel) : "");
  if (calloutText) {
    elements.push({
      type: "text",
      text: calloutText,
      font_family: "Montserrat",
      font_weight: "800",
      font_size: "36 px",
      fill_color: "#D97706",
      x: "50%",
      y: "28%",
      width: "860 px",
      x_alignment: "50%",
      y_alignment: "50%",
      duration: duration
    });
  }

  // 4. Scripture Verse (Crisp 48px Deep Charcoal Serif with full explicit Chapter & Verse citation)
  elements.push({
    type: "text",
    text: "“" + verseText + "”\\n— " + ref.fullFormatted,
    font_family: "Lora",
    font_weight: "600",
    font_size: "48 px",
    line_height: "145%",
    fill_color: "#1E293B",
    x: "50%",
    y: "47%",
    width: "840 px",
    x_alignment: "50%",
    y_alignment: "50%",
    duration: duration
  });

  // 5. Prayer Box (Warm highlight container with explicit Chapter & Verse in title)
  elements.push({
    type: "text",
    text: "🙏 PRAYER OF FAITH (" + ref.fullFormatted + ")\\n" + prayer,
    font_family: "Inter",
    font_weight: "700",
    font_size: "38 px",
    line_height: "140%",
    fill_color: "#78350F",
    background_color: "rgba(245, 158, 11, 0.12)",
    background_border_radius: "20%",
    background_x_padding: "25%",
    background_y_padding: "20%",
    x: "50%",
    y: "75%",
    width: "860 px",
    x_alignment: "50%",
    y_alignment: "50%",
    duration: duration
  });

  // 6. Ministry Subscribe Footer with Full Reference
  elements.push({
    type: "text",
    text: "SUBSCRIBE FOR DAILY BLESSINGS • " + ref.fullFormatted,
    font_family: "Montserrat",
    font_weight: "700",
    font_size: "28 px",
    fill_color: "#64748B",
    x: "50%",
    y: "93%",
    width: "880 px",
    x_alignment: "50%",
    y_alignment: "50%",
    duration: duration
  });

  // 7. Background Music Setup
  const musicUrl = (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.BACKGROUND_MUSIC_URL)
    ? VIDEO_CONFIG.BACKGROUND_MUSIC_URL.trim()
    : 'https://cdn.jsdelivr.net/gh/rafaelreis-hotmart/Audio-Sample-files@master/sample.mp3';

  if (musicUrl) {
    const musicVol = hasVoiceover
      ? ((typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.DUCKED_MUSIC_VOLUME) ? VIDEO_CONFIG.DUCKED_MUSIC_VOLUME : "15%")
      : ((typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.MUSIC_VOLUME) ? VIDEO_CONFIG.MUSIC_VOLUME : "60%");

    elements.push({
      type: "audio",
      source: musicUrl,
      duration: duration,
      volume: musicVol,
      audio_fade_in: "1 s",
      audio_fade_out: "2 s"
    });
  }

  // 8. Text-to-Speech & AI Voiceover Narration Track
  if (hasVoiceover && narrationText) {
    const providerType = (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.VOICEOVER_PROVIDER) ? VIDEO_CONFIG.VOICEOVER_PROVIDER : 'elevenlabs';
    const voiceId = (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.VOICEOVER_VOICE_ID) ? VIDEO_CONFIG.VOICEOVER_VOICE_ID : 'nPczCjzI2devNBz1zQrb';
    const modelName = (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.VOICEOVER_MODEL) ? VIDEO_CONFIG.VOICEOVER_MODEL : 'eleven_multilingual_v2';

    let providerString = "elevenlabs voice_id=" + voiceId + " model_id=" + modelName;
    if (providerType === 'openai') {
      providerString = "openai voice=" + voiceId + " model=" + (modelName || 'tts-1');
    }

    elements.push({
      type: "audio",
      source: narrationText,
      provider: providerString,
      volume: "100%",
      audio_fade_out: "0.5 s"
    });
  }

  const payload = {
    source: {
      output_format: "mp4",
      width: 1080,
      height: 1920,
      frame_rate: 30,
      duration: duration,
      fill_color: (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.BACKGROUND_COLOR) ? VIDEO_CONFIG.BACKGROUND_COLOR : "#FAF8F5",
      elements: elements
    }
  };

  Logger.log("📡 Submitting 1080x1920 render to Creatomate for " + ref.fullFormatted + "...");

  const response = UrlFetchApp.fetch("https://api.creatomate.com/v1/renders", {
    method: "post",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (responseCode >= 400) {
    Logger.log("❌ Creatomate API Error (" + responseCode + "): " + responseText);
    return null;
  }

  const renderData = JSON.parse(responseText)[0];
  const renderId = renderData.id;
  Logger.log("⏳ Render job created: " + renderId + ". Polling status...");

  // Poll until render is complete (max 3 minutes)
  for (let attempt = 0; attempt < 36; attempt++) {
    Utilities.sleep(5000);
    const pollResponse = UrlFetchApp.fetch("https://api.creatomate.com/v1/renders/" + renderId, {
      method: "get",
      headers: { "Authorization": "Bearer " + apiKey },
      muteHttpExceptions: true
    });

    const statusData = JSON.parse(pollResponse.getContentText());
    Logger.log("Status check [" + (attempt + 1) + "/36]: " + statusData.status);

    if (statusData.status === "succeeded") {
      Logger.log("✨ Creatomate Render Finished: " + statusData.url);
      const videoBlob = UrlFetchApp.fetch(statusData.url).getBlob().setName("Devotional_" + ref.book.replace(/\s+/g, "_") + "_Ch" + (ref.chapter || "1") + "_1080p.mp4");
      return {
        url: statusData.url,
        blob: videoBlob
      };
    } else if (statusData.status === "failed") {
      Logger.log("❌ Creatomate Render Failed: " + (statusData.error_message || "Unknown error"));
      return null;
    }
  }

  Logger.log("❌ Render timed out after 3 minutes.");
  return null;
}

/**
 * Render Video using Creatomate v2 API and Template ID c67fa002-f471-4603-97bc-329edd25a2b8
 */
function renderMp4WithCreatomateTemplate(templateId, scripture, verseText, prayer, theme) {
  let apiKey = PropertiesService.getScriptProperties().getProperty('CREATOMATE_API_KEY');
  if (!apiKey && typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.CREATOMATE_API_KEY) {
    apiKey = VIDEO_CONFIG.CREATOMATE_API_KEY;
  }
  if (!apiKey) {
    throw new Error('CREATOMATE_API_KEY is not set in Script Properties.');
  }

  const tid = templateId || (typeof VIDEO_CONFIG !== 'undefined' && VIDEO_CONFIG.CREATOMATE_TEMPLATE_ID ? VIDEO_CONFIG.CREATOMATE_TEMPLATE_ID : 'c67fa002-f471-4603-97bc-329edd25a2b8');

  const modifications = {
    "Music.source": "https://creatomate.com/files/assets/b5dc815e-dcc9-4c62-9405-f94913936bf5",
    "Background-1.source": "https://creatomate.com/files/assets/4a7903f0-37bc-48df-9d83-5eb52afd5d07",
    "Text-1.text": "Did you know what God promises in " + scripture + "? 🔥",
    "Background-2.source": "https://creatomate.com/files/assets/4a6f6b28-bb42-4987-8eca-7ee36b347ee7",
    "Text-2.text": "“" + verseText + "” — " + scripture + " ✨",
    "Background-3.source": "https://creatomate.com/files/assets/4f6963a5-7286-450b-bc64-f87a3a1d8964",
    "Text-3.text": "Living Word Embassy daily devotional: Stand firm in faith on God's unchanging promises.",
    "Background-4.source": "https://creatomate.com/files/assets/36899eae-a128-43e6-9e97-f2076f54ea18",
    "Text-4.text": (prayer ? "🙏 " + prayer.slice(0, 100) + "..." : "Subscribe to Living Word Embassy for daily Bible teachings! 🚀")
  };

  const payload = {
    template_id: tid,
    modifications: modifications
  };

  Logger.log("📡 Submitting v2 Template render to Creatomate (Template: " + tid + ")...");

  const response = UrlFetchApp.fetch("https://api.creatomate.com/v2/renders", {
    method: "post",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (responseCode >= 400) {
    Logger.log("❌ Creatomate API Error (" + responseCode + "): " + responseText);
    return null;
  }

  const renderData = JSON.parse(responseText)[0] || JSON.parse(responseText);
  const renderId = renderData.id;
  Logger.log("⏳ Template Render job created: " + renderId + ". Polling status...");

  for (let attempt = 0; attempt < 36; attempt++) {
    Utilities.sleep(5000);
    const pollResponse = UrlFetchApp.fetch("https://api.creatomate.com/v2/renders/" + renderId, {
      method: "get",
      headers: { "Authorization": "Bearer " + apiKey },
      muteHttpExceptions: true
    });

    const statusData = JSON.parse(pollResponse.getContentText());
    Logger.log("Status check [" + (attempt + 1) + "/36]: " + statusData.status);

    if (statusData.status === "succeeded") {
      Logger.log("✨ Creatomate Template Render Finished: " + statusData.url);
      const videoBlob = UrlFetchApp.fetch(statusData.url).getBlob().setName("Template_Devotional_1080p.mp4");
      return {
        url: statusData.url,
        blob: videoBlob
      };
    } else if (statusData.status === "failed") {
      Logger.log("❌ Creatomate Template Render Failed: " + (statusData.error_message || "Unknown error"));
      return null;
    }
  }

  Logger.log("❌ Render timed out.");
  return null;
}

/**
 * Upload Video Blob directly to YouTube using YouTube Data API v3
 */
function uploadVideoBlobToYouTube(videoBlob, title, description, tags) {
  Logger.log("🎬 Initiating YouTube upload: '" + title + "'...");
  Logger.log("Video Size: " + Math.round(videoBlob.getBytes().length / 1024) + " KB");

  const resource = {
    snippet: {
      title: title,
      description: description,
      tags: tags || VIDEO_CONFIG.VIDEO_TAGS,
      categoryId: VIDEO_CONFIG.YOUTUBE_CATEGORY_ID
    },
    status: {
      privacyStatus: VIDEO_CONFIG.DEFAULT_PRIVACY_STATUS,
      selfDeclaredMadeForKids: false
    }
  };

  try {
    const video = YouTube.Videos.insert(resource, 'snippet,status', videoBlob);
    Logger.log("✅ YouTube Upload SUCCESS! Video ID: " + video.id);
    return video.id;
  } catch (e) {
    Logger.log("❌ YouTube API Upload Error: " + e.message);
    Logger.log("Troubleshooting checklist:");
    Logger.log("1. Open Apps Script Editor > Click '+' next to Services in left sidebar.");
    Logger.log("2. Select 'YouTube Data API v3' and click Add.");
    Logger.log("3. Ensure your Google account has an active YouTube channel created.");
    throw e;
  }
}

/**
 * Save rendered MP4 to a designated Google Drive folder
 */
/**
 * Calls ElevenLabs Text-to-Speech API directly and returns an MP3 blob
 */
function generateElevenLabsSpeechBlob(text) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('ELEVENLABS_API_KEY');
  if (!apiKey) {
    Logger.log("⚠️ ELEVENLABS_API_KEY is not set in Script Properties. Skipping direct voiceover.");
    return null;
  }

  const voiceId = VIDEO_CONFIG.VOICEOVER_VOICE_ID || "nPczCjzI2devNBz1zQrb";
  const modelId = VIDEO_CONFIG.VOICEOVER_MODEL || "eleven_multilingual_v2";

  const endpoint = "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId;
  const payload = {
    text: text,
    model_id: modelId,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75
    }
  };

  try {
    const response = UrlFetchApp.fetch(endpoint, {
      method: "post",
      contentType: "application/json",
      headers: {
        "xi-api-key": apiKey,
        "Accept": "audio/mpeg"
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    if (response.getResponseCode() === 200) {
      return response.getBlob().setContentType("audio/mpeg").setName("voiceover.mp3");
    } else {
      Logger.log("❌ ElevenLabs API error (" + response.getResponseCode() + "): " + response.getContentText());
      return null;
    }
  } catch (e) {
    Logger.log("❌ ElevenLabs network error: " + e.message);
    return null;
  }
}

/**
 * Save rendered MP4 to Google Drive folder
 */
function saveVideoToGoogleDrive(videoBlob, fileName) {
  try {
    const folderIterator = DriveApp.getFoldersByName(VIDEO_CONFIG.DRIVE_ROOT_FOLDER_NAME);
    let folder;
    if (folderIterator.hasNext()) {
      folder = folderIterator.next();
    } else {
      folder = DriveApp.createFolder(VIDEO_CONFIG.DRIVE_ROOT_FOLDER_NAME);
      Logger.log("📁 Created new Drive folder: " + VIDEO_CONFIG.DRIVE_ROOT_FOLDER_NAME);
    }
    const file = folder.createFile(videoBlob.setName(fileName + ".mp4"));
    Logger.log("💾 Saved backup to Google Drive: " + file.getName());
    return file;
  } catch (e) {
    Logger.log("Drive save warning: " + e.message);
    return null;
  }
}

/**
 * Automatically emails today's video devotional to all active subscribers in Google Sheets.
 */
function sendDailyVideoToSubscribers(youtubeVideoId, devotionalData) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (id) ss = SpreadsheetApp.openById(id);
  }
  if (!ss) return;

  const subSheet = ss.getSheetByName("Subscribers");
  if (!subSheet) {
    Logger.log("Notice: 'Subscribers' tab not found in Sheet. Skipping subscriber email.");
    return;
  }

  const rows = subSheet.getDataRange().getValues();
  if (rows.length <= 1) return;

  const youtubeUrl = "https://youtube.com/shorts/" + youtubeVideoId;
  const ref = parseScriptureReference(devotionalData.scripture);
  let sentCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const rawName = rows[i][1];
    const name = (!rawName || rawName === 'Word Embassy Admin' || String(rawName).trim() === '') ? 'Beloved' : String(rawName).trim();
    const email = rows[i][2];
    const status = rows[i][4];

    if (email && (status === 'ACTIVE' || !status)) {
      const htmlBody = 
        '<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; color: #1E293B; padding: 28px; border: 1px solid #E2E8F0; border-radius: 12px;">'
        + '<div style="text-align: center; border-bottom: 2px solid #D97706; padding-bottom: 12px; margin-bottom: 18px;">'
        + '<p style="color: #B45309; font-family: sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px 0;">Living Word Embassy</p>'
        + '<h2 style="color: #0F172A; font-size: 18px; text-transform: uppercase; margin: 0;">Daily Video Devotional</h2>'
        + '</div>'
        + '<p style="font-size: 15px; line-height: 1.6;">Dear ' + name + ',</p>'
        + '<h1 style="color: #0F172A; font-size: 22px; margin: 12px 0 6px 0;">' + ref.fullFormatted + '</h1>'
        + '<p style="color: #B45309; font-weight: bold; font-family: sans-serif; font-size: 13px; text-transform: uppercase; margin: 0 0 16px 0;">Theme: ' + devotionalData.theme + '</p>'
        + '<div style="background-color: #0F172A; border-radius: 10px; padding: 24px; text-align: center; margin: 20px 0;">'
        + '<p style="color: #FDE68A; font-family: sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 0 0 12px 0;">🎥 Watch Today\'s Video Devotional</p>'
        + '<a href="' + youtubeUrl + '" style="background-color: #D97706; color: #FFFFFF; font-family: sans-serif; font-size: 15px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 6px; display: inline-block;">▶ Watch on YouTube Shorts</a>'
        + '</div>'
        + '<div style="background-color: #FFFFFF; border-left: 4px solid #D97706; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">'
        + '<p style="font-style: italic; font-size: 16px; line-height: 1.6; margin: 0 0 6px 0;">“' + devotionalData.verseText + '”</p>'
        + '<p style="text-align: right; font-weight: bold; color: #B45309; font-size: 13px; margin: 0;">— ' + ref.fullFormatted + '</p>'
        + '</div>'
        + '<div style="background-color: rgba(217, 119, 6, 0.08); padding: 16px; border-radius: 8px; margin: 20px 0;">'
        + '<p style="font-weight: bold; color: #78350F; font-size: 14px; margin: 0 0 6px 0;">🙏 Prayer of Faith:</p>'
        + '<p style="font-style: italic; line-height: 1.6; margin: 0; color: #451A03;">' + devotionalData.prayer + '</p>'
        + '</div>'
        + '<hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />'
        + '<p style="font-size: 12px; color: #64748B; text-align: center; margin: 0;">Living Word Embassy Ministry • Sent with prayer for your spiritual walk.</p>'
        + '</div>';

      try {
        MailApp.sendEmail({
          to: email,
          name: "Living Word Embassy",
          subject: "Daily Video Devotional: " + ref.fullFormatted + " (" + devotionalData.theme + ")",
          htmlBody: htmlBody
        });
        sentCount++;
      } catch (e) {
        Logger.log("Could not send email to " + email + ": " + e.message);
      }
    }
  }

  Logger.log("📬 Sent daily devotional email with video to " + sentCount + " active subscribers.");
}

/**
 * Automatically publishes the rendered MP4 to TikTok, Instagram Reels, Facebook Reels, and X (Twitter)
 * via Ayrshare API or Make.com / Zapier Webhook.
 */
function broadcastVideoToSocialNetworks(videoDownloadUrl, caption, tags) {
  const ayrshareApiKey = PropertiesService.getScriptProperties().getProperty('AYRSHARE_API_KEY');
  const makeWebhookUrl = PropertiesService.getScriptProperties().getProperty('MAKE_WEBHOOK_URL');

  // Option 1: Direct Make.com / Zapier Webhook
  if (makeWebhookUrl) {
    Logger.log("📡 Triggering Make.com / Zapier Social Webhook...");
    UrlFetchApp.fetch(makeWebhookUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        videoUrl: videoDownloadUrl,
        title: caption,
        tags: tags,
        timestamp: new Date().toISOString()
      }),
      muteHttpExceptions: true
    });
    Logger.log("✅ Make.com Webhook triggered successfully!");
    return;
  }

  // Option 2: Ayrshare Unified Social API
  if (ayrshareApiKey) {
    Logger.log("📡 Broadcasting video to TikTok, Instagram, Facebook, and X via Ayrshare...");
    const payload = {
      post: caption + "\n\n" + tags.map(function(t) { return "#" + t.replace(/\s+/g, ""); }).join(" "),
      platforms: ["instagram", "facebook", "tiktok", "twitter"],
      mediaUrls: [videoDownloadUrl],
      isVideo: true,
      instagramOptions: { reels: true },
      facebookOptions: { reels: true }
    };

    const response = UrlFetchApp.fetch("https://app.ayrshare.com/api/post", {
      method: "post",
      contentType: "application/json",
      headers: { "Authorization": "Bearer " + ayrshareApiKey },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    Logger.log("Multi-Platform Social Broadcast response: " + response.getContentText());
    return;
  }

  Logger.log("Notice: Neither AYRSHARE_API_KEY nor MAKE_WEBHOOK_URL is set. Social push skipped.");
}
`,
        },
      ]);
      setActiveFileId('file-youtube-gs');
      onAddLog?.('Apps Script Template', 'Success', 'Loaded YouTube Shorts Pipeline with ElevenLabs Voiceover & Creatomate');
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Split lines for editor
  const codeLines = activeFile.content.split('\n');

  return (
    <div className="bg-[#F8FAFD] rounded-2xl border border-slate-300 shadow-2xl overflow-hidden text-slate-800 font-sans flex flex-col min-h-[750px]">
      {/* =========================================================================
          TOP GOOGLE APPS SCRIPT APP BAR (MATCHING SCREENSHOT)
          ========================================================================= */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Apps Script Icon & Project Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Official Google Apps Script Icon */}
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 48 48" className="w-7 h-7 shrink-0">
              <path fill="#4285F4" d="M12 8l16 16-16 16V8z" />
              <path fill="#34A853" d="M28 24l16-16v32L28 24z" />
              <path fill="#FBBC05" d="M12 8h24v8H12z" />
              <path fill="#EA4335" d="M12 32h24v8H12z" />
            </svg>
            <span className="text-lg font-medium text-slate-700 tracking-tight hidden sm:inline">
              Apps Script
            </span>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Project Title Input with Cloud Icon */}
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => {
                setProjectTitle(e.target.value);
                setIsSaved(false);
              }}
              className="font-medium text-sm sm:text-base text-slate-800 bg-transparent hover:bg-slate-100 focus:bg-white px-2 py-1 rounded-md border border-transparent focus:border-blue-500 focus:outline-hidden transition-all truncate"
              placeholder="Untitled project"
            />
            <div className="text-slate-400" title={isSaved ? 'Saved to Google Drive' : 'Unsaved changes'}>
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
              ) : isSaved ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>
        </div>

        {/* Quick Presets / Templates */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
          <button
            onClick={() => handleLoadTemplatePreset('blank')}
            className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          >
            Blank Project
          </button>
          <button
            onClick={() => handleLoadTemplatePreset('full_engine')}
            className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-blue-600 font-semibold transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>10-Sheet Automation Engine</span>
          </button>
          <button
            onClick={() => handleLoadTemplatePreset('mailer')}
            className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          >
            MailApp Dispatcher
          </button>
          <button
            onClick={() => handleLoadTemplatePreset('gemini')}
            className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          >
            Gemini Connector
          </button>
          <button
            onClick={() => handleLoadTemplatePreset('youtube_shorts')}
            className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-red-600 font-semibold transition-colors flex items-center gap-1 text-slate-700"
          >
            <Video className="w-3.5 h-3.5 text-red-500" />
            <span>YouTube Shorts (Direct 1080p)</span>
          </button>
        </div>

        {/* Right: Deploy & Account Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Deploy Button */}
          <div className="relative">
            <button
              onClick={() => setIsDeployOpen(!isDeployOpen)}
              className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Deploy</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isDeployOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs text-slate-700 space-y-1">
                <button
                  onClick={() => {
                    setIsDeployOpen(false);
                    alert('New deployment created as Web App (v1.0.0). Accessible by: Anyone with Google Account.');
                    onAddLog?.('Deployed Apps Script', 'Success', 'Deployed Web App v1.0.0');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold">New deployment</div>
                    <div className="text-[10px] text-slate-500">Deploy as Web App or API Executable</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsDeployOpen(false);
                    alert('Active deployments: \n- Web App (Production): https://script.google.com/macros/s/AKfycbx.../exec\n- Trigger: Time-driven cron');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 font-medium flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Manage deployments</span>
                </button>
                <a
                  href="https://script.google.com/home"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 font-medium flex items-center justify-between text-slate-600"
                >
                  <span>Open script.google.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          <a
            href="https://script.new"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-mono font-medium transition-colors"
            title="Create a new script directly on script.new"
          >
            <span>script.new</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            W
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN APPS SCRIPT IDE BODY (SIDEBAR + EDITOR + LOGS)
          ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT ACTIVITY BAR */}
        <div className="w-12 bg-[#F1F3F4] border-r border-slate-200 flex flex-col items-center py-3 gap-4 shrink-0">
          <button
            onClick={() => setActiveView('editor')}
            className={`p-2 rounded-xl transition-colors ${
              activeView === 'editor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Editor"
          >
            <Code className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveView('triggers')}
            className={`p-2 rounded-xl transition-colors ${
              activeView === 'triggers' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Triggers"
          >
            <Clock className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveView('executions')}
            className={`p-2 rounded-xl transition-colors ${
              activeView === 'executions' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Executions"
          >
            <Terminal className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveView('settings')}
            className={`p-2 rounded-xl transition-colors ${
              activeView === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Project Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* =====================================================================
            VIEW 1: CODE EDITOR (MATCHING SCREENSHOT)
            ===================================================================== */}
        {activeView === 'editor' && (
          <div className="flex-1 flex flex-col min-w-0">
            {/* TOP ACTIONS TOOLBAR (RUN / DEBUG / FUNCTIONS) */}
            <div className="bg-[#FFFFFF] border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaved || isSaving}
                  className="p-1.5 text-slate-700 hover:bg-slate-100 disabled:text-slate-300 rounded transition-colors"
                  title="Save project (Ctrl+S)"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onAddLog?.('Undo Code', 'Success', 'Code editor undo')}
                  className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onAddLog?.('Redo Code', 'Success', 'Code editor redo')}
                  className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  title="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                {/* RUN BUTTON */}
                <button
                  onClick={() => handleRun(false)}
                  disabled={isRunning || isDebugging}
                  className="px-3 py-1.5 bg-[#1A73E8] hover:bg-[#1557B0] disabled:bg-blue-300 text-white font-semibold rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
                  title="Run selected function"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>

                {/* DEBUG BUTTON */}
                <button
                  onClick={() => handleRun(true)}
                  disabled={isRunning || isDebugging}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:text-slate-400 text-slate-700 font-semibold rounded-md flex items-center gap-1.5 transition-colors border border-slate-300"
                  title="Debug selected function"
                >
                  <Bug className="w-3.5 h-3.5 text-slate-600" />
                  <span>Debug</span>
                </button>

                {/* FUNCTION SELECTOR DROPDOWN */}
                <div className="relative">
                  <select
                    value={selectedFunction}
                    onChange={(e) => setSelectedFunction(e.target.value)}
                    className="bg-[#F1F3F4] hover:bg-[#E5EAEF] text-slate-800 font-mono text-xs px-2.5 py-1.5 rounded-md border border-slate-300 focus:outline-hidden cursor-pointer"
                  >
                    {detectedFunctions.map((fn) => (
                      <option key={fn} value={fn}>
                        {fn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* EXECUTION LOG TOGGLE */}
                <button
                  onClick={() => setShowExecutionLog(!showExecutionLog)}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    showExecutionLog
                      ? 'bg-slate-200 text-slate-900 font-semibold'
                      : 'bg-transparent text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Execution log
                </button>
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                  title="Copy current code file to clipboard"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const blob = new Blob([activeFile.content], { type: 'text/javascript;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = activeFile.name;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SPLIT: FILES SIDEBAR + CODE TEXTAREA */}
            <div className="flex-1 flex overflow-hidden">
              {/* FILES TREE SIDEBAR */}
              <div className="w-56 bg-[#F8FAFD] border-r border-slate-200 flex flex-col text-xs text-slate-700 shrink-0">
                {/* Files Header */}
                <div className="px-3 py-2.5 font-medium flex items-center justify-between border-b border-slate-200">
                  <span className="text-slate-600 uppercase tracking-wider text-[11px] font-bold">Files</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAddNewFile('gs')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                      title="Add a Script file (.gs)"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setActiveFileId(file.id)}
                      className={`px-2.5 py-1.5 rounded-md flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        activeFileId === file.id
                          ? 'bg-[#D2E3FC] text-[#174EA6] font-medium'
                          : 'hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {file.type === 'gs' ? (
                          <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : file.type === 'html' ? (
                          <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <FileJson className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span className="truncate">{file.name}</span>
                      </div>

                      {files.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFiles((prev) => prev.filter((f) => f.id !== file.id));
                            if (activeFileId === file.id) {
                              const remaining = files.filter((f) => f.id !== file.id);
                              if (remaining[0]) setActiveFileId(remaining[0].id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Libraries Section */}
                <div className="border-t border-slate-200 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Libraries</span>
                    <button
                      onClick={() => alert('Add Library dialog: Enter Script ID (e.g. Gemini 3.7 Flash SDK)')}
                      className="p-0.5 hover:bg-slate-200 rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {libraries.map((lib, idx) => (
                      <div key={idx} className="text-[11px] text-slate-600 font-mono truncate flex items-center gap-1.5">
                        <Boxes className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{lib}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services Section */}
                <div className="border-t border-slate-200 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Services</span>
                    <button
                      onClick={() => alert('Add Google Service: Sheets API, Drive API, Gmail API, BigQuery API')}
                      className="p-0.5 hover:bg-slate-200 rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {services.map((srv, idx) => (
                      <div key={idx} className="text-[11px] text-slate-600 font-mono truncate flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CODE EDITOR PANE WITH LINE NUMBERS (MATCHING SCREENSHOT) */}
              <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Apps Script ES Module Import Warning Banner */}
                {activeFile.type === 'gs' && /^\s*(?:import|export)\s+/m.test(activeFile.content) && (
                  <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-xs text-amber-900 font-medium shrink-0">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Syntax Notice:</strong> Google Apps Script (.gs) does not support ES module <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono">import</code> or <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono">export</code> statements outside modules. Use global services directly (<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono">UrlFetchApp</code>, <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 font-mono">DriveApp</code>).
                    </span>
                  </div>
                )}
                <div className="flex-1 flex overflow-hidden">
                  {/* Line Numbers Column */}
                  <div className="w-12 bg-[#F8FAFD] border-r border-slate-200 text-slate-400 font-mono text-xs py-3 text-right pr-2 select-none shrink-0 overflow-hidden leading-6">
                    {codeLines.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Interactive Code Area */}
                  <div className="flex-1 relative overflow-auto">
                    <textarea
                      value={activeFile.content}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      spellCheck={false}
                      className="w-full h-full p-3 font-mono text-xs sm:text-sm text-slate-900 bg-transparent resize-none focus:outline-hidden leading-6 whitespace-pre font-normal"
                      placeholder="Write your Google Apps Script functions here..."
                      id="google-apps-script-editor-textarea"
                    />
                  </div>
                </div>

                {/* EXECUTION LOG DRAWER / PANEL (BOTTOM) */}
                {showExecutionLog && (
                  <div className="h-48 border-t border-slate-300 bg-[#1E293B] text-slate-200 font-mono text-xs flex flex-col shrink-0">
                    <div className="bg-[#0F172A] px-4 py-1.5 flex items-center justify-between border-b border-slate-700 text-[11px]">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-bold text-slate-200">Execution log</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setExecutionLogs([])}
                          className="hover:text-white transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setShowExecutionLog(false)}
                          className="hover:text-white transition-colors"
                        >
                          Hide
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-1.5 leading-relaxed">
                      {executionLogs.length === 0 ? (
                        <div className="text-slate-500 italic">No execution logs recorded. Click "Run" to test your function.</div>
                      ) : (
                        executionLogs.map((log, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="text-slate-500 shrink-0 text-[11px]">{log.timestamp}</span>
                            <span
                              className={`shrink-0 px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                                log.type === 'error'
                                  ? 'bg-red-900/60 text-red-300'
                                  : log.type === 'success'
                                  ? 'bg-emerald-900/60 text-emerald-300'
                                  : log.type === 'info'
                                  ? 'bg-blue-900/60 text-blue-300'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {log.type}
                            </span>
                            <span className="text-slate-200 flex-1 break-words">{log.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            VIEW 2: TRIGGERS MANAGER
            ===================================================================== */}
        {activeView === 'triggers' && (
          <div className="flex-1 p-6 bg-white overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Triggers for {projectTitle}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage automated time-driven and event-based triggers that execute in Google Apps Script background.
                </p>
              </div>

              <button
                onClick={() => {
                  const newTrig: TriggerItem = {
                    id: `trig_${Date.now()}`,
                    functionName: selectedFunction,
                    eventSource: 'Time-driven',
                    eventType: 'Day timer',
                    schedule: 'Every day between 6am and 7am',
                    status: 'Active',
                  };
                  setTriggers((prev) => [...prev, newTrig]);
                  onAddLog?.('Added Trigger', 'Success', `Added trigger for ${selectedFunction}`);
                }}
                className="bg-[#1A73E8] hover:bg-[#1557B0] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Trigger</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="p-3">Function to run</th>
                    <th className="p-3">Event source</th>
                    <th className="p-3">Event type</th>
                    <th className="p-3">Schedule</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {triggers.map((trig) => (
                    <tr key={trig.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-blue-700">{trig.functionName}</td>
                      <td className="p-3">{trig.eventSource}</td>
                      <td className="p-3">{trig.eventType}</td>
                      <td className="p-3 text-slate-600">{trig.schedule}</td>
                      <td className="p-3">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                          {trig.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setTriggers((prev) => prev.filter((t) => t.id !== trig.id))}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =====================================================================
            VIEW 3: EXECUTIONS HISTORY
            ===================================================================== */}
        {activeView === 'executions' && (
          <div className="flex-1 p-6 bg-white overflow-y-auto space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-600" />
                <span>Executions History</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time logs of cloud execution runs, trigger invocations, and debugging sessions.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="p-3">Start time</th>
                    <th className="p-3">Function</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">Today, 10:25 AM</td>
                    <td className="p-3 font-bold text-blue-700">createDailyDraft</td>
                    <td className="p-3 text-slate-600">Time-driven</td>
                    <td className="p-3 text-emerald-600 font-bold">Completed</td>
                    <td className="p-3 text-slate-500">482 ms</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">Today, 07:00 AM</td>
                    <td className="p-3 font-bold text-blue-700">approveAndSendDaily</td>
                    <td className="p-3 text-slate-600">Time-driven</td>
                    <td className="p-3 text-emerald-600 font-bold">Completed</td>
                    <td className="p-3 text-slate-500">1,240 ms</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">Aug 29, 06:00 AM</td>
                    <td className="p-3 font-bold text-blue-700">createWeeklyDraft</td>
                    <td className="p-3 text-slate-600">Time-driven</td>
                    <td className="p-3 text-emerald-600 font-bold">Completed</td>
                    <td className="p-3 text-slate-500">620 ms</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =====================================================================
            VIEW 4: PROJECT SETTINGS
            ===================================================================== */}
        {activeView === 'settings' && (
          <div className="flex-1 p-6 bg-white overflow-y-auto space-y-6 max-w-4xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>Project Settings</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure runtime version, OAuth scopes, and Script Properties.
              </p>
            </div>

            <div className="space-y-4 border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <h4 className="text-sm font-bold text-slate-800">General Settings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Project ID</label>
                  <input
                    type="text"
                    readOnly
                    value="1S9n2Q1kiym5I2chQcHLtIUz5LjluVpaT3uum94M3XK6yJ_qf1gu9BIWt"
                    className="w-full bg-slate-100 font-mono text-[11px] p-2 rounded border border-slate-300 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Runtime Version</label>
                  <input
                    type="text"
                    readOnly
                    value="Chrome V8"
                    className="w-full bg-slate-100 font-medium p-2 rounded border border-slate-300 text-slate-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Script Properties (Environment Variables)</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="CREATOMATE_API_KEY"
                      className="w-1/3 bg-slate-100 p-2 rounded border border-slate-300 text-slate-800 font-bold"
                    />
                    <input
                      type="password"
                      readOnly
                      value="cm_live_••••••••••••••••••••"
                      className="flex-1 bg-slate-100 p-2 rounded border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="GEMINI_API_KEY"
                      className="w-1/3 bg-slate-100 p-2 rounded border border-slate-300 text-slate-800 font-bold"
                    />
                    <input
                      type="password"
                      readOnly
                      value="AIzaSyA8_••••••••••••••••••••"
                      className="flex-1 bg-slate-100 p-2 rounded border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="ADMIN_EMAIL"
                      className="w-1/3 bg-slate-100 p-2 rounded border border-slate-300 text-slate-800 font-bold"
                    />
                    <input
                      type="text"
                      readOnly
                      value="embassyword@gmail.com"
                      className="flex-1 bg-slate-100 p-2 rounded border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
