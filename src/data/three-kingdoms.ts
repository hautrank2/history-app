export type Coordinate = [longitude: number, latitude: number];

// Historical positions are approximate. Place names follow the period.
export const places = {
  luoyang: { name: "Lạc Dương", at: [112.63, 34.73] },
  changan: { name: "Trường An", at: [108.86, 34.35] },
  meiu: { name: "My Ổ", at: [107.76, 34.27] },
  tong: { name: "Đồng Quan", at: [110.31, 34.61] },
  anyi: { name: "An Ấp", at: [111.07, 35.12] },
  chenliu: { name: "Trần Lưu", at: [114.49, 34.7] },
  changshe: { name: "Trường Xã", at: [113.92, 34.22] },
  guangzong: { name: "Quảng Tông", at: [115.15, 37.03] },
  xiaquyang: { name: "Hạ Khúc Dương", at: [115.02, 38.04] },
  zhuo: { name: "Trác quận", at: [115.98, 39.48] },
  wan: { name: "Uyển thành", at: [112.53, 33.02] },
  suanzao: { name: "Toan Tảo", at: [114.19, 35.13] },
  henei: { name: "Hà Nội", at: [113.05, 35.16] },
  xingyang: { name: "Huỳnh Dương", at: [113.44, 34.85] },
  yangren: { name: "Dương Nhân", at: [112.95, 34.14] },
  pingyuan: { name: "Bình Nguyên", at: [116.43, 37.17] },
  shouzhang: { name: "Thọ Trương", at: [116.24, 35.97] },
  jibei: { name: "Tế Bắc", at: [116.77, 36.32] },
  gaotang: { name: "Cao Đường", at: [116.25, 36.87] },
  juancheng: { name: "Quyên Thành", at: [115.5, 35.56] },
  puyang: { name: "Bộc Dương", at: [115.03, 35.76] },
  xu: { name: "Huyện Hứa", at: [113.96, 34.02] },
  xiapi: { name: "Hạ Bì", at: [117.92, 34.0] },
  xiaopei: { name: "Tiểu Bái", at: [116.94, 34.73] },
  ye: { name: "Nghiệp Thành", at: [114.61, 36.29] },
  guandu: { name: "Quan Độ", at: [114.02, 34.76] },
  wuchao: { name: "Ô Sào†", at: [114.32, 35.08] },
  baima: { name: "Bạch Mã", at: [114.55, 35.57] },
  runan: { name: "Nhữ Nam", at: [114.35, 33.0] },
  xiangyang: { name: "Tương Dương", at: [112.14, 32.04] },
  changban: { name: "Trường Bản", at: [111.78, 30.83] },
  jiangling: { name: "Giang Lăng", at: [112.2, 30.35] },
  xiakou: { name: "Hạ Khẩu", at: [114.31, 30.59] },
  chibi: { name: "Xích Bích†", at: [113.64, 29.88] },
  wulin: { name: "Ô Lâm", at: [113.62, 29.98] },
  moling: { name: "Mạt Lăng", at: [118.8, 32.06] },
  jianye: { name: "Kiến Nghiệp", at: [118.8, 32.06] },
  chengdu: { name: "Thành Đô", at: [104.07, 30.67] },
  hanzhong: { name: "Hán Trung", at: [107.03, 33.07] },
  dingjun: { name: "Định Quân Sơn", at: [106.67, 33.08] },
  wuchang: { name: "Vũ Xương", at: [114.89, 30.39] },
  yiling: { name: "Di Lăng", at: [111.29, 30.7] },
  xiaoting: { name: "Hào Đình", at: [111.45, 30.51] },
  baidi: { name: "Bạch Đế", at: [109.57, 31.04] },
} satisfies Record<string, { name: string; at: Coordinate }>;

export type PlaceId = keyof typeof places;

export const factions = {
  han: { name: "Triều Đông Hán", color: "#c19a73" },
  turbans: { name: "Khăn Vàng", color: "#f1c65d", uprising: true },
  dong: { name: "Đổng Trác", color: "#e98276" },
  coalition: { name: "Liên minh Quan Đông", color: "#91acd9" },
  liGuo: { name: "Lý Thôi và Quách Dĩ", color: "#b891da" },
  contested: { name: "Quan Trung tranh chấp", color: "#b891da" },
  cao: { name: "Tào Tháo", color: "#75abe7" },
  yuan: { name: "Viên Thiệu", color: "#c29ada" },
  shu: { name: "Lưu Bị", color: "#82c7a4" },
  wu: { name: "Họ Tôn", color: "#e19173" },
  jing: { name: "Lưu Biểu", color: "#d1b36a" },
  yi: { name: "Lưu Chương", color: "#a7b786" },
  lu: { name: "Lữ Bố", color: "#e4a07c" },
  wei: { name: "Tào Ngụy", color: "#75abe7" },
  shuhan: { name: "Thục Hán", color: "#82c7a4" },
  dongwu: { name: "Đông Ngô", color: "#e19173" },
} satisfies Record<string, { name: string; color: string; uprising?: boolean }>;

