import { useState, useEffect, useRef } from 'react';
import { Modal } from './ui/Modal';

export function CommandPalette({
  isOpen,
  onClose,
  onRouteChange,
  onNewResearch,
  onLoadBenchmark,
  onSelectTab,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands = [
    {
      id: 'new-research',
      title: 'New Research Session',
      category: 'Actions',
      shortcut: 'N',
      run: () => {
        onNewResearch?.();
        onClose?.();
      },
    },
    {
      id: 'load-demo',
      title: 'Load Benchmark Dataset (LLM Scaling Laws)',
      category: 'Actions',
      shortcut: 'B',
      run: () => {
        onLoadBenchmark?.();
        onClose?.();
      },
    },
    {
      id: 'go-workspace',
      title: 'Go to Workspace',
      category: 'Navigation',
      shortcut: 'G W',
      run: () => {
        onRouteChange?.('workspace');
        onClose?.();
      },
    },
    {
      id: 'go-library',
      title: 'Go to Library',
      category: 'Navigation',
      shortcut: 'G L',
      run: () => {
        onRouteChange?.('library');
        onClose?.();
      },
    },
    {
      id: 'go-history',
      title: 'Go to History',
      category: 'Navigation',
      shortcut: 'G H',
      run: () => {
        onRouteChange?.('history');
        onClose?.();
      },
    },
    {
      id: 'go-about',
      title: 'View Architecture & Synthesis Pipeline',
      category: 'Navigation',
      shortcut: 'G A',
      run: () => {
        onRouteChange?.('about');
        onClose?.();
      },
    },
    {
      id: 'tab-overview',
      title: 'View Tab: Overview',
      category: 'Synthesis View',
      shortcut: '1',
      run: () => {
        onRouteChange?.('workspace');
        onSelectTab?.('overview');
        onClose?.();
      },
    },
    {
      id: 'tab-agreements',
      title: 'View Tab: Agreements (Consensus)',
      category: 'Synthesis View',
      shortcut: '2',
      run: () => {
        onRouteChange?.('workspace');
        onSelectTab?.('agreements');
        onClose?.();
      },
    },
    {
      id: 'tab-contradictions',
      title: 'View Tab: Contradictions (Disagreements)',
      category: 'Synthesis View',
      shortcut: '3',
      run: () => {
        onRouteChange?.('workspace');
        onSelectTab?.('contradictions');
        onClose?.();
      },
    },
    {
      id: 'tab-connections',
      title: 'View Tab: Connections (Emergent Links)',
      category: 'Synthesis View',
      shortcut: '4',
      run: () => {
        onRouteChange?.('workspace');
        onSelectTab?.('connections');
        onClose?.();
      },
    },
    {
      id: 'tab-matrix',
      title: 'View Tab: Comparison Matrix',
      category: 'Synthesis View',
      shortcut: '5',
      run: () => {
        onRouteChange?.('workspace');
        onSelectTab?.('matrix');
        onClose?.();
      },
    },
    {
      id: 'tab-graph',
      title: 'View Tab: Connection Graph',
      category: 'Synthesis View',
      shortcut: '6',
      run: () => {
        onRouteChange?.('workspace');
        onSelectTab?.('graph');
        onClose?.();
      },
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].run();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="p-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="flex items-center gap-2">
          <span className="font-terminal text-xs text-[var(--accent)]">›</span>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none text-sm text-[var(--text)] font-terminal focus:outline-none placeholder:text-[var(--text-dim)]"
            placeholder="Type a command or search tabs (e.g. 'Matrix', 'Agreements', 'Benchmark')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="font-terminal text-[0.62rem] text-[var(--text-dim)] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
            ESC
          </kbd>
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]">
        {filtered.length === 0 ? (
          <div className="p-6 text-center font-terminal text-xs text-[var(--muted)]">
            No commands matching "{query}"
          </div>
        ) : (
          filtered.map((cmd, i) => {
            const isSelected = i === selectedIndex;
            return (
              <button
                key={cmd.id}
                onClick={cmd.run}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full text-left px-3 py-2.5 rounded-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[var(--surface-2)] text-[var(--text)] border-l-2 border-l-[var(--accent)]'
                    : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-terminal text-[0.65rem] text-[var(--text-dim)] uppercase tracking-wider">
                    {cmd.category}
                  </span>
                  <span className="text-xs font-medium text-[var(--text)]">
                    {cmd.title}
                  </span>
                </div>
                {cmd.shortcut && (
                  <kbd className="font-terminal text-[0.65rem] bg-[var(--surface)] text-[var(--text-dim)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                    {cmd.shortcut}
                  </kbd>
                )}
              </button>
            );
          })
        )}
      </div>
    </Modal>
  );
}
