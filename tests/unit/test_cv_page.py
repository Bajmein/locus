"""Tests for docs/cv.md — CV page with Zero Trust embedded PDF viewer.

Covers: SEO frontmatter (AC1), Zero Trust iframe viewer (AC2),
download button (AC3), and navigation integration (AC4).
"""

from __future__ import annotations

from pathlib import Path

import pytest
import yaml

DOCS_ROOT = Path(__file__).parent.parent.parent / "docs"
MKDOCS_YML = Path(__file__).parent.parent.parent / "mkdocs.yml"


def _parse_page(path: Path) -> tuple[dict, str]:
    """Return (frontmatter_dict, body_text) for a Markdown page with YAML frontmatter."""
    text = path.read_text(encoding="utf-8")
    parts = text.split("---")
    if len(parts) < 3:
        return {}, text
    fm = yaml.safe_load(parts[1]) or {}
    body = "---".join(parts[2:])
    return fm, body


@pytest.fixture
def cv_page() -> tuple[dict, str]:
    return _parse_page(DOCS_ROOT / "cv.md")


# --- AC1: Frontmatter SEO ---


def test_cv_frontmatter_title(cv_page):
    fm, _ = cv_page
    assert fm.get("title"), "cv.md must have a non-empty 'title' in frontmatter"


def test_cv_frontmatter_description(cv_page):
    fm, _ = cv_page
    assert fm.get("description"), "cv.md must have a non-empty 'description' in frontmatter"


# --- AC2: Zero Trust iframe viewer ---


def test_cv_iframe_src_is_local(cv_page):
    _, body = cv_page
    assert 'src="/assets/pdf/cv_benjamin_criado.pdf"' in body, (
        "cv.md must contain an iframe with absolute local src"
    )


def test_cv_iframe_has_fallback(cv_page):
    _, body = cv_page
    assert "<iframe" in body and "<p>" in body, (
        "cv.md must contain an <iframe> with a <p> fallback inside"
    )


def test_cv_pdf_prereq_exists():
    pdf_path = DOCS_ROOT / "assets" / "pdf" / "cv_benjamin_criado.pdf"
    assert pdf_path.exists(), f"PDF prerequisite not found at {pdf_path}"


# --- AC3: Redundant download button removed ---


def test_cv_no_redundant_download_button(cv_page):
    _, body = cv_page
    assert '<div class="grid cards"' not in body, (
        "cv.md must NOT contain the redundant grid cards download button block"
    )


# --- AC4: Navigation integration ---


def _load_mkdocs_yml(path: Path):
    """Load mkdocs.yml tolerating !!python/name tags used by pymdownx."""
    loader = yaml.SafeLoader
    loader.add_multi_constructor(
        "tag:yaml.org,2002:python/name:",
        lambda ldr, tag, node: f"<python:{tag}>",
    )
    return yaml.load(path.read_text(encoding="utf-8"), Loader=loader)  # noqa: S506


def test_cv_in_nav():
    config = _load_mkdocs_yml(MKDOCS_YML)
    nav_values = [
        next(iter(entry.values()))
        for entry in config.get("nav", [])
        if isinstance(entry, dict)
    ]
    assert "cv.md" in nav_values, "mkdocs.yml nav must include an entry pointing to cv.md"


def test_existing_nav_entries_intact():
    config = _load_mkdocs_yml(MKDOCS_YML)
    nav_values = [
        next(iter(entry.values()))
        for entry in config.get("nav", [])
        if isinstance(entry, dict)
    ]
    for expected in ["index.md", "vigilia/index.md", "forge/index.md", "laboratorio/index.md"]:
        assert expected in nav_values, f"Existing nav entry '{expected}' must remain intact"
