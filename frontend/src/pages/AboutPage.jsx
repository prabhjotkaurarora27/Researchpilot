export function AboutPage({ onLaunchWorkspace }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg)] p-6 max-w-4xl mx-auto space-y-10 py-10">
      {/* Title */}
      <div className="space-y-3 border-b border-[var(--border)] pb-6">
        <span className="font-terminal text-xs text-[var(--accent)] uppercase tracking-wider">
          System Architecture & Philosophy
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-[var(--text)] font-semibold">
          Why Literature Synthesis Demands Cross-Document Triangulation
        </h1>
        <p className="font-body text-sm sm:text-base text-[var(--muted)] leading-relaxed">
          The prevailing paradigm in AI research tools is conversational search over isolated PDFs.
          This document outlines why single-document retrieval fails for serious literature analysis,
          and how ResearchPilot’s multi-source synthesis pipeline operates.
        </p>
      </div>

      {/* The Core Thesis */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-[var(--text)] font-semibold">
          1. The Failure Mode of "Chat with PDF"
        </h2>
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-sm space-y-3 text-xs font-body text-[var(--muted)] leading-relaxed">
          <p>
            When a researcher interrogates a single paper through a chat interface, the LLM is constrained to the biases, sample limitations, and unchecked assumptions of that singular author.
          </p>
          <p>
            Real scientific progress does not happen inside individual papers; it occurs at the <strong className="text-[var(--text)]">friction points between papers</strong>—where one lab’s replication fails, where two methodologies disagree on sample scaling, or where disparate disciplines discover parallel mathematical formalisms.
          </p>
        </div>
      </section>

      {/* Architecture Pipeline */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-[var(--text)] font-semibold">
          2. The ResearchPilot Pipeline
        </h2>

        <div className="space-y-3">
          <div className="p-4 bg-[var(--surface)] border-l-[3px] border-l-[var(--accent)] border border-[var(--border)] rounded-sm space-y-1.5">
            <span className="font-terminal text-xs text-[var(--accent)] uppercase tracking-wider block">
              Stage 1: Multi-Modal Ingestion & Normalization
            </span>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-body">
              Trafilatura extracts body text while filtering boilerplates. YouTube transcripts are parsed with timestamped token spans. ArXiv preprints are structured into abstract, methodology, and empirical claims.
            </p>
          </div>

          <div className="p-4 bg-[var(--surface)] border-l-[3px] border-l-[var(--consensus)] border border-[var(--border)] rounded-sm space-y-1.5">
            <span className="font-terminal text-xs text-[var(--consensus)] uppercase tracking-wider block">
              Stage 2: Cross-Source Triangulation
            </span>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-body">
              Structured prompts compare pairs and triplets of sources simultaneously. Rather than summarizing, the engine identifies pairwise consensus, direct contradictions, and latent connections.
            </p>
          </div>

          <div className="p-4 bg-[var(--surface)] border-l-[3px] border-l-[var(--contradiction)] border border-[var(--border)] rounded-sm space-y-1.5">
            <span className="font-terminal text-xs text-[var(--contradiction)] uppercase tracking-wider block">
              Stage 3: Verbatim Grounding & Passage Provenance
            </span>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-body">
              Every synthesized claim is bound to an exact cited passage mapped directly back to the original text. Hallucinations are mitigated through mandatory quotation verification.
            </p>
          </div>

          <div className="p-4 bg-[var(--surface)] border-l-[3px] border-l-[var(--connection)] border border-[var(--border)] rounded-sm space-y-1.5">
            <span className="font-terminal text-xs text-[var(--connection)] uppercase tracking-wider block">
              Stage 4: Topology & Dimensional Matrix
            </span>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-body">
              Findings are projected into an interactive topological graph and a comparative matrix across dimensions like sample size, empirical effect, and dataset scope.
            </p>
          </div>
        </div>
      </section>

      {/* Strict Semantic Color Specification */}
      <section className="space-y-3">
        <h2 className="font-display text-xl text-[var(--text)] font-semibold">
          3. Semantic Token Uniformity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-[var(--surface)] border border-[var(--border)] border-l-[3px] border-l-[var(--consensus)] rounded-sm">
            <span className="font-terminal text-xs text-[var(--consensus)] font-bold block">
              --consensus: #3DDC97
            </span>
            <p className="text-[0.72rem] text-[var(--muted)] mt-1">
              Applied universally to agreement badges, graph nodes, and verified claims.
            </p>
          </div>
          <div className="p-3 bg-[var(--surface)] border border-[var(--border)] border-l-[3px] border-l-[var(--contradiction)] rounded-sm">
            <span className="font-terminal text-xs text-[var(--contradiction)] font-bold block">
              --contradiction: #FF6B5E
            </span>
            <p className="text-[0.72rem] text-[var(--muted)] mt-1">
              Applied to opposing positions, divergent matrix cells, and tension points.
            </p>
          </div>
          <div className="p-3 bg-[var(--surface)] border border-[var(--border)] border-l-[3px] border-l-[var(--connection)] rounded-sm">
            <span className="font-terminal text-xs text-[var(--connection)] font-bold block">
              --connection: #4CC9F0
            </span>
            <p className="text-[0.72rem] text-[var(--muted)] mt-1">
              Applied to emergent bridges, relational edges, and cross-domain links.
            </p>
          </div>
        </div>
      </section>

      <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
        <span className="font-terminal text-xs text-[var(--text-dim)]">
          Built for rigorous literature review.
        </span>
        <button
          onClick={onLaunchWorkspace}
          className="btn-amber !py-2 !px-4 text-xs"
        >
          Open Workspace →
        </button>
      </div>
    </div>
  );
}
