import { cn } from '../lib/utils';

export function TopBar({
  currentRoute = 'workspace',
  onRouteChange,
  onNewResearch,
  onOpenCommandPalette,
  onOpenShortcuts,
  isProcessing = false,
  statusMessage = 'SYSTEM READY',
  sourcesCount = 0,
}) {
  const navItems = [
    { id: 'workspace', label: 'Workspace' },
    { id: 'library', label: 'Library' },
    { id: 'history', label: 'History' },
    { id: 'about', label: 'Architecture' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--surface)] border-b border-[var(--border)] select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Left: Brand & Status Pill */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onRouteChange?.('landing')}
            className="flex items-center gap-2 group text-left cursor-pointer"
            title="Return to Home"
          >
            <span className="font-terminal text-xs tracking-[0.2em] font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              RESEARCHPILOT
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[var(--surface-2)] border border-[var(--border)]">
            <span className={isProcessing ? 'dot-amber' : 'dot-live'} />
            <span className="font-terminal text-[0.62rem] text-[var(--muted)] font-medium uppercase tracking-wider">
              {isProcessing ? 'PROCESSING' : 'LIVE'}
            </span>
          </div>
        </div>

        {/* Center: Navigation Links with Amber Underline */}
        <nav className="flex items-center gap-1 sm:gap-6" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onRouteChange?.(item.id)}
                className={cn(
                  'relative py-3 px-2 font-terminal text-[0.72rem] tracking-wide uppercase transition-colors',
                  isActive
                    ? 'text-[var(--text)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Shortcuts, Command Palette & New Research */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sources Count Badge if active */}
          {sourcesCount > 0 && (
            <span className="hidden md:inline-flex items-center gap-1 font-terminal text-[0.65rem] text-[var(--muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded-sm border border-[var(--border)]">
              <span className="text-[var(--accent)] font-semibold">{sourcesCount}</span>
              <span>sources</span>
            </span>
          )}

          {/* Status Message in Mono */}
          {statusMessage && (
            <span className="hidden lg:inline-block font-terminal text-[0.65rem] text-[var(--text-dim)] truncate max-w-[200px]">
              {statusMessage}
            </span>
          )}

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="btn-terminal !py-1 !px-2 hidden sm:flex items-center gap-1.5"
            title="Search and commands (Cmd/Ctrl + K)"
            aria-label="Open command palette"
          >
            <span className="text-[var(--muted)]">Search</span>
            <kbd className="font-terminal text-[0.6rem] bg-[var(--surface-2)] text-[var(--text-dim)] px-1 py-0.2 rounded border border-[var(--border)]">
              ⌘K
            </kbd>
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={onOpenShortcuts}
            className="btn-ghost !p-1.5 text-[var(--muted)] hover:text-[var(--text)]"
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
          >
            <span className="font-terminal text-xs">?</span>
          </button>

          {/* New Research Amber Button */}
          <button
            onClick={onNewResearch}
            className="btn-amber !py-1 !px-2.5 text-xs font-semibold"
            aria-label="Start New Research"
          >
            <span className="font-terminal font-bold">+</span>
            <span>New Research</span>
          </button>
        </div>
      </div>

      {/* Thin Amber Progress Line when processing */}
      {isProcessing && <div className="progress-line-amber" role="progressbar" aria-label="Loading synthesis" />}
    </header>
  );
}
