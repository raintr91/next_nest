# Duplicate hotel admin

- **Testcase:** [Admin duplicate hotel](./hotel-duplicate/testcases/hotel-duplicate.md)
- **Screen:** `#`

Admin duplicate hotel metadata và các module legacy do admin action copy, sau đó mở edit page của hotel mới.

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
- name: Message
  table: messages
- name: TargetCustomer
  table: target_customers
```

## requirements

```yaml
- id: REQ-HOTEL-DUPLICATE-001
  title: Duplicate hotel metadata và module liên quan
  description: Duplicate replicate hotel, sinh `code` mới, set `property_id=null`,
    copy Google Form setting, target customers/plans, messages, templates, rule
    messages, task messages, message operator targets, multi-language messages
    và restaurant API keys theo logic legacy.
  priority: should
```

## api

```yaml
endpoints:
  - method: POST
    path: /hotels/{id}/duplicate
    legacyPath: /admin/hotel/duplicate/{id}
    response:
      id: number
      code: string
      redirect_to: /hotels/{id}
```

## openQuestions

```yaml
- id: hotel-duplicate-schema-copy
  question: Multiple schema mới có duplicate schema tenant/resource data hay chỉ
    copy metadata/module trung tâm?
  tag: "#phase-api"
```

## notes

```yaml
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Admin/HotelController.php
    - /home/vutv/workspace/mairy-backend/app/Services/HotelService.php
    - /home/vutv/workspace/mairy-backend/resources/views/admin/hotel/group_action.blade.php
  detail: Legacy `duplicate()` dùng Eloquent `replicate()`, reset
    `code`/`property_id`, rồi gọi `duplicateModules()` để copy setting,
    target/message graph, restaurant API keys và chạy Artisan update task.
- type: scope
  detail: Duplicate ở đây là admin action từ `/admin/hotel/duplicate/{id}`; việc
    copy tenant schema/resource thật của store không được quyết định trong spec
    này.
```
