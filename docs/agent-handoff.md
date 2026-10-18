# Bàn giao cho agent tiếp quản

Ngày cập nhật: 19/10/2026. Tài liệu mô tả source tại thời điểm bàn giao; đọc lại file thực tế trước khi sửa.

## 1. Mục tiêu và phạm vi

Người dùng muốn giao diện bắt mắt, có chiều sâu, chữ dễ đọc và cuộn trang đẹp hơn. Phạm vi trận chiến chỉ có **Bạch Đằng 1288**; hoàn thiện trận này trước khi mở rộng. Các yêu cầu bổ sung đã thực hiện: tự phát trận chiến, Trước/Tiếp, trang quốc gia, trang giai đoạn, scrollbar, chân dung danh tướng và lính/thuyền 3D trên bản đồ.

Không có backend, database hay tài khoản người dùng. Nội dung lấy từ dữ liệu TypeScript trong repo. Các trang được prerender; tương tác trận chiến chạy ở client. Font Google và asset vẫn cần được tải theo cách thông thường của Next.js.

## 2. Những gì đã làm

| Khu vực | Hành vi hiện tại |
| --- | --- |
| `/` | Thay redirect cũ bằng trang chọn Việt Nam, Anh, Trung Quốc; ba thẻ ảnh lớn, hiệu ứng hover, đường dẫn vào dòng thời gian và mục giới thiệu Bạch Đằng |
| `/vietnam` | Hero riêng, thẻ Bạch Đằng nổi bật, lưới tám giai đoạn; các giai đoạn khác ghi đang chuẩn bị |
| `/england`, `/china` | Hero và ảnh riêng, mỗi nước có năm giai đoạn giới thiệu; chưa có trận chiến để mở |
| `/vietnam/bach-dang-1288` | Hero điện ảnh, bảy chương cuộn dọc, bản đồ sticky đổi theo chương, phần danh tướng và di sản |
| Điều khiển | Trước/Tiếp, chọn trực tiếp chương, Tự phát/Tạm dừng/Phát lại; 12, 20 hoặc 30 giây mỗi chương |
| Sa bàn | Three.js với địa hình nổi, cây/núi, mặt nước, thuyền buồm, lính có giáp/khiên/giáo, bãi cọc, đường hành quân, ánh sáng và bóng đổ |
| Tương tác bản đồ | Kéo xoay, nút phóng/thu, đặt lại góc, mở rộng khung nhìn; chọn địa danh và chân dung tướng; chuyển 3D/Sơ đồ |
| Danh tướng | Trần Hưng Đạo, Ô Mã Nhi, Thoát Hoan có chân dung minh họa và thông tin khi bấm; các thẻ nhân vật trong chương có ảnh khi có `portrait` |
| Đọc và responsive | Nội dung chương 17px desktop, 16px mobile; tăng cỡ chữ phụ, độ tương phản; map xếp trên nội dung ở mobile; scrollbar xanh trầm/vàng đồng |

## 3. Bản đồ source

Các đường dẫn dưới đây tính từ gốc repo.

