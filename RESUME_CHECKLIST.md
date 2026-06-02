# Resume Checklist

Date: 2026-05-28

Use this file to resume after disconnects or context loss.

## Current Strategic Decision

Product direction:

> B2B Corporate L&D first, then B2C after B2B proof.

Initial promise:

> Turn raw corporate training requirements into SME-approved, role-specific training programs in days instead of weeks.

MVP workflow:

> Raw inputs -> approved program plan -> generated content package -> lightweight cohort delivery -> learner signals -> B2B report.

## Documents Created

Read these in order before coding:

1. `B2B_FIRST_IMPLEMENTATION_PLAN.md`
2. `MVP_SPEC_B2B_CORPORATE_LD.md`
3. `ROLES_WORKFLOWS_STATE_MACHINE.md`
4. `INITIAL_DATA_MODEL.md`
5. `AI_GENERATION_GOVERNANCE.md`
6. `SAMPLE_PILOT_MATERIAL.md`
7. `SCREEN_WIREFRAMES.md`
8. `CODEX_COPILOT_BUILD_PLAN.md`

## Current Work Status

Completed pre-coding artifacts:

- B2B-first direction
- MVP scope
- roles and permission matrix
- workflow state machine
- initial data model
- AI governance rules
- sample pilot material
- screen wireframes
- Codex/Copilot build approach

Not yet done:

- choose tech stack
- initialize app repo
- create implementation tasks as issue-sized backlog
- create database schema
- build UI
- build APIs
- integrate AI provider
- write tests

## Next Best Action

Create the first implementation backlog:

1. Project skeleton
2. Organization/user/project model
3. Training project create/list/detail UI
4. Source upload and extraction
5. Requirement summary generation
6. TOC generation
7. SME comments
8. Approval and version locking
9. Content artifact generation
10. Exportable B2B program package

## Non-Negotiable Product Rules

- B2B first.
- B2C later.
- SME approval before learner publishing.
- AI output must be traceable to source and prompt version.
- Locked TOC is immutable.
- Learners see only approved content.
- Certification requires evidence, not only completion.
- Do not build marketplace, payments, or proctoring in MVP.

## Suggested First Coding Session

Goal:

> Initialize the app and implement the Corporate L&D training project workspace.

Acceptance:

- App runs locally.
- Admin can create training project.
- Admin can list projects.
- Admin can open project detail.
- Project has draft status.
- Basic tests pass.

