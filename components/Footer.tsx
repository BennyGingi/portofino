export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[var(--bg)] border-t border-[var(--border)] py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="font-orbitron font-bold text-lg text-cyan flex items-center gap-1">
          BG.DEV<span className="w-1.5 h-1.5 rounded-full bg-orange block" />
        </div>
        
        {/* Copyright */}
        <div className="font-space-mono text-xs text-[var(--text3)] uppercase tracking-widest text-center">
          &copy; {year} Benny Gingihashvili. All rights reserved.
        </div>
        
        {/* Empty div for flexbox balancing on larger screens */}
        <div className="hidden sm:block w-[72px]"></div>
      </div>
    </footer>
  );
}
