"""Grounded chat with source citations using Claude API — with streaming support."""

from __future__ import annotations

import json
import re
from .extractor import get_client


CHAT_SYSTEM_PROMPT = """You are a research assistant. You answer questions ONLY based on the provided source materials. Follow these rules strictly:

1. ONLY use information from the provided sources to answer questions.
2. EVERY factual claim in your answer MUST include a citation in the format [Source N] where N is the source number.
3. Immediately after each [Source N] citation, include the exact supporting passage from that source in the format [passage: "exact quote from source"]. Keep the passage to 1-3 sentences — the verbatim text that supports your claim.
4. If the sources do not contain information to answer the question, say: "The provided sources do not contain sufficient information to answer this question."
5. Never fabricate information or use knowledge outside the provided sources.
6. When sources disagree, present both perspectives with their respective citations.
7. Use markdown formatting for readability.

Example format:
The scaling laws predict model performance accurately [Source 1] [passage: "We find that loss scales as a power-law with model size, dataset size, and compute."]

Sources available:
{sources_context}"""


def build_sources_context(sources: list[dict]) -> str:
    """Build context string from sources for the chat system prompt."""
    context_parts = []
    for i, src in enumerate(sources, 1):
        extracted = src.get("extracted_data", {})
        if isinstance(extracted, str):
            extracted = json.loads(extracted)

        raw_content = src.get("raw_content", "")
        # Truncate raw content for context window
        if len(raw_content) > 15000:
            raw_content = raw_content[:15000] + "... [truncated]"

        context_parts.append(f"""
--- Source {i} ---
Title: {extracted.get('title', 'Unknown')}
URL: {src.get('url', '')}
Core Claim: {extracted.get('core_claim', '')}
Findings: {extracted.get('findings_summary', '')}
Key Stats: {', '.join(extracted.get('key_stats', []))}
Full Content:
{raw_content}
--- End Source {i} ---
""")

    return "\n".join(context_parts)


def _build_messages(message: str, history: list[dict]) -> list[dict]:
    """Build the messages list for the Claude API."""
    messages = []
    for msg in history:
        messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("content", ""),
        })
    messages.append({"role": "user", "content": message})
    return messages


def _extract_citations(text: str, sources: list[dict]) -> list[dict]:
    """Extract citation references and their passages from response text.

    Parses two patterns:
      [Source N] [passage: "..."]  — citation with inline passage
      [Source N]                   — citation without passage
    """
    # First, extract all [Source N] [passage: "..."] pairs
    passage_pattern = r'\[Source (\d+)\]\s*\[passage:\s*"([^"]*?)"\]'
    passage_matches = re.findall(passage_pattern, text)

    # Build a map of source_number -> passage
    passage_map = {}
    for num_str, passage in passage_matches:
        num = int(num_str)
        if num not in passage_map:
            passage_map[num] = passage

    # Then find all [Source N] references (including those with passages)
    citation_refs = re.findall(r'\[Source (\d+)\]', text)
    unique_citations = sorted(set(int(c) for c in citation_refs))

    citations = []
    for cite_num in unique_citations:
        if 1 <= cite_num <= len(sources):
            src = sources[cite_num - 1]
            extracted = src.get("extracted_data", {})
            if isinstance(extracted, str):
                extracted = json.loads(extracted)
            citations.append({
                "source_number": cite_num,
                "title": extracted.get("title", "Unknown"),
                "url": src.get("url", ""),
                "passage": passage_map.get(cite_num, ""),
            })
    return citations


def _clean_passages_from_text(text: str) -> str:
    """Remove [passage: "..."] markers from text for display, keeping only [Source N]."""
    return re.sub(r'\s*\[passage:\s*"[^"]*?"\]', '', text)


def chat_with_sources(
    message: str,
    sources: list[dict],
    history: list[dict] = None,
) -> dict:
    """Chat with grounded responses from sources (non-streaming)."""
    if history is None:
        history = []

    sources_context = build_sources_context(sources)
    system_prompt = CHAT_SYSTEM_PROMPT.format(sources_context=sources_context)
    messages = _build_messages(message, history)

    try:
        c = get_client()
        response = c.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            system=system_prompt,
            messages=messages,
        )

        raw_reply = response.content[0].text.strip()
        citations = _extract_citations(raw_reply, sources)
        clean_reply = _clean_passages_from_text(raw_reply)

        return {
            "reply": clean_reply,
            "citations": citations,
        }

    except Exception as e:
        return {
            "reply": f"Error generating response: {str(e)}",
            "citations": [],
        }


def chat_with_sources_stream(
    message: str,
    sources: list[dict],
    history: list[dict] = None,
):
    """Chat with grounded responses — yields SSE events as tokens arrive.

    Yields strings in SSE format:
      data: {"token": "..."}\\n\\n
      data: {"done": true, "full_text": "...", "citations": [...]}\\n\\n
    """
    if history is None:
        history = []

    sources_context = build_sources_context(sources)
    system_prompt = CHAT_SYSTEM_PROMPT.format(sources_context=sources_context)
    messages = _build_messages(message, history)

    try:
        c = get_client()
        full_text = ""

        with c.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            system=system_prompt,
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                full_text += text
                # Stream the raw token (passages will be cleaned on the final event)
                yield f"data: {json.dumps({'token': text})}\n\n"

        # Final event with citations and cleaned text
        citations = _extract_citations(full_text, sources)
        clean_text = _clean_passages_from_text(full_text)
        yield f"data: {json.dumps({'done': True, 'full_text': clean_text.strip(), 'citations': citations})}\n\n"

    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
