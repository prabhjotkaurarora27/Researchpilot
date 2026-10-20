/**
 * Individual source display card — compact, expandable.
 */
export default function SourceCard({ source, index, isSelected, onSelect }) {
  const extracted = source.extracted_data || {};
  const status = source.status || 'pending';
  const credibility = source.credibility;

  const statusClass = {
    done: 'status-done',
    extracting: 'status-extracting',
    error: 'status-error',
    pending: 'status-pending',
  }[status] || 'status-pending';

  return (
    <div
      id={`source-card-${source.id}`}
      className={`source-card ${isSelected ? 'selected' : ''} ${status === 'error' ? 'error' : ''} animate-fadein`}
      onClick={() => onSelect?.(source.id)}
    >
      {/* Header Row */}
      <div className="flex items-start gap-2.5 mb-1.5">
        <div className={`status-dot mt-1.5 ${statusClass}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-citation text-[var(--color-accent-cyan)] text-xs">
              [{index}]
            </span>
            <h4 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {extracted.title || source.url}
            </h4>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-citation text-[0.7rem] text-[var(--color-text-tertiary)]">
              {source.domain}
            </span>
            {extracted.source_type && (
              <span className="tag-chip">{extracted.source_type}</span>
            )}
            {extracted.publish_date && (
              <span className="font-citation text-[0.7rem] text-[var(--color-text-muted)]">
                {extracted.publish_date}
              </span>
            )}
            {credibility && (
              <span className={`credibility-badge credibility-${credibility.tier}`}>
                {credibility.label} · {credibility.score}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Core Claim */}
      {extracted.core_claim && (
        <p className="font-source text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed border-l-2 border-[var(--color-border)] pl-3">
          {extracted.core_claim}
        </p>
      )}

      {/* Key Stats Preview */}
      {extracted.key_stats && extracted.key_stats.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {extracted.key_stats.slice(0, 3).map((stat, i) => (
            <span
              key={i}
              className="font-citation text-[0.65rem] text-[var(--color-accent-gold)] bg-[rgba(240,180,41,0.06)] px-1.5 py-0.5 rounded-sm"
            >
              {stat.length > 60 ? stat.slice(0, 57) + '…' : stat}
            </span>
          ))}
          {extracted.key_stats.length > 3 && (
            <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">
              +{extracted.key_stats.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Error State */}
      {status === 'error' && source.error && (
        <p className="font-citation text-xs text-[var(--color-accent-red)] mt-2">
          {source.error}
        </p>
      )}
    </div>
  );
}
