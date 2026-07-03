# UNIT HANDOFF — Tạo hotel admin

Generated from `docs/features/admin/hotel/hotel-create.spec.yaml` (profile: **create**, phase: **prototype**).

Prerequisite: `pnpm portal:gen` + `generated/codegen.manifest.json`.

## Test files

- `tests/unit/models/admin-hotel/admin-hotel.schema.test.ts`
- `tests/unit/validations/admin-hotel/schemas.test.ts`
- `tests/unit/composables/admin-hotel/useAdminHotelForm.test.ts`
- `tests/unit/services/admin-hotel.service.create.test.ts`

## Verify

```bash
pnpm exec vitest run tests/unit/models/admin-hotel/admin-hotel.schema.test.ts
```
