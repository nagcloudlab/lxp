# AI-Powered LXP Big Roadmap

Date: 2026-05-28

## 1. North Star

Build an AI-powered learning orchestration platform that turns raw training needs into SME-approved, adaptive, skill-validated learning programs.

Build execution assumption:

> The product will be built primarily with Codex and GitHub Copilot, using small, testable, documented vertical slices. See `CODEX_COPILOT_BUILD_PLAN.md` for the engineering execution plan.

The platform should become the operating system for large-scale training:

- Understand what must be taught.
- Generate and organize the learning program.
- Keep SMEs in control.
- Deliver learning adaptively.
- Detect struggling learners early.
- Validate actual skills.
- Reuse approved assets for business growth.

The core product principle remains:

> Lock WHAT before HOW.

Meaning:

1. Lock the training objective.
2. Lock learner roles and required skills.
3. Lock the structured TOC.
4. Lock assessments and success criteria.
5. Then generate content, labs, and delivery plans.

## 2. Strategic Product Bet

Do not compete head-on as a generic LMS.

Compete as the missing intelligence layer between:

- customer requirements
- SMEs
- training content
- learner delivery
- assessment evidence
- business reporting

The strongest product category is:

> AI Learning Program Orchestration

This is broader than AI authoring and more outcome-driven than a traditional LMS.

## 3. Target Customers

### Primary Early Customers

Corporate L&D teams that repeatedly build custom programs for departments, roles, transformation initiatives, compliance needs, or capability academies.

They feel the pain most clearly because every program has:

- new requirements
- SME dependency
- content pressure
- delivery timelines
- assessment expectations
- reporting needs

### Strong Customer Segments

- Corporate L&D teams
- Technical training providers
- Government training agencies
- IT services companies with internal academies
- Certification bodies
- Universities running professional programs
- EdTech companies needing AI-assisted course operations

### Avoid Initially

- Small creators selling simple online courses
- Schools needing only basic LMS functionality
- Pure compliance-training buyers who only care about completion tracking
- Customers whose main requirement is surveillance-heavy proctoring
- B2C course marketplace users before B2B programs and content are validated

### Expansion Sequence

The commercial sequence is B2B first, then B2C:

1. Corporate L&D custom program creation
2. Corporate cohort delivery and skill validation
3. B2B reporting, ROI, and stakeholder proof
4. Public previews, skill assessments, and certificate verification
5. B2C enrollment and marketplace only after reusable B2B-approved content exists

## 4. Product Roadmap Overview

The roadmap should be built in six horizons:

1. Foundation: requirement intelligence and SME-approved TOC
2. Content factory: AI-assisted content, exercises, assessments, and review
3. Delivery engine: learner portal, adaptive paths, and progress tracking
4. Skill validation: practical tasks, rubrics, certification, and evidence
5. Intelligence loop: analytics, recommendations, cohort insights, and improvement
6. Scale layer: integrations, marketplace, broadcasting, enterprise governance

## 5. Horizon 1: Requirement Intelligence

### Goal

Convert messy input into a validated learning plan.

This is the first major differentiator. Most platforms start after the course exists. This platform should start before the course exists.

### Core Capabilities

- Upload documents, PDFs, transcripts, notes, spreadsheets, and links.
- Capture stakeholder requirements.
- Extract topics, roles, skills, constraints, risks, and assumptions.
- Detect contradictions across sources.
- Generate structured TOC.
- Generate learner-role tracks.
- Generate prerequisite map.
- Generate assessment blueprint.
- Support SME comments, revision requests, and approval.
- Lock approved versions.

### Main Users

- Program manager
- SME
- Instructional designer
- Training operations lead

### Outputs

- Training objective
- Target audience definition
- Role-specific tracks
- Topic list
- Module sequence
- Prerequisite map
- Risk-weighted topic order
- Assumption and conflict log
- Assessment blueprint
- Approved TOC version

### Success Metrics

- Requirement-to-approved-TOC time
- SME review time saved
- Number of conflicts detected early
- Number of revision cycles before approval
- Percentage of generated TOCs accepted with minor edits

### Build Priority

Highest. This is the product wedge.

## 6. Horizon 2: AI Content Factory

### Goal

Generate high-quality training assets from the approved TOC, with SME control.

### Core Capabilities

- Generate lesson plans.
- Generate slide outlines.
- Generate facilitator notes.
- Generate learner handouts.
- Generate quizzes.
- Generate practical exercises.
- Generate case studies.
- Generate assignment rubrics.
- Generate lab instructions.
- Generate pre-test and post-test.
- Maintain source references.
- Support SME review by section.
- Track version history.

