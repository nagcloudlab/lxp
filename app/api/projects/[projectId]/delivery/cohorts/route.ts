import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const cohort = await prisma.cohort.create({
    data: { ...body, projectId }
  });
  return NextResponse.json(cohort, { status: 201 });
}
