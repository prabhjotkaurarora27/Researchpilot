"""Grounded chat with source citations using Claude API."""

from __future__ import annotations

import json
from .extractor import get_client


CHAT_SYSTEM_PROMPT = """You are a research assistant. You answer questions ONLY based on the provided source materials. Follow these rules strictly:

1. ONLY use information from the provided sources to answer questions.
2. EVERY factual claim in your answer MUST include a citation in the format [Source N] where N is the source number.
3. If the sources do not contain information to answer the question, say: "The provided sources do not contain sufficient information to answer this question."
4. Never fabricate information or use knowledge outside the provided sources.
5. When sources disagree, present both perspectives with their respective citations.
6. Use markdown formatting for readability.

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


def chat_with_sources(
    message: str,
    sources: list[dict],
    history: list[dict] = None,
) -> dict:
    """Chat with grounded responses from sources."""
    if history is None:
        history = []

    sources_context = build_sources_context(sources)
    system_prompt = CHAT_SYSTEM_PROMPT.format(sources_context=sources_context)

    # Build message history
    messages = []
    for msg in history:
        messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("content", ""),
        })
    messages.append({"role": "user", "content": message})

    try:
        c = get_client()
        response = c.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            system=system_prompt,
            messages=messages,
        )

        reply = response.content[0].text.strip()

        # Extract citation references from the reply
        import re
        citation_refs = re.findall(r'\[Source (\d+)\]', reply)
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
                })

        return {
            "reply": reply,
            "citations": citations,
        }

    except Exception as e:
        return {
            "reply": f"Error generating response: {str(e)}",
            "citations": [],
        }
