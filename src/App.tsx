import { useState, useEffect, useRef, type ReactNode } from "react";
import About from "./components/About";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Projects from "./components/Projects";
import { useActiveSection } from "./hooks/useActiveSection";
import type { SectionId } from "./hooks/useActiveSection";

const EMAIL = "james.moessis1@gmail.com";

const NAV_LINKS: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];

function EmailPopover() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCopied(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleCopy() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        onClick={() => { setOpen(!open); setCopied(false); }}
        aria-label="Email"
        className="transition-colors hover:text-teal text-slate cursor-pointer flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex items-center gap-2 rounded-lg bg-navy-light border border-navy-lighter px-3 py-2 shadow-lg whitespace-nowrap">
          <span className="font-mono text-sm text-slate-lightest">{EMAIL}</span>
          <button
            onClick={handleCopy}
            className="ml-1 rounded px-2 py-1 text-xs font-mono transition-colors cursor-pointer bg-navy-lighter text-slate hover:text-teal"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-navy-lighter" />
        </div>
      )}
    </div>
  );
}

function MagneticIcon({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseEnter() {
    if (ref.current) ref.current.style.transition = "transform 0.1s ease";
  }

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
    el.style.transform = "translate(0px, 0px)";
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-flex", transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      {children}
    </div>
  );
}

function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 text-slate ${className}`}>
      <MagneticIcon>
        <a
          href="https://github.com/jamesmoessis"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="transition-colors hover:text-teal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      </MagneticIcon>
      <MagneticIcon>
        <a
          href="https://linkedin.com/in/james-moessis"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="transition-colors hover:text-teal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
      </MagneticIcon>
      <MagneticIcon>
        <EmailPopover />
      </MagneticIcon>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  activeSection,
}: {
  open: boolean;
  onClose: () => void;
  activeSection: SectionId;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-navy-light lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-navy-lighter">
        <span className="font-mono text-sm text-teal">jamesmoessis</span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="text-slate hover:text-teal transition-colors cursor-pointer p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-8">
        {NAV_LINKS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={onClose}
            className={`text-2xl font-bold uppercase tracking-widest transition-colors ${
              activeSection === id ? "text-teal" : "text-slate-lightest hover:text-teal"
            }`}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="flex justify-center pb-12">
        <SocialLinks />
      </div>
    </div>
  );
}

function App() {
  const activeSection = useActiveSection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    function handleMouseMove(e: MouseEvent) {
      el!.style.background = `radial-gradient(560px circle at ${e.clientX}px ${e.clientY}px, rgba(100,255,218,0.15), rgba(100,255,218,0))`;
    }
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-navy text-slate">
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-30"
      />
      {/* Mobile hamburger — fixed top-right, only on small screens */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
        className="fixed top-5 right-6 z-40 flex flex-col gap-1.5 cursor-pointer lg:hidden"
      >
        <span className="block h-0.5 w-6 bg-teal" />
        <span className="block h-0.5 w-6 bg-teal" />
        <span className="block h-0.5 w-4 bg-teal" />
      </button>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
      />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 lg:flex lg:gap-4 lg:px-24 lg:py-0">
        {/* Left sidebar — sticky on large screens */}
        <header className="flex flex-col gap-6 pt-20 pb-12 lg:sticky lg:top-0 lg:h-screen lg:w-1/2 lg:justify-between lg:pt-24 lg:pb-24">
          <div>
            <Hero />
            {/* Social links — mobile only, shown below hero text */}
            <SocialLinks className="mt-6 flex lg:hidden" />
            <div className="mt-8 lg:mt-12">
              <Nav activeSection={activeSection} />
            </div>
          </div>

          {/* Social links — desktop sidebar only */}
          <SocialLinks className="hidden lg:flex" />
        </header>

        {/* Right content — scrolls */}
        <main className="lg:w-1/2 lg:py-24">
          <About />
          <Experience />
          <Projects />
          <footer className="pb-12 text-center text-xs text-slate lg:pb-0">
            <p>
              Designed &amp; Built by{" "}
              <a
                href="https://github.com/jamesmoessis"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-light hover:text-teal transition-colors"
              >
                James Moessis
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
