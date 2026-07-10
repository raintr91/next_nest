# HANDOFF — Contract gen pilot

Generated from `docs/features/yaml/_example/contract-pilot/ir/spec.yaml` (profile: **list**).

## Files

- `src/services/sample-item.service.ts`
- `src/hooks/sample-item/useSampleItemList.ts`
- `src/app/(dashboard)/sample-items/page.tsx`
- `src/mocks/sample-item.mock.ts`

## Prototype next (/prototype)

_portal:gen does not emit component code for `#needs-component` / `#needs-ui` — implement molecules in /prototype, then re-run gen._

- **contract-gen**: Run `pnpm contract:gen --spec <ir/spec.yaml>` before portal:gen if @portal/models entity package is missing.

## Commands

```bash
pnpm docs:render
# after spec edits
pnpm portal:gen --spec ... --force  # re-generate after /prototype components
```
