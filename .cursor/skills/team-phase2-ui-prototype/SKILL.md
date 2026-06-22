---
name: team-phase2-ui-prototype
description: >-
  /design command UI prototype with mock data for Portal (Nuxt 4). Use when
  building prototype screens, mock data, discovery prototype, or UI before
  backend is ready. No real API calls.
disable-model-invocation: true
---

# /design — UI Prototype (Portal)

**Input:** `docs/features/{slug}/spec.yaml`
**Output:** UI chạy được với mock — **không** `$apiFetch` / service HTTP thật.

## Trước khi code

1. Đọc `docs/features/{slug}/spec.yaml`
2. Load `portal-base` skill (conventions 4 tầng) — **không** load `api-base`
3. Nếu phát hiện requirement đổi, cập nhật trực tiếp `spec.yaml` rồi chạy `pnpm docs:render`

## Thứ tự implement

```
models/{entity}/types.ts     ← từ design (Zod optional, types đủ dùng)
mocks/{entity}.mock.ts       ← fixtures + factory helpers
composables/{entity}/useXxxMock.ts  ← đọc mock, simulate delay/error
pages/... + components/      ← bind composable mock
data-testid                  ← docs/E2E-TESTIDS.md — gắn NGAY
```

## Mock pattern

```ts
// mocks/hotel.mock.ts
export const hotelListMock: Hotel[] = [/* ... */]
export function getHotelMock(id: string) { /* ... */ }

// composables/hotel/useHotelListMock.ts
export function useHotelListMock() {
  const items = ref(hotelListMock)
  const pending = ref(false)
  async function refresh() {
    pending.value = true
    await delay(300)
    pending.value = false
  }
  return { items, pending, refresh }
}
```

## Mock API contract notes

Khi mock đã mô phỏng dữ liệu từ API, thiết kế contract theo hướng dùng lại ở `/wire`:

- Màn detail dùng `getXxxDetail(id)`.
- Màn edit dùng lại `getXxxDetail(id)` để đổ dữ liệu ban đầu vào form.
- Màn duplicate cũng dùng lại `getXxxDetail(id)`, sau đó reset các field cần tạo mới như `id`, `code`, `status`.
- Màn phức tạp có nhiều block entity độc lập hoặc nhiều tab độc lập thì tách API/mock composable theo block.
- Không gom mọi dữ liệu vào một API lớn nếu các block có lifecycle/loading/error riêng.

Example dashboard:

```text
useDashboardSummaryMock()
useDashboardUsersMock()
useDashboardStatsMock()
```

## UI tiers (portal-base)

`components/ui/` → `molecules/Mo*` → `organisms/Data*`

Page ~200 dòng — tách composable + sub-component.

## Mock cases bắt buộc (từ `spec.yaml`)

- [ ] List có data
- [ ] List empty
- [ ] Create success (local state)
- [ ] Validation errors (client-side)
- [ ] Loading state
- [ ] Error state (simulate trong mock composable)

## Không làm trong `/design`

| Cấm | Lý do |
|-----|-------|
| `services/*.service.ts` gọi API | `/wire` |
| `tests/e2e/*.spec.ts` | `/test` |
| Migration / backend | `/api` |

## Verify

```bash
npm run dev          # navigate all screens
npm run lint
npx nuxi typecheck
```

Manual: mọi screen trong `spec.yaml` clickable.

## Handoff `/test`

Cập nhật `feature_list.json` / `progress.md`:
- Routes + testId map cho QA
- Mock cases = testcase YAML draft cho `docs/features/{slug}/testcases/*.yaml`
