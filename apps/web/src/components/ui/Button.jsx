import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

/**
 * Nút bấm. Truyền `to` để render <Link>, `href` để render <a>, còn lại là <button>.
 * variant: primary | secondary | ghost | soft | chain | danger | danger-soft | on-dark
 * size: sm | md | lg
 */
export default function Button({
  to,
  href,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  block = false,
  iconOnly = false,
  className = "",
  children,
  ...props
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size !== "md" && `btn-${size}`,
    block && "btn-block",
    iconOnly && "btn-icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconSize = size === "sm" ? 15 : 17;
  const content = (
    <>
      {loading ? (
        <LoaderCircle size={iconSize} className="btn-spinner" aria-hidden="true" />
      ) : (
        Icon && <Icon size={iconSize} aria-hidden="true" />
      )}
      {children}
      {IconRight && !loading && <IconRight size={iconSize} aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props} disabled={props.disabled || loading}>
      {content}
    </button>
  );
}
