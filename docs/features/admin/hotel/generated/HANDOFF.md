# HANDOFF — Tạo hotel admin

Generated from `docs/features/admin/hotel/hotel-create.spec.yaml` (profile: **create**).

## Files

- _No files written._

## Skipped (already exist)

- `composables/admin-hotel/useAdminHotelForm.ts` — exists (use --force)
- `validations/admin-hotel/schemas.ts` — exists (use --force)

## Prototype next (/prototype)

_portal:gen does not emit component code for `#needs-component` / `#needs-ui` — implement molecules in /prototype, then re-run gen._

- **override-shell**: ui.composition.overrideCommonPattern or pattern: custom — implement organism shell in /prototype.
- **open-question**: Create hotel mới có cần tạo tenant schema ngay trong API này hay phase provisioning riêng?

## Commands

```bash
pnpm docs:render
# after spec edits
pnpm portal:gen --spec ... --force  # re-generate after /prototype components
```
