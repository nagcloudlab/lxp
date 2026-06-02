# Initial Data Model

Date: 2026-05-28

This is the product-level data model for the B2B Corporate L&D MVP. It is intentionally stack-neutral.

## 1. Identity and Organization

### Organization

Represents a B2B customer.

Fields:

- id
- name
- industry
- region
- created_at
- status

### User

Represents a person using the platform.

Fields:

- id
- organization_id
- name
- email
- role
- status
- created_at

Roles:

- `ld_admin`
- `sme`
- `instructor`
- `learner`
- `manager`

## 2. Training Project

### TrainingProject

Represents a custom corporate training initiative.

Fields:

- id
- organization_id
- name
- business_goal
- target_department
- expected_learner_count
- target_completion_date
- status
- owner_user_id
- active_toc_version_id
- created_at
- updated_at

### SourceDocument

Uploaded or pasted source material.

Fields:

- id
- project_id
- uploaded_by_user_id
- filename
- source_type
- storage_uri
- extraction_status
- is_active_for_generation
- created_at

Supported MVP source types:

- `txt`
- `md`
- `pdf`
- `docx`

### ExtractedSource

Text extracted from a source document.

Fields:

- id
- source_document_id
- extracted_text
- extraction_metadata
- extraction_error
- created_at

## 3. Requirement Intelligence

### RequirementSummary

AI-generated summary of the training need.

Fields:

- id
- project_id
- toc_version_id
- summary_text
- business_context
- target_audience
- source_document_ids
- generation_metadata_id
- created_at

### Assumption

Requirement inferred but not explicitly confirmed.

Fields:

- id
- project_id
- toc_version_id
- text
- severity
- status
- source_document_ids
- created_at

Statuses:

- `open`
- `confirmed`
- `rejected`
- `resolved`

### Conflict

Contradiction or ambiguity found across sources.

Fields:

- id
- project_id
- toc_version_id
- text
- conflicting_source_document_ids
- severity
- status
- resolution_notes
- created_at

Statuses:

- `open`
- `resolved`
- `ignored`

### LearnerRole

Role-specific learner persona or track.

Fields:

- id
- project_id
- toc_version_id
- name
- description
- expected_starting_skill
- target_outcome

## 4. Program Plan

### TOCVersion

Versioned training program outline.

Fields:

- id
- project_id
- version_number
- title
- status
- source_document_ids
- generation_metadata_id
- approved_by_user_id
- approved_at
- locked_at
- created_at

### Module

Fields:

- id
- toc_version_id
- title
- description
- sequence_number
- estimated_minutes
- risk_level
- learning_outcomes

### Topic

Fields:

- id
- module_id
- title
- description
- sequence_number
- prerequisite_topic_ids
- role_relevance
- estimated_minutes

### AssessmentBlueprint

Defines how the program will validate learning.

Fields:

- id
- toc_version_id
- status
- quiz_strategy
- practical_task_strategy
- rubric_strategy
- pass_criteria
- source_document_ids
- generation_metadata_id

## 5. Review and Approval

### ReviewComment

Fields:

- id
- project_id
- target_type
- target_id
- comment_text
- created_by_user_id
- status
- created_at

Statuses:

- `open`
- `resolved`
- `dismissed`

### Approval

Fields:

- id
- target_type
- target_id
- approved_by_user_id
- approval_type
- decision
- notes
- created_at

Decisions:

- `approved`
- `rejected`
- `changes_requested`

## 6. Content Factory

### ContentArtifact

Generated or edited training asset.

Fields:

- id
- project_id
- toc_version_id
- artifact_type
- title
- content_body
- status
- source_document_ids
- generation_metadata_id
- approved_by_user_id
- approved_at
- created_at

Artifact types:

- `slide_outline`
- `facilitator_notes`
- `learner_handout`
- `exercise`
- `quiz_bank`
- `practical_task`
- `rubric`

### QuizQuestion

Fields:

- id
- content_artifact_id
- module_id
- topic_id
- question_text
- question_type
- options
- correct_answer
- explanation
- difficulty

### RubricCriterion

Fields:

- id
- content_artifact_id
- name
- description
- max_score
- passing_threshold

## 7. Delivery and Assessment

### Cohort

Fields:

- id
- project_id
- name
- status
- start_date
- end_date
- instructor_user_id
- created_at

### Enrollment

Fields:

- id
- cohort_id
- learner_user_id
- learner_role_id
- status
- enrolled_at

### ProgressEvent

Fields:

- id
- enrollment_id
- module_id
- topic_id
- event_type
- event_data
- created_at

Event types:

- `module_started`
- `module_completed`
- `quiz_started`
- `quiz_completed`
- `help_requested`
- `remediation_assigned`

### QuizAttempt

Fields:

- id
- enrollment_id
- content_artifact_id
- score
- max_score
- passed
- answers
- submitted_at

### TaskSubmission

Fields:

- id
- enrollment_id
- content_artifact_id
- submission_text
- attachment_uri
- status
- submitted_at

### Evaluation

Fields:

- id
- task_submission_id
- evaluator_user_id
- rubric_scores
- total_score
- passed
- notes
- evaluated_at

### SMEAlert

Fields:

- id
- project_id
- cohort_id
- enrollment_id
- module_id
- topic_id
- trigger_reason
- evidence
- recommended_action
- status
- assigned_to_user_id
- resolver_notes
- created_at
- resolved_at

### Certificate

Fields:

- id
- enrollment_id
- certificate_number
- title
- issued_to_user_id
- issued_by_user_id
- evidence_summary
- issued_at
- verification_status

## 8. AI and Audit

### GenerationMetadata

Stores traceability for every AI-generated artifact.

Fields:

- id
- project_id
- generation_type
- prompt_template_id
- prompt_version
- model_provider
- model_name
- input_source_ids
- output_schema_version
- generated_at
- generated_by_user_id

### AuditEvent

Fields:

- id
- organization_id
- project_id
- actor_user_id
- event_type
- target_type
- target_id
- event_data
- created_at

