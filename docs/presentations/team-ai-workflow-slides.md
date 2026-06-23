# Portal Team AI Workflow

> Slide Markdown cho buổi trình chiếu 15-20 phút.

---

## Agenda

0. Vì sao cần workflow mới
   - vấn đề hiện tại
   - ý tưởng cốt lõi
   - tư duy tham khảo
1. Ý tưởng mới & deliverable
   - bóc tách tài liệu kỹ thuật và deliverable
   - YAML backbone cho Dev/AI
   - spec, testcase, generated Markdown
   - automation testing: E2E + unit test
2. Workflow phases
   - Phase Design: `/design`, `/model`
   - Phase Implement: `/test`, `/api`
   - Phase Integration: `/wire`
   - Phase Unit Test: `/unit`
3. Tổng quan Portal Base
   - nền tảng kỹ thuật
   - cấu trúc tầng
   - cách chạy mock UI/docs local
4. Rules & Skills
5. Kết luận

---

## 0. Vấn Đề Hiện Tại

- Dev/AI cần tài liệu kỹ thuật có cấu trúc, không phải mô tả tự do.
- Chưa có đủ unit test cho logic quan trọng.
- Chưa có automation E2E phủ flow nghiệp vụ chính.
- Khi release/IT, test thủ công dễ lọt case, thiếu case biên, test trùng lặp.
- Member dễ phải ở lại muộn để cover regression sau release.
- E2E viết muộn thường thiếu `data-testid`, thiếu mock state, thiếu edge cases.
- Mỗi session AI nếu load quá nhiều context sẽ tốn token và dễ lạc phase.

Mục tiêu: review sớm hơn, release ít rủi ro hơn, giảm manual regression lặp lại.

---

## 0.1 Ý Tưởng Cốt Lõi

```text
Bullet yêu cầu
   ↓
/design
   ↓
Mock UI + spec.yaml + testcase YAML round 1
   ↓
Generated Markdown cho BA/QA review
   ↓
/test làm mịn testcase + Playwright E2E
   ↓
/api + /wire + /unit
   ↓
Release có regression safety net
```

YAML là xương sống kỹ thuật. Markdown là bản trình bày cho người review.

Automation test là safety net cho release.

---

## 0.2 Tham Khảo Tư Duy

- Harness workflow: chia phase/command rõ, session nào làm đúng việc session đó.
- Progressive disclosure: chỉ load skill/rule cần cho command hiện tại.
- Early feedback: có mock UI và generated Markdown sớm để BA/QA phản hồi.
- AI-friendly docs: YAML có cấu trúc để AI/dev đọc, diff, update, và generate code/test.

Delivery ngoài phase như Excel/testcase export có thể làm task riêng: build từ YAML hoặc generated Markdown.

---

## 1. Ý Tưởng Mới & Deliverable

Bóc tách 2 nhóm tài liệu:

- **Tài liệu kỹ thuật**: có cấu trúc để Dev/AI hiểu và giao tiếp tốt hơn.
- **Deliverable**: Excel, Docx, testcase template cũ, spec cũ, user guide nếu cần.

Tài liệu kỹ thuật dùng YAML làm lõi vận hành cho AI + tech. Deliverable có thể được convert riêng từ YAML hoặc generated Markdown bằng con người, AI, hoặc script.

