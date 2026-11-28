import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Award, Blocks, CircleCheck, Clock, ExternalLink, ShieldCheck, Signature, Wallet } from "lucide-react";
import { Address, Alert, Button, Card, CodeBlock, Timeline, TimelineItem } from "../components/ui";
import ModuleStepper from "../components/module/ModuleStepper";
import OnchainProgress from "../components/chain/OnchainProgress";
import { ATTESTATION_TTL_MIN, MODULE_COUNT } from "../constants/app";
import { CONTRACTS, CURRENT_CHAIN, EIP712_DOMAIN, explorerAddressUrl, explorerTxUrl } from "../constants/chain";
import { formatCountdown, formatDateTime, moduleCode, shortHash } from "../lib/format";
import { mockAttestation, mockChainState, mockGetModule, mockModules, mockUser } from "../mocks/data";

/**
 * Luồng: kiểm tra điều kiện → POST /attestation (nhận chữ ký EIP-712) → ví gọi CompleteTracker.submit(c, sig)
 * status: "idle" | "issued" | "pending" | "confirmed" | "error"
 */
export default function Claim() {
  const { moduleId } = useParams();

  // TODO: thay bằng state thật
  const status = "issued";
  const { module } = mockGetModule(moduleId);
  const progress = mockModules.find((m) => m.id === module.id);
  const user = mockUser;
  const attestation = status === "idle" ? null : mockAttestation; // response của POST /api/modules/:id/attestation
  const txHash = status === "pending" || status === "confirmed" ? mockChainState.lastTxHash : null;
  const completeMask = mockChainState.completeMask;
  const willMintCertificate = (completeMask | (1 << module.id)) === (1 << MODULE_COUNT) - 1;
  const error = null; // vd. getErrorMessage("Expired")
  // TODO: secondsLeft = completion.deadline - now (cập nhật mỗi giây bằng setInterval)
  const secondsLeft = attestation ? 14 * 60 + 32 : 0;

  const walletOk = Boolean(user.wallet_address);
  const quizOk = Boolean(progress?.passed);

  // TODO: POST /api/modules/:moduleId/attestation → { completion, signature }
  function handleRequestAttestation() {}
  // TODO: tracker.submit(completion, signature) bằng ví (ethers / viem), chờ receipt
  function handleSubmitOnchain() {}

  const step = { idle: 1, issued: 2, pending: 2, confirmed: 3, error: 2 }[status];
  const itemStatus = (i) => (i < step ? "done" : i === step ? (status === "error" ? "error" : "current") : "upcoming");

  return (
    <>
      <Link to={`/modules/${module.id}/result`} className="back-link">
        <ArrowLeft size={16} aria-hidden="true" /> Quay lại kết quả
      </Link>

      <div className="page-header">
        <div>
          <p className="eyebrow">Chứng nhận on-chain · Module {moduleCode(module.id)}</p>
          <h1 className="page-title">{module.title}</h1>
          <p className="page-subtitle">
            Hệ thống ký xác nhận điểm của bạn theo chuẩn EIP-712, sau đó chính ví của bạn gửi chứng nhận lên contract
            CompleteTracker.
          </p>
        </div>
      </div>

      <ModuleStepper current={status === "confirmed" ? 4 : status === "idle" ? 2 : 3} />

      <div className="layout-aside mt-24">
        <Card padded={false}>
          <div className="card-body claim-body">
            <Timeline>
              {/* B0 — điều kiện */}
              <TimelineItem index={1} status={walletOk && quizOk ? "done" : "error"} title="Kiểm tra điều kiện">
                <ul className="check-list">
                  <li className={walletOk ? "ok" : "bad"}>
                    <Wallet size={16} aria-hidden="true" />
                    <span>
                      Ví đã liên kết{" "}
                      {walletOk ? <Address value={user.wallet_address} /> : <Link to="/profile">— liên kết ngay</Link>}
                    </span>
                  </li>
                  <li className={quizOk ? "ok" : "bad"}>
                    <CircleCheck size={16} aria-hidden="true" />
                    <span>
                      Đã đạt bài kiểm tra · điểm cao nhất <strong>{progress?.best_score ?? "—"}</strong>
                    </span>
                  </li>
                </ul>
              </TimelineItem>

              {/* B1 — xin chữ ký */}
              <TimelineItem
                index={2}
                status={itemStatus(1)}
                title="Nhận chữ ký chứng nhận"
                description={`Attester ký dữ liệu Completion cho ví của bạn. Chữ ký có hiệu lực ${ATTESTATION_TTL_MIN} phút.`}
              >
                {!attestation ? (
                  <div>
                    <Button icon={Signature} onClick={handleRequestAttestation} disabled={!walletOk || !quizOk}>
                      Yêu cầu chữ ký
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="completion">
                      <div className="completion-head">
                        <span className="mono">Completion</span>
                        <span className={`countdown ${secondsLeft < 120 ? "is-urgent" : ""}`}>
                          <Clock size={14} aria-hidden="true" />
                          Còn {formatCountdown(secondsLeft)}
                        </span>
                      </div>
                      <dl className="kv completion-kv">
                        <dt>learner</dt>
                        <dd className="mono">{attestation.completion.learner}</dd>
                        <dt>moduleId</dt>
                        <dd className="mono">{attestation.completion.moduleId}</dd>
                        <dt>score</dt>
                        <dd className="mono">{attestation.completion.score}</dd>
                        <dt>nonce</dt>
                        <dd className="mono" title={attestation.completion.nonce}>
                          {shortHash(attestation.completion.nonce, 10)}
                        </dd>
                        <dt>deadline</dt>
                        <dd className="mono">
                          {attestation.completion.deadline}{" "}
                          <span className="subtle">({formatDateTime(Number(attestation.completion.deadline))})</span>
                        </dd>
                      </dl>
                    </div>
                    <CodeBlock label="signature" value={attestation.signature} />
                  </>
                )}
              </TimelineItem>

              {/* B2 — gửi giao dịch */}
              <TimelineItem
                index={3}
                status={itemStatus(2)}
                title="Ghi lên blockchain"
                description="Ví của bạn gọi CompleteTracker.submit(completion, signature). Giao dịch tốn một ít phí gas."
              >
                {step >= 2 && (
                  <>
                    <div className="sign-check">
                      <div className="sign-check-head">
                        <ShieldCheck size={16} aria-hidden="true" />
                        Kiểm tra trước khi xác nhận trong ví
                      </div>
                      <dl className="kv">
                        <dt>Mạng</dt>
                        <dd>
                          {CURRENT_CHAIN.name} <span className="subtle mono">(chainId {EIP712_DOMAIN.chainId})</span>
                        </dd>
                        <dt>Contract</dt>
                        <dd>
                          <Address value={CONTRACTS.tracker} chars={6} explorerUrl={explorerAddressUrl(CONTRACTS.tracker)} />
                        </dd>
                        <dt>Hàm</dt>
                        <dd className="mono">submit(Completion, bytes)</dd>
                        <dt>Domain</dt>
                        <dd className="mono">
                          {EIP712_DOMAIN.name} · v{EIP712_DOMAIN.version}
                        </dd>
                      </dl>
                      <p className="text-xs subtle">
                        Giao dịch này không cấp quyền chi tiêu token nào. Nếu ví hiển thị approve / setApprovalForAll — hãy từ chối.
                      </p>
                    </div>

                    {status === "pending" && (
                      <Alert tone="info" icon={Blocks} title="Đang chờ xác nhận giao dịch…">
                        Tx: <span className="mono">{shortHash(txHash, 8)}</span>
                      </Alert>
                    )}
                    {error && <Alert tone="danger">{error}</Alert>}

                    {status !== "confirmed" && (
                      <div className="row">
                        <Button variant="chain" icon={Blocks} onClick={handleSubmitOnchain} loading={status === "pending"}>
                          {status === "pending" ? "Đang gửi giao dịch" : "Gửi lên blockchain"}
                        </Button>
                        {status === "error" && (
                          <Button variant="secondary" icon={Signature} onClick={handleRequestAttestation}>
                            Yêu cầu chữ ký mới
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </TimelineItem>

              {/* B3 — hoàn tất */}
              <TimelineItem index={4} status={status === "confirmed" ? "done" : "upcoming"} title="Hoàn tất">
                {status === "confirmed" && (
                  <>
                    <Alert tone="success" title={`Module ${moduleCode(module.id)} đã được ghi on-chain`}>
                      Sự kiện <span className="mono">CompletionSubmitted</span> đã được phát.{" "}
                      {explorerTxUrl(txHash) && (
                        <a href={explorerTxUrl(txHash)} target="_blank" rel="noreferrer">
                          Xem giao dịch <ExternalLink size={12} />
                        </a>
                      )}
                    </Alert>
                    {willMintCertificate && (
                      <Alert
                        tone="chain"
                        icon={Award}
                        title="Bạn đã nhận chứng chỉ Soulbound!"
                        action={
                          <Button to="/certificate" size="sm" variant="chain">
                            Xem chứng chỉ
                          </Button>
                        }
                      >
                        Hoàn thành đủ {MODULE_COUNT} module — chứng chỉ đã được mint vào ví của bạn.
                      </Alert>
                    )}
                  </>
                )}
              </TimelineItem>
            </Timeline>
          </div>
        </Card>

        <aside className="stack sticky-aside">
          <Card title="Tiến độ on-chain">
            <OnchainProgress completeMask={completeMask} />
          </Card>
          <Card title="Vì sao cần bước này?">
            <ul className="check-list text-sm muted">
              <li>
                <Signature size={16} aria-hidden="true" />
                <span>Chữ ký EIP-712 chứng minh điểm số do ChainAware xác nhận, không thể tự sửa.</span>
              </li>
              <li>
                <Clock size={16} aria-hidden="true" />
                <span>Mỗi chữ ký có nonce dùng một lần và hạn {ATTESTATION_TTL_MIN} phút, chống dùng lại.</span>
              </li>
              <li>
                <Award size={16} aria-hidden="true" />
                <span>Đủ {MODULE_COUNT} module, contract tự động mint chứng chỉ Soulbound cho ví của bạn.</span>
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </>
  );
}
