# Dữ liệu phụ trợ form hotel

- **Testcase:** [Form hotel load options phụ trợ](./hotel-form-options/testcases/hotel-form-options.md)
- **Screen:** `# /hotels/create` · `admin-hotel-create-page`

SPA admin hotel create/update lấy options thật từ API dữ liệu phụ trợ, không dùng GET render page kiểu legacy.

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
  importantFields:
    - id
    - email
    - active
    - hotel_id
    - role
- name: Chain
  table: chains
  importantFields:
    - id
    - name
- name: Country
  table: countries
  importantFields:
    - id
    - kanji_name
    - name
- name: ApiSystem
  table: ms_api_systems
```

## requirements

```yaml
- id: REQ-HOTEL-FORM-OPTIONS-001
  title: Form hotel có đủ options phụ trợ
  description: Create/update cần manager user options, chain options như metadata
    quan hệ của hotel, SMS country options, API system options, hotel code mặc
    định khi create và restaurant API keys khi update.
  priority: must
```

## ui

```yaml
routes:
  - path: /hotels/create
    legacyPath: /admin/hotel/create
    pageTestId: admin-hotel-create-page
  - path: /hotels/:id
    legacyPath: /admin/hotel/update/{id}
    pageTestId: admin-hotel-detail-page
  - path: /hotels/:id/edit
    legacyPath: /admin/hotel/update/{id}
    pageTestId: admin-hotel-edit-page
```

## api

```yaml
endpoints:
  - method: GET
    path: /hotels/form-options
    legacyPath: /admin/hotel/create
    query:
      hotel_id: number|null
    response:
      code: string|null
      manager_user_options:
        - id: number
          email: string
          active: boolean
          disabled: boolean
          selected: boolean
      chain_options:
        - id: number
          name: string
      sms_country_options:
        - id: number
          name: string
          required: boolean
      api_system_options:
        - id: number
          name: string
      restaurant_api_key: string|null
    note: Endpoint này chỉ trả dữ liệu phụ trợ cho SPA; không phải API render
      `/hotels/create` hoặc `/hotels/{id}`.
```

## openQuestions

```yaml
- id: hotel-code-generation
  question: API mới có giữ format `BHT{timestamp}` của
    `HotelService::genHotelCode()` hay chuyển sang generator tenant-safe?
  tag: "#phase-api"
```

## notes

```yaml
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Admin/HotelController.php
    - /home/vutv/workspace/mairy-backend/app/Services/UserService.php
    - /home/vutv/workspace/mairy-backend/app/Services/HotelService.php
    - /home/vutv/workspace/mairy-backend/resources/views/admin/hotel/form.blade.php
  detail: Legacy create/edit render options trong Blade qua `listUserCanForHotel`,
    `listChainForHotel`, `getListCountryCanSendMessage`,
    `apiSystemService->getList()` và restaurant API keys.
- type: scope
  detail: "`chain_options` chỉ phục vụ admin gán hotel vào chain trong form hotel;
    không mô tả chain portal hoặc chức năng quản lý chain."
```
