import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const rows = await prisma.auditEvent.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json(
    rows.map((r: { details: string; [key: string]: unknown }) => ({ ...r, details: JSON.parse(r.details) }))
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const row = await prisma.auditEvent.create({
    data: {
      ...body,
      projectId,
      details: JSON.stringify(body.details ?? {})
    }
  });
  return NextResponse.json(
    { ...row, details: JSON.parse(row.details) },
    { status: 201 }
  );
}
