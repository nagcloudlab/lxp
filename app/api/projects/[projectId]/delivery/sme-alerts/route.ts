import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const alert = await prisma.sMEAlert.create({
    data: { ...body, projectId }
  });
  return NextResponse.json(alert, { status: 201 });
}
