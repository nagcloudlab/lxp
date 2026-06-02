import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const sources = await prisma.sourceDocument.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json(sources);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const source = await prisma.sourceDocument.create({
    data: { ...body, projectId }
  });
  return NextResponse.json(source, { status: 201 });
}
