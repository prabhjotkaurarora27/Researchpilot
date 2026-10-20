import { useState, useEffect } from 'react';
import { SourcesPanel } from '../components/SourcesPanel';
import { SynthesisCenter } from '../components/SynthesisCenter';
import { EvidenceDrawer } from '../components/EvidenceDrawer';

export function WorkspacePage({
  sources = [],
  setSources,
  synthesis,
  isSynthesizing = false,
  isExtracting = false,
  onExtractUrls,
  onRunSynthesis,
  onLoadBenchmark,
  activeTab = 'overview',
  onSelectTab,
  selectedCitation,
  setSelectedCitation,
}) {
  // Mobile active pane: 'sources' | 'synthesis' | 'evidence'
  const [mobilePane, setMobilePane] = useState('synthesis');
  const [selectedSourceId, setSelectedSourceId] = useState(null);

  // If evidence citation is clicked on mobile, switch to evidence pane
  useEffect(() => {
    if (selectedCitation && window.innerWidth < 1024) {
      setMobilePane('evidence');
    }
  }, [selectedCitation]);

  const handleCitationClick = (sourceNum, citationData) => {
    setSelectedCitation(citationData || {
      sourceIndex: sourceNum,
      passage: null,
      claim: null,
      relation: 'source',
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg)]">
      {/* Mobile Top View Switcher (Visible on screens < 1024px) */}
      <div className="lg:hidden flex items-center justify-around border-b border-[var(--border)] bg-[var(--surface-2)] p-1 text-xs select-none">
        <button
          onClick={() => setMobilePane('sources')}
          className={`flex-1 py-2 font-terminal text-[0.68rem] uppercase tracking-wider text-center rounded-xs transition-colors ${
            mobilePane === 'sources'
              ? 'bg-[var(--surface)] text-[var(--accent)] font-bold border border-[var(--border)]'
              : 'text-[var(--muted)]'
          }`}
        >
          Sources ({sources.length})
        </button>
        <button
          onClick={() => setMobilePane('synthesis')}
          className={`flex-1 py-2 font-terminal text-[0.68rem] uppercase tracking-wider text-center rounded-xs transition-colors ${
            mobilePane === 'synthesis'
              ? 'bg-[var(--surface)] text-[var(--accent)] font-bold border border-[var(--border)]'
              : 'text-[var(--muted)]'
          }`}
        >
          Synthesis ({activeTab})
        </button>
        <button
          onClick={() => setMobilePane('evidence')}
          className={`flex-1 py-2 font-terminal text-[0.68rem] uppercase tracking-wider text-center rounded-xs transition-colors ${
            mobilePane === 'evidence'
              ? 'bg-[var(--surface)] text-[var(--accent)] font-bold border border-[var(--border)]'
              : 'text-[var(--muted)]'
          }`}
        >
          Evidence {selectedCitation ? `[S${selectedCitation.sourceIndex}]` : ''}
        </button>
      </div>

      {/* Main 3-Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Sources Panel */}
        <div
          className={`w-full lg:w-[320px] xl:w-[360px] lg:flex shrink-0 ${
            mobilePane === 'sources' ? 'flex' : 'hidden'
          }`}
        >
          <SourcesPanel
            sources={sources}
            setSources={setSources}
            selectedSourceId={selectedSourceId}
            onSelectSource={(id) => {
              setSelectedSourceId(id);
              const srcIdx = sources.findIndex((s) => s.id === id);
              if (srcIdx >= 0) {
                setSelectedCitation({
                  sourceIndex: srcIdx + 1,
                  passage: sources[srcIdx].extracted_data?.core_claim,
                  claim: sources[srcIdx].extracted_data?.title,
                  relation: 'source',
                });
              }
            }}
            onExtractUrls={onExtractUrls}
            onLoadBenchmark={onLoadBenchmark}
            isExtracting={isExtracting}
            className="w-full"
          />
        </div>

        {/* Center Pane: Synthesis Center */}
        <div
          className={`flex-1 min-w-0 lg:flex flex-col ${
            mobilePane === 'synthesis' ? 'flex' : 'hidden'
          }`}
        >
          <SynthesisCenter
            activeTab={activeTab}
            onSelectTab={onSelectTab}
            synthesis={synthesis}
            sources={sources}
            isSynthesizing={isSynthesizing}
            onRunSynthesis={onRunSynthesis}
            onCitationClick={handleCitationClick}
          />
        </div>

        {/* Right Pane: Evidence Drawer */}
        <div
          className={`w-full lg:w-[340px] xl:w-[380px] shrink-0 border-l border-[var(--border)] lg:flex ${
            mobilePane === 'evidence' ? 'flex' : selectedCitation ? 'hidden lg:flex' : 'hidden'
          }`}
        >
          <EvidenceDrawer
            selectedCitation={selectedCitation}
            sources={sources}
            onClose={() => setSelectedCitation(null)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
