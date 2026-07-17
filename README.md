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
| `pnpm portal:gen --id <W-…\|CMP-…>` | FE codegen |

## Repo này

Skeleton: `/login`, `/` (protected), middleware cookie `auth_token`.  
Nest: `server/` (hoặc layout monorepo hiện tại).  
Giữ: `codegen/`, `openapigen/`, `unitgen/`, `registries/`.

API client: `src/lib/api-client.ts` → `NEXT_PUBLIC_API_URL/api/*`.

## AI harness (code lane)

Skills: `.cursor/skills/` · rules/extracts: `.cursor/`.  
SSOT harness = `.cursor/` tại repo này.
