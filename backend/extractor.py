"""LLM-based structured extraction using Claude API."""

from __future__ import annotations

import json
import os
from anthropic import Anthropic

client = None


def get_client() -> Anthropic:
    """Get or create Anthropic client."""
    global client
    if client is None:
        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")
        client = Anthropic(api_key=api_key)
    return client


EXTRACTION_PROMPT = """You are a research analyst. Given the following content scraped from a URL, extract structured information.

URL: {url}
Scraped Title (if available): {title}

Content:
---
{content}
---

Extract the following fields as JSON. Be precise and factual. If a field cannot be determined from the content, use an empty string or empty list.

Return ONLY valid JSON with these fields:
{{
  "title": "The actual title of the article/paper/video",
  "core_claim": "The central thesis or main argument in 1-2 sentences",
  "key_stats": ["List of key statistics, data points, or quantitative findings"],
  "publish_date": "Publication date if detectable (YYYY-MM-DD format if possible)",
  "methodology": "Research methodology used, if applicable (e.g., RCT, meta-analysis, survey, observational)",
  "findings_summary": "3-5 sentence summary of the main findings",
  "scope": "What population, time period, or domain does this cover?",
  "source_type": "One of: article, paper, video, blog, report, news"
}}"""


def extract_source_data(raw_content: str, url: str, scraped_title: str = "") -> dict:
    """Extract structured data from raw content using Claude."""
    if not raw_content or len(raw_content.strip()) < 50:
        return {
            "title": scraped_title or "Unknown",
            "core_claim": "",
            "key_stats": [],
            "publish_date": "",
            "methodology": "",
            "findings_summary": "",
            "scope": "",
            "source_type": "article",
        }

    # Truncate very long content to fit context window
    max_chars = 80000
    content = raw_content[:max_chars]

    prompt = EXTRACTION_PROMPT.format(
        url=url,
        title=scraped_title,
        content=content,
    )

    try:
        c = get_client()
        response = c.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = response.content[0].text.strip()

        # Try to parse JSON from the response
        # Handle case where response has markdown code fences
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        extracted = json.loads(response_text)
        return extracted

    except json.JSONDecodeError:
        return {
            "title": scraped_title or "Extraction Error",
            "core_claim": "Could not parse LLM response",
            "key_stats": [],
            "publish_date": "",
            "methodology": "",
            "findings_summary": raw_content[:500],
            "scope": "",
            "source_type": "article",
        }
    except Exception as e:
        return {
            "title": scraped_title or "Error",
            "core_claim": f"Extraction failed: {str(e)}",
            "key_stats": [],
            "publish_date": "",
            "methodology": "",
            "findings_summary": "",
            "scope": "",
            "source_type": "article",
        }