export type FactionId = keyof typeof factions;
type Region = { faction: FactionId; label: Coordinate; ring: Coordinate[] };
const region = (faction: FactionId, label: Coordinate, ring: Coordinate[]): Region => ({ faction, label, ring });

// Schematic areas of influence for the dated scenes, with deliberate gaps at uncertain fronts.
const han = region("han", [112.6, 32.2], [[101, 35.4], [104, 39], [112, 40.1], [117.2, 41], [122.5, 39], [123, 29], [117, 23], [108, 21], [101, 25], [100, 30]]);
const yellowNorth = region("turbans", [116, 38.2], [[113.9, 36.7], [114.1, 38.8], [115.9, 39.4], [117.6, 38.2], [116.7, 36.5]]);
const yellowCentral = region("turbans", [114.9, 33.7], [[111.9, 32.2], [111.9, 33.5], [113.6, 34.65], [115.9, 34.4], [116.1, 33.2], [113.4, 32]]);
const dongEast = region("dong", [110.7, 34], [[105.4, 34], [107, 36], [111.9, 35.5], [113.1, 35], [113.3, 33.7], [110.1, 33.35], [107.3, 33.45]]);
const dongWest = region("dong", [108.1, 35.25], [[105.4, 34], [107, 36], [110.05, 35.45], [110.45, 34.65], [109.25, 33.52], [106.3, 33.6]]);
const allied = region("coalition", [115.1, 35.9], [[112.8, 35.3], [113.7, 37.15], [116.9, 37.55], [117.35, 34.5], [114.4, 34.2], [113.2, 33.25], [112.2, 33.2]]);
const guanzhong = region("liGuo", [108.4, 35.2], dongWest.ring);
const caoYan = region("cao", [115.9, 35.1], [[113.65, 34.5], [114.9, 36.1], [117.3, 36.2], [117.5, 34.8], [116.3, 34.2]]);
const caoCentral = region("cao", [115.9, 34.35], [[111.6, 34.25], [114.1, 35.55], [117, 36.1], [119.7, 35.8], [119, 33.6], [116.4, 32.65], [113.15, 32.7]]);
const yuanJi = region("yuan", [114.85, 37.8], [[112.7, 36.6], [113.4, 38.7], [115.35, 39.1], [117.25, 38.35], [116.9, 37.1], [115.6, 36.15], [113.4, 35.8]]);
const yuanNorth = region("yuan", [115.7, 37.8], [[111.7, 36.7], [112.4, 39.7], [117.6, 40.5], [121, 39.1], [120.8, 36.4], [118.6, 36.1], [115.6, 36.15], [113.4, 35.45]]);
const wuEast = region("wu", [119, 29.1], [[115.2, 29.6], [117.6, 31.65], [121.35, 32.15], [122.3, 29.9], [119.6, 26.2], [116.15, 26.6]]);
const jing = region("jing", [112.3, 28.85], [[109, 30.6], [111, 32.75], [113.15, 32.5], [115.2, 30.3], [114.5, 28.15], [112.1, 25.65], [109.9, 27]]);
const yi = region("yi", [104.1, 29.3], [[101, 29.5], [102.9, 33], [106.2, 33.5], [108.9, 31.4], [109.2, 30.2], [107.35, 27.7], [104.4, 26.5], [101.65, 27.4]]);
const caoNorth = region("cao", [115.6, 36.9], [[104, 35.6], [106.8, 39.8], [116.5, 41], [123.2, 40.2], [123.2, 35.1], [119.2, 32.65], [115.4, 32.3], [112.7, 31.25], [110.1, 32.15], [107.8, 33.55], [104.8, 33.7]]);
const shuYi = region("shu", [104.1, 29.3], [[101, 29.5], [102.9, 33], [107.4, 33.7], [109, 32.1], [109.2, 30.2], [107.35, 27.7], [104.4, 26.5], [101.65, 27.4]]);
const wuJing = region("wu", [115.9, 28.25], [[109.6, 30.55], [111, 32.05], [115.4, 32.25], [119.2, 32.65], [122.3, 32.1], [122.5, 28.4], [118.2, 24.3], [111, 21.85], [108.2, 24.5]]);

