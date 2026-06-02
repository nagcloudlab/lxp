# Building the AI-Powered LXP with Codex and GitHub Copilot

Date: 2026-05-28

## 1. Build Assumption

This plan assumes the complete product will be built primarily by:

- Founder/product owner: defines intent, approves behavior, reviews quality.
- Codex: architecture planning, codebase edits, refactoring, tests, documentation, debugging, repo-level implementation.
- GitHub Copilot: in-editor autocomplete, local implementation help, small function/component generation, repetitive coding acceleration.

This does not mean the product can be built without engineering discipline. It means the process must be designed so AI coding tools can work safely and consistently.

The most important rule:

> Keep each build step small, testable, documented, and reviewable.

Commercial build assumption:

> Build for B2B Corporate L&D first. Add B2C only after B2B programs, content, outcomes, and certificates are validated.

## 2. Development Philosophy

### Build in Thin Vertical Slices

Do not build one giant module at a time. Build end-to-end slices that prove real behavior.

Example:

Instead of building "all AI ingestion," build:

1. Create project.
2. Upload one PDF/text document.
3. Extract text.
4. Generate requirement summary.
5. Save result.
6. Show result in UI.
7. Add test.

This lets Codex and Copilot work in controlled increments.

### Make the Product Spec the Source of Truth

Before coding each feature, maintain:

- feature goal
- user roles
- input
- output
- workflow states
- acceptance criteria
- edge cases

Codex should implement from these specs, not from vague intent.

### Prefer Simple, Observable Systems First

For the first version:

- use clear workflows
- use explicit status fields
- use audit logs
- use deterministic rules where possible
- keep AI calls traceable
- store prompts and outputs
- make approvals visible

Avoid overly complex autonomous agents early.

## 3. Product Build Phases

## Phase 0: Product Foundation

### Goal

Prepare the repo, product documents, and engineering rules so Codex and Copilot can build consistently.

### Deliverables

- Product vision document
- Roadmap document
- MVP specification
- Data model draft
- User roles and permissions
- UX workflow sketches
- Repo setup
- Coding standards
- Test strategy
- AI prompt/versioning strategy

### Codex Tasks

- Create project structure.
- Create architecture notes.
- Create database schema draft.
- Create API contract draft.
- Create feature specs from roadmap.
- Create initial README and development guide.

### Copilot Tasks

- Assist while editing boilerplate.
- Suggest simple components, models, utilities, and tests.

### Human Decisions

- Final product scope.
- Target customer.
- First workflow to build.
- UI quality bar.
- Which features are deferred.

## Phase 1: B2B Requirement Intelligence MVP

### Goal

Convert raw corporate training inputs into a structured, reviewable training plan for Corporate L&D teams.

### Core Features

- Project/workspace creation
- Input upload
- Text extraction
- Requirement summary
- Assumption log
- Conflict log
- TOC generation
- Role-track generation
- Prerequisite map
- SME review comments
- Approval states
- Version locking
- B2B readiness report

### Thin Slices

1. Project CRUD
2. Upload text/PDF
3. Extract and store source text
4. Generate requirement summary
5. Generate TOC
6. Add SME comments
7. Approve/reject TOC
8. Lock approved version
9. Export approved TOC

### Acceptance Criteria

- A Corporate L&D admin can create a training project.
- A Corporate L&D admin can upload source material.
- The system stores extracted text.
- The system generates a structured summary.
- The system generates a TOC with modules and topics.
- SME can comment and request changes.
- Approved TOC becomes locked and versioned.
- Admin can export a B2B program plan for stakeholder review.

### Codex Build Style

Ask Codex to implement one slice at a time:

```text
Implement project creation end to end. Include database model, API route, UI screen, validation, and tests. Follow existing repo patterns. Do not add unrelated features.
```

### Copilot Build Style

Use Copilot for:

- form fields
- validation helpers
- UI component variants
- mapper functions
- test fixtures
- small utilities

## Phase 2: AI Content Factory

### Goal

Generate B2B delivery-ready content from approved TOC, with SME review.

### Core Features

- Generate lesson plan
- Generate slide outline
- Generate quiz
- Generate practical exercise
- Generate case study
- Generate rubric
- Generate facilitator notes
- Review artifact by section
- Approve artifact
- Export content package

### Thin Slices

1. Generate lesson summary for one module
2. Generate quiz for one module
3. Add artifact review states
4. Add SME comments on artifact
5. Export lesson package
6. Generate full content package from approved TOC

### Acceptance Criteria

- Content can only be generated from approved or explicitly selected TOC versions.
- Each generated artifact stores prompt version, source references, generated output, reviewer, and approval state.
- SME can approve, reject, or request changes.
- Approved artifacts can be exported as a B2B program package.

### Codex Prompt Pattern

```text
Build the content artifact workflow for lesson summaries only. Use the existing approval state pattern from TOC review. Store prompt metadata and generation output. Add focused tests.
```

## Phase 3: Learner Delivery v1

