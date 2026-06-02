"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  buildB2BLeadershipReport,
  createB2BReportFilename
} from "@/lib/b2b-report-builder";
import {
  generateContentArtifacts,
  generateContentArtifactsAsync
} from "@/lib/content-artifact-generator";
import {
  createCohort,
  createEnrollment,
  createProgressEvent,
  createQuizAttempt,
  createSMEAlert,
  shouldCreateQuizFailureAlert
} from "@/lib/delivery-workflow";
import {
  generateProgramPlan,
  generateProgramPlanAsync
} from "@/lib/program-plan-generator";
import {
  buildProgramPackageExport,
  createProgramPackageFilename
} from "@/lib/program-package-exporter";
import { hasPermission } from "@/lib/auth";
import { deriveProjectStatus, getStatusLabel, getStatusColor } from "@/lib/project-status";
import {
  createAuditEvent,
  formatAuditEventLabel
} from "@/lib/audit-trail";
import {
  createReviewComment,
  resolveComment,
  dismissComment
} from "@/lib/review-comments";
import type {
  AuditEvent,
  ContentArtifact,
  Cohort,
  Enrollment,
  ProgramPlan,
  QuizAttempt,
  ReviewComment,
  ReviewCommentTargetType,
  ReviewStatus,
  SMEAlert,
  SourceDocument,
  TrainingProject
} from "@/lib/training-projects";
import {
  loadContentArtifacts,
  saveContentArtifacts
} from "../content-artifact-storage";
import { loadDeliveryState, saveDeliveryState } from "../delivery-storage";
import { loadProgramPlans, saveProgramPlans } from "../program-plan-storage";
import { extractSourceDocument } from "../source-extraction";
import { loadSourceDocuments, saveSourceDocuments } from "../source-storage";
import { loadTrainingProjects } from "../project-storage";
import { DeliveryWorkspace } from "./delivery-workspace";
import { ProgramPlanPreview } from "./plan-preview";
import { ReviewThread } from "./review-thread";
import { RoleSwitcher, useCurrentUser } from "../../role-switcher";
import { loadAuditLog, saveAuditLog } from "../audit-log-storage";
import {
  loadReviewComments,
  saveReviewComments
} from "../review-comment-storage";

