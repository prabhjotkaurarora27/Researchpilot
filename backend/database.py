"""SQLite database for ResearchPilot AI."""

from __future__ import annotations

import aiosqlite
import json
import os
from pathlib import Path

DB_PATH = Path(__file__).parent / "researchpilot.db"


async def get_db():
    """Get database connection."""
    db = await aiosqlite.connect(str(DB_PATH))
    db.row_factory = aiosqlite.Row
    return db


async def init_db():
    """Initialize database tables."""
    db = await get_db()
    try:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS sources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                domain TEXT DEFAULT '',
                raw_content TEXT DEFAULT '',
                extracted_data TEXT DEFAULT '{}',
                tags TEXT DEFAULT '[]',
                topic TEXT DEFAULT '',
                embedding TEXT DEFAULT '[]',
                status TEXT DEFAULT 'pending',
                error TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS synthesis_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_ids TEXT NOT NULL,
                result TEXT DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS saved_sources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_id INTEGER NOT NULL,
                tags TEXT DEFAULT '[]',
                topic_cluster TEXT DEFAULT '',
                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (source_id) REFERENCES sources(id)
            )
        """)
        await db.commit()
    finally:
        await db.close()


async def insert_source(url: str, domain: str) -> int:
    """Insert a new source and return its ID."""
    db = await get_db()
    try:
        cursor = await db.execute(
            "INSERT INTO sources (url, domain) VALUES (?, ?)",
            (url, domain),
        )
        await db.commit()
        return cursor.lastrowid
    finally:
        await db.close()


async def update_source(source_id: int, **kwargs):
    """Update source fields."""
    db = await get_db()
    try:
        sets = []
        values = []
        for key, value in kwargs.items():
            if key in ("raw_content", "domain", "status", "error", "topic"):
                sets.append(f"{key} = ?")
                values.append(value)
            elif key in ("extracted_data", "tags", "embedding"):
                sets.append(f"{key} = ?")
                values.append(json.dumps(value) if not isinstance(value, str) else value)
        if sets:
            values.append(source_id)
            await db.execute(
                f"UPDATE sources SET {', '.join(sets)} WHERE id = ?",
                values,
            )
            await db.commit()
    finally:
        await db.close()


async def get_source(source_id: int) -> dict | None:
    """Get a single source by ID."""
    db = await get_db()
    try:
        cursor = await db.execute("SELECT * FROM sources WHERE id = ?", (source_id,))
        row = await cursor.fetchone()
        if row:
            return _row_to_dict(row)
        return None
    finally:
        await db.close()


async def get_sources(source_ids: list[int]) -> list[dict]:
    """Get multiple sources by IDs."""
    db = await get_db()
    try:
        placeholders = ",".join("?" * len(source_ids))
        cursor = await db.execute(
            f"SELECT * FROM sources WHERE id IN ({placeholders})",
            source_ids,
        )
        rows = await cursor.fetchall()
        return [_row_to_dict(r) for r in rows]
    finally:
        await db.close()


async def get_all_saved_sources() -> list[dict]:
    """Get all saved sources with their tags."""
    db = await get_db()
    try:
        cursor = await db.execute("""
            SELECT s.*, ss.tags as saved_tags, ss.topic_cluster, ss.saved_at
            FROM sources s
            JOIN saved_sources ss ON s.id = ss.source_id
            ORDER BY ss.saved_at DESC
        """)
        rows = await cursor.fetchall()
        results = []
        for row in rows:
            d = _row_to_dict(row)
            d["saved_tags"] = json.loads(row["saved_tags"]) if row["saved_tags"] else []
            d["topic_cluster"] = row["topic_cluster"] or ""
            results.append(d)
        return results
    finally:
        await db.close()


async def save_source_to_kb(source_id: int, tags: list[str], topic_cluster: str = ""):
    """Save a source to the knowledge base."""
    db = await get_db()
    try:
        # Check if already saved
        cursor = await db.execute(
            "SELECT id FROM saved_sources WHERE source_id = ?", (source_id,)
        )
        existing = await cursor.fetchone()
        if existing:
            await db.execute(
                "UPDATE saved_sources SET tags = ?, topic_cluster = ? WHERE source_id = ?",
                (json.dumps(tags), topic_cluster, source_id),
            )
        else:
            await db.execute(
                "INSERT INTO saved_sources (source_id, tags, topic_cluster) VALUES (?, ?, ?)",
                (source_id, json.dumps(tags), topic_cluster),
            )
        await db.commit()
    finally:
        await db.close()


async def search_saved_sources(query: str, tags: list[str] = None) -> list[dict]:
    """Search saved sources by text content and optional tags."""
    db = await get_db()
    try:
        sql = """
            SELECT s.*, ss.tags as saved_tags, ss.topic_cluster
            FROM sources s
            JOIN saved_sources ss ON s.id = ss.source_id
            WHERE (
                s.raw_content LIKE ? OR
                s.extracted_data LIKE ? OR
                s.url LIKE ?
            )
        """
        params = [f"%{query}%", f"%{query}%", f"%{query}%"]

        if tags:
            for tag in tags:
                sql += " AND ss.tags LIKE ?"
                params.append(f'%"{tag}"%')

        sql += " ORDER BY ss.saved_at DESC"
        cursor = await db.execute(sql, params)
        rows = await cursor.fetchall()
        results = []
        for row in rows:
            d = _row_to_dict(row)
            d["saved_tags"] = json.loads(row["saved_tags"]) if row["saved_tags"] else []
            d["topic_cluster"] = row["topic_cluster"] or ""
            results.append(d)
        return results
    finally:
        await db.close()


def _row_to_dict(row) -> dict:
    """Convert a database row to a dictionary."""
    d = dict(row)
    if "extracted_data" in d and isinstance(d["extracted_data"], str):
        try:
            d["extracted_data"] = json.loads(d["extracted_data"])
        except (json.JSONDecodeError, TypeError):
            d["extracted_data"] = {}
    if "tags" in d and isinstance(d["tags"], str):
        try:
            d["tags"] = json.loads(d["tags"])
        except (json.JSONDecodeError, TypeError):
            d["tags"] = []
    if "embedding" in d and isinstance(d["embedding"], str):
        try:
            d["embedding"] = json.loads(d["embedding"])
        except (json.JSONDecodeError, TypeError):
            d["embedding"] = []
    return d
