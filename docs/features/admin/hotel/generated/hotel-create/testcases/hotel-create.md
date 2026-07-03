# Admin tạo hotel thành công

Tính năng: Tạo hotel admin

## Mã yêu cầu

- REQ-HOTEL-CREATE-001
- REQ-HOTEL-CREATE-002

## Route

- Path: `/hotels/create`
- Auth: `required`

## Test ID

- admin-hotel-create-page
- admin-hotel-name-input
- admin-hotel-code-input
- admin-hotel-phone-input
- admin-hotel-address-input
- admin-hotel-save-btn

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
name: MAIRY Sakura Hotel
phone: 03-1234-5678
address: 1-1-1 Mairy Street
```

## Kịch bản mock

- **create-success** — Tạo thành công: API trả id/code và assigned_user_ids.
- **create-validation** — Thiếu required: Inline errors hiển thị tại field name/phone/address.

## Các bước

1. action: goto, path: /hotels/create
2. action: fill, testId: admin-hotel-name-input, valueFrom: data.name
3. action: fill, testId: admin-hotel-phone-input, valueFrom: data.phone
4. action: fill, testId: admin-hotel-address-input, valueFrom: data.address
5. action: click, testId: admin-hotel-save-btn

## Assertion

```yaml
ui:
  - testId: admin-hotel-success-alert
    contains: 保存しました
```

## Kết quả mong đợi

- Mock API nhận payload có legacy keys như `master_user_hotel`, `sms_to_countries`, `api_ids`.
- Sau create, UI hiển thị success và không đổi tên field contract.
