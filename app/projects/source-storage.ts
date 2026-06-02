"use client";

import {
  getSourceStorageKey,
  type SourceDocument
} from "@/lib/training-projects";

export function loadSourceDocuments(projectId: string): SourceDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getSourceStorageKey(projectId));

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

export function saveSourceDocuments(
  projectId: string,
  sources: SourceDocument[]
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getSourceStorageKey(projectId),
    JSON.stringify(sources)
  );
}

