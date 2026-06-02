"use client";

import {
  getContentArtifactStorageKey,
  type ContentArtifact
} from "@/lib/training-projects";

export function loadContentArtifacts(projectId: string): ContentArtifact[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getContentArtifactStorageKey(projectId));

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

export function saveContentArtifacts(
  projectId: string,
  artifacts: ContentArtifact[]
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getContentArtifactStorageKey(projectId),
    JSON.stringify(artifacts)
  );
}