Chi tiết nền tảng kỹ thuật xem phần [3. Tổng Quan Portal Base](#_3-tổng-quan-portal-base).

```text
docs/features/{slug}/
├── spec.yaml                  # source of truth requirement
├── testcases/*.yaml           # source of truth testcase E2E
└── generated/
    ├── spec.md                # BA/QA review
    └── testcases/*.md         # BA/QA review
```

Không để Excel/Docx là source of truth.

---

## 1.1 YAML Là Gì?

YAML là format dữ liệu có cấu trúc, dễ đọc hơn JSON cho tài liệu kỹ thuật.

Vì sao dùng YAML:

- Có tổ chức key/value rõ, AI dễ đọc và update đúng chỗ.
- Dev/AI dùng cùng một source of truth để gen UI, model, API, test.
- Tối ưu token hơn mô tả tự do dài vì context rõ field và scope.
- Diff tốt trong Git, review thay đổi dễ hơn file binary.

Để thân thiện cho member non-tech:

- YAML được render sang Markdown bằng script, không cần dùng AI.
- BA/QA đọc generated Markdown qua VitePress.
- Deliverable khác như Excel/Docx có thể build riêng từ YAML hoặc Markdown.

Commands:

```bash
pnpm docs:render
pnpm docs:dev
```

Script: `scripts/docs/render-docs.mjs`

---

## 1.2 Spec Là Gì?

Spec mô tả requirement ở mức feature:

- mục tiêu nghiệp vụ
- actor/permission
- route/page
- entity/field
- API draft
- acceptance criteria
- open questions

Example:

```yaml
id: blog
title: Blog Management
requirements:
  - id: REQ-BLOG-001
    title: Create post
    description: User can create a blog post.
```

---

## 1.3 Testcase Là Gì?

Testcase chi tiết hơn spec, vì bao gồm kỹ thuật để sinh/cập nhật E2E:

- route/auth
- test ids
- setup/mocks
- test data
- steps
- UI assertions
- semantic/a11y/layout/design-token assertions
- expected result

Testcase round 1 sinh từ `/design`, sau đó làm mịn qua `/test`. Chi tiết automation xem phần [1.4 Automation Testing](#_1-4-automation-testing).

---

## 1.4 Automation Testing

Bổ sung E2E + unit test để giảm regression thủ công và tăng coverage IT/release.

---

## 1.4.1 Testing Strategy

| Loại test | Tool | Mục đích |
|---|---|---|
| Unit | Vitest | Logic nhỏ: validation, service parser, composable state |
| UI catalog | Storybook | Review component, a11y addon, visual confidence |
| E2E | Playwright | User flow thật trên browser |
| Accessibility scan | axe + Playwright | WCAG/ARIA/label/contrast tự động |

Không dùng E2E cho mọi edge nhỏ. Logic thuần nên có `/unit`.

---

## 1.4.2 E2E Test Là Gì

E2E (End-to-End) test mô phỏng hành vi người dùng thật trên browser:

- mở trang
- login hoặc dùng session
- click button
- fill form
- submit
- chờ API/mock response
- kiểm tra URL, text, table, toast, dialog

Unit test kiểm tra logic nhỏ. E2E kiểm tra flow tích hợp từ UI đến behavior cuối.

---

## 1.4.3 Các Tool E2E Automation Phổ Biến

| Tool | Điểm mạnh | Lưu ý |
|---|---|---|
| Playwright | Modern, multi-browser, auto-wait, trace/report tốt | Cần discipline selector/test data |
| Cypress | DX tốt, debug trực quan, ecosystem mạnh | Một số scenario browser/context phức tạp kém linh hoạt hơn |
| Selenium | Chuẩn lâu đời, nhiều ngôn ngữ/browser | Setup/debug thường nặng hơn |
| WebdriverIO | Linh hoạt, WebDriver ecosystem | Config/tooling nhiều hơn |

Base chọn Playwright để phù hợp E2E + CI + API mocking + trace debugging.

---

## 1.4.4 E2E Automation — Lợi Ích & Trade-off

Lợi ích:

- Giảm regression khi release.
- Cover flow nghiệp vụ chính lặp lại được.
- Tăng coverage IT/release bằng E2E automation chạy toàn project.
- Giảm phụ thuộc vào việc chọn lọc case thủ công theo ảnh hưởng release.
- Bắt lỗi tích hợp mà unit test không thấy.
- Trace/screenshot/report giúp debug nhanh.
- QA tập trung case mới/thông minh hơn thay vì retest lặp lại.

Trade-off:

- Chạy chậm hơn unit test.
- Dễ flaky nếu selector/test data không chuẩn.
- Không nên cover mọi edge nhỏ bằng E2E.

---

## 1.4.5 Quan Điểm Test Automation Của Base

```text
Vitest unit
  → logic nhỏ, nhanh, nhiều edge cases

Playwright E2E
  → flow nghiệp vụ chính, regression release

axe accessibility
  → WCAG/ARIA/label/contrast phổ biến

Semantic UI helpers
  → layout, overflow, broken image, shadcn token
```

Mục tiêu:

- Giảm effort regression test thủ công bằng con người.
- Đưa regression quan trọng thành E2E automation chạy trong CI/CD.
- Tăng coverage IT khi release bằng test toàn project, không chỉ chọn lọc case theo ảnh hưởng.
- Chuyển effort QA từ “retest lặp lại” sang “thiết kế case tốt hơn”.

---

## 1.4.6 Vì Sao Playwright

So với Cypress/Selenium:

- Browser automation hiện đại, chạy Chromium/Firefox/WebKit.
- Locator tốt, auto-wait tốt.
- Trace viewer, HTML report, screenshot/video hữu ích khi debug.
- Phù hợp E2E + API mocking + CI.
- Tích hợp tốt với `@axe-core/playwright`.

Link: [Playwright docs](https://playwright.dev/docs/intro)

---

## 1.4.7 Quan Điểm Accessibility

Automated scan không chứng minh UI fully accessible, nhưng bắt được nhiều lỗi phổ biến:

- button/link không có accessible name
- form control thiếu label
- ARIA sai role/attribute
- duplicate id
- color contrast
- image thiếu alt

Dùng 2 lớp:

- `@axe-core/playwright`: WCAG/ARIA/accessibility tree.
- custom semantic UI helpers: layout geometry như text overflow, overlap, table/grid layout, broken images.

Links:

- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [axe-core](https://github.com/dequelabs/axe-core)
- [Cypress accessibility testing](https://docs.cypress.io/app/guides/accessibility-testing)

---

## 2. Workflow Phases

| Phase | Command | Ai làm | Output |
|---|---|---|---|
| Design | `/design` | BA/Dev/FE/AI | mock UI + `spec.yaml` + testcase YAML round 1 |
| Design | `/model` | Dev/AI | Zod schemas + TypeScript types in `models/` |
| Implement Testcase/E2E | `/test` | QA/Dev/AI | refined testcase YAML + Playwright E2E |
| Implement Backend | `/api` | BE/AI | backend API |
| Integration | `/wire` | FE/AI | UI dùng API thật, bỏ mock |
| Unit Test | `/unit` | Dev/AI | Vitest unit tests |

Aliases: `/prototype`, `/e2e`, `/backend`, `/integrate`.

---

## 2.1 Phase Design — `/design` + `/model`

Mục tiêu: early feedback.

Input:

- mô tả chức năng dạng gạch đầu dòng
- component base hiện có: shadcn + molecules + organisms

Chi tiết component/base xem phần [3. Tổng Quan Portal Base](#_3-tổng-quan-portal-base).

Output:

- mock UI chạy được
- `docs/features/{slug}/spec.yaml`
- `docs/features/{slug}/testcases/*.yaml` round 1
- generated Markdown cho BA/QA review bằng `pnpm docs:render`

Testcase round 1: happy path, validation cơ bản, common Level 1.

---

## 2.1.1 Phase Design — Thay Đổi, Trở Ngại, Lợi Ích

Thay đổi:

- Không còn flow cũ: Wireframe → viết document Excel/Google Sheet → dev đọc và tự hình dung UI.
- Flow mới: AI gen prototype chạy được song song với `spec.yaml` và generated Markdown user story.
- Mock UI, spec, testcase round 1 được sinh cùng lúc để feedback sớm.

Trở ngại:

- Cần prototype nhanh và gần đúng ngay từ đầu.
- Khắc phục bằng AI, Storybook, component base có sẵn, shadcn/molecules/organisms và skill/rule theo phase.
- Tài liệu thay đổi từ Excel/Google Sheet sang YAML/Markdown user story.
- Đây là trở ngại lớn nhất: member cần nâng skill để làm việc với mẫu tài liệu mới.

Lợi ích:

- Tối ưu AI: YAML giúp AI đọc ít token hơn, hiểu cấu trúc rõ hơn, update đúng chỗ hơn.
- Early feedback: khách hàng/team có thể trải nghiệm prototype chạy được và feedback trực tiếp.
- Giảm việc đọc spec Excel rồi tự hình dung màn hình.

---

## 2.1.2 Phase Design — Bước Nhảy Vọt Prototype

Trước đây flow thường là:

```text
Requirement → Wireframe/Figma → Review → Dev implement → QA test
```

Với portal/admin CRUD, nhiều màn hình đã là pattern quen thuộc:

- list/table/filter/search
- create/edit form
- dialog confirm
- toast
- empty/loading/error state
- dashboard/card/chart

`/design` giúp đi thẳng hơn:

```text
Requirement → AI-generated mock UI bằng code thật → BA/QA review trên màn hình chạy được
```

---

## 2.1.3 Phase Design — Không Cần Wireframe Cho Mọi Màn Portal

Không phủ nhận Figma/design tool.

Nhưng với portal/admin nội bộ, nhiều case có thể rút ngắn wireframe:

- UI dùng component thật của base.
- Mock UI có state và data thật hơn ảnh tĩnh.
- Có `data-testid` ngay từ đầu.
- Có `spec.yaml` và `testcases/*.yaml` sinh song song.
- Có thể chạy E2E sớm.

Thông điệp: từ **review hình** sang **review màn hình chạy được**.

---

## 2.1.4 Phase Design — shadcn Ecosystem Giúp Prototype Nhanh

shadcn không chỉ có component lẻ.

- [shadcn dashboard example](https://ui.shadcn.com/examples/dashboard)
- [shadcn/ui](https://ui.shadcn.com/)
- [Shadcnblocks Admin Dashboard](https://www.shadcnblocks.com/admin-dashboard)
- [Shadcn UI Examples](https://shadcnexamples.com/website-analytics-admin-dashboard)

Team có thể tham khảo block/template, ảnh, code sample, rồi AI map về:

- shadcn-vue primitives
- molecules/organisms của base
- Tailwind/shadcn design token
- mock data đủ state

Chi tiết component tiers xem phần [3.3 shadcn + Component Tiers](#_3-3-shadcn-component-tiers).

---

## 2.1.5 Phase Design — BA + Dev + QA + AI Cùng Làm

Không phải AI tự làm một mình.

BA:

- Viết bullet requirement rõ.
- Review wording, flow, rule nghiệp vụ.
- Chốt expected behavior.

Dev:

- Review code AI generate.
- Chỉnh component/composable nếu AI sai pattern.
- Đảm bảo đúng kiến trúc Portal.

QA:

- Đọc spec sớm.
- Nghĩ testcase từ đầu.
- Bổ sung empty/error/validation/permission cases.

AI:

- Sinh mock UI, `spec.yaml`, `testcases/*.yaml`, generated Markdown.

---

## 2.1.6 Phase Design — Mock Data Phải Đủ Case

Mock UI không chỉ có happy data.

Tối thiểu nên có:

- List có data
- Empty state
- Loading state
- Error state
- Create success
- Validation error cơ bản
- Long text để phát hiện overflow
- Status khác nhau nếu có filter/status
- Permission/disabled state nếu feature có phân quyền

Round 1 testcase: happy path, validation cơ bản, smoke/list load, semantic Level 1.

---

## 2.1.7 Phase Design — Mock API Cần Gần API Thật

Khi mock UI đã có API shape, thiết kế để sang `/wire` reuse được:

- Detail page dùng `getXxxDetail(id)`.
- Edit form dùng lại `getXxxDetail(id)` để đổ initial data.
- Duplicate form cũng dùng lại `getXxxDetail(id)`, rồi reset field tạo mới.
- Block/tab entity độc lập thì tách API riêng theo block/tab.
- Không gom dashboard/form phức tạp vào một API lớn nếu từng block có loading/error/lifecycle riêng.

Example Dashboard:

```text
GET /dashboard/summary
GET /dashboard/users
GET /dashboard/stats
```

---

## 2.1.8 Phase Design — Example Prompt

```text
/design tạo chức năng blog quản lý bài viết:
- tham khảo layout dashboard/table giống shadcn dashboard
- có danh sách bài viết
- tìm kiếm theo tiêu đề
- tạo bài viết gồm title, slug, content, status
- title bắt buộc
- tạo thành công quay về list và hiện toast
- mock data đủ: có data, empty, loading, error, long title
- dùng shadcn + molecules/organisms có sẵn
```

AI sẽ:

- đọc component patterns của portal
- tạo/cập nhật `docs/features/blog/spec.yaml`
- tạo testcase YAML round 1
- dựng mock UI + mock data
- gắn `data-testid`
- chạy `pnpm docs:render`

---

## 2.1.9 Phase Design — Example `spec.yaml`

```yaml
id: blog
title: Blog Management
summary: Manage blog posts in portal.
requirements:
  - id: REQ-BLOG-001
    title: View post list
    description: User can view and search posts.
    priority: must
  - id: REQ-BLOG-002
    title: Create post
    description: User can create a post with required title.
    priority: must
ui:
  routes:
    - path: /blogs
      pageTestId: blogs-page
    - path: /blogs/create
      pageTestId: blog-create-page
api:
  endpoints:
    - method: GET
      path: /api/blogs
    - method: POST
      path: /api/blogs
```

---

## 2.1.10 Phase Design — Example `testcase.yaml`

```yaml
id: blog-create-success
feature: blog
title: Create blog post successfully
requirementIds:
  - REQ-BLOG-002
route:
  path: /blogs/create
  auth: required
testIds:
  required:
    - blog-create-page
    - blog-title-input
    - blog-save-btn
steps:
  - action: goto
    path: /blogs/create
  - action: fill
    testId: blog-title-input
    value: First post
  - action: click
    testId: blog-save-btn
assertions:
  semantic:
    level1:
      - toHaveNoConsoleErrors
      - toHaveNoHorizontalScroll
expected:
  - Success toast is visible.
```

---

## 2.1.11 Phase Design — `/model`

Mục tiêu: chỉ tạo/cập nhật entity models.

Khi dùng:

- trong `/design` nếu cần chuẩn hóa entity contract sớm
- trước `/wire` nếu cần align API response/request
- khi chỉ muốn chỉnh Zod schema/type, không đụng UI

Scope:

- chỉ `models/`
- Zod API contract schema
- TypeScript `z.infer` types
- enum/entity/request/response types

Không làm:

- UI
- service/composable/store
- validation form
- E2E/unit test

Example:

```text
/model thêm model Blog gồm id, title, slug, status draft/published, request create/update
```

---

## 2.2 Phase Implement — Testcase/E2E + Backend

Mục tiêu: làm mịn testcase và E2E.

Input:

- mock UI đã có
- `spec.yaml`
- testcase YAML round 1
- feedback BA/QA

Output:

- testcase YAML refined
- Playwright specs
- message text chính xác
- edge cases
- semantic Level 2/3

---

## 2.2.1 Phase Implement — Testcase/E2E Refinement

Thay đổi:

- Testcase không còn là Excel/Google Sheet thủ công làm source of truth.
- Testcase kỹ thuật dùng YAML làm source of truth.
- Generated Markdown dùng để member/QA review dễ hơn.
- Sau khi testcase đủ mịn, AI/dev dùng nó để tạo/cập nhật Playwright E2E.

Trở ngại:

- Member phải đọc/review spec user story Markdown thay vì Excel như cũ.
- QA cần tạo/review testcase Markdown/YAML thay vì testcase Excel cũ.
- Cần học cách mô tả testcase rõ: precondition, test data, steps, expected, testId, semantic assertions.

Khắc phục:

- AI hỗ trợ convert bullet requirement thành testcase YAML/Markdown.
- AI hỗ trợ làm mịn edge cases, validation message, permission, empty/error state.
- AI hỗ trợ sinh Playwright E2E từ testcase đã review.

Lợi ích:

- Testcase có cấu trúc, dễ trace với requirement.
- E2E test có nguồn đầu vào rõ, giảm thiếu case do viết muộn.
- Regression quan trọng được tự động hóa trong CI/CD thay vì retest thủ công toàn bộ.

Thêm case biên:

- empty state
- server error
- permission denied
- duplicate code/name
- long text overflow
- pagination/filter/sort
- dialog confirm/cancel

Bổ sung assertions:

- Level 2: overlap, grid, table layout
- Level 3: shadcn token
- Accessibility: axe, ARIA, contrast, document semantics

---

## 2.2.2 Phase Implement — Testcase/E2E Example Prompt

```text
/test làm mịn testcase blog:
- bổ sung empty state
- title quá dài
- duplicate slug
- permission denied
- kiểm tra table layout level2
- kiểm tra button/input token level3
```

AI sẽ:

- update `docs/features/blog/testcases/*.yaml`
- render Markdown review
- viết/cập nhật Playwright
- chạy scoped E2E

---

## 2.2.3 Phase Implement — Backend (`/api`)

Mục tiêu: backend API theo `spec.yaml`, nhưng **không làm trong repo portal**.

Input:

- `docs/features/{slug}/spec.yaml`
- testcase YAML để hiểu expected behavior

Output:

- Chuyển sang repo backend riêng: `~/workspace/api`
- Backend team/AI tham khảo spec/testcase YAML đã thống nhất
- Chi tiết convention, module, validation, backend tests nằm ở repo backend

Example:

```text
/api implement blog API trong repo ~/workspace/api theo spec.yaml gồm list, create, validation title required và slug unique
```

---

## 2.3 Phase Integration — `/wire`

Mục tiêu: thay mock bằng API thật.

Input:

- API staging/backend đã có
- `spec.yaml`
- testcase YAML refined
- E2E specs

Output:

- models/services/composables thật
- page bind API thật
- mock import bị xóa khỏi production path
- E2E green

Example:

```text
/wire blog thay mock bằng API thật, giữ E2E green
```

---

## 2.4 Phase Unit Test — `/unit`

Mục tiêu: unit test logic bằng Vitest.

Targets:

- validation schemas
- payload builders
- service response parsing
- composable state transitions
- store actions
- pure helpers

Example:

```text
/unit bổ sung Vitest cho blog validation schema và service parser
```

Command:

```bash
pnpm test:unit
```

---

## 3. Tổng Quan Portal Base

Mục tiêu base:

- FE portal chạy nhanh bằng mock UI.
- Component dùng lại qua shadcn + molecules + organisms.
- YAML/spec/testcase làm xương sống cho AI/dev.
- BA/QA review bằng mock UI + generated Markdown.

---

## 3.1 Portal Base Dựa Trên Gì

| Nền tảng | Vai trò |
|---|---|
| [Nuxt 4](https://nuxt.com/) | App framework Vue, routing, SSR/SPA, module ecosystem |
| [shadcn-vue](https://www.shadcn-vue.com/) | UI primitive, Tailwind token, component copy-in dễ custom |
| Molecules/Organisms | Component tầng team dựng sẵn, tránh page all-in-one |
| Vitest | Unit test logic |
| Playwright | E2E browser automation |
| Storybook | UI catalog/review component |
| VitePress | Review docs local đẹp, link click được |

---

## 3.2 Nuxt 4 Trong Base

Ưu điểm:

- File-based routing, Vue 3, ecosystem mạnh.
- Hợp với portal auth-first.
- Dễ chia 4 tầng: page/component → composable → service/store → model/validation.

Lưu ý:

- Cần giữ page mỏng, không gọi API trực tiếp trong component.
- Cần discipline về `data-testid` và E2E.

Link: [Nuxt docs](https://nuxt.com/docs)

---

## 3.3 shadcn + Component Tiers

```text
components/ui/          primitive shadcn
components/molecules/   Mo* field/group/navigation
components/organisms/   Data*, OrGlobal*
pages/                  orchestration only
```

Ưu điểm:

- Token Tailwind/shadcn rõ: color, radius, border, ring.
- Copy-in component, dễ customize theo design system.
- E2E có thể assert design token Level 3.

Lưu ý: không copy legacy theme demo vào feature mới.

---

## 3.4 Common Helpers Trong Base

- `$apiFetch` wrapper: gọi API qua service, không gọi trong page/component.
- `models/`: API contract + types.
- `validations/`: form schema chặt hơn API.
- `useApiForm`: map validation + API error.
- `testId` helpers: chuẩn hóa `data-testid`.
- Semantic UI E2E helpers:
  - no console errors
  - no horizontal scroll
  - no broken images
  - no text overflow
  - layout/table/grid
  - axe accessibility
  - shadcn design token

---

## 3.5 Cấu Trúc Base

```text
pages/components
  ↓
composables
  ↓
services + stores
  ↓
models + validations
  ↓
$apiFetch
```

UI tiers:

```text
components/ui        shadcn primitives
components/molecules Mo*
components/organisms Data*, OrGlobal*
```

---

## 3.6 Chạy Local Mock UI

Mục tiêu: BA/QA xem màn hình prototype trên host, không cần Docker/domain.

Dev chạy:

```bash
pnpm install
pnpm dev
```

Sau đó mở URL local từ terminal để review mock UI.

---

## 3.7 Xem Docs Đẹp Bằng VitePress

YAML được render sang Markdown bằng script có sẵn:

```bash
pnpm docs:render
pnpm docs:dev
```

Script: `scripts/docs/render-docs.mjs`

Output:

```text
docs/features/{slug}/generated/
├── README.md
├── spec.md
└── testcases/*.md
```

Build static:

```bash
pnpm docs:build
pnpm docs:preview
```

VitePress giúp link click được, có sidebar/search, dễ review hơn IDE Markdown preview.

---

## 3.8 Storybook Trong Base

Mục đích:

- Xem component độc lập.
- Review state: default, loading, error, disabled.
- Dễ demo Molecules/Organisms cho team.
- Có thể kết hợp addon a11y.

Commands:

```bash
pnpm storybook
pnpm storybook:build
pnpm storybook:gen
```

---

## 4. Rules & Skills

| Command | Rule | Skill |
|---|---|---|
| `/design` | `team-flow-phase1-design`, `team-flow-phase2-prototype` | `team-phase1-brainstorm`, `team-phase2-ui-prototype` |
| `/model` | `team-flow-model` | `team-model` |
| `/test` | `team-flow-phase3-e2e` | `team-phase3-e2e` |
| `/wire` | `team-flow-phase4-integration` | `team-phase4-api-integration` |
| `/unit` | `team-flow-unit` | `team-unit-vitest` |
| router | `team-flow-router` | `team-harness` |

Một session chỉ nên theo một command.

---

## 5. Kết Luận

- `/design` cho early feedback: mock UI + YAML backbone.
- `/test` làm testcase thật sự mịn và đáng tin.
- `/api` và `/wire` tách backend với frontend integration.
- `/unit` giữ logic nhỏ có test nhanh.
- YAML là xương sống project.
- Markdown generated + VitePress giúp BA/QA review dễ.

Team có thể bắt đầu bằng một prompt ngắn:

```text
/design tạo chức năng blog quản lý bài viết ...
```
