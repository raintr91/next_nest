# Split Specs By Child Function

One `spec.yaml` describes **one small child function/use case** reviewable on its own.

- Split actions in the same module: `list`, `detail`, `create`, `update`, `delete`, `login-as`, `import`, `export`, `setting`.
- File layout:
  - `docs/features/{role}/{page}/{role}-{page}-{function}.spec.yaml`
  - `docs/features/{role}/{page}/{role}-{page}-{function}.test.yaml`
- Slug order: role → page/domain → function (e.g. `admin-chain-list`, not `admin-chains`).
- Do not merge `chains-list + chains-create + chains-update` into one spec.
- Cross-module behavior: dependency/link in `notes` or `openQuestions` only.
