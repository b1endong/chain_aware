import { ArrowRight, BookOpen, Blocks, RotateCcw, Trophy } from "lucide-react";
import Button from "../ui/Button";
import ModuleStatusBadge from "./ModuleStatusBadge";
import StandardTags from "./StandardTags";
import { MODULE_META } from "../../constants/app";
import { getModuleStatus, moduleCode } from "../../lib/format";

/** Thẻ module trên trang tổng quan. module: 1 phần tử của GET /api/modules */
export default function ModuleCard({ module, completeMask }) {
  const status = getModuleStatus(module, completeMask);
  const meta = MODULE_META[module.id];
  const Icon = meta?.icon ?? BookOpen;

  // CTA phụ thuộc trạng thái
  const cta = {
    not_started: { label: "Bắt đầu học", to: `/modules/${module.id}`, icon: ArrowRight, variant: "primary" },
    in_progress: module.best_score != null
      ? { label: "Làm lại bài kiểm tra", to: `/modules/${module.id}/quiz`, icon: RotateCcw, variant: "primary" }
      : { label: "Tiếp tục học", to: `/modules/${module.id}`, icon: ArrowRight, variant: "primary" },
    passed: { label: "Ghi on-chain", to: `/modules/${module.id}/claim`, icon: Blocks, variant: "chain" },
    onchain: { label: "Xem lại bài học", to: `/modules/${module.id}`, icon: BookOpen, variant: "secondary" },
  }[status];

  return (
    <article className={`card module-card status-${status}`}>
      <div className="module-card-icon">
        <Icon size={22} aria-hidden="true" />
      </div>

      <div className="module-card-body">
        <div className="row" style={{ "--gap": "8px" }}>
          <span className="module-card-code">MODULE {moduleCode(module.id)}</span>
          <ModuleStatusBadge status={status} />
        </div>
        <h3 className="module-card-title">{module.title}</h3>
        {meta && <p className="module-card-summary">{meta.summary}</p>}
        <div className="module-card-meta">
          <span>
            <Trophy size={14} aria-hidden="true" />
            <span>
              Điểm cao nhất: <strong>{module.best_score ?? "—"}</strong>
              {module.best_score != null && "/100"}
            </span>
          </span>
          <StandardTags iso27001={module.iso27001} soc2={module.soc2} limit={3} />
        </div>
      </div>

      <div className="module-card-actions">
        <Button to={cta.to} variant={cta.variant} iconRight={cta.icon}>
          {cta.label}
        </Button>
      </div>
    </article>
  );
}
