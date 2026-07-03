# Portal unit test — common baselines & mock rules

> Hub: [`docs/operational/PORTAL-CODEGEN.md`](../../docs/operational/PORTAL-CODEGEN.md)  
> Registry: `shared/portal-unit-test.registry.json` → `commonBaselines`

## Không gen lại per feature

Portal base đã có unit test dùng chung — **không** duplicate qua `portal:unit-gen`:

| Area | File tham chiếu |
|------|-----------------|
| API envelope | `tests/unit/services/apiResponse.test.ts` |
| Zod parse boundary | `tests/unit/services/parseApiData.test.ts` |
| Fetch / redirect | `tests/unit/utils/fetchUtils.test.ts`, `tests/unit/plugins/fetch.test.ts` |
| Form molecules | `tests/unit/molecules/form/*Logic.test.ts` |
| Table / layout | `tests/unit/molecules/layout/dataTableLogic.test.ts` |
| Route guard | `tests/unit/composables/useRouteGuard.test.ts` |

Feature `portal:unit-gen` thêm per feature (list profile, prototype):

| Layer | File | Pattern |
|-------|------|---------|
| models | `tests/unit/models/{entity}/*.schema.test.ts` | `schema.parseListColumns` |
| service | `tests/unit/services/{entity}.service.test.ts` | `service.searchGet` / `searchPost` |
| service export | `tests/unit/services/{entity}.service.export.test.ts` | `service.exportReport` (khi spec có `action: export`) |
| composable | `tests/unit/composables/{entity}/use{Entity}List.test.ts` | `composable.useList` |
| wire delta | `tests/unit/services/{entity}.service.wire.test.ts` | `service.wireDelta` (`--phase wire`) |

Create profile (khi có spec):

| Layer | File | Pattern |
|-------|------|---------|
| validations | `tests/unit/validations/{entity}/schemas.test.ts` | `validation.createRequiredFields` |
| composable form | `tests/unit/composables/{entity}/use{Entity}Form.test.ts` | `composable.useForm` |
| service create | `tests/unit/services/{entity}.service.create.test.ts` | `service.create` |

`defaults.phaseCreate`: `schema`, `validation`, `service`, `composable`.

## Legacy reference (pattern, không copy path)

| Repo | Mẫu |
|------|-----|
| `v2-mairy-admin` | `auth.service.test.ts` — `vi.fn` / `mockApiFetch`, assert `path` + `method` + body/query |
| `v2-mairy-admin` | `user.schema.test.ts` — Zod parse list/detail shapes |
| `v2-mairy-chain` / `v2-mairy-store` | Cùng bộ molecule logic + middleware như portal base |
| `saas-admin-tentant` | `validations/admin/schemas.test.ts` — form rule pass/fail |
| `saas-admin-tentant` | `utils/hotelForm.test.ts` — pure mapper (không HTTP) |

Legacy **store** tests (`hotelListStore`) → Portal dùng composable + service; unit mock **service** hoặc `apiFetch`, không test Pinia internals trừ khi `/unit` gap.

## Mock boundary (`#test-mock:api-fetch`)

| Layer | Mock |
|-------|------|
| **Service** | `mockApiFetch()` inject vào `createXxxService(apiFetch)` — **không** gọi mạng |
| **Composable** | Prototype: mock `{entity}MockSearch`; export: `mockNuxtApiFetch` từ `nuxtGlobals.ts` — không mount page |
| **Model / validation** | Không mock |
| **E2E** | `testcase.setup.mocks` — khác pipeline |

Helper: `tests/unit/_helpers/mockApiFetch.ts`

```ts
const apiFetch = mockApiFetch({ success: true, data: { items: [...], total: 1 } })
await createChainHotelService(apiFetch).search({ page: 1 })
expect(apiFetch).toHaveBeenCalledWith('/hotels', { method: 'GET', query: { page: 1 } })
```

## Sau `portal:unit-gen`

1. `tests/unit/models/{entity}/*.schema.test.ts` — auto
2. `tests/unit/services/{entity}.service.test.ts` — list search
3. `tests/unit/services/{entity}.service.export.test.ts` — khi có export endpoint
4. `tests/unit/composables/{entity}/use{Entity}List.test.ts` — list composable
5. `UNIT-HANDOFF.md` → `#needs-unit-test:*` cho gap (manual composable, wire-only, …)
6. `/unit` chỉ gap; promote registry khi pattern ổn định

## `skip: exists` khi chạy lại

File đã gen lần trước — **không lỗi**. Dùng `--force` để ghi đè hoặc chạy vitest trực tiếp trên file hiện có.
