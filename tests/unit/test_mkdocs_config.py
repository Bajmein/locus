from pathlib import Path

import pytest
import yaml


@pytest.fixture
def mkdocs_config():
    config_path = Path("mkdocs.yml")
    if not config_path.exists():
        pytest.skip("mkdocs.yml not found")
    with open(config_path, encoding="utf-8") as f:
        return yaml.safe_load(f)

@pytest.mark.unit
def test_dark_mode_identity(mkdocs_config):
    """Test Requirement: Dark Mode Identity"""
    assert mkdocs_config.get("theme", {}).get("name") == "material"
    palette = mkdocs_config.get("theme", {}).get("palette", {})
    assert palette.get("scheme") == "slate"
    assert palette.get("primary") == "black"
    assert palette.get("accent") == "cyan"

@pytest.mark.unit
def test_advanced_navigation_ux(mkdocs_config):
    """Test Requirement: Advanced Navigation UX"""
    features = mkdocs_config.get("theme", {}).get("features", [])
    assert "navigation.tabs" in features
    assert "navigation.sections" in features
    assert "navigation.top" in features

@pytest.mark.unit
def test_technical_seo_metadata(mkdocs_config):
    """Test Requirement: Technical SEO Metadata"""
    assert "site_name" in mkdocs_config
    assert "site_author" in mkdocs_config
    assert "site_description" in mkdocs_config

@pytest.mark.unit
def test_social_profile_integration(mkdocs_config):
    """Test Requirement: Social Profile Integration"""
    socials = mkdocs_config.get("extra", {}).get("social", [])
    links = [s.get("link") for s in socials]
    assert "https://github.com/Bajmein" in links
    assert "https://linkedin.com/in/benjamin-criado" in links
