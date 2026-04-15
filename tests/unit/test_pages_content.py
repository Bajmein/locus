"""Tests for the content of portfolio pages: forge, vigilia, and vigilia-edge.

Covers: SEO frontmatter (AC1, AC6), structure (AC2, AC3, AC5, AC7, AC8, AC9, AC11),
outside-in safety (AC4, AC10), and cross-links (AC12, AC13).
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest
import yaml

DOCS_ROOT = Path(__file__).parent.parent.parent / "docs"


def _parse_page(path: Path) -> tuple[dict, str]:
    """Return (frontmatter_dict, body_text) for a Markdown page with YAML frontmatter."""
    text = path.read_text(encoding="utf-8")
    # Strip leading whitespace/newlines, then split on the --- delimiters
    parts = text.split("---")
    # parts[0] is empty (before first ---), parts[1] is YAML, parts[2+] is body
    if len(parts) < 3:
        return {}, text
    fm = yaml.safe_load(parts[1]) or {}
    body = "---".join(parts[2:])
    return fm, body


@pytest.fixture
def forge_page() -> tuple[dict, str]:
    return _parse_page(DOCS_ROOT / "forge" / "index.md")


@pytest.fixture
def vigilia_page() -> tuple[dict, str]:
    return _parse_page(DOCS_ROOT / "vigilia" / "index.md")


@pytest.fixture
def vigilia_edge_page() -> tuple[dict, str]:
    return _parse_page(DOCS_ROOT / "vigilia-edge" / "index.md")


# ---------------------------------------------------------------------------
# Phase 3: Forge — SEO Frontmatter (AC1)
# ---------------------------------------------------------------------------


def test_forge_frontmatter_title(forge_page):
    fm, _ = forge_page
    assert fm.get("title"), "forge/index.md must have a non-empty 'title' in frontmatter"


def test_forge_frontmatter_description(forge_page):
    fm, _ = forge_page
    desc = fm.get("description")
    assert desc and str(desc).strip(), (
        "forge/index.md must have a non-empty 'description' in frontmatter"
    )


# ---------------------------------------------------------------------------
# Phase 4: Forge — Minimum Content Structure (AC2, AC3, AC5)
# ---------------------------------------------------------------------------


def test_forge_has_tagline(forge_page):
    _, body = forge_page
    assert re.search(r"\*\*.+\*\*", body), (
        "forge/index.md must have a bold tagline (** ... **)"
    )


def test_forge_has_problema_section(forge_page):
    _, body = forge_page
    assert "## El Problema" in body, "forge/index.md must contain '## El Problema'"


def test_forge_has_solucion_section(forge_page):
    _, body = forge_page
    assert "## La Solución" in body, "forge/index.md must contain '## La Solución'"


def test_forge_has_pipeline_stages(forge_page):
    _, body = forge_page
    assert "→" in body, "forge/index.md must contain pipeline stages with '→'"


def test_forge_has_capacidades_section(forge_page):
    _, body = forge_page
    assert "## Capacidades" in body, "forge/index.md must contain '## Capacidades'"


def test_forge_grid_cards_syntax(forge_page):
    _, body = forge_page
    assert '<div class="grid cards" markdown>' in body, (
        "forge/index.md must contain Material grid cards syntax"
    )


def test_forge_estado_admonition(forge_page):
    _, body = forge_page
    assert "!!! info" in body, "forge/index.md must contain a '!!! info' admonition"
    assert re.search(r"v\d+\.\d+\.\d+", body), (
        "forge/index.md estado admonition must include a version (vX.Y.Z)"
    )


# ---------------------------------------------------------------------------
# Phase 5: Forge — Outside-In Safety (AC4)
# ---------------------------------------------------------------------------

_PROPRIETARY_PATTERNS = [
    (r"/home/", "absolute path /home/"),
    (r"/root/", "absolute path /root/"),
    (r"ghp_[A-Za-z0-9]+", "GitHub token (ghp_)"),
    (r"sk-[A-Za-z0-9]+", "API key (sk-)"),
    (r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b", "raw IPv4 address"),
]


def test_forge_no_proprietary_details(forge_page):
    _, body = forge_page
    for pattern, label in _PROPRIETARY_PATTERNS:
        assert not re.search(pattern, body), (
            f"forge/index.md must not contain {label}"
        )


# ---------------------------------------------------------------------------
# Phase 6: Vigilia — SEO Frontmatter (AC6)
# ---------------------------------------------------------------------------


def test_vigilia_frontmatter_title(vigilia_page):
    fm, _ = vigilia_page
    assert fm.get("title"), "vigilia/index.md must have a non-empty 'title' in frontmatter"


def test_vigilia_frontmatter_description(vigilia_page):
    fm, _ = vigilia_page
    desc = fm.get("description")
    assert desc and str(desc).strip(), (
        "vigilia/index.md must have a non-empty 'description' in frontmatter"
    )


# ---------------------------------------------------------------------------
# Phase 7: Vigilia — Minimum Content Structure (AC7, AC8, AC9, AC11)
# ---------------------------------------------------------------------------


def test_vigilia_has_tagline(vigilia_page):
    _, body = vigilia_page
    assert re.search(r"\*\*.+\*\*", body), (
        "vigilia/index.md must have a bold tagline (** ... **)"
    )


def test_vigilia_has_problema_section(vigilia_page):
    _, body = vigilia_page
    assert "## El Problema" in body, "vigilia/index.md must contain '## El Problema'"


def test_vigilia_has_solucion_section(vigilia_page):
    _, body = vigilia_page
    assert "## La Solución" in body, "vigilia/index.md must contain '## La Solución'"


def test_vigilia_has_pipeline_stages(vigilia_page):
    _, body = vigilia_page
    assert "→" in body, "vigilia/index.md must contain pipeline stages with '→'"


def test_vigilia_has_capacidades_section(vigilia_page):
    _, body = vigilia_page
    assert "## Capacidades" in body, "vigilia/index.md must contain '## Capacidades'"


def test_vigilia_has_stack_section(vigilia_page):
    _, body = vigilia_page
    assert "## Stack" in body, "vigilia/index.md must contain '## Stack'"


def test_vigilia_stack_public_technologies(vigilia_page):
    _, body = vigilia_page
    for tech in ("Rust", "Python", "PySide6", "ONVIF", "Tailscale"):
        assert tech in body, f"vigilia/index.md stack must mention '{tech}'"


def test_vigilia_grid_cards_syntax(vigilia_page):
    _, body = vigilia_page
    assert '<div class="grid cards" markdown>' in body, (
        "vigilia/index.md must contain Material grid cards syntax"
    )


def test_vigilia_estado_admonition(vigilia_page):
    _, body = vigilia_page
    assert "!!! info" in body, "vigilia/index.md must contain a '!!! info' admonition"
    assert re.search(r"v\d+\.\d+\.\d+", body), (
        "vigilia/index.md estado admonition must include a version (vX.Y.Z)"
    )


# ---------------------------------------------------------------------------
# Phase 8: Vigilia — Outside-In Safety (AC10)
# ---------------------------------------------------------------------------


def test_vigilia_no_proprietary_details(vigilia_page):
    _, body = vigilia_page
    for pattern, label in _PROPRIETARY_PATTERNS:
        assert not re.search(pattern, body), (
            f"vigilia/index.md must not contain {label}"
        )


# ---------------------------------------------------------------------------
# Phase 9: Cross-links (AC12, AC13)
# ---------------------------------------------------------------------------


def test_forge_links_to_laboratorio(forge_page):
    _, body = forge_page
    assert "/laboratorio/" in body, (
        "forge/index.md must link to /laboratorio/"
    )


def test_forge_links_to_showcase(forge_page):
    _, body = forge_page
    assert "forge-showcase" in body, (
        "forge/index.md must link to the forge-showcase repo"
    )


def test_vigilia_links_to_forge(vigilia_page):
    _, body = vigilia_page
    assert "/forge/" in body, (
        "vigilia/index.md must link to /forge/"
    )


def test_vigilia_links_to_showcase(vigilia_page):
    _, body = vigilia_page
    assert "vigilia-reforged-showcase" in body, (
        "vigilia/index.md must link to the vigilia-reforged-showcase repo"
    )


# ---------------------------------------------------------------------------
# Phase 7: Vigilia Edge — SEO Frontmatter (AC4)
# ---------------------------------------------------------------------------


def test_vigilia_edge_frontmatter_title(vigilia_edge_page):
    fm, _ = vigilia_edge_page
    assert fm.get("title") == "Vigilia Edge — Desktop v1.0", (
        "vigilia-edge/index.md must have title 'Vigilia Edge — Desktop v1.0'"
    )


def test_vigilia_edge_frontmatter_description(vigilia_edge_page):
    fm, _ = vigilia_edge_page
    desc = fm.get("description")
    assert desc and len(str(desc).strip()) >= 80, (
        "vigilia-edge/index.md must have a description of at least 80 characters"
    )


# ---------------------------------------------------------------------------
# Phase 7: Vigilia Edge — Content Structure (AC4)
# ---------------------------------------------------------------------------


def test_vigilia_edge_has_que_hace_section(vigilia_edge_page):
    _, body = vigilia_edge_page
    assert "## ¿Qué hace?" in body, (
        "vigilia-edge/index.md must contain '## ¿Qué hace?'"
    )


def test_vigilia_edge_has_stack_section(vigilia_edge_page):
    _, body = vigilia_edge_page
    assert "## Stack Técnico" in body, (
        "vigilia-edge/index.md must contain '## Stack Técnico'"
    )


def test_vigilia_edge_stack_five_rows(vigilia_edge_page):
    _, body = vigilia_edge_page
    for tech in ("PySide6", "ONNX Runtime", "Rust", "Hydra"):
        assert tech in body, (
            f"vigilia-edge/index.md stack must mention '{tech}'"
        )


def test_vigilia_edge_no_internal_architecture_section(vigilia_edge_page):
    _, body = vigilia_edge_page
    assert "## El reto de arquitectura" not in body, (
        "vigilia-edge/index.md must not contain '## El reto de arquitectura' (IP protection)"
    )


def test_vigilia_edge_cta_buttons(vigilia_edge_page):
    _, body = vigilia_edge_page
    assert ".md-button" in body, (
        "vigilia-edge/index.md must contain at least one '.md-button' CTA"
    )
    assert "vigilia-edge-showcase" in body, (
        "vigilia-edge/index.md must link to the vigilia-edge-showcase repo"
    )


# ---------------------------------------------------------------------------
# Phase 7: Vigilia Edge — Outside-In Safety (AC7)
# ---------------------------------------------------------------------------


def test_vigilia_edge_no_proprietary_details(vigilia_edge_page):
    _, body = vigilia_edge_page
    for pattern, label in _PROPRIETARY_PATTERNS:
        assert not re.search(pattern, body), (
            f"vigilia-edge/index.md must not contain {label}"
        )
