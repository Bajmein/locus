"""Tests for the mercenary pivot (change 015) narrative assertions.

Covers: index.md frontmatter + copy pivot (AC1–AC4), cv.md description + intro (AC16–AC17),
vigilia-edge heading rename (AC10).
"""

from __future__ import annotations

from pathlib import Path

import yaml

DOCS_ROOT = Path(__file__).parent.parent.parent / "docs"


def _parse_page(path: Path) -> tuple[dict, str]:
    """Return (frontmatter_dict, body_text) for a Markdown page with YAML frontmatter."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    fm = yaml.safe_load(parts[1]) or {}
    body = parts[2]
    return fm, body


# ---------------------------------------------------------------------------
# index.md — Frontmatter SEO (AC1)
# ---------------------------------------------------------------------------


def test_index_frontmatter_title():
    fm, _ = _parse_page(DOCS_ROOT / "index.md")
    title = str(fm.get("title", ""))
    assert "Ingeniero Informático" in title or "Desarrollo de Software" in title, (
        "index.md frontmatter 'title' must contain 'Ingeniero Informático' or "
        "'Desarrollo de Software'"
    )


def test_index_frontmatter_description_not_empty():
    fm, _ = _parse_page(DOCS_ROOT / "index.md")
    desc = fm.get("description")
    assert desc and str(desc).strip(), (
        "index.md must have a non-empty 'description' in frontmatter"
    )


# ---------------------------------------------------------------------------
# index.md — Titular y bio (AC1, AC2, AC3)
# ---------------------------------------------------------------------------


def test_index_no_arquitectura_rd():
    _, body = _parse_page(DOCS_ROOT / "index.md")
    assert "Arquitectura & R&D" not in body, (
        "index.md body must not contain 'Arquitectura & R&D' (old headline)"
    )


def test_index_no_bienvenido_bio():
    _, body = _parse_page(DOCS_ROOT / "index.md")
    assert "Bienvenido a mi portafolio de arquitectura y R&D" not in body, (
        "index.md body must not contain the old generic bio"
    )


def test_index_pragmatism_marker():
    _, body = _parse_page(DOCS_ROOT / "index.md")
    markers = ["Rust", "Python", "SDD", "herramienta"]
    assert any(m in body for m in markers), (
        f"index.md body must contain at least one pragmatism marker: {markers}"
    )


# ---------------------------------------------------------------------------
# cv.md — Frontmatter description (AC16)
# ---------------------------------------------------------------------------


def test_cv_description_no_old_text():
    fm, _ = _parse_page(DOCS_ROOT / "cv.md")
    desc = str(fm.get("description", ""))
    assert "automatización y orquestación de flujos de trabajo" not in desc, (
        "cv.md frontmatter 'description' must not contain the old text"
    )


def test_cv_description_new_positioning():
    fm, _ = _parse_page(DOCS_ROOT / "cv.md")
    desc = str(fm.get("description", ""))
    assert "Software Engineer" in desc or "Backend & Systems" in desc, (
        "cv.md frontmatter 'description' must reflect new pragmatic positioning"
    )


# ---------------------------------------------------------------------------
# cv.md — Párrafo introductorio (AC17)
# ---------------------------------------------------------------------------


def test_cv_body_no_old_intro():
    _, body = _parse_page(DOCS_ROOT / "cv.md")
    assert (
        "Ingeniero Informático enfocado en diseño de sistemas, automatización y orquestación"
        not in body
    ), "cv.md body must not contain the old introductory paragraph"


# ---------------------------------------------------------------------------
# vigilia-edge — Heading rename (AC10)
# ---------------------------------------------------------------------------


def test_vigilia_edge_no_por_que_rust_heading():
    _, body = _parse_page(DOCS_ROOT / "vigilia-edge" / "index.md")
    assert "### Por qué Rust" not in body, (
        "vigilia-edge/index.md must not contain '### Por qué Rust' heading"
    )


def test_vigilia_edge_no_internal_architecture_table():
    _, body = _parse_page(DOCS_ROOT / "vigilia-edge" / "index.md")
    assert "### Decisiones de arquitectura pragmática" not in body, (
        "vigilia-edge/index.md must not expose internal architecture decisions table"
        " (IP protection)"
    )
