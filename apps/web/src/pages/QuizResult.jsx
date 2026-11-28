import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Blocks, CircleCheck, CircleX, RotateCcw } from "lucide-react";
import { Badge, Button, Card, ProgressBar, ScoreRing } from "../components/ui";
import ModuleStepper from "../components/module/ModuleStepper";
import { PASS_SCORE, TOPIC_LABELS } from "../constants/app";
import { moduleCode } from "../lib/format";
import { mockGetModule, mockModules, mockQuestionLookup, mockQuizResult } from "../mocks/data";

export default function QuizResult() {
  const { moduleId } = useParams();

  // TODO: kết quả lấy từ response của POST /api/modules/:moduleId/quiz
  //       → { attemptId, score, passed, results: [{ question_id, topic, option_id, correct }] }
  //       (truyền qua navigate state hoặc store). Nội dung câu hỏi lấy từ dữ liệu getModule đã tải ở trang Quiz.
  const { module } = mockGetModule(moduleId);
  const result = mockQuizResult(moduleId);
  const lookup = mockQuestionLookup(moduleId);
  const bestScore = Math.max(result.score, mockModules.find((m) => m.id === module.id)?.best_score ?? 0);

  const correctCount = result.results.filter((r) => r.correct).length;

  // Thống kê theo chủ đề (topic)
  const topics = Object.values(
    result.results.reduce((acc, r) => {
      acc[r.topic] ??= { topic: r.topic, total: 0, correct: 0 };
      acc[r.topic].total += 1;
      acc[r.topic].correct += r.correct ? 1 : 0;
      return acc;
    }, {}),
  );

  return (
    <>
      <Link to={`/modules/${module.id}`} className="back-link">
        <ArrowLeft size={16} aria-hidden="true" /> Quay lại bài học
      </Link>

      <div className="page-header">
        <div>
          <p className="eyebrow">Kết quả · Module {moduleCode(module.id)}</p>
          <h1 className="page-title">{module.title}</h1>
        </div>
      </div>

      <ModuleStepper current={result.passed ? 2 : 1} />

      <div className="layout-aside mt-24">
        <div className="stack" style={{ "--gap": "24px" }}>
          <section className={`card result-hero ${result.passed ? "is-passed" : "is-failed"}`}>
            <ScoreRing score={result.score} passed={result.passed} />
            <div className="result-hero-body">
              {result.passed ? (
                <Badge tone="success" icon={CircleCheck}>
                  Đạt
                </Badge>
              ) : (
                <Badge tone="danger" icon={CircleX}>
                  Chưa đạt
                </Badge>
              )}
              <h2>{result.passed ? "Chúc mừng, bạn đã vượt qua bài kiểm tra!" : "Chưa đạt lần này — thử lại nhé!"}</h2>
              <p className="muted">
                {result.passed
                  ? "Bước tiếp theo: nhận chữ ký chứng nhận và ghi kết quả lên blockchain."
                  : `Bạn cần tối thiểu ${PASS_SCORE} điểm. Ôn lại các chủ đề còn yếu bên dưới rồi làm lại.`}
              </p>
              <dl className="result-stats">
                <div>
                  <dt>Trả lời đúng</dt>
                  <dd>
                    {correctCount}/{result.results.length}
                  </dd>
                </div>
                <div>
                  <dt>Điểm đạt</dt>
                  <dd>{PASS_SCORE}</dd>
                </div>
                <div>
                  <dt>Điểm cao nhất</dt>
                  <dd>{bestScore}</dd>
                </div>
              </dl>
              <div className="row">
                {result.passed ? (
                  <>
                    <Button to={`/modules/${module.id}/claim`} variant="chain" icon={Blocks}>
                      Nhận chứng nhận on-chain
                    </Button>
                    <Button to={`/modules/${module.id}/quiz`} variant="secondary" icon={RotateCcw}>
                      Làm lại để cải thiện điểm
                    </Button>
                  </>
                ) : (
                  <>
                    <Button to={`/modules/${module.id}/quiz`} icon={RotateCcw}>
                      Làm lại bài kiểm tra
                    </Button>
                    <Button to={`/modules/${module.id}`} variant="secondary" icon={BookOpen}>
                      Ôn lại bài học
                    </Button>
                  </>
                )}
              </div>
            </div>
          </section>

          <Card title="Xem lại đáp án" subtitle={`${correctCount} đúng · ${result.results.length - correctCount} sai`} padded={false}>
            <ol className="review">
              {result.results.map((r, i) => {
                const q = lookup.get(r.question_id);
                const picked = q?.options.find((o) => o.id === r.option_id);
                return (
                  <li key={r.question_id} className={`review-item ${r.correct ? "is-correct" : "is-wrong"}`}>
                    <span className="review-icon">
                      {r.correct ? <CircleCheck size={20} aria-label="Đúng" /> : <CircleX size={20} aria-label="Sai" />}
                    </span>
                    <div className="review-body">
                      <div className="review-meta">
                        <span>Câu {i + 1}</span>
                        <span className="tag">{TOPIC_LABELS[r.topic] ?? r.topic}</span>
                      </div>
                      <p className="review-prompt">{q?.prompt}</p>
                      <p className="review-answer">
                        <span className="subtle">Bạn chọn: </span>
                        {picked ? picked.label : <em>Bỏ trống</em>}
                      </p>
                      {/* explanation hiện chưa có trong response API — hiển thị nếu backend bổ sung */}
                      {q?.explanation && <p className="review-expl">{q.explanation}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>

        <aside className="stack sticky-aside">
          <Card title="Theo chủ đề" subtitle="Tỉ lệ trả lời đúng">
            <ul className="topic-list">
              {topics.map((t) => {
                const ratio = t.correct / t.total;
                return (
                  <li key={t.topic}>
                    <div className="row row-between text-sm">
                      <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                      <span className="tabular fw-600">
                        {t.correct}/{t.total}
                      </span>
                    </div>
                    <ProgressBar
                      value={t.correct}
                      max={t.total}
                      size="sm"
                      tone={ratio === 1 ? "success" : ratio < 0.5 ? "danger" : "primary"}
                      label={TOPIC_LABELS[t.topic] ?? t.topic}
                    />
                  </li>
                );
              })}
            </ul>
          </Card>
        </aside>
      </div>
    </>
  );
}
