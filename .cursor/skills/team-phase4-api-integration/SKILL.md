---
name: team-phase4-api-integration
description: >-
  /wire command integrates real backend API into Portal UI, replace mocks with
  services/composables. Use when connecting API, integration, or removing mock
  data after backend is ready.
disable-model-invocation: true
---

# /wire — API Integration (Portal)

**Input:** API staging + `docs/features/{slug}/spec.yaml` contract + `testcases/*.yaml` + E2E specs from `/test`
**Prerequisite:** `/api` endpoints available (ít nhất search/create/update)

## Trước khi bắt đầu

1. Load `portal-base` — 4 tầng bắt buộc
2. **Không** load `api-base` trừ khi sửa cả api repo
3. Đọc `docs/features/{slug}/spec.yaml` + `feature_list.json` — integration items

## Thứ tự (vertical slice)

Mỗi entity, một lượt:

```
1. models/{entity}/     — Zod align response API thật (sample từ staging)
2. services/{entity}.service.ts — createXxxService($apiFetch)
3. composables/         — thay useXxxMock → useXxxList / useXxxForm
4. validations/         — nếu form
5. pages/               — bind composable mới
6. Xóa mock import (hoặc .mock.ts chỉ dùng test)
7. Chạy E2E entity đó
```

## Contract check

So sánh API Resource vs `models/`:
- Field rename → map trong service
- 422 Laravel → `useApiForm` field errors
- Pagination/filter → align Query params api

## Mock cleanup

| File | Action |
|------|--------|
| `useXxxMock.ts` | Delete hoặc move `mocks/` chỉ import trong test |
| `mocks/*.mock.ts` | Giữ cho Playwright stub nếu cần |
| Page import mock | Remove |

## Verify (definition of done)

```bash
npm run lint
npx nuxi typecheck
npx playwright test tests/e2e/specs/{feature}/
```

Manual smoke: create → list shows → edit → delete (theo `spec.yaml`).

## Session scope

**Một entity / một session** — tránh big-bang replace all mocks.

Cập nhật `progress.md`: entity nào đã wired, E2E nào pass/fail.

## Debug integration

Lỗi API → `team-session-lifecycle` verify loop.  
Không sửa backend trong session portal-only — ticket riêng cho api repo.

Systematic debug (local): `~/.cursor/skills-vendor/superpowers/skills/systematic-debugging/SKILL.md`
