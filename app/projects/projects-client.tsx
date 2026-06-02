"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { hasPermission } from "@/lib/auth";
import { getStatusLabel, getStatusColor } from "@/lib/project-status";
import {
  createTrainingProject,
  hasProjectInputErrors,
  validateProjectInput,
  type NewTrainingProjectInput,
  type ProjectStatus,
  type TrainingProject
} from "@/lib/training-projects";
import { fetchProjects, apiCreateProject } from "@/lib/data-api";
import { RoleSwitcher, useCurrentUser } from "../role-switcher";

type ProjectWithStatus = TrainingProject & { computedStatus: ProjectStatus };

const emptyInput: NewTrainingProjectInput = {
  name: "",
  businessGoal: "",
  targetDepartment: "",
  expectedLearnerCount: 40,
  targetCompletionDate: "",
  learnerRoles: "",
  assignedSme: ""
};

export function ProjectsClient() {
  const currentUser = useCurrentUser();
  const canCreate = hasPermission(currentUser.role, "create_project");
  const [projects, setProjects] = useState<ProjectWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<NewTrainingProjectInput>(emptyInput);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchProjects()
      .then((data) => setProjects(data as ProjectWithStatus[]))
      .finally(() => setLoading(false));
  }, []);

  const errors = useMemo(() => validateProjectInput(input), [input]);

  function updateField<K extends keyof NewTrainingProjectInput>(
    field: K,
    value: NewTrainingProjectInput[K]
  ) {
    setInput((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (hasProjectInputErrors(input)) {
      return;
    }

    const project = createTrainingProject(input);
    const withStatus: ProjectWithStatus = { ...project, computedStatus: "draft" };
    setProjects((prev) => [withStatus, ...prev]);
    await apiCreateProject(project);
    setInput(emptyInput);
    setSubmitted(false);
  }

  return (
    <main className="main">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">Corporate L&D workspace</p>
          <h1>Training projects</h1>
          <p className="lead">
            Start with a draft project that captures the business goal, target
            learners, assigned SME, and delivery expectation.
          </p>
        </div>
        <div className="header-actions">
          <RoleSwitcher />
          <Link className="button secondary" href="/">
            Back to overview
          </Link>
        </div>
      </section>

      <section className={canCreate ? "workspace-grid" : "workspace-grid single"}>
        {canCreate ? (
        <form className="form-panel" onSubmit={handleSubmit}>
          <h2>New training project</h2>
          <FieldError show={submitted} message={errors.name} />
          <label>
            Program name
            <input
              value={input.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="AI Tools for Business Productivity"
            />
          </label>
          <FieldError show={submitted} message={errors.businessGoal} />
          <label>
            Business goal
            <textarea
              value={input.businessGoal}
              onChange={(event) =>
                updateField("businessGoal", event.target.value)
              }
              placeholder="Help business teams use approved AI tools safely and effectively."
            />
          </label>
          <div className="field-row">
            <label>
              Target department
              <input
                value={input.targetDepartment}
                onChange={(event) =>
                  updateField("targetDepartment", event.target.value)
                }
                placeholder="Business Operations"
              />
            </label>
            <label>
              Expected learners
              <input
                min={1}
                type="number"
                value={input.expectedLearnerCount}
                onChange={(event) =>
                  updateField(
                    "expectedLearnerCount",
                    Number(event.target.value)
                  )
                }
              />
            </label>
          </div>
          <FieldError show={submitted} message={errors.targetDepartment} />
          <FieldError show={submitted} message={errors.expectedLearnerCount} />
          <div className="field-row">
            <label>
              Target completion
              <input
                type="date"
                value={input.targetCompletionDate}
                onChange={(event) =>
                  updateField("targetCompletionDate", event.target.value)
                }
              />
            </label>
            <label>
              Assigned SME
              <input
                value={input.assignedSme}
                onChange={(event) =>
                  updateField("assignedSme", event.target.value)
                }
                placeholder="Priya Sharma"
              />
            </label>
          </div>
          <FieldError show={submitted} message={errors.targetCompletionDate} />
          <FieldError show={submitted} message={errors.assignedSme} />
          <FieldError show={submitted} message={errors.learnerRoles} />
          <label>
            Learner roles
            <textarea
              value={input.learnerRoles}
              onChange={(event) =>
                updateField("learnerRoles", event.target.value)
              }
              placeholder="Business users, team leads, operations analysts"
            />
          </label>
          <button className="button primary" type="submit">
            Create draft project
          </button>
        </form>
        ) : (
          <aside className="permission-notice">
            <p className="muted">
              Only L&D Admins can create training projects. You are signed in as <strong>{currentUser.name}</strong> ({currentUser.role}).
            </p>
          </aside>
        )}

        <section className="project-list" aria-label="Training projects">
          <div>
            <p className="eyebrow">Draft pipeline</p>
            <h2>{projects.length} training projects</h2>
          </div>
          {loading ? (
            <p className="muted">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="muted">
              No projects yet. Create the first Corporate L&D training project.
            </p>
          ) : (
            <div className="project-cards">
              {projects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div>
                    <span className={`badge badge-${getStatusColor(project.computedStatus)}`}>
                      {getStatusLabel(project.computedStatus)}
                    </span>
                    <h3>{project.name}</h3>
                    <p className="muted">{project.businessGoal}</p>
                  </div>
                  <dl>
                    <div>
                      <dt>Department</dt>
                      <dd>{project.targetDepartment}</dd>
                    </div>
                    <div>
                      <dt>Learners</dt>
                      <dd>{project.expectedLearnerCount}</dd>
                    </div>
                    <div>
                      <dt>SME</dt>
                      <dd>{project.assignedSme}</dd>
                    </div>
                  </dl>
                  <Link className="button secondary" href={`/projects/${project.id}`}>
                    Open project
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function FieldError({
  show,
  message
}: {
  show: boolean;
  message?: string;
}) {
  if (!show || !message) {
    return null;
  }

  return <p className="field-error">{message}</p>;
}
