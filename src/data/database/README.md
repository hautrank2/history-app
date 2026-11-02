# Database tĩnh

| Bảng | Khóa chính | Quan hệ |
| --- | --- | --- |
| `character.json` | `id` | Tên, bí danh, vai trò chung, tiểu sử, niên đại, nguồn |
| `event.json` | `id` | `leaderIds` → nhân vật; `sceneIds` → cảnh overview |
| `warlord.json` | `characterId` | Đúng 12 sứ quân, căn cứ và tọa độ gần đúng |
| `soundtrack.json` | `id` | Chủ đề nhạc theo quốc gia, thời kỳ, sắc thái; giai điệu và phối khí nguyên bản |
| `music-context.json` | Khóa theo bảng con | Tham chiếu ID cảnh/sự kiện/nhân vật/thời kỳ → quốc gia, era, mood để tự chọn nhạc |
| `ho-chi-minh-life.json` | `scenes[].id`, `sources[].id` | Cuộc đời 1890–1969; `people[].characterId` → nhân vật; `sourceIds` → nguồn; `overviewId` → cảnh tổng quan |

Đọc qua `~/data/characters` và `~/data/events`. Không import ngược từ UI để lấy dữ liệu. Dữ liệu ảnh và giấy phép được quản lý qua `~/data/portraits` cùng hai bảng ảnh trong `src/data`. Ảnh ghép của sa bàn Bạch Đằng lấy từ `battlePortrait` trong bảng nhân vật qua `battlePortraitFor`, không lặp đường dẫn ở từng component.

ID nhân vật là slug ASCII, cũng là URL `/characters/<id>`. Tên gọi khác cùng một người nằm trong aliases. Các cảnh dùng ID và vai trò theo thời điểm, không sao chép tiểu sử. Không có niên đại/số liệu đã kiểm chứng thì ghi `Không xác định`.

Tọa độ là điểm định vị gần đúng theo hệ WGS84 `[kinh độ, vĩ độ]`. Không dùng để xác định ranh giới hành chính/lãnh thổ hoặc suy ra diện tích. Lớp địa hình lưu tại `public/maps/vietnam-relief.jpg`, từ Esri World Shaded Relief (export 96°Đ–126°Đ, 0°–26°B, EPSG:4326); chỉ dùng để biểu diễn địa hình, không lấy nhãn/ranh giới từ lớp này.

Chạy `node scripts/validate-history.mjs` sau khi sửa dữ liệu để kiểm tra ID, khóa ngoại, danh sách 12 sứ quân và quy tắc renderer ảnh.
Chuyên trang `/characters/ho-chi-minh` đọc qua `~/data/ho-chi-minh`. Tọa độ nhân vật cần `locationNote` để phân biệt hiện diện trực tiếp với vị trí đại diện của chính quyền; ảnh hưởng tư tưởng không gán tọa độ. Đường nối mốc là sơ đồ, không phải hải trình. Lược đồ thế giới `src/data/geo/world.json` lấy từ [Natural Earth 1:110m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson), public domain; biên giới nền hiện đại không biểu thị phạm vi kiểm soát lịch sử. Ảnh bổ sung nằm ở `life-portraits.json` và vẫn đọc qua `portraitFor`, mỗi ảnh giữ nguồn và giấy phép.
Mặc định chuyên trang mở toàn bộ 38 mốc hiện có trên cùng bản đồ. Đây là các mốc có tư liệu đã biên soạn, không phải danh mục đầy đủ mọi địa chỉ hoặc mọi chuyến đi trong cuộc đời. Mũi tên nối mốc liên tiếp theo thời gian; các lần quay lại cùng nơi giữ số riêng, gom cụm theo pixel và có lược đồ vùng phóng to. Không thêm vị trí của đối tác thư tín vào đường đi của Bác.
URL chia sẻ dùng `view=map|story`, `stop=<scene-id>`, `map=world|focus`, `q=<từ khóa>`, `z`, `x`, `y` cho camera, `routes=0` và `borders=0` để ẩn lớp. Ví dụ: `/characters/ho-chi-minh?view=map&stop=moscow-1950&map=world`. Hash cũ như `#moscow-1950` vẫn mở được và được chuẩn hóa sang search params. Chạy `node scripts/validate-life-map.mjs` để kiểm tra khôi phục URL, thứ tự mũi tên, tọa độ trùng và giới hạn camera.
Chạy `node scripts/validate-game-audio.mjs` khi sửa nhạc/hiệu ứng để kiểm tra ánh xạ thời kỳ, mẫu OGG, lựa chọn bản ghi, lưu volume và dừng âm thanh khi ẩn tab.
