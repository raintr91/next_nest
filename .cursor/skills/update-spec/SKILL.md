---
name: update-spec
description: >-
  /update-spec — Patch approved spec with controlled deltas and #update:* tags.
  Use after grill-prototype, grill-test, wire gaps, or requirement changes.
disable-model-invocation: true
---

# /update-spec — Controlled spec delta

Shared extracts: `spec-update-delta.md`, `spec-update-tags.md`, `feature-lifecycle-status.md`, `grill-docs-roles.md`

## Scope

**In:** patch `docs/features/**` spec + testcase; emit `#update:*`; bump `specRevision`.

**Out:** full rewrite (`/spec`), legacy re-mine (`/update-spec-legacy`), production code.

## Workflow

1. Identify delta scope (one scenario / block / API field).
2. Patch minimal YAML sections per `spec-update-delta.md`.
3. Emit matching `#update:*` tags; bump `specRevision`.
4. If `featureStatus` was `wire` → `need-update`.
5. Record harness notes when present.
6. User runs `pnpm docs:render` (manual).
7. Follow-up: `portal:gen [--force]`, `/bqa-grill-docs`, `/dev-grill-docs`, `/test`, or `/wire` per matrix.

## Guardrails

- Do not strip legacy evidence or unrelated blocks.
- Do not add `codegen` without Dev alignment — hand off `/dev-grill-docs` for codegen changes.
- Tags cleared only at `/wire` — not during this command.

## Done

- Delta documented in spec + tags.
- Next command obvious from patch type.
