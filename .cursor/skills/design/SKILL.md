---
name: design
description: >-
  /design command for Portal feature design and prototype. Use when creating or
  refining a feature spec, checking an existing spec for gaps, optionally reading
  configured legacy code, rendering docs, and building a real UI prototype with
  shadcn-ui/existing Portal components while mocking only API response data.
disable-model-invocation: true
---

# /design — Portal Spec + Prototype

## Goal

Turn a feature request or existing `docs/features/{slug}/spec.yaml` into:

- reviewed `spec.yaml`
- round-1 testcase YAML
- rendered docs
- working prototype built from shadcn-ui + existing Portal components

## Phase Rules

1. If `spec.yaml` exists, verify it first: missing actors, fields, validations, routes, actions, API contracts, edge cases, and acceptance.
2. If legacy config exists, inspect legacy code only when it helps fill spec gaps.
3. Update docs before or alongside prototype changes.
4. Prototype must use real UI, real actions, and real frontend logic.
5. Mock only at the API response boundary. Do not fake UI behavior with disconnected local-only screens.
6. Use existing layers: `models/` → mock API/service boundary → composables → pages/components.
7. Use shadcn-ui primitives and existing `molecules/` / `organisms/`; do not add legacy theme structures.

## Prototype Contract

Good:

- Forms submit through a composable/action.
- Lists refresh through a service-like function.
- Create/edit/delete update via mocked API response data.
- Loading, empty, validation, and error states come from the mocked API boundary.

Bad:

- Hardcoded page-only arrays with no action path.
- Buttons that only change local template text.
- Calling real backend API in `/design`.
- Writing Playwright specs; use `/test`.
- Backend/migration work; use `/api`.

## Required Checks

- Add `data-testid` before handoff.
- Keep files near Portal size rules.
- Run focused lint/typecheck when practical.
- Update `.harness/progress.md` when present.

