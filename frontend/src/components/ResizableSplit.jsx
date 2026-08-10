import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Resizable split pane container.
 * Left panel (sources) + drag handle + right panel (synthesis).
 */
export default function ResizableSplit({ left, right, defaultSplit = 35 }) {
  const containerRef = useRef(null);
  const [splitPercent, setSplitPercent] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = (x / rect.width) * 100;
      // Clamp between 20% and 60%
      setSplitPercent(Math.min(60, Math.max(20, percent)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="split-container">
      <div
        style={{ width: `${splitPercent}%` }}
        className="flex flex-col overflow-hidden"
      >
        {left}
      </div>
      <div
        className={`split-handle ${isDragging ? 'active' : ''}`}
        onMouseDown={handleMouseDown}
      />
      <div
        style={{ width: `${100 - splitPercent}%` }}
        className="flex flex-col overflow-hidden"
      >
        {right}
      </div>
    </div>
  );
}
