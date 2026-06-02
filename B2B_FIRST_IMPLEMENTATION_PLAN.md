# B2B-First Implementation Plan

Date: 2026-05-28

## 1. Strategic Direction

The product will be built for B2B customers first, then expanded to B2C.

Initial buyer:

> Corporate L&D teams that need to create, deliver, validate, and report custom training programs at enterprise scale.

Initial promise:

> Turn raw training requirements into SME-approved, role-specific training programs in days instead of weeks.

B2C comes later through the broadcasting engine:

- public course previews
- skill assessments
- certificate verification pages
- individual learner landing pages
- consumer enrollment after B2B content has been validated

The platform should not start as a course marketplace or creator economy product.

## 2. Product Positioning

An AI-powered learning orchestration platform for corporate L&D teams.

It converts messy training requirements into approved programs, delivers them adaptively, validates learner skills, and reports business impact.

## 3. MVP Scope

The MVP should prove the B2B workflow:

> Raw inputs -> approved program plan -> generated content package -> lightweight cohort delivery -> learner signals -> B2B report.

### In Scope

- Training project workspace
- Source upload and text extraction
- Requirement summary
- Assumption and conflict log
- Structured TOC
- Role-specific tracks
- Prerequisite map
- Assessment blueprint
- SME review and approval
- Generated content artifacts
- Exportable program package
- Basic cohort setup
- Basic learner progress
- Quiz attempt tracking
- SME alert for struggling learner
- Program readiness and ROI/time-saved report

### Out of Scope for MVP

- B2C marketplace
- public course catalog
- payments
- full LMS replacement
- deep HRIS integration
- full proctoring browser
- Credly/Accredible integration
- advanced adaptive learning AI
- marketing automation

## 4. 12-Week B2B Pilot Build

### Weeks 1-2: Pilot Definition and Product Skeleton

- Product skeleton
- Corporate training project model
- User roles
- Program workflow states
- MVP UI shell
- Seed sample corporate training project

### Weeks 3-4: Requirement Intelligence

- Source upload
- Extracted source text
- Requirement summary generation
- Assumptions
- Conflicts
- Role tracks
- TOC generation
- Prerequisite map

### Weeks 5-6: SME Review and Locking

- SME comments
- Change request workflow
- TOC versioning
- Approve/reject states
- Locked approved TOC
- Audit events

### Weeks 7-8: Content Factory

- Slide outline
- Facilitator notes
- Learner handout
- Exercises
- Quiz bank
- Practical task
- Rubric
- Artifact review states

### Weeks 9-10: Lightweight Delivery and Signals

- Cohort setup
- Learner enrollment
- Module view
- Quiz attempt
- Progress events
- Help request
- SME alert rule

### Weeks 11-12: B2B Reporting and Pilot Readiness

- Program readiness report
- Learner progress report
- SME intervention log
- Assessment summary
- Time-saved/ROI report
- Pilot demo script

## 5. B2C Expansion Path

B2C should start only after B2B programs produce approved content and outcomes.

1. Public proof: certificate verification, program previews, anonymized outcomes.
2. Lead generation: free skill assessments, landing pages, waitlist.
3. Individual learning: paid learner enrollment and personal certificates.
4. Marketplace: reusable approved courses, partner content, revenue share.

## 6. Build Order with Codex and Copilot

1. Corporate training project workspace
2. Source upload and extraction
3. Requirement summary
4. TOC and role tracks
5. SME review comments
6. Approval and version locking
7. Content artifact generation
8. Exportable B2B program package
9. Cohort and learner enrollment
10. Progress and quiz tracking
11. SME alert
12. B2B reports
13. Skill validation and certificate
14. B2C public preview and verification
15. B2C assessments and catalog

## 7. Product Rules

- B2B is the initial commercial surface.
- B2C is a reuse and growth surface, not the starting point.
- SME approval is mandatory before content is published.
- Learner delivery uses only approved content.
- Certification requires evidence, not only completion.
- Broadcasting uses approved content and verified outcomes.
- AI output must be source-grounded and auditable.

