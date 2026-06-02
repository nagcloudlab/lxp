"use client";

import {
  getReviewCommentsStorageKey,
  type ReviewComment
} from "@/lib/training-projects";

export function loadReviewComments(projectId: string): ReviewComment[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(
    getReviewCommentsStorageKey(projectId)
  );

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

export function saveReviewComments(
  projectId: string,
  comments: ReviewComment[]
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getReviewCommentsStorageKey(projectId),
    JSON.stringify(comments)
  );
}
