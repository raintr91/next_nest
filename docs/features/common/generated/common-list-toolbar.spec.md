# Common list toolbar

Chuẩn toolbar action của list page, gồm total readonly button, action chính/phụ, bulk action và per-page control.

## Yêu cầu

_Không có._

## Giao diện

_Không có._

## API

_Không có._

## Tiêu chí nghiệm thu

- Toolbar không trộn chung với search/clear button.
- Nút `合計` luôn đứng trước action chính nếu page có tổng số bản ghi.
- Per-page và page summary nằm trong toolbar/header table góc phải, không nằm dưới table.

## Ghi chú

- `{"type":"inferredFromLegacy","evidence":["/home/vutv/workspace/mairy-backend/resources/views/common/show_perpage.blade.php"],"detail":"Legacy dùng `common.show_perpage` pull-right trên toolbar và total/action button trước đó."}`
