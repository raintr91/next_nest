# Admin xoá nhiều hotel từ list

Tính năng: Xoá nhiều hotel admin

## Mã yêu cầu

- REQ-HOTEL-DELETE-MULTIPLE-001

## Route

- Path: `/hotels`
- Auth: `required`

## Test ID

- admin-hotel-list-page
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

- **bulk-delete-success** — Tất cả hotel xoá được: Selected rows biến mất và success alert hiển thị.
- **bulk-delete-blocked** — Có hotel đã có booking: Không row nào bị xoá và hiển thị `message.deleted fail`.

## Các bước

1. action: goto, path: /hotels
2. action: click, testId: admin-hotel-select-101
3. action: click, testId: admin-hotel-bulk-delete-btn
4. action: confirm, value: `true`

## Assertion

```yaml
{}
```

## Kết quả mong đợi

- API nhận `arrId`.
- Nếu mock có hotel blocked bởi booking, UI hiển thị alert fail.
