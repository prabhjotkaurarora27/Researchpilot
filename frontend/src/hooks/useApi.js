/**
 * API client hooks for ResearchPilot AI.
 */

const API_BASE = '/api';

export async function extractSources(urls) {
  const response = await fetch(`${API_BASE}/sources/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  });
  if (!response.ok) throw new Error(`Extract failed: ${response.statusText}`);
  return response.json();
}

export async function getSource(sourceId) {
  const response = await fetch(`${API_BASE}/sources/${sourceId}`);
  if (!response.ok) throw new Error(`Fetch source failed: ${response.statusText}`);
  return response.json();
}

export async function synthesize(sourceIds) {
  const response = await fetch(`${API_BASE}/synthesis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_ids: sourceIds }),
  });
  if (!response.ok) throw new Error(`Synthesis failed: ${response.statusText}`);
  return response.json();
}

export async function compareSources(sourceIdA, sourceIdB) {
  const response = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_id_a: sourceIdA, source_id_b: sourceIdB }),
  });
  if (!response.ok) throw new Error(`Compare failed: ${response.statusText}`);
  return response.json();
}

export async function chatWithSources(message, sourceIds, history = []) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, source_ids: sourceIds, history }),
  });
  if (!response.ok) throw new Error(`Chat failed: ${response.statusText}`);
  return response.json();
}

/**
 * Streaming chat — processes SSE events from /api/chat/stream.
 * @param {string} message - User message
 * @param {number[]} sourceIds - Source IDs to ground responses in
 * @param {Object[]} history - Chat history
 * @param {function} onToken - Called with each text token as it arrives
 * @param {function} onDone - Called with {full_text, citations} when complete
 * @param {function} onError - Called with error string on failure
 * @returns {function} abort - Call this to cancel the stream
 */
export function chatWithSourcesStream(message, sourceIds, history = [], { onToken, onDone, onError }) {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, source_ids: sourceIds, history }),
        signal: controller.signal,
      });

      if (!response.ok) {
        onError?.(`Chat failed: ${response.statusText}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events from buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.error) {
              onError?.(event.error);
              return;
            }

            if (event.done) {
              onDone?.({
                full_text: event.full_text,
                citations: event.citations || [],
              });
              return;
            }

            if (event.token !== undefined) {
              onToken?.(event.token);
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        onError?.(err.message);
      }
    }
  })();

  return () => controller.abort();
}

export async function saveToKnowledgeBase(sourceIds, tags = []) {
  const response = await fetch(`${API_BASE}/knowledge/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_ids: sourceIds, tags }),
  });
  if (!response.ok) throw new Error(`Save failed: ${response.statusText}`);
  return response.json();
}

export async function listSavedSources() {
  const response = await fetch(`${API_BASE}/knowledge/sources`);
  if (!response.ok) throw new Error(`List failed: ${response.statusText}`);
  return response.json();
}

export async function searchKnowledgeBase(query, tags = []) {
  const response = await fetch(`${API_BASE}/knowledge/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, tags }),
  });
  if (!response.ok) throw new Error(`Search failed: ${response.statusText}`);
  return response.json();
}
