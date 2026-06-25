---
name: api
description: >-
  /api command for backend API work related to Portal features. Use when creating
  or updating backend endpoints, request validation, resources, permissions, or
  API tests in the configured backend project.
disable-model-invocation: true
---

# /api — Backend API

## Scope

Backend work belongs in the configured backend project, not in Portal frontend
files.

## Before Work

1. Resolve backend project from `team-projects` config.
2. If no backend project is configured, stop and report that cross-repo backend work cannot be performed.
3. Read the feature `spec.yaml` and testcase YAML.
4. Keep API contract field names aligned with Portal `models/`.

## Rules

- Do not implement backend code in the portal workspace.
- Do not modify Portal UI during `/api` unless explicitly requested.
- Produce/update backend endpoints, DTO/request validation, resources, permissions, and backend tests according to the backend repo conventions.
- Report every project read or changed.

## Handoff

Document endpoint paths, payloads, validation errors, permissions, and any contract changes for `/wire`.

