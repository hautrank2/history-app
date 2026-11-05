---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
---

# Định vị giao diện

- Mọi vùng giao diện có ý nghĩa (panel, toolbar, danh sách, card, điều hướng, thống kê) có `className` ngữ nghĩa, ổn định để dev đọc tên và chỉ đúng vị trí component muốn chỉnh sửa: `vo-reading-body`, `vo-country-stats`, `character-portrait`, `bd-page-navigation`.
- Class ngữ nghĩa dùng để định vị, không bắt buộc có CSS selector tương ứng. Ưu tiên Tailwind utility cho giao diện, đặt cùng class định vị, ví dụ `className="hcm-transport flex items-center gap-2"`.
- Không tạo CSS riêng chỉ vì đã thêm class định vị. Chỉ dùng CSS khi utility không phù hợp: token/theme dùng chung, keyframes phức tạp hoặc tích hợp thư viện. Khi sửa một vùng, ưu tiên chuyển styling của vùng đó sang Tailwind và bỏ CSS tương ứng không còn dùng; không chuyển đổi toàn dự án ngoài phạm vi yêu cầu.
- Giữ tên class hiện có khi sửa; không chỉ dựa vào chuỗi utility hoặc nth-child để nhận diện vị trí.
- Thành phần lặp có `data-character-id`, `data-event-id`, `data-place-id` hoặc `data-reading-page` dùng ID dữ liệu, không dùng tên dịch làm khóa.
- Control có tên truy cập được (`aria-label` nếu chỉ có icon); vùng nội dung có heading/label. Không đổi semantic HTML chỉ để thêm selector.
- Khi người dùng chỉ class/ID hoặc tên vùng, tìm selector đó trước khi hỏi thêm vị trí.
- Nội dung dài trong panel phải cuộn được bằng chuột, touch và bàn phím; giữ điều hướng trước/sau đồng bộ với vị trí cuộn. Kiểm tra cả màn hình nhỏ và thấp.
