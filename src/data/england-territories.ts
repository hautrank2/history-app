import {
  aethelredII, anarchy, angevin, berwick, borders, britishUnion, cnut, cnutRoyal,
  commonwealth, crowns, edgar, englishOrigins, hundredYears, lancaster, naturalEarth,
  norms, saxonChronicle, unions, wales,
} from "~/data/england-geography";
import { britishLand, earlyEnglandStateMaps, mapNote, region } from "~/data/england-state-maps";
import type { Point } from "~/data/england-state-maps";
import land from "~/data/geo/northwest-europe.json";
import type { HistoricalStateMapModel, HistoricalStateModel } from "~/types/historical-state-map";

const withIreland = [...britishLand, "Ireland"];
const withFrance = [...withIreland, "France", "Jersey", "Guernsey"];
const islesView = { northwest: [-11.1, 59.05], southeast: [2.15, 49.7] } satisfies HistoricalStateMapModel["view"];
const channelView = { northwest: [-10.9, 58.85], southeast: [4.2, 48.25] } satisfies HistoricalStateMapModel["view"];
const aquitaineView = { northwest: [-11.1, 58.85], southeast: [6.0, 42.25] } satisfies HistoricalStateMapModel["view"];
const northSeaView = { northwest: [-7.7, 71.4], southeast: [28.2, 48.8] } satisfies HistoricalStateMapModel["view"];

const blue = "#72bde4";
const gold = "#e5c484";
const purple = "#bfa3e6";
const green = "#a9ce86";
const red = "#e69b8f";
type LandName = keyof typeof land;

const unit = (
  id: string, name: string, units: LandName[], color: string,
  center: string, at: Point, labelAt: Point, summary: string,
  kind: HistoricalStateModel["kind"] = "state",
): HistoricalStateModel => ({
  id, name, color, kind, center: { name: center, at }, labelAt, summary,
  rings: units.flatMap((name) => land[name]),
});

const england = unit(
  "england", "Vương quốc Anh", ["England"], blue, "London", [-0.12, 51.51], [-1.35, 52.6],
  "England là vùng lõi của vương quốc. Ở mốc trung cổ, đường bao phía bắc và phía tây được giản lược theo vùng biên qua từng cảnh.",
);
const scotland = unit(
  "scotland", "Scotland", ["Scotland"], gold, "Edinburgh", [-3.19, 55.95], [-3.9, 56.68],
  "Vương quốc ở phía bắc. Đường biên với Anh được định hình chủ yếu sau Hiệp ước York năm 1237. Vùng Berwick và một số đoạn biên còn đổi chủ hoặc tranh chấp về sau.", "context",
);
const welshKingdoms = unit(
  "wales", "Các xứ Wales", ["Wales"], purple, "Aberffraw · Gwynedd", [-4.47, 53.19], [-3.66, 52.44],
  "Các chính thể Wales như Gwynedd, Powys và Deheubarth có quyền cai trị riêng. Vùng biên và những phần đất do các lãnh chúa Marches nắm thay đổi theo mốc.", "context",
);
const welshMarches = {
  ...welshKingdoms,
  name: "Wales & Marches",
  color: blue,
  center: { name: "Caernarfon · trung tâm vương thất", at: [-4.28, 53.14] as Point },
  summary: "Sau cuộc chinh phục năm 1282–1283, đất vương thất tại Wales và lãnh địa Marches có cơ chế quản lý khác nhau. Cùng màu chỉ mối liên hệ với vương quyền Anh.",
};
const angloWales = {
  ...welshMarches, name: "Wales", kind: "state" as const,
  summary: "Các đạo luật thời Tudor hợp nhất Wales vào hệ thống hạt và pháp luật của England.",
};
const ireland = unit(
  "ireland", "Đảo Ireland", ["Ireland", "Northern Ireland"], green,
  "Dublin", [-6.26, 53.35], [-7.96, 53.24],
  "Quyền lực ở Ireland thay đổi giữa các vương triều bản địa, người định cư và vương thất Anh. Mốc lãnh thổ cụ thể được giải thích trong tab Địa lý.", "context",
);
const royalIreland = {
  ...ireland, name: "Vương quốc Ireland", color: blue,
  summary: "Ireland dùng chung vương miện với England. Quyền kiểm soát thực tế của triều đình khác nhau giữa Dublin và các vùng ngoài trung tâm.",
};

