# Portal Docs

Portal docs dùng hai dạng:

- YAML là source of truth cho AI/dev.
- Markdown trong `generated/` là bản review cho BA/QA trên VitePress.

## Quick Links

- [Generated Feature Docs](./generated.md)
- [Team AI Workflow Slides](./presentations/team-ai-workflow-slides.md)
- [Team AI Workflow](./TEAM-AI-WORKFLOW.md)
- [Architecture](./ARCHITECTURE.md)
- [E2E Test IDs](./E2E-TESTIDS.md)
- [Semantic UI Assertions](./E2E-SEMANTIC-UI-ASSERTIONS.md)

## Commands

```bash
pnpm docs:render
pnpm docs:dev
```

Mở VitePress local để review link và generated docs giống web hơn Markdown preview trong IDE.
