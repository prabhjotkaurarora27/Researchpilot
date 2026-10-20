import { cn } from '../../lib/utils';

export function Badge({ children, variant = 'neutral', className = '', ...props }) {
  const variantClasses = {
    neutral: 'badge-neutral',
    consensus: 'badge-consensus',
    contradiction: 'badge-contradiction',
    connection: 'badge-connection',
    accent: 'badge-accent',
  }[variant] || 'badge-neutral';

  return (
    <span className={cn('badge-mono', variantClasses, className)} {...props}>
      {children}
    </span>
  );
}

export function SourceIndexBadge({ index, className = '', active = false, onClick }) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'font-terminal text-[0.68rem] font-bold px-1.5 py-0.5 rounded-sm border transition-all select-none',
        active
          ? 'bg-[var(--accent)] text-[#0B0D10] border-[var(--accent)]'
          : 'bg-[var(--surface-2)] text-[var(--accent)] border-[var(--border)] hover:border-[var(--accent)]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      [S{index}]
    </span>
  );
}

export function SourceTypeBadge({ type = 'article', className = '' }) {
  const labels = {
    paper: 'PAPER',
    article: 'ARTICLE',
    video: 'VIDEO',
    report: 'REPORT',
  };

  return (
    <span
      className={cn(
        'font-terminal text-[0.62rem] font-medium tracking-wider uppercase px-1.5 py-0.2 rounded-sm border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]',
        className
      )}
    >
      {labels[type] || 'SOURCE'}
    </span>
  );
}

export function CredibilityBadge({ credibility, className = '' }) {
  if (!credibility) return null;
  const score = credibility.score || 85;
  const isHigh = score >= 90;

  return (
    <span
      className={cn(
        'font-terminal text-[0.62rem] font-semibold px-1.5 py-0.2 rounded-sm border flex items-center gap-1',
        isHigh
          ? 'bg-[var(--consensus-bg)] text-[var(--consensus)] border-[var(--consensus-border)]'
          : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]',
        className
      )}
      title={credibility.factors?.join(', ') || 'Credibility verified'}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {credibility.label || 'Verified'} · {score}%
    </span>
  );
}
