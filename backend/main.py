"""ResearchPilot AI — FastAPI Backend."""

from __future__ import annotations

import json
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .database import (
    init_db,
    insert_source,
    update_source,
    get_source,
    get_sources,
    get_all_saved_sources,
    save_source_to_kb,
    search_saved_sources,
)
from .scraper import scrape_url, extract_domain
from .extractor import extract_source_data
from .synthesizer import synthesize_sources, compare_sources
from .chat import chat_with_sources
from .models import (
    SourceInput,
    SynthesisRequest,
    CompareRequest,
    ChatRequest,
    SaveSourceRequest,
    SearchRequest,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    await init_db()
    yield


app = FastAPI(
    title="ResearchPilot AI",
    description="Research synthesis across multiple sources",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "researchpilot-ai"}


# ─── Source Extraction ────────────────────────────────────────────

@app.post("/api/sources/extract")
async def extract_sources(input_data: SourceInput):
    """Accept URLs, scrape and extract structured data from each."""
    results = []

    for url in input_data.urls:
        url = url.strip()
        if not url:
            continue

        domain = extract_domain(url)
        source_id = await insert_source(url, domain)

        # Update status to extracting
        await update_source(source_id, status="extracting")

        # Scrape the URL
        scrape_result = scrape_url(url)

        if scrape_result.get("error"):
            await update_source(
                source_id,
                status="error",
                error=scrape_result["error"],
                domain=domain,
            )
            results.append({
                "id": source_id,
                "url": url,
                "domain": domain,
                "status": "error",
                "error": scrape_result["error"],
                "extracted_data": {},
            })
            continue

        raw_content = scrape_result.get("content", "")
        scraped_title = scrape_result.get("title", "")

        # Extract structured data via LLM
        extracted = extract_source_data(raw_content, url, scraped_title)

        await update_source(
            source_id,
            raw_content=raw_content,
            extracted_data=extracted,
            domain=domain,
            status="done",
        )

        results.append({
            "id": source_id,
            "url": url,
            "domain": domain,
            "raw_content": raw_content[:500] + "..." if len(raw_content) > 500 else raw_content,
            "status": "done",
            "extracted_data": extracted,
        })

    return {"sources": results}


@app.get("/api/sources/{source_id}")
async def get_source_endpoint(source_id: int):
    """Get a single source by ID."""
    source = await get_source(source_id)
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    return source


# ─── Synthesis ────────────────────────────────────────────────────

@app.post("/api/synthesis")
async def synthesize(request: SynthesisRequest):
    """Synthesize across multiple sources."""
    sources = await get_sources(request.source_ids)
    if len(sources) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 sources for synthesis")

    result = synthesize_sources(sources)
    return result


# ─── Compare ─────────────────────────────────────────────────────

@app.post("/api/compare")
async def compare(request: CompareRequest):
    """Compare two sources side by side."""
    source_a = await get_source(request.source_id_a)
    source_b = await get_source(request.source_id_b)

    if not source_a or not source_b:
        raise HTTPException(status_code=404, detail="One or both sources not found")

    result = compare_sources(source_a, source_b)
    return result


# ─── Chat ─────────────────────────────────────────────────────────

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat with grounded responses from sources."""
    sources = await get_sources(request.source_ids)
    if not sources:
        raise HTTPException(status_code=400, detail="No sources provided")

    history = [{"role": m.role, "content": m.content} for m in request.history]
    result = chat_with_sources(request.message, sources, history)
    return result


# ─── Knowledge Base ──────────────────────────────────────────────

@app.post("/api/knowledge/save")
async def save_to_knowledge_base(request: SaveSourceRequest):
    """Save sources to the persistent knowledge base."""
    for source_id in request.source_ids:
        source = await get_source(source_id)
        if not source:
            continue
        await save_source_to_kb(source_id, request.tags)

    return {"status": "saved", "count": len(request.source_ids)}


@app.get("/api/knowledge/sources")
async def list_saved_sources():
    """List all saved sources."""
    sources = await get_all_saved_sources()
    return {"sources": sources}


@app.post("/api/knowledge/search")
async def search_knowledge_base(request: SearchRequest):
    """Search the knowledge base."""
    results = await search_saved_sources(request.query, request.tags or [])
    return {"results": results}
