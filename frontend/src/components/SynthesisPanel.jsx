import { useState } from 'react';
import ConsensusView from './ConsensusView';
import SummaryView from './SummaryView';
import CompareView from './CompareView';
import ChatView from './ChatView';
import KnowledgeBase from './KnowledgeBase';

const TABS = [
  { key: 'synthesis', label: 'Synthesis' },
  { key: 'summary', label: 'Summary' },
  { key: 'compare', label: 'Compare' },
  { key: 'kb', label: 'Library' },
];

/**
 * Right panel: tabbed synthesis/comparison interface + embedded chat below.
 * Chat is no longer a tab — it lives inline below the synthesis board.
 * Synthesis state is managed by the parent (App.jsx) for auto-trigger.
 */
export default function SynthesisPanel({
  sources,
  synthesisData,
  isSynthesizing,
  onCitationClick,
}) {
  const [activeTab, setActiveTab] = useState('synthesis');

  const doneSources = sources.filter((s) => s.status === 'done');
  const suggestedQuestions = synthesisData?.suggested_questions || [];

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-base)]">
      {/* Tab Bar */}
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

      {/* Tab Content — takes remaining space */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          {activeTab === 'synthesis' && (
            <ConsensusView
              synthesis={synthesisData}
              sources={doneSources}
              onCitationClick={onCitationClick}
            />
          )}
          {activeTab === 'summary' && (
            <SummaryView
              synthesis={synthesisData}
              sources={doneSources}
              onCitationClick={onCitationClick}
            />
          )}
          {activeTab === 'compare' && (
            <CompareView sources={sources} />
          )}
          {activeTab === 'kb' && (
            <KnowledgeBase sources={sources} />
          )}
        </div>

        {/* Embedded Chat — always visible below the board on synthesis/summary tabs */}
        {(activeTab === 'synthesis' || activeTab === 'summary') && doneSources.length >= 2 && (
          <ChatView
            sources={sources}
            onCitationClick={onCitationClick}
            suggestedQuestions={suggestedQuestions}
          />
        )}
      </div>
    </div>
  );
}
