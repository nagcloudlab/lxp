import { describe, expect, it } from "vitest";
import { generateContentArtifacts } from "./content-artifact-generator";
import { generateProgramPlan } from "./program-plan-generator";
import {
  buildProgramPackageExport,
  createProgramPackageFilename
} from "./program-package-exporter";
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

describe("program package exporter", () => {
  it("exports locked plan with approved artifacts only", () => {
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
    }).map((artifact, index) => ({
      ...artifact,
      status: index === 0 ? ("approved" as const) : artifact.status,
      approvedAt: index === 0 ? "2026-05-28T00:00:00.000Z" : undefined
    }));

    const programPackage = buildProgramPackageExport({
      project,
      lockedPlan,
      artifacts
    });

    expect(programPackage.packageType).toBe("b2b_program_package");
    expect(programPackage.lockedPlan.id).toBe(lockedPlan.id);
    expect(programPackage.approvedArtifacts).toHaveLength(1);
    expect(programPackage.approvedArtifacts[0].artifactType).toBe("slide_outline");
    expect(programPackage.readiness.isReadyForDelivery).toBe(false);
    expect(programPackage.readiness.missingArtifactTypes).toContain("rubric");
  });

  it("creates a stable json filename", () => {
    expect(createProgramPackageFilename(project.name)).toBe(
      "ai-tools-for-business-productivity-b2b-package.json"
    );
  });
});

