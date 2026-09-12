export interface VisitorStatsData {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  lastUpdatedDate: string;
  pageBreakdown: Record<string, number>;
  dailyBreakdown?: Record<string, number>;
  recentVisits?: Array<{
    id: string;
    path: string;
    pageTitle?: string;
    timestamp: string;
    visitorId: string;
    userAgent?: string;
    referrer?: string;
  }>;
}

const VISITOR_ID_KEY = 'we_visitor_id';
const LOCAL_STATS_KEY = 'we_visitor_stats_cache';

function getOrCreateVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return `v_anon_${Math.random().toString(36).slice(2, 8)}`;
  }
}

let cachedClientStats: VisitorStatsData | null = null;
const listeners: Array<(stats: VisitorStatsData) => void> = [];

export function subscribeToVisitorStats(callback: (stats: VisitorStatsData) => void): () => void {
  listeners.push(callback);
  if (cachedClientStats) {
    callback(cachedClientStats);
  } else {
    // Try to load cached stats
    try {
      const saved = localStorage.getItem(LOCAL_STATS_KEY);
      if (saved) {
        cachedClientStats = JSON.parse(saved);
        if (cachedClientStats) callback(cachedClientStats);
      }
    } catch {
      // Ignore parse error
    }
  }

  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function notifyListeners(stats: VisitorStatsData) {
  cachedClientStats = stats;
  try {
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota
  }
  listeners.forEach((cb) => {
    try {
      cb(stats);
    } catch (e) {
      console.warn('Listener notification error:', e);
    }
  });
}

export async function fetchVisitorStats(): Promise<VisitorStatsData | null> {
  try {
    const res = await fetch('/api/analytics/stats');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && data.stats) {
      notifyListeners(data.stats);
      return data.stats;
    }
  } catch (err) {
    console.warn('Failed to fetch visitor stats:', err);
  }
  return cachedClientStats;
}

// Session deduplication to avoid double counting on fast route re-clicks
let lastRecordedPath: string = '';
let lastRecordedTime: number = 0;

export async function recordPageView(path: string, pageTitle?: string): Promise<VisitorStatsData | null> {
  const now = Date.now();
  if (lastRecordedPath === path && now - lastRecordedTime < 3000) {
    return cachedClientStats;
  }
  lastRecordedPath = path;
  lastRecordedTime = now;

  const visitorId = getOrCreateVisitorId();

  try {
    const res = await fetch('/api/analytics/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        pageTitle: pageTitle || document.title,
        visitorId,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.stats) {
        notifyListeners(data.stats);
        return data.stats;
      }
    }
  } catch (err) {
    console.warn('Failed to record page view:', err);
  }

  return cachedClientStats;
}
