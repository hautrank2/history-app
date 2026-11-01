---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "src/lib/game-audio.ts"
  - "src/data/soundtracks.ts"
  - "public/cursors/**"
---

# Theme game, con trỏ và âm thanh

- Theme `arena` ở `src/styles/game-theme.css`: navy, vàng kim, điểm nhấn cyan; dùng các token chung. Lấy cảm hứng bố cục HUD/MOBA, không sao chép logo, hình hay âm thanh của Liên Quân.
- Giữ selector ngữ nghĩa của giao diện và khả năng đọc nội dung. Biển đảo, border, navigation và trạng thái ẩn địa hình phải được giữ khi đổi theme.
- Con trỏ SVG 32px tại `public/cursors/`: thường, tương tác, kéo, đang kéo, nhập chữ; hotspot phải đúng và luôn có fallback native. Chỉ áp dụng khi `hover: hover` và `pointer: fine`; không dùng overlay JavaScript bám chuột.
- Âm thanh dùng chung qua `~/lib/game-audio`, không tạo AudioContext/timer mới ở từng màn hình. Chỉ khởi tạo/resume từ tương tác thực của người dùng; khi tab bị ẩn phải dừng cả nguồn đang phát và lịch phát nhạc.
- Có master mute, volume hiệu ứng, volume nhạc, toggle riêng cho click/chuyển cảnh/quân lính/nhạc nền. Lưu tất cả vào `history-atlas-audio` trong localStorage; kiểm tra kiểu, clamp volume 0–1, xử lý JSON hỏng hoặc storage bị chặn. Không ghi đè tùy chọn người dùng khi đổi route.
- Chỉ một nút bánh răng `.game-audio-trigger`, icon duy nhất, luôn fixed góc trên phải trên mọi route; bật/tắt tổng nằm bên trong bảng cài đặt. Giữ chỗ trong toolbar/header để không che navigation. Escape đóng bảng và trả focus về bánh răng.
- Nhạc nền tổng hợp nguyên bản khai báo trong `src/data/database/soundtrack.json`, API qua `src/data/soundtracks.ts`; `music-context.json` ánh xạ cảnh, sự kiện, nhân vật và thời kỳ. Ba quốc gia × quân chủ/cận–hiện đại × hùng vĩ/huyền ảo/trầm lắng/kịch tính có 24 chủ đề; `/` dùng Atlas trung tính. Không suy ra nhạc quân chủ chỉ vì quốc gia vẫn có vua (Anh hiện đại vẫn dùng phối khí hiện đại). Nhân vật ngoài ba nước dùng Atlas; hồ sơ nhân vật dùng nhạc nhẹ theo bối cảnh/niên đại.
- Hiệu ứng chính dùng bản ghi Kenney CC0 trong `public/audio/sfx`, phối lớp qua `src/data/sound-effects.ts`; giữ giấy phép và nguồn ở `public/audio/CREDITS.md`. Synth chỉ là fallback khi mẫu chưa tải hoặc tải lỗi. Không dùng bản ghi gốc Liên Quân/LoL. Chỉ tải/decode sau tương tác, cache buffer và dùng chung AudioContext.
- Overview thay hash bằng replaceState phải phát sự kiện `atlas:scene-change` để nhạc theo đúng cảnh. Không để nhạc restart ở mỗi click hoặc mỗi chương nếu vẫn cùng một bản.
- Chương Bạch Đằng phát `atlas:music-context` với số chương; nhạc chuyển từ huyền ảo sang kịch tính rồi hùng vĩ lúc khải hoàn. Đổi bản phải hạ âm rồi tăng lại, không cắt đột ngột; việc đổi nhạc không được tắt hiệu ứng hay đổi volume đã lưu.
- Khi tắt nhạc/mute/đổi route, giải phóng oscillator đã lên lịch, tránh phát dồn sau khi quay lại tab. Giữ nhạc nền nhỏ hơn hiệu ứng; không phát file từ dịch vụ bên ngoài.
- Kiểm tra thao tác thật, lưu cài đặt qua reload, viewport desktop/mobile, theme các trang overview/Bạch Đằng/nhân vật và chế độ giảm chuyển động.
- Chạy `node scripts/validate-game-audio.mjs` khi thay âm thanh, nhạc, cài đặt hoặc con trỏ.

- Bốn sắc thái có phối khí riêng: hùng vĩ (bè dây/kèn và trống chậm), huyền ảo (celesta/pad/echo stereo), trầm lắng (piano/sáo thưa), kịch tính (dây ngắn và nhịp trống căng). Echo là các voice được lên lịch trong musicSources để mute/ẩn tab hủy ngay, không có đuôi âm cũ phát lại.
