import { describe, it, expect } from "vitest";
import {
  hasPermission,
  getPermissions,
  getRoleLabel,
  getDefaultUsers
} from "./auth";
import type { UserRole, Permission } from "./auth";

describe("hasPermission", () => {
  it("ld_admin can create projects", () => {
    expect(hasPermission("ld_admin", "create_project")).toBe(true);
  });

  it("ld_admin can approve TOC (also acts as SME in MVP)", () => {
    expect(hasPermission("ld_admin", "approve_toc")).toBe(true);
  });

  it("sme can approve TOC and artifacts", () => {
    expect(hasPermission("sme", "approve_toc")).toBe(true);
    expect(hasPermission("sme", "approve_artifacts")).toBe(true);
  });

  it("sme cannot create projects or cohorts", () => {
    expect(hasPermission("sme", "create_project")).toBe(false);
    expect(hasPermission("sme", "create_cohort")).toBe(false);
  });

  it("instructor can view learner content and resolve alerts", () => {
    expect(hasPermission("instructor", "view_learner_content")).toBe(true);
    expect(hasPermission("instructor", "resolve_alert")).toBe(true);
  });

  it("instructor cannot approve content or create projects", () => {
    expect(hasPermission("instructor", "approve_toc")).toBe(false);
    expect(hasPermission("instructor", "approve_artifacts")).toBe(false);
    expect(hasPermission("instructor", "create_project")).toBe(false);
  });

  it("learner can only view learner content", () => {
    expect(hasPermission("learner", "view_learner_content")).toBe(true);
    expect(hasPermission("learner", "create_project")).toBe(false);
    expect(hasPermission("learner", "comment_on_plan")).toBe(false);
    expect(hasPermission("learner", "approve_toc")).toBe(false);
    expect(hasPermission("learner", "export_reports")).toBe(false);
  });

  it("manager can view and export reports only", () => {
    expect(hasPermission("manager", "view_reports")).toBe(true);
    expect(hasPermission("manager", "export_reports")).toBe(true);
    expect(hasPermission("manager", "create_project")).toBe(false);
    expect(hasPermission("manager", "approve_toc")).toBe(false);
    expect(hasPermission("manager", "upload_source")).toBe(false);
  });
});

describe("getPermissions", () => {
  it("returns all permissions for a role", () => {
    const adminPerms = getPermissions("ld_admin");
    expect(adminPerms).toContain("create_project");
    expect(adminPerms).toContain("upload_source");
    expect(adminPerms.length).toBeGreaterThan(5);
  });

  it("learner has minimal permissions", () => {
    expect(getPermissions("learner")).toEqual(["view_learner_content"]);
  });
});

describe("getRoleLabel", () => {
  it("returns human-readable labels", () => {
    expect(getRoleLabel("ld_admin")).toBe("L&D Admin");
    expect(getRoleLabel("sme")).toBe("Subject Matter Expert");
    expect(getRoleLabel("learner")).toBe("Learner");
  });
});

describe("getDefaultUsers", () => {
  it("returns 5 demo users with distinct roles", () => {
    const users = getDefaultUsers();
    expect(users).toHaveLength(5);
    const roles = new Set(users.map((u) => u.role));
    expect(roles.size).toBe(5);
  });
});
