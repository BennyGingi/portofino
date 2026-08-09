"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Analytics } from "@/lib/analytics";

export const openTerminal = () => window.dispatchEvent(new Event("open-terminal"));

type OutputLine = {
  id: string;
  content: React.ReactNode;
};

const COMMANDS = [
  "help", "whoami", "ls", "ls projects", "cat experience.json",
  "cat skills.txt", "cat education.json", "ping foodcritic", "ssh mobileye", "whois benny",
  "sudo hire benny", "nmap localhost", "htop", "neofetch", "pwd", "date",
  "clear", "exit", "matrix", "curl resume", "history", "analytics"
];

// ── Resume PDF URL — replace with your actual hosted PDF path ─────────────────
const RESUME_PDF_URL = "/benny-cv.pdf"; // e.g. "/Benny_Gingihashvili_Resume.pdf"

// Auto-run `help` once per browser session so the command list is visible
// immediately on first open.
const HELP_SEEN_KEY = "terminal_help_seen";

// Shared help output — rendered by the `help` command and the first-open auto-run.
const HELP_LINES: React.ReactNode[] = [
  <div key="h" className="text-cyan-400 font-bold mb-1">Available commands:</div>,
  <div key="1"  className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">help</span><span className="text-(--text3)">Show this list of commands</span></div>,
  <div key="2"  className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">whoami</span><span className="text-(--text3)">Display basic identity info</span></div>,
  <div key="nf" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">neofetch</span><span className="text-(--text3)">System information summary</span></div>,
  <div key="3"  className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">ls</span><span className="text-(--text3)">List available files &amp; projects</span></div>,
  <div key="4"  className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">cat &lt;file&gt;</span><span className="text-(--text3)">Output file contents</span></div>,
  <div key="6"  className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">ping foodcritic</span><span className="text-(--text3)">Simulate a network ping</span></div>,
  <div key="7"  className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">ssh mobileye</span><span className="text-(--text3)">Attempt secure shell connection</span></div>,
  <div key="8"  className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">whois benny</span><span className="text-(--text3)">Output WHOIS record</span></div>,
  <div key="9"  className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">sudo hire benny</span><span className="text-(--text3)">Initiate hiring sequence 🚀</span></div>,
  <div key="10" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">nmap localhost</span><span className="text-(--text3)">Run a local port scan</span></div>,
  <div key="11" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">htop</span><span className="text-(--text3)">Show running processes</span></div>,
  <div key="pw" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">pwd / date</span><span className="text-(--text3)">Standard bash utilities</span></div>,
  <div key="12" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">curl resume</span><span className="text-(--text3)">Download CV PDF</span></div>,
  <div key="mx" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">matrix</span><span className="text-(--text3)">??</span></div>,
  <div key="an" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">analytics</span><span className="text-(--text3)">Open analytics dashboard</span></div>,
  <div key="13" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">history</span><span className="text-(--text3)">Show previous commands</span></div>,
  <div key="14" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">clear</span><span className="text-(--text3)">Clear terminal output</span></div>,
  <div key="15" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">exit</span><span className="text-(--text3)">Close terminal</span></div>,
];

