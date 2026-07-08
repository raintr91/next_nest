# Update spec flow

```mermaid
flowchart LR
  U["/update-spec\n/update-spec-legacy"] --> D["Delta matrix"]
  D --> T["Emit #update:* tags"]
  T --> R["specRevision++"]
  R --> N{"featureStatus\nwas wire?"}
  N -->|yes| NU["need-update"]
  N -->|no| K["keep status"]
  T --> TG["pnpm testcase:gen\nbump lastSynced.testcase"]
  T --> PG["pnpm portal:gen\nbump lastSynced.prototype"]
  TG --> W["/wire"]
  PG --> W
  W --> C["Clear #update:*\nfeatureStatus: wire\nwireCount++"]
```

## Tag reference

| Tag | Trigger |
|-----|---------|
| `#update:add-block:{id}` | New `ui.blocks[]` entry |
| `#update:modify-block:{id}` | Existing block changed |
| `#update:remove-block:{id}` | Block removed |
| `#update:api:{id}` | API contract delta |
| `#update:test:{id}` | Test scenario delta |

See `.cursor/extracts/spec-update-tags.md` and `spec-update-delta.md`.

## Liên kết (cùng phase)

| Doc | Nội dung |
|-----|----------|
| [TECH-DEBT-FLOW](./TECH-DEBT-FLOW.md) | `#tech-debt:*` — chưa chốt; khác `#update:*` |
| [DESIGN-PHASE-DIAGRAM](./DESIGN-PHASE-DIAGRAM.md) | Gap từ grill → `/update-spec` |
| [WIRE-PHASE-DIAGRAM](./WIRE-PHASE-DIAGRAM.md) | Clear `#update:*` tại wire |

## Rules

- Spec remains source of truth — no rename-only mapping layers.
- Tags persist through testcase and prototype sync; cleared only at wire.
- No backward lifecycle states after wire.
