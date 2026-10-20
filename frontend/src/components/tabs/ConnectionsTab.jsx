import { Badge } from '../ui/Badge';
import { renderCitedText, CitationChip } from '../ui/CitationChip';

export function ConnectionsTab({ connections = [], sources = [], onCitationClick }) {
  if (!connections || connections.length === 0) {
    return (
      <div className="p-8 text-center space-y-2">
        <p className="font-terminal text-xs text-[var(--muted)]">NO LATENT CONNECTIONS FOUND</p>
        <p className="text-sm text-[var(--text-dim)]">Add diverse sources spanning different angles or methodologies to surface emergent links.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="connection">CONNECTION</Badge>
          <span className="font-terminal text-xs text-[var(--muted)]">
            {connections.length} Emergent Cross-Domain Bridges
          </span>
        </div>
        <span className="font-terminal text-[0.65rem] text-[var(--text-dim)]">
          Click any [S#] chip to view grounding evidence
        </span>
      </div>

      <div className="space-y-4">
        {connections.map((item, idx) => (
          <article
            key={idx}
            className="card-semantic card-connection space-y-3 animate-card-in"
          >
            {/* Header / Citation Chips */}
            <div className="flex items-center justify-between">
              <span className="font-terminal text-[0.65rem] text-[var(--connection)] uppercase tracking-wider font-semibold">
                Connection #{idx + 1}
              </span>
              <div className="flex items-center gap-1">
                {item.citations?.map((cNum) => (
                  <CitationChip
                    key={cNum}
                    sourceIndex={cNum}
                    onClick={() => {
                      onCitationClick?.(cNum, {
                        sourceIndex: cNum,
                        passage: item.citation_passages?.[String(cNum)] || item.citation_passages?.[cNum],
                        claim: item.point,
                        relation: 'connection',
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Core Claim */}
            <h3 className="font-display text-base text-[var(--text)] font-semibold leading-relaxed">
              {renderCitedText(item.point, (cNum) => {
                onCitationClick?.(cNum, {
                  sourceIndex: cNum,
                  passage: item.citation_passages?.[String(cNum)] || item.citation_passages?.[cNum],
                  claim: item.point,
                  relation: 'connection',
                });
              })}
            </h3>

            {/* Explanation of Connection */}
            {item.explanation && (
              <p className="text-xs text-[var(--muted)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
                <strong className="text-[var(--text)] font-medium">Emergent Insight: </strong>
                {item.explanation}
              </p>
            )}

            {/* Connecting Passages */}
            {item.citation_passages && Object.keys(item.citation_passages).length > 0 && (
              <div className="bg-[var(--surface-2)] p-2.5 rounded-sm border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-terminal text-[0.62rem] text-[var(--connection)] uppercase tracking-wider block">
                  Interlocking Evidence
                </span>
                <div className="space-y-1.5">
                  {Object.entries(item.citation_passages).map(([srcId, quote]) => (
                    <div key={srcId} className="flex items-start gap-2 text-[0.72rem] text-[var(--muted)]">
                      <span className="font-terminal text-[var(--connection)] font-bold shrink-0">[S{srcId}]</span>
                      <span className="italic line-clamp-2">"{quote}"</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
