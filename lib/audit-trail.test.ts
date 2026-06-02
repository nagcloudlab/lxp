import { describe, it, expect } from "vitest";
import {
  createAuditEvent,
  filterAuditByType,
  filterAuditByTarget,
  formatAuditEventLabel
} from "./audit-trail";

describe("createAuditEvent", () => {
  it("creates an event with all fields", () => {
    const event = createAuditEvent({
      projectId: "project_1",
      eventType: "plan_generated",
      actor: "L&D Admin",
      targetType: "plan",
      targetId: "plan_1",
      targetLabel: "Plan v1",
      details: { provider: "ollama", model: "llama3.2" }
    });
    expect(event.id).toMatch(/^audit_/);
    expect(event.eventType).toBe("plan_generated");
    expect(event.actor).toBe("L&D Admin");
    expect(event.targetId).toBe("plan_1");
    expect(event.details?.provider).toBe("ollama");
    expect(event.createdAt).toBeDefined();
  });

  it("works without optional fields", () => {
    const event = createAuditEvent({
      projectId: "project_1",
      eventType: "project_created",
      actor: "Admin"
    });
    expect(event.targetType).toBeUndefined();
    expect(event.details).toBeUndefined();
  });
});

describe("filterAuditByType", () => {
  it("filters events by type", () => {
    const events = [
      createAuditEvent({ projectId: "p1", eventType: "plan_generated", actor: "A" }),
      createAuditEvent({ projectId: "p1", eventType: "plan_status_changed", actor: "A" }),
      createAuditEvent({ projectId: "p1", eventType: "plan_generated", actor: "A" })
    ];
    expect(filterAuditByType(events, "plan_generated")).toHaveLength(2);
    expect(filterAuditByType(events, "plan_status_changed")).toHaveLength(1);
    expect(filterAuditByType(events, "project_created")).toHaveLength(0);
  });
});

describe("filterAuditByTarget", () => {
  it("filters events by target id", () => {
    const events = [
      createAuditEvent({ projectId: "p1", eventType: "plan_status_changed", actor: "A", targetId: "plan_1" }),
      createAuditEvent({ projectId: "p1", eventType: "plan_status_changed", actor: "A", targetId: "plan_2" }),
      createAuditEvent({ projectId: "p1", eventType: "artifact_status_changed", actor: "A", targetId: "plan_1" })
    ];
    expect(filterAuditByTarget(events, "plan_1")).toHaveLength(2);
    expect(filterAuditByTarget(events, "plan_2")).toHaveLength(1);
  });
});

describe("formatAuditEventLabel", () => {
  it("returns a human-readable label", () => {
    const event = createAuditEvent({
      projectId: "p1",
      eventType: "plan_generated",
      actor: "Admin"
    });
    expect(formatAuditEventLabel(event)).toBe("Program plan generated");
  });

  it("handles all known event types", () => {
    const types = [
      "project_created", "source_uploaded", "source_extracted",
      "source_extraction_failed", "plan_generated", "plan_status_changed",
      "artifact_generated", "artifact_status_changed", "comment_added",
      "comment_resolved", "comment_dismissed", "cohort_created",
      "enrollment_created", "package_exported", "report_exported"
    ] as const;
    for (const t of types) {
      const event = createAuditEvent({ projectId: "p1", eventType: t, actor: "A" });
      const label = formatAuditEventLabel(event);
      expect(label).not.toBe(t); // should be human-readable, not the raw key
    }
  });
});
