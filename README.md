# Portal Base (Next.js 15 + Nest)

Auth-first Next.js monorepo + Nest API in-repo — shadcn dashboard, harness AI (code lane).

## Quick start

```bash
pnpm install
pnpm dev
```

FE mặc định port 3000. API Nest: `pnpm dev:api` (nếu có).

## Commands

| Command | Mô tả |
|---------|--------|
| `pnpm dev` | Next dev |
| `pnpm build` | Production build |
| `pnpm test:unit` | Vitest |
| `pnpm test:e2e` | Playwright |

## Repo này

Skeleton: `/login`, `/` (protected), middleware cookie `auth_token`.  
Nest: `server/` (hoặc layout monorepo hiện tại).  
Giữ product code và registries trong repo. FE codegen/unitgen dùng Codegenkit;
không lưu bản sao engine tại root repo.

API client: `src/lib/api-client.ts` → `NEXT_PUBLIC_API_URL/api/*`.

## AI workflow (code lane)

Skills: `/prototype` · `/grill-prototype` · `/platform-base` ·
`/platform-mark` · `/wire` · `/test` · `/unit` · `/model` (+ grill-*).
BE/fullstack thêm `/api` · `/grill-api`.

Gen / gaps: **Artifactgraph MCP** + Codegenkit / Testkit CLI after toolkit
init (no thin `pnpm` wrappers in this product repo).

Platform rules luôn load `platform-ai.mdc`; rules theo file/slash gồm
`platform-invariants`, contract naming, base UI/E2E/data, size/split/import,
design vocabulary, team-flow prototype/unit/E2E/wire/model và CodeGraph.

Platform DNA và từng toolkit là SSOT của harness. Các agent skills/rules/extracts
được sync khi cài/init, không track bản sao `.cursor/` trong product repo.
