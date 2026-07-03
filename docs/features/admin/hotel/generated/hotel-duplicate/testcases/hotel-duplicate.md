# Admin duplicate hotel

Tính năng: Duplicate hotel admin

## Mã yêu cầu

- REQ-HOTEL-DUPLICATE-001

## Route

- Path: `/hotels/:id`
- Auth: `required`

## Test ID

- admin-hotel-detail-page
- admin-hotel-duplicate-action

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
{}
```

## Kịch bản mock

- **duplicate-success** — Duplicate thành công: Detail mới hiển thị success message và code mới.

## Các bước

1. action: goto, path: /hotels/101
2. action: click, testId: admin-hotel-duplicate-action
3. action: confirm, value: `true`

## Assertion

```yaml
{}
```

## Kết quả mong đợi

- API tạo hotel mới với `code` khác và `property_id=null`.
- UI điều hướng sang `/hotels/{newId}`.
