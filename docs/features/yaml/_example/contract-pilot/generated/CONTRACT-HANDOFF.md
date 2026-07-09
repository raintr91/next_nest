# Contract gen — HANDOFF

Spec: `/home/vutv/workspace/portal/docs/features/yaml/_example/contract-pilot/ir/spec.yaml`

## Entities

- **SampleItem** — 3 fields

## Files

- `packages/models/src/sample-item/sample-item.read.schema.ts`
- `packages/models/src/sample-item/sample-item.write.schema.ts`
- `packages/models/src/sample-item/sample-item.types.ts`
- `packages/models/src/sample-item/index.ts`
- `packages/models/src/sample-item/sample-item.relationships.meta.ts`

## Manual follow-up

- Confirm `kind: relation` + `persistence.type` when grill infers from columns only.
- ORM entity (TypeORM/Prisma) is generated separately via `nest:gen` — not in contract:gen.