### Content Types

- PPT outline
- PDF notes
- Web lessons
- Quizzes
- Labs
- Case studies
- Assignments
- Rubrics
- FAQs
- Learner summaries
- Trainer guides

### SME Workflow

Every generated artifact should have states:

- Draft
- In review
- Needs changes
- Approved
- Locked
- Archived

### Success Metrics

- Approved content generated per day
- SME edit distance
- Approval rate by artifact type
- Time from approved TOC to delivery-ready package
- Content reuse rate

### Build Priority

Very high. This creates visible value quickly.

## 7. Horizon 3: Learning Delivery Engine

### Goal

Deliver learning paths adaptively and detect learner risk early.

### Core Capabilities

- Learner portal
- Batch/cohort management
- Role-based enrollment
- Pre-test
- Adaptive module assignment
- Quiz and checkpoint delivery
- Progress tracking
- Remediation recommendations
- Learner help requests
- SME escalation
- Instructor dashboard
- Cohort dashboard

### Adaptive Logic: Version 1

Start with explainable rules:

- If pre-test is low, add foundation module.
- If learner passes a topic strongly, skip basics.
- If quiz score is below threshold, assign remediation.
- If repeated attempts exceed threshold, alert SME.
- If time-on-task is abnormal, flag for review.
- If learner asks multiple help questions on the same topic, mark topic as difficult.

Do not begin with opaque AI personalization. Enterprises will trust explainable adaptation first.

### Success Metrics

- Learner completion rate
- Remediation success rate
- Number of early interventions
- Reduction in final assessment failures
- Topic-level difficulty heatmap
- Learner satisfaction

### Build Priority

High, but after Horizon 1 and 2 prove the workflow.

## 8. Horizon 4: Skill Validation and Certification

### Goal

Prove that learners can perform the skill, not just finish content.

### Core Capabilities

- Practical assessments
- Scenario-based tasks
- Lab submissions
- Project submissions
- SME/evaluator rubrics
- Automated grading where reliable
- Manual review where judgment is needed
- Certificate generation
- Skill evidence profile
- Audit trail

### Certification Model

Separate these levels clearly:

- Attended
- Completed
- Passed quiz
- Completed lab
- Demonstrated skill
- Certified

This distinction is important for enterprise credibility.

### Proctoring Strategy

Do not make proctoring the core of the product.

Use it selectively for high-stakes certification:

- identity check
- screen monitoring
- camera monitoring
- suspicious-event flagging
- human review
- appeal workflow

The better long-term differentiation is practical skill evidence, not surveillance.

### Success Metrics

- Practical assessment pass rate
- Evaluator review time
- Certificate credibility
- Appeal rate
- False-positive rate for proctoring flags
- Employer/customer acceptance of certificates

### Build Priority

Medium-high. Important for credibility, but should follow content and delivery.

## 9. Horizon 5: Intelligence Loop

### Goal

Use delivery data to improve future training design.

### Core Capabilities

- Topic difficulty analysis
- Learner-risk prediction
- Content effectiveness scoring
- SME intervention analytics
- Assessment quality analysis
- Cohort comparison
- Skill-gap trends
- Training ROI reports
- Auto-suggestions for content improvement

### Examples

- "Module 3 has high failure and high time-on-task. Review examples and remediation."
- "Learners from Role A struggle with Topic B. Add prerequisite content."
- "Assessment question 12 has high incorrect rate despite strong topic completion. Review question quality."
- "SME interventions are concentrated in one lab. Improve lab instructions."

### Success Metrics

- Reduced repeat learner failures
- Reduced SME escalations over time
- Improved assessment pass rate
- Improved learner confidence
- Improved content approval speed in future cohorts

### Build Priority

High after enough delivery data exists.

## 10. Horizon 6: Scale Layer

### Goal

Make the platform enterprise-ready and commercially scalable.

### Core Capabilities

- Multi-tenant organization support
- Role-based access control
- Audit logs
- Data retention policies
- Localization
- White labeling
- LMS export
- HRIS integration
- SSO
- API access
- Content marketplace
- Template marketplace
- Partner workspace

### Integration Strategy

Support integration instead of forcing replacement.

Important integrations:

- LMS
- HRIS
- SSO/identity
- calendar
- video meeting/transcript tools
- document repositories
- content libraries
- assessment tools
- CRM/marketing tools

### Success Metrics

- Enterprise deployment time
- Integration setup time
- Number of active organizations
- Number of reusable templates
- Partner-generated revenue
- Expansion revenue

## 11. Broadcasting and Growth Engine

### Goal

Turn approved training assets and delivery outcomes into business-facing material.

