# Tạo nhanh manager user trong hotel form

Tính năng: Tạo nhanh manager user trong form hotel

## Mã yêu cầu

- REQ-HOTEL-CREATE-MANAGER-001

## Route

- Path: `/hotels/create`
- Auth: `required`

## Test ID

- admin-hotel-create-page
- admin-hotel-add-manager-user-action
- admin-hotel-manager-email-input
- admin-hotel-manager-password-input
- admin-hotel-manager-save-btn

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
email: manager@example.com
password: Abcdef12345!
fullName: Store Manager
address: Tokyo
```

## Kịch bản mock

- **manager-create-success** — Tạo manager thành công: Option mới xuất hiện và được chọn.
- **manager-email-duplicate** — Email trùng: Modal hiển thị error message.

## Các bước

1. action: goto, path: /hotels/create
2. action: click, testId: admin-hotel-add-manager-user-action
3. action: fill, testId: admin-hotel-manager-email-input, valueFrom: data.email
4. action: fill, testId: admin-hotel-manager-password-input, valueFrom: data.password
5. action: click, testId: admin-hotel-manager-save-btn

## Assertion

```yaml
{}
```

## Kết quả mong đợi

- Tạo user thành công thêm option vào `master_user_hotel`.
