import { getCharacter } from "~/data/characters";
import type { CharacterModel, CountryModel, LngLatModel, StoryModel, TerritoryModel } from "~/types";

const thangLong: LngLatModel = [105.84, 21.03];
const vanKiep: LngLatModel = [106.33, 21.13];
const langSon: LngLatModel = [106.76, 21.85];
const vanDon: LngLatModel = [107.45, 20.97];
const trangKenh: LngLatModel = [106.752, 20.962];
const yenGiang: LngLatModel = [106.797, 20.938];
const battlefield: LngLatModel = [106.775, 20.945];

const daiDo: LngLatModel = [116.4, 39.9];

// Lãnh thổ Đại Việt khoảng năm 1288: phía nam tới bắc Quảng Trị (châu Ô, Lý đến 1306 mới sáp nhập)
const daiViet1288: TerritoryModel = {
  border: [
    [108.05, 21.54], [107.6, 21.6], [107.2, 21.72], [106.95, 21.95], [106.72, 21.98],
    [106.55, 22.45], [106.78, 22.8], [106.0, 22.95], [105.32, 23.35], [104.8, 22.9],
    [103.95, 22.5], [103.75, 21.7], [104.1, 20.9], [104.6, 20.45], [104.05, 19.45],
    [104.9, 18.8], [105.2, 18.55], [105.6, 17.9], [105.85, 17.6], [106.3, 17.25],
    [106.55, 16.95], [107.15, 16.85],
  ],
  seaClosure: [[108.6, 16.9], [109.2, 19.5], [108.8, 21.5]],
};

const thoatHoan: CharacterModel = { ...getCharacter("thoat-hoan"), role: "Trấn Nam vương, tổng chỉ huy", side: "enemy", portrait: "thoat-hoan" };
const oMaNhi: CharacterModel = { ...getCharacter("o-ma-nhi"), role: "Chỉ huy thủy quân", side: "enemy", portrait: "o-ma-nhi" };
const tranHungDao: CharacterModel = { ...getCharacter("tran-hung-dao"), role: "Quốc công Tiết chế", side: "home", portrait: "tran-hung-dao" };

const landRetreat: LngLatModel[] = [vanKiep, [106.45, 21.35], [106.6, 21.6], langSon, [106.75, 22.0]];
const fleetRetreat: LngLatModel[] = [
  vanKiep,
  [106.45, 21.05],
  [106.56, 21.03],
  [106.67, 21.03],
  [106.74, 20.99],
  [106.765, 20.96],
  [106.778, 20.935],
];

