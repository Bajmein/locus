#!/usr/bin/env bash
# observe.sh — PostToolUse hook for instinctv2
# Reads JSON from stdin (Claude Code hook format), records observation.
# Usage: observe.sh post

set -euo pipefail

PHASE="${1:-post}"
INSTINCTV2_DIR="${FORGE_CLAUDE_DIR}/instinctv2"
SCRIPTS_DIR="${INSTINCTV2_DIR}/scripts"
CONFIG_FILE="${INSTINCTV2_DIR}/config.json"

# ── Guard 1: disabled flag ────────────────────────────────────────────────────
_clv2_enabled() {
    if [[ -f "${CONFIG_FILE}" ]]; then
        local enabled
        enabled="$(python3 -c "import json,sys; d=json.load(open('${CONFIG_FILE}')); print(d.get('enabled', True))" 2>/dev/null || echo "True")"
        [[ "${enabled}" != "False" && "${enabled}" != "false" ]]
    fi
}
_clv2_enabled || exit 0

# ── Guard 2: skip env flag ────────────────────────────────────────────────────
[[ -n "${ECC_SKIP_OBSERVE:-}" ]] && exit 0

# ── Read stdin ────────────────────────────────────────────────────────────────
INPUT_JSON="$(cat)"
[[ -z "${INPUT_JSON}" ]] && exit 0

# ── Guard 3: only "cli" entrypoint ───────────────────────────────────────────
HOOK_SOURCE="$(printf '%s' "${INPUT_JSON}" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(d.get('hook_event_name', '') or d.get('session', {}).get('source', 'cli'))
" 2>/dev/null || echo "cli")"

# ── Guard 4: skip subagents (they have agent_id or parent_session_id) ────────
IS_SUBAGENT="$(printf '%s' "${INPUT_JSON}" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print('true' if d.get('agent_id') or d.get('session', {}).get('parent_session_id') else 'false')
" 2>/dev/null || echo "false")"
[[ "${IS_SUBAGENT}" == "true" ]] && exit 0

# ── Guard 5: skip minimal profile ────────────────────────────────────────────
PROFILE="$(printf '%s' "${INPUT_JSON}" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(d.get('session', {}).get('profile', ''))
" 2>/dev/null || echo "")"
[[ "${PROFILE}" == "minimal" ]] && exit 0

# ── Detect project ────────────────────────────────────────────────────────────
# shellcheck source=../scripts/detect-project.sh
source "${SCRIPTS_DIR}/detect-project.sh"

OBSERVATIONS_FILE="${_CLV2_PROJECT_DIR}/observations.jsonl"

# ── Build observation with redaction + truncation ────────────────────────────
# Pass JSON via stdin to Python to avoid shell quoting issues with '''
export _CLV2_PHASE="${PHASE}"
export _CLV2_OBS_FILE="${OBSERVATIONS_FILE}"
printf '%s' "${INPUT_JSON}" | python3 -c "
import json, sys, re, os
from datetime import datetime, timezone, timedelta

raw = sys.stdin.read()
try:
    data = json.loads(raw)
except json.JSONDecodeError:
    sys.exit(0)

SECRET_KEYS = re.compile(r'api_key|token|password|secret|credential|auth', re.IGNORECASE)

def redact(obj, depth=0):
    if depth > 10:
        return obj
    if isinstance(obj, dict):
        return {
            k: '[REDACTED]' if SECRET_KEYS.search(k) else redact(v, depth+1)
            for k, v in obj.items()
        }
    if isinstance(obj, list):
        return [redact(i, depth+1) for i in obj]
    if isinstance(obj, str) and len(obj) > 5000:
        return obj[:5000] + '...[truncated]'
    return obj

tool_name = data.get('tool_name', data.get('tool', 'unknown'))
tool_input = redact(data.get('tool_input', data.get('input', {})))
tool_response = data.get('tool_response', data.get('output', ''))
if isinstance(tool_response, str) and len(tool_response) > 5000:
    tool_response = tool_response[:5000] + '...[truncated]'
elif isinstance(tool_response, dict):
    tool_response = redact(tool_response)

phase = os.environ.get('_CLV2_PHASE', 'post')
project_id = os.environ.get('_CLV2_PROJECT_ID', 'unknown')
project_name = os.environ.get('_CLV2_PROJECT_NAME', 'unknown')
obs_file = os.environ.get('_CLV2_OBS_FILE', '')

if not obs_file:
    sys.exit(0)

observation = {
    'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
    'phase': phase,
    'tool': tool_name,
    'project_id': project_id,
    'project_name': project_name,
    'input': tool_input,
    'output_truncated': tool_response,
}

with open(obs_file, 'a') as f:
    f.write(json.dumps(observation) + '\n')

# ── Purge entries older than 30 days ─────────────────────────────────────────
cutoff = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat().replace('+00:00', 'Z')
try:
    with open(obs_file, 'r') as f:
        lines = f.readlines()
    kept = []
    for line in lines:
        try:
            entry = json.loads(line)
            if entry.get('timestamp', '') >= cutoff:
                kept.append(line)
        except:
            pass
    if len(kept) < len(lines):
        with open(obs_file, 'w') as f:
            f.writelines(kept)
except Exception:
    pass

# ── Archive if >10MB ──────────────────────────────────────────────────────────
try:
    size = os.path.getsize(obs_file)
    if size > 10 * 1024 * 1024:
        archive = obs_file + '.' + datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S') + '.archive'
        os.rename(obs_file, archive)
        open(obs_file, 'w').close()
except Exception:
    pass
"

# ── Periodic distillation (every 30 min) ─────────────────────────────────────
_clv2_maybe_distill() {
    local project_dir="${_CLV2_PROJECT_DIR}"
    local project_name="${_CLV2_PROJECT_NAME}"
    local ts_file="${project_dir}/.last_distilled"
    local interval_minutes
    interval_minutes="$(python3 -c "import json; d=json.load(open('${CONFIG_FILE}')); print(d.get('run_interval_minutes', 30))" 2>/dev/null || echo "30")"
    local interval_seconds=$(( interval_minutes * 60 ))

    local now
    now="$(date +%s)"

    local last_distilled=0
    if [[ -f "${ts_file}" ]]; then
        last_distilled="$(python3 -c "
from datetime import datetime, timezone
try:
    ts = open('${ts_file}').read().strip()
    dt = datetime.fromisoformat(ts)
    print(int(dt.timestamp()))
except Exception:
    print(0)
" 2>/dev/null || echo "0")"
    fi

    local elapsed=$(( now - last_distilled ))
    if (( elapsed >= interval_seconds )); then
        python3 "${SCRIPTS_DIR}/distill.py" "${project_dir}" "${project_name}" \
            >> "${project_dir}/distill.log" 2>&1 &
    fi
}

_clv2_maybe_distill

exit 0
