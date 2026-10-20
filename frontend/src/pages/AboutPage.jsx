import { Container } from '../components/ui/Container';
import { Footer } from '../components/Footer';

export function AboutPage({ onLaunchWorkspace, onRouteChange }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg)] py-10">
      <Container className="space-y-12 max-w-4xl">
        {/* Title & Introduction */}
        <div className="space-y-3 border-b border-[var(--border)] pb-8 text-left">
          <span className="eyebrow-label text-[var(--accent)]">
            HOW IT WORKS
          </span>
          <h1 className="h2-editorial text-[var(--text)]">
            Why reading papers together beats chatting with one PDF
          </h1>
          <p className="font-body text-base text-[var(--muted)] leading-relaxed">
            Standard AI tools ask questions to one document at a time. But in real research, the most valuable insights live in the space between papers—where two studies contradict each other, where findings align, or where one lab's method explains another's results.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4 text-left">
          <h2 className="h3-editorial text-[var(--text)]">
            The problem with single-document chat
          </h2>
          <div className="card-standard space-y-3 text-sm text-[var(--muted)] font-body leading-relaxed">
            <p>
              When you ask an AI to summarize a single paper, it only knows what that author chose to report. It cannot flag that another lab tried the same experiment and failed, or that a 2024 paper overturned a 2020 assumption.
            </p>
            <p>
              ResearchPilot was built specifically to read a <strong className="text-[var(--text)]">collection of sources at once</strong>, comparing every claim across the group.
            </p>
          </div>
        </section>

        {/* Section 2: Pipeline Breakdown */}
        <section className="space-y-6 text-left">
          <h2 className="h3-editorial text-[var(--text)]">
            How ResearchPilot synthesizes your links
          </h2>

          <div className="space-y-4">
            <div className="card-semantic card-consensus space-y-2">
              <span className="eyebrow-label text-[var(--consensus)]">
                01 / FINDING AGREEMENTS
              </span>
              <h3 className="font-body font-semibold text-base text-[var(--text)]">
                Isolating true consensus
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body">
                We compare claims across every source to identify where authors independently reach the exact same conclusion or replicate the same effect.
              </p>
            </div>

            <div className="card-semantic card-contradiction space-y-2">
              <span className="eyebrow-label text-[var(--contradiction)]">
                02 / SPOTTING CONFLICTS
              </span>
              <h3 className="font-body font-semibold text-base text-[var(--text)]">
                Surfacing contradictions early
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body">
                When studies report conflicting numbers, divergent sample sizes, or opposing theoretical models, we put them side by side so you can evaluate the disagreement.
              </p>
            </div>

            <div className="card-semantic card-connection space-y-2">
              <span className="eyebrow-label text-[var(--connection)]">
                03 / UNCOVERING CONNECTIONS
              </span>
              <h3 className="font-body font-semibold text-base text-[var(--text)]">
                Connecting the dots
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-body">
                Non-obvious links, such as a mathematical formulation from one paper explaining a mysterious benchmark jump in another, are surfaced as emergent insights.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Grounded Proof */}
        <section className="space-y-4 text-left">
          <h2 className="h3-editorial text-[var(--text)]">
            100% grounded in exact quotes
          </h2>
          <div className="card-standard space-y-3 text-sm text-[var(--muted)] font-body leading-relaxed">
            <p>
              Every claim on ResearchPilot comes with clickable citation chips like <span className="citation-chip">[S1]</span> and <span className="citation-chip">[S2]</span>.
            </p>
            <p>
              Clicking any chip opens the Evidence Drawer showing the exact sentences quoted directly from the source. No vague paraphrases, and no fabricated citations.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="font-terminal text-xs text-[var(--text-dim)]">
            Ready to try it on your papers?
          </span>
          <button
            onClick={onLaunchWorkspace}
            className="btn-primary"
          >
            <span>Start a research session</span>
            <span className="font-terminal font-bold">→</span>
          </button>
        </div>
      </Container>

      {/* Full-bleed Footer */}
      <Footer onRouteChange={onRouteChange} />
    </div>
  );
}
