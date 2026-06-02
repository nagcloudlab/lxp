import type {
  ReviewComment,
  ReviewCommentTargetType,
  ReviewCommentStatus
} from "./training-projects";
import { createGeneratedId } from "./training-projects";

export type NewReviewCommentInput = {
  projectId: string;
  targetType: ReviewCommentTargetType;
  targetId: string;
  targetLabel: string;
  authorRole: "sme" | "ld_admin";
  authorName: string;
  body: string;
};

export function createReviewComment(
  input: NewReviewCommentInput
): ReviewComment {
  return {
    id: createGeneratedId("comment"),
    projectId: input.projectId,
    targetType: input.targetType,
    targetId: input.targetId,
    targetLabel: input.targetLabel,
    authorRole: input.authorRole,
    authorName: input.authorName,
    body: input.body,
    status: "open",
    createdAt: new Date().toISOString()
  };
}

export function resolveComment(
  comment: ReviewComment,
  resolvedBy: string
): ReviewComment {
  return {
    ...comment,
    status: "resolved",
    resolvedBy,
    resolvedAt: new Date().toISOString()
  };
}

export function dismissComment(
  comment: ReviewComment,
  dismissedBy: string
): ReviewComment {
  return {
    ...comment,
    status: "dismissed",
    resolvedBy: dismissedBy,
    resolvedAt: new Date().toISOString()
  };
}

export function filterCommentsByTarget(
  comments: ReviewComment[],
  targetType: ReviewCommentTargetType,
  targetId: string
): ReviewComment[] {
  return comments.filter(
    (c) => c.targetType === targetType && c.targetId === targetId
  );
}

export function filterCommentsByStatus(
  comments: ReviewComment[],
  status: ReviewCommentStatus
): ReviewComment[] {
  return comments.filter((c) => c.status === status);
}

export function countOpenComments(comments: ReviewComment[]): number {
  return comments.filter((c) => c.status === "open").length;
}

export function validateCommentInput(
  input: NewReviewCommentInput
): Partial<Record<keyof NewReviewCommentInput, string>> {
  const errors: Partial<Record<keyof NewReviewCommentInput, string>> = {};

  if (!input.body.trim()) {
    errors.body = "Comment body is required.";
  }

  if (!input.authorName.trim()) {
    errors.authorName = "Author name is required.";
  }

  if (!input.targetId.trim()) {
    errors.targetId = "Target is required.";
  }

  return errors;
}
