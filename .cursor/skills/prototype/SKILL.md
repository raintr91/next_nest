---
name: prototype
description: >-
  /prototype command for Portal UI prototypes. Use after an approved spec to
  build real UI with shadcn and Portal components, real actions and frontend
  logic, mocking only API response data at the service boundary.
disable-model-invocation: true
---

# /prototype — UI Prototype (Mock API Boundary)

Shared extracts: `.cursor/extracts/legacy-config.md`, `legacy-blade-to-api.md`, `common-ui-spec.md`, `agent-discipline.md`, `portal-codegen-tags.md`

Prerequisite: `docs/features/{slug}/*.spec.yaml` **portal-gen-ready** from `/grill-with-docs` (`codegen.profile` present; `pnpm portal:gen:dry` passed).

## Workflow

1. **Quét hashtag component** — đọc `tags:` và `ui.columns` (`render: custom`); chỉ xử lý `#needs-component` / `#custom-slot` / component `Mo*` chưa có trong codebase.
2. **Tạo component nhỏ** — implement **chỉ** molecule/organism thiếu (`components/molecules/` …); **không** hand-write models/service/composable/page (để `portal:gen`).
3. **`pnpm portal:gen --spec docs/features/.../<slug>.spec.yaml`** (`--force` nếu chạy lại). Gen tự gọi `pnpm docs:render` (script local) — Screen trong **generated `.md`** đổi từ `# /path` sang dev URL khi `pages/` đã có.
4. **Sau gen** — auth bypass route; sửa gap trong `generated/HANDOFF.md`; `#wire-only` để `/wire`; scoped lint/typecheck.

Nếu thiếu `codegen.profile` → quay lại `/grill-with-docs`, **không** sửa spec tay lúc gen.

Nếu `docs:render` lỗi sau gen, member chạy: `pnpm docs:render`.

## Spec edits in prototype phase

- **Không** sửa nghiệp vụ / contract trong `spec.yaml`.
- Chỉ thay đổi phản ánh qua `docs:render` (Screen link, generated markdown) sau khi có page prototype.

## Scope

**In:** `pages/`, `components/`, `composables/`, `mocks/`, `models/` khi cần contract, `data-testid` sớm.

**Out:** viết spec mới → `/spec`; codegen blocks → `/grill-with-docs`; audit demo → `/grill-prototype`; API thật → `/wire`; E2E đầy đủ → `/test`.

## Core Rules

0. **portal:gen cho scaffold** — sau bước component nhỏ; không viết lại layer gen đã emit trừ `codegen.skip` / HANDOFF.
1. Real UI, real actions; mock **chỉ** API response tại service/composable.
2. Layers: `models/` → mock service → composables → pages/components.
3. Reuse shadcn, `Mo*`, `DataListPage`; list: mock ≥2 pages khi có pagination.
4. Dynamic routes: `pages/{module}/[id]/index.vue`, `[id]/edit.vue`.

## Prototype Auth & Routing

- Bypass auth/guest/rbac trên route prototype; không redirect login thật.
- Ghi bypass trong handoff cho `/wire`.

## Handoff

- `data-testid` theo `docs/operational/E2E-TESTIDS.md`.
- Hashtag `#wire-only`, `#manual-composable` → HANDOFF / phase sau.
- Cập nhật `.harness/progress.md` khi có.
