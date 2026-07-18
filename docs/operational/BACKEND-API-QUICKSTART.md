# Backend API — quick reference

> **R2/R3:** Product Code + architecture → [`base-docs`](https://github.com/raintr91/base_docs) · E2E plans → [`base-tests`](https://github.com/raintr91/base_test) · gen: `pnpm portal:gen --id …` / `pnpm testcase:gen --id …` · [Hub split](https://github.com/raintr91/base_test/blob/main/docs/HUBS.md) / [Docs hub](https://github.com/raintr91/base_docs) / [Tests hub](https://github.com/raintr91/base_test/blob/main/docs/TESTS-HUB.md)


NestJS API in `server/` · TypeORM (MySQL) · CQRS · shared Zod via `@portal/models`.

---

## Stack diagram

```mermaid
flowchart TB
  subgraph specs["Feature artifacts"]
    IR["ir/spec.yaml\nentities.fields"]
    BE["backend/01-backend-spec.yaml"]
    OAS["backend/02-openapi.yaml"]
  end

  subgraph codegen["Codegen scripts"]
    CG["pnpm contract:gen"]
    OG["pnpm openapi:gen"]
    NG["pnpm nest:gen"]
    NUG["pnpm nest:unit-gen"]
  end

  subgraph packages["Packages"]
    MODELS["packages/models\nZod + relationships.meta"]
  end

  subgraph runtime["Runtime"]
    API["server\nNest + TypeORM"]
    DB[("MySQL\ngateway mysql84")]
    SW["/api/docs\nSwagger UI"]
  end

  IR --> CG --> MODELS
  BE --> OG --> OAS
  BE --> NG --> API
  MODELS --> API
  BE --> NUG
  API --> DB
  API --> SW
```

---

## Local dev

### 1. Database (gateway)

```bash
# ~/gateway
make up-mysql
```

MySQL host trong Docker network: `mysql84` (portal `api-node` đã set `DB_*` mặc định).

### 2. API env

```bash
cp server/.env.example server/.env
# chỉnh DB_* nếu gateway khác mặc định
```

### 3. Codegen (pilot)

```bash
pnpm contract:gen --spec `base-docs` Product Code (prefer `--id`)
pnpm openapi:gen --spec `base-docs` Product Code (prefer `--id`)
pnpm nest:gen --spec `base-docs` Product Code (prefer `--id`) --force
pnpm nest:unit-gen --spec `base-docs` Product Code (prefer `--id`) --force
```

### 4. Run & verify

```bash
pnpm dev:api
pnpm --filter @portal/api test
```

- Health: `GET http://localhost:4000/api/health`
- Swagger: `http://localhost:4000/api/docs`
- Pilot CRUD: `GET|POST|PATCH|DELETE /api/sample-items`

---

## ORM choice

| `codegen.orm` | Entity output | Extra |
|---------------|---------------|-------|
| `typeorm` | `*.entity.ts` + decorators thật | `DatabaseModule` + `TypeOrmModule.forFeature` |
| `prisma` | stub entity + `prisma/models/*.prisma` (luôn gen từ fields + relationships.meta) | merge vào `server/prisma/schema.prisma` |

Relation wiring: đọc `packages/models/src/{entity}/*.relationships.meta.ts`.

---

## Scripts

| Lệnh | Output |
|------|--------|
| `pnpm contract:gen` | `@portal/models` Zod |
| `pnpm openapi:gen` | `backend/02-openapi.yaml` |
| `pnpm nest:gen` | `server/src/modules/...` |
| `pnpm nest:unit-gen` | `*.handler.spec.ts` (Jest) |
| `pnpm --filter @portal/api test` | API unit tests |

Chi tiết workflow AI: [TEAM-AI-BACKEND-WORKFLOW](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/TEAM-AI-BACKEND-WORKFLOW.md) · [FEATURE-ARTIFACT-COMMANDS](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/FEATURE-ARTIFACT-COMMANDS.md).

| Doc | Mục đích |
|-----|----------|
| [BACKEND-CODEGEN](./BACKEND-CODEGEN.md) | Hub script `contract:gen` · `nest:gen` · `nest:unit-gen` |
| [NEST-UNIT-PHASE-DIAGRAM](./NEST-UNIT-PHASE-DIAGRAM.md) | Jest lane chi tiết |
| [WIRE-PHASE-DIAGRAM](https://github.com/raintr91/base_docs/blob/1.0.0/platform/toolchain/WIRE-PHASE-DIAGRAM.md) | Sau API unit → integration |

---

## Common layer

| Laravel (legacy) | Nest (`server/src/common/`) |
|------------------|-------------------------------|
| ApiResponse trait | `http/api-response.*` |
| BaseQuery | `crud/base-read.query.ts` |
| BaseAction | `crud/base-write.handler.ts` |
| BaseResource | `crud/base-resource.ts` |
| BaseCriteria | `criteria/base-criteria.ts` |
| — | `persistence/typeorm-write.repository.ts` |

Layout module: [NEST-API-STRUCTURE](./NEST-API-STRUCTURE.md).
