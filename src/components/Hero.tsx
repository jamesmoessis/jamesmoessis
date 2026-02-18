function Hero() {
  return (
    <div>
      <h1 className="text-4xl font-bold leading-tight text-slate-lightest sm:text-5xl">
        <a href="/">James Moessis</a>
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
