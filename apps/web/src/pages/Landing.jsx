import { ArrowRight, Award, BadgeCheck, Blocks, BookOpen, Check, CircleCheck, ListChecks, Lock, Signature, Wallet } from "lucide-react";
import { Button, Badge } from "../components/ui";
import StandardTags from "../components/module/StandardTags";
import { MODULE_META, PASS_SCORE, ATTESTATION_TTL_MIN, STANDARD_LABELS } from "../constants/app";
import { moduleCode } from "../lib/format";
import { mockModules } from "../mocks/data";

const STEPS = [
  {
    icon: Wallet,
    title: "Đăng ký & liên kết ví",
    text: "Ký một thông điệp để chứng minh bạn sở hữu ví. Không tốn gas, không cần seed phrase.",
  },
  {
    icon: BookOpen,
    title: "Học bài",
    text: "Nội dung ngắn gọn, có checklist và liên hệ trực tiếp tới control ISO 27001 / SOC 2.",
  },
  {
    icon: ListChecks,
    title: "Làm bài kiểm tra",
    text: `10 câu tình huống thực tế. Đạt từ ${PASS_SCORE} điểm, làm lại không giới hạn.`,
  },
  {
    icon: Signature,
    title: "Nhận chữ ký EIP-712",
    text: `Hệ thống ký chứng nhận hoàn thành cho ví của bạn, hiệu lực ${ATTESTATION_TTL_MIN} phút.`,
  },
  {
    icon: Blocks,
    title: "Ghi lên blockchain",
    text: "Gửi chứng nhận tới contract CompleteTracker. Đủ 3 module tự động nhận chứng chỉ Soulbound.",
  },
];

function uniqueControls(key) {
  return [...new Set(mockModules.flatMap((m) => m[key]))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export default function Landing() {
  // TODO: trang công khai — có thể lấy danh sách module từ API công khai nếu backend bổ sung
  const modules = mockModules;

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="hero-eyebrow">
              <Lock size={14} aria-hidden="true" /> Đào tạo nhận thức bảo mật Web3
            </span>
            <h1>
              Học bảo mật Web3.
              <br />
              <span className="accent">Chứng nhận ghi trên blockchain.</span>
            </h1>
            <p className="hero-lead">
              Ba module thực chiến về ví, phishing và token approval. Hoàn thành bài kiểm tra, nhận chữ ký EIP-712 và sở hữu
              chứng chỉ Soulbound không thể chuyển nhượng hay làm giả.
            </p>
            <div className="hero-cta">
              <Button to="/register" size="lg" iconRight={ArrowRight}>
                Bắt đầu học miễn phí
              </Button>
              <Button to="/login" size="lg" variant="on-dark">
                Tôi đã có tài khoản
              </Button>
            </div>
            <ul className="hero-trust">
              <li>
                <Check size={15} aria-hidden="true" /> ISO/IEC 27001:2022
              </li>
              <li>
                <Check size={15} aria-hidden="true" /> SOC 2
              </li>
              <li>
                <Check size={15} aria-hidden="true" /> Chữ ký EIP-712
              </li>
              <li>
                <Check size={15} aria-hidden="true" /> ERC-5192 Soulbound
              </li>
            </ul>
          </div>

          {/* Thẻ minh hoạ tiến độ */}
          <div className="hero-preview" aria-hidden="true">
            <div className="hero-preview-head">
              <span>Tiến độ học tập</span>
              <span className="mono">2 / 3</span>
            </div>
            <div className="hero-preview-list">
              {modules.map((m, i) => (
                <div key={m.id} className={`hero-preview-row state-${i === 0 ? "chain" : i === 1 ? "passed" : "todo"}`}>
                  <span className="hero-preview-num">{moduleCode(m.id)}</span>
                  <span className="hero-preview-title">{m.title}</span>
                  <span className="hero-preview-state">
                    {i === 0 ? (
                      <>
                        <Blocks size={13} /> On-chain
                      </>
                    ) : i === 1 ? (
                      <>
                        <CircleCheck size={13} /> Đã đạt
                      </>
                    ) : (
                      <>
                        <Lock size={13} /> Chưa học
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="hero-preview-cert">
              <div className="hero-preview-seal">
                <Award size={22} />
              </div>
              <div>
                <div className="hero-preview-cert-title">Soulbound Certificate</div>
                <div className="hero-preview-cert-sub mono">ACA · không thể chuyển nhượng</div>
              </div>
              <span className="hero-preview-lock">
                <Lock size={14} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MODULES ---------- */}
      <section className="section" id="modules">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Chương trình học</span>
            <h2 className="section-title">3 module, đi thẳng vào rủi ro thật</h2>
            <p className="section-lead">
              Mỗi module gồm bài học, checklist áp dụng ngay và 10 câu hỏi tình huống. Hoàn thành cả ba để nhận chứng chỉ.
            </p>
          </div>
          <div className="grid grid-3">
            {modules.map((m) => {
              const Icon = MODULE_META[m.id]?.icon ?? BookOpen;
              return (
                <article key={m.id} className="card feature-card">
                  <div className="row row-between">
                    <span className="icon-tile">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="feature-num mono">{moduleCode(m.id)}</span>
                  </div>
                  <h3>{m.title}</h3>
                  <p className="muted">{MODULE_META[m.id]?.summary}</p>
                  <div className="feature-foot">
                    <StandardTags iso27001={m.iso27001} soc2={m.soc2} limit={3} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="section section-alt" id="how">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Quy trình</span>
            <h2 className="section-title">Từ bài học tới chứng chỉ on-chain</h2>
            <p className="section-lead">
              Điểm số được xác thực bởi attester, còn quyền sở hữu chứng nhận nằm trong ví của bạn — minh bạch và kiểm chứng được.
            </p>
          </div>
          <ol className="steps">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="step">
                <div className="step-top">
                  <span className="step-icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="step-num mono">0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- STANDARDS ---------- */}
      <section className="section" id="standards">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Tuân thủ</span>
            <h2 className="section-title">Bám sát tiêu chuẩn doanh nghiệp</h2>
            <p className="section-lead">
              Mỗi bài học được ánh xạ tới các control cụ thể — hữu ích làm bằng chứng đào tạo nhận thức khi đánh giá tuân thủ.
            </p>
          </div>
          <div className="grid grid-2">
            <div className="card standard-card">
              <div className="standard-card-head">
                <Badge tone="primary">ISO/IEC 27001:2022</Badge>
                <span className="text-sm subtle">{uniqueControls("iso27001").length} control</span>
              </div>
              <ul className="standard-list">
                {uniqueControls("iso27001").map((c) => (
                  <li key={c}>
                    <span className="tag">{c}</span>
                    <span>{STANDARD_LABELS[c]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card standard-card">
              <div className="standard-card-head">
                <Badge tone="chain">SOC 2 · Trust Services Criteria</Badge>
                <span className="text-sm subtle">{uniqueControls("soc2").length} tiêu chí</span>
              </div>
              <ul className="standard-list">
                {uniqueControls("soc2").map((c) => (
                  <li key={c}>
                    <span className="tag">{c}</span>
                    <span>{STANDARD_LABELS[c]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container">
        <div className="cta-band">
          <div>
            <h2>Sẵn sàng kiểm tra thói quen bảo mật của bạn?</h2>
            <p>Hoàn thành cả 3 module để nhận chứng chỉ Soulbound gắn vĩnh viễn với ví của bạn.</p>
          </div>
          <Button to="/register" size="lg" iconRight={BadgeCheck}>
            Tạo tài khoản
          </Button>
        </div>
      </section>
    </>
  );
}
