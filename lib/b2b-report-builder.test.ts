import { describe, expect, it } from "vitest";
import { buildB2BLeadershipReport, createB2BReportFilename } from "./b2b-report-builder";
import { generateContentArtifacts } from "./content-artifact-generator";
import { createCohort, createEnrollment, createProgressEvent, createQuizAttempt, createSMEAlert } from "./delivery-workflow";
import { generateProgramPlan } from "./program-plan-generator";
import type { SourceDocument, TrainingProject } from "./training-projects";

const project: TrainingProject = {
  id: "project_1",
  name: "AI Tools for Business Productivity",
  businessGoal: "Help teams use AI safely.",
  targetDepartment: "Operations",
  expectedLearnerCount: 40,
  targetCompletionDate: "2026-06-30",
  learnerRoles: "Business users, team leads",
  assignedSme: "Priya Sharma",
  status: "draft",
  createdAt: "2026-05-28T00:00:00.000Z"
};

const source: SourceDocument = {
  id: "source_1",
  projectId: project.id,
  filename: "notes.md",
  sourceType: "md",
  extractionStatus: "extracted",
  isActiveForGeneration: true,
  extractedText: "AI prompting and practical tasks.",
  createdAt: "2026-05-28T00:00:00.000Z"
};

describe("b2b report builder", () => {
  it("summarizes readiness, progress, assessment, alerts, and ROI", () => {
    const lockedPlan = {
      ...generateProgramPlan({
        project,
        activeSources: [source],
        versionNumber: 1
      }),
      status: "locked" as const
    };
    const artifacts = generateContentArtifacts({
      projectId: project.id,
      plan: lockedPlan
    }).map((artifact) => ({ ...artifact, status: "approved" as const }));
    const cohort = createCohort({
      projectId: project.id,
      planId: lockedPlan.id,
      name: "Pilot",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      instructorName: "Priya"
    });
    const enrollment = createEnrollment({
      projectId: project.id,
      cohortId: cohort.id,
      learnerName: "Ananya",
      learnerEmail: "ananya@example.com",
      learnerRoleId: lockedPlan.learnerRoles[0].id,
      learnerRoleName: lockedPlan.learnerRoles[0].name
    });
    const progress = createProgressEvent({
      projectId: project.id,
      cohortId: cohort.id,
      enrollmentId: enrollment.id,
      moduleId: lockedPlan.modules[0].id,
      eventType: "module_completed"
    });
    const quiz = createQuizAttempt({
      projectId: project.id,
      cohortId: cohort.id,
      enrollmentId: enrollment.id,
      moduleId: lockedPlan.modules[0].id,
      score: 85,
      maxScore: 100
    });
    const alert = createSMEAlert({
      projectId: project.id,
      cohortId: cohort.id,
      enrollmentId: enrollment.id,
      triggerReason: "help_requested",
      evidence: "Learner requested help."
    });

    const report = buildB2BLeadershipReport({
      project,
      lockedPlan,
      artifacts,
      cohorts: [cohort],
      enrollments: [enrollment],
      progressEvents: [progress],
      quizAttempts: [quiz],
      smeAlerts: [alert]
    });

    expect(report.readiness.readinessStatus).toBe("ready");
    expect(report.cohortProgress.learnerCount).toBe(1);
    expect(report.assessmentSummary.passRate).toBe(100);
    expect(report.smeInterventions.openAlertCount).toBe(1);
    expect(report.roiEstimate.estimatedWeeksSaved).toBe(4);
  });

  it("creates a stable leadership report filename", () => {
    expect(createB2BReportFilename(project.name)).toBe(
      "ai-tools-for-business-productivity-leadership-report.json"
    );
  });
});

