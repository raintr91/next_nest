---
name: unit
description: >-
  /unit command for Portal Vitest — dev lane after portal:gen. Clear needsUnit,
  run portal:unit-gen, add missing test files per layer. Not E2E, not coverage
  100% (use /grill-unit after). Manifest-first to save tokens.
disable-model-invocation: true
---

# /unit — Portal Vitest (dev lane)

Diagram: `docs/operational/UNIT-PHASE-DIAGRAM.md` (unit lane + `#needs-unit-test` lifecycle — tách 2 diagram)  
Hub: `docs/operational/PORTAL-CODEGEN.md`  
Extract: `.cursor/extracts/portal-unit-workflow.md`, `portal-unit-test-tags.md`, `portal-unit-test-common.md`, `verify-gate.md`

## Role

**Gap + gen + file thiếu** — không săn 100% coverage (để `/grill-unit`).

## Input order (stop when enough)

1. `docs/features/{slug}/generated/unit.manifest.json` — `needsUnit[]`, `files[]`, `written[]`
2. `generated/UNIT-HANDOFF.md`
3. `generated/codegen.manifest.json` — chỉ `files[]` layer logic
4. Spec — chỉ `codegen`, `requirements` (filter `reqIds` từ manifest), `api.endpoints` cho pattern gap
5. Source — đúng file trong gap, không scan repo

**Do not read:** `pages/`, `components/`, full `tests/unit/` inventory, E2E testcase YAML, `portal-design.registry.json`.

## Workflow

1. `pnpm portal:unit-gen --spec <spec>` nếu chưa có manifest/smoke (`--phase wire` khi wire service)
2. Xử lý `needsUnit[]`:
   - Registry pattern `implemented` → `portal:unit-gen --force` hoặc chỉnh test theo template
   - `#manual-composable`, `#wire-only` → implement logic test hoặc `#skip-unit-test` + note HANDOFF
3. **1 source → 1 test file** — tách `*.service.create|export|wire.test.ts` nếu thiếu (xem registry `patterns[].output`)
4. Không `mount()` `.vue`; mock boundary only (`mockApiFetch`, `nuxtGlobals`, mock module)
5. `pnpm exec vitest run <paths từ manifest.written>` — verify-gate

## Rules

1. Logic / public interface only — not layout, a11y, Playwright
2. Không duplicate `commonBaselines` (registry)
3. Vertical slice: one gap → one fix → green → next
4. Không regen smoke bằng tay nếu `portal:unit-gen` đã cover — chỉ delta

## Done

- `needsUnit: []` (hoặc skip documented)
- Scoped vitest **green**
- Handoff: files touched + verify command
- Then **`/grill-unit`** for coverage + reqIds audit
