import { NextRequest, NextResponse } from "next/server";
import { generateWithAi } from "@/lib/ai-provider";
import {
  buildContentArtifactSystemPrompt,
  buildContentArtifactUserPrompt
} from "@/lib/ai-prompts";
import type { ContentArtifactType, ProgramPlan } from "@/lib/training-projects";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const plan = body.plan as ProgramPlan;
    const artifactType = body.artifactType as ContentArtifactType;

    if (!plan || !artifactType) {
      return NextResponse.json(
        { error: "plan and artifactType are required" },
        { status: 400 }
      );
    }

    const result = await generateWithAi({
      type: "content_artifact",
      systemPrompt: buildContentArtifactSystemPrompt(artifactType),
      userPrompt: buildContentArtifactUserPrompt(artifactType, plan)
    });

    return NextResponse.json({
      content: result.text,
      model: result.model,
      provider: result.provider
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
