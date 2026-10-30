# Tổng quan lịch sử Việt Nam

Trang `/vietnam` có nút **Xem lịch sử các triều đại** dẫn đến `/vietnam/overview`.

## Nội dung và tương tác

- 31 thời kỳ, 36 cảnh từ Hùng Vương đến Đổi Mới và hiện đại. Những triều đại dài như Lý, Trần, Tây Sơn, Nguyễn được chia thành nhiều cảnh.
- Bản đồ phủ toàn viewport, không có header, hero hoặc cuộn trang. Các bảng nổi dùng vị trí absolute/fixed, có nút ẩn/hiện riêng và chế độ chỉ bản đồ.
- Chọn thời kỳ bằng timeline ở cạnh dưới hoặc nút trước/sau; tìm kiếm tên thời kỳ và nhân vật, hỗ trợ từ khóa không dấu. Timeline có mốc phát sáng, vòng chuyển động, hiệu ứng hover, tự đưa mốc hiện tại vào giữa và thanh tiến trình theo tốc độ phát.
- Mỗi cảnh có tóm lược, quốc hiệu/chính quyền, kinh đô/trị sở, văn hóa, nhân vật và nguồn Wikipedia. Các cảnh xung đột nêu rõ lực lượng đối phương và hành động của họ.
- 108 chủ đề văn hóa (3 chủ đề/cảnh), gồm đời sống, kỹ thuật, giáo dục, tín ngưỡng, nghệ thuật và các dấu mốc mới. 181 mục địa lý/dân cư gồm lãnh thổ, diện tích, dân số, địa hình, kết nối và sinh kế. Có bộ chọn để đi thẳng đến chủ đề, nguồn ở cuối trang đọc và danh sách đầy đủ trong tab Tư liệu.
- Dân số có mốc năm, phạm vi và tình trạng ước tính. Các mốc hồi dựng được đối chiếu giữa nguồn; số liệu hiện đại dùng điều tra dân số giữa kỳ 2024. Chưa có số km² lịch sử đáng tin cậy cho từng cảnh nên ghi rõ giới hạn, không suy diện tích từ vùng tô giản lược. Phần hiện đại cung cấp diện tích xấp xỉ, mật độ và tỷ lệ thành thị/nông thôn.
- Bản đồ SVG 2D có biểu tượng cổng thành cho kinh đô, kiếm chéo cho trận đánh, lều trại cho căn cứ và đền cho di tích. Mỗi điểm có phụ đề; căn cứ có ảnh người lãnh đạo khi có tư liệu tự do phù hợp. Nhãn tránh chồng lấn, nối về tọa độ gốc và giữ kích thước khi phóng to. Trên điện thoại, các điểm chưa chọn thu gọn thành biểu tượng; chọn điểm để đọc chi tiết, phóng to/thu nhỏ, kéo và đặt lại góc nhìn. Có lớp biên giới hiện đại tùy chọn.
- Chuyển cảnh thủ công hoặc tự chuyển mặc định mỗi 6 giây (chọn 3/6/10/15 giây bằng Select shadcn); tự dừng tại cảnh cuối. URL hash lưu cảnh để tải lại hoặc chia sẻ liên kết.
- Tab nội dung hỗ trợ bàn phím. Nội dung, văn hóa, địa lý, nhân vật và nguồn phân trang theo kích thước bảng nổi, không tạo thanh cuộn bên trong. Phân trang theo từ, giữ nguyên số có dấu chấm và ngày tháng. Điện thoại dùng bảng nổi ở phía dưới; hiệu ứng tôn trọng `prefers-reduced-motion`.
- Lăn chuột hoặc trackpad để thu phóng trong khoảng 0,5×–2,5×, giữ nguyên vị trí địa lý dưới con trỏ. Sự kiện chỉ áp dụng trên vùng bản đồ; các bảng nổi hoạt động độc lập.

- Loạn 12 sứ quân (966–968) là cảnh riêng giữa nhà Ngô và nhà Đinh; bản đồ đánh dấu một số căn cứ tiêu biểu, kèm thủ lĩnh. Phần diễn biến phân biệt nội chiến với xâm lược.

- Bộ chọn chủ đề và tốc độ dùng Select chính thức của shadcn/ui; Button, Input, Tabs, Card, Tooltip cũng dùng shadcn. Cấu hình ở `components.json`, component dùng chung ở `src/components/ui`, hàm `cn` ở `src/lib/utils.ts`. Tabs dùng điều hướng bàn phím của Radix.
- Diện tích và dân số nằm trong bảng nổi riêng, độc lập với tab và bảng nội dung. Có số liệu thì giữ mốc năm/nguồn; thiếu số liệu ghi đúng “Không xác định”. Chỉ ẩn cùng chế độ chỉ bản đồ. Điện thoại đặt bảng ngay dưới các nút ẩn/hiện.

## Dữ liệu

