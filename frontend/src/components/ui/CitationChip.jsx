import { cn } from '../../lib/utils';

/**
 * Mono Citation Chip [S1]
 * Used inline across all claims, summaries, and synthesized text.
 * Hover/click triggers the evidence drawer in the right pane.
 */
export function CitationChip({ sourceIndex, onClick, onMouseEnter, onMouseLeave, active = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(sourceIndex);
      }}
      onMouseEnter={() => onMouseEnter?.(sourceIndex)}
      onMouseLeave={() => onMouseLeave?.(sourceIndex)}
      className={cn('citation-chip', active && 'active', className)}
      title={`Inspect verbatim passage from Source ${sourceIndex}`}
      aria-label={`Citation Source ${sourceIndex}`}
    >
      [S{sourceIndex}]
    </button>
  );
}

/**
 * Helper to render text containing [S1], [S2] or [Source 1], [Source 2] as interactive CitationChips
 */
export function renderCitedText(text = '', onCitationClick, activeSourceIndex = null) {
  if (!text) return null;

  // Split on [S1], [Source 1], [S1][S2], etc.
  const regex = /\[(?:Source\s+|S)?(\d+)\]/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const sourceNum = parseInt(match[1], 10);
    parts.push(
      <CitationChip
        key={`cite-${match.index}-${sourceNum}`}
        sourceIndex={sourceNum}
        active={activeSourceIndex === sourceNum}
        onClick={onCitationClick}
      />
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
