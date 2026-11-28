import { Copy } from "lucide-react";

/** Khối hiển thị chuỗi dài (chữ ký, thông điệp, hash...). onCopy: TODO tự gắn */
export default function CodeBlock({ label, value, onCopy, className = "" }) {
  return (
    <div className={`codeblock ${className}`}>
      {label && (
        <div className="codeblock-head">
          <span>{label}</span>
          <button type="button" className="icon-btn" aria-label={`Sao chép ${label}`} onClick={onCopy}>
            <Copy size={13} />
          </button>
        </div>
      )}
      <pre>{value}</pre>
    </div>
  );
}
