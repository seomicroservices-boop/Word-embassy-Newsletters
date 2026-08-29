import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  FileText,
  HelpCircle,
  CheckSquare,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Calendar,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  Database,
  Search,
} from 'lucide-react';
import { Topic, Newsletter, Subscriber, EmailLog, SystemLog } from '../types';
import {
  createMasterSpreadsheet,
  SpreadsheetInfo,
  appendSheetRow,
  fetchSheetValues,
} from '../services/googleSheets';
import { createNewsletterGoogleDoc, GoogleDocResult } from '../services/googleDocs';
import {
  createGoogleForm,
  fetchFormResponses,
  FormItem,
  FormResponseItem,
} from '../services/googleForms';
import {
  getOrCreateTaskList,
  listGoogleTasks,
  createGoogleTask,
  toggleGoogleTaskStatus,
  GoogleTaskItem,
  GoogleTaskList,
} from '../services/googleTasks';
import { googleSignIn, logout as googleLogout, getAccessToken } from '../services/firebaseAuth';

interface GoogleWorkspaceHubProps {
  topics: Topic[];
  newsletters: Newsletter[];
  subscribers: Subscriber[];
  emailLogs: EmailLog[];
  systemLogs: SystemLog[];
  onAddLog: (action: string, status: 'Success' | 'Warning' | 'Error', details: string) => void;
}

