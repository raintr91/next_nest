# Xoá nhiều hotel admin

- **Testcase:** [Admin xoá nhiều hotel từ list](./hotel-delete-multiple/testcases/hotel-delete-multiple.md)
- **Screen:** `#`

Admin xoá nhiều hotel từ list, nhưng backend từ chối toàn bộ nếu bất kỳ hotel đã có booking.

## status

draft

## owner

portal-team

## actors

```yaml
- id: admin
  legacyRoleCode: master
```

## entities

```yaml
- name: Hotel
  table: hotels
- name: Booking
  table: bookings
```

## requirements

```yaml
- id: REQ-HOTEL-DELETE-MULTIPLE-001
  title: Xoá nhiều hotel có guard booking toàn batch
  description: Bulk delete nhận `arrId`; kiểm tra từng hotel trước khi xoá. Nếu có
    hotel `bookingExists()` thì trả fail và không tiếp tục xoá.
  priority: must
```

## api

```yaml
endpoints:
  - method: POST
    path: /hotels/bulk-delete
    legacyPath: /admin/hotel/delete_multi_ajax
    request:
      arrId: number[]
    response:
      success: boolean
      alert: string
```

## openQuestions

```yaml
- id: hotel-delete-multiple-transaction
  question: API mới nên wrap bulk delete trong transaction toàn batch hay giữ
    behavior legacy xoá tuần tự sau khi precheck?
  tag: "#phase-api"
```

## notes

```yaml
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Admin/HotelController.php
    - /home/vutv/workspace/mairy-backend/public/js/admin/pages/hotel_create.js
    - /home/vutv/workspace/mairy-backend/resources/views/admin/hotel/index.blade.php
  detail: Legacy `multiDeleteAjax()` precheck booking cho từng hotel rồi gọi
    `HotelService::delete()` từng id.
- type: scope
  detail: Spec chỉ bao phủ bulk delete từ admin hotel list; không bao phủ xoá dữ
    liệu trong chain/store portal.
```
