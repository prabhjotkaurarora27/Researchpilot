"""Heuristic source credibility scoring for ResearchPilot AI."""

from __future__ import annotations

from datetime import datetime, timedelta


# Domain reputation tiers
ACADEMIC_DOMAINS = {
    "arxiv.org", "nature.com", "science.org", "sciencedirect.com",
    "pubmed.ncbi.nlm.nih.gov", "ncbi.nlm.nih.gov", "springer.com",
    "thelancet.com", "nejm.org", "bmj.com", "cell.com", "pnas.org",
    "ieee.org", "acm.org", "jstor.org", "wiley.com", "oup.com",
    "plos.org", "frontiersin.org", "mdpi.com", "biorxiv.org",
    "medrxiv.org", "ssrn.com", "researchgate.net",
}

GOV_EDU_SUFFIXES = (".edu", ".gov", ".ac.uk", ".edu.au", ".ac.in")

MAJOR_NEWS = {
    "nytimes.com", "washingtonpost.com", "bbc.com", "bbc.co.uk",
    "reuters.com", "apnews.com", "wsj.com", "economist.com",
    "theguardian.com", "ft.com", "bloomberg.com", "cnbc.com",
    "cnn.com", "npr.org", "politico.com", "theatlantic.com",
}

ESTABLISHED_TECH = {
    "techcrunch.com", "wired.com", "arstechnica.com", "theverge.com",
    "hbr.org", "mit.edu", "openai.com", "anthropic.com",
    "deepmind.com", "ai.google", "research.google", "meta.com",
    "microsoft.com", "huggingface.co",
}


def _domain_tier(domain: str) -> tuple[int, str]:
    """Score domain reputation. Returns (base_score, label)."""
    domain_lower = domain.lower()

    # Academic / research
    if domain_lower in ACADEMIC_DOMAINS:
        return 90, "Academic"

    # Government / education TLDs
    for suffix in GOV_EDU_SUFFIXES:
        if domain_lower.endswith(suffix):
            return 85, "Institutional"

    # Major news outlets
    if domain_lower in MAJOR_NEWS:
        return 70, "Major News"

    # Established tech / research orgs
    if domain_lower in ESTABLISHED_TECH:
        return 75, "Established"

    # YouTube — medium credibility (varies widely)
    if domain_lower in ("youtube.com", "youtu.be"):
        return 45, "Video"

    # Wikipedia — decent reference but not primary
    if "wikipedia.org" in domain_lower:
        return 60, "Reference"

    # Medium — varies, but generally lower
    if domain_lower in ("medium.com", "substack.com", "dev.to"):
        return 40, "Blog Platform"

    # Default — unknown blog/site
    return 30, "Unverified"


def _recency_bonus(publish_date: str) -> int:
    """Add bonus points for recent publications."""
    if not publish_date:
        return 0

    try:
        # Try common date formats
        for fmt in ("%Y-%m-%d", "%Y-%m", "%Y"):
            try:
                pub = datetime.strptime(publish_date.strip()[:len(fmt.replace('%', '0'))], fmt)
                break
            except ValueError:
                continue
        else:
            return 0

        now = datetime.now()
        age = now - pub

        if age <= timedelta(days=365):
            return 10  # Published within 1 year
        elif age <= timedelta(days=730):
            return 5   # Published within 2 years
        else:
            return 0

    except Exception:
        return 0


def _source_type_bonus(source_type: str) -> int:
    """Bonus based on source type."""
    bonuses = {
        "paper": 10,
        "report": 5,
        "article": 3,
        "news": 2,
        "video": 0,
        "blog": -5,
    }
    return bonuses.get(source_type.lower(), 0)


def score_credibility(domain: str, publish_date: str = "", source_type: str = "") -> dict:
    """Score source credibility using heuristics.

    Returns:
        dict with keys: score (0-100), tier (high/medium/low), label (str)
    """
    base_score, label = _domain_tier(domain)
    recency = _recency_bonus(publish_date)
    type_bonus = _source_type_bonus(source_type)

    total = max(0, min(100, base_score + recency + type_bonus))

    if total >= 70:
        tier = "high"
    elif total >= 45:
        tier = "medium"
    else:
        tier = "low"

    return {
        "score": total,
        "tier": tier,
        "label": label,
    }
