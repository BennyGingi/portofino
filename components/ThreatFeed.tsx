"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

// ── Types ─────────────────────────────────────────────────────────────────────
type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
type Source = "CrowdStrike" | "Hunters SIEM" | "Cisco IronPort" | "Palo Alto" | "Microsoft Defender" | "Canary Token";
type Status = "OPEN" | "INVESTIGATING" | "RESOLVED" | "ESCALATED";

interface AlertTemplate {
  source: Source;
  severity: Severity;
  title: string;
  detail: string;
  mitre: string;
  category: string;
}

interface LiveAlert extends AlertTemplate {
  id: string;
  timestamp: Date;
  status: Status;
  notes: string;
  isNew: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const rc = <T,>(arr: T[]): T => arr[ri(0, arr.length - 1)];
const randomIP = () => `${ri(10,220)}.${ri(0,255)}.${ri(0,255)}.${ri(1,254)}`;
const randomHost = () => `${rc(["DESKTOP","MOBILEYE","WS","SRV"])}-${rc(["A","B","C","D","X","Z"])}${ri(100,999)}`;
const randomUser = () => rc(["a_bennyg","j_cohen","m_levi","d_shapiro","r_goldberg","svc_backup","sys_radar_sw","g_KoblenzLab"]);

function relativeTime(date: Date, nowMs: number): string {
  const secs = Math.floor((nowMs - date.getTime()) / 1000);
  if (secs < 5)  return "just now";
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

// ── Alert Pool ────────────────────────────────────────────────────────────────
const ALERT_POOL: AlertTemplate[] = [
  {
    source: "Cisco IronPort",
    severity: "HIGH",
    category: "PHISHING",
    title: "Phishing email detected",
    detail: `Sender: support@micros0ft-verify[.]com → ${randomUser()}@mobileye.com`,
    mitre: "T1566.002 · Spearphishing Link",
  },
  {
    source: "Cisco IronPort",
    severity: "HIGH",
    category: "PHISHING",
    title: "Suspicious attachment blocked",
    detail: `File: invoice_${ri(1000,9999)}.exe — recipient: hr@mobileye.com`,
    mitre: "T1566.001 · Spearphishing Attachment",
  },
  {
    source: "Cisco IronPort",
    severity: "MEDIUM",
    category: "PHISHING",
    title: "Lookalike domain detected",
    detail: "mob1leye[.]com flagged — 94% visual similarity to mobileye.com",
    mitre: "T1566 · Phishing",
  },
  {
    source: "CrowdStrike",
    severity: "CRITICAL",
    category: "MALWARE",
    title: "Malware execution blocked",
    detail: `powershell.exe -enc [base64] on ${randomHost()} · user: ${randomUser()}`,
    mitre: "T1059.001 · PowerShell",
  },
  {
    source: "CrowdStrike",
    severity: "CRITICAL",
    category: "RANSOMWARE",
    title: "Ransomware behavior detected",
    detail: `Mass file rename on \\\\FILESERVER0${ri(1,3)} — ${ri(200,800)} files affected`,
    mitre: "T1486 · Data Encrypted for Impact",
  },
  {
    source: "CrowdStrike",
    severity: "HIGH",
    category: "C2",
    title: "C2 beacon attempt detected",
    detail: `${randomHost()} → ${randomIP()}:${rc([4444,8080,443,1337])} · interval: ${ri(30,120)}s`,
    mitre: "T1071.001 · Web Protocols",
  },
  {
    source: "Palo Alto",
    severity: "HIGH",
    category: "INTRUSION",
    title: "Brute force attack detected",
    detail: `${ri(400,900)} failed SSH attempts from ${randomIP()} in 60s`,
    mitre: "T1110 · Brute Force",
  },
  {
    source: "Hunters SIEM",
    severity: "CRITICAL",
    category: "LATERAL MOVEMENT",
    title: "Admin share access failure storm",
    detail: `Source: ${randomIP()} — ${ri(10,20)} hosts targeted · account: ${randomUser()}`,
    mitre: "T1021.002 · SMB/Windows Admin Shares",
  },
  {
    source: "CrowdStrike",
    severity: "HIGH",
    category: "CREDENTIAL",
    title: "Mimikatz signature detected",
    detail: `LSASS memory dump attempt on ${randomHost()} · user: ${randomUser()}`,
    mitre: "T1003.001 · LSASS Memory",
  },
  {
    source: "Hunters SIEM",
    severity: "HIGH",
    category: "ANOMALY",
    title: "Impossible travel detected",
    detail: `${randomUser()} logged from IL and US within ${ri(3,8)} minutes`,
    mitre: "T1078 · Valid Accounts",
  },
  {
    source: "Hunters SIEM",
    severity: "MEDIUM",
    category: "ANOMALY",
    title: "After-hours privileged login",
    detail: `Account: ${randomUser()} — accessed at 0${ri(1,4)}:${ri(10,59)} AM`,
    mitre: "T1078.002 · Domain Accounts",
  },
  {
    source: "Hunters SIEM",
    severity: "MEDIUM",
    category: "ANOMALY",
    title: "Service account interactive login",
    detail: `${randomUser()} — interactive session on ${randomHost()}`,
    mitre: "T1078.003 · Local Accounts",
  },
  {
    source: "Canary Token",
    severity: "HIGH",
    category: "HONEYPOT",
    title: "Canary token triggered",
    detail: `Fake AWS key accessed from ${randomIP()} · region: eu-west-1`,
    mitre: "T1083 · File and Directory Discovery",
  },
  {
    source: "Canary Token",
    severity: "HIGH",
    category: "HONEYPOT",
    title: "Honeypot file accessed",
    detail: `\\\\TRAP\\passwords.xlsx opened by CORP\\${randomUser()}`,
    mitre: "T1039 · Data from Network Shared Drive",
  },
  {
    source: "Microsoft Defender",
    severity: "MEDIUM",
    category: "MALWARE",
    title: "Suspicious PE file in temp directory",
    detail: `C:\\Users\\${randomUser()}\\AppData\\Local\\Temp\\tmp_${ri(1000,9999)}.exe`,
    mitre: "T1106 · Native API",
  },
  {
    source: "Palo Alto",
    severity: "INFO",
    category: "NETWORK",
    title: "Unusual outbound traffic volume",
    detail: `${randomHost()} → ${randomIP()} — ${ri(50,500)}MB in ${ri(2,10)}min`,
    mitre: "T1048 · Exfiltration Over Alt Protocol",
  },
];

// ── Severity config ───────────────────────────────────────────────────────────
const SEV_CONFIG: Record<Severity, { bg: string; text: string; border: string; glow: string }> = {
  CRITICAL: { bg: "bg-red-600/20",    text: "text-red-400",    border: "border-red-500/60",   glow: "shadow-[0_0_12px_rgba(239,68,68,0.3)]" },
  HIGH:     { bg: "bg-orange-600/20", text: "text-orange-400", border: "border-orange-500/50", glow: "shadow-[0_0_8px_rgba(249,115,22,0.2)]" },
  MEDIUM:   { bg: "bg-yellow-600/20", text: "text-yellow-400", border: "border-yellow-500/40", glow: "" },
  LOW:      { bg: "bg-cyan-600/20",   text: "text-cyan-400",   border: "border-cyan-500/30",   glow: "" },
  INFO:     { bg: "bg-gray-600/20",   text: "text-gray-400",   border: "border-gray-500/30",   glow: "" },
};

const STATUS_CONFIG: Record<Status, { text: string; label: string }> = {
  OPEN:          { text: "text-yellow-400", label: "● OPEN" },
  INVESTIGATING: { text: "text-blue-400",   label: "◎ INVESTIGATING" },
  RESOLVED:      { text: "text-green-400",  label: "✓ RESOLVED" },
  ESCALATED:     { text: "text-red-400",    label: "↑ ESCALATED" },
};

const SOURCE_COLORS: Record<Source, string> = {
  "CrowdStrike":       "text-orange-400",
  "Hunters SIEM":      "text-cyan-400",
  "Cisco IronPort":    "text-blue-400",
  "Palo Alto":         "text-red-400",
  "Microsoft Defender":"text-purple-400",
  "Canary Token":      "text-yellow-400",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ThreatFeed() {
  const [feed, setFeed]       = useState<LiveAlert[]>([]);
  const [selected, setSelected] = useState<LiveAlert | null>(null);
  const [nowMs, setNowMs]     = useState(() => Date.now());
  const [stats, setStats]     = useState({ total: 0, critical: 0, resolved: 0 });
  const [paused, setPaused]   = useState(false);
  const feedRef               = useRef<HTMLDivElement>(null);
  const reduced               = usePrefersReducedMotion();

  // ── live clock ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduced) return; // no ticking "Xs ago" updates under reduced motion
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, [reduced]);

  // ── alert generator ─────────────────────────────────────────────────────────
  const spawnAlert = useCallback(() => {
    const tmpl = rc(ALERT_POOL);
    const alert: LiveAlert = {
      ...tmpl,
      // re-evaluate detail so random values are fresh each time
      detail: ALERT_POOL.find(a => a.title === tmpl.title)?.detail ?? tmpl.detail,
      id: `${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
      timestamp: new Date(),
      status: "OPEN",
      notes: "",
      isNew: true,
    };
    setFeed(prev => {
      const next = [alert, ...prev].slice(0, 10);
      return next;
    });
    setStats(s => ({
      total: s.total + 1,
      critical: s.critical + (alert.severity === "CRITICAL" ? 1 : 0),
      resolved: s.resolved,
    }));
    // strip isNew after animation
    setTimeout(() => {
      setFeed(prev => prev.map(a => a.id === alert.id ? { ...a, isNew: false } : a));
    }, 600);
  }, []);

  useEffect(() => {
    // Reduced motion: seed a static snapshot once, then no ongoing spawns.
    if (reduced) {
      if (feed.length === 0) { spawnAlert(); spawnAlert(); spawnAlert(); spawnAlert(); }
      return;
    }
    if (paused) return;
    let cancelled = false;
    const schedule = () => {
      const delay = ri(3000, 5500);
      const t = setTimeout(() => {
        if (!cancelled) { spawnAlert(); schedule(); }
      }, delay);
      return () => clearTimeout(t);
    };
    const cancel = schedule();
    return () => { cancelled = true; cancel(); };
    // feed.length intentionally omitted — seed runs once on the empty feed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, spawnAlert, reduced]);

  // ── update helper ────────────────────────────────────────────────────────────
  const updateAlert = (id: string, patch: Partial<LiveAlert>) => {
    setFeed(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...patch } : null);
    if (patch.status === "RESOLVED") setStats(s => ({ ...s, resolved: s.resolved + 1 }));
  };

  return (
    <section id="threatfeed" className="w-full py-16 px-4 md:px-8 lg:px-14">
      {/* ── section header ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="inline-block mb-3">
          <span className="font-space-mono text-xs tracking-widest uppercase border border-(--cyan)/30 bg-(--cyan)/5 px-3 py-1" style={{ color: "var(--cyan)" }}>
            INITIALIZE SYSTEM //
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="font-orbitron font-bold text-3xl" style={{ color: "var(--text)" }}>
            LIVE THREAT FEED
          </h2>
          <div className="flex items-center gap-2 font-space-mono text-xs" style={{ color: "var(--text3)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-green-400 font-bold">LIVE</span>
            <span style={{ color: "var(--text3)" }}>·</span>
            <span suppressHydrationWarning>
              {new Date(nowMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
          <button
            onClick={() => setPaused(p => !p)}
            className="ml-auto font-space-mono text-xs px-3 py-1 border transition-colors"
            style={{
              borderColor: paused ? "var(--orange)" : "var(--border)",
              color: paused ? "var(--orange)" : "var(--text3)",
            }}
          >
            {paused ? "▶ RESUME" : "⏸ PAUSE"}
          </button>
        </div>
        <p className="font-space-mono text-xs mt-2" style={{ color: "var(--text3)" }}>
          Real alerts. Fake data. Real skills.
        </p>
      </div>

      {/* ── main grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ── LEFT: alert feed ────────────────────────────────────────────── */}
        <div
          ref={feedRef}
          className="lg:col-span-5 flex flex-col gap-2 max-h-130 overflow-y-auto pr-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--cyan) transparent" }}
        >
          {feed.length === 0 && (
            <div className="font-space-mono text-xs text-center py-12" style={{ color: "var(--text3)" }}>
              Waiting for events...
            </div>
          )}
          {feed.map((a) => {
            const sev = SEV_CONFIG[a.severity];
            const st  = STATUS_CONFIG[a.status];
            return (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={[
                  "w-full text-left p-3 border transition-all duration-200 group",
                  sev.border,
                  a.id === selected?.id ? sev.bg : "bg-(--bg2) hover:bg-(--bg3)",
                  a.severity === "CRITICAL" || a.severity === "HIGH" ? sev.glow : "",
                  a.isNew ? "animate-[slideIn_0.4s_ease_forwards]" : "",
                ].join(" ")}
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 border ${sev.text} ${sev.border} ${sev.bg}`}>
                      {a.severity}
                    </span>
                    <span className={`text-[10px] ${SOURCE_COLORS[a.source]}`}>{a.source}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--text3)" }}>
                    {relativeTime(a.timestamp, nowMs)}
                  </span>
                </div>
                <div className="text-xs font-bold mb-0.5" style={{ color: "var(--text)" }}>{a.title}</div>
                <div className="text-[10px] truncate mb-1" style={{ color: "var(--text3)" }}>{a.detail}</div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] ${st.text}`}>{st.label}</span>
                  <span className="text-[10px]" style={{ color: "var(--text3)" }}>{a.category}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── MIDDLE: detail panel ────────────────────────────────────────── */}
        <div
          className="lg:col-span-4 border p-4 flex flex-col gap-3"
          style={{ background: "var(--bg2)", borderColor: "var(--border)", fontFamily: "'Space Mono', monospace" }}
        >
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="text-4xl opacity-20">⚡</div>
              <p className="text-xs text-center" style={{ color: "var(--text3)" }}>
                Select an alert to begin triage
              </p>
            </div>
          ) : (
            <>
              {/* alert header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 border ${SEV_CONFIG[selected.severity].text} ${SEV_CONFIG[selected.severity].border} ${SEV_CONFIG[selected.severity].bg}`}>
                    {selected.severity}
                  </span>
                  <span className={`text-[10px] ${SOURCE_COLORS[selected.source]}`}>{selected.source}</span>
                  <span className={`ml-auto text-[10px] ${STATUS_CONFIG[selected.status].text}`}>
                    {STATUS_CONFIG[selected.status].label}
                  </span>
                </div>
                <div className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{selected.title}</div>
                <div className="text-xs" style={{ color: "var(--text3)" }}>
                  {relativeTime(selected.timestamp, nowMs)} · {selected.category}
                </div>
              </div>

              {/* detail block — terminal style */}
              <div className="text-xs border p-3 space-y-1" style={{ background: "var(--bg3)", borderColor: "var(--border)" }}>
                <div style={{ color: "var(--text3)" }}>
                  <span style={{ color: "var(--cyan)" }}>DETAIL</span> → {selected.detail}
                </div>
                <div style={{ color: "var(--text3)" }}>
                  <span style={{ color: "var(--cyan)" }}>MITRE  </span> → {selected.mitre}
                </div>
                <div style={{ color: "var(--text3)" }}>
                  <span style={{ color: "var(--cyan)" }}>TIME   </span> → {selected.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {/* action buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "TRIAGE ✓",   status: "INVESTIGATING" as Status, color: "var(--cyan)" },
                  { label: "ESCALATE ↑", status: "ESCALATED" as Status,     color: "var(--orange)" },
                  { label: "RESOLVE ✗",  status: "RESOLVED" as Status,      color: "#4ade80" },
                ].map(btn => (
                  <button
                    key={btn.label}
                    onClick={() => updateAlert(selected.id, { status: btn.status })}
                    className="text-[10px] py-2 border transition-colors hover:opacity-80"
                    style={{ borderColor: btn.color, color: btn.color, background: `${btn.color}15` }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* notes */}
              <textarea
                rows={3}
                placeholder="// analyst notes..."
                value={selected.notes}
                onChange={e => updateAlert(selected.id, { notes: e.target.value })}
                className="w-full p-2 text-xs resize-none border focus:outline-none"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  fontFamily: "'Space Mono', monospace",
                }}
              />
            </>
          )}
        </div>

        {/* ── RIGHT: metrics ──────────────────────────────────────────────── */}
        <div
          className="lg:col-span-3 border p-4 flex flex-col gap-4"
          style={{ background: "var(--bg2)", borderColor: "var(--border)", fontFamily: "'Space Mono', monospace" }}
        >
          <div className="text-xs font-bold tracking-widest" style={{ color: "var(--cyan)" }}>METRICS</div>

          {/* stat counters */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "TOTAL",    value: stats.total,    color: "var(--text)" },
              { label: "CRITICAL", value: stats.critical, color: "#f87171" },
              { label: "RESOLVED", value: stats.resolved, color: "#4ade80" },
            ].map(s => (
              <div key={s.label} className="border p-2" style={{ borderColor: "var(--border)" }}>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[9px]" style={{ color: "var(--text3)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* source breakdown */}
          <div>
            <div className="text-[10px] mb-2" style={{ color: "var(--text3)" }}>SOURCE BREAKDOWN</div>
            {(["CrowdStrike","Hunters SIEM","Cisco IronPort","Palo Alto","Canary Token"] as Source[]).map(src => {
              const count = feed.filter(a => a.source === src).length;
              const pct   = feed.length ? (count / feed.length) * 100 : 0;
              return (
                <div key={src} className="flex items-center gap-2 mb-2">
                  <span className={`text-[9px] w-20 shrink-0 ${SOURCE_COLORS[src]}`}>
                    {src.replace(" SIEM","").replace("Cisco ","").replace("Microsoft ","")}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--bg3)" }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: "var(--cyan)" }}
                    />
                  </div>
                  <span className="text-[9px] w-4 text-right" style={{ color: "var(--text3)" }}>{count}</span>
                </div>
              );
            })}
          </div>

          {/* severity breakdown */}
          <div>
            <div className="text-[10px] mb-2" style={{ color: "var(--text3)" }}>SEVERITY</div>
            {(["CRITICAL","HIGH","MEDIUM","LOW","INFO"] as Severity[]).map(sev => {
              const count = feed.filter(a => a.severity === sev).length;
              return (
                <div key={sev} className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] ${SEV_CONFIG[sev].text}`}>{sev}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
                      <div key={i} className={`w-1.5 h-3 ${SEV_CONFIG[sev].bg} border ${SEV_CONFIG[sev].border}`} />
                    ))}
                    {count > 8 && <span className={`text-[9px] ${SEV_CONFIG[sev].text}`}>+{count-8}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── footer ──────────────────────────────────────────────────────────── */}
      <div className="mt-6 font-space-mono text-[10px] text-center" style={{ color: "var(--text3)" }}>
        Powered by simulated data · Real tools: CrowdStrike · Hunters SIEM · Palo Alto NGFW · Cisco IronPort ESA · Canary Tokens
      </div>

      {/* ── animation keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}