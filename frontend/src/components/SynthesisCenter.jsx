import { OverviewTab } from './tabs/OverviewTab';
import { AgreementsTab } from './tabs/AgreementsTab';
import { ContradictionsTab } from './tabs/ContradictionsTab';
import { ConnectionsTab } from './tabs/ConnectionsTab';
import { MatrixTab } from './tabs/MatrixTab';
import { GraphTab } from './tabs/GraphTab';
import { CardSkeleton } from './ui/Skeleton';

export function SynthesisCenter({
  activeTab = 'overview',
  onSelectTab,
  synthesis,
  sources = [],
  isSynthesizing = false,
  onRunSynthesis,
  onCitationClick,
}) {
  const tabs = [
    { id: 'overview', label: 'Overview', keyNum: '1', count: null },
    { id: 'agreements', label: 'Agreements', keyNum: '2', count: synthesis?.consensus?.length },
    { id: 'contradictions', label: 'Contradictions', keyNum: '3', count: synthesis?.contradictions?.length },
    { id: 'connections', label: 'Connections', keyNum: '4', count: synthesis?.connections?.length },
    { id: 'matrix', label: 'Matrix', keyNum: '5', count: null },
    { id: 'graph', label: 'Graph', keyNum: '6', count: null },
  ];

  const doneSources = sources.filter((s) => s.status === 'done' || s.status === 'ready');

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-4 overflow-x-auto select-none">
        <div className="flex items-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab?.(tab.id)}
                className={`font-terminal text-xs px-2.5 py-1.5 rounded-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[var(--surface-2)] text-[var(--accent)] font-semibold border border-[var(--border)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}
                title={`Press ${tab.keyNum} to jump to ${tab.label}`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && tab.count !== undefined && (
                  <span className={`text-[0.65rem] px-1 rounded-xs ${isActive ? 'bg-[var(--accent)] text-[#0B0D10]' : 'bg-[var(--border)] text-[var(--muted)]'}`}>
                    {tab.count}
                  </span>
                )}
                <kbd className="hidden md:inline font-terminal text-[0.6rem] text-[var(--text-dim)] ml-0.5">
                  {tab.keyNum}
                </kbd>
              </button>
            );
          })}
        </div>

        {/* Synthesize Button if sources available */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRunSynthesis}
            disabled={doneSources.length < 2 || isSynthesizing}
            className="btn-amber !py-1 !px-2.5 text-xs whitespace-nowrap"
            title="Cross-reference all loaded sources for consensus and contradictions"
          >
            {isSynthesizing ? 'Synthesizing...' : 'Synthesize Now'}
          </button>
        </div>
      </div>

      {/* Main Tab View Area */}
      <div className="flex-1 overflow-y-auto">
        {isSynthesizing ? (
          <div className="p-6 max-w-4xl mx-auto space-y-4">
            <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-sm space-y-2">
              <span className="font-terminal text-xs text-[var(--accent)] uppercase tracking-wider block">
                Triangulating claims across {doneSources.length} sources...
              </span>
              <p className="text-xs text-[var(--muted)] font-body">
                Extracting shared theorems, isolating methodology contradictions, and compiling verbatim evidence passages.
              </p>
            </div>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab
                synthesis={synthesis}
                sources={doneSources}
                onCitationClick={onCitationClick}
              />
            )}
            {activeTab === 'agreements' && (
              <AgreementsTab
                consensus={synthesis?.consensus}
                sources={doneSources}
                onCitationClick={onCitationClick}
              />
            )}
            {activeTab === 'contradictions' && (
              <ContradictionsTab
                contradictions={synthesis?.contradictions}
                sources={doneSources}
                onCitationClick={onCitationClick}
              />
            )}
            {activeTab === 'connections' && (
              <ConnectionsTab
                connections={synthesis?.connections}
                sources={doneSources}
                onCitationClick={onCitationClick}
              />
            )}
            {activeTab === 'matrix' && (
              <MatrixTab sources={doneSources} />
            )}
            {activeTab === 'graph' && (
              <GraphTab
                synthesis={synthesis}
                sources={doneSources}
                onCitationClick={onCitationClick}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