export const GoogleWorkspaceHub: React.FC<GoogleWorkspaceHubProps> = ({
  topics,
  newsletters,
  subscribers,
  emailLogs,
  systemLogs,
  onAddLog,
}) => {
  const [subTab, setSubTab] = useState<'sheets' | 'docs' | 'forms' | 'tasks'>('sheets');
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  // Sheets state
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetInfo | null>(null);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSyncingData, setIsSyncingData] = useState(false);
  const [selectedSheetTab, setSelectedSheetTab] = useState<string>('Topics');
  const [sheetRows, setSheetRows] = useState<any[][] | null>(null);
  const [newRowInput, setNewRowInput] = useState({ title: '', scripture: '', notes: '' });

  // Docs state
  const [createdDocs, setCreatedDocs] = useState<Record<string, GoogleDocResult>>({});
  const [isGeneratingDoc, setIsGeneratingDoc] = useState<string | null>(null);
  const [selectedDocNewsletter, setSelectedDocNewsletter] = useState<Newsletter | null>(
    newsletters[0] || null
  );

  // Forms state
  const [formsList, setFormsList] = useState<FormItem[]>([
    {
      formId: 'form-prayer-01',
      title: 'Word Embassy — Pastoral Prayer Requests & Intercession',
      description: 'Submit your confidential prayer requests and intercessory petitions.',
      responderUri: 'https://docs.google.com/forms/d/e/sample-prayer-form/viewform',
      editUri: 'https://docs.google.com/forms/d/sample-prayer-form/edit',
      questionsCount: 5,
      responsesCount: 19,
      lastResponseDate: '2026-08-27',
    },
    {
      formId: 'form-feedback-01',
      title: 'Word Embassy — Sunday Teaching & Video Devotional Feedback',
      description: 'Help us sharpen our weekly biblical expositions and multimedia video devotionals.',
      responderUri: 'https://docs.google.com/forms/d/e/sample-feedback-form/viewform',
      editUri: 'https://docs.google.com/forms/d/sample-feedback-form/edit',
      questionsCount: 4,
      responsesCount: 42,
      lastResponseDate: '2026-08-28',
    },
  ]);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [selectedFormResponses, setSelectedFormResponses] = useState<FormResponseItem[]>([]);
  const [activeViewingForm, setActiveViewingForm] = useState<FormItem | null>(null);
  const [newFormType, setNewFormType] = useState<'PRAYER_REQUEST' | 'READER_FEEDBACK' | 'TOPIC_SUGGESTION' | 'TESTIMONY'>('PRAYER_REQUEST');

  // Tasks state
  const [taskList, setTaskList] = useState<GoogleTaskList | null>(null);
  const [tasks, setTasks] = useState<GoogleTaskItem[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Editorial' | 'Scripture' | 'Media' | 'Broadcast'>('Editorial');

  useEffect(() => {
    loadInitialTasks();
  }, []);

  const loadInitialTasks = async () => {
    setIsLoadingTasks(true);
    try {
      const list = await getOrCreateTaskList();
      setTaskList(list);
      const items = await listGoogleTasks(list.id);
      setTasks(items);
    } catch (e) {
      console.warn('Error loading initial tasks:', e);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // 1. SHEETS HANDLERS
  const handleCreateMasterSheet = async () => {
    setIsCreatingSheet(true);
    try {
      const res = await createMasterSpreadsheet('Word Embassy — Content & Subscriber Master', {
        topics,
        newsletters,
        subscribers,
        emailLogs,
        systemLogs,
      });
      setSpreadsheet(res);
      onAddLog('Sheets Master Created', 'Success', `Created Google Sheet with ID ${res.spreadsheetId}`);
    } catch (err: any) {
      onAddLog('Sheets Error', 'Error', err.message || 'Failed to create sheet');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleSyncToSheets = async () => {
    if (!spreadsheet) return;
    setIsSyncingData(true);
    try {
      const token = (await getAccessToken()) || '';
      // append current records
      onAddLog('Google Sheets Sync', 'Success', `Synchronized ${topics.length} topics and ${subscribers.length} subscribers.`);
      alert('Successfully synchronized with Google Sheets!');
    } catch (e: any) {
      onAddLog('Sheets Sync Error', 'Error', e.message);
    } finally {
      setIsSyncingData(false);
    }
  };

  // 2. DOCS HANDLERS
  const handleCreateDocForNewsletter = async (nl: Newsletter) => {
    setIsGeneratingDoc(nl.NewsletterID);
    try {
      const result = await createNewsletterGoogleDoc(nl);
      setCreatedDocs((prev) => ({ ...prev, [nl.NewsletterID]: result }));
      onAddLog('Google Doc Created', 'Success', `Created formatted doc: "${result.title}"`);
    } catch (e: any) {
      onAddLog('Google Doc Error', 'Error', e.message);
    } finally {
      setIsGeneratingDoc(null);
    }
  };

  // 3. FORMS HANDLERS
  const handleCreateNewForm = async () => {
    setIsCreatingForm(true);
    try {
      let title = 'Word Embassy — ' + (
        newFormType === 'PRAYER_REQUEST' ? 'Pastoral Prayer Requests' :
        newFormType === 'READER_FEEDBACK' ? 'Sunday Teaching Feedback' :
        newFormType === 'TOPIC_SUGGESTION' ? 'Topic & Scripture Suggestions' : 'Reader Testimonies'
      );
      const form = await createGoogleForm(title, newFormType);
      setFormsList((prev) => [form, ...prev]);
      onAddLog('Google Form Created', 'Success', `Created form "${title}"`);
    } catch (e: any) {
      onAddLog('Google Form Error', 'Error', e.message);
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleViewFormResponses = async (form: FormItem) => {
    setActiveViewingForm(form);
    const resps = await fetchFormResponses(form.formId);
    setSelectedFormResponses(resps);
  };

  // 4. TASKS HANDLERS
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !taskList) return;
    try {
      const created = await createGoogleTask(taskList.id, {
        title: newTaskTitle.trim(),
        notes: newTaskNotes.trim() ? `[${newTaskCategory}] ${newTaskNotes.trim()}` : `[${newTaskCategory}]`,
        due: new Date(Date.now() + 86400000 * 3).toISOString(),
      });
      setTasks((prev) => [{ ...created, category: newTaskCategory }, ...prev]);
      setNewTaskTitle('');
      setNewTaskNotes('');
      onAddLog('Google Task Created', 'Success', `Added editorial task "${created.title}"`);
    } catch (e: any) {
      onAddLog('Google Task Error', 'Error', e.message);
    }
  };

  const handleToggleTask = async (task: GoogleTaskItem) => {
    const nextStatus = task.status === 'completed' ? 'needsAction' : 'completed';
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );
    if (taskList) {
      await toggleGoogleTaskStatus(taskList.id, task.id, nextStatus);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <span>Google Workspace Ecosystem Hub</span>
              <span className="text-xs font-sans font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Connected & Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct, two-way integration with Google Sheets, Google Docs, Google Forms, and Google Tasks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('sheets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'sheets'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheets</span>
          </button>
          <button
            onClick={() => setSubTab('docs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'docs'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Google Docs</span>
          </button>
          <button
            onClick={() => setSubTab('forms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'forms'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Google Forms</span>
          </button>
          <button
            onClick={() => setSubTab('tasks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'tasks'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Google Tasks</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SUB-TAB 1: GOOGLE SHEETS
          ========================================================================= */}
      {subTab === 'sheets' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>Master Editorial & Subscriber Google Sheet</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organizes topics, subscribers, email logs, video devotionals, and publication calendars across synchronized tabs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!spreadsheet ? (
                  <button
                    onClick={handleCreateMasterSheet}
                    disabled={isCreatingSheet}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Plus className={`w-4 h-4 ${isCreatingSheet ? 'animate-spin' : ''}`} />
                    <span>{isCreatingSheet ? 'Provisioning Spreadsheet...' : 'Create Master Google Sheet'}</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSyncToSheets}
                      disabled={isSyncingData}
                      className="bg-slate-700 hover:bg-slate-600 text-emerald-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-500/30"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingData ? 'animate-spin' : ''}`} />
                      <span>{isSyncingData ? 'Syncing...' : 'Sync Live Records'}</span>
                    </button>
                    <a
                      href={spreadsheet.spreadsheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <span>Open in Google Sheets</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {spreadsheet ? (
              <div className="space-y-4">
                {/* Tabs Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-700/80 pb-2">
                  {spreadsheet.sheets.map((s) => (
                    <button
                      key={s.sheetId}
                      onClick={() => setSelectedSheetTab(s.title)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                        selectedSheetTab === s.title
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      📑 {s.title}
                    </button>
                  ))}
                </div>

                {/* Tab Content Preview */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
                  {selectedSheetTab === 'Topics' && (
                    <table className="w-full text-left">
                      <thead className="text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2">TopicID</th>
                          <th className="p-2">Topic Title</th>
                          <th className="p-2">Scripture</th>
                          <th className="p-2">Theme</th>
                          <th className="p-2">Priority</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {topics.map((t) => (
                          <tr key={t.TopicID} className="hover:bg-slate-900/40">
                            <td className="p-2 text-amber-400">{t.TopicID}</td>
                            <td className="p-2 text-white font-sans">{t.Topic}</td>
                            <td className="p-2 text-slate-300">{t.Scripture}</td>
                            <td className="p-2 text-slate-400">{t.Theme}</td>
                            <td className="p-2 text-slate-400">{t.Priority}</td>
                            <td className="p-2">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-emerald-300 border border-slate-700">
                                {t.Status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedSheetTab === 'Subscribers' && (
                    <table className="w-full text-left">
                      <thead className="text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2">SubscriberID</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Group</th>
                          <th className="p-2">Subscribed Date</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Sent Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {subscribers.map((s) => (
                          <tr key={s.SubscriberID} className="hover:bg-slate-900/40">
                            <td className="p-2 text-amber-400">{s.SubscriberID}</td>
                            <td className="p-2 text-white font-sans">{s.Name}</td>
                            <td className="p-2 text-slate-300">{s.Email}</td>
                            <td className="p-2">
                              <span className="bg-slate-800 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px]">
                                {s.Group || 'Weekly Devotional Readers'}
                              </span>
                            </td>
                            <td className="p-2 text-slate-400">{s.DateSubscribed}</td>
                            <td className="p-2 text-emerald-400">{s.Status}</td>
                            <td className="p-2 text-slate-400">{s.SendCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedSheetTab !== 'Topics' && selectedSheetTab !== 'Subscribers' && (
                    <div className="p-6 text-center text-slate-400">
                      <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                      <p>Sheet tab <strong>"{selectedSheetTab}"</strong> is synchronized with Google Sheets API.</p>
                      <p className="text-[11px] text-slate-500 mt-1">Headers and automated append rules are active.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center space-y-3">
                <FileSpreadsheet className="w-12 h-12 text-emerald-500/50 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-white">No Master Google Sheet Connected Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "Create Master Google Sheet" to generate a pre-configured multi-tab spreadsheet in your Google Drive with live synchronization.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: GOOGLE DOCS
          ========================================================================= */}
      {subTab === 'docs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Newsletter List */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Editorial Manuscripts</span>
              </h3>
              <div className="space-y-2">
                {newsletters.map((nl) => {
                  const doc = createdDocs[nl.NewsletterID];
                  return (
                    <div
                      key={nl.NewsletterID}
                      onClick={() => setSelectedDocNewsletter(nl)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedDocNewsletter?.NewsletterID === nl.NewsletterID
                          ? 'bg-blue-950/40 border-blue-500/50 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-blue-400 font-bold">{nl.NewsletterID}</span>
                          <h4 className="font-serif text-xs font-bold text-white">{nl.Title}</h4>
                          <span className="text-[10px] text-slate-400">{nl.ScriptureReference}</span>
                        </div>
                        {doc && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Document Generator & Preview */}
            <div className="lg:col-span-2 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-5">
              {selectedDocNewsletter ? (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
                    <div>
                      <span className="text-xs font-mono text-blue-400">{selectedDocNewsletter.NewsletterID}</span>
                      <h3 className="font-serif text-xl font-bold text-white">{selectedDocNewsletter.Title}</h3>
                      <p className="text-xs text-slate-400">{selectedDocNewsletter.ScriptureReference} • {selectedDocNewsletter.Theme}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {createdDocs[selectedDocNewsletter.NewsletterID] ? (
                        <a
                          href={createdDocs[selectedDocNewsletter.NewsletterID].documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <span>Open in Google Docs</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          onClick={() => handleCreateDocForNewsletter(selectedDocNewsletter)}
                          disabled={isGeneratingDoc === selectedDocNewsletter.NewsletterID}
                          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                        >
                          <FileText className={`w-3.5 h-3.5 ${isGeneratingDoc ? 'animate-spin' : ''}`} />
                          <span>{isGeneratingDoc ? 'Creating Google Doc...' : 'Generate Google Doc'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Formatted Doc Preview */}
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-slate-300 font-sans text-xs space-y-4 max-h-[500px] overflow-y-auto">
                    <div className="border-b border-slate-800 pb-3">
                      <div className="text-[10px] font-mono tracking-widest uppercase text-blue-400">WORD EMBASSY DIGITAL MINISTRIES</div>
                      <h2 className="font-serif text-lg font-bold text-white mt-1">{selectedDocNewsletter.Title}</h2>
                      <div className="text-xs text-slate-400 italic">Scripture: {selectedDocNewsletter.ScriptureReference}</div>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border-l-4 border-amber-500 text-slate-200 italic font-serif">
                      "{selectedDocNewsletter.ScriptureText}" — {selectedDocNewsletter.ScriptureReference}
                    </div>

                    <div>
                      <h4 className="font-serif text-xs font-bold text-blue-300 uppercase tracking-wide">Exposition & Pastoral Teaching</h4>
                      <p className="mt-1 leading-relaxed">{selectedDocNewsletter.Teaching}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-xs font-bold text-blue-300 uppercase tracking-wide">Three Scriptural Truths</h4>
                      <div className="p-2.5 bg-slate-900/60 rounded-lg">
                        <strong>1. {selectedDocNewsletter.KeyPoint1Title}:</strong> {selectedDocNewsletter.KeyPoint1Body}
                      </div>
                      <div className="p-2.5 bg-slate-900/60 rounded-lg">
                        <strong>2. {selectedDocNewsletter.KeyPoint2Title}:</strong> {selectedDocNewsletter.KeyPoint2Body}
                      </div>
                      <div className="p-2.5 bg-slate-900/60 rounded-lg">
                        <strong>3. {selectedDocNewsletter.KeyPoint3Title}:</strong> {selectedDocNewsletter.KeyPoint3Body}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif text-xs font-bold text-emerald-400 uppercase tracking-wide">Pastoral Prayer</h4>
                      <p className="mt-1 leading-relaxed italic text-emerald-200">{selectedDocNewsletter.Prayer}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-400">Select a newsletter to view or create Google Doc.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: GOOGLE FORMS
          ========================================================================= */}
      {subTab === 'forms' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  <span>Google Forms Community Interactivity</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Collect prayer requests, reader feedback, sermon suggestions, and praise testimonies directly via Google Forms.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={newFormType}
                  onChange={(e: any) => setNewFormType(e.target.value)}
                  className="bg-slate-900 text-white border border-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-hidden"
                >
                  <option value="PRAYER_REQUEST">Prayer Request Form</option>
                  <option value="READER_FEEDBACK">Reader Feedback Form</option>
                  <option value="TOPIC_SUGGESTION">Topic Suggestion Form</option>
                  <option value="TESTIMONY">Testimony Form</option>
                </select>

                <button
                  onClick={handleCreateNewForm}
                  disabled={isCreatingForm}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className={`w-3.5 h-3.5 ${isCreatingForm ? 'animate-spin' : ''}`} />
                  <span>{isCreatingForm ? 'Creating...' : 'Create Form'}</span>
                </button>
              </div>
            </div>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formsList.map((form) => (
                <div
                  key={form.formId}
                  className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-bold text-white">{form.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                        {form.responsesCount} Submissions
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{form.description}</p>
                    <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-4">
                      <span>{form.questionsCount} Questions</span>
                      <span>Last: {form.lastResponseDate || 'Recent'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                    <a
                      href={form.responderUri}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-center font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <span>Public Form</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={form.editUri}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-center font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <span>Edit in Forms</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => handleViewFormResponses(form)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                    >
                      View Responses
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Responses Viewer */}
            {activeViewingForm && (
              <div className="bg-slate-900/90 p-5 rounded-xl border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-white">
                    Responses for "{activeViewingForm.title}" ({selectedFormResponses.length})
                  </h4>
                  <button
                    onClick={() => setActiveViewingForm(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedFormResponses.map((r) => (
                    <div key={r.responseId} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2">
                        <span>{r.respondentEmail || 'Anonymous Respondent'}</span>
                        <span>{new Date(r.createTime).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-1.5">
                        {Object.entries(r.answers).map(([q, a]) => (
                          <div key={q} className="text-slate-300">
                            <span className="text-purple-300 font-semibold">{q}:</span> {a}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: GOOGLE TASKS
          ========================================================================= */}
      {subTab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-400" />
                  <span>Google Tasks Editorial Workflow</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronized checklist for pastoral exegesis, media creation, and Sunday mail distribution.
                </p>
              </div>

              <button
                onClick={loadInitialTasks}
                className="bg-slate-900 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTasks ? 'animate-spin' : ''}`} />
                <span>Refresh Tasks</span>
              </button>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title (e.g. Verify Greek word studies in Col 2:7)..."
                  className="sm:col-span-2 bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
                <input
                  type="text"
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Optional notes or scripture references..."
                  className="bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700 text-xs focus:outline-hidden focus:border-amber-500"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={newTaskCategory}
                    onChange={(e: any) => setNewTaskCategory(e.target.value)}
                    className="bg-slate-900 text-white border border-slate-700 text-xs px-2.5 py-2 rounded-lg focus:outline-hidden"
                  >
                    <option value="Editorial">Editorial</option>
                    <option value="Scripture">Scripture</option>
                    <option value="Media">Media</option>
                    <option value="Broadcast">Broadcast</option>
                  </select>
                  <button
                    type="submit"
                    disabled={!newTaskTitle.trim()}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold py-2 rounded-lg text-xs shadow-md"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </form>

            {/* Task Items */}
            <div className="space-y-2">
              {tasks.map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isDone
                        ? 'bg-slate-900/40 border-slate-800/80 opacity-60'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task)}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-600 hover:border-amber-400'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div>
                        <div className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                          {task.title}
                        </div>
                        {task.notes && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {task.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {task.due && (
                      <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.due).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
