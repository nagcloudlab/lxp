# AI Generation Governance

Date: 2026-05-28

## 1. Core Policy

AI can draft, structure, summarize, and suggest. Humans approve.

MVP rule:

> No AI-generated training plan, content, assessment, or certificate-related artifact is published to learners without explicit human approval.

## 2. Allowed AI Generation in MVP

Allowed:

- requirement summary
- assumptions
- conflicts
- learner role tracks
- TOC
- prerequisite map
- assessment blueprint
- slide outline
- facilitator notes
- learner handout
- exercises
- quiz bank
- practical task
- rubric draft
- report draft

Not allowed in MVP:

- auto-issuing certificates
- auto-publishing content to learners
- silently changing locked TOC
- making final pass/fail decision for practical tasks
- creating public B2C marketing assets from private customer data

## 3. Required Metadata

Every AI-generated output must store:

- generation type
- source document IDs
- prompt template ID
- prompt version
- model provider
- model name
- output schema version
- generated timestamp
- triggering user
- review status

## 4. Source Grounding Rules

Generation should use only active sources selected for the project.

Outputs must separate:

- confirmed requirements
- assumptions
- conflicts
- recommendations

If source context is insufficient, the AI output must say what is missing instead of inventing details.

## 5. Review Rules

Human approval required for:

- TOC lock
- assessment blueprint
- learner-facing content
- quiz bank
- practical task
- rubric
- certificate criteria
- B2B reports sent to leadership
- any B2C-facing public asset

Review decisions:

- `approved`
- `rejected`
- `changes_requested`

## 6. Prompt Versioning

Each prompt template must have:

- stable ID
- version number
- purpose
- expected input
- expected output schema
- review owner

Prompt changes must create a new version. Old outputs retain old prompt version metadata.

## 7. Failure Handling

AI generation can fail because of:

- unsupported source
- empty extraction
- insufficient context
- provider error
- schema validation failure
- safety/policy refusal

Required behavior:

- show clear user-facing error
- preserve source material
- allow retry
- log failure metadata
- do not create approved output from failed generation

## 8. Quality Checks

Generated outputs must pass basic checks:

- required fields present
- no empty modules
- no empty learning outcomes
- no learner-facing content from excluded sources
- quiz questions include answer and explanation
- rubric includes criteria and scoring scale
- conflicts are not mixed into confirmed requirements

## 9. Privacy and B2C Guardrail

B2C assets can use only:

- approved public content
- anonymized outcomes
- approved customer references
- explicitly approved case study details

Private corporate source material must never be exposed in public previews or skill assessments.