- `src/data/vietnam-overview.ts`: dữ liệu các cảnh, nguồn và tọa độ.
- `src/data/vietnam-overview-details.ts`: nội dung văn hóa mở rộng, địa lý, ước tính dân số và nguồn cho từng chủ đề.
- `src/data/geo/southeast-asia.json`: trích 7 quốc gia từ Natural Earth 1:50m, public domain. Nguồn: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson.
- `src/data/overview-portraits.json`: 71 ảnh từ Wikipedia/Wikimedia, gồm tác giả, tên tập tin, bài viết, URL giấy phép và trang mô tả ảnh.
- `src/data/overview-leader-portraits.json` và `public/images/overview/leaders/`: 6 minh họa tạo bằng công cụ image_gen cho Đinh Bộ Lĩnh, Trần Lãm, Ngô Xương Xí, Đỗ Cảnh Thạc, Triệu Quang Phục, Lê Lợi. Giữ nguồn Wikimedia cũ trong manifest riêng; Hồ Chí Minh tiếp tục dùng ảnh tư liệu. Mọi thủ lĩnh được gắn vào căn cứ hiện tại đều có ảnh.
- `docs/leader-portrait-prompts.json`: toàn bộ prompt đã dùng. Ảnh được lưu cục bộ dưới dạng WebP, giữ bố cục và tỷ lệ của bản gốc. Khung ảnh bản đồ có vùng cắt tròn độc lập, `object-fit: cover` và điểm lấy nét, không ép méo ảnh dọc/ngang.
- `public/images/overview/`: ảnh lưu cục bộ; trang không gọi API Wikipedia ở phía trình duyệt.
- `scripts/fetch-overview-portraits.mjs`: công cụ nhập ảnh khi phát triển. Chỉ ảnh tự do, có danh sách loại ảnh nền/di tích bị nhầm thành chân dung, lựa chọn thủ công cho một số ảnh và xử lý giới hạn truy cập. Không cần chạy để build.
- Component ở `src/app/[country]/[period]/_components/vietnam-overview/`. Route chỉ mở overview khi `country === "vietnam"`.

## Giới hạn thể hiện

Lược đồ giúp so sánh phạm vi đất liền tương đối. Đường bờ/nền địa lý là dữ liệu hiện đại; vùng tô thời cổ được giản lược theo miền và vĩ độ, không phải polygon biên giới lịch sử đã kiểm chứng. Không đưa số km² thiếu cơ sở. Không thể hiện đầy đủ hải đảo, quần đảo hoặc giải quyết tranh chấp chủ quyền.

Các giai đoạn chồng lấn, đô hộ và nội chiến có chú thích về sự khác nhau giữa không gian lịch sử và vùng kiểm soát thực tế. Nam Việt không bị đồng nhất với Việt Nam. Niên đại truyền thuyết Hùng Vương được phân biệt với bằng chứng khảo cổ.

Ảnh nhân vật có thể là tranh, tượng hoặc phù điêu về sau, không mặc định là chân dung đương thời. Sáu ảnh tạo riêng có nhãn AI trên bản đồ, nhãn “MINH HỌA AI” trên thẻ và chú thích tái hiện nghệ thuật, không phải chân dung xác thực. Một số nhân vật ngoài các thủ lĩnh căn cứ vẫn chưa có ảnh tự do phù hợp và hiển thị thông báo rõ ràng. Nguồn ảnh, tác giả và giấy phép có thể mở trong tab Nhân vật; ảnh trên căn cứ có ghi công trong bảng Địa điểm khi chọn điểm đó.

## Kiểm chứng

- TypeScript, ESLint và production build.
- Đã xác nhận 89 tên bài nguồn tồn tại bằng Wikipedia API, có xử lý chuyển hướng.
- Đã kiểm tra 36 ID cảnh không trùng, tọa độ trong vùng bản đồ, nguồn cho mỗi cảnh và sự tồn tại/ghi công của 71 ảnh cục bộ.
- Kiểm tra trình duyệt desktop và điện thoại 390×844, 375×667: chọn thời kỳ, cảnh trong triều đại, tìm kiếm không dấu, tab/phân trang, ẩn/hiện các bảng, phóng to/đặt lại, lớp biên giới. Kiểm tra 35 cảnh × 4 tab trên 375×667 không tràn khung đọc hoặc tạo cuộn trang.
- Bổ sung kiểm tra cảnh Loạn 12 sứ quân, nguồn Wikipedia và chuyển sang nhà Đinh; bốn điểm căn cứ trên 375×667 không chồng nhau. Biểu tượng giữ kích thước 44×44 khi zoom; chân dung căn cứ và nhãn Thủ đô/Trận đánh đã kiểm tra trên desktop. TypeScript, ESLint và production build đạt sau cập nhật.
- Đã xác nhận 90 tên bài trong phần văn hóa mở rộng tồn tại qua Wikipedia API, xử lý tên chuyển hướng và thay liên kết thiếu. Kiểm tra các tập tin ảnh cho mọi thủ lĩnh căn cứ và dữ liệu bổ sung đủ 36 cảnh.
- Kiểm tra 36 cảnh × 5 tab trên điện thoại 375×667 không tràn vùng đọc/không cuộn trang. Sau chỉnh phân trang theo từ, kiểm tra lại 108 trạng thái Diễn biến/Văn hóa/Địa lý. Đã thử lăn chuột bằng thao tác trình duyệt thật; điểm địa lý dưới con trỏ được giữ cố định khi zoom. Kiểm tra ảnh tư liệu dọc 500×703 và 6 ảnh AI vuông trong khung cắt.
