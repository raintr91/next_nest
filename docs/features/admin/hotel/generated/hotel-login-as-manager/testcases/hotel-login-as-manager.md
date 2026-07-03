# Admin tạo handoff token theo manager trong hotel list

Tính năng: Admin handoff theo manager hotel

## Mã yêu cầu

- REQ-HOTEL-LOGIN-AS-MANAGER-001

## Route

- Path: `/hotels`
- Auth: `required`

## Test ID

- admin-hotel-list-page
- admin-hotel-login-as-action

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
{}
```

## Kịch bản mock

- **login-as-success** — Tạo handoff token thành công: Action feedback hiển thị token ready hoặc mở URL mock.
- **login-as-failed** — Tạo handoff token lỗi: UI hiển thị error alert và không mở URL.

## Các bước

1. action: goto, path: /hotels
2. action: click, testId: admin-hotel-login-as-action

## Assertion

```yaml
{}
```

## Kết quả mong đợi

- API trả `token`, `user_name`, `hotel_name`, `use_restaurant`, `user_id`, `redirect_url`.
- Admin UI nhận response và thực hiện handoff; không assert UI portal đích.
