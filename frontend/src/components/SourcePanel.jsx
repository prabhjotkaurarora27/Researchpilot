import { useState } from 'react';
import SourceCard from './SourceCard';
import { extractSources } from '../hooks/useApi';

/**
 * Left panel: URL input + source list.
 */
export default function SourcePanel({
  sources,
  setSources,
  selectedSourceId,
  onSelectSource,
  onSourcesExtracted,
  isExtracting,
  setIsExtracting,
}) {
  const [urlInput, setUrlInput] = useState('');

  const handleExtract = async () => {
    const urls = urlInput
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) return;
    if (urls.length > 10) {
      alert('Maximum 10 URLs allowed per session.');
      return;
    }

    setIsExtracting(true);

    try {
      const result = await extractSources(urls);
      const newSources = result.sources || [];
      setSources((prev) => [...prev, ...newSources]);
      onSourcesExtracted?.(newSources);
      setUrlInput('');
    } catch (err) {
      console.error('Extraction error:', err);
      alert(`Extraction failed: ${err.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleExtract();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-surface)]">
      {/* Section Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <h2 className="font-citation text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
          Sources
        </h2>
      </div>

      {/* URL Input Area */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <textarea
          id="url-input"
          className="input-terminal"
          placeholder="Paste URLs here (one per line)&#10;https://arxiv.org/abs/...&#10;https://youtube.com/watch?v=..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
          disabled={isExtracting}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">
            {urlInput.split('\n').filter((u) => u.trim()).length} URLs · ⌘+Enter to extract
          </span>
          <button
            id="extract-btn"
            className="btn-primary"
            onClick={handleExtract}
            disabled={isExtracting || !urlInput.trim()}
          >
            {isExtracting ? 'Extracting…' : 'Extract'}
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isExtracting && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border)]">
          <div className="flex gap-1">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
          <span className="font-citation text-[0.7rem] text-[var(--color-text-tertiary)]">
            Scraping & extracting…
          </span>
        </div>
      )}

      {/* Source List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {sources.length === 0 && !isExtracting ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="font-citation text-[0.7rem] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              No sources loaded
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
              Paste article URLs, research paper links, or YouTube video URLs above to begin synthesis.
            </p>
          </div>
        ) : (
          sources.map((source, index) => (
            <SourceCard
              key={source.id}
              source={source}
              index={index + 1}
              isSelected={selectedSourceId === source.id}
              onSelect={onSelectSource}
            />
          ))
        )}
      </div>

      {/* Source Count Footer */}
      {sources.length > 0 && (
        <div className="px-4 py-2 border-t border-[var(--color-border)] flex items-center justify-between">
          <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">
            {sources.filter((s) => s.status === 'done').length}/{sources.length} extracted
          </span>
        </div>
      )}
    </div>
  );
}
