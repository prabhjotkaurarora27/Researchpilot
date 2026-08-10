import { useState, useEffect } from 'react';
import {
  saveToKnowledgeBase,
  listSavedSources,
  searchKnowledgeBase,
} from '../hooks/useApi';

/**
 * Persistent knowledge base — save, search, tag, browse.
 */
export default function KnowledgeBase({ sources, onImportSources }) {
  const [savedSources, setSavedSources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load saved sources on mount
  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      const data = await listSavedSources();
      setSavedSources(data.sources || []);
    } catch (err) {
      console.error('Failed to load saved sources:', err);
    }
  };

  const handleSave = async () => {
    const doneSources = sources.filter((s) => s.status === 'done');
    if (doneSources.length === 0) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    setIsSaving(true);
    try {
      await saveToKnowledgeBase(
        doneSources.map((s) => s.id),
        tags,
      );
      setSaveMessage(`Saved ${doneSources.length} source(s)`);
      setTagInput('');
      await loadSaved();
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchKnowledgeBase(searchQuery, selectedTags);
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Gather all unique tags
  const allTags = [...new Set(savedSources.flatMap((s) => s.saved_tags || []))];

  const displaySources = searchResults !== null ? searchResults : savedSources;

  return (
    <div className="flex flex-col h-full">
      {/* Save Current Sources */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <h3 className="font-citation text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
          Save Current Sources
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            className="input-terminal flex-1"
            placeholder="Tags (comma-separated): ml, transformers, 2024"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={isSaving || sources.filter((s) => s.status === 'done').length === 0}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
        {saveMessage && (
          <p className="font-citation text-[0.7rem] text-[var(--color-accent-green)] mt-1.5">
            {saveMessage}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex gap-2">
          <input
            id="kb-search-input"
            type="text"
            className="input-terminal flex-1"
            placeholder="Search saved research…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn-secondary" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? '…' : 'Search'}
          </button>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`tag-chip cursor-pointer transition-all ${
                  selectedTags.includes(tag)
                    ? '!bg-[rgba(240,180,41,0.2)] !border-[rgba(240,180,41,0.5)]'
                    : ''
                }`}
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
                  );
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {searchResults !== null && (
          <div className="px-4 py-2 border-b border-[var(--color-border-subtle)]">
            <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
            </span>
          </div>
        )}

        {displaySources.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-[var(--color-text-muted)]">
              {searchResults !== null ? 'No results found.' : 'No saved sources yet.'}
            </p>
          </div>
        ) : (
          displaySources.map((source) => {
            const extracted = typeof source.extracted_data === 'string'
              ? JSON.parse(source.extracted_data)
              : source.extracted_data || {};

            return (
              <div key={source.id} className="search-result">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {extracted.title || source.url}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-citation text-[0.7rem] text-[var(--color-text-tertiary)]">
                        {source.domain}
                      </span>
                      {extracted.publish_date && (
                        <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">
                          {extracted.publish_date}
                        </span>
                      )}
                    </div>
                    {extracted.core_claim && (
                      <p className="font-source text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                        {extracted.core_claim}
                      </p>
                    )}
                    {/* Tags */}
                    {(source.saved_tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {source.saved_tags.map((tag) => (
                          <span key={tag} className="tag-chip">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-citation text-[0.65rem] text-[var(--color-accent-cyan)] hover:underline shrink-0"
                  >
                    Open
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[var(--color-border)]">
        <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">
          {savedSources.length} source{savedSources.length !== 1 ? 's' : ''} in knowledge base
        </span>
      </div>
    </div>
  );
}
