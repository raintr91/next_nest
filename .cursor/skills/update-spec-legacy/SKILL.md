---
name: update-spec-legacy
description: >-
  /update-spec-legacy — Patch spec delta with legacy code evidence. Use when
  update-spec needs re-verification from legacy source.
disable-model-invocation: true
---

# /update-spec-legacy — Delta with legacy evidence

Shared extracts: `legacy-config.md`, `legacy-blade-to-api.md`, `spec-update-delta.md`, `agent-discipline.md`

## Scope

Read legacy code only — same boundaries as `/legacy-spec`, but **patch** not full rewrite.

## Workflow

1. Receive delta from `/update-spec` or grill gap (user states what changed).
2. Re-read minimal legacy surface (routes, controllers, views) for that delta only.
3. Patch spec with `inferredFromCode` or new `openQuestions`.
4. Apply same `#update:*` + `specRevision` rules as `/update-spec`.
5. Handoff → `/bqa-grill-docs` or `/dev-grill-docs` per section touched.

## Done

- Delta backed by code evidence or explicit open question.
- No full spec replacement unless user confirms scope explosion.
