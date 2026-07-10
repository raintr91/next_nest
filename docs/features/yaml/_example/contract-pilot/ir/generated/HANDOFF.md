# Nest codegen — HANDOFF

Spec: `/home/vutv/workspace/portal/docs/features/yaml/_example/contract-pilot/ir/spec.yaml`

## Generated

- `server/src/modules/sample-items/sample-items.module.ts` (module)
- `server/src/modules/sample-items/sample-item/sample-item.controller.ts` (controller)
- `server/src/modules/sample-items/sample-item/sample-item.resource.ts` (resource)
- `server/src/modules/sample-items/sample-item/queries/search-sample-item.query.ts` (query)
- `server/src/modules/sample-items/sample-item/queries/search-sample-item.handler.ts` (handler)
- `server/src/modules/sample-items/sample-item/sample-item.entity.ts` (orm)

## Manual

- Wire repository in Query/Command handlers (TypeORM/Prisma).
- Register module in `AppModule` if not auto-imported.
- Relation sync: read `@portal/models` `*.relationships.meta.ts`.
