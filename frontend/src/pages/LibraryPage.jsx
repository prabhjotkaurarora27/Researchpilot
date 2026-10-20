import { useState, useMemo } from 'react';
import { formatRelativeTime } from '../lib/utils';
import { Container } from '../components/ui/Container';
import { Footer } from '../components/Footer';

export function LibraryPage({ onOpenSession, onLoadBenchmark, onRouteChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  // Realistic mock research sessions
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

  // Calculate summary metrics for dashboard strip
  const totalSessions = savedSessions.length;
  const totalSources = savedSessions.reduce((acc, s) => acc + s.sourceCount, 0);
  const totalAgreements = savedSessions.reduce((acc, s) => acc + s.consensusCount, 0);
  const totalConflicts = savedSessions.reduce((acc, s) => acc + s.contradictionCount, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg)] py-10">
      <Container className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div className="space-y-1">
            <span className="eyebrow-label text-[var(--accent)]">
              RESEARCH REPOSITORY
            </span>
            <h1 className="h2-editorial text-[var(--text)]">
              Your research
            </h1>
            <p className="text-sm text-[var(--muted)] font-body">
              Every session you have run, ready to reopen.
            </p>
          </div>

          <button
            onClick={onLoadBenchmark}
            className="btn-primary self-start sm:self-auto"
          >
            <span>Start a research session</span>
            <span className="font-terminal font-bold">+</span>
          </button>
        </div>

        {/* Dashboard Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-standard !p-5">
            <span className="eyebrow-label text-[var(--text-dim)] block mb-1">TOTAL SESSIONS</span>
            <span className="font-terminal text-2xl font-bold text-[var(--text)]">{totalSessions}</span>
            <span className="text-xs text-[var(--muted)] block mt-1">Archived reviews</span>
          </div>
          <div className="card-standard !p-5">
            <span className="eyebrow-label text-[var(--text-dim)] block mb-1">INGESTED SOURCES</span>
            <span className="font-terminal text-2xl font-bold text-[var(--accent)]">{totalSources}</span>
            <span className="text-xs text-[var(--muted)] block mt-1">Papers, blogs & videos</span>
          </div>
          <div className="card-standard !p-5">
            <span className="eyebrow-label text-[var(--text-dim)] block mb-1">AGREEMENTS FOUND</span>
            <span className="font-terminal text-2xl font-bold text-[var(--consensus)]">{totalAgreements}</span>
            <span className="text-xs text-[var(--muted)] block mt-1">Shared findings</span>
          </div>
          <div className="card-standard !p-5">
            <span className="eyebrow-label text-[var(--text-dim)] block mb-1">CONFLICTS DETECTED</span>
            <span className="font-terminal text-2xl font-bold text-[var(--contradiction)]">{totalConflicts}</span>
            <span className="text-xs text-[var(--muted)] block mt-1">Direct contradictions</span>
          </div>
        </div>

        {/* Search & Topic Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              className="input-editorial text-sm pl-9"
              placeholder="Search sessions by title, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-3 text-sm text-[var(--text-dim)] font-terminal">
              ⌕
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`font-terminal text-xs px-3 py-2 rounded-md border whitespace-nowrap transition-colors ${
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

        {/* Full-width Table in Container with 16px Row Padding and Sticky Header */}
        <div className="border border-[var(--border)] rounded-xl bg-[var(--surface)] overflow-x-auto shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--surface-2)] border-b border-[var(--border)] font-terminal text-[0.72rem] uppercase tracking-wider text-[var(--muted)] sticky top-0 z-10">
              <tr>
                <th className="p-4 sm:px-6">Research session</th>
                <th className="p-4 sm:px-6">Sources</th>
                <th className="p-4 sm:px-6">Result</th>
                <th className="p-4 sm:px-6">Topics</th>
                <th className="p-4 sm:px-6">Last opened</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredSessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-[var(--surface-2)] transition-colors group cursor-pointer"
                  onClick={() => onOpenSession?.(session)}
                >
                  {/* Research Session Title */}
                  <td className="p-4 sm:px-6 align-middle">
                    <div className="space-y-1">
                      <h3 className="font-body font-semibold text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {session.title}
                      </h3>
                      <div className="flex items-center gap-2 font-terminal text-[0.68rem] text-[var(--text-dim)]">
                        <span>{session.sources.join(' · ')}</span>
                      </div>
                    </div>
                  </td>

                  {/* Sources Count */}
                  <td className="p-4 sm:px-6 align-middle whitespace-nowrap font-terminal text-xs text-[var(--muted)]">
                    {session.sourceCount} sources
                  </td>

                  {/* Result (e.g. "2 agree · 2 conflict") */}
                  <td className="p-4 sm:px-6 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-terminal text-xs">
                      <span className="text-[var(--consensus)] font-semibold">
                        {session.consensusCount} agree
                      </span>
                      <span className="text-[var(--text-dim)]">·</span>
                      <span className="text-[var(--contradiction)] font-semibold">
                        {session.contradictionCount} conflict
                      </span>
                    </div>
                  </td>

                  {/* Topics */}
                  <td className="p-4 sm:px-6 align-middle">
                    <div className="flex flex-wrap gap-1.5">
                      {session.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="font-terminal text-[0.65rem] px-2 py-0.5 rounded-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Last Opened (Relative timestamp) */}
                  <td className="p-4 sm:px-6 align-middle whitespace-nowrap font-terminal text-xs text-[var(--muted)]">
                    {formatRelativeTime(session.date)}
                  </td>

                  {/* Actions */}
                  <td className="p-4 sm:px-6 align-middle text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSession?.(session);
                      }}
                      className="btn-secondary !h-8 !px-3 !text-xs !rounded-md hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      Reopen →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Full-bleed Footer */}
      <Footer onRouteChange={onRouteChange} />
    </div>
  );
}
