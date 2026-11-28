import { Link } from "react-router-dom";

export function LogoMark({ size = 32 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ca-logo-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4d71f2" />
          <stop offset="1" stopColor="#7b55f0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#ca-logo-g)" />
      <path
        d="M16 6.5l7.5 2.8v5.6c0 4.7-3.2 8.9-7.5 10.3-4.3-1.4-7.5-5.6-7.5-10.3V9.3L16 6.5z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12.5 15.8l2.5 2.5 4.6-4.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ to = "/", onDark = false }) {
  return (
    <Link to={to} className={`logo ${onDark ? "logo-on-dark" : ""}`} aria-label="ChainAware — trang chủ">
      <LogoMark />
      <span>ChainAware</span>
    </Link>
  );
}
