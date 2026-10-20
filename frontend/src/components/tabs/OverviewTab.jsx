import { useState } from 'react';
import { renderCitedText } from '../ui/CitationChip';

export function OverviewTab({ synthesis, sources, onCitationClick }) {
  const [depth, setDepth] = useState('summary'); // 'tldr' | 'summary' | 'full'

  if (!synthesis) {
    return (
      <div className="p-8 text-center space-y-2">
        <p className="font-terminal text-xs text-[var(--muted)]">NO SYNTHESIS DATA</p>
        <p className="text-sm text-[var(--text-dim)]">Add 2 or more sources and run synthesis to view overview.</p>
      </div>
    );
  }

  const consensusCount = synthesis.consensus?.length || 0;
  const contradictionCount = synthesis.contradictions?.length || 0;
  const connectionCount = synthesis.connections?.length || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)] border-l-[3px] border-l-[var(--consensus)] rounded-sm">
          <span className="font-terminal text-[0.62rem] uppercase tracking-wider text-[var(--muted)] block">
            Consensus Points
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-terminal text-2xl font-bold text-[var(--consensus)]">
              {consensusCount}
            </span>
            <span className="text-[0.7rem] text-[var(--muted)]">Cross-verified claims</span>
          </div>
        </div>

        <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)] border-l-[3px] border-l-[var(--contradiction)] rounded-sm">
          <span className="font-terminal text-[0.62rem] uppercase tracking-wider text-[var(--muted)] block">
            Contradictions
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-terminal text-2xl font-bold text-[var(--contradiction)]">
              {contradictionCount}
            </span>
            <span className="text-[0.7rem] text-[var(--muted)]">Direct conflicts</span>
          </div>
        </div>

        <div className="p-3.5 bg-[var(--surface)] border border-[var(--border)] border-l-[3px] border-l-[var(--connection)] rounded-sm">
          <span className="font-terminal text-[0.62rem] uppercase tracking-wider text-[var(--muted)] block">
            Connections
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-terminal text-2xl font-bold text-[var(--connection)]">
              {connectionCount}
            </span>
            <span className="text-[0.7rem] text-[var(--muted)]">Emergent synthesis</span>
          </div>
        </div>
      </div>

      {/* Depth Switcher */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h3 className="font-terminal text-xs uppercase tracking-wider text-[var(--muted)]">
          Synthesis Dossier
        </h3>
        <div className="flex items-center gap-1 bg-[var(--surface-2)] p-0.5 rounded-sm border border-[var(--border)]">
          {[
            { id: 'tldr', label: 'TL;DR' },
            { id: 'summary', label: 'Executive Summary' },
            { id: 'full', label: 'Full Breakdown' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDepth(item.id)}
              className={`font-terminal text-[0.68rem] px-2.5 py-1 rounded-sm transition-all ${
                depth === item.id
                  ? 'bg-[var(--surface)] text-[var(--accent)] font-semibold shadow-sm border border-[var(--border)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering based on Depth */}
      <article className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-5 sm:p-6 shadow-sm">
        {depth === 'tldr' && (
          <div className="space-y-3">
            <span className="font-terminal text-[0.65rem] text-[var(--accent)] uppercase tracking-wider">
              Single-Sentence Distillation
            </span>
            <p className="font-display text-lg sm:text-xl text-[var(--text)] leading-relaxed">
              {renderCitedText(synthesis.summary_oneline, onCitationClick)}
            </p>
          </div>
        )}

        {depth === 'summary' && (
          <div className="space-y-3">
            <span className="font-terminal text-[0.65rem] text-[var(--accent)] uppercase tracking-wider">
              Synthesized Abstract
            </span>
            <p className="text-sm sm:text-base text-[var(--text)] leading-[1.8] font-body">
              {renderCitedText(synthesis.summary_paragraph, onCitationClick)}
            </p>
          </div>
        )}

        {depth === 'full' && (
          <div className="space-y-4">
            <span className="font-terminal text-[0.65rem] text-[var(--accent)] uppercase tracking-wider">
              Thematic Breakdown
            </span>
            <div className="space-y-4 text-sm text-[var(--text)] leading-relaxed">
              {synthesis.summary_full?.split('\n').map((paragraph, i) => {
                if (!paragraph.trim()) return null;
                if (paragraph.startsWith('## ')) {
                  return (
                    <h4
                      key={i}
                      className="font-display text-base font-semibold text-[var(--text)] pt-3 border-t border-[var(--border-subtle)]"
                    >
                      {paragraph.replace('## ', '')}
                    </h4>
                  );
                }
                return (
                  <p key={i} className="text-sm text-[var(--muted)] leading-[1.75]">
                    {renderCitedText(paragraph, onCitationClick)}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </article>

      {/* Suggested Follow-up Questions */}
      {synthesis.suggested_questions && synthesis.suggested_questions.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="font-terminal text-xs uppercase tracking-wider text-[var(--muted)]">
            Suggested Research Questions (Derived from Conflicts)
          </span>
          <div className="space-y-2">
            {synthesis.suggested_questions.map((q, i) => (
              <div
                key={i}
                className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-sm flex items-start gap-2.5"
              >
                <span className="font-terminal text-xs text-[var(--accent)] font-bold">Q{i + 1}</span>
                <p className="text-xs text-[var(--text)] leading-relaxed font-body">
                  {renderCitedText(q, onCitationClick)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
