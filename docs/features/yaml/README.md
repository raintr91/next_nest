# Feature YAML (SSOT + IR)

Layout: `yaml/{role}/{domain}/{function}/`

- `*.bundle.yaml` — SSOT (AI authoring)
- `ir/spec.yaml`, `ir/legacy.yaml`, `ir/design.yaml` — derived (`pnpm spec:split`)
- `*.test.yaml` — testcase round 1
- `_legacy.trace.yaml` — module-level legacy IR (one per domain)

Hub: `docs/operational/FEATURE-ARTIFACT-FLOWS.md` · `.cursor/extracts/artifact-graph.md`