const englandEarly = { ...region(
  "england", "Vương quốc Anh", blue, "Winchester · trung tâm hoàng gia",
  [-1.31, 51.06], [-1.15, 52.67],
  [[-6.28, 49.74], [2.02, 50.85], [2.05, 54.98], [-1.98, 55.76],
    [-2.62, 55.4], [-2.85, 55.02], [-3.29, 54.57], [-3.48, 54.11],
    [-3.23, 53.53], [-3.04, 53.42], [-3.04, 53.02], [-3.12, 52.76],
    [-3.11, 52.43], [-2.97, 52.16], [-2.94, 51.92], [-2.68, 51.64],
    [-3.37, 51.49], [-4.55, 51.19], [-6.35, 50.72]],
  "Vương quốc Anh sau khi York về dưới quyền lâu dài của các vua Anh. Phạm vi kiểm soát ở Cumbria và phía bắc Northumbria còn chuyển dịch.",
), landCountries: britishLand };
const alba = region(
  "alba", "Alba · Scotland", gold, "Scone · trung tâm hoàng gia",
  [-3.44, 56.42], [-3.65, 56.64],
  [[-5.45, 55.51], [-4.2, 55.63], [-3.1, 55.43], [-2.66, 55.47], [-1.8, 55.83],
    [-1.2, 57.65], [-3.22, 58.7], [-4.91, 58.36], [-5.67, 57.06]],
  "Vương quốc của người Scots. Lothian gắn với Scotland vào đầu thế kỷ XI. Địa bàn Strathclyde và các vùng do người Bắc Âu nắm ở phía bắc còn biến động.", "context",
);
const northEngland = region(
  "scottish-north", "Các vùng David I nắm", gold, "Carlisle · vùng tranh chấp",
  [-2.94, 54.9], [-2.28, 54.86],
  [[-3.52, 55.06], [-2.63, 55.57], [-1.64, 55.9], [-1.22, 55.29], [-1.32, 54.79],
    [-2.03, 54.56], [-2.85, 54.44], [-3.68, 54.55]],
  "Trong thời nội chiến Anh, David I và con trai giữ Carlisle và nhiều địa bàn phía bắc. Phần lớn vùng đất phía bắc được trả lại dưới Henry II vào năm 1157.", "context",
);
const englandAnarchy = { ...region(
  "england", "Vương quốc Anh", blue, "London · phe Stephen",
  [-0.12, 51.51], [-1.3, 52.48],
  [[-6.28, 49.74], [2.03, 50.73], [1.94, 54.55], [-1.32, 54.79], [-2.03, 54.56],
    [-2.85, 54.44], [-3.68, 54.55], [-3.23, 53.53], [-3.04, 53.42], [-3.04, 53.02],
    [-3.12, 52.76], [-3.11, 52.43], [-2.97, 52.16], [-2.94, 51.92], [-2.68, 51.64],
    [-3.37, 51.49], [-4.55, 51.19], [-6.35, 50.72]],
  "Phe Stephen và Matilda tranh nhau ngai vàng của cùng một vương quốc. Ranh kiểm soát giữa hai phe thay đổi theo chiến dịch.",
), landCountries: britishLand };