export function ProjectDetailClient({ projectId }: { projectId: string }) {
  const currentUser = useCurrentUser();
  const canUpload = hasPermission(currentUser.role, "upload_source");
  const canGenerate = hasPermission(currentUser.role, "trigger_generation");
  const canApprove = hasPermission(currentUser.role, "approve_toc");
  const canApproveArtifacts = hasPermission(currentUser.role, "approve_artifacts");
  const canComment = hasPermission(currentUser.role, "comment_on_plan");
  const canCreateCohort = hasPermission(currentUser.role, "create_cohort");
  const canEnroll = hasPermission(currentUser.role, "enroll_learners");
  const canExport = hasPermission(currentUser.role, "export_reports");
  const canViewAudit = hasPermission(currentUser.role, "view_audit_log");
  const [projects] = useState<TrainingProject[]>(loadTrainingProjects);
  const [sources, setSources] = useState<SourceDocument[]>(() =>
    loadSourceDocuments(projectId)
  );
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    sources[0]?.id ?? null
  );
  const [plans, setPlans] = useState<ProgramPlan[]>(() =>
    loadProgramPlans(projectId)
  );
  const [artifacts, setArtifacts] = useState<ContentArtifact[]>(() =>
    loadContentArtifacts(projectId)
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    plans[0]?.id ?? null
  );
  const [deliveryState, setDeliveryState] = useState(() =>
    loadDeliveryState(projectId)
  );
  const [cohortInput, setCohortInput] = useState({
    name: "Pilot Cohort",
    startDate: "",
    endDate: "",
    instructorName: ""
  });
  const [enrollmentInput, setEnrollmentInput] = useState({
    learnerName: "",
    learnerEmail: "",
    learnerRoleId: ""
  });
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(
    deliveryState.cohorts[0]?.id ?? null
  );
  const [reviewComments, setReviewComments] = useState<ReviewComment[]>(() =>
    loadReviewComments(projectId)
  );
  const [auditLog, setAuditLog] = useState<AuditEvent[]>(() =>
    loadAuditLog(projectId)
  );
  const [commentDraft, setCommentDraft] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isGeneratingArtifacts, setIsGeneratingArtifacts] = useState(false);
  const [generationProvider, setGenerationProvider] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{
    status: string;
    message: string;
    model?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/ai-status")
      .then((res) => res.json())
      .then(setAiStatus)
      .catch(() =>
        setAiStatus({ status: "offline", message: "Could not check AI status" })
      );
  }, []);

  const project = useMemo(
    () => projects.find((candidate) => candidate.id === projectId),
    [projectId, projects]
  );

  if (!project) {
    return (
      <main className="main">
        <section className="section">
          <p className="eyebrow">Project detail</p>
          <h1>Project not found</h1>
          <p className="lead">
            This draft project is stored locally in the browser used to create
            it. Return to the workspace to create or open a project.
          </p>
          <Link className="button primary" href="/projects">
            Back to projects
          </Link>
        </section>
      </main>
    );
  }

  const selectedSource =
    sources.find((source) => source.id === selectedSourceId) ?? sources[0];
  const activeSourceCount = sources.filter(
    (source) => source.isActiveForGeneration
  ).length;
  const activeSources = sources.filter(
    (source) =>
      source.isActiveForGeneration && source.extractionStatus === "extracted"
  );
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const lockedPlan = plans.find((plan) => plan.status === "locked");
  const visibleArtifacts = lockedPlan
    ? artifacts.filter((artifact) => artifact.planId === lockedPlan.id)
    : [];
  const approvedArtifactCount = visibleArtifacts.filter(
    (artifact) => artifact.status === "approved"
  ).length;
  const canExportPackage = Boolean(lockedPlan && approvedArtifactCount > 0);
  const projectStatus = deriveProjectStatus({
    sources,
    plans,
    artifacts,
    cohorts: deliveryState.cohorts
  });
  const leadershipReport = project
    ? buildB2BLeadershipReport({
        project,
        lockedPlan,
        artifacts,
        cohorts: deliveryState.cohorts,
        enrollments: deliveryState.enrollments,
        progressEvents: deliveryState.progressEvents,
        quizAttempts: deliveryState.quizAttempts,
        smeAlerts: deliveryState.smeAlerts
      })
    : null;
  const selectedCohort =
    deliveryState.cohorts.find((cohort) => cohort.id === selectedCohortId) ??
    deliveryState.cohorts[0];
  const cohortEnrollments = selectedCohort
    ? deliveryState.enrollments.filter(
        (enrollment) => enrollment.cohortId === selectedCohort.id
      )
    : [];

  function appendAudit(input: Omit<Parameters<typeof createAuditEvent>[0], "projectId">) {
    const event = createAuditEvent({ ...input, projectId });
    const next = [event, ...auditLog];
    setAuditLog(next);
    saveAuditLog(projectId, next);
  }

  async function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setIsExtracting(true);
    const extractedSources = await Promise.all(
      files.map((file) => extractSourceDocument(projectId, file))
    );
    const nextSources = [...extractedSources, ...sources];

    setSources(nextSources);
    saveSourceDocuments(projectId, nextSources);
    setSelectedSourceId(extractedSources[0]?.id ?? selectedSourceId);
    setIsExtracting(false);
    event.target.value = "";

    for (const source of extractedSources) {
      appendAudit({
        eventType: source.extractionStatus === "failed" ? "source_extraction_failed" : "source_extracted",
        actor: "L&D Admin",
        targetType: "source",
        targetId: source.id,
        targetLabel: source.filename
      });
    }
  }

  function toggleSourceActive(sourceId: string) {
    const nextSources = sources.map((source) =>
      source.id === sourceId
        ? {
            ...source,
            isActiveForGeneration: !source.isActiveForGeneration
          }
        : source
    );

    setSources(nextSources);
    saveSourceDocuments(projectId, nextSources);
  }

  async function handleGeneratePlan() {
    if (!project || activeSources.length === 0) {
      return;
    }

    setIsGeneratingPlan(true);
    setGenerationError(null);

    try {
      const result = await generateProgramPlanAsync({
        project,
        activeSources,
        versionNumber: plans.length + 1
      });
      const nextPlans = [result.plan, ...plans];

      setPlans(nextPlans);
      saveProgramPlans(projectId, nextPlans);
      setSelectedPlanId(result.plan.id);
      setGenerationProvider(result.provider);
      appendAudit({
        eventType: "plan_generated",
        actor: "L&D Admin",
        targetType: "plan",
        targetId: result.plan.id,
        targetLabel: `Plan v${result.plan.versionNumber}`,
        details: { provider: result.provider }
      });
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Plan generation failed"
      );
    } finally {
      setIsGeneratingPlan(false);
    }
  }

  function updatePlanStatus(planId: string, status: ReviewStatus) {
    const nextPlans = plans.map((plan) =>
      plan.id === planId ? { ...plan, status } : plan
    );

    setPlans(nextPlans);
    saveProgramPlans(projectId, nextPlans);
    appendAudit({
      eventType: "plan_status_changed",
      actor: status === "approved" || status === "locked" ? "SME" : "L&D Admin",
      targetType: "plan",
      targetId: planId,
      targetLabel: `Plan status → ${status}`,
      details: { newStatus: status }
    });
  }

  async function handleGenerateArtifacts() {
    if (!lockedPlan) {
      return;
    }

    setIsGeneratingArtifacts(true);
    setGenerationError(null);

    try {
      const existingTypes = new Set(
        artifacts
          .filter((artifact) => artifact.planId === lockedPlan.id)
          .map((artifact) => artifact.artifactType)
      );
      const result = await generateContentArtifactsAsync({
        projectId,
        plan: lockedPlan
      });
      const newArtifacts = result.artifacts.filter(
        (artifact) => !existingTypes.has(artifact.artifactType)
      );
      const nextArtifacts = [...newArtifacts, ...artifacts];

      setArtifacts(nextArtifacts);
      saveContentArtifacts(projectId, nextArtifacts);
      setGenerationProvider(result.provider);
      appendAudit({
        eventType: "artifact_generated",
        actor: "L&D Admin",
        targetType: "artifact",
        targetLabel: `${newArtifacts.length} artifacts generated`,
        details: { count: newArtifacts.length, provider: result.provider }
      });
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Artifact generation failed"
      );
    } finally {
      setIsGeneratingArtifacts(false);
    }
  }

  function updateArtifactStatus(artifactId: string, status: ReviewStatus) {
    const nextArtifacts = artifacts.map((artifact) =>
      artifact.id === artifactId
        ? {
            ...artifact,
            status,
            approvedAt: status === "approved" ? new Date().toISOString() : undefined
          }
        : artifact
    );

    setArtifacts(nextArtifacts);
    saveContentArtifacts(projectId, nextArtifacts);
    const artifact = artifacts.find((a) => a.id === artifactId);
    appendAudit({
      eventType: "artifact_status_changed",
      actor: status === "approved" ? "SME" : "L&D Admin",
      targetType: "artifact",
      targetId: artifactId,
      targetLabel: `${artifact?.title ?? artifactId} → ${status}`,
      details: { newStatus: status }
    });
  }

  function handleAddComment(
    targetType: ReviewCommentTargetType,
    targetId: string,
    targetLabel: string
  ) {
    if (!commentDraft.trim()) return;

    const comment = createReviewComment({
      projectId,
      targetType,
      targetId,
      targetLabel,
      authorRole: "sme",
      authorName: project?.assignedSme ?? "SME",
      body: commentDraft.trim()
    });
    const next = [comment, ...reviewComments];
    setReviewComments(next);
    saveReviewComments(projectId, next);
    setCommentDraft("");
    appendAudit({
      eventType: "comment_added",
      actor: comment.authorName,
      targetType,
      targetId,
      targetLabel
    });
  }

  function handleResolveComment(commentId: string) {
    const next = reviewComments.map((c) =>
      c.id === commentId ? resolveComment(c, "L&D Admin") : c
    );
    setReviewComments(next);
    saveReviewComments(projectId, next);
    appendAudit({
      eventType: "comment_resolved",
      actor: "L&D Admin",
      targetType: "comment",
      targetId: commentId
    });
  }

  function handleDismissComment(commentId: string) {
    const next = reviewComments.map((c) =>
      c.id === commentId ? dismissComment(c, "L&D Admin") : c
    );
    setReviewComments(next);
    saveReviewComments(projectId, next);
    appendAudit({
      eventType: "comment_dismissed",
      actor: "L&D Admin",
      targetType: "comment",
      targetId: commentId
    });
  }

  function handleExportPackage() {
    if (!project || !lockedPlan || !canExportPackage) {
      return;
    }

    const programPackage = buildProgramPackageExport({
      project,
      lockedPlan,
      artifacts
    });
    const blob = new Blob([JSON.stringify(programPackage, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createProgramPackageFilename(project.name);
    link.click();
    URL.revokeObjectURL(url);
    appendAudit({
      eventType: "package_exported",
      actor: "L&D Admin",
      targetType: "package",
      targetLabel: project.name
    });
  }

  function handleExportReport() {
    if (!project || !leadershipReport) {
      return;
    }

    const blob = new Blob([JSON.stringify(leadershipReport, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createB2BReportFilename(project.name);
    link.click();
    URL.revokeObjectURL(url);
    appendAudit({
      eventType: "report_exported",
      actor: "L&D Admin",
      targetType: "report",
      targetLabel: project.name
    });
  }

  function persistDelivery(nextState: typeof deliveryState) {
    setDeliveryState(nextState);
    saveDeliveryState(projectId, nextState);
  }

  function handleCreateCohort(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lockedPlan || !cohortInput.name.trim()) {
      return;
    }

    const cohort = createCohort({
      projectId,
      planId: lockedPlan.id,
      name: cohortInput.name,
      startDate: cohortInput.startDate,
      endDate: cohortInput.endDate,
      instructorName: cohortInput.instructorName
    });
    const nextState = {
      ...deliveryState,
      cohorts: [cohort, ...deliveryState.cohorts]
    };

    persistDelivery(nextState);
    setSelectedCohortId(cohort.id);
    appendAudit({
      eventType: "cohort_created",
      actor: "L&D Admin",
      targetType: "cohort",
      targetId: cohort.id,
      targetLabel: cohort.name
    });
  }

  function handleEnrollLearner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCohort || !lockedPlan || !enrollmentInput.learnerName.trim()) {
      return;
    }

    const learnerRole =
      lockedPlan.learnerRoles.find(
        (role) => role.id === enrollmentInput.learnerRoleId
      ) ?? lockedPlan.learnerRoles[0];

    if (!learnerRole) {
      return;
    }

    const enrollment = createEnrollment({
      projectId,
      cohortId: selectedCohort.id,
      learnerName: enrollmentInput.learnerName,
      learnerEmail: enrollmentInput.learnerEmail,
      learnerRoleId: learnerRole.id,
      learnerRoleName: learnerRole.name
    });

    persistDelivery({
      ...deliveryState,
      enrollments: [enrollment, ...deliveryState.enrollments]
    });
    setEnrollmentInput({
      learnerName: "",
      learnerEmail: "",
      learnerRoleId: learnerRole.id
    });
    appendAudit({
      eventType: "enrollment_created",
      actor: "L&D Admin",
      targetType: "enrollment",
      targetId: enrollment.id,
      targetLabel: enrollment.learnerName
    });
  }

  function addProgressEvent(event: Omit<Parameters<typeof createProgressEvent>[0], "projectId" | "cohortId">) {
    if (!selectedCohort) {
      return;
    }

    const progressEvent = createProgressEvent({
      projectId,
      cohortId: selectedCohort.id,
      ...event
    });

    persistDelivery({
      ...deliveryState,
      progressEvents: [progressEvent, ...deliveryState.progressEvents]
    });
  }

  function addQuizAttempt(enrollment: Enrollment, moduleId: string, score: number) {
    if (!selectedCohort) {
      return;
    }

    const attempt = createQuizAttempt({
      projectId,
      cohortId: selectedCohort.id,
      enrollmentId: enrollment.id,
      moduleId,
      score,
      maxScore: 100
    });
    const nextAttempts = [attempt, ...deliveryState.quizAttempts];
    const alerts = [...deliveryState.smeAlerts];

    if (
      !attempt.passed &&
      shouldCreateQuizFailureAlert({
        attempts: nextAttempts,
        enrollmentId: enrollment.id,
        moduleId
      }) &&
      !alerts.some(
        (alert) =>
          alert.enrollmentId === enrollment.id &&
          alert.moduleId === moduleId &&
          alert.triggerReason === "quiz_failed_twice" &&
          alert.status === "open"
      )
    ) {
      alerts.unshift(
        createSMEAlert({
          projectId,
          cohortId: selectedCohort.id,
          enrollmentId: enrollment.id,
          moduleId,
          triggerReason: "quiz_failed_twice",
          evidence: `${enrollment.learnerName} failed quiz twice for this module.`
        })
      );
    }

    persistDelivery({
      ...deliveryState,
      quizAttempts: nextAttempts,
      progressEvents: [
        createProgressEvent({
          projectId,
          cohortId: selectedCohort.id,
          enrollmentId: enrollment.id,
          moduleId,
          eventType: "quiz_completed",
          eventData: { score, passed: attempt.passed }
        }),
        ...deliveryState.progressEvents
      ],
      smeAlerts: alerts
    });
  }

  function requestHelp(enrollment: Enrollment, moduleId: string) {
    if (!selectedCohort) {
      return;
    }

    persistDelivery({
      ...deliveryState,
      progressEvents: [
        createProgressEvent({
          projectId,
          cohortId: selectedCohort.id,
          enrollmentId: enrollment.id,
          moduleId,
          eventType: "help_requested"
        }),
        ...deliveryState.progressEvents
      ],
      smeAlerts: [
        createSMEAlert({
          projectId,
          cohortId: selectedCohort.id,
          enrollmentId: enrollment.id,
          moduleId,
          triggerReason: "help_requested",
          evidence: `${enrollment.learnerName} requested help.`
        }),
        ...deliveryState.smeAlerts
      ]
    });
  }

  function resolveAlert(alertId: string) {
    persistDelivery({
      ...deliveryState,
      smeAlerts: deliveryState.smeAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "resolved",
              resolvedAt: new Date().toISOString()
            }
          : alert
      )
    });
  }

  return (
    <main className="main">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">Training project</p>
          <h1>{project.name}</h1>
          <p className="lead">{project.businessGoal}</p>
          <span className={`badge badge-${getStatusColor(projectStatus)}`}>
            {getStatusLabel(projectStatus)}
          </span>
        </div>
        <div className="header-actions">
          <RoleSwitcher />
          <Link className="button secondary" href="/projects">
            Back to projects
          </Link>
        </div>
      </section>

      {aiStatus ? (
        <section className="ai-status-bar" aria-label="AI provider status">
          <span
            className={`ai-dot ${aiStatus.status === "ready" ? "ai-dot-ready" : "ai-dot-offline"}`}
          />
          <span>
            {aiStatus.status === "ready"
              ? `Local AI ready (${aiStatus.model})`
              : aiStatus.status === "missing_model"
                ? `Ollama running but model not found — run: ollama pull ${aiStatus.model}`
                : "Ollama offline — generation will use placeholder stubs"}
          </span>
        </section>
      ) : null}

      <section className="sections">
        <article className="section">
          <p className="eyebrow">Status</p>
          <h2>{project.status}</h2>
          <p className="muted">
            Next: upload source material for requirement intelligence.
          </p>
        </article>
        <article className="section">
          <p className="eyebrow">Audience</p>
          <h2>{project.expectedLearnerCount} learners</h2>
          <p className="muted">{project.learnerRoles}</p>
        </article>
        <article className="section">
          <p className="eyebrow">SME</p>
          <h2>{project.assignedSme}</h2>
          <p className="muted">Approval owner for TOC and artifacts.</p>
        </article>
      </section>

      <section className="source-workspace" aria-label="Source material">
        <div className="source-upload-panel">
          <div>
            <p className="eyebrow">Requirement intelligence</p>
            <h2>Upload source material</h2>
            <p className="muted">
              Supported MVP files: .txt, .md, .pdf, and .docx. Active sources
              will be used for future AI generation.
            </p>
          </div>
          <label className={`file-drop${canUpload ? "" : " disabled"}`}>
            <span>{canUpload ? "Choose source files" : "Upload not permitted for your role"}</span>
            <input
              accept=".txt,.md,.pdf,.docx"
              disabled={!canUpload}
              multiple
              onChange={handleFilesSelected}
              type="file"
            />
          </label>
          {isExtracting ? (
            <p className="muted">Extracting source text...</p>
          ) : (
            <p className="muted">
              {sources.length} sources uploaded, {activeSourceCount} active for
              generation.
            </p>
          )}
        </div>

        <div className="source-list">
          {sources.length === 0 ? (
            <p className="muted">
              Upload the first source document to prepare requirement
              intelligence.
            </p>
          ) : (
            sources.map((source) => (
              <button
                className={
                  source.id === selectedSource?.id
                    ? "source-item selected"
                    : "source-item"
                }
                key={source.id}
                onClick={() => setSelectedSourceId(source.id)}
                type="button"
              >
                <span>
                  <strong>{source.filename}</strong>
                  <small>
                    {source.sourceType.toUpperCase()} -{" "}
                    {source.extractionStatus}
                  </small>
                </span>
                <span className="badge">
                  {source.isActiveForGeneration ? "active" : "excluded"}
                </span>
              </button>
            ))
          )}
        </div>

        <article className="source-preview">
          {selectedSource ? (
            <>
              <div className="source-preview-header">
                <div>
                  <p className="eyebrow">Extracted preview</p>
                  <h2>{selectedSource.filename}</h2>
                </div>
                <button
                  className="button secondary"
                  disabled={selectedSource.extractionStatus === "failed"}
                  onClick={() => toggleSourceActive(selectedSource.id)}
                  type="button"
                >
                  {selectedSource.isActiveForGeneration
                    ? "Exclude source"
                    : "Use source"}
                </button>
              </div>
              {selectedSource.extractionStatus === "failed" ? (
                <p className="field-error">{selectedSource.extractionError}</p>
              ) : (
                <pre>{selectedSource.extractedText}</pre>
              )}
            </>
          ) : (
            <p className="muted">No source selected.</p>
          )}
        </article>
      </section>

      <section className="plan-review" aria-label="Program plan review">
        <div className="plan-toolbar">
          <div>
            <p className="eyebrow">Program plan</p>
            <h2>Requirement intelligence output</h2>
            <p className="muted">
              Generate a draft plan from active sources. This is deterministic
              for now and will later be replaced by the AI provider interface.
            </p>
          </div>
          <button
            className="button primary"
            disabled={!canGenerate || activeSources.length === 0 || isGeneratingPlan}
            onClick={handleGeneratePlan}
            type="button"
          >
            {isGeneratingPlan ? "Generating with AI..." : canGenerate ? "Generate draft plan" : "Generation not permitted"}
          </button>
        </div>

        {generationError ? (
          <p className="field-error">{generationError}</p>
        ) : null}

        {generationProvider ? (
          <p className="muted">
            Last generation used: <strong>{generationProvider === "ollama" ? "Ollama (local AI)" : "deterministic stub (Ollama not running)"}</strong>
          </p>
        ) : null}

        {isGeneratingPlan ? (
          <p className="muted">
            Calling local AI model to analyze your sources and generate a structured program plan. This may take 30-60 seconds...
          </p>
        ) : null}

        {plans.length > 0 ? (
          <div className="plan-layout">
            <aside className="plan-versions" aria-label="Plan versions">
              {plans.map((plan) => (
                <button
                  className={
                    plan.id === selectedPlan?.id
                      ? "source-item selected"
                      : "source-item"
                  }
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  type="button"
                >
                  <span>
                    <strong>Version {plan.versionNumber}</strong>
                    <small>{plan.status}</small>
                  </span>
                  <span className="badge">{plan.modules.length} modules</span>
                </button>
              ))}
            </aside>

            {selectedPlan ? (
              <ProgramPlanPreview
                onStatusChange={(status) =>
                  updatePlanStatus(selectedPlan.id, status)
                }
                plan={selectedPlan}
                canApprove={canApprove}
                canComment={canComment}
                comments={reviewComments}
                commentDraft={commentDraft}
                onCommentDraftChange={setCommentDraft}
                onAddComment={handleAddComment}
                onResolveComment={handleResolveComment}
                onDismissComment={handleDismissComment}
              />
            ) : null}
          </div>
        ) : (
          <p className="muted">
            No program plan yet. Upload and activate at least one source, then
            generate the first draft.
          </p>
        )}
      </section>

      <section className="artifact-review" aria-label="Content artifacts">
        <div className="plan-toolbar">
          <div>
            <p className="eyebrow">Content factory</p>
            <h2>Generate artifacts from locked TOC</h2>
            <p className="muted">
              Content generation is available only after SME approval and TOC
              locking. Approved artifacts will become the exportable B2B program
              package.
            </p>
          </div>
          <button
            className="button primary"
            disabled={!canGenerate || !lockedPlan || isGeneratingArtifacts}
            onClick={handleGenerateArtifacts}
            type="button"
          >
            {isGeneratingArtifacts ? "Generating 7 artifacts with AI..." : canGenerate ? "Generate content package" : "Generation not permitted"}
          </button>
        </div>

        {isGeneratingArtifacts ? (
          <p className="muted">
            Generating 7 content artifacts with local AI. Each artifact is generated separately — this may take 2-5 minutes...
          </p>
        ) : !lockedPlan ? (
          <p className="muted">
            Lock an approved TOC before generating content artifacts.
          </p>
        ) : visibleArtifacts.length === 0 ? (
          <p className="muted">
            Locked TOC v{lockedPlan.versionNumber} is ready. Generate the first
            content package.
          </p>
        ) : (
          <div className="artifact-grid">
            {visibleArtifacts.map((artifact) => (
              <article className="artifact-card" key={artifact.id}>
                <div>
                  <p className="eyebrow">{formatArtifactType(artifact.artifactType)}</p>
                  <h3>{artifact.title}</h3>
                  <span className="badge">{artifact.status}</span>
                </div>
                <pre>{artifact.contentBody}</pre>
                <div className="review-actions">
                  <button
                    className="button secondary"
                    disabled={artifact.status === "approved"}
                    onClick={() => updateArtifactStatus(artifact.id, "in_review")}
                    type="button"
                  >
                    Submit review
                  </button>
                  <button
                    className="button secondary"
                    disabled={!canApproveArtifacts || artifact.status === "approved"}
                    onClick={() =>
                      updateArtifactStatus(artifact.id, "changes_requested")
                    }
                    type="button"
                  >
                    Request changes
                  </button>
                  <button
                    className="button primary"
                    disabled={!canApproveArtifacts}
                    onClick={() => updateArtifactStatus(artifact.id, "approved")}
                    type="button"
                  >
                    {canApproveArtifacts ? "Approve artifact" : "Only SME can approve"}
                  </button>
                </div>
                <ReviewThread
                  comments={reviewComments}
                  targetType="artifact"
                  targetId={artifact.id}
                  targetLabel={artifact.title}
                  commentDraft={commentDraft}
                  onDraftChange={setCommentDraft}
                  onAdd={handleAddComment}
                  onResolve={handleResolveComment}
                  onDismiss={handleDismissComment}
                />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="package-export" aria-label="Program package export">
        <div className="plan-toolbar">
          <div>
            <p className="eyebrow">B2B package</p>
            <h2>Export approved program package</h2>
            <p className="muted">
              The export includes the locked TOC, role tracks, assessment
              blueprint, readiness summary, and approved artifacts only.
            </p>
          </div>
          <button
            className="button primary"
            disabled={!canExport || !canExportPackage}
            onClick={handleExportPackage}
            type="button"
          >
            {canExport ? "Download JSON package" : "Export not permitted"}
          </button>
        </div>

        <div className="metrics">
          <article className="metric">
            <strong>{lockedPlan ? `v${lockedPlan.versionNumber}` : "-"}</strong>
            <span className="muted">Locked TOC</span>
          </article>
          <article className="metric">
            <strong>{approvedArtifactCount}/7</strong>
            <span className="muted">Approved artifacts</span>
          </article>
          <article className="metric">
            <strong>{canExportPackage ? "Yes" : "No"}</strong>
            <span className="muted">Export available</span>
          </article>
          <article className="metric">
            <strong>{approvedArtifactCount === 7 ? "Ready" : "Partial"}</strong>
            <span className="muted">Delivery readiness</span>
          </article>
        </div>

        <p className="muted">
          {lockedPlan
            ? approvedArtifactCount === 7
              ? "All required artifacts are approved. The package is ready for delivery preparation."
              : "You can export a partial package for review, but delivery readiness requires all seven artifacts approved."
            : "Lock an approved TOC before export is available."}
        </p>
      </section>

      <section className="delivery-panel" aria-label="Cohort delivery">
        <div className="plan-toolbar">
          <div>
            <p className="eyebrow">Delivery</p>
            <h2>Lightweight cohort delivery</h2>
            <p className="muted">
              Create a cohort from the locked TOC, enroll learners, record
              progress, capture quiz signals, and trigger SME alerts.
            </p>
          </div>
        </div>

        <div className="delivery-grid">
          <form className="form-panel" onSubmit={handleCreateCohort}>
            <h3>Create cohort</h3>
            <label>
              Cohort name
              <input
                value={cohortInput.name}
                onChange={(event) =>
                  setCohortInput((current) => ({
                    ...current,
                    name: event.target.value
                  }))
                }
              />
            </label>
            <div className="field-row">
              <label>
                Start date
                <input
                  type="date"
                  value={cohortInput.startDate}
                  onChange={(event) =>
                    setCohortInput((current) => ({
                      ...current,
                      startDate: event.target.value
                    }))
                  }
                />
              </label>
              <label>
                End date
                <input
                  type="date"
                  value={cohortInput.endDate}
                  onChange={(event) =>
                    setCohortInput((current) => ({
                      ...current,
                      endDate: event.target.value
                    }))
                  }
                />
              </label>
            </div>
            <label>
              Instructor
              <input
                value={cohortInput.instructorName}
                onChange={(event) =>
                  setCohortInput((current) => ({
                    ...current,
                    instructorName: event.target.value
                  }))
                }
                placeholder="Instructor name"
              />
            </label>
            <button className="button primary" disabled={!canCreateCohort || !lockedPlan} type="submit">
              {canCreateCohort ? "Create cohort" : "Not permitted"}
            </button>
          </form>

          <section className="project-list">
            <h3>Cohorts</h3>
            {deliveryState.cohorts.length === 0 ? (
              <p className="muted">No cohorts yet.</p>
            ) : (
              deliveryState.cohorts.map((cohort) => (
                <button
                  className={
                    cohort.id === selectedCohort?.id
                      ? "source-item selected"
                      : "source-item"
                  }
                  key={cohort.id}
                  onClick={() => setSelectedCohortId(cohort.id)}
                  type="button"
                >
                  <span>
                    <strong>{cohort.name}</strong>
                    <small>{cohort.status}</small>
                  </span>
                  <span className="badge">{cohort.instructorName || "TBD"}</span>
                </button>
              ))
            )}
          </section>
        </div>

        {selectedCohort && lockedPlan ? (
          <DeliveryWorkspace
            alerts={deliveryState.smeAlerts}
            canEnroll={canEnroll}
            enrollments={cohortEnrollments}
            enrollmentInput={enrollmentInput}
            lockedPlan={lockedPlan}
            onAddProgress={addProgressEvent}
            onEnroll={handleEnrollLearner}
            onEnrollmentInputChange={setEnrollmentInput}
            onQuizAttempt={addQuizAttempt}
            onRequestHelp={requestHelp}
            onResolveAlert={resolveAlert}
            progressEvents={deliveryState.progressEvents}
            quizAttempts={deliveryState.quizAttempts}
            selectedCohort={selectedCohort}
          />
        ) : (
          <p className="muted">
            Lock a TOC and create a cohort to start delivery tracking.
          </p>
        )}
      </section>

      {leadershipReport ? (
        <section className="reports-panel" aria-label="B2B reports">
          <div className="plan-toolbar">
            <div>
              <p className="eyebrow">Reports</p>
              <h2>B2B leadership report</h2>
              <p className="muted">
                Summarizes program readiness, learner progress, assessment
                status, SME interventions, and estimated preparation time saved.
              </p>
            </div>
            <button
              className="button primary"
              disabled={!canExport}
              onClick={handleExportReport}
              type="button"
            >
              {canExport ? "Download leadership report" : "Export not permitted"}
            </button>
          </div>

          <div className="metrics">
            <article className="metric">
              <strong>{leadershipReport.readiness.readinessStatus}</strong>
              <span className="muted">Readiness</span>
            </article>
            <article className="metric">
              <strong>{leadershipReport.cohortProgress.learnerCount}</strong>
              <span className="muted">Learners</span>
            </article>
            <article className="metric">
              <strong>{leadershipReport.assessmentSummary.passRate}%</strong>
              <span className="muted">Quiz pass rate</span>
            </article>
            <article className="metric">
              <strong>
                {leadershipReport.smeInterventions.openAlertCount}
              </strong>
              <span className="muted">Open SME alerts</span>
            </article>
          </div>

          <div className="report-grid">
            <article className="mini-card">
              <strong>Program readiness</strong>
              <span>
                {leadershipReport.readiness.approvedArtifactCount}/
                {leadershipReport.readiness.requiredArtifactCount} artifacts
                approved.
              </span>
            </article>
            <article className="mini-card">
              <strong>Learner progress</strong>
              <span>
                {leadershipReport.cohortProgress.moduleCompletedCount} module
                completions and {leadershipReport.cohortProgress.helpRequestCount}{" "}
                help requests recorded.
              </span>
            </article>
            <article className="mini-card">
              <strong>Assessment summary</strong>
              <span>
                {leadershipReport.assessmentSummary.passedQuizCount} passed,{" "}
                {leadershipReport.assessmentSummary.failedQuizCount} failed
                quiz attempts.
              </span>
            </article>
            <article className="mini-card">
              <strong>ROI estimate</strong>
              <span>{leadershipReport.roiEstimate.summary}</span>
            </article>
          </div>
        </section>
      ) : null}

      <section className="workflow">
        <div>
          <p className="eyebrow">Next workflow</p>
          <h2>Requirement intelligence queue</h2>
        </div>
        {[
          "Approve all content artifacts",
          "Export B2B program package",
          "Create lightweight cohort",
          "Track learner progress",
          "Generate readiness and ROI report"
        ].map((item, index) => (
          <article className="workflow-step" key={item}>
            <span className="step-number">{index + 1}</span>
            <div>
              <h3>{item}</h3>
              <p className="muted">Planned for the next implementation slice.</p>
            </div>
          </article>
        ))}
      </section>

      {canViewAudit ? <section className="audit-log-section" aria-label="Audit trail">
        <div className="plan-toolbar">
          <div>
            <p className="eyebrow">Governance</p>
            <h2>Audit trail</h2>
            <p className="muted">
              Every action on this project is logged for traceability and
              compliance.
            </p>
          </div>
          <span className="badge">{auditLog.length} events</span>
        </div>

        {auditLog.length > 0 ? (
          <div className="audit-log">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event</th>
                  <th>Actor</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.slice(0, 50).map((event) => (
                  <tr key={event.id}>
                    <td>
                      <small>{new Date(event.createdAt).toLocaleString()}</small>
                    </td>
                    <td>{formatAuditEventLabel(event)}</td>
                    <td>{event.actor}</td>
                    <td>
                      <small>{event.targetLabel ?? event.targetId ?? "—"}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">No events logged yet. Actions will appear here as you use the project.</p>
        )}
      </section> : null}
    </main>
  );
}

function formatArtifactType(type: ContentArtifact["artifactType"]) {
  return type
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

