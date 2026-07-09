# UNIT HANDOFF — Contract gen pilot

Generated from `docs/features/yaml/_example/contract-pilot/ir/spec.yaml` (profile: **list**, phase: **prototype**).

Prerequisite: `pnpm portal:gen` + `generated/codegen.manifest.json`.

## Test files

- `tests/unit/models/sample-item/sample-item.schema.test.ts`
- `tests/unit/services/sample-item.service.test.ts`
- `tests/unit/hooks/sample-item/useSampleItemList.test.ts`

## Verify

```bash
pnpm exec vitest run tests/unit/models/sample-item/sample-item.schema.test.ts
```
