import { useState, useRef, useEffect, useCallback } from "react";
import experience from "../data/experience";
import { useInView } from "../hooks/useInView";

function Experience() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const active = experience[activeIdx];
  const allBullets = active.roles.flatMap((r) => r.bullets);
  const { ref, inView } = useInView<HTMLElement>();

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const syncHeight = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const h = inner.getBoundingClientRect().height;
    outer.style.height = `${h}px`;
  }, []);

  useEffect(() => {
    syncHeight();
    setAnimating(true);
    const lastDelay = Math.max(
      (active.roles.length - 1) * 60,
      active.roles.length * 60,
      100 + (allBullets.length - 1) * 60
    );
    const id = setTimeout(() => setAnimating(false), lastDelay + 400);
    return () => clearTimeout(id);
  }, [activeIdx, syncHeight, active.roles.length, allBullets.length]);

  useEffect(() => {
    if (!innerRef.current) return;
    const ro = new ResizeObserver(syncHeight);
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [syncHeight]);

  return (
    <section
      id="experience"
      ref={ref}
      className={`mb-24 scroll-mt-24 reveal ${inView ? "visible" : ""}`}
    >
      <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-lightest">
        Experience
      </h3>

      <div className="flex flex-col gap-0">
        {/* Tab list */}
        <div
          role="tablist"
          aria-label="Experience"
          className="flex overflow-x-auto border-b border-navy-lighter [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {experience.map((entry, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIdx(i)}
                className={`whitespace-nowrap px-5 py-3 font-mono text-sm transition-colors ${
                  isActive
                    ? "border-b-2 border-teal text-teal -mb-px"
                    : "text-slate hover:text-teal hover:bg-navy-light"
                }`}
              >
                {entry.company}
              </button>
            );
          })}
        </div>

        {/* Height-animated wrapper */}
        <div
          ref={outerRef}
          className="overflow-hidden transition-[height] duration-400 ease-in-out"
        >
          {/* Content panel */}
          <div ref={innerRef} className="pt-6 pb-2" role="tabpanel" key={activeIdx}>
            {/* Role titles with dates */}
            <div className="space-y-1">
              {active.roles.map((role, i) => (
                <div
                  key={i}
                  className={`flex flex-wrap items-baseline gap-x-3 ${animating ? "tab-reveal tab-reveal-active" : ""}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <h4 className="text-lg text-slate-lightest">
                    {role.title}
                  </h4>
                  <span className="font-mono text-sm text-slate">
                    {role.dateRange}
                  </span>
                </div>
              ))}
            </div>

            <p
              className={`mt-2 text-teal text-sm ${animating ? "tab-reveal tab-reveal-active" : ""}`}
              style={{ animationDelay: `${active.roles.length * 60}ms` }}
            >
              <a
                href={active.url}
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {active.company}
              </a>
            </p>

            {/* Combined bullets */}
            <ul className="mt-6 space-y-3">
              {allBullets.map((bullet, j) => {
                const isInitialReveal = inView && !animating;
                const isTabSwitch = animating;
                return (
                  <li
                    key={j}
                    className={`flex gap-3 text-sm leading-relaxed text-slate ${
                      isTabSwitch ? "tab-reveal tab-reveal-active" : `reveal ${inView ? "visible" : ""}`
                    }`}
                    style={
                      isTabSwitch
                        ? { animationDelay: `${100 + j * 60}ms` }
                        : isInitialReveal
                          ? { transitionDelay: `${100 + j * 60}ms` }
                          : { transitionDelay: "0ms" }
                    }
                  >
                    <span className="shrink-0 text-teal leading-relaxed">▹</span>
                    <span>{bullet}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;
