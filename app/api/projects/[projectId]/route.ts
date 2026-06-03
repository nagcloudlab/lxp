import { requireAuth } from "@/lib/api-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;
  const { projectId } = await params;
  const project = await prisma.trainingProject.findUnique({
    where: { id: projectId }
  });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}
