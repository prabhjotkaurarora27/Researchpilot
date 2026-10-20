/**
 * Reusable layout Container component.
 * Uses .app-container defined in index.css for guaranteed CSS execution:
 * - width: 100%
 * - max-width: 1280px
 * - margin-inline: auto (centered)
 * - padding-inline: 16px mobile, 24px tablet, 40px desktop
 */
export function Container({
  children,
  className = '',
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`app-container ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
