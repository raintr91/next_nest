---
name: prototype
description: >-
  /prototype command for Portal UI prototypes. Use after an approved spec to
  build real UI with shadcn and Portal components, real actions and frontend
  logic, mocking only API response data at the service boundary.
disable-model-invocation: true
---

# /prototype — UI Prototype (Mock API Boundary)

Shared extracts: `.cursor/extracts/legacy-config.md`, `legacy-blade-to-api.md`, `common-ui-spec.md`, `agent-discipline.md`, `portal-codegen-tags.md`, `portal-design-registry.md`

Prerequisite: `docs/features/{slug}/*.spec.yaml` **portal-gen-ready** from `/grill-with-docs` (`codegen.profile` present; `pnpm portal:gen:dry` passed).

## Workflow

1. **Đọc inventory từ spec** — `tags:` (`#needs-component`, `#needs-ui`, `#custom-slot`) và `ui.columns` (`render: custom`). Đây là danh sách component chưa có / chưa wire — grill đã ghi tên `Mo*` đề xuất.
2. **Implement component thiếu** — viết molecule/organism (`components/molecules/…`) **trước** khi expect slot wire. `portal:gen` **không** emit stub `.vue` cho `#needs-component`.
3. **Registry (nếu common)** — widget/shell tái sử dụng → `shared/portal-design.registry.json` + `pnpm portal:registry`. Domain-only (vd. `MoManagerHandoffPills`) → *Feature-only*, không promote. Doc: `docs/operational/DESIGN-REGISTRY-PROMOTION.md`.
4. **`pnpm portal:gen --spec ...`** (`--force` nếu chạy lại). Gen scaffold từ registry; slot wire khi file `Mo*` đã tồn tại. HANDOFF *Prototype next* chỉ liệt kê slot còn thiếu.
5. **Sau gen** — auth bypass; `#wire-only` / `#manual-composable` từ HANDOFF; lint/typecheck.

Nếu thiếu `codegen.profile` → quay lại `/grill-with-docs`, **không** sửa spec tay lúc gen.

Nếu `docs:render` lỗi sau gen, member chạy: `pnpm docs:render`.

## Spec edits in prototype phase

- **Không** sửa nghiệp vụ / contract trong `spec.yaml`.
- Chỉ thay đổi phản ánh qua `docs:render` (Screen link, generated markdown) sau khi có page prototype.

## Scope

**In:** `pages/`, `components/`, `composables/`, `mocks/`, `models/` khi cần contract, `data-testid` sớm.

**Out:** viết spec mới → `/spec`; codegen blocks → `/grill-with-docs`; audit demo → `/grill-prototype`; API thật → `/wire`; E2E đầy đủ → `/test`.

## Core Rules

0. **Component trước, gen sau** — `#needs-component` trong spec → implement `Mo*` rồi mới `portal:gen` để wire slot.
1. Real UI, real actions; mock **chỉ** API response tại service/composable.
2. Layers: `models/` → mock service → composables → pages/components (gen emit trừ HANDOFF gap).
3. Reuse shadcn, `Mo*`, `DataListPage`; list: mock ≥2 pages khi có pagination.
4. Dynamic routes: `pages/{module}/[id]/index.vue`, `[id]/edit.vue`.

## Prototype Auth & Routing

- Route `stage` trong registry: mọi stage **trừ `wire`** → auth bypass (`middleware/auth.global.ts`).
- `portal:gen` đăng ký route mới ở `prototype`; re-gen **không hạ** stage nếu đã `test` / `wire`.
- `pnpm portal:lifecycle sync` — quét manifest + kiểm tra page trên disk.
- `pnpm portal:remove --spec <file>` — xóa code gen, hạ về `design-spec`.
- Promote lifecycle: `pnpm portal:lifecycle set /hotels test` hoặc `--force` để hạ stage.

## Handoff

- `data-testid` theo `docs/operational/E2E-TESTIDS.md`.
- `generated/HANDOFF.md` từ gen = slot inventory; **registry promotion** là việc prototype (bước 3), không phải gen.
- Hashtag `#wire-only`, `#manual-composable` → phase sau.
- Cập nhật `.harness/progress.md` khi có.
