import type { SectionId } from "../hooks/useActiveSection";

const LINKS: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];

function Nav({ activeSection }: { activeSection: SectionId }) {
  return (
    <nav className="hidden lg:block">
      <ul className="flex flex-col gap-4">
        {LINKS.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`group flex items-center gap-4 text-xs font-bold uppercase tracking-widest ${
                  isActive ? "text-slate-lightest" : "text-slate hover:text-slate-lightest"
                } transition-colors`}
              >
                <span
                  className={`inline-block h-px transition-all ${
                    isActive
                      ? "w-16 bg-slate-lightest"
                      : "w-8 bg-slate group-hover:w-16 group-hover:bg-slate-lightest"
                  }`}
                />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Nav;
