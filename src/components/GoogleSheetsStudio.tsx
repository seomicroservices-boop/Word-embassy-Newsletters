import React, { useState, useEffect, useRef } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Grid,
  List,
  Folder,
  MoreVertical,
  ChevronDown,
  ArrowLeft,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Check,
  Share2,
  Lock,
  Sparkles,
  Undo2,
  Redo2,
  Printer,
  Paintbrush,
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Filter,
  Sigma,
  Table,
  CheckCircle2,
  Trash2,
  FileDown,
  Layers,
  Copy,
  ChevronRight,
} from 'lucide-react';
import { Topic, Newsletter, Subscriber, EmailLog, SystemLog } from '../types';
import { getAccessToken } from '../services/firebaseAuth';
import { createMasterSpreadsheet, SpreadsheetInfo } from '../services/googleSheets';

interface SheetTab {
  id: string;
  name: string;
  data: (string | number)[][];
}

interface SpreadsheetDocument {
  id: string;
  title: string;
  lastOpened: string;
  owner: string;
  tabs: SheetTab[];
  activeTabId: string;
  isTemplate?: boolean;
}

interface GoogleSheetsStudioProps {
  topics: Topic[];
  newsletters: Newsletter[];
  subscribers: Subscriber[];
  emailLogs: EmailLog[];
  systemLogs?: SystemLog[];
  onAddLog?: (action: string, status: 'Success' | 'Warning' | 'Error', details: string) => void;
}

const DEFAULT_COLS = 16; // A to P
const DEFAULT_ROWS = 30; // 1 to 30

function getColName(colIdx: number): string {
  let name = '';
  let temp = colIdx;
  while (temp >= 0) {
    name = String.fromCharCode((temp % 26) + 65) + name;
    temp = Math.floor(temp / 26) - 1;
  }
  return name;
}

function createEmptyGrid(rows = DEFAULT_ROWS, cols = DEFAULT_COLS): (string | number)[][] {
  const grid: (string | number)[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: (string | number)[] = [];
    for (let c = 0; c < cols; c++) {
      row.push('');
    }
    grid.push(row);
  }
  return grid;
}