### Goal

Deliver approved learning content to corporate cohorts and track progress.

### Core Features

- Learner enrollment
- Cohort/batch management
- Module player
- Quiz delivery
- Progress tracking
- Pre-test
- Simple adaptive rules
- SME escalation
- L&D progress report

### Thin Slices

1. Create cohort
2. Enroll learner
3. Publish approved content to cohort
4. Learner views module
5. Learner attempts quiz
6. Track progress
7. Trigger remediation rule
8. Trigger SME alert

### Acceptance Criteria

- Learners only see published approved content.
- Progress is tracked per learner and per module.
- Quiz attempts are stored.
- Remediation is explainable.
- SME alerts show reason and learner context.

## Phase 4: Skill Validation

### Goal

Validate actual learner competency.

### Core Features

- Practical tasks
- Submissions
- Rubric evaluation
- Evaluator review
- Skill evidence report
- Certificate generation

### Thin Slices

1. Create practical task from approved module
2. Learner submits work
3. Evaluator scores using rubric
4. Generate skill evidence report
5. Issue certificate

### Acceptance Criteria

- Certificate is based on evidence, not just completion.
- Rubric scoring is auditable.
- Evaluator notes are retained.
- Learner can view result.

## Phase 5: Intelligence Loop

### Goal

Use learner and SME data to improve future programs.

### Core Features

- Topic difficulty heatmap
- Assessment quality signals
- Learner risk score
- SME intervention analytics
- Content improvement suggestions
- Cohort comparison

### Thin Slices

1. Show quiz failure by topic
2. Show repeated learner struggle
3. Show SME intervention concentration
4. Suggest content improvement
5. Compare cohort outcomes

### Acceptance Criteria

- Every insight links back to evidence.
- Suggestions are reviewable, not automatically applied.
- Program manager can turn insights into revision tasks.

## Phase 6: Enterprise and Scale

### Goal

Make the product usable by larger organizations.

### Core Features

- Multi-tenant organizations
- RBAC
- SSO
- Audit logs
- Data retention
- API/export
- LMS integration
- White label
- Localization

### Thin Slices

1. Organization-level separation
2. Role-based permissions
3. Audit event viewer
4. Export APIs
5. SSO
6. LMS export/import

## Phase 7: Broadcasting Engine

### Goal

Repurpose approved B2B learning assets and outcomes into external business and later B2C content.

### Core Features

- Course preview
- Case study draft
- Landing page draft
- Email campaign draft
- Social snippets
- Outcome report
- Public course preview
- Public certificate verification

### Guardrail

Broadcasting can only use:

- approved content
- anonymized data
- verified outcomes
- explicitly approved customer references

B2C catalog and individual enrollment should be added only after B2B proof.

## 4. Recommended Repo Documentation

Create these documents early:

- `README.md`: what the product is and how to run it
- `docs/product/vision.md`: product intent
- `docs/product/mvp.md`: MVP scope
- `docs/product/roadmap.md`: phased roadmap
- `docs/product/user-roles.md`: roles and permissions
- `docs/product/workflows.md`: workflow diagrams in text
- `docs/engineering/architecture.md`: system architecture
- `docs/engineering/data-model.md`: entities and relationships
- `docs/engineering/ai-generation.md`: prompts, model calls, grounding, review
- `docs/engineering/testing.md`: test strategy
- `docs/engineering/codex-playbook.md`: how to ask Codex to change the repo
- `docs/engineering/copilot-playbook.md`: how to use Copilot safely

## 5. Suggested Repo Structure

The exact stack can change, but the structure should separate product logic clearly:

```text
docs/
  product/
  engineering/
  decisions/
apps/
  web/
  api/
packages/
  shared/
  ai/
  domain/
  ui/
tests/
  e2e/
  fixtures/
```

Important rule:

> Keep AI generation logic separate from core business workflows.

The workflow should not depend on one model provider or one prompt.

## 6. Core Domain Objects

Start with these entities:

- Organization
- User
- Role
- Project
- SourceDocument
- ExtractedSource
- RequirementSummary
- Conflict
- Assumption
- LearningObjective
- Skill
- LearnerRole
- TOCVersion
- Module
- Topic
- AssessmentBlueprint
- ReviewComment
- Approval
- ContentArtifact
- Quiz
- Rubric
- Cohort
- Learner
- Enrollment
- ProgressEvent
- QuizAttempt
- Remediation
- SMEAlert
- PracticalTask
- Submission
- Evaluation
- Certificate
- AuditEvent

Do not implement all at once. Use this as the long-term map.

## 7. AI Generation Architecture

Every AI-generated output should store:

- input source IDs
- prompt template ID
- prompt version
- model/provider used
- generated output
- generation timestamp
- reviewer
- approval state
- revision history
- source citations where possible

This is essential for trust, debugging, and enterprise adoption.

## 8. Human Review Gates

Require human approval for:

