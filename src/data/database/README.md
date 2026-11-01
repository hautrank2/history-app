# Database tĩnh

| Bảng | Khóa chính | Quan hệ |
| --- | --- | --- |
| `character.json` | `id` | Tên, bí danh, vai trò chung, tiểu sử, niên đại, nguồn |
| `event.json` | `id` | `leaderIds` → nhân vật; `sceneIds` → cảnh overview |
| `warlord.json` | `characterId` | Đúng 12 sứ quân, căn cứ và tọa độ gần đúng |
| `soundtrack.json` | `id` | Chủ đề nhạc theo quốc gia, thời kỳ, sắc thái; giai điệu và phối khí nguyên bản |
| `music-context.json` | Khóa theo bảng con | Tham chiếu ID cảnh/sự kiện/nhân vật/thời kỳ → quốc gia, era, mood để tự chọn nhạc |

Đọc qua `~/data/characters` và `~/data/events`. Không import ngược từ UI để lấy dữ liệu. Dữ liệu ảnh và giấy phép được quản lý qua `~/data/portraits` cùng hai bảng ảnh trong `src/data`. Ảnh ghép của sa bàn Bạch Đằng lấy từ `battlePortrait` trong bảng nhân vật qua `battlePortraitFor`, không lặp đường dẫn ở từng component.

ID nhân vật là slug ASCII, cũng là URL `/characters/<id>`. Tên gọi khác cùng một người nằm trong aliases. Các cảnh dùng ID và vai trò theo thời điểm, không sao chép tiểu sử. Không có niên đại/số liệu đã kiểm chứng thì ghi `Không xác định`.

Tọa độ là điểm định vị gần đúng theo hệ WGS84 `[kinh độ, vĩ độ]`. Không dùng để xác định ranh giới hành chính/lãnh thổ hoặc suy ra diện tích. Lớp địa hình lưu tại `public/maps/vietnam-relief.jpg`, từ Esri World Shaded Relief (export 96°Đ–126°Đ, 0°–26°B, EPSG:4326); chỉ dùng để biểu diễn địa hình, không lấy nhãn/ranh giới từ lớp này.

Chạy `node scripts/validate-history.mjs` sau khi sửa dữ liệu để kiểm tra ID, khóa ngoại, danh sách 12 sứ quân và quy tắc renderer ảnh.
Chạy `node scripts/validate-game-audio.mjs` khi sửa nhạc/hiệu ứng để kiểm tra ánh xạ thời kỳ, mẫu OGG, lựa chọn bản ghi, lưu volume và dừng âm thanh khi ẩn tab.
