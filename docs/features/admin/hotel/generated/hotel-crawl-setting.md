# Cấu hình crawler cho hotel

- **Testcase:** [Admin cập nhật crawl setting của hotel](./hotel-crawl-setting/testcases/hotel-crawl-setting.md)
- **Screen:** `# /hotels/:id/crawl-setting` · `admin-hotel-crawl-setting-page`

Admin xem/cập nhật crawler setting của từng hotel từ action trong hotel list.

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
- name: CrawlSetting
  table: crawl_settings
- name: CrawlSiteController
  table: crawl_site_controllers
```

## requirements

```yaml
- id: REQ-HOTEL-CRAWL-001
  title: Admin cập nhật crawler setting
  description: Setting gồm status, site controller, interval, timing, static IP,
    login URL/param/user/pass; nếu site controller không phải `neppan`, backend
    set `login_param=null`.
  priority: must
```

## ui

```yaml
routes:
  - path: /hotels/:id/crawl-setting
    legacyPath: /admin/hotel/crawl-setting/{id}
    pageTestId: admin-hotel-crawl-setting-page
```

## api

```yaml
endpoints:
  - method: GET
    path: /hotels/{id}/crawl-setting
    legacyPath: /admin/hotel/crawl-setting/{id}
    response:
      hotel:
        id: number
        code: string
        name: string
      crawl:
        status: number|null
        crawl_site_controller_id: number|null
        interval: number|null
        timing: number|null
        is_static_ip: number|null
        login_url: string|null
        login_param: string|null
        login_user: string|null
        login_pass: string|null
        authentication_code: string|null
        authentication_code_updated_at: string|null
      options:
        site_controllers:
          - id: number
            name: string
        time_intervals:
          - value: number
            label: string
  - method: PUT
    path: /hotels/{id}/crawl-setting
    legacyPath: /admin/hotel/crawl-setting/{id}/update
    request:
      status: number
      crawl_site_controller_id: number
      interval: number|null
      timing: number|null
      is_static_ip: number|null
      login_url: string|null
      login_param: string|null
      login_user: string|null
      login_pass: string|null
    response:
      success: boolean
```

## validation

```yaml
fields:
  - key: status
    rules: required on update
  - key: crawl_site_controller_id
    rules: in existing CrawlSiteController ids
  - key: timing
    rules: lte interval * 60 - 1
  - key: login_param
    rules: required when site controller name is `neppan`
```

## openQuestions

`#`

## notes

```yaml
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Admin/HotelController.php
    - /home/vutv/workspace/mairy-backend/app/Http/Requests/CrawlSettingRequest.php
    - /home/vutv/workspace/mairy-backend/resources/views/admin/hotel/crawl.blade.php
  detail: Legacy crawl setting load `hotel->crawlSetting`, site controller
    options, interval options, rồi store/update qua service.
```
