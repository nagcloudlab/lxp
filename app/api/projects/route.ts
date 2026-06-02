import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deriveProjectStatus } from "@/lib/project-status";
import type {
  ContentArtifact,
  Cohort,
  ProgramPlan,
  SourceDocument
} from "@/lib/training-projects";

export async function GET() {
  const projects = await prisma.trainingProject.findMany({
    include: {
      sources: true,
      programPlans: true,
      contentArtifacts: true,
      cohorts: true
    },
    orderBy: { createdAt: "desc" }
  });

  const result = projects.map((p) => {
    const computedStatus = deriveProjectStatus({
      sources: p.sources as unknown as SourceDocument[],
      plans: p.programPlans.map((plan) => ({
        ...plan,
        sourceDocumentIds: JSON.parse(plan.sourceDocumentIds),
        generationMetadata: JSON.parse(plan.generationMetadata),
        assumptions: JSON.parse(plan.assumptions),
        conflicts: JSON.parse(plan.conflicts),
        learnerRoles: JSON.parse(plan.learnerRoles),
        modules: JSON.parse(plan.modules),
        assessmentBlueprint: JSON.parse(plan.assessmentBlueprint)
      })) as ProgramPlan[],
      artifacts: p.contentArtifacts.map((a) => ({
        ...a,
        sourceDocumentIds: JSON.parse(a.sourceDocumentIds),
        generationMetadata: JSON.parse(a.generationMetadata)
      })) as ContentArtifact[],
      cohorts: p.cohorts as unknown as Cohort[]
    });
    const {
      sources: _s,
      programPlans: _p,
      contentArtifacts: _a,
      cohorts: _c,
      ...project
    } = p;
    return { ...project, computedStatus };
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const project = await prisma.trainingProject.create({ data: body });
  return NextResponse.json(
    { ...project, computedStatus: "draft" },
    { status: 201 }
  );
}
