---
name: dev-grill-docs
description: >-
  /dev-grill-docs — Dev grill API, routes, codegen on design spec. Use after
  /bqa-grill-docs, before /prototype. Adds portal-gen-ready shape.
disable-model-invocation: true
---

# /dev-grill-docs — Dev / codegen grill

Shared extracts: `grill-docs-roles.md`, `portal-codegen-readiness.md`, `portal-codegen-tags.md`, `grill-tech-debt.md`, `spec-update-tags.md`

## Scope

**In:** `ui.routes`, `api`, `entities`, `codegen`, `ui.composition`, `ui.filters`, `ui.columns`, `tags`, tech `openQuestions`.

**Out:** UX copy debates, acceptance prose, implement UI, run full E2E.

## Step 0 — tech debt

Re-ask `openQuestions` where `status: open` and `deferTo` matches `dev-grill-docs`, `prototype`, or `api`. See `grill-tech-debt.md`.

## Workflow

1. Read spec after BQA (`grillStatus.bqa: done` expected).
2. Derive routes, API contract, filter/column mapping from `ui.blocks` / `ui.screens`.
3. Run **Codegen readiness** per `portal-codegen-readiness.md`.
4. Add `tags` (`#shell:`, `#needs-component`, `#wire-only`, `#tech-debt` as needed).
5. Set `grillStatus.dev: done`.
6. **Gate:** `pnpm portal:gen:dry --spec <spec.yaml>` exit 0.
7. User runs `pnpm docs:render` (manual).

## Handoff

- Dry pass → `/prototype`
- BQA↔Dev contradiction → `/grill-with-docs` then dry again
- Spec gap from legacy → `/update-spec-legacy` (not full legacy-spec)

## Done

- `codegen.profile` present; dry-run passes.
- Tech debt tagged or resolved — not left implicit in chat.
