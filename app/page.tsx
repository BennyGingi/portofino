import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import ThreatFeed from "@/components/ThreatFeed";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HireBot from "@/components/HireBot";
import TerminalOverlay from "@/components/TerminalOverlay";
import TerminalHint from "@/components/TerminalHint";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-hidden selection:bg-cyan/30">
      <AnalyticsTracker />
      <Navbar />
      <Hero />
      <StatsBar />
      <ThreatFeed />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
      <Footer />
      <HireBot />
      <TerminalOverlay />
      <TerminalHint />
      <AnalyticsPanel />
    </main>
  );
}
