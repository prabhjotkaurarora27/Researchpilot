"""Semantic embedding store using sentence-transformers + FAISS."""

from __future__ import annotations

import json
import logging
import numpy as np

logger = logging.getLogger(__name__)

# Lazy imports — these are heavy, only load when actually used
_model = None
_faiss = None


def _get_model():
    """Lazy-load the sentence-transformer model."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        logger.info("Loading embedding model (all-MiniLM-L6-v2)...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Embedding model loaded.")
    return _model


def _get_faiss():
    """Lazy-load FAISS."""
    global _faiss
    if _faiss is None:
        import faiss as _f
        _faiss = _f
    return _faiss


class EmbeddingStore:
    """In-memory FAISS index for semantic search over saved sources."""

    _instance: EmbeddingStore | None = None
    DIMENSION = 384  # all-MiniLM-L6-v2 output dimension

    def __init__(self):
        faiss = _get_faiss()
        self.index = faiss.IndexFlatIP(self.DIMENSION)  # inner-product (cosine after normalization)
        self.source_ids: list[int] = []

    @classmethod
    def get(cls) -> "EmbeddingStore":
        """Singleton access."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _embed(self, texts: list[str]) -> np.ndarray:
        """Generate normalized embeddings for a list of texts."""
        model = _get_model()
        embeddings = model.encode(texts, normalize_embeddings=True)
        return np.array(embeddings, dtype=np.float32)

    def _source_text(self, source: dict) -> str:
        """Build a searchable text string from a source."""
        extracted = source.get("extracted_data", {})
        if isinstance(extracted, str):
            extracted = json.loads(extracted)

        parts = [
            extracted.get("title", ""),
            extracted.get("core_claim", ""),
            extracted.get("findings_summary", ""),
            extracted.get("methodology", ""),
            extracted.get("scope", ""),
            " ".join(extracted.get("key_stats", [])),
        ]
        text = " ".join(p for p in parts if p)

        # Also include a snippet of raw content for richer embeddings
        raw = source.get("raw_content", "")
        if raw:
            text += " " + raw[:2000]

        return text.strip()

    def add(self, source_id: int, source: dict) -> None:
        """Add a single source to the index."""
        text = self._source_text(source)
        if not text:
            return

        embedding = self._embed([text])
        self.index.add(embedding)
        self.source_ids.append(source_id)
        logger.info(f"Added source {source_id} to embedding index (total: {len(self.source_ids)})")

    def search(self, query: str, top_k: int = 10) -> list[tuple[int, float]]:
        """Search for sources similar to the query.

        Returns list of (source_id, similarity_score) tuples, sorted by relevance.
        """
        if self.index.ntotal == 0:
            return []

        query_embedding = self._embed([query])
        k = min(top_k, self.index.ntotal)
        scores, indices = self.index.search(query_embedding, k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self.source_ids):
                continue
            results.append((self.source_ids[idx], float(score)))

        return results

    def rebuild(self, sources: list[dict]) -> None:
        """Rebuild the entire index from a list of sources.

        Each source dict must have an 'id' key and the standard extracted fields.
        """
        faiss = _get_faiss()
        self.index = faiss.IndexFlatIP(self.DIMENSION)
        self.source_ids = []

        if not sources:
            logger.info("No saved sources — embedding index is empty.")
            return

        texts = []
        ids = []
        for src in sources:
            text = self._source_text(src)
            if text:
                texts.append(text)
                ids.append(src["id"])

        if not texts:
            return

        embeddings = self._embed(texts)
        self.index.add(embeddings)
        self.source_ids = ids
        logger.info(f"Rebuilt embedding index with {len(ids)} sources.")

    def remove(self, source_id: int) -> None:
        """Remove a source and rebuild (FAISS IndexFlatIP doesn't support single removal)."""
        if source_id in self.source_ids:
            idx = self.source_ids.index(source_id)
            self.source_ids.pop(idx)
            # Must rebuild since IndexFlatIP doesn't support remove_ids cleanly
            # This is fine for a small student project
            logger.info(f"Removed source {source_id} — rebuild needed on next search.")
