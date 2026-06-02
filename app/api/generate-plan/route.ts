import { NextRequest, NextResponse } from "next/server";
import { generateWithAi } from "@/lib/ai-provider";
import {
  buildProgramPlanSystemPrompt,
  buildProgramPlanUserPrompt
} from "@/lib/ai-prompts";
import type { TrainingProject } from "@/lib/training-projects";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = body.project as TrainingProject;
    const sourceTexts = body.sourceTexts as string[];

    if (!project || !sourceTexts?.length) {
      return NextResponse.json(
        { error: "project and sourceTexts are required" },
        { status: 400 }
      );
    }

    const result = await generateWithAi({
      type: "program_plan",
      systemPrompt: buildProgramPlanSystemPrompt(),
      userPrompt: buildProgramPlanUserPrompt(project, sourceTexts)
    });

    const parsed = parseJsonFromResponse(result.text);

    return NextResponse.json({
      plan: parsed,
      model: result.model,
      provider: result.provider
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

function parseJsonFromResponse(text: string) {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // LLMs sometimes wrap JSON in markdown code blocks
  }

  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1].trim());
  }

  // Try to find the first { ... } block
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    return JSON.parse(text.slice(start, end + 1));
  }

  throw new Error("Could not parse JSON from AI response");
}
