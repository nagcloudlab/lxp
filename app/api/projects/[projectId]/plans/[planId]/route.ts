import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; planId: string }> }
) {
  const { planId } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (
      [
        "sourceDocumentIds",
        "generationMetadata",
        "assumptions",
        "conflicts",
        "learnerRoles",
        "modules",
        "assessmentBlueprint"
      ].includes(key)
    ) {
      data[key] = JSON.stringify(value);
    } else {
      data[key] = value;
    }
  }

  const row = await prisma.programPlan.update({
    where: { id: planId },
    data
  });

  return NextResponse.json({
    ...row,
    sourceDocumentIds: JSON.parse(row.sourceDocumentIds),
    generationMetadata: JSON.parse(row.generationMetadata),
    assumptions: JSON.parse(row.assumptions),
    conflicts: JSON.parse(row.conflicts),
    learnerRoles: JSON.parse(row.learnerRoles),
    modules: JSON.parse(row.modules),
    assessmentBlueprint: JSON.parse(row.assessmentBlueprint)
  });
}
