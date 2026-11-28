import { Link } from "react-router-dom";
import { ArrowRight, Award, Blocks, CircleCheck, FlaskConical, Target, Wallet } from "lucide-react";
import { Alert, Button, Card, StatTile, Address } from "../components/ui";
import ModuleCard from "../components/module/ModuleCard";
import OnchainProgress from "../components/chain/OnchainProgress";
import { MODULE_COUNT } from "../constants/app";
import { explorerAddressUrl } from "../constants/chain";
import { isCompletedOnchain } from "../lib/format";
import { mockChainState, mockModules, mockUser } from "../mocks/data";

export default function Dashboard() {
  // TODO: GET /api/me, GET /api/modules ({ module: [...] }),
  //       đọc CompleteTracker.completeMask(address) & SoulboundCertificate.certificateOf(address)
  const user = mockUser;
  const modules = mockModules;
  const { completeMask, certificate } = mockChainState;

  const passedCount = modules.filter((m) => m.passed).length;
  const onchainCount = modules.filter((m) => isCompletedOnchain(completeMask, m.id)).length;
  const scored = modules.filter((m) => m.best_score != null);
  const avgBest = scored.length ? Math.round(scored.reduce((s, m) => s + m.best_score, 0) / scored.length) : null;
  const hasCertificate = Number(certificate.tokenId) > 0;
  const firstName = user.username.trim().split(/\s+/).pop();

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Tổng quan</p>
          <h1 className="page-title">Chào {firstName}</h1>
          <p className="page-subtitle">
            Hoàn thành {MODULE_COUNT} module và ghi kết quả lên blockchain để nhận chứng chỉ Soulbound.
          </p>
        </div>
        <Button to="/lab" variant="secondary" icon={FlaskConical}>
          Phòng thực hành
        </Button>
      </div>

      {!user.wallet_address && (
        <Alert
          tone="warning"
          title="Bạn chưa liên kết ví"
          className="mb-24"
          action={
            <Button to="/profile" size="sm" icon={Wallet}>
              Liên kết ví
            </Button>
          }
        >
          Cần liên kết ví để nhận chữ ký chứng nhận và ghi kết quả lên blockchain.
        </Alert>
      )}

      <div className="grid grid-4 mb-24">
        <StatTile icon={CircleCheck} tone="success" label="Module đã đạt" value={passedCount} suffix={`/ ${MODULE_COUNT}`} />
        <StatTile icon={Target} tone="neutral" label="Điểm cao nhất TB" value={avgBest ?? "—"} suffix={avgBest != null ? "/ 100" : undefined} />
        <StatTile icon={Blocks} tone="chain" label="Đã ghi on-chain" value={onchainCount} suffix={`/ ${MODULE_COUNT}`} />
        <StatTile
          icon={Award}
          tone={hasCertificate ? "success" : "neutral"}
          label="Chứng chỉ"
          value={hasCertificate ? `#${certificate.tokenId}` : "Chưa có"}
          hint={hasCertificate ? "Soulbound · đã mint" : `Còn ${MODULE_COUNT - onchainCount} module`}
        />
      </div>

      <div className="layout-aside">
        <section>
          <div className="section-row">
            <h2 className="h-section">Lộ trình học</h2>
            <span className="text-sm subtle">{modules.length} module</span>
          </div>
          <div className="stack">
            {modules.map((m) => (
              <ModuleCard key={m.id} module={m} completeMask={completeMask} />
            ))}
          </div>
        </section>

        <aside className="stack sticky-aside">
          <Card title="Tiến độ on-chain" subtitle="CompleteTracker.completeMask">
            <OnchainProgress completeMask={completeMask} />
          </Card>

          <Card
            title="Ví đã liên kết"
            actions={
              <Link to="/profile" className="text-sm">
                Quản lý
              </Link>
            }
          >
            {user.wallet_address ? (
              <div className="stack" style={{ "--gap": "10px" }}>
                <Address value={user.wallet_address} chars={6} explorerUrl={explorerAddressUrl(user.wallet_address)} />
                <p className="text-sm muted">Chứng nhận & chứng chỉ sẽ được ghi cho địa chỉ này.</p>
              </div>
            ) : (
              <p className="text-sm muted">Chưa có ví nào được liên kết.</p>
            )}
          </Card>

          <Link to="/certificate" className="card cert-teaser">
            <span className="icon-tile icon-tile-chain">
              <Award size={20} aria-hidden="true" />
            </span>
            <div className="grow">
              <div className="fw-600">Chứng chỉ Soulbound</div>
              <div className="text-sm muted">{hasCertificate ? "Xem chứng chỉ của bạn" : "Xem trước & điều kiện nhận"}</div>
            </div>
            <ArrowRight size={18} className="subtle" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </>
  );
}
