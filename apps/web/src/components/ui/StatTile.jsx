export default function StatTile({ label, value, suffix, hint, icon: Icon, tone = "neutral" }) {
  return (
    <div className="card stat">
      <div className="stat-label">
        {Icon && (
          <span className={`stat-icon icon-tile-${tone}`}>
            <Icon size={17} aria-hidden="true" />
          </span>
        )}
        {label}
      </div>
      <div className="stat-value">
        {value}
        {suffix && <small> {suffix}</small>}
      </div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}
