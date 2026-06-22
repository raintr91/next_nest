---
name: team-phase3-e2e
description: >-
  /test command E2E refinement with Playwright for Portal. Use when QA/dev
  refines testcase YAML, writes E2E tests, Playwright specs, Rapi conversion, or
  test automation parallel to backend work.
disable-model-invocation: true
---

# /test — E2E Refinement (Portal / QA)

Chạy **song song** với `/api` — không block backend.

**Input:** Prototype UI + `data-testid` + `docs/features/{slug}/spec.yaml` + `testcases/*.yaml`
**Extends:** `.cursor/skills/portal-rapi-playwright/` + `docs/E2E-TESTIDS.md`

## Trước khi viết spec

1. Đọc `docs/features/{slug}/spec.yaml` — requirements, routes, permissions
2. Tạo/cập nhật `docs/features/{slug}/testcases/*.yaml` — source of truth cho E2E
3. Chạy `pnpm docs:render` để BA/QA review Markdown generated
4. Kiểm tra testId trên UI (`testcases/*.yaml` + `spec.yaml`)
5. Thiếu testId → **thêm vào component trước**, rồi mới spec

## Cấu trúc

```
tests/e2e/
  pages/{feature}.page.ts      # Page Object
  specs/{feature}/
    list.spec.ts
    create.success.spec.ts
    create.validation.spec.ts
```

## Quy tắc (bắt buộc)

- `page.getByTestId()` only — không CSS/xpath fragile
- E2E scenario phải trace về `docs/features/{slug}/testcases/*.yaml`
- `storageState` cho test không cần login flow
- Faker cho data unique
- Random row khi test list actions

## Chạy với mock (OK trong `/test`)

E2E có thể chạy khi UI còn mock — verify **UI behavior**, không verify API contract.

Stub network nếu cần:
```ts
await page.route('**/api/v1/hotels**', route => route.fulfill({ json: hotelListMock }))
```

## Scenarios tối thiểu

| Scenario | Priority |
|----------|----------|
| List load + pagination | P0 |
| Create happy path | P0 |
| Validation errors | P0 |
| Edit / delete (nếu design có) | P1 |
| Permission denied | P1 |

## Verify

```bash
npx playwright test tests/e2e/specs/{feature}/
```

Green trước khi đánh dấu `/test` done trong `feature_list.json`.

## Handoff `/wire`

Ghi testcase YAML nào dùng mock route → cần sửa khi ghép API thật.

Rapi script → follow `portal-rapi-playwright` skill.
