# Xoá hotel admin

- **Testcase:** [Admin xoá hotel có guard booking](./hotel-delete/testcases/hotel-delete.md)
- **Screen:** `#`

Admin xoá một hotel chỉ khi hotel chưa có booking.

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
- id: REQ-HOTEL-DELETE-001
  title: Xoá hotel có guard booking
  description: Hotel chỉ được xoá khi không tồn tại booking; UI ẩn checkbox/delete
    action và backend vẫn phải kiểm tra lại guard.
  priority: must
```

## api

```yaml
endpoints:
  - method: DELETE
    path: /hotels/{id}
    legacyPath: /admin/hotel/delete/{id}
    response:
      success: boolean
      message: string
```

## openQuestions

```yaml
- id: hotel-delete-tenant-resources
  question: Với multiple schema, xoá hotel có xoá schema tenant hay chỉ
    soft-delete metadata và archive schema?
  tag: "#phase-api"
```

## notes

```yaml
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Admin/HotelController.php
    - /home/vutv/workspace/mairy-backend/app/Services/HotelService.php
    - /home/vutv/workspace/mairy-backend/app/Models/Hotel.php
    - /home/vutv/workspace/mairy-backend/public/js/admin/pages/hotel_create.js
  detail: Legacy row delete check booking before delete; service delete wraps
    transaction and calls admin API request service for Scenario Survey cleanup.
- type: scope
  detail: Spec chỉ bao phủ thao tác xoá từ admin hotel management; dữ liệu
    tenant/schema sau xoá sẽ quyết định ở phase API.
```
