# Rapi → Playwright — Reference

Bổ sung [SKILL.md](SKILL.md). Template code đầy đủ.

---

## Page Object — HotelListPage

```ts
// tests/e2e/pages/HotelListPage.ts
import type { Page, Locator } from '@playwright/test'

export class HotelListPage {
  readonly page: Page
  readonly pageRoot: Locator
  readonly createBtn: Locator
  readonly table: Locator
  readonly rows: Locator

  constructor(page: Page) {
    this.page = page
    this.pageRoot = page.getByTestId('hotels-page')
    this.createBtn = page.getByTestId('hotels-create-btn')
    this.table = page.getByTestId('hotels-table')
    this.rows = page.getByTestId('hotel-row')
  }

  async goto() {
    await this.page.goto('/hotels')
  }

  async openCreate() {
    await this.createBtn.click()
  }

  async clickRandomRow() {
    const count = await this.rows.count()
    if (count === 0) throw new Error('No hotel rows')
    const index = Math.floor(Math.random() * count)
    await this.rows.nth(index).click()
  }
}
```

---

## Spec — nghiệp vụ (storageState)

```ts
// tests/e2e/hotel/hotel.create.success.spec.ts
import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { HotelListPage } from '../pages/HotelListPage'
import { HotelFormPage } from '../pages/HotelFormPage'
import { assertLayoutIntegrity } from '../helpers/assertLayoutIntegrity'

test.use({ storageState: 'tests/e2e/storage/admin.json' })

test('hotel.create.success', async ({ page }) => {
  const list = new HotelListPage(page)
  const form = new HotelFormPage(page)
  const name = faker.company.name()

  await list.goto()
  await assertLayoutIntegrity(page)
  await list.openCreate()

  await form.fillName(name)
  await form.submit()

  await expect(page.getByTestId('hotels-success-alert')).toBeVisible()
  await expect(page.getByTestId('hotels-table')).toContainText(name)
})
```

---

## Spec — auth (login trong test)

```ts
// tests/e2e/auth/auth.login.success.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

test('auth.login.success', async ({ page }) => {
  const login = new LoginPage(page)
  await login.goto()
  await login.login(process.env.E2E_ADMIN_EMAIL!, process.env.E2E_ADMIN_PASSWORD!)
  await expect(page.getByTestId('app-dashboard-page')).toBeVisible()
})
```

---

## Global setup — sinh storageState

```ts
// tests/e2e/global-setup.ts
import { chromium, type FullConfig } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL!
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const login = new LoginPage(page)

  await page.goto(baseURL)
  await login.login(process.env.E2E_ADMIN_EMAIL!, process.env.E2E_ADMIN_PASSWORD!)
  await page.context().storageState({ path: 'tests/e2e/storage/admin.json' })
  await browser.close()
}
```

`playwright.config.ts`:

```ts
globalSetup: './tests/e2e/global-setup.ts',
```

---

## randomRow helper

```ts
// tests/e2e/helpers/randomRow.ts
import type { Locator } from '@playwright/test'

export async function clickRandomRow(rows: Locator): Promise<void> {
  const count = await rows.count()
  if (count === 0) throw new Error('clickRandomRow: no rows')
  await rows.nth(Math.floor(Math.random() * count)).click()
}
```

---

## playwright.config — projects auth vs app

```ts
projects: [
  { name: 'setup', testMatch: /global-setup\.ts/ },
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'tests/e2e/storage/admin.json'
    },
    dependencies: ['setup'],
    testIgnore: /auth\//
  },
  {
    name: 'auth',
    use: { ...devices['Desktop Chrome'] },
    testMatch: /auth\/.*\.spec\.ts/
  }
]
```

---

## Convert mapping — Rapi step → Page Object method

| Rapi step (QA mô tả) | Page Object |
|----------------------|-------------|
| Click Create | `list.openCreate()` |
| Fill hotel name | `form.fillName(faker.company.name())` |
| Click Save | `form.submit()` |
| Open first hotel | `list.openFirstRow()` hoặc `clickRandomRow(rows)` |
| Verify success text | `expect(alert).toContainText(...)` trong spec |

---

## AI — khi nhận file Rapi

1. Đọc tên test case → path `tests/e2e/{module}/{name}.spec.ts`.
2. Liệt kê `data-testid` cần có — nếu thiếu, liệt kê FE task trước khi merge spec.
3. Tách Page Object theo màn hình (List, Form, Dialog).
4. Áp checklist SKILL.md § Conversion.
5. Chạy `pnpm test:e2e` — spec phải pass độc lập.
