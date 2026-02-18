export interface Project {
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  externalUrl?: string;
}

const projects: Project[] = [
  {
    title: "Distributed Tracing Tail Sampling Algorithm",
    description:
      "Led the development and public release of a world-leading distributed tracing sampling algorithm at Atlassian. Optimised performance for a system handling millions of datapoints per second across thousands of microservices.",
    tech: ["Go", "OpenTelemetry", "Performance Optimisation"],
    githubUrl: "https://github.com/atlassian-labs/atlassian-sampling-processor/tree/main",
  },
  {
    title: "OpenTelemetry Collector Contributions",
    description:
      "Over 200 contributions to the OpenTelemetry project. Collaborated with industry-leading engineers on collector components, SDKs, and instrumentation libraries.",
    tech: ["Go", "Java", "Python", "Open Source"],
    githubUrl: "https://github.com/jamesmoessis",
    externalUrl: "https://opentelemetry.io/",
  },
  {
    title: "Tracing Pipeline (100TB/day)",
    description:
      "Designed and implemented a high-throughput tracing pipeline in AWS that collects, processes, and stores over 100TB of distributed trace data per day, powering observability across Atlassian's product suite.",
    tech: ["AWS", "Kubernetes", "Go", "Columnar DBs"],
  },
  {
    title: "Anomaly Detection in Traces",
    description:
      "Developed ML and tree-search algorithms to automatically identify anomalies in distributed tracing data, helping engineers surface regressions and errors across complex microservice architectures. Utilised language models and topic modelling to identify anomalous errors during incident periods. Utilised graph analysis libraries to find structural anomalies in distributed traces.",
    tech: ["Machine Learning", "Python"],
  },
];

export default projects;
