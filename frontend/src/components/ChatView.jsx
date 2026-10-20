import { useState, useRef, useEffect, useCallback } from 'react';
import { chatWithSourcesStream } from '../hooks/useApi';
import { renderCitedText } from './ConsensusView';

/**
 * Embedded chat messages + input — lives below the synthesis board.
 * Accepts suggestedQuestions from synthesis contradictions as starter prompts.
 */
export default function ChatView({ sources, onCitationClick, suggestedQuestions = [] }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);

  const doneSources = sources.filter((s) => s.status === 'done');
  const sourceIds = doneSources.map((s) => s.id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async (overrideMessage) => {
    const text = overrideMessage || input.trim();
    if (!text || isStreaming) return;
    if (sourceIds.length === 0) return;

    setInput('');
    setIsExpanded(true);

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: text }]);

    // Add empty assistant message that will be filled by streaming
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', citations: [], isStreaming: true },
    ]);
    setIsStreaming(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    const abort = chatWithSourcesStream(text, sourceIds, history, {
      onToken: (token) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + token,
            };
          }
          return updated;
        });
      },
      onDone: ({ full_text, citations }) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = {
              ...last,
              content: full_text,
              citations,
              isStreaming: false,
            };
          }
          return updated;
        });
        setIsStreaming(false);
        abortRef.current = null;
      },
      onError: (error) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = {
              ...last,
              content: `Error: ${error}`,
              isStreaming: false,
            };
          }
          return updated;
        });
        setIsStreaming(false);
        abortRef.current = null;
      },
    });

    abortRef.current = abort;
  }, [input, isStreaming, sourceIds, messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current();
    };
  }, []);

  if (doneSources.length === 0) {
    return null;
  }

  // Build citation passages map from chat citations for inline passages
  const buildChatPassages = (citations) => {
    if (!citations?.length) return null;
    const map = {};
    for (const c of citations) {
      if (c.passage) {
        map[String(c.source_number)] = c.passage;
      }
    }
    return Object.keys(map).length > 0 ? map : null;
  };

  return (
    <div className="chat-embed">
      {/* Suggested Questions — shown when no messages yet */}
      {messages.length === 0 && suggestedQuestions.length > 0 && (
        <div className="chat-suggestions">
          <span className="font-citation text-[0.65rem] text-[var(--color-text-muted)] uppercase tracking-wider">
            Explore deeper
          </span>
          <div className="chat-suggestions-list">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                className="suggested-question"
                onClick={() => handleSend(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area — collapsible */}
      {(messages.length > 0 || isExpanded) && (
        <div ref={scrollRef} className="chat-messages-area">
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
                      const chatPassages = buildChatPassages(msg.citations);

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
                              {renderCitedText(line.replace('- ', ''), onCitationClick, {
                                citationPassages: chatPassages,
                                sources: doneSources,
                                keyPrefix: `chat-${i}-${j}`,
                              })}
                            </span>
                          </div>
                        );
                      }
                      if (line.trim() === '') return <div key={j} className="h-1.5" />;
                      return (
                        <p key={j} className="text-[var(--color-text-primary)] mb-1">
                          {renderCitedText(line, onCitationClick, {
                            citationPassages: chatPassages,
                            sources: doneSources,
                            keyPrefix: `chat-${i}-${j}`,
                          })}
                        </p>
                      );
                    })}
                    {/* Blinking cursor during streaming */}
                    {msg.isStreaming && (
                      <span className="inline-block w-[2px] h-[1em] bg-[var(--color-accent-gold)] ml-0.5 animate-pulse align-middle" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isStreaming && messages[messages.length - 1]?.content === '' && (
            <div className="ml-4 pl-3 border-l border-[var(--color-border-subtle)]">
              <div className="flex gap-1 py-2">
                <div className="loading-dot" />
                <div className="loading-dot" />
                <div className="loading-dot" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Bar — always visible */}
      <div className="chat-input-bar">
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
              disabled={isStreaming}
            />
          </div>
          <button
            id="chat-send-btn"
            className="btn-primary"
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
          >
            {isStreaming ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
