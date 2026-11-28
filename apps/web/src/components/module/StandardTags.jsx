import { STANDARD_LABELS } from "../../constants/app";

/** Hiển thị mã control ISO/IEC 27001 & SOC 2 của module (tooltip = mô tả control) */
export default function StandardTags({ iso27001 = [], soc2 = [], limit }) {
  const iso = limit ? iso27001.slice(0, limit) : iso27001;
  const soc = limit ? soc2.slice(0, limit) : soc2;
  const hidden = limit ? Math.max(0, iso27001.length - limit) + Math.max(0, soc2.length - limit) : 0;
  return (
    <div className="stack" style={{ "--gap": "8px" }}>
      {iso.length > 0 && (
        <div className="tag-group">
          <span className="tag-group-label">ISO 27001</span>
          {iso.map((c) => (
            <span key={c} className="tag" title={STANDARD_LABELS[c]}>
              {c}
            </span>
          ))}
        </div>
      )}
      {soc.length > 0 && (
        <div className="tag-group">
          <span className="tag-group-label">SOC 2</span>
          {soc.map((c) => (
            <span key={c} className="tag" title={STANDARD_LABELS[c]}>
              {c}
            </span>
          ))}
          {hidden > 0 && <span className="text-xs subtle">+{hidden}</span>}
        </div>
      )}
    </div>
  );
}
