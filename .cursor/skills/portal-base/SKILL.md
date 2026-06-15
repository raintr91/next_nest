---
name: portal-base
description: >-
  Develop Portal Base (Nuxt 4): 4-layer architecture (composables → services →
  stores → models), UI component tiers, data-testid for Playwright E2E, and
  layout integrity checks. Use when adding pages, forms, modules, shared UI,
  E2E specs, or when the user mentions portal base, testId, data-testid, or
  portal conventions.
---

# Portal Base (Nuxt 4)

Auth-first Nuxt 4 portal. Stack: Vue 3, Pinia, vee-validate + Zod, shadcn-vue, Tailwind, Playwright E2E.

**Docs in repo:** `docs/ARCHITECTURE.md`, `docs/E2E-TESTIDS.md`, `README.md`

**Cursor rules (fallback khi tool không load skill):** `.cursor/rules/portal-base-*.mdc`

---

## 1. Layer architecture (bắt buộc)

```
pages / components  →  composables  →  stores (state) + services (HTTP)
                              ↓
                    validations/ (form rules) + models/ (Zod + types)
                              ↓
                    plugins/fetch.ts ($apiFetch)
```

| Tầng | Thư mục | Làm | Không làm |
|------|---------|-----|-----------|
| **UI** | `pages/`, `components/` | Template, bind composable | Gọi `$apiFetch` trực tiếp |
| **Composables** | `composables/` | Form submit, loading, nav, guards | HTTP chi tiết |
| **Services** | `services/` | Endpoint, parse response | Giữ Pinia state |
| **Stores** | `stores/` | Token, user, toast, dialog | Logic HTTP |
| **Models** | `models/` | Zod contract, `z.infer` types | Render UI |
| **Validations** | `validations/` | Form schema (chặt hơn API) | — |

**Import rule:** `models/` không import `stores/`, `services/`, `composables/`.

### Thêm feature mới (thứ tự)

1. `models/{entity}/` — schema + types
2. `services/{entity}.service.ts` — `createXxxService($apiFetch)` + `parseApiData`
3. `stores/{entity}Store.ts` — nếu cần cache UI (optional)
4. `composables/{entity}/useXxxList.ts` hoặc `useXxxForm.ts`
5. `validations/{entity}/schemas.ts` — nếu có form
6. `pages/...` — chỉ orchestration + `testId`

### Form pattern

Dùng `useApiForm` (`composables/forms/useApiForm.ts`): vee-validate + map 422 Laravel → field errors.

```ts
const { onSubmit, errors, apiError, isSubmitting } = useApiForm<LoginRequest>({
  validationSchema: loginSchema,
  initialValues: { email: '', password: '' },
  submit: async (values) => { await auth.login(values) }
})
```

**Hai nguồn Zod (cố ý):**
- `models/` — contract API (lỏng)
- `validations/` — rule form UI (chặt, min length, email…)

---

## 2. UI layout & component tiers

### Cấu trúc component (`nuxt.config` auto-import)

| Tier | Path | Prefix | Ví dụ |
|------|------|--------|-------|
| Primitives | `components/ui/` | shadcn (Button, Input, Dialog…) | `Button`, `Input` |
| Molecules | `components/molecules/` | `Mo` | `MoFormField`, `MoBreadcrumbNav` |
| Organisms | `components/organisms/` | — | `DataPageHeader`, `OrGlobalToast` |

### Naming (tránh legacy domain)

- List/table shell: `Data*` (`DataPageHeader`, `DataPageShell`, `DataResourceTable`)
- Shared state: `Common*` (`useCommonBreadcrumbs`)
- Global shell: `OrGlobal*` (`OrGlobalToast`, `OrGlobalDialog`)

### Page layout chuẩn (module có list/form)

```vue
<DataPageHeader test-id="{module}-page" :title="..." />
<MoBreadcrumbNav test-id="{module}-breadcrumb" :items="..." />
<!-- search / filters -->
<!-- table hoặc form -->
<MoConfirmDialog test-id="{module}-{action}-dialog" />
```

### Middleware & routes (auth-first)

- `middleware/auth.global.ts` — guard protected
- `middleware/guest.ts` — chặn user đã login
- Public: `/auth/login`, `/password/reset` · Protected: `/`

### Legacy (không dùng cho feature mới)

`layouts/themes/*`, `dataTheme/*`, theme demo navbars — cleanup dần, không copy pattern.

---

## 3. `data-testid` — quy tắc (Bước 1 trước E2E)

### Nguyên tắc

1. Mọi element **tương tác** (input, select, radio, button, link, row action) → `data-testid`
2. Element **logic/động** cũng cần: alert, dialog, toast, breadcrumb, menu, page title, label
3. **Không** dùng `id` HTML / class CSS làm selector E2E
4. Gắn ở **shared UI** qua prop `testId` → HTML `data-testid`; page chỉ truyền giá trị
5. Playwright: `page.getByTestId()`; fallback `getByRole` khi semantic rõ

