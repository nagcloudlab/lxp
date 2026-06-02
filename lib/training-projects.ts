export type ProjectStatus = "draft";
export type SourceType = "txt" | "md" | "pdf" | "docx" | "unsupported";
export type SourceExtractionStatus = "ready" | "extracting" | "extracted" | "failed";
export type ReviewStatus = "draft" | "in_review" | "changes_requested" | "approved" | "locked";
export type RiskLevel = "low" | "medium" | "high";
export type GenerationType = "program_plan" | "content_artifact";
export type ContentArtifactType =
  | "slide_outline"
  | "facilitator_notes"
  | "learner_handout"
  | "exercise"
  | "quiz_bank"
  | "practical_task"
  | "rubric";
export type CohortStatus = "draft" | "active" | "completed";
export type EnrollmentStatus = "enrolled" | "active" | "completed";
export type ProgressEventType =
  | "module_started"
  | "module_completed"
  | "quiz_completed"
  | "help_requested";
export type SMEAlertStatus = "open" | "acknowledged" | "resolved" | "dismissed";

export type AuditEventType =
  | "project_created"
  | "source_uploaded"
  | "source_extracted"
  | "source_extraction_failed"
  | "plan_generated"
  | "plan_status_changed"
  | "artifact_generated"
  | "artifact_status_changed"
  | "comment_added"
  | "comment_resolved"
  | "comment_dismissed"
  | "cohort_created"
  | "enrollment_created"
  | "package_exported"
  | "report_exported";

export type AuditEvent = {
  id: string;
  projectId: string;
  eventType: AuditEventType;
  actor: string;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  details?: Record<string, string | number | boolean>;
  createdAt: string;
};

export type ReviewCommentTargetType =
  | "plan"
  | "module"
  | "topic"
  | "assumption"
  | "conflict"
  | "assessment_blueprint"
  | "artifact";

export type ReviewCommentStatus = "open" | "resolved" | "dismissed";

export type ReviewComment = {
  id: string;
  projectId: string;
  targetType: ReviewCommentTargetType;
  targetId: string;
  targetLabel: string;
  authorRole: "sme" | "ld_admin";
  authorName: string;
  body: string;
  status: ReviewCommentStatus;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
};

export type TrainingProject = {
  id: string;
  name: string;
  businessGoal: string;
  targetDepartment: string;
  expectedLearnerCount: number;
  targetCompletionDate: string;
  learnerRoles: string;
  assignedSme: string;
  status: ProjectStatus;
  createdAt: string;
};

export type NewTrainingProjectInput = Omit<
  TrainingProject,
  "id" | "status" | "createdAt"
>;

export const projectStorageKey = "lxp.trainingProjects.v1";

export type SourceDocument = {
  id: string;
  projectId: string;
  filename: string;
  sourceType: SourceType;
  extractionStatus: SourceExtractionStatus;
  isActiveForGeneration: boolean;
  extractedText: string;
  extractionError?: string;
  createdAt: string;
};

export type GenerationMetadata = {
  id: string;
  projectId: string;
  generationType: GenerationType;
  promptTemplateId: string;
  promptVersion: string;
  modelProvider: "deterministic_stub";
  modelName: string;
  inputSourceIds: string[];
  outputSchemaVersion: string;
  generatedAt: string;
};

export type Assumption = {
  id: string;
  text: string;
  severity: RiskLevel;
  status: "open" | "confirmed" | "rejected" | "resolved";
  sourceDocumentIds: string[];
};

export type Conflict = {
  id: string;
  text: string;
  severity: RiskLevel;
  status: "open" | "resolved" | "ignored";
  conflictingSourceDocumentIds: string[];
};

export type LearnerRoleTrack = {
  id: string;
  name: string;
  description: string;
  expectedStartingSkill: string;
  targetOutcome: string;
};

export type ProgramTopic = {
  id: string;
  title: string;
  description: string;
  sequenceNumber: number;
  prerequisiteTopicIds: string[];
  roleRelevance: string[];
  estimatedMinutes: number;
};

export type ProgramModule = {
  id: string;
  title: string;
  description: string;
  sequenceNumber: number;
  estimatedMinutes: number;
  riskLevel: RiskLevel;
  learningOutcomes: string[];
  topics: ProgramTopic[];
};

export type AssessmentBlueprint = {
  id: string;
  status: ReviewStatus;
  quizStrategy: string;
  practicalTaskStrategy: string;
  rubricStrategy: string;
  passCriteria: string;
};

export type ProgramPlan = {
  id: string;
  projectId: string;
  versionNumber: number;
  title: string;
  status: ReviewStatus;
  sourceDocumentIds: string[];
  generationMetadata: GenerationMetadata;
  requirementSummary: string;
  businessContext: string;
  targetAudience: string;
  assumptions: Assumption[];
  conflicts: Conflict[];
  learnerRoles: LearnerRoleTrack[];
  modules: ProgramModule[];
  assessmentBlueprint: AssessmentBlueprint;
  createdAt: string;
};