| File/thư mục | Trách nhiệm |
| --- | --- |
| `src/app/page.tsx` | Trang chọn quốc gia, Server Component |
| `src/app/[country]/page.tsx` | Trang giai đoạn dùng chung cho ba quốc gia, metadata và static params |
| `src/app/[country]/[period]/page.tsx` | Chọn `BachDangExperience` khi slug là `bach-dang-1288`; các story khác dùng `StoryMap` cũ |
| `src/app/[country]/[period]/_components/bach-dang/index.tsx` | Ghép hero, map, điều khiển, các chương, nhân vật và di sản; giữ state chế độ bản đồ, địa danh được chọn |
| `…/bach-dang/use-battle-playback.ts` | Chương đang đọc, IntersectionObserver, tiến độ cuộn trang, timer tự phát và điều hướng chương |
| `…/bach-dang/map-3d.tsx` | Vòng đời sa bàn, dynamic import scene, các pin/ảnh HTML, trạng thái loading/fallback, tooltip và khung mở rộng |
| `…/bach-dang/scene-3d.ts` | Dựng mô hình bằng geometry, camera/OrbitControls, renderer, chuyển stage, chiếu tọa độ nhãn ra màn hình và giải phóng tài nguyên |
| `…/bach-dang/map.tsx` | Sơ đồ SVG tương tác; cũng dùng khi không khởi tạo được 3D |
| `…/_components/story-map/` | Bộ kể chuyện MapLibre cũ; không xóa vì route vẫn có nhánh sử dụng |
| `src/data/vietnam.ts` | Dữ liệu Việt Nam và story Bạch Đằng, gồm bảy chương, nhân vật, camera và tọa độ cũ |
| `src/data/world.ts` | Dữ liệu giai đoạn Anh/Trung Quốc và `countryPresentation` chứa ảnh, mô tả, tên tiếng Anh, số thứ tự của cả ba nước |
| `src/data/index.ts` | Registry `countriesData`; `defaultCountrySlug` vẫn được export nhưng trang chủ hiện không redirect |
| `src/types/index.ts` | Model chung: Country, Period, Story, Chapter, Character, v.v. |
| `src/app/globals.css` | Theme gốc, MapLibre và stylesheet Bạch Đằng từ lượt thiết kế đầu |
| `src/app/atlas.css` | Trang quốc gia/giai đoạn, scrollbar, chỉnh cỡ chữ, điều khiển và 3D; được import sau `globals.css` nên có các rule ghi đè |
| `src/app/layout.tsx` | Font Be Vietnam Pro + Playfair Display; import cả hai CSS; `data-scroll-behavior="smooth"` |
| `public/images/` | Asset được lưu trong repo, không tham chiếu thư mục ảnh tạm của công cụ |
| `package.json`, `pnpm-lock.yaml` | Bổ sung `three` và `@types/three`; không dùng React Three Fiber |

## 4. Luồng chương và tự phát

`active` là chỉ số **bắt đầu từ 0**. Nội dung bài đọc, stage 2D/3D và nút chọn chương đều dùng giá trị này.

- Khi người xem cuộn, IntersectionObserver cập nhật chương trong vùng nhìn; tiến độ đọc toàn trang được cập nhật qua listener `scroll`.
- `jump(index)` giới hạn index, cập nhật `active` và cuộn đến chương. Trên mobile, hàm trừ chiều cao panel sticky để nội dung không bị map che.
- Sau điều hướng chủ động, khóa cập nhật của observer trong 1.200ms để smooth scroll không làm chọn nhầm các chương đi ngang qua.
- Tự phát mặc định 20 giây/chương, dùng `setTimeout`; đổi chương hoặc đổi thời lượng sẽ đặt lại timer. Đây là **tự chuyển chương**, chưa có thuyết minh âm thanh.
- Ở chương cuối, nút Phát lại bắt đầu lại từ chương đầu. Tự phát dừng khi hết thời lượng của chương cuối.
- Wheel, touchmove, các phím cuộn trang được liệt kê trong hook hoặc ẩn tab sẽ tạm dừng. Cuộn do `jump()` không tự tạm dừng.
- Đổi 2D/3D gọi `jump(active)` ở frame tiếp theo để điều chỉnh theo chiều cao map mới và giữ chương đang xem.
- Thời gian, chương và lựa chọn chỉ nằm trong state; chưa lưu lại sau reload.

## 5. Scene 3D và stage

`map-3d.tsx` chỉ import động `scene-3d.ts` sau khi có DOM. `createBattleScene()` trả về `setStage`, `zoom`, `reset`, `dispose`. Đổi stage không tạo lại renderer. Đổi sang sơ đồ hoặc rời trang sẽ tháo scene.

