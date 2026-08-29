import React, { useState, useEffect } from 'react';
import {
  Database,
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FolderSync,
  Mail,
  Share2,
  Code,
  BarChart3,
  Settings,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Send,
  Trash2,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight,
  Download,
  Flame,
  FileSpreadsheet,
  BookOpen,
  HardDrive,
  Folder,
  FolderPlus,
  UploadCloud,
  FileCode,
  Cloud,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  UserMinus,
  Ban,
  Tag,
  ShieldCheck,
  MailCheck,
  LogOut,
  Loader2,
} from 'lucide-react';
import {
  Topic,
  Newsletter,
  Subscriber,
  SubscriberGroup,
  EmailLog,
  VideoItem,
  SystemLog,
  AppSettings,
  TopicStatus,
} from '../types';
import {
  saveNewsletterPackageToDrive,
  DriveFolderStructure,
  fetchDriveAbout,
  listDriveFiles,
  deleteDriveFile,
  createOrGetDriveFolder,
  DriveQuotaInfo,
  DriveFileItem,
} from '../services/googleDrive';
import { generateGoogleAppsScriptCode } from '../services/gasExporter';
import { initAuth, googleSignIn, logout as googleLogout, getAccessToken } from '../services/firebaseAuth';
import { InfographicCanvas } from './InfographicCanvas';
import { VeoVideoPlayer } from './VeoVideoPlayer';
import { GoogleWorkspaceHub } from './GoogleWorkspaceHub';
import { NotebookLlmWorkspace } from './NotebookLlmWorkspace';
import { GoogleFlowCanvas } from './GoogleFlowCanvas';
import { NewsletterTemplateStudio } from './NewsletterTemplateStudio';

