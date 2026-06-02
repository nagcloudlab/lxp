# First 10 Codex Implementation Tasks

Date: 2026-05-28

These tasks are intentionally small. Give Codex one task at a time.

## Task 1: Initialize Product Skeleton

Prompt:

```text
Initialize the product skeleton for the B2B Corporate L&D LXP MVP. Create the minimal app structure, README, development commands, test setup, and placeholder app shell. Do not implement product features yet.
```

Acceptance:

- App starts locally.
- Test command runs.
- README explains setup.
- No business workflow is half-implemented.

## Task 2: Add Core Project Workspace Model

Prompt:

```text
Implement the TrainingProject model and basic persistence. Include fields from INITIAL_DATA_MODEL.md. Add create/list/detail behavior and tests. Keep UI minimal.
```

Acceptance:

- L&D admin can create project.
- Project list shows created project.
- Project detail shows metadata and draft status.

## Task 3: Add Roles and Permission Foundation

Prompt:

```text
Implement MVP roles from ROLES_WORKFLOWS_STATE_MACHINE.md: ld_admin, sme, instructor, learner, manager. Add permission checks for project creation and viewing. Add tests for allowed and denied access.
```

Acceptance:

- L&D admin can create project.
- Learner cannot create project.
- Manager can view allowed project summary.

## Task 4: Source Upload and Extraction

Prompt:

```text
Implement source upload for txt, md, pdf, and docx if supported by local libraries. Store SourceDocument and ExtractedSource. Show extraction status and extracted text preview. Add failure handling and tests.
```

Acceptance:

- Admin uploads source.
- Extracted text is saved and visible.
- Failed extraction shows error.
- Source can be marked active or excluded.

## Task 5: Requirement Summary Generation Stub

Prompt:

```text
Implement requirement summary generation behind a provider interface. Start with a deterministic local stub using SAMPLE_PILOT_MATERIAL.md so tests do not require external AI. Store GenerationMetadata.
```

Acceptance:

- Admin can generate summary from active sources.
- Output stores source IDs and prompt version.
- Tests do not call external AI.

## Task 6: TOC Generation Stub

Prompt:

```text
Implement TOCVersion, Module, Topic, LearnerRole, Assumption, Conflict, and AssessmentBlueprint generation using the same provider interface and deterministic stub. Add tests for required fields and source metadata.
```

Acceptance:

- Generated TOC has modules and topics.
- Assumptions and conflicts are separate.
- Assessment blueprint is created.

## Task 7: SME Review Comments

Prompt:

```text
Implement ReviewComment for TOC versions, modules, topics, assumptions, conflicts, and assessment blueprint. Add create/list/resolve behavior and permission tests.
```

Acceptance:

- SME can comment.
- L&D admin can respond or resolve where allowed.
- Learner cannot see comments.

## Task 8: Approval and Locking

Prompt:

```text
Implement TOC approval and locking workflow from ROLES_WORKFLOWS_STATE_MACHINE.md. Locked TOC must be immutable. Editing a locked TOC creates a new draft version. Add audit events and tests.
```

Acceptance:

- SME can approve TOC.
- Approved TOC can be locked.
- Locked TOC cannot be edited in place.
- New revision creates new version.

## Task 9: Content Artifact Generation Stub

Prompt:

```text
Implement ContentArtifact generation from locked TOC for slide outline, facilitator notes, learner handout, exercises, quiz bank, practical task, and rubric. Use deterministic stub first. Add artifact review states and tests.
```

Acceptance:

- Artifacts generate only from approved/locked TOC.
- Artifacts store source and prompt metadata.
- SME can approve artifacts.

## Task 10: B2B Program Package Export

Prompt:

```text
Implement B2B program package export using approved artifacts only. Include TOC, role tracks, assessment blueprint, approved artifacts, and readiness summary. Add tests that draft/rejected artifacts are excluded.
```

Acceptance:

- Admin can export package.
- Export excludes unapproved artifacts.
- Export includes readiness summary.

