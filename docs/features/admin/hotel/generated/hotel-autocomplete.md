# Hotel name autocomplete

- **Testcase:** [Hotel autocomplete trả label/value](./hotel-autocomplete/testcases/hotel-autocomplete.md)
- **Screen:** `#`

API autocomplete trả danh sách tên hotel theo term để các màn hình admin dùng lookup.

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
```

## requirements

```yaml
- id: REQ-HOTEL-AUTOCOMPLETE-001
  title: Tìm hotel name theo term
  description: Khi `term` có ít nhất 1 ký tự, API trả danh sách `{label,value}` từ
    hotel name match like.
  priority: should
```

## api

```yaml
endpoints:
  - method: GET
    path: /hotels/autocomplete
    legacyPath: /admin/hotel/autocomplete
    query:
      term: string
    response:
      - label: string
        value: string
```

## notes

```yaml
- type: inferredFromCode
  evidence:
    - /home/vutv/workspace/mairy-backend/app/Http/Controllers/Admin/HotelController.php
    - /home/vutv/workspace/mairy-backend/app/Repositories/HotelRepository.php
  detail: Legacy `autocomplete()` trim `term`, gọi `searchNamesByTerm()`, trả
    `label`/`value`.
```
