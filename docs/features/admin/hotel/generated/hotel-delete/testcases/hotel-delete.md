# Admin xoá hotel có guard booking

Tính năng: Xoá hotel admin

## Mã yêu cầu

- REQ-HOTEL-DELETE-001

## Route

- Path: `/hotels`
- Auth: `required`

## Test ID

- admin-hotel-list-page
- admin-hotel-delete-action
- admin-hotel-bulk-delete-btn

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
{}
```

## Kịch bản mock

- **delete-allowed** — Hotel chưa có booking: Delete thành công và row biến mất.
- **delete-blocked** — Hotel có booking: Delete action không enable hoặc API trả fail.

## Các bước

1. action: goto, path: /hotels
2. action: click, testId: admin-hotel-delete-action
3. action: confirm, value: `true`

## Assertion

```yaml
ui:
  - testId: admin-hotel-action-success
    contains: 削除
```

## Kết quả mong đợi

- Row có `can_delete=false` không hiện checkbox/delete.
- Bulk delete gửi `arrId` và fail nếu có hotel có booking.
