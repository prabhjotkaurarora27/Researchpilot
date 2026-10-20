import { Badge } from '../ui/Badge';
import { renderCitedText, CitationChip } from '../ui/CitationChip';

export function AgreementsTab({ consensus = [], sources = [], onCitationClick }) {
  if (!consensus || consensus.length === 0) {
    return (
      <div className="p-8 text-center space-y-2">
        <p className="font-terminal text-xs text-[var(--muted)]">NO CONSENSUS IDENTIFIED</p>
        <p className="text-sm text-[var(--text-dim)]">The analyzed sources did not share sufficient overlapping claims to form a solid consensus.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="consensus">CONSENSUS</Badge>
          <span className="font-terminal text-xs text-[var(--muted)]">
            {consensus.length} Points of Empirical Agreement
          </span>
        </div>
        <span className="font-terminal text-[0.65rem] text-[var(--text-dim)]">
          Click any [S#] chip to view grounding evidence
        </span>
      </div>

      <div className="space-y-4">
        {consensus.map((item, idx) => (
          <article
            key={idx}
            className="card-semantic card-consensus space-y-3 animate-card-in"
          >
            {/* Header / Citation Chips */}
            <div className="flex items-center justify-between">
              <span className="font-terminal text-[0.65rem] text-[var(--consensus)] uppercase tracking-wider font-semibold">
                Consensus #{idx + 1}
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
                        relation: 'consensus',
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
                  relation: 'consensus',
                });
              })}
            </h3>

            {/* Explanation / Significance */}
            {item.explanation && (
              <p className="text-xs text-[var(--muted)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
                <strong className="text-[var(--text)] font-medium">Why it matters: </strong>
                {item.explanation}
              </p>
            )}

            {/* Verbatim quotes preview if available */}
            {item.citation_passages && Object.keys(item.citation_passages).length > 0 && (
              <div className="bg-[var(--surface-2)] p-2.5 rounded-sm border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-terminal text-[0.62rem] text-[var(--text-dim)] uppercase tracking-wider block">
                  Cited Excerpts
                </span>
                <div className="space-y-1.5">
                  {Object.entries(item.citation_passages).map(([srcId, quote]) => (
                    <div key={srcId} className="flex items-start gap-2 text-[0.72rem] text-[var(--muted)]">
                      <span className="font-terminal text-[var(--consensus)] font-bold shrink-0">[S{srcId}]</span>
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
