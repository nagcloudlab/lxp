"use client";

import {
  projectStorageKey,
  type TrainingProject
} from "@/lib/training-projects";

export function loadTrainingProjects(): TrainingProject[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(projectStorageKey);

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

export function saveTrainingProjects(projects: TrainingProject[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(projectStorageKey, JSON.stringify(projects));
}
