// Editorial introductions and consequences complement the sourced event chronologies.
export type BattleBookend = { date: string; text: string };
export const battleBookends: Record<string, { context: BattleBookend; aftermath: BattleBookend }> = {
  "bach-dang-938": {
    context: { date: "Trước trận · Năm 938", text: "Sau khi giết Dương Đình Nghệ, Kiều Công Tiễn cầu viện Nam Hán để đối phó Ngô Quyền. Nam Hán đưa thủy quân do Hoằng Tháo chỉ huy sang. Ngô Quyền phải vừa dẹp lực lượng cầu viện ở Đại La, vừa chuẩn bị ngăn cuộc tiến quân từ đường biển vào Bạch Đằng." },
    aftermath: { date: "Sau trận · 938–939", text: "Đạo thủy quân Nam Hán bị đánh bại, Hoằng Tháo tử trận và cuộc xâm lược thất bại. Năm 939, Ngô Quyền xưng vương, đóng đô ở Cổ Loa. Chiến thắng Bạch Đằng tạo nền tảng cho một chính quyền độc lập, mở ra thời kỳ tự chủ lâu dài của đất nước." },
  },
  "nhu-nguyet-1077": {
    context: { date: "Trước trận · 1075–1076", text: "Quan hệ Đại Việt – Tống chuyển sang đối đầu quân sự. Sau cuộc tiến công của quân Lý vào các căn cứ chuẩn bị chiến tranh của Tống năm 1075–1076, Lý Thường Kiệt rút quân về nước. Trước cuộc tiến quân của Tống, ông tổ chức phòng tuyến sông Như Nguyệt để bảo vệ hướng về Thăng Long." },
    aftermath: { date: "Sau trận · Năm 1077", text: "Quân Tống không phá được phòng tuyến, chịu tổn thất và khó khăn tiếp tế. Hai bên đi đến giảng hòa, quân Tống rút về. Đại Việt bảo vệ được nền độc lập; việc thương lượng và giải quyết những vấn đề biên giới còn tiếp tục trong các năm sau chiến tranh." },
  },
  "bach-dang-1288": {
    context: { date: "Trước trận · 1287–1288", text: "Sau hai lần tiến quân thất bại, nhà Nguyên tiếp tục xâm lược Đại Việt cuối năm 1287 bằng cả đường bộ và đường thủy. Quân Trần bảo toàn chủ lực, đánh vào hậu cần; việc đoàn thuyền lương bị đánh ở Vân Đồn khiến quân Nguyên thiếu tiếp tế. Trần Hưng Đạo chuẩn bị chặn thủy quân đối phương trên đường rút qua Bạch Đằng." },
    aftermath: { date: "Sau trận · Năm 1288", text: "Thủy quân Nguyên bị đánh bại trên sông Bạch Đằng, Ô Mã Nhi bị bắt; đạo quân bộ của Thoát Hoan cũng rút khỏi Đại Việt. Chiến thắng góp phần quyết định kết thúc cuộc kháng chiến chống Nguyên lần thứ ba, bảo vệ nền độc lập và củng cố vị thế của triều Trần. Quan hệ bang giao tiếp tục được xử lý sau chiến tranh." },
  },
  "chi-lang-xuong-giang-1427": {
    context: { date: "Trước trận · Năm 1427", text: "Sau nhiều năm khởi nghĩa, nghĩa quân Lam Sơn đã mở rộng vùng kiểm soát và vây các thành quân Minh còn giữ, trong đó có Đông Quan. Nhà Minh điều viện binh sang cứu. Bộ chỉ huy Lam Sơn chọn đánh viện binh trước, kết hợp vây thành để buộc lực lượng chiếm đóng mất chỗ dựa." },
    aftermath: { date: "Sau trận · 1427–1428", text: "Viện binh Minh bị đánh bại, Vương Thông ở Đông Quan mất hy vọng được giải cứu. Hội thề Đông Quan mở đường cho quân Minh rút về nước. Năm 1428, Lê Lợi lên ngôi, lập nhà Lê sơ; thắng lợi của khởi nghĩa Lam Sơn khôi phục nền độc lập của Đại Việt." },
  },
  "rach-gam-xoai-mut-1785": {
    context: { date: "Trước trận · 1784–1785", text: "Trong cuộc chiến với Tây Sơn, Nguyễn Ánh tìm sự trợ giúp của Xiêm. Quân Xiêm tiến vào vùng Gia Định năm 1784, phối hợp với lực lượng Nguyễn. Trước sức ép ấy, Nguyễn Huệ đưa quân vào Nam, chọn đoạn sông Tiền gần Mỹ Tho để tổ chức một trận phục kích thủy bộ." },
    aftermath: { date: "Sau trận · Năm 1785", text: "Liên quân Xiêm – Nguyễn thất bại nặng, lực lượng còn lại rút khỏi chiến trường. Trận đánh làm thất bại cuộc can thiệp quân sự của Xiêm và củng cố quyền kiểm soát của Tây Sơn ở Nam Bộ. Tuy vậy, cuộc tranh chấp giữa Tây Sơn và Nguyễn Ánh còn tiếp diễn nhiều năm sau." },
  },
  "ngoc-hoi-dong-da-1789": {
    context: { date: "Trước trận · Cuối năm 1788", text: "Sau biến động ở Bắc Hà, Lê Chiêu Thống cầu viện nhà Thanh. Quân Thanh do Tôn Sĩ Nghị chỉ huy tiến vào Thăng Long, trong khi quân Tây Sơn lui về Tam Điệp để bảo toàn lực lượng. Nguyễn Huệ lên ngôi Quang Trung ở Phú Xuân rồi đưa quân ra Bắc tổ chức phản công." },
    aftermath: { date: "Sau trận · Mùa xuân 1789", text: "Các đồn chủ yếu của quân Thanh bị phá, Tôn Sĩ Nghị rút chạy và quân Tây Sơn vào Thăng Long. Cuộc tiến công bảo vệ nền độc lập, củng cố triều Quang Trung. Sau chiến thắng, Tây Sơn chủ động bang giao với nhà Thanh để ổn định quan hệ và tránh một cuộc chiến mới." },
  },
  "dien-bien-phu-1954": {
    context: { date: "Bối cảnh · Đông Xuân 1953–1954", text: "Trong chiến tranh Đông Dương, Pháp triển khai kế hoạch Nava nhằm giành lại thế chủ động. Trước các hướng tiến công của quân Việt Nam, Pháp chiếm Điện Biên Phủ và xây tập đoàn cứ điểm để giữ Tây Bắc, bảo vệ hướng Thượng Lào và thu hút chủ lực đối phương. Bộ chỉ huy Việt Nam chọn đây làm nơi quyết chiến, chuẩn bị lực lượng và hậu cần cho chiến dịch." },
    aftermath: { date: "Sau chiến dịch · Tháng 5–7/1954", text: "Tập đoàn cứ điểm bị đánh bại, de Castries cùng bộ tham mưu bị bắt. Chiến thắng làm thay đổi cục diện chiến tranh, tạo lợi thế quan trọng cho Việt Nam tại Hội nghị Genève. Các hiệp định đình chỉ chiến sự tháng 7/1954 chấm dứt chiến tranh Đông Dương; Việt Nam tạm thời bị chia cắt bởi giới tuyến quân sự, mở sang một giai đoạn lịch sử mới." },
  },
  "quan-do": {
    context: { date: "Bối cảnh · Trước năm 200", text: "Cuối Đông Hán, các thế lực quân phiệt tranh giành quyền kiểm soát miền Bắc. Viên Thiệu nắm Hà Bắc, còn Tào Tháo kiểm soát triều đình ở huyện Hứa. Cuộc tiến quân xuống phía nam của Viên Thiệu đe dọa căn cứ của Tào, dẫn hai bên tới cuộc đối đầu quyết định tại Quan Độ." },
    aftermath: { date: "Sau trận · Từ năm 200", text: "Viên Thiệu thất bại và rút về Hà Bắc. Tào Tháo giành ưu thế chiến lược, nhưng chưa lập tức kiểm soát toàn bộ miền Bắc. Sau khi Viên Thiệu chết, sự chia rẽ giữa các con ông tạo thêm điều kiện để Tào Tháo lần lượt thâu tóm lãnh thổ họ Viên trong những năm tiếp theo." },
  },
  "xich-bich": {
    context: { date: "Bối cảnh · Năm 208", text: "Sau khi củng cố miền Bắc, Tào Tháo đưa quân xuống Kinh Châu. Lưu Biểu qua đời, Lưu Tông đầu hàng; Lưu Bị phải rút lui. Nguy cơ Tào tiến tiếp xuống Trường Giang khiến Tôn Quyền và Lưu Bị liên minh, tập trung lực lượng ngăn bước tiến của quân phương bắc." },
    aftermath: { date: "Sau trận · 208–209", text: "Tào Tháo rút khỏi chiến trường sau thất bại. Liên quân giành cơ hội mở rộng ở Kinh Châu, trong khi Tào vẫn giữ thế lực lớn ở miền Bắc. Xích Bích tạo điều kiện cho thế phân lập Tào – Tôn – Lưu phát triển; ba nước Ngụy, Thục, Ngô chỉ lần lượt chính thức hình thành trong những năm sau." },
  },
  "hop-phi": {
    context: { date: "Bối cảnh · Năm 215", text: "Hợp Phì là cửa ngõ từ Giang Đông lên vùng Hoài Nam, do quân Tào kiểm soát. Khi Tào Tháo đang tiến hành chiến dịch ở phía tây, Tôn Quyền đưa quân đánh thành. Trương Liêu, Lý Điển và Nhạc Tiến phải giữ vị trí này để ngăn quân Tôn mở rộng lên phía bắc." },
    aftermath: { date: "Sau trận · Năm 215", text: "Tôn Quyền không hạ được Hợp Phì, rút quân và thoát khỏi cuộc truy kích ở Tiêu Diêu Tân. Quân Tào giữ được cửa ngõ Hoài Nam. Khu vực Hợp Phì – Nhu Tu tiếp tục là một mặt trận tranh chấp lâu dài giữa các thế lực ở miền Bắc và Giang Đông." },
  },
  "di-lang": {
    context: { date: "Bối cảnh · 219–221", text: "Năm 219, quân Tôn Quyền chiếm phần Kinh Châu do Lưu Bị kiểm soát, Quan Vũ bị bắt và giết. Mất vùng đất chiến lược và đổ vỡ liên minh khiến quan hệ Thục – Ngô chuyển sang chiến tranh. Năm 221, Lưu Bị đưa quân đông chinh nhằm đánh Ngô và giành lại vị thế đã mất." },
    aftermath: { date: "Sau trận · 222–223", text: "Quân Thục thất bại, Lưu Bị lui về Bạch Đế và mất năm 223. Thục không giành lại được Kinh Châu, phải phục hồi lực lượng sau tổn thất. Ngô giữ được tuyến phía tây; về sau hai bên khôi phục liên minh để đối phó sức ép từ Ngụy." },
  },
  "nhai-dinh": {
    context: { date: "Bối cảnh · Xuân 228", text: "Gia Cát Lượng mở cuộc Bắc phạt lần thứ nhất từ Hán Trung, hướng tới Lũng Hữu. Khi một số quận hưởng ứng quân Thục, Ngụy điều viện quân tới. Nhai Đình giữ vai trò bảo vệ đường liên lạc và chặn viện; nhiệm vụ của Mã Tắc ở đây ảnh hưởng trực tiếp tới khả năng duy trì cuộc tiến công." },
    aftermath: { date: "Sau trận · Năm 228", text: "Mất Nhai Đình làm thế phối hợp của quân Thục bị phá vỡ. Gia Cát Lượng rút về Hán Trung, xử tội Mã Tắc và nhận trách nhiệm về việc dùng người. Cuộc Bắc phạt lần đầu kết thúc; Thục tiếp tục chuẩn bị các đợt tiến quân khác, còn Khương Duy trở thành một tướng lĩnh của Thục." },
  },
};
