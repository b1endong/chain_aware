import { Check, X } from "lucide-react";

export function Timeline({ children, className = "" }) {
  return <ol className={`timeline ${className}`}>{children}</ol>;
}

/** status: done | current | upcoming | error */
export function TimelineItem({ index, title, description, status = "upcoming", children }) {
  return (
    <li className={`timeline-item is-${status}`} aria-current={status === "current" ? "step" : undefined}>
      <span className="timeline-marker">
        {status === "done" ? <Check size={16} strokeWidth={3} /> : status === "error" ? <X size={16} strokeWidth={3} /> : index}
      </span>
      <div>
        <div className="timeline-head">
          <h3 className="timeline-title">{title}</h3>
          {description && <p className="timeline-desc">{description}</p>}
        </div>
        <div className="timeline-content">{children}</div>
      </div>
    </li>
  );
}
