import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const comments = await prisma.reviewComment.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const comment = await prisma.reviewComment.create({
    data: { ...body, projectId }
  });
  return NextResponse.json(comment, { status: 201 });
}
