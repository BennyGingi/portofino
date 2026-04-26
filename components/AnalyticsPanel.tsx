'use client';

import { useEffect, useState, useCallback } from 'react';
import { Analytics, type AnalyticsData } from '@/lib/analytics';

export const openAnalytics = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('open-analytics'));
};

// ── Hooks ──────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, active: boolean): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return; }
    if (target === 0) { setValue(0); return; }
    let startTs: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const t = Math.min((ts - startTs) / duration, 1);
      setValue(Math.round((1 - Math.pow(2, -10 * t)) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return value;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PanelBox({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      padding: '24px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function PanelHeader({ title }: { title: string }) {
  return (
    <div style={{
      fontFamily: 'var(--font-space-mono)',
      fontSize: '10px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.15em',
      color: 'var(--text3)',
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: '1px solid var(--border)',
    }}>
      {title}
    </div>
  );
}

function StatCard({ label, value, active, delay }: { label: string; value: number; active: boolean; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!active) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  const count = useCountUp(value, 1200, visible);

  return (
    <PanelBox style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>
      <div style={{
        fontFamily: 'var(--font-orbitron)',
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'var(--cyan)',
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        {count}
      </div>
      <div style={{
        fontFamily: 'var(--font-space-mono)',
        fontSize: '10px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        color: 'var(--text3)',
      }}>
        {label}
      </div>
    </PanelBox>
  );
}

function TimeCard({ active, delay }: { active: boolean; delay: number }) {
  const [visible, setVisible] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  useEffect(() => {
    if (!active) return;
    setSeconds(Analytics.getTimeOnSite());
    const id = setInterval(() => setSeconds(Analytics.getTimeOnSite()), 1000);
    return () => clearInterval(id);
  }, [active]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <PanelBox style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>
      <div style={{
        fontFamily: 'var(--font-orbitron)',
        fontSize: '30px',
        fontWeight: 'bold',
        color: 'var(--cyan)',
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        {mins}m {secs}s
      </div>
      <div style={{
        fontFamily: 'var(--font-space-mono)',
        fontSize: '10px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        color: 'var(--text3)',
      }}>
        Time on Site
      </div>
    </PanelBox>
  );
}

function BarItem({
  label, value, max, barsReady, index,
}: { label: string; value: number; max: number; barsReady: boolean; index: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'var(--text2)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'var(--text3)' }}>{value}</span>
      </div>
      <div style={{ height: '4px', background: 'var(--bg3)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'var(--cyan)',
          borderRadius: '2px',
          width: barsReady ? `${pct}%` : '0%',
          transition: `width 0.8s ease ${index * 0.05}s`,
        }} />
      </div>
    </div>
  );
}

function DonutPanel({ title, label, color }: { title: string; label: string; color: string }) {
  return (
    <PanelBox>
      <PanelHeader title={title} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `conic-gradient(${color} 0% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'var(--bg2)',
          }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'var(--text2)' }}>{label}</span>
        </div>
      </div>
    </PanelBox>
  );
}

// ── Data constants ─────────────────────────────────────────────────────────────

const SECTIONS_LIST = ['Hero', 'About', 'Experience', 'Projects', 'Skills', 'Education', 'Contact'];

const PROJECTS_LIST = [
  { id: 'foodcritic',   label: 'FoodCritic' },
  { id: 'soc-portal',  label: 'SOC Portal' },
  { id: 'void-runner', label: 'VOID RUNNER' },
  { id: 'ghosteye',    label: 'GHOSTEYE' },
  { id: 'antigravity', label: 'ANTIGRAVITY' },
  { id: 'rati-tours',  label: 'Rati Tours' },
];

const BROWSER_COLORS: Record<string, string> = {
  Chrome:  'var(--cyan)',
  Firefox: '#ff8c42',
  Safari:  '#9d4edd',
  Edge:    '#3b82f6',
  Other:   'var(--text3)',
};

const SOURCE_COLORS: Record<string, string> = {
  LinkedIn: '#0077b5',
  GitHub:   'var(--text2)',
  Google:   '#ff8c42',
  Direct:   'var(--cyan)',
  Other:    'var(--text3)',
};

const DEVICE_COLORS: Record<string, string> = {
  desktop: 'var(--cyan)',
  mobile:  '#ff8c42',
  tablet:  '#9d4edd',
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function AnalyticsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [barsReady, setBarsReady] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
    setBarsReady(false);
    setData(null);
  }, []);

  const open = useCallback(() => {
    setData(Analytics.get());
    setIsOpen(true);
    setTimeout(() => setBarsReady(true), 400);
  }, []);

  useEffect(() => {
    const handleOpen = () => open();
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        open();
      }
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('open-analytics', handleOpen);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('open-analytics', handleOpen);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, close, isOpen]);

  if (!isOpen || !data) return null;

  const maxSections = Math.max(1, ...SECTIONS_LIST.map((s) => data.sectionsViewed[s] ?? 0));
  const maxProjects = Math.max(1, ...PROJECTS_LIST.map((p) => data.projectHovers[p.id] ?? 0));
  const lastCmds = [...data.terminalCommands].reverse().slice(0, 10);

  return (
    <>
      <style>{`
        @keyframes analyticsPanelIn {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0);  }
        }
        .analytics-panel-anim {
          animation: analyticsPanelIn 0.3s ease forwards;
        }
        .live-dot {
          animation: livePulse 2s ease-in-out infinite;
        }
        .analytics-scroll::-webkit-scrollbar { width: 4px; }
        .analytics-scroll::-webkit-scrollbar-track { background: transparent; }
        .analytics-scroll::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 960,
          background: 'rgba(2,5,8,0.97)',
          backdropFilter: 'blur(8px)',
          overflowY: 'auto',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div className="analytics-panel-anim">

          {/* ── Header ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 32px',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            background: 'rgba(2,5,8,0.97)',
            backdropFilter: 'blur(8px)',
            zIndex: 10,
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-orbitron)',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'var(--text)',
                letterSpacing: '0.08em',
              }}>
                PORTFOLIO ANALYTICS
              </div>
              <div style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '10px',
                color: 'var(--text3)',
                marginTop: '3px',
              }}>
                Session data · Stored locally · No external tracking
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* LIVE badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  className="live-dot"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    flexShrink: 0,
                  }}
                />
                <span style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '10px',
                  color: '#22c55e',
                  letterSpacing: '0.1em',
                }}>
                  LIVE
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={close}
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text2)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.2s, color 0.2s',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan)';
                  e.currentTarget.style.color = 'var(--text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text2)';
                }}
                aria-label="Close analytics"
              >
                ×
              </button>
            </div>
          </div>

          {/* ── Content ── */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Row 1: 4 stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <StatCard label="Total Visits"     value={data.totalVisits}   active={isOpen} delay={0}   />
              <TimeCard                                                       active={isOpen} delay={50}  />
              <StatCard label="Unique Sessions"  value={data.uniqueSessions} active={isOpen} delay={100} />
              <StatCard label="Chat Messages"    value={data.chatMessages}   active={isOpen} delay={150} />
            </div>

            {/* Row 2: Section engagement + Project interest */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <PanelBox>
                <PanelHeader title="Section Engagement" />
                {SECTIONS_LIST.map((section, i) => (
                  <BarItem
                    key={section}
                    label={section}
                    value={data.sectionsViewed[section] ?? 0}
                    max={maxSections}
                    barsReady={barsReady}
                    index={i}
                  />
                ))}
              </PanelBox>

              <PanelBox>
                <PanelHeader title="Project Interest" />
                {PROJECTS_LIST.map((project, i) => (
                  <BarItem
                    key={project.id}
                    label={project.label}
                    value={data.projectHovers[project.id] ?? 0}
                    max={maxProjects}
                    barsReady={barsReady}
                    index={i}
                  />
                ))}
              </PanelBox>
            </div>

            {/* Row 3: Device / Browser / Source */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <DonutPanel
                title="Device Type"
                label={data.deviceType.charAt(0).toUpperCase() + data.deviceType.slice(1)}
                color={DEVICE_COLORS[data.deviceType] ?? 'var(--text3)'}
              />
              <DonutPanel
                title="Browser"
                label={data.browserType}
                color={BROWSER_COLORS[data.browserType] ?? 'var(--text3)'}
              />
              <DonutPanel
                title="Traffic Source"
                label={data.trafficSource}
                color={SOURCE_COLORS[data.trafficSource] ?? 'var(--text3)'}
              />
            </div>

            {/* Row 4: Fun stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* sudo hire benny */}
              <PanelBox>
                <PanelHeader title="'sudo hire benny' Attempts" />
                <div style={{
                  fontFamily: 'var(--font-orbitron)',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'var(--orange)',
                  lineHeight: 1,
                  marginBottom: '10px',
                }}>
                  {data.sudoHireBennyCount}
                </div>
                <div style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '10px',
                  color: 'var(--text3)',
                  marginBottom: '12px',
                }}>
                  People who tried to hire you via terminal
                </div>
                {data.sudoHireBennyCount > 0 ? (
                  <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'var(--cyan)' }}>
                    🎉 Someone really wants you!
                  </div>
                ) : (
                  <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'var(--text3)' }}>
                    Be the first → type &apos;sudo hire benny&apos; in terminal
                  </div>
                )}
              </PanelBox>

              {/* Terminal commands */}
              <PanelBox style={{ display: 'flex', flexDirection: 'column' }}>
                <PanelHeader title="Terminal Commands Used" />
                {lastCmds.length === 0 ? (
                  <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'var(--text3)' }}>
                    No terminal activity yet
                  </div>
                ) : (
                  <div
                    className="analytics-scroll"
                    style={{ overflowY: 'auto', maxHeight: '180px', display: 'flex', flexDirection: 'column', gap: '6px' }}
                  >
                    {lastCmds.map((cmd, i) => (
                      <div key={i} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'var(--text2)' }}>
                        <span style={{ color: 'var(--cyan)' }}>$ </span>
                        {cmd}
                      </div>
                    ))}
                  </div>
                )}
              </PanelBox>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: 'var(--text3)' }}>
              All analytics data is stored in your browser&apos;s localStorage. Nothing is sent to any server. Ever.
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all analytics data? This cannot be undone.')) {
                  Analytics.reset();
                  setData(Analytics.get());
                  setBarsReady(false);
                  setTimeout(() => setBarsReady(true), 50);
                }
              }}
              style={{
                flexShrink: 0,
                fontFamily: 'var(--font-space-mono)',
                fontSize: '10px',
                color: 'var(--orange)',
                background: 'transparent',
                border: '1px solid var(--orange)',
                padding: '6px 14px',
                cursor: 'pointer',
                borderRadius: '2px',
                transition: 'background 0.2s',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,107,43,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              [RESET DATA]
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
