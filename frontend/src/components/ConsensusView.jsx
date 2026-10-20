import { useState, useCallback } from 'react';
import CitationPassage from './CitationPassage';

/**
 * Renders inline citations as interactive badges with expandable passages.
 * Replaces [Source N] patterns in text with clickable citation badges.
 *
 * When citationPassages is provided (from synthesis data), clicking a badge
 * expands an inline passage panel showing the exact source quote.
 *
 * @param {string} text - Text containing [Source N] patterns
 * @param {function|null} onCitationClick - Legacy click handler (scrolls to source card)
 * @param {object|null} citationPassages - Map of {"1": "passage...", "3": "passage..."}
 * @param {object|null} sources - Source objects for title/url lookup
 * @param {string|null} expandedKey - Currently expanded citation key (e.g. "card-0-1")
 * @param {function|null} onToggleCitation - Called with (key, sourceNumber) to toggle
 * @param {string} keyPrefix - Prefix for citation keys to avoid collisions
 */
export function renderCitedText(
  text,
  onCitationClick,
  { citationPassages = null, sources = null, expandedKey = null, onToggleCitation = null, keyPrefix = '' } = {}
) {
  if (!text) return null;

  const parts = text.split(/(\[Source \d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/\[Source (\d+)\]/);
    if (match) {
      const num = parseInt(match[1]);
      const citationKey = `${keyPrefix}-${num}`;
      const isExpanded = expandedKey === citationKey;
      const passage = citationPassages?.[String(num)] || '';

      // Get source info for the passage panel
      const sourceInfo = sources && num >= 1 && num <= sources.length
        ? sources[num - 1]
        : null;
      const extracted = sourceInfo?.extracted_data || {};
      const title = extracted.title || '';
      const url = sourceInfo?.url || '';

      const hasCitationData = citationPassages && onToggleCitation;

      return (
        <span key={i} className="citation-inline-wrapper">
          <span
            className={`citation-badge ${isExpanded ? 'citation-badge-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (hasCitationData) {
                onToggleCitation(citationKey, num);
              } else {
                onCitationClick?.(num);
              }
            }}
          >
            {num}
          </span>
          {hasCitationData && (
            <CitationPassage
              sourceNumber={num}
              passage={passage}
              title={title}
              url={url}
              isOpen={isExpanded}
              onClose={() => onToggleCitation(citationKey, num)}
            />
          )}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * Consensus vs Contradiction view — the core synthesis display.
 */
export default function ConsensusView({ synthesis, sources, onCitationClick }) {
  const [expandedKey, setExpandedKey] = useState(null);

  const handleToggleCitation = useCallback((key) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  }, []);

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

  const citedTextOpts = (itemPassages, prefix) => ({
    citationPassages: itemPassages,
    sources,
    expandedKey,
    onToggleCitation: handleToggleCitation,
    keyPrefix: prefix,
  });

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
                  {renderCitedText(
                    item.point,
                    onCitationClick,
                    citedTextOpts(item.citation_passages, `con-${i}`)
                  )}
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
                  {renderCitedText(
                    item.point,
                    onCitationClick,
                    citedTextOpts(item.citation_passages, `ctr-${i}`)
                  )}
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
                  {renderCitedText(
                    item.point,
                    onCitationClick,
                    citedTextOpts(item.citation_passages, `cnx-${i}`)
                  )}
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
