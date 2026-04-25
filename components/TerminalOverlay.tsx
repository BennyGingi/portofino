"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export const openTerminal = () => window.dispatchEvent(new Event("open-terminal"));

type OutputLine = {
  id: string;
  content: React.ReactNode;
};

const COMMANDS = [
  "help", "whoami", "ls", "ls projects", "cat experience.json",
  "cat skills.txt", "cat education.json", "ping foodcritic", "ssh mobileye", "whois benny",
  "sudo hire benny", "nmap localhost", "htop", "neofetch", "pwd", "date", 
  "clear", "exit", "matrix", "curl resume", "history"
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
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, history]);

  const addLine = (content: React.ReactNode) => {
    setHistory((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), content }]);
  };

  const printLines = async (lines: React.ReactNode[], delay = 30) => {
    for (const line of lines) {
      setHistory((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), content: line }]);
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
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

    try {
      switch (c) {
        case "help":
          await printLines([
            <div key="1" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">help</span><span className="text-[var(--text3)]">Show this list of commands</span></div>,
            <div key="2" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">whoami</span><span className="text-[var(--text3)]">Display basic identity info</span></div>,
            <div key="neofetch" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">neofetch</span><span className="text-[var(--text3)]">System information summary</span></div>,
            <div key="3" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">ls</span><span className="text-[var(--text3)]">List available files/projects</span></div>,
            <div key="4" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">cat &lt;file&gt;</span><span className="text-[var(--text3)]">Output file contents</span></div>,
            <div key="6" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">ping foodcritic</span><span className="text-[var(--text3)]">Simulate a network ping</span></div>,
            <div key="7" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">ssh mobileye</span><span className="text-[var(--text3)]">Attempt secure shell connection</span></div>,
            <div key="8" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">whois benny</span><span className="text-[var(--text3)]">Output WHOIS record</span></div>,
            <div key="9" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">sudo hire benny</span><span className="text-[var(--text3)]">Initiate hiring sequence</span></div>,
            <div key="10" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">nmap localhost</span><span className="text-[var(--text3)]">Run a local port scan</span></div>,
            <div key="11" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">htop</span><span className="text-[var(--text3)]">Show running processes</span></div>,
            <div key="pwd" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">pwd / date</span><span className="text-[var(--text3)]">Standard bash utilities</span></div>,
            <div key="12" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">curl resume</span><span className="text-[var(--text3)]">Download CV PDF</span></div>,
            <div key="13" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">history</span><span className="text-[var(--text3)]">Show previous commands</span></div>,
            <div key="14" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">clear</span><span className="text-[var(--text3)]">Clear terminal output</span></div>,
            <div key="15" className="text-cyan-400 w-full flex"><span className="w-48 shrink-0">exit</span><span className="text-[var(--text3)]">Close terminal</span></div>,
          ], 20);
          break;

        case "whoami":
          await printLines([
            <div key="1" className="text-white">Benny Gingihashvili</div>,
            <div key="2" className="text-[var(--text2)]">SOC Analyst @ Mobileye (Intel)</div>,
            <div key="3" className="text-[var(--text2)]">Full-Stack Developer</div>,
            <div key="4" className="text-[var(--text2)]">Holon, Israel 🇮🇱</div>,
          ]);
          break;

        case "ls":
        case "ls projects":
          await printLines([
            <div key="1" className="grid grid-cols-1 sm:grid-cols-2 max-w-lg gap-x-4">
              <div><span className="text-blue-400">drwxr-xr-x</span> <span className="text-white">foodcritic/</span></div>
              <div><span className="text-blue-400">drwxr-xr-x</span> <span className="text-white">soc-portal/</span></div>
              <div><span className="text-blue-400">drwxr-xr-x</span> <span className="text-white">void-runner/</span></div>
              <div><span className="text-[var(--text3)]">-rw-r--r--</span> <span className="text-white">experience.json</span></div>
              <div><span className="text-[var(--text3)]">-rw-r--r--</span> <span className="text-white">skills.txt</span></div>
              <div><span className="text-[var(--text3)]">-rw-r--r--</span> <span className="text-white">education.json</span></div>
            </div>
          ]);
          break;

        case "cat experience.json":
          await printLines([
            <div key="1">{"{"}</div>,
            <div key="2" className="ml-4"><span className="text-cyan-400">"company"</span>: <span className="text-green-400">"Mobileye (Intel)"</span>,</div>,
            <div key="3" className="ml-4"><span className="text-cyan-400">"role"</span>: <span className="text-green-400">"SOC Analyst"</span>,</div>,
            <div key="4" className="ml-4"><span className="text-cyan-400">"duration"</span>: <span className="text-green-400">"2023 - Present"</span>,</div>,
            <div key="5" className="ml-4"><span className="text-cyan-400">"highlights"</span>: [</div>,
            <div key="6" className="ml-8 text-green-400">"Triage Tier 1/2 enterprise security events",</div>,
            <div key="7" className="ml-8 text-green-400">"Phishing & Malware detection analysis",</div>,
            <div key="8" className="ml-8 text-green-400">"Developed full-stack internal SOC portal"</div>,
            <div key="9" className="ml-4">]</div>,
            <div key="10">{"}"}</div>
          ]);
          break;

        case "cat skills.txt":
          await printLines([
            <div key="1" className="text-orange-400 font-bold mt-2">=== SECURITY ===</div>,
            <div key="2" className="text-white">CrowdStrike, Hunters, Palo Alto, IronPort, Defender, Splunk</div>,
            <div key="3" className="text-cyan-400 font-bold mt-2">=== DEVELOPMENT ===</div>,
            <div key="4" className="text-white">TypeScript, Next.js, React, Node.js, Python</div>,
            <div key="5" className="text-green-400 font-bold mt-2">=== INFRA & DB ===</div>,
            <div key="6" className="text-white">PostgreSQL, Supabase, Prisma, PM2, IIS, GitLab CI/CD</div>
          ]);
          break;

        case "cat education.json":
          await printLines([
            <div key="1">{"{"}</div>,
            <div key="2" className="ml-4"><span className="text-cyan-400">"degree"</span>: <span className="text-green-400">"B.Sc. Computer Science"</span>,</div>,
            <div key="3" className="ml-4"><span className="text-cyan-400">"institution"</span>: <span className="text-green-400">"Academic College of Ramat-Gan"</span>,</div>,
            <div key="4" className="ml-4"><span className="text-cyan-400">"status"</span>: <span className="text-green-400">"In Progress (2022 - Present)"</span>,</div>,
            <div key="5" className="ml-4"><span className="text-cyan-400">"certifications"</span>: [</div>,
            <div key="6" className="ml-8 text-green-400">"TryHackMe SOC Level 1 Path",</div>,
            <div key="7" className="ml-8 text-[var(--text3)]">"AZ-900: Azure Fundamentals (Planned)",</div>,
            <div key="8" className="ml-8 text-[var(--text3)]">"CKS: Certified Kubernetes Security (Planned)"</div>,
            <div key="9" className="ml-4">]</div>,
            <div key="10">{"}"}</div>
          ]);
          break;

        case "pwd":
          await printLines([<div key="1" className="text-white">/home/benny/portfolio</div>]);
          break;
          
        case "date":
          await printLines([<div key="1" className="text-white">{new Date().toString()}</div>]);
          break;
          
        case "rm -rf /":
        case "rm -rf /*":
          await printLines([<div key="1" className="text-red-500 font-bold">rm: it is dangerous to operate recursively on '/'</div>]);
          break;

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
                <div className="text-[var(--text3)]">-----------------</div>
                <div><span className="text-cyan-400">OS:</span> Windows / WSL2</div>
                <div><span className="text-cyan-400">Host:</span> Intel Corp / Mobileye</div>
                <div><span className="text-cyan-400">Kernel:</span> TypeScript / Python</div>
                <div><span className="text-cyan-400">Uptime:</span> {Math.floor(performance.now() / 60000)} mins</div>
                <div><span className="text-cyan-400">Packages:</span> 1337 (npm)</div>
                <div><span className="text-cyan-400">Shell:</span> bash 5.1.16</div>
                <div><span className="text-cyan-400">Theme:</span> Cyberpunk SOC Dark</div>
                <div className="mt-2 flex gap-1">
                  <div className="w-3 h-3 bg-red-500"></div><div className="w-3 h-3 bg-green-500"></div><div className="w-3 h-3 bg-yellow-500"></div><div className="w-3 h-3 bg-blue-500"></div><div className="w-3 h-3 bg-purple-500"></div><div className="w-3 h-3 bg-cyan-400"></div><div className="w-3 h-3 bg-white"></div>
                </div>
              </div>
            </div>
          ]);
          break;

        case "ping foodcritic":
          await printLines([<div key="1">PING foodcritic-bennygolan.vercel.app</div>], 0);
          await printLines([<div key="2">64 bytes from vercel: icmp_seq=0 time=12ms</div>], 600);
          await printLines([<div key="3">64 bytes from vercel: icmp_seq=1 time=8ms</div>], 600);
          await printLines([<div key="4">64 bytes from vercel: icmp_seq=2 time=11ms</div>], 600);
          await printLines([
            <div key="5" className="mt-2">--- ping statistics ---</div>,
            <div key="6">3 packets transmitted, 3 received, 0% loss</div>
          ], 0);
          break;

        case "ssh mobileye":
          await printLines([<div key="1">Connecting to soc-portal.mobileye.com...</div>], 0);
          await printLines([<div key="2" className="text-cyan-400">████████████████ 100%</div>], 1000);
          await printLines([
            <div key="3" className="text-red-500 font-bold mt-1">Access Denied: Classified internal network</div>,
            <div key="4" className="text-[var(--text3)]">(But nice try 😏)</div>
          ], 500);
          break;

        case "whois benny":
          await printLines([
            <div key="1">Domain Name: <span className="text-cyan-400">GINGIHASHVILI.DEV</span></div>,
            <div key="2">Registrant: <span className="text-white">Benny Gingihashvili</span></div>,
            <div key="3">Organization: <span className="text-white">Mobileye (Intel)</span></div>,
            <div key="4">Location: <span className="text-white">Holon, IL</span></div>,
            <div key="5">Status: <span className="text-green-500 font-bold">AVAILABLE_FOR_HIRE</span></div>,
            <div key="6">Created: <span className="text-[var(--text2)]">1993</span></div>,
            <div key="7">Updated: <span className="text-[var(--text2)]">2024-Present</span></div>,
            <div key="8">Expires: <span className="text-[var(--text2)]">Never</span></div>,
          ]);
          break;

        case "sudo hire benny":
          await printLines([<div key="1">[sudo] password for recruiter:</div>], 0);
          await new Promise(r => setTimeout(r, 1500));
          await printLines([
            <div key="2" className="text-[var(--text3)]">... authenticating ...</div>,
            <div key="3" className="text-green-400">✓ Access granted. Excellent taste detected.</div>,
          ], 800);
          
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
          
          await printLines([
            <div key="4" className="mt-2">Initiating hire sequence...</div>,
            <div key="5" className="text-cyan-400">████████████████████ 100%</div>
          ], 1000);
          
          await printLines([
            <div key="6" className="text-green-400 mt-2">✓ Benny has been added to your team.</div>,
            <div key="7" className="text-green-400">✓ Security posture improved by 847%</div>,
            <div key="8" className="text-green-400">✓ Codebase quality increased significantly</div>,
            <div key="9" className="text-green-400">✓ Office vibes: immaculate</div>,
            <div key="10" className="text-cyan-400 mt-2">→ Opening contact form...</div>
          ], 300);
          
          setTimeout(() => {
            setIsOpen(false);
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }, 2000);
          break;

        case "nmap localhost":
          await printLines([<div key="1">Starting Nmap scan...</div>], 0);
          await printLines([
            <div key="2" className="flex flex-col mt-2">
              <div className="grid grid-cols-3 text-cyan-400 mb-1"><span>PORT</span><span>STATE</span><span>SERVICE</span></div>
              <div className="grid grid-cols-3"><span>3000/tcp</span><span className="text-green-400">open</span><span>next-js</span></div>
              <div className="grid grid-cols-3"><span>5432/tcp</span><span className="text-green-400">open</span><span>postgresql</span></div>
              <div className="grid grid-cols-3"><span>22/tcp</span><span className="text-green-400">open</span><span>ssh (keys only)</span></div>
              <div className="grid grid-cols-3"><span>80/tcp</span><span className="text-red-400">closed</span><span className="text-[var(--text3)] hidden sm:inline">(nothing to see here)</span></div>
              <div className="grid grid-cols-3"><span>443/tcp</span><span className="text-green-400">open</span><span>tls/https</span></div>
            </div>,
            <div key="3" className="mt-2 text-[var(--text3)]">Nmap done: 1 IP scanned in 2.31 seconds</div>
          ], 1500);
          break;

        case "htop":
          await printLines([
            <div key="1">Tasks: 42 total, 3 running</div>,
            <div key="2">CPU: [<span className="text-cyan-400">████████</span><span className="text-[var(--text3)]">░░░░░░░░</span>] 47%</div>,
            <div key="3">MEM: [<span className="text-orange-400">██████</span><span className="text-[var(--text3)]">░░░░░░░░░░</span>] 38%</div>,
            <div key="4" className="mt-2 grid grid-cols-4 text-cyan-400"><span>PID</span><span>USER</span><span className="col-span-2">COMMAND</span></div>,
            <div key="5" className="grid grid-cols-4"><span>001</span><span>benny</span><span className="col-span-2">next-dev --port 3000</span></div>,
            <div key="6" className="grid grid-cols-4"><span>002</span><span>benny</span><span className="col-span-2">node soc-portal</span></div>,
            <div key="7" className="grid grid-cols-4"><span>003</span><span>benny</span><span className="col-span-2">python ghosteye.py</span></div>,
            <div key="8" className="grid grid-cols-4"><span>004</span><span>benny</span><span className="col-span-2 text-orange-400">brain --mode hyperfocus</span></div>,
            <div key="9" className="grid grid-cols-4"><span>005</span><span className="text-red-400">root</span><span className="col-span-2">coffee-daemon</span></div>,
          ]);
          break;

        case "clear":
          setHistory([]);
          break;

        case "exit":
          setIsOpen(false);
          break;

        case "matrix":
          setIsMatrix(true);
          await new Promise(r => setTimeout(r, 3000));
          setIsMatrix(false);
          break;

        case "curl resume":
          await printLines([<div key="1">Downloading resume...</div>], 0);
          await printLines([<div key="2" className="text-cyan-400">████████████████ 100%</div>], 1000);
          await printLines([<div key="3" className="mt-2">→ Opening PDF...</div>], 500);
          // Just open a dummy URL for now, let user fill it
          window.open("/benny-cv.pdf", "_blank"); 
          break;

        case "history":
          await printLines(cmdHistory.map((h, i) => <div key={i} className="flex gap-4"><span className="text-[var(--text3)]">{i + 1}</span><span>{h}</span></div>));
          break;

        default:
          await printLines([
            <div key="1" className="text-red-400">bash: {c}: command not found</div>,
            <div key="2" className="text-[var(--text3)]">Type 'help' for available commands.</div>
          ]);
          break;
      }
    } catch(err) {
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
      const match = COMMANDS.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[900] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4">
      {isMatrix && <MatrixEffect />}
      
      <div 
        className="w-full sm:max-w-[720px] h-[80vh] flex flex-col rounded-lg overflow-hidden border border-cyan-500/50 shadow-[0_0_30px_rgba(0,229,200,0.15)] relative"
        style={{ backgroundColor: "#020508", fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: "1.8" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Top Bar */}
        <div className="flex items-center px-4 py-2 bg-black/40 border-b border-cyan-900/50 relative border-t-2 border-t-cyan-500 shadow-[inset_0_1px_0_rgba(0,229,200,0.3)]">
          <div className="flex gap-2 z-10">
            <button onClick={() => setIsOpen(false)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-[var(--text3)] text-xs font-bold">
            benny@portfolio:~
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 text-[#e0e0e0] terminal-scrollbar z-10 relative">
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

// Simple Matrix Effect Component
function MatrixEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()".split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 33);
    
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />;
}
