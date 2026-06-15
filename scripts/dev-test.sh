#!/usr/bin/env bash

if [ -z "${BASH_VERSION:-}" ]; then
  exec bash "$0" "$@"
fi

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

E2E_PORT="${NUXT_E2E_PORT:-3005}"
export NUXT_BUILD_DIR="${NUXT_BUILD_DIR:-.nuxt-e2e}"
unset NUXT_PORT

cd "$ROOT_DIR"
mkdir -p "$ROOT_DIR/$NUXT_BUILD_DIR"
if [ ! -f "$ROOT_DIR/$NUXT_BUILD_DIR/tsconfig.json" ]; then
  NUXT_BUILD_DIR="$NUXT_BUILD_DIR" pnpm exec nuxt prepare
fi
exec pnpm exec nuxt dev --port "$E2E_PORT"
