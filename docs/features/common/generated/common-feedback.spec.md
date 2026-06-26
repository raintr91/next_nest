# Common feedback and alerts

Chuẩn loading, empty, error, success feedback trong admin portal.

## Yêu cầu

_Không có._

## Giao diện

_Không có._

## API

_Không có._

## Tiêu chí nghiệm thu

- Empty/error/loading states không làm layout nhảy mất search/toolbar.
- Alert copy là tiếng Nhật UI, spec/note có thể tiếng Việt.
- Không dùng modal cho lỗi validation thông thường.
- Alert thông thường xuất hiện dưới page title/page header hoặc trong block liên quan, không đẩy vào dialog.
- Alert dialog không có action nếu bắt buộc phải ở góc phải phía trên và có reason trong page spec.
- Dialog có action confirm/cancel không theo alert placement; dùng common confirm dialog ở giữa màn hình.
- Alert toast tự mất sau timeout mặc định 5s; inline alert không tự mất.

## Ghi chú

_Không có._
