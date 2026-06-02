# MVP Specification: B2B Corporate L&D Pilot

Date: 2026-05-28

## 1. MVP Objective

Build a pilot-ready B2B product that helps Corporate L&D teams convert messy training requirements into a SME-approved, role-specific training program package, then run a lightweight cohort and produce leadership-ready reports.

Primary promise:

> Reduce custom training program preparation from weeks to days while keeping SME control.

## 2. Target Users

- L&D admin: owns training project, uploads source material, exports package and reports.
- SME: validates TOC, content artifacts, assessments, and learner escalations.
- Instructor: monitors cohort progress and learner issues.
- Learner: completes assigned modules and assessments.
- Manager/viewer: reviews readiness, progress, outcomes, and ROI reports.

## 3. MVP Workflow

### Workflow A: Create Training Project

1. L&D admin creates a training project.
2. Admin enters program name, business goal, target department, expected learner count, target completion date, and known learner roles.
3. System creates project in `draft` status.

Acceptance:

- Project can be created with required metadata.
- Project dashboard shows setup progress.
- Audit event records project creation.

### Workflow B: Upload Source Material

1. Admin uploads source material.
2. Supported MVP source types: `.txt`, `.md`, `.pdf`, `.docx`.
3. System extracts text and stores extracted source.
4. Admin can mark a source as active or excluded.

Acceptance:

- Extracted text is visible for review.
- Failed extraction shows recoverable error.
- Excluded sources are not used for AI generation.

### Workflow C: Generate Program Plan

1. Admin triggers generation from active sources.
2. System generates:
   - requirement summary
   - assumptions
   - conflicts
   - learner roles
   - structured TOC
   - prerequisite map
   - assessment blueprint
3. Output is saved as a TOC version in `draft` status.

Acceptance:

- Generated plan references active source material.
- Conflicts and assumptions are separated from confirmed requirements.
- TOC includes modules, topics, learning outcomes, estimated duration, and role relevance.

### Workflow D: SME Review and Lock

1. SME reviews generated program plan.
2. SME can comment on modules, topics, assumptions, conflicts, and assessment blueprint.
3. SME can request changes, reject, or approve.
4. Approved TOC is locked.

Acceptance:

- Locked TOC cannot be silently edited.
- New changes create a new version.
- Content generation is allowed only from approved or explicitly selected TOC versions.

### Workflow E: Generate Content Package

1. Admin generates artifacts from locked TOC.
2. MVP artifacts:
   - slide outline
   - facilitator notes
   - learner handout
   - exercises
   - quiz bank
   - practical task
   - rubric
3. SME reviews each artifact.
4. Approved artifacts are added to the program package.

Acceptance:

- Each artifact has draft/review/approved/locked state.
- Each artifact stores source IDs and prompt version.
- Export includes only approved artifacts by default.

### Workflow F: Lightweight Cohort Delivery

1. Admin creates a cohort.
2. Admin enrolls learners manually.
3. Learners access approved modules.
4. Learners complete quiz attempts and submit practical tasks.
5. System records progress events.

Acceptance:

- Learners see only published approved content.
- Quiz attempts are stored with score and timestamp.
- Practical submissions are available to SME/instructor.

### Workflow G: SME Alert and Reporting

1. System creates SME alert when a learner fails a quiz twice, submits a help request, or misses expected progress.
2. Instructor/SME can resolve alert with notes.
3. Admin exports reports:
   - program readiness report
   - learner progress report
   - SME intervention log
   - assessment summary
   - estimated time-saved/ROI report

Acceptance:

- Alerts contain reason, learner, module/topic, and recommended action.
- Reports include project, cohort, content readiness, learner progress, assessment status, and SME time saved.

## 4. MVP Non-Goals

- Full LMS replacement
- B2C marketplace
- Payment processing
- Advanced proctoring
- Deep HRIS/LMS integrations
- Public course catalog
- Mobile app
- Fully autonomous AI publishing
- Advanced adaptive learning models

## 5. Success Metrics

- Time from source upload to generated TOC.
- Time from generated TOC to SME-approved locked TOC.
- Number of conflicts detected before content generation.
- SME revision cycles.
- Approved artifact rate.
- Time from locked TOC to exported program package.
- Learner completion rate in pilot cohort.
- SME alert count and resolution time.
- Report export count.

## 6. Pilot Demo Script

1. L&D admin creates "AI Tools for Business Teams" project.
2. Admin uploads messy training notes, stakeholder email, and learner profile.
3. System generates summary, assumptions, conflicts, role tracks, TOC, and assessment blueprint.
4. SME comments on a weak topic and requests revision.
5. System generates revised TOC.
6. SME approves and locks TOC.
7. Admin generates content package.
8. SME approves artifacts.
9. Admin creates cohort and enrolls learners.
10. Learner completes module and fails quiz twice.
11. SME alert is created and resolved.
12. Admin exports readiness and ROI report.