This is especially useful for training providers, academies, and organizations that need stakeholder visibility.

### Core Capabilities

- Course preview generator
- Landing page draft generator
- Email campaign draft generator
- Social content generator
- Case study generator
- Outcome report generator
- ROI report generator
- Testimonial workflow

### Important Rule

Broadcasting should only use:

- approved content
- anonymized learner data
- verified outcomes
- approved customer references

### Success Metrics

- Number of generated campaigns
- Lead conversion rate
- Reuse rate of approved content
- Time saved in marketing handoff
- Customer approval rate for case studies

### Build Priority

Later. It is strategically interesting, but it should not distract from the core learning workflow.

## 12. MVP Definition

The MVP should prove the most unique B2B workflow:

> Corporate training inputs -> structured TOC -> SME approval -> generated B2B program package.

### MVP Features

- Project workspace
- Input upload
- Source extraction
- Requirement summary
- Conflict and assumption log
- TOC generation
- Role-track generation
- SME comments
- Approval workflow
- Version locking
- Content draft generation
- Quiz/rubric generation
- Export to PDF/PPT outline/JSON
- B2B readiness report

### MVP Non-Goals

- Full LMS replacement
- Full proctoring system
- Full adaptive AI engine
- Marketing automation
- Complex marketplace
- Deep HRIS integration

### MVP Users

- Admin/program manager
- SME
- Instructional designer
- Corporate L&D manager

### MVP Demo Story

1. Corporate L&D admin uploads a messy set of training inputs.
2. Platform extracts requirements and detects conflicts.
3. Platform proposes TOC, role tracks, prerequisites, and assessment plan.
4. SME comments and requests changes.
5. Bot revises.
6. SME approves and locks the TOC.
7. Platform generates first-pass lesson content, exercises, quizzes, and rubrics.
8. Admin exports a delivery-ready B2B program package and readiness report.

## 13. 24-Month Roadmap

### Months 0-3: Discovery and Prototype

Objectives:

- Validate Corporate L&D customer pain.
- Build clickable prototype.
- Test requirement-to-TOC workflow.
- Interview SMEs, L&D heads, capability academy owners, and instructional designers.

Deliverables:

- Product narrative
- ICP definition
- Prototype screens
- Sample generated TOCs
- SME review workflow mock
- 5-10 customer discovery interviews

Decision gate:

- Do Corporate L&D buyers agree that requirement-to-approved-TOC is painful and valuable?

### Months 4-6: MVP Build

Objectives:

- Build working requirement intelligence engine.
- Build SME review workflow.
- Build content draft generation.

Deliverables:

- Workspace
- Input upload
- Requirement extraction
- TOC generator
- Conflict log
- SME comments
- Approval states
- Content package generation
- Export

Decision gate:

- Can a real training team reduce planning/content preparation time meaningfully?

### Months 7-9: Pilot Delivery

Objectives:

- Run pilots with 2-3 real customers or internal training programs.
- Measure SME time saved and output quality.

Deliverables:

- Pilot onboarding
- Analytics dashboard v1
- Better review tools
- Content versioning
- Template library v1
- Feedback loop

Decision gate:

- Are customers willing to pay for the workflow after using it?

### Months 10-12: Delivery Engine v1

Objectives:

- Add learner delivery and basic adaptive paths.

Deliverables:

- Learner portal
- Batch enrollment
- Pre-test
- Module delivery
- Quizzes
- Remediation rules
- Learner progress dashboard
- SME escalation alerts

Decision gate:

- Does the platform improve learner outcomes or reduce instructor firefighting?

### Months 13-15: Skill Validation

Objectives:

- Add practical assignments and certification evidence.

Deliverables:

- Lab/task builder
- Rubric evaluation
- Submission workflow
- Certificate generation
- Skill evidence report
- Evaluator dashboard

Decision gate:

- Can customers trust the certificate as evidence of competence?

### Months 16-18: Enterprise Readiness

Objectives:

- Prepare for larger organizations.

Deliverables:

- Multi-tenant support
- RBAC
- Audit logs
- SSO
- Data retention settings
- Admin reports
- API/export improvements
- Localization foundation

Decision gate:

- Can a medium-to-large organization deploy without excessive manual support?

### Months 19-21: Intelligence Loop

Objectives:

- Turn learner data into program improvement.

Deliverables:

- Topic difficulty heatmaps
- Learner risk scoring
- Assessment quality analytics
- Content improvement recommendations
- Cohort comparison
- SME intervention analytics

Decision gate:

- Does the platform get better after each cohort?

### Months 22-24: Scale and Expansion

Objectives:

- Expand integrations, templates, partner workflows, and broadcasting.

