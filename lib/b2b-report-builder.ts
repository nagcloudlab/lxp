import type {
  Cohort,
  ContentArtifact,
  Enrollment,
  ProgramPlan,
  ProgressEvent,
  QuizAttempt,
  SMEAlert,
  TrainingProject
} from "./training-projects";

export type B2BLeadershipReport = {
  reportType: "b2b_leadership_report";
  schemaVersion: "1.0.0";
  generatedAt: string;
  project: {
    id: string;
    name: string;
    businessGoal: string;
    targetDepartment: string;
    expectedLearnerCount: number;
    assignedSme: string;
  };
  readiness: {
    hasLockedToc: boolean;
    approvedArtifactCount: number;
    requiredArtifactCount: number;
    readinessStatus: "not_ready" | "partial" | "ready";
  };
  cohortProgress: {
    cohortCount: number;
    learnerCount: number;
    moduleCompletedCount: number;
    helpRequestCount: number;
  };
  assessmentSummary: {
    quizAttemptCount: number;
    passedQuizCount: number;
    failedQuizCount: number;
    passRate: number;
  };
  smeInterventions: {
    openAlertCount: number;
    resolvedAlertCount: number;
    totalAlertCount: number;
  };
  roiEstimate: {
    baselinePreparationWeeks: number;
    estimatedPlatformPreparationWeeks: number;
    estimatedWeeksSaved: number;
    summary: string;
  };
};

const requiredArtifactCount = 7;

export function buildB2BLeadershipReport(input: {
  project: TrainingProject;
  lockedPlan?: ProgramPlan;
  artifacts: ContentArtifact[];
  cohorts: Cohort[];
  enrollments: Enrollment[];
  progressEvents: ProgressEvent[];
  quizAttempts: QuizAttempt[];
  smeAlerts: SMEAlert[];
}): B2BLeadershipReport {
  const approvedArtifactCount = input.lockedPlan
    ? input.artifacts.filter(
        (artifact) =>
          artifact.planId === input.lockedPlan?.id && artifact.status === "approved"
      ).length
    : 0;
  const readinessStatus = !input.lockedPlan
    ? "not_ready"
    : approvedArtifactCount >= requiredArtifactCount
      ? "ready"
      : "partial";
  const passedQuizCount = input.quizAttempts.filter(
    (attempt) => attempt.passed
  ).length;
  const failedQuizCount = input.quizAttempts.filter(
    (attempt) => !attempt.passed
  ).length;
  const passRate =
    input.quizAttempts.length === 0
      ? 0
      : Math.round((passedQuizCount / input.quizAttempts.length) * 100);
  const moduleCompletedCount = input.progressEvents.filter(
    (event) => event.eventType === "module_completed"
  ).length;
  const helpRequestCount = input.progressEvents.filter(
    (event) => event.eventType === "help_requested"
  ).length;
  const openAlertCount = input.smeAlerts.filter(
    (alert) => alert.status === "open"
  ).length;
  const resolvedAlertCount = input.smeAlerts.filter(
    (alert) => alert.status === "resolved"
  ).length;

  return {
    reportType: "b2b_leadership_report",
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    project: {
      id: input.project.id,
      name: input.project.name,
      businessGoal: input.project.businessGoal,
      targetDepartment: input.project.targetDepartment,
      expectedLearnerCount: input.project.expectedLearnerCount,
      assignedSme: input.project.assignedSme
    },
    readiness: {
      hasLockedToc: Boolean(input.lockedPlan),
      approvedArtifactCount,
      requiredArtifactCount,
      readinessStatus
    },
    cohortProgress: {
      cohortCount: input.cohorts.length,
      learnerCount: input.enrollments.length,
      moduleCompletedCount,
      helpRequestCount
    },
    assessmentSummary: {
      quizAttemptCount: input.quizAttempts.length,
      passedQuizCount,
      failedQuizCount,
      passRate
    },
    smeInterventions: {
      openAlertCount,
      resolvedAlertCount,
      totalAlertCount: input.smeAlerts.length
    },
    roiEstimate: {
      baselinePreparationWeeks: 6,
      estimatedPlatformPreparationWeeks: 2,
      estimatedWeeksSaved: 4,
      summary:
        "Estimated preparation time saved by moving from manual SME-led creation to bot-drafted, SME-approved program generation."
    }
  };
}

export function createB2BReportFilename(projectName: string) {
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "program"}-leadership-report.json`;
}

