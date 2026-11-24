import type { ThreeKingdomsScene } from "~/data/three-kingdoms";
import type { BattleAction } from "~/components/battle-map-symbols";

type Event = Pick<ThreeKingdomsScene, "title" | "date" | "story" | "focus" | "cast" | "routes">;
type Detail = Pick<Event, "title" | "date" | "story" | "focus"> & Partial<Pick<Event, "cast" | "routes">> & { after: number };
const details: Record<string, Detail[]> = {
  "quan-do": [
    { after: 0, title: "Giải vây Bạch Mã", date: "Xuân 200", focus: "baima",
      story: "Viên Thiệu cho quân đánh Bạch Mã ở bờ nam Hoàng Hà. Tào Tháo nghi binh ở hướng Diên Tân rồi chuyển quân cứu tiền đồn; Nhan Lương bị giết trong trận đánh. Thay vì cố giữ mọi vị trí ven sông, Tào Tháo đưa dân và lực lượng tiền đồn lui về.",
      routes: [{ faction: "cao", kind: "attack", places: ["guandu", "baima"], label: "Quân Tào đánh giải vây Bạch Mã" }] },
    { after: 0, title: "Đánh quân truy kích, thu về Quan Độ", date: "Năm 200 · Sau Bạch Mã", focus: "guandu",
      story: "Trong các trận tiếp theo ven Hoàng Hà, quân truy kích của Viên Thiệu tiếp tục chịu tổn thất và Văn Xú tử trận. Tào Tháo thu quân về Quan Độ, giữ một chiến tuyến tập trung bảo vệ hướng huyện Hứa. Viên Thiệu vẫn đưa được chủ lực qua sông để tiếp tục chiến dịch.",
      routes: [{ faction: "cao", kind: "retreat", places: ["baima", "guandu"], label: "Quân Tào thu về Quan Độ" }] },
    { after: 1, title: "Công sự, gò cao và cuộc vây hãm", date: "Thu 200", focus: "guandu",
      story: "Quân Viên dựng gò cao bắn vào doanh Tào, trong khi quân Tào dùng khí cụ đánh trả và phòng bị những đường đào ngầm. Chiến trường trở thành cuộc đấu công sự kéo dài. Ưu thế quân số chưa giúp Viên Thiệu lập tức phá được tuyến phòng ngự trước mặt.", routes: [] },
    { after: 1, title: "Lương thực trở thành điểm yếu", date: "Thu 200 · Trong thời gian giằng co", focus: "guandu",
      story: "Tào Tháo gặp khó khăn về lương thực và cân nhắc việc rút quân. Tuân Úc khuyên giữ thế trận, chờ đối phương lộ sơ hở. Trong khi đó, quân Viên dựa vào kho dự trữ phía sau, khiến bảo vệ đường tiếp tế trở thành điều kiện để duy trì sức ép.",
      routes: [{ faction: "yuan", kind: "supply", places: ["wuchao", "guandu"], label: "Hướng tiếp tế khái quát từ kho Ô Sào" }] },
    { after: 1, title: "Hứa Du tiết lộ kho Ô Sào", date: "Cuối năm 200 · Trước đòn quyết định", focus: "wuchao",
      story: "Hứa Du rời Viên Thiệu sang với Tào Tháo, cung cấp tin về kho lương Ô Sào. Tào quyết định đánh vào hậu cần thay vì chỉ chống đỡ ở chính diện. Một lực lượng được chuẩn bị cho cuộc tập kích, còn doanh trại Quan Độ vẫn phải duy trì phòng thủ.", routes: [] },
    { after: 2, title: "Đánh trại Tào không cứu được Ô Sào", date: "Cuối năm 200 · Cùng đợt tập kích", focus: "guandu",
      story: "Quân Viên đánh doanh trại Tào tại Quan Độ nhưng không phá được phòng tuyến. Sau biến cố Ô Sào, Trương Cáp và Cao Lãm sang hàng Tào. Khủng hoảng tiếp tế và sự tan rã trong hàng ngũ chỉ huy làm quân Viên mất khả năng giữ thế trận.",
      routes: [{ faction: "yuan", kind: "attack", places: ["baima", "guandu"], label: "Quân Viên đánh trại Tào" }] },
  ],
  "xich-bich": [
    { after: 0, title: "Tôn Quyền quyết chiến, Chu Du nhận lệnh", date: "Đông 208 · Trước khi giao chiến", focus: "xiakou",
      story: "Trước ý kiến muốn hàng Tào trong hàng ngũ Giang Đông, Chu Du phân tích khó khăn của quân phương bắc khi đánh đường thủy xa căn cứ. Tôn Quyền quyết định chống Tào và giao lực lượng cho các tướng. Chu Du đưa quân lên phối hợp với Lưu Bị trên trung lưu Trường Giang.",
      routes: [{ faction: "wu", kind: "march", places: ["xiakou", "chibi"], label: "Quân Chu Du lên chiến trường" }] },
    { after: 1, title: "Bệnh tật làm quân Tào suy yếu", date: "Đông 208 · Hai bờ đối diện", focus: "wulin",
      story: "Sử liệu ghi quân Tào đã chịu bệnh tật trước trận đánh quyết định. Lực lượng từ phương bắc phải thích nghi với môi trường và cách tác chiến trên sông, trong khi liên quân ở bờ đối diện tìm cách đánh vào đội thuyền. Yếu tố này làm giảm hiệu quả của ưu thế quân số.", routes: [] },
    { after: 1, title: "Hoàng Cái đề xuất kế hỏa công", date: "Đông 208 · Chuẩn bị hỏa công", focus: "chibi",
      story: "Nhận thấy thuyền đối phương tập trung và liên kết với nhau, Hoàng Cái đề xuất dùng lửa. Ông gửi thư xin hàng để tạo cơ hội áp sát, chuẩn bị thuyền chở vật liệu dễ cháy. Chi tiết này thuộc kế hoạch tác chiến trong sử liệu; không cần tình tiết cầu gió của tiểu thuyết để giải thích trận đánh.", routes: [] },
    { after: 2, title: "Liên quân đánh khi lửa lan", date: "Đông 208 · Trận quyết định", focus: "wulin",
      story: "Gió khiến lửa lan sang chiến thuyền và doanh trại ven bờ. Quân Chu Du phối hợp tiến công, đẩy lực lượng Tào vào thế rối loạn. Hỏa công tạo bước ngoặt nhưng thắng lợi còn gắn với sức ép trực tiếp và tình trạng suy yếu sẵn có của đối phương.",
      routes: [{ faction: "wu", kind: "attack", places: ["chibi", "wulin"], label: "Liên quân tiến công về phía Ô Lâm" }] },
    { after: 3, title: "Chiến sự chuyển sang Giang Lăng", date: "208–209 · Hệ quả", focus: "jiangling",
      story: "Chu Du tiếp tục đánh Tào Nhân ở Giang Lăng, còn Lưu Bị mở rộng căn cứ ở nam Kinh Châu. Cuộc tranh chấp sau Xích Bích kéo dài sang năm 209. Trận thủy chiến chặn bước tiến của Tào, nhưng không lập tức quyết định quyền kiểm soát toàn bộ Kinh Châu.",
      cast: [{ person: "zhou", place: "jiangling", action: "Tiếp tục chiến dịch ở Giang Lăng" }, { person: "liu", place: "gongAn", action: "Xây dựng căn cứ ở Kinh Châu" }],
      routes: [{ faction: "wu", kind: "march", places: ["chibi", "jiangling"], label: "Hướng tiến tiếp theo của quân Chu Du" }] },
  ],
  "hop-phi": [
    { after: 0, title: "Mở lệnh, chọn quân xuất kích", date: "Năm 215 · Trước đòn phản kích", focus: "hefei",
      story: "Theo Trương Liêu truyện, lệnh Tào Tháo yêu cầu Trương Liêu và Lý Điển ra đánh khi quân Tôn tới, còn Nhạc Tiến giữ thành. Trương Liêu chọn quân tinh nhuệ chuẩn bị xuất kích lúc đối phương chưa ổn định. Quân giữ thành chủ động tìm một đòn đánh ngắn để phá khí thế vây hãm.", routes: [] },
    { after: 1, title: "Phá vây, quay lại cứu quân", date: "Trong ngày xuất kích năm 215", focus: "hefei",
      story: "Lực lượng xuất kích bị quân Tôn bao vây. Trương Liêu phá được vòng vây rồi quay lại cứu những người còn mắc kẹt, sau đó đưa quân về thành. Thành công này củng cố tinh thần phòng thủ; cuộc vây đánh vẫn tiếp tục chứ chưa kết thúc ngay sau đòn phản kích.", routes: [] },
    { after: 2, title: "Chủ lực Ngô rút trước", date: "Năm 215 · Kết thúc vây thành", focus: "hefei",
      story: "Sau hơn mười ngày không hạ được thành, Tôn Quyền cho lực lượng chủ yếu rời chiến trường. Bản thân ông còn ở phía sau với một bộ phận ít quân. Sự giãn cách giữa chủ lực và bộ phận đi sau tạo cơ hội để Trương Liêu tiếp tục truy kích.",
      routes: [{ faction: "wu", kind: "retreat", places: ["hefei", "ruxu"], label: "Hướng quân Ngô rút về Giang Đông" }] },
    { after: 3, title: "Giữ được cửa ngõ Hoài Nam", date: "Sau trận năm 215", focus: "hefei",
      story: "Tôn Quyền thoát khỏi cuộc truy kích, nhưng chiến dịch không chiếm được Hợp Phì. Thành vẫn chặn hướng tiến từ Giang Đông lên Hoài Nam. Những cuộc giao tranh về sau quanh Hợp Phì và Nhu Tu cho thấy đây là tuyến chiến lược lâu dài, không chỉ là nơi diễn ra một trận đánh đơn lẻ.",
      cast: [{ person: "liao", place: "hefei", action: "Giữ vững thành Hợp Phì" }, { person: "sun", place: "ruxu", action: "Thu lực lượng về Giang Đông" }], routes: [] },
  ],
  "di-lang": [
    { after: 0, title: "Tuyến tiến quân từ Bạch Đế xuống Di Lăng", date: "Nửa cuối năm 221", focus: "yiling",
      story: "Quân Thục tiến theo hướng Trường Giang, đẩy lực lượng Ngô về tuyến phòng thủ phía trong. Càng đi về phía đông, đường liên lạc với căn cứ phía tây càng dài. Bạch Đế giữ vai trò cửa ngõ phía sau, còn Di Lăng trở thành khu vực quyết định hướng tiến tiếp theo.",
      routes: [{ faction: "shuhan", kind: "march", places: ["baidi", "yiling"], label: "Hướng đông tiến khái quát của quân Thục" }] },
    { after: 1, title: "Doanh trại trải dài trên bộ", date: "Đầu năm 222", focus: "xiaoting",
      story: "Lưu Bị chuyển lực lượng sang đóng trại trên bộ, trải các doanh dọc hướng Di Lăng – Hào Đình. Đội hình dài làm việc hỗ trợ giữa các trại và bảo vệ tuyến tiếp tế khó khăn hơn. Cuộc chiến chuyển từ tiến quân nhanh sang một thế đối đầu kéo dài.",
      routes: [{ faction: "shuhan", kind: "supply", places: ["baidi", "yiling", "xiaoting"], label: "Trục liên lạc, tiếp tế của quân Thục" }] },
    { after: 1, title: "Không giao chiến theo nhịp của Lưu Bị", date: "Xuân – hè 222", focus: "xiaoting",
      story: "Lục Tốn không đáp lại những nỗ lực kéo quân Ngô ra quyết chiến. Thời gian kéo dài làm quân Thục mệt mỏi trong khi cách bố trí trại bộc lộ điểm yếu. Phòng ngự có chủ đích cho phép quân Ngô lựa chọn thời điểm thay đổi thế trận.", routes: [] },
    { after: 1, title: "Thăm dò để chuẩn bị hỏa công", date: "Năm 222 · Trước phản công", focus: "xiaoting",
      story: "Sau những cuộc thăm dò cách đánh trại, Lục Tốn chuẩn bị đòn hỏa công và tiến công phối hợp. Mục tiêu là làm đứt sự hỗ trợ giữa các doanh, khiến một vị trí bị phá có thể kéo theo các vị trí khác. Quân Ngô bắt đầu chuyển từ chờ đợi sang chủ động đánh.", routes: [] },
    { after: 2, title: "Thu quân giữa lúc các trại tan vỡ", date: "Năm 222 · Sau đòn phản công", focus: "yiling",
      story: "Lưu Bị phải tập hợp những lực lượng còn lại và tìm đường rút về phía tây. Quân Ngô tiếp tục gây sức ép trong khi chuỗi doanh trại không còn giữ được. Bảo vệ đường trở lại Bạch Đế thay thế mục tiêu tiến đánh Giang Lăng của cuộc đông chinh ban đầu.",
      cast: [{ person: "liu", place: "yiling", action: "Thu quân, bảo vệ đường rút" }, { person: "luxun", place: "xiaoting", action: "Củng cố thắng lợi phản công" }],
      routes: [{ faction: "shuhan", kind: "retreat", places: ["xiaoting", "yiling", "baidi"], label: "Quân Thục rút về phía tây" }] },
  ],
  "nhai-dinh": [
    { after: 0, title: "Ba quận hưởng ứng, Ngụy điều quân", date: "Xuân 228 · Giai đoạn đầu", focus: "qishan",
      story: "Nam An, Thiên Thủy và An Định hưởng ứng quân Thục, làm tình hình Lũng Hữu thay đổi nhanh. Ngụy điều lực lượng đối phó, trong đó có Trương Cáp. Lợi thế ban đầu chỉ có thể duy trì nếu quân Thục giữ được đường liên lạc và ngăn được viện quân vào khu vực.", routes: [] },
    { after: 1, title: "Mã Tắc bỏ đường, đóng quân trên núi", date: "Xuân 228 · Trước giao chiến", focus: "jiating",
      story: "Mã Tắc không làm theo cách bố trí được chỉ dẫn, đưa lực lượng lên núi thay vì giữ vững tuyến đường. Vương Bình can gián nhưng không được chấp nhận. Trận địa trên cao có vẻ lợi về địa hình, song lại khiến nguồn nước và đường rút dễ bị đe dọa.", routes: [] },
    { after: 1, title: "Trương Cáp cắt đường lấy nước", date: "Xuân 228 · Mở đòn đánh", focus: "jiating",
      story: "Trương Cáp đánh vào điểm yếu trong cách đóng quân của Mã Tắc, cắt đường lấy nước và gây sức ép lên trận địa. Thiếu nước làm lực lượng giữ núi mất khả năng duy trì đội hình. Thất bại ở một vị trí chặn viện bắt đầu đe dọa toàn bộ thế tiến công của Thục.", routes: [] },
    { after: 2, title: "Vương Bình thu nhận quân tan", date: "Xuân 228 · Sau trận thua", focus: "jiating",
      story: "Vương Bình giữ được bộ phận lực lượng của mình, dùng nghi binh hạn chế quân Ngụy truy đuổi rồi thu nhận quân tan. Biện pháp này giảm hậu quả trực tiếp của trận thua, nhưng không thể khôi phục vị trí chặn viện đã mất. Gia Cát Lượng phải tổ chức rút chủ lực.", routes: [] },
    { after: 3, title: "Nhận trách nhiệm, chấn chỉnh việc dùng người", date: "Năm 228 · Sau chiến dịch", focus: "hanzhong",
      story: "Gia Cát Lượng nhận trách nhiệm về việc dùng người và tổ chức lại lực lượng. Cuộc Bắc phạt lần đầu kết thúc, nhưng hoạt động chuẩn bị cho các chiến dịch sau vẫn tiếp tục. Nhai Đình cho thấy giữ tuyến liên lạc và chấp hành bố trí có thể quyết định kết quả của một cuộc tiến công lớn.",
      cast: [{ person: "zhuge", place: "hanzhong", action: "Nhận trách nhiệm và chấn chỉnh lực lượng" }, { person: "jiang", place: "hanzhong", action: "Ở lại phục vụ Thục" }], routes: [] },
  ],
};

