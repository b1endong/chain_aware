/** tone: neutral | primary | success | warning | danger | chain */
export default function Badge({ tone = "neutral", icon: Icon, outline = false, className = "", children, ...props }) {
  return (
    <span className={`badge badge-${tone} ${outline ? "badge-outline" : ""} ${className}`} {...props}>
      {Icon && <Icon size={13} aria-hidden="true" />}
      {children}
    </span>
  );
}
