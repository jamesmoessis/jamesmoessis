export interface Role {
  title: string;
  dateRange: string;
  bullets: string[];
}

export interface ExperienceEntry {
  company: string;
  url: string;
  roles: Role[];
}

const experience: ExperienceEntry[] = [
  {
    company: "Atlassian",
    url: "https://www.atlassian.com/",
    roles: [
      {
        title: "Senior Software Engineer",
        dateRange: "October 2024 — Present",
        bullets: [
          "Powering observability for the Atlassian product suite.",
          "Led the development, performance optimisation, and public-release of a world leading distributed tracing algorithm.",
          "Developed ML and tree-search algorithms to identify anomalies in distributed tracing data.",
          "Reached 200+ contributions to the OpenTelemetry project, collaborating with industry leading Observability engineers.",
          "Delivered talks on OpenTelemetry at Splunk Conf in Las Vegas, a keynote at the Sydney ICC, and was a featured speaker at KubeCon London '25.",
          "Oncall for Kubernetes cluster processing millions of req/s.",
        ],
      },
      {
        title: "Software Engineer",
        dateRange: "January 2021 — October 2024",
        bullets: [
          "Led library and system development projects to instrument thousands of microservices, underpinning Atlassian's architecture with high quality traces and metrics.",
          "Designed and implemented a tracing pipeline in AWS which collects, processes, and stores over 100TB per day.",
          "Develop and manage a fleet of over 100k custom OpenTelemetry Collectors running as sidecars, collecting infra metrics and application obsevability data.",
          "Developed in over 10 different programming languages.",
        ],
      },
    ],
  },
  {
    company: "University of Sydney",
    url: "https://www.sydney.edu.au/",
    roles: [
      {
        title: "Academic Tutor",
        dateRange: "February 2020 — December 2020",
        bullets: [
          "School of Computer Science tutor, teaching Python to first year students.",
        ],
      },
    ],
  },
  {
    company: "National Australia Bank",
    url: "https://www.nab.com.au/",
    roles: [
      {
        title: "Software Engineer",
        dateRange: "January 2019 — October 2019",
        bullets: [
          "Delivered several projects to an AWS production stack.",
        ],
      },
      {
        title: "Software Engineering Intern",
        dateRange: "January 2018 — January 2019",
        bullets: [],
      },
    ],
  },
];

export default experience;
