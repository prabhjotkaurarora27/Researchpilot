import { Badge } from '../ui/Badge';
import { renderCitedText, CitationChip } from '../ui/CitationChip';

export function ContradictionsTab({ contradictions = [], sources = [], onCitationClick }) {
  if (!contradictions || contradictions.length === 0) {
    return (
      <div className="p-8 text-center space-y-2">
        <p className="font-terminal text-xs text-[var(--muted)]">NO CONTRADICTIONS DETECTED</p>
        <p className="text-sm text-[var(--text-dim)]">No direct empirical or theoretical disagreements were found across the provided sources.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="contradiction">CONTRADICTION</Badge>
          <span className="font-terminal text-xs text-[var(--muted)]">
            {contradictions.length} Active Disagreements & Divergent Findings
          </span>
        </div>
        <span className="font-terminal text-[0.65rem] text-[var(--text-dim)]">
          Click any [S#] chip to view grounding evidence
        </span>
      </div>

      <div className="space-y-4">
        {contradictions.map((item, idx) => (
          <article
            key={idx}
            className="card-semantic card-contradiction space-y-3 animate-card-in"
          >
            {/* Header / Citation Chips */}
            <div className="flex items-center justify-between">
              <span className="font-terminal text-[0.65rem] text-[var(--contradiction)] uppercase tracking-wider font-semibold">
                Contradiction #{idx + 1}
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
                        relation: 'contradiction',
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
                  relation: 'contradiction',
                });
              })}
            </h3>

            {/* Explanation / Conflict Analysis */}
            {item.explanation && (
              <p className="text-xs text-[var(--muted)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
                <strong className="text-[var(--text)] font-medium">Nature of disagreement: </strong>
                {item.explanation}
              </p>
            )}

            {/* Opposing Excerpts side-by-side or stacked */}
            {item.citation_passages && Object.keys(item.citation_passages).length > 0 && (
              <div className="bg-[var(--surface-2)] p-2.5 rounded-sm border border-[var(--border-subtle)] space-y-2">
                <span className="font-terminal text-[0.62rem] text-[var(--contradiction)] uppercase tracking-wider block">
                  Opposing Positions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(item.citation_passages).map(([srcId, quote]) => (
                    <div
                      key={srcId}
                      className="p-2 rounded bg-[var(--surface)] border border-[var(--border)] text-[0.72rem] text-[var(--muted)] space-y-1"
                    >
                      <span className="font-terminal text-[var(--contradiction)] font-bold">[S{srcId}] Position:</span>
                      <p className="italic line-clamp-3">"{quote}"</p>
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
