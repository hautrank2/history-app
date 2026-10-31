---
paths:
  - "src/data/**"
  - "src/app/**/*.tsx"
  - "src/components/**/*.tsx"
---

# Dữ liệu lịch sử dùng chung

- `src/data/database/` là database tĩnh; mỗi JSON là một bảng. `character.json`: nhân vật, `event.json`: khởi nghĩa/sự kiện, `warlord.json`: 12 sứ quân và căn cứ.
- Nhân vật có ID ASCII ổn định; bí danh cùng một người nằm trong `aliases`, không tạo bản ghi mới (Đinh Tiên Hoàng = Đinh Bộ Lĩnh; Trần Quốc Tuấn = Trần Hưng Đạo).
- Dùng `getCharacter`, `findCharacter`, `characterHref` từ `~/data/characters`; mọi trang, story, marker và navigation tái sử dụng cùng bản ghi. Vai trò trong một sự kiện có thể ghi đè tại chỗ; tên, tiểu sử, niên đại, nguồn và ảnh không sao chép.
- Các quan hệ dùng `characterId` / `leaderIds` / `sceneIds`. Thêm dữ liệu phải kiểm tra khóa ngoại, trùng ID và URL điều hướng.
- Ảnh và ghi công lấy qua `~/data/portraits`, không dựng lại chân dung ở mỗi màn hình. Phân biệt ảnh tư liệu và minh họa AI.
- Hồ sơ ở `/characters/<id>`; liên kết từ card nhân vật, popup địa điểm, sự kiện, trang Bạch Đằng và chiều ngược lại.
- Sự kiện có thời gian, vị trí ước lượng, lãnh đạo, diễn biến, kết quả, nguồn. Không suy diễn số liệu thiếu; hiển thị `Không xác định` cho dân số/diện tích chưa kiểm chứng.
- Khi sửa dữ liệu chuyên sâu, đối chiếu nguồn uy tín, lưu URL và ghi rõ mốc năm/phạm vi. Không tự biến số ước lượng thành số chính xác.
- Bản đồ Việt Nam phải thể hiện Hoàng Sa, Trường Sa bằng nhãn Việt Nam và ký hiệu đảo; không chỉ dựa vào polygon Natural Earth vốn thiếu đảo nhỏ. Phân biệt lớp lãnh thổ hiện đại với phạm vi kiểm soát lịch sử; không dùng đường bao nhóm đảo làm ranh giới biển. Có inset/nhãn luôn nhìn thấy nếu khung bản đồ không chứa hết.
- Quốc kỳ Việt Nam hiện nay phải được ghi rõ là biểu tượng hiện đại; không gán cờ hiện đại làm cờ của triều đại cổ.
- Tạm thời ẩn lựa chọn địa hình theo yêu cầu người dùng: `terrainEnabled = false` trong `history-map.tsx`, mặc định bản đồ đơn giản, vẫn bật biên giới. Giữ mã/lớp nền địa hình để có thể bật lại; khi mở lại phải hiện ghi công Esri, USGS, NOAA.