const sources: Record<string, string> = { "quan-do": "01", "xich-bich": "54", "hop-phi": "17", "di-lang": "58", "nhai-dinh": "35" };
export const battleChronicleSource = (id: string) => ({ name: "Tam quốc chí · Sử liệu diễn biến", url: `https://zh.wikisource.org/wiki/三國志/卷${sources[id]}` });

export function expandThreeKingdomsBattle(id: string, events: Event[]): Event[] {
  const kinds: Record<string, BattleAction[]> = {
    "quan-do": ["march", "march", "attack", "retreat"], "xich-bich": ["march", "defend", "attack", "retreat"],
    "hop-phi": ["march", "attack", "defend", "retreat"], "di-lang": ["march", "march", "attack", "retreat"], "nhai-dinh": ["march", "defend", "attack", "retreat"],
  };
  return events.flatMap((event, index) => [
    { ...event, routes: event.routes?.map((route) => ({ ...route, kind: route.kind ?? kinds[id]?.[index] ?? "march" })) },
    ...(details[id] ?? []).filter((detail) => detail.after === index).map((detail) => ({ ...event, title: detail.title, date: detail.date, story: detail.story, focus: detail.focus, cast: detail.cast ?? event.cast, routes: detail.routes ?? event.routes })),
  ]);
}