export const GoogleSheetsStudio: React.FC<GoogleSheetsStudioProps> = ({
  topics,
  newsletters,
  subscribers,
  emailLogs,
  systemLogs = [],
  onAddLog,
}) => {
  // Mode: 'launcher' (Google Sheets start page from screenshot) vs 'editor' (interactive spreadsheet)
  const [viewMode, setViewMode] = useState<'launcher' | 'editor'>('launcher');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');
  const [filterOwner, setFilterOwner] = useState<'anyone' | 'me' | 'not_me'>('anyone');

  // Active spreadsheet state
  const [currentDoc, setCurrentDoc] = useState<SpreadsheetDocument | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [isEditingCell, setIsEditingCell] = useState(false);
  const [cellEditValue, setCellEditValue] = useState('');
  const [formulaBarValue, setFormulaBarValue] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Formatting state for active cell / selection
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [fontSize, setFontSize] = useState<number>(11);
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [textColor, setTextColor] = useState<string>('#1E293B');
  const [fillColor, setFillColor] = useState<string>('transparent');

  // Cloud sync status
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'synced_drive'>('saved');
  const [isSyncingWithGoogle, setIsSyncingWithGoogle] = useState(false);

  // Stored spreadsheets
  const [savedDocs, setSavedDocs] = useState<SpreadsheetDocument[]>(() => {
    // Generate initial master doc populated with real app records
    const masterTabs: SheetTab[] = [
      {
        id: 'tab-topics',
        name: 'Topics',
        data: [
          ['TopicID', 'Topic Title', 'Scripture Reference', 'Theme', 'Priority', 'Status', 'PublishDate', 'Notes'],
          ...topics.map((t) => [
            t.TopicID,
            t.Topic,
            t.Scripture,
            t.Theme,
            t.Priority,
            t.Status,
            t.PublishDate,
            t.Notes || '',
          ]),
          ...Array.from({ length: Math.max(0, 20 - topics.length) }, () => Array(8).fill('')),
        ],
      },
      {
        id: 'tab-subscribers',
        name: 'Subscribers',
        data: [
          ['SubscriberID', 'Name', 'Email Address', 'Cohort Group', 'Date Subscribed', 'Status', 'Send Count', 'Source'],
          ...subscribers.map((s) => [
            s.SubscriberID,
            s.Name,
            s.Email,
            s.Group || 'General Subscribers',
            s.DateSubscribed,
            s.Status,
            s.SendCount,
            s.Source,
          ]),
          ...Array.from({ length: Math.max(0, 20 - subscribers.length) }, () => Array(8).fill('')),
        ],
      },
      {
        id: 'tab-newsletters',
        name: 'Newsletters',
        data: [
          ['NewsletterID', 'TopicID', 'Title', 'Scripture Reference', 'Theme', 'Status', 'Email Status', 'Publish Date'],
          ...newsletters.map((n) => [
            n.NewsletterID,
            n.TopicID,
            n.Title,
            n.ScriptureReference,
            n.Theme,
            n.Status,
            n.EmailStatus,
            n.PublishDate,
          ]),
          ...Array.from({ length: Math.max(0, 20 - newsletters.length) }, () => Array(8).fill('')),
        ],
      },
      {
        id: 'tab-emaillogs',
        name: 'Email_Logs',
        data: [
          ['EmailLogID', 'NewsletterID', 'SubscriberID', 'Recipient Email', 'Sent Timestamp', 'Status', 'Attempt'],
          ...emailLogs.map((l) => [
            l.EmailLogID,
            l.NewsletterID,
            l.SubscriberID,
            l.Email,
            l.SentAt,
            l.Status,
            l.AttemptNumber || 1,
          ]),
          ...Array.from({ length: Math.max(0, 20 - emailLogs.length) }, () => Array(7).fill('')),
        ],
      },
    ];

    return [
      {
        id: 'doc-master',
        title: 'Living Word Embassy — Content & Subscriber Master',
        lastOpened: '1:02 PM',
        owner: 'me',
        tabs: masterTabs,
        activeTabId: 'tab-topics',
      },
      {
        id: 'doc-todo',
        title: 'To-do list',
        lastOpened: '12:45 PM',
        owner: 'me',
        tabs: [
          {
            id: 'tab-todo-1',
            name: 'Editorial Tasks',
            data: [
              ['Task ID', 'Description', 'Scripture Exegesis', 'Assignee', 'Due Date', 'Status', 'Priority'],
              ['TASK-01', 'Verify Greek morphology for Luke 18:1', 'Luke 18:1', 'Lead Theologian', '2026-09-01', 'COMPLETED', 'HIGH'],
              ['TASK-02', 'Render 9:16 Veo Video Devotional asset', 'Philippians 4:6', 'Media Producer', '2026-09-02', 'IN_PROGRESS', 'HIGH'],
              ['TASK-03', 'Schedule Sunday batch email dispatch', 'Psalm 89:15', 'Editorial Team', '2026-09-03', 'PENDING', 'MEDIUM'],
              ['TASK-04', 'Sync subscriber cohort to Google Sheets', 'General', 'Admin', '2026-09-04', 'PENDING', 'LOW'],
              ...Array.from({ length: 20 }, () => Array(7).fill('')),
            ],
          },
        ],
        activeTabId: 'tab-todo-1',
      },
      {
        id: 'doc-budget',
        title: 'Annual ministry budget tracker',
        lastOpened: 'Aug 28',
        owner: 'me',
        tabs: [
          {
            id: 'tab-budget-1',
            name: '2026 Budget',
            data: [
              ['Category', 'Q1 Projected ($)', 'Q1 Actual ($)', 'Q2 Projected ($)', 'Q2 Actual ($)', 'Variance ($)', 'Notes'],
              ['Digital Publishing & Hosting', 450, 420, 450, 430, 50, 'Cloud Run, Domains, SSL'],
              ['Multimedia & AI Generation', 600, 580, 600, 590, 30, 'Gemini 3.7 Flash API & Veo'],
              ['Email Delivery (MailApp/Gmail)', 200, 150, 200, 180, 70, 'Google Workspace Enterprise'],
              ['Bible Research & Theological Resources', 300, 290, 300, 300, 10, 'Greek/Hebrew Lexicons'],
              ['Total Ministry Expenditures', '=SUM(B2:B5)', '=SUM(C2:C5)', '=SUM(D2:D5)', '=SUM(E2:E5)', '=SUM(F2:F5)', 'Balanced'],
              ...Array.from({ length: 20 }, () => Array(7).fill('')),
            ],
          },
        ],
        activeTabId: 'tab-budget-1',
      },
    ];
  });

  const cellInputRef = useRef<HTMLInputElement>(null);

  // Sync active cell to formula bar
  useEffect(() => {
    if (currentDoc) {
      const activeTab = currentDoc.tabs.find((t) => t.id === currentDoc.activeTabId) || currentDoc.tabs[0];
      const val = activeTab?.data?.[activeCell.row]?.[activeCell.col] ?? '';
      setFormulaBarValue(String(val));
      setCellEditValue(String(val));
    }
  }, [activeCell, currentDoc]);

  // Compute evaluated value for formula strings (e.g., =SUM(B2:B5), =A1+B1, =COUNT, =AVERAGE)
  const evaluateCellFormula = (rawVal: string | number, grid: (string | number)[][]): string | number => {
    if (typeof rawVal !== 'string' || !rawVal.startsWith('=')) {
      return rawVal;
    }

    const formula = rawVal.substring(1).trim().toUpperCase();

    try {
      // SUM(A1:A5) or SUM(B2:B10)
      const sumMatch = formula.match(/^SUM\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
      if (sumMatch) {
        const startCol = sumMatch[1].charCodeAt(0) - 65;
        const startRow = parseInt(sumMatch[2], 10) - 1;
        const endCol = sumMatch[3].charCodeAt(0) - 65;
        const endRow = parseInt(sumMatch[4], 10) - 1;

        let sum = 0;
        for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
          for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
            const v = Number(grid[r]?.[c]);
            if (!isNaN(v)) sum += v;
          }
        }
        return sum;
      }

      // AVERAGE(A1:A5)
      const avgMatch = formula.match(/^AVERAGE\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
      if (avgMatch) {
        const startCol = avgMatch[1].charCodeAt(0) - 65;
        const startRow = parseInt(avgMatch[2], 10) - 1;
        const endCol = avgMatch[3].charCodeAt(0) - 65;
        const endRow = parseInt(avgMatch[4], 10) - 1;

        let sum = 0;
        let count = 0;
        for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
          for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
            const v = Number(grid[r]?.[c]);
            if (!isNaN(v) && grid[r]?.[c] !== '') {
              sum += v;
              count++;
            }
          }
        }
        return count > 0 ? (sum / count).toFixed(2) : 0;
      }

      // COUNT(A1:A10)
      const countMatch = formula.match(/^COUNT\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
      if (countMatch) {
        const startCol = countMatch[1].charCodeAt(0) - 65;
        const startRow = parseInt(countMatch[2], 10) - 1;
        const endCol = countMatch[3].charCodeAt(0) - 65;
        const endRow = parseInt(countMatch[4], 10) - 1;

        let count = 0;
        for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
          for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
            if (grid[r]?.[c] !== '' && grid[r]?.[c] !== undefined) count++;
          }
        }
        return count;
      }

      // Simple arithmetic e.g. A1+B1 or 100+200
      const cellRefMatch = formula.match(/^([A-Z]+)(\d+)\s*([\+\-\*\/])\s*([A-Z]+)(\d+)$/);
      if (cellRefMatch) {
        const c1 = cellRefMatch[1].charCodeAt(0) - 65;
        const r1 = parseInt(cellRefMatch[2], 10) - 1;
        const op = cellRefMatch[3];
        const c2 = cellRefMatch[4].charCodeAt(0) - 65;
        const r2 = parseInt(cellRefMatch[5], 10) - 1;

        const val1 = Number(grid[r1]?.[c1]) || 0;
        const val2 = Number(grid[r2]?.[c2]) || 0;

        if (op === '+') return val1 + val2;
        if (op === '-') return val1 - val2;
        if (op === '*') return val1 * val2;
        if (op === '/') return val2 !== 0 ? (val1 / val2).toFixed(2) : '#DIV/0!';
      }

      return rawVal;
    } catch {
      return '#ERROR!';
    }
  };

  // 1. CREATE BLANK SPREADSHEET HANDLER (The core request matching the screenshot!)
  const handleCreateBlankSpreadsheet = () => {
    const newDocId = `doc_blank_${Date.now()}`;
    const newDoc: SpreadsheetDocument = {
      id: newDocId,
      title: 'Untitled spreadsheet',
      lastOpened: 'Just now',
      owner: 'me',
      tabs: [
        {
          id: `tab_sheet1_${Date.now()}`,
          name: 'Sheet1',
          data: createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS),
        },
      ],
      activeTabId: `tab_sheet1_${Date.now()}`,
    };

    setSavedDocs((prev) => [newDoc, ...prev]);
    setCurrentDoc(newDoc);
    setActiveCell({ row: 0, col: 0 });
    setViewMode('editor');
    onAddLog?.('Created Blank Spreadsheet', 'Success', 'Created new blank spreadsheet with interactive grid');
  };

  // 2. CREATE FROM TEMPLATE
  const handleCreateFromTemplate = (templateType: 'master' | 'todo' | 'annual_budget' | 'monthly_budget' | 'finance' | 'calendar') => {
    const timestamp = Date.now();
    let templateDoc: SpreadsheetDocument;

    if (templateType === 'master') {
      templateDoc = {
        id: `doc_master_${timestamp}`,
        title: 'Living Word Embassy — Content & Subscriber Master',
        lastOpened: 'Just now',
        owner: 'me',
        tabs: [
          {
            id: `tab_top_${timestamp}`,
            name: 'Topics',
            data: [
              ['TopicID', 'Topic Title', 'Scripture Reference', 'Theme', 'Priority', 'Status', 'PublishDate', 'Notes'],
              ...topics.map((t) => [t.TopicID, t.Topic, t.Scripture, t.Theme, t.Priority, t.Status, t.PublishDate, t.Notes || '']),
              ...Array.from({ length: 20 }, () => Array(8).fill('')),
            ],
          },
          {
            id: `tab_sub_${timestamp}`,
            name: 'Subscribers',
            data: [
              ['SubscriberID', 'Name', 'Email Address', 'Cohort Group', 'Date Subscribed', 'Status', 'Send Count', 'Source'],
              ...subscribers.map((s) => [s.SubscriberID, s.Name, s.Email, s.Group || 'General', s.DateSubscribed, s.Status, s.SendCount, s.Source]),
              ...Array.from({ length: 20 }, () => Array(8).fill('')),
            ],
          },
        ],
        activeTabId: `tab_top_${timestamp}`,
      };
    } else if (templateType === 'todo') {
      templateDoc = {
        id: `doc_todo_${timestamp}`,
        title: 'To-do list',
        lastOpened: 'Just now',
        owner: 'me',
        tabs: [
          {
            id: `tab_todo_${timestamp}`,
            name: 'To-Do',
            data: [
              ['Done', 'Date', 'Task Description', 'Category', 'Priority', 'Owner'],
              ['[ ]', '2026-09-01', 'Finalize Sunday Devotional Manuscript', 'Editorial', 'HIGH', 'Lead Pastor'],
              ['[ ]', '2026-09-01', 'Review Veo Video Devotional rendering', 'Media', 'HIGH', 'Video Editor'],
              ['[ ]', '2026-09-02', 'Dispatch email campaign via Google Stack', 'Broadcast', 'MEDIUM', 'Broadcast Mgr'],
              ['[ ]', '2026-09-03', 'Reconcile subscriber feedback in Forms', 'Intercession', 'LOW', 'Prayer Team'],
              ...Array.from({ length: 25 }, () => Array(6).fill('')),
            ],
          },
        ],
        activeTabId: `tab_todo_${timestamp}`,
      };
    } else if (templateType === 'annual_budget') {
      templateDoc = {
        id: `doc_ann_budget_${timestamp}`,
        title: 'Annual budget',
        lastOpened: 'Just now',
        owner: 'me',
        tabs: [
          {
            id: `tab_ann_${timestamp}`,
            name: 'Annual Summary',
            data: [
              ['Category', 'Budget ($)', 'Q1 Actual ($)', 'Q2 Actual ($)', 'Q3 Actual ($)', 'Q4 Actual ($)', 'Total Spent ($)'],
              ['Ministry Hosting & Infrastructure', 2400, 580, 590, 600, 600, '=SUM(C2:F2)'],
              ['Theological Content & Licensing', 3600, 900, 900, 900, 900, '=SUM(C3:F3)'],
              ['Multimedia & Video Production', 4800, 1200, 1150, 1250, 1200, '=SUM(C4:F4)'],
              ['Email Communications & Tools', 1800, 420, 430, 450, 450, '=SUM(C5:F5)'],
              ['Total Operations', '=SUM(B2:B5)', '=SUM(C2:C5)', '=SUM(D2:D5)', '=SUM(E2:E5)', '=SUM(F2:F5)', '=SUM(G2:G5)'],
              ...Array.from({ length: 20 }, () => Array(7).fill('')),
            ],
          },
        ],
        activeTabId: `tab_ann_${timestamp}`,
      };
    } else if (templateType === 'monthly_budget') {
      templateDoc = {
        id: `doc_month_budget_${timestamp}`,
        title: 'Monthly budget',
        lastOpened: 'Just now',
        owner: 'me',
        tabs: [
          {
            id: `tab_month_${timestamp}`,
            name: 'Monthly Cash Flow',
            data: [
              ['Income Source', 'Projected ($)', 'Actual ($)', 'Expense Item', 'Budget ($)', 'Actual ($)', 'Net ($)'],
              ['Reader Tithes & Offerings', 5000, 5250, 'Server & API Ingestion', 450, 420, 4830],
              ['Ministry Partner Donations', 3000, 3100, 'Creative Media Assets', 600, 580, 2520],
              ['Sermon Publication Downloads', 1500, 1620, 'Print Study Booklets', 400, 390, 1230],
              ['Special Project Grants', 2000, 2000, 'Pastoral Administration', 1000, 1000, 1000],
              ['Total Monthly Operations', '=SUM(B2:B5)', '=SUM(C2:C5)', 'Total Costs', '=SUM(E2:E5)', '=SUM(F2:F5)', '=C6-F6'],
              ...Array.from({ length: 20 }, () => Array(7).fill('')),
            ],
          },
        ],
        activeTabId: `tab_month_${timestamp}`,
      };
    } else if (templateType === 'finance') {
      templateDoc = {
        id: `doc_finance_${timestamp}`,
        title: 'Google Finance Investment Tracker',
        lastOpened: 'Just now',
        owner: 'me',
        tabs: [
          {
            id: `tab_fin_${timestamp}`,
            name: 'Portfolio',
            data: [
              ['Ticker', 'Asset Name', 'Shares', 'Purchase Price ($)', 'Current Price ($)', 'Market Value ($)', 'Gain / Loss ($)'],
              ['GOOGL', 'Alphabet Inc. Class A', 50, 165.5, 182.4, '=C2*E2', '=(E2-D2)*C2'],
              ['MSFT', 'Microsoft Corporation', 30, 390.0, 415.8, '=C3*E3', '=(E3-D3)*C3'],
              ['AAPL', 'Apple Inc.', 45, 210.0, 228.6, '=C4*E4', '=(E4-D4)*C4'],
              ['VOO', 'Vanguard S&P 500 ETF', 100, 480.0, 518.2, '=C5*E5', '=(E5-D5)*C5'],
              ['Portfolio Total', 'Equities & Index', '', '', '', '=SUM(F2:F5)', '=SUM(G2:G5)'],
              ...Array.from({ length: 20 }, () => Array(7).fill('')),
            ],
          },
        ],
        activeTabId: `tab_fin_${timestamp}`,
      };
    } else {
      templateDoc = {
        id: `doc_cal_${timestamp}`,
        title: 'Annual Calendar & Editorial Schedule',
        lastOpened: 'Just now',
        owner: 'me',
        tabs: [
          {
            id: `tab_cal_${timestamp}`,
            name: 'Schedule 2026',
            data: [
              ['Week #', 'Publish Date', 'Devotional Title', 'Scripture Focus', 'Theological Theme', 'Broadcast Format', 'Status'],
              ['Week 35', '2026-08-30', 'The Power of Persistent Prayer', 'Luke 18:1-8', 'Unfailing Faith', 'Article + Veo Video', 'PUBLISHED'],
              ['Week 36', '2026-09-06', 'Walking in Supernatural Peace', 'Philippians 4:6-7', 'Divine Peace', 'Article + YouTube Short', 'SCHEDULED'],
              ['Week 37', '2026-09-13', 'Radiance of Divine Favor', 'Psalm 89:15-17', 'Divine Favor', 'Full Multimedia Suite', 'SCHEDULED'],
              ['Week 38', '2026-09-20', 'Rooted in Unshakeable Grace', 'Ephesians 3:16-19', 'Spiritual Roots', 'Devotional Guide', 'DRAFT'],
              ...Array.from({ length: 48 }, (_, i) => [`Week ${i + 39}`, '2026-09-27', '', '', '', '', 'PLANNED']),
            ],
          },
        ],
        activeTabId: `tab_cal_${timestamp}`,
      };
    }

    setSavedDocs((prev) => [templateDoc, ...prev]);
    setCurrentDoc(templateDoc);
    setActiveCell({ row: 0, col: 0 });
    setViewMode('editor');
    onAddLog?.('Template Loaded', 'Success', `Created spreadsheet from "${templateDoc.title}" template`);
  };

  // Open existing document
  const handleOpenDoc = (doc: SpreadsheetDocument) => {
    setCurrentDoc(doc);
    setActiveCell({ row: 0, col: 0 });
    setViewMode('editor');
  };

  // Cell editing handlers
  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
    setIsEditingCell(false);
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    setActiveCell({ row, col });
    setIsEditingCell(true);
    setTimeout(() => cellInputRef.current?.focus(), 50);
  };

  const handleUpdateCellValue = (newVal: string) => {
    if (!currentDoc) return;
    setSyncStatus('saving');

    const updatedTabs = currentDoc.tabs.map((tab) => {
      if (tab.id === currentDoc.activeTabId) {
        const newData = tab.data.map((r) => [...r]);
        // Expand grid if row/col out of bounds
        while (newData.length <= activeCell.row) {
          newData.push(Array(DEFAULT_COLS).fill(''));
        }
        while (newData[activeCell.row].length <= activeCell.col) {
          newData[activeCell.row].push('');
        }
        newData[activeCell.row][activeCell.col] = newVal;
        return { ...tab, data: newData };
      }
      return tab;
    });

    const updatedDoc = { ...currentDoc, tabs: updatedTabs };
    setCurrentDoc(updatedDoc);
    setSavedDocs((prev) => prev.map((d) => (d.id === currentDoc.id ? updatedDoc : d)));

    setTimeout(() => {
      setSyncStatus('saved');
    }, 300);
  };

  const handleAddRow = () => {
    if (!currentDoc) return;
    const updatedTabs = currentDoc.tabs.map((tab) => {
      if (tab.id === currentDoc.activeTabId) {
        const colsCount = tab.data[0]?.length || DEFAULT_COLS;
        return { ...tab, data: [...tab.data, Array(colsCount).fill('')] };
      }
      return tab;
    });
    const updatedDoc = { ...currentDoc, tabs: updatedTabs };
    setCurrentDoc(updatedDoc);
    setSavedDocs((prev) => prev.map((d) => (d.id === currentDoc.id ? updatedDoc : d)));
  };

  const handleAddColumn = () => {
    if (!currentDoc) return;
    const updatedTabs = currentDoc.tabs.map((tab) => {
      if (tab.id === currentDoc.activeTabId) {
        return {
          ...tab,
          data: tab.data.map((r) => [...r, '']),
        };
      }
      return tab;
    });
    const updatedDoc = { ...currentDoc, tabs: updatedTabs };
    setCurrentDoc(updatedDoc);
    setSavedDocs((prev) => prev.map((d) => (d.id === currentDoc.id ? updatedDoc : d)));
  };

  const handleAddSheetTab = () => {
    if (!currentDoc) return;
    const newTabId = `tab_${Date.now()}`;
    const newTabName = `Sheet${currentDoc.tabs.length + 1}`;
    const newTab: SheetTab = {
      id: newTabId,
      name: newTabName,
      data: createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS),
    };
    const updatedDoc = {
      ...currentDoc,
      tabs: [...currentDoc.tabs, newTab],
      activeTabId: newTabId,
    };
    setCurrentDoc(updatedDoc);
    setSavedDocs((prev) => prev.map((d) => (d.id === currentDoc.id ? updatedDoc : d)));
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!currentDoc) return;
    const activeTab = currentDoc.tabs.find((t) => t.id === currentDoc.activeTabId) || currentDoc.tabs[0];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      activeTab.data
        .map((row) =>
          row
            .map((cell) => {
              const str = String(cell ?? '');
              return str.includes(',') || str.includes('"') || str.includes('\n')
                ? `"${str.replace(/"/g, '""')}"`
                : str;
            })
            .join(',')
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentDoc.title}_${activeTab.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Live Sync with Google Sheets API
  const handleSyncToRealGoogleSheets = async () => {
    if (!currentDoc) return;
    setIsSyncingWithGoogle(true);
    setSyncStatus('saving');
    try {
      const res = await createMasterSpreadsheet(currentDoc.title, {
        topics,
        newsletters,
        subscribers,
        emailLogs,
        systemLogs,
      });
      setSyncStatus('synced_drive');
      onAddLog?.('Google Sheets Cloud Sync', 'Success', `Synced "${currentDoc.title}" to Google Sheets ID: ${res.spreadsheetId}`);
      alert(`Successfully synchronized with Google Sheets! Live ID: ${res.spreadsheetId}`);
    } catch (e: any) {
      onAddLog?.('Google Sheets Cloud Sync Error', 'Error', e.message);
    } finally {
      setIsSyncingWithGoogle(false);
    }
  };

  const activeTab = currentDoc?.tabs.find((t) => t.id === currentDoc?.activeTabId) || currentDoc?.tabs[0];
  const gridData = activeTab?.data || createEmptyGrid();
  const activeColCount = gridData[0]?.length || DEFAULT_COLS;
  const activeRowCount = gridData.length || DEFAULT_ROWS;

  const filteredDocs = savedDocs.filter((d) => {
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterOwner === 'me' && d.owner !== 'me') return false;
    if (filterOwner === 'not_me' && d.owner === 'me') return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* =========================================================================
          VIEW 1: GOOGLE SHEETS START PORTAL (MATCHING SCREENSHOT)
          ========================================================================= */}
      {viewMode === 'launcher' && (
        <div className="bg-[#F8FAFD] rounded-2xl border border-slate-200 overflow-hidden shadow-xl text-slate-800 font-sans">
          {/* Top Google Sheets App Bar */}
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-2">
                <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
                <span className="text-xl font-medium text-slate-700 tracking-tight">Sheets</span>
              </div>
            </div>

            {/* Google Search Bar */}
            <div className="flex-1 max-w-2xl mx-2 sm:mx-8">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in spreadsheets..."
                  className="w-full bg-[#EEF2F6] hover:bg-[#E5EAEF] focus:bg-white text-slate-800 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:border-slate-300 focus:shadow-sm focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Account & Quick Action */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-full text-xs font-semibold transition-colors"
                title="Create a new blank Google Sheet on docs.google.com"
              >
                <span>sheets.new</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                W
              </div>
            </div>
          </div>

          {/* TEMPLATE GALLERY SECTION: "Start a new spreadsheet" */}
          <div className="bg-[#F1F3F4] px-4 sm:px-8 py-6 border-b border-slate-200">
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Start a new spreadsheet</span>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="hover:text-slate-900 cursor-pointer flex items-center gap-1">
                    Template gallery <MoreVertical className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {/* 1. BLANK SPREADSHEET (PRIMARY FEATURE) */}
                <div
                  onClick={handleCreateBlankSpreadsheet}
                  className="group cursor-pointer flex flex-col space-y-2"
                  id="google-sheets-blank-spreadsheet-card"
                >
                  <div className="aspect-[4/3] bg-white rounded-lg border border-slate-300 group-hover:border-emerald-600 group-hover:shadow-md transition-all flex items-center justify-center p-4 relative overflow-hidden">
                    {/* Google 4-color Plus Icon */}
                    <div className="w-12 h-12 relative flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 36 36" className="w-10 h-10">
                        <path fill="#4285F4" d="M16 16v14h4V20z" />
                        <path fill="#34A853" d="M30 16H20l-4 4h14z" />
                        <path fill="#FBBC05" d="M6 16h10l4-4H6z" />
                        <path fill="#EA4335" d="M20 16V6h-4v10z" />
                      </svg>
                    </div>
                    <div className="absolute top-1 right-1 text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      New
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-800 group-hover:text-emerald-700 truncate">
                    Blank spreadsheet
                  </span>
                </div>

                {/* 2. Living Word Embassy Master DB Template */}
                <div
                  onClick={() => handleCreateFromTemplate('master')}
                  className="group cursor-pointer flex flex-col space-y-2"
                >
                  <div className="aspect-[4/3] bg-white rounded-lg border border-slate-300 group-hover:border-emerald-600 group-hover:shadow-md transition-all p-2 flex flex-col justify-between overflow-hidden">
                    <div className="h-2.5 bg-emerald-600 rounded-xs w-full mb-1" />
                    <div className="space-y-1">
                      <div className="h-1 bg-slate-200 rounded-xs w-full" />
                      <div className="h-1 bg-slate-200 rounded-xs w-5/6" />
                      <div className="h-1 bg-slate-200 rounded-xs w-4/6" />
                      <div className="h-1 bg-slate-200 rounded-xs w-full" />
                    </div>
                    <div className="text-[8px] font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded text-center">
                      Living Word Embassy Master
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700 truncate">
                    Living Word Embassy Master
                  </span>
                </div>

                {/* 3. To-do List Template */}
                <div
                  onClick={() => handleCreateFromTemplate('todo')}
                  className="group cursor-pointer flex flex-col space-y-2"
                >
                  <div className="aspect-[4/3] bg-white rounded-lg border border-slate-300 group-hover:border-emerald-600 group-hover:shadow-md transition-all p-2 flex flex-col justify-between overflow-hidden">
                    <div className="h-2.5 bg-emerald-700 rounded-xs w-full mb-1" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-xs bg-emerald-500" />
                        <div className="h-1 bg-slate-200 rounded-xs flex-1" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-xs bg-slate-300" />
                        <div className="h-1 bg-slate-200 rounded-xs flex-1" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-xs bg-slate-300" />
                        <div className="h-1 bg-slate-200 rounded-xs flex-1" />
                      </div>
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 text-center">To-do list</div>
                  </div>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700 truncate">
                    To-do list
                  </span>
                </div>

                {/* 4. Annual Budget Template */}
                <div
                  onClick={() => handleCreateFromTemplate('annual_budget')}
                  className="group cursor-pointer flex flex-col space-y-2"
                >
                  <div className="aspect-[4/3] bg-white rounded-lg border border-slate-300 group-hover:border-emerald-600 group-hover:shadow-md transition-all p-2 flex flex-col justify-between overflow-hidden">
                    <div className="h-2.5 bg-amber-600 rounded-xs w-full mb-1" />
                    <div className="grid grid-cols-3 gap-1 my-1">
                      <div className="h-3 bg-amber-100 rounded-xs" />
                      <div className="h-3 bg-amber-100 rounded-xs" />
                      <div className="h-3 bg-amber-200 rounded-xs" />
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 text-center">Annual budget</div>
                  </div>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700 truncate">
                    Annual budget
                  </span>
                </div>

                {/* 5. Monthly Budget Template */}
                <div
                  onClick={() => handleCreateFromTemplate('monthly_budget')}
                  className="group cursor-pointer flex flex-col space-y-2"
                >
                  <div className="aspect-[4/3] bg-white rounded-lg border border-slate-300 group-hover:border-emerald-600 group-hover:shadow-md transition-all p-2 flex flex-col justify-between overflow-hidden">
                    <div className="h-2.5 bg-blue-600 rounded-xs w-full mb-1" />
                    <div className="flex items-end gap-1 h-5 my-1">
                      <div className="w-1.5 h-3 bg-blue-400 rounded-xs" />
                      <div className="w-1.5 h-4 bg-blue-500 rounded-xs" />
                      <div className="w-1.5 h-5 bg-blue-600 rounded-xs" />
                      <div className="w-1.5 h-2 bg-blue-300 rounded-xs" />
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 text-center">Monthly budget</div>
                  </div>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700 truncate">
                    Monthly budget
                  </span>
                </div>

                {/* 6. Google Finance Investment Template */}
                <div
                  onClick={() => handleCreateFromTemplate('finance')}
                  className="group cursor-pointer flex flex-col space-y-2"
                >
                  <div className="aspect-[4/3] bg-white rounded-lg border border-slate-300 group-hover:border-emerald-600 group-hover:shadow-md transition-all p-2 flex flex-col justify-between overflow-hidden">
                    <div className="h-2.5 bg-indigo-600 rounded-xs w-full mb-1" />
                    <div className="space-y-1">
                      <div className="h-1.5 bg-indigo-100 rounded-xs w-full" />
                      <div className="h-1.5 bg-emerald-100 rounded-xs w-4/5" />
                      <div className="h-1.5 bg-indigo-100 rounded-xs w-3/5" />
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 text-center">Google Finance</div>
                  </div>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700 truncate">
                    Google Finance Invest...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT SPREADSHEETS LIST SECTION */}
          <div className="px-4 sm:px-8 py-6 bg-white">
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Header Filters & View Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 text-xs text-slate-600">
                <div className="font-semibold text-slate-800 text-sm">Today</div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span>Owned by:</span>
                    <select
                      value={filterOwner}
                      onChange={(e: any) => setFilterOwner(e.target.value)}
                      className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
                    >
                      <option value="anyone">anyone</option>
                      <option value="me">me</option>
                      <option value="not_me">not me</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                    <button
                      onClick={() => setViewLayout('list')}
                      className={`p-1.5 rounded hover:bg-slate-100 ${viewLayout === 'list' ? 'text-slate-900 bg-slate-100' : 'text-slate-400'}`}
                      title="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewLayout('grid')}
                      className={`p-1.5 rounded hover:bg-slate-100 ${viewLayout === 'grid' ? 'text-slate-900 bg-slate-100' : 'text-slate-400'}`}
                      title="Grid view"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Spreadsheets List */}
              {viewLayout === 'list' ? (
                <div className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleOpenDoc(doc)}
                      className="py-3 px-2 sm:px-4 rounded-xl hover:bg-[#F8FAFD] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-medium text-slate-800 group-hover:text-emerald-700 truncate">
                          {doc.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 sm:gap-12 text-xs text-slate-500 font-mono shrink-0">
                        <span className="hidden sm:inline">{doc.owner}</span>
                        <span>{doc.lastOpened}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDoc(doc);
                            }}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600"
                            title="Open in Editor"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleOpenDoc(doc)}
                      className="bg-[#F8FAFD] hover:bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-4 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{doc.lastOpened}</span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-800 truncate">{doc.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Owner: {doc.owner}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
                        <span>Open Sheets Grid</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: FULL INTERACTIVE GOOGLE SHEETS SPREADSHEET EDITOR & GRID
          ========================================================================= */}
      {viewMode === 'editor' && currentDoc && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col min-h-[750px] font-sans text-slate-800">
          {/* Top Google Sheets Header */}
          <div className="bg-[#F9FBFD] border-b border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setViewMode('launcher')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                title="Back to Sheets Start Portal"
              >
                <ArrowLeft className="w-5 h-5 text-emerald-600" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentDoc.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const updated = { ...currentDoc, title: newTitle };
                      setCurrentDoc(updated);
                      setSavedDocs((prev) => prev.map((d) => (d.id === currentDoc.id ? updated : d)));
                    }}
                    className="font-medium text-base text-slate-900 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-hidden transition-colors"
                  />
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {syncStatus === 'saving' ? 'Saving...' : 'Saved to Drive'}
                  </span>
                </div>

                {/* Sheets Menu Bar */}
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5 font-normal">
                  <span className="hover:text-slate-900 cursor-pointer">File</span>
                  <span className="hover:text-slate-900 cursor-pointer">Edit</span>
                  <span className="hover:text-slate-900 cursor-pointer">View</span>
                  <span className="hover:text-slate-900 cursor-pointer">Insert</span>
                  <span className="hover:text-slate-900 cursor-pointer">Format</span>
                  <span className="hover:text-slate-900 cursor-pointer">Data</span>
                  <span className="hover:text-slate-900 cursor-pointer">Tools</span>
                  <span className="hover:text-slate-900 cursor-pointer">Extensions</span>
                  <span className="hover:text-slate-900 cursor-pointer">Help</span>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSyncToRealGoogleSheets}
                disabled={isSyncingWithGoogle}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Sync all data to Google Sheets Cloud via API"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithGoogle ? 'animate-spin' : ''}`} />
                <span>{isSyncingWithGoogle ? 'Syncing...' : 'Sync to Google Sheets API'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Download active sheet as CSV"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Open in Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ACTION TOOLBAR (ICON CONTROLS) */}
          <div className="bg-[#EDF2FA] border-b border-slate-200 px-3 py-1.5 flex flex-wrap items-center gap-1 text-slate-700 text-xs">
            <button
              onClick={() => onAddLog?.('Undo Action', 'Success', 'Spreadsheet undo state triggered')}
              className="p-1 hover:bg-slate-200 rounded"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAddLog?.('Redo Action', 'Success', 'Spreadsheet redo state triggered')}
              className="p-1 hover:bg-slate-200 rounded"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-1 hover:bg-slate-200 rounded"
              title="Print"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Zoom Selector */}
            <select
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value, 10))}
              className="bg-transparent hover:bg-slate-200 text-[11px] px-1 py-0.5 rounded cursor-pointer"
            >
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
            </select>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Font Family & Size */}
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="bg-transparent hover:bg-slate-200 text-[11px] px-1 py-0.5 rounded cursor-pointer"
            >
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier</option>
            </select>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="bg-transparent hover:bg-slate-200 text-[11px] px-1 py-0.5 rounded cursor-pointer"
            >
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="18">18</option>
            </select>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Text Style: Bold, Italic, Strikethrough */}
            <button
              onClick={() => setIsBold(!isBold)}
              className={`p-1 rounded ${isBold ? 'bg-slate-300 text-slate-900 font-bold' : 'hover:bg-slate-200'}`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsItalic(!isItalic)}
              className={`p-1 rounded ${isItalic ? 'bg-slate-300 text-slate-900' : 'hover:bg-slate-200'}`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsStrikethrough(!isStrikethrough)}
              className={`p-1 rounded ${isStrikethrough ? 'bg-slate-300 text-slate-900' : 'hover:bg-slate-200'}`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Alignment */}
            <button
              onClick={() => setTextAlign('left')}
              className={`p-1 rounded ${textAlign === 'left' ? 'bg-slate-300' : 'hover:bg-slate-200'}`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('center')}
              className={`p-1 rounded ${textAlign === 'center' ? 'bg-slate-300' : 'hover:bg-slate-200'}`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('right')}
              className={`p-1 rounded ${textAlign === 'right' ? 'bg-slate-300' : 'hover:bg-slate-200'}`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Quick Math Formulas Helper */}
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-300 text-[11px] font-mono">
              <Sigma className="w-3.5 h-3.5 text-emerald-600" />
              <button
                onClick={() => handleUpdateCellValue(`=SUM(A1:A${activeCell.row})`)}
                className="hover:text-emerald-700 font-bold px-1"
                title="Insert SUM formula"
              >
                SUM
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => handleUpdateCellValue(`=AVERAGE(A1:A${activeCell.row})`)}
                className="hover:text-emerald-700 font-bold px-1"
                title="Insert AVERAGE formula"
              >
                AVG
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => handleUpdateCellValue(`=COUNT(A1:A${activeCell.row})`)}
                className="hover:text-emerald-700 font-bold px-1"
                title="Insert COUNT formula"
              >
                COUNT
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleAddRow}
                className="px-2 py-0.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>Add Row</span>
              </button>
              <button
                onClick={handleAddColumn}
                className="px-2 py-0.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>Add Column</span>
              </button>
            </div>
          </div>

          {/* FORMULA BAR (fx BAR) */}
          <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center gap-2">
            {/* Active Cell Coordinate Box */}
            <div className="w-14 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-center text-xs font-mono font-bold text-slate-700">
              {getColName(activeCell.col)}
              {activeCell.row + 1}
            </div>

            {/* fx Symbol */}
            <span className="font-serif italic font-bold text-slate-400 text-xs px-1">fx</span>

            {/* Formula Input Box */}
            <input
              type="text"
              value={formulaBarValue}
              onChange={(e) => {
                setFormulaBarValue(e.target.value);
                handleUpdateCellValue(e.target.value);
              }}
              placeholder="Enter text or formula (e.g. =SUM(A1:A5))..."
              className="flex-1 text-xs font-mono text-slate-900 bg-transparent focus:outline-hidden px-2 py-1 rounded focus:bg-slate-50"
            />
          </div>

          {/* SPREADSHEET 2D GRID */}
          <div
            className="flex-1 overflow-auto bg-[#F8F9FA] relative"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
          >
            <table className="border-collapse table-fixed w-full text-xs font-sans">
              <thead>
                <tr className="bg-[#F8F9FA] sticky top-0 z-20">
                  {/* Corner Select All Box */}
                  <th className="w-12 h-6 bg-[#F1F3F4] border-r border-b border-slate-300 text-center text-[10px] text-slate-500 font-mono select-none" />
                  {/* Column Headers A, B, C... */}
                  {Array.from({ length: activeColCount }, (_, colIdx) => (
                    <th
                      key={colIdx}
                      className={`min-w-[120px] max-w-[220px] h-6 border-r border-b border-slate-300 text-center text-[11px] font-mono select-none ${
                        activeCell.col === colIdx
                          ? 'bg-[#E8F0FE] text-blue-700 font-bold border-b-2 border-b-blue-600'
                          : 'bg-[#F1F3F4] text-slate-600 font-normal hover:bg-slate-200'
                      }`}
                    >
                      {getColName(colIdx)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: activeRowCount }, (_, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50/50">
                    {/* Row Number Header 1, 2, 3... */}
                    <td
                      className={`w-12 h-7 border-r border-b border-slate-300 text-center text-[10px] font-mono select-none sticky left-0 z-10 ${
                        activeCell.row === rowIdx
                          ? 'bg-[#E8F0FE] text-blue-700 font-bold border-r-2 border-r-blue-600'
                          : 'bg-[#F1F3F4] text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {rowIdx + 1}
                    </td>

                    {/* Grid Cells */}
                    {Array.from({ length: activeColCount }, (_, colIdx) => {
                      const isSelected = activeCell.row === rowIdx && activeCell.col === colIdx;
                      const rawVal = gridData[rowIdx]?.[colIdx] ?? '';
                      const displayVal = evaluateCellFormula(rawVal, gridData);
                      const isFormula = typeof rawVal === 'string' && rawVal.startsWith('=');
                      const isHeaderRow = rowIdx === 0 && rawVal !== '';

                      return (
                        <td
                          key={colIdx}
                          onClick={() => handleCellClick(rowIdx, colIdx)}
                          onDoubleClick={() => handleCellDoubleClick(rowIdx, colIdx)}
                          className={`min-w-[120px] max-w-[220px] h-7 px-2 border-r border-b border-slate-200 text-xs overflow-hidden text-ellipsis whitespace-nowrap relative select-none transition-colors ${
                            isSelected
                              ? 'bg-white ring-2 ring-blue-500 z-10 shadow-xs'
                              : isHeaderRow
                              ? 'bg-slate-50/80 font-semibold text-slate-900'
                              : 'bg-white text-slate-800'
                          }`}
                          style={{
                            textAlign,
                            fontWeight: isBold || isHeaderRow ? 'bold' : 'normal',
                            fontStyle: isItalic ? 'italic' : 'normal',
                            textDecoration: isStrikethrough ? 'line-through' : 'none',
                            fontFamily,
                            fontSize: `${fontSize}px`,
                            color: isFormula ? '#047857' : textColor,
                          }}
                        >
                          {isSelected && isEditingCell ? (
                            <input
                              ref={cellInputRef}
                              type="text"
                              value={cellEditValue}
                              onChange={(e) => {
                                setCellEditValue(e.target.value);
                                setFormulaBarValue(e.target.value);
                                handleUpdateCellValue(e.target.value);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setIsEditingCell(false);
                                  setActiveCell((prev) => ({ ...prev, row: Math.min(prev.row + 1, activeRowCount - 1) }));
                                } else if (e.key === 'Tab') {
                                  e.preventDefault();
                                  setIsEditingCell(false);
                                  setActiveCell((prev) => ({ ...prev, col: Math.min(prev.col + 1, activeColCount - 1) }));
                                } else if (e.key === 'Escape') {
                                  setIsEditingCell(false);
                                }
                              }}
                              onBlur={() => setIsEditingCell(false)}
                              className="w-full h-full bg-white border-0 outline-hidden text-xs p-0 font-sans"
                            />
                          ) : (
                            <span>{String(displayVal)}</span>
                          )}

                          {/* Corner selection handle */}
                          {isSelected && (
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-600 border border-white cursor-crosshair" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTTOM SHEET TABS BAR (Sheet1, Topics, Subscribers, etc.) */}
          <div className="bg-[#F8F9FA] border-t border-slate-300 px-3 py-1.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={handleAddSheetTab}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                title="Add Sheet Tab (+)"
              >
                <Plus className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              {/* Tab Pills */}
              {currentDoc.tabs.map((tab) => {
                const isActiveTab = tab.id === currentDoc.activeTabId;
                return (
                  <div
                    key={tab.id}
                    onClick={() => {
                      setCurrentDoc({ ...currentDoc, activeTabId: tab.id });
                      setActiveCell({ row: 0, col: 0 });
                    }}
                    className={`px-3 py-1 rounded-t-lg border-t-2 text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-all ${
                      isActiveTab
                        ? 'bg-white border-t-emerald-600 text-emerald-800 shadow-xs border-x border-slate-300'
                        : 'bg-transparent border-t-transparent text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab.name}</span>
                    {currentDoc.tabs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = currentDoc.tabs.filter((t) => t.id !== tab.id);
                          setCurrentDoc({
                            ...currentDoc,
                            tabs: updated,
                            activeTabId: updated[0]?.id || '',
                          });
                        }}
                        className="hover:text-rose-600 text-slate-400 p-0.5 rounded"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono shrink-0">
              <span>{activeRowCount} rows × {activeColCount} columns</span>
              <button
                onClick={() => setViewMode('launcher')}
                className="text-emerald-700 hover:underline font-semibold"
              >
                Sheets Start Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