const normandy = region(
  "normandy", "Normandy", blue, "Rouen", [1.1, 49.44], [-0.63, 49.24],
  [[-2.07, 49.85], [-0.85, 50.15], [0.69, 50.19], [1.44, 50.13], [1.83, 49.73],
    [1.62, 49.18], [1.08, 48.75], [0.16, 48.4], [-0.73, 48.43], [-1.45, 48.57], [-1.98, 48.86]],
  "Công quốc ở bờ nam eo Manche, với Rouen là một trung tâm. Quan hệ với ngôi vua Anh thay đổi theo từng lần kế vị và chinh phục.",
);
const anjou = region(
  "anjou", "Anjou · Maine · Touraine", blue, "Angers", [-0.55, 47.47], [0.01, 47.64],
  [[-1.42, 48.59], [-0.75, 48.43], [0.16, 48.4], [1.08, 48.75], [1.47, 47.95],
    [1.21, 47.08], [0.12, 46.96], [-0.65, 47.12], [-1.39, 47.41], [-1.47, 47.82]],
  "Nhóm lãnh địa của dòng Anjou quanh sông Loire, tiếp giáp Normandy ở phía bắc và các đất thuộc Aquitaine ở phía nam.",
);
const aquitaine = region(
  "aquitaine", "Aquitaine", blue, "Bordeaux", [-0.58, 44.84], [0.23, 45.26],
  [[-2.12, 47.1], [-1.39, 47.41], [-0.65, 47.12], [0.12, 46.96], [1.21, 47.08],
    [2.21, 46.51], [2.49, 45.9], [2.02, 45.11], [1.28, 44.4], [0.13, 43.37],
    [-1.62, 42.83], [-2.43, 44.02]],
  "Công quốc Eleanor thừa kế, với các quan hệ chư hầu phức tạp. Phần tô là địa bàn lớn thuộc quỹ đạo Aquitaine, gồm cả Poitou và Gascony.",
);
const aquitaine1360 = {
  ...aquitaine,
  name: "Aquitaine · Brétigny",
  summary: "Phạm vi gần đúng theo các nhượng địa được thỏa thuận năm 1360. Quyền kiểm soát thay đổi khi chiến tranh tiếp diễn và Pháp lấy lại nhiều đất.",
};
const brittany = region(
  "brittany", "Brittany", purple, "Rennes", [-1.68, 48.12], [-2.73, 48.02],
  [[-5.17, 49.07], [-1.48, 48.75], [-1.45, 48.1], [-1.39, 47.41], [-2.12, 47.1], [-4.55, 47.25]],
  "Công quốc Brittany nằm trong quỹ đạo Henry II thông qua con trai Geoffrey và nữ công tước Constance, với quyền cai trị riêng.", "context",
);
const gascony = region(
  "gascony", "Gascony · vùng Bordeaux", blue, "Bordeaux", [-0.58, 44.84], [-0.76, 44.45],
  [[-1.51, 45.61], [-0.71, 45.63], [-0.18, 45.23], [0.17, 44.62], [-0.2, 44.12],
    [-0.83, 43.61], [-1.42, 43.37], [-2.05, 43.49]],
  "Lãnh địa quanh cửa sông Gironde và Bordeaux. Pháp chấm dứt quyền cai trị của Anh tại Gascony năm 1453.",
);
const calais = region(
  "calais", "Calais", blue, "Calais · cảng", [1.86, 50.95], [2.03, 50.91],
  [[1.53, 51.13], [2.11, 51.14], [2.04, 50.83], [1.62, 50.81]],
  "Calais và vùng phụ cận thuộc Anh từ năm 1347 đến 1558. Lược đồ làm nổi vùng cảng để dễ chọn.",
);
const france = region(
  "france", "Vương quốc Pháp", red, "Paris", [2.35, 48.86], [3.12, 48.92],
  [[2.7, 50.79], [6.52, 50.32], [6.88, 47.1], [5.12, 44.63], [2.8, 43.25],
    [2.5, 45.91], [2.3, 46.53], [1.53, 47.95], [1.73, 49.24], [2.21, 50.42]],
  "Vùng đặt nhãn quanh lõi vương quyền Pháp. Đường tô chỉ giúp phân biệt với các lãnh địa thuộc nhà vua Anh được minh họa trong cảnh.", "context",
);
const franceModern = unit(
  "france", "Pháp", ["France"], red, "Paris", [2.35, 48.86], [0.15, 48.97],
  "Nằm bên kia eo Manche, đối diện bờ nam England. Phần tô theo nền địa lý hiện đại.", "context",
);

