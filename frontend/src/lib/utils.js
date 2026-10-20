/**
 * Utility functions for ResearchPilot UI.
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Auto-detect source category from URL
 * Returns: 'paper' | 'video' | 'article' | 'report'
 */
export function detectSourceType(url = '') {
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com')) {
    return 'video';
  }
  if (
    lower.includes('arxiv.org') ||
    lower.includes('biorxiv.org') ||
    lower.includes('nature.com') ||
    lower.includes('science.org') ||
    lower.includes('doi.org') ||
    lower.includes('openreview.net') ||
    lower.includes('acm.org') ||
    lower.includes('ieee.org')
  ) {
    return 'paper';
  }
  if (
    lower.endsWith('.pdf') ||
    lower.includes('/report') ||
    lower.includes('whitepaper') ||
    lower.includes('github.com')
  ) {
    return 'report';
  }
  return 'article';
}

/**
 * Clean domain for concise display
 */
export function cleanDomain(url = '') {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.slice(0, 24);
  }
}

/**
 * Formats relative timestamp
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return 'Recently';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Extracts and formats citation keys e.g. [S1] or [Source 1] -> 1
 */
export function parseSourceNumber(citationStr) {
  const match = citationStr.match(/\[(?:Source\s+|S)?(\d+)\]/i);
  return match ? parseInt(match[1], 10) : null;
}
