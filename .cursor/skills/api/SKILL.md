---
name: api
description: >-
  /api command for backend API work related to Portal features. Use when creating
  or updating backend endpoints, request validation, resources, permissions, or
  API tests in the configured backend project.
disable-model-invocation: true
---

# /api — Backend API

Shared extracts: `.cursor/extracts/legacy-config.md`, `agent-discipline.md`, `verify-gate.md`

## Scope

Backend work in the configured backend project (`api/`) only — not Portal frontend files.

## Backend repo commands

In `api/` workspace (see `api/.cursor/skills/api/SKILL.md`):

| Command | Step |
|---------|------|
| `/api-spec` | Portal spec → backend spec + OpenAPI + mock YAML |
| `/grill-api-spec` | Audit backend contract before code (run in `api/` repo) |
| `/api-code` | Approved backend spec → Laravel implementation |
| `/api` | Router — defaults to spec if no approved backend spec |

Hashtags: `#call-external`, `#cross-entity-service` → `api/.cursor/extracts/`

## Before Work (from Portal)

1. Resolve backend from `team-projects` config; stop if missing.
2. Read feature `spec.yaml` and testcase YAML.
3. Align contract keys with Portal `models/`.

## Rules

- Do not implement backend in the portal workspace.
- Do not modify Portal UI unless explicitly requested.
- Endpoints, validation, resources, permissions, backend tests per backend repo conventions.
- Report every project read or changed.

## Handoff

Document paths, payloads, validation errors, permissions for `/wire`.

**Backend repo pipeline:** `/api-spec` → `/grill-api-spec` → `/api-code` in `api/`. Portal `/grill-api` runs after implementation, before `/wire`.
