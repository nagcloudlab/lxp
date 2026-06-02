"use client";

import {
  getAuditLogStorageKey,
  type AuditEvent
} from "@/lib/training-projects";

export function loadAuditLog(projectId: string): AuditEvent[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getAuditLogStorageKey(projectId));

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAuditLog(projectId: string, events: AuditEvent[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getAuditLogStorageKey(projectId),
    JSON.stringify(events)
  );
}
