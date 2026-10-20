import { useState, useCallback } from 'react';
import ResizableSplit from './components/ResizableSplit';
import SourcePanel from './components/SourcePanel';
import SynthesisPanel from './components/SynthesisPanel';
import Dashboard from './components/Dashboard';
import { synthesize } from './hooks/useApi';

/**
 * ResearchPilot AI — Root Layout
 * Shows bento-grid dashboard on first load, transitions to
 * split-pane workspace when user starts working.
 *
 * Synthesis-first: auto-triggers synthesis after extraction
 * and lands on the consensus board as the primary view.
 */
export default function App() {
  const [sources, setSources] = useState([]);
  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);

  // Hoisted synthesis state — shared between SourcePanel trigger and SynthesisPanel display
  const [synthesisData, setSynthesisData] = useState(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSelectSource = useCallback((id) => {
    setSelectedSourceId((prev) => (prev === id ? null : id));
  }, []);

  const handleCitationClick = useCallback((sourceNumber) => {
    if (sourceNumber >= 1 && sourceNumber <= sources.length) {
      const source = sources[sourceNumber - 1];
      setSelectedSourceId(source.id);
      const el = document.getElementById(`source-card-${source.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('selected');
        setTimeout(() => {
          if (selectedSourceId !== source.id) {
            el.classList.remove('selected');
          }
        }, 2000);
      }
    }
  }, [sources, selectedSourceId]);

  const handleGetStarted = () => {
    setShowWorkspace(true);
  };

  /**
   * Auto-trigger synthesis after extraction completes.
   * Called by SourcePanel when new sources finish extracting.
   */
  const handleSourcesExtracted = async (newSources) => {
    if (newSources.length > 0) {
      setShowWorkspace(true);
    }

    // newSources have already been added to `sources` state by SourcePanel.
    // We need to use a timeout to let React's state update settle, then
    // check the latest sources and auto-trigger synthesis.
    setTimeout(() => {
      // Read from the DOM-settled state — we use functional update to peek
      setSources((currentSources) => {
        const doneSources = currentSources.filter((s) => s.status === 'done');
        if (doneSources.length >= 2) {
          const sourceIds = doneSources.map((s) => s.id);
          runSynthesis(sourceIds);
        }
        return currentSources; // no mutation
      });
    }, 100);
  };

  /**
   * Run synthesis on given source IDs.
   */
  const runSynthesis = async (sourceIds) => {
    setIsSynthesizing(true);
    try {
      const result = await synthesize(sourceIds);
      setSynthesisData(result);
    } catch (err) {
      console.error('Auto-synthesis error:', err);
      // Don't alert — silent fallback, user can still use the UI
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Show dashboard if no sources and user hasn't clicked "Get Started"
  const showDashboard = !showWorkspace && sources.length === 0;

  return (
    <>
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 h-10 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] shrink-0">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={() => sources.length === 0 && setShowWorkspace(false)}
          >
            <h1 className="font-citation text-[0.8rem] font-semibold tracking-wider text-[var(--color-text-primary)]">
              RESEARCHPILOT
            </h1>
            <span className="font-citation text-[0.6rem] text-[var(--color-accent-gold)] bg-[rgba(240,180,41,0.1)] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              AI
            </span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          {!showDashboard && (
            <span className="font-citation text-[0.6rem] text-[var(--color-text-muted)]">
              {sources.filter((s) => s.status === 'done').length} sources loaded
            </span>
          )}
          <div className={`status-dot ${sources.length > 0 ? 'status-done' : 'status-pending'}`} />
        </div>
      </header>

      {/* Content */}
      {showDashboard ? (
        <Dashboard onGetStarted={handleGetStarted} />
      ) : (
        <ResizableSplit
          defaultSplit={33}
          left={
            <SourcePanel
              sources={sources}
              setSources={setSources}
              selectedSourceId={selectedSourceId}
              onSelectSource={handleSelectSource}
              onSourcesExtracted={handleSourcesExtracted}
              isExtracting={isExtracting}
              setIsExtracting={setIsExtracting}
            />
          }
          right={
            <SynthesisPanel
              sources={sources}
              synthesisData={synthesisData}
              isSynthesizing={isSynthesizing}
              onCitationClick={handleCitationClick}
            />
          }
        />
      )}
    </>
  );
}
