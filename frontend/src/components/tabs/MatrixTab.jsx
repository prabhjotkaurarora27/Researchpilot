import { SourceIndexBadge, SourceTypeBadge } from '../ui/Badge';

export function MatrixTab({ sources = [], customMatrix = null }) {
  const doneSources = sources.filter((s) => s.status === 'done');

  if (doneSources.length < 2 && (!customMatrix || customMatrix.length === 0)) {
    return (
      <div className="p-8 text-center space-y-2">
        <p className="font-terminal text-xs text-[var(--muted)]">INSUFFICIENT SOURCES FOR MATRIX</p>
        <p className="text-sm text-[var(--text-dim)]">Extract at least 2 sources to populate the dimensional comparison matrix.</p>
      </div>
    );
  }

  // Derive columns from sources
  const columns = doneSources.map((s, idx) => ({
    id: idx + 1,
    sourceId: s.id,
    title: s.extracted_data?.title || s.url,
    domain: s.domain,
    type: s.extracted_data?.source_type || 'paper',
  }));

  // Standard dimensions to compare
  const dimensions = [
    {
      label: 'Core Claim / Thesis',
      getValue: (s) => s.extracted_data?.core_claim || 'N/A',
      isDivergent: true,
    },
    {
      label: 'Methodology / Design',
      getValue: (s) => s.extracted_data?.methodology || 'Empirical analysis',
      isDivergent: false,
    },
    {
      label: 'Sample / Dataset',
      getValue: (s) => s.extracted_data?.sample_size || (s.extracted_data?.key_stats?.[0] ? 'Benchmark corpus' : 'Web scraped text'),
      isDivergent: true,
    },
    {
      label: 'Quantitative Findings',
      getValue: (s) => s.extracted_data?.key_stats?.[0] || 'See extract',
      isDivergent: true,
    },
    {
      label: 'Publication Date',
      getValue: (s) => s.extracted_data?.publish_date || 'Undated',
      isDivergent: false,
    },
    {
      label: 'Peer / Lab Authority',
      getValue: (s) => s.credibility?.label || s.domain,
      isDivergent: false,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-terminal text-xs uppercase tracking-wider text-[var(--muted)]">
            Dimensional Cross-Comparison Matrix
          </h3>
          <p className="text-xs text-[var(--text-dim)] mt-0.5 font-body">
            Systematic cross-tabulation of empirical methodology, sample scale, and core claims.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-terminal text-[0.65rem] text-[var(--muted)]">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--contradiction-bg)] border border-[var(--contradiction)]" />
            <span>Contradiction / Divergent Finding</span>
          </div>
        </div>
      </div>

      {/* Matrix Table with Sticky First Column & Header */}
      <div className="border border-[var(--border)] rounded-sm overflow-x-auto max-h-[70vh] relative bg-[var(--surface)]">
        <table className="w-full border-collapse text-left text-xs min-w-[700px]">
          {/* Table Header (Sticky) */}
          <thead className="sticky top-0 z-20 bg-[var(--surface-2)] border-b border-[var(--border)]">
            <tr>
              <th className="sticky left-0 z-30 bg-[var(--surface-2)] p-3.5 border-r border-[var(--border)] font-terminal text-[0.68rem] uppercase tracking-wider text-[var(--muted)] w-48 min-w-[12rem] shadow-[2px_0_4px_rgba(0,0,0,0.3)]">
                Dimension
              </th>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="p-3.5 border-r border-[var(--border)] last:border-r-0 min-w-[16rem] align-top"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <SourceIndexBadge index={col.id} />
                    <SourceTypeBadge type={col.type} />
                  </div>
                  <h4 className="font-display font-semibold text-xs text-[var(--text)] line-clamp-2" title={col.title}>
                    {col.title}
                  </h4>
                  <span className="font-terminal text-[0.65rem] text-[var(--text-dim)] block mt-0.5">
                    {col.domain}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--border)]">
            {dimensions.map((dim, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-[var(--surface-2)] transition-colors">
                {/* Sticky First Column */}
                <td className="sticky left-0 z-10 bg-[var(--surface)] p-3.5 border-r border-[var(--border)] font-terminal text-xs text-[var(--muted)] font-medium shadow-[2px_0_4px_rgba(0,0,0,0.3)] align-top">
                  <div className="flex items-center gap-1.5">
                    {dim.isDivergent && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[var(--contradiction)] shrink-0"
                        title="Divergent dimension"
                      />
                    )}
                    <span>{dim.label}</span>
                  </div>
                </td>

                {/* Source Cells */}
                {doneSources.map((source, colIdx) => {
                  const cellValue = dim.getValue(source);
                  const isDivergent = dim.isDivergent;

                  return (
                    <td
                      key={source.id || colIdx}
                      className={`p-3.5 border-r border-[var(--border)] last:border-r-0 align-top transition-colors ${
                        isDivergent
                          ? 'bg-[var(--contradiction-bg)] border-b-[var(--contradiction-border)] text-[var(--text)]'
                          : 'text-[var(--muted)]'
                      }`}
                    >
                      <p className="font-body text-xs leading-relaxed">
                        {cellValue}
                      </p>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
