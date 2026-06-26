---
name: legacy-spec
description: >-
  /legacy-spec command for Portal. Use when reverse-engineering existing or
  legacy code into design-phase spec.yaml and testcase YAML without refactoring,
  implementing, migrating, or writing tests.
disable-model-invocation: true
---

# /legacy-spec — Code To Design Spec

Shared extracts: `.cursor/extracts/legacy-config.md`, `legacy-blade-to-api.md`, `spec-split-by-function.md`, `agent-discipline.md`

## Scope

Read/analyze code only. Do not change production code.

Input: `/legacy-spec <module-or-feature>` when source of truth is existing code.

## Workflow

1. Build a compact inventory first; do not read the whole repo.
2. Trace behavior from routes/pages/controllers/jobs/forms/services/models.
3. Extract fields, validations, permissions, UI screens, API contracts, side effects, edge cases.
4. Mark evidence as `inferredFromCode` or `openQuestion`.
5. Write/update `docs/features/{slug}/spec.yaml` per spec-split extract.
6. Draft testcase YAML round 1; run `pnpm docs:render` when supported.
7. Update `.harness/progress.md` when present.

## Evidence Rules

- Trust executable code over comments.
- Preserve legacy field/API names in evidence.
- Do not invent business intent.
- Put runtime/config/data gaps in `openQuestions`.

## Handoff

- Refine or split specs → `/spec`
- Close gaps with user → `/grill-with-docs`
- UI after spec approved → `/prototype`
