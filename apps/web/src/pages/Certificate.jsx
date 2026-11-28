import { Link } from "react-router-dom";
import { ArrowRight, Ban, Blocks, CircleCheck, CircleDashed, Lock, ShieldCheck } from "lucide-react";
import { Address, Badge, Button, Card } from "../components/ui";
import CertificateCard from "../components/chain/CertificateCard";
import OnchainProgress from "../components/chain/OnchainProgress";
import { CONTRACTS, explorerAddressUrl } from "../constants/chain";
import { getModuleStatus, isCompletedOnchain, moduleCode } from "../lib/format";
import { mockChainState, mockModules, mockUser } from "../mocks/data";

export default function Certificate() {
  // TODO: đọc SoulboundCertificate.certificateOf(address), issuedAt(tokenId), locked(tokenId)
  //       và CompleteTracker.completeMask(address)
  const user = mockUser;
  const { completeMask, certificate } = mockChainState;
  const modules = mockModules;
  const hasCertificate = Number(certificate.tokenId) > 0;
  const remaining = modules.filter((m) => !isCompletedOnchain(completeMask, m.id));

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Chứng chỉ</p>
          <h1 className="page-title">Chứng chỉ Soulbound</h1>
          <p className="page-subtitle">
            Token ERC-721 gắn vĩnh viễn với ví của bạn (ERC-5192): không thể chuyển nhượng, phê duyệt hay đốt — nên không ai mua
            bán hay giả mạo được.
          </p>
        </div>
        {hasCertificate ? (
          <Badge tone="success" icon={CircleCheck}>
            Đã sở hữu
          </Badge>
        ) : (
          <Badge tone="neutral" icon={Lock}>
            Chưa mở khoá
          </Badge>
        )}
      </div>

      <div className="layout-aside">
        <div className="stack" style={{ "--gap": "24px" }}>
          <CertificateCard
            recipient={user.username}
            address={user.wallet_address}
            tokenId={certificate.tokenId}
            issuedAt={certificate.issuedAt}
            locked={!hasCertificate}
            lockedText={`Ghi on-chain thêm ${remaining.length} module để mở khoá`}
          />

          {!hasCertificate && (
            <Card title="Còn thiếu để nhận chứng chỉ" subtitle="Mỗi module cần được ghi lên blockchain qua CompleteTracker">
              <ul className="todo-list">
                {modules.map((m) => {
                  const status = getModuleStatus(m, completeMask);
                  const done = status === "onchain";
                  return (
                    <li key={m.id} className={done ? "is-done" : ""}>
                      {done ? (
                        <CircleCheck size={18} className="todo-icon" aria-hidden="true" />
                      ) : (
                        <CircleDashed size={18} className="todo-icon" aria-hidden="true" />
                      )}
                      <div className="grow">
                        <div className="fw-600">
                          <span className="mono subtle">{moduleCode(m.id)}</span> {m.title}
                        </div>
                        <div className="text-sm muted">
                          {done
                            ? "Đã ghi on-chain"
                            : status === "passed"
                              ? "Đã đạt bài kiểm tra — chỉ còn bước ghi on-chain"
                              : "Cần học và đạt bài kiểm tra"}
                        </div>
                      </div>
                      {!done && (
                        <Button
                          size="sm"
                          variant={status === "passed" ? "chain" : "secondary"}
                          to={status === "passed" ? `/modules/${m.id}/claim` : `/modules/${m.id}`}
                          iconRight={ArrowRight}
                        >
                          {status === "passed" ? "Ghi on-chain" : "Học ngay"}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </div>

        <aside className="stack sticky-aside">
          <Card title="Tiến độ on-chain">
            <OnchainProgress completeMask={completeMask} />
          </Card>

          <Card title="Thông tin token">
            <dl className="kv">
              <dt>Contract</dt>
              <dd>
                <Address value={CONTRACTS.certificate} explorerUrl={explorerAddressUrl(CONTRACTS.certificate)} />
              </dd>
              <dt>Tên / ký hiệu</dt>
              <dd>SoulboundCertificate · ACA</dd>
              <dt>Chuẩn</dt>
              <dd>ERC-721 + ERC-5192</dd>
              <dt>Người mint</dt>
              <dd>CompleteTracker</dd>
              <dt>Giới hạn</dt>
              <dd>1 chứng chỉ / ví</dd>
            </dl>
          </Card>

          <Card title="Soulbound nghĩa là gì?">
            <ul className="check-list text-sm muted">
              <li>
                <Ban size={16} aria-hidden="true" />
                <span>
                  <span className="mono">transfer</span>, <span className="mono">approve</span>,{" "}
                  <span className="mono">setApprovalForAll</span> đều bị chặn.
                </span>
              </li>
              <li>
                <ShieldCheck size={16} aria-hidden="true" />
                <span>
                  <span className="mono">locked(tokenId)</span> luôn trả về <span className="mono">true</span>.
                </span>
              </li>
              <li>
                <Blocks size={16} aria-hidden="true" />
                <span>Ai cũng có thể xác minh chứng chỉ trên explorer bằng địa chỉ ví của bạn.</span>
              </li>
            </ul>
            <p className="text-sm mt-12">
              <Link to="/dashboard">Về trang tổng quan →</Link>
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
