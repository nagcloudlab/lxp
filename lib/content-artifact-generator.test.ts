import { describe, expect, it } from "vitest";
import { generateContentArtifacts } from "./content-artifact-generator";
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
  extractedText: "AI prompting, confidential data, practical hands-on tasks.",
  createdAt: "2026-05-28T00:00:00.000Z"
};

describe("generateContentArtifacts", () => {
  it("creates the full MVP content package from a plan", () => {
    const plan = {
      ...generateProgramPlan({
        project,
        activeSources: [source],
        versionNumber: 1
      }),
      status: "locked" as const
    };

    const artifacts = generateContentArtifacts({
      projectId: project.id,
      plan
    });

    expect(artifacts).toHaveLength(7);
    expect(artifacts.map((artifact) => artifact.artifactType)).toEqual([
      "slide_outline",
      "facilitator_notes",
      "learner_handout",
      "exercise",
      "quiz_bank",
      "practical_task",
      "rubric"
    ]);
    expect(artifacts[0].status).toBe("draft");
    expect(artifacts[0].generationMetadata.generationType).toBe(
      "content_artifact"
    );
    expect(artifacts[0].sourceDocumentIds).toEqual([source.id]);
  });
});

