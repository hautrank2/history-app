# Âm thanh History Atlas

## Hiệu ứng đã chọn

Tác giả: **Kenney (Kenney Vleugels)**. Giấy phép: **CC0 1.0**. Các file được lưu tại `sfx/`, tên đã đổi để rõ mục đích sử dụng.

| Nguồn | File gốc | File trong website |
| --- | --- | --- |
| [Interface Sounds](https://kenney.nl/assets/interface-sounds) | click_001, select_002, confirmation_002 | ui-click, ui-select, ui-confirm |
| Interface Sounds | open_002, close_002, switch_003 | ui-open, ui-close, ui-transition |
| [RPG Audio](https://kenney.nl/assets/rpg-audio) | bookFlip2, footstep00/02/04/06 | book-flip, step-1/2/3/4 |
| RPG Audio | cloth1, knifeSlice, metalClick | armor-cloth, sword-swish, metal-click |
| [Impact Sounds](https://kenney.nl/assets/impact-sounds) | impactMetal_light_002, impactMetal_medium_001 | metal-light, metal-impact |

Bản giấy phép gốc nằm cạnh file âm thanh trong `sfx/KENNEY-*-LICENSE.txt`. Hiệu ứng được phối lớp/giảm âm lượng bằng Web Audio; không dùng bản ghi của Riot, Garena hay Tencent.

## Nhạc nền

Nhạc Việt Nam dùng hai bản thu do người dùng chọn, lưu cục bộ trong `music/`:

- Thời vua: **Hào Khí Việt Nam Piano** — [bản thu nguồn](https://www.youtube.com/watch?v=kv3oiAnKvkY), `hao-khi-viet-nam-piano.m4a`.
- Thời hiện đại: **Nỗi Đau Giữa Hoà Bình Piano** — [bản thu nguồn](https://www.youtube.com/watch?v=-m2ceAUeYac), `noi-dau-giua-hoa-binh.m4a`.

Nhạc Trung Quốc thời quân chủ (từ nhà Hạ đến nhà Thanh) phát ngẫu nhiên 4 bản thu do người dùng cung cấp. Hết một bài thì chuyển sang bài khác, không lặp lại bài vừa phát:

- **Yêu Giang Sơn Càng Yêu Mỹ Nhân**: [bản thu nguồn](https://www.youtube.com/watch?v=hRUk-MXqkjQ), `yeu-giang-son-cang-yeu-my-nhan.mp3`.
- **Phân đoạn 1, 5, 9** trích từ một tuyển tập 14 đoạn: [bản thu nguồn](https://www.youtube.com/watch?v=1rYbOpkVfoY), lần lượt ở các mốc 00:00:01, 00:07:10 và 00:12:43; `trung-hoa-phan-doan-1.mp3`, `trung-hoa-phan-doan-5.mp3`, `trung-hoa-phan-doan-9.mp3`.

Trung Quốc thời cận – hiện đại (từ 1912) vẫn dùng nhạc tổng hợp cho tới khi có bản thu riêng.

Lịch sử Anh phát ngẫu nhiên bốn bản MP3 *The Last Kingdom (Unofficial)* do người dùng cung cấp.

| Bài | Mùa | Tệp trong website |
| --- | --- | --- |
| Long Live the King | 3 | `long-live-the-king.mp3` |
| Only on the Dead | 5 | `only-on-the-dead.mp3` |
| Pull | 2 | `pull.mp3` |
| Æthelflæd | 5 | `aethelflaed.mp3` |

Các bản thu này không thuộc giấy phép CC0 của hiệu ứng Kenney. Bản quyền thuộc tác giả và người biểu diễn gốc; cần xác nhận quyền sử dụng trước khi đăng trang công khai.

Danh mục gồm 25 chủ đề cho Atlas và ba quốc gia, với hai thời kỳ và bốn sắc thái cho mỗi quốc gia. Việt Nam và Anh phát bản thu ở cả hai thời kỳ. Trung Quốc phát bản thu ở thời quân chủ. Các ngữ cảnh còn lại dùng nhạc tổng hợp từ `src/data/database/soundtrack.json`. Ngữ cảnh tự chọn nằm trong `music-context.json`.