export type ContentArtifact = {
  id: string;
  projectId: string;
  planId: string;
  artifactType: ContentArtifactType;
  title: string;
  contentBody: string;
  status: ReviewStatus;
  sourceDocumentIds: string[];
  generationMetadata: GenerationMetadata;
  approvedAt?: string;
  createdAt: string;
};

export type Cohort = {
  id: string;
  projectId: string;
  planId: string;
  name: string;
  status: CohortStatus;
  startDate: string;
  endDate: string;
  instructorName: string;
  createdAt: string;
};

export type Enrollment = {
  id: string;
  projectId: string;
  cohortId: string;
  learnerName: string;
  learnerEmail: string;
  learnerRoleId: string;
  learnerRoleName: string;
  status: EnrollmentStatus;
  enrolledAt: string;
};

export type ProgressEvent = {
  id: string;
  projectId: string;
  cohortId: string;
  enrollmentId: string;
  moduleId?: string;
  eventType: ProgressEventType;
  eventData?: Record<string, string | number | boolean>;
  createdAt: string;
};

export type QuizAttempt = {
  id: string;
  projectId: string;
  cohortId: string;
  enrollmentId: string;
  moduleId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  submittedAt: string;
};

export type SMEAlert = {
  id: string;
  projectId: string;
  cohortId: string;
  enrollmentId: string;
  moduleId?: string;
  triggerReason: "quiz_failed_twice" | "help_requested";
  evidence: string;
  recommendedAction: string;
  status: SMEAlertStatus;
  resolverNotes?: string;
  createdAt: string;
  resolvedAt?: string;
};

export function createProjectId() {
  return `project_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createSourceId() {
  return `source_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createPlanId() {
  return `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createGeneratedId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getSourceStorageKey(projectId: string) {
  return `lxp.projectSources.${projectId}.v1`;
}

export function getProgramPlanStorageKey(projectId: string) {
  return `lxp.programPlans.${projectId}.v1`;
}

export function getContentArtifactStorageKey(projectId: string) {
  return `lxp.contentArtifacts.${projectId}.v1`;
}

export function getDeliveryStorageKey(projectId: string) {
  return `lxp.delivery.${projectId}.v1`;
}

export function getReviewCommentsStorageKey(projectId: string) {
  return `lxp.reviewComments.${projectId}.v1`;
}

export function getAuditLogStorageKey(projectId: string) {
  return `lxp.auditLog.${projectId}.v1`;
}

export function getSourceType(filename: string): SourceType {
  const extension = filename.split(".").pop()?.toLowerCase();

  if (extension === "txt") {
    return "txt";
  }

  if (extension === "md") {
    return "md";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  if (extension === "docx") {
    return "docx";
  }

  return "unsupported";
}

export function createSourceDocument(input: {
  projectId: string;
  filename: string;
  sourceType: SourceType;
  extractedText: string;
  extractionStatus?: SourceExtractionStatus;
  extractionError?: string;
}): SourceDocument {
  return {
    id: createSourceId(),
    projectId: input.projectId,
    filename: input.filename,
    sourceType: input.sourceType,
    extractionStatus: input.extractionStatus ?? "extracted",
    isActiveForGeneration:
      input.extractionStatus !== "failed" && Boolean(input.extractedText.trim()),
    extractedText: input.extractedText,
    extractionError: input.extractionError,
    createdAt: new Date().toISOString()
  };
}

export function createTrainingProject(
  input: NewTrainingProjectInput
): TrainingProject {
  return {
    ...input,
    id: createProjectId(),
    status: "draft",
    createdAt: new Date().toISOString()
  };
}

export function validateProjectInput(input: NewTrainingProjectInput) {
  const errors: Partial<Record<keyof NewTrainingProjectInput, string>> = {};

  if (!input.name.trim()) {
    errors.name = "Program name is required.";
  }

  if (!input.businessGoal.trim()) {
    errors.businessGoal = "Business goal is required.";
  }

  if (!input.targetDepartment.trim()) {
    errors.targetDepartment = "Target department is required.";
  }

  if (!Number.isFinite(input.expectedLearnerCount) || input.expectedLearnerCount < 1) {
    errors.expectedLearnerCount = "Expected learner count must be at least 1.";
  }

  if (!input.targetCompletionDate) {
    errors.targetCompletionDate = "Target completion date is required.";
  }

  if (!input.learnerRoles.trim()) {
    errors.learnerRoles = "At least one learner role is required.";
  }

  if (!input.assignedSme.trim()) {
    errors.assignedSme = "Assigned SME is required.";
  }

  return errors;
}

export function hasProjectInputErrors(input: NewTrainingProjectInput) {
  return Object.keys(validateProjectInput(input)).length > 0;
}
