#!/usr/bin/env bash
# detect-project.sh — Detects current project and exports CLV2 variables
# Source this script: source detect-project.sh
# Exports:
#   _CLV2_PROJECT_ID    — SHA256 12-char hash
#   _CLV2_PROJECT_NAME  — directory basename
#   _CLV2_PROJECT_ROOT  — absolute path
#   _CLV2_PROJECT_DIR   — ~/.claude/homunculus/projects/<hash>/

_CLV2_HOMUNCULUS="${HOME}/.claude/homunculus"
_CLV2_PROJECTS_BASE="${_CLV2_HOMUNCULUS}/projects"

_clv2_detect_project() {
    local project_id=""
    local project_name=""
    local project_root=""

    # Priority 1: explicit env override
    if [[ -n "${CLAUDE_PROJECT_DIR:-}" ]]; then
        project_root="${CLAUDE_PROJECT_DIR}"
        project_name="$(basename "${project_root}")"
        project_id="$(echo -n "explicit:${project_root}" | sha256sum | cut -c1-12)"

    # Priority 2: git remote URL (most stable identifier)
    elif git_root="$(git rev-parse --show-toplevel 2>/dev/null)"; then
        project_root="${git_root}"
        project_name="$(basename "${project_root}")"
        local remote_url
        remote_url="$(git -C "${project_root}" remote get-url origin 2>/dev/null || echo "")"
        if [[ -n "${remote_url}" ]]; then
            project_id="$(echo -n "${remote_url}" | sha256sum | cut -c1-12)"
        else
            # No remote: hash the git root path
            project_id="$(echo -n "local:${project_root}" | sha256sum | cut -c1-12)"
        fi

    # Priority 3: current directory (non-git)
    elif [[ -n "${PWD:-}" ]]; then
        project_root="${PWD}"
        project_name="$(basename "${project_root}")"
        project_id="$(echo -n "dir:${project_root}" | sha256sum | cut -c1-12)"

    # Fallback: global
    else
        project_root="${HOME}"
        project_name="global"
        project_id="global"
    fi

    export _CLV2_PROJECT_ID="${project_id}"
    export _CLV2_PROJECT_NAME="${project_name}"
    export _CLV2_PROJECT_ROOT="${project_root}"
    export _CLV2_PROJECT_DIR="${_CLV2_PROJECTS_BASE}/${project_id}"

    # Create directory structure on first use
    if [[ ! -d "${_CLV2_PROJECT_DIR}" ]]; then
        mkdir -p \
            "${_CLV2_PROJECT_DIR}/instincts/personal" \
            "${_CLV2_PROJECT_DIR}/evolved/skills" \
            "${_CLV2_PROJECT_DIR}/evolved/commands" \
            "${_CLV2_PROJECT_DIR}/evolved/agents"
        touch "${_CLV2_PROJECT_DIR}/observations.jsonl"

        # Write project metadata
        cat > "${_CLV2_PROJECT_DIR}/project.json" <<EOF
{
  "id": "${project_id}",
  "name": "${project_name}",
  "root": "${project_root}",
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    fi
}

_clv2_detect_project
