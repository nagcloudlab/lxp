import type {
  AuditEvent,
  Cohort,
  ContentArtifact,
  Enrollment,
  ProgramPlan,
  ProgressEvent,
  QuizAttempt,
  ReviewComment,
  SMEAlert,
  SourceDocument,
  TrainingProject
} from "./training-projects";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function post(url: string, body: unknown) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function patch(url: string, body: unknown) {
  return fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

// --- Projects ---

export async function fetchProjects(): Promise<TrainingProject[]> {
  return json(await fetch("/api/projects"));
}

export async function apiCreateProject(
  project: TrainingProject
): Promise<TrainingProject> {
  return json(await post("/api/projects", project));
}

// --- Sources ---

export async function fetchSources(
  projectId: string
): Promise<SourceDocument[]> {
  return json(await fetch(`/api/projects/${projectId}/sources`));
}

export async function apiCreateSource(
  projectId: string,
  source: SourceDocument
): Promise<SourceDocument> {
  return json(await post(`/api/projects/${projectId}/sources`, source));
}

export async function apiUpdateSource(
  projectId: string,
  sourceId: string,
  data: Partial<SourceDocument>
): Promise<SourceDocument> {
  return json(
    await patch(`/api/projects/${projectId}/sources/${sourceId}`, data)
  );
}

// --- Plans ---

export async function fetchPlans(projectId: string): Promise<ProgramPlan[]> {
  return json(await fetch(`/api/projects/${projectId}/plans`));
}

export async function apiCreatePlan(
  projectId: string,
  plan: ProgramPlan
): Promise<ProgramPlan> {
  return json(await post(`/api/projects/${projectId}/plans`, plan));
}

export async function apiUpdatePlan(
  projectId: string,
  planId: string,
  data: Partial<ProgramPlan>
): Promise<ProgramPlan> {
  return json(
    await patch(`/api/projects/${projectId}/plans/${planId}`, data)
  );
}

// --- Artifacts ---

export async function fetchArtifacts(
  projectId: string
): Promise<ContentArtifact[]> {
  return json(await fetch(`/api/projects/${projectId}/artifacts`));
}

export async function apiCreateArtifact(
  projectId: string,
  artifact: ContentArtifact
): Promise<ContentArtifact> {
  return json(await post(`/api/projects/${projectId}/artifacts`, artifact));
}

export async function apiUpdateArtifact(
  projectId: string,
  artifactId: string,
  data: Partial<ContentArtifact>
): Promise<ContentArtifact> {
  return json(
    await patch(`/api/projects/${projectId}/artifacts/${artifactId}`, data)
  );
}

// --- Delivery ---

export type DeliveryState = {
  cohorts: Cohort[];
  enrollments: Enrollment[];
  progressEvents: ProgressEvent[];
  quizAttempts: QuizAttempt[];
  smeAlerts: SMEAlert[];
};

export async function fetchDeliveryState(
  projectId: string
): Promise<DeliveryState> {
  return json(await fetch(`/api/projects/${projectId}/delivery`));
}

export async function apiCreateCohort(
  projectId: string,
  cohort: Cohort
): Promise<Cohort> {
  return json(await post(`/api/projects/${projectId}/delivery/cohorts`, cohort));
}

export async function apiCreateEnrollment(
  projectId: string,
  enrollment: Enrollment
): Promise<Enrollment> {
  return json(
    await post(`/api/projects/${projectId}/delivery/enrollments`, enrollment)
  );
}

export async function apiCreateProgressEvent(
  projectId: string,
  event: ProgressEvent
): Promise<ProgressEvent> {
  return json(
    await post(`/api/projects/${projectId}/delivery/progress`, event)
  );
}

export async function apiCreateQuizAttempt(
  projectId: string,
  attempt: QuizAttempt
): Promise<QuizAttempt> {
  return json(
    await post(`/api/projects/${projectId}/delivery/quiz-attempts`, attempt)
  );
}

export async function apiCreateSMEAlert(
  projectId: string,
  alert: SMEAlert
): Promise<SMEAlert> {
  return json(
    await post(`/api/projects/${projectId}/delivery/sme-alerts`, alert)
  );
}

// --- Comments ---

export async function fetchComments(
  projectId: string
): Promise<ReviewComment[]> {
  return json(await fetch(`/api/projects/${projectId}/comments`));
}

export async function apiCreateComment(
  projectId: string,
  comment: ReviewComment
): Promise<ReviewComment> {
  return json(await post(`/api/projects/${projectId}/comments`, comment));
}

export async function apiUpdateComment(
  projectId: string,
  commentId: string,
  data: Partial<ReviewComment>
): Promise<ReviewComment> {
  return json(
    await patch(`/api/projects/${projectId}/comments/${commentId}`, data)
  );
}

// --- Audit ---

export async function fetchAuditLog(
  projectId: string
): Promise<AuditEvent[]> {
  return json(await fetch(`/api/projects/${projectId}/audit`));
}

export async function apiCreateAuditEvent(
  projectId: string,
  event: AuditEvent
): Promise<AuditEvent> {
  return json(await post(`/api/projects/${projectId}/audit`, event));
}
