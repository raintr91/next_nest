# Admin cập nhật crawl setting của hotel

Tính năng: Cấu hình crawler cho hotel

## Mã yêu cầu

- REQ-HOTEL-CRAWL-001

## Route

- Path: `/hotels/:id/crawl-setting`
- Auth: `required`

## Test ID

- admin-hotel-crawl-setting-page
- admin-hotel-crawl-site-controller-select
- admin-hotel-crawl-interval-select
- admin-hotel-crawl-timing-input
- admin-hotel-crawl-save-btn

## Thiết lập

```yaml
session: mockAdminSession
```

## Dữ liệu

```yaml
hotelId: 101
interval: 24
timing: 60
```

## Kịch bản mock

- **crawl-update-success** — Update thành công: Success alert hiển thị.
- **crawl-timing-invalid** — Timing lớn hơn interval: Error message theo rule `timing.lte`.

## Các bước

1. action: goto, path: /hotels/101/crawl-setting
2. action: select, testId: admin-hotel-crawl-interval-select, valueFrom: data.interval
3. action: fill, testId: admin-hotel-crawl-timing-input, valueFrom: data.timing
4. action: click, testId: admin-hotel-crawl-save-btn

## Assertion

```yaml
{}
```

## Kết quả mong đợi

- PUT `/hotels/{id}/crawl-setting` thành công.
- Nếu site controller không phải `neppan`, `login_param` được clear.