| Stage | Chương | Thay đổi chính trong scene hiện tại |
| --- | --- | --- |
| 0 | Hai kinh đô | Vị trí hạm đội đầu tuyến; chưa hiện thuyền Đại Việt, bãi cọc hay đội phục binh |
| 1 | Cuộc xâm lược lần thứ ba | Hiện thêm thuyền Đại Việt |
| 2 | Mất đoàn thuyền lương | Hiện thuyền lương minh họa |
| 3 | Quyết định rút quân | Hiện tuyến rút quân; hạm đội chuyển sâu hơn vào sông |
| 4 | Bày trận trên sông | Hiện phục binh; nhóm cọc đặt thấp để minh họa còn chìm dưới nước |
| 5 | Triều rút | Cọc lộ ra, hạm đội tiến vào trận địa; một số thuyền nghiêng |
| 6 | Kết cục | Giảm số thuyền Nguyên còn hiển thị |

Chi tiết cần biết khi sửa:

- Camera phối cảnh và OrbitControls giới hạn khoảng cách/góc nhìn. Zoom bằng nút; wheel được để phục vụ cuộn câu chuyện.
- Các mô hình được tạo bằng geometry trong code; không có asset `.glb`, rig nhân vật hay animation xương.
- `mapAnchors` là tọa độ sa bàn tự dựng, không phải kinh/vĩ độ. Nhãn địa danh và chân dung là DOM chiếu theo camera, giữ cỡ chữ đọc được khi xoay/zoom. Pin Ô Mã Nhi đi theo một thuyền trong hạm đội.
- Tọa độ địa danh/nhân vật mang tính sơ đồ; không suy ra vị trí lịch sử chính xác từ scene.
- Khung mở rộng dùng CSS phủ viewport, không dùng trình duyệt Fullscreen API. Có khóa scroll nền, giữ focus trong khung và Escape để đóng.
- Renderer dùng pixel ratio tối đa 1.7, giới hạn nhịp render khoảng 30fps; bỏ qua frame khi map ngoài vùng nhìn hoặc tab bị ẩn. Đây chưa phải số đo hiệu năng trên thiết bị thật.
- `prefers-reduced-motion` tắt các chuyển động trang trí chính; người dùng vẫn có thể thao tác camera.
- Cleanup thu hồi geometry, material, texture, renderer, controls, observers và canvas. Nếu thêm texture/listener mới, bổ sung cleanup tương ứng.

## 6. Asset và phong cách

Tông màu xanh trầm, vàng đồng, chữ sáng; heading serif, nội dung sans hỗ trợ tiếng Việt. Class mới dùng tiền tố `atlas-` hoặc `bd-` để tránh ảnh hưởng bộ MapLibre cũ.

| Asset | Sử dụng |
| --- | --- |
| `public/images/bach-dang-cinematic.png` | Hero Bạch Đằng, thẻ Việt Nam, thẻ trận chiến và crop chân dung Trần Hưng Đạo |
| `public/images/england-cinematic.png` | Thẻ quốc gia và hero Anh |
| `public/images/china-cinematic.png` | Thẻ quốc gia và hero Trung Quốc |
| `public/images/yuan-commanders.png` | Hai chân dung cạnh nhau: Ô Mã Nhi ở nửa trái, Thoát Hoan ở nửa phải; CSS crop từng nửa |

Ảnh tạo bằng ImageGen tích hợp; prompt ở các file thiết kế/asset trong thư mục này. Chân dung là tranh minh họa nghệ thuật, **không phải đầu nhân vật 3D hay chân dung lịch sử xác thực**. Khi thay ảnh, kiểm tra cả hero và các crop thumbnail vì cùng một file có nhiều nơi sử dụng.

## 7. Chạy và kiểm tra

Chạy tại gốc repo bằng pnpm:

```powershell
pnpm dev
# http://localhost:8081

npx tsc --noEmit
pnpm lint
pnpm build
```

`pnpm build` hiện vẫn là `next build` mặc định. Trong phiên triển khai, build mặc định từng lỗi tải Google Fonts khi mạng bị hạn chế và từng gặp lỗi nội bộ Turbopack tạo tiến trình. Lệnh production đã kiểm chứng thành công là:

```powershell
pnpm exec next build --webpack
```

Không đổi script build trong `package.json`. Font từ `next/font/google` có thể cần mạng lúc build. Không kết luận lỗi source chỉ từ lỗi kết nối font hoặc lỗi môi trường của bundler.

