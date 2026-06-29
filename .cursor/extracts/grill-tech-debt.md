# Grill tech-debt — defer open questions across phases

> Industry term: **technical debt** (nợ kỹ thuật) / **open question** chưa chốt.  
> Portal keyword: **`tech-debt`** trong `tags:` — không dùng `#defer-*`.

## Flow

1. Grill hỏi → member **không chốt ngay** → chọn **phase xử lý** → ghi `openQuestions` + tag `tech-debt`.
2. Phase đích **step 0**: scan tag + `openQuestions` → **hỏi lại**.
3. Member trả lời → update spec → **`status: resolved`** → **xóa tag** (step sau không hỏi nữa).
4. Chuyển phase khác → đổi `deferTo` + đổi suffix tag (xóa tag cũ, thêm tag mới).

## Tag format (keyword bắt buộc)

```yaml
tags:
  - "#tech-debt: {question-id}"
```

- Prefix **`#tech-debt:`** — agent scan bằng prefix này (không cần thêm alias).
- `{question-id}` — **trùng** `openQuestions[].id` (kebab-case, stable).

**Không** dùng: `#defer-dev-grill`, `#phase-api` riêng lẻ — gom về `openQuestions.deferTo`.

## openQuestions block

```yaml
openQuestions:
  - id: bulk-delete-endpoint
    question: Bulk delete một endpoint hay N lần DELETE?
    status: open              # open | resolved
    deferTo: dev-grill-docs   # phase chốt — xem bảng dưới
    raisedAt: bqa-grill-docs  # grill session tạo nợ
    resolvedAt: null          # phase đã chốt, khi resolved

tags:
  - "#tech-debt: bulk-delete-endpoint"
```

Khi **resolved**:

- Patch spec theo câu trả lời
- `status: resolved`, `resolvedAt: dev-grill-docs` (hoặc phase thực tế)
- **Remove** `"#tech-debt: bulk-delete-endpoint"` from `tags`

## deferTo values (smoke)

| deferTo | Grill / phase scan step 0 |
|---------|---------------------------|
| `bqa-grill-docs` | `/bqa-grill-docs` |
| `dev-grill-docs` | `/dev-grill-docs` |
| `grill-with-docs` | `/grill-with-docs` |
| `spec-overview` | `/spec-overview` (smoke — khi có) |
| `prototype` | `/prototype` / HANDOFF |
| `wire` | `/wire` |
| `api` | Phase API (smoke — spec + code sau) |

Member chọn deferTo khi tạo nợ; **API chỉ smoke** — chưa có skill riêng vẫn ghi `deferTo: api`.

## Ai ghi tech-debt?

| Grill | Ghi khi |
|-------|---------|
| `/bqa-grill-docs` | Câu lẫn kỹ thuật (API, guard, permission kỹ thuật) — member chọn `deferTo: dev-grill-docs` |
| `/dev-grill-docs` | Chưa chốt BE contract — `deferTo: api` (smoke) hoặc `wire` |
| `/bqa-grill-docs` | Dev hỏi ngược UI chưa rõ — `deferTo: bqa-grill-docs` |

**Không đoán** — note tech-debt + hỏi lại đúng phase.

## Step 0 (mỗi grill session)

```
1. Filter openQuestions: status=open AND deferTo=<this-phase>
2. Filter tags: #tech-debt:* matching those ids
3. Present batch ≤5 — hỏi lại
4. On answer → patch spec → resolved → remove tag
5. On re-defer → update deferTo + swap tag id if id unchanged
```

## Render / reminder

- `pnpm docs:render` — tags hiện trong generated spec `.md` (Hashtags section).
- Agent **must not** re-ask resolved items (no matching open tag).

## Related

- `portal-codegen-tags.md` — `#wire-only`, `#needs-component` (prototype/codegen, khác tech-debt)
- `grill-docs-roles.md` — section ownership