interface AdminDashboardProps {
  topics: Topic[];
  newsletters: Newsletter[];
  subscribers: Subscriber[];
  subscriberGroups?: SubscriberGroup[];
  emailLogs: EmailLog[];
  videos: VideoItem[];
  systemLogs: SystemLog[];
  settings: AppSettings;
  currentUser?: { email: string; role: string; name: string } | null;
  onSignOut?: () => void;
  onAddTopic: (topic: Partial<Topic>) => void;
  onUpdateTopic: (id: string, updates: Partial<Topic>) => void;
  onDeleteTopic: (id: string) => void;
  onUpdateNewsletter: (id: string, updates: Partial<Newsletter>) => void;
  onProcessNextTopic: () => Promise<void>;
  onGenerateSpecificTopic: (topic: Topic) => Promise<void>;
  onPublishNewsletter: (id: string) => void;
  onSendEmailCampaign: (newsletterId: string, batchSize: number, targetGroup?: string) => Promise<void>;
  onSendTestEmail: (newsletterId: string, testEmail: string) => void;
  onCreateSubscriberGroup?: (group: { Name: string; Description: string; Color: string }) => void;
  onAssignSubscriberGroup?: (subscriberId: string, groupName: string) => void;
  onDeleteSubscriber?: (subscriberId: string) => void;
  onToggleSubscriberStatus?: (subscriberId: string, newStatus?: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED') => void;
  onAddSubscriber?: (subData: { Name: string; Email: string; Group?: string }) => void;
  onCreateAndSendTestNewsletter?: () => Promise<void> | void;
  onUpdateSettings: (settings: AppSettings) => void;
  onNavigateToPublic: (view: string, slug?: string) => void;
  isProcessing: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  topics,
  newsletters,
  subscribers,
  subscriberGroups = [],
  emailLogs,
  videos,
  systemLogs,
  settings,
  currentUser,
  onSignOut,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
  onUpdateNewsletter,
  onProcessNextTopic,
  onGenerateSpecificTopic,
  onPublishNewsletter,
  onSendEmailCampaign,
  onSendTestEmail,
  onCreateSubscriberGroup,
  onAssignSubscriberGroup,
  onDeleteSubscriber,
  onToggleSubscriberStatus,
  onAddSubscriber,
  onCreateAndSendTestNewsletter,
  onUpdateSettings,
  onNavigateToPublic,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'workspace'
    | 'templates'
    | 'subscribers'
    | 'notebook'
    | 'flow'
    | 'topics'
    | 'newsletters'
    | 'sheets'
    | 'drive'
    | 'email'
    | 'social'
    | 'gas'
    | 'analytics'
    | 'logs'
    | 'settings'
  >('overview');

  // Modals & Sub-states
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [newTopicData, setNewTopicData] = useState({
    Topic: '',
    Scripture: '',
    Theme: 'Faith & Prayer',
    Notes: '',
    Priority: 'HIGH' as 'HIGH' | 'MEDIUM' | 'LOW',
    PublishDate: new Date().toISOString().split('T')[0],
  });

  const [selectedNewsletterForReview, setSelectedNewsletterForReview] = useState<Newsletter | null>(
    null
  );
  const [selectedReviewTab, setSelectedReviewTab] = useState<
    'article' | 'social' | 'youtube' | 'prompts' | 'infographic'
  >('article');

  // Google Sheets Simulator active tab
  const [activeSheetTab, setActiveSheetTab] = useState<
    | 'Topics'
    | 'Newsletters'
    | 'Subscribers'
    | 'Publishing'
    | 'Videos'
    | 'Social'
    | 'EmailLog'
    | 'Analytics'
    | 'Settings'
    | 'Logs'
  >('Topics');

  // Google Drive state
  const [driveUser, setDriveUser] = useState<any>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [savedDriveResults, setSavedDriveResults] = useState<{
    [newsletterId: string]: DriveFolderStructure;
  }>({});
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveQuota, setDriveQuota] = useState<DriveQuotaInfo | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [driveSearchTerm, setDriveSearchTerm] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folderHistory, setFolderHistory] = useState<{ id?: string; name: string }[]>([
    { id: undefined, name: 'Drive Root' },
  ]);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState('');
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const [syncingAllDrive, setSyncingAllDrive] = useState(false);
  const [driveViewMode, setDriveViewMode] = useState<'packages' | 'explorer'>('packages');

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setDriveUser(user);
        setDriveToken(token);
        loadDriveData(token, currentFolderId);
      },
      () => {
        setDriveUser(null);
        setDriveToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadDriveData = async (token?: string, folderId?: string, search?: string) => {
    setIsDriveLoading(true);
    try {
      const quota = await fetchDriveAbout();
      if (quota) setDriveQuota(quota);
      const files = await listDriveFiles(folderId, search);
      setDriveFiles(files);
    } catch (err) {
      console.warn('Error loading drive data:', err);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleFolderClick = (folder: DriveFileItem) => {
    setCurrentFolderId(folder.id);
    setFolderHistory((prev) => [...prev, { id: folder.id, name: folder.name }]);
    loadDriveData(driveToken || undefined, folder.id);
  };

  const handleNavigateBreadcrumb = (index: number) => {
    const target = folderHistory[index];
    const newHistory = folderHistory.slice(0, index + 1);
    setFolderHistory(newHistory);
    setCurrentFolderId(target.id);
    loadDriveData(driveToken || undefined, target.id);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderNameInput.trim()) return;
    try {
      await createOrGetDriveFolder(newFolderNameInput.trim(), currentFolderId);
      setNewFolderNameInput('');
      setShowCreateFolderModal(false);
      await loadDriveData(driveToken || undefined, currentFolderId);
    } catch (e) {
      console.error('Error creating folder:', e);
    }
  };

  const handleConfirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeletingFile(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      setDriveFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setFileToDelete(null);
    } catch (err) {
      console.error('Failed to delete file:', err);
    } finally {
      setIsDeletingFile(false);
    }
  };

  const handleSyncAllToDrive = async () => {
    setSyncingAllDrive(true);
    try {
      for (const nl of newsletters) {
        const result = await saveNewsletterPackageToDrive(nl);
        setSavedDriveResults((prev) => ({
          ...prev,
          [nl.NewsletterID]: result.structure,
        }));
      }
      await loadDriveData(driveToken || undefined, currentFolderId);
    } catch (e) {
      console.error('Sync all error:', e);
    } finally {
      setSyncingAllDrive(false);
    }
  };

  // Email campaign states
  const [emailProgress, setEmailProgress] = useState<{
    newsletterId: string;
    sent: number;
    total: number;
    isRunning: boolean;
  } | null>(null);
  const [emailPreviewMode, setEmailPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedNlForEmail, setSelectedNlForEmail] = useState<string>(
    newsletters[0]?.NewsletterID || ''
  );
  const [selectedCampaignGroup, setSelectedCampaignGroup] = useState<string>('ALL');
  const [testEmailInput, setTestEmailInput] = useState(settings.TestEmail || 'omicroservices@gmail.com');
  const [isSendingAdminTest, setIsSendingAdminTest] = useState(false);
  const [isAdminSendingCampaign, setIsAdminSendingCampaign] = useState(false);
  const [adminTestReceipt, setAdminTestReceipt] = useState<{
    recipient: string;
    timestamp: string;
  } | null>(null);
  const [adminCampaignReceipt, setAdminCampaignReceipt] = useState<{
    groupName: string;
    count: number;
    timestamp: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<'gs' | 'html' | null>(null);

  // Subscriber group and roster management states
  const [subscriberSearchTerm, setSubscriberSearchTerm] = useState<string>('');
  const [subscriberGroupFilter, setSubscriberGroupFilter] = useState<string>('ALL');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState<boolean>(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [newSubscriberData, setNewSubscriberData] = useState<{
    Name: string;
    Email: string;
    Group: string;
  }>({
    Name: '',
    Email: '',
    Group: 'Weekly Devotional Readers',
  });
  const [newGroupData, setNewGroupData] = useState<{
    Name: string;
    Description: string;
    Color: string;
  }>({
    Name: '',
    Description: '',
    Color: 'indigo',
  });

  // Summary Metrics calculations
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter((s) => s.Status === 'ACTIVE').length;
  const totalGroups = subscriberGroups.length;
  const publishedCount = newsletters.filter((n) => n.Status === 'PUBLISHED').length;
  const pendingTopicsCount = topics.filter(
    (t) => t.Status === 'PENDING' || t.Status === 'AWAITING_APPROVAL'
  ).length;
  const draftCount = newsletters.filter((n) => n.Status === 'DRAFT' || n.Status === 'AWAITING_APPROVAL').length;
  const totalEmailsSent = emailLogs.filter((e) => e.Status === 'SENT').length;
  const totalVideos = videos.length;

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupData.Name.trim()) return;
    if (onCreateSubscriberGroup) {
      onCreateSubscriberGroup(newGroupData);
    }
    setShowCreateGroupModal(false);
    setNewGroupData({ Name: '', Description: '', Color: 'indigo' });
  };

  const handleCreateSubscriberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubscriberData.Email.trim()) return;
    if (onAddSubscriber) {
      onAddSubscriber(newSubscriberData);
    }
    setShowAddSubscriberModal(false);
    setNewSubscriberData({
      Name: '',
      Email: '',
      Group: 'Weekly Devotional Readers',
    });
  };

  const handleConfirmDeleteSubscriber = () => {
    if (!subscriberToDelete) return;
    if (onDeleteSubscriber) {
      onDeleteSubscriber(subscriberToDelete.SubscriberID);
    }
    setSubscriberToDelete(null);
  };

  const handleAddTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicData.Topic || !newTopicData.Scripture) return;
    onAddTopic(newTopicData);
    setShowAddTopicModal(false);
    setNewTopicData({
      Topic: '',
      Scripture: '',
      Theme: 'Faith & Prayer',
      Notes: '',
      Priority: 'HIGH',
      PublishDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleGoogleDriveSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setDriveUser(res.user);
        setDriveToken(res.accessToken);
      }
    } catch (e) {
      console.error('Google Sign In error:', e);
    }
  };

  const handleSaveNewsletterToDrive = async (nl: Newsletter) => {
    setIsSavingToDrive(true);
    try {
      const result = await saveNewsletterPackageToDrive(nl);
      setSavedDriveResults((prev) => ({
        ...prev,
        [nl.NewsletterID]: result.structure,
      }));
    } catch (e) {
      console.error('Drive save error:', e);
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const gasCode = generateGoogleAppsScriptCode();

  const handleCopyGas = (type: 'gs' | 'html') => {
    const text = type === 'gs' ? gasCode.codeGs : gasCode.indexHtml;
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const activeNewsletter =
    newsletters.find((n) => n.NewsletterID === selectedNlForEmail) || newsletters[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* 1. TOP HEADER & METRICS BAR */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-white tracking-tight">
                  WORD EMBASSY
                </h1>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
                  Google-Stack Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1 Topic in Sheets → Complete Multimedia Publication Package
              </p>
            </div>
          </div>

          {/* Quick Triggers */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onCreateAndSendTestNewsletter?.()}
              disabled={isProcessing}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
              id="admin-create-send-test-btn"
              title="Instantly generate a test devotional and dispatch it to active subscribers & embassyword@gmail.com"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Dispatching...' : 'Create & Send Test Newsletter'}</span>
            </button>

            <button
              onClick={() => onProcessNextTopic()}
              disabled={isProcessing}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95"
              id="admin-process-next-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Processing with Gemini...' : 'Process Next Topic (AI)'}</span>
            </button>

            <button
              onClick={() => setShowAddTopicModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              id="admin-add-topic-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Topic</span>
            </button>

            <button
              onClick={() => onNavigateToPublic('home')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              id="admin-view-reader-site-btn"
            >
              <span>View Public Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {currentUser && onSignOut && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[10px] border border-emerald-500/40">
                    {currentUser.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-[11px] font-semibold text-white leading-tight">{currentUser.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono leading-tight truncate max-w-[120px]">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign out of Google Stack Engine Admin"
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 p-2 rounded-lg text-xs transition-colors flex items-center gap-1"
                  id="admin-sign-out-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* High-level Metric Pills */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-4 overflow-x-auto text-xs">
          <div className="flex items-center gap-2 shrink-0 bg-slate-800/80 px-2.5 py-1 rounded-md border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">Lead Editor & Sender:</span>
            <strong className="text-amber-300 font-mono">embassyword@gmail.com</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400">Total Subscribers:</span>
            <strong className="text-white font-mono">{totalSubscribers.toLocaleString()}</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400">Active Subscribers:</span>
            <strong className="text-emerald-400 font-mono">{activeSubscribers.toLocaleString()}</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400">Subscriber Groups:</span>
            <strong className="text-indigo-400 font-mono">{totalGroups}</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400">Published Newsletters:</span>
            <strong className="text-amber-400 font-mono">{publishedCount}</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400">Pending Topics:</span>
            <strong className="text-sky-400 font-mono">{pendingTopicsCount}</strong>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-400">Emails Sent:</span>
            <strong className="text-indigo-400 font-mono">{totalEmailsSent.toLocaleString()}</strong>
          </div>
        </div>
      </header>

      {/* 2. SUB-NAVBAR TABS */}
      <nav className="bg-slate-950/80 border-b border-slate-800 px-4 overflow-x-auto select-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: Layers },
            { id: 'templates', label: '✦ Newsletter Templates & Broadcast', icon: Sparkles },
            { id: 'workspace', label: 'Google Workspace (Sheets/Docs/Forms/Tasks)', icon: FileSpreadsheet },
            { id: 'subscribers', label: `Subscribers & Groups (${subscribers.length})`, icon: Users },
            { id: 'notebook', label: 'NotebookLM Studio', icon: BookOpen },
            { id: 'flow', label: 'Google Flow Pipeline', icon: Sparkles },
            { id: 'drive', label: 'Google Drive Storage', icon: FolderSync },
            { id: 'topics', label: `Topics (${topics.length})`, icon: FileText },
            { id: 'newsletters', label: `Newsletters (${newsletters.length})`, icon: BookOpen },
            { id: 'sheets', label: '10-Sheets Schema', icon: FileSpreadsheet },
            { id: 'email', label: 'Email Campaigns', icon: Mail },
            { id: 'social', label: 'Social & Video Studio', icon: Share2 },
            { id: 'gas', label: 'Apps Script (.gs)', icon: Code },
            { id: 'analytics', label: 'Analytics & Looker', icon: BarChart3 },
            { id: 'logs', label: `Logs (${systemLogs.length})`, icon: AlertTriangle },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                id={`admin-tab-${tab.id}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* =========================================================================
            TAB 1: OVERVIEW & PIPELINE VISUALIZER
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Visual Pipeline Banner */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">
                    Google Stack Automation Pipeline
                  </h2>
                  <p className="text-xs text-slate-400">
                    Continuous automated synchronization between Google Sheets, Gemini, Drive, YouTube, and Mail
                  </p>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Engine Online
                </span>
              </div>

              {/* 7-Step Pipeline Diagram */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
                {[
                  { step: '1. Topic In Sheet', desc: 'Google Sheets DB', icon: FileSpreadsheet, active: true },
                  { step: '2. Gemini 3.7 Flash', desc: 'Theological Schema', icon: Sparkles, active: true },
                  { step: '3. Media Studio', desc: 'Image, Info, Veo', icon: Layers, active: true },
                  { step: '4. Editorial Review', desc: 'Approval Guardrail', icon: CheckCircle2, active: true },
                  { step: '5. Google Drive', desc: 'Auto-Organized Year/Month', icon: FolderSync, active: true },
                  { step: '6. Batch Email', desc: 'Gmail / MailApp', icon: Mail, active: true },
                  { step: '7. YouTube & Web', desc: 'Auto-Published', icon: Share2, active: true },
                ].map((item, idx) => {
                  const StepIcon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80 text-center space-y-1.5"
                    >
                      <StepIcon className="w-5 h-5 text-amber-400 mx-auto" />
                      <div className="font-bold text-xs text-white leading-tight">{item.step}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Recent Pipeline Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Newsletters awaiting action */}
              <div className="lg:col-span-2 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Active Publication Queue
                  </h3>
                  <button
                    onClick={() => setActiveTab('newsletters')}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    View All Pipeline ({newsletters.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {newsletters.slice(0, 4).map((nl) => (
                    <div
                      key={nl.NewsletterID}
                      className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              nl.Status === 'PUBLISHED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {nl.Status}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {nl.ScriptureReference}
                          </span>
                        </div>
                        <h4 className="font-serif text-sm font-bold text-white">{nl.Title}</h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedNewsletterForReview(nl);
                            setActiveTab('newsletters');
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-xs text-white px-3 py-1.5 rounded-lg border border-slate-600 font-medium"
                        >
                          Inspect Package
                        </button>
                        {nl.Status !== 'PUBLISHED' && (
                          <button
                            onClick={() => onPublishNewsletter(nl.NewsletterID)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-xs text-white px-3 py-1.5 rounded-lg font-bold"
                          >
                            Approve & Publish
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Latest Execution Logs */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Live System Logs
                  </h3>
                  <button
                    onClick={() => setActiveTab('logs')}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    All Logs
                  </button>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  {systemLogs.slice(0, 5).map((log, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700/60 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-amber-400">{log.Function}</span>
                        <span
                          className={
                            log.Status === 'SUCCESS' ? 'text-emerald-400 font-bold' : 'text-rose-400'
                          }
                        >
                          {log.Status}
                        </span>
                      </div>
                      <p className="text-slate-300 line-clamp-2">{log.Message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: NEWSLETTER TEMPLATES STUDIO & BROADCAST ENGINE
            ========================================================================= */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <NewsletterTemplateStudio
              newsletters={newsletters}
              subscribers={subscribers}
              subscriberGroups={subscriberGroups}
              settings={settings}
              onSendEmailCampaign={onSendEmailCampaign}
              onSendTestEmail={onSendTestEmail}
            />
          </div>
        )}

        {/* =========================================================================
            TAB: GOOGLE WORKSPACE HUB (Sheets, Docs, Forms, Tasks)
            ========================================================================= */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            <GoogleWorkspaceHub
              topics={topics}
              newsletters={newsletters}
              subscribers={subscribers}
            />
          </div>
        )}

        {/* =========================================================================
            TAB: NOTEBOOKLM THEOLOGICAL RESEARCH STUDIO
            ========================================================================= */}
        {activeTab === 'notebook' && (
          <div className="space-y-6">
            <NotebookLlmWorkspace
              topics={topics}
              newsletters={newsletters}
            />
          </div>
        )}

        {/* =========================================================================
            TAB: GOOGLE FLOW VISUAL AUTOMATION CANVAS
            ========================================================================= */}
        {activeTab === 'flow' && (
          <div className="space-y-6">
            <GoogleFlowCanvas />
          </div>
        )}

        {/* =========================================================================
            TAB: SUBSCRIBERS & AUDIENCE GROUPS MANAGER
            ========================================================================= */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Subscribers & Audience Groups</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Organize ministerial cohorts, manage group assignments, and segment weekly devotional campaigns.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddSubscriberModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  id="admin-add-subscriber-btn"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add Subscriber</span>
                </button>

                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  id="admin-create-group-btn"
                >
                  <Tag className="w-4 h-4" />
                  <span>Create Group</span>
                </button>
              </div>
            </div>

            {/* Lead Editor & Sender Announcement Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/70 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-bold flex items-center gap-2">
                    <span>Lead Editor & Campaign Sender:</span>
                    <span className="font-mono text-amber-300">embassyword@gmail.com</span>
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                      Master Console
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    All email campaigns, test dispatches, and ministerial notifications originate from embassyword@gmail.com.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('email');
                    setTestEmailInput('embassyword@gmail.com');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1"
                >
                  <MailCheck className="w-3.5 h-3.5" />
                  <span>Open Email Dispatcher</span>
                </button>
              </div>
            </div>

            {/* Groups Grid Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  <span>Subscriber Groups & Cohorts ({subscriberGroups.length})</span>
                </h3>
                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  + Add New Group
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriberGroups.map((group) => {
                  const memberCount = subscribers.filter((s) => s.Group === group.Name).length;
                  const activeCount = subscribers.filter(
                    (s) => s.Group === group.Name && s.Status === 'ACTIVE'
                  ).length;
                  const isSelected = subscriberGroupFilter === group.Name;

                  return (
                    <div
                      key={group.GroupID}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                          : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-full shrink-0 ${
                              group.Color === 'indigo'
                                ? 'bg-indigo-400'
                                : group.Color === 'amber'
                                ? 'bg-amber-400'
                                : group.Color === 'emerald'
                                ? 'bg-emerald-400'
                                : group.Color === 'sky'
                                ? 'bg-sky-400'
                                : group.Color === 'rose'
                                ? 'bg-rose-400'
                                : group.Color === 'purple'
                                ? 'bg-purple-400'
                                : 'bg-teal-400'
                            }`}
                          />
                          <h4 className="font-bold text-white text-sm">{group.Name}</h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                          {group.GroupID}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 min-h-[32px] line-clamp-2 mb-3">
                        {group.Description}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-700/80">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Members:</span>
                          <strong className="text-white font-mono">{memberCount}</strong>
                          <span className="text-emerald-400 font-mono">({activeCount} active)</span>
                        </div>
                        <button
                          onClick={() =>
                            setSubscriberGroupFilter(isSelected ? 'ALL' : group.Name)
                          }
                          className={`text-xs px-2.5 py-1 rounded-md font-bold transition-colors ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isSelected ? 'Viewing' : 'Filter'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subscribers Table with Filter & Reassignment */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-lg space-y-4 p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-white">Subscriber Roster</h3>
                  <span className="bg-slate-900 text-slate-400 text-xs px-2.5 py-0.5 rounded-full font-mono">
                    {subscribers.length} total
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, email, ID..."
                      value={subscriberSearchTerm}
                      onChange={(e) => setSubscriberSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 text-white pl-9 pr-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Group Filter Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={subscriberGroupFilter}
                      onChange={(e) => setSubscriberGroupFilter(e.target.value)}
                      className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
                    >
                      <option value="ALL">All Groups ({subscribers.length})</option>
                      {subscriberGroups.map((g) => (
                        <option key={g.GroupID} value={g.Name}>
                          {g.Name} ({subscribers.filter((s) => s.Group === g.Name).length})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Subscriber ID</th>
                      <th className="p-3.5">Name & Email</th>
                      <th className="p-3.5">Assigned Group</th>
                      <th className="p-3.5">Source</th>
                      <th className="p-3.5">Date Subscribed</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Sent Count</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {subscribers
                      .filter((s) => {
                        const term = subscriberSearchTerm.toLowerCase();
                        const matchesSearch =
                          s.Name.toLowerCase().includes(term) ||
                          s.Email.toLowerCase().includes(term) ||
                          s.SubscriberID.toLowerCase().includes(term);
                        const matchesGroup =
                          subscriberGroupFilter === 'ALL' ||
                          (s.Group || 'Weekly Devotional Readers') === subscriberGroupFilter;
                        return matchesSearch && matchesGroup;
                      })
                      .map((sub) => {
                        const isLeadEditor = sub.Email === 'embassyword@gmail.com';
                        const isActive = sub.Status === 'ACTIVE';

                        return (
                          <tr
                            key={sub.SubscriberID}
                            className={`hover:bg-slate-700/30 transition-colors ${
                              isLeadEditor ? 'bg-amber-500/5' : ''
                            }`}
                          >
                            <td className="p-3.5 font-mono">
                              <div className="flex items-center gap-1.5">
                                <span className={isLeadEditor ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                                  {sub.SubscriberID}
                                </span>
                                {isLeadEditor && (
                                  <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-bold">
                                    LEAD
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                <span>{sub.Name}</span>
                              </div>
                              <div className="text-slate-300 text-xs font-mono">{sub.Email}</div>
                            </td>
                            <td className="p-3.5">
                              {/* Inline Group Re-assignment Dropdown */}
                              <select
                                value={sub.Group || 'Weekly Devotional Readers'}
                                onChange={(e) => {
                                  if (onAssignSubscriberGroup) {
                                    onAssignSubscriberGroup(sub.SubscriberID, e.target.value);
                                  }
                                }}
                                className="bg-slate-900 text-amber-300 font-semibold border border-slate-700 text-xs px-2.5 py-1 rounded-lg focus:outline-none focus:border-amber-400 cursor-pointer"
                              >
                                {subscriberGroups.map((g) => (
                                  <option key={g.GroupID} value={g.Name}>
                                    {g.Name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-3.5 text-slate-400">{sub.Source}</td>
                            <td className="p-3.5 text-slate-400 font-mono">{sub.DateSubscribed}</td>
                            <td className="p-3.5">
                              <button
                                onClick={() => {
                                  if (onToggleSubscriberStatus) {
                                    onToggleSubscriberStatus(sub.SubscriberID);
                                  }
                                }}
                                title={isActive ? 'Click to Suspend subscriber' : 'Click to Reactivate subscriber'}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30'
                                }`}
                              >
                                {isActive ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>ACTIVE</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3 h-3 text-rose-400" />
                                    <span>SUSPENDED</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="p-3.5 text-center font-mono text-slate-300 font-bold">
                              {sub.SendCount}
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Suspend / Reactivate Action */}
                                <button
                                  onClick={() => {
                                    if (onToggleSubscriberStatus) {
                                      onToggleSubscriberStatus(sub.SubscriberID);
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                                    isActive
                                      ? 'bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border-slate-700 hover:border-rose-700/50'
                                      : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border-emerald-700/50'
                                  }`}
                                  title={isActive ? 'Suspend subscriber' : 'Reactivate subscriber'}
                                >
                                  {isActive ? (
                                    <>
                                      <UserX className="w-3.5 h-3.5 text-rose-400" />
                                      <span>Suspend</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Reactivate</span>
                                    </>
                                  )}
                                </button>

                                {/* Delete Action */}
                                <button
                                  onClick={() => setSubscriberToDelete(sub)}
                                  className="p-1.5 bg-slate-900 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 rounded-lg text-xs transition-colors flex items-center gap-1"
                                  title="Delete subscriber permanently"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="sr-only sm:not-sr-only sm:inline">Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: TOPICS MANAGER (GOOGLE SHEETS TOPICS)
            ========================================================================= */}
        {activeTab === 'topics' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">
                  Google Sheets: Topics Control Tab
                </h2>
                <p className="text-xs text-slate-400">
                  Manage the primary queue of Christian devotional themes, scripture references, and editorial notes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddTopicModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Topic</span>
                </button>
                <button
                  onClick={() => onProcessNextTopic()}
                  disabled={isProcessing}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Generate Next with Gemini</span>
                </button>
              </div>
            </div>

            {/* Topics Table */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Topic ID</th>
                      <th className="p-4">Topic & Scripture</th>
                      <th className="p-4">Theme</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Target Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {topics.map((t) => (
                      <tr key={t.TopicID} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 font-mono text-slate-400">{t.TopicID}</td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{t.Topic}</div>
                          <div className="text-amber-400 text-xs font-serif">{t.Scripture}</div>
                          {t.Notes && <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{t.Notes}</div>}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-900 px-2 py-1 rounded text-slate-300 font-medium">
                            {t.Theme}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.Priority === 'HIGH'
                                ? 'bg-rose-500/20 text-rose-300'
                                : t.Priority === 'MEDIUM'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {t.Priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              t.Status === 'PUBLISHED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : t.Status === 'AWAITING_APPROVAL'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : t.Status === 'GENERATING'
                                ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {t.Status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-300">{t.PublishDate}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {t.Status !== 'PUBLISHED' && (
                              <button
                                onClick={() => onGenerateSpecificTopic(t)}
                                disabled={isProcessing}
                                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded text-[11px] font-bold transition-colors"
                                title="Run Gemini AI generation on this specific topic"
                              >
                                Generate AI Package
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteTopic(t.TopicID)}
                              className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                              title="Delete Topic"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: NEWSLETTERS PIPELINE & REVIEW CENTER
            ========================================================================= */}
        {activeTab === 'newsletters' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">
                  Newsletter Pipeline & Approval Center
                </h2>
                <p className="text-xs text-slate-400">
                  Inspect generated articles, approve drafts, trigger media assets, and dispatch email campaigns.
                </p>
              </div>
            </div>

            {/* Newsletters Table */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Title & Scripture</th>
                      <th className="p-4">Theme</th>
                      <th className="p-4">Editorial Status</th>
                      <th className="p-4">Email Status</th>
                      <th className="p-4">Publish Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {newsletters.map((nl) => (
                      <tr key={nl.NewsletterID} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 font-mono text-slate-400">{nl.NewsletterID}</td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{nl.Title}</div>
                          <div className="text-amber-400 text-xs font-serif">{nl.ScriptureReference}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-900 px-2 py-1 rounded text-slate-300 font-medium">
                            {nl.Theme}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              nl.Status === 'PUBLISHED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            }`}
                          >
                            {nl.Status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              nl.EmailStatus === 'SENT'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {nl.EmailStatus} ({nl.RecipientsSent} sent)
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-300">{nl.PublishDate}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedNewsletterForReview(nl)}
                              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Package</span>
                            </button>

                            {nl.Status !== 'PUBLISHED' ? (
                              <button
                                onClick={() => onPublishNewsletter(nl.NewsletterID)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold shadow-xs"
                              >
                                Approve & Publish
                              </button>
                            ) : (
                              <button
                                onClick={() => onNavigateToPublic('newsletter', nl.Slug)}
                                className="text-slate-400 hover:text-amber-400 px-2 py-1 text-xs"
                              >
                                View Web Page
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Newsletter Full Inspector Modal */}
            {selectedNewsletterForReview && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                  {/* Modal Header */}
                  <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-400 font-bold">
                          {selectedNewsletterForReview.NewsletterID}
                        </span>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {selectedNewsletterForReview.Status}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white mt-1">
                        {selectedNewsletterForReview.Title}
                      </h3>
                      <p className="text-xs text-slate-400 font-serif">
                        {selectedNewsletterForReview.ScriptureReference} — “
                        {selectedNewsletterForReview.ScriptureText}”
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedNewsletterForReview(null)}
                      className="text-slate-400 hover:text-white text-xl font-bold p-2"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Inspector Tabs */}
                  <div className="bg-slate-950/60 px-6 border-b border-slate-800 flex items-center gap-2 pt-2">
                    {[
                      { id: 'article', label: 'Article & Teaching' },
                      { id: 'social', label: 'Social Media Posts' },
                      { id: 'youtube', label: 'YouTube Short & Script' },
                      { id: 'prompts', label: 'AI Prompts (Veo/Image)' },
                      { id: 'infographic', label: 'Infographic Preview' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setSelectedReviewTab(st.id as any)}
                        className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                          selectedReviewTab === st.id
                            ? 'border-amber-400 text-amber-300'
                            : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
                    {selectedReviewTab === 'article' && (
                      <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-xs text-amber-400 font-bold uppercase block mb-1">
                            Opening:
                          </span>
                          <p className="text-slate-300 leading-relaxed">
                            {selectedNewsletterForReview.Opening}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-amber-400 font-bold uppercase block mb-1">
                            Teaching:
                          </span>
                          <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                            {selectedNewsletterForReview.Teaching}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-amber-400 font-bold text-xs block">
                              1. {selectedNewsletterForReview.KeyPoint1Title}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">
                              {selectedNewsletterForReview.KeyPoint1Body}
                            </p>
                          </div>
                          <div className="bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-amber-400 font-bold text-xs block">
                              2. {selectedNewsletterForReview.KeyPoint2Title}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">
                              {selectedNewsletterForReview.KeyPoint2Body}
                            </p>
                          </div>
                          <div className="bg-slate-900 p-3 rounded border border-slate-800">
                            <span className="text-amber-400 font-bold text-xs block">
                              3. {selectedNewsletterForReview.KeyPoint3Title}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">
                              {selectedNewsletterForReview.KeyPoint3Body}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-amber-400 font-bold uppercase block mb-1">
                            Practical Application:
                          </span>
                          <p className="text-slate-300 whitespace-pre-line text-xs">
                            {selectedNewsletterForReview.PracticalApplication}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-amber-400 font-bold uppercase block mb-1">
                            Prayer:
                          </span>
                          <p className="text-slate-300 italic text-xs font-serif">
                            {selectedNewsletterForReview.Prayer}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedReviewTab === 'social' && (
                      <div className="space-y-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-400">Facebook Post</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedNewsletterForReview.FacebookPost || '');
                              }}
                              className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                            >
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </button>
                          </div>
                          <p className="text-slate-300 text-xs">
                            {selectedNewsletterForReview.FacebookPost || 'No Facebook post generated.'}
                          </p>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-pink-400">Instagram Caption</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${selectedNewsletterForReview.InstagramCaption}\n\n${(selectedNewsletterForReview.InstagramHashtags || []).join(' ')}`
                                );
                              }}
                              className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                            >
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </button>
                          </div>
                          <p className="text-slate-300 text-xs whitespace-pre-line">
                            {selectedNewsletterForReview.InstagramCaption}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(selectedNewsletterForReview.InstagramHashtags || []).map((h, i) => (
                              <span key={i} className="text-[10px] bg-slate-900 text-pink-300 px-2 py-0.5 rounded">
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedReviewTab === 'youtube' && (
                      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
                        <div>
                          <span className="text-amber-400 font-bold uppercase block mb-1">Hook (0-3s):</span>
                          <p className="text-white font-bold">{selectedNewsletterForReview.YouTubeShortHook}</p>
                        </div>
                        <div>
                          <span className="text-amber-400 font-bold uppercase block mb-1">Spoken Script:</span>
                          <p className="text-slate-300 leading-relaxed font-mono bg-slate-900 p-3 rounded">
                            {selectedNewsletterForReview.YouTubeShortNarration}
                          </p>
                        </div>
                        <div>
                          <span className="text-amber-400 font-bold uppercase block mb-1">CTA:</span>
                          <p className="text-slate-300">{selectedNewsletterForReview.YouTubeShortCTA}</p>
                        </div>
                      </div>
                    )}

                    {selectedReviewTab === 'prompts' && (
                      <div className="space-y-3 text-xs">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                          <span className="text-amber-400 font-bold block mb-1">Veo 9:16 Video Prompt:</span>
                          <p className="text-slate-300 font-mono">{selectedNewsletterForReview.VeoVideoPrompt}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                          <span className="text-amber-400 font-bold block mb-1">Featured Image Prompt:</span>
                          <p className="text-slate-300 font-mono">{selectedNewsletterForReview.FeaturedImagePrompt}</p>
                        </div>
                      </div>
                    )}

                    {selectedReviewTab === 'infographic' && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center">
                        <InfographicCanvas newsletter={selectedNewsletterForReview} />
                      </div>
                    )}
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveNewsletterToDrive(selectedNewsletterForReview)}
                        disabled={isSavingToDrive}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                      >
                        <FolderSync className="w-4 h-4 text-amber-400" />
                        <span>{isSavingToDrive ? 'Saving...' : 'Sync Package to Drive'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedNlForEmail(selectedNewsletterForReview.NewsletterID);
                          setActiveTab('email');
                          setSelectedNewsletterForReview(null);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                      >
                        <Mail className="w-4 h-4 text-indigo-400" />
                        <span>Configure Email Campaign</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedNewsletterForReview.Status !== 'PUBLISHED' && (
                        <button
                          onClick={() => {
                            onPublishNewsletter(selectedNewsletterForReview.NewsletterID);
                            setSelectedNewsletterForReview(null);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-md"
                        >
                          Approve & Publish to Website
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: 10-SHEET GOOGLE SHEETS SIMULATOR & BROWSER
            ========================================================================= */}
        {activeTab === 'sheets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>Google Sheets Architecture: 10 Connected Sheets</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Inspect the structured columns and data schema for all 10 synchronized workbook sheets.
                </p>
              </div>
              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ topics, newsletters, subscribers, emailLogs, videos, systemLogs }, null, 2));
                  const dl = document.createElement('a');
                  dl.setAttribute('href', dataStr);
                  dl.setAttribute('download', 'WordEmbassy_Sheets_Export.json');
                  dl.click();
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Full Sheets JSON</span>
              </button>
            </div>

            {/* Sheets Tabs Header */}
            <div className="flex items-center gap-1 overflow-x-auto bg-slate-950 p-2 rounded-xl border border-slate-800">
              {[
                'Topics',
                'Newsletters',
                'Subscribers',
                'Publishing',
                'Videos',
                'Social',
                'EmailLog',
                'Analytics',
                'Settings',
                'Logs',
              ].map((sheet) => (
                <button
                  key={sheet}
                  onClick={() => setActiveSheetTab(sheet as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeSheetTab === sheet
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Sheet: {sheet}
                </button>
              ))}
            </div>

            {/* Sheet Table Viewer */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 overflow-x-auto font-mono text-xs">
              {activeSheetTab === 'Topics' && (
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">TopicID</th>
                      <th className="p-3">Topic</th>
                      <th className="p-3">Scripture</th>
                      <th className="p-3">Theme</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">PublishDate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {topics.map((t) => (
                      <tr key={t.TopicID}>
                        <td className="p-3 text-amber-400">{t.TopicID}</td>
                        <td className="p-3 text-white font-sans font-semibold">{t.Topic}</td>
                        <td className="p-3 text-slate-300">{t.Scripture}</td>
                        <td className="p-3 text-slate-400">{t.Theme}</td>
                        <td className="p-3">{t.Priority}</td>
                        <td className="p-3">{t.Status}</td>
                        <td className="p-3 text-slate-400">{t.PublishDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeSheetTab === 'Subscribers' && (
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">SubscriberID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Group</th>
                      <th className="p-3">DateSubscribed</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">UnsubscribeToken</th>
                      <th className="p-3">SendCount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {subscribers.map((s) => (
                      <tr key={s.SubscriberID}>
                        <td className="p-3 text-amber-400">{s.SubscriberID}</td>
                        <td className="p-3 text-white font-sans">{s.Name}</td>
                        <td className="p-3 text-slate-300">{s.Email}</td>
                        <td className="p-3">
                          <span className="bg-slate-900 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px]">
                            {s.Group || 'Weekly Devotional Readers'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{s.DateSubscribed}</td>
                        <td className="p-3 text-emerald-400 font-bold">{s.Status}</td>
                        <td className="p-3 text-slate-500">{s.UnsubscribeToken}</td>
                        <td className="p-3">{s.SendCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeSheetTab === 'EmailLog' && (
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">EmailLogID</th>
                      <th className="p-3">NewsletterID</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">SentAt</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Attempt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {emailLogs.map((log) => (
                      <tr key={log.EmailLogID}>
                        <td className="p-3 text-amber-400">{log.EmailLogID}</td>
                        <td className="p-3 text-slate-300">{log.NewsletterID}</td>
                        <td className="p-3 text-white">{log.Email}</td>
                        <td className="p-3 text-slate-400">{log.SentAt}</td>
                        <td className="p-3 text-emerald-400 font-bold">{log.Status}</td>
                        <td className="p-3">{log.AttemptNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeSheetTab !== 'Topics' &&
                activeSheetTab !== 'Subscribers' &&
                activeSheetTab !== 'EmailLog' && (
                  <div className="p-8 text-center text-slate-400">
                    <p>Displaying live schema & records for <strong>{activeSheetTab}</strong>.</p>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: GOOGLE DRIVE MANAGER & FILE EXPLORER
            ========================================================================= */}
        {activeTab === 'drive' && (
          <div className="space-y-6">
            {/* Top Bar with Account & Storage Quota */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <FolderSync className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                      Google Drive Cloud Storage Hub
                    </h2>
                    <p className="text-xs text-slate-400">
                      Standard Hierarchy: <code>Word Embassy / Newsletters / &#123;YEAR&#125; / &#123;MONTH - TITLE&#125;</code>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {driveUser ? (
                  <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
                    {driveQuota?.userPhoto ? (
                      <img
                        src={driveQuota.userPhoto}
                        alt={driveUser.displayName || 'Google User'}
                        className="w-7 h-7 rounded-full border border-amber-500/40"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                        {driveUser.email?.[0]?.toUpperCase() || 'G'}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span>{driveUser.displayName || driveUser.email}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {driveQuota?.storageQuota?.usage || 'Connected'} / {driveQuota?.storageQuota?.limit || 'Drive'}
                      </div>
                    </div>
                    <button
                      onClick={() => googleLogout()}
                      className="ml-2 text-[11px] text-slate-400 hover:text-rose-300 transition-colors"
                      title="Disconnect Google Account"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleDriveSignIn}
                    className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2.5 shadow-md transition-transform active:scale-95"
                    id="google-drive-oauth-btn"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                )}

                <button
                  onClick={handleSyncAllToDrive}
                  disabled={syncingAllDrive}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  id="sync-all-drive-packages-btn"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingAllDrive ? 'animate-spin' : ''}`} />
                  <span>{syncingAllDrive ? 'Syncing All...' : 'Sync All Packages to Drive'}</span>
                </button>
              </div>
            </div>

            {/* Sub Tabs: Packages vs Live Drive Explorer */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDriveViewMode('packages')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    driveViewMode === 'packages'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Editorial Packages ({newsletters.length})</span>
                </button>
                <button
                  onClick={() => {
                    setDriveViewMode('explorer');
                    loadDriveData(driveToken || undefined, currentFolderId);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    driveViewMode === 'explorer'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Live Drive File Browser</span>
                </button>
              </div>

              {driveViewMode === 'explorer' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateFolderModal(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>New Folder</span>
                  </button>
                  <button
                    onClick={() => loadDriveData(driveToken || undefined, currentFolderId, driveSearchTerm)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                    title="Refresh Drive Files"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDriveLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* VIEW 1: EDITORIAL PACKAGES */}
            {driveViewMode === 'packages' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsletters.map((nl) => {
                  const savedStruct = savedDriveResults[nl.NewsletterID];
                  return (
                    <div
                      key={nl.NewsletterID}
                      className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="text-xs font-mono text-amber-400 font-bold">{nl.NewsletterID}</span>
                            <h4 className="font-serif text-lg font-bold text-white mt-0.5">{nl.Title}</h4>
                            <span className="text-[11px] text-slate-400">{nl.ScriptureReference}</span>
                          </div>
                          <button
                            onClick={() => handleSaveNewsletterToDrive(nl)}
                            disabled={isSavingToDrive}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0"
                          >
                            {isSavingToDrive ? 'Syncing...' : 'Sync Package'}
                          </button>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                          <div className="text-amber-300 font-bold flex items-center gap-1.5 border-b border-slate-800 pb-2">
                            <Folder className="w-3.5 h-3.5" />
                            <span className="truncate">Word Embassy / Newsletters / 2026 / August - {nl.Title}</span>
                          </div>
                          <ul className="space-y-1.5 text-slate-300 text-[11px]">
                            <li className="flex items-center justify-between">
                              <span className="flex items-center gap-1">📄 {nl.Title} — Google Doc.txt</span>
                              <span className="text-slate-500 text-[10px]">Teaching</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="flex items-center gap-1">🖼️ Featured-Image-{nl.Slug}.jpg</span>
                              <span className="text-slate-500 text-[10px]">1.2 MB</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="flex items-center gap-1">📊 Infographic-{nl.Slug}.png</span>
                              <span className="text-slate-500 text-[10px]">2.4 MB</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="flex items-center gap-1">🎬 YouTube-Script-and-Metadata.txt</span>
                              <span className="text-slate-500 text-[10px]">Script</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="flex items-center gap-1">🎥 Veo-Video-Prompt.txt</span>
                              <span className="text-slate-500 text-[10px]">Prompt</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="flex items-center gap-1">📱 Social-Content-Distribution.txt</span>
                              <span className="text-slate-500 text-[10px]">Social</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="flex items-center gap-1">⚙️ Newsletter-Metadata.json</span>
                              <span className="text-slate-500 text-[10px]">JSON</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {savedStruct ? (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Synced to Drive!
                          </span>
                          <a
                            href={savedStruct.folderUrl || `https://drive.google.com/drive/folders/${savedStruct.driveFolderId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold underline flex items-center gap-1 hover:text-emerald-200"
                          >
                            Open in Drive <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-slate-900/60 rounded-lg text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Ready for automated Drive cloud export</span>
                          <button
                            onClick={() => handleSaveNewsletterToDrive(nl)}
                            className="text-amber-400 hover:text-amber-300 font-semibold underline"
                          >
                            Sync now
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 2: LIVE GOOGLE DRIVE FILE BROWSER */}
            {driveViewMode === 'explorer' && (
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
                {/* Search & Breadcrumbs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono py-1">
                    {folderHistory.map((crumb, idx) => (
                      <React.Fragment key={crumb.id || 'root'}>
                        {idx > 0 && <span className="text-slate-600">/</span>}
                        <button
                          onClick={() => handleNavigateBreadcrumb(idx)}
                          className={`hover:underline whitespace-nowrap px-1 py-0.5 rounded ${
                            idx === folderHistory.length - 1
                              ? 'text-amber-400 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {crumb.name}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={driveSearchTerm}
                      onChange={(e) => setDriveSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          loadDriveData(driveToken || undefined, currentFolderId, driveSearchTerm);
                        }
                      }}
                      placeholder="Search files in Drive..."
                      className="w-full bg-slate-900 text-white pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Drive File List */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  {isDriveLoading ? (
                    <div className="p-12 text-center text-slate-400 space-y-3">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400" />
                      <p className="text-xs">Fetching Google Drive directory...</p>
                    </div>
                  ) : driveFiles.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 space-y-3">
                      <Folder className="w-10 h-10 mx-auto text-slate-600" />
                      <p className="text-sm font-semibold text-white">No files found in this folder</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Click "Sync All Packages to Drive" above to populate Word Embassy newsletter packages.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="p-3">Item Name</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Size</th>
                            <th className="p-3">Modified</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {driveFiles.map((file) => (
                            <tr key={file.id} className="hover:bg-slate-900/50 transition-colors">
                              <td className="p-3">
                                {file.isFolder ? (
                                  <button
                                    onClick={() => handleFolderClick(file)}
                                    className="flex items-center gap-2 text-amber-300 font-semibold hover:underline text-left"
                                  >
                                    <Folder className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                                    <span>{file.name}</span>
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2 text-white">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span>{file.name}</span>
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-slate-400">
                                {file.isFolder ? 'Folder' : file.mimeType.split('/').pop() || 'File'}
                              </td>
                              <td className="p-3 text-slate-400">{file.size || '—'}</td>
                              <td className="p-3 text-slate-500">
                                {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : '—'}
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold px-2 py-1 bg-slate-900 rounded border border-slate-700"
                                >
                                  <span>Open</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <button
                                  onClick={() => setFileToDelete(file)}
                                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors rounded"
                                  title="Delete file"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Create Folder Modal */}
            {showCreateFolderModal && (
              <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <FolderPlus className="w-5 h-5 text-amber-400" />
                    <span>Create New Google Drive Folder</span>
                  </h3>
                  <form onSubmit={handleCreateFolder} className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Folder Name:</label>
                      <input
                        type="text"
                        value={newFolderNameInput}
                        onChange={(e) => setNewFolderNameInput(e.target.value)}
                        placeholder="e.g. Word Embassy Archives"
                        className="w-full bg-slate-950 text-white px-3 py-2 rounded-lg border border-slate-700 text-xs focus:outline-hidden focus:border-amber-500"
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateFolderModal(false)}
                        className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newFolderNameInput.trim()}
                        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow-md"
                      >
                        Create Folder
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal (Workspace requirement) */}
            {fileToDelete && (
              <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-slate-900 border border-rose-500/40 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">Confirm Delete from Drive</h3>
                      <p className="text-xs text-slate-400">This action will remove the item from your Google Drive.</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 break-all">
                    <strong>{fileToDelete.name}</strong> ({fileToDelete.isFolder ? 'Folder' : 'File'})
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFileToDelete(null)}
                      disabled={isDeletingFile}
                      className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeleteFile}
                      disabled={isDeletingFile}
                      className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isDeletingFile ? 'Deleting...' : 'Delete Permanently'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 6: BATCH EMAIL DELIVERY ENGINE
            ========================================================================= */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <span>Batch Email Delivery & Campaign Control</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Gmail/MailApp batching engine with recipient deduplication, cursor tracking, and live preview.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('templates')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  id="email-tab-open-template-studio-btn"
                  title="Open visual newsletter template studio & customization"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Newsletter Template Studio</span>
                </button>

                <button
                  onClick={() => onCreateAndSendTestNewsletter?.()}
                  disabled={isProcessing}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  id="email-tab-create-send-test-btn"
                  title="Generate a live test newsletter and dispatch to active subscribers"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Create & Send Test Newsletter</span>
                </button>

                <select
                  value={selectedNlForEmail}
                  onChange={(e) => setSelectedNlForEmail(e.target.value)}
                  className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 font-bold"
                >
                  {newsletters.map((n) => (
                    <option key={n.NewsletterID} value={n.NewsletterID}>
                      {n.NewsletterID}: {n.Title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={async () => {
                    setIsAdminSendingCampaign(true);
                    try {
                      await onSendEmailCampaign(
                        selectedNlForEmail,
                        settings.EmailBatchSize,
                        selectedCampaignGroup
                      );
                      const targetCount =
                        selectedCampaignGroup === 'ALL'
                          ? activeSubscribers
                          : subscribers.filter(
                              (s) => s.Group === selectedCampaignGroup && s.Status === 'ACTIVE'
                            ).length;
                      setAdminCampaignReceipt({
                        groupName: selectedCampaignGroup === 'ALL' ? 'All Active Subscribers' : selectedCampaignGroup,
                        count: targetCount,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      });
                    } finally {
                      setIsAdminSendingCampaign(false);
                    }
                  }}
                  disabled={isAdminSendingCampaign}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  id="dispatch-email-campaign-btn"
                >
                  {isAdminSendingCampaign ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Campaign Batch ({settings.EmailBatchSize})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Campaign Config & Test Email Sender */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">Campaign Settings</h3>

                {/* Sender Identity Info */}
                <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/30 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sender Identity:</span>
                    <span className="text-amber-300 font-bold">Word Embassy Editorial</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sender & Lead:</span>
                    <span className="text-white font-mono font-semibold">embassyword@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Reply-To Address:</span>
                    <span className="text-indigo-300 font-mono">embassyword@gmail.com</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Target Newsletter:</label>
                    <div className="text-white font-bold">{activeNewsletter?.Title}</div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Target Subscriber Group / Cohort:</label>
                    <select
                      value={selectedCampaignGroup}
                      onChange={(e) => setSelectedCampaignGroup(e.target.value)}
                      className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-400"
                    >
                      <option value="ALL">All Active Subscribers ({activeSubscribers})</option>
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
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Active in Target Audience:</label>
                    <div className="text-emerald-400 font-bold font-mono">
                      {(selectedCampaignGroup === 'ALL'
                        ? activeSubscribers
                        : subscribers.filter(
                            (s) => s.Group === selectedCampaignGroup && s.Status === 'ACTIVE'
                          ).length
                      ).toLocaleString()}{' '}
                      subscribers
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Batch Size:</label>
                    <input
                      type="number"
                      value={settings.EmailBatchSize}
                      onChange={(e) =>
                        onUpdateSettings({ ...settings, EmailBatchSize: parseInt(e.target.value) || 25 })
                      }
                      className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700 text-xs"
                    />
                  </div>

                  {adminCampaignReceipt && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Dispatched to {adminCampaignReceipt.count} readers ({adminCampaignReceipt.groupName})</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Logged in system audit & email logs at {adminCampaignReceipt.timestamp}.
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-400 block font-semibold">Send Test Email:</label>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>Quick:</span>
                        <select
                          onChange={(e) => {
                            if (e.target.value) setTestEmailInput(e.target.value);
                          }}
                          value={testEmailInput}
                          className="bg-slate-900 text-amber-300 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono focus:outline-none"
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
                        value={testEmailInput}
                        onChange={(e) => setTestEmailInput(e.target.value)}
                        placeholder="omicroservices@gmail.com"
                        className="flex-1 bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700 text-xs font-mono"
                      />
                      <button
                        onClick={async () => {
                          if (!testEmailInput) return;
                          setIsSendingAdminTest(true);
                          try {
                            await onSendTestEmail(selectedNlForEmail, testEmailInput);
                            setAdminTestReceipt({
                              recipient: testEmailInput,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            });
                          } finally {
                            setIsSendingAdminTest(false);
                          }
                        }}
                        disabled={isSendingAdminTest}
                        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0"
                      >
                        {isSendingAdminTest ? (
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

                    {adminTestReceipt && (
                      <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs space-y-2 animate-fade-in mt-2">
                        <div className="flex items-center justify-between text-emerald-300 font-bold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Test Dispatch Recorded!</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {adminTestReceipt.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Recipient: <span className="font-mono text-amber-300 font-bold">{adminTestReceipt.recipient}</span>
                        </p>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                            adminTestReceipt.recipient
                          )}&su=${encodeURIComponent(
                            `🕊️ [Word Embassy] ${activeNewsletter?.Title || 'Devotional'}`
                          )}&body=${encodeURIComponent(
                            `WORD EMBASSY DEVOTIONAL\n\nTitle: ${activeNewsletter?.Title}\nScripture: ${activeNewsletter?.ScriptureReference}\n\n${activeNewsletter?.Teaching}\n\nBlessings,\nWord Embassy (embassyword@gmail.com)`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open in Gmail Draft</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right 2 Cols: Email HTML Live Preview */}
              <div className="lg:col-span-2 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Live Responsive Email Preview
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                    <button
                      onClick={() => setEmailPreviewMode('desktop')}
                      className={`px-3 py-1 rounded font-semibold ${
                        emailPreviewMode === 'desktop' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setEmailPreviewMode('mobile')}
                      className={`px-3 py-1 rounded font-semibold ${
                        emailPreviewMode === 'mobile' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      Mobile (600px)
                    </button>
                  </div>
                </div>

                {/* Email Canvas Preview */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-center overflow-x-auto">
                  <div
                    className={`bg-[#FDFBF7] text-[#1E293B] p-6 sm:p-8 rounded-xl border border-slate-300 shadow-xl space-y-6 font-sans ${
                      emailPreviewMode === 'mobile' ? 'w-full max-w-[420px]' : 'w-full max-w-[620px]'
                    }`}
                  >
                    {/* Email Header */}
                    <div className="border-b border-slate-200 pb-4 text-center">
                      <div className="font-serif text-2xl font-black text-[#1E293B] tracking-tight">
                        WORD EMBASSY
                      </div>
                      <div className="text-xs text-[#B45309] font-medium tracking-wide uppercase mt-0.5">
                        Bible Teaching • Faith • Prayer
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="space-y-4 text-sm">
                      <h2 className="font-serif text-2xl font-bold text-[#1E293B]">
                        {activeNewsletter?.Title}
                      </h2>
                      <div className="bg-[#FEF3C7] p-4 rounded-lg border border-[#FDE68A] text-xs font-serif italic text-[#1E293B]">
                        “{activeNewsletter?.ScriptureText}” — {activeNewsletter?.ScriptureReference}
                      </div>

                      <p className="text-slate-700 leading-relaxed">
                        Dear Faithful Reader,
                      </p>
                      <p className="text-slate-700 leading-relaxed">
                        {activeNewsletter?.Opening}
                      </p>

                      <div className="text-center py-4">
                        <button
                          onClick={() => onNavigateToPublic('newsletter', activeNewsletter?.Slug)}
                          className="bg-[#1E293B] text-white px-6 py-3 rounded-lg font-bold text-xs shadow-md"
                        >
                          Read Full Newsletter & Watch Devotional
                        </button>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-xs italic font-serif text-slate-700">
                        <strong>Pastor’s Prayer:</strong> {activeNewsletter?.Prayer}
                      </div>
                    </div>

                    {/* Email Footer */}
                    <div className="border-t border-slate-200 pt-4 text-center text-[10px] text-slate-500 space-y-1">
                      <p>© 2026 Word Embassy Ministries • www.wordembassy.org</p>
                      <p>You received this because you are an active subscriber.</p>
                      <p className="underline cursor-pointer">Unsubscribe safely</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: SOCIAL & MEDIA STUDIO
            ========================================================================= */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-amber-400" />
                  <span>Social Content & Media Generation Studio</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Formatted copy cards for Facebook, Instagram, TikTok, and YouTube Shorts with one-click copy.
                </p>
              </div>

              <select
                value={selectedNlForEmail}
                onChange={(e) => setSelectedNlForEmail(e.target.value)}
                className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 font-bold"
              >
                {newsletters.map((n) => (
                  <option key={n.NewsletterID} value={n.NewsletterID}>
                    {n.Title}
                  </option>
                ))}
              </select>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facebook Card */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Facebook Post
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(activeNewsletter?.FacebookPost || '')}
                    className="text-xs bg-slate-900 text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Post
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {activeNewsletter?.FacebookPost}
                </p>
              </div>

              {/* Instagram Card */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                    Instagram Caption
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${activeNewsletter?.InstagramCaption}\n\n${(activeNewsletter?.InstagramHashtags || []).join(' ')}`
                      )
                    }
                    className="text-xs bg-slate-900 text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Caption
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {activeNewsletter?.InstagramCaption}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(activeNewsletter?.InstagramHashtags || []).map((h, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-pink-300 px-2 py-0.5 rounded">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* YouTube Short Script */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    YouTube Short Narration
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `Hook: ${activeNewsletter?.YouTubeShortHook}\n\nNarration: ${activeNewsletter?.YouTubeShortNarration}\n\nCTA: ${activeNewsletter?.YouTubeShortCTA}`
                      )
                    }
                    className="text-xs bg-slate-900 text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Script
                  </button>
                </div>
                <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-amber-400 font-bold">Hook: {activeNewsletter?.YouTubeShortHook}</p>
                  <p className="text-slate-300">{activeNewsletter?.YouTubeShortNarration}</p>
                </div>
              </div>

              {/* TikTok Card */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    TikTok Post
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(activeNewsletter?.TikTokCaption || '')}
                    className="text-xs bg-slate-900 text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy TikTok
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {activeNewsletter?.TikTokCaption}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: GOOGLE APPS SCRIPT EXPORTER
            ========================================================================= */}
        {activeTab === 'gas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-400" />
                  <span>Production Google Apps Script Exporter</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Deploy the full Word Embassy automation engine directly into your Google Workspace account.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Code.gs box */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white">Code.gs</h4>
                    <span className="text-[11px] text-slate-400">Backend Automation & Sheet Triggers</span>
                  </div>
                  <button
                    onClick={() => handleCopyGas('gs')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                    id="copy-gas-code-btn"
                  >
                    {copiedCode === 'gs' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'gs' ? 'Copied Code.gs!' : 'Copy Code.gs'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-[380px] overflow-y-auto">
                  <pre>{gasCode.codeGs}</pre>
                </div>
              </div>

              {/* Index.html box */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white">Index.html</h4>
                    <span className="text-[11px] text-slate-400">HTML Service Web Portal Template</span>
                  </div>
                  <button
                    onClick={() => handleCopyGas('html')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                    id="copy-gas-html-btn"
                  >
                    {copiedCode === 'html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'html' ? 'Copied Index.html!' : 'Copy Index.html'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-[380px] overflow-y-auto">
                  <pre>{gasCode.indexHtml}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 9: ANALYTICS & LOOKER STUDIO SIMULATOR
            ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>Audience Engagement & Looker Studio Analytics</span>
              </h2>
              <p className="text-xs text-slate-400">
                Key performance metrics for subscriber growth, open rates, and video engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Average Open Rate</span>
                <div className="text-3xl font-serif font-bold text-emerald-400">68.4%</div>
                <p className="text-[11px] text-slate-400">+12% vs Christian Publication Average</p>
              </div>

              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Monthly Video Views</span>
                <div className="text-3xl font-serif font-bold text-amber-400">41,200</div>
                <p className="text-[11px] text-slate-400">YouTube Shorts & Veo Reels</p>
              </div>

              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Deliverability</span>
                <div className="text-3xl font-serif font-bold text-indigo-400">99.8%</div>
                <p className="text-[11px] text-slate-400">Zero spam flags reported</p>
              </div>

              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Archive Searches</span>
                <div className="text-3xl font-serif font-bold text-rose-400">1,840</div>
                <p className="text-[11px] text-slate-400">Most searched: Luke 18:1, Psalm 91</p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 10: SYSTEM LOGS
            ========================================================================= */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Execution Logs & Error Recovery</span>
              </h2>
              <p className="text-xs text-slate-400">
                Audit trail for all Gemini generation, Drive storage, and batch email dispatch events.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">JobID</th>
                    <th className="p-3">Function</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {systemLogs.map((l, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/30">
                      <td className="p-3 text-slate-400">{l.Timestamp}</td>
                      <td className="p-3 text-amber-400">{l.JobID}</td>
                      <td className="p-3 text-indigo-300 font-bold">{l.Function}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.Status === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {l.Status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-200 font-sans">{l.Message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 11: SETTINGS
            ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-slate-800/80 p-8 rounded-2xl border border-slate-700 space-y-6">
            <h2 className="font-serif text-xl font-bold text-white">Automation Settings</h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Auto-Generate with Gemini</span>
                  <span className="text-slate-400">Trigger AI generation when a new topic is added</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.AutoGenerate}
                  onChange={(e) => onUpdateSettings({ ...settings, AutoGenerate: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Auto-Publish to Website</span>
                  <span className="text-slate-400">Skip manual editorial review (Default: OFF)</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.AutoPublish}
                  onChange={(e) => onUpdateSettings({ ...settings, AutoPublish: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-bold block">Editorial Admin Email:</label>
                <input
                  type="email"
                  value={settings.AdminEmail}
                  onChange={(e) => onUpdateSettings({ ...settings, AdminEmail: e.target.value })}
                  className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-bold block">Test Email Address:</label>
                <input
                  type="email"
                  value={settings.TestEmail}
                  onChange={(e) => onUpdateSettings({ ...settings, TestEmail: e.target.value })}
                  className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADD TOPIC MODAL */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-xl font-bold text-white">Add Topic to Google Sheets</h3>
              <button
                onClick={() => setShowAddTopicModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTopicSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Topic Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overcoming Anxiety Through God's Word"
                  value={newTopicData.Topic}
                  onChange={(e) => setNewTopicData({ ...newTopicData, Topic: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Key Scripture Reference <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Peter 5:7, Philippians 4:6-7"
                  value={newTopicData.Scripture}
                  onChange={(e) => setNewTopicData({ ...newTopicData, Scripture: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Theme</label>
                  <input
                    type="text"
                    placeholder="e.g. Faith & Trust"
                    value={newTopicData.Theme}
                    onChange={(e) => setNewTopicData({ ...newTopicData, Theme: e.target.value })}
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Priority</label>
                  <select
                    value={newTopicData.Priority}
                    onChange={(e) =>
                      setNewTopicData({ ...newTopicData, Priority: e.target.value as any })
                    }
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Editorial Guidance Notes</label>
                <textarea
                  rows={2}
                  placeholder="Specific aspects or applications for the Gemini model to emphasize..."
                  value={newTopicData.Notes}
                  onChange={(e) => setNewTopicData({ ...newTopicData, Notes: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SUBSCRIBER GROUP MODAL */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Create Subscriber Group</h3>
                  <p className="text-xs text-slate-400">Add a new ministerial audience cohort</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Group / Cohort Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Youth Leaders & Mentors, Intercessory Team"
                  value={newGroupData.Name}
                  onChange={(e) => setNewGroupData({ ...newGroupData, Name: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description & Focus</label>
                <textarea
                  rows={2}
                  placeholder="Describe the audience purpose, target theological depth, or focus area..."
                  value={newGroupData.Description}
                  onChange={(e) =>
                    setNewGroupData({ ...newGroupData, Description: e.target.value })
                  }
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Cohort Badge Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
                    { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
                    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
                    { id: 'sky', label: 'Sky Blue', bg: 'bg-sky-500' },
                    { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
                    { id: 'purple', label: 'Purple', bg: 'bg-purple-500' },
                    { id: 'teal', label: 'Teal', bg: 'bg-teal-500' },
                  ].map((colorOption) => (
                    <button
                      key={colorOption.id}
                      type="button"
                      onClick={() =>
                        setNewGroupData({ ...newGroupData, Color: colorOption.id })
                      }
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                        newGroupData.Color === colorOption.id
                          ? 'bg-slate-800 border-amber-400 text-white shadow-xs'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${colorOption.bg}`} />
                      <span className="text-[11px] font-semibold">{colorOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Group</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUBSCRIBER MODAL */}
      {showAddSubscriberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Add New Subscriber</h3>
                  <p className="text-xs text-slate-400">Register a reader into your devotional network</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddSubscriberModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubscriberSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Full Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Johnathan Edwards"
                  value={newSubscriberData.Name}
                  onChange={(e) =>
                    setNewSubscriberData({ ...newSubscriberData, Name: e.target.value })
                  }
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. pastor.john@church.org"
                  value={newSubscriberData.Email}
                  onChange={(e) =>
                    setNewSubscriberData({ ...newSubscriberData, Email: e.target.value })
                  }
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Assign to Cohort / Group <span className="text-rose-400">*</span>
                </label>
                <select
                  value={newSubscriberData.Group}
                  onChange={(e) =>
                    setNewSubscriberData({ ...newSubscriberData, Group: e.target.value })
                  }
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                >
                  {subscriberGroups.map((g) => (
                    <option key={g.GroupID} value={g.Name}>
                      {g.Name} ({g.GroupID})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSubscriberModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Subscriber</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SUBSCRIBER MODAL */}
      {subscriberToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Delete Subscriber</h3>
                  <p className="text-xs text-rose-300/80">Permanent removal confirmation</p>
                </div>
              </div>
              <button
                onClick={() => setSubscriberToDelete(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Are you sure you want to permanently remove this subscriber from the roster?
              </p>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-slate-200 font-mono font-bold">
                    {subscriberToDelete.SubscriberID}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white font-bold">{subscriberToDelete.Name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-amber-300 font-mono">{subscriberToDelete.Email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Group:</span>
                  <span className="text-indigo-300">{subscriberToDelete.Group}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                They will no longer receive any scheduled email dispatches, test runs, or newsletter broadcasts.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSubscriberToDelete(null)}
                className="px-4 py-2 text-slate-400 hover:text-white font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSubscriber}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-md text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Subscriber</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
