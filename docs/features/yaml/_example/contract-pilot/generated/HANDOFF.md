# Nest codegen — HANDOFF

Spec: `/home/vutv/workspace/portal/docs/features/yaml/_example/contract-pilot/backend/01-backend-spec.yaml`

## Generated

- `apps/api/src/modules/example/example.module.ts` (module)
- `apps/api/src/modules/example/sample-item/sample-item.controller.ts` (controller)
- `apps/api/src/modules/example/sample-item/sample-item.resource.ts` (resource)
- `apps/api/src/modules/example/sample-item/queries/search-sample-item.query.ts` (query)
- `apps/api/src/modules/example/sample-item/queries/search-sample-item.handler.ts` (handler)
- `apps/api/src/modules/example/sample-item/commands/create-sample-item.command.ts` (command)
- `apps/api/src/modules/example/sample-item/commands/create-sample-item.handler.ts` (handler)
- `apps/api/src/modules/example/sample-item/commands/update-sample-item.command.ts` (command)
- `apps/api/src/modules/example/sample-item/commands/update-sample-item.handler.ts` (handler)
- `apps/api/src/modules/example/sample-item/commands/delete-sample-item.command.ts` (command)
- `apps/api/src/modules/example/sample-item/commands/delete-sample-item.handler.ts` (handler)
- `apps/api/src/modules/example/sample-item/sample-item.entity.ts` (orm)
- `apps/api/prisma/models/sample-item.prisma` (orm)

## Manual

- Wire repository in Query/Command handlers (TypeORM/Prisma).
- Register module in `AppModule` if not auto-imported.
- Relation sync: read `@portal/models` `*.relationships.meta.ts`.
