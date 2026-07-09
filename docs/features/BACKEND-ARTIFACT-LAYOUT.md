# Feature backend artifacts (in-repo)

Per-function layout under `docs/features/yaml/{role}/{domain}/{function}/`:

```text
ir/
  spec.yaml                 # FE + entities.fields (contract SSOT)
backend/                    # /api-spec output (create per feature)
  01-backend-spec.yaml
  02-openapi.yaml
  03-mock-data.yaml
generated/
  contract.manifest.json    # contract:gen
  codegen.manifest.json     # nest:gen
  HANDOFF.md
```

Templates: `docs/templates/backend-api.yaml` · `docs/templates/ir-spec.yaml`

Workflow: [TEAM-AI-BACKEND-WORKFLOW.md](../operational/TEAM-AI-BACKEND-WORKFLOW.md) · Codegen hub: [BACKEND-CODEGEN.md](../operational/BACKEND-CODEGEN.md)

Guinea pig features may omit `backend/` until `/api-spec` — base infra does not require hotel pilot data.