const bachDang1288: StoryModel = {
  title: "Bạch Đằng 1288",
  subtitle: "Trần Hưng Đạo và trận cọc trên sông",
  sides: { home: "Đại Việt", enemy: "Quân Nguyên" },
  territory: daiViet1288,
  regions: [
    { at: [110.5, 27.5], label: "Đại Nguyên" },
    { at: [105.35, 19.7], label: "Đại Việt" },
    { at: [107.9, 15.6], label: "Chiêm Thành" },
    { at: [102.9, 19.6], label: "Ai Lao" },
  ],
  note: "Biên giới, vị trí và đường hành quân là ước lượng để minh hoạ. Diễn biến theo Đại Việt sử ký toàn thư.",
  chapters: [
    {
      title: "Hai kinh đô",
      date: "Năm 1287",
      text: "Từ Đại Đô, Hốt Tất Liệt hạ lệnh đánh Đại Việt lần thứ ba, giao con trai là Trấn Nam vương Thoát Hoan cầm quân. Ở Thăng Long, vua Trần Nhân Tông trao quyền Quốc công Tiết chế cho Hưng Đạo vương Trần Quốc Tuấn.",
      camera: { center: [109, 31.5], zoom: 4.1, pitch: 25, bearing: 0 },
      points: [
        { at: daiDo, label: "Đại Đô", kind: "capital", side: "enemy" },
        { at: thangLong, label: "Thăng Long", kind: "capital", side: "home" },
      ],
      routes: [
        { path: [daiDo, [114.3, 30.55], [110.3, 25.3], [108.3, 22.8], langSon], side: "enemy", unit: "cavalry" },
      ],
      characters: [thoatHoan, tranHungDao],
    },
    {
      title: "Cuộc xâm lược lần thứ ba",
      date: "Cuối năm 1287",
      text: "Thoát Hoan dẫn đại quân Nguyên vượt biên giới Lạng Sơn, cùng thủy quân của Ô Mã Nhi tiến vào Đại Việt. Triều đình nhà Trần rời Thăng Long để tránh thế mạnh ban đầu của giặc. Quân Nguyên lập căn cứ ở Vạn Kiếp.",
      camera: { center: [106.4, 21.3], zoom: 7.8, pitch: 45, bearing: 0 },
      points: [
        { at: thangLong, label: "Thăng Long", kind: "capital", side: "home" },
        { at: vanKiep, label: "Vạn Kiếp", kind: "city", side: "enemy" },
        { at: langSon, label: "Lạng Sơn", kind: "city", side: "neutral" },
      ],
      routes: [
        { path: [[106.75, 22.0], langSon, [106.55, 21.5], vanKiep, [106.1, 21.08], thangLong], side: "enemy", unit: "cavalry" },
      ],
      characters: [thoatHoan, { ...getCharacter("tran-nhan-tong"), role: "Vua Đại Việt", side: "home" }],
    },
    {
      title: "Mất đoàn thuyền lương",
      date: "Đầu năm 1288",
      text: "Đoàn thuyền chở lương của Trương Văn Hổ đi sau thủy quân, vào đến Vân Đồn thì bị Trần Khánh Dư phục kích đánh tan. Hàng chục vạn quân Nguyên trong đất Đại Việt rơi vào cảnh thiếu ăn.",
      camera: { center: [107.3, 20.98], zoom: 9.2, pitch: 55, bearing: -20 },
      points: [{ at: vanDon, label: "Vân Đồn", kind: "battle", side: "home" }],
      routes: [{ path: [[107.95, 21.32], [107.65, 21.12], vanDon], side: "enemy", unit: "fleet" }],
      characters: [
        { ...getCharacter("tran-khanh-du"), role: "Tướng giữ Vân Đồn", side: "home" },
        { ...getCharacter("truong-van-ho"), role: "Chỉ huy đoàn thuyền lương", side: "enemy" },
      ],
    },
    {
      title: "Quyết định rút quân",
      date: "Tháng 3 năm 1288",
      text: "Hết lương, lại bị đánh tiêu hao khắp nơi, Thoát Hoan bỏ Thăng Long về Vạn Kiếp rồi chia quân rút. Bộ binh theo đường Lạng Sơn. Thủy quân của Ô Mã Nhi và Phàn Tiếp xuôi sông ra biển qua cửa Bạch Đằng.",
      camera: { center: [106.6, 21.35], zoom: 8.2, pitch: 50, bearing: 10 },
      points: [
        { at: vanKiep, label: "Vạn Kiếp", kind: "city", side: "enemy" },
        { at: langSon, label: "Lạng Sơn", kind: "city", side: "neutral" },
        { at: battlefield, label: "Cửa Bạch Đằng", kind: "port", side: "neutral" },
      ],
      routes: [
        { path: landRetreat, side: "enemy", unit: "cavalry" },
        { path: fleetRetreat, side: "enemy", unit: "fleet" },
      ],
      characters: [thoatHoan, oMaNhi],
    },
    {
      title: "Bày trận trên sông",
      date: "Trước ngày 9 tháng 4",
      text: "Trần Hưng Đạo đoán trước đường rút. Ông cho đóng cọc gỗ bịt sắt ở các cửa sông nhánh, phủ cỏ lên trên, chỗ cọc chìm dưới mặt nước khi triều lên. Quân phục sẵn trong dãy núi đá vôi Tràng Kênh và hai bên bờ.",
      camera: { center: battlefield, zoom: 11.6, pitch: 62, bearing: 25 },
      points: [
        { at: yenGiang, label: "Bãi cọc Yên Giang", kind: "stakes", side: "home" },
        { at: [106.803, 20.957], label: "Bãi cọc Đồng Vạn Muối", kind: "stakes", side: "home" },
        { at: trangKenh, label: "Phục binh Tràng Kênh", kind: "ambush", side: "home" },
      ],
      characters: [tranHungDao],
    },
    {
      title: "Triều rút",
      date: "9 tháng 4 năm 1288",
      text: "Sáng sớm nước còn lớn, Nguyễn Khoái đem thuyền nhẹ ra khiêu chiến rồi giả thua, dụ Ô Mã Nhi đuổi sâu vào trận địa. Triều xuống nhanh, thuyền lớn của quân Nguyên mắc cọc, vỡ và đắm. Phục binh từ hai bờ đổ ra, bè lửa thả theo dòng.",
      camera: { center: battlefield, zoom: 11.9, pitch: 60, bearing: -15 },
      points: [
        { at: battlefield, label: "Trận Bạch Đằng", kind: "battle", side: "home" },
        { at: yenGiang, label: "Bãi cọc", kind: "stakes", side: "home" },
        { at: trangKenh, label: "Tràng Kênh", kind: "ambush", side: "home" },
      ],
      routes: [
        { path: [[106.7, 21.02], [106.74, 20.99], [106.765, 20.96], [106.778, 20.938]], side: "enemy", unit: "fleet" },
        { path: [trangKenh, [106.768, 20.952]], side: "home" },
        { path: [yenGiang, [106.781, 20.941]], side: "home" },
        { path: [[106.79, 20.9], [106.78, 20.93]], side: "home", unit: "fleet" },
      ],
      characters: [tranHungDao, { ...getCharacter("nguyen-khoai"), role: "Tướng dụ địch", side: "home" }, oMaNhi],
    },
    {
      title: "Kết cục",
      date: "Tháng 4 năm 1288",
      text: "Hơn 400 chiến thuyền bị bắt. Ô Mã Nhi, Phàn Tiếp và Tích Lệ Cơ đều bị bắt sống. Thoát Hoan chạy đường bộ, bị chặn đánh suốt dọc đường mới thoát về nước. Đây là lần cuối cùng quân Nguyên xâm lược Đại Việt.",
      camera: { center: [106.6, 21.35], zoom: 8.2, pitch: 50, bearing: 0 },
      points: [
        { at: battlefield, label: "Bạch Đằng", kind: "battle", side: "home" },
        { at: thangLong, label: "Thăng Long", kind: "capital", side: "home" },
      ],
      routes: [{ path: landRetreat, side: "enemy", unit: "cavalry" }],
      characters: [tranHungDao, { ...oMaNhi, role: "Bị bắt sống" }, { ...thoatHoan, role: "Chạy thoát về nước" }],
    },
  ],
};

