/**
 * Biểu đồ cột ngang một chuỗi (thang 0–max).
 * rows: [{ key, label, value (number | null), display, tooltip: [[nhãn, giá trị], ...] }]
 * threshold: { value, label } — vạch tham chiếu (vd. điểm đạt)
 */
export default function HBarChart({ rows, max = 100, ticks = [0, 25, 50, 75, 100], threshold, ariaLabel }) {
  const pct = (v) => Math.min(100, Math.max(0, (v / max) * 100));

  return (
    <div className="hbar" role="group" aria-label={ariaLabel}>
      <div className={`hbar-rows ${threshold ? "has-threshold" : ""}`}>
        {/* Lưới dọc + vạch tham chiếu, chạy liền qua các hàng */}
        <div className="hbar-overlay" aria-hidden="true">
          {threshold && (
            <div className="hbar-threshold" style={{ left: `${pct(threshold.value)}%` }}>
              <span>{threshold.label}</span>
            </div>
          )}
        </div>
        {rows.map((row) => {
          const hasValue = row.value !== null && row.value !== undefined;
          return (
            <div key={row.key} className="hbar-row" tabIndex={0} aria-label={`${row.label}: ${hasValue ? row.display : "chưa có dữ liệu"}`}>
              <div className="hbar-label">{row.label}</div>
              <div className="hbar-plot">
                {hasValue ? (
                  <>
                    <div className="hbar-fill" style={{ width: `${pct(row.value)}%` }} />
                    <span className="hbar-value" style={{ left: `${pct(row.value)}%` }}>
                      {row.display}
                    </span>
                  </>
                ) : (
                  <span className="hbar-value is-empty" style={{ left: 0 }}>
                    Chưa có dữ liệu
                  </span>
                )}
                {row.tooltip && (
                  <div className="hbar-tip" role="tooltip" style={{ left: `${hasValue ? pct(row.value) : 0}%` }}>
                    <div className="hbar-tip-title">{row.label}</div>
                    {row.tooltip.map(([k, v]) => (
                      <div key={k} className="hbar-tip-row">
                        <span>{k}</span>
                        <strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="hbar-axis" aria-hidden="true">
        <div />
        <div className="hbar-ticks">
          {ticks.map((t) => (
            <span key={t} style={{ left: `${pct(t)}%` }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
