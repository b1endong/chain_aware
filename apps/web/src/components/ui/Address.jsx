import { Copy, ExternalLink } from "lucide-react";
import { shortAddress } from "../../lib/format";

/**
 * Hiển thị địa chỉ ví / contract dạng rút gọn, có nút copy và link explorer.
 * onCopy: TODO tự gắn (vd. navigator.clipboard.writeText(value))
 */
export default function Address({ value, chars = 4, full = false, explorerUrl, onCopy, className = "" }) {
  if (!value) return null;
  return (
    <span className={`address ${className}`} title={value}>
      <span className="address-text">{full ? value : shortAddress(value, chars)}</span>
      <button type="button" className="icon-btn" aria-label="Sao chép địa chỉ" onClick={onCopy}>
        <Copy size={13} />
      </button>
      {explorerUrl && (
        <a className="icon-btn" href={explorerUrl} target="_blank" rel="noreferrer" aria-label="Xem trên explorer">
          <ExternalLink size={13} />
        </a>
      )}
    </span>
  );
}
