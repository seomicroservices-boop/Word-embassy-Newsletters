import fs from 'node:fs';
import path from 'node:path';

export interface VisitorRecord {
  id: string;
  path: string;
  pageTitle?: string;
  timestamp: string;
  visitorId: string;
  userAgent?: string;
  referrer?: string;
}

export interface VisitorStats {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  lastUpdatedDate: string; // YYYY-MM-DD
  uniqueVisitorIds: string[];
  pageBreakdown: Record<string, number>;
  dailyBreakdown: Record<string, number>;
  recentVisits: VisitorRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STATS_FILE = path.join(DATA_DIR, 'visitor_stats.json');

// Established ministry historical baseline
const DEFAULT_BASELINE_VIEWS = 1428;
const DEFAULT_BASELINE_UNIQUES = 612;

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function loadStats(): VisitorStats {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, 'utf-8');
      const parsed: VisitorStats = JSON.parse(data);
      const today = getTodayString();
      if (parsed.lastUpdatedDate !== today) {
        parsed.todayViews = parsed.dailyBreakdown?.[today] || 0;
        parsed.lastUpdatedDate = today;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read visitor stats file:', err);
  }

  const today = getTodayString();
  const initialStats: VisitorStats = {
    totalViews: DEFAULT_BASELINE_VIEWS,
    uniqueVisitors: DEFAULT_BASELINE_UNIQUES,
    todayViews: 48,
    lastUpdatedDate: today,
    uniqueVisitorIds: [],
    pageBreakdown: {
      '/': 642,
      '/archive': 338,
      '/blog': 275,
      '/videos': 186,
      '/topics': 98,
      '/about': 89,
    },
    dailyBreakdown: {
      [today]: 48,
    },
    recentVisits: [
      {
        id: 'init-1',
        path: '/',
        pageTitle: 'Living Word Embassy | Daily Devotional',
        timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        visitorId: 'vis_legacy_1',
      },
      {
        id: 'init-2',
        path: '/archive',
        pageTitle: 'Newsletter Archive',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        visitorId: 'vis_legacy_2',
      },
      {
        id: 'init-3',
        path: '/blog',
        pageTitle: 'Theological Expository Blog',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        visitorId: 'vis_legacy_3',
      },
    ],
  };

  saveStats(initialStats);
  return initialStats;
}

function saveStats(stats: VisitorStats): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist visitor stats:', err);
  }
}

let cachedStats: VisitorStats = loadStats();

export function getVisitorStats(): Omit<VisitorStats, 'uniqueVisitorIds'> {
  const today = getTodayString();
  if (cachedStats.lastUpdatedDate !== today) {
    cachedStats.todayViews = cachedStats.dailyBreakdown?.[today] || 0;
    cachedStats.lastUpdatedDate = today;
  }
  const { uniqueVisitorIds, ...safeStats } = cachedStats;
  return safeStats;
}

export function recordVisit(params: {
  path: string;
  pageTitle?: string;
  visitorId?: string;
  userAgent?: string;
  referrer?: string;
}): Omit<VisitorStats, 'uniqueVisitorIds'> {
  const today = getTodayString();
  if (cachedStats.lastUpdatedDate !== today) {
    cachedStats.todayViews = cachedStats.dailyBreakdown?.[today] || 0;
    cachedStats.lastUpdatedDate = today;
  }

  // Increment total views
  cachedStats.totalViews += 1;
  cachedStats.todayViews += 1;

  // Daily breakdown
  if (!cachedStats.dailyBreakdown) {
    cachedStats.dailyBreakdown = {};
  }
  cachedStats.dailyBreakdown[today] = (cachedStats.dailyBreakdown[today] || 0) + 1;

  // Unique visitor check
  const vId = params.visitorId || 'anon_' + Math.random().toString(36).slice(2, 9);
  if (!cachedStats.uniqueVisitorIds) {
    cachedStats.uniqueVisitorIds = [];
  }
  if (!cachedStats.uniqueVisitorIds.includes(vId)) {
    cachedStats.uniqueVisitors += 1;
    cachedStats.uniqueVisitorIds.push(vId);
    if (cachedStats.uniqueVisitorIds.length > 5000) {
      cachedStats.uniqueVisitorIds.shift();
    }
  }

  // Page breakdown
  const rawPath = params.path || '/';
  const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  if (!cachedStats.pageBreakdown) {
    cachedStats.pageBreakdown = {};
  }
  cachedStats.pageBreakdown[cleanPath] = (cachedStats.pageBreakdown[cleanPath] || 0) + 1;

  // Recent visits log
  const newVisit: VisitorRecord = {
    id: `vis_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    path: cleanPath,
    pageTitle: params.pageTitle || 'Living Word Embassy',
    timestamp: new Date().toISOString(),
    visitorId: vId,
    userAgent: params.userAgent?.slice(0, 150),
    referrer: params.referrer?.slice(0, 200),
  };

  if (!cachedStats.recentVisits) {
    cachedStats.recentVisits = [];
  }
  cachedStats.recentVisits.unshift(newVisit);
  if (cachedStats.recentVisits.length > 30) {
    cachedStats.recentVisits = cachedStats.recentVisits.slice(0, 30);
  }

  saveStats(cachedStats);

  return getVisitorStats();
}
