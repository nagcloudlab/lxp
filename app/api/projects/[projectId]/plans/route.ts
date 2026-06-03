import { requireAuth, requirePermission } from "@/lib/api-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;
  const { projectId } = await params;
  const rows = await prisma.programPlan.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" }
  });
  const plans = rows.map(deserializePlan);
  return NextResponse.json(plans);
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
    versionNumber: body.versionNumber,
    title: body.title,
    status: body.status ?? "draft",
    sourceDocumentIds: JSON.stringify(body.sourceDocumentIds ?? []),
    generationMetadata: JSON.stringify(body.generationMetadata ?? {}),
    requirementSummary: body.requirementSummary ?? "",
    businessContext: body.businessContext ?? "",
    targetAudience: body.targetAudience ?? "",
    assumptions: JSON.stringify(body.assumptions ?? []),
    conflicts: JSON.stringify(body.conflicts ?? []),
    learnerRoles: JSON.stringify(body.learnerRoles ?? []),
    modules: JSON.stringify(body.modules ?? []),
    assessmentBlueprint: JSON.stringify(body.assessmentBlueprint ?? {}),
    createdAt: body.createdAt
  };
  const row = await prisma.programPlan.create({ data });
  return NextResponse.json(deserializePlan(row), { status: 201 });
}

function deserializePlan(row: Record<string, unknown>) {
  return {
    ...row,
    sourceDocumentIds: JSON.parse(row.sourceDocumentIds as string),
    generationMetadata: JSON.parse(row.generationMetadata as string),
    assumptions: JSON.parse(row.assumptions as string),
    conflicts: JSON.parse(row.conflicts as string),
    learnerRoles: JSON.parse(row.learnerRoles as string),
    modules: JSON.parse(row.modules as string),
    assessmentBlueprint: JSON.parse(row.assessmentBlueprint as string)
  };
}
