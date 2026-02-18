import { useRef, useEffect } from "react";

function Hero() {
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = h1Ref.current;
    if (!el) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      el!.style.setProperty("--shimmer-x", `${pct}%`);
    }

    function handleMouseLeave() {
      el!.style.setProperty("--shimmer-x", "-30%");
    }

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div>
      <h1
        ref={h1Ref}
        className="text-4xl font-bold leading-tight sm:text-5xl cursor-default"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #ccd6f6 0%, #ccd6f6 calc(var(--shimmer-x, -30%) - 12%), rgba(100,255,218,0.95) var(--shimmer-x, -30%), #e6f1ff calc(var(--shimmer-x, -30%) + 4%), #ccd6f6 calc(var(--shimmer-x, -30%) + 16%), #ccd6f6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        <a href="/" style={{ WebkitTextFillColor: "inherit" }}>James Moessis</a>
      </h1>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-slate sm:text-3xl">
        a.k.a. jmoe
      </h2>
      <p className="mt-4 max-w-xs text-base leading-relaxed text-slate">
        Senior Software Engineer at{" "}
        <a
          href="https://www.atlassian.com/"
          className="text-slate-lightest hover:text-teal transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          Atlassian
        </a>
        , powering distributed tracing and observability for the Atlassian
        product suite.
      </p>
    </div>
  );
}

export default Hero;
