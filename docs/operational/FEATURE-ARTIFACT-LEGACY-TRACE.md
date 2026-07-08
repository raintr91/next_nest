# Legacy trace — archaeology flow

> Một diagram · [FEATURE-ARTIFACT-FLOWS](./FEATURE-ARTIFACT-FLOWS.md)

```mermaid
flowchart TD
  SRC["Legacy repo\n(read once)"]
  LS["/legacy-spec"]
  TRACE["yaml/.../_legacy.trace.yaml\nindex + slices + refs"]
  BUNDLE["*.bundle.yaml\nspec + legacy + design stub"]
  SPLIT["pnpm spec:split"]
  IR_L["ir/legacy.yaml"]
  RENDER["pnpm docs:render"]
  BQA["/bqa-grill-docs"]
  SRC --> LS
  LS --> TRACE
  LS --> BUNDLE
  BUNDLE --> SPLIT --> IR_L
  BUNDLE --> RENDER
  BUNDLE --> BQA
```

## Output rules

| Có | Không |
|----|-------|
| `legacy.behaviors[]`, `fields[]`, evidence pointer | `codegen`, `tags`, `ui.filters/columns` |
| `legacyRef` → trace slice | `notes.inferredFromCode` prose dài |
| `{id}.test.yaml` round 1 | portal:gen |

## Validate

```bash
pnpm legacy-trace:validate -- docs/features/yaml/admin/hotel/_legacy.trace.yaml
```

Skill: `.cursor/skills/legacy-spec/SKILL.md` · extract: `legacy-spec`

Handoff mặc định: **`/bqa-grill-docs`** — không nhảy `/grill-with-docs`.
