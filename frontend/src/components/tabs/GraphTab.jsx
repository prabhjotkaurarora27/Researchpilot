import { useState, useMemo } from 'react';

export function GraphTab({ synthesis, sources = [], onCitationClick }) {
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const doneSources = sources.filter((s) => s.status === 'done');

  // Compute graph edges from synthesis data
  const edges = useMemo(() => {
    if (!synthesis) return [];
    const edgeList = [];

    // Helper to add edges between cited sources
    const addEdgesFromSection = (items, relation, color) => {
      (items || []).forEach((item, itemIdx) => {
        const citations = item.citations || [];
        for (let i = 0; i < citations.length; i++) {
          for (let j = i + 1; j < citations.length; j++) {
            edgeList.push({
              id: `${relation}-${itemIdx}-${citations[i]}-${citations[j]}`,
              source: citations[i],
              target: citations[j],
              relation,
              color,
              point: item.point,
              explanation: item.explanation,
              passages: item.citation_passages,
            });
          }
        }
      });
    };

    addEdgesFromSection(synthesis.consensus, 'consensus', 'var(--consensus)');
    addEdgesFromSection(synthesis.contradictions, 'contradiction', 'var(--contradiction)');
    addEdgesFromSection(synthesis.connections, 'connection', 'var(--connection)');

    return edgeList;
  }, [synthesis]);

  if (doneSources.length < 2) {
    return (
      <div className="p-8 text-center space-y-2">
        <p className="font-terminal text-xs text-[var(--muted)]">INSUFFICIENT SOURCES FOR CONNECTION GRAPH</p>
        <p className="text-sm text-[var(--text-dim)]">Add at least 2 sources and run synthesis to visualize source topology.</p>
      </div>
    );
  }

  // Node positions arranged in a clean circular polygon inside 500x380 SVG
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 80;

  const nodePositions = doneSources.map((s, idx) => {
    const angle = (idx / doneSources.length) * 2 * Math.PI - Math.PI / 2;
    return {
      sourceIndex: idx + 1,
      source: s,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <h3 className="font-terminal text-xs uppercase tracking-wider text-[var(--muted)]">
            Relational Synthesis Topology
          </h3>
          <p className="text-xs text-[var(--text-dim)] mt-0.5 font-body">
            Topological map of inter-source alignments, divergences, and emergent bridges.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-terminal text-[0.68rem] text-[var(--muted)]">
            <span className="w-3 h-0.5 bg-[var(--consensus)]" />
            <span>Agreement</span>
          </div>
          <div className="flex items-center gap-1.5 font-terminal text-[0.68rem] text-[var(--muted)]">
            <span className="w-3 h-0.5 bg-[var(--contradiction)]" />
            <span>Contradiction</span>
          </div>
          <div className="flex items-center gap-1.5 font-terminal text-[0.68rem] text-[var(--muted)]">
            <span className="w-3 h-0.5 bg-[var(--connection)]" />
            <span>Connection</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative border border-[var(--border)] rounded-sm bg-[var(--surface)] overflow-hidden flex items-center justify-center p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[650px] h-auto select-none"
        >
          {/* Defs for gradients/markers */}
          <defs>
            <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Edges */}
          {edges.map((edge) => {
            const p1 = nodePositions.find((n) => n.sourceIndex === edge.source);
            const p2 = nodePositions.find((n) => n.sourceIndex === edge.target);
            if (!p1 || !p2) return null;

            const isSelected = selectedEdge?.id === edge.id;

            return (
              <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdge(edge)}>
                {/* Invisible wide hit area */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="transparent"
                  strokeWidth="18"
                />
                {/* Visible colored edge */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={edge.color}
                  strokeWidth={isSelected ? 3.5 : 1.8}
                  strokeOpacity={isSelected ? 1 : 0.65}
                  strokeDasharray={edge.relation === 'connection' ? '4 3' : undefined}
                  className="transition-all hover:stroke-width-4"
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodePositions.map((node) => {
            const isSelected = selectedNode?.sourceIndex === node.sourceIndex;
            return (
              <g
                key={node.sourceIndex}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedNode(node);
                  onCitationClick?.(node.sourceIndex, {
                    sourceIndex: node.sourceIndex,
                    passage: node.source.extracted_data?.core_claim,
                    claim: node.source.extracted_data?.title,
                    relation: 'node',
                  });
                }}
              >
                {/* Node Outer Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 26 : 22}
                  fill="var(--surface-2)"
                  stroke={isSelected ? 'var(--accent)' : 'var(--border)'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all group-hover:stroke-[var(--accent)]"
                />

                {/* Node Label [S#] */}
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isSelected ? 'var(--accent)' : 'var(--text)'}
                  fontFamily="var(--font-mono)"
                  fontSize="10"
                  fontWeight="bold"
                >
                  S{node.sourceIndex}
                </text>

                {/* Domain Text below */}
                <text
                  x={node.x}
                  y={node.y + 34}
                  textAnchor="middle"
                  fill="var(--muted)"
                  fontFamily="var(--font-mono)"
                  fontSize="9"
                >
                  {node.source.domain}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Edge Detail Overlay */}
        {selectedEdge && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md p-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-sm shadow-xl animate-card-in space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-terminal text-[0.65rem] uppercase tracking-wider font-semibold" style={{ color: selectedEdge.color }}>
                  {selectedEdge.relation} link [S{selectedEdge.source}] ↔ [S{selectedEdge.target}]
                </span>
              </div>
              <button
                onClick={() => setSelectedEdge(null)}
                className="font-terminal text-xs text-[var(--muted)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            </div>

            <p className="font-body text-xs text-[var(--text)] leading-relaxed">
              {selectedEdge.point}
            </p>

            {selectedEdge.explanation && (
              <p className="text-[0.72rem] text-[var(--muted)] pt-1 border-t border-[var(--border-subtle)]">
                {selectedEdge.explanation}
              </p>
            )}

            <button
              onClick={() => {
                onCitationClick?.(selectedEdge.source, {
                  sourceIndex: selectedEdge.source,
                  passage: selectedEdge.passages?.[String(selectedEdge.source)],
                  claim: selectedEdge.point,
                  relation: selectedEdge.relation,
                });
              }}
              className="btn-terminal !py-1 !text-[0.68rem] w-full"
            >
              Inspect Source Evidence ↗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
