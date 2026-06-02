import {
  createGeneratedId,
  type ContentArtifact,
  type ContentArtifactType,
  type GenerationMetadata,
  type ProgramPlan
} from "./training-projects";

export const contentArtifactTypes: ContentArtifactType[] = [
  "slide_outline",
  "facilitator_notes",
  "learner_handout",
  "exercise",
  "quiz_bank",
  "practical_task",
  "rubric"
];

export type GenerateArtifactsResult = {
  artifacts: ContentArtifact[];
  provider: "ollama" | "stub";
};

/**
 * Generates all 7 content artifacts using Ollama via /api/generate-artifact.
 * Falls back to deterministic stubs if Ollama is unavailable.
 */
export async function generateContentArtifactsAsync(input: {
  projectId: string;
  plan: ProgramPlan;
}): Promise<GenerateArtifactsResult> {
  const results: ContentArtifact[] = [];
  let usedProvider: "ollama" | "stub" = "stub";

  for (const artifactType of contentArtifactTypes) {
    try {
      const response = await fetch("/api/generate-artifact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: input.plan,
          artifactType
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      usedProvider = data.provider || "ollama";

      const metadata: GenerationMetadata = {
        id: createGeneratedId("generation"),
        projectId: input.projectId,
        generationType: "content_artifact",
        promptTemplateId: `${artifactType}-ollama-v1`,
        promptVersion: "1.0.0",
        modelProvider: "deterministic_stub",
        modelName: data.model || "ollama",
        inputSourceIds: input.plan.sourceDocumentIds,
        outputSchemaVersion: "content-artifact-v1",
        generatedAt: new Date().toISOString()
      };

      results.push({
        id: createGeneratedId("artifact"),
        projectId: input.projectId,
        planId: input.plan.id,
        artifactType,
        title: getArtifactTitle(artifactType, input.plan.title),
        contentBody: data.content,
        status: "draft",
        sourceDocumentIds: input.plan.sourceDocumentIds,
        generationMetadata: metadata,
        createdAt: new Date().toISOString()
      });
    } catch {
      // Fall back to stub for this artifact
      results.push(createStubArtifact(input.projectId, input.plan, artifactType));
    }
  }

  return { artifacts: results, provider: usedProvider };
}

// ── Synchronous stub (kept for fallback and tests) ──

export function generateContentArtifacts(input: {
  projectId: string;
  plan: ProgramPlan;
}): ContentArtifact[] {
  return contentArtifactTypes.map((artifactType) =>
    createStubArtifact(input.projectId, input.plan, artifactType)
  );
}

function createStubArtifact(
  projectId: string,
  plan: ProgramPlan,
  artifactType: ContentArtifactType
): ContentArtifact {
  const metadata: GenerationMetadata = {
    id: createGeneratedId("generation"),
    projectId,
    generationType: "content_artifact",
    promptTemplateId: `${artifactType}-deterministic-v1`,
    promptVersion: "1.0.0",
    modelProvider: "deterministic_stub",
    modelName: "local-rule-generator",
    inputSourceIds: plan.sourceDocumentIds,
    outputSchemaVersion: "content-artifact-v1",
    generatedAt: new Date().toISOString()
  };

  return {
    id: createGeneratedId("artifact"),
    projectId,
    planId: plan.id,
    artifactType,
    title: getArtifactTitle(artifactType, plan.title),
    contentBody: getArtifactBody(artifactType, plan),
    status: "draft",
    sourceDocumentIds: plan.sourceDocumentIds,
    generationMetadata: metadata,
    createdAt: new Date().toISOString()
  };
}

function getArtifactTitle(artifactType: ContentArtifactType, planTitle: string) {
  const labels: Record<ContentArtifactType, string> = {
    slide_outline: "Slide Outline",
    facilitator_notes: "Facilitator Notes",
    learner_handout: "Learner Handout",
    exercise: "Exercises",
    quiz_bank: "Quiz Bank",
    practical_task: "Practical Task",
    rubric: "Rubric"
  };

  return `${labels[artifactType]} - ${planTitle}`;
}

function getArtifactBody(artifactType: ContentArtifactType, plan: ProgramPlan) {
  const moduleLines = plan.modules
    .map(
      (module) =>
        `${module.sequenceNumber}. ${module.title}\n   Outcomes: ${module.learningOutcomes.join("; ")}`
    )
    .join("\n");

  if (artifactType === "slide_outline") {
    return `Slide deck outline\n\nOpening: ${plan.requirementSummary}\n\nModules:\n${moduleLines}\n\nClosing: assessment expectations and next steps.`;
  }

  if (artifactType === "facilitator_notes") {
    return `Facilitator notes\n\nBusiness context: ${plan.businessContext}\n\nEmphasize assumptions and conflicts before delivery. Use SME judgment for high-risk modules.`;
  }

  if (artifactType === "learner_handout") {
    return `Learner handout\n\nAudience: ${plan.targetAudience}\n\nWhat learners will practice:\n${plan.modules
      .map((module) => `- ${module.title}`)
      .join("\n")}`;
  }

  if (artifactType === "exercise") {
    return `Exercises\n\n${plan.modules
      .map(
        (module) =>
          `- ${module.title}: complete a short workplace scenario using the module outcomes.`
      )
      .join("\n")}`;
  }

  if (artifactType === "quiz_bank") {
    return `Quiz bank\n\n${plan.modules
      .map(
        (module) =>
          `Q: Which action best demonstrates "${module.learningOutcomes[0]}"?\nA: Choose the option that applies the skill while following the program guidance.`
      )
      .join("\n\n")}`;
  }

  if (artifactType === "practical_task") {
    return `Practical task\n\n${plan.assessmentBlueprint.practicalTaskStrategy}\n\nSubmission must include the learner output, explanation of choices, and validation notes.`;
  }

  return `Rubric\n\n${plan.assessmentBlueprint.rubricStrategy}\n\nCriteria:\n- Relevance: 25\n- Accuracy: 25\n- Risk handling: 25\n- Business usefulness: 25\n\nPass criteria: ${plan.assessmentBlueprint.passCriteria}`;
}
