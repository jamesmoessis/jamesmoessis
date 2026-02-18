import projects from "../data/projects";

function ExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function Projects() {
  return (
    <section id="projects" className="mb-24 scroll-mt-24">
      <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-lightest">
        Projects
      </h3>

      <div className="space-y-12">
        {projects.map((project, i) => (
          <div
            key={i}
            className="group relative rounded-lg p-5 transition-all hover:bg-navy-light/50 hover:shadow-lg"
          >
            <p className="mb-2 font-mono text-sm text-teal">
              Featured Project
            </p>

            <h4 className="mb-3 text-xl text-slate-lightest group-hover:text-teal transition-colors">
              {project.externalUrl ? (
                <a href={project.externalUrl} target="_blank" rel="noreferrer">
                  {project.title}
                </a>
              ) : project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h4>

            <p className="mb-4 text-sm leading-relaxed text-slate">
              {project.description}
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-teal-muted px-3 py-1 font-mono text-xs text-teal"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-4 text-slate hover:text-slate-lightest">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                  className="transition-colors hover:text-teal"
                >
                  <GitHubIcon />
                </a>
              )}
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="External link"
                  className="transition-colors hover:text-teal"
                >
                  <ExternalIcon />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
