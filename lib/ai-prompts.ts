import type { ContentArtifactType, ProgramPlan, TrainingProject } from "./training-projects";

export function buildProgramPlanSystemPrompt(): string {
  return `You are an expert instructional designer for corporate training programs.

You MUST respond with valid JSON only. No markdown, no explanation, no extra text — just the JSON object.

The JSON must match this exact structure:
{
  "requirementSummary": "string — 2-3 sentence summary of the training need",
  "businessContext": "string — why this training matters to the organization",
  "targetAudience": "string — who the learners are",
  "assumptions": [
    {
      "text": "string — something inferred but not confirmed",
      "severity": "low" | "medium" | "high"
    }
  ],
  "conflicts": [
    {
      "text": "string — contradiction or ambiguity found in the sources",
      "severity": "low" | "medium" | "high"
    }
  ],
  "learnerRoles": [
    {
      "name": "string",
      "description": "string",
      "expectedStartingSkill": "string",
      "targetOutcome": "string"
    }
  ],
  "modules": [
    {
      "title": "string",
      "description": "string",
      "sequenceNumber": 1,
      "estimatedMinutes": 60,
      "riskLevel": "low" | "medium" | "high",
      "learningOutcomes": ["string"],
      "topics": [
        {
          "title": "string",
          "description": "string",
          "sequenceNumber": 1,
          "roleRelevance": ["role name"],
          "estimatedMinutes": 20
        }
      ]
    }
  ],
  "assessmentBlueprint": {
    "quizStrategy": "string",
    "practicalTaskStrategy": "string",
    "rubricStrategy": "string",
    "passCriteria": "string"
  }
}

Rules:
- Base everything on the source material provided. Do not invent topics not supported by the sources.
- Separate confirmed requirements from assumptions.
- Flag contradictions as conflicts.
- Create role-specific learner tracks from the roles provided.
- Design 3-6 modules in a logical teaching sequence.
- Each module should have 2-4 topics.
- Include practical assessment, not just knowledge checks.`;
}

export function buildProgramPlanUserPrompt(
  project: TrainingProject,
  sourceTexts: string[]
): string {
  return `Create a structured training program plan for this corporate L&D project.

PROJECT DETAILS:
- Program name: ${project.name}
- Business goal: ${project.businessGoal}
- Department: ${project.targetDepartment}
- Expected learners: ${project.expectedLearnerCount}
- Target completion: ${project.targetCompletionDate}
- Learner roles: ${project.learnerRoles}
- Assigned SME: ${project.assignedSme}

SOURCE MATERIAL:
${sourceTexts.map((text, i) => `--- Source ${i + 1} ---\n${text.slice(0, 3000)}`).join("\n\n")}

Respond with the JSON object only.`;
}

export function buildContentArtifactSystemPrompt(
  artifactType: ContentArtifactType
): string {
  const artifactDescriptions: Record<ContentArtifactType, string> = {
    slide_outline:
      "Create a detailed slide deck outline with slide titles, key points per slide, speaker notes, and visual suggestions. Structure it module by module.",
    facilitator_notes:
      "Create facilitator/instructor notes covering setup requirements, timing guidance, discussion prompts, common learner questions, and tips for each module.",
    learner_handout:
      "Create a learner-facing handout summarizing key concepts, step-by-step procedures, reference tables, and quick-reference guides for each module.",
    exercise:
      "Create practical exercises for each module. Each exercise should have a scenario, clear instructions, expected deliverable, and success criteria.",
    quiz_bank:
      "Create a quiz bank with 3-5 questions per module. Mix multiple choice, true/false, and short answer. Include correct answers and explanations.",
    practical_task:
      "Create a capstone practical task that tests skills across multiple modules. Include scenario description, step-by-step requirements, submission format, and evaluation criteria.",
    rubric:
      "Create an evaluation rubric with criteria names, descriptions, scoring levels (1-4), and passing thresholds. Cover technical accuracy, completeness, risk awareness, and business relevance."
  };

  return `You are an expert instructional designer creating training content artifacts.

Your task: ${artifactDescriptions[artifactType]}

Respond with well-structured, detailed training content. Use clear headings and formatting.
Base everything on the program plan provided. Do not add topics not in the plan.`;
}

export function buildContentArtifactUserPrompt(
  artifactType: ContentArtifactType,
  plan: ProgramPlan
): string {
  const modulesSummary = plan.modules
    .map(
      (m) =>
        `Module ${m.sequenceNumber}: ${m.title}\n  Description: ${m.description}\n  Outcomes: ${m.learningOutcomes.join(", ")}\n  Topics: ${m.topics.map((t) => t.title).join(", ")}`
    )
    .join("\n\n");

  return `Generate the ${artifactType.replace(/_/g, " ")} for this training program.

PROGRAM: ${plan.title}
SUMMARY: ${plan.requirementSummary}
AUDIENCE: ${plan.targetAudience}

ROLE TRACKS:
${plan.learnerRoles.map((r) => `- ${r.name}: ${r.targetOutcome}`).join("\n")}

MODULES:
${modulesSummary}

ASSESSMENT STRATEGY:
- Quiz: ${plan.assessmentBlueprint.quizStrategy}
- Practical: ${plan.assessmentBlueprint.practicalTaskStrategy}
- Rubric: ${plan.assessmentBlueprint.rubricStrategy}
- Pass criteria: ${plan.assessmentBlueprint.passCriteria}`;
}
