import { Link, useParams } from "react-router-dom";
import { BookOpen, ChevronRight, CircleCheck, ListChecks, PenLine, Repeat, Target, Trophy } from "lucide-react";
import { Button, Card } from "../components/ui";
import Markdown from "../components/Markdown";
import ModuleStepper from "../components/module/ModuleStepper";
import ModuleStatusBadge from "../components/module/ModuleStatusBadge";
import { PASS_SCORE, STANDARD_LABELS } from "../constants/app";
import { getMarkdownHeadings, getModuleStatus, moduleCode } from "../lib/format";
import { mockChainState, mockGetModule, mockModules } from "../mocks/data";

export default function ModuleDetail() {
  const { moduleId } = useParams();

  // TODO: GET /api/modules/:moduleId → { module, questions }  (cần API trả thêm body_md)
  //       trạng thái (enrolled, best_score, passed) lấy từ GET /api/modules
  const { module, questions } = mockGetModule(moduleId);
  const progress = mockModules.find((m) => m.id === module.id);
  const status = getModuleStatus(progress, mockChainState.completeMask);
  const headings = getMarkdownHeadings(module.body_md);
  const loading = false;

  // TODO: POST /api/modules/:moduleId/enroll (204) rồi cập nhật trạng thái enrolled
  function handleEnroll() {}

  const stepIndex = { not_started: 0, in_progress: progress.best_score != null ? 1 : 0, passed: 2, onchain: 4 }[status];

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/dashboard">Tổng quan</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span>Module {moduleCode(module.id)}</span>
      </nav>

      <div className="page-header">
        <div>
          <div className="row" style={{ "--gap": "10px" }}>
            <span className="eyebrow">Module {moduleCode(module.id)}</span>
            <ModuleStatusBadge status={status} />
          </div>
          <h1 className="page-title mt-6">{module.title}</h1>
        </div>
      </div>

      <ModuleStepper current={stepIndex} />

      <div className="layout-aside mt-24">
        <article className="card lesson">
          <Markdown hideTitle>{module.body_md}</Markdown>

          <div className="lesson-end">
            <div>
              <h3>Đã đọc xong bài học?</h3>
              <p className="muted text-sm">
                Làm bài kiểm tra {questions.length} câu, đạt từ {PASS_SCORE} điểm để nhận chứng nhận.
              </p>
            </div>
            <Button to={`/modules/${module.id}/quiz`} icon={PenLine}>
              Làm bài kiểm tra
            </Button>
          </div>
        </article>

        <aside className="stack sticky-aside">
          <Card>
            <div className="stack" style={{ "--gap": "14px" }}>
              <ul className="check-list">
                <li>
                  <ListChecks size={16} className="subtle" aria-hidden="true" />
                  <span>{questions.length} câu hỏi trắc nghiệm</span>
                </li>
                <li>
                  <Target size={16} className="subtle" aria-hidden="true" />
                  <span>Đạt từ {PASS_SCORE}/100 điểm</span>
                </li>
                <li>
                  <Repeat size={16} className="subtle" aria-hidden="true" />
                  <span>Làm lại không giới hạn, tính điểm cao nhất</span>
                </li>
                <li>
                  <Trophy size={16} className="subtle" aria-hidden="true" />
                  <span>
                    Điểm cao nhất của bạn: <strong>{progress.best_score ?? "—"}</strong>
                  </span>
                </li>
              </ul>

              {progress.enrolled ? (
                <Button to={`/modules/${module.id}/quiz`} block icon={PenLine}>
                  {progress.best_score != null ? "Làm lại bài kiểm tra" : "Làm bài kiểm tra"}
                </Button>
              ) : (
                <Button block icon={BookOpen} onClick={handleEnroll} loading={loading}>
                  Ghi danh module này
                </Button>
              )}
              {progress.enrolled && (
                <p className="text-xs subtle row" style={{ "--gap": "6px" }}>
                  <CircleCheck size={13} aria-hidden="true" /> Bạn đã ghi danh module này
                </p>
              )}
              {status === "passed" && (
                <Button to={`/modules/${module.id}/claim`} variant="chain" block>
                  Nhận chứng nhận on-chain
                </Button>
              )}
            </div>
          </Card>

          {headings.length > 0 && (
            <Card title="Nội dung bài học">
              <ol className="toc">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          <Card title="Tiêu chuẩn liên quan" subtitle="Control được bài học này đáp ứng">
            <ul className="standard-list compact">
              {[...module.iso27001, ...module.soc2].map((c) => (
                <li key={c}>
                  <span className="tag">{c}</span>
                  <span>{STANDARD_LABELS[c]}</span>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </>
  );
}
