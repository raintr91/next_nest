# Portal Docs

Hai lớp tài liệu feature:

- **YAML** — source of truth (`features/{slug}/`)
- **Markdown generated** — review BA/QA (`features/{slug}/generated/`)

```bash
pnpm docs:render
pnpm docs:dev
```

## Operational

- [Team AI Workflow](./operational/TEAM-AI-WORKFLOW.md)
- [Portal codegen — `portal:gen` + `portal:unit-gen`](./operational/PORTAL-CODEGEN.md)
- [Portal unit-gen roadmap PR0–PR12](./operational/PORTAL-UNIT-GEN-ROADMAP.md)
- [Architecture](./operational/ARCHITECTURE.md)
- [E2E Test IDs](./operational/E2E-TESTIDS.md)
- [Semantic UI Assertions](./operational/E2E-SEMANTIC-UI-ASSERTIONS.md)

## Onboarding (slides)

- [Team AI Workflow Slides](./onboarding/team-ai-workflow-slides.md) — training; giữ `/design`
- [YAML/Markdown workflow](./onboarding/yaml-markdown-ai-workflow.md)
- [Portal Base overview](./onboarding/portal-base-overview.md)
- [E2E automation (QA)](./onboarding/e2e-automation-playwright.md)

## Common UI

- [Common UI patterns](./common-ui/index.md)
- [Generated feature docs](./common-ui/generated.md) → `features/common/`, `features/hotel/`, …

## Dev environment

- [Docker dev nhẹ](./dev-environment/DOCKER-DEV-LIGHT.md)
- [WSL + Cursor perf](./dev-environment/WSL-CURSOR-PERF.md)
- [Monorepo strategy](./dev-environment/MONOREPO-STRATEGY.md)

Backend: repo `api/` → `src/docs/TEAM-AI-BACKEND-WORKFLOW.md`