const denmarkViking = {
  ...unit("denmark", "Đan Mạch", ["Denmark"], blue, "Roskilde", [12.08, 55.64], [9.47, 55.6],
    "Gồm Jutland và các đảo Đan Mạch, cùng Skåne và vùng bờ tây nam Scandinavia thuộc Đan Mạch lịch sử. Biên phía nam ở vùng Schleswig–Eider có tính gần đúng."),
  rings: [
    ...land.Denmark,
    [[8.1, 55.1], [9.8, 55.08], [10.2, 54.51], [9.45, 54.33], [8.06, 54.31], [8.1, 55.1]],
    [[11.44, 57.71], [12.42, 57.75], [13.06, 56.48], [14.11, 56.36],
      [15.7, 56.28], [15.78, 55.2], [12.6, 54.98], [11.44, 57.71]],
  ],
  landCountries: ["Denmark", "Sweden", "Germany"],
} satisfies HistoricalStateModel;
const norwayFront: Point[] = [
  [11.14, 58.96], [12.24, 60.58], [12.13, 61.71], [13.11, 63.49],
  [14.47, 64.65], [15.28, 66.17], [17.76, 68.06], [20.4, 69.58], [24.0, 70.61],
];
const norwayViking = { ...region(
  "norway", "Na Uy", blue, "Nidaros · Trondheim", [10.39, 63.43], [8.5, 62.4],
  [[3.0, 57.6], [8.91, 57.75], ...norwayFront, [28.15, 71.48], [17.0, 71.8], [1.6, 63.45]],
  "Cnut giành quyền ở Na Uy năm 1028. Lược đồ theo vùng duyên hải và các địa bàn chính từ Viken qua Trøndelag lên phía bắc. Biên trong vùng núi và vùng cư trú của người Sámi mang tính gần đúng.",
), landCountries: ["Norway", "Sweden"] };
const sweden = { ...region(
  "sweden", "Thụy Điển", gold, "Sigtuna", [17.72, 59.62], [16.85, 59.82],
  [[11.4, 57.81], [12.42, 57.75], [13.06, 56.48], [14.11, 56.36], [15.7, 56.28],
    [19.98, 56.39], [24.41, 66.48], [21.96, 69.43], [17.76, 68.06],
    ...norwayFront.slice(0, 6).reverse()],
  "Các địa bàn Svear và Götar nằm về phía đông. Phần tô minh họa vùng chính; phạm vi tuyên bố của Cnut với một phần người Thụy Điển còn tranh luận.", "context",
), landCountries: ["Sweden", "Norway"] };
const empire = { ...region(
  "holy-roman-empire", "Phía bắc Đế quốc La Mã Thần thánh", purple, "Hamburg · vùng cửa Elbe",
  [9.99, 53.55], [10.65, 52.27],
  [[7.0, 54.0], [8.06, 54.31], [9.45, 54.33], [10.2, 54.51], [11.3, 53.9],
    [13.5, 52.32], [14.1, 49.98], [6.4, 49.98]],
  "Phía nam Jutland là các địa bàn biên của đế quốc dưới thời Conrad II. Bản đồ chỉ tô phần tiếp giáp Biển Bắc, thuộc khung khu vực.", "context",
), landCountries: ["Germany"] };

const survey = (
  year: number, title: string, note: string, states: HistoricalStateModel[],
  sources: HistoricalStateMapModel["sources"],
  view = islesView, landCountries = withIreland,
): HistoricalStateMapModel => ({
  year, title, note: `${mapNote} ${note}`, states, sources, view, landCountries,
});

