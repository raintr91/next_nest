# Common confirm dialog

Chuẩn confirm dialog cho destructive/overwrite action, thay thế `window.confirm` trong prototype lâu dài.

## Yêu cầu

_Không có._

## Giao diện

_Không có._

## API

_Không có._

## Tiêu chí nghiệm thu

- Row delete, bulk delete và import overwrite không dùng `window.confirm` khi đã có common dialog.
- Confirm button disabled/loading khi action đang pending.
- Cancel đóng dialog và không gọi service.
- Confirm dialog có button action mặc định đặt giữa màn hình, không dùng top-right.
- Top-right chỉ áp dụng cho alert dialog không có confirm/cancel action.
- Không mở modal thứ hai trên modal hiện tại.

## Ghi chú

_Không có._
