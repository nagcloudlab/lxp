import { describe, expect, it } from "vitest";
import { generateProgramPlan } from "./program-plan-generator";
import type { SourceDocument, TrainingProject } from "./training-projects";

const project: TrainingProject = {
  id: "project_1",
  name: "AI Tools for Business Productivity",
  businessGoal: "Help teams use AI safely and effectively.",
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
  extractedText:
    "AI prompting, confidential data, practical hands-on tasks, 3 hours and 6 hours duration conflict.",
  createdAt: "2026-05-28T00:00:00.000Z"
};

describe("generateProgramPlan", () => {
  it("creates a source-backed draft program plan", () => {
    const plan = generateProgramPlan({
      project,
      activeSources: [source],
      versionNumber: 1
    });

    expect(plan.status).toBe("draft");
    expect(plan.sourceDocumentIds).toEqual([source.id]);
    expect(plan.generationMetadata.modelProvider).toBe("deterministic_stub");
    expect(plan.requirementSummary).toMatch(/safe usage/i);
    expect(plan.learnerRoles).toHaveLength(2);
    expect(plan.modules.length).toBeGreaterThan(0);
    expect(plan.conflicts[0]?.text).toMatch(/duration conflict/i);
    expect(plan.assessmentBlueprint.practicalTaskStrategy).toMatch(/workplace task/i);
  });
});

