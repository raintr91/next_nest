# Admin handoff theo manager hotel

- **Testcase:** [Admin tạo handoff token theo manager trong hotel list](./hotel-login-as-manager/testcases/hotel-login-as-manager.md)
- **Screen:** `#`

Admin tạo token handoff theo manager user từ hotel list; spec chỉ bao phủ action admin, không mô tả store portal.

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
- name: User
  table: users
- name: Hotel
  table: hotels
```

## requirements

```yaml
- id: REQ-HOTEL-LOGIN-AS-MANAGER-001
  title: Admin tạo handoff token theo manager user
  description: Từ row hotel, admin chọn manager user; API tạo token/handoff
    response để client mở portal đích ngoài scope admin spec.
  priority: must
```

## api

```yaml
endpoints:
  - method: POST
    path: /hotels/managers/{userId}/login-as
    legacyPath: /api/store-login-from-admin/store-login-from-admin/login-from-admin
    request:
      id: number
    response:
      token: string
      user_name: string
      hotel_name: string
      use_restaurant: number|null
      user_id: number
      redirect_url: string
```

## openQuestions

```yaml
- id: hotel-login-as-token-shape
  question: Token mới dùng cùng JWT store auth hay token impersonation riêng có
    claim `admin_id`/audit log?
  tag: "#phase-api"
```

## notes

```yaml
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/resources/views/admin/hotel/index.blade.php
    - /home/vutv/workspace/mairy-backend/routes/API/store_login_from_admin.php
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Api/Auth/StoreAuthController.php
    - /home/vutv/workspace/mairy-backend/app/Http/Resources/API/StoreAuthResource.php
  detail: Legacy admin hotel list page POST AJAX bằng user id, nhận `token`,
    `user_name`, `hotel_name`, `use_restaurant`, `user_id`, rồi mở frontend
    store URL.
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/routes/admin.php
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Admin/HotelController.php
  detail: Legacy cũng còn web route `GET /admin/hotel/login-as-manager/{id}` gọi
    `HotelController::loginAsManager`; UI list hiện tại dùng AJAX token
    `store.from.admin.login`, nên endpoint mới ưu tiên POST token/handoff thay
    vì side-effect GET.
- type: scope
  detail: Giữ trong admin hotel vì action bắt đầu từ `/admin/hotel/list`; phần
    store portal sau handoff không thuộc docs admin.
```
