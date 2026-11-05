---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
  - "src/**/*.css"
  - "src/**/*.scss"
---

# CSS / SCSS nằm trong src/styles

- Ưu tiên Tailwind utility trong component cho layout, màu sắc, typography, responsive và trạng thái tương tác; giữ className ngữ nghĩa để dev định vị component theo `ui-locations.md`.
- Class định vị không yêu cầu CSS riêng. Chỉ thêm CSS/SCSS khi Tailwind không phù hợp (token/theme dùng chung, keyframes phức tạp, tích hợp thư viện); khi chuyển một vùng sang utility, xóa rule CSS tương ứng không còn dùng để tránh chồng styling.
- Tất cả file CSS/SCSS do dự án sở hữu phải đặt trong `src/styles/`. Không tạo stylesheet cạnh page/component hoặc trong `src/app/`.
- Import qua `~/styles/<ten-file>.css` hoặc `@/styles/<ten-file>.scss`. Tên file kebab-case theo chức năng (vietnam-overview-content.css, characters.css).
- CSS của package bên thứ ba vẫn import trực tiếp từ package (ví dụ `maplibre-gl/dist/maplibre-gl.css`); không copy vào source.
- Chuyển stylesheet phải cập nhật tất cả import, tài liệu và đường dẫn asset tương đối. Không cài Sass nếu chưa cần SCSS.
- Giao diện map dùng nền có opacity và `backdrop-filter` (kèm `-webkit-backdrop-filter`), vẫn bảo đảm chữ dễ đọc. Có fallback nền đậm khi browser không hỗ trợ backdrop. Không chồng nhiều khối nền đặc khiến mất bản đồ.
- Nội dung trong panel có một vùng cuộn chính, header/tab/footer không bị co; không chia văn bản theo số ký tự hoặc dùng height:100% tạo trang trống. Nút trước/sau điều hướng theo mục, đồng bộ vị trí cuộn.
- Điểm gần nhau trên map phải gom cụm theo pixel và tách khi zoom. Không kéo marker ra khỏi vị trí thật rồi vẽ hàng loạt đường nối. Luôn có danh sách đầy đủ để chọn cả điểm bị che/offscreen.
