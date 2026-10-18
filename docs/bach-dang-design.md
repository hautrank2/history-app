# Bạch Đằng 1288

Trải nghiệm riêng tại `/vietnam/bach-dang-1288`: hero điện ảnh, bảy chương cuộn tự nhiên, sa bàn 3D mặc định và sơ đồ SVG tùy chọn, địa danh chọn bằng chuột hoặc bàn phím, lớp đường tiến quân và bãi cọc theo chương, chân dung và phần di sản. Đã thêm dependency `three` và dev dependency `@types/three`. Tôn trọng `prefers-reduced-motion`.

Tài liệu tiếp quản chi tiết: [agent-handoff.md](./agent-handoff.md). Mục lục chung: [README.md](./README.md).

Sa bàn dùng Three.js với địa hình nổi, mô hình thuyền buồm, đội lính, bãi cọc, ánh sáng, bóng đổ và nhãn HTML chiếu theo camera. Kéo để xoay, dùng +/− để phóng và nút mở rộng để xem toàn màn hình; Escape thu gọn. Có chế độ SVG dự phòng. Chân dung vẫn là tranh minh họa, không phải mô hình khuôn mặt 3D. Vị trí và quân số chỉ minh họa; nội dung chương kế thừa dữ liệu dự án.

Thanh điều khiển có Trước/Tiếp và tự phát 12, 20 hoặc 30 giây/chương. Phát lại từ đầu nếu đang ở chương cuối; tự dừng sau chương cuối. Cuộn bằng chuột/cảm ứng, phím cuộn trang hoặc ẩn tab sẽ tạm dừng. Render 3D giới hạn 30 fps và tạm ngừng khi sa bàn ra khỏi vùng nhìn hoặc tab bị ẩn. Hủy renderer, geometry, material, texture và listener khi tháo component.

Trang `/` chọn Việt Nam, Anh hoặc Trung Quốc. Các trang quốc gia hiển thị giai đoạn bằng lưới dọc, tránh bắt người xem cuộn ngang. Chỉ Bạch Đằng có trải nghiệm trận chiến.

Tài liệu kỹ thuật tham khảo: [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer), [OrbitControls](https://threejs.org/docs/pages/OrbitControls.html).

## Asset

- File: `public/images/bach-dang-cinematic.png`
- Công cụ: built-in ImageGen, không dùng CLI.
- Prompt: Use case: historical-scene. Create one ultra-wide cinematic artwork for a Vietnamese history website, aspect 3:2. Battle of Bach Dang river 1288, atmospheric premium historical epic painting with realistic 3D rendered materials. Foreground right: detailed dignified Vietnamese commander Tran Hung Dao, aged 60, weathered Vietnamese face, long dark grey beard, restrained ornate bronze lamellar armor and traditional Tran dynasty helmet, burgundy cape, waist up portrait, looking to left. Left two thirds: wide winding teal river, wooden Vietnamese warships with ochre sails, sharpened wooden stakes emerging from water, distant limestone karsts, mist, tiny distant fire embers. Dark desaturated petrol teal and antique gold palette, golden sunrise behind fog, exquisite armor detail, film grain, dramatic chiaroscuro. The left upper quarter is dark uncluttered mist for website title overlay. No text, no letters, no logo, no modern objects. Artistic historical reconstruction, not claimed authentic portrait.
