# E2E — Chuẩn hóa `data-testid` (Portal Base)

Tài liệu quy ước gắn **`data-testid`** trên FE và viết Cypress E2E ổn định. Áp dụng **trước khi** viết hoặc mở rộng test E2E cho module/page mới.

> **Quick link:** [README — Cypress](../README.md#cypress-e2e) · Helper: `utils/testId.ts`

---

## Bước 1 — Chuẩn hóa FE: `data-testid` cho E2E

### 1.1 Nguyên tắc

1. **Mọi element tương tác được** (input, select, radio, checkbox, button, link nav, row action, dialog confirm) phải có `data-testid`.
2. **Element mang tính logic / động** cũng cần test id — không chỉ form:
   - Alert / banner lỗi-thành công
   - Dialog / modal (container, title, nội dung, nút confirm/cancel)
   - Toast / snackbar
   - Breadcrumb (nav, từng item, trang hiện tại)
   - Menu / sidebar nav item
   - Page title / heading
   - Label form (khi test cần assert text hoặc liên kết field)
3. **Không dùng `id` HTML** làm selector chính — `id` dễ trùng, thay đổi theo form state, SSR hydration.
4. **Ưu tiên `cy.getByTestId()`** trong test; fallback `cy.contains` / `getByRole` khi semantic rõ (heading `h1`, `role="alert"`).
5. Gắn test id **ở shared UI** (`components/ui/*`, `components/molecules/*`, `components/organisms/*`) qua prop **`testId`** — page chỉ truyền giá trị, không lặp markup.

### 1.2 Quy ước đặt tên

Format: `{scope}-{entity}-{action|field}` — **kebab-case**, **tiếng Anh**.

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Page container | `{module}-page` | `customers-page`, `auth-login-page` |
| Page title | `{module}-title` hoặc `{module}-page-title` | `customers-page-title` |
| Form field input | `{module}-{field}-input` | `auth-login-email-input` |
| Form label | `{module}-{field}-label` | `customer-name-label` |
| Validation error | `{module}-{field}-error` hoặc `{module}-validation-error` | `auth-login-validation-error` |
| Primary action | `{module}-{action}-btn` | `auth-login-submit-btn`, `customer-create-btn` |
| Table | `{module}-table` | `customers-table` |
| Table row | `{module}-row` + `data-{entity}-id` | `customer-row` + `data-customer-id="42"` |
| Dialog container | `{module}-{action}-dialog` | `customer-delete-dialog` |
| Dialog content | `{module}-{action}-dialog-content` | `customer-delete-dialog-content` |
| Alert inline | `{module}-{context}-alert` | `auth-login-error-alert` |
| Breadcrumb nav | `{module}-breadcrumb` | `customers-breadcrumb` |
| Breadcrumb item | `{module}-breadcrumb-item-{n}` | `customers-breadcrumb-item-0` |
| Nav / sidebar item | `nav-{id}` | `nav-customers`, `nav-settings` |
| Toast global | `app-toast`, `app-toast-message` | Cố định app shell |
| Dialog global | `app-dialog`, `app-dialog-confirm-btn` | Cố định app shell |

**Module scope** = mã module/feature (`auth`, `customer`, `coupon`, `chain`, …). Auth dùng prefix `auth-{flow}` (`auth-login`, `auth-reset`).

**Hierarchy ví dụ:**

```text
customers-page                          ← DataPageHeader testId="customers-page"
├── customers-page-title
├── customers-breadcrumb
│   ├── customers-breadcrumb-item-0
│   └── customers-breadcrumb-current
├── customers-search-input
├── customers-create-btn
├── customers-table
│   └── customer-row (×N, data-customer-id)
└── customer-detail-page
    ├── customer-name-label
    ├── customer-name-input
    └── customer-save-btn
```

### 1.3 Prop `testId` trên shared UI

Prop Vue **`testId`** map sang HTML **`data-testid`**. Helper: `utils/testId.ts`.

**Primitives đã hỗ trợ `testId`:**

| Component | Path | Ghi chú |
|-----------|------|---------|
| `Button` | `components/ui/button/Button.vue` | Trực tiếp `data-testid={testId}` |
| `Input` | `components/ui/input/Input.vue` | Trực tiếp trên `<input>` |
| `Label` | `components/ui/label/Label.vue` | Label text |
| `FormField` | `components/molecules/form/FormField.vue` | `{testId}-wrapper`, `-label`, `-error` |
| `DialogContent` | `components/ui/dialog/DialogContent.vue` | Modal panel |
| `AlertDialogContent` | `components/ui/alert-dialog/AlertDialogContent.vue` | Alert dialog panel |
| `ConfirmDialog` | `components/molecules/containment/ConfirmDialog.vue` | `-title`, `-content`, `-confirm-btn`, `-cancel-btn` |
| `BreadcrumbNav` | `components/molecules/navigation/BreadcrumbNav.vue` | `-item-{n}`, `-link-{n}`, `-current` |
| `DataPageHeader` | `components/organisms/data/DataPageHeader.vue` | `-title`, `-description` |
| `AlertDismissible` | `components/molecules/feedback/AlertDismissible.vue` | Alert inline |
| `OrGlobalToast` | `components/organisms/OrGlobalToast.vue` | Cố định `app-toast-*` |
| `OrGlobalDialog` | `components/organisms/OrGlobalDialog.vue` | Cố định `app-dialog-*` |

**Ví dụ page/module:**

```vue
<!-- pages/customers/index.vue -->
<DataPageHeader
  test-id="customers-page"
  :title="t('customers.title')"
>
  <template #actions>
    <Button test-id="customers-create-btn" @click="openCreate">
      {{ t('common.create') }}
    </Button>
  </template>
</DataPageHeader>

<MoBreadcrumbNav :items="breadcrumbs" test-id="customers-breadcrumb" />

<FormField test-id="customer-name" label="Name" :error="errors.name">
  <Input v-model="name" test-id="customer-name-input" />
</FormField>

<MoConfirmDialog
  v-model:open="deleteOpen"
  test-id="customer-delete-dialog"
  title="Delete customer?"
  @confirm="onDelete"
/>
```

**Ví dụ auth login (reference):** `pages/auth/login.vue` — prefix `auth-login-*`.

### 1.4 Checklist khi thêm page mới

- [ ] Root page có `{module}-page`
- [ ] Title / heading có test id
- [ ] Breadcrumb (nếu có) có `{module}-breadcrumb`
- [ ] Mọi input / select / radio / checkbox có `{module}-{field}-input` (hoặc `-select`, `-radio`)
- [ ] Label quan trọng có `-label` (qua `FormField` hoặc `Label`)
- [ ] Mọi button action có `-btn`
- [ ] Alert lỗi API / validation có `-alert` hoặc `-error`
- [ ] Dialog confirm có `-dialog` + nút `-confirm-btn` / `-cancel-btn`
- [ ] Nav item sidebar có `nav-{id}`
- [ ] Cypress spec dùng `cy.getByTestId()`, không `input#email`

---

## Bước 2 — Viết Cypress E2E

### 2.1 Chạy test

```bash
pnpm test:e2e              # tự bật Nuxt port 3005 + Cypress headless
pnpm cypress:open          # UI tương tác (app phải chạy sẵn)
CYPRESS_BASE_URL=http://127.0.0.1:3004 pnpm cypress:run
```

### 2.2 Custom command `getByTestId`

File: `cypress/support/e2e.ts`

```ts
Cypress.Commands.add('getByTestId', (testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable>) => {
  return cy.get(`[data-testid="${testId}"]`, options)
})
```

**Ưu tiên:**

```ts
cy.getByTestId('auth-login-email-input').type('user@example.com')
cy.getByTestId('auth-login-submit-btn').click()
cy.getByTestId('auth-login-error-alert').should('be.visible')
```

**Fallback semantic** (khi không có test id hoặc assert a11y):

```ts
cy.get('[role="alert"]').should('contain', 'Invalid credentials')
cy.get('h1').should('contain', 'Customers')
```

### 2.3 Pattern test file

```ts
describe('Customer list', () => {
  beforeEach(() => {
    cy.visit('/customers')
  })

  it('shows page shell', () => {
    cy.getByTestId('customers-page').should('be.visible')
    cy.getByTestId('customers-page-title').should('contain', 'Customers')
  })

  it('creates a customer', () => {
    cy.getByTestId('customers-create-btn').click()
    cy.getByTestId('customer-name-input').type('Acme')
    cy.getByTestId('customer-save-btn').click()
    cy.getByTestId('app-toast-message').should('contain', 'Created')
  })
})
```

### 2.4 Global toast / dialog trong test

Store `toastStore` / `dialogStore` render qua `OrGlobalToast` / `OrGlobalDialog`:

| Test id | Mục đích |
|---------|----------|
| `app-toast` | Toast container |
| `app-toast-message` | Nội dung message |
| `app-dialog` | Dialog overlay root |
| `app-dialog-title` | Tiêu đề |
| `app-dialog-message` | Nội dung |
| `app-dialog-confirm-btn` | Xác nhận |
| `app-dialog-cancel-btn` | Hủy |

---

## Tài liệu liên quan

- [README.md](../README.md) — setup, Docker, Cypress
- [ARCHITECTURE.md](./ARCHITECTURE.md) — kiến trúc 4 tầng
- `cypress/e2e/login.cy.ts` — ví dụ spec dùng `getByTestId`
- `utils/testId.ts` — helper map prop → attribute
