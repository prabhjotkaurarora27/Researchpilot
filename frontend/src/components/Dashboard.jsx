/**
 * Dashboard — Full-viewport landing experience shown when no sources are loaded.
 * Showcases the 4 core features in a clean, centered 2x2 bento grid.
 */
import { BentoGrid, BentoCard } from './ui/BentoGrid';
import AnimatedList from './ui/AnimatedList';

/* ─── Mock data for animated backgrounds ─────────────────────── */
const sampleInsights = [
  {
    type: 'consensus',
    text: 'All sources agree that scale improves performance [Source 1] [Source 2]',
  },
  {
    type: 'contradiction',
    text: 'Sources disagree on whether RLHF is necessary [Source 3] vs [Source 5]',
  },
  {
    type: 'connection',
    text: 'Scaling laws predict the results observed in GPT-4 [Source 2] [Source 3]',
  },
  {
    type: 'consensus',
    text: 'Transformer architecture remains dominant [Source 1] [Source 6]',
  },
];

const sampleChat = [
  { role: 'user', text: 'How do the scaling laws relate to GPT-4 results?' },
  { role: 'assistant', text: 'According to [Source 2], the scaling laws accurately predicted the performance gains observed...' },
  { role: 'user', text: 'What do the sources disagree on?' },
  { role: 'assistant', text: 'Sources 3 and 5 diverge on the necessity of RLHF for alignment [Source 3] [Source 5]...' },
];

/* ─── Background Renderers ───────────────────────────────────── */

function InsightsList() {
  const items = sampleInsights.map((insight, i) => {
    const borderColor = {
      consensus: 'var(--color-accent-green)',
      contradiction: 'var(--color-accent-amber)',
      connection: 'var(--color-accent-cyan)',
    }[insight.type];

    return (
      <div
        key={i}
        className="rounded-r px-3 py-2 text-[0.7rem] text-[var(--color-text-secondary)] leading-relaxed blur-[0.3px] transition-all duration-300 group-hover:blur-none"
        style={{ borderLeft: `2px solid ${borderColor}`, background: `${borderColor}08` }}
      >
        <span className="font-citation text-[0.6rem] uppercase tracking-wider block mb-0.5" style={{ color: borderColor }}>
          {insight.type}
        </span>
        {insight.text}
      </div>
    );
  });

  return (
    <div className="px-3 pt-3">
      <AnimatedList items={items} interval={1500} className="max-h-[200px] overflow-hidden" />
    </div>
  );
}

function CompareTable() {
  return (
    <div className="px-3 pt-3 blur-[0.3px] transition-all duration-300 group-hover:blur-none">
      <table className="w-full text-[0.65rem]">
        <thead>
          <tr className="border-b border-[var(--color-border-subtle)]">
            <th className="font-citation text-left py-1.5 px-2 text-[var(--color-text-muted)] uppercase tracking-wider">Dim</th>
            <th className="font-citation text-left py-1.5 px-2 text-[var(--color-accent-cyan)]">Source A</th>
            <th className="font-citation text-left py-1.5 px-2 text-[var(--color-accent-gold)]">Source B</th>
          </tr>
        </thead>
        <tbody className="text-[var(--color-text-secondary)]">
          {[
            ['Method', 'Meta-analysis', 'RCT'],
            ['Sample', 'N=12,000', 'N=450'],
            ['Effect', 'Strong', 'Moderate'],
            ['Scope', 'Global', 'US only'],
          ].map(([dim, a, b], i) => (
            <tr key={i} className="border-b border-[var(--color-border-subtle)]">
              <td className="font-citation py-1.5 px-2 text-[var(--color-text-muted)]">{dim}</td>
              <td className="font-source py-1.5 px-2">{a}</td>
              <td className="font-source py-1.5 px-2">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="px-3 pt-3 space-y-2 blur-[0.3px] transition-all duration-300 group-hover:blur-none">
      {sampleChat.map((msg, i) => (
        <div key={i} className={msg.role === 'user' ? 'flex gap-1.5 items-start' : 'ml-3 pl-2.5 border-l border-[var(--color-border-subtle)]'}>
          {msg.role === 'user' && (
            <span className="font-citation text-[0.7rem] text-[var(--color-accent-gold)] mt-0.5">›</span>
          )}
          <p className={`text-[0.7rem] leading-relaxed ${msg.role === 'user' ? 'font-citation text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
            {msg.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function SourcePreview() {
  const sources = [
    { title: 'Attention Is All You Need', domain: 'arxiv.org', type: 'paper' },
    { title: 'Scaling Laws for Neural LMs', domain: 'arxiv.org', type: 'paper' },
    { title: 'GPT-4 Technical Report', domain: 'openai.com', type: 'report' },
    { title: 'The Bitter Lesson', domain: 'incompleteideas.net', type: 'blog' },
  ];

  return (
    <div className="px-3 pt-3 space-y-1.5 blur-[0.3px] transition-all duration-300 group-hover:blur-none">
      {sources.map((src, i) => (
        <div key={i} className="flex items-center gap-2.5 py-1.5 px-2.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)] flex-shrink-0" />
          <span className="text-[0.72rem] text-[var(--color-text-secondary)] font-medium truncate flex-1">{src.title}</span>
          <span className="tag-chip text-[0.55rem] flex-shrink-0">{src.type}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Feature Definitions ─────────────────────────────────────── */
const features = [
  {
    name: 'Extract Sources',
    description: 'Paste article URLs, research papers, or YouTube videos. AI extracts titles, claims, stats, and methodology from each.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    cta: 'Paste URLs to begin',
    background: <SourcePreview />,
  },
  {
    name: 'Synthesize Across Sources',
    description: 'AI identifies where sources agree, disagree, and connect — with inline citations and exact passages.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    cta: 'Consensus & contradictions',
    background: <InsightsList />,
  },
  {
    name: 'Compare Mode',
    description: 'Side-by-side table comparing methodology, findings, scope, and recency between any two sources.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    cta: 'Bloomberg-style tables',
    background: <CompareTable />,
  },
  {
    name: 'Grounded Chat',
    description: 'Ask questions — every answer cites [Source N] with exact passages. No hallucination, only source-backed claims.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    cta: 'Terminal-style interface',
    background: <ChatPreview />,
  },
];

/* ─── Dashboard Component ─────────────────────────────────────── */
export default function Dashboard({ onGetStarted }) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight mb-3">
            Research Synthesis,{' '}
            <span className="text-[var(--color-accent-gold)]">Not PDF Chat</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base max-w-xl mx-auto leading-relaxed">
            Paste links to articles, papers, and videos. AI synthesizes <em>across</em> sources —
            surfacing where they agree, contradict, and connect.
          </p>
          <button
            className="btn-primary mt-6 text-sm px-8 py-2.5"
            onClick={onGetStarted}
          >
            Paste URLs to Begin
          </button>
        </div>

        {/* 2×2 Bento Grid */}
        <div className="dashboard-grid">
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </div>

        {/* Footer Tagline */}
        <div className="text-center mt-8">
          <p className="font-citation text-[0.65rem] text-[var(--color-text-muted)] uppercase tracking-widest">
            Extract → Synthesize → Compare → Chat
          </p>
        </div>
      </div>
    </div>
  );
}
