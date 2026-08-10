"""URL scraping pipeline for ResearchPilot AI."""

from __future__ import annotations

import re
from urllib.parse import urlparse

import trafilatura


def extract_domain(url: str) -> str:
    """Extract clean domain from URL."""
    parsed = urlparse(url)
    domain = parsed.netloc
    if domain.startswith("www."):
        domain = domain[4:]
    return domain


def is_youtube_url(url: str) -> bool:
    """Check if URL is a YouTube video."""
    domain = extract_domain(url)
    return domain in ("youtube.com", "youtu.be", "m.youtube.com")


def extract_youtube_id(url: str) -> str | None:
    """Extract YouTube video ID from URL."""
    patterns = [
        r'(?:v=|\/v\/|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})',
        r'(?:watch\?v=)([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def scrape_youtube(url: str) -> dict:
    """Scrape YouTube video transcript."""
    video_id = extract_youtube_id(url)
    if not video_id:
        return {"content": "", "title": "", "error": "Could not extract YouTube video ID"}

    try:
        from youtube_transcript_api import YouTubeTranscriptApi

        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id)

        # Combine transcript snippets
        full_text = " ".join([snippet.text for snippet in transcript])

        return {
            "content": full_text,
            "title": f"YouTube Video ({video_id})",
            "error": None,
        }
    except Exception as e:
        return {"content": "", "title": "", "error": f"YouTube transcript error: {str(e)}"}


def scrape_article(url: str) -> dict:
    """Scrape article/blog content using trafilatura."""
    try:
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            return {"content": "", "title": "", "error": f"Could not fetch URL: {url}"}

        content = trafilatura.extract(
            downloaded,
            include_comments=False,
            include_tables=True,
            favor_precision=True,
        )

        # Try to extract title from metadata
        metadata = trafilatura.extract(
            downloaded,
            output_format="json",
            include_comments=False,
        )

        title = ""
        if metadata:
            import json
            try:
                meta_dict = json.loads(metadata)
                title = meta_dict.get("title", "")
            except (json.JSONDecodeError, TypeError):
                pass

        if not content:
            return {"content": "", "title": title, "error": "Could not extract readable content"}

        return {
            "content": content,
            "title": title,
            "error": None,
        }
    except Exception as e:
        return {"content": "", "title": "", "error": f"Scraping error: {str(e)}"}


def scrape_url(url: str) -> dict:
    """Main scraping dispatcher — routes to appropriate handler."""
    domain = extract_domain(url)

    if is_youtube_url(url):
        result = scrape_youtube(url)
    else:
        result = scrape_article(url)

    result["domain"] = domain
    result["url"] = url
    return result
