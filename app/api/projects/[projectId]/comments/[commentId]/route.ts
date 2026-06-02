import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; commentId: string }> }
) {
  const { commentId } = await params;
  const body = await request.json();
  const comment = await prisma.reviewComment.update({
    where: { id: commentId },
    data: body
  });
  return NextResponse.json(comment);
}