export default function TerminalOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isMatrix, setIsMatrix] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && e.ctrlKey) {
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("open-terminal", handleOpen);
    window.addEventListener("close-terminal", handleClose);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("open-terminal", handleOpen);
      window.removeEventListener("close-terminal", handleClose);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) Analytics.trackTerminalOpen();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, history]);

  // First open per session: auto-print the command list so the terminal isn't
  // a bare prompt. Persisted in sessionStorage — once per browser session.
  useEffect(() => {
    if (!isOpen) return;
    let seen = false;
    try { seen = sessionStorage.getItem(HELP_SEEN_KEY) === "1"; } catch { /* private mode */ }
    if (seen) return;
    try { sessionStorage.setItem(HELP_SEEN_KEY, "1"); } catch { /* private mode */ }
    void printLines([
      <div key="welcome" className="text-(--text2) mb-1">
        Type <span className="text-cyan-400">help</span> anytime · try{" "}
        <span className="text-cyan-400">sudo hire benny</span> 🚀
      </div>,
      ...HELP_LINES,
    ], 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addLine = (content: React.ReactNode) => {
    setHistory((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), content }]);
  };

  const printLines = async (lines: React.ReactNode[], delay = 30) => {
    for (const line of lines) {
      setHistory((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), content: line }]);
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.trim();
    addLine(
      <div className="flex">
        <span className="text-cyan-400 mr-2 shrink-0">benny@portfolio:~$</span>
        <span className="text-white break-all">{cmd}</span>
      </div>
    );

    setInput("");
    setCmdHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);
    setIsProcessing(true);

    const c = cmd.toLowerCase().replace(/\s+/g, " ");
    Analytics.trackTerminalCommand(c);

    try {
      switch (c) {
        // ── help ────────────────────────────────────────────────────────────────
        case "help":
          await printLines(HELP_LINES, 20);
          break;

        // ── whoami ───────────────────────────────────────────────────────────────
        case "whoami":
          await printLines([
            <div key="1" className="text-white font-bold">Benny Gingihashvili</div>,
            <div key="2" className="text-(--text2)">SOC Analyst · Full-Stack Developer</div>,
            <div key="3" className="text-(--text2)">Full-Stack Developer</div>,
            <div key="4" className="text-(--text2)">Holon, Israel 🇮🇱</div>,
            <div key="5" className="text-green-400 mt-1">Status: AVAILABLE_FOR_HIRE</div>,
          ]);
          break;

        // ── ls ───────────────────────────────────────────────────────────────────
        case "ls":
        case "ls projects":
          await printLines([
            <div key="1" className="grid grid-cols-1 sm:grid-cols-2 max-w-xl gap-x-6 mt-1">
              <div><span className="text-blue-400">drwxr-xr-x</span> <span className="text-white">foodcritic/</span></div>
              <div><span className="text-blue-400">drwxr-xr-x</span> <span className="text-white">soc-portal/</span></div>
              <div><span className="text-blue-400">drwxr-xr-x</span> <span className="text-white">visit-georgia/</span></div>
              <div><span className="text-blue-400">drwxr-xr-x</span> <span className="text-white">antigravity/</span></div>
              <div><span className="text-blue-400">drwxr-xr-x</span> <span className="text-white">ghosteye/</span></div>
              <div><span className="text-blue-400">drwxr-xr-x</span> <span className="text-white">void-runner/</span></div>
              <div><span className="text-(--text3)">-rw-r--r--</span> <span className="text-white">experience.json</span></div>
              <div><span className="text-(--text3)">-rw-r--r--</span> <span className="text-white">skills.txt</span></div>
              <div><span className="text-(--text3)">-rw-r--r--</span> <span className="text-white">education.json</span></div>
            </div>
          ]);
          break;

        // ── cat ──────────────────────────────────────────────────────────────────
        case "cat experience.json":
          await printLines([
            <div key="1">{"{"}</div>,
            <div key="2"  className="ml-4"><span className="text-cyan-400">&quot;company&quot;</span>: <span className="text-green-400">&quot;Mobileye (Intel)&quot;</span>,</div>,
            <div key="3"  className="ml-4"><span className="text-cyan-400">&quot;role&quot;</span>: <span className="text-green-400">&quot;SOC Analyst (Student Position)&quot;</span>,</div>,
            <div key="4"  className="ml-4"><span className="text-cyan-400">&quot;duration&quot;</span>: <span className="text-green-400">&quot;Jun 2025 - Aug 2025&quot;</span>,</div>,
            <div key="5"  className="ml-4"><span className="text-cyan-400">&quot;tools&quot;</span>: [</div>,
            <div key="6"  className="ml-8 text-green-400">&quot;CrowdStrike&quot;, &quot;Hunters SIEM&quot;, &quot;Palo Alto&quot;,</div>,
            <div key="7"  className="ml-8 text-green-400">&quot;Cisco IronPort&quot;, &quot;Microsoft Defender&quot;</div>,
            <div key="8"  className="ml-4">],</div>,
            <div key="9"  className="ml-4"><span className="text-cyan-400">&quot;highlights&quot;</span>: [</div>,
            <div key="10" className="ml-8 text-green-400">&quot;Triage Tier 1/2 enterprise security events&quot;,</div>,
            <div key="11" className="ml-8 text-green-400">&quot;Phishing &amp; malware detection analysis&quot;,</div>,
            <div key="12" className="ml-8 text-green-400">&quot;Built full-stack internal SOC portal (deployed enterprise-wide)&quot;</div>,
            <div key="13" className="ml-4">]</div>,
            <div key="14">{"}"}</div>
          ]);
          break;

        case "cat skills.txt":
          await printLines([
            <div key="1" className="text-orange-400 font-bold mt-1">=== SECURITY ===</div>,
            <div key="2" className="text-white">CrowdStrike · Hunters SIEM · Palo Alto · Cisco IronPort · Defender · Splunk</div>,
            <div key="3" className="text-cyan-400 font-bold mt-2">=== DEVELOPMENT ===</div>,
            <div key="4" className="text-white">TypeScript · Next.js · React · Node.js · Python · Tailwind</div>,
            <div key="5" className="text-green-400 font-bold mt-2">=== INFRA & DB ===</div>,
            <div key="6" className="text-white">PostgreSQL · Supabase · Prisma · PM2 · IIS · GitLab CI/CD</div>,
            <div key="7" className="text-purple-400 font-bold mt-2">=== TOOLS ===</div>,
            <div key="8" className="text-white">Wireshark · Zeek · Snort · MITRE ATT&amp;CK · NetworkMiner</div>,
          ]);
          break;

        case "cat education.json":
          await printLines([
            <div key="1">{"{"}</div>,
            <div key="2" className="ml-4"><span className="text-cyan-400">&quot;training&quot;</span>: <span className="text-green-400">&quot;TryHackMe SOC Level 1 Path&quot;</span>,</div>,
            <div key="3" className="ml-4"><span className="text-cyan-400">&quot;progress&quot;</span>: <span className="text-green-400">&quot;115+ rooms completed — Top 3% globally&quot;</span>,</div>,
            <div key="4" className="ml-4"><span className="text-cyan-400">&quot;completed&quot;</span>: [</div>,
            <div key="5" className="ml-8 text-green-400">&quot;TryHackMe SOC Level 1 Path (115+ rooms, Top 3%)&quot;,</div>,
            <div key="6" className="ml-8 text-green-400">&quot;Wiz Kubernetes Security CTF (7/7 flags)&quot;</div>,
            <div key="7" className="ml-4">],</div>,
            <div key="8" className="ml-4"><span className="text-cyan-400">&quot;target&quot;</span>: <span className="text-(--text3)">&quot;CKS: Certified Kubernetes Security&quot;</span></div>,
            <div key="9">{"}"}</div>
          ]);
          break;

        // ── utilities ────────────────────────────────────────────────────────────
        case "pwd":
          await printLines([<div key="1" className="text-white">/home/benny/portfolio</div>]);
          break;

        case "date":
          await printLines([<div key="1" className="text-white">{new Date().toString()}</div>]);
          break;

        case "rm -rf /":
        case "rm -rf /*":
          await printLines([<div key="1" className="text-red-500 font-bold">rm: it is dangerous to operate recursively on &apos;/&apos;</div>]);
          break;

        // ── neofetch ─────────────────────────────────────────────────────────────
        case "neofetch":
          await printLines([
            <div key="1" className="flex flex-col sm:flex-row gap-4 mt-2">
              <div className="text-cyan-400 font-bold whitespace-pre leading-tight hidden sm:block">
{`   ▄▄▄▄▄▄▄▄▄▄▄  
  ▐░░░░░░░░░░░▌ 
  ▐░█▀▀▀▀▀▀▀█░▌ 
  ▐░▌       ▐░▌ 
  ▐░█▄▄▄▄▄▄▄█░▌ 
  ▐░░░░░░░░░░░▌ 
  ▐░█▀▀▀▀▀▀▀█░▌ 
  ▐░▌       ▐░▌ 
  ▐░█▄▄▄▄▄▄▄█░▌ 
  ▐░░░░░░░░░░░▌ 
   ▀▀▀▀▀▀▀▀▀▀▀`}
              </div>
              <div>
                <div className="text-cyan-400 font-bold mb-1">benny@portfolio</div>
                <div className="text-(--text3)">-----------------</div>
                <div><span className="text-cyan-400">OS:</span> Windows 11 / WSL2</div>
                <div><span className="text-cyan-400">Host:</span> gingihashvili.dev</div>
                <div><span className="text-cyan-400">Kernel:</span> TypeScript 5 · Python 3.11</div>
                <div><span className="text-cyan-400">Uptime:</span> {Math.floor(performance.now() / 60000)} mins</div>
                <div><span className="text-cyan-400">Packages:</span> 1337 (pnpm)</div>
                <div><span className="text-cyan-400">Shell:</span> bash 5.1.16</div>
                <div><span className="text-cyan-400">Theme:</span> Cyberpunk SOC Dark</div>
                <div><span className="text-cyan-400">Status:</span> <span className="text-green-400">AVAILABLE_FOR_HIRE</span></div>
                <div className="mt-2 flex gap-1">
                  {["bg-red-500","bg-green-500","bg-yellow-500","bg-blue-500","bg-purple-500","bg-cyan-400","bg-white"].map(c => (
                    <div key={c} className={`w-3 h-3 ${c}`} />
                  ))}
                </div>
              </div>
            </div>
          ]);
          break;

        // ── ping ─────────────────────────────────────────────────────────────────
        case "ping foodcritic":
          await printLines([<div key="0">PING foodcritic-bennygolan.vercel.app</div>], 0);
          for (let i = 0; i < 3; i++) {
            await new Promise(r => setTimeout(r, 600));
            await printLines([
              <div key={i}>64 bytes from vercel: icmp_seq={i} time={[12,8,11][i]}ms</div>
            ], 0);
          }
          await printLines([
            <div key="s" className="mt-1">--- ping statistics ---</div>,
            <div key="r">3 packets transmitted, 3 received, <span className="text-green-400">0% loss</span></div>,
            <div key="l" className="text-cyan-400 mt-1">
              → <a href="https://foodcritic-bennygolan.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">foodcritic-bennygolan.vercel.app</a>
            </div>
          ], 0);
          break;

        // ── ssh ──────────────────────────────────────────────────────────────────
        case "ssh mobileye":
          await printLines([<div key="1">Connecting to soc-portal.internal...</div>], 0);
          await new Promise(r => setTimeout(r, 1000));
          await printLines([<div key="2" className="text-cyan-400">████████████████ 100%</div>], 0);
          await new Promise(r => setTimeout(r, 500));
          await printLines([
            <div key="3" className="text-red-500 font-bold mt-1">Access Denied: Classified internal network</div>,
            <div key="4" className="text-(--text3)">(But nice try 😏)</div>
          ], 0);
          break;

        // ── whois ────────────────────────────────────────────────────────────────
        case "whois benny":
          await printLines([
            <div key="1">Domain Name:  <span className="text-cyan-400">GINGIHASHVILI.DEV</span></div>,
            <div key="2">Registrant:   <span className="text-white">Benny Gingihashvili</span></div>,
            <div key="3">Organization: <span className="text-white">Independent / Open to Work</span></div>,
            <div key="4">Location:     <span className="text-white">Holon, IL 🇮🇱</span></div>,
            <div key="5">Status:       <span className="text-green-500 font-bold">AVAILABLE_FOR_HIRE</span></div>,
            <div key="6">Created:      <span className="text-(--text2)">1994</span></div>,
            <div key="7">Updated:      <span className="text-(--text2)">2025</span></div>,
            <div key="8">Expires:      <span className="text-(--text2)">Never</span></div>,
          ]);
          break;

        // ── sudo hire benny ──────────────────────────────────────────────────────
        case "sudo hire benny":
          Analytics.trackSudoHire();
          await printLines([<div key="1">[sudo] password for recruiter: <span className="opacity-0">········</span></div>], 0);
          await new Promise(r => setTimeout(r, 1500));
          await printLines([<div key="2" className="text-(--text3)">... authenticating ...</div>], 0);
          await new Promise(r => setTimeout(r, 800));
          await printLines([<div key="3" className="text-green-400">✓ Access granted. Excellent taste detected.</div>], 0);

          // burst 1 — immediate
          confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
          // burst 2 — left cannon
          await new Promise(r => setTimeout(r, 300));
          confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.65 } });
          // burst 3 — right cannon
          await new Promise(r => setTimeout(r, 150));
          confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.65 } });

          await printLines([
            <div key="4" className="mt-1">Initiating hire sequence...</div>,
          ], 0);
          await new Promise(r => setTimeout(r, 600));
          await printLines([<div key="5" className="text-cyan-400">████████████████████ 100%</div>], 0);
          await new Promise(r => setTimeout(r, 400));
          await printLines([
            <div key="6"  className="text-green-400 mt-1">✓ Benny has been added to your team.</div>,
            <div key="7"  className="text-green-400">✓ Security posture improved by 847%</div>,
            <div key="8"  className="text-green-400">✓ Codebase quality increased significantly</div>,
            <div key="9"  className="text-green-400">✓ Office vibes: immaculate</div>,
            <div key="10" className="text-cyan-400 mt-1">→ Opening contact form...</div>
          ], 250);

          setTimeout(() => {
            setIsOpen(false);
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }, 2000);
          break;

        // ── nmap ─────────────────────────────────────────────────────────────────
        case "nmap localhost":
          await printLines([<div key="1">Starting Nmap scan on 127.0.0.1...</div>], 0);
          await new Promise(r => setTimeout(r, 1200));
          await printLines([
            <div key="2" className="mt-1">
              <div className="grid grid-cols-3 text-cyan-400 mb-1"><span>PORT</span><span>STATE</span><span>SERVICE</span></div>
              <div className="grid grid-cols-3"><span>3000/tcp</span><span className="text-green-400">open</span><span>next-js</span></div>
              <div className="grid grid-cols-3"><span>5432/tcp</span><span className="text-green-400">open</span><span>postgresql</span></div>
              <div className="grid grid-cols-3"><span>22/tcp</span><span className="text-green-400">open</span><span>ssh (keys only)</span></div>
              <div className="grid grid-cols-3"><span>80/tcp</span><span className="text-red-400">closed</span><span className="text-(--text3) hidden sm:inline">(nothing here)</span></div>
              <div className="grid grid-cols-3"><span>443/tcp</span><span className="text-green-400">open</span><span>tls/https</span></div>
            </div>,
            <div key="3" className="mt-2 text-(--text3)">Nmap done: 1 IP scanned in 2.31 seconds</div>
          ], 0);
          break;

        // ── htop ─────────────────────────────────────────────────────────────────
        case "htop":
          await printLines([
            <div key="1" className="mt-1">Tasks: 42 total, 3 running</div>,
            <div key="2">CPU: [<span className="text-cyan-400">████████</span><span className="text-(--text3)">░░░░░░░░</span>] 47%</div>,
            <div key="3">MEM: [<span className="text-orange-400">██████</span><span className="text-(--text3)">░░░░░░░░░░</span>] 38%</div>,
            <div key="4" className="mt-2 grid grid-cols-4 text-cyan-400 font-bold"><span>PID</span><span>USER</span><span className="col-span-2">COMMAND</span></div>,
            <div key="5" className="grid grid-cols-4"><span>001</span><span>benny</span><span className="col-span-2">next-dev --port 3000</span></div>,
            <div key="6" className="grid grid-cols-4"><span>002</span><span>benny</span><span className="col-span-2">node soc-portal</span></div>,
            <div key="7" className="grid grid-cols-4"><span>003</span><span>benny</span><span className="col-span-2">python ghosteye.py</span></div>,
            <div key="8" className="grid grid-cols-4"><span>004</span><span>benny</span><span className="col-span-2 text-orange-400">brain --mode hyperfocus</span></div>,
            <div key="9" className="grid grid-cols-4"><span>005</span><span className="text-red-400">root</span><span className="col-span-2">coffee-daemon</span></div>,
          ]);
          break;

        // ── clear / exit ─────────────────────────────────────────────────────────
        case "clear":
          setHistory([]);
          break;

        case "exit":
          setIsOpen(false);
          break;

        // ── matrix ───────────────────────────────────────────────────────────────
        // Renders INSIDE the terminal body (not fullscreen) via isMatrix flag
        case "matrix":
          setIsMatrix(true);
          await new Promise(r => setTimeout(r, 3500));
          setIsMatrix(false);
          addLine(<div className="text-green-400">Wake up, Neo...</div>);
          break;

        // ── curl resume ──────────────────────────────────────────────────────────
        case "curl resume":
          await printLines([<div key="1">  % Total    % Received  Xferd  Average  Speed</div>], 0);
          await printLines([<div key="2" className="text-(--text3)">  0     0    0     0    0     0      0      0</div>], 0);
          await new Promise(r => setTimeout(r, 800));
          await printLines([<div key="3" className="text-cyan-400">100  284k  100  284k    0     0   142k      0  0:00:02</div>], 0);
          await new Promise(r => setTimeout(r, 300));
          await printLines([
            <div key="4" className="text-green-400 mt-1">✓ Benny_Gingihashvili_Resume.pdf downloaded</div>,
            <div key="5" className="text-cyan-400">→ Opening PDF...</div>
          ], 0);
          window.open(RESUME_PDF_URL, "_blank");
          break;

        // ── history ──────────────────────────────────────────────────────────────
        case "history":
          if (cmdHistory.length === 0) {
            await printLines([<div key="0" className="text-(--text3)">No commands in history yet.</div>]);
          } else {
            await printLines(
              cmdHistory.map((h, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-(--text3) w-8 text-right">{i + 1}</span>
                  <span>{h}</span>
                </div>
              ))
            );
          }
          break;

        // ── analytics ────────────────────────────────────────────────────────────
        case "analytics":
          await printLines([<div key="1">Loading analytics data...</div>], 0);
          await new Promise(r => setTimeout(r, 600));
          await printLines([<div key="2" className="text-cyan-400">████████████████ 100%</div>], 0);
          window.dispatchEvent(new Event("open-analytics"));
          break;

        // ── default ──────────────────────────────────────────────────────────────
        default:
          await printLines([
            <div key="1" className="text-red-400">bash: {c}: command not found</div>,
            <div key="2" className="text-(--text3)">Type <span className="text-cyan-400">help</span> for available commands.</div>
          ]);
          break;
      }
    } catch (err) {
      console.error(err);
    }

    setIsProcessing(false);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < cmdHistory.length) {
          setHistoryIdx(nextIdx);
          setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = COMMANDS.filter(c => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1 && input.length > 0) {
        // show possible completions
        addLine(
          <div className="text-(--text3) flex flex-wrap gap-3">
            {matches.map(m => <span key={m}>{m}</span>)}
          </div>
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-900 bg-black/92 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full sm:max-w-180 h-[80vh] flex flex-col rounded-lg overflow-hidden border border-cyan-500/50 shadow-[0_0_30px_rgba(0,229,200,0.15)] relative"
        style={{ backgroundColor: "#020508", fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: "1.8" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Top Bar */}
        <div className="flex items-center px-4 py-2 bg-black/40 border-b border-cyan-900/50 relative border-t-2 border-t-cyan-500 shadow-[inset_0_1px_0_rgba(0,229,200,0.3)] shrink-0">
          <div className="flex gap-2 z-10">
            <button onClick={() => setIsOpen(false)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-(--text3) text-xs font-bold pointer-events-none">
            benny@portfolio:~
          </div>
        </div>

        {/* Terminal Body — matrix renders INSIDE here */}
        <div
          ref={terminalBodyRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 text-[#e0e0e0] terminal-scrollbar relative"
        >
          {/* Matrix effect covers just the terminal body */}
          {isMatrix && <MatrixEffect containerRef={terminalBodyRef} />}

          {history.map((h) => (
            <div key={h.id} className="min-h-[1.8em]">{h.content}</div>
          ))}

          {!isProcessing && (
            <form onSubmit={handleCommand} className="flex mt-1">
              <span className="text-cyan-400 mr-2 shrink-0">benny@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white shadow-none focus:ring-0 p-0 m-0"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
    </div>
  );
}

// ── Matrix Effect — renders inside the terminal body, not fullscreen ──────────
function MatrixEffect({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size canvas to match terminal body
    canvas.width  = container.clientWidth;
    canvas.height = container.clientHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF0123456789@#$%".split("");
    const fontSize = 13;
    const columns  = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(2, 5, 8, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 33);

    return () => clearInterval(interval);
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}