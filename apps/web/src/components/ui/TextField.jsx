import { useId } from "react";

/**
 * Ô nhập liệu có label / hint / lỗi. Các prop còn lại được truyền thẳng vào <input>.
 * `addon` hiển thị phần tử ở cuối ô (vd. nút hiện mật khẩu, đơn vị token).
 */
export default function TextField({ label, hint, error, icon: Icon, addon, labelExtra, className = "", ...inputProps }) {
  const id = useId();
  const wrapClass = ["input-wrap", Icon && "has-icon", addon && "has-addon"].filter(Boolean).join(" ");
  return (
    <div className={`field ${error ? "has-error" : ""} ${className}`}>
      {label && (
        <label className="field-label" htmlFor={id}>
          <span>{label}</span>
          {labelExtra}
        </label>
      )}
      <div className={wrapClass}>
        {Icon && <Icon size={17} className="input-icon" aria-hidden="true" />}
        <input id={id} className="input" aria-invalid={error ? "true" : undefined} {...inputProps} />
        {addon && <div className="input-addon">{addon}</div>}
      </div>
      {error ? <p className="field-error">{error}</p> : hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}