export const vietnamData: CountryModel = {
  slug: "vietnam",
  name: "Việt Nam",
  periods: [
    {
      slug: "van-lang-au-lac",
      years: "Trước 179 TCN",
      title: "Văn Lang – Âu Lạc",
      blurb: "Các vua Hùng, An Dương Vương và thành Cổ Loa.",
    },
    {
      slug: "bac-thuoc",
      years: "179 TCN – 938",
      title: "Nghìn năm Bắc thuộc",
      blurb: "Hai Bà Trưng, Lý Bí, Mai Thúc Loan, Khúc Thừa Dụ.",
    },
    {
      slug: "ngo-dinh-tien-le",
      years: "938 – 1009",
      title: "Ngô – Đinh – Tiền Lê",
      blurb: "Ngô Quyền giành độc lập, Đinh Bộ Lĩnh dẹp loạn mười hai sứ quân.",
    },
    {
      slug: "nha-ly",
      years: "1009 – 1225",
      title: "Nhà Lý",
      blurb: "Dời đô về Thăng Long, dựng Văn Miếu, phá Tống.",
    },
    {
      slug: "bach-dang-1288",
      years: "1288",
      title: "Bạch Đằng — Trần Hưng Đạo",
      blurb: "Trận cọc trên sông kết thúc ba lần xâm lược của quân Nguyên.",
      story: bachDang1288,
    },
    {
      slug: "le-so",
      years: "1428 – 1527",
      title: "Lê sơ",
      blurb: "Khởi nghĩa Lam Sơn, thời thịnh trị của Lê Thánh Tông.",
    },
    {
      slug: "tay-son-nguyen",
      years: "1771 – 1945",
      title: "Tây Sơn – Nguyễn",
      blurb: "Quang Trung đại phá quân Thanh, nhà Nguyễn thống nhất.",
    },
    {
      slug: "hien-dai",
      years: "1945 – nay",
      title: "Thời hiện đại",
      blurb: "Độc lập, kháng chiến và thống nhất đất nước.",
    },
  ],
};
