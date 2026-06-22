# Create hotel validation

Feature: [Hotel Management](../spec.md)

## Requirement IDs

- REQ-HOTEL-003

## Route

- Path: `/hotels/create`
- Auth: `required`

## Test IDs

- hotel-create-page
- hotel-name-input
- hotel-save-btn
- hotel-name-error

## Setup

```yaml
session: mockAuthenticatedSession
mocks: []
```

## Data

```yaml
{}
```

## Steps

1. action: goto, path: /hotels/create
2. action: click, testId: hotel-save-btn

## Assertions

```yaml
ui:
  - testId: hotel-name-error
    visible: true
semantic:
  ready:
    rootTestId: hotel-create-page
    waitForFonts: true
  level1:
    - toHaveNoConsoleErrors
    - toHaveNoHorizontalScroll
    - toHaveNoTextOverflow
  accessibility:
    - toHaveValidAccessibleNames
    - toHaveValidAria
```

## Expected

- Required field validation error is visible.
- No create API request is sent.
