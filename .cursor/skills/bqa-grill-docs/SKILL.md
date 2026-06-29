---
name: bqa-grill-docs
description: >-
  /bqa-grill-docs — BA/QA grill UI on design spec. Use after /spec or /legacy-spec,
  before /dev-grill-docs. No API or codegen.
disable-model-invocation: true
---

# /bqa-grill-docs — BA / QA UI grill

Shared extracts: `grill-docs-roles.md`, `common-ui-spec.md`, `common-delete-flow.md`, `common-breadcrumb-flow.md`, `spec-split-by-function.md`

## Scope

**In:** `requirements`, `ui.screens`, `ui.blocks`, `acceptance`, testcase YAML, UX `openQuestions`.

**Out:** `codegen`, `api` detail, `ui.filters/columns` structured, `portal:gen`, implement UI.

## Workflow

0. **Tech debt step 0** — re-ask `#tech-debt:*` where `deferTo` is `bqa-grill-docs` or `design` (`grill-tech-debt.md`).
1. Read target `*.spec.yaml` + testcase; read `grillStatus.bqa` if present.
2. Ask focused batches (≤5): actions, copy, layout, controls, breadcrumb → page title, delete confirm/result dialogs.
3. Patch spec; reference common delete + breadcrumb rules.
4. Set `grillStatus.bqa: done` when UI intent is locked.
5. User runs `pnpm docs:render` (manual).
6. Handoff → `/dev-grill-docs`.

## BQA checklist

- Header: breadcrumb (menu parent > child > action) **then** page title
- Delete: blocking confirm + result dialog (no toast/inline)
- List: search, toolbar, table, pagination per common list page
- testId intent documented for E2E (names in spec, not code)

## Done

- UI sections coherent for Dev to derive codegen.
- Handoff to `/dev-grill-docs`.
