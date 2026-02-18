import { useEffect, useState } from "react";

const SECTIONS = ["about", "experience", "projects"] as const;
export type SectionId = (typeof SECTIONS)[number];

export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("about");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { rootMargin: "-40% 0px -60% 0px" },
      );

      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}
