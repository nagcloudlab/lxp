import Link from "next/link";

const workflowSteps = [
  {
    title: "Capture requirements",
    description:
      "Upload corporate training inputs and extract goals, constraints, assumptions, conflicts, learner roles, and source-backed context."
  },
  {
    title: "Lock the program plan",
    description:
      "Generate a structured TOC, role tracks, prerequisite map, and assessment blueprint for SME review and approval."
  },
  {
    title: "Create the package",
    description:
      "Generate slide outlines, facilitator notes, handouts, exercises, quizzes, practical tasks, and rubrics from the locked TOC."
  },
  {
    title: "Deliver and report",
    description:
      "Run a lightweight cohort, track learner signals, trigger SME alerts, and export readiness, progress, and ROI reports."
  }
];

const metrics = [
  { value: "B2B", label: "Initial commercial focus" },
  { value: "SME", label: "Approval before publishing" },
  { value: "4", label: "Core MVP workflows" },
  { value: "12w", label: "Pilot build target" }
];

export default function Home() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <strong>LXP B2B</strong>
          <span>AI learning orchestration for Corporate L&D</span>
        </div>
        <nav aria-label="Primary">
          <a href="#workflow">Workflow</a>
          <a href="#mvp">MVP</a>
          <a href="#metrics">Metrics</a>
        </nav>
      </header>

      <main className="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">B2B first. B2C after proof.</p>
            <h1 id="hero-title">
              Turn raw training requirements into SME-approved corporate
              learning programs.
            </h1>
            <p className="lead">
              The MVP helps L&D teams create role-specific training plans,
              generate reviewed content packages, run lightweight cohorts, and
              report learner signals and business readiness.
            </p>
            <div className="actions">
              <Link className="button primary" href="/projects">
                Open workspace
              </Link>
              <a className="button secondary" href="#mvp">
                Review MVP scope
              </a>
            </div>
          </div>

          <aside className="status-panel" aria-label="Pilot status">
            <div>
              <p className="eyebrow">Pilot target</p>
              <h2>Corporate L&D custom program creation</h2>
            </div>
            <div className="status-grid">
              <div className="status-row">
                <span>Requirement intelligence</span>
                <span className="badge">Core</span>
              </div>
              <div className="status-row">
                <span>SME approval workflow</span>
                <span className="badge">Core</span>
              </div>
              <div className="status-row">
                <span>Content package export</span>
                <span className="badge">Core</span>
              </div>
              <div className="status-row">
                <span>B2C marketplace</span>
                <span className="badge">Deferred</span>
              </div>
            </div>
          </aside>
        </section>

        <section className="sections" id="mvp" aria-label="MVP pillars">
          <article className="section">
            <p className="eyebrow">Input</p>
            <h2>Messy corporate sources</h2>
            <ul>
              <li>Emails, documents, PDFs, transcripts, notes</li>
              <li>Assumptions and conflicts separated from facts</li>
              <li>Active sources only used for generation</li>
            </ul>
          </article>
          <article className="section">
            <p className="eyebrow">Control</p>
            <h2>SME-validated quality</h2>
            <ul>
              <li>TOC review, comments, approvals, and locking</li>
              <li>No learner publishing without human approval</li>
              <li>Prompt and source metadata retained</li>
            </ul>
          </article>
          <article className="section">
            <p className="eyebrow">Output</p>
            <h2>B2B readiness reports</h2>
            <ul>
              <li>Export approved program packages</li>
              <li>Track learner signals and SME alerts</li>
              <li>Report progress, readiness, and time saved</li>
            </ul>
          </article>
        </section>

        <section className="metrics" id="metrics" aria-label="Build metrics">
          {metrics.map((metric) => (
            <article className="metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span className="muted">{metric.label}</span>
            </article>
          ))}
        </section>

        <section className="workflow" id="workflow" aria-labelledby="workflow-title">
          <div>
            <p className="eyebrow">MVP workflow</p>
            <h2 id="workflow-title">
              Raw inputs to approved program package
            </h2>
          </div>
          {workflowSteps.map((step, index) => (
            <article className="workflow-step" key={step.title}>
              <span className="step-number">{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p className="muted">{step.description}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
