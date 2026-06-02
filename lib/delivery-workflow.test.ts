import { describe, expect, it } from "vitest";
import {
  createCohort,
  createEnrollment,
  createQuizAttempt,
  createSMEAlert,
  shouldCreateQuizFailureAlert
} from "./delivery-workflow";

describe("delivery workflow", () => {
  it("creates cohort and enrollment records", () => {
    const cohort = createCohort({
      projectId: "project_1",
      planId: "plan_1",
      name: "Pilot Cohort",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      instructorName: "Priya"
    });
    const enrollment = createEnrollment({
      projectId: "project_1",
      cohortId: cohort.id,
      learnerName: "Ananya Rao",
      learnerEmail: "ananya@example.com",
      learnerRoleId: "role_1",
      learnerRoleName: "Business users"
    });

    expect(cohort.status).toBe("active");
    expect(enrollment.status).toBe("enrolled");
    expect(enrollment.cohortId).toBe(cohort.id);
  });

  it("detects two failed quiz attempts", () => {
    const attempts = [
      createQuizAttempt({
        projectId: "project_1",
        cohortId: "cohort_1",
        enrollmentId: "enrollment_1",
        moduleId: "module_1",
        score: 60,
        maxScore: 100
      }),
      createQuizAttempt({
        projectId: "project_1",
        cohortId: "cohort_1",
        enrollmentId: "enrollment_1",
        moduleId: "module_1",
        score: 50,
        maxScore: 100
      })
    ];

    expect(
      shouldCreateQuizFailureAlert({
        attempts,
        enrollmentId: "enrollment_1",
        moduleId: "module_1"
      })
    ).toBe(true);
  });

  it("creates SME alerts with recommended action", () => {
    const alert = createSMEAlert({
      projectId: "project_1",
      cohortId: "cohort_1",
      enrollmentId: "enrollment_1",
      triggerReason: "help_requested",
      evidence: "Learner requested help."
    });

    expect(alert.status).toBe("open");
    expect(alert.recommendedAction).toMatch(/respond/i);
  });
});

