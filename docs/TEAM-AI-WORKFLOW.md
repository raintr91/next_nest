# Team AI Workflow — Commands + Harness

Flow phát triển feature với AI agent, tối ưu token bằng **progressive disclosure**: mỗi session chỉ load skill/rule của **một command**.

Docs feature dùng 2 lớp:
- **YAML là source of truth** cho AI/dev: `docs/features/{slug}/spec.yaml` + `testcases/*.yaml`
- **Markdown generated** cho BA/QA review trên VitePress: `docs/features/{slug}/generated/`

Tham khảo (đã **copy local**, không cần đọc GitHub lúc prompt):
- [learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering)
- [superpowers/skills](https://github.com/obra/superpowers/tree/main/skills)
- [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)
- [mattpocock/skills](https://github.com/mattpocock/skills)

---

## Cài đặt (một lần / khi cập nhật vendor)

```bash
cd ~/workspace/portal
bash scripts/install-ai-harness-vendor.sh
```

Script sẽ:
1. Clone shallow 4 repo vào `~/.cursor/skills-vendor/` (WSL)
2. Mirror sang `C:\Users\tvvu1\.cursor\skills-vendor\` (Windows Cursor)
3. Copy team skills + Karpathy rule
4. Tạo `INDEX.md` — bản đồ file local cho agent

**WSL vs Windows:** Cursor trên Windows đọc `C:\Users\<user>\.cursor\`, Cursor trong WSL đọc `~/.cursor/`. Hai path **khác nhau** — chạy script để sync cả hai.

| Môi trường | Vendor INDEX | Team skills |
|------------|--------------|-------------|
| WSL | `~/.cursor/skills-vendor/INDEX.md` | `~/.cursor/skills/team-*` |
| Windows native | `C:\Users\tvvu1\.cursor\skills-vendor\INDEX.md` | `C:\Users\tvvu1\.cursor\skills\team-*` |

Karpathy rule (optional global): `~/.cursor/rules-vendor/karpathy-guidelines.mdc` — copy vào project `.cursor/rules/` nếu muốn `alwaysApply`.

Đổi user Windows: `WIN_USER=YourName bash scripts/install-ai-harness-vendor.sh`

---

## Commands

```
/design ──► /test ──► /wire
   │          │
   │          └── /api (song song)
   ├── /model (khi cần model Zod/type riêng)
   └── /unit  (khi có logic cần unit test)
```

| Command | Ai | Output | Skill (local) |
|-------|-----|--------|---------------|
| `/design` | BA/Dev/FE | Discovery + mock UI + `spec.yaml` + testcase YAML round 1 + generated Markdown | `team-phase1-brainstorm` + `team-phase2-ui-prototype` |
| `/model` | Dev | Zod API schemas + TypeScript types trong `models/` | `portal/.cursor/skills/team-model/` |
| `/test` | QA/Dev | Refined `testcases/*.yaml` + Playwright E2E | `portal/.cursor/skills/team-phase3-e2e/` |
| `/api` | Dev BE | Laravel API | `api/.cursor/skills/team-phase3-backend/` |
| `/wire` | Dev FE | Service/composable thật, bỏ mock | `portal/.cursor/skills/team-phase4-api-integration/` |
| `/unit` | Dev | Vitest unit tests cho logic | `portal/.cursor/skills/team-unit-vitest/` |

**Router:** gõ `/design`, `/model`, `/test`, `/api`, `/wire`, `/unit`, hoặc `@team-harness` → agent đọc `~/.cursor/skills/team-harness/SKILL.md`

Aliases (không dùng trong docs chính nếu không cần): `/prototype` → `/design`, `/e2e` → `/test`, `/backend` → `/api`, `/integrate` → `/wire`.

Render docs cho BA/QA review:

```bash
pnpm docs:render
pnpm docs:dev
```

---

## State files (harness)

Trong `portal/.harness/` (copy từ `*.example.*` khi bắt đầu feature):

| File | Vai trò |
|------|---------|
| `feature_list.json` | Scope machine-readable |
| `progress.md` | Handoff giữa session |

Session lifecycle: `~/.cursor/skills/team-session-lifecycle/SKILL.md`

---

## Rules vs Skills — token budget

### 3 tầng load context

| Tầng | Khi nào vào context | Token/session | Ví dụ |
|------|---------------------|---------------|-------|
| **A — alwaysApply** | Mọi chat | ~40–80 dòng | `portal-base-core`, `api-base-core` |
| **B — globs** | Mở/sửa file match | ~10–15 dòng/rule | `team-flow-phase2-prototype` khi sửa `pages/**` |
| **C — opt-in skill** | User `@skill` hoặc nói phase | 30–90 dòng / 1 skill | `team-harness`, `team-phase1-brainstorm` |

**Team workflow = tầng B + C** — **không** alwaysApply (tránh ~13 dòng/router mỗi session khi sửa bug nhỏ).

### Team rules đã bóc nhỏ (portal)

| Rule | alwaysApply | Globs | ~dòng |
|------|-------------|-------|-------|
| `team-flow-router` | **false** | — | 10 |
| `team-flow-phase1-design` | false | `docs/features/**` | 10 |
| `team-flow-phase2-prototype` | false | `pages,components,composables,mocks/**` | 14 |
| `team-flow-model` | false | `models/**` | 10 |
| `team-flow-phase3-e2e` | false | `tests/e2e/**` | 10 |
| `team-flow-phase4-integration` | false | `services,composables,models/**` | 13 |
| `team-flow-unit` | false | `composables,services,models,validations,utils,stores,tests/unit/**` | 10 |
| `team-flow-harness-state` | false | `.harness/**` | 10 |

### Team rules (api)

| Rule | alwaysApply | Globs |
|------|-------------|-------|
| `team-flow-router` | **false** | — |
| `team-flow-phase3-backend` | false | `src/Modules/**` |

### Vendor upstream (~4000+ dòng tổng)

**Không auto-load.** Chỉ đọc file cụ thể khi phase cần:

```
~/.cursor/skills-vendor/INDEX.md          ← bản đồ (1 file ngắn)
~/.cursor/skills-vendor/superpowers/skills/brainstorming/SKILL.md  ← 1 skill
```

Không đọc cả repo superpowers/matt pocock một lúc.

### Repo conventions (chỉ load khi code)

| Repo | alwaysApply | globs (bổ sung) |
|------|-------------|-----------------|
| portal | `portal-base-core`, `portal-code-size` | `portal-base-e2e`, `portal-component-split`, … |
| api | `api-base-core`, `api-code-size` | `api-base-entity-relationship`, `api-base-http-layer`, … |

Muốn giảm thêm token alwaysApply → có thể chuyển `portal-code-size` / `api-code-size` sang globs (trade-off: agent đôi khi quên ngưỡng 200 dòng).

### Vendor local (không fetch GitHub)

```
~/.cursor/skills-vendor/
  INDEX.md                          ← đọc trước khi cần superpowers/matt pocock
  superpowers/skills/
  learn-harness-engineering/skills/
  andrej-karpathy-skills/
  mattpocock-skills/skills/

~/.cursor/rules-vendor/
  karpathy-guidelines.mdc
```

Phase 1 có thể đọc thêm (local):
- `skills-vendor/superpowers/skills/brainstorming/SKILL.md`
- `skills-vendor/mattpocock-skills/skills/productivity/grilling/SKILL.md`

Phase 3 verify:
- `skills-vendor/superpowers/skills/verification-before-completion/SKILL.md`

---

## Prompt mẫu

**Design + prototype early feedback:**
```
/design tạo chức năng hotel booking gồm list, search, create, validate required.
```

Mock API rule trong `/design`:

- Detail API/mock dùng lại cho detail, edit initial form, duplicate initial form.
- Block/tab entity độc lập thì tách API/mock composable riêng, không gom vào một payload lớn.

**Refine E2E:**
```
/test làm mịn testcase hotel booking, bổ sung empty state, long text, permission denied, semantic level2/3.
```

**Model schemas/types only:**
```
/model thêm model Blog gồm id, title, slug, status draft/published, request create/update
```

**API + wire:**
```
/api implement module Hotel theo spec.yaml
/wire thay mock hotel bằng API thật, chạy E2E green
```

**Unit tests:**
```
/unit bổ sung Vitest cho validation schema và service parser của Hotel
```

**Kết session:**
```
@team-session-lifecycle Cập nhật progress.md và feature_list.json
```

---

## Repo conventions (chỉ load khi code)

| Repo | Skill |
|------|-------|
| portal | `.cursor/skills/portal-base/` |
| portal E2E | `.cursor/skills/portal-rapi-playwright/` |
| api | `api/.cursor/skills/api-base/` |

Không load `portal-base` + `api-base` cùng lúc trừ phase 4.

---

## Cập nhật vendor

```bash
bash ~/workspace/portal/scripts/install-ai-harness-vendor.sh
```

Chạy lại sau khi upstream đổi hoặc ~1 tháng.

---

## Cấu trúc thư mục

```
~/.cursor/
  skills/team-harness/          # router + phase1 + session + karpathy (tóm tắt)
  skills-vendor/                # snapshot upstream
  rules-vendor/karpathy-guidelines.mdc

portal/
  docs/TEAM-AI-WORKFLOW.md      # file này
  docs/features/{slug}/         # spec.yaml + testcases/*.yaml + generated/*.md
  docs/templates/               # spec.yaml + testcase.yaml templates
  docs/schemas/                 # schema cho spec/testcase YAML
  docs/.vitepress/              # local review site
  .harness/                     # state
  .cursor/skills/team-phase*    # /design, /test, /wire portal
  .cursor/skills/team-model/
  .cursor/skills/team-unit-vitest/
  .cursor/rules/team-flow-*.mdc

api/
  .cursor/skills/team-phase3-backend/
  .cursor/rules/team-flow-router.mdc
```
