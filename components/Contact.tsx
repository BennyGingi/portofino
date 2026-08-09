"use client";

import ScrollReveal from "./ScrollReveal";
import { Mail, Briefcase, Code, ExternalLink, ArrowRight, Send } from "lucide-react";

export default function Contact() {
  const LINKS = [
    {
      id: "email",
      icon: <Mail size={24} />,
      label: "Email",
      value: "gingi2603@gmail.com", // Updated email
      url: "mailto:gingi2603@gmail.com", // Updated email
    },
    {
      id: "linkedin",
      icon: <Briefcase size={24} />,
      label: "LinkedIn",
      value: "linkedin.com/in/benny-gingihasvili", // Updated LinkedIn
      url: "https://www.linkedin.com/in/benny-gingihasvili/", // Updated LinkedIn URL
    },
    {
      id: "github",
      icon: <Code size={24} />,
      label: "GitHub",
      value: "github.com/BennyGingi", // Updated GitHub
      url: "https://github.com/BennyGingi", // Updated GitHub URL
    },
    {
      id: "foodcritic",
      icon: <ExternalLink size={24} />,
      label: "Featured Project",
      value: "FoodCritic",
      url: "https://foodcritic-bennygolan.vercel.app",
    }
  ];

  return (
    <section className="py-24 bg-[var(--bg2)]/50" id="contact">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-16 flex items-center gap-4">
            <span className="text-cyan">05.</span>{" "}
            INITIALIZE_CONTACT
            <span className="h-px bg-[var(--border)] flex-1 ml-4" />
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Link Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LINKS.map((link, index) => (
              <ScrollReveal key={link.id} delay={index * 0.1}>
                <a
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                  className="group relative block p-6 bg-[var(--bg2)] border border-[var(--border)] rounded-lg overflow-hidden transition-all duration-300 hover:border-cyan"
                >
                  {/* Hover Background Slide */}
                  <div className="absolute inset-0 bg-cyan translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  
                  <div className="relative z-10 flex flex-col h-full text-[var(--text2)] group-hover:text-[var(--bg)] transition-colors duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-cyan group-hover:text-[var(--bg)] transition-colors duration-300">
                        {link.icon}
                      </div>
                      <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    
                    <div className="mt-auto">
                      <div className="font-space-mono text-xs uppercase tracking-widest mb-1 opacity-70">
                        {link.label}
                      </div>
                      <div className="font-orbitron font-bold text-[var(--text)] group-hover:text-[var(--bg)] transition-colors duration-300 truncate">
                        {link.value}
                      </div>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          {/* Right Column: CTA */}
          <ScrollReveal delay={0.4}>
            <div className="h-full bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--cyan)]/5 rounded-full blur-3xl group-hover:bg-[var(--cyan)]/10 transition-colors duration-500" />
              
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[var(--bg3)] border border-[var(--border)] rounded-full w-fit mb-8">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse box-shadow-cyan" />
                <span className="font-space-mono text-xs text-[var(--text2)] uppercase tracking-wider">
                  Open to new opportunities
                </span>
              </div>

              <h3 className="font-orbitron text-3xl md:text-4xl font-bold text-[var(--text)] mb-6">
                Let's build something <span className="text-cyan text-shadow-cyan">secure</span> and <span className="text-orange text-shadow-orange">scalable</span>.
              </h3>

              <p className="text-[var(--text2)] leading-relaxed mb-10 max-w-md">
                Whether it's an enterprise security solution or a next-generation web platform, I'm ready to bring my dual expertise to your team.
              </p>

              <a 
                href="mailto:gingi2603@gmail.com"
                className="inline-flex items-center justify-center gap-3 bg-cyan text-[var(--bg)] font-orbitron font-bold px-8 py-4 rounded-sm hover:bg-[var(--text)] transition-colors w-full sm:w-auto text-lg shadow-[0_0_20px_rgba(0,229,200,0.3)] hover:shadow-[0_0_30px_rgba(0,229,200,0.5)]"
              >
                INITIATE_HANDSHAKE <Send size={20} />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
