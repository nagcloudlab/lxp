import {
  createGeneratedId,
  createPlanId,
  type AssessmentBlueprint,
  type GenerationMetadata,
  type ProgramModule,
  type ProgramPlan,
  type SourceDocument,
  type TrainingProject
} from "./training-projects";

export type GeneratePlanResult = {
  plan: ProgramPlan;
  provider: "ollama" | "stub";
};

/**
 * Calls the /api/generate-plan route which uses Ollama.
 * Falls back to the deterministic stub if Ollama is unavailable.
 */
export async function generateProgramPlanAsync(input: {
  project: TrainingProject;
  activeSources: SourceDocument[];
  versionNumber: number;
}): Promise<GeneratePlanResult> {
  const sourceTexts = input.activeSources.map((s) => s.extractedText);
  const sourceDocumentIds = input.activeSources.map((s) => s.id);

  try {
    const response = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: input.project,
        sourceTexts
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Unknown" }));
      throw new Error(err.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    const raw = data.plan;

    const plan = buildPlanFromAiResponse({
      raw,
      project: input.project,
      sourceDocumentIds,
      versionNumber: input.versionNumber,
      model: data.model,
      provider: data.provider
    });

    return { plan, provider: data.provider };
  } catch {
    // Fallback to deterministic stub
    return {
      plan: generateProgramPlan({
        project: input.project,
        activeSources: input.activeSources,
        versionNumber: input.versionNumber
      }),
      provider: "stub"
    };
  }
}

function buildPlanFromAiResponse(input: {
  raw: Record<string, unknown>;
  project: TrainingProject;
  sourceDocumentIds: string[];
  versionNumber: number;
  model: string;
  provider: string;
}): ProgramPlan {
  const { raw, project, sourceDocumentIds, versionNumber, model } = input;

  const metadata: GenerationMetadata = {
    id: createGeneratedId("generation"),
    projectId: project.id,
    generationType: "program_plan",
    promptTemplateId: "program-plan-ollama-v1",
    promptVersion: "1.0.0",
    modelProvider: "deterministic_stub",
    modelName: model || "ollama",
    inputSourceIds: sourceDocumentIds,
    outputSchemaVersion: "program-plan-v1",
    generatedAt: new Date().toISOString()
  };

  const assumptions = Array.isArray(raw.assumptions)
    ? raw.assumptions.map((a: Record<string, string>) => ({
        id: createGeneratedId("assumption"),
        text: a.text || "Assumption from AI",
        severity: (a.severity as "low" | "medium" | "high") || "medium",
        status: "open" as const,
        sourceDocumentIds
      }))
    : [];

  const conflicts = Array.isArray(raw.conflicts)
    ? raw.conflicts.map((c: Record<string, string>) => ({
        id: createGeneratedId("conflict"),
        text: c.text || "Conflict from AI",
        severity: (c.severity as "low" | "medium" | "high") || "medium",
        status: "open" as const,
        conflictingSourceDocumentIds: sourceDocumentIds
      }))
    : [];

  const learnerRoles = Array.isArray(raw.learnerRoles)
    ? raw.learnerRoles.map((r: Record<string, string>) => ({
        id: createGeneratedId("role"),
        name: r.name || "Learner",
        description: r.description || "",
        expectedStartingSkill: r.expectedStartingSkill || "Mixed",
        targetOutcome: r.targetOutcome || "Apply program skills"
      }))
    : deriveLearnerRoles(project.learnerRoles);

  const modules: ProgramModule[] = Array.isArray(raw.modules)
    ? raw.modules.map((m: Record<string, unknown>, i: number) => ({
        id: createGeneratedId("module"),
        title: (m.title as string) || `Module ${i + 1}`,
        description: (m.description as string) || "",
        sequenceNumber: (m.sequenceNumber as number) || i + 1,
        estimatedMinutes: (m.estimatedMinutes as number) || 60,
        riskLevel: (m.riskLevel as "low" | "medium" | "high") || "medium",
        learningOutcomes: Array.isArray(m.learningOutcomes)
          ? m.learningOutcomes
          : [],
        topics: Array.isArray(m.topics)
          ? m.topics.map(
              (t: Record<string, unknown>, j: number) => ({
                id: createGeneratedId("topic"),
                title: (t.title as string) || `Topic ${j + 1}`,
                description: (t.description as string) || "",
                sequenceNumber: (t.sequenceNumber as number) || j + 1,
                prerequisiteTopicIds: [],
                roleRelevance: Array.isArray(t.roleRelevance)
                  ? t.roleRelevance
                  : learnerRoles.map((r) => r.name),
                estimatedMinutes: (t.estimatedMinutes as number) || 20
              })
            )
          : []
      }))
    : [];

  const abRaw = (raw.assessmentBlueprint as Record<string, string>) || {};
  const assessmentBlueprint: AssessmentBlueprint = {
    id: createGeneratedId("assessment"),
    status: "draft",
    quizStrategy: abRaw.quizStrategy || "Knowledge check per module",
    practicalTaskStrategy:
      abRaw.practicalTaskStrategy || "Role-specific practical task",
    rubricStrategy:
      abRaw.rubricStrategy || "Score relevance, accuracy, and completeness",
    passCriteria:
      abRaw.passCriteria || "Pass quiz and complete practical task"
  };

  return {
    id: createPlanId(),
    projectId: project.id,
    versionNumber,
    title: `${project.name} Program Plan`,
    status: "draft",
    sourceDocumentIds,
    generationMetadata: metadata,
    requirementSummary:
      (raw.requirementSummary as string) || "AI-generated program plan",
    businessContext:
      (raw.businessContext as string) || project.businessGoal,
    targetAudience:
      (raw.targetAudience as string) ||
      `${project.expectedLearnerCount} learners in ${project.targetDepartment}`,
    assumptions,
    conflicts,
    learnerRoles,
    modules,
    assessmentBlueprint,
    createdAt: new Date().toISOString()
  };
}

// ── Deterministic stub (kept for fallback and tests) ──

export function generateProgramPlan(input: {
  project: TrainingProject;
  activeSources: SourceDocument[];
  versionNumber: number;
}): ProgramPlan {
  const combinedText = input.activeSources
    .map((source) => source.extractedText)
    .join("\n\n")
    .toLowerCase();
  const sourceDocumentIds = input.activeSources.map((source) => source.id);
  const metadata: GenerationMetadata = {
    id: createGeneratedId("generation"),
    projectId: input.project.id,
    generationType: "program_plan",
    promptTemplateId: "program-plan-deterministic-v1",
    promptVersion: "1.0.0",
    modelProvider: "deterministic_stub",
    modelName: "local-rule-generator",
    inputSourceIds: sourceDocumentIds,
    outputSchemaVersion: "program-plan-v1",
    generatedAt: new Date().toISOString()
  };

  const learnerRoles = deriveLearnerRoles(input.project.learnerRoles);
  const modules = createModules(combinedText, learnerRoles.map((role) => role.name));
  const assessmentBlueprint = createAssessmentBlueprint(combinedText);

  return {
    id: createPlanId(),
    projectId: input.project.id,
    versionNumber: input.versionNumber,
    title: `${input.project.name} Program Plan`,
    status: "draft",
    sourceDocumentIds,
    generationMetadata: metadata,
    requirementSummary: createSummary(input.project, combinedText),
    businessContext: input.project.businessGoal,
    targetAudience: `${input.project.expectedLearnerCount} learners in ${input.project.targetDepartment}`,
    assumptions: [
      {
        id: createGeneratedId("assumption"),
        text: "Learners can access the approved tools and training materials during the pilot.",
        severity: "medium",
        status: "open",
        sourceDocumentIds
      },
      {
        id: createGeneratedId("assumption"),
        text: "The organization has or will provide policy guidance for safe AI usage.",
        severity: combinedText.includes("confidential") ? "high" : "medium",
        status: "open",
        sourceDocumentIds
      }
    ],
    conflicts: deriveConflicts(combinedText, sourceDocumentIds),
    learnerRoles,
    modules,
    assessmentBlueprint,
    createdAt: new Date().toISOString()
  };
}

function createSummary(project: TrainingProject, combinedText: string) {
  const safetyText =
    combinedText.includes("confidential") || combinedText.includes("safe")
      ? " The program must include safe usage, data-handling boundaries, and human validation of AI output."
      : "";

  return `This program prepares ${project.targetDepartment} learners to meet the business goal: ${project.businessGoal}.${safetyText} The training should be role-specific, practical, and structured for SME review before delivery.`;
}

function deriveLearnerRoles(rawRoles: string) {
  return rawRoles
    .split(/,|\n/)
    .map((role) => role.trim())
    .filter(Boolean)
    .map((role) => ({
      id: createGeneratedId("role"),
      name: role,
      description: `${role} track with examples and practice aligned to day-to-day work.`,
      expectedStartingSkill: "Mixed familiarity; confirm with pre-test during delivery.",
      targetOutcome: "Can apply the program skills safely in workplace scenarios."
    }));
}

function createModules(
  combinedText: string,
  roleNames: string[]
): ProgramModule[] {
  const includeAiSafety =
    combinedText.includes("ai") ||
    combinedText.includes("prompt") ||
    combinedText.includes("confidential");

  const moduleSpecs = includeAiSafety
    ? [
        {
          title: "AI Tool Basics and Safe Use",
          description:
            "Establish what AI tools can do, what they cannot do, and what information must stay protected.",
          riskLevel: "high" as const,
          outcomes: [
            "Identify approved and risky AI use cases",
            "Avoid exposing confidential information",
            "Explain when human review is required"
          ],
          topics: ["AI tool capabilities", "Sensitive data rules", "Human review"]
        },
        {
          title: "Prompting for Useful Output",
          description:
            "Teach learners to provide context, constraints, examples, and output formats.",
          riskLevel: "medium" as const,
          outcomes: [
            "Write clear task prompts",
            "Iterate prompts to improve quality",
            "Request structured output"
          ],
          topics: ["Task framing", "Context and constraints", "Prompt iteration"]
        },
        {
          title: "Document and Meeting Productivity",
          description:
            "Apply AI tools to summarize documents, extract action items, and create meeting follow-ups.",
          riskLevel: "medium" as const,
          outcomes: [
            "Summarize source material",
            "Extract action items",
            "Check output against original sources"
          ],
          topics: ["Document summaries", "Meeting notes", "Source validation"]
        },
        {
          title: "Role-Specific Practice and Assessment",
          description:
            "Give each learner role a practical scenario and validate skills through quiz and task evidence.",
          riskLevel: "high" as const,
          outcomes: [
            "Complete role-specific practice",
            "Pass knowledge check",
            "Submit practical evidence"
          ],
          topics: ["Role scenarios", "Quiz", "Practical task"]
        }
      ]
    : [
        {
          title: "Program Foundations",
          description: "Introduce the business goal, learner roles, and expected outcomes.",
          riskLevel: "medium" as const,
          outcomes: ["Explain the program objective", "Identify role expectations"],
          topics: ["Business context", "Learner roles", "Success criteria"]
        },
        {
          title: "Core Skills Practice",
          description: "Build practical skill through guided examples and exercises.",
          riskLevel: "medium" as const,
          outcomes: ["Apply the core skill", "Complete guided practice"],
          topics: ["Core concepts", "Guided practice", "Feedback"]
        },
        {
          title: "Assessment and Evidence",
          description: "Validate learning through quiz, practical task, and rubric review.",
          riskLevel: "high" as const,
          outcomes: ["Pass assessment", "Submit practical evidence"],
          topics: ["Quiz", "Practical task", "Rubric review"]
        }
      ];

  return moduleSpecs.map((module, moduleIndex) => ({
    id: createGeneratedId("module"),
    title: module.title,
    description: module.description,
    sequenceNumber: moduleIndex + 1,
    estimatedMinutes: module.riskLevel === "high" ? 75 : 60,
    riskLevel: module.riskLevel,
    learningOutcomes: module.outcomes,
    topics: module.topics.map((topic, topicIndex) => ({
      id: createGeneratedId("topic"),
      title: topic,
      description: `${topic} content and practice for the target audience.`,
      sequenceNumber: topicIndex + 1,
      prerequisiteTopicIds: [],
      roleRelevance: roleNames,
      estimatedMinutes: 20
    }))
  }));
}

function deriveConflicts(combinedText: string, sourceDocumentIds: string[]) {
  const conflicts = [];

  if (combinedText.includes("3 hours") && combinedText.includes("6 hours")) {
    conflicts.push({
      id: createGeneratedId("conflict"),
      text: "Duration conflict detected: one source asks for 3 hours while another asks for 6 hours.",
      severity: "high" as const,
      status: "open" as const,
      conflictingSourceDocumentIds: sourceDocumentIds
    });
  }

  if (combinedText.includes("certificate") && !combinedText.includes("assessment")) {
    conflicts.push({
      id: createGeneratedId("conflict"),
      text: "Certificate requested, but assessment evidence requirements are not fully specified.",
      severity: "medium" as const,
      status: "open" as const,
      conflictingSourceDocumentIds: sourceDocumentIds
    });
  }

  return conflicts;
}

function createAssessmentBlueprint(combinedText: string): AssessmentBlueprint {
  const includesPractical =
    combinedText.includes("practical") || combinedText.includes("hands-on");

  return {
    id: createGeneratedId("assessment"),
    status: "draft",
    quizStrategy:
      "Use a knowledge check covering safety, core concepts, role scenarios, and validation steps.",
    practicalTaskStrategy: includesPractical
      ? "Require a role-specific workplace task submission reviewed by SME rubric."
      : "Require a short practical task to prove application beyond completion.",
    rubricStrategy:
      "Score clarity, relevance, risk handling, evidence quality, and business usefulness.",
    passCriteria:
      "Learner must pass quiz threshold, submit practical task, and receive evaluator approval."
  };
}
