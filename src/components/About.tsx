const TECH = [
  "Go",
  "Java / Kotlin",
  "Python",
  "Distributed Systems",
  "Kubernetes",
  "Performance Optimisation",
  "OpenTelemetry",
  "Spring Framework",
  "PostgreSQL",
  "Public Speaking",
];

function About() {
  return (
    <section id="about" className="mb-24 scroll-mt-24">
      <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-slate-lightest">
        About
      </h3>

      <div className="max-w-2xl">
        <p className="mb-4 text-slate">
          I'm a senior software engineer with 7+ years of experience,
          passionate about building high-quality backend systems and platform
          tooling. My work sits at the intersection of{" "}
          <span className="text-slate-lightest">
            distributed systems, observability, and open source
          </span>
          .
        </p>

        <p className="mb-4 text-slate">
          Currently at{" "}
          <a
            href="https://www.atlassian.com/"
            className="text-slate-lightest hover:text-teal transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Atlassian
          </a>
          , I power observability for the product suite — building the libraries,
          pipelines, and algorithms that instrument thousands of microservices.
          I've led the development and public release of a world-leading
          distributed tracing sampling algorithm and designed a tracing pipeline
          that processes over 100TB per day.
        </p>

        <p className="mb-4 text-slate">
          I have hundreds of contributions to open source projects like{" "}
          <a
            href="https://opentelemetry.io/"
            className="text-slate-lightest hover:text-teal transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            OpenTelemetry
          </a>{" "}
          and Spring, and I've spoken at conferences including{" "}
          <span className="text-slate-lightest">Splunk Conf in Las Vegas</span>, a
          keynote in the Sydney International Convention Centre, and a featured interviewee at{" "}
          <a
            href="https://youtu.be/QzStkLbA7Qk?si=5ZXUeBMxg67e7hUh&t=461"
            target="_blank"
            rel="noreferrer"
            className="text-slate-lightest underline underline-offset-2 decoration-slate hover:text-teal hover:decoration-teal transition-colors"
          >
            KubeCon London '25
          </a>
          .
        </p>

        <p className="mb-6 text-slate">
          I studied Computer Science and Mathematics at the University of Sydney,
          where I received the Microsoft Research Asia Prize for the best Senior
          Software Development Project.
        </p>

        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          {TECH.map((t) => (
            <li key={t} className="flex items-center gap-2 text-sm text-slate">
              <span className="text-teal">▹</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default About;
