import type {
  ContentArtifact,
  Cohort,
  ProgramPlan,
  ProjectStatus,
  SourceDocument
} from "./training-projects";

export type ProjectStateInputs = {
  sources: SourceDocument[];
  plans: ProgramPlan[];
  artifacts: ContentArtifact[];
  cohorts: Cohort[];
};

export function deriveProjectStatus(inputs: ProjectStateInputs): ProjectStatus {
  const { sources, plans, artifacts, cohorts } = inputs;

  const activeSources = sources.filter((s) => s.isActiveForGeneration);
  const lockedPlan = plans.find((p) => p.status === "locked");
  const approvedPlan = plans.find((p) => p.status === "approved");
  const reviewPlan = plans.find((p) => p.status === "in_review" || p.status === "changes_requested");
  const approvedArtifacts = artifacts.filter((a) => a.status === "approved");
  const activeCohorts = cohorts.filter((c) => c.status === "active");
  const completedCohorts = cohorts.filter((c) => c.status === "completed");

  if (completedCohorts.length > 0 && activeCohorts.length === 0) {
    return "completed";
  }

  if (activeCohorts.length > 0) {
    return "in_delivery";
  }

  if (lockedPlan && approvedArtifacts.length > 0 && cohorts.length > 0) {
    return "ready_for_delivery";
  }

  if (lockedPlan && approvedArtifacts.length > 0) {
    return "content_approved";
  }

  if (lockedPlan && artifacts.length > 0) {
    return "content_generating";
  }

  if (lockedPlan || approvedPlan) {
    return "plan_approved";
  }

  if (reviewPlan) {
    return "plan_in_review";
  }

  if (plans.length > 0) {
    return "plan_generated";
  }

  if (activeSources.length > 0) {
    return "sources_added";
  }

  return "draft";
}

export function getStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    draft: "Draft",
    sources_added: "Sources Added",
    plan_generated: "Plan Generated",
    plan_in_review: "Plan In Review",
    plan_approved: "Plan Approved",
    content_generating: "Content In Progress",
    content_approved: "Content Approved",
    ready_for_delivery: "Ready for Delivery",
    in_delivery: "In Delivery",
    completed: "Completed"
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: ProjectStatus): string {
  switch (status) {
    case "draft":
    case "sources_added":
      return "neutral";
    case "plan_generated":
    case "plan_in_review":
      return "info";
    case "plan_approved":
    case "content_generating":
    case "content_approved":
      return "warning";
    case "ready_for_delivery":
    case "in_delivery":
      return "success";
    case "completed":
      return "complete";
    default:
      return "neutral";
  }
}
