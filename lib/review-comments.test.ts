import { describe, it, expect } from "vitest";
import {
  createReviewComment,
  resolveComment,
  dismissComment,
  filterCommentsByTarget,
  filterCommentsByStatus,
  countOpenComments,
  validateCommentInput,
  type NewReviewCommentInput
} from "./review-comments";

const baseInput: NewReviewCommentInput = {
  projectId: "project_1",
  targetType: "module",
  targetId: "mod_1",
  targetLabel: "Module 1: Intro",
  authorRole: "sme",
  authorName: "Dr. Smith",
  body: "This module needs more detail on compliance."
};

describe("createReviewComment", () => {
  it("creates a comment with open status", () => {
    const comment = createReviewComment(baseInput);
    expect(comment.id).toMatch(/^comment_/);
    expect(comment.status).toBe("open");
    expect(comment.body).toBe(baseInput.body);
    expect(comment.authorRole).toBe("sme");
    expect(comment.targetType).toBe("module");
    expect(comment.targetId).toBe("mod_1");
    expect(comment.resolvedBy).toBeUndefined();
  });
});

describe("resolveComment", () => {
  it("sets status to resolved with resolver info", () => {
    const comment = createReviewComment(baseInput);
    const resolved = resolveComment(comment, "Admin Jane");
    expect(resolved.status).toBe("resolved");
    expect(resolved.resolvedBy).toBe("Admin Jane");
    expect(resolved.resolvedAt).toBeDefined();
    expect(resolved.body).toBe(comment.body);
  });
});

describe("dismissComment", () => {
  it("sets status to dismissed", () => {
    const comment = createReviewComment(baseInput);
    const dismissed = dismissComment(comment, "Admin Jane");
    expect(dismissed.status).toBe("dismissed");
    expect(dismissed.resolvedBy).toBe("Admin Jane");
  });
});

describe("filterCommentsByTarget", () => {
  it("returns only comments matching target type and id", () => {
    const c1 = createReviewComment(baseInput);
    const c2 = createReviewComment({ ...baseInput, targetType: "plan", targetId: "plan_1", targetLabel: "Plan v1" });
    const c3 = createReviewComment({ ...baseInput, targetId: "mod_2", targetLabel: "Module 2" });

    const result = filterCommentsByTarget([c1, c2, c3], "module", "mod_1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(c1.id);
  });
});

describe("filterCommentsByStatus", () => {
  it("filters by status", () => {
    const c1 = createReviewComment(baseInput);
    const c2 = resolveComment(createReviewComment(baseInput), "Admin");
    const c3 = createReviewComment(baseInput);

    const open = filterCommentsByStatus([c1, c2, c3], "open");
    expect(open).toHaveLength(2);

    const resolved = filterCommentsByStatus([c1, c2, c3], "resolved");
    expect(resolved).toHaveLength(1);
  });
});

describe("countOpenComments", () => {
  it("counts only open comments", () => {
    const c1 = createReviewComment(baseInput);
    const c2 = resolveComment(createReviewComment(baseInput), "Admin");
    const c3 = dismissComment(createReviewComment(baseInput), "Admin");
    const c4 = createReviewComment(baseInput);

    expect(countOpenComments([c1, c2, c3, c4])).toBe(2);
  });
});

describe("validateCommentInput", () => {
  it("returns no errors for valid input", () => {
    expect(validateCommentInput(baseInput)).toEqual({});
  });

  it("requires body", () => {
    const errors = validateCommentInput({ ...baseInput, body: "  " });
    expect(errors.body).toBeDefined();
  });

  it("requires author name", () => {
    const errors = validateCommentInput({ ...baseInput, authorName: "" });
    expect(errors.authorName).toBeDefined();
  });

  it("requires target id", () => {
    const errors = validateCommentInput({ ...baseInput, targetId: "" });
    expect(errors.targetId).toBeDefined();
  });
});
