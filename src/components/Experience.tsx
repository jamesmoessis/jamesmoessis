import { useState } from "react";
import experience from "../data/experience";

function Experience() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = experience[activeIdx];

  const allBullets = active.roles.flatMap((r) => r.bullets);

  return (
    <section id="experience" className="mb-24 scroll-mt-24">
      <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-lightest">
        Experience
      </h3>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tab list */}
        <div
          role="tablist"
          aria-label="Experience"
          className="flex overflow-x-auto border-b border-navy-lighter sm:flex-col sm:border-b-0 sm:border-l"
        >
          {experience.map((entry, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIdx(i)}
                className={`whitespace-nowrap px-4 py-3 text-left font-mono text-sm transition-colors ${
                  isActive
                    ? "border-b-2 border-teal text-teal sm:border-b-0 sm:border-l-2 sm:-ml-px"
                    : "text-slate hover:text-teal hover:bg-navy-light"
                }`}
              >
                {entry.company}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div className="min-h-[320px] flex-1 py-2 sm:pl-4" role="tabpanel">
          {/* Role titles with dates */}
          <div className="space-y-1">
            {active.roles.map((role, i) => (
              <div key={i} className="flex flex-wrap items-baseline gap-x-3">
                <h4 className="text-lg text-slate-lightest">
                  {role.title}
                </h4>
                <span className="font-mono text-sm text-slate">
                  {role.dateRange}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-2 text-teal text-sm">
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
            {allBullets.map((bullet, j) => (
              <li key={j} className="flex gap-3 text-sm leading-relaxed text-slate">
                <span className="mt-1 shrink-0 text-teal">▹</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Experience;