const regions = {
  revolt: [han, yellowNorth, yellowCentral],
  northRevolt: [han, yellowNorth],
  coup: [han, dongEast],
  coalition: [dongEast, allied],
  divided: [dongWest, yuanJi, jing],
  hanCourt: [guanzhong, caoYan, yuanJi, jing],
  qingTurbans: [guanzhong, caoYan, yuanJi, jing,
    region("turbans", [117.55, 36.45], [[115.9, 35.68], [117, 35.4], [118.7, 36.1], [118.5, 37], [117.1, 37]])],
  changanFight: [{ ...guanzhong, faction: "contested" }, caoYan, yuanJi, jing,
    region("shu", [118.9, 34.5], [[117, 33.4], [117.3, 35.7], [120, 35.55], [119.25, 33.5]])],
  xuCourt: [caoYan, yuanJi, jing, wuEast,
    region("cao", [113.5, 33.5], [[112.6, 33.5], [113.3, 34.7], [114.6, 34.55], [114.8, 33.05]]),
    region("lu", [118.3, 34.05], [[117, 33.4], [117.3, 35.7], [120, 35.55], [119.25, 33.5]])],
  guandu: [caoCentral, yuanNorth, wuEast, jing, yi],
  xiapi: [caoCentral, yuanJi, jing, wuEast,
    region("lu", [118.3, 34.05], [[117.25, 33.5], [117.3, 34.8], [118.6, 35], [119.3, 34.05], [119, 33.5]])],
  changban: [caoNorth, wuEast, jing, yi],
  chibi: [caoNorth, wuEast, yi,
    region("shu", [112.85, 28.4], [[110.3, 28.1], [111.15, 29.85], [113.95, 30.65], [115.4, 29.56], [114.3, 27.35], [111.25, 26.5]])],
  hanzhong: [caoNorth, shuYi, wuEast,
    region("shu", [111.9, 29.1], [[109.4, 30.05], [111.1, 31.5], [113.45, 31.15], [113.85, 29.45], [112.5, 27.95], [109.95, 28.2]])],
  yiling: [{ ...caoNorth, faction: "wei" }, { ...shuYi, faction: "shuhan" }, wuJing],
  kingdoms: [{ ...caoNorth, faction: "wei" }, { ...shuYi, faction: "shuhan" }, { ...wuJing, faction: "dongwu" }],
} satisfies Record<string, Region[]>;

export const people = {
  cao: { name: "Tào Tháo", color: "#9ac9ff", characterId: "tao-thao" },
  liu: { name: "Lưu Bị", color: "#9fe3ba", characterId: "luu-bi" },
  sun: { name: "Tôn Quyền", color: "#ffb092", characterId: "ton-quyen" },
  sunJian: { name: "Tôn Kiên", color: "#ffb092" },
  sunCe: { name: "Tôn Sách", color: "#ffb092" },
  zhang: { name: "Trương Giác", color: "#f5cd65" },
  huangfu: { name: "Hoàng Phủ Tung", color: "#ddbd9c" },
  dong: { name: "Đổng Trác", color: "#ffa096" },
  yuan: { name: "Viên Thiệu", color: "#dbb1ff" },
  lu: { name: "Lữ Bố", color: "#ffbc98" },
  wang: { name: "Vương Doãn", color: "#eac4a6" },
  li: { name: "Lý Thôi", color: "#dab8ff" },
  guo: { name: "Quách Dĩ", color: "#e7c3ff" },
  xian: { name: "Hán Hiến Đế", color: "#f6d597" },
  zhou: { name: "Chu Du", color: "#ffb092" },
  xiahou: { name: "Hạ Hầu Uyên", color: "#9ac9ff" },
  luxun: { name: "Lục Tốn", color: "#ffb092" },
  caorui: { name: "Tào Duệ", color: "#9ac9ff" },
  liushan: { name: "Lưu Thiện", color: "#9fe3ba" },
} satisfies Record<string, { name: string; color: string; characterId?: string }>;

export type PersonId = keyof typeof people;
type CastMember = { person: PersonId; place: PlaceId; action: string; regional?: boolean };
const cast = (person: PersonId, place: PlaceId, action: string, regional = false): CastMember => ({ person, place, action, regional });
type Route = { faction: FactionId; places: [PlaceId, PlaceId, ...PlaceId[]]; label: string };
const route = (faction: FactionId, label: string, ...places: Route["places"]): Route => ({ faction, places, label });

