# Roles, Permissions, and Workflow State Machine

Date: 2026-05-28

## 1. Roles

### L&D Admin

Owns training project setup and delivery operations.

Can:

- create organization project
- upload sources
- trigger AI generation
- edit draft program metadata
- assign SMEs
- create cohorts
- enroll learners
- export approved packages and reports

Cannot:

- approve own SME-gated content unless also assigned SME
- issue certificate without required assessment evidence
- publish unapproved content

### SME

Owns subject quality and validation.

Can:

- review program plan
- comment on TOC, assumptions, conflicts, artifacts, assessments
- request changes
- approve or reject TOC
- approve or reject content artifacts
- review learner alerts
- evaluate practical submissions

Cannot:

- change locked TOC in place
- publish unapproved content directly to learners
- delete audit history

### Instructor

Supports live delivery and learner progress.

Can:

- view cohort progress
- view learner attempts
- create or resolve learner support notes
- escalate to SME
- view approved training content

Cannot:

- approve TOC or content artifacts
- change assessment blueprint
- issue certificates

### Learner

Completes assigned training.

Can:

- view assigned approved content
- complete modules
- attempt quizzes
- submit practical tasks
- request help
- view own progress and certificate

Cannot:

- see draft or review content
- see other learners
- modify scores or evaluations

### Manager/Viewer

Reviews progress and outcomes.

Can:

- view reports
- view cohort-level progress
- view certificate status
- export leadership reports if allowed

Cannot:

- edit content
- evaluate submissions
- approve artifacts
- manage learners unless also L&D admin

## 2. Permission Matrix

| Capability | L&D Admin | SME | Instructor | Learner | Manager |
| --- | --- | --- | --- | --- | --- |
| Create project | Yes | No | No | No | No |
| Upload source | Yes | Yes | No | No | No |
| Trigger AI generation | Yes | Yes | No | No | No |
| Comment on plan | Yes | Yes | Yes | No | View |
| Approve TOC | No | Yes | No | No | No |
| Lock TOC | System after SME approval | Yes | No | No | No |
| Generate content artifacts | Yes | Yes | No | No | No |
| Approve content artifacts | No | Yes | No | No | No |
| Create cohort | Yes | No | No | No | No |
| Enroll learners | Yes | No | No | No | No |
| View learner content | No | No | Yes | Yes | No |
| Evaluate practical task | No | Yes | Optional | No | No |
| Resolve SME alert | Yes | Yes | Yes | No | No |
| Export reports | Yes | No | Optional | No | Yes |

## 3. Project States

Project state:

1. `draft`
2. `sources_added`
3. `plan_generated`
4. `plan_in_review`
5. `plan_changes_requested`
6. `plan_approved`
7. `content_generating`
8. `content_in_review`
9. `content_approved`
10. `ready_for_delivery`
11. `in_delivery`
12. `completed`
13. `archived`

Rules:

- Project cannot move to `ready_for_delivery` until TOC and required artifacts are approved.
- Project cannot move to `in_delivery` until at least one cohort is created.
- Archived projects are read-only except for report export.

## 4. TOC Version States

TOC version state:

1. `draft`
2. `in_review`
3. `changes_requested`
4. `approved`
5. `locked`
6. `superseded`
7. `rejected`

Rules:

- `locked` is immutable.
- Editing a locked TOC creates a new draft version.
- Only one locked TOC can be the active source for delivery at a time.
- Content generation requires `approved` or `locked` TOC.

## 5. Content Artifact States

Artifact state:

1. `draft`
2. `in_review`
3. `changes_requested`
4. `approved`
5. `locked`
6. `superseded`
7. `rejected`

Artifact types:

- slide outline
- facilitator notes
- learner handout
- exercise
- quiz bank
- practical task
- rubric

Rules:

- Learners can see only locked or published artifacts.
- Reports can include draft artifact counts, but exports include approved artifacts by default.
- Rejected artifacts remain in audit history.

## 6. Cohort States

Cohort state:

1. `draft`
2. `scheduled`
3. `active`
4. `completed`
5. `cancelled`
6. `archived`

Rules:

- Cohort can be scheduled only from ready-for-delivery project.
- Learner enrollment is allowed in draft or scheduled.
- Learner progress events are recorded only in active cohort.

## 7. Learner Attempt States

Learner attempt state:

1. `not_started`
2. `in_progress`
3. `quiz_completed`
4. `task_submitted`
5. `under_evaluation`
6. `passed`
7. `failed`
8. `remediation_assigned`
9. `certificate_issued`

Rules:

- Certificate requires passed quiz, accepted practical task, and SME/evaluator approval.
- Failed learners can be assigned remediation.
- Certificate issue creates audit event.

## 8. SME Alert States

SME alert state:

1. `open`
2. `acknowledged`
3. `in_progress`
4. `resolved`
5. `dismissed`

Trigger rules:

- quiz failed twice
- help request submitted
- practical task rejected
- learner inactive beyond expected window
- instructor manually escalates

Alert must include:

- learner
- cohort
- module/topic
- trigger reason
- evidence
- recommended action
- resolver notes

## 9. Audit Events

Required audit events:

- project created
- source uploaded
- source excluded/included
- AI generation started
- AI generation completed
- TOC submitted for review
- comment added
- changes requested
- TOC approved
- TOC locked
- artifact generated
- artifact approved
- cohort created
- learner enrolled
- quiz submitted
- practical task submitted
- SME alert opened
- SME alert resolved
- certificate issued
- report exported

