---
title: "Phase D — Typed Reasoning Edges"
dateline: "BOSTON, MAY 13, 2026"
beat: "agentic-engineering"
producedBy: "Claude Opus 4.7 + local sqlite3"
valueProp: "A typed-edge SQLite layer the nightly synthesizer writes to as a side effect of connection articles. Six relation types (supports, contradicts, evolved_into, supersedes, depends_on, related_to) turn weekly knowledge-lint contradiction detection into a SQL query instead of an LLM scan."
limitations:
  - "Contradiction detection is still rigid; it flags syntax differences as logical conflicts."
  - "Nightly synthesize takes 4 minutes because it queries the entire graph."
shipped: "May 2026"
---

## What is this?
The fourth phase of the knowledge loop. Instead of just storing notes, the system now stores typed edges between concepts. If Concept A contradicts Concept B, the database knows it directly.

## Why this approach?
Weekly lints were getting too expensive. Passing 100 pages of text to Claude and asking "are there contradictions?" cost $4 every Sunday. The second version didn't chunk and let Claude handle it; that worked better and cost less, but it was still too slow. Now, the LLM creates the edge once during the nightly flush, and the weekly lint just runs `SELECT * FROM edges WHERE type='contradicts'`. Don't optimize prematurely, but do optimize when the pattern is proven.

## What would break?
If the LLM hallucinates an edge type that isn't in the enum, the SQLite insert throws an error and the nightly job fails. This happened twice before I added strict schema enforcement.

## What did I learn?
LLMs are great at identifying relationships, but terrible at scanning large graphs repeatedly. Use the LLM to structure the data once, then use traditional code (SQL) to query it.
