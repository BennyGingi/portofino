// "use client"
"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

/** Types */
type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type Source = "CrowdStrike" | "Hunters" | "IronPort" | "Palo Alto" | "Defender";

interface AlertTemplate {
  source: Source;
  severity: Severity;
  title: string;
  generateMeta: () => Record<string, string>;
  mitre: string;
}

interface Alert extends AlertTemplate {
  id: string;
  timestamp: Date;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  meta: Record<string, string>;
  notes: string;
}

/** Helper random generators */
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = <T,>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];
const randomIP = () => `${randomInt(1, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}`;
const randomHostname = () => `MOBILEYE-${randomChoice(["WS", "SRV"])}-${randomInt(100, 999)}`;
const randomUser = () => randomChoice(["alice", "bob", "carol", "dave", "eve", "mallory", "trent", "peggy"]);
const randomDomain = () => randomChoice(["gmail.com", "yahoo.com", "example.com", "company.org", "mail.net"]);
const randomFile = () => `${randomChoice(["temp", "cache", "tmp"]) }_${randomInt(1000, 9999)}.exe`;

/** Alert pool */
const ALERT_POOL: AlertTemplate[] = [
  {
    source: "CrowdStrike",
    severity: "HIGH",
    title: "Malware: Suspicious PowerShell execution detected",
    generateMeta: () => ({ Host: randomHostname(), User: randomUser() }),
    mitre: "T1059.001 · Execution",
  },
  {
    source: "IronPort",
    severity: "MEDIUM",
    title: "Phishing: Credential harvesting URL in email body",
    generateMeta: () => ({ Sender: `${randomUser()}@${randomDomain()}`, Subject: `Invoice #${randomInt(1000, 9999)}` }),
    mitre: "T1566.002 · Spearphishing Link",
  },
  {
    source: "Hunters",
    severity: "CRITICAL",
    title: "Lateral Movement: Admin share access failure spike",
    generateMeta: () => ({ "Source IP": randomIP(), Target: randomHostname() }),
    mitre: "T1021.002 · SMB/Windows Admin Shares",
  },
  {
    source: "Palo Alto",
    severity: "HIGH",
    title: "C2 Communication: Beaconing to known malicious IP",
    generateMeta: () => ({ Destination: randomIP(), Port: "443" }),
    mitre: "T1071.001 · Web Protocols",
  },
  {
    source: "Defender",
    severity: "LOW",
    title: "Suspicious file hash: PE file in temp directory",
    generateMeta: () => ({ File: randomFile(), Path: `C:\\Users\\${randomUser()}\\AppData\\Local\\Temp` }),
    mitre: "T1106 · Native API",
  },
  {
    source: "CrowdStrike",
    severity: "MEDIUM",
    title: "Privilege Escalation: Token impersonation attempt",
    generateMeta: () => ({ Host: randomHostname(), User: randomUser() }),
    mitre: "T1134 · Access Token Manipulation",
  },
  {
    source: "Hunters",
    severity: "HIGH",
    title: "Brute Force: 47 failed auth attempts in 60 seconds",
    generateMeta: () => ({ "Target IP": randomIP(), Username: randomUser() }),
    mitre: "T1110 · Brute Force",
  },
  {
    source: "IronPort",
    severity: "LOW",
    title: "Spam campaign: Marketing bulk sender detected",
    generateMeta: () => ({ Sender: `${randomUser()}@${randomDomain()}` }),
    mitre: "T1566.001 · Phishing",
  },
];

