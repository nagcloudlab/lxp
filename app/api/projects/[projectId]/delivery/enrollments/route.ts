import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const enrollment = await prisma.enrollment.create({
    data: { ...body, projectId }
  });
  return NextResponse.json(enrollment, { status: 201 });
}
