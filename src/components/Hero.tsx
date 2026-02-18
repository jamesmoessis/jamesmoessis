function Hero() {
  return (
    <div>
      <p className="mb-4 font-mono text-base text-teal">Hi, my name is</p>
      <h1 className="text-4xl font-bold leading-tight text-slate-lightest sm:text-5xl">
        <a href="/">James Moessis.</a>
      </h1>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-slate sm:text-3xl">
        {/* TODO: Add your tagline/subtitle */}
      </h2>
      <p className="mt-4 max-w-xs text-base leading-relaxed text-slate">
        {/* TODO: Add a 1-2 sentence description about yourself */}
      </p>
    </div>
  );
}

export default Hero;
