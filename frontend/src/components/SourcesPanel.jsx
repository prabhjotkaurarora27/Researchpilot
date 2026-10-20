import { useState } from 'react';
import { detectSourceType, cleanDomain } from '../lib/utils';
import { SourceIndexBadge, SourceTypeBadge, CredibilityBadge } from './ui/Badge';
import { SourceCardSkeleton } from './ui/Skeleton';

export function SourcesPanel({
  sources = [],
  setSources,
  selectedSourceId,
  onSelectSource,
  onExtractUrls,
  onLoadBenchmark,
  isExtracting = false,
  className = '',
}) {
  const [urlInput, setUrlInput] = useState('');
  const [detectedTypes, setDetectedTypes] = useState([]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setUrlInput(val);

    // Auto-detect types for pasted URLs
    const lines = val.split('\n').map((l) => l.trim()).filter(Boolean);
    const types = lines.map((url) => ({
      url,
      type: detectSourceType(url),
      domain: cleanDomain(url),
    }));
    setDetectedTypes(types);
  };

  const handleExtract = () => {
    const urls = urlInput
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) return;
    onExtractUrls?.(urls);
    setUrlInput('');
    setDetectedTypes([]);
  };

  const handleRemoveSource = (id, e) => {
    e.stopPropagation();
    setSources?.((prev) => prev.filter((s) => s.id !== id));
  };

  const handleMoveSource = (index, direction, e) => {
    e.stopPropagation();
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= sources.length) return;

    setSources?.((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIdx];
      copy[newIdx] = temp;
      return copy;
    });
  };

  return (
    <div className={`flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] overflow-hidden ${className}`}>
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-terminal text-xs uppercase tracking-wider text-[var(--muted)] font-semibold">
            Sources
          </span>
          <span className="font-terminal text-[0.68rem] text-[var(--accent)] bg-[rgba(245,184,65,0.08)] px-1.5 py-0.2 rounded-sm border border-[rgba(245,184,65,0.2)]">
            {sources.length} active
          </span>
        </div>

        <button
          onClick={onLoadBenchmark}
          className="btn-ghost !text-[0.68rem] text-[var(--accent)] hover:text-[var(--accent-hover)]"
          title="Load 4 curated AI scaling research sources for instant demonstration"
        >
          Load Benchmark
        </button>
      </div>

      {/* URL Ingestion Box */}
      <div className="p-3.5 border-b border-[var(--border)] space-y-2.5">
        <label htmlFor="url-input" className="font-terminal text-[0.65rem] uppercase tracking-wider text-[var(--muted)] block">
          Paste URLs (ArXiv, Nature, Blogs, YouTube)
        </label>

        <textarea
          id="url-input"
          rows={3}
          value={urlInput}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleExtract();
            }
          }}
          disabled={isExtracting}
          placeholder="https://arxiv.org/abs/...&#10;https://nature.com/...&#10;https://youtube.com/watch?v=..."
          className="input-editorial text-xs resize-none"
        />

        {/* Live Detected Types Pill Strip */}
        {detectedTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 p-2 bg-[var(--surface-2)] rounded-sm border border-[var(--border-subtle)]">
            {detectedTypes.map((dt, i) => (
              <span
                key={i}
                className="font-terminal text-[0.62rem] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] flex items-center gap-1"
              >
                <span className="text-[var(--accent)] font-semibold">{dt.domain}</span>
                <span className="text-[var(--text-dim)]">({dt.type})</span>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="font-terminal text-[0.62rem] text-[var(--text-dim)]">
            ⌘ + Enter to ingest
          </span>
          <button
            onClick={handleExtract}
            disabled={isExtracting || !urlInput.trim()}
            className="btn-primary !h-8 !px-3 !text-xs !rounded-sm font-terminal"
          >
            {isExtracting ? 'Extracting...' : 'Extract Sources'}
          </button>
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {isExtracting && (
          <div className="space-y-2">
            <SourceCardSkeleton />
            <SourceCardSkeleton />
          </div>
        )}

        {sources.length === 0 && !isExtracting ? (
          <div className="p-6 text-center space-y-3 border border-dashed border-[var(--border)] rounded-sm bg-[var(--surface-2)]">
            <div className="font-terminal text-xs text-[var(--muted)] uppercase tracking-wider">
              No Sources Loaded
            </div>
            <p className="text-xs text-[var(--text-dim)] font-body leading-relaxed">
              Paste URLs above or load our benchmark research set to synthesize consensus across papers.
            </p>
            <button
              onClick={onLoadBenchmark}
              className="btn-terminal !text-xs !py-1.5 mx-auto"
            >
              Load Benchmark Dataset
            </button>
          </div>
        ) : (
          sources.map((source, index) => {
            const isSelected = selectedSourceId === source.id;
            const extracted = source.extracted_data || {};
            const title = extracted.title || source.url;
            const type = extracted.source_type || detectSourceType(source.url);
            const status = source.status || 'ready';

            return (
              <div
                key={source.id || index}
                onClick={() => onSelectSource?.(source.id)}
                className={`p-3 rounded-sm border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-[var(--surface-2)] border-[var(--accent)] shadow-sm'
                    : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-focus)]'
                }`}
              >
                {/* Header row: [S#] + Status chip + Reorder / Delete */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <SourceIndexBadge index={index + 1} active={isSelected} />
                    <SourceTypeBadge type={type} />
                    {source.credibility && (
                      <CredibilityBadge credibility={source.credibility} />
                    )}
                  </div>

                  {/* Actions: Reorder & Delete */}
                  <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleMoveSource(index, -1, e)}
                      disabled={index === 0}
                      className="p-1 text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-20 text-[0.65rem] font-terminal"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => handleMoveSource(index, 1, e)}
                      disabled={index === sources.length - 1}
                      className="p-1 text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-20 text-[0.65rem] font-terminal"
                      title="Move down"
                    >
                      ▼
                    </button>
                    <button
                      onClick={(e) => handleRemoveSource(source.id, e)}
                      className="p-1 text-[var(--muted)] hover:text-[var(--contradiction)] text-[0.65rem] font-terminal"
                      title="Remove source"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Source Title */}
                <h4 className="font-display font-semibold text-xs text-[var(--text)] leading-snug line-clamp-2">
                  {title}
                </h4>

                {/* Core Claim Preview */}
                {extracted.core_claim && (
                  <p className="font-body text-[0.72rem] text-[var(--muted)] line-clamp-2 leading-relaxed border-l border-[var(--border-focus)] pl-2">
                    {extracted.core_claim}
                  </p>
                )}

                {/* Footer Domain + Status */}
                <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)] text-[0.65rem] font-terminal text-[var(--text-dim)]">
                  <span>{source.domain || cleanDomain(source.url)}</span>
                  <span className={status === 'done' || status === 'ready' ? 'text-[var(--consensus)]' : 'text-[var(--accent)]'}>
                    {status === 'done' || status === 'ready' ? 'READY' : 'EXTRACTING'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
