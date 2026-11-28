import { BadgeCheck, KeyRound, Link2, Mail, MessageSquareText, PenLine, Plug, ShieldCheck, TriangleExclamationPoint, User, Wallet } from "lucide-react";
import { Address, Alert, Badge, Button, Card, CodeBlock, Timeline, TimelineItem } from "../components/ui";
import { CHALLENGE_TTL_MIN } from "../constants/app";
import { CURRENT_CHAIN, explorerAddressUrl } from "../constants/chain";
import { initials } from "../lib/format";
import { mockChainState, mockChallenge, mockUser } from "../mocks/data";

/**
 * Liên kết ví: kết nối ví → GET /api/me/wallet/challenge → personal_sign(message) → POST /api/me/wallet { address, signature }
 * linkStep: 0 = chưa kết nối ví, 1 = đã kết nối, 2 = đã có thông điệp, 3 = đã ký, 4 = hoàn tất
 */
export default function Profile() {
  // TODO: thay bằng state thật
  const user = mockUser;
  const linkStep = 2;
  const connectedAddress = linkStep >= 1 ? mockChainState.connectedAddress : null; // địa chỉ ví trong trình duyệt
  const challenge = linkStep >= 2 ? mockChallenge.message : null;
  const error = null; // vd. getErrorMessage("signature_mismatch")

  // TODO: yêu cầu eth_requestAccounts, kiểm tra chainId
  function handleConnect() {}
  // TODO: GET /api/me/wallet/challenge → { message }
  function handleGetChallenge() {}
  // TODO: signer.signMessage(message) → POST /api/me/wallet { address, signature }
  function handleSignAndLink() {}
  // TODO: ngắt kết nối ví trong ứng dụng (không ảnh hưởng ví đã liên kết trên server)
  function handleDisconnect() {}

  const itemStatus = (i) => (i < linkStep ? "done" : i === linkStep ? "current" : "upcoming");

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Tài khoản</p>
          <h1 className="page-title">Ví & hồ sơ</h1>
          <p className="page-subtitle">Quản lý thông tin tài khoản và ví dùng để nhận chứng nhận on-chain.</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="stack" style={{ "--gap": "24px" }}>
          <Card>
            <div className="profile-head">
              <span className="avatar avatar-lg" aria-hidden="true">
                {initials(user.username)}
              </span>
              <div className="grow">
                <h2 className="profile-name">{user.username}</h2>
                <p className="muted text-sm">{user.email}</p>
              </div>
              <Badge tone={user.role === "admin" ? "chain" : "primary"}>{user.role === "admin" ? "Quản trị viên" : "Học viên"}</Badge>
            </div>
            <hr className="divider my-20" />
            <dl className="kv">
              <dt>
                <span className="row" style={{ "--gap": "8px" }}>
                  <User size={15} aria-hidden="true" /> Tên hiển thị
                </span>
              </dt>
              <dd>{user.username}</dd>
              <dt>
                <span className="row" style={{ "--gap": "8px" }}>
                  <Mail size={15} aria-hidden="true" /> Email
                </span>
              </dt>
              <dd>{user.email}</dd>
              <dt>
                <span className="row" style={{ "--gap": "8px" }}>
                  <KeyRound size={15} aria-hidden="true" /> Mã tài khoản
                </span>
              </dt>
              <dd className="mono text-sm">{user.id}</dd>
            </dl>
          </Card>

          <Card title="Ví đã liên kết" subtitle="Chứng nhận và chứng chỉ được ghi cho địa chỉ này">
            {user.wallet_address ? (
              <div className="linked-wallet">
                <span className="icon-tile icon-tile-success">
                  <BadgeCheck size={20} aria-hidden="true" />
                </span>
                <div className="grow stack" style={{ "--gap": "6px" }}>
                  <Address value={user.wallet_address} full explorerUrl={explorerAddressUrl(user.wallet_address)} />
                  <span className="text-sm muted">Đã xác minh quyền sở hữu bằng chữ ký · {CURRENT_CHAIN.name}</span>
                </div>
              </div>
            ) : (
              <div className="linked-wallet is-empty">
                <span className="icon-tile icon-tile-neutral">
                  <Wallet size={20} aria-hidden="true" />
                </span>
                <div className="grow">
                  <div className="fw-600">Chưa liên kết ví</div>
                  <span className="text-sm muted">Làm theo các bước bên cạnh để liên kết.</span>
                </div>
              </div>
            )}
          </Card>

          <Alert tone="warning" icon={ShieldCheck} title="ChainAware không bao giờ hỏi seed phrase">
            Liên kết ví chỉ cần ký một thông điệp văn bản — không tốn gas, không cấp quyền gì. Nếu bất kỳ trang nào yêu cầu seed phrase
            hay private key, đó là lừa đảo.
          </Alert>
        </div>

        <Card
          title={user.wallet_address ? "Liên kết ví khác" : "Liên kết ví"}
          subtitle="Chứng minh bạn sở hữu ví bằng chữ ký personal_sign"
        >
          <Timeline>
            <TimelineItem index={1} status={itemStatus(0)} title="Kết nối ví" description="MetaMask, Ronin Wallet hoặc ví EVM khác.">
              {connectedAddress ? (
                <div className="row">
                  <Address value={connectedAddress} chars={6} />
                  <Button size="sm" variant="ghost" icon={Plug} onClick={handleDisconnect}>
                    Ngắt kết nối
                  </Button>
                </div>
              ) : (
                <div>
                  <Button icon={Wallet} onClick={handleConnect}>
                    Kết nối ví
                  </Button>
                </div>
              )}
            </TimelineItem>

            <TimelineItem
              index={2}
              status={itemStatus(1)}
              title="Lấy thông điệp xác minh"
              description={`Máy chủ tạo thông điệp kèm nonce, hết hạn sau ${CHALLENGE_TTL_MIN} phút và chỉ dùng được một lần.`}
            >
              {challenge ? (
                <CodeBlock label="Thông điệp cần ký" value={challenge} />
              ) : (
                linkStep === 1 && (
                  <div>
                    <Button variant="secondary" icon={MessageSquareText} onClick={handleGetChallenge}>
                      Lấy thông điệp
                    </Button>
                  </div>
                )
              )}
            </TimelineItem>

            <TimelineItem
              index={3}
              status={itemStatus(2)}
              title="Ký thông điệp & liên kết"
              description="Ví sẽ hiện yêu cầu ký. Kiểm tra nội dung khớp với thông điệp phía trên rồi xác nhận."
            >
              {linkStep === 2 && (
                <>
                  <ul className="check-list text-sm muted">
                    <li>
                      <ShieldCheck size={16} className="success-icon" aria-hidden="true" />
                      <span>Loại yêu cầu: personal_sign (ký văn bản) — an toàn nếu nội dung rõ ràng.</span>
                    </li>
                    <li>
                      <TriangleExclamationPoint size={16} className="warning-icon" aria-hidden="true" />
                      <span>Từ chối nếu ví hiển thị eth_sign, approve hoặc yêu cầu gửi giao dịch.</span>
                    </li>
                  </ul>
                  {error && <Alert tone="danger">{error}</Alert>}
                  <div>
                    <Button icon={PenLine} onClick={handleSignAndLink}>
                      Ký & liên kết ví
                    </Button>
                  </div>
                </>
              )}
            </TimelineItem>

            <TimelineItem index={4} status={linkStep >= 4 ? "done" : "upcoming"} title="Hoàn tất">
              {linkStep >= 4 && (
                <Alert tone="success" icon={Link2} title="Đã liên kết ví thành công">
                  Bạn có thể nhận chứng nhận on-chain cho các module đã đạt.
                </Alert>
              )}
            </TimelineItem>
          </Timeline>
        </Card>
      </div>
    </>
  );
}
