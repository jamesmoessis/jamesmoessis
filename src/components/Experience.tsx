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

        {/* Content panel */}
        <div className="flex-1 pt-6 pb-2" role="tabpanel">
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
                <span className="shrink-0 text-teal leading-relaxed">▹</span>
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
