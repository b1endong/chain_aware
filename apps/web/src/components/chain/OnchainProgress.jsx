import { Blocks } from "lucide-react";
import { MODULE_COUNT } from "../../constants/app";
import { isCompletedOnchain, moduleCode } from "../../lib/format";

/**
 * Trực quan hoá CompleteTracker.completeMask (bit i = module i).
 * Hiển thị theo thứ tự bit cao → thấp để khớp cách đọc số nhị phân.
 */
export default function OnchainProgress({ completeMask = 0, compact = false }) {
  const bits = Array.from({ length: MODULE_COUNT }, (_, i) => MODULE_COUNT - 1 - i);
  const done = bits.filter((id) => isCompletedOnchain(completeMask, id)).length;
  const binary = Number(completeMask).toString(2).padStart(MODULE_COUNT, "0");

  return (
    <div className="onchain">
      <div className="bits">
        {bits.map((id) => {
          const set = isCompletedOnchain(completeMask, id);
          return (
            <div key={id} className={`bit ${set ? "is-set" : ""}`} title={`Module ${moduleCode(id)} — bit ${id}`}>
              <span className="bit-value">{set ? 1 : 0}</span>
              <span className="bit-label">M{moduleCode(id)}</span>
            </div>
          );
        })}
      </div>
      {!compact && (
        <div className="mask-readout">
          <span>
            <Blocks size={14} aria-hidden="true" /> completeMask
          </span>
          <span className="mono">
            0b{binary} <span className="subtle">({Number(completeMask)})</span>
          </span>
        </div>
      )}
      <p className="text-sm muted">
        {done === MODULE_COUNT
          ? "Đã hoàn thành toàn bộ module trên blockchain."
          : `Đã ghi on-chain ${done}/${MODULE_COUNT} module. Đủ ${MODULE_COUNT} module sẽ tự động mint chứng chỉ.`}
      </p>
    </div>
  );
}
