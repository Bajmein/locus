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


# --- CI Workflow fixtures ---


@pytest.fixture
def ci_workflow():
    config_path = Path(".github/workflows/ci.yml")
    if not config_path.exists():
        pytest.skip("ci.yml not found")
    with open(config_path, encoding="utf-8") as f:
        return yaml.safe_load(f)


@pytest.fixture
def deploy_workflow():
    config_path = Path(".github/workflows/deploy.yml")
    if not config_path.exists():
        pytest.skip("deploy.yml not found")
    with open(config_path, encoding="utf-8") as f:
        return yaml.safe_load(f)


@pytest.fixture
def coderabbit_config():
    config_path = Path(".coderabbit.yaml")
    if not config_path.exists():
        pytest.skip(".coderabbit.yaml not found")
    with open(config_path, encoding="utf-8") as f:
        return yaml.safe_load(f)


# --- Phase 2: Foundational ---


@pytest.mark.unit
def test_ci_workflow_exists(ci_workflow):
    """T003 [AC1] ci.yml exists and parses as valid YAML"""
    assert ci_workflow is not None


@pytest.mark.unit
def test_ci_workflow_trigger(ci_workflow):
    """T004 [AC1] ci.yml triggers on pull_request to main"""
    # PyYAML parses `on:` as boolean True (YAML 1.1)
    trigger = ci_workflow[True]
    branches = trigger["pull_request"]["branches"]
    assert "main" in branches


# --- Phase 3: PR Validation Pipeline ---


@pytest.mark.unit
def test_ci_setup_uv_cache_enabled(ci_workflow):
    """T006 [AC1] setup-uv step has enable-cache: true"""
    steps = ci_workflow["jobs"]["verify-docs"]["steps"]
    uv_step = next(s for s in steps if "astral-sh/setup-uv" in s.get("uses", ""))
    assert uv_step["with"]["enable-cache"] is True


@pytest.mark.unit
def test_ci_python_version(ci_workflow):
    """T007 [AC1] python-version is 3.14 (parity with deploy.yml)"""
    steps = ci_workflow["jobs"]["verify-docs"]["steps"]
    python_step = next(s for s in steps if "setup-python" in s.get("uses", ""))
    assert python_step["with"]["python-version"] == "3.14"


@pytest.mark.unit
def test_ci_sync_all_groups(ci_workflow):
    """T008 [AC1] uv sync uses --all-groups"""
    steps = ci_workflow["jobs"]["verify-docs"]["steps"]
    run_commands = [s.get("run", "") for s in steps]
    assert any("uv sync --all-groups" in cmd for cmd in run_commands)


@pytest.mark.unit
def test_ci_build_step_strict(ci_workflow):
    """T009 [AC1] mkdocs build uses --strict flag"""
    steps = ci_workflow["jobs"]["verify-docs"]["steps"]
    run_commands = [s.get("run", "") for s in steps]
    assert any("uv run mkdocs build --strict" in cmd for cmd in run_commands)


# --- Phase 4: CI Concurrency Control ---


@pytest.mark.unit
def test_ci_concurrency_group(ci_workflow):
    """T011 [AC2] concurrency.group references github.workflow and github.head_ref"""
    group = ci_workflow["concurrency"]["group"]
    assert "github.workflow" in group
    assert "github.head_ref" in group


@pytest.mark.unit
def test_ci_concurrency_cancel_in_progress(ci_workflow):
    """T012 [AC2] cancel-in-progress is true"""
    assert ci_workflow["concurrency"]["cancel-in-progress"] is True


# --- Phase 5: CodeRabbit Assertive Review ---


@pytest.mark.unit
def test_coderabbit_language(coderabbit_config):
    """T014 [AC3] language is es-ES"""
    assert coderabbit_config["language"] == "es-ES"


@pytest.mark.unit
def test_coderabbit_review_profile(coderabbit_config):
    """T015 [AC3] reviews.profile is assertive"""
    assert coderabbit_config["reviews"]["profile"] == "assertive"


@pytest.mark.unit
def test_coderabbit_request_changes_workflow(coderabbit_config):
    """T016 [AC3] reviews.request_changes_workflow is true"""
    assert coderabbit_config["reviews"]["request_changes_workflow"] is True


@pytest.mark.unit
def test_coderabbit_high_level_summary(coderabbit_config):
    """T017 [AC3] reviews.high_level_summary is true"""
    assert coderabbit_config["reviews"]["high_level_summary"] is True


@pytest.mark.unit
def test_coderabbit_no_poem(coderabbit_config):
    """T018 [AC3] reviews.poem is false"""
    assert coderabbit_config["reviews"]["poem"] is False


@pytest.mark.unit
def test_coderabbit_auto_review_no_drafts(coderabbit_config):
    """T019 [AC3] auto_review enabled, drafts excluded"""
    auto_review = coderabbit_config["reviews"]["auto_review"]
    assert auto_review["enabled"] is True
    assert auto_review["drafts"] is False


# --- Phase 6: CodeRabbit Path Filtering ---


@pytest.mark.unit
def test_coderabbit_path_filters(coderabbit_config):
    """T021 [AC4] path_filters excludes site/**, uv.lock, *.png, *.jpg"""
    filters = coderabbit_config["reviews"]["path_filters"]
    assert "!site/**" in filters
    assert "!uv.lock" in filters
    assert "!**/*.png" in filters
    assert "!**/*.jpg" in filters


# --- Phase 7: CI and Deploy Separation ---


@pytest.mark.unit
def test_ci_trigger_is_pull_request_only(ci_workflow):
    """T023 [AC5] ci.yml does not have a push trigger"""
    # PyYAML parses `on:` as boolean True (YAML 1.1)
    assert "push" not in ci_workflow[True]


@pytest.mark.unit
def test_deploy_trigger_is_push_only(deploy_workflow):
    """T024 [AC5] deploy.yml does not have a pull_request trigger"""
    # PyYAML parses `on:` as boolean True (YAML 1.1)
    assert "pull_request" not in deploy_workflow[True]


@pytest.mark.unit
def test_ci_no_deploy_steps(ci_workflow):
    """T025 [AC5] ci.yml contains no deployment-related steps"""
    deploy_actions = {"upload-pages-artifact", "deploy-pages", "gh-deploy"}
    steps = ci_workflow["jobs"]["verify-docs"]["steps"]
    uses_values = [s.get("uses", "") for s in steps]
    run_values = [s.get("run", "") for s in steps]
    for action in deploy_actions:
        assert not any(action in u for u in uses_values)
        assert not any(action in r for r in run_values)
