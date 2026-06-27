# Hotel Management

- **Testcase:** [Create hotel successfully](./testcases/hotel-create-success.md) · [Create hotel validation](./testcases/hotel-create-validation.md) · [View hotel list](./testcases/hotel-list.md)
- **Screen:** `# /hotels` · `hotels-page`

Manage hotel records in the portal, including list, search, create, and validation behavior.

## status

draft

## owner

portal-team

## requirements

```yaml
- id: REQ-HOTEL-001
  title: View hotel list
  description: User can view a paginated list of hotels.
  priority: must
- id: REQ-HOTEL-002
  title: Create hotel
  description: User can create a hotel with required fields.
  priority: must
- id: REQ-HOTEL-003
  title: Validate create form
  description: User sees validation errors when required fields are missing or invalid.
  priority: must
```

## ui

```yaml
routes:
  - path: /hotels
    pageTestId: hotels-page
  - path: /hotels/create
    pageTestId: hotel-create-page
```

## api

```yaml
endpoints:
  - method: GET
    path: /api/hotels
  - method: POST
    path: /api/hotels
```

## notes

```yaml
- YAML is the source of truth for AI/dev.
- Markdown in generated/ is for BA/QA review.
```
