import { getCharacter } from "~/data/characters";
import warlords from "~/data/database/warlord.json";
import { historicalEvents } from "~/data/events";

export type OverviewPlaceModel = {
  name: string;
  at: [number, number];
  kind: "capital" | "battle" | "camp" | "heritage";
  detail: string;
  subtitle?: string;
  leader?: { id: string; name: string; wiki: string };
  eventId?: string;
};

export type OverviewPersonModel = {
  id: string;
  name: string;
  role: string;
  wiki: string;
  side?: "opponent";
};

export type OverviewSceneModel = {
  id: string;
  era: string;
  years: string;
  year: number;
  title: string;
  nation: string;
  capital: string;
  territory: "ancient" | "north" | "nanyue" | "ly" | "tran" | "le" | "split" | "full" | "partition";
  extent: string;
  summary: string;
  culture: { title: string; text: string };
  conflict?: { title: string; text: string };
  storySections?: { title: string; text: string }[];
  geographySections?: { title: string; text: string }[];
  people: OverviewPersonModel[];
  places: OverviewPlaceModel[];
  sources: string[];
};

export const wikiUrl = (title: string) => `https://vi.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;

const place = (name: string, at: [number, number], kind: OverviewPlaceModel["kind"], detail: string, options: Pick<OverviewPlaceModel, "subtitle" | "leader" | "eventId"> = {}): OverviewPlaceModel => ({ name, at, kind, detail, ...options });
const person = (id: string, role: string, side?: "opponent"): OverviewPersonModel => ({ ...getCharacter(id), role, side });
const thangLong = place("Thăng Long", [105.84, 21.03], "capital", "Trung tâm chính trị ở đồng bằng sông Hồng; nay là Hà Nội.", { subtitle: "Thủ đô" });
const hoaLu = place("Hoa Lư", [105.91, 20.28], "capital", "Kinh đô nhà Đinh và Tiền Lê, được bảo vệ bởi núi đá vôi.");
const coLoa = place("Cổ Loa", [105.87, 21.11], "capital", "Tòa thành nhiều vòng ở Đông Anh, Hà Nội; trung tâm của Âu Lạc và nhà Ngô.");
const hue = place("Phú Xuân · Huế", [107.58, 16.47], "capital", "Trung tâm của Đàng Trong, Tây Sơn và kinh đô nhà Nguyễn.");
const bachDang = place("Bạch Đằng", [106.78, 20.94], "battle", "Vùng cửa sông gắn với các chiến thắng năm 938, 981 và 1288.");
const lamSon = place("Lam Sơn", [105.41, 19.94], "camp", "Căn cứ khởi nghĩa của Lê Lợi ở Thanh Hóa.", { subtitle: "Căn cứ khởi nghĩa", leader: getCharacter("le-loi") });
const saiGon = place("Sài Gòn", [106.7, 10.78], "heritage", "Trung tâm ở Nam Bộ; mang tên Thành phố Hồ Chí Minh từ năm 1976.");

// Mỗi cảnh dùng phạm vi tiêu biểu, không mặc định lãnh thổ cực đại cho cả triều đại.
const scenes: OverviewSceneModel[] = [
  {
    id: "van-lang", era: "Hùng Vương", years: "Khoảng TK VII–III TCN", year: -500,
    title: "Từ những làng ven sông, một cội nguồn", nation: "Văn Lang", capital: "Phong Châu (theo sử truyền)", territory: "ancient", extent: "Vùng cư trú cốt lõi ở Bắc Bộ và Bắc Trung Bộ; ranh giới chưa xác định.",
    summary: "Truyền thống Việt Nam gắn nước Văn Lang với các vua Hùng và kinh đô Phong Châu. Khảo cổ học cho thấy các cộng đồng nông nghiệp và luyện kim phát triển ở lưu vực sông Hồng, sông Mã. Mốc 2879 TCN thuộc hệ niên đại truyền thuyết, chưa được khảo cổ xác nhận.",
    culture: { title: "Trống đồng và văn minh lúa nước", text: "Văn hóa Đông Sơn nổi bật với trống đồng, công cụ đồng, thuyền và hình ảnh sinh hoạt cộng đồng. Tín ngưỡng thờ tổ tiên, chuyện Lạc Long Quân – Âu Cơ trở thành những lớp ký ức về nguồn cội; không phải mọi truyền thuyết đều là sự kiện đã kiểm chứng." },
    people: [person("hung-vuong", "Danh xưng các vua trong truyền thống dựng nước")],
    places: [place("Phong Châu", [105.3, 21.36], "capital", "Vùng Phú Thọ được sử truyền gắn với kinh đô Văn Lang."), place("Đông Sơn", [105.78, 19.82], "heritage", "Địa điểm khảo cổ ở Thanh Hóa, đặt tên cho văn hóa Đông Sơn.")],
    sources: ["Hồng Bàng", "Văn Lang", "Văn hóa Đông Sơn"],
  },
  {
    id: "au-lac", era: "Nhà Thục", years: "TK III TCN – khoảng 179 TCN", year: -200,
    title: "Những vòng thành giữ nước Âu Lạc", nation: "Âu Lạc", capital: "Cổ Loa", territory: "ancient", extent: "Bắc Bộ và một phần Bắc Trung Bộ; niên đại và ranh giới còn được thảo luận.",
    summary: "An Dương Vương, tức Thục Phán, lập nước Âu Lạc sau Văn Lang và xây trung tâm quyền lực tại Cổ Loa. Thành đất, hào nước cùng các phát hiện mũi tên đồng cho thấy khả năng tổ chức xây dựng và quân sự. Niên đại thành lập thường được ghi khác nhau, như 257 hoặc 208 TCN.",
    culture: { title: "Kỹ thuật thành lũy và nỏ đồng", text: "Cổ Loa thể hiện bước tiến trong kiến trúc phòng thủ và đúc vũ khí. Chuyện nỏ thần, Mỵ Châu – Trọng Thủy lưu lại bài học giữ nước trong văn học dân gian, cần phân biệt với bằng chứng khảo cổ." },
    conflict: { title: "Nam Việt thôn tính Âu Lạc", text: "Triệu Đà, người lập nước Nam Việt ở Phiên Ngung, tiến đánh và sáp nhập Âu Lạc, thường được đặt vào khoảng 179 TCN. Câu chuyện hôn nhân và đánh tráo lẫy nỏ thuộc truyền thuyết." },
    people: [person("an-duong-vuong", "Vua Âu Lạc, xây thành Cổ Loa"), person("trieu-da", "Người đứng đầu Nam Việt, thôn tính Âu Lạc", "opponent")],
    places: [coLoa, place("Phiên Ngung", [113.26, 23.13], "heritage", "Kinh đô Nam Việt, thuộc Quảng Châu ngày nay.")], sources: ["Âu Lạc", "An Dương Vương", "Thành Cổ Loa"],
  },
  {
    id: "nam-viet", era: "Nhà Triệu", years: "Khoảng 179–111 TCN tại Âu Lạc", year: -150,
    title: "Âu Lạc trong vương quốc Nam Việt", nation: "Nam Việt", capital: "Phiên Ngung", territory: "nanyue", extent: "Phác họa cả vương quốc Nam Việt, gồm Lưỡng Quảng và vùng Âu Lạc; không đồng nhất với Việt Nam.",
    summary: "Nhà Triệu cai trị Nam Việt từ năm 204 TCN và kiểm soát vùng Âu Lạc sau cuộc thôn tính. Vị trí của nhà Triệu trong lịch sử Việt Nam là vấn đề có nhiều cách nhìn: sử truyền từng xếp vào chính thống, trong khi nhiều nghiên cứu xem đây là sự cai trị từ bên ngoài. Năm 111 TCN, nhà Hán chinh phục Nam Việt.",
    culture: { title: "Giao thoa Việt và Hán", text: "Di vật Nam Việt thể hiện sự kết hợp giữa truyền thống bản địa và văn hóa Hán. Đây là một vương quốc đa cộng đồng, không thể diễn giải bằng biên giới quốc gia hiện nay." },
    conflict: { title: "Nhà Hán tiến xuống phương nam", text: "Hán Vũ Đế phát động chiến dịch; Lộ Bác Đức và Dương Bộc tham gia chỉ huy. Nam Việt bị xóa bỏ, các vùng đất được tổ chức thành quận thuộc đế quốc Hán." },
    people: [person("trieu-da", "Người sáng lập Nam Việt"), person("han-vu-de", "Hoàng đế ra lệnh chinh phục Nam Việt", "opponent")],
    places: [place("Phiên Ngung", [113.26, 23.13], "capital", "Kinh đô Nam Việt, nay thuộc Quảng Châu."), place("Cổ Loa", [105.87, 21.11], "heritage", "Trung tâm cũ của Âu Lạc trong vùng do Nam Việt kiểm soát.")], sources: ["Nhà Triệu", "Nam Việt", "Chiến tranh Hán–Nam Việt"],
  },
  {
    id: "bac-thuoc-han", era: "Bắc thuộc I", years: "111 TCN – 40", year: 1,
    title: "Những quận huyện dưới quyền nhà Hán", nation: "Giao Chỉ · Cửu Chân · Nhật Nam", capital: "Trị sở quận, không có kinh đô độc lập", territory: "north", extent: "Vùng quận phía nam của đế quốc Hán; tô vùng Bắc Bộ – Bắc Trung Bộ để định vị.",
    summary: "Sau khi Nam Việt mất, nhà Hán đặt các quận ở vùng đất Việt. Chính quyền đô hộ áp đặt thuế, cống nạp và bộ máy quan lại, trong khi các cộng đồng bản địa vẫn duy trì nhiều tập tục. Mâu thuẫn với tầng lớp thủ lĩnh địa phương dẫn đến các cuộc nổi dậy.",
    culture: { title: "Chữ Hán, kỹ thuật sắt và giao lưu", text: "Chữ Hán, thiết chế hành chính và tư tưởng từ phương bắc dần đi vào đời sống. Sự tiếp nhận diễn ra không đồng đều; tiếng nói, tập tục và cấu trúc làng bản địa vẫn tồn tại." },
    conflict: { title: "Chính quyền đô hộ Hán", text: "Thái thú Tô Định là đại diện chính quyền ở Giao Chỉ trước khởi nghĩa năm 40. Sử truyền mô tả sự cai trị hà khắc của ông như một nguyên nhân trực tiếp làm bùng nổ khởi nghĩa Hai Bà Trưng." },
    people: [person("trung-trac", "Thủ lĩnh bản địa, chuẩn bị khởi nghĩa")],
    places: [place("Luy Lâu", [106.07, 21.04], "heritage", "Trung tâm hành chính và giao thương quan trọng ở Bắc Ninh."), place("Mê Linh · Khởi nghĩa Hai Bà Trưng", [105.73, 21.18], "heritage", "Quê hương và địa bàn khởi nghĩa Hai Bà Trưng.", { eventId: "hai-ba-trung" })], sources: ["Bắc thuộc lần thứ nhất", "Tô Định"],
  },
  {
    id: "hai-ba-trung", era: "Trưng Nữ Vương", years: "40–43", year: 40,
    title: "Hai người phụ nữ phất cờ tự chủ", nation: "Chính quyền Trưng Vương", capital: "Mê Linh", territory: "north", extent: "Vùng nổi dậy và giành quyền kiểm soát biến động, không phải biên giới ổn định.",
    summary: "Năm 40, Trưng Trắc và Trưng Nhị khởi nghĩa, đánh đuổi Tô Định. Trưng Trắc được suy tôn làm vua, đặt trung tâm ở Mê Linh. Nền tự chủ tồn tại ngắn ngủi trước cuộc tái chinh phục của Đông Hán năm 42–43.",
    culture: { title: "Ký ức về những nữ thủ lĩnh", text: "Hai Bà cùng các nữ tướng trở thành biểu tượng trong tín ngưỡng thờ anh hùng và lễ hội địa phương. Hệ thống đền thờ được xây dựng qua nhiều thời kỳ về sau, không phải đều xuất hiện ngay trong thế kỷ I." },
    conflict: { title: "Mã Viện tái lập ách cai trị Đông Hán", text: "Mã Viện dẫn quân tiến vào Giao Chỉ, đánh bại lực lượng Trưng Vương. Sau chiến tranh, chính quyền Hán củng cố bộ máy và tăng kiểm soát đối với các thủ lĩnh bản địa." },
    people: [person("trung-trac", "Trưng Trắc và Trưng Nhị, lãnh đạo khởi nghĩa"), person("ma-vien", "Tướng Đông Hán chỉ huy cuộc tái chinh phục", "opponent")],
    places: [place("Mê Linh · Khởi nghĩa Hai Bà Trưng", [105.73, 21.18], "capital", "Trung tâm chính quyền Trưng Vương.", { eventId: "hai-ba-trung" }), place("Hát Môn", [105.58, 21.15], "heritage", "Địa điểm gắn với cuộc khởi nghĩa, nay có đền thờ Hai Bà.")], sources: ["Khởi nghĩa Hai Bà Trưng", "Mã Viện"],
  },
  {
    id: "bac-thuoc-2", era: "Bắc thuộc II", years: "43–544", year: 248,
    title: "Năm thế kỷ đô hộ và những ngọn lửa nổi dậy", nation: "Giao Châu", capital: "Các trị sở Giao Châu", territory: "north", extent: "Vùng cai trị thay đổi qua Đông Hán, Đông Ngô, Tấn và các triều Nam triều.",
    summary: "Sau Hai Bà Trưng, vùng đất Việt lần lượt chịu sự cai trị của các triều đại phương bắc. Năm 248, Triệu Thị Trinh cùng Triệu Quốc Đạt nổi dậy ở Cửu Chân. Cuộc khởi nghĩa bị đàn áp nhưng trở thành dấu mốc trong truyền thống chống đô hộ.",
    culture: { title: "Phật giáo ở Luy Lâu", text: "Giao Châu là điểm gặp của các tuyến giao thương và truyền bá Phật giáo. Luy Lâu trở thành một trung tâm Phật giáo sớm, với sự hiện diện của tăng sĩ và hoạt động dịch, giảng kinh." },
    conflict: { title: "Đông Ngô đàn áp khởi nghĩa năm 248", text: "Nhà Đông Ngô cử Lục Dận sang Giao Châu. Ông kết hợp sức mạnh quân sự và chiêu dụ để dập tắt các cuộc nổi dậy, khôi phục quyền kiểm soát của chính quyền đô hộ." },
    people: [person("ba-trieu", "Thủ lĩnh khởi nghĩa ở Cửu Chân năm 248"), person("si-nhiep", "Quan cai trị Giao Chỉ cuối thời Đông Hán")],
    places: [place("Luy Lâu", [106.07, 21.04], "heritage", "Trung tâm Phật giáo và giao lưu văn hóa sớm."), place("Núi Nưa", [105.58, 19.64], "battle", "Vùng Thanh Hóa gắn với khởi nghĩa Bà Triệu.")], sources: ["Bắc thuộc", "Bà Triệu", "Luy Lâu"],
  },
  {
    id: "van-xuan", era: "Tiền Lý · Triệu Việt Vương", years: "544–602", year: 550,
    title: "Vạn Xuân: lời tuyên bố về một nước tự chủ", nation: "Vạn Xuân", capital: "Vùng cửa sông Tô Lịch", territory: "north", extent: "Bắc Bộ và vùng lân cận; quyền kiểm soát thay đổi qua chiến tranh.",
    summary: "Lý Bí khởi nghĩa năm 542, xưng Lý Nam Đế và đặt quốc hiệu Vạn Xuân năm 544. Sau khi ông mất, Triệu Quang Phục tiếp tục kháng chiến. Về sau Lý Phật Tử giành quyền; đến năm 602, Vạn Xuân bị nhà Tùy chinh phục.",
    culture: { title: "Quốc hiệu và Phật giáo", text: "Quốc hiệu Vạn Xuân thể hiện khát vọng độc lập lâu dài. Việc dựng chùa Khai Quốc, tiền thân chùa Trấn Quốc theo truyền thống, gắn với thời Lý Nam Đế." },
    conflict: { title: "Nhà Lương, rồi nhà Tùy", text: "Trần Bá Tiên chỉ huy quân Lương đánh Lý Nam Đế. Triệu Quang Phục dựa vào đầm Dạ Trạch để chống lại. Năm 602, tướng Tùy Lưu Phương tiến quân, buộc Lý Phật Tử đầu hàng." },
    people: [person("ly-nam-de", "Người lập nước Vạn Xuân"), person("trieu-viet-vuong", "Triệu Quang Phục, kháng chiến ở Dạ Trạch"), person("tran-ba-tien", "Tướng nhà Lương tiến đánh Vạn Xuân", "opponent")],
    places: [place("Cửa sông Tô Lịch", [105.84, 21.03], "capital", "Vùng được ghi nhận là nơi Lý Nam Đế dựng trung tâm chính quyền."), place("Dạ Trạch", [105.94, 20.86], "camp", "Vùng đầm ở Hưng Yên, căn cứ của Triệu Quang Phục.", { subtitle: "Căn cứ kháng chiến", leader: getCharacter("trieu-viet-vuong") })], sources: ["Nhà Tiền Lý", "Triệu Việt Vương"],
  },
  {
    id: "bac-thuoc-3", era: "Bắc thuộc III", years: "602–905", year: 722,
    title: "Từ An Nam đô hộ phủ đến khát vọng tự chủ", nation: "Giao Châu · An Nam đô hộ phủ", capital: "Tống Bình · Đại La", territory: "north", extent: "Vùng do Tùy rồi Đường quản lý; ranh giới và mức độ kiểm soát thay đổi.",
    summary: "Nhà Tùy rồi nhà Đường đặt lại bộ máy đô hộ. Mai Thúc Loan khởi nghĩa năm 713 và xưng đế; Phùng Hưng nổi dậy cuối thế kỷ VIII. Những cuộc nổi dậy cùng sự suy yếu của nhà Đường tạo tiền đề cho thời kỳ tự chủ đầu thế kỷ X.",
    culture: { title: "Đại La trở thành một đô thị quan trọng", text: "Thành lũy và trị sở ở vùng Hà Nội được xây dựng, mở rộng qua các giai đoạn. Giao lưu tôn giáo và thương mại tiếp diễn; cộng đồng làng xã giữ vai trò quan trọng trong đời sống địa phương." },
    conflict: { title: "Quân Đường đàn áp và chiến tranh Nam Chiếu", text: "Dương Tư Húc đem quân đàn áp cuộc khởi nghĩa Mai Thúc Loan. Thế kỷ IX, Nam Chiếu đánh chiếm vùng An Nam; Cao Biền chỉ huy quân Đường tái chiếm và xây dựng thành Đại La." },
    people: [person("mai-thuc-loan", "Mai Hắc Đế, thủ lĩnh khởi nghĩa"), person("phung-hung", "Thủ lĩnh chống chính quyền Đường"), person("cao-bien", "Tướng Đường tái chiếm An Nam từ Nam Chiếu", "opponent")],
    places: [place("Đại La", [105.84, 21.03], "capital", "Trị sở quan trọng trước khi được đổi tên Thăng Long.", { subtitle: "Trị sở" }), place("Vạn An", [105.5, 18.7], "heritage", "Vùng Nam Đàn gắn với Mai Thúc Loan.")], sources: ["Bắc thuộc", "Mai Thúc Loan", "Phùng Hưng"],
  },
  {
    id: "khuc-duong", era: "Họ Khúc · Họ Dương", years: "905–938", year: 931,
    title: "Người Việt tự quản đất Việt", nation: "Tĩnh Hải quân tự chủ", capital: "Đại La", territory: "north", extent: "Vùng Tĩnh Hải quân ở Bắc Bộ và Bắc Trung Bộ.",
    summary: "Khúc Thừa Dụ nắm quyền năm 905; Khúc Hạo thực hiện cải cách hành chính và thuế khóa. Năm 930 Nam Hán đánh chiếm, bắt Khúc Thừa Mỹ. Dương Đình Nghệ giành lại Đại La năm 931, tiếp tục nền tự chủ trước khi bị Kiều Công Tiễn sát hại.",
    culture: { title: "Cải cách gần với đời sống làng xã", text: "Khúc Hạo sắp xếp lại đơn vị hành chính, điều chỉnh sưu thuế và hộ tịch. Quyền lực địa phương dần chuyển sang một bộ máy do người Việt điều hành." },
    conflict: { title: "Nam Hán tìm cách khôi phục quyền kiểm soát", text: "Lưu Nghiễm cho quân chiếm Tĩnh Hải quân năm 930. Dương Đình Nghệ đánh bại lực lượng chiếm đóng và viện binh, tạo nền tảng cho chiến thắng của Ngô Quyền sau đó." },
    people: [person("khuc-thua-du", "Người mở đầu thời tự chủ"), person("duong-dinh-nghe", "Giành lại Đại La năm 931")],
    places: [place("Đại La", [105.84, 21.03], "capital", "Trung tâm quyền lực của họ Khúc và Dương Đình Nghệ.", { subtitle: "Trị sở · trung tâm quyền lực" }), bachDang], sources: ["Họ Khúc", "Dương Đình Nghệ"],
  },
  {
    id: "ngo", era: "Nhà Ngô", years: "939–965", year: 939,
    title: "Bạch Đằng mở một kỷ nguyên độc lập", nation: "Chính quyền nhà Ngô", capital: "Cổ Loa", territory: "north", extent: "Bắc Bộ và Bắc Trung Bộ; quyền lực phân tán sau thời Ngô Quyền.",
    summary: "Năm 938, Ngô Quyền đánh bại quân Nam Hán trên sông Bạch Đằng. Năm 939 ông xưng vương, đóng đô ở Cổ Loa. Sau khi ông mất, tranh chấp trong triều và sự nổi lên của các thế lực địa phương dẫn đến cục diện mười hai sứ quân.",
    culture: { title: "Khôi phục vương quyền tự chủ", text: "Ngô Quyền đặt quan chức và nghi lễ triều đình. Việc chọn Cổ Loa gợi nối với ký ức Âu Lạc, đánh dấu bước chuyển từ quyền tiết độ sứ sang vương quyền độc lập." },
    conflict: { title: "Nam Hán và Lưu Hoằng Tháo", text: "Lưu Hoằng Tháo đem thủy quân vào Bạch Đằng. Ngô Quyền bố trí cọc, tận dụng thủy triều đánh tan hạm đội; Hoằng Tháo tử trận. Kế hoạch can thiệp của Nam Hán thất bại." },
    people: [person("ngo-quyen", "Vua sáng lập, người chỉ huy trận Bạch Đằng"), person("duong-tam-kha", "Nắm quyền sau khi Ngô Quyền mất")],
    places: [coLoa, bachDang], sources: ["Nhà Ngô", "Trận Bạch Đằng (938)"],
  },
  {
    id: "loan-12-su-quan", era: "Loạn 12 sứ quân", years: "966–968", year: 966,
    title: "Mười hai thế lực, một hành trình thống nhất", nation: "Tĩnh Hải quân · các thế lực cát cứ", capital: "Không có kinh đô thống nhất", territory: "north", extent: "Các căn cứ tiêu biểu trong cục diện cát cứ ở Bắc Bộ và Bắc Trung Bộ. Vùng tô không phải lãnh thổ do một sứ quân duy nhất kiểm soát; tọa độ căn cứ chỉ định vị gần đúng.",
    summary: "Sau khi Ngô Xương Văn mất năm 965, quyền lực trung ương tan rã; đến năm 966, cục diện mười hai sứ quân thể hiện rõ. Đinh Bộ Lĩnh dựa vào Hoa Lư, liên kết với Trần Lãm ở Bố Hải Khẩu rồi kết hợp đánh dẹp và chiêu hàng. Năm 968, ông thống nhất đất nước, lên ngôi hoàng đế và lập nhà Đinh.",
    culture: { title: "Hào trưởng và làng xã trong thời phân liệt", text: "Các thủ lĩnh dựa vào làng xã, thành lũy và những vùng có nguồn lực riêng để tập hợp quân dân. Ký ức về những người tham gia giai đoạn này còn lưu trong đền thờ, thần tích và lễ hội được hình thành qua nhiều đời sau." },
    conflict: { title: "Nội chiến giữa các thế lực địa phương", text: "Đây là xung đột trong nước. Đinh Bộ Lĩnh thu phục các lực lượng bằng liên minh, quân sự và thương lượng; Trần Lãm là một đồng minh quan trọng. Các chi tiết chiến dịch và cách xác định niên đại có khác biệt giữa những nguồn sử." },
    people: [person("dinh-bo-linh", "Thủ lĩnh Hoa Lư, người thống nhất đất nước"), person("tran-lam", "Sứ quân Bố Hải Khẩu, liên minh với Đinh Bộ Lĩnh"), person("ngo-xuong-xi", "Hậu duệ nhà Ngô, giữ Bình Kiều"), person("do-canh-thac", "Sứ quân giữ Đỗ Động Giang")],
    places: [place("Hoa Lư", [105.91, 20.28], "camp", "Căn cứ của Đinh Bộ Lĩnh, ngoài danh sách 12 sứ quân.", { leader: getCharacter("dinh-bo-linh"), subtitle: "Căn cứ thống nhất" }), ...warlords.map((base) => place(base.name, base.at as [number, number], "camp", `${getCharacter(base.characterId).name} cát cứ tại ${base.name}. Tọa độ căn cứ ước lượng, không phải ranh giới vùng kiểm soát.`, { leader: getCharacter(base.characterId), subtitle: "Căn cứ sứ quân" }))], sources: ["Loạn 12 sứ quân", "Đinh Bộ Lĩnh", "Trần Lãm"],
  },
  {
    id: "dinh", era: "Nhà Đinh", years: "968–980", year: 968,
    title: "Đại Cồ Việt và kinh đô giữa núi đá", nation: "Đại Cồ Việt", capital: "Hoa Lư", territory: "north", extent: "Quốc gia thống nhất sau cục diện mười hai sứ quân, chủ yếu ở Bắc Bộ – Bắc Trung Bộ.",
    summary: "Đinh Bộ Lĩnh dẹp các sứ quân, xưng hoàng đế năm 968, đặt quốc hiệu Đại Cồ Việt và đóng đô Hoa Lư. Triều đình xây dựng quân đội, bộ máy trung ương và quan hệ bang giao với nhà Tống. Biến cố ám sát năm 979 đưa triều đại vào khủng hoảng.",
    culture: { title: "Tiền Thái Bình hưng bảo", text: "Đồng tiền mang niên hiệu Thái Bình gắn với nhà Đinh là dấu mốc của tiền tệ quốc gia. Phật giáo và các tăng sĩ có vị trí đáng kể trong đời sống triều đình." },
    people: [person("dinh-bo-linh", "Đinh Bộ Lĩnh, hoàng đế sáng lập"), person("duong-van-nga", "Hoàng hậu, nhân vật trong chuyển giao Đinh – Lê")],
    places: [hoaLu, place("Trường Yên", [105.9, 20.29], "heritage", "Vùng cố đô, hiện còn hệ thống đền thờ vua Đinh – vua Lê.")], sources: ["Nhà Đinh", "Thái Bình hưng bảo", "Dương Vân Nga"],
  },
  {
    id: "tien-le", era: "Nhà Tiền Lê", years: "980–1009", year: 981,
    title: "Giữ nền độc lập trước quân Tống", nation: "Đại Cồ Việt", capital: "Hoa Lư", territory: "north", extent: "Bắc Bộ – Bắc Trung Bộ, trước các đợt mở rộng về phía nam thời Lý.",
    summary: "Lê Hoàn lên ngôi trong hoàn cảnh nhà Tống chuẩn bị tiến công. Năm 981, quân Đại Cồ Việt đánh bại cuộc xâm lược, củng cố nền độc lập. Triều Tiền Lê chú trọng nông nghiệp, giao thông và bang giao; sau Lê Đại Hành, tranh chấp kế vị làm triều đình suy yếu.",
    culture: { title: "Lễ tịch điền và sự chăm lo nông nghiệp", text: "Lê Đại Hành tổ chức cày tịch điền, khuyến khích sản xuất và đào kênh. Các thiền sư như Đỗ Pháp Thuận tham gia việc nước và tiếp sứ." },
    conflict: { title: "Hầu Nhân Bảo và cuộc xâm lược năm 981", text: "Quân Tống tiến theo cả đường bộ và đường thủy. Hầu Nhân Bảo tử trận; các cánh quân Tống thất bại và rút lui. Năm 982, Lê Hoàn tiến đánh Champa, cho thấy xung đột cũng diễn ra ở phía nam." },
    people: [person("le-dai-hanh", "Lê Hoàn, vua sáng lập nhà Tiền Lê"), person("duong-van-nga", "Hoàng hậu thời Đinh và Tiền Lê")],
    places: [hoaLu, bachDang], sources: ["Nhà Tiền Lê", "Lê Đại Hành"],
  },
  {
    id: "ly-thang-long", era: "Nhà Lý", years: "1009–1075", year: 1054,
    title: "Thăng Long, nơi rồng bay lên", nation: "Đại Việt (từ 1054)", capital: "Thăng Long", territory: "north", extent: "Trọng tâm ở Bắc Bộ và Bắc Trung Bộ; chưa mang hình dáng Việt Nam hiện đại.",
    summary: "Lý Công Uẩn lên ngôi năm 1009, dời đô từ Hoa Lư ra Đại La năm 1010 và đổi tên thành Thăng Long. Năm 1054, Lý Thánh Tông đổi quốc hiệu thành Đại Việt. Triều đình củng cố luật pháp, nông nghiệp và một trung tâm chính trị mới ở đồng bằng sông Hồng.",
    culture: { title: "Văn Miếu, chùa Một Cột và khoa cử", text: "Chùa Một Cột được dựng năm 1049, Văn Miếu năm 1070. Khoa thi Nho học năm 1075 và Quốc Tử Giám năm 1076 đánh dấu sự phát triển của giáo dục, song song với vị trí nổi bật của Phật giáo." },
    people: [person("ly-thai-to", "Lý Công Uẩn, người dời đô"), person("y-lan", "Nguyên phi, từng nhiếp chính"), person("ly-thanh-tong", "Vua đặt quốc hiệu Đại Việt")],
    places: [thangLong, place("Văn Miếu", [105.835, 21.028], "heritage", "Dựng năm 1070 ở Thăng Long; vị trí được ghép vào điểm kinh đô trên bản đồ tổng quan.")], sources: ["Nhà Lý", "Văn Miếu – Quốc Tử Giám", "Ỷ Lan"],
  },
  {
    id: "ly-nhu-nguyet", era: "Nhà Lý", years: "1069–1225", year: 1077,
    title: "Phòng tuyến Như Nguyệt và một Đại Việt vững vàng", nation: "Đại Việt", capital: "Thăng Long", territory: "ly", extent: "Sau năm 1069, mở rộng đến vùng Quảng Bình – bắc Quảng Trị ngày nay.",
    summary: "Sau chiến dịch năm 1069, nhà Lý nhận ba châu từ Champa. Trước căng thẳng với Tống, Lý Thường Kiệt tiến công các căn cứ phía nam của Tống năm 1075. Năm 1076–1077, Đại Việt chặn quân Tống tại phòng tuyến sông Như Nguyệt; về cuối triều, quyền lực chuyển dần sang họ Trần.",
    culture: { title: "Gốm men ngọc và mỹ thuật thời Lý", text: "Gốm, kiến trúc chùa tháp và hình tượng rồng thời Lý thể hiện kỹ thuật và thẩm mỹ phát triển. Bài thơ Nam quốc sơn hà gắn với truyền thống kháng Tống; tác giả và thời điểm ra đời còn có tranh luận." },
    conflict: { title: "Quách Quỳ, Triệu Tiết và quân Tống", text: "Quân Tống vượt biên, tiến về Thăng Long nhưng bị chặn ở Như Nguyệt. Giao tranh, khó khăn hậu cần và thương lượng dẫn đến rút quân. Trận chiến không chấm dứt mọi tranh chấp biên giới ngay lập tức." },
    people: [person("ly-thuong-kiet", "Tướng chỉ huy kháng Tống"), person("ly-nhan-tong", "Hoàng đế thời chiến tranh Tống – Việt"), person("ly-chieu-hoang", "Nữ hoàng cuối cùng của nhà Lý")],
    places: [thangLong, place("Như Nguyệt", [105.96, 21.2], "battle", "Phòng tuyến trên sông Cầu trong kháng chiến chống Tống.")], sources: ["Nhà Lý", "Lý Thường Kiệt", "Lý Chiêu Hoàng"],
  },
  {
    id: "tran-dung-nuoc", era: "Nhà Trần", years: "1225–1258", year: 1258,
    title: "Một vương triều mới, thử thách từ thảo nguyên", nation: "Đại Việt", capital: "Thăng Long", territory: "ly", extent: "Lãnh thổ trước cuộc hôn nhân Huyền Trân năm 1306.",
    summary: "Lý Chiêu Hoàng nhường ngôi cho Trần Cảnh cuối năm 1225. Trần Thủ Độ giữ vai trò chủ chốt trong chuyển giao triều đại. Nhà Trần củng cố hoàng tộc, đê điều và quân đội; năm 1258 phải đương đầu cuộc tiến công đầu tiên của quân Mông Cổ.",
    culture: { title: "Thái thượng hoàng và đắp đê", text: "Cơ chế vua và thái thượng hoàng cùng điều hành trở thành nét nổi bật. Việc lập cơ quan Hà đê sứ và tổ chức đắp đê năm 1248 thể hiện ưu tiên bảo vệ sản xuất nông nghiệp." },
    conflict: { title: "Ngột Lương Hợp Thai tiến vào Đại Việt", text: "Tướng Mông Cổ Ngột Lương Hợp Thai đưa quân từ Vân Nam xuống. Triều Trần rút khỏi kinh thành, rồi phản công ở Đông Bộ Đầu. Quân Mông Cổ rút khỏi Đại Việt sau chiến dịch ngắn." },
    people: [person("tran-thai-tong", "Trần Cảnh, hoàng đế đầu triều Trần"), person("tran-thu-do", "Thái sư, tổ chức nền chính trị đầu triều"), person("ly-chieu-hoang", "Nữ hoàng nhường ngôi, sau là hoàng hậu của Trần Thái Tông")],
    places: [thangLong, place("Đông Bộ Đầu", [105.86, 21.04], "battle", "Bến sông Hồng gắn với cuộc phản công năm 1258.")], sources: ["Nhà Trần", "Chiến tranh Nguyên Mông–Đại Việt lần 1"],
  },
  {
    id: "tran-bach-dang", era: "Nhà Trần", years: "1285–1288", year: 1288,
    title: "Bạch Đằng: chặn đứng vó ngựa Nguyên Mông", nation: "Đại Việt", capital: "Thăng Long", territory: "ly", extent: "Đại Việt cuối thế kỷ XIII; nhiều vùng bị quân Nguyên chiếm tạm thời trong chiến tranh.",
    summary: "Hai cuộc xâm lược năm 1285 và 1287–1288 đặt Đại Việt trước thử thách lớn. Triều Trần chủ động rút lui, làm suy yếu hậu cần rồi phản công. Trần Khánh Dư đánh đoàn thuyền lương ở Vân Đồn; Trần Hưng Đạo tổ chức trận Bạch Đằng năm 1288, đánh bại thủy quân rút lui.",
    culture: { title: "Hịch tướng sĩ và tinh thần Đông A", text: "Hịch tướng sĩ gắn với Trần Quốc Tuấn thể hiện đạo lý và trách nhiệm của người cầm quân. Các hội nghị Bình Than, Diên Hồng đi vào ký ức lịch sử về việc tập hợp lực lượng chống xâm lược." },
    conflict: { title: "Hốt Tất Liệt, Thoát Hoan và Ô Mã Nhi", text: "Hốt Tất Liệt ra lệnh chinh phạt; Thoát Hoan chỉ huy bộ binh, Ô Mã Nhi chỉ huy một cánh thủy quân. Quân Nguyên chiếm Thăng Long nhưng thiếu lương. Ô Mã Nhi bị bắt sau trận Bạch Đằng; Thoát Hoan rút về phía bắc." },
    people: [person("tran-hung-dao", "Quốc công tiết chế Trần Quốc Tuấn"), person("tran-nhan-tong", "Hoàng đế lãnh đạo kháng chiến"), person("thoat-hoan", "Hoàng tử nhà Nguyên, chỉ huy xâm lược", "opponent"), person("o-ma-nhi", "Tướng thủy quân Nguyên, bị bắt năm 1288", "opponent")],
    places: [thangLong, bachDang, place("Vân Đồn", [107.42, 21.05], "battle", "Trần Khánh Dư đánh đoàn thuyền lương của Trương Văn Hổ.")], sources: ["Chiến tranh Nguyên Mông–Đại Việt", "Trận Bạch Đằng (1288)", "Trần Hưng Đạo"],
  },
  {
    id: "tran-van-hoa", era: "Nhà Trần", years: "1293–1400", year: 1306,
    title: "Trúc Lâm, chữ Nôm và bước chuyển về phương nam", nation: "Đại Việt", capital: "Thăng Long", territory: "tran", extent: "Sau 1306, thêm Ô và Lý, tương ứng phần lớn vùng Quảng Trị – Thừa Thiên Huế.",
    summary: "Sau chiến tranh, nhà Trần phục hồi đất nước. Năm 1306, hôn nhân giữa công chúa Huyền Trân và vua Champa Chế Mân gắn với việc chuyển giao hai châu Ô, Lý. Thế kỷ XIV chứng kiến khủng hoảng trong nước, chiến tranh với Champa và sự nổi lên của Hồ Quý Ly.",
    culture: { title: "Thiền phái Trúc Lâm và sử học", text: "Trần Nhân Tông gắn với sự hình thành thiền phái Trúc Lâm ở Yên Tử. Thời Trần có Đại Việt sử ký của Lê Văn Hưu, sáng tác chữ Nôm phát triển, cùng truyền thống y học gắn với Tuệ Tĩnh." },
    conflict: { title: "Chế Bồng Nga và các cuộc tiến công Champa", text: "Vua Champa Chế Bồng Nga nhiều lần đưa quân đánh Đại Việt, có lúc vào Thăng Long, gây tổn thất lớn. Ông tử trận năm 1390 trong giao tranh với lực lượng của Trần Khát Chân." },
    people: [person("tran-nhan-tong", "Thượng hoàng, thiền sư Trúc Lâm"), person("huyen-tran", "Công chúa trong hôn nhân ngoại giao năm 1306"), person("chu-van-an", "Nhà giáo, quan Quốc Tử Giám"), person("che-bong-nga", "Vua Champa nhiều lần tiến đánh Đại Việt", "opponent")],
    places: [thangLong, place("Yên Tử", [106.72, 21.16], "heritage", "Không gian gắn với Phật giáo Trúc Lâm."), place("Thuận Hóa", [107.3, 16.7], "heritage", "Vùng đất gắn với Ô, Lý và hôn nhân Huyền Trân – Chế Mân.")], sources: ["Nhà Trần", "Huyền Trân", "Trúc Lâm Yên Tử", "Chế Bồng Nga"],
  },
  {
    id: "ho", era: "Nhà Hồ", years: "1400–1407", year: 1400,
    title: "Đại Ngu và cuộc cải cách giữa khủng hoảng", nation: "Đại Ngu", capital: "Tây Đô", territory: "tran", extent: "Phác họa lãnh thổ khoảng năm 1400; vùng chiếm thêm từ Champa năm 1402 không được tô như biên giới ổn định.",
    summary: "Hồ Quý Ly thay nhà Trần năm 1400, đặt quốc hiệu Đại Ngu. Triều Hồ tiếp tục các cải cách về ruộng đất, giáo dục, hành chính và tài chính đã khởi sự cuối thời Trần. Triều đại chỉ tồn tại bảy năm trước cuộc xâm lược của nhà Minh.",
    culture: { title: "Tiền giấy và thành đá Tây Đô", text: "Tiền giấy Thông bảo hội sao được phát hành từ năm 1396 dưới quyền Hồ Quý Ly. Thành Tây Đô xây năm 1397 nổi bật với kỹ thuật ghép khối đá lớn. Các cải cách có tham vọng lớn nhưng gây nhiều xáo trộn." },
    conflict: { title: "Nhà Minh xâm lược năm 1406–1407", text: "Minh Thành Tổ dùng danh nghĩa phục hồi nhà Trần để đưa quân sang. Trương Phụ và Mộc Thạnh chỉ huy chiến dịch; quân Hồ thất bại, Hồ Quý Ly và Hồ Hán Thương bị bắt, đất nước bị sáp nhập vào hệ thống cai trị Minh." },
    people: [person("ho-quy-ly", "Người sáng lập triều Hồ, chủ trương cải cách"), person("ho-nguyen-trung", "Tướng, người gắn với kỹ thuật hỏa khí"), person("truong-phu", "Tướng Minh chỉ huy xâm lược", "opponent")],
    places: [place("Tây Đô", [105.6, 20.08], "capital", "Thành nhà Hồ tại Vĩnh Lộc, Thanh Hóa."), place("Đa Bang", [105.42, 21.2], "battle", "Phòng tuyến quan trọng thất thủ đầu năm 1407.")], sources: ["Nhà Hồ", "Thành nhà Hồ", "Hồ Quý Ly"],
  },
  {
    id: "hau-tran", era: "Hậu Trần · Thuộc Minh", years: "1407–1414 · đô hộ đến 1427", year: 1410,
    title: "Những cuộc kháng chiến chưa thành", nation: "Giao Chỉ dưới quyền Minh · lực lượng Hậu Trần", capital: "Đông Quan (trị sở Minh)", territory: "tran", extent: "Vùng bị nhà Minh đặt bộ máy đô hộ; Hậu Trần không kiểm soát ổn định toàn vùng tô.",
    summary: "Giản Định Đế và Trùng Quang Đế dựng cờ khôi phục nhà Trần. Nghĩa quân giành thắng lợi ở Bô Cô năm 1408 nhưng bị chia rẽ và liên tiếp chịu sức ép quân sự. Đến năm 1414 phong trào Hậu Trần thất bại, trong khi các cuộc chống Minh vẫn tiếp diễn.",
    culture: { title: "Di sản bị tổn thất dưới thời Minh", text: "Chính quyền Minh thu gom sách vở, đưa thợ giỏi về phương bắc và áp đặt những quy định đồng hóa. Tổn thất thư tịch khiến nhiều tác phẩm trước thế kỷ XV chỉ còn được biết qua trích dẫn về sau." },
    conflict: { title: "Trương Phụ và bộ máy cai trị Minh", text: "Quân Minh đàn áp các lực lượng chống đối, áp dụng lao dịch và thuế khóa nặng. Trương Phụ trở lại chỉ huy, đánh bại lực lượng Hậu Trần; Đặng Dung và Trùng Quang Đế bị bắt." },
    people: [person("trung-quang-de", "Trần Quý Khoáng, vua Hậu Trần"), person("dang-dung", "Tướng Hậu Trần, tác giả Cảm hoài"), person("truong-phu", "Chỉ huy các chiến dịch đàn áp Hậu Trần", "opponent")],
    places: [place("Đông Quan", [105.84, 21.03], "capital", "Tên Thăng Long trong thời Minh thuộc."), place("Bô Cô", [106.04, 20.36], "battle", "Vùng Nam Định gắn với chiến thắng Hậu Trần năm 1408.")], sources: ["Nhà Hậu Trần", "Bắc thuộc lần thứ tư"],
  },
  {
    id: "lam-son", era: "Lam Sơn", years: "1418–1427", year: 1427,
    title: "Từ núi rừng Lam Sơn đến ngày mở lại nền độc lập", nation: "Nghĩa quân Lam Sơn", capital: "Căn cứ Lam Sơn; Minh giữ Đông Quan", territory: "tran", extent: "Vùng khởi nghĩa mở rộng dần; bản đồ biểu thị không gian chiến sự, không phải toàn vùng kiểm soát ngay từ 1418.",
    summary: "Lê Lợi khởi nghĩa ở Lam Sơn năm 1418. Từ căn cứ Thanh Hóa, nghĩa quân tiến vào Nghệ An rồi ra Bắc, thắng ở Tốt Động – Chúc Động và Chi Lăng – Xương Giang. Cuối năm 1427, Vương Thông chấp nhận rút quân, kết thúc thời Minh thuộc.",
    culture: { title: "Bình Ngô đại cáo", text: "Nguyễn Trãi thay Lê Lợi soạn Bình Ngô đại cáo năm 1428, tuyên bố thắng lợi và nền độc lập. Văn chính luận, thư dụ hàng và ngoại giao là phần quan trọng của cuộc kháng chiến." },
    conflict: { title: "Vương Thông, Liễu Thăng và Mộc Thạnh", text: "Vương Thông giữ Đông Quan; Liễu Thăng và Mộc Thạnh dẫn viện binh. Liễu Thăng tử trận ở Chi Lăng, viện binh bị đánh bại. Nghĩa quân dùng quân sự kết hợp thương lượng để đưa quân Minh về nước." },
    people: [person("le-loi", "Bình Định vương, lãnh đạo khởi nghĩa"), person("nguyen-trai", "Mưu sĩ, nhà ngoại giao và tác giả đại cáo"), person("vuong-thong", "Tướng Minh giữ Đông Quan, chấp nhận rút quân", "opponent")],
    places: [lamSon, place("Đông Quan", [105.84, 21.03], "heritage", "Thành do Vương Thông giữ, nơi diễn ra hội thề rút quân."), place("Chi Lăng", [106.58, 21.65], "battle", "Ải nơi đạo viện binh Liễu Thăng bị đánh năm 1427.")], sources: ["Khởi nghĩa Lam Sơn", "Bình Ngô đại cáo"],
  },
  {
    id: "le-so", era: "Nhà Lê sơ", years: "1428–1527", year: 1471,
    title: "Hồng Đức: luật pháp, khoa cử và mở rộng lãnh thổ", nation: "Đại Việt", capital: "Đông Kinh", territory: "le", extent: "Phác họa sau chiến dịch 1471, đến vùng Phú Yên; không gộp các vùng ảnh hưởng phía tây thành đất quản lý trực tiếp.",
    summary: "Lê Lợi lên ngôi năm 1428. Dưới Lê Thánh Tông, nhà nước tăng cường quản lý hành chính, khoa cử và luật pháp. Chiến dịch đánh Champa năm 1471 đưa vùng Bình Định và lân cận vào hệ thống Đại Việt. Cuối triều, tranh chấp quyền lực dẫn tới việc Mạc Đăng Dung thay ngôi năm 1527.",
    culture: { title: "Luật Hồng Đức và bia tiến sĩ", text: "Quốc triều hình luật gắn với thời Lê; năm 1484 bắt đầu dựng bia ghi người đỗ tiến sĩ ở Văn Miếu. Ngô Sĩ Liên biên soạn Đại Việt sử ký toàn thư, một nguồn sử quan trọng còn truyền lại." },
    conflict: { title: "Chiến tranh với Champa năm 1471", text: "Lê Thánh Tông chỉ huy chiến dịch chiếm Vijaya, bắt vua Trà Toàn. Cuộc chiến gây tổn thất lớn cho Champa và làm thay đổi sâu sắc tương quan quyền lực ở miền Trung; Champa tiếp tục tồn tại ở phía nam." },
    people: [person("le-thanh-tong", "Hoàng đế thời Hồng Đức"), person("nguyen-thi-anh", "Hoàng thái hậu, nhiếp chính đầu thời Lê Nhân Tông"), person("ngo-si-lien", "Sử quan biên soạn Đại Việt sử ký toàn thư")],
    places: [place("Đông Kinh", [105.84, 21.03], "capital", "Tên kinh đô Thăng Long thời Lê."), place("Vijaya · Đồ Bàn", [109.1, 13.88], "battle", "Kinh đô Champa bị quân Lê chiếm năm 1471.")], sources: ["Nhà Lê sơ", "Lê Thánh Tông", "Chiến tranh Việt–Chiêm (1471)"],
  },
  {
    id: "mac", era: "Nhà Mạc", years: "1527–1592 · Cao Bằng đến 1677", year: 1540,
    title: "Bắc triều, Nam triều: một đất nước hai triều đình", nation: "Đại Việt · Mạc và Lê đối lập", capital: "Đông Kinh (Mạc) · Tây Kinh (Lê)", territory: "le", extent: "Tô không gian Đại Việt; đường chia quyền lực Bắc – Nam thay đổi liên tục trong nội chiến.",
    summary: "Mạc Đăng Dung lập triều Mạc năm 1527. Từ năm 1533, lực lượng trung hưng nhà Lê hình thành ở phía nam, tạo cục diện Nam – Bắc triều. Nhà Mạc mất Đông Kinh năm 1592, nhưng một nhánh tiếp tục tồn tại ở Cao Bằng đến năm 1677.",
    culture: { title: "Gốm có minh văn và học thuật", text: "Đồ gốm thời Mạc có nhiều hiện vật ghi niên đại, người làm và người đặt. Nguyễn Bỉnh Khiêm là nhân vật tiêu biểu của khoa cử và văn học thế kỷ XVI." },
    conflict: { title: "Nội chiến Mạc – Lê", text: "Nguyễn Kim rồi họ Trịnh lãnh đạo lực lượng khôi phục nhà Lê. Chiến tranh kéo dài gây tổn thất dân cư và kinh tế; đây là xung đột quyền lực trong nước. Nhà Minh cũng gây sức ép quân sự và ngoại giao lên triều Mạc." },
    people: [person("mac-dang-dung", "Hoàng đế sáng lập triều Mạc"), person("nguyen-binh-khiem", "Trạng nguyên, nhà thơ và học giả"), person("nguyen-kim", "Người tổ chức lực lượng trung hưng nhà Lê")],
    places: [place("Đông Kinh", [105.84, 21.03], "capital", "Kinh đô nhà Mạc đến năm 1592."), place("Tây Kinh", [105.41, 19.94], "heritage", "Vùng Thanh Hóa, căn cứ lực lượng Lê trung hưng."), place("Cao Bằng", [106.25, 22.67], "heritage", "Địa bàn tồn tại của nhánh Mạc sau khi mất Đông Kinh.")], sources: ["Nhà Mạc", "Nam–Bắc triều (Việt Nam)"],
  },
  {
    id: "le-trung-hung", era: "Lê trung hưng", years: "1533–1789", year: 1600,
    title: "Vua Lê, chúa Trịnh và hai trung tâm quyền lực", nation: "Đại Việt", capital: "Đông Kinh · phủ chúa Trịnh", territory: "le", extent: "Không gian đầu thế kỷ XVII, trước các đợt mở rộng sâu xuống đồng bằng Nam Bộ.",
    summary: "Nhà Lê được khôi phục năm 1533 và trở lại Thăng Long sau khi họ Trịnh đánh bại Mạc năm 1592. Vua Lê giữ danh nghĩa hoàng đế, trong khi chúa Trịnh nắm thực quyền ở Đàng Ngoài. Ở phía nam, họ Nguyễn dần xây dựng chính quyền riêng, mở đầu cục diện phân tranh.",
    culture: { title: "Làng nghề, đình làng và thương cảng", text: "Thương mại ở Kẻ Chợ, Phố Hiến phát triển; kiến trúc đình làng và điêu khắc gỗ để lại nhiều di sản. Văn học chữ Nôm tiếp tục mở rộng bên cạnh văn học chữ Hán." },
    people: [person("le-trang-tong", "Vua mở đầu thời Lê trung hưng"), person("trinh-tung", "Chúa Trịnh, đưa vua Lê về Thăng Long"), person("nguyen-hoang", "Người đặt nền tảng chính quyền họ Nguyễn ở phía nam")],
    places: [place("Đông Kinh", [105.84, 21.03], "capital", "Nơi đặt triều vua Lê và phủ chúa Trịnh."), place("Phố Hiến", [106.06, 20.65], "heritage", "Thương cảng quốc tế phát triển trong thế kỷ XVI–XVII.")], sources: ["Nhà Lê trung hưng", "Chúa Trịnh", "Phố Hiến"],
  },
  {
    id: "trinh-nguyen", era: "Trịnh – Nguyễn", years: "1627–1777", year: 1757,
    title: "Hai Đàng, những thương cảng và vùng đất phương nam", nation: "Đàng Ngoài · Đàng Trong", capital: "Đông Kinh · Phú Xuân", territory: "split", extent: "Phác họa giữa thế kỷ XVIII; sông Gianh chia hai Đàng. Nam Bộ được tích hợp từng bước, không phải vùng đất trống.",
    summary: "Chiến tranh Trịnh – Nguyễn bùng nổ năm 1627; sau năm 1672, hai bên ngừng các chiến dịch lớn và lấy vùng sông Gianh làm ranh giới. Các chúa Nguyễn mở rộng quyền lực về phía nam qua chiến tranh, di dân và thỏa thuận với các thế lực Champa, Chân Lạp. Gia Định được tổ chức hành chính năm 1698.",
    culture: { title: "Hội An và chữ Quốc ngữ", text: "Hội An là điểm gặp của thương nhân Việt, Nhật, Hoa và châu Âu. Chữ Quốc ngữ hình thành qua công việc của nhiều giáo sĩ và cộng tác viên Việt; từ điển Việt – Bồ – La của Alexandre de Rhodes được in năm 1651." },
    conflict: { title: "Nội chiến và quá trình mở rộng lãnh thổ", text: "Họ Trịnh và họ Nguyễn giao chiến nhiều lần, khiến cư dân vùng ranh giới chịu tổn thất. Việc mở rộng phía nam làm thay đổi quyền lực và đời sống của cộng đồng Chăm, Khmer; không chỉ là câu chuyện khai khẩn." },
    people: [person("nguyen-phuc-khoat", "Chúa Nguyễn định chế ở Đàng Trong"), person("dao-duy-tu", "Mưu sĩ họ Nguyễn, tổ chức phòng thủ"), person("alexandre-de-rhodes", "Giáo sĩ, biên soạn từ điển năm 1651")],
    places: [thangLong, hue, place("Hội An", [108.33, 15.88], "heritage", "Thương cảng quốc tế phát triển mạnh ở Đàng Trong."), place("Sông Gianh", [106.42, 17.72], "battle", "Ranh giới tiêu biểu giữa Đàng Ngoài và Đàng Trong."), saiGon], sources: ["Trịnh–Nguyễn phân tranh", "Chúa Nguyễn", "Chữ Quốc ngữ", "Hội An"],
  },
  {
    id: "tay-son-rach-gam", era: "Tây Sơn", years: "1771–1785", year: 1785,
    title: "Từ Tây Sơn đến Rạch Gầm – Xoài Mút", nation: "Các thế lực Tây Sơn · Trịnh · Nguyễn", capital: "Quy Nhơn và các trung tâm đối lập", territory: "full", extent: "Tô không gian chiến sự cuối thế kỷ XVIII; Tây Sơn chưa kiểm soát thống nhất toàn vùng.",
    summary: "Ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ khởi nghĩa năm 1771. Phong trào lật đổ chính quyền chúa Nguyễn ở phần lớn Đàng Trong; Nguyễn Ánh tiếp tục chống lại. Năm 1785, Nguyễn Huệ đánh bại quân Xiêm ở Rạch Gầm – Xoài Mút.",
    culture: { title: "Một trật tự xã hội đang biến động", text: "Phong trào thu hút những nhóm bất mãn với chính quyền đương thời. Sự dịch chuyển quyền lực, quân đội và cư dân tác động mạnh đến làng xã và các mạng lưới thương mại ở miền Trung, Nam Bộ." },
    conflict: { title: "Quân Xiêm can thiệp giúp Nguyễn Ánh", text: "Vua Xiêm Rama I cử lực lượng do Chiêu Tăng và Chiêu Sương chỉ huy vào Gia Định. Quân Xiêm bị ghi nhận cướp bóc, gây bất mãn trong dân; Nguyễn Huệ bố trí trận phục kích trên sông Tiền, đánh tan lực lượng này." },
    people: [person("nguyen-hue", "Tướng Tây Sơn chỉ huy trận Rạch Gầm – Xoài Mút"), person("nguyen-nhac", "Lãnh tụ khởi nghĩa, xưng đế năm 1778"), person("rama-i", "Vua Xiêm ra lệnh can thiệp", "opponent")],
    places: [place("Quy Nhơn", [109.1, 13.89], "capital", "Vùng thành Hoàng Đế, trung tâm của Nguyễn Nhạc."), place("Rạch Gầm – Xoài Mút", [106.27, 10.35], "battle", "Trận địa trên sông Tiền đánh quân Xiêm năm 1785.")], sources: ["Nhà Tây Sơn", "Trận Rạch Gầm – Xoài Mút"],
  },
  {
    id: "tay-son-quang-trung", era: "Tây Sơn", years: "1786–1802", year: 1789,
    title: "Mùa xuân Kỷ Dậu và những cải cách dang dở", nation: "Tây Sơn · thế lực Nguyễn Ánh", capital: "Phú Xuân (Quang Trung)", territory: "full", extent: "Không gian Tây Sơn và Nguyễn Ánh tranh chấp; nhiều chính quyền cùng tồn tại.",
    summary: "Nguyễn Huệ tiến ra Bắc năm 1786, chấm dứt quyền lực chúa Trịnh. Cuối năm 1788 ông lên ngôi Quang Trung, dẫn quân ra Bắc và đánh bại quân Thanh đầu năm 1789. Sau khi ông mất năm 1792, triều Tây Sơn suy yếu; Nguyễn Ánh thắng thế và kết thúc triều đại năm 1802.",
    culture: { title: "Đề cao chữ Nôm và phục hồi giáo dục", text: "Quang Trung chủ trương khuyến học, dùng chữ Nôm và tổ chức dịch sách. Nguyễn Thiếp tham gia công việc giáo dục. Nhiều dự định không hoàn tất vì thời gian trị vì ngắn và chiến tranh tiếp diễn." },
    conflict: { title: "Tôn Sĩ Nghị đưa quân Thanh vào Thăng Long", text: "Nhà Thanh can thiệp để khôi phục Lê Chiêu Thống. Tôn Sĩ Nghị chỉ huy quân tiến vào Bắc Hà. Quang Trung tiến công nhanh, thắng ở Ngọc Hồi – Đống Đa; quân Thanh rút chạy, sau đó hai nước khôi phục bang giao." },
    people: [person("nguyen-hue", "Nguyễn Huệ, hoàng đế Tây Sơn"), person("bui-thi-xuan", "Nữ tướng Tây Sơn"), person("nguyen-thiep", "La Sơn phu tử, nhà giáo và cố vấn"), person("ton-si-nghi", "Tổng chỉ huy quân Thanh can thiệp năm 1788", "opponent")],
    places: [hue, place("Ngọc Hồi – Đống Đa", [105.83, 20.95], "battle", "Cụm trận đánh quanh Thăng Long mùa xuân 1789."), place("Quy Nhơn", [109.1, 13.89], "heritage", "Một trung tâm khác của phong trào Tây Sơn.")], sources: ["Nhà Tây Sơn", "Quang Trung", "Trận Ngọc Hồi – Đống Đa"],
  },
  {
    id: "nguyen-doc-lap", era: "Nhà Nguyễn", years: "1802–1858", year: 1832,
    title: "Từ Gia Long đến Minh Mạng: một quốc gia thống nhất", nation: "Việt Nam · Đại Nam (từ 1838)", capital: "Huế", territory: "full", extent: "Phác họa phần đất liền gần hình dáng hiện đại; không tô các vùng bảo hộ và chiếm đóng ở Campuchia thành lãnh thổ ổn định.",
    summary: "Nguyễn Ánh lên ngôi Gia Long năm 1802, đặt kinh đô tại Huế; quốc hiệu Việt Nam được dùng từ năm 1804. Minh Mạng cải tổ hành chính, chia tỉnh trên cả nước. Triều Nguyễn xây dựng chính quyền thống nhất, đồng thời đối mặt mâu thuẫn xã hội, các cuộc nổi dậy và quan hệ phức tạp với phương Tây.",
    culture: { title: "Kinh thành Huế, địa chí và Truyện Kiều", text: "Kinh thành Huế được xây dựng từ năm 1805. Thời Nguyễn để lại sử liệu, địa chí và mộc bản đồ sộ. Nguyễn Du sáng tác Truyện Kiều vào đầu thế kỷ XIX; niên đại sáng tác cụ thể còn được thảo luận." },
    people: [person("gia-long", "Nguyễn Ánh, hoàng đế sáng lập triều Nguyễn"), person("minh-mang", "Hoàng đế tiến hành cải cách hành chính"), person("nguyen-du", "Đại thi hào, tác giả Truyện Kiều"), person("le-van-duyet", "Tổng trấn Gia Định")],
    places: [hue, place("Hà Nội", [105.84, 21.03], "heritage", "Thành phố mang tên Hà Nội từ cải cách năm 1831."), saiGon], sources: ["Nhà Nguyễn", "Minh Mạng", "Nguyễn Du"],
  },
  {
    id: "nguyen-xam-luoc", era: "Nhà Nguyễn", years: "1858–1885", year: 1884,
    title: "Đại bác ngoài cửa biển, chủ quyền dần bị tước đoạt", nation: "Đại Nam · quyền lực Pháp mở rộng", capital: "Huế", territory: "full", extent: "Cả ba kỳ còn triều Nguyễn về danh nghĩa nhưng Nam Kỳ thành thuộc địa, Bắc Kỳ và Trung Kỳ thành bảo hộ.",
    summary: "Liên quân Pháp – Tây Ban Nha tiến công Đà Nẵng năm 1858, rồi đánh Gia Định năm 1859. Qua chiến tranh và các hiệp ước, Pháp chiếm Nam Kỳ, đánh ra Bắc, áp đặt chế độ bảo hộ năm 1883–1884. Triều Nguyễn tiếp tục tồn tại với quyền lực bị hạn chế; phong trào kháng chiến vẫn lan rộng.",
    culture: { title: "Văn học yêu nước và những đề nghị canh tân", text: "Nguyễn Đình Chiểu ghi lại đau thương và tinh thần kháng chiến của người dân Nam Bộ. Nguyễn Trường Tộ gửi nhiều bản điều trần đề nghị cải cách, phản ánh nhu cầu đổi mới trước sức ép bên ngoài." },
    conflict: { title: "Rigault de Genouilly, Garnier và Rivière", text: "Rigault de Genouilly chỉ huy liên quân đánh Đà Nẵng. Francis Garnier đánh thành Hà Nội năm 1873; Henri Rivière tiếp tục tiến công năm 1882. Các chiến dịch và hiệp ước cưỡng ép giúp Pháp mở rộng quyền cai trị." },
    people: [person("tu-duc", "Hoàng đế trong giai đoạn Pháp xâm lược"), person("truong-dinh", "Thủ lĩnh kháng Pháp ở Nam Bộ"), person("ton-that-thuyet", "Phụ chính đại thần, phát động Cần Vương"), person("rigault-de-genouilly", "Đô đốc Pháp chỉ huy tiến công năm 1858", "opponent")],
    places: [hue, place("Đà Nẵng", [108.22, 16.07], "battle", "Liên quân Pháp – Tây Ban Nha nổ súng năm 1858."), place("Gia Định", [106.7, 10.78], "battle", "Pháp đánh chiếm thành năm 1859.")], sources: ["Pháp thuộc", "Tôn Thất Thuyết"],
  },
  {
    id: "phap-thuoc", era: "Pháp thuộc", years: "1885–1940", year: 1930,
    title: "Xã hội thuộc địa và những con đường cứu nước", nation: "Bắc Kỳ · Trung Kỳ · Nam Kỳ", capital: "Hà Nội (trung tâm Đông Dương) · triều đình Huế", territory: "full", extent: "Ba kỳ trong Liên bang Đông Dương thuộc Pháp; không phải một nhà nước Việt Nam độc lập.",
    summary: "Pháp thiết lập bộ máy thuộc địa, khai thác tài nguyên và lao động, xây dựng hạ tầng phục vụ cai trị. Phong trào Cần Vương, Đông Du, Duy Tân và các tổ chức cách mạng nối tiếp nhau. Đảng Cộng sản Việt Nam thành lập năm 1930; những con đường giành độc lập khác nhau cùng tồn tại.",
    culture: { title: "Báo chí Quốc ngữ, Thơ mới và áo dài", text: "Báo chí Quốc ngữ xuất hiện từ thế kỷ XIX, phát triển mạnh thời thuộc địa; Thơ mới và tiểu thuyết hiện đại nổi bật trong thập niên 1930. Áo dài có những biến đổi về kiểu dáng. Giáo dục mới mở ra cơ hội nhưng tiếp cận rất hạn chế." },
    conflict: { title: "Khai thác và đàn áp dưới chính quyền Pháp", text: "Thuế khóa, đồn điền, lao dịch và nhà tù gây tổn thất lớn cho người dân. Toàn quyền Paul Doumer tổ chức chương trình khai thác và tài chính thuộc địa; chính quyền Pháp đàn áp nhiều phong trào như Yên Bái và Xô viết Nghệ Tĩnh." },
    people: [person("ham-nghi", "Hoàng đế gắn với phong trào Cần Vương"), person("phan-boi-chau", "Nhà hoạt động phong trào Đông Du"), person("phan-chau-trinh", "Nhà tư tưởng và vận động cải cách"), person("paul-doumer", "Toàn quyền Đông Dương 1897–1902", "opponent")],
    places: [place("Hà Nội", [105.84, 21.03], "capital", "Trung tâm hành chính Liên bang Đông Dương từ năm 1902."), hue, place("Bến Nhà Rồng", [106.71, 10.77], "heritage", "Nơi Nguyễn Tất Thành rời Việt Nam năm 1911.")], sources: ["Pháp thuộc", "Phong trào Cần Vương", "Văn học Việt Nam", "Paul Doumer"],
  },
  {
    id: "cach-mang-1945", era: "Nhật – Pháp · 1945", years: "1940–1945", year: 1945,
    title: "Nạn đói, Cách mạng tháng Tám và ngày độc lập", nation: "Việt Nam Dân chủ Cộng hòa (từ 2/9/1945)", capital: "Hà Nội", territory: "full", extent: "Không gian Việt Nam năm 1945; quyền kiểm soát thực tế thay đổi nhanh khi Nhật đầu hàng và quân Đồng minh vào.",
    summary: "Quân Nhật vào Đông Dương năm 1940, ban đầu duy trì chính quyền Pháp rồi đảo chính Pháp tháng 3/1945. Nạn đói 1944–1945 gây thảm họa lớn ở miền Bắc. Sau khi Nhật đầu hàng, Việt Minh lãnh đạo Cách mạng tháng Tám; Bảo Đại thoái vị. Ngày 2/9, Hồ Chí Minh đọc Tuyên ngôn Độc lập.",
    culture: { title: "Một nền cộng hòa và phong trào xóa mù chữ", text: "Sự chấm dứt chế độ quân chủ tạo bước ngoặt về thể chế. Bình dân học vụ được phát động tháng 9/1945, đưa việc học chữ Quốc ngữ đến đông đảo người dân." },
    conflict: { title: "Nhật chiếm đóng, Pháp duy trì cai trị", text: "Chính sách thu mua, trưng thu lương thực của Nhật – Pháp, chiến tranh, đứt gãy vận tải và thiên tai cùng góp phần vào nạn đói. Tướng Nhật Tsuchihashi chỉ huy đảo chính Pháp tháng 3/1945, trực tiếp kiểm soát Đông Dương." },
    people: [person("ho-chi-minh", "Chủ tịch Chính phủ lâm thời, đọc Tuyên ngôn Độc lập"), person("bao-dai", "Vị hoàng đế cuối cùng, thoái vị năm 1945"), person("nam-phuong", "Hoàng hậu cuối cùng của triều Nguyễn"), person("yuitsu-tsuchihashi", "Tướng Nhật chỉ huy đảo chính Pháp", "opponent")],
    places: [place("Ba Đình · Hà Nội", [105.83, 21.036], "capital", "Nơi đọc Tuyên ngôn Độc lập ngày 2/9/1945.", { subtitle: "Thủ đô · lễ Độc lập" }), hue, place("Tân Trào", [105.47, 21.78], "camp", "Căn cứ Việt Minh và địa điểm Quốc dân Đại hội năm 1945.", { subtitle: "Căn cứ cách mạng", leader: getCharacter("ho-chi-minh") })], sources: ["Cách mạng Tháng Tám", "Nạn đói năm Ất Dậu, 1944–1945", "Bình dân học vụ"],
  },
  {
    id: "dien-bien-phu", era: "Kháng chiến chống Pháp", years: "1945–1954", year: 1954,
    title: "Điện Biên Phủ và sự kết thúc Đông Dương thuộc Pháp", nation: "Việt Nam Dân chủ Cộng hòa · Quốc gia Việt Nam", capital: "Hà Nội (tuyên bố) · căn cứ Việt Bắc", territory: "full", extent: "Vùng do các bên kiểm soát đan xen; màu bản đồ biểu thị không gian Việt Nam, không phải một vùng kiểm soát duy nhất.",
    summary: "Pháp trở lại Nam Bộ năm 1945; chiến tranh toàn quốc bùng nổ cuối năm 1946. Chính phủ kháng chiến dựa vào Việt Bắc, trong khi Pháp hậu thuẫn Quốc gia Việt Nam từ năm 1949. Chiến thắng Điện Biên Phủ ngày 7/5/1954 góp phần quyết định dẫn tới Hiệp định Genève và việc quân Pháp rút đi.",
    culture: { title: "Văn nghệ kháng chiến", text: "Âm nhạc, thơ, hội họa và báo chí gắn với cuộc kháng chiến và đời sống chiến khu. Giáo dục, xóa mù chữ vẫn được duy trì trong điều kiện chiến tranh." },
    conflict: { title: "Henri Navarre và Christian de Castries", text: "Navarre tổ chức kế hoạch quân sự Pháp; de Castries chỉ huy tập đoàn cứ điểm Điện Biên Phủ. Quân Việt Minh do Võ Nguyên Giáp chỉ huy bao vây, tiến công từng bước và buộc cứ điểm đầu hàng. Chiến tranh gây tổn thất lớn cho quân dân." },
    people: [person("ho-chi-minh", "Chủ tịch nước Việt Nam Dân chủ Cộng hòa"), person("vo-nguyen-giap", "Tổng tư lệnh, chỉ huy chiến dịch Điện Biên Phủ"), person("christian-de-castries", "Chỉ huy cứ điểm Pháp tại Điện Biên Phủ", "opponent")],
    places: [place("Việt Bắc", [105.61, 21.8], "camp", "Vùng căn cứ của Trung ương và Chính phủ kháng chiến.", { subtitle: "Căn cứ kháng chiến", leader: getCharacter("ho-chi-minh") }), place("Điện Biên Phủ", [103.01, 21.39], "battle", "Chiến dịch diễn ra từ 13/3 đến 7/5/1954."), place("Hà Nội", [105.84, 21.03], "capital", "Thủ đô được tiếp quản ngày 10/10/1954.", { subtitle: "Thủ đô" })], sources: ["Chiến tranh Đông Dương", "Chiến dịch Điện Biên Phủ", "Hiệp định Genève, 1954"],
  },
  {
    id: "chia-cat", era: "Chia cắt · Chiến tranh", years: "1954–1973", year: 1968,
    title: "Hai miền, một cuộc chiến kéo dài", nation: "Việt Nam Dân chủ Cộng hòa · Việt Nam Cộng hòa", capital: "Hà Nội · Sài Gòn", territory: "partition", extent: "Giới tuyến quân sự tạm thời gần vĩ tuyến 17 theo Genève; không phải biên giới quốc gia được hiệp định thiết lập.",
    summary: "Sau Genève, Việt Nam tạm chia hai vùng tập kết. Việt Nam Cộng hòa ra đời ở miền Nam năm 1955; tổng tuyển cử thống nhất dự kiến năm 1956 không diễn ra. Chiến tranh leo thang giữa hai phía Việt Nam, với sự can thiệp lớn của Hoa Kỳ và hỗ trợ từ các đồng minh; quân Mỹ tham chiến trực tiếp từ năm 1965.",
    culture: { title: "Hai đời sống văn hóa trong chiến tranh", text: "Miền Bắc phát triển văn học và âm nhạc cách mạng; miền Nam có đời sống báo chí, tân nhạc và văn học đô thị đa dạng. Bom đạn, di cư và chia cắt gia đình để lại dấu ấn sâu trong sáng tác." },
    conflict: { title: "Hoa Kỳ can thiệp quân sự", text: "Tổng thống Lyndon B. Johnson mở rộng chiến tranh; tướng William Westmoreland chỉ huy lực lượng Mỹ giai đoạn 1964–1968. Ném bom, chất khai quang và giao tranh gây hậu quả nghiêm trọng cho dân thường. Các bên đều có tổn thất và những hành vi gây hại cho thường dân." },
    people: [person("vo-nguyen-giap", "Bộ trưởng Quốc phòng Việt Nam Dân chủ Cộng hòa"), person("nguyen-thi-binh", "Nhà ngoại giao, tham gia đàm phán Paris"), person("nguyen-van-thieu", "Tổng thống Việt Nam Cộng hòa 1967–1975"), person("william-westmoreland", "Tướng chỉ huy quân Mỹ ở miền Nam", "opponent")],
    places: [place("Hà Nội", [105.84, 21.03], "capital", "Thủ đô Việt Nam Dân chủ Cộng hòa.", { subtitle: "Thủ đô" }), { ...saiGon, kind: "capital", detail: "Thủ đô Việt Nam Cộng hòa.", subtitle: "Thủ đô" }, place("Bến Hải · Hiền Lương", [107.05, 17.005], "heritage", "Khu vực giới tuyến quân sự tạm thời."), place("Đà Nẵng", [108.22, 16.07], "battle", "Nơi lính thủy đánh bộ Mỹ đổ bộ năm 1965.")], sources: ["Chiến tranh Việt Nam", "Hiệp định Genève, 1954", "William Westmoreland"],
  },
  {
    id: "thong-nhat", era: "Thống nhất", years: "1973–1976", year: 1976,
    title: "Chiến tranh khép lại, đất nước thống nhất", nation: "Cộng hòa xã hội chủ nghĩa Việt Nam (từ 1976)", capital: "Hà Nội", territory: "full", extent: "Phần đất liền Việt Nam thống nhất; bản đồ không thể hiện đầy đủ lãnh thổ và các quần đảo.",
    summary: "Hiệp định Paris năm 1973 dẫn đến việc quân Mỹ rút khỏi Việt Nam, nhưng giao tranh giữa các lực lượng Việt Nam tiếp tục. Ngày 30/4/1975, chính quyền Việt Nam Cộng hòa đầu hàng. Năm 1976, đất nước thống nhất về nhà nước với quốc hiệu Cộng hòa xã hội chủ nghĩa Việt Nam.",
    culture: { title: "Đời sống hậu chiến và ký ức nhiều phía", text: "Gia đình đoàn tụ, đồng thời nhiều người phải đối mặt với mất mát, di cư, cải tạo và khó khăn kinh tế. Văn học, điện ảnh hậu chiến dần kể lại trải nghiệm của chiến sĩ và thường dân." },
    people: [person("van-tien-dung", "Chỉ huy Chiến dịch Hồ Chí Minh"), person("duong-van-minh", "Tổng thống Việt Nam Cộng hòa, tuyên bố đầu hàng"), person("ton-duc-thang", "Chủ tịch nước trong giai đoạn thống nhất")],
    places: [place("Hà Nội", [105.84, 21.03], "capital", "Thủ đô của nước Việt Nam thống nhất.", { subtitle: "Thủ đô" }), place("Dinh Độc Lập", [106.696, 10.777], "heritage", "Địa điểm gắn với sự kiện ngày 30/4/1975.")], sources: ["Hiệp định Paris 1973", "Sự kiện 30 tháng 4 năm 1975", "Việt Nam"],
  },
  {
    id: "bien-gioi", era: "Hậu chiến · Biên giới", years: "1975–1986", year: 1979,
    title: "Hòa bình còn nhiều thử thách", nation: "Cộng hòa xã hội chủ nghĩa Việt Nam", capital: "Hà Nội", territory: "full", extent: "Phần đất liền Việt Nam; các điểm đánh dấu cho thấy chiến sự ở hai vùng biên giới.",
    summary: "Sau thống nhất, đất nước gặp khó khăn do hậu quả chiến tranh, cơ chế kinh tế và cô lập quốc tế. Khmer Đỏ tiến công biên giới Tây Nam; cuối năm 1978, Việt Nam mở chiến dịch vào Campuchia, lật đổ chính quyền Khmer Đỏ đầu năm 1979. Tháng 2/1979, Trung Quốc đưa quân tiến công biên giới phía Bắc.",
    culture: { title: "Đời sống thời bao cấp", text: "Tem phiếu và phân phối theo định lượng trở thành ký ức phổ biến trong đời sống đô thị. Hoạt động văn hóa phản ánh công cuộc tái thiết, chiến tranh biên giới và những khó khăn thường nhật." },
    conflict: { title: "Khmer Đỏ và quân Trung Quốc", text: "Chế độ Pol Pot gây ra các cuộc tấn công, sát hại dân thường ở biên giới Tây Nam, trong đó có Ba Chúc. Trung Quốc dưới sự lãnh đạo của Đặng Tiểu Bình tiến công sáu tỉnh biên giới tháng 2/1979, gây thương vong và phá hủy hạ tầng; xung đột biên giới còn kéo dài trong thập niên 1980." },
    people: [person("le-duan", "Tổng Bí thư trong giai đoạn hậu chiến"), person("pol-pot", "Lãnh đạo Khmer Đỏ, gây chiến ở biên giới Tây Nam", "opponent"), person("dang-tieu-binh", "Lãnh đạo Trung Quốc khi tiến công Việt Nam năm 1979", "opponent")],
    places: [place("Hà Nội", [105.84, 21.03], "capital", "Trung tâm chính trị của Việt Nam.", { subtitle: "Thủ đô" }), place("Lạng Sơn", [106.76, 21.85], "battle", "Một hướng tiến công của Trung Quốc năm 1979."), place("Ba Chúc", [104.96, 10.5], "battle", "Nơi dân thường bị Khmer Đỏ thảm sát năm 1978.")], sources: ["Chiến tranh biên giới Tây Nam", "Chiến tranh biên giới Việt–Trung 1979", "Bao cấp"],
  },
  {
    id: "doi-moi", era: "Đổi Mới · Hiện đại", years: "1986–nay", year: 2000,
    title: "Đổi Mới, hội nhập và một chương vẫn đang viết", nation: "Cộng hòa xã hội chủ nghĩa Việt Nam", capital: "Hà Nội", territory: "full", extent: "Phần đất liền để so sánh lịch sử; các đảo và quần đảo không được thể hiện đầy đủ ở tỷ lệ này.",
    summary: "Đại hội VI năm 1986 mở đầu Đổi Mới, từng bước chuyển đổi cách quản lý kinh tế. Việt Nam gia nhập ASEAN năm 1995 và WTO năm 2007, mở rộng quan hệ quốc tế và các hoạt động sản xuất, thương mại. Đô thị hóa, môi trường, bảo tồn di sản và chất lượng sống là những vấn đề của giai đoạn hiện đại.",
    culture: { title: "Di sản trong một xã hội kết nối", text: "Không gian cồng chiêng, quan họ, ca trù và nhiều di sản được quốc tế ghi danh. Internet, điện ảnh, âm nhạc đại chúng và các ngành sáng tạo tạo những hình thức biểu đạt mới, tiếp nối đời sống văn hóa đa dạng của các cộng đồng Việt Nam." },
    people: [person("nguyen-van-linh", "Tổng Bí thư gắn với giai đoạn đầu Đổi Mới"), person("vo-van-kiet", "Thủ tướng, thúc đẩy cải cách và các công trình phát triển")],
    places: [place("Hà Nội", [105.84, 21.03], "capital", "Thủ đô, trung tâm chính trị và văn hóa.", { subtitle: "Thủ đô" }), place("TP. Hồ Chí Minh", [106.7, 10.78], "heritage", "Một trung tâm kinh tế, văn hóa lớn."), place("Hội An", [108.33, 15.88], "heritage", "Đô thị cổ được UNESCO ghi danh năm 1999.")], sources: ["Đổi Mới", "Việt Nam", "Văn hóa Việt Nam"],
  },
];

export const vietnamOverview: OverviewSceneModel[] = scenes.map((scene) => {
  const events = historicalEvents.filter((event) => event.sceneIds.includes(scene.id));
  const leaders = events.flatMap((event) => event.leaderIds).concat(scene.id === "loan-12-su-quan" ? warlords.map((base) => base.characterId) : []);
  const places = scene.places.map((place) => {
    const event = events.find((event) => event.id === place.eventId);
    return event ? { ...place, subtitle: event.years, detail: `${place.detail} ${event.summary} Kết quả: ${event.outcome}`, leader: getCharacter(event.leaderIds[0]) } : place;
  });
  return { ...scene, people: [...scene.people, ...[...new Set(leaders)].filter((id) => !scene.people.some((person) => person.id === id)).map((id) => getCharacter(id))], places: [...places, ...events.filter((event) => !places.some((place) => place.eventId === event.id)).map((event): OverviewPlaceModel => ({ name: event.title, at: event.at, kind: "battle", subtitle: event.years, detail: `${event.summary} Kết quả: ${event.outcome}`, eventId: event.id, leader: getCharacter(event.leaderIds[0]) }))] };
});
