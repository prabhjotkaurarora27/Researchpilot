/**
 * Renders inline citations as interactive badges.
 * Replaces [Source N] patterns in text with clickable citation badges.
 */
export function renderCitedText(text, onCitationClick) {
  if (!text) return null;

  const parts = text.split(/(\[Source \d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/\[Source (\d+)\]/);
    if (match) {
      const num = parseInt(match[1]);
      return (
        <span
          key={i}
          className="citation-badge"
          onClick={(e) => {
            e.stopPropagation();
            onCitationClick?.(num);
          }}
        >
          {num}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * Consensus vs Contradiction view — the core synthesis display.
 */
export default function ConsensusView({ synthesis, onCitationClick }) {
  if (!synthesis) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center px-8">
          <div className="font-citation text-[0.7rem] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            No synthesis yet
          </div>
          <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
            Extract 2+ sources then click "Synthesize" to generate cross-source analysis.
          </p>
        </div>
      </div>
    );
  }

  const { consensus = [], contradictions = [], connections = [] } = synthesis;

  return (
    <div className="p-4 overflow-y-auto h-full space-y-6 animate-fadein">
      {/* Consensus Section */}
      <section>
        <h3 className="font-citation text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-accent-green)] mb-3 flex items-center gap-2">
          <span className="align-indicator align-aligned" />
          Agreement ({consensus.length})
        </h3>
        {consensus.length === 0 ? (
          <p className="text-xs text-[var(--color-text-muted)]">No consensus points found.</p>
        ) : (
          <div className="space-y-2">
            {consensus.map((item, i) => (
              <div key={i} className="consensus-card">
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  {renderCitedText(item.point, onCitationClick)}
                </p>
                {item.explanation && (
                  <p className="font-source text-xs text-[var(--color-text-tertiary)] mt-1.5 italic">
                    {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contradictions Section */}
      <section>
        <h3 className="font-citation text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-accent-amber)] mb-3 flex items-center gap-2">
          <span className="align-indicator align-divergent" />
          Contradictions ({contradictions.length})
        </h3>
        {contradictions.length === 0 ? (
          <p className="text-xs text-[var(--color-text-muted)]">No contradictions found.</p>
        ) : (
          <div className="space-y-2">
            {contradictions.map((item, i) => (
              <div key={i} className="contradiction-card">
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  {renderCitedText(item.point, onCitationClick)}
                </p>
                {item.explanation && (
                  <p className="font-source text-xs text-[var(--color-text-tertiary)] mt-1.5 italic">
                    {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Connections Section */}
      {connections.length > 0 && (
        <section>
          <h3 className="font-citation text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-accent-cyan)] mb-3 flex items-center gap-2">
            <span className="align-indicator" style={{ background: 'var(--color-accent-cyan)' }} />
            Connections ({connections.length})
          </h3>
          <div className="space-y-2">
            {connections.map((item, i) => (
              <div key={i} className="connection-card">
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  {renderCitedText(item.point, onCitationClick)}
                </p>
                {item.explanation && (
                  <p className="font-source text-xs text-[var(--color-text-tertiary)] mt-1.5 italic">
                    {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
