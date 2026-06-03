import { auth } from "./auth-config";
import { hasPermission, type Permission, type UserRole } from "./auth";
import { NextResponse } from "next/server";

export type AuthResult = {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
};

export async function requireAuth(): Promise<AuthResult | NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return {
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name ?? "",
    email: session.user.email ?? ""
  };
}

export async function requirePermission(
  permission: Permission
): Promise<AuthResult | NextResponse> {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  if (!hasPermission(result.role, permission)) {
    return NextResponse.json(
      { error: "Forbidden", required: permission },
      { status: 403 }
    );
  }
  return result;
}
