"use client";

import {
  getProgramPlanStorageKey,
  type ProgramPlan
} from "@/lib/training-projects";

export function loadProgramPlans(projectId: string): ProgramPlan[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getProgramPlanStorageKey(projectId));

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

export function saveProgramPlans(projectId: string, plans: ProgramPlan[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getProgramPlanStorageKey(projectId),
    JSON.stringify(plans)
  );
}

