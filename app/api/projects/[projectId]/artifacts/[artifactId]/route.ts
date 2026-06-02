import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; artifactId: string }> }
) {
  const { artifactId } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (["sourceDocumentIds", "generationMetadata"].includes(key)) {
      data[key] = JSON.stringify(value);
    } else {
      data[key] = value;
    }
  }

  const row = await prisma.contentArtifact.update({
    where: { id: artifactId },
    data
  });

  return NextResponse.json({
    ...row,
    sourceDocumentIds: JSON.parse(row.sourceDocumentIds),
    generationMetadata: JSON.parse(row.generationMetadata)
  });
}
