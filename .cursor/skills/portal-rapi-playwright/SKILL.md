---
name: portal-rapi-playwright
description: >-
  Convert Rapi Recorder scripts to Playwright E2E for Portal Base: getByTestId only,
  Page Objects, storageState for non-auth tests, Faker data, random row selection.
  Use when converting Rapi exports, writing E2E from QA recordings, or implementing
  hotel.create.success style specs.
---

# Rapi Recorder → Playwright

**QA rules:** `docs/RAPI-RECORDER-QA.md` · **testId:** `docs/E2E-TESTIDS.md`

**Rule fallback:** `.cursor/rules/portal-rapi-playwright.mdc`

---

## Workflow

1. QA record trên prototype (phase 1.5) → export Rapi script.
2. Dev/AI convert → Playwright TS + Page Object (phase 2.5~3).
3. FE phải có `data-testid` — không convert xpath/css sang production test.

---

## Conversion checklist (bắt buộc)

1. Locator: **`page.getByTestId()`** only — không xpath, css, nth-child selector.
2. **Không login** ngoài `auth.*` — dùng `storageState`.
3. Dữ liệu tĩnh → **Faker** (`@faker-js/faker`).
4. Row cố định → **random row** helper.
5. Mọi UI action qua **Page Object** — spec không gọi `getByTestId` trực tiếp.
6. Map Rapi assertions → Playwright `expect` (xem bảng dưới).
7. Một test case = một file `tests/e2e/{module}/{name}.spec.ts`.
8. Test **độc lập**, **chạy song song** (`fullyParallel`) — không phụ thuộc data test khác.
9. Sau `goto`: `assertLayoutIntegrity` (smoke) khi phù hợp.

---

## Auth rule

### `auth.*` — được login trong test

```text
auth.login.success
auth.logout.success
```

### Mọi testcase khác — `storageState`

```ts
import { test } from '@playwright/test'

test.use({ storageState: 'tests/e2e/storage/admin.json' })

test('hotel.create.success', async ({ page }) => {
  // không login lại
})
```

Tạo `storage/admin.json` bằng global setup hoặc project `setup` chạy `auth.login.success` một lần.

Prototype phase: có thể dùng `mockAuthenticatedSession(page)` từ `tests/e2e/helpers/session.ts` thay `storageState` tạm thời.

---

## Locator rule

```ts
// ✅ Page Object
this.createBtn = page.getByTestId('hotel-create-btn')

// ❌ Spec / Page Object
page.locator('.btn-primary')
page.locator('//button')
page.locator('div:nth-child(3)')
```

Map Rapi target → `data-testid` theo `docs/E2E-TESTIDS.md`. Thiếu testId → **bổ sung FE trước**, không workaround css.

---

## Faker rule

```ts
import { faker } from '@faker-js/faker'

const hotelName = faker.company.name()
const email = faker.internet.email()
const phone = faker.phone.number()
```

Thay mọi literal QA nhập (`Hotel ABC`, `admin@gmail.com`, `0123456789`).

---

## Random row rule

```ts
async clickRandomRow(rows: Locator) {
  const count = await rows.count()
  if (count === 0) throw new Error('No rows')
  const index = Math.floor(Math.random() * count)
  await rows.nth(index).click()
}
```

Không `rows.nth(0)` cố định trừ khi test case tên là `*.first_*` và có mô tả rõ.

---

## Assertion mapping

| Rapi | Playwright |
|------|------------|
| Verify Text | `await expect(locator).toContainText(...)` |
| Verify Visible | `await expect(locator).toBeVisible()` |
| Verify Hidden | `await expect(locator).toBeHidden()` |
| Verify URL | `await expect(page).toHaveURL(...)` |
| Verify Class | `await expect(locator).toHaveClass(...)` |
| Verify CSS | `await expect(locator).toHaveCSS(prop, value)` |
| Verify Attribute | `await expect(locator).toHaveAttribute(name, value)` |
| Enabled / Disabled | `toBeEnabled()` / `toBeDisabled()` |
| Checked | `toBeChecked()` |

---

## Cấu trúc thư mục

```text
tests/e2e/
├── auth/
├── hotel/
├── smtp/
├── pages/              # Page Objects
│   ├── HotelListPage.ts
│   └── HotelFormPage.ts
├── helpers/
│   ├── session.ts
│   ├── assertLayoutIntegrity.ts
│   └── randomRow.ts
└── storage/
    └── admin.json      # storageState
```

**Chi tiết template:** [reference.md](reference.md)
