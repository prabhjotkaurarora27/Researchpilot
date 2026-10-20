import { Container } from './ui/Container';

export function Footer({ onRouteChange }) {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] py-12 mt-auto">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="font-terminal text-xs tracking-[0.2em] font-bold text-[var(--text)]">
            RESEARCHPILOT
          </span>
          <span className="hidden sm:inline text-[var(--border)]">|</span>
          <span className="text-xs text-[var(--text-dim)] font-body">
            Research synthesis across multiple sources. Not PDF chat.
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-terminal">
          <button
            onClick={() => onRouteChange?.('workspace')}
            className="hover:text-[var(--text)] transition-colors"
          >
            Workspace
          </button>
          <button
            onClick={() => onRouteChange?.('library')}
            className="hover:text-[var(--text)] transition-colors"
          >
            Library
          </button>
          <button
            onClick={() => onRouteChange?.('about')}
            className="hover:text-[var(--text)] transition-colors"
          >
            How it works
          </button>
          <a
            href="https://github.com/prabhjotkaurarora27/Researchpilot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            <span>GitHub</span>
            <span className="font-terminal">↗</span>
          </a>
        </div>

        {/* Built by attribution */}
        <div className="text-xs font-terminal text-[var(--text-dim)]">
          Built by <span className="text-[var(--text)] font-medium">Prabh</span>
        </div>
      </Container>
    </footer>
  );
}
