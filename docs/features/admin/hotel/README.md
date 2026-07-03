# Admin — Hotel

Specs migrated from `v2-mairy-admin/docs/features/hotel/` (docs only). **Code** gen bằng `portal:gen`, không copy từ legacy repo.

## Portal-gen ready

| Spec | Profile | Command |
|------|---------|---------|
| `hotel-list.spec.yaml` | list | `pnpm portal:gen --spec docs/features/admin/hotel/hotel-list.spec.yaml` |
| `hotel-create.spec.yaml` | create | `pnpm portal:gen --spec docs/features/admin/hotel/hotel-create.spec.yaml` |

**Thứ tự:** gen **list trước** (`--force` nếu đổi columns). Create spec `skip: [models, service, mock]` để không ghi đè list layer; chỉ thêm `validations/` + `useAdminHotelForm`.

```bash
pnpm portal:gen --spec docs/features/admin/hotel/hotel-list.spec.yaml
pnpm portal:gen --spec docs/features/admin/hotel/hotel-create.spec.yaml
pnpm portal:unit-gen --spec docs/features/admin/hotel/hotel-list.spec.yaml
pnpm portal:unit-gen --spec docs/features/admin/hotel/hotel-create.spec.yaml
pnpm test:unit
```

## Khác chain hotel

| | Chain (`docs/features/chain/hotel/`) | Admin (`docs/features/admin/hotel/`) |
|--|--------------------------------------|--------------------------------------|
| Namespace | `chain-hotel` | `admin-hotel` |
| Route list | `/hotels` (chain session) | `/admin/hotels` |
| Scope | List + export + handoff | Full CRUD, analytics, crawl, … |

Các spec khác (`hotel-update`, `hotel-analytics`, …) là tài liệu BA/QA; thêm `codegen:` khi sẵn sàng gen.
