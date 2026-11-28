import { CircleCheck, Info, OctagonExclamationPoint, TriangleExclamationPoint, Blocks } from "lucide-react";

const ICONS = {
  info: Info,
  success: CircleCheck,
  warning: TriangleExclamationPoint,
  danger: OctagonExclamationPoint,
  chain: Blocks,
};

/** tone: info | success | warning | danger | chain */
export default function Alert({ tone = "info", title, icon, action, className = "", children }) {
  const Icon = icon ?? ICONS[tone];
  return (
    <div className={`alert alert-${tone} ${className}`} role={tone === "danger" ? "alert" : "status"}>
      <Icon size={18} className="alert-icon" aria-hidden="true" />
      <div className="alert-body">
        {title && <p className="alert-title">{title}</p>}
        {children && <div>{children}</div>}
      </div>
      {action && <div className="alert-action">{action}</div>}
    </div>
  );
}