const sources = {
  turban: { name: "Tư trị thông giám, chương 58 · bản dịch Rafe de Crespigny, ANU", url: "https://openresearch-repository.anu.edu.au/server/api/core/bitstreams/3df5d9aa-26db-44c1-8372-14d21d5a4250/content" },
  peace: { name: "To Establish Peace · Rafe de Crespigny, ANU", url: "https://openresearch-repository.anu.edu.au/items/8f7ee382-02fa-4f2c-99c0-d353cad0659e" },
  kingdoms: { name: "The Three Kingdoms and Western Jin · Rafe de Crespigny, ANU", url: "https://openresearch-repository.anu.edu.au/items/d3215751-4afb-433d-a4c3-f47885ec894c" },
  south: { name: "Generals of the South · Rafe de Crespigny, ANU", url: "https://openresearch-repository.anu.edu.au/items/3f9f4ff5-730e-4153-a5ce-e2b8a6dd6afc" },
};

export type ThreeKingdomsScene = {
  id: string;
  date: string;
  chapter: string;
  title: string;
  focus: PlaceId;
  battle?: boolean;
  context: string;
  story: string;
  territories: Region[];
  nearby: PlaceId[];
  cast: CastMember[];
  routes?: Route[];
  source: { name: string; url: string };
};

export const threeKingdomsScenes: ThreeKingdomsScene[] = [
  {
    id: "khan-vang", date: "Đầu 184", chapter: "Đông Hán lung lay", title: "Khởi nghĩa Khăn Vàng",
    focus: "guangzong", territories: regions.revolt, nearby: ["luoyang", "wan", "changshe", "xiaquyang"],
    context: "Ký Châu ở phía bắc Hoàng Hà. Các toán nổi dậy còn hoạt động ở vùng Dĩnh Xuyên và Nam Dương, về phía nam kinh đô.",
    story: "Mạng lưới Thái Bình Đạo do Trương Giác lãnh đạo nổi dậy ở nhiều châu. Triều đình phải huy động tướng lĩnh và lực lượng địa phương để giữ các tuyến đường quanh Lạc Dương.",
    cast: [cast("zhang", "guangzong", "Lãnh đạo phong trào ở Ký Châu", true), cast("liu", "zhuo", "Tập hợp lực lượng địa phương ở vùng Trác quận", true)],
    source: sources.turban,
  },
  {
    id: "truong-xa", date: "Giữa 184", chapter: "Đông Hán lung lay", title: "Phá vây ở Trường Xã",
    focus: "changshe", battle: true, territories: regions.revolt, nearby: ["luoyang", "wan", "chenliu"],
    context: "Trường Xã nằm ở Dĩnh Xuyên, phía đông nam Lạc Dương. Nam Dương là một mặt trận nổi dậy khác về phía tây nam.",
    story: "Quân Ba Tài vây Hoàng Phủ Tung ở Trường Xã. Quân Hán phóng hỏa trại đối phương rồi phản công. Tào Tháo dẫn quân đến tiếp viện trong chiến dịch.",
    cast: [cast("huangfu", "changshe", "Chỉ huy quân Hán phá vây"), cast("cao", "changshe", "Dẫn lực lượng tiếp viện"), cast("liu", "zhuo", "Theo quân địa phương chống Khăn Vàng ở phía bắc", true)],
    source: sources.turban,
  },
  {
    id: "quang-tong", date: "Cuối 184", chapter: "Đông Hán lung lay", title: "Quảng Tông và Hạ Khúc Dương",
    focus: "guangzong", battle: true, territories: regions.northRevolt, nearby: ["xiaquyang", "ye", "pingyuan"],
    context: "Hai trận địa đều thuộc vùng Ký Châu. Hạ Khúc Dương nằm về phía bắc Quảng Tông.",
    story: "Trương Giác mất vì bệnh trước trận quyết định. Hoàng Phủ Tung đánh bại Trương Lương ở Quảng Tông, rồi tiến đánh Trương Bảo ở Hạ Khúc Dương. Các đạo quân chủ lực tan rã, song nhiều toán Khăn Vàng vẫn hoạt động về sau.",
    cast: [cast("huangfu", "guangzong", "Chỉ huy hai trận cuối năm"), cast("zhang", "guangzong", "Mất vì bệnh trước trận quyết định", true)],
    routes: [route("han", "Quân Hán đánh tiếp lên phía bắc", "guangzong", "xiaquyang")], source: sources.turban,
  },
  {
    id: "dong-trac-vao-kinh", date: "189", chapter: "Đông Hán lung lay", title: "Đổng Trác vào Lạc Dương",
    focus: "luoyang", territories: regions.coup, nearby: ["changan", "tong", "chenliu"],
    context: "Lạc Dương nối đồng bằng Trung Nguyên với Quan Trung qua hành lang phía nam Hoàng Hà.",
    story: "Hà Tiến bị giết và cuộc thanh trừng hoạn quan làm triều đình rối loạn. Đổng Trác đưa quân vào kinh, phế Lưu Biện và lập Lưu Hiệp, tức Hán Hiến Đế.",
    cast: [cast("dong", "luoyang", "Nắm binh quyền ở kinh đô"), cast("xian", "luoyang", "Lên ngôi dưới quyền Đổng Trác"), cast("cao", "chenliu", "Rời kinh rồi mộ quân ở Trần Lưu", true)],
    source: sources.peace,
  },
  {
    id: "lien-minh-quan-dong", date: "190", chapter: "Chư hầu phân tranh", title: "Liên minh đánh Đổng Trác",
    focus: "xingyang", battle: true, territories: regions.coalition, nearby: ["luoyang", "henei", "suanzao", "wan"],
    context: "Các đạo quân ở nhiều trại phía đông kinh đô. Huỳnh Dương án ngữ đường từ Toan Tảo về Lạc Dương.",
    story: "Các lực lượng Quan Đông tôn Viên Thiệu làm minh chủ. Tào Tháo tiến riêng về phía Lạc Dương và bị quân Từ Vinh đánh bại gần Huỳnh Dương. Trong Tam quốc diễn nghĩa, chiến dịch được kể thành cuộc hội quân «Thập bát lộ chư hầu».",
    cast: [cast("yuan", "henei", "Đóng quân ở Hà Nội"), cast("cao", "xingyang", "Chạm quân Từ Vinh ở vùng Biện Thủy"), cast("dong", "luoyang", "Giữ triều đình và các ngả vào kinh")],
    routes: [route("coalition", "Tào Tháo tiến về Huỳnh Dương", "suanzao", "xingyang")], source: sources.peace,
  },
  {
    id: "lien-minh-tan-ra", date: "190–191", chapter: "Chư hầu phân tranh", title: "Dời đô, liên minh tan rã",
    focus: "luoyang", territories: regions.divided, nearby: ["changan", "tong", "yangren", "henei"],
    context: "Trường An nằm trong lòng Quan Trung, phía tây Hàm Cốc. Dương Nhân ở phía nam lối vào Lạc Dương.",
    story: "Đổng Trác dời triều đình sang Trường An và cho đốt Lạc Dương. Tôn Kiên thắng ở Dương Nhân rồi tiến vào cố đô. Các thủ lĩnh Quan Đông theo đuổi lợi ích riêng và liên minh dần tan rã.",
    cast: [cast("sunJian", "yangren", "Mở đường tiến vào Lạc Dương"), cast("xian", "changan", "Triều đình chuyển sang Trường An"), cast("dong", "changan", "Rút về Quan Trung sau khi bỏ Lạc Dương")],
    routes: [route("dong", "Triều đình dời sang Trường An", "luoyang", "tong", "changan"), route("coalition", "Tôn Kiên tiến vào cố đô", "yangren", "luoyang")], source: sources.peace,
  },
  {
    id: "lu-bo-giet-dong-trac", date: "Xuân–hè 192", chapter: "Chư hầu phân tranh", title: "Lữ Bố giết Đổng Trác",
    focus: "changan", territories: regions.divided, nearby: ["meiu", "tong"],
    context: "Trường An nằm phía bắc dãy Tần Lĩnh. My Ổ là căn cứ kiên cố của Đổng Trác ở phía tây kinh đô.",
    story: "Vương Doãn lôi kéo Lữ Bố tham gia âm mưu trừ Đổng Trác. Đổng Trác bị giết khi vào cung. Vương Doãn nắm triều chính trong một thời gian ngắn.",
    cast: [cast("lu", "changan", "Tham gia giết Đổng Trác ở kinh đô"), cast("wang", "changan", "Tổ chức âm mưu và nắm triều chính"), cast("xian", "changan", "Vẫn ở kinh đô Trường An")],
    source: sources.peace,
  },
  {
    id: "ly-thoi-quach-di", date: "Hè 192", chapter: "Chư hầu phân tranh", title: "Lý Thôi và Quách Dĩ phản công",
    focus: "changan", battle: true, territories: regions.hanCourt, nearby: ["meiu", "tong", "luoyang"],
    context: "Trường An là nơi đặt triều đình. Thoát về phía đông đưa Lữ Bố ra khỏi vùng Quan Trung.",
    story: "Các tướng cũ của Đổng Trác tập hợp quân đánh chiếm Trường An. Vương Doãn bị giết, Lữ Bố chạy về phía đông, còn Hán Hiến Đế rơi vào tay phe Lý Thôi và Quách Dĩ.",
    cast: [cast("li", "changan", "Dẫn quân Tây Lương chiếm kinh đô"), cast("guo", "changan", "Cùng Lý Thôi phản công"), cast("lu", "changan", "Tháo chạy khỏi Trường An"), cast("cao", "shouzhang", "Đối đầu Khăn Vàng ở Duyện Châu trong năm 192", true)],
    routes: [route("lu", "Lữ Bố thoát về phía đông", "changan", "tong")], source: sources.peace,
  },
  {
    id: "khan-vang-duyen-chau", date: "192", chapter: "Chư hầu phân tranh", title: "Tào Tháo thu hàng quân Khăn Vàng",
    focus: "shouzhang", battle: true, territories: regions.qingTurbans, nearby: ["jibei", "gaotang", "puyang"],
    context: "Quân Khăn Vàng từ Thanh Châu tràn vào Duyện Châu, qua vùng đồng bằng phía đông Thọ Trương.",
    story: "Sau khi Lưu Đại tử trận, Tào Tháo tiếp quản Duyện Châu và giao chiến với quân Khăn Vàng ở phía đông Thọ Trương. Cuối năm, lực lượng này đầu hàng ở Tế Bắc. Tào Tháo tuyển người trong số đó lập quân Thanh Châu.",
    cast: [cast("cao", "shouzhang", "Dẫn quân chống Khăn Vàng ở Duyện Châu"), cast("liu", "gaotang", "Đóng ở Cao Đường theo phe Công Tôn Toản trong giai đoạn này", true)],
    routes: [route("cao", "Quân Tào truy kích đến Tế Bắc", "shouzhang", "jibei")], source: sources.peace,
  },
  {
    id: "duyen-chau", date: "194–195", chapter: "Chư hầu phân tranh", title: "Tào Tháo và Lữ Bố giành Duyện Châu",
    focus: "puyang", battle: true, territories: [...regions.hanCourt,
      region("lu", [114.9, 36.45], [[114.15, 35.55], [114.6, 36.45], [115.45, 36.45], [115.7, 35.8], [115.09, 35.48]])],
    nearby: ["juancheng", "chenliu", "xiapi", "pingyuan"],
    context: "Bộc Dương và Quyên Thành ở vùng đồng bằng Hoàng Hà. Từ Châu nằm về phía đông nam.",
    story: "Khi Tào Tháo đang đánh Từ Châu, Trương Mạc và Trần Cung đón Lữ Bố về Duyện Châu. Hai bên đánh nhau quanh Bộc Dương. Tào Tháo giành lại Duyện Châu trong năm 195. Cùng thời gian đó, Lưu Bị kế nhiệm Đào Khiêm ở Từ Châu.",
    cast: [cast("cao", "juancheng", "Dựa vào các thành còn giữ được để phản công"), cast("lu", "puyang", "Chiếm Bộc Dương trong cuộc tranh giành Duyện Châu"), cast("liu", "xiapi", "Nắm Từ Châu sau khi Đào Khiêm mất", true)],
    routes: [route("cao", "Quân Tào phản công về Bộc Dương", "juancheng", "puyang")], source: sources.peace,
  },
  {
    id: "noi-chien-truong-an", date: "195", chapter: "Chư hầu phân tranh", title: "Lý Thôi và Quách Dĩ trở mặt",
    focus: "changan", battle: true, territories: regions.changanFight, nearby: ["tong", "anyi", "luoyang"],
    context: "Đường từ Trường An ra phía đông đi qua vùng cửa ải giáp Hoàng Hà. Triều đình tạm dừng ở An Ấp trước khi về Lạc Dương.",
    story: "Hai tướng quay sang đánh nhau trong kinh đô. Lý Thôi giữ hoàng đế, Quách Dĩ bắt các đại thần. Sau một thỏa thuận đình chiến, Hán Hiến Đế rời Trường An và đoàn hộ giá tiếp tục giao chiến trên đường.",
    cast: [cast("li", "changan", "Giữ Hán Hiến Đế trong cuộc giao tranh"), cast("guo", "changan", "Giao chiến với lực lượng của Lý Thôi"), cast("xian", "anyi", "Tạm trú sau khi thoát khỏi Trường An")],
    routes: [route("han", "Đoàn hộ giá rời Trường An", "changan", "tong", "anyi")], source: sources.peace,
  },
  {
    id: "thien-do-huyen-hua", date: "196", chapter: "Chư hầu phân tranh", title: "Tào Tháo đón Hán Hiến Đế",
    focus: "xu", territories: regions.xuCourt, nearby: ["luoyang", "wan", "xiapi", "moling"],
    context: "Huyện Hứa nằm phía đông nam Lạc Dương, trong vùng quân Tào có thể tiếp tế và bảo vệ.",
    story: "Hán Hiến Đế trở về Lạc Dương đã bị tàn phá. Tào Tháo đón vua và đưa triều đình về huyện Hứa. Cùng năm, Lữ Bố chiếm Hạ Bì khi Lưu Bị đang giao chiến với Viên Thuật.",
    cast: [cast("cao", "xu", "Đặt triều đình trong vùng mình kiểm soát"), cast("xian", "xu", "Rời Lạc Dương đến huyện Hứa"), cast("lu", "xiapi", "Chiếm Hạ Bì"), cast("liu", "xiapi", "Mất Hạ Bì trong lúc giao chiến ở Từ Châu", true), cast("sunCe", "moling", "Mở rộng thế lực ở Giang Đông", true)],
    routes: [route("han", "Triều đình chuyển từ Lạc Dương về huyện Hứa", "luoyang", "xu")], source: sources.peace,
  },
  {
    id: "ha-bi", date: "Đông 198", chapter: "Chư hầu phân tranh", title: "Vây thành Hạ Bì",
    focus: "xiapi", battle: true, territories: regions.xiapi, nearby: ["xiaopei", "xu"],
    context: "Hạ Bì nằm ở vùng thấp thuộc lưu vực sông Tứ và sông Nghi. Mạng sông quanh thành trở thành một phần của cuộc vây hãm.",
    story: "Sau khi quân Lữ Bố đánh Lưu Bị ở Tiểu Bái, Tào Tháo kéo quân sang Từ Châu. Quân Tào dẫn nước vào thành Hạ Bì. Lữ Bố bị bắt và xử tử sau khi thành thất thủ.",
    cast: [cast("cao", "xiapi", "Chỉ huy quân vây thành"), cast("lu", "xiapi", "Cố thủ rồi đầu hàng"), cast("liu", "xiapi", "Theo quân Tào trong chiến dịch")],
    routes: [route("cao", "Hướng tiến từ Tiểu Bái đến Hạ Bì", "xiaopei", "xiapi")], source: sources.peace,
  },
  {
    id: "quan-do", date: "200", chapter: "Thế chân vạc", title: "Quan Độ và kho lương Ô Sào",
    focus: "guandu", battle: true, territories: regions.guandu, nearby: ["baima", "wuchao", "xu", "runan", "ye"],
    context: "Quan Độ ở phía nam Hoàng Hà, trên hướng tiến từ vùng Viên Thiệu kiểm soát xuống huyện Hứa. Vị trí Ô Sào chỉ là ước lượng.",
    story: "Viên Thiệu đưa quân qua Hoàng Hà, đối đầu với Tào Tháo ở Quan Độ. Tào Tháo tập kích kho lương Ô Sào. Quân Viên tan vỡ, mở đường cho họ Tào thâu tóm miền bắc trong những năm sau đó.",
    cast: [cast("cao", "guandu", "Giữ chiến tuyến rồi tập kích Ô Sào"), cast("yuan", "guandu", "Chỉ huy quân tiến từ phía bắc"), cast("liu", "runan", "Hoạt động ở Nhữ Nam theo phe Viên Thiệu", true)],
    routes: [route("yuan", "Hướng tiến của quân Viên về Quan Độ", "baima", "guandu"), route("cao", "Tập kích kho lương Ô Sào", "guandu", "wuchao")], source: sources.peace,
  },
  {
    id: "truong-ban", date: "Thu 208", chapter: "Thế chân vạc", title: "Tào Tháo truy kích ở Trường Bản",
    focus: "changban", battle: true, territories: regions.changban, nearby: ["xiangyang", "jiangling", "xiakou"],
    context: "Trường Bản ở phía bắc Giang Lăng. Giang Lăng nắm kho quân nhu và đường thủy trên trung lưu Trường Giang.",
    story: "Lưu Tông đầu hàng khi Tào Tháo tiến vào Kinh Châu. Kỵ binh Tào bắt kịp đoàn Lưu Bị ở Trường Bản. Lưu Bị thoát khỏi cuộc truy kích, hội quân với lực lượng của Lưu Kỳ rồi về Hạ Khẩu.",
    cast: [cast("cao", "changban", "Quân kỵ truy kích đánh tan đoàn rút lui"), cast("liu", "changban", "Thoát khỏi Trường Bản và rút về Hạ Khẩu"), cast("sun", "moling", "Thế lực Tôn Quyền ở Giang Đông", true)],
    routes: [route("cao", "Hướng tiến của kỵ binh Tào", "xiangyang", "changban"), route("shu", "Hướng rút của Lưu Bị về Hạ Khẩu", "changban", "xiakou")], source: sources.kingdoms,
  },
  {
    id: "xich-bich", date: "Đông 208", chapter: "Thế chân vạc", title: "Xích Bích trên Trường Giang",
    focus: "chibi", battle: true, territories: regions.chibi, nearby: ["wulin", "jiangling", "xiakou"],
    context: "Trận đánh diễn ra trên trung lưu Trường Giang. Ô Lâm ở phía bắc sông. Vị trí chính xác của chiến trường Xích Bích còn được tranh luận.",
    story: "Tôn Quyền liên minh với Lưu Bị. Quân do Chu Du chỉ huy giao chiến với hạm đội Tào. Hoàng Cái dùng thuyền lửa đánh vào đội thuyền đối phương. Tào Tháo rút quân, tạo cơ hội để liên minh giành lại nhiều nơi ở Kinh Châu.",
    cast: [cast("cao", "wulin", "Lực lượng Tào đóng ở bờ bắc"), cast("zhou", "chibi", "Chỉ huy quân Tôn Quyền trong trận thủy chiến"), cast("liu", "chibi", "Lực lượng tham chiến cùng quân Tôn Quyền", true)],
    routes: [route("wu", "Quân liên minh từ hướng Hạ Khẩu", "xiakou", "chibi"), route("cao", "Hướng rút của quân Tào", "wulin", "jiangling")], source: sources.south,
  },
  {
    id: "dinh-quan-son", date: "219", chapter: "Thế chân vạc", title: "Lưu Bị chiếm Hán Trung",
    focus: "dingjun", battle: true, territories: regions.hanzhong, nearby: ["hanzhong", "changan", "chengdu"],
    context: "Hán Trung là thung lũng giữa Tần Lĩnh và vùng núi phía bắc Ích Châu, chắn các ngả từ Quan Trung xuống Thành Đô.",
    story: "Hoàng Trung đánh bại quân Tào ở Định Quân Sơn và giết Hạ Hầu Uyên. Tào Tháo đến ứng viện rồi rút quân. Lưu Bị giữ Hán Trung và xưng Hán Trung Vương.",
    cast: [cast("liu", "dingjun", "Chỉ huy chiến dịch đánh Hán Trung"), cast("xiahou", "dingjun", "Tử trận khi phòng thủ Hán Trung"), cast("cao", "hanzhong", "Đến ứng viện trong giai đoạn sau của chiến dịch", true)],
    routes: [route("cao", "Tào Tháo đưa quân từ Quan Trung xuống Hán Trung", "changan", "hanzhong")], source: sources.kingdoms,
  },
  {
    id: "di-lang", date: "221–222", chapter: "Thế chân vạc", title: "Lục Tốn chặn Lưu Bị ở Di Lăng",
    focus: "xiaoting", battle: true, territories: regions.yiling, nearby: ["baidi", "yiling", "jiangling", "wuchang"],
    context: "Di Lăng nằm gần cửa đông Tam Hiệp. Các trại Thục kéo dài theo Trường Giang, trên đường từ Bạch Đế xuống Giang Lăng.",
    story: "Sau khi Tôn Quyền chiếm phần Kinh Châu của Lưu Bị và Quan Vũ bị giết, Thục Hán đem quân tiến về phía đông. Lục Tốn chờ quân Thục dàn dài rồi dùng hỏa công đánh tan các trại. Lưu Bị lui về Bạch Đế.",
    cast: [cast("liu", "xiaoting", "Chỉ huy quân Thục rồi rút về Bạch Đế"), cast("luxun", "xiaoting", "Phản công dọc phòng tuyến Trường Giang"), cast("sun", "wuchang", "Đặt trung tâm cai trị tại Vũ Xương")],
    routes: [route("shuhan", "Hướng tiến của quân Thục", "baidi", "yiling", "xiaoting")], source: sources.kingdoms,
  },
  {
    id: "ba-nuoc", date: "229", chapter: "Thế chân vạc", title: "Ngụy, Thục, Ngô định hình",
    focus: "jianye", territories: regions.kingdoms, nearby: ["luoyang", "chengdu", "hanzhong", "wuchang"],
    context: "Tần Lĩnh và Hán Trung chia cách Ngụy–Thục. Các chiến tuyến Ngụy–Ngô trải từ Kinh Châu đến vùng Hoài Hà.",
    story: "Tào Phi lập Ngụy năm 220, Lưu Bị lập Thục Hán năm 221. Năm 229, Tôn Quyền xưng đế ở Vũ Xương rồi dời đô về Kiến Nghiệp. Ba chính thể cùng tồn tại với các trung tâm ở Lạc Dương, Thành Đô và Kiến Nghiệp.",
    cast: [cast("sun", "jianye", "Dời đô về Kiến Nghiệp trong năm 229"), cast("liushan", "chengdu", "Kế vị Lưu Bị từ năm 223"), cast("caorui", "luoyang", "Kế vị Tào Phi từ năm 226")],
    source: sources.kingdoms,
  },
];
