# History Atlas — quy tắc code

Bản đồ địa hình kể lịch sử theo từng giai đoạn. Việt Nam trước, các nước khác sau.

## Giao tiếp

- Trả lời bằng tiếng Việt, ngắn gọn, ưu tiên code hơn lời.
- Báo rõ cái gì đã đổi, cái gì chưa kiểm chứng.
- Việc trải trên nhiều file: nêu kế hoạch trước khi sửa. Hỏi tối đa một câu.
- Sửa nhỏ nhất đủ giải quyết; không refactor phần bên cạnh khi chưa được yêu cầu.

## Stack

- Next.js 16 (App Router, RSC mặc định), React 19, TypeScript `strict`.
- Tailwind CSS v4, cấu hình CSS-first trong `src/app/globals.css` (`@theme inline`).
- MapLibre GL JS cho bản đồ địa hình 3D. pnpm. Dev ở cổng **8080**.
- Trang công khai là tĩnh, dữ liệu lấy từ `src/data/`. Không database, không fetch dữ liệu phía client.
- Kiểm tra thư viện đã cài trước khi thêm dependency mới.

## Styling

- Dùng token ngữ nghĩa (`bg-card`, `text-foreground/70`, `border-border`), không hex thô trong class.
- Dự án chỉ có một theme tối kiểu game. Màu của MapLibre nằm trong `map-style.ts` vì thư viện không đọc được token CSS.
- Ghép class bằng `cn()` khi component nhận `className`.

## Component

- Arrow function: `export const Foo = (props: FooProps) => …`.
- Props là `<ComponentName>Props`, hook là `Use<ComponentName>Props`.
- Component phức tạp tách `index.tsx` / `hook.ts` / `type.ts`.
- Server Component mặc định; `"use client"` chỉ ở lá nhỏ nhất cần state, effect, ref.
- Dùng một route: đặt trong `_components/` cạnh `page.tsx`. Dùng nhiều route: `src/components/`.
- Import qua alias `~/`; trang import `./_components/…` tương đối.

## Đặt tên file

- Hook dùng chung: camelCase khớp tên export (`useOnClickOutside.ts`) trong `src/hooks/`.
- Còn lại kebab-case. Slug giai đoạn và quốc gia là ASCII.

## TypeScript

- Không `any` (dùng `unknown` rồi thu hẹp). Chỉ `type`, không `interface`. Không `!`.
- Type dùng chung ở `src/types/`, model có hậu tố `Model`.

## Code style

- Import xếp theo ba nhóm, theo alphabet: ngoài, `~/`, tương đối.
- `const` hơn `let`. `?.` và `??` thay cho nhánh dài dòng.
- Comment giải thích **vì sao**, không kể lại code.

## Dữ liệu

- Thêm giai đoạn: thêm một `PeriodModel` trong `src/data/<nuoc>.ts`. Không có `story` thì hiện là "chưa mở".
- Thêm quốc gia: tạo `src/data/<nuoc>.ts` và đăng ký trong `src/data/index.ts`.
- Toạ độ và đường hành quân là ước lượng; nội dung lịch sử phải có nguồn.

## Kiểm chứng

Chạy cả ba trước khi báo xong:

```bash
npx tsc --noEmit
pnpm lint
pnpm build
```

Thay đổi nhìn thấy được thì kiểm tra trong preview và nói rõ đã thấy gì.