### Naming: `{scope}-{entity}-{action|field}`

kebab-case, **tiếng Anh**. Module scope = mã feature (`customer`, `auth-login`, …).

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Page | `{module}-page` | `customers-page` |
| Title | `{module}-page-title` | `customers-page-title` |
| Input | `{module}-{field}-input` | `auth-login-email-input` |
| Label | `{module}-{field}-label` | `customer-name-label` |
| Error | `{module}-validation-error` | `auth-login-validation-error` |
| Button | `{module}-{action}-btn` | `customer-create-btn` |
| Table | `{module}-table` | `customers-table` |
| Row | `{module}-row` + `data-{entity}-id` | `customer-row` |
| Dialog | `{module}-{action}-dialog` | `customer-delete-dialog` |
| Alert | `{module}-{context}-alert` | `auth-login-error-alert` |
| Breadcrumb | `{module}-breadcrumb` | `customers-breadcrumb` |
| Nav | `nav-{id}` | `nav-customers` |
| App shell | cố định | `app-toast-message`, `app-dialog-confirm-btn` |

**Auth flows:** prefix `auth-{flow}` → `auth-login-*`, `auth-reset-*`

### Prop `testId` — component đã hỗ trợ

| Component | Suffix tự động |
|-----------|----------------|
| `Button`, `Input`, `Label` | trực tiếp |
| `FormField` | `-wrapper`, `-label`, `-error` |
| `DataPageHeader` | `-title`, `-description` |
| `ConfirmDialog` | `-title`, `-content`, `-confirm-btn`, `-cancel-btn` |
| `BreadcrumbNav` | `-item-{n}`, `-link-{n}`, `-current` |
| `DialogContent`, `AlertDialogContent` | panel root |
| `OrGlobalToast` / `OrGlobalDialog` | `app-toast-*`, `app-dialog-*` (cố định) |

Vue template: `test-id="..."` (kebab-case prop).

### Thêm `testId` cho primitive mới

```vue
const props = defineProps<{ testId?: string; /* ... */ }>()
// template:
<input :data-testid="testId" />
```

Hoặc dùng `utils/testId.ts` → `testIdAttr(testId)`, `testIdSuffix(testId, 'label')`.

### Checklist page mới

```
- [ ] {module}-page root
- [ ] title, breadcrumb (nếu có)
- [ ] inputs/selects/buttons có test id
- [ ] alert/dialog/toast ids
- [ ] nav items: nav-{id}
- [ ] Playwright spec + assertLayoutIntegrity sau goto
```

**Reference:** chi tiết bảng + ví dụ → [reference.md](reference.md)

---

## 4. Playwright E2E

```bash
pnpm test:e2e          # port 3005, .nuxt-e2e
pnpm test:e2e:ui
pnpm test:e2e:report
```

- Specs: `tests/e2e/**/*.spec.ts`
- Helpers: `tests/e2e/helpers/session.ts`, `assertLayoutIntegrity.ts`, `layoutIntegrity.ts`
- E2E mode: `NUXT_PUBLIC_E2E=1` → API base = `window.location.origin`

### Layout integrity (gọi sớm sau `goto`)

```ts
import { assertLayoutIntegrity } from './helpers/assertLayoutIntegrity'

await page.goto('/customers')
await assertLayoutIntegrity(page, { skipOverlap: true })
```

Phát hiện: `overflow` (tràn text), `collapsed` (shell rỗng/co), `overlap` (element chồng).

---

## 5. Workflows cho agent

### A. Thêm page/module mới

1. Scaffold 4 tầng (models → service → composable → page)
2. Gắn `testId` theo checklist §3
3. Dùng shared components (`DataPageHeader`, `FormField`, `Button`…) — không duplicate markup
4. Thêm `tests/e2e/{module}.spec.ts` + `assertLayoutIntegrity`
5. Không import legacy theme layouts

### B. Sửa shared UI component

1. Thêm/duy trì prop `testId` nếu component tương tác hoặc mang nội dung assert được
2. Document suffix con (label, error, title…) trong component hoặc `docs/E2E-TESTIDS.md` nếu pattern mới

### C. Review PR portal

- [ ] Không `$apiFetch` trong page/component
- [ ] `models/` không import ngược tầng trên
- [ ] `testId` đủ cho E2E
- [ ] Không selector `input#id` trong spec
- [ ] `assertLayoutIntegrity` trong smoke/functional spec

---

## 6. Lệnh thường dùng

```bash
pnpm dev                    # dev (NUXT_PORT)
pnpm test:unit              # Vitest
pnpm test:e2e               # Playwright
pnpm ui:add button          # shadcn component
pnpm storybook              # UI catalog
```
