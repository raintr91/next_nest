---
name: spec
description: >-
  /spec command for Portal feature specs. Use when creating or updating
  spec.yaml, testcase round 1, and rendered docs from a requirement or existing
  spec — without writing prototype UI code.
disable-model-invocation: true
---

# /spec — Feature Spec + Testcase Round 1

Shared extracts (read when relevant): `.cursor/extracts/legacy-config.md`, `legacy-blade-to-api.md`, `common-ui-spec.md`, `spec-split-by-function.md`, `agent-discipline.md`

## Scope

**In:** `docs/features/**` — design v1 `*.spec.yaml`, testcase round 1, `pnpm docs:render`, harness notes.

**Out (handoff):** legacy code analysis → `/legacy-spec`; codegen readiness → `/grill-with-docs`; UI code → `/prototype`.

## Workflow

1. If `spec.yaml` exists, verify gaps: actors, fields, validations, routes, actions, API contracts, edge cases, acceptance.
2. If new, draft from user bullets using `docs/templates/design-spec.yaml`.
3. Apply common UI and spec-split rules from extracts.
4. Draft testcase round 1 aligned with acceptance criteria.
5. Run `pnpm docs:render` after YAML edits.
6. Update `.harness/progress.md` when present.

## Rules

- Do not edit `pages/`, `components/`, `composables/`, `services/`, or production mocks.
- Do not run `portal:gen` — that is `/prototype` after `/grill-with-docs`.
- Do not add `codegen`, `ui.filters`, `ui.columns`, or portal-gen `tags` in round 1.
- Do not run full Playwright/Vitest; deferred to `/prototype`, `/test`, or `/unit`.
- If spec is vague, hand off to `/grill-with-docs` before `/prototype`.
- If source of truth is legacy code without spec, use `/legacy-spec` first, then `/spec` to refine.

## Done

- Design v1 `spec.yaml` and round-1 testcase YAML are coherent.
- Generated Markdown renders via `pnpm docs:render`.
- Open questions recorded in spec, not only in chat.
- Handoff to `/grill-with-docs` for portal-gen-ready enrichment.
