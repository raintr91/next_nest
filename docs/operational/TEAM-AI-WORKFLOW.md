# Team AI Workflow — Commands + Harness

> **Slide deck:** [`team-ai-workflow-slides.md`](../onboarding/team-ai-workflow-slides.md) cố ý dùng **`/design`** cho onboarding/training. Operational commands ở doc này: **`/spec`** + **`/prototype`** (không dùng `/design` trong session agent).

Progressive disclosure: **một session = một command**. YAML spec/testcase là source of truth; Markdown generated cho BA/QA review.

Shared snippets (committed, không clone vendor): `.cursor/extracts/`

---

## Commands

### Design lane

```
/legacy-spec ──┐
/spec ─────────┼──► /grill-with-docs ──► /prototype ──► /grill-prototype
               │
               └── (entry tùy nguồn)
```

| Command | Output | Skill |
|---------|--------|-------|
| `/spec` | `spec.yaml`, testcase round 1, `pnpm docs:render` | `.cursor/skills/spec/` |
| `/legacy-spec` | Spec từ code legacy (read-only) | `.cursor/skills/legacy-spec/` |
| `/grill-with-docs` | Hỏi sâu, update YAML/docs/ADR | `.cursor/skills/grill-with-docs/` |
| `/prototype` | UI thật, mock API boundary | `.cursor/skills/prototype/` |
| `/grill-prototype` | Audit prototype trước demo | `.cursor/skills/grill-prototype/` |

`/design` **deprecated** → dùng `/spec` hoặc `/prototype`.

### Implementation lane

```
/prototype ──► /test ──► /wire
   │              │
   ├── /model     └── /api (song song)
   └── /unit
```

| Command | Skill |
|---------|-------|
| `/model` | `.cursor/skills/model/` |
| `/api` | Pointer → `api/` repo: `/api-spec`, `/grill-api-spec`, `/api-code` |
| `/grill-api` | After `/api-code`, check Laravel implementation vs spec (Portal skill) |
| `/wire` | `.cursor/skills/wire/` |
| `/test` | `.cursor/skills/test/` |
| `/grill-test` | `.cursor/skills/grill-test/` |
| `/unit` | `.cursor/skills/unit/` |
| `/grill-unit` | `.cursor/skills/grill-unit/` |

Aliases: `/e2e` → `/test`, `/backend` → `/api`, `/integrate` → `/wire`.

Render docs:

```bash
pnpm docs:render
pnpm docs:dev
```

---

## Extracts (`.cursor/extracts/`)

| File | Dùng khi |
|------|----------|
| `legacy-config.md` | Legacy paths, output language |
| `legacy-blade-to-api.md` | Chuyển Blade/HTML → API + SPA |
| `common-ui-spec.md` | Common UI patterns trong spec/prototype |
| `spec-split-by-function.md` | Một spec = một child function |
| `agent-discipline.md` | Scope, simplicity, surgical edits |
| `verify-gate.md` | Verify trước khi claim done |

Không cài Superpowers/Karpathy/Matt Pocock/Learn Harness clone — nội dung đã rút gọn trong extracts + team skills.

Gỡ vendor cũ (nếu đã chạy script trước đây):

```bash
bash scripts/remove-ai-harness-vendor.sh
```

---

## Harness state

`portal/.harness/` — `feature_list.json`, `progress.md`. Cập nhật sau mỗi command.

---

## Rules vs skills — token budget

| Tầng | Khi nào | Ví dụ |
|------|---------|-------|
| **A — alwaysApply** | Mọi chat | `portal-invariants`, `portal-contract-naming` |
| **B — globs** | Sửa file match | `team-flow-spec`, `team-flow-prototype`, … |
| **C — opt-in skill** | User gõ command | `spec`, `prototype`, `test`, … |

| Rule | alwaysApply | Globs |
|------|-------------|-------|
| `portal-invariants` | **true** | — |
| `portal-contract-naming` | **true** | — |
| `portal-import-alias` | false | app code paths |
| `portal-code-size` | false | pages, composables, … |
| `team-flow-spec` | false | `docs/features/**` |
| `team-flow-prototype` | false | pages, components, composables, mocks |
| `team-flow-model` | false | `models/**` |
| `team-flow-phase3-e2e` | false | `tests/e2e/**` |
| `team-flow-phase4-integration` | false | services, composables, models |
| `team-flow-unit` | false | unit test paths |
| `team-flow-router` | false | opt-in map |

Glob rules chỉ **pointer** tới skill — chi tiết nằm trong skill + extracts.

---

## Prompt mẫu

**Spec mới:**

```
/spec tạo spec hotel list gồm search, pagination, row actions theo common UI.
```

**Legacy → spec:**

```
/legacy-spec admin hotel module từ legacy config.
```

**Grill spec:**

```
/grill-with-docs soi spec admin-hotel-list, hỏi gap permission và empty state.
```

**Prototype:**

```
/prototype dựng page hotel list theo spec admin-hotel-list, mock API 2 page.
```

**Grill prototype:**

```
/grill-prototype check hotel list trước demo cho team.
```

**Backend (trong repo `api/`):** `/api-spec` → `/grill-api-spec` → `/api-code` — xem `api/src/docs/TEAM-AI-BACKEND-WORKFLOW.md`

**Portal:** `/grill-api` sau khi BE code xong, trước `/wire`.

**Model:**

```
/model bổ sung Zod schema + types cho hotel list theo spec admin-hotel-list.
```

**Test / E2E:**

```
/test làm mịn testcase hotel-create-success, sinh Playwright spec scoped.
```

**Wire:**

```
/wire hotel list thay mock bằng API thật, giữ E2E green.
```

**Unit:**

```
/unit Vitest cho hotel validation schema và service parser.
```

---

## Cấu trúc `.cursor/`

```
.cursor/
  extracts/                 # shared snippets (commit)
  skills/
    spec, legacy-spec, grill-with-docs, prototype, grill-prototype
    model, api, grill-api, wire, test, grill-test, unit, grill-unit
    portal-base, portal-rapi-playwright
    design/                 # deprecated pointer only
  rules/
    portal-invariants.mdc
    portal-contract-naming.mdc
    team-flow-*.mdc
  team-projects.example.json
.harness/
docs/features/{slug}/
docs/operational/TEAM-AI-WORKFLOW.md
```
