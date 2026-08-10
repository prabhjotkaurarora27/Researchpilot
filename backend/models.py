"""Pydantic models for ResearchPilot AI."""

from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SourceInput(BaseModel):
    urls: list[str] = Field(..., min_length=1, max_length=10)


class ExtractedData(BaseModel):
    title: str = ""
    core_claim: str = ""
    key_stats: list[str] = Field(default_factory=list)
    publish_date: str = ""
    methodology: str = ""
    findings_summary: str = ""
    scope: str = ""
    source_type: str = ""  # article, paper, video, blog


class Source(BaseModel):
    id: int = 0
    url: str
    domain: str = ""
    raw_content: str = ""
    extracted: Optional[ExtractedData] = None
    status: str = "pending"  # pending, extracting, done, error
    error: Optional[str] = None
    created_at: str = ""


class ExtractResponse(BaseModel):
    sources: list[Source]


class ConsensusPoint(BaseModel):
    point: str
    citations: list[int]  # source indices
    explanation: str = ""


class SynthesisResult(BaseModel):
    consensus: list[ConsensusPoint] = Field(default_factory=list)
    contradictions: list[ConsensusPoint] = Field(default_factory=list)
    connections: list[ConsensusPoint] = Field(default_factory=list)
    summary_oneline: str = ""
    summary_paragraph: str = ""
    summary_full: str = ""


class SynthesisRequest(BaseModel):
    source_ids: list[int]


class CompareRequest(BaseModel):
    source_id_a: int
    source_id_b: int


class CompareRow(BaseModel):
    dimension: str
    source_a: str
    source_b: str
    alignment: str = "neutral"  # aligned, divergent, neutral


class CompareResult(BaseModel):
    source_a_title: str
    source_b_title: str
    rows: list[CompareRow]


class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str


class ChatRequest(BaseModel):
    message: str
    source_ids: list[int]
    history: list[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str
    citations: list[dict] = Field(default_factory=list)


class SaveSourceRequest(BaseModel):
    source_ids: list[int]
    tags: list[str] = Field(default_factory=list)


class SearchRequest(BaseModel):
    query: str
    tags: list[str] = Field(default_factory=list)
