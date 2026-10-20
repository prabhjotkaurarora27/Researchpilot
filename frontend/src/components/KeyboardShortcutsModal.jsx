import { Modal } from './ui/Modal';

export function KeyboardShortcutsModal({ isOpen, onClose }) {
  const shortcuts = [
    { key: '⌘ + K / Ctrl + K', description: 'Open Command Palette' },
    { key: 'N', description: 'Start New Research Session' },
    { key: '1 - 6', description: 'Switch Synthesis Tabs (Overview, Agree, Disagree, Connect, Matrix, Graph)' },
    { key: 'Esc', description: 'Close Evidence Drawer / Modal' },
    { key: '?', description: 'Toggle this Shortcuts Cheatsheet' },
    { key: '⌘ + Enter', description: 'Extract URLs in Sources input' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="KEYBOARD SHORTCUTS" maxWidth="max-w-md">
      <div className="p-4 space-y-3">
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Navigate and control ResearchPilot without leaving your keyboard.
        </p>

        <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-sm bg-[var(--surface-2)]">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
              <span className="text-[var(--text)]">{sc.description}</span>
              <kbd className="font-terminal text-[0.68rem] bg-[var(--surface)] text-[var(--accent)] px-2 py-0.5 rounded border border-[var(--border)]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