Deliverables:

- LMS integrations
- CRM/marketing export
- Template marketplace v1
- Partner workspace
- Course preview generator
- Case study generator
- ROI report generator

Decision gate:

- Can the platform expand from one training team to many teams or customers?

## 14. Commercial Roadmap

### Stage 1: Services-Assisted B2B Product

Use the platform with close Corporate L&D customers while manually supporting setup, prompt refinement, and SME workflow.

Best for:

- learning fast
- understanding real workflows
- building trust
- collecting benchmark data

### Stage 2: Productized Pilot

Offer paid pilots:

- fixed duration
- defined training program
- measurable output
- clear before/after comparison

Pilot promise:

- reduce requirement-to-content time
- improve SME efficiency
- produce approved training package

### Stage 3: B2B SaaS Subscription

Price by:

- organizations/workspaces
- active programs
- active learners
- AI generation volume
- SME/reviewer seats
- enterprise modules

### Stage 4: B2B Platform, Then B2C Marketplace

Enable:

- partners
- reusable templates
- industry-specific program packs
- assessment packs
- content-service providers
- white-label deployments
- public course previews
- individual learner assessments
- consumer enrollment after B2B proof

## 15. Pricing Direction

Possible pricing packages:

### Starter

For small teams proving the workflow.

- limited workspaces
- limited AI generation
- basic SME workflow
- export

### Professional

For training providers and L&D teams.

- more programs
- team collaboration
- versioning
- content templates
- analytics
- learner delivery

### Enterprise

For large organizations.

- SSO
- RBAC
- audit logs
- integrations
- custom retention
- private knowledge base
- advanced analytics
- dedicated support

### Add-ons

- proctoring
- broadcasting
- custom integrations
- white label
- high-volume AI usage
- premium assessment workflows

## 16. Key Metrics

### Product Metrics

- Time to approved TOC
- Time to delivery-ready content
- SME hours saved
- Content approval rate
- Revision cycles
- Learner completion rate
- Learner remediation success
- Assessment pass rate
- SME escalation rate
- Content reuse rate

### Business Metrics

- Pilot conversion rate
- Monthly active workspaces
- Programs created per customer
- Learners trained per customer
- Expansion revenue
- Churn
- Gross margin after AI costs
- Support hours per deployment

### Trust Metrics

- Hallucination/error rate found by SME
- Source citation coverage
- Approval audit completeness
- Assessment fairness issues
- Proctoring false-positive rate
- Data/privacy incidents

## 17. Important Product Principles

### Human approval is a feature, not a weakness

For serious training, customers need confidence. SME validation should be visible, auditable, and central.

### Source-grounded generation only

The platform should prefer grounded, traceable content over generic AI output.

### Completion is not competence

The platform must separate activity tracking from skill evidence.

### Explainable adaptation first

Start with rule-based, visible adaptation before moving to more complex learner models.

### Integrate before replacing

Many customers already have LMS and HR systems. Let the platform work with them.

### Build for repeatability

The platform should get better with every program:

- better templates
- better rubrics
- better prerequisite maps
- better remediation
- better SME workflows

## 18. Biggest Risks and Mitigations

### Risk: Too broad

Mitigation:

Start with requirement intelligence and SME-approved content generation.

### Risk: AI quality is not trusted

Mitigation:

Use source grounding, review states, audit trails, and SME approval.

### Risk: Competing with giant LMS/LXP vendors

Mitigation:

Position as orchestration and intelligence, not generic course hosting.

### Risk: Proctoring creates privacy concerns

Mitigation:

Lead with practical skill validation. Add proctoring only where needed.

### Risk: Enterprise integrations slow everything down

Mitigation:

Start with export/import and APIs. Add deep integrations after pilots prove value.

### Risk: AI costs reduce margin

Mitigation:

Use caching, templates, staged generation, smaller models where possible, and charge for generation volume.

## 19. What To Build First

Build these first:

1. Project workspace
2. Input upload and extraction
3. Requirement summary
4. Conflict/assumption log
5. TOC generator
6. Role-track generator
7. SME comments and approvals
8. Version locking
9. Content/assessment draft generator
10. Export package

Do not build these first:

- full LMS
- mobile app
- proctoring
- marketplace
- marketing automation
- complex analytics
- deep HR integrations

## 20. Best Roadmap Narrative

Year 1:

> We help training teams go from messy requirements to SME-approved content packages in days instead of weeks.

Year 2:

> We help them deliver those programs adaptively, validate skills, and improve every cohort using learner data.

Year 3:

> We become the learning orchestration layer across enterprise systems, partners, and reusable content ecosystems.

