/**
 * BentoGrid + BentoCard — MagicUI-inspired grid layout
 * adapted for Bloomberg-terminal dark theme.
 */

export function BentoGrid({ children, className = '' }) {
  return (
    <div className={`bento-grid ${className}`}>
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  description,
  icon,
  cta,
  onClick,
  className = '',
  background,
}) {
  return (
    <div
      className={`bento-card group ${className}`}
      onClick={onClick}
    >
      {/* Background layer */}
      {background && (
        <div className="bento-card-bg">
          {background}
        </div>
      )}

      {/* Content */}
      <div className="bento-card-content">
        {icon && <div className="bento-card-icon">{icon}</div>}
        <h3 className="bento-card-title">{name}</h3>
        <p className="bento-card-desc">{description}</p>
        {cta && (
          <span className="bento-card-cta">
            {cta}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
              <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