export default function ThreatFeed() {
  // State
  const [feed, setFeed] = useState<Alert[]>([]);
  const [selected, setSelected] = useState<Alert | null>(null);
  const [stats, setStats] = useState({ today: 0, critical: 0, resolved: 0, mttd: 0 });
  const [time, setTime] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Live clock effect
  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Alert generation effect (3‑5 s interval)
  useEffect(() => {
    let cancelled = false;
    const schedule = () => {
      const timeout = randomInt(3000, 5000);
      const timer = setTimeout(() => {
        if (!cancelled) {
          createAlert();
          schedule();
        }
      }, timeout);
      return () => clearTimeout(timer);
    };
    const cancel = schedule();
    return () => {
      cancelled = true;
      cancel();
    };
  }, []);

  // Auto‑scroll to top on new alerts
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [feed]);

  const createAlert = () => {
    const tmpl = randomChoice(ALERT_POOL);
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newAlert: Alert = {
      ...tmpl,
      id,
      timestamp: new Date(),
      status: "OPEN",
      meta: tmpl.generateMeta(),
      notes: "",
    };
    setFeed((prev) => {
      const updated = [newAlert, ...prev].slice(0, 12);
      setStats((s) => ({
        ...s,
        today: s.today + 1,
        critical: s.critical + (newAlert.severity === "CRITICAL" ? 1 : 0),
      }));
      return updated;
    });
  };

  const updateAlert = (id: string, updates: Partial<Alert>) => {
    setFeed((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    if (updates.status) {
      setStats((s) => {
        const resolvedInc = updates.status === "RESOLVED" ? 1 : 0;
        const mttdInc = updates.status === "INVESTIGATING" ? randomInt(2, 8) : 0;
        return {
          ...s,
          resolved: s.resolved + resolvedInc,
          mttd: mttdInc ? mttdInc : s.mttd,
        };
      });
    }
  };

  const severityColors: Record<Severity, string> = {
    CRITICAL: "bg-red-600",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-cyan-500",
  };

  return (
    <section className="w-full py-12 bg-[var(--bg2)]/60" id="threatfeed">
      {/* Header */}
      <div className="flex items-center justify-between px-6 mb-4 bg-[var(--bg3)] rounded-t-lg border-b border-[var(--border)]">
        <h2 className="font-orbitron text-xl text-[var(--text)]">SOC OPERATIONS CENTER</h2>
        <div className="flex items-center space-x-4 text-sm text-[var(--text2)] font-space-mono">
          <span className="animate-pulse text-green-400 font-bold">LIVE</span>
          <Clock size={16} className="text-green-400" />
          <span suppressHydrationWarning>{time ?? '--:--:-- --'}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 px-4 lg:px-6">
        {/* LEFT – Feed */}
        <div className="lg:w-2/5 w-full max-h-[500px] overflow-y-auto" ref={feedRef}>
          {feed.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className={`w-full text-left p-3 mb-2 rounded border border-[var(--border)] transition-all duration-200 hover:border-cyan ${
                a.id === selected?.id ? "bg-[var(--bg3)]" : "bg-[var(--bg2)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded ${severityColors[a.severity]} text-white`}>{a.severity}</span>
                <span className="text-xs text-[var(--text2)]">
                  {Math.floor((Date.now() - a.timestamp.getTime()) / 1000)}s ago
                </span>
              </div>
              <div className="mt-1 font-medium text-[var(--text)]">{a.title}</div>
              <div className="text-xs text-[var(--text2)]">{a.source}</div>
              <div className="mt-1 text-xs italic">{a.status}</div>
            </button>
          ))}
        </div>

        {/* MIDDLE – Detail */}
        <div className="lg:w-3/10 w-full bg-[var(--bg2)] p-4 rounded border border-[var(--border)]">
          {selected ? (
            <div className="space-y-3">
              <h3 className="font-orbitron text-lg text-[var(--text)]">{selected.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded ${severityColors[selected.severity]} text-white`}>{selected.severity}</span>
                <span className="text-sm text-[var(--text2)]">{selected.source}</span>
              </div>
              <div className="text-sm">
                {Object.entries(selected.meta).map(([k, v]) => (
                  <div key={k} className="flex">
                    <span className="font-space-mono text-[var(--text3)] mr-2">{k}:</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <span className="font-space-mono text-[var(--text3)] mr-2">MITRE ATT&amp;CK:</span>
                <span className="text-sm text-[var(--text2)]">{selected.mitre}</span>
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => {
                    updateAlert(selected.id, {
                      status: "INVESTIGATING",
                      notes: `Investigating ${selected.title.toLowerCase()}. Initial triage steps executed.`,
                    });
                    setSelected({ ...selected, status: "INVESTIGATING", notes: `Investigating ${selected.title.toLowerCase()}. Initial triage steps executed.` });
                  }}
                  className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  TRIAGE ✓
                </button>
                <button
                  onClick={() => {
                    updateAlert(selected.id, { severity: "CRITICAL" });
                    setSelected({ ...selected, severity: "CRITICAL" });
                  }}
                  className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  ESCALATE ↑
                </button>
                <button
                  onClick={() => {
                    updateAlert(selected.id, { status: "RESOLVED" });
                    setSelected({ ...selected, status: "RESOLVED" });
                  }}
                  className="flex-1 px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  RESOLVE ✗
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="Analyst notes…"
                value={selected.notes}
                onChange={(e) => {
                  updateAlert(selected.id, { notes: e.target.value });
                  setSelected({ ...selected, notes: e.target.value });
                }}
                className="w-full mt-2 p-2 bg-[var(--bg3)] border border-[var(--border)] rounded text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none"
              />
            </div>
          ) : (
            <p className="text-[var(--text2)]">Select an alert to view details.</p>
          )}
        </div>

        {/* RIGHT – Metrics */}
        <div className="lg:w-3/10 w-full bg-[var(--bg2)] p-4 rounded border border-[var(--border)]">
          <h4 className="font-orbitron text-md mb-2 text-[var(--text)]">Metrics</h4>
          <ul className="space-y-1 text-sm text-[var(--text2)]">
            <li>Alerts Today: <span className="font-medium text-[var(--text)]">{stats.today}</span></li>
            <li>Critical: <span className="font-medium text-red-500">{stats.critical}</span></li>
            <li>Resolved: <span className="font-medium text-green-500">{stats.resolved}</span></li>
            <li>MTTD (min): <span className="font-medium text-[var(--text)]">{stats.mttd}</span></li>
          </ul>
          {/* Simple donut chart */}
          <div className="relative w-24 h-24 mx-auto mt-4">
            <svg viewBox="0 0 32 32" className="transform -rotate-90">
              <circle r="16" cx="16" cy="16" fill="transparent" strokeWidth="4" className="text-gray-300" stroke="currentColor" />
              <circle
                r="16"
                cx="16"
                cy="16"
                fill="transparent"
                strokeWidth="4"
                strokeDasharray="100"
                strokeDashoffset={100 - (stats.critical / Math.max(stats.today, 1)) * 100}
                className="text-red-600"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-space-mono text-[var(--text2)]">Sev.</div>
          </div>
          {/* Source breakdown bar */}
          <div className="mt-4">
            <h5 className="font-space-mono text-xs text-[var(--text3)] mb-1">Source breakdown</h5>
            {(["CrowdStrike", "Hunters", "IronPort", "Palo Alto", "Defender"] as Source[]).map((src) => {
              const count = feed.filter((a) => a.source === src).length;
              const pct = (count / Math.max(feed.length, 1)) * 100;
              return (
                <div key={src} className="flex items-center mb-1">
                  <span className="w-20 text-xs text-[var(--text3)]">{src}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-cyan-600 rounded" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="ml-2 text-xs text-[var(--text3)]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-6 text-center text-xs text-[var(--text3)] font-space-mono">
        Powered by simulated data · Real tools: CrowdStrike · Hunters SIEM · Palo Alto Panorama · Cisco IronPort ESA
      </div>
    </section>
  );
}
