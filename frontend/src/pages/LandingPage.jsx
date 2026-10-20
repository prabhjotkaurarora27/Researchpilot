import { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { SourceIndexBadge, Badge } from '../components/ui/Badge';
import { CitationChip } from '../components/ui/CitationChip';
import { Footer } from '../components/Footer';

export function LandingPage({ onLaunchWorkspace, onLoadBenchmark, onRouteChange }) {
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

  const trustedDomains = [
    'arxiv.org',
    'nature.com',
    'biorxiv.org',
    'youtube.com',
    'science.org',
    'openreview.net',
    'pubmed.ncbi.nlm.nih.gov',
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--bg)]">
      {/* ─── Hero Section with Grid Texture (Full-Bleed, Content in Container) ─── */}
      <section className="relative w-full border-b border-[var(--border)] overflow-hidden bg-grid-subtle">
        {/* Subtle radial mask over the grid */}
        <div className="absolute inset-0 mask-hero-gradient pointer-events-none" />

        <Container className="py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Copy (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="dot-live" />
                <span className="eyebrow-label text-[var(--muted)]">
                  Multi-Source Research Engine
                </span>
              </div>

              <h1 className="h1-hero text-[var(--text)]">
                Stop reading sources one by one.{' '}
                <span className="text-[var(--accent)] italic block mt-1">
                  See where they agree, clash, and connect.
                </span>
              </h1>

              <p className="font-body text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-xl">
                Paste links to papers, articles and videos. ResearchPilot reads them together and shows you what they agree on, where they contradict each other, and the links you would have missed, with the exact quote behind every claim.
              </p>

              {/* CTAs: 44px uniform height */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={onLaunchWorkspace}
                  className="btn-primary"
                >
                  <span>Start a research session</span>
                  <span className="font-terminal font-bold">→</span>
                </button>

                <button
                  onClick={onLoadBenchmark}
                  className="btn-secondary"
                  title="Explore with pre-loaded AI scaling benchmark"
                >
                  <span>See an example</span>
                </button>
              </div>

              {/* Stat Strip: Ample width, zero awkward multi-line breaks */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[var(--border)] max-w-xl">
                <div>
                  <span className="eyebrow-label text-[var(--text-dim)] block mb-1">SOURCES</span>
                  <span className="font-terminal text-sm sm:text-base font-bold text-[var(--text)] whitespace-nowrap">
                    ArXiv · Web · YouTube
                  </span>
                </div>
                <div>
                  <span className="eyebrow-label text-[var(--text-dim)] block mb-1">TRIANGULATION</span>
                  <span className="font-terminal text-sm sm:text-base font-bold text-[var(--consensus)] whitespace-nowrap">
                    Cross-Document
                  </span>
                </div>
                <div>
                  <span className="eyebrow-label text-[var(--text-dim)] block mb-1">GROUNDING</span>
                  <span className="font-terminal text-sm sm:text-base font-bold text-[var(--accent)] whitespace-nowrap">
                    Verbatim Quotes
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Synthesis Panel (5 cols) */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden flex flex-col">
                {/* Panel Header */}
                <div className="px-4 py-3 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-focus)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-focus)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-focus)]" />
                    <span className="font-terminal text-[0.68rem] text-[var(--muted)] ml-2 uppercase tracking-wider">
                      live_synthesis.ts
                    </span>
                  </div>
                  <span className="font-terminal text-[0.68rem] text-[var(--accent)] font-semibold">
                    {demoStep === 0 && 'STEP 1: INGESTING SOURCES...'}
                    {demoStep === 1 && 'STEP 2: EXTRACTING CLAIMS...'}
                    {demoStep === 2 && 'STEP 3: MAPPING CONSENSUS...'}
                    {demoStep === 3 && 'STEP 4: DETECTING CONFLICTS...'}
                    {demoStep === 4 && 'STEP 5: SYNTHESIS COMPLETE'}
                  </span>
                </div>

                {/* Ingested Sources Strip */}
                <div className="p-3 bg-[var(--surface-2)] border-b border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-terminal text-[0.65rem] text-[var(--muted)] uppercase tracking-wider">
                      Ingested Corpus ({demoSources.length} sources)
                    </span>
                    <span className="font-terminal text-[0.65rem] text-[var(--consensus)] font-semibold">ALL READY</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {demoSources.map((ds) => (
                      <div
                        key={ds.index}
                        className="p-2 bg-[var(--surface)] border border-[var(--border)] rounded-md text-left"
                      >
                        <div className="flex items-center gap-1.5">
                          <SourceIndexBadge index={ds.index} />
                          <span className="font-terminal text-[0.62rem] text-[var(--muted)] truncate">{ds.domain}</span>
                        </div>
                        <p className="text-[0.7rem] font-semibold text-[var(--text)] truncate mt-1">
                          {ds.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revealed Cards (Fully legible, zero blur overlays) */}
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
                      Both sources prove cross-entropy loss scales monotonically as a power law with compute.
                    </p>
                    <div className="text-[0.72rem] text-[var(--muted)] italic bg-[var(--surface-2)] p-2 rounded border border-[var(--border-subtle)]">
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
                      Token vs parameter budget: Kaplan favors scaling parameters 3x faster, while Chinchilla proves strict 1:1 proportionality.
                    </p>
                    <div className="text-[0.72rem] text-[var(--muted)] italic bg-[var(--surface-2)] p-2 rounded border border-[var(--border-subtle)]">
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
                      Continuous metric curves resolve why undertrained models produce sudden benchmark jumps.
                    </p>
                  </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between text-xs">
                  <span className="font-terminal text-[0.68rem] text-[var(--muted)]">
                    Triangulated 3 sources in 1.4s
                  </span>
                  <button
                    onClick={onLoadBenchmark}
                    className="font-terminal text-[0.68rem] text-[var(--accent)] hover:underline cursor-pointer"
                  >
                    Open in workspace →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted Sources Row under the Hero */}
          <div className="pt-16 pb-4 border-t border-[var(--border)] mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="eyebrow-label text-[var(--text-dim)] shrink-0">
              SYNTHESIZE FROM ANY REPUTABLE SOURCE
            </span>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-terminal text-[0.72rem] text-[var(--muted)]">
              {trustedDomains.map((domain) => (
                <span
                  key={domain}
                  className="px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-focus)] transition-colors"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── "How It Works" Section (Vertical Rhythm: 96px) ───────── */}
      <section className="w-full border-b border-[var(--border)] bg-[var(--surface)] py-24">
        <Container className="space-y-12">
          {/* Eyebrow and H2 Heading */}
          <div className="text-left space-y-2 max-w-2xl">
            <span className="eyebrow-label text-[var(--accent)]">
              HOW IT WORKS
            </span>
            <h2 className="h2-editorial text-[var(--text)]">
              From a pile of links to a clear answer in three steps
            </h2>
          </div>

          {/* 3 Step Cards: 24px padding, 12px radius, 1px border, hover lift */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 01 */}
            <div className="card-standard space-y-4 text-left">
              <span className="font-terminal text-xs text-[var(--accent)] font-bold">
                01
              </span>
              <h3 className="h3-editorial text-[var(--text)]">
                Drop in your sources
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body">
                Paste links to papers, articles or YouTube videos. We handle the scraping, transcript extraction, and structured parsing automatically.
              </p>
            </div>

            {/* Step 02 */}
            <div className="card-standard space-y-4 text-left">
              <span className="font-terminal text-xs text-[var(--consensus)] font-bold">
                02
              </span>
              <h3 className="h3-editorial text-[var(--text)]">
                Compare them side by side
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body">
                We find agreements, contradictions and hidden connections across all of them—highlighting where evidence converges and where methodologies clash.
              </p>
            </div>

            {/* Step 03 */}
            <div className="card-standard space-y-4 text-left">
              <span className="font-terminal text-xs text-[var(--connection)] font-bold">
                03
              </span>
              <h3 className="h3-editorial text-[var(--text)]">
                Check every claim
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body">
                Click any claim to see the exact passage it came from. No guesses, no made-up summaries, and full verbatim provenance for every point.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Final CTA Section (96px Vertical Rhythm) ─────────────── */}
      <section className="w-full py-24 bg-[var(--bg)]">
        <Container className="text-center max-w-3xl space-y-8">
          <h2 className="h2-editorial text-[var(--text)]">
            Your next literature review, done in minutes.
          </h2>
          <p className="text-base text-[var(--muted)] leading-relaxed font-body max-w-xl mx-auto">
            Say goodbye to fragmented notes and 100 open browser tabs. Get clear, grounded synthesis across your entire reading list.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onLaunchWorkspace}
              className="btn-primary"
            >
              <span>Start a research session</span>
              <span className="font-terminal font-bold">→</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Full-Bleed Footer */}
      <Footer onRouteChange={onRouteChange} />
    </div>
  );
}