Máy triển khai đang có pnpm store ở `D:/.pnpm-store/v10`. Nếu cài dependency gặp `ERR_PNPM_UNEXPECTED_STORE`, đối chiếu cấu hình máy trước; trong phiên này dùng `--store-dir D:/.pnpm-store` (pnpm tự thêm `/v10`). Đây là ghi chú môi trường, không phải cấu hình portable cần áp lên mọi máy.

Kết quả trước lượt chỉ viết tài liệu này:

- `npx tsc --noEmit`: đạt.
- `pnpm lint`: đạt.
- `pnpm exec next build --webpack`: đạt; prerender `/`, `/vietnam`, `/england`, `/china`, `/vietnam/bach-dang-1288`.
- Đã thử trực tiếp trên preview desktop 1440×1000 và viewport mobile 390×844; nội dung mobile 16px, không có tràn ngang ở các màn đã kiểm tra.
- Đã chạy tự phát từ đầu qua đủ bảy chương, xác nhận dừng ở cuối; thử Trước/Tiếp, Phát lại, Tạm dừng và chọn thời lượng.
- Đã thử chuyển 2D/3D giữ chương, chọn danh tướng mở thông tin, nút zoom, mở rộng/thu gọn sa bàn và các trang quốc gia/giai đoạn.
- Chưa có bộ test tự động E2E, chưa benchmark trên điện thoại thật, chưa chủ động giả lập WebGL thất bại để kiểm tra nhánh fallback.

Checklist khi tiếp tục sửa chức năng:

1. Kiểm tra đường dẫn trang chủ → quốc gia → Bạch Đằng và đổi quốc gia.
2. Kiểm tra Play, Pause, thời lượng, chương cuối, Replay, giới hạn nút Trước/Tiếp.
3. Cuộn tay rồi bật tự phát, đổi 2D/3D khi đang ở giữa câu chuyện.
4. Xoay/zoom/reset, chọn địa danh, mở thông tin tướng, mở rộng/thu gọn và thử Escape.
5. Kiểm tra sticky map không che chữ trên mobile; không để nội dung nền xuyên qua panel.
6. Chạy TypeScript, lint và build; xem console, ảnh tải lỗi và tràn ngang trong preview.

## 8. Giới hạn và các điểm dễ lệch khi mở rộng

- Chỉ Bạch Đằng có `story`; không biến các thẻ đang chuẩn bị thành liên kết đến trang chưa có nội dung.
- Dữ liệu chương nằm trong `vietnam.ts`, nhưng tên ngắn `chapterNames`, điều kiện stage, tọa độ scene và một số nội dung giới thiệu vẫn hardcode cho Bạch Đằng. Thay số lượng/thứ tự chương phải sửa đồng bộ các nơi này.
- Khi thêm quốc gia, ngoài `countriesData` cần thêm entry trong `countryPresentation` và ảnh tương ứng.
- Sa bàn chưa dùng camera/tọa độ `ChapterModel.camera`; đó là dữ liệu dành cho bộ MapLibre cũ. Cập nhật tọa độ cũ không tự đổi scene 3D.
- 2D và 3D cùng đọc stage nhưng có rule vẽ riêng, chưa có một model chiến trường chung. Cần kiểm tra cả hai sau khi đổi diễn biến.
- Bản đồ, số lượng mô hình, đường đi, chân dung và hiệu ứng là minh họa. Nội dung lịch sử kế thừa dữ liệu repo; lượt thiết kế này chưa phải một đợt thẩm định sử liệu độc lập.
- CSS Bạch Đằng trải ở cả `globals.css` và các rule ghi đè trong `atlas.css`. Sửa selector phải kiểm tra cascade, nhất là media query mobile và chiều cao sticky panel.
- Mô hình đang ở mức sa bàn cách điệu; chưa có nhân vật 3D chi tiết, AI chiến đấu, mô phỏng thủy triều vật lý, thuyết minh, âm thanh hay lưu tiến trình.
- Không có yêu cầu mở thêm trận chiến ở thời điểm bàn giao. Các cải tiến trong tương lai cần theo chỉ dẫn mới của người dùng.
