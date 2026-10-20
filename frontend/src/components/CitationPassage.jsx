import { useRef, useEffect } from 'react';

/**
 * Inline expandable passage panel for citation evidence.
 * Appears directly below a [Source N] badge when clicked.
 * Uses CSS grid-template-rows transition for smooth expand/collapse.
 */
export default function CitationPassage({ sourceNumber, passage, title, url, isOpen, onClose }) {
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // Check if the click was on another citation badge
        const badge = e.target.closest('.citation-badge');
        if (!badge) {
          onClose?.();
        }
      }
    };

    // Delay to avoid closing immediately from the click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={panelRef}
      className={`citation-passage-wrapper ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
    >
      <div className="citation-passage-inner">
        <div className="citation-passage">
          {/* Header */}
          <div className="citation-passage-header">
            <span className="citation-passage-label">
              Source {sourceNumber}
            </span>
            {title && (
              <span className="citation-passage-title">{title}</span>
            )}
            <button
              className="citation-passage-close"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              aria-label="Close passage"
            >
              ×
            </button>
          </div>

          {/* Passage Content */}
          {passage ? (
            <blockquote className="citation-passage-quote">
              "{passage}"
            </blockquote>
          ) : (
            <p className="citation-passage-empty">
              No exact passage available for this citation.
            </p>
          )}

          {/* Source Link */}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="citation-passage-link"
            >
              View full source ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
