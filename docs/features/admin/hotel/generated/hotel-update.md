# Xem và cập nhật hotel admin

- **Testcase:** [Admin xem và cập nhật hotel](./hotel-update/testcases/hotel-update.md)
- **Screen:** `# /hotels/:id` · `admin-hotel-detail-page`

Admin mở detail hotel, mặc định read-only giống legacy update page, bấm Edit để sửa và lưu.

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
- name: User
  table: users
```

## requirements

```yaml
- id: REQ-HOTEL-UPDATE-001
  title: Admin xem detail hotel bằng API detail
  description: SPA `/hotels/:id` lấy old data bằng `GET /hotels/{id}`; không dùng
    API init page từ legacy `GET /admin/hotel/update/{id}`.
  priority: must
- id: REQ-HOTEL-UPDATE-002
  title: Admin cập nhật hotel và relationship phụ trợ
  description: Update dùng cùng validation create, reset/gán lại manager users,
    cập nhật restaurant API keys, Google Form setting và API systems.
  priority: must
```

## ui

```yaml
routes:
  - path: /hotels/:id
    legacyPath: /admin/hotel/update/{id}
    pageTestId: admin-hotel-detail-page
  - path: /hotels/:id/edit
    legacyPath: /admin/hotel/update/{id}
    pageTestId: admin-hotel-edit-page
screens:
  - name: Hotel update form
    header:
      detailTitle: ホテル詳細
      editTitle: ホテル編集
      legacyCardTitle: edit information
      description: Legacy `/admin/hotel/update/{id}` hiển thị một `card card-default`
        lớn; card header là `edit information`, card body đặt `group_action` ở
        trên rồi tới form.
    layout:
      - "Detail route `/hotels/:id` vẫn là SPA route riêng để xem read-only; UI
        phải giữ cảm giác legacy update: một card lớn, không chia thành nhiều
        card section hiện đại."
      - Edit route `/hotels/:id/edit` là SPA route riêng theo rule dynamic
        route; khi vào route này form được enable tương đương legacy sau khi bấm
        `.btn-edit-form`.
      - Card body bắt đầu bằng group action row, sau đó một khoảng trắng nhỏ như
        legacy `<br>`, rồi form layout `row has_validate`.
      - "Form chính dùng layout legacy tương đương Bootstrap: cột trái rộng
        `col-lg-6` chứa thông tin hotel, billing, integration, option; cột phải
        `col-lg-3` chứa login/chain/person/SMS/save. Không render
        identity/billing/integration thành các Card riêng."
      - "Cột trái field order theo legacy: `name` + `sub_name` ở nửa trái,
        `is_show_name_in_scenario` ở nửa phải; `code` + `activate_status`;
        `phone` + `fax`; `state` + `city`; `address` rộng 9/12 + `zip_code` rộng
        3/12."
      - "Cột trái tiếp tục billing row: radio `independence`, radio
        `billing_address`, radio `payment_type`; billing numeric row:
        `initial_cost`, `monthly_fee`, `commission_rate`, `start_billing`."
      - "Integration row giữ vị trí legacy: radio `connected_3daikan` bên trái,
        `api_key_3daikan` readonly trong input-group bên phải kèm button reset
        API key primary; radio `use_restaurant` bên trái, `api_key_restaurant`
        disabled height 30px bên phải; radio `connected_crawler` bên trái,
        textarea `note` bên phải."
      - "Google/API row theo legacy: `google_form_response_url` full width; tiếp
        theo `api_ids[]` select2 ở 4/12 và `property_id` ở 8/12."
      - Options section nằm trong cột trái sau API row, có heading `hotel
        option`, option switch style dùng hidden checkbox `state_message` +
        label `state_message_click`; gồm `is_scenario_option`,
        `is_show_softbank_url`, và `hotel_cd` nằm cùng row với SoftBank option.
      - "Cột phải field order theo legacy: `master_user_hotel[]` select2
        multiple trong input-group, nút plus ở append để mở quick-create manager
        inline panel; `chain_id` select2; `person_charge` +
        `person_charge_email`; `japan_sale`; `notification_mail_address`;
        `sms_to_countries` checkbox switch list; save button cuối cột phải."
      - Quick-create manager không dùng legacy modal; khi bấm plus, hiển thị
        inline panel ngay dưới `master_user_hotel[]` trong cột phải để tránh
        modal thừa và tránh modal chồng modal.
      - "Disabled/read-only style: ở detail/read-only, các input/select/radio có
        `disabled` như legacy khi `isset($hotel) && !$isErrors`; `code` và
        `api_key_3daikan` luôn readonly; `api_key_restaurant` disabled mặc định;
        option switch disabled dùng wrapper `disabled-country` làm mờ và cursor
        not-allowed."
      - Select/multi-select phải được thể hiện như select2-like control, không
        thành checkbox grid; riêng `sms_to_countries` và option switches dùng
        switch-like checkbox legacy.
      - Inline error/request message nằm trên form như `Form::requestMessage()`;
        validation lỗi hiển thị sát field, không gom ở page header.
    headerActions:
      - id: hotel-list
        text: hotel list
        icon: List
        variant: complete
        position: group_action top of card body, trước delete
        testId: admin-hotel-list-action
      - id: delete
        text: 削除する
        icon: Trash2
        variant: destructive
        position: group_action top of card body, sau hotel-list, chỉ khi
          `can_delete=true`
        testId: admin-hotel-delete-action
      - id: duplicate
        text: 複製する
        icon: Copy
        variant: success
        position: group_action top of card body, sau edit
        testId: admin-hotel-duplicate-action
      - id: edit-link
        text: 編集
        icon: Edit
        variant: info
        position: group_action top of card body, detail route only; SPA click dẫn tới
          `/hotels/:id/edit`
        testId: admin-hotel-edit-link
      - id: edit-toggle
        text: 編集
        icon: Edit
        variant: info
        position: group_action top of card body, edit route khi chưa bật editMode
        testId: admin-hotel-edit-action
      - id: save
        text: 保存する
        loadingText: 保存中...
        icon: Save
        variant: complete
        position: cuối cột phải của form, width block, không đặt ở page header
        testId: admin-hotel-save-btn
