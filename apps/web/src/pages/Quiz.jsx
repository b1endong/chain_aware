import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Info, Send } from "lucide-react";
import { Alert, Button, ProgressBar } from "../components/ui";
import ModuleStepper from "../components/module/ModuleStepper";
import { PASS_SCORE } from "../constants/app";
import { moduleCode } from "../lib/format";
import { mockGetModule } from "../mocks/data";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function Quiz() {
  const { moduleId } = useParams();

  // TODO: GET /api/modules/:moduleId → { module, questions } (câu hỏi & lựa chọn đã được xáo trộn ở server)
  const { module, questions } = mockGetModule(moduleId);

  // TODO: state { [question_id]: option_id } — gắn onChange cho các radio bên dưới
  const answers = {};
  const answeredCount = Object.keys(answers).length;
  const submitting = false;
  const error = null;

  // TODO: POST /api/modules/:moduleId/quiz
  //       body: { answers: [{ question_id, option_id }] } → điều hướng tới trang kết quả
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <Link to={`/modules/${module.id}`} className="back-link">
        <ArrowLeft size={16} aria-hidden="true" /> Quay lại bài học
      </Link>

      <div className="page-header">
        <div>
          <p className="eyebrow">Bài kiểm tra · Module {moduleCode(module.id)}</p>
          <h1 className="page-title">{module.title}</h1>
          <p className="page-subtitle">
            {questions.length} câu hỏi · Mỗi câu chỉ có một đáp án đúng · Đạt từ {PASS_SCORE}/100 điểm. Câu bỏ trống được tính là sai.
          </p>
        </div>
      </div>

      <ModuleStepper current={1} />

      <form className="quiz mt-24" onSubmit={handleSubmit}>
        <Alert tone="info" icon={Info}>
          Hãy đọc kỹ từng tình huống. Bạn có thể làm lại bao nhiêu lần tuỳ ý — hệ thống ghi nhận điểm cao nhất.
        </Alert>

        {questions.map((q, qi) => (
          <fieldset key={q.id} className="card quiz-question" id={`q-${qi + 1}`}>
            <legend className="sr-only">Câu {qi + 1}</legend>
            <div className="quiz-q-head">
              <span className="quiz-q-num">
                Câu {qi + 1}
                <span className="subtle">/{questions.length}</span>
              </span>
            </div>
            <p className="quiz-prompt">{q.prompt}</p>
            <div className="options">
              {q.options.map((o, oi) => (
                <label key={o.id} className="option">
                  <input type="radio" name={q.id} value={o.id} defaultChecked={answers[q.id] === o.id} />
                  <span className="option-letter">{LETTERS[oi]}</span>
                  <span className="option-label">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        {error && <Alert tone="danger">{error}</Alert>}

        <div className="quiz-bar">
          <div className="quiz-bar-progress">
            <div className="row row-between text-sm">
              <span>
                Đã trả lời <strong>{answeredCount}</strong>/{questions.length}
              </span>
              <span className="subtle">{questions.length - answeredCount} câu còn trống</span>
            </div>
            <ProgressBar value={answeredCount} max={questions.length} size="sm" label="Tiến độ trả lời" />
          </div>
          <Button type="submit" icon={Send} loading={submitting}>
            Nộp bài
          </Button>
        </div>
      </form>
    </>
  );
}
