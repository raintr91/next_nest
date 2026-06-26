---
name: grill-api
description: >-
  /grill-api command for checking whether backend API implementation is complete after
  /api-code in the api repo. Use to verify endpoints, contracts vs FE models,
  frontend models, auth/permission/validation/error behavior is covered, and the
  handoff is ready for /wire.
disable-model-invocation: true
---

# /grill-api — API Implementation Check (Portal)

After backend `/api-code` in `api/` repo, before Portal `/wire`.

For **contract YAML** audit before coding, use `/grill-api-spec` in `api/` repo (not this command).

Shared extract: `.cursor/extracts/legacy-blade-to-api.md`

## Checklist

- Endpoints cover spec actions (CRUD/import/export/login-as/etc.).
- No legacy page-init APIs; create/login SPA-init; detail API for edit/copy.
- Request/response keys, relationships, pagination match FE `models/`.
- Validation, permission, error shapes documented for `/wire`.
- Backend test or verification status recorded.

## Guardrails

- No Portal UI edits; no contract renames for FE convenience.
- No "complete" without backend evidence.