- TOC lock
- assessment blueprint
- generated content package
- practical assessment rubric
- certificate issuance rules
- broadcasting assets

Optional human approval for:

- learner remediation suggestions
- quiz draft revisions
- lesson summaries

Never silently publish AI-generated training content in the early product.

## 9. Testing Strategy

### Unit Tests

Use for:

- data validation
- permission rules
- workflow state transitions
- scoring logic
- export formatting
- prompt input builders

### Integration Tests

Use for:

- upload to extraction
- TOC generation to review
- approval to content generation
- publishing to learner view
- quiz attempt to progress update

### E2E Tests

Use for critical workflows:

- program manager creates project
- SME approves TOC
- content is generated and approved
- learner completes module
- learner fails quiz and gets remediation
- evaluator issues certificate

### AI Output Tests

Do not test AI text by exact string.

Test:

- schema validity
- required fields
- source coverage
- no empty sections
- no unpublished content in output
- no generation from unapproved TOC when approval is required

## 10. How to Use Codex

Use Codex for repo-level tasks:

- create feature from spec
- modify multiple files
- refactor safely
- add tests
- debug failing tests
- write documentation
- review architecture
- review pull requests

Good Codex request:

```text
Implement SME comments for TOC versions. Read the existing project and TOC models first. Add the smallest database/API/UI changes needed. Add tests for create, list, resolve, and permission behavior. Do not change unrelated workflows.
```

Bad Codex request:

```text
Build the whole LXP.
```

## 11. How to Use GitHub Copilot

Use Copilot for local acceleration:

- completing repetitive code
- simple UI components
- mapping DTOs
- generating fixtures
- writing small tests
- simple validators
- boilerplate

Do not rely on Copilot for:

- product architecture
- security decisions
- permission design
- data model integrity
- AI governance
- business workflows

Copilot is best when the file already has a clear pattern.

## 12. AI Coding Workflow

For every feature:

1. Write the feature spec.
2. Ask Codex to inspect relevant files.
3. Ask Codex for an implementation plan if the feature is large.
4. Let Codex implement one thin slice.
5. Run tests.
6. Review behavior manually.
7. Use Copilot for local cleanup and small additions.
8. Ask Codex for a code review.
9. Fix issues.
10. Document the feature.

## 13. Pull Request Checklist

Every PR should answer:

- What user workflow changed?
- What data model changed?
- What permissions changed?
- What AI prompts changed?
- What tests were added?
- What was intentionally deferred?
- Can generated content be traced to sources?
- Can AI output be reviewed before publication?

## 14. Milestone Plan for Solo + AI Build

### Milestone 1: Product Skeleton

Target: 2-4 weeks

Deliver:

- repo initialized
- app shell
- authentication placeholder
- project workspace
- core docs
- test setup

### Milestone 2: Requirement Intelligence Prototype

Target: 4-6 weeks

Deliver:

- source upload
- text extraction
- requirement summary
- TOC generation
- basic UI
- saved outputs

### Milestone 3: SME Review MVP

Target: 3-5 weeks

Deliver:

- comments
- approval states
- version locking
- audit events
- revision workflow

### Milestone 4: Content Factory MVP

Target: 4-6 weeks

Deliver:

- lesson generator
- quiz generator
- rubric generator
- artifact review
- export package

### Milestone 5: B2B Pilot-Ready Product

Target: 4-8 weeks

Deliver:

- better UX
- templates
- pilot analytics
- admin flows
- error handling
- deployment
- Corporate L&D readiness report

### Milestone 6: Learner Delivery v1

Target: 8-12 weeks

Deliver:

- cohort
- learner portal
- module delivery
- quiz attempts
- progress tracking
- remediation rules

### Milestone 7: Skill Validation v1

Target: 6-10 weeks

Deliver:

- practical tasks
- submissions
- rubric scoring
- evaluator workflow
- certificate evidence report

## 15. Practical Build Order

Build in this exact order:

1. Documentation and repo skeleton
2. Project/workspace model
3. Source upload and extraction
4. Requirement summary generation
5. TOC generation
6. Review comments
7. Approval and version locking
8. Content artifact generation
9. Export package
10. B2B readiness and ROI report
11. Pilot dashboard
12. Learner delivery
13. Adaptive rules
14. Skill validation
15. Enterprise controls
16. Broadcasting
17. B2C public preview and assessments

## 16. Biggest Risk When Building with AI Tools

The biggest risk is not whether Codex or Copilot can generate code. They can.

The biggest risks are:

- building too much without validation
- accepting AI-generated code without tests
- letting the data model become messy
- letting AI-generated content bypass review
- adding features before workflows are stable
- confusing a demo with a product

The mitigation is disciplined sequencing:

> spec -> small slice -> tests -> review -> document -> next slice

## 17. Immediate Next Documents to Create

The next documents should be:

1. MVP product specification
2. User roles and permission matrix
3. Core workflow state machine
4. Initial data model
5. AI generation governance spec
6. First 10 Codex implementation tasks

