# Rapi Recorder — Hướng dẫn QA

Tài liệu dành cho **QA không biết code**: cách đặt tên test case, record flow trên prototype, và thêm assertion bằng **Rapi Recorder**. Dev/AI sẽ chuyển script Rapi sang Playwright theo [skill convert](../.cursor/skills/portal-rapi-playwright/SKILL.md).

**Liên quan:** [E2E-TESTIDS.md](./E2E-TESTIDS.md) (FE phải có `data-testid` trước khi record) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Quy trình phát triển E2E

| Phase | Ai | Việc làm |
|-------|-----|----------|
| **1** | Dev | Phát triển FE prototype với **mock data** |
| **1.5 / 2.5** | QA | Viết test case, **record** bằng Rapi Recorder trên prototype, thêm assertions |
| **2.5 ~ 3** | Dev + AI | Bổ sung backend API; **convert** Rapi → Playwright TS (Page Object, Faker, `storageState`) |
| **3** | QA | Verify lại bằng Playwright; dùng **evidence** (screenshot, trace, HTML report) từ Playwright |

**Phân quyền**

- **QA** sở hữu test case, coverage, nội dung record/assertion.
- **Dev** sở hữu framework Playwright (config, helpers, Page Object shell, `storageState`).

---

## 1. Đặt tên test case (bắt buộc)

### Format

```text
module.action.expected_result
```

### Ví dụ

```text
auth.login.success
auth.login.invalid_password
auth.logout.success

hotel.create.success
hotel.create.duplicate_name
hotel.update.success
hotel.delete.success
hotel.search.by_name

smtp.gmail.create.success
smtp.outlook.create.success
```

### Quy tắc

| Quy tắc | Đúng | Sai |
|---------|------|-----|
| Chữ thường | `hotel.create.success` | `Hotel.Create.Success`, `HOTEL.CREATE.SUCCESS` |
| Dấu chấm | `hotel.create.success` | `hotel_create_success`, `hotel-create-success` |
| Không số thứ tự | `hotel.create.success` | `TC001`, `hotel.create.001` |
| Thể hiện nghiệp vụ | `hotel.create.duplicate_name` | `hotel.test`, `hotel.case1` |

**Mỗi test case = một file Playwright sau convert** (vd `hotel.create.success.spec.ts`).

---

## 2. Quy tắc record

### Chỉ record nghiệp vụ

Record các flow nghiệp vụ rõ ràng:

```text
Create Hotel
Edit Hotel
Delete Hotel
Search Hotel
```

### Không record login trong testcase nghiệp vụ

| Sai | Đúng |
|-----|------|
| Login → Create Hotel | Create Hotel (giả định **user đã đăng nhập**) |

Chỉ các testcase **`auth.*`** mới được record bước login/logout:

```text
auth.login.success
auth.logout.success
```

### Không hardcode dữ liệu nghiệp vụ

| Sai | Ưu tiên |
|-----|---------|
| `Hotel ABC`, `admin@gmail.com`, `123456` | Placeholder: `{{hotel_name}}`, `{{email}}`, `{{phone}}` |

Nếu Rapi không hỗ trợ placeholder, QA vẫn có thể nhập dữ liệu mẫu — Dev/AI sẽ thay bằng **Faker** khi convert.

### Không chọn bản ghi cụ thể

| Sai | Đúng |
|-----|------|
| Click row 3 | Open first hotel |
| Click Hotel ABC | Open any hotel |

---

## 3. Assertion — hướng dẫn cho QA

### Functional assertions (ưu tiên)

Dùng khi cần xác nhận hành vi:

```text
Text · Visible · Hidden · URL · Attribute · Class · Enabled · Disabled · Checked
```

### UI assertions

Dùng khi cần xác nhận giao diện:

```text
Class · CSS Property · Width · Height · Position · Element Type
```

Ví dụ:

```text
Button có class btn-primary
background-color = rgb(...)
height = 40px
```

### Tránh pixel tuyệt đối (trừ khi bắt buộc)

| Hạn chế | Ưu tiên |
|---------|---------|
| `left = 123px`, `top = 567px` | Modal nằm giữa |
| | Button nằm dưới Input |
| | Avatar nằm bên trái Username |

---

## 4. Checklist trước khi giao script cho Dev

- [ ] Tên test case đúng format `module.action.expected_result`
- [ ] Không gộp login vào flow nghiệp vụ (trừ `auth.*`)
- [ ] Không hardcode tên hotel/email cụ thể (hoặc ghi chú để AI thay Faker)
- [ ] Không click row/tên bản ghi cố định — dùng “first” / “any”
- [ ] Đủ assertion: success message, URL, dialog đóng, bảng cập nhật, v.v.
- [ ] Prototype đã có `data-testid` trên control tương tác (xem [E2E-TESTIDS.md](./E2E-TESTIDS.md))

---

## 5. Thư mục export / đặt tên file gợi ý

Sau convert, Playwright nằm theo module:

```text
tests/e2e/
├── auth/
│   ├── auth.login.success.spec.ts
│   └── auth.logout.success.spec.ts
├── hotel/
│   ├── hotel.create.success.spec.ts
│   └── hotel.update.success.spec.ts
└── smtp/
    └── smtp.gmail.create.success.spec.ts
```

QA khi lưu/export từ Rapi nên đặt tên file **trùng** tên test case (vd `hotel.create.success`).

---

## 6. Evidence khi verify (phase 3)

QA verify bằng Playwright report:

```bash
pnpm test:e2e
pnpm test:e2e:report   # mở HTML report
```

Mỗi lần chạy có thể có: screenshot (fail), trace (retry), video (nếu bật). Dùng làm bằng chứng pass/fail.

---

## Tóm tắt nhanh

1. Đặt tên: `module.action.expected_result` — chữ thường, dấu chấm.
2. Record nghiệp vụ; **không** login trừ `auth.*`.
3. Tránh hardcode & row cố định.
4. Assertion: functional trước, UI sau; tránh pixel tuyệt đối.
5. Giao script Rapi cho Dev convert → QA verify Playwright + evidence.
