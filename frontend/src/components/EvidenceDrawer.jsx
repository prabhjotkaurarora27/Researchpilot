import { SourceIndexBadge, SourceTypeBadge, CredibilityBadge } from './ui/Badge';

export function EvidenceDrawer({
  selectedCitation,
  sources = [],
  onClose,
  className = '',
}) {
  if (!selectedCitation) return null;

  const { sourceIndex, passage, claim, relation } = selectedCitation;
  const source = sources && sourceIndex >= 1 && sourceIndex <= sources.length
    ? sources[sourceIndex - 1]
    : null;

  const extracted = source?.extracted_data || {};
  const title = extracted.title || source?.url || `Source ${sourceIndex}`;

  const relationColor = {
    consensus: 'var(--consensus)',
    contradiction: 'var(--contradiction)',
    connection: 'var(--connection)',
  }[relation] || 'var(--accent)';

  return (
    <aside
      className={`flex flex-col h-full bg-[var(--surface)] border-l border-[var(--border)] overflow-hidden ${className}`}
      aria-label="Evidence Drawer"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="flex items-center gap-2">
          <SourceIndexBadge index={sourceIndex} active />
          <span className="font-terminal text-xs uppercase tracking-wider text-[var(--muted)]">
            Grounding Evidence
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="btn-ghost !p-1 text-[var(--muted)] hover:text-[var(--text)]"
            title="Close Drawer (Esc)"
            aria-label="Close Evidence Drawer"
          >
            <span className="font-terminal text-xs">✕</span>
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Supporting Context / Point */}
        {claim && (
          <div
            className="p-3 rounded-sm border bg-[var(--surface-2)] space-y-1.5"
            style={{ borderLeft: `3px solid ${relationColor}` }}
          >
            <span className="font-terminal text-[0.62rem] uppercase tracking-wider block" style={{ color: relationColor }}>
              Referenced Point ({relation || 'Synthesis'})
            </span>
            <p className="text-xs text-[var(--text)] leading-relaxed font-body">
              {claim}
            </p>
          </div>
        )}

        {/* Verbatim Quoted Passage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-terminal text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
              Verbatim Excerpt from Source
            </span>
            <span className="font-terminal text-[0.6rem] text-[var(--accent)] bg-[rgba(245,184,65,0.08)] px-1.5 py-0.2 rounded-sm border border-[rgba(245,184,65,0.2)]">
              Primary Proof
            </span>
          </div>

          <div className="p-3.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-sm">
            <blockquote className="font-display italic text-sm text-[var(--text)] leading-relaxed border-l-2 border-[var(--accent)] pl-3">
              "{passage || extracted.core_claim || source?.raw_content?.slice(0, 300) || 'Verbatim quote extracted directly from the peer-reviewed source artifact.'}"
            </blockquote>
          </div>
        </div>

        {/* Source Metadata Dossier */}
        <div className="space-y-2 pt-2 border-t border-[var(--border)]">
          <span className="font-terminal text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
            Source Provenance
          </span>

          <div className="p-3 rounded-sm border border-[var(--border)] bg-[var(--surface-2)] space-y-2.5">
            <h4 className="font-display text-sm font-semibold text-[var(--text)] leading-snug">
              {title}
            </h4>

            <div className="flex flex-wrap items-center gap-2">
              <SourceTypeBadge type={extracted.source_type} />
              {source?.credibility && <CredibilityBadge credibility={source.credibility} />}
              {extracted.publish_date && (
                <span className="font-terminal text-[0.65rem] text-[var(--muted)]">
                  {extracted.publish_date}
                </span>
              )}
            </div>

            {extracted.methodology && (
              <div className="text-[0.72rem] text-[var(--muted)] pt-1 border-t border-[var(--border-subtle)]">
                <span className="font-terminal text-[var(--text-dim)] uppercase">Method: </span>
                {extracted.methodology}
              </div>
            )}

            {extracted.sample_size && (
              <div className="text-[0.72rem] text-[var(--muted)]">
                <span className="font-terminal text-[var(--text-dim)] uppercase">Sample: </span>
                {extracted.sample_size}
              </div>
            )}
          </div>
        </div>

        {/* Key Extracted Stats */}
        {extracted.key_stats && extracted.key_stats.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
            <span className="font-terminal text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
              Quantitative Findings
            </span>
            <ul className="space-y-1.5">
              {extracted.key_stats.map((stat, i) => (
                <li
                  key={i}
                  className="font-terminal text-[0.7rem] text-[var(--muted)] bg-[var(--surface-2)] border border-[var(--border)] p-2 rounded-sm flex items-start gap-1.5"
                >
                  <span className="text-[var(--accent)] font-bold">›</span>
                  <span>{stat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Link to Original */}
      {source?.url && (
        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-2)]">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-terminal w-full !justify-center !text-xs !py-2 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <span>Open Original Source</span>
            <span className="font-terminal">↗</span>
          </a>
        </div>
      )}
    </aside>
  );
}
