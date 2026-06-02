import { describe, it, expect } from "vitest";
import { deriveProjectStatus, getStatusLabel } from "./project-status";
import type { ProjectStateInputs } from "./project-status";

const empty: ProjectStateInputs = {
  sources: [],
  plans: [],
  artifacts: [],
  cohorts: []
};

const source = (active = true) => ({
  id: "s1",
  projectId: "p1",
  filename: "test.md",
  sourceType: "md" as const,
  extractionStatus: "extracted" as const,
  isActiveForGeneration: active,
  extractedText: "content",
  createdAt: ""
});

const plan = (status: "draft" | "in_review" | "approved" | "locked") => ({
  id: "plan1",
  projectId: "p1",
  versionNumber: 1,
  title: "Plan",
  status,
  sourceDocumentIds: [],
  generationMetadata: {} as any,
  requirementSummary: "",
  businessContext: "",
  targetAudience: "",
  assumptions: [],
  conflicts: [],
  learnerRoles: [],
  modules: [],
  assessmentBlueprint: {} as any,
  createdAt: ""
});

const artifact = (status: "draft" | "approved") => ({
  id: "a1",
  projectId: "p1",
  planId: "plan1",
  artifactType: "slide_outline" as const,
  title: "Slides",
  contentBody: "",
  status,
  sourceDocumentIds: [],
  generationMetadata: {} as any,
  createdAt: ""
});

const cohort = (status: "draft" | "active" | "completed") => ({
  id: "c1",
  projectId: "p1",
  planId: "plan1",
  name: "Cohort",
  status,
  startDate: "",
  endDate: "",
  instructorName: "",
  createdAt: ""
});

describe("deriveProjectStatus", () => {
  it("returns draft for empty project", () => {
    expect(deriveProjectStatus(empty)).toBe("draft");
  });

  it("returns sources_added when active sources exist", () => {
    expect(deriveProjectStatus({ ...empty, sources: [source()] })).toBe("sources_added");
  });

  it("stays draft if sources are inactive", () => {
    expect(deriveProjectStatus({ ...empty, sources: [source(false)] })).toBe("draft");
  });

  it("returns plan_generated after plan creation", () => {
    expect(deriveProjectStatus({
      ...empty,
      sources: [source()],
      plans: [plan("draft")]
    })).toBe("plan_generated");
  });

  it("returns plan_in_review when plan is in review", () => {
    expect(deriveProjectStatus({
      ...empty,
      plans: [plan("in_review")]
    })).toBe("plan_in_review");
  });

  it("returns plan_approved when plan is approved or locked", () => {
    expect(deriveProjectStatus({
      ...empty,
      plans: [plan("approved")]
    })).toBe("plan_approved");
  });

  it("returns content_generating with locked plan and draft artifacts", () => {
    expect(deriveProjectStatus({
      ...empty,
      plans: [plan("locked")],
      artifacts: [artifact("draft")]
    })).toBe("content_generating");
  });

  it("returns content_approved with approved artifacts", () => {
    expect(deriveProjectStatus({
      ...empty,
      plans: [plan("locked")],
      artifacts: [artifact("approved")]
    })).toBe("content_approved");
  });

  it("returns ready_for_delivery with cohorts", () => {
    expect(deriveProjectStatus({
      ...empty,
      plans: [plan("locked")],
      artifacts: [artifact("approved")],
      cohorts: [cohort("draft")]
    })).toBe("ready_for_delivery");
  });

  it("returns in_delivery with active cohorts", () => {
    expect(deriveProjectStatus({
      ...empty,
      plans: [plan("locked")],
      artifacts: [artifact("approved")],
      cohorts: [cohort("active")]
    })).toBe("in_delivery");
  });

  it("returns completed when all cohorts completed", () => {
    expect(deriveProjectStatus({
      ...empty,
      plans: [plan("locked")],
      artifacts: [artifact("approved")],
      cohorts: [cohort("completed")]
    })).toBe("completed");
  });
});

describe("getStatusLabel", () => {
  it("returns human-readable labels", () => {
    expect(getStatusLabel("draft")).toBe("Draft");
    expect(getStatusLabel("in_delivery")).toBe("In Delivery");
    expect(getStatusLabel("completed")).toBe("Completed");
  });
});
