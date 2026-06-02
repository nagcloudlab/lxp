import { FormEvent } from "react";
import { createProgressEvent } from "@/lib/delivery-workflow";
import type {
  Cohort,
  Enrollment,
  ProgramPlan,
  QuizAttempt,
  SMEAlert
} from "@/lib/training-projects";

export function DeliveryWorkspace({
  alerts,
  canEnroll,
  enrollments,
  enrollmentInput,
  lockedPlan,
  onAddProgress,
  onEnroll,
  onEnrollmentInputChange,
  onQuizAttempt,
  onRequestHelp,
  onResolveAlert,
  progressEvents,
  quizAttempts,
  selectedCohort
}: {
  alerts: SMEAlert[];
  canEnroll: boolean;
  enrollments: Enrollment[];
  enrollmentInput: {
    learnerName: string;
    learnerEmail: string;
    learnerRoleId: string;
  };
  lockedPlan: ProgramPlan;
  onAddProgress: (
    event: Omit<
      Parameters<typeof createProgressEvent>[0],
      "projectId" | "cohortId"
    >
  ) => void;
  onEnroll: (event: FormEvent<HTMLFormElement>) => void;
  onEnrollmentInputChange: (input: {
    learnerName: string;
    learnerEmail: string;
    learnerRoleId: string;
  }) => void;
  onQuizAttempt: (
    enrollment: Enrollment,
    moduleId: string,
    score: number
  ) => void;
  onRequestHelp: (enrollment: Enrollment, moduleId: string) => void;
  onResolveAlert: (alertId: string) => void;
  progressEvents: Array<ReturnType<typeof createProgressEvent>>;
  quizAttempts: QuizAttempt[];
  selectedCohort: Cohort;
}) {
  const firstModule = lockedPlan.modules[0];
  const openAlerts = alerts.filter(
    (alert) => alert.cohortId === selectedCohort.id && alert.status === "open"
  );

  return (
    <div className="delivery-stack">
      <form className="form-panel" onSubmit={onEnroll}>
        <h3>Enroll learner</h3>
        <div className="field-row">
          <label>
            Learner name
            <input
              value={enrollmentInput.learnerName}
              onChange={(event) =>
                onEnrollmentInputChange({
                  ...enrollmentInput,
                  learnerName: event.target.value
                })
              }
              placeholder="Ananya Rao"
            />
          </label>
          <label>
            Learner email
            <input
              type="email"
              value={enrollmentInput.learnerEmail}
              onChange={(event) =>
                onEnrollmentInputChange({
                  ...enrollmentInput,
                  learnerEmail: event.target.value
                })
              }
              placeholder="ananya@example.com"
            />
          </label>
        </div>
        <label>
          Role track
          <select
            value={enrollmentInput.learnerRoleId}
            onChange={(event) =>
              onEnrollmentInputChange({
                ...enrollmentInput,
                learnerRoleId: event.target.value
              })
            }
          >
            <option value="">Use first available role</option>
            {lockedPlan.learnerRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>
        <button className="button primary" disabled={!canEnroll} type="submit">
          {canEnroll ? "Enroll learner" : "Not permitted"}
        </button>
      </form>

      <section className="progress-dashboard">
        <div>
          <p className="eyebrow">Progress dashboard</p>
          <h3>{selectedCohort.name}</h3>
        </div>

        {enrollments.length === 0 ? (
          <p className="muted">No learners enrolled yet.</p>
        ) : (
          <div className="learner-grid">
            {enrollments.map((enrollment) => (
              <LearnerProgressCard
                enrollment={enrollment}
                firstModule={firstModule}
                key={enrollment.id}
                onAddProgress={onAddProgress}
                onQuizAttempt={onQuizAttempt}
                onRequestHelp={onRequestHelp}
                progressEvents={progressEvents}
                quizAttempts={quizAttempts}
              />
            ))}
          </div>
        )}
      </section>

      <section className="alert-panel">
        <div>
          <p className="eyebrow">SME alerts</p>
          <h3>{openAlerts.length} open alerts</h3>
        </div>
        {openAlerts.length === 0 ? (
          <p className="muted">No open SME alerts.</p>
        ) : (
          <div className="project-cards">
            {openAlerts.map((alert) => {
              const learner = enrollments.find(
                (enrollment) => enrollment.id === alert.enrollmentId
              );

              return (
                <article className="project-card" key={alert.id}>
                  <div>
                    <span className="badge">{alert.triggerReason}</span>
                    <h3>{learner?.learnerName ?? "Learner"}</h3>
                    <p className="muted">{alert.evidence}</p>
                    <p className="muted">{alert.recommendedAction}</p>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() => onResolveAlert(alert.id)}
                    type="button"
                  >
                    Resolve alert
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function LearnerProgressCard({
  enrollment,
  firstModule,
  onAddProgress,
  onQuizAttempt,
  onRequestHelp,
  progressEvents,
  quizAttempts
}: {
  enrollment: Enrollment;
  firstModule?: ProgramPlan["modules"][number];
  onAddProgress: (
    event: Omit<
      Parameters<typeof createProgressEvent>[0],
      "projectId" | "cohortId"
    >
  ) => void;
  onQuizAttempt: (
    enrollment: Enrollment,
    moduleId: string,
    score: number
  ) => void;
  onRequestHelp: (enrollment: Enrollment, moduleId: string) => void;
  progressEvents: Array<ReturnType<typeof createProgressEvent>>;
  quizAttempts: QuizAttempt[];
}) {
  const moduleId = firstModule?.id ?? "module";
  const completedModules = new Set(
    progressEvents
      .filter(
        (event) =>
          event.enrollmentId === enrollment.id &&
          event.eventType === "module_completed"
      )
      .map((event) => event.moduleId)
  );
  const latestAttempt = quizAttempts.find(
    (attempt) =>
      attempt.enrollmentId === enrollment.id && attempt.moduleId === moduleId
  );

  return (
    <article className="learner-card">
      <div>
        <span className="badge">{enrollment.learnerRoleName}</span>
        <h3>{enrollment.learnerName}</h3>
        <p className="muted">{enrollment.learnerEmail || "No email"}</p>
      </div>
      <dl>
        <div>
          <dt>Module</dt>
          <dd>{firstModule?.title ?? "No module"}</dd>
        </div>
        <div>
          <dt>Progress</dt>
          <dd>
            {completedModules.has(moduleId)
              ? "completed"
              : "not completed"}
          </dd>
        </div>
        <div>
          <dt>Latest quiz</dt>
          <dd>
            {latestAttempt
              ? `${latestAttempt.score}/100 ${
                  latestAttempt.passed ? "passed" : "failed"
                }`
              : "not attempted"}
          </dd>
        </div>
      </dl>
      <div className="review-actions">
        <button
          className="button secondary"
          disabled={!firstModule}
          onClick={() =>
            onAddProgress({
              enrollmentId: enrollment.id,
              moduleId,
              eventType: "module_started"
            })
          }
          type="button"
        >
          Start module
        </button>
        <button
          className="button secondary"
          disabled={!firstModule}
          onClick={() =>
            onAddProgress({
              enrollmentId: enrollment.id,
              moduleId,
              eventType: "module_completed"
            })
          }
          type="button"
        >
          Complete module
        </button>
        <button
          className="button secondary"
          disabled={!firstModule}
          onClick={() => onQuizAttempt(enrollment, moduleId, 60)}
          type="button"
        >
          Record failed quiz
        </button>
        <button
          className="button secondary"
          disabled={!firstModule}
          onClick={() => onQuizAttempt(enrollment, moduleId, 85)}
          type="button"
        >
          Record passed quiz
        </button>
        <button
          className="button primary"
          disabled={!firstModule}
          onClick={() => onRequestHelp(enrollment, moduleId)}
          type="button"
        >
          Request help
        </button>
      </div>
    </article>
  );
}
