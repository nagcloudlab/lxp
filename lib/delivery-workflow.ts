import {
  createGeneratedId,
  type Cohort,
  type Enrollment,
  type ProgressEvent,
  type QuizAttempt,
  type SMEAlert
} from "./training-projects";

export function createCohort(input: {
  projectId: string;
  planId: string;
  name: string;
  startDate: string;
  endDate: string;
  instructorName: string;
}): Cohort {
  return {
    id: createGeneratedId("cohort"),
    projectId: input.projectId,
    planId: input.planId,
    name: input.name,
    status: "active",
    startDate: input.startDate,
    endDate: input.endDate,
    instructorName: input.instructorName,
    createdAt: new Date().toISOString()
  };
}

export function createEnrollment(input: {
  projectId: string;
  cohortId: string;
  learnerName: string;
  learnerEmail: string;
  learnerRoleId: string;
  learnerRoleName: string;
}): Enrollment {
  return {
    id: createGeneratedId("enrollment"),
    projectId: input.projectId,
    cohortId: input.cohortId,
    learnerName: input.learnerName,
    learnerEmail: input.learnerEmail,
    learnerRoleId: input.learnerRoleId,
    learnerRoleName: input.learnerRoleName,
    status: "enrolled",
    enrolledAt: new Date().toISOString()
  };
}

export function createProgressEvent(input: {
  projectId: string;
  cohortId: string;
  enrollmentId: string;
  moduleId?: string;
  eventType: ProgressEvent["eventType"];
  eventData?: ProgressEvent["eventData"];
}): ProgressEvent {
  return {
    id: createGeneratedId("progress"),
    projectId: input.projectId,
    cohortId: input.cohortId,
    enrollmentId: input.enrollmentId,
    moduleId: input.moduleId,
    eventType: input.eventType,
    eventData: input.eventData,
    createdAt: new Date().toISOString()
  };
}

export function createQuizAttempt(input: {
  projectId: string;
  cohortId: string;
  enrollmentId: string;
  moduleId: string;
  score: number;
  maxScore: number;
}): QuizAttempt {
  return {
    id: createGeneratedId("quiz"),
    projectId: input.projectId,
    cohortId: input.cohortId,
    enrollmentId: input.enrollmentId,
    moduleId: input.moduleId,
    score: input.score,
    maxScore: input.maxScore,
    passed: input.score / input.maxScore >= 0.75,
    submittedAt: new Date().toISOString()
  };
}

export function createSMEAlert(input: {
  projectId: string;
  cohortId: string;
  enrollmentId: string;
  moduleId?: string;
  triggerReason: SMEAlert["triggerReason"];
  evidence: string;
}): SMEAlert {
  return {
    id: createGeneratedId("alert"),
    projectId: input.projectId,
    cohortId: input.cohortId,
    enrollmentId: input.enrollmentId,
    moduleId: input.moduleId,
    triggerReason: input.triggerReason,
    evidence: input.evidence,
    recommendedAction:
      input.triggerReason === "quiz_failed_twice"
        ? "SME should review the learner's failed attempts and assign remediation."
        : "SME or instructor should respond to the learner help request.",
    status: "open",
    createdAt: new Date().toISOString()
  };
}

export function shouldCreateQuizFailureAlert(input: {
  attempts: QuizAttempt[];
  enrollmentId: string;
  moduleId: string;
}) {
  const failedAttempts = input.attempts.filter(
    (attempt) =>
      attempt.enrollmentId === input.enrollmentId &&
      attempt.moduleId === input.moduleId &&
      !attempt.passed
  );

  return failedAttempts.length >= 2;
}

