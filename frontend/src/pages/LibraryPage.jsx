import { useState, useMemo } from 'react';
import { formatRelativeTime } from '../lib/utils';

export function LibraryPage({ onOpenSession, onLoadBenchmark }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  // Realistic mock research sessions + knowledge base items
  const savedSessions = useMemo(() => [
    {
      id: 'session-101',
      title: 'LLM Scaling Laws, Chinchilla Optimality & Emergence',
      sourceCount: 4,
      date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      tags: ['AI Scaling', 'ArXiv', 'Empirical ML'],
      sources: ['arxiv.org/2001.08361', 'arxiv.org/2203.15556', 'arxiv.org/2304.15004', 'anthropic.com'],
      consensusCount: 2,
      contradictionCount: 2,
    },
    {
      id: 'session-102',
      title: 'Retrieval Augmented Generation vs Long-Context Transformers',
      sourceCount: 3,
      date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      tags: ['RAG', 'Context Length', 'Information Retrieval'],
      sources: ['arxiv.org/2402.12345', 'deepmind.google', 'huggingface.co'],
      consensusCount: 3,
      contradictionCount: 1,
    },
    {
      id: 'session-103',
      title: 'Sparse Autoencoders & Mechanistic Interpretability in Production Models',
      sourceCount: 2,
      date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      tags: ['Interpretability', 'Safety', 'SAEs'],
      sources: ['anthropic.com', 'transformer-circuits.pub'],
      consensusCount: 1,
      contradictionCount: 1,
    },
    {
      id: 'session-104',
      title: 'Direct Preference Optimization vs RLHF for Post-Training Alignment',
      sourceCount: 5,
      date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      tags: ['Alignment', 'DPO', 'RLHF'],
      sources: ['arxiv.org/2305.18290', 'openai.com', 'berkeley.edu'],
      consensusCount: 4,
      contradictionCount: 3,
    },
  ], []);

  const allTags = ['ALL', 'AI Scaling', 'RAG', 'Interpretability', 'Alignment'];

  const filteredSessions = savedSessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'ALL' || s.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg)] p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="font-display text-2xl text-[var(--text)] font-semibold">
            Research Library & History
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1 font-body">
            Persistent archive of cross-source synthesis sessions, extracted citations, and triangulation matrices.
          </p>
        </div>

        <button
          onClick={onLoadBenchmark}
          className="btn-amber !py-1.5 !px-3 text-xs self-start sm:self-auto"
        >
          <span>Load Active Benchmark</span>
          <span className="font-terminal">↗</span>
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            className="input-editorial text-xs pl-8"
            placeholder="Search saved research sessions by keyword or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-2.5 top-2.5 text-xs text-[var(--text-dim)] font-terminal">
            ⌕
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`font-terminal text-[0.68rem] px-2.5 py-1.5 rounded-sm border whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-[var(--surface-2)] text-[var(--accent)] border-[var(--accent)] font-semibold'
                  : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--border-focus)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Dense Bloomberg Terminal Table */}
      <div className="border border-[var(--border)] rounded-sm bg-[var(--surface)] overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs min-w-[700px]">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--border)] font-terminal text-[0.65rem] uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="p-3.5">Research Session</th>
              <th className="p-3.5">Sources</th>
              <th className="p-3.5">Triangulation</th>
              <th className="p-3.5">Tags</th>
              <th className="p-3.5">Saved</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredSessions.map((session) => (
              <tr
                key={session.id}
                className="hover:bg-[var(--surface-2)] transition-colors group cursor-pointer"
                onClick={() => onOpenSession?.(session)}
              >
                {/* Title */}
                <td className="p-3.5 align-middle">
                  <div className="space-y-1">
                    <h3 className="font-display font-semibold text-xs text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-2 font-terminal text-[0.62rem] text-[var(--text-dim)]">
                      <span>{session.sources.join(' · ')}</span>
                    </div>
                  </div>
                </td>

                {/* Sources Count */}
                <td className="p-3.5 align-middle whitespace-nowrap font-terminal text-xs text-[var(--muted)]">
                  {session.sourceCount} sources
                </td>

                {/* Triangulation Metrics */}
                <td className="p-3.5 align-middle whitespace-nowrap">
                  <div className="flex items-center gap-2 font-terminal text-[0.68rem]">
                    <span className="text-[var(--consensus)]">
                      {session.consensusCount} agree
                    </span>
                    <span className="text-[var(--text-dim)]">/</span>
                    <span className="text-[var(--contradiction)]">
                      {session.contradictionCount} conflict
                    </span>
                  </div>
                </td>

                {/* Tags */}
                <td className="p-3.5 align-middle">
                  <div className="flex flex-wrap gap-1">
                    {session.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="font-terminal text-[0.62rem] px-1.5 py-0.5 rounded-xs bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Relative Timestamp */}
                <td className="p-3.5 align-middle whitespace-nowrap font-terminal text-[0.68rem] text-[var(--muted)]">
                  {formatRelativeTime(session.date)}
                </td>

                {/* Action Buttons */}
                <td className="p-3.5 align-middle text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSession?.(session);
                    }}
                    className="btn-terminal !py-1 !px-2.5 text-[0.68rem] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Open Session →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
