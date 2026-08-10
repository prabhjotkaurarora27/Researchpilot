import { useState, useRef, useEffect } from 'react';
import { chatWithSources } from '../hooks/useApi';
import { renderCitedText } from './ConsensusView';

/**
 * Terminal-style grounded chat interface (NOT chat bubbles).
 */
export default function ChatView({ sources, onCitationClick }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const doneSources = sources.filter((s) => s.status === 'done');
  const sourceIds = doneSources.map((s) => s.id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (sourceIds.length === 0) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const result = await chatWithSources(userMessage, sourceIds, history);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.reply,
          citations: result.citations || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${err.message}`,
          citations: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (doneSources.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-[var(--color-text-muted)]">
          Extract sources first to enable grounded chat.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[var(--color-border)] flex items-center gap-2">
        <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)]">
          Grounded in {doneSources.length} source{doneSources.length !== 1 ? 's' : ''} · Responses cite [Source N]
        </span>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="font-citation text-[0.7rem] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Research Chat
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed max-w-md mx-auto">
              Ask questions about your sources. Every response is grounded in the extracted content with inline citations.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="animate-fadein">
            {msg.role === 'user' ? (
              /* User Query — terminal prompt style */
              <div className="flex gap-2 items-start">
                <span className="font-citation text-[0.75rem] text-[var(--color-accent-gold)] mt-0.5 select-none">
                  ›
                </span>
                <p className="font-citation text-sm text-[var(--color-text-primary)]">
                  {msg.content}
                </p>
              </div>
            ) : (
              /* Assistant Response — structured block */
              <div className="ml-4 pl-3 border-l border-[var(--color-border-subtle)]">
                <div className="chat-response text-sm leading-[1.8]">
                  {msg.content.split('\n').map((line, j) => {
                    if (line.startsWith('## ') || line.startsWith('### ')) {
                      return (
                        <h3 key={j} className="font-citation text-[0.8rem] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mt-4 mb-1.5">
                          {line.replace(/^#{2,3}\s/, '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <div key={j} className="flex gap-2 ml-1 my-0.5">
                          <span className="text-[var(--color-text-muted)] text-xs mt-0.5">›</span>
                          <span className="text-[var(--color-text-secondary)]">
                            {renderCitedText(line.replace('- ', ''), onCitationClick)}
                          </span>
                        </div>
                      );
                    }
                    if (line.trim() === '') return <div key={j} className="h-1.5" />;
                    return (
                      <p key={j} className="text-[var(--color-text-primary)] mb-1">
                        {renderCitedText(line, onCitationClick)}
                      </p>
                    );
                  })}
                </div>

                {/* Citation References */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-[var(--color-border-subtle)]">
                    {msg.citations.map((cite) => (
                      <a
                        key={cite.source_number}
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="citation-badge"
                        title={cite.title}
                      >
                        [{cite.source_number}] {cite.title?.slice(0, 40)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="ml-4 pl-3 border-l border-[var(--color-border-subtle)]">
            <div className="flex gap-1 py-2">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-[var(--color-border)] p-3">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded px-3 focus-within:border-[var(--color-accent-gold)] transition-colors">
            <span className="font-citation text-[var(--color-accent-gold)] text-sm select-none">›</span>
            <input
              id="chat-input"
              type="text"
              className="flex-1 bg-transparent font-citation text-sm text-[var(--color-text-primary)] outline-none py-2.5 placeholder:text-[var(--color-text-muted)]"
              placeholder="Ask about your sources…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          <button
            id="chat-send-btn"
            className="btn-primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
