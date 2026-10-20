import { useState, useEffect } from 'react';
import { SourceIndexBadge, Badge } from '../components/ui/Badge';
import { CitationChip } from '../components/ui/CitationChip';

export function LandingPage({ onLaunchWorkspace, onLoadBenchmark }) {
  // Live demo step sequencer
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 5);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const demoSources = [
    { index: 1, title: 'Kaplan et al. (OpenAI)', claim: 'Scaling Laws for Neural Language Models', domain: 'arxiv.org' },
    { index: 2, title: 'Hoffmann et al. (DeepMind)', claim: 'Training Compute-Optimal Models (Chinchilla)', domain: 'arxiv.org' },
    { index: 3, title: 'Schaeffer et al. (Stanford)', claim: 'Emergent Abilities Mirage Analysis', domain: 'arxiv.org' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--bg)]">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="max-w-[1300px] w-full mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left: Left-aligned Editorial Hero */}
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="dot-live" />
            <span className="font-terminal text-[0.68rem] uppercase tracking-wider text-[var(--muted)]">
              Multi-Source Synthesis Engine · v1.4
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[var(--text)] font-normal leading-[1.08] tracking-tight">
            Research synthesis across papers, articles & video.{' '}
            <span className="text-[var(--accent)] italic block sm:inline">
              Not PDF chat.
            </span>
          </h1>

          <p className="font-body text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-xl">
            Single-document chatbots answer one paper at a time in isolation.
            ResearchPilot analyzes <em>across</em> your literature to isolate empirical
            consensus, highlight direct contradictions, and surface latent connections—all grounded in verbatim cited passages.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onLaunchWorkspace}
              className="btn-amber !py-3 !px-6 text-sm font-semibold"
            >
              <span>Open Research Workspace</span>
              <span className="font-terminal">→</span>
            </button>

            <button
              onClick={onLoadBenchmark}
              className="btn-terminal !py-3 !px-5 text-sm"
              title="Instantly explore synthesis using the LLM scaling laws benchmark"
            >
              <span>Explore Benchmark Dataset</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border)] max-w-lg">
            <div>
              <span className="font-terminal text-xs text-[var(--muted)] block">SOURCES</span>
              <span className="font-terminal text-lg font-bold text-[var(--text)]">ArXiv / Web / YT</span>
            </div>
            <div>
              <span className="font-terminal text-xs text-[var(--muted)] block">TRIANGULATION</span>
              <span className="font-terminal text-lg font-bold text-[var(--consensus)]">Cross-Document</span>
            </div>
            <div>
              <span className="font-terminal text-xs text-[var(--muted)] block">GROUNDING</span>
              <span className="font-terminal text-lg font-bold text-[var(--accent)]">Verbatim Quotes</span>
            </div>
          </div>
        </div>

        {/* Right: Live Animated Demo Panel (Fully Legible, No Faded Ghosting) */}
        <div className="w-full lg:w-[540px] bg-[var(--surface)] border border-[var(--border)] rounded-sm shadow-2xl overflow-hidden flex flex-col">
          {/* Mock Terminal Header */}
          <div className="px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
              <span className="font-terminal text-[0.65rem] text-[var(--muted)] ml-2 uppercase tracking-wider">
                live_synthesis_stream.ts
              </span>
            </div>
            <span className="font-terminal text-[0.65rem] text-[var(--accent)]">
              {demoStep === 0 && 'STEP 1: INGESTING SOURCES...'}
              {demoStep === 1 && 'STEP 2: EXTRACTING CLAIMS...'}
              {demoStep === 2 && 'STEP 3: MAPPING CONSENSUS...'}
              {demoStep === 3 && 'STEP 4: DETECTING CONTRADICTIONS...'}
              {demoStep === 4 && 'STEP 5: SYNTHESIS COMPLETE'}
            </span>
          </div>

          {/* Interactive Ingested Sources Strip */}
          <div className="p-3 bg-[var(--surface-2)] border-b border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-terminal text-[0.62rem] text-[var(--muted)] uppercase tracking-wider">
                Ingested Benchmark Corpus ({demoSources.length} sources)
              </span>
              <span className="font-terminal text-[0.62rem] text-[var(--consensus)]">ALL READY</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {demoSources.map((ds) => (
                <div
                  key={ds.index}
                  className="p-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-xs text-left"
                >
                  <div className="flex items-center gap-1">
                    <SourceIndexBadge index={ds.index} />
                    <span className="font-terminal text-[0.6rem] text-[var(--muted)] truncate">{ds.domain}</span>
                  </div>
                  <p className="text-[0.68rem] font-semibold text-[var(--text)] truncate mt-1">
                    {ds.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Revealed Synthesis Cards (All 100% Legible, No blur overlays) */}
          <div className="p-4 space-y-3 min-h-[300px]">
            {/* Consensus Card */}
            <div
              className={`card-semantic card-consensus transition-all duration-300 space-y-2 ${
                demoStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="consensus">CONSENSUS</Badge>
                <div className="flex items-center gap-1">
                  <CitationChip sourceIndex={1} />
                  <CitationChip sourceIndex={2} />
                </div>
              </div>
              <p className="font-body text-xs text-[var(--text)] font-semibold leading-relaxed">
                Both sources independently prove that cross-entropy loss scales monotonically as a power law with compute.
              </p>
              <div className="text-[0.7rem] text-[var(--muted)] italic bg-[var(--surface-2)] p-2 rounded-xs border border-[var(--border-subtle)]">
                <span className="font-terminal text-[var(--consensus)] not-italic font-bold">[S1 quote]: </span>
                "Loss scales as a power-law over 7 orders of magnitude in compute."
              </div>
            </div>

            {/* Contradiction Card */}
            <div
              className={`card-semantic card-contradiction transition-all duration-300 space-y-2 ${
                demoStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="contradiction">CONTRADICTION</Badge>
                <div className="flex items-center gap-1">
                  <CitationChip sourceIndex={1} />
                  <CitationChip sourceIndex={2} />
                </div>
              </div>
              <p className="font-body text-xs text-[var(--text)] font-semibold leading-relaxed">
                Conflict on token vs. parameter allocation: Kaplan favors scaling parameters 3x faster, while Chinchilla proves strict 1:1 proportionality.
              </p>
              <div className="text-[0.7rem] text-[var(--muted)] italic bg-[var(--surface-2)] p-2 rounded-xs border border-[var(--border-subtle)]">
                <span className="font-terminal text-[var(--contradiction)] not-italic font-bold">[S2 quote]: </span>
                "Current models are considerably undertrained; tokens and parameters must scale in equal 1:1 ratio."
              </div>
            </div>

            {/* Connection Card */}
            <div
              className={`card-semantic card-connection transition-all duration-300 space-y-2 ${
                demoStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="connection">EMERGENT CONNECTION</Badge>
                <div className="flex items-center gap-1">
                  <CitationChip sourceIndex={2} />
                  <CitationChip sourceIndex={3} />
                </div>
              </div>
              <p className="font-body text-xs text-[var(--text)] font-semibold leading-relaxed">
                Continuous metric curves resolve the apparent mystery of why undertrained models produce non-linear benchmark jumps.
              </p>
            </div>
          </div>

          {/* Bottom Terminal Bar */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between text-xs">
            <span className="font-terminal text-[0.68rem] text-[var(--muted)]">
              Triangulated 3 sources in 1.4s
            </span>
            <button
              onClick={onLoadBenchmark}
              className="font-terminal text-[0.68rem] text-[var(--accent)] hover:underline cursor-pointer"
            >
              Load full dataset in Workspace →
            </button>
          </div>
        </div>
      </section>

      {/* ─── 3-Step "How It Works" Strip ───────────────────────────── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)] py-14">
        <div className="max-w-[1200px] mx-auto px-6 space-y-10">
          <div className="text-left space-y-1">
            <span className="font-terminal text-xs text-[var(--accent)] uppercase tracking-wider">
              Methodology
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--text)] font-normal">
              How Cross-Source Triangulation Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 bg-[var(--surface-2)] border border-[var(--border)] rounded-sm space-y-3 text-left">
              <span className="font-terminal text-xs text-[var(--accent)] font-bold">
                01 / INGESTION
              </span>
              <h3 className="font-display text-lg text-[var(--text)] font-semibold">
                Multi-Modal Ingestion
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-body">
                Paste URLs across ArXiv papers, academic journals, investigative articles, or YouTube lectures. Structured extraction isolates methodology, datasets, and claims automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-[var(--surface-2)] border border-[var(--border)] rounded-sm space-y-3 text-left">
              <span className="font-terminal text-xs text-[var(--consensus)] font-bold">
                02 / TRIANGULATION
              </span>
              <h3 className="font-display text-lg text-[var(--text)] font-semibold">
                Cross-Document Triangulation
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-body">
                Rather than treating each text as a silo, our cross-reference engine compares claims across every source to detect where empirical findings align and where methodologies clash.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-[var(--surface-2)] border border-[var(--border)] rounded-sm space-y-3 text-left">
              <span className="font-terminal text-xs text-[var(--connection)] font-bold">
                03 / PROVENANCE
              </span>
              <h3 className="font-display text-lg text-[var(--text)] font-semibold">
                Exact Verbatim Grounding
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-body">
                Zero hallucinated summaries. Every consensus point, contradiction row, and graph edge links directly to verbatim quoted passages from the original source with 1-click inspection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Call to Action Strip ─────────────────────────────────── */}
      <section className="py-16 text-center max-w-3xl mx-auto px-6 space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl text-[var(--text)] font-normal">
          Synthesize your research in minutes.
        </h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed font-body">
          Replace tedious manual note-taking and fragmented single-PDF chats with structured, cross-source empirical synthesis.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onLaunchWorkspace}
            className="btn-amber !py-3 !px-8 text-sm"
          >
            Launch Research Workspace
          </button>
        </div>
      </section>
    </div>
  );
}
