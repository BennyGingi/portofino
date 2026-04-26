const STORAGE_KEY = 'portfolio_analytics';

export interface AnalyticsData {
  totalVisits: number;
  uniqueSessions: number;
  sectionsViewed: Record<string, number>;
  projectHovers: Record<string, number>;
  chatMessages: number;
  terminalCommands: string[];
  terminalOpens: number;
  themePreference: 'dark' | 'light' | 'unknown';
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browserType: string;
  trafficSource: string;
  sudoHireBennyCount: number;
  timeOnSite: number;
  lastVisit: string;
  firstVisit: string;
}

const DEFAULTS: AnalyticsData = {
  totalVisits: 0,
  uniqueSessions: 0,
  sectionsViewed: {},
  projectHovers: {},
  chatMessages: 0,
  terminalCommands: [],
  terminalOpens: 0,
  themePreference: 'unknown',
  deviceType: 'desktop',
  browserType: 'Other',
  trafficSource: 'Direct',
  sudoHireBennyCount: 0,
  timeOnSite: 0,
  lastVisit: '',
  firstVisit: '',
};

function store(): Storage | null {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; }
  catch { return null; }
}

function detectDevice(): AnalyticsData['deviceType'] {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/iPhone|Android.*Mobile|BlackBerry/i.test(ua)) return 'mobile';
  if (/iPad|Android(?!.*Mobile)/i.test(ua)) return 'tablet';
  return 'desktop';
}

function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'Other';
  const ua = navigator.userAgent;
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/Chrome/i.test(ua)) return 'Chrome';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Safari/i.test(ua)) return 'Safari';
  return 'Other';
}

function detectSource(): string {
  if (typeof document === 'undefined') return 'Direct';
  const ref = document.referrer;
  if (!ref) return 'Direct';
  if (/linkedin/i.test(ref)) return 'LinkedIn';
  if (/github/i.test(ref)) return 'GitHub';
  if (/google/i.test(ref)) return 'Google';
  return 'Other';
}

// Captured once on module load — used for getTimeOnSite()
const PAGE_LOAD_TIME = typeof performance !== 'undefined' ? performance.now() : 0;

export const Analytics = {
  get(): AnalyticsData {
    const s = store();
    if (!s) return { ...DEFAULTS };
    try {
      const raw = s.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch {
      return { ...DEFAULTS };
    }
  },

  save(data: AnalyticsData): void {
    const s = store();
    if (!s) return;
    try { s.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* full / private browsing */ }
  },

  incrementVisits(): void {
    const data = this.get();
    const now = new Date().toISOString();
    data.totalVisits += 1;
    data.uniqueSessions += 1;
    data.lastVisit = now;
    if (!data.firstVisit) data.firstVisit = now;
    data.deviceType = detectDevice();
    data.browserType = detectBrowser();
    data.trafficSource = detectSource();
    this.save(data);
  },

  trackSection(section: string): void {
    const data = this.get();
    data.sectionsViewed[section] = (data.sectionsViewed[section] ?? 0) + 1;
    this.save(data);
  },

  trackProjectHover(project: string): void {
    const data = this.get();
    data.projectHovers[project] = (data.projectHovers[project] ?? 0) + 1;
    this.save(data);
  },

  trackChatMessage(): void {
    const data = this.get();
    data.chatMessages += 1;
    this.save(data);
  },

  trackTerminalCommand(cmd: string): void {
    const data = this.get();
    data.terminalCommands = [...data.terminalCommands, cmd].slice(-50);
    this.save(data);
  },

  trackTerminalOpen(): void {
    const data = this.get();
    data.terminalOpens += 1;
    this.save(data);
  },

  trackTheme(theme: string): void {
    const data = this.get();
    if (theme === 'light' || theme === 'dark') data.themePreference = theme;
    this.save(data);
  },

  trackSudoHire(): void {
    const data = this.get();
    data.sudoHireBennyCount += 1;
    this.save(data);
  },

  getTimeOnSite(): number {
    if (typeof performance === 'undefined') return 0;
    return Math.floor((performance.now() - PAGE_LOAD_TIME) / 1000);
  },

  reset(): void {
    const s = store();
    if (!s) return;
    try { s.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  },
};
