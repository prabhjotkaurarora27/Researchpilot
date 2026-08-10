"""Cross-source synthesis engine using Claude API."""

from __future__ import annotations

import json
from .extractor import get_client


SYNTHESIS_PROMPT = """You are a research synthesis expert. You are given extracted data from multiple sources. Your job is to analyze ACROSS these sources and identify:

1. **Consensus**: Where sources agree on claims or findings
2. **Contradictions**: Where sources conflict or present opposing views
3. **Connections**: Non-obvious links, patterns, or complementary insights across sources

Sources:
{sources_json}

Produce a synthesis in the following JSON format. Each point must include "citations" — a list of source indices (1-based) that support the point. Write the synthesis so that an inline citation like [Source 1] or [Source 3] appears naturally in the text.

Return ONLY valid JSON:
{{
  "consensus": [
    {{"point": "Statement where sources agree [Source 1] [Source 3]", "citations": [1, 3], "explanation": "Why this agreement matters"}}
  ],
  "contradictions": [
    {{"point": "Statement where sources conflict [Source 1] vs [Source 2]", "citations": [1, 2], "explanation": "Nature of the disagreement"}}
  ],
  "connections": [
    {{"point": "Non-obvious connection or pattern across sources [Source 2] [Source 4]", "citations": [2, 4], "explanation": "Why this connection is interesting"}}
  ],
  "summary_oneline": "A single sentence capturing the overall synthesis across all sources",
  "summary_paragraph": "A 3-5 sentence paragraph synthesizing the key findings, with inline [Source N] citations",
  "summary_full": "A detailed multi-paragraph breakdown of the synthesis, organized by theme, with inline [Source N] citations throughout. Use markdown formatting (## headings, **bold**, bullet points)."
}}"""


COMPARE_PROMPT = """You are a research analyst. Compare these two sources across specific dimensions.

Source A:
{source_a_json}

Source B:
{source_b_json}

Return ONLY valid JSON — an array of comparison rows. For each dimension, indicate whether the sources are "aligned", "divergent", or "neutral":

{{
  "rows": [
    {{"dimension": "Core Claim", "source_a": "Source A's position", "source_b": "Source B's position", "alignment": "aligned|divergent|neutral"}},
    {{"dimension": "Methodology", "source_a": "...", "source_b": "...", "alignment": "..."}},
    {{"dimension": "Key Findings", "source_a": "...", "source_b": "...", "alignment": "..."}},
    {{"dimension": "Scope", "source_a": "...", "source_b": "...", "alignment": "..."}},
    {{"dimension": "Recency", "source_a": "...", "source_b": "...", "alignment": "..."}},
    {{"dimension": "Key Statistics", "source_a": "...", "source_b": "...", "alignment": "..."}},
    {{"dimension": "Limitations", "source_a": "...", "source_b": "...", "alignment": "..."}}
  ]
}}"""


def synthesize_sources(sources: list[dict]) -> dict:
    """Generate cross-source synthesis."""
    # Build numbered source summaries
    source_summaries = []
    for i, src in enumerate(sources, 1):
        extracted = src.get("extracted_data", {})
        if isinstance(extracted, str):
            extracted = json.loads(extracted)
        source_summaries.append({
            "source_number": i,
            "title": extracted.get("title", "Unknown"),
            "url": src.get("url", ""),
            "core_claim": extracted.get("core_claim", ""),
            "key_stats": extracted.get("key_stats", []),
            "methodology": extracted.get("methodology", ""),
            "findings_summary": extracted.get("findings_summary", ""),
            "scope": extracted.get("scope", ""),
            "source_type": extracted.get("source_type", ""),
        })

    prompt = SYNTHESIS_PROMPT.format(
        sources_json=json.dumps(source_summaries, indent=2)
    )

    try:
        c = get_client()
        response = c.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = response.content[0].text.strip()

        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        return json.loads(response_text)

    except Exception as e:
        return {
            "consensus": [],
            "contradictions": [],
            "connections": [],
            "summary_oneline": f"Synthesis failed: {str(e)}",
            "summary_paragraph": "",
            "summary_full": "",
        }


def compare_sources(source_a: dict, source_b: dict) -> dict:
    """Compare two sources side by side."""
    ext_a = source_a.get("extracted_data", {})
    ext_b = source_b.get("extracted_data", {})
    if isinstance(ext_a, str):
        ext_a = json.loads(ext_a)
    if isinstance(ext_b, str):
        ext_b = json.loads(ext_b)

    source_a_info = {
        "title": ext_a.get("title", "Unknown"),
        "url": source_a.get("url", ""),
        **ext_a,
    }
    source_b_info = {
        "title": ext_b.get("title", "Unknown"),
        "url": source_b.get("url", ""),
        **ext_b,
    }

    prompt = COMPARE_PROMPT.format(
        source_a_json=json.dumps(source_a_info, indent=2),
        source_b_json=json.dumps(source_b_info, indent=2),
    )

    try:
        c = get_client()
        response = c.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = response.content[0].text.strip()

        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        result = json.loads(response_text)
        return {
            "source_a_title": ext_a.get("title", "Source A"),
            "source_b_title": ext_b.get("title", "Source B"),
            "rows": result.get("rows", []),
        }

    except Exception as e:
        return {
            "source_a_title": ext_a.get("title", "Source A"),
            "source_b_title": ext_b.get("title", "Source B"),
            "rows": [{"dimension": "Error", "source_a": str(e), "source_b": "", "alignment": "neutral"}],
        }
