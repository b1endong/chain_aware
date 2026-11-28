import { Award, Lock } from "lucide-react";
import { LogoMark } from "../layout/Logo";
import { formatDateTime, shortAddress } from "../../lib/format";

/** Thẻ chứng chỉ Soulbound. locked = chưa đủ điều kiện (hiển thị bản xem trước mờ). */
export default function CertificateCard({ recipient, address, tokenId, issuedAt, locked = false, lockedText }) {
  return (
    <div className={`cert ${locked ? "is-locked" : ""}`}>
      <div className="cert-content">
        <div className="cert-top">
          <div className="cert-brand">
            <LogoMark size={28} />
            <span>ChainAware</span>
          </div>
          <span className="cert-chip">Soulbound · ERC-5192</span>
        </div>

        <div className="cert-main">
          <div className="cert-seal" aria-hidden="true">
            <Award size={34} />
          </div>
          <div>
            <p className="cert-kicker">Chứng chỉ hoàn thành</p>
            <h2 className="cert-title">Web3 Security Awareness</h2>
            <p className="cert-for">Trao cho</p>
            <p className="cert-recipient">{recipient}</p>
          </div>
        </div>

        <dl className="cert-meta">
          <div>
            <dt>Token ID</dt>
            <dd>{tokenId ? `#${tokenId}` : "—"}</dd>
          </div>
          <div>
            <dt>Chủ sở hữu</dt>
            <dd>{shortAddress(address, 6)}</dd>
          </div>
          <div>
            <dt>Ngày cấp</dt>
            <dd>{tokenId ? formatDateTime(issuedAt) : "—"}</dd>
          </div>
        </dl>
      </div>

      {locked && (
        <div className="cert-lock">
          <span className="cert-lock-icon">
            <Lock size={22} aria-hidden="true" />
          </span>
          <p>{lockedText ?? "Hoàn thành tất cả module để mở khoá chứng chỉ"}</p>
        </div>
      )}
    </div>
  );
}
