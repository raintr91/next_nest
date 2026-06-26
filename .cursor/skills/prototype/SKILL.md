---
name: prototype
description: >-
  /prototype command for Portal UI prototypes. Use after an approved spec to
  build real UI with shadcn and Portal components, real actions and frontend
  logic, mocking only API response data at the service boundary.
disable-model-invocation: true
---

# /prototype — UI Prototype (Mock API Boundary)

Shared extracts: `.cursor/extracts/legacy-config.md`, `legacy-blade-to-api.md`, `common-ui-spec.md`, `agent-discipline.md`

Prerequisite: approved `docs/features/{slug}/spec.yaml` (from `/spec`, `/legacy-spec`, or `/grill-with-docs`).

## Scope

**In:** `pages/`, `components/`, `composables/`, `mocks/`, `models/` when needed for contract, early `data-testid`.

**Out:** new spec writing (only fix gaps as `openQuestions` in YAML) → `/spec`; spec interview → `/grill-with-docs`; pre-demo audit → `/grill-prototype`; real API → `/wire`.

## Core Rules

1. Real UI, real actions, real frontend logic; mock **only** API response data at service/composable boundary.
2. Layers: `models/` → mock service boundary → composables → pages/components.
3. Reuse shadcn-ui, existing `molecules/` / `organisms/`; inspect nearby pages for density and patterns.
4. Prefer real target route; throwaway prototype route only when no host page exists.
5. List/table pages: check `components/organisms/DataListPage.vue` first; mock ≥2 pages when pagination exists.
6. Dynamic routes: `pages/{module}/[id]/index.vue` (detail), `[id]/edit.vue` (edit) — not `pages/{module}/[id].vue`.

## Prototype Auth & Routing

- Bypass auth/guest/rbac middleware on prototype routes; no redirect to `/auth/login?redirect=...`.
- No real login/logout/me/backend; mock session/permission when UI needs context.
- Document bypassed routes in handoff for `/wire` to restore guards.

## Codebase Design

- Page orchestration only; logic behind composable/service-like interfaces deep enough for `/unit` and `/test`.
- Avoid pass-through composables; add adapter/seam only when mock + production API both exist.

## Smoke Test Policy

- No full E2E/unit in this phase; optional smoke skeleton (happy path, key validation) left unrun for `/test` or `/unit`.
- Fix render/runtime errors before expanding tests.
- Scoped lint/typecheck when cheap.

## Handoff

- Add `data-testid` per `docs/operational/E2E-TESTIDS.md`.
- Keep files near Portal size rules.
- Before demo of complex flows, use `/grill-prototype`.
- Update `.harness/progress.md` when present.
