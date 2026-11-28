import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { shortAddress } from "../../lib/format";

/** Chip ví trên header: hiện địa chỉ đã liên kết, hoặc nút dẫn tới trang liên kết ví */
export default function WalletChip({ address }) {
  if (!address) {
    return (
      <Link to="/profile" className="btn btn-soft btn-sm">
        <Wallet size={15} aria-hidden="true" />
        Liên kết ví
      </Link>
    );
  }
  return (
    <Link to="/profile" className="wallet-chip" title={address}>
      <span className="wallet-chip-dot" aria-hidden="true" />
      {shortAddress(address)}
    </Link>
  );
}
