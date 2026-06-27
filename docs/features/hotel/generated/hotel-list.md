# Danh sách hotel admin

- **Testcase:** [View hotel list](./hotel-list/testcases/hotel-list.md)
- **Screen:** `/admin/hotels` (dev `http://localhost:3000/admin/hotels`) · `hotels-page`

Admin xem, tìm kiếm, sort và phân trang metadata hotel theo legacy `/admin/hotel/list`.

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
  importantFields:
    - id
    - name
    - code
    - phone
    - chain_id
    - activate_status
    - status
    - created_at
- name: User
  table: users
  importantFields:
    - id
    - full_name
    - hotel_id
```

## relationships

```yaml
- from: hotels.chain_id
  to: chains.id
  type: many-to-one
- from: users.hotel_id
  to: hotels.id
  type: one-to-many
```

## requirements

```yaml
- id: REQ-HOTEL-LIST-001
  title: Admin tìm kiếm danh sách hotel
  description: Danh sách hỗ trợ filter `created_at`, `name`, `code`, `chain_name`,
    `activate_status`; sort theo `name` hoặc `created_at`; mặc định
    `order_by=created_at`, `sorted_by=desc`, `per_page=100`.
  priority: must
- id: REQ-HOTEL-LIST-002
  title: Admin thấy action theo từng row
  description: Row hiển thị admin handoff theo từng manager, link crawl setting,
    view/edit và delete nếu hotel chưa có booking.
  priority: must
```

## ui

```yaml
routes:
  - path: /admin/hotels
    legacyPath: /admin/hotel/list
    pageTestId: hotels-page
screens:
  - name: Hotel list
    layout:
      - Search card gồm `created_at`, `name`, `code`, `chain_name`,
        `activate_status`, nút search outline primary và nút clear outline xám
        căn giữa.
      - Toolbar tổng nằm tách riêng bên dưới search form, không bọc card/border
        riêng; thứ tự từ trái qua phải là button tổng số record, nút thêm mới
        `新規作成`, nút xoá nhiều `削除する`, chọn số record mỗi trang.
      - Table gồm checkbox, ID, hotel name + phone, hotel code, chain name như
        metadata quan hệ, created_at, admin handoff theo manager, crawl setting
        icon-only, actions icon-only.
    actions:
      - id: total
        text: 合計
        variant: primary
        position: toolbar extra-actions leftmost
        behavior: button-style readonly, không click, hiển thị text và số trên cùng nền
          button, không dùng badge bo riêng
        testId: admin-hotel-total-btn
      - id: create
        text: 新規作成
        icon: Plus
        variant: complete
        position: toolbar extra-actions left, trước bulk delete
        testId: admin-hotel-create-btn
      - id: bulk-delete
        text: 削除する
        icon: Trash2
        variant: destructive
        position: toolbar extra-actions sau create
        testId: admin-hotel-bulk-delete-btn
      - id: login-as-manager
        text: manager full_name
        icon: LogIn
        variant: info pill
        position: table column Login
        testId: admin-hotel-login-as-action
      - id: crawl-setting
        text: icon-only
        icon: Settings
        variant: outline
        position: table column Crawl setting
        testIdPattern: admin-hotel-crawl-{id}
      - id: detail
        text: icon-only
        icon: Eye
        variant: ghost
        position: table actions column
        testIdPattern: admin-hotel-view-{id}
      - id: delete
        text: icon-only
        icon: Trash2
        variant: destructive-ghost
        position: table actions column, chỉ khi `can_delete=true`
        testIdPattern: admin-hotel-delete-{id}
```

## api

```yaml
endpoints:
  - method: GET
    path: /hotels
    legacyPath: /admin/hotel/list
    query:
      created_at: string|null
      name: string|null
      code: string|null
      chain_name: string|null
      activate_status: number|string|null
      status: number|all|null
      order_by: name|created_at
      sorted_by: asc|desc
      per_page: number
    response:
      data:
        - id: number
          name: string
          phone: string|null
          code: string
          chain:
            id: number|null
            name: string|null
          created_at: string
          managers:
            - id: number
              full_name: string|null
              email: string
          can_delete: boolean
          crawl_setting_url: string
      meta:
        total: number
        current_page: number
        per_page: number
```

## openQuestions

```yaml
- id: hotel-list-tenant-schema
  question: Khi phase API triển khai multiple schema, danh sách admin lấy metadata
    hotel từ schema trung tâm hay cần trạng thái đồng bộ với schema tenant?
  tag: "#phase-api"
```

## notes

```yaml
- type: inferredFromCode
  evidence:
    - mairy-backend/routes/admin.php
    - mairy-backend/app/Http/Controllers/Admin/HotelController.php
    - mairy-backend/app/Services/HotelService.php
    - mairy-backend/resources/views/admin/hotel/index.blade.php
  detail: Legacy `index()` lấy input query, set sort mặc định, gọi
    `HotelService::paginate()`, load `chain` và `manager`, view render
    search/table/actions.
- type: scope
  detail: Spec này chỉ bao phủ trang admin hotel list. `chain` chỉ là
    relationship/filter metadata trong admin; không bao phủ chain portal hoặc
    store portal.
- type: inferredFromCode
  evidence:
    - mairy-backend/resources/views/admin/partials/menu_left.blade.php
    - mairy-backend/resources/lang/ja/admin.php
  detail: Legacy sidebar dùng cụm `ホテル管理` và child `ホテル一覧`; create nằm trong
    toolbar/list action, không phải menu child.
- type: decision
  detail: "#legacy-global-ui-violation Legacy table action có thể render text
    `詳細`/`設定`/`削除する`; UI mới giữ table action icon-only."
```
