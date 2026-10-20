import { useState, useCallback } from 'react';
import { renderCitedText } from './ConsensusView';

/**
 * Three-depth summary view: TL;DR | Summary | Full Breakdown.
 */
export default function SummaryView({ synthesis, sources, onCitationClick }) {
  const [depth, setDepth] = useState('paragraph');
  const [expandedKey, setExpandedKey] = useState(null);

  const handleToggleCitation = useCallback((key) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  }, []);

  if (!synthesis) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-[var(--color-text-muted)]">Generate a synthesis first.</p>
      </div>
    );
  }

  const depths = [
    { key: 'oneline', label: 'TL;DR' },
    { key: 'paragraph', label: 'Summary' },
    { key: 'full', label: 'Full Breakdown' },
  ];

  const contentMap = {
    oneline: synthesis.summary_oneline,
    paragraph: synthesis.summary_paragraph,
    full: synthesis.summary_full,
  };

  const content = contentMap[depth] || '';

  // Build a combined citation_passages map from all synthesis points for summary text
  const allPassages = {};
  for (const section of ['consensus', 'contradictions', 'connections']) {
    for (const item of (synthesis[section] || [])) {
      if (item.citation_passages) {
        Object.assign(allPassages, item.citation_passages);
      }
    }
  }

  const citedOpts = (prefix) => ({
    citationPassages: allPassages,
    sources,
    expandedKey,
    onToggleCitation: handleToggleCitation,
    keyPrefix: prefix,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Depth Selector */}
      <div className="flex gap-1 px-4 pt-4 pb-2">
        {depths.map(({ key, label }) => (
          <button
            key={key}
            className={`btn-secondary ${depth === key ? '!border-[var(--color-accent-gold)] !text-[var(--color-accent-gold)]' : ''}`}
            onClick={() => setDepth(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 animate-fadein">
        {depth === 'oneline' ? (
          <div className="py-8 px-4">
            <p className="text-lg font-medium text-[var(--color-text-primary)] leading-relaxed font-source">
              {renderCitedText(content, onCitationClick, citedOpts('sum-ol'))}
            </p>
          </div>
        ) : depth === 'paragraph' ? (
          <div className="py-4">
            <p className="text-sm text-[var(--color-text-primary)] leading-[1.8]">
              {renderCitedText(content, onCitationClick, citedOpts('sum-p'))}
            </p>
          </div>
        ) : (
          <div className="py-4 prose-dark">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return (
                  <h3 key={i} className="font-citation text-[0.8rem] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mt-6 mb-2">
                    {line.replace('## ', '')}
                  </h3>
                );
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <p key={i} className="text-sm font-semibold text-[var(--color-accent-gold)] mt-3 mb-1">
                    {line.replace(/\*\*/g, '')}
                  </p>
                );
              }
              if (line.startsWith('- ')) {
                return (
                  <div key={i} className="flex gap-2 ml-2 my-1">
                    <span className="text-[var(--color-text-muted)] mt-0.5">›</span>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {renderCitedText(line.replace('- ', ''), onCitationClick, citedOpts(`sum-f-${i}`))}
                    </p>
                  </div>
                );
              }
              if (line.trim() === '') return <div key={i} className="h-2" />;
              return (
                <p key={i} className="text-sm text-[var(--color-text-primary)] leading-[1.8] mb-2">
                  {renderCitedText(line, onCitationClick, citedOpts(`sum-f-${i}`))}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
