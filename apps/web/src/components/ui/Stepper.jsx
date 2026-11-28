import { Check } from "lucide-react";

/** Thanh tiến trình ngang. steps: string[], current: index bước hiện tại */
export default function Stepper({ steps, current = 0, className = "" }) {
  return (
    <ol className={`stepper ${className}`}>
      {steps.map((label, i) => {
        const state = i < current ? "is-done" : i === current ? "is-current" : "";
        return (
          <li key={label} className={`stepper-item ${state}`} aria-current={i === current ? "step" : undefined}>
            <span className="stepper-dot">{i < current ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
            <span className="stepper-label">{label}</span>
            {i < steps.length - 1 && <span className="stepper-line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
