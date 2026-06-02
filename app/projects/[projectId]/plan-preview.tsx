import type {
  ProgramPlan,
  ReviewComment,
  ReviewCommentTargetType,
  ReviewStatus
} from "@/lib/training-projects";
import { ReviewThread } from "./review-thread";

export function ProgramPlanPreview({
  onStatusChange,
  plan,
  canApprove,
  canComment,
  comments,
  commentDraft,
  onCommentDraftChange,
  onAddComment,
  onResolveComment,
  onDismissComment
}: {
  onStatusChange: (status: ReviewStatus) => void;
  plan: ProgramPlan;
  canApprove: boolean;
  canComment: boolean;
  comments: ReviewComment[];
  commentDraft: string;
  onCommentDraftChange: (value: string) => void;
  onAddComment: (
    targetType: ReviewCommentTargetType,
    targetId: string,
    targetLabel: string
  ) => void;
  onResolveComment: (commentId: string) => void;
  onDismissComment: (commentId: string) => void;
}) {
  return (
    <article className="plan-preview">
      <div className="source-preview-header">
        <div>
          <p className="eyebrow">Draft TOC v{plan.versionNumber}</p>
          <h2>{plan.title}</h2>
        </div>
        <span className="badge">{plan.status}</span>
      </div>

      <div className="review-actions" aria-label="Plan review actions">
        <button
          className="button secondary"
          disabled={plan.status === "locked"}
          onClick={() => onStatusChange("in_review")}
          type="button"
        >
          Submit for SME review
        </button>
        <button
          className="button secondary"
          disabled={!canApprove || plan.status === "locked"}
          onClick={() => onStatusChange("changes_requested")}
          type="button"
        >
          Request changes
        </button>
        <button
          className="button secondary"
          disabled={!canApprove || plan.status === "locked"}
          onClick={() => onStatusChange("approved")}
          type="button"
        >
          {canApprove ? "Approve TOC" : "Only SME can approve"}
        </button>
        <button
          className="button primary"
          disabled={!canApprove || plan.status !== "approved"}
          onClick={() => onStatusChange("locked")}
          type="button"
        >
          Lock approved TOC
        </button>
      </div>

      <ReviewThread
        comments={comments}
        targetType="plan"
        targetId={plan.id}
        targetLabel={`Plan v${plan.versionNumber}`}
        commentDraft={commentDraft}
        onDraftChange={onCommentDraftChange}
        onAdd={onAddComment}
        onResolve={onResolveComment}
        onDismiss={onDismissComment}
      />

      <section className="plan-section">
        <h3>Requirement summary</h3>
        <p className="muted">{plan.requirementSummary}</p>
      </section>

      <section className="plan-section">
        <h3>Assumptions</h3>
        <ul>
          {plan.assumptions.map((assumption) => (
            <li key={assumption.id}>
              <strong>{assumption.severity}:</strong> {assumption.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="plan-section">
        <h3>Conflicts</h3>
        {plan.conflicts.length > 0 ? (
          <ul>
            {plan.conflicts.map((conflict) => (
              <li key={conflict.id}>
                <strong>{conflict.severity}:</strong> {conflict.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No conflicts detected in active sources.</p>
        )}
      </section>

      <section className="plan-section">
        <h3>Role tracks</h3>
        <div className="mini-card-grid">
          {plan.learnerRoles.map((role) => (
            <div className="mini-card" key={role.id}>
              <strong>{role.name}</strong>
              <span>{role.targetOutcome}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="plan-section">
        <h3>Structured TOC</h3>
        <div className="module-list">
          {plan.modules.map((module) => (
            <article className="module-card" key={module.id}>
              <div>
                <span className="badge">{module.riskLevel} risk</span>
                <h4>
                  {module.sequenceNumber}. {module.title}
                </h4>
                <p className="muted">{module.description}</p>
              </div>
              <ul>
                {module.topics.map((topic) => (
                  <li key={topic.id}>{topic.title}</li>
                ))}
              </ul>
              <ReviewThread
                comments={comments}
                targetType="module"
                targetId={module.id}
                targetLabel={`Module ${module.sequenceNumber}: ${module.title}`}
                commentDraft={commentDraft}
                onDraftChange={onCommentDraftChange}
                onAdd={onAddComment}
                onResolve={onResolveComment}
                onDismiss={onDismissComment}
              />
            </article>
          ))}
        </div>
      </section>

      <section className="plan-section">
        <h3>Assessment blueprint</h3>
        <dl className="blueprint-list">
          <div>
            <dt>Quiz</dt>
            <dd>{plan.assessmentBlueprint.quizStrategy}</dd>
          </div>
          <div>
            <dt>Practical task</dt>
            <dd>{plan.assessmentBlueprint.practicalTaskStrategy}</dd>
          </div>
          <div>
            <dt>Pass criteria</dt>
            <dd>{plan.assessmentBlueprint.passCriteria}</dd>
          </div>
        </dl>
      </section>

      <section className="plan-section">
        <h3>Generation metadata</h3>
        <p className="muted">
          {plan.generationMetadata.modelProvider} /{" "}
          {plan.generationMetadata.promptTemplateId} / sources:{" "}
          {plan.sourceDocumentIds.length}
        </p>
      </section>
    </article>
  );
}
