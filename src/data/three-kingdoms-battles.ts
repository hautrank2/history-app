import { threeKingdomsScenes, type ThreeKingdomsScene } from "~/data/three-kingdoms";
import { expandThreeKingdomsBattle, battleChronicleSource } from "~/data/three-kingdoms-battle-expansion";

// Each battle has its own chronology; the period overview keeps its summary scenes.
type BattleEvent = Pick<ThreeKingdomsScene, "title" | "date" | "story" | "focus" | "cast"> &
  Pick<Partial<ThreeKingdomsScene>, "routes">;
const events: Record<string, BattleEvent[]> = {
  "quan-do": [
    { title: "Hai thế lực đối đầu", date: "Năm 200", focus: "baima",
      story: "Viên Thiệu kiểm soát vùng đất rộng lớn phía bắc Hoàng Hà và đưa quân xuống phía nam. Tào Tháo phải giữ đường về huyện Hứa, chọn Quan Độ làm vị trí đối đầu với quân Viên.",
      cast: [{ person: "yuan", place: "baima", action: "Đưa quân tiến xuống phía nam" }, { person: "cao", place: "guandu", action: "Tổ chức phòng ngự trên hướng về huyện Hứa" }],
      routes: [{ faction: "yuan", places: ["ye", "baima"], label: "Quân Viên tiến về Hoàng Hà" }] },
    { title: "Giằng co tại Quan Độ", date: "Năm 200 · Giai đoạn đối đầu", focus: "guandu",
      story: "Hai bên tập trung lực lượng tại Quan Độ. Quân Tào giữ chiến tuyến trước sức ép của quân Viên; cuộc đối đầu kéo dài khiến việc bảo đảm lương thực trở thành yếu tố quyết định.",
      cast: [{ person: "cao", place: "guandu", action: "Giữ chiến tuyến Quan Độ" }, { person: "yuan", place: "guandu", action: "Gây sức ép lên tuyến phòng ngự của Tào Tháo" }],
      routes: [{ faction: "yuan", places: ["baima", "guandu"], label: "Hướng tiến của quân Viên" }] },
    { title: "Tập kích kho lương Ô Sào", date: "Cuối năm 200", focus: "wuchao",
      story: "Tào Tháo chuyển mũi đánh sang kho lương Ô Sào của Viên Thiệu. Cuộc tập kích phá nguồn tiếp tế, khiến thế trận của quân Viên ở Quan Độ mất chỗ dựa.",
      cast: [{ person: "cao", place: "wuchao", action: "Tập kích kho lương" }, { person: "yuan", place: "guandu", action: "Chiến tuyến bị đe dọa khi mất nguồn tiếp tế" }],
      routes: [{ faction: "cao", places: ["guandu", "wuchao"], label: "Quân Tào tập kích Ô Sào" }] },
    { title: "Quân Viên tan vỡ", date: "Cuối năm 200 · Kết quả", focus: "guandu",
      story: "Sau thất bại ở Ô Sào, quân Viên tan vỡ và Viên Thiệu rút về phía bắc. Quan Độ tạo bước ngoặt có lợi cho Tào Tháo; việc thâu tóm Hà Bắc còn tiếp diễn trong những năm sau.",
      cast: [{ person: "cao", place: "guandu", action: "Giành ưu thế sau trận quyết chiến" }, { person: "yuan", place: "ye", action: "Rút về căn cứ ở Hà Bắc" }],
      routes: [{ faction: "yuan", places: ["guandu", "ye"], label: "Quân Viên rút về phía bắc" }] },
  ],
  "xich-bich": [
    { title: "Liên minh Tôn – Lưu", date: "Trước trận · Năm 208", focus: "xiakou",
      story: "Sau khi Tào Tháo tiến vào Kinh Châu, Lưu Bị rút về Hạ Khẩu. Tôn Quyền quyết định liên minh với Lưu Bị, giao Chu Du chỉ huy lực lượng chống quân Tào trên Trường Giang.",
      cast: [{ person: "liu", place: "xiakou", action: "Liên kết với Tôn Quyền để chống Tào" }, { person: "zhou", place: "xiakou", action: "Chỉ huy quân Tôn Quyền tiến lên chiến trường" }],
      routes: [{ faction: "wu", places: ["xiakou", "chibi"], label: "Liên quân tiến về Xích Bích" }] },
    { title: "Đối đầu trên Trường Giang", date: "Đông 208 · Giao chiến", focus: "chibi",
      story: "Quân Chu Du giao chiến với lực lượng Tào tại Xích Bích. Quân Tào lui sang phía Ô Lâm ở bờ bắc; liên quân giữ thế đối diện trên sông và chuẩn bị đòn tiến công vào đội thuyền.",
      cast: [{ person: "cao", place: "wulin", action: "Lực lượng Tào ở bờ bắc Trường Giang" }, { person: "zhou", place: "chibi", action: "Tổ chức thế trận đối diện quân Tào" }, { person: "liu", place: "chibi", action: "Phối hợp cùng quân Tôn Quyền", regional: true }], routes: [] },
    { title: "Hoàng Cái dùng thuyền lửa", date: "Đông 208 · Hỏa công", focus: "wulin",
      story: "Hoàng Cái dùng những thuyền mang vật liệu dễ cháy tiến vào đội thuyền đối phương. Lửa lan sang chiến thuyền và doanh trại ven bờ. Quân Chu Du phối hợp tiến công, phá vỡ thế trận của quân Tào.",
      cast: [{ person: "zhou", place: "chibi", action: "Phối hợp tiến công khi hỏa công phát huy tác dụng" }, { person: "cao", place: "wulin", action: "Đội thuyền và doanh trại bị hỏa công uy hiếp" }],
      routes: [{ faction: "wu", places: ["chibi", "wulin"], label: "Hướng tiến công khái quát của thuyền lửa" }] },
    { title: "Tào Tháo rút quân", date: "Sau trận · Cuối năm 208", focus: "jiangling",
      story: "Tào Tháo rút quân khỏi chiến trường, để lực lượng tiếp tục giữ các vị trí ở Kinh Châu. Chiến thắng Xích Bích chặn đà tiến xuống phía nam của Tào, mở cơ hội cho Tôn Quyền và Lưu Bị mở rộng thế lực.",
      cast: [{ person: "cao", place: "jiangling", action: "Rút lực lượng sau thất bại" }, { person: "zhou", place: "chibi", action: "Giữ ưu thế trên trung lưu Trường Giang" }, { person: "liu", place: "xiakou", action: "Củng cố lực lượng sau chiến thắng", regional: true }],
      routes: [{ faction: "cao", places: ["wulin", "jiangling"], label: "Hướng rút của quân Tào" }] },
  ],
  "hop-phi": [
    { title: "Tôn Quyền vây Hợp Phì", date: "Năm 215 · Mở đầu", focus: "hefei",
      story: "Tôn Quyền đưa quân từ Giang Đông tiến đánh Hợp Phì, vị trí án ngữ đường lên Hoài Nam. Trương Liêu, Lý Điển và Nhạc Tiến tổ chức giữ thành trước lực lượng vây đánh.",
      cast: [{ person: "sun", place: "hefei", action: "Đưa quân vây Hợp Phì" }, { person: "liao", place: "hefei", action: "Cùng Lý Điển và Nhạc Tiến giữ thành" }],
      routes: [{ faction: "wu", places: ["jianye", "hefei"], label: "Tôn Quyền tiến đánh Hợp Phì" }] },
    { title: "Trương Liêu xuất kích", date: "Năm 215 · Phản kích", focus: "hefei",
      story: "Khi quân đối phương chưa ổn định, Trương Liêu dẫn lực lượng ra khỏi thành đánh vào quân Tôn Quyền. Đòn phản kích gây rối loạn đội hình vây thành và củng cố tinh thần quân phòng thủ.",
      cast: [{ person: "liao", place: "hefei", action: "Dẫn quân chủ động phản kích" }, { person: "sun", place: "hefei", action: "Đối phó cuộc xuất kích từ trong thành" }], routes: [] },
    { title: "Cuộc vây thành kéo dài", date: "Năm 215 · Giằng co", focus: "hefei",
      story: "Sau đòn xuất kích, quân giữ thành tiếp tục phòng ngự. Tôn Quyền không hạ được Hợp Phì và quyết định rút quân, chuyển trận đánh từ vây thành sang cuộc rút lui.",
      cast: [{ person: "liao", place: "hefei", action: "Giữ vững thành Hợp Phì" }, { person: "sun", place: "hefei", action: "Quyết định lui quân về Giang Đông" }], routes: [] },
    { title: "Truy kích ở Tiêu Diêu Tân", date: "Năm 215 · Kết thúc", focus: "hefei",
      story: "Trương Liêu truy đánh khi quân Ngô rút qua Tiêu Diêu Tân gần Hợp Phì. Tôn Quyền phải vượt cầu thoát thân. Thành Hợp Phì vẫn nằm trong tay quân Tào, ngăn hướng tiến lên Hoài Nam của họ Tôn.",
      cast: [{ person: "liao", place: "hefei", action: "Truy kích quân rút lui ở Tiêu Diêu Tân" }, { person: "sun", place: "hefei", action: "Vượt cầu thoát khỏi cuộc truy kích" }], routes: [] },
  ],
  "di-lang": [
    { title: "Lưu Bị đông chinh", date: "Năm 221", focus: "baidi",
      story: "Sau khi mất Kinh Châu và Quan Vũ, Lưu Bị quyết định đánh Ngô. Trương Phi bị sát hại trước cuộc xuất quân, nhưng chiến dịch vẫn tiếp tục theo hướng từ Bạch Đế xuống trung lưu Trường Giang.",
      cast: [{ person: "liu", place: "baidi", action: "Tổ chức đông chinh đánh Ngô" }, { person: "sun", place: "wuchang", action: "Tổ chức phòng thủ trước quân Thục" }],
      routes: [{ faction: "shuhan", places: ["baidi", "yiling"], label: "Quân Thục tiến về Di Lăng" }] },
    { title: "Lục Tốn giữ thế phòng ngự", date: "Đầu năm 222", focus: "xiaoting",
      story: "Lục Tốn chỉ huy quân Ngô chặn cuộc tiến công. Quân Thục lập các doanh trại kéo dài theo hướng Trường Giang. Lục Tốn chờ thời cơ thay vì lập tức quyết chiến với đối phương.",
      cast: [{ person: "liu", place: "xiaoting", action: "Đóng quân trên tuyến Di Lăng – Hào Đình" }, { person: "luxun", place: "xiaoting", action: "Giữ thế phòng ngự, chờ thời cơ phản công" }],
      routes: [{ faction: "shuhan", places: ["yiling", "xiaoting"], label: "Tuyến đóng quân khái quát của quân Thục" }] },
    { title: "Hỏa công phá doanh trại", date: "Năm 222 · Phản công", focus: "xiaoting",
      story: "Khi quân Thục đã dàn dài và chiến dịch kéo dài, Lục Tốn chuyển sang phản công. Quân Ngô dùng hỏa công đánh các doanh trại, phá vỡ phòng tuyến và khiến quân Lưu Bị thất bại.",
      cast: [{ person: "luxun", place: "xiaoting", action: "Dùng hỏa công, đánh phá các trại Thục" }, { person: "liu", place: "xiaoting", action: "Thế trận tan vỡ trước cuộc phản công" }], routes: [] },
    { title: "Rút về Bạch Đế", date: "Năm 222 · Kết quả", focus: "baidi",
      story: "Lưu Bị rút về Bạch Đế sau thất bại. Cuộc đông chinh không giành lại được Kinh Châu; Thục phải phục hồi lực lượng trong khi Ngô giữ được tuyến phòng thủ phía tây.",
      cast: [{ person: "liu", place: "baidi", action: "Rút về Bạch Đế" }, { person: "luxun", place: "yiling", action: "Giữ vững mặt trận phía tây của Ngô" }],
      routes: [{ faction: "shuhan", places: ["xiaoting", "yiling", "baidi"], label: "Quân Thục rút về Bạch Đế" }] },
  ],
  "nhai-dinh": [
    { title: "Bắc phạt lần thứ nhất", date: "Xuân 228 · Xuất quân", focus: "qishan",
      story: "Gia Cát Lượng đưa quân từ Hán Trung đánh Kỳ Sơn. Ba quận ở Lũng Hữu hưởng ứng, buộc Ngụy tổ chức đối phó. Nhai Đình trở thành vị trí quan trọng trên hướng quân tiếp viện tiến vào khu vực.",
      cast: [{ person: "zhuge", place: "qishan", action: "Chỉ huy cuộc Bắc phạt" }, { person: "zhanghe", place: "changan", action: "Tham gia lực lượng Ngụy đối phó quân Thục" }],
      routes: [{ faction: "shuhan", places: ["hanzhong", "qishan"], label: "Quân Thục tiến đánh Kỳ Sơn" }] },
    { title: "Mã Tắc giữ Nhai Đình", date: "Xuân 228 · Bố trí", focus: "jiating",
      story: "Mã Tắc được giao giữ Nhai Đình để bảo vệ thế phối hợp của quân Thục. Trương Cáp tiến đánh vị trí này; kết quả ở Nhai Đình sẽ ảnh hưởng trực tiếp tới cuộc tiến quân của Gia Cát Lượng.",
      cast: [{ person: "masu", place: "jiating", action: "Nhận nhiệm vụ giữ Nhai Đình" }, { person: "zhanghe", place: "jiating", action: "Tiến đánh lực lượng giữ Nhai Đình" }], routes: [] },
    { title: "Nhai Đình thất thủ", date: "Xuân 228 · Giao chiến", focus: "jiating",
      story: "Trương Cáp đánh bại quân Mã Tắc tại Nhai Đình. Thất bại làm đứt thế phối hợp, khiến quân Thục không thể duy trì cuộc tiến công ở Lũng Hữu như dự định.",
      cast: [{ person: "zhanghe", place: "jiating", action: "Đánh bại quân giữ Nhai Đình" }, { person: "masu", place: "jiating", action: "Thất bại và mất vị trí phòng giữ" }, { person: "zhuge", place: "qishan", action: "Phải tính đến việc rút quân" }], routes: [] },
    { title: "Quân Thục lui về Hán Trung", date: "Sau trận · Năm 228", focus: "hanzhong",
      story: "Gia Cát Lượng rút quân về Hán Trung, cuộc Bắc phạt lần đầu kết thúc. Mã Tắc bị xử tội vì thất bại. Khương Duy theo về Thục trong chiến dịch này, sau đó trở thành một tướng lĩnh quan trọng.",
      cast: [{ person: "zhuge", place: "hanzhong", action: "Thu quân về Hán Trung" }, { person: "masu", place: "jiating", action: "Bị xử tội sau thất bại", deceased: true }, { person: "jiang", place: "hanzhong", action: "Theo quân Thục trở về" }],
      routes: [{ faction: "shuhan", places: ["qishan", "hanzhong"], label: "Quân Thục rút về Hán Trung" }] },
  ],
};

export function threeKingdomsBattleScenes(battleId: string): ThreeKingdomsScene[] {
  const overview = threeKingdomsScenes.find((scene) => scene.id === battleId);
  if (!overview) return [];
  return expandThreeKingdomsBattle(battleId, events[battleId] ?? []).map((event, index) => ({
    ...overview, ...event, id: index === 0 ? battleId : `${battleId}-${index + 1}`,
    chapter: overview.title, nearby: [...new Set([overview.focus, ...overview.nearby])], source: battleChronicleSource(battleId),
  }));
}
