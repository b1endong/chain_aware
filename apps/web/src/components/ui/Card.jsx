export default function Card({ title, subtitle, actions, footer, padded = true, className = "", children, ...props }) {
  const hasHeader = title || subtitle || actions;
  return (
    <section className={`card ${className}`} {...props}>
      {hasHeader && (
        <header className="card-header">
          <div>
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {padded ? <div className="card-body">{children}</div> : children}
      {footer && <footer className="card-footer">{footer}</footer>}
    </section>
  );
}
