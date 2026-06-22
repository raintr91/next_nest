# Hotel Management

Manage hotel records in the portal, including list, search, create, and validation behavior.

## Requirements

- **REQ-HOTEL-001** — View hotel list
  User can view a paginated list of hotels.
- **REQ-HOTEL-002** — Create hotel
  User can create a hotel with required fields.
- **REQ-HOTEL-003** — Validate create form
  User sees validation errors when required fields are missing or invalid.

## UI

- `/hotels` — `hotels-page`
- `/hotels/create` — `hotel-create-page`

## API

- `GET /api/hotels`
- `POST /api/hotels`

## Acceptance

- Hotel list page renders without semantic UI issues.
- Create form validates required fields.
- Successful create shows a success toast and returns to the hotel list.

## Notes

- YAML is the source of truth for AI/dev.
- Markdown in generated/ is for BA/QA review.
