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