const modernCore = [
  { ...england, name: "England", summary: "Một trong bốn xứ hợp thành Vương quốc Liên hiệp. Tiếp giáp Wales và Scotland trên đảo Đại Anh." },
  { ...angloWales, summary: "Một trong bốn xứ hợp thành Vương quốc Liên hiệp, ở phía tây England." },
  { ...scotland, kind: "state" as const, color: blue, summary: "Scotland ở phía bắc đảo Đại Anh. Đường biên với England là ranh giới nội bộ của Vương quốc Liên hiệp." },
  unit("northern-ireland", "Bắc Ireland", ["Northern Ireland"], blue, "Belfast", [-5.93, 54.6], [-6.74, 54.67],
    "Sáu hạt ở phía đông bắc đảo Ireland tiếp tục thuộc Vương quốc Liên hiệp khi Nhà nước Tự do Ireland thành lập năm 1922."),
];
const irelandSouth = unit("ireland", "Ireland", ["Ireland"], green, "Dublin", [-6.26, 53.35], [-8.0, 53.0],
  "Nhà nước Tự do Ireland được thành lập năm 1922. Biên giới với Bắc Ireland tiếp tục theo đường phân chia đã được xác nhận năm 1925.", "context");
const greatBritain = [england, angloWales, {
  ...scotland, kind: "state" as const, color: blue,
  summary: "Scotland ở phía bắc đảo Đại Anh. Đường biên với England tiếp tục phân định hai hệ thống pháp luật.",
}];
const unitedIsles = [...greatBritain, { ...royalIreland, name: "Ireland", kind: "state" as const,
  summary: "Toàn đảo Ireland thuộc Vương quốc Liên hiệp sau Liên hiệp 1801, đến khi Nhà nước Tự do Ireland được thành lập năm 1922." }];

