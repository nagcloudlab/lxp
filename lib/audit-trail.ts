import type { AuditEvent, AuditEventType } from "./training-projects";
import { createGeneratedId } from "./training-projects";

export type NewAuditEventInput = {
  projectId: string;
  eventType: AuditEventType;
  actor: string;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  details?: Record<string, string | number | boolean>;
};

export function createAuditEvent(input: NewAuditEventInput): AuditEvent {
  return {
    id: createGeneratedId("audit"),
    projectId: input.projectId,
    eventType: input.eventType,
    actor: input.actor,
    targetType: input.targetType,
    targetId: input.targetId,
    targetLabel: input.targetLabel,
    details: input.details,
    createdAt: new Date().toISOString()
  };
}

export function filterAuditByType(
  events: AuditEvent[],
  eventType: AuditEventType
): AuditEvent[] {
  return events.filter((e) => e.eventType === eventType);
}

export function filterAuditByTarget(
  events: AuditEvent[],
  targetId: string
): AuditEvent[] {
  return events.filter((e) => e.targetId === targetId);
}

export function formatAuditEventLabel(event: AuditEvent): string {
  const labels: Record<AuditEventType, string> = {
    project_created: "Project created",
    source_uploaded: "Source uploaded",
    source_extracted: "Source extracted",
    source_extraction_failed: "Source extraction failed",
    plan_generated: "Program plan generated",
    plan_status_changed: "Plan status changed",
    artifact_generated: "Content artifact generated",
    artifact_status_changed: "Artifact status changed",
    comment_added: "Review comment added",
    comment_resolved: "Review comment resolved",
    comment_dismissed: "Review comment dismissed",
    cohort_created: "Cohort created",
    enrollment_created: "Learner enrolled",
    package_exported: "Program package exported",
    report_exported: "B2B report exported"
  };

  return labels[event.eventType] ?? event.eventType;
}
