#!/usr/bin/env bash
# Cài snapshot rules/skills tham khảo vào local — không cần agent đọc GitHub mỗi session.
# Chạy: bash scripts/install-ai-harness-vendor.sh
set -euo pipefail
WSL_SKILLS="${HOME}/.cursor/skills"
WSL_VENDOR="${HOME}/.cursor/skills-vendor"
WSL_RULES_VENDOR="${HOME}/.cursor/rules-vendor"
WIN_USER="${WIN_USER:-tvvu1}"
WIN_BASE="/mnt/c/Users/${WIN_USER}/.cursor"
WIN_SKILLS="${WIN_BASE}/skills"
WIN_VENDOR="${WIN_BASE}/skills-vendor"
WIN_RULES_VENDOR="${WIN_BASE}/rules-vendor"

REPOS=(
  "https://github.com/obra/superpowers.git|superpowers"
  "https://github.com/multica-ai/andrej-karpathy-skills.git|andrej-karpathy-skills"
  "https://github.com/walkinglabs/learn-harness-engineering.git|learn-harness-engineering"
  "https://github.com/mattpocock/skills.git|mattpocock-skills"
)

clone_or_pull() {
  local url="$1" name="$2" dest="$3"
  if [[ -d "${dest}/.git" ]]; then
    echo "  pull ${name}..."
    git -C "${dest}" pull --ff-only 2>/dev/null || git -C "${dest}" fetch --depth 1 origin main && git -C "${dest}" reset --hard origin/main
  else
    echo "  clone ${name}..."
    git clone --depth 1 "${url}" "${dest}"
  fi
}

install_vendor() {
  local vendor_root="$1"
  mkdir -p "${vendor_root}"
  for entry in "${REPOS[@]}"; do
    IFS='|' read -r url name <<< "${entry}"
    clone_or_pull "${url}" "${name}" "${vendor_root}/${name}"
  done
}

copy_team_skills() {
  local dest_skills="$1"
  local portal_root
  portal_root="$(cd "$(dirname "$0")/.." && pwd)"
  mkdir -p "${dest_skills}"
  for d in "${portal_root}/.cursor/skills"/team-*; do
    [[ -d "$d" ]] || continue
    name="$(basename "$d")"
    rm -rf "${dest_skills}/${name}"
    cp -a "$d" "${dest_skills}/${name}"
  done
  # Global team skills (WSL home)
  for d in "${HOME}/.cursor/skills"/team-*; do
    [[ -d "$d" ]] || continue
    name="$(basename "$d")"
    if [[ ! -d "${dest_skills}/${name}" ]]; then
      cp -a "$d" "${dest_skills}/${name}"
    fi
  done
}

copy_karpathy_rule() {
  local rules_dest="$1"
  local vendor_karpathy="$2/andrej-karpathy-skills/.cursor/rules/karpathy-guidelines.mdc"
  mkdir -p "${rules_dest}"
  if [[ -f "${vendor_karpathy}" ]]; then
    cp "${vendor_karpathy}" "${rules_dest}/karpathy-guidelines.mdc"
  fi
}

write_index() {
  local vendor_root="$1"
  local display_root="$vendor_root"
  if [[ "$vendor_root" == /mnt/c/* ]]; then
    display_root="C:${vendor_root#/mnt/c}"
    display_root="${display_root//\//\\}"
  fi
  cat > "${vendor_root}/INDEX.md" << EOF
# Skills & Rules Vendor (local snapshot)

Cập nhật: $(date -Iseconds)

Agent **đọc file local** — không fetch GitHub khi làm việc.

## Superpowers (obra)

Path: \`${display_root}\\superpowers\\skills\\\`

| Skill | File |
|-------|------|
| brainstorming | \`brainstorming/SKILL.md\` |
| writing-plans | \`writing-plans/SKILL.md\` |
| executing-plans | \`executing-plans/SKILL.md\` |
| verification-before-completion | \`verification-before-completion/SKILL.md\` |
| systematic-debugging | \`systematic-debugging/SKILL.md\` |
| test-driven-development | \`test-driven-development/SKILL.md\` |
| subagent-driven-development | \`subagent-driven-development/SKILL.md\` |
| dispatching-parallel-agents | \`dispatching-parallel-agents/SKILL.md\` |

## Learn Harness Engineering

| Artifact | Path |
|----------|------|
| harness-creator | \`learn-harness-engineering/skills/harness-creator/SKILL.md\` |
| Templates EN | \`learn-harness-engineering/docs/resources/en/\` |

## Karpathy guidelines

| Artifact | Path |
|----------|------|
| Cursor rule | \`..\\rules-vendor\\karpathy-guidelines.mdc\` |
| Skill | \`andrej-karpathy-skills/skills/karpathy-guidelines/SKILL.md\` |

## Matt Pocock (engineering)

Path: \`${display_root}\\mattpocock-skills\\skills\\\`

| Skill | Path |
|-------|------|
| grilling | \`productivity/grilling/SKILL.md\` |
| tdd | \`engineering/tdd/SKILL.md\` |
| diagnosing-bugs | \`engineering/diagnosing-bugs/SKILL.md\` |
| domain-modeling | \`engineering/domain-modeling/SKILL.md\` |
| codebase-design | \`engineering/codebase-design/SKILL.md\` |
| writing-great-skills | \`productivity/writing-great-skills/SKILL.md\` |

## Team 4-phase workflow

| Phase | Skill |
|-------|-------|
| Router | \`~/.cursor/skills/team-harness/SKILL.md\` |
| 1 Design | \`~/.cursor/skills/team-phase1-brainstorm/SKILL.md\` |
| 2 UI mock | \`portal/.cursor/skills/team-phase2-ui-prototype/SKILL.md\` |
| 3a E2E | \`portal/.cursor/skills/team-phase3-e2e/SKILL.md\` |
| 3b API | \`api/.cursor/skills/team-phase3-backend/SKILL.md\` |
| 4 Integrate | \`portal/.cursor/skills/team-phase4-api-integration/SKILL.md\` |

Cập nhật vendor: \`bash portal/scripts/install-ai-harness-vendor.sh\`
EOF
}

echo "==> WSL: ${WSL_VENDOR}"
install_vendor "${WSL_VENDOR}"
copy_team_skills "${WSL_SKILLS}"
copy_karpathy_rule "${WSL_RULES_VENDOR}" "${WSL_VENDOR}"
write_index "${WSL_VENDOR}"

if [[ -d "/mnt/c/Users/${WIN_USER}" ]]; then
  echo "==> Windows: ${WIN_VENDOR}"
  install_vendor "${WIN_VENDOR}"
  copy_team_skills "${WIN_SKILLS}"
  copy_karpathy_rule "${WIN_RULES_VENDOR}" "${WIN_VENDOR}"
  write_index "${WIN_VENDOR}"
  echo "Windows Cursor path: C:\\Users\\${WIN_USER}\\.cursor\\skills-vendor"
else
  echo "WARN: Windows path /mnt/c/Users/${WIN_USER} not found — chỉ cài WSL."
  echo "Set WIN_USER=YourWindowsUsername khi chạy lại."
fi

echo "Done. INDEX: ${WSL_VENDOR}/INDEX.md"
