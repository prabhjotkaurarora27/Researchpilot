import { useState } from 'react';
import { synthesize } from '../hooks/useApi';
import ConsensusView from './ConsensusView';
import SummaryView from './SummaryView';
import CompareView from './CompareView';
import ChatView from './ChatView';
import KnowledgeBase from './KnowledgeBase';

const TABS = [
  { key: 'synthesis', label: 'Synthesis' },
  { key: 'summary', label: 'Summary' },
  { key: 'compare', label: 'Compare' },
  { key: 'chat', label: 'Chat' },
  { key: 'kb', label: 'Library' },
];

/**
 * Right panel: tabbed synthesis/comparison/chat interface.
 */
export default function SynthesisPanel({ sources, onCitationClick }) {
  const [activeTab, setActiveTab] = useState('synthesis');
  const [synthesisData, setSynthesisData] = useState(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const doneSources = sources.filter((s) => s.status === 'done');

  const handleSynthesize = async () => {
    if (doneSources.length < 2) return;

    setIsSynthesizing(true);
    try {
      const result = await synthesize(doneSources.map((s) => s.id));
      setSynthesisData(result);
    } catch (err) {
      console.error('Synthesis error:', err);
      alert(`Synthesis failed: ${err.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-base)]">
      {/* Tab Bar + Synthesize Button */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)]">
        <div className="tab-bar border-b-0">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              id={`tab-${key}`}
              className={`tab-item ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Synthesize Button */}
        {(activeTab === 'synthesis' || activeTab === 'summary') && doneSources.length >= 2 && (
          <div className="pr-3">
            <button
              id="synthesize-btn"
              className="btn-primary"
              onClick={handleSynthesize}
              disabled={isSynthesizing}
            >
              {isSynthesizing ? 'Synthesizing…' : synthesisData ? 'Re-synthesize' : 'Synthesize'}
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isSynthesizing && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)]">
          <div className="flex gap-1">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
          <span className="font-citation text-[0.7rem] text-[var(--color-text-tertiary)]">
            Analyzing {doneSources.length} sources for consensus, contradictions, and connections…
          </span>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'synthesis' && (
          <ConsensusView
            synthesis={synthesisData}
            onCitationClick={onCitationClick}
          />
        )}
        {activeTab === 'summary' && (
          <SummaryView
            synthesis={synthesisData}
            onCitationClick={onCitationClick}
          />
        )}
        {activeTab === 'compare' && (
          <CompareView sources={sources} />
        )}
        {activeTab === 'chat' && (
          <ChatView
            sources={sources}
            onCitationClick={onCitationClick}
          />
        )}
        {activeTab === 'kb' && (
          <KnowledgeBase sources={sources} />
        )}
      </div>
    </div>
  );
}
