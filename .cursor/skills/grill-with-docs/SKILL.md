---
name: grill-with-docs
description: >-
  /grill-with-docs command for stress-testing generated specs and documenting
  decisions. Use when reviewing a feature spec, finding gaps, sharpening domain
  language, creating open questions, or recording ADR/glossary notes before
  implementation.
disable-model-invocation: true
---

# /grill-with-docs — Spec Interview

Adapted from Matt Pocock grilling: ask hard questions until the spec is unambiguous; update docs as decisions land.

Shared extracts: `.cursor/extracts/legacy-config.md`, `legacy-blade-to-api.md`, `agent-discipline.md`

## Goal

Use after `/spec` or `/legacy-spec`, **before** `/prototype`.

Output: sharper `spec.yaml`, updated testcase YAML, generated Markdown, optional `docs/adr/` or glossary notes.

## Interview Loop

1. Locate target spec/testcase; ask if unclear.
2. Read spec, testcase YAML, generated Markdown, related models/docs.
3. Ask focused batches: actors/permissions, routes/dialogs, fields/validation, API contract shape, loading/empty/error states, list/pagination, testId, destructive flows.
4. Update YAML/docs immediately when user answers.
5. Run `pnpm docs:render` after doc edits.

## Question Style

- Target contradictions and missing decisions.
- Prefer concrete examples over "anything else?"
- Stop when the next step (`/prototype`, `/model`, `/api`) is clear.

## Guardrails

- Do not implement production UI/API.
- Do not rename contract fields for FE convenience.
- Keep one child function per spec file (see `spec-split-by-function.md` extract).
- Coding handoff → `/prototype`, `/model`, `/api`, `/wire`, `/test`, `/unit`.
