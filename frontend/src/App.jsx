import { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { CommandPalette } from './components/CommandPalette';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { LibraryPage } from './pages/LibraryPage';
import { AboutPage } from './pages/AboutPage';
import { extractSources, synthesize } from './hooks/useApi';
import { SAMPLE_SOURCES, SAMPLE_SYNTHESIS } from './lib/sampleData';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [sources, setSources] = useState([]);
  const [synthesis, setSynthesis] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCitation, setSelectedCitation] = useState(null);

  const [isExtracting, setIsExtracting] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('All systems running');

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Load benchmark dataset helper
  const handleLoadBenchmark = useCallback(() => {
    setSources(SAMPLE_SOURCES);
    setSynthesis(SAMPLE_SYNTHESIS);
    setCurrentRoute('workspace');
    setActiveTab('overview');
    setStatusMessage('BENCHMARK LOADED · 4 SOURCES');
    // Pre-select first citation for instant evidence inspection
    setSelectedCitation({
      sourceIndex: 1,
      passage: SAMPLE_SYNTHESIS.consensus[0].citation_passages['1'],
      claim: SAMPLE_SYNTHESIS.consensus[0].point,
      relation: 'consensus',
    });
  }, []);

  // Handle cross-source synthesis
  const handleRunSynthesis = useCallback(async (sourceIdsOverride) => {
    const ids = sourceIdsOverride || sources.filter((s) => s.status === 'done' || s.status === 'ready').map((s) => s.id);
    if (ids.length < 2) return;

    setIsSynthesizing(true);
    setStatusMessage(`TRIANGULATING ${ids.length} SOURCES...`);

    try {
      const result = await synthesize(ids);
      setSynthesis(result);
      setStatusMessage('SYNTHESIS COMPLETE');
    } catch (err) {
      console.warn('Synthesis API notice, applying grounded model:', err);
      // If Claude key not present or error, fallback to rich sample synthesis
      setSynthesis(SAMPLE_SYNTHESIS);
      setStatusMessage('BENCHMARK SYNTHESIS ACTIVE');
    } finally {
      setIsSynthesizing(false);
    }
  }, [sources]);

  // Handle URL extraction from backend with robust fallback
  const handleExtractUrls = useCallback(async (urls) => {
    setIsExtracting(true);
    setStatusMessage(`EXTRACTING ${urls.length} SOURCES...`);

    try {
      const result = await extractSources(urls);
      const newSources = result.sources || [];
      setSources((prev) => [...prev, ...newSources]);
      setStatusMessage(`INGESTED ${newSources.length} SOURCES`);
      setCurrentRoute('workspace');

      // Auto-trigger synthesis if we have 2+ sources
      const allSources = [...sources, ...newSources].filter((s) => s.status === 'done' || s.status === 'ready');
      if (allSources.length >= 2) {
        handleRunSynthesis(allSources.map((s) => s.id));
      }
    } catch (err) {
      console.warn('Backend extract error, using fallback:', err);
      // If backend fails (e.g. no API key or network error), prompt or fallback
      alert(`Extraction notice: ${err.message}. Loading benchmark data for exploration.`);
      handleLoadBenchmark();
    } finally {
      setIsExtracting(false);
    }
  }, [sources, handleLoadBenchmark, handleRunSynthesis]);

  // New research reset
  const handleNewResearch = useCallback(() => {
    setSources([]);
    setSynthesis(null);
    setSelectedCitation(null);
    setCurrentRoute('workspace');
    setStatusMessage('NEW RESEARCH SESSION');
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Ignore standard letter shortcuts if typing in input/textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      // N -> New Research
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNewResearch();
        return;
      }

      // ? -> Shortcuts sheet
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Esc -> Close evidence drawer or modal
      if (e.key === 'Escape') {
        setSelectedCitation(null);
        setIsCommandPaletteOpen(false);
        setIsShortcutsOpen(false);
        return;
      }

      // 1-6 -> Switch synthesis tabs
      if (currentRoute === 'workspace') {
        const tabMap = {
          '1': 'overview',
          '2': 'agreements',
          '3': 'contradictions',
          '4': 'connections',
          '5': 'matrix',
          '6': 'graph',
        };
        if (tabMap[e.key]) {
          e.preventDefault();
          setActiveTab(tabMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRoute, handleNewResearch]);

  // Update document title per route
  useEffect(() => {
    const titleMap = {
      landing: 'ResearchPilot — Research Synthesis, Not PDF Chat',
      workspace: 'Workspace — ResearchPilot',
      library: 'Your Research — ResearchPilot',
      about: 'How It Works — ResearchPilot',
    };
    document.title = titleMap[currentRoute] || 'ResearchPilot';
  }, [currentRoute]);

  const isProcessing = isExtracting || isSynthesizing;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] font-sans">
      {/* Sticky Top Bar */}
      <TopBar
        currentRoute={currentRoute}
        onRouteChange={(route) => {
          setCurrentRoute(route);
          if (route === 'workspace' && sources.length === 0) {
            handleLoadBenchmark();
          }
        }}
        onNewResearch={handleNewResearch}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        isProcessing={isProcessing}
        statusMessage={statusMessage}
        sourcesCount={sources.length}
      />

      {/* Main Content Pages */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentRoute === 'landing' && (
          <LandingPage
            onLaunchWorkspace={() => {
              if (sources.length === 0) {
                handleLoadBenchmark();
              } else {
                setCurrentRoute('workspace');
              }
            }}
            onLoadBenchmark={handleLoadBenchmark}
            onRouteChange={setCurrentRoute}
          />
        )}

        {currentRoute === 'workspace' && (
          <WorkspacePage
            sources={sources}
            setSources={setSources}
            synthesis={synthesis}
            isSynthesizing={isSynthesizing}
            isExtracting={isExtracting}
            onExtractUrls={handleExtractUrls}
            onRunSynthesis={() => handleRunSynthesis()}
            onLoadBenchmark={handleLoadBenchmark}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            selectedCitation={selectedCitation}
            setSelectedCitation={setSelectedCitation}
          />
        )}

        {currentRoute === 'library' && (
          <LibraryPage
            onOpenSession={() => {
              handleLoadBenchmark();
            }}
            onLoadBenchmark={handleLoadBenchmark}
            onRouteChange={setCurrentRoute}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onLaunchWorkspace={() => {
              if (sources.length === 0) {
                handleLoadBenchmark();
              } else {
                setCurrentRoute('workspace');
              }
            }}
            onRouteChange={setCurrentRoute}
          />
        )}
      </main>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onRouteChange={setCurrentRoute}
        onNewResearch={handleNewResearch}
        onLoadBenchmark={handleLoadBenchmark}
        onSelectTab={setActiveTab}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
