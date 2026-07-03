# Admin xem và cập nhật hotel

Tính năng: Xem và cập nhật hotel admin

## Mã yêu cầu

- REQ-HOTEL-UPDATE-001
- REQ-HOTEL-UPDATE-002

## Route

- Path: `/hotels/:id/edit`
- Auth: `required`

## Test ID

- admin-hotel-detail-page
- admin-hotel-edit-link
- admin-hotel-edit-page
- admin-hotel-name-input
- admin-hotel-save-btn

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
hotelId: 101
updatedName: MAIRY Kyoto Updated
```

## Kịch bản mock

- **update-readonly** — Mặc định read-only: Inputs disabled trước khi bấm Edit.
- **update-success** — Update thành công: Success alert hiển thị và data mới được giữ.

## Các bước

1. action: goto, path: /hotels/101
2. action: click, testId: admin-hotel-edit-link
3. action: assert-url, path: /hotels/101/edit
4. action: fill, testId: admin-hotel-name-input, valueFrom: data.updatedName
5. action: click, testId: admin-hotel-save-btn

## Assertion

```yaml
ui:
  - testId: admin-hotel-success-alert
    contains: 保存しました
```

## Kết quả mong đợi

- Detail API fill form trước khi edit.
- Save gọi PUT `/hotels/{id}` với legacy keys.