```

## api

```yaml
endpoints:
  - method: GET
    path: /hotels/{id}
    legacyPath: /admin/hotel/update/{id}
    response:
      id: number
      name: string
      sub_name: string|null
      code: string
      phone: string
      fax: string|null
      address: string
      state: string|null
      city: string|null
      zip_code: string|null
      activate_status: number|string|null
      chain_id: number|null
      manager_user_ids: number[]
      restaurant_api_key: string|null
      api_ids: number[]
      google_form_response_url: string|null
      sms_to_countries: number[]
      can_delete: boolean
  - method: PUT
    path: /hotels/{id}
    legacyPath: /admin/hotel/update/{id}
    request:
      sameAs: POST /hotels
    response:
      id: number
      updated: boolean
```

## openQuestions

```yaml
- id: hotel-update-api-ids-multiple
  question: Legacy UI chỉ select một `api_ids[]` ở view, service lại sync array;
    API mới nên cho multi-select hay giữ single-select?
  tag: "#phase-api"
```

## notes

```yaml
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Admin/HotelController.php
    - /home/vutv/workspace/mairy-backend/resources/views/admin/hotel/update.blade.php
    - /home/vutv/workspace/mairy-backend/resources/views/admin/hotel/group_action.blade.php
    - /home/vutv/workspace/mairy-backend/public/js/admin/app.js
    - /home/vutv/workspace/mairy-backend/public/js/admin/pages/hotel_update.js
  detail: Legacy update view include `group_action`, form disabled until
    `.btn-edit-form`; update POST reuses `HotelStoreRequest`.
- type: decision
  detail: "#legacy-global-ui-violation Legacy plus button mở `admin.user.modal`;
    UI mới dùng inline quick-create manager panel để hạn chế modal và tránh
    nested modal."
- type: scope
  detail: Spec chỉ bao phủ admin detail/update hotel metadata; các màn hình vận
    hành trong store portal không thuộc phạm vi.
```
