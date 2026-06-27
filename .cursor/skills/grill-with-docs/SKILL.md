---
name: grill-with-docs
description: >-
  /grill-with-docs command for stress-testing generated specs and documenting
  decisions. Use when reviewing a feature spec, finding gaps, sharpening domain
  language, creating open questions, or recording ADR/glossary notes before
  implementation.
disable-model-invocation: true
---

# /grill-with-docs — Spec Interview + Codegen Readiness

Adapted from Matt Pocock grilling: ask hard questions until the spec is unambiguous; update docs as decisions land.

Shared extracts: `.cursor/extracts/legacy-config.md`, `legacy-blade-to-api.md`, `common-ui-spec.md`, `spec-split-by-function.md`, `agent-discipline.md`, `portal-codegen-tags.md`, `portal-codegen-readiness.md`

## Goal

Use after `/spec` or `/legacy-spec`, **before** `/prototype`.

Output: portal-gen-ready `spec.yaml`, updated testcase YAML, generated Markdown, optional `docs/adr/` or glossary notes.

## Interview Loop

1. Locate target spec/testcase; ask if unclear.
2. Read spec, testcase YAML, generated Markdown, related models/docs, `docs/features/common/*.spec.yaml` when list/form UI.
3. Ask focused batches: actors/permissions, routes/dialogs, fields/validation, API contract shape, loading/empty/error states, list/pagination, testId, destructive flows, common UI vs legacy.
4. Update YAML/docs immediately when user answers.
5. Run **Codegen readiness** (below) before declaring done.
6. Run `pnpm docs:render` after doc edits.

## Codegen readiness (required)

Enrich design v1 → post-grill shape per `portal-codegen-readiness.md` and `docs/templates/spec.yaml`:

1. Add `codegen` (`profile`, `entity`, `module`, `skip`).
2. Add `ui.composition` (usually `DataListPage` for list pages).
3. Add structured `ui.filters` from `api.query` / screen search copy.
4. Add structured `ui.columns` from `api.response` / `importantFields`; `render: custom` where needed.
5. Add `ui.testIds.module` aligned with action testIds.
6. Set `api.endpoints[].action` (`list`, `create`, …).
7. Add `tags:` — `#needs-component`, `#wire-only`, `#skip-codegen`, `#manual-composable`, `#phase-api` as needed.
8. Close or tag remaining `openQuestions`.
9. **Gate:** `pnpm portal:gen:dry --spec <spec.yaml>` must exit 0.

Do **not** hand off to `/prototype` if dry-run fails — fix spec in this session.

## Question Style

- Target contradictions and missing decisions.
- Prefer concrete examples over "anything else?"
- Stop when `portal:gen:dry` passes and `/prototype` steps are clear.

## Guardrails

- Do not implement production UI/API.
- Do not rename contract fields for FE convenience.
- Keep one child function per spec file (see `spec-split-by-function.md` extract).
- Coding handoff → `/prototype`, `/model`, `/api`, `/wire`, `/test`, `/unit`.

## Done

- Spec matches `docs/templates/spec.yaml` (portal-gen-ready).
- `pnpm portal:gen:dry --spec <file>` passes.
- Testcase YAML aligned with acceptance.
- `pnpm docs:render` run.
