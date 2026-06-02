import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const rows = await prisma.contentArtifact.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json(rows.map(deserializeArtifact));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const data = {
    id: body.id,
    projectId,
    planId: body.planId,
    artifactType: body.artifactType,
    title: body.title,
    contentBody: body.contentBody ?? "",
    status: body.status ?? "draft",
    sourceDocumentIds: JSON.stringify(body.sourceDocumentIds ?? []),
    generationMetadata: JSON.stringify(body.generationMetadata ?? {}),
    approvedAt: body.approvedAt ?? null,
    createdAt: body.createdAt
  };
  const row = await prisma.contentArtifact.create({ data });
  return NextResponse.json(deserializeArtifact(row), { status: 201 });
}

function deserializeArtifact(row: Record<string, unknown>) {
  return {
    ...row,
    sourceDocumentIds: JSON.parse(row.sourceDocumentIds as string),
    generationMetadata: JSON.parse(row.generationMetadata as string)
  };
}
