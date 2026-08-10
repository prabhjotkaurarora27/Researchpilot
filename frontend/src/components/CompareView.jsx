import { useState } from 'react';
import { compareSources } from '../hooks/useApi';

/**
 * Side-by-side comparison table for 2 selected sources.
 */
export default function CompareView({ sources }) {
  const [sourceA, setSourceA] = useState('');
  const [sourceB, setSourceB] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const doneSources = sources.filter((s) => s.status === 'done');

  const handleCompare = async () => {
    if (!sourceA || !sourceB || sourceA === sourceB) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await compareSources(parseInt(sourceA), parseInt(sourceB));
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (doneSources.length < 2) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-[var(--color-text-muted)]">
          Need at least 2 extracted sources to compare.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Source Selectors */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-border)]">
        <select
          id="compare-source-a"
          className="input-terminal flex-1"
          value={sourceA}
          onChange={(e) => setSourceA(e.target.value)}
        >
          <option value="">Select Source A</option>
          {doneSources.map((s, i) => (
            <option key={s.id} value={s.id}>
              [{i + 1}] {s.extracted_data?.title || s.url}
            </option>
          ))}
        </select>

        <span className="font-citation text-[0.7rem] text-[var(--color-text-muted)]">VS</span>

        <select
          id="compare-source-b"
          className="input-terminal flex-1"
          value={sourceB}
          onChange={(e) => setSourceB(e.target.value)}
        >
          <option value="">Select Source B</option>
          {doneSources.map((s, i) => (
            <option key={s.id} value={s.id}>
              [{i + 1}] {s.extracted_data?.title || s.url}
            </option>
          ))}
        </select>

        <button
          id="compare-btn"
          className="btn-primary"
          onClick={handleCompare}
          disabled={!sourceA || !sourceB || sourceA === sourceB || isLoading}
        >
          {isLoading ? 'Comparing…' : 'Compare'}
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4">
            <p className="text-xs text-[var(--color-accent-red)] font-citation">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="flex gap-1">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        )}

        {result && (
          <div className="animate-fadein">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>Dimension</th>
                  <th style={{ width: '38%' }}>
                    <span className="text-[var(--color-accent-cyan)]">A</span>{' '}
                    {result.source_a_title}
                  </th>
                  <th style={{ width: '38%' }}>
                    <span className="text-[var(--color-accent-gold)]">B</span>{' '}
                    {result.source_b_title}
                  </th>
                  <th style={{ width: '6%' }}></th>
                </tr>
              </thead>
              <tbody>
                {(result.rows || []).map((row, i) => (
                  <tr key={i}>
                    <td className="font-citation text-[0.75rem] font-medium text-[var(--color-text-secondary)]">
                      {row.dimension}
                    </td>
                    <td className="text-[0.8rem] text-[var(--color-text-primary)] font-source leading-relaxed">
                      {row.source_a}
                    </td>
                    <td className="text-[0.8rem] text-[var(--color-text-primary)] font-source leading-relaxed">
                      {row.source_b}
                    </td>
                    <td className="text-center">
                      <span className={`align-indicator align-${row.alignment}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Legend */}
            <div className="flex items-center gap-4 px-4 py-3 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-1.5">
                <span className="align-indicator align-aligned" />
                <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">Aligned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="align-indicator align-divergent" />
                <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">Divergent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="align-indicator align-neutral" />
                <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">Neutral</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
