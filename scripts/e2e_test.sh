#!/usr/bin/env bash

if [ -z "${BASH_VERSION:-}" ]; then
  exec bash "$0" "$@"
fi

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/e2e_test_$(date +%F_%H-%M-%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== e2e_test.sh started at $(date '+%F %T') ==="
echo "Log file: $LOG_FILE"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "FATAL: pnpm is required but not found in PATH."
  exit 1
fi

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

E2E_PORT="${NUXT_E2E_PORT:-3005}"
export NUXT_E2E_PORT="$E2E_PORT"
export NUXT_BUILD_DIR="${NUXT_BUILD_DIR:-.nuxt-e2e}"
export PLAYWRIGHT_BASE_URL="${PLAYWRIGHT_BASE_URL:-http://127.0.0.1:${E2E_PORT}}"
export NUXT_PUBLIC_API_BASE="$PLAYWRIGHT_BASE_URL"
export NUXT_API_BASE_SERVER="$PLAYWRIGHT_BASE_URL"
export NUXT_PUBLIC_E2E=1
unset NUXT_PORT

echo "Base URL: $PLAYWRIGHT_BASE_URL"
echo "E2E port: $E2E_PORT"

mkdir -p "$ROOT_DIR/${NUXT_BUILD_DIR:-.nuxt-e2e}"
if [ ! -f "$ROOT_DIR/${NUXT_BUILD_DIR:-.nuxt-e2e}/tsconfig.json" ]; then
  echo "Preparing Nuxt E2E build dir (${NUXT_BUILD_DIR:-.nuxt-e2e})..."
  NUXT_BUILD_DIR="${NUXT_BUILD_DIR:-.nuxt-e2e}" pnpm exec nuxt prepare
fi

echo ""
echo "--- Playwright E2E tests -> playwright-report/ ---"
rm -rf "$ROOT_DIR/playwright-report" "$ROOT_DIR/test-results"

set +e
pnpm exec playwright test "$@"
PLAYWRIGHT_EXIT=$?
set -e

if [ -f "$ROOT_DIR/playwright-report/index.html" ]; then
  echo ""
  echo "=== Playwright HTML report ==="
  echo "  View:  pnpm test:e2e:report"
  echo "  File:  file://${ROOT_DIR}/playwright-report/index.html"
fi

echo ""
echo "=== e2e_test.sh finished at $(date '+%F %T') ==="
exit "$PLAYWRIGHT_EXIT"