export const englandStateMaps: Partial<Record<string, HistoricalStateMapModel>> = {
  ...earlyEnglandStateMaps,
  "edgar-england": survey(
    973, "Anh thời Edgar, sau khi York về dưới quyền vua Anh",
    "Lược đồ thể hiện phần lõi England dưới một triều đình. Quyền kiểm soát ở vùng biên Cumbria và Lothian còn thay đổi.",
    [{ ...englandEarly, summary: "York về dưới quyền các vua Anh từ năm 954. Edgar kế vị năm 959 và củng cố luật lệ, tiền xu và mạng lưới tu viện trên khắp vương quốc." },
      ...earlyEnglandStateMaps["kingdom-of-england"].states.filter(({ id }) =>
        id === "alba" || id === "strathclyde"),
      welshKingdoms],
    [edgar, englishOrigins, saxonChronicle],
  ),
  "aethelred-sweyn": survey(
    1013, "Anh cuối năm 1013 · Sweyn được thừa nhận làm vua",
    "Anh thuộc quyền Sweyn trong thời gian ngắn. Lược đồ tập trung vào đảo Britain và Normandy, nơi Æthelred lưu vong. Đan Mạch, vương quốc gốc của Sweyn, nằm ngoài khung này.",
    [{ ...englandEarly, summary: "Sweyn đánh chiếm phần lớn vương quốc năm 1013. Khi ông mất đầu năm 1014, Æthelred trở lại Anh." },
      alba, welshKingdoms, { ...normandy, color: purple, kind: "context", summary: "Công quốc bên kia eo Manche. Æthelred chạy sang đây khi mất ngai năm 1013." }],
    [aethelredII, saxonChronicle, englishOrigins], channelView, withFrance,
  ),
  "cnut-north-sea": survey(
    1029, "Ba vương quốc của Cnut qua Biển Bắc",
    "Cùng màu xanh là ba ngai vàng Cnut nắm khoảng năm 1029. Ranh đất liền ở Scandinavia được giản lược. Lược đồ không nối các vương quốc bằng vùng biển hoặc tô toàn bộ Thụy Điển.",
    [{ ...englandEarly, name: "Anh", labelAt: [-0.6, 52.83], summary: "Cnut làm vua Anh từ 1016. Vương quốc gồm nhiều bá tước địa phương và tiếp tục sử dụng hệ thống luật lệ Anglo-Saxon." }, denmarkViking, norwayViking,
      alba, { ...welshKingdoms, name: "Wales", labelAt: [-4.15, 52.15] }, sweden, empire,
      { ...normandy, color: purple, kind: "context", summary: "Công quốc dưới quyền bá chủ danh nghĩa của vua Pháp. Emma xứ Normandy kết hôn với Cnut năm 1017." }],
    [cnut, cnutRoyal, {
      title: "Norgeshistorie · Cnut nắm quyền tại Na Uy",
      url: "https://www.norgeshistorie.no/artikler/vikingtid/0811-samlingen-av-norge.html",
    }, {
      title: "National Museum of Denmark · Các thành vòng tại Đan Mạch và Skåne",
      url: "https://en.natmus.dk/viking-age-ring-fortresses/",
    }, naturalEarth], northSeaView, [...withFrance, "Denmark", "Norway", "Sweden", "Germany"],
  ),
  "late-anglo-saxon": survey(1065, "Anh dưới thời Edward Xưng Tội",
    "Phía bắc và tây có các vùng biên chuyển tiếp. Normandy là chính thể bên kia Manche.",
    [englandEarly, alba, welshKingdoms, { ...normandy, color: purple, kind: "context" }],
    [englishOrigins, norms, wales], channelView, withFrance),
  "norman-conquest": survey(1086, "Anh và Normandy dưới thời William I",
    "Hai vùng cùng màu do William cai trị với hai tước vị. Các phần do lãnh chúa Marches kiểm soát tại Wales còn biến động.",
    [englandEarly, normandy, alba, welshKingdoms], [norms, englishOrigins, wales], channelView, withFrance),
  "the-anarchy": survey(1146, "Anh thời Stephen và các vùng tranh chấp",
    "Normandy đã về tay Geoffrey xứ Anjou. Màu vàng ở phía bắc đánh dấu phần đất David I nắm hoặc tranh chấp. Ranh giữa phe Stephen và Matilda thay đổi theo chiến dịch.",
    [englandAnarchy, scotland, northEngland, welshKingdoms, { ...normandy, color: purple, kind: "context" }],
    [anarchy, angevin, wales], channelView, withFrance),
  angevin: survey(1180, "Anh và các lãnh địa Angevin",
    "Các lãnh địa chính của Henry II trên đảo và lục địa có cùng màu. Brittany có công tước riêng. Ireland mới chỉ có một phần thuộc quyền Henry.",
    [england, scotland, welshKingdoms, normandy, anjou, aquitaine, brittany, france, ireland],
    [angevin, unions, wales], aquitaineView, withFrance),
  plantagenet: survey(1360, "Anh, Wales và các nhượng địa theo Brétigny",
    "Vùng tô ở Pháp biểu thị các vùng lớn được nhượng theo hiệp ước và tiền đồn Calais. Ranh hành chính ở Wales và biên Scotland còn có ngoại lệ địa phương.",
    [england, scotland, welshMarches, aquitaine1360, calais, france, ireland],
    [borders, wales, hundredYears], aquitaineView, withFrance),
  lancaster: survey(1422, "Lancaster và các lãnh địa chính ở Pháp",
    "Normandy, Calais và Gascony được tô theo các khu vực chính. Mức kiểm soát ở các vùng khác của Pháp thay đổi trong chiến tranh.",
    [england, scotland, welshMarches, normandy, gascony, calais, france, ireland],
    [lancaster, hundredYears, wales], aquitaineView, withFrance),
  "wars-of-the-roses": survey(1483, "Anh thời Chiến tranh Hoa Hồng",
    "Mốc sau khi Berwick về Anh năm 1482. Calais là tiền đồn còn giữ ở Pháp. Hai phe tranh cùng một vương quốc.",
    [england, scotland, welshMarches, calais, france, ireland], [berwick, hundredYears, wales], channelView, withFrance),
  tudor: survey(1545, "England và Wales sau các luật thời Tudor",
    "Ireland có cùng nhà vua với England, với quyền cai trị thực tế còn phân tán. Calais vẫn thuộc Anh tại mốc này.",
    [england, angloWales, scotland, royalIreland, calais, france], [unions, wales, hundredYears], channelView, withFrance),
  elizabethan: survey(1590, "Anh và các láng giềng thời Elizabeth I",
    "Scotland còn là vương quốc riêng. Ireland có cùng nữ vương với England. Calais đã thuộc Pháp.",
    [england, angloWales, scotland, royalIreland, france], [unions, crowns, hundredYears], channelView, withFrance),
  stuart: survey(1630, "Ba vương quốc dưới cùng vương miện Stuart",
    "England và Wales, Scotland, và Ireland dùng chung quốc vương. Màu xanh cùng thể hiện liên minh vương miện. Các đường biên và thể chế riêng vẫn tồn tại.",
    [england, angloWales, { ...scotland, color: blue }, royalIreland, france], [crowns, unions], channelView, withFrance),
  commonwealth: survey(1654, "Thời Bảo hộ ở Anh, Scotland và Ireland",
    "Mốc sau các chiến dịch của Nghị viện tại Scotland và Ireland. Cả hai gửi đại diện đến Westminster từ năm 1654.",
    [...greatBritain, { ...royalIreland, name: "Ireland", kind: "state", summary: "Ireland được đưa vào cùng chính quyền Commonwealth và gửi đại diện tới Westminster." }, franceModern],
    [commonwealth, unions], channelView, withFrance),
  restoration: survey(1707, "Đại Anh sau Liên hiệp 1707",
    "England, Wales và Scotland tạo thành Đại Anh. Ireland có nghị viện riêng và cùng quân chủ.",
    [...greatBritain, { ...royalIreland, color: green }, franceModern], [britishUnion, unions], channelView, withFrance),
  georgian: survey(1831, "Vương quốc Liên hiệp Đại Anh và Ireland",
    "Sau liên hiệp năm 1801, cả Đại Anh và đảo Ireland thuộc một vương quốc. Các thuộc địa nằm ngoài phạm vi bản đồ này.",
    [...unitedIsles, franceModern], [unions, naturalEarth], channelView, withFrance),
  victorian: survey(1881, "Vương quốc Liên hiệp tại châu Âu thời Victoria",
    "Đại Anh và toàn đảo Ireland thuộc Vương quốc Liên hiệp. Đế quốc hải ngoại có nhiều hình thức quản trị và nằm ngoài khung bản đồ này.",
    [...unitedIsles, franceModern], [unions, naturalEarth], channelView, withFrance),
  "world-wars": survey(1931, "Vương quốc Liên hiệp sau khi Ireland phân chia",
    "Vùng màu xanh thể hiện phạm vi tại châu Âu sau năm 1922. Nhà nước Tự do Ireland nằm ở phía bên kia đường biên của Bắc Ireland.",
    [...modernCore, { ...irelandSouth, name: "Nhà nước Tự do Ireland" }, franceModern],
    [unions, naturalEarth], channelView, withFrance),
  "modern-britain": {
    year: 2025, dateLabel: "Hiện đại",
    title: "Bốn xứ của Vương quốc Liên hiệp và các láng giềng",
    note: "Địa giới hiện đại theo Natural Earth ở tỷ lệ 1:50 triệu. England, Wales, Scotland và Bắc Ireland cùng thuộc Vương quốc Liên hiệp. Ranh giới trên bộ giữa hai nước nằm trên đảo Ireland.",
    view: channelView, landCountries: withFrance,
    states: [...modernCore, { ...irelandSouth, name: "Cộng hòa Ireland" }, franceModern],
    sources: [unions, naturalEarth],
  },
};
