export type UserRole = "ld_admin" | "sme" | "instructor" | "learner" | "manager";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Permission =
  | "create_project"
  | "upload_source"
  | "trigger_generation"
  | "comment_on_plan"
  | "approve_toc"
  | "lock_toc"
  | "generate_artifacts"
  | "approve_artifacts"
  | "create_cohort"
  | "enroll_learners"
  | "view_learner_content"
  | "evaluate_practical"
  | "resolve_alert"
  | "export_reports"
  | "view_reports"
  | "view_audit_log";

const permissionMatrix: Record<UserRole, Set<Permission>> = {
  ld_admin: new Set([
    "create_project",
    "upload_source",
    "trigger_generation",
    "comment_on_plan",
    "approve_toc",
    "lock_toc",
    "generate_artifacts",
    "approve_artifacts",
    "create_cohort",
    "enroll_learners",
    "resolve_alert",
    "export_reports",
    "view_reports",
    "view_audit_log"
  ]),
  sme: new Set([
    "upload_source",
    "trigger_generation",
    "comment_on_plan",
    "approve_toc",
    "lock_toc",
    "generate_artifacts",
    "approve_artifacts",
    "evaluate_practical",
    "resolve_alert",
    "view_audit_log"
  ]),
  instructor: new Set([
    "comment_on_plan",
    "view_learner_content",
    "resolve_alert",
    "view_reports"
  ]),
  learner: new Set([
    "view_learner_content"
  ]),
  manager: new Set([
    "view_reports",
    "export_reports"
  ])
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return permissionMatrix[role]?.has(permission) ?? false;
}

export function getPermissions(role: UserRole): Permission[] {
  return Array.from(permissionMatrix[role] ?? []);
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    ld_admin: "L&D Admin",
    sme: "Subject Matter Expert",
    instructor: "Instructor",
    learner: "Learner",
    manager: "Manager"
  };
  return labels[role] ?? role;
}

const AUTH_STORAGE_KEY = "lxp.currentUser.v1";

const defaultUsers: AppUser[] = [
  { id: "user_admin", name: "Admin User", email: "admin@company.com", role: "ld_admin" },
  { id: "user_sme", name: "Dr. Sarah Chen", email: "sarah@company.com", role: "sme" },
  { id: "user_instructor", name: "James Wilson", email: "james@company.com", role: "instructor" },
  { id: "user_learner", name: "Ananya Rao", email: "ananya@company.com", role: "learner" },
  { id: "user_manager", name: "Michael Torres", email: "michael@company.com", role: "manager" }
];

export function getDefaultUsers(): AppUser[] {
  return defaultUsers;
}

export function loadCurrentUser(): AppUser {
  if (typeof window === "undefined") {
    return defaultUsers[0];
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return defaultUsers[0];
  }

  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    return defaultUsers[0];
  }
}

export function saveCurrentUser(user: AppUser): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}
