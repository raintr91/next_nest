# Common pagination

Chuẩn pagination dưới table, dùng page numbers + ellipsis thay vì text generic `Page x of y`.

## Yêu cầu

_Không có._

## Giao diện

_Không có._

## API

_Không có._

## Tiêu chí nghiệm thu

- Không hiển thị copy English kiểu `Page 1 of 4` trong admin UI.
- Previous/next dùng icon + text tiếng Nhật `前へ`/`次へ`.
- Có thể preview ít nhất 2 page bằng mock data.
- Pagination dưới table chỉ gồm previous, page numbers/ellipsis, next; không hiển thị `表示 ... 件 / ページ` hoặc page summary tại đây.
- Pagination dưới table, căn giữa, page numbers observable bằng testId.

## Ghi chú

- `{"type":"inferredFromLegacy","evidence":["/home/vutv/workspace/mairy-backend/resources/views/paginate/custom_paginate.blade.php","/home/vutv/workspace/mairy-backend/app/Helpers/helpers.php"],"detail":"Legacy custom paginate hiển thị previous/next, page numbers xung quanh current page và ellipsis."}`
