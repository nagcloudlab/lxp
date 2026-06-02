import type {
  ContentArtifact,
  ContentArtifactType,
  ProgramPlan,
  TrainingProject
} from "./training-projects";

export type ProgramPackageExport = {
  packageType: "b2b_program_package";
  schemaVersion: "1.0.0";
  exportedAt: string;
  project: {
    id: string;
    name: string;
    businessGoal: string;
    targetDepartment: string;
    expectedLearnerCount: number;
    targetCompletionDate: string;
    assignedSme: string;
  };
  lockedPlan: {
    id: string;
    versionNumber: number;
    title: string;
    requirementSummary: string;
    learnerRoles: ProgramPlan["learnerRoles"];
    modules: ProgramPlan["modules"];
    assessmentBlueprint: ProgramPlan["assessmentBlueprint"];
    sourceDocumentIds: string[];
  };
  approvedArtifacts: Array<{
    id: string;
    artifactType: ContentArtifactType;
    title: string;
    contentBody: string;
    approvedAt?: string;
    sourceDocumentIds: string[];
    promptTemplateId: string;
    promptVersion: string;
  }>;
  readiness: {
    requiredArtifactCount: number;
    approvedArtifactCount: number;
    missingArtifactTypes: ContentArtifactType[];
    isReadyForDelivery: boolean;
    summary: string;
  };
};

const requiredArtifactTypes: ContentArtifactType[] = [
  "slide_outline",
  "facilitator_notes",
  "learner_handout",
  "exercise",
  "quiz_bank",
  "practical_task",
  "rubric"
];

export function buildProgramPackageExport(input: {
  project: TrainingProject;
  lockedPlan: ProgramPlan;
  artifacts: ContentArtifact[];
}): ProgramPackageExport {
  const approvedArtifacts = input.artifacts.filter(
    (artifact) =>
      artifact.planId === input.lockedPlan.id && artifact.status === "approved"
  );
  const approvedTypes = new Set(
    approvedArtifacts.map((artifact) => artifact.artifactType)
  );
  const missingArtifactTypes = requiredArtifactTypes.filter(
    (artifactType) => !approvedTypes.has(artifactType)
  );
  const isReadyForDelivery = missingArtifactTypes.length === 0;

  return {
    packageType: "b2b_program_package",
    schemaVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    project: {
      id: input.project.id,
      name: input.project.name,
      businessGoal: input.project.businessGoal,
      targetDepartment: input.project.targetDepartment,
      expectedLearnerCount: input.project.expectedLearnerCount,
      targetCompletionDate: input.project.targetCompletionDate,
      assignedSme: input.project.assignedSme
    },
    lockedPlan: {
      id: input.lockedPlan.id,
      versionNumber: input.lockedPlan.versionNumber,
      title: input.lockedPlan.title,
      requirementSummary: input.lockedPlan.requirementSummary,
      learnerRoles: input.lockedPlan.learnerRoles,
      modules: input.lockedPlan.modules,
      assessmentBlueprint: input.lockedPlan.assessmentBlueprint,
      sourceDocumentIds: input.lockedPlan.sourceDocumentIds
    },
    approvedArtifacts: approvedArtifacts.map((artifact) => ({
      id: artifact.id,
      artifactType: artifact.artifactType,
      title: artifact.title,
      contentBody: artifact.contentBody,
      approvedAt: artifact.approvedAt,
      sourceDocumentIds: artifact.sourceDocumentIds,
      promptTemplateId: artifact.generationMetadata.promptTemplateId,
      promptVersion: artifact.generationMetadata.promptVersion
    })),
    readiness: {
      requiredArtifactCount: requiredArtifactTypes.length,
      approvedArtifactCount: approvedArtifacts.length,
      missingArtifactTypes,
      isReadyForDelivery,
      summary: isReadyForDelivery
        ? "All required artifacts are approved. The B2B program package is ready for delivery preparation."
        : `Package is missing ${missingArtifactTypes.length} approved artifact(s).`
    }
  };
}

export function createProgramPackageFilename(projectName: string) {
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "program"}-b2b-package.json`;
}

