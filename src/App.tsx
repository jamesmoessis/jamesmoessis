import { useState, useEffect, useRef } from "react";
import About from "./components/About";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Projects from "./components/Projects";
import { useActiveSection } from "./hooks/useActiveSection";

const EMAIL = "james.moessis1@gmail.com";

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

function App() {
  const activeSection = useActiveSection();

  return (
    <div className="bg-navy text-slate">
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 md:px-12 lg:flex lg:gap-4 lg:px-24 lg:py-0">
        {/* Left sidebar — sticky on large screens */}
        <header className="flex flex-col gap-6 py-12 lg:sticky lg:top-0 lg:h-screen lg:w-1/2 lg:justify-between lg:py-24">
          <div>
            <Hero />
            <div className="mt-12">
              <Nav activeSection={activeSection} />
            </div>
          </div>

          {/* Social links */}
          <div className="hidden lg:flex items-center gap-5 text-slate">
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
            <EmailPopover />
          </div>
        </header>

        {/* Right content — scrolls */}
        <main className="lg:w-1/2 lg:py-24">
          <About />
          <Experience />
          <Projects />
        </main>
      </div>
    </div>
  );
}

export default App;
