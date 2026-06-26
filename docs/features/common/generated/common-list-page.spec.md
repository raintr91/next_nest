# Common list page shell

Chuẩn layout chung cho các page danh sách trong admin portal, ưu tiên giao diện phẳng shadcn và giữ các phần legacy lặp lại có giá trị sử dụng.

## Yêu cầu

_Không có._

## Giao diện

_Không có._

## API

_Không có._

## Tiêu chí nghiệm thu

- List page không dùng card/shadow lồng nhau gây cảm giác 3D.
- Search, toolbar, table, pagination có vị trí nhất quán trên mọi page list.
- Page nhiều cột không làm vỡ layout; table scroll ngang và text cell theo common overflow spec.

## Ghi chú

- `{"type":"inferredFromLegacy","evidence":["/home/vutv/workspace/mairy-backend/resources/views/admin/hotel/index.blade.php","/home/vutv/workspace/mairy-backend/resources/views/admin/chain/index.blade.php","/home/vutv/workspace/mairy-backend/resources/views/admin/review_performance/index.blade.php"],"detail":"Legacy admin list lặp lại search ở trên, toolbar total/action/per-page, table body và pagination dưới table."}`
