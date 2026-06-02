import {
  filterCommentsByTarget,
  countOpenComments
} from "@/lib/review-comments";
import type {
  ReviewComment,
  ReviewCommentTargetType
} from "@/lib/training-projects";

export function ReviewThread({
  comments,
  targetType,
  targetId,
  targetLabel,
  commentDraft,
  onDraftChange,
  onAdd,
  onResolve,
  onDismiss
}: {
  comments: ReviewComment[];
  targetType: ReviewCommentTargetType;
  targetId: string;
  targetLabel: string;
  commentDraft: string;
  onDraftChange: (value: string) => void;
  onAdd: (
    targetType: ReviewCommentTargetType,
    targetId: string,
    targetLabel: string
  ) => void;
  onResolve: (commentId: string) => void;
  onDismiss: (commentId: string) => void;
}) {
  const targetComments = filterCommentsByTarget(comments, targetType, targetId);
  const openCount = countOpenComments(targetComments);

  return (
    <div className="review-thread">
      <details>
        <summary>
          Comments {openCount > 0 ? <span className="badge">{openCount} open</span> : null}
        </summary>
        <div className="comment-form">
          <textarea
            className="comment-input"
            placeholder="Add SME review comment..."
            rows={2}
            value={commentDraft}
            onChange={(e) => onDraftChange(e.target.value)}
          />
          <button
            className="button secondary"
            disabled={!commentDraft.trim()}
            onClick={() => onAdd(targetType, targetId, targetLabel)}
            type="button"
          >
            Add comment
          </button>
        </div>
        {targetComments.length > 0 ? (
          <ul className="comment-list">
            {targetComments.map((c) => (
              <li
                className={`comment-item comment-${c.status}`}
                key={c.id}
              >
                <div className="comment-header">
                  <strong>{c.authorName}</strong>
                  <span className="badge">{c.status}</span>
                  <small>{new Date(c.createdAt).toLocaleString()}</small>
                </div>
                <p>{c.body}</p>
                {c.status === "open" ? (
                  <div className="comment-actions">
                    <button
                      className="button secondary"
                      onClick={() => onResolve(c.id)}
                      type="button"
                    >
                      Resolve
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => onDismiss(c.id)}
                      type="button"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : c.resolvedBy ? (
                  <small className="muted">
                    {c.status === "resolved" ? "Resolved" : "Dismissed"} by{" "}
                    {c.resolvedBy}
                  </small>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </details>
    </div>
  );
}
