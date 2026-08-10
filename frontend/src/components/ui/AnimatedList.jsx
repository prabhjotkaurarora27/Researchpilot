/**
 * AnimatedList — items appear one by one with fade-in animation.
 */
import { useState, useEffect } from 'react';

export default function AnimatedList({ items, className = '', interval = 2000 }) {
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    if (visibleCount >= items.length) return;
    const timer = setTimeout(() => {
      setVisibleCount((c) => Math.min(c + 1, items.length));
    }, interval);
    return () => clearTimeout(timer);
  }, [visibleCount, items.length, interval]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {items.slice(0, visibleCount).map((item, i) => (
        <div
          key={i}
          className="animate-fadein"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
