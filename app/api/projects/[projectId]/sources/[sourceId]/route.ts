import { requireAuth } from "@/lib/api-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; sourceId: string }> }
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;
  const { sourceId } = await params;
  const body = await request.json();
  const source = await prisma.sourceDocument.update({
    where: { id: sourceId },
    data: body
  });
  return NextResponse.json(source);
}
