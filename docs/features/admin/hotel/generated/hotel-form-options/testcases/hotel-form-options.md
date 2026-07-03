# Form hotel load options phụ trợ

Tính năng: Dữ liệu phụ trợ form hotel

## Mã yêu cầu

- REQ-HOTEL-FORM-OPTIONS-001

## Route

- Path: `/hotels/create`
- Auth: `required`

## Test ID

`#`

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
{}
```

## Kịch bản mock

- **form-options-create** — Create options: Có code mới và user manager chưa gán hotel.
- **form-options-update** — Update options: Include manager đang gán cho hotel hiện tại và selected flag.

## Các bước

1. action: request, method: GET, path: /hotels/form-options

## Assertion

```yaml
{}
```

## Kết quả mong đợi

- Response có `manager_user_options`, `chain_options`, `sms_country_options`, `api_system_options`.
- Create mode có `code` mặc định.
- Japan country option có `required=true`.
