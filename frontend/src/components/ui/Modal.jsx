import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl', className = '' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'w-full bg-[var(--surface)] border border-[var(--border)] rounded-sm shadow-2xl overflow-hidden animate-card-in flex flex-col',
          maxWidth,
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
            <h3 id="modal-title" className="font-terminal text-xs uppercase tracking-wider text-[var(--muted)]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="font-terminal text-xs text-[var(--muted)] hover:text-[var(--text)] px-1.5 py-0.5 rounded transition-colors"
              aria-label="Close dialog"
            >
              [ESC]
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
