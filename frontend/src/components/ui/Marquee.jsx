/**
 * Marquee — infinite horizontal scrolling animation.
 * Adapted from MagicUI for Bloomberg-terminal dark theme.
 */
import { useEffect, useRef } from 'react';

export default function Marquee({
  children,
  className = '',
  pauseOnHover = false,
  reverse = false,
  duration = '20s',
}) {
  return (
    <div
      className={`marquee-container ${pauseOnHover ? 'marquee-pause-hover' : ''} ${className}`}
      style={{ '--marquee-duration': duration }}
    >
      <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}>
        {children}
        {children}
      </div>
    </div>
  );
}
