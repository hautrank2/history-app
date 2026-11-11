import {
  alfredLife, brunanburhResearch, englishOrigins, mercia, romanBritain,
  saxonChronicle, saxonKings, vikingBritain,
} from "~/data/england-geography";
import type {
  HistoricalStateMapModel,
  HistoricalStateModel,
} from "~/types/historical-state-map";

// Approximate land areas with shared edges where a frontier is shown.
export type Point = [number, number];

export const region = (
  id: string,
  name: string,
  color: string,
  center: string,
  at: Point,
  labelAt: Point,
  edge: Point[],
  summary: string,
  kind: HistoricalStateModel["kind"] = "state",
): HistoricalStateModel => ({
  id, name, color, kind, center: { name: center, at }, labelAt,
  rings: [[...edge, edge[0]]],
  summary,
});

export const britainView: HistoricalStateMapModel["view"] = {
  northwest: [-6.35, 58.1],
  southeast: [2.05, 49.85],
};

export const mapNote = "Các vùng màu và nét đứt thể hiện phạm vi gần đúng ở mốc đang xem. Vùng để trống nằm ngoài phần địa bàn được dựng lại.";
export const britishLand = ["England", "Wales", "Scotland", "Northern Ireland"];
const angloSaxon = {
  title: "British Museum · Bản đồ các vương quốc Anglo-Saxon",
  url: "https://smarthistory.org/anglo-saxon-england/",
};
const cambridge = {
  title: "Cambridge University Press · Wessex mở rộng về phía đông nam",
  url: "https://www.cambridge.org/core/books/abs/medieval-european-coinage/rise-of-wessex-in-southern-england/4376F0C0F675A77C943DFA0D73B52506",
};
const wales = {
  title: "Cardiff University · Các vương quốc Wales cuối thế kỷ IX, hình 2.1",
  url: "https://orca.cardiff.ac.uk/id/eprint/165430/1/2023butlercphd.pdf",
};
const scotland = {
  title: "National Museums Scotland · Từ các vương quốc Pict đến Alba",
  url: "https://www.nms.ac.uk/discover-catalogue/understanding-hoards-in-the-viking-age",
};
const oxford = {
  title: "All Souls College, Oxford · Sự hình thành Vương quốc Anh",
  url: "https://www.asc.ox.ac.uk/sites/default/files/migrated-files/The%20Origins%20of%20the%20English%20Kingdom.pdf",
};

const welshFront: Point[] = [
  [-3.04, 53.42], [-3.04, 53.02], [-3.12, 52.76], [-3.11, 52.43],
  [-2.97, 52.16], [-2.94, 51.92], [-2.68, 51.64],
];
const [dee, , , , upperWye] = welshFront;
const upperSevern: Point = [-3.69, 52.55];
const northWalesDivide: Point = [-3.85, 52.83];
const eastDyfed: Point = [-4.44, 51.93];
const southDyfed: Point = [-4.65, 51.71];

const welshRegions = [
  region(
    "gwynedd", "Gwynedd", "#bfa3e6", "Aberffraw · Anglesey",
    [-4.47, 53.19], [-4.23, 53.08],
    [dee, [-3.45, 53.03], northWalesDivide, [-4.16, 52.68], [-5.04, 52.87],
      [-4.71, 53.63], [-3.1, 53.56]],
    "Vương quốc ở tây bắc Wales, gồm Anglesey và vùng núi Eryri (Snowdonia). ‘North Wales’ là tên vùng địa lý. Gwynedd là một vương quốc trong vùng đó.",
    "context",
  ),
  region(
    "powys", "Powys", "#e1ab78", "Mathrafal · thung lũng Severn",
    [-3.25, 52.65], [-3.47, 52.69],
    [...welshFront.slice(0, 5), upperSevern, northWalesDivide, [-3.45, 53.03]],
    "Vương quốc ở phía đông và giữa Wales, tiếp giáp Mercia. Thung lũng thượng lưu Severn là trục giao thông quan trọng. Offa’s Dyke đánh dấu nhiều đoạn vùng biên từng tranh chấp.",
    "context",
  ),
  region(
    "ceredigion", "Ceredigion", "#d49cbe", "Aberystwyth · điểm định vị",
    [-4.08, 52.41], [-4.11, 52.38],
    [[-4.16, 52.68], northWalesDivide, upperSevern, [-3.87, 52.2], eastDyfed,
      [-4.85, 52.11], [-4.54, 52.63]],
    "Miền tây Wales quanh vịnh Cardigan. Cuối thế kỷ IX, Ceredigion là một phần của Seisyllwg.",
    "context",
  ),
  region(
    "dyfed", "Dyfed", "#8bc5a6", "Tyddewi · St Davids",
    [-5.27, 51.88], [-4.88, 51.85],
    [[-4.85, 52.11], eastDyfed, southDyfed, [-4.94, 51.52], [-5.49, 51.66],
      [-5.54, 52.05]],
    "Vương quốc ở tây nam Wales. Tyddewi là trung tâm tôn giáo. Đầu thế kỷ X, Dyfed và Seisyllwg về dưới quyền Hywel Dda, tạo nên Deheubarth.",
    "context",
  ),
  region(
    "south-wales", "Nam Wales", "#a6b9e8", "Caerwent · Gwent",
    [-2.77, 51.61], [-3.59, 51.85],
    [eastDyfed, [-3.87, 52.2], upperSevern, upperWye,
      ...welshFront.slice(5), [-3.37, 51.49], [-4.2, 51.41], southDyfed],
    "Gộp một số chính thể để dễ đọc bản đồ. Gwent ở đông nam quanh sông Wye và cửa sông Severn, Glywysing xa hơn về phía tây, Brycheiniog ở vùng cao nội địa.",
    "context",
  ),
];

const strathclydeEdge: Point[] = [
  [-5.26, 56.12], [-4.45, 55.99], [-4.01, 55.94], [-3.47, 55.62],
  [-3.77, 55.08], [-4.64, 54.74], [-5.34, 55.24],
];
const strathclyde = region(
  "strathclyde", "Strathclyde", "#a7c6ef", "Alt Clut · Dumbarton Rock",
  [-4.56, 55.94], [-4.37, 55.55], strathclydeEdge,
  "Vương quốc của người Briton quanh thung lũng Clyde, ở tây nam Scotland ngày nay. Alt Clut thất thủ trước quân Viking năm 870. Ảnh hưởng về phía Cumbria thay đổi theo thời kỳ.",
  "context",
);
const northernEdge: Point[] = [[-4.01, 55.94], [-3.25, 56.04], [-2.17, 56.1]];
const scottishHeartland: Point[] = [
  ...northernEdge, [-1.35, 58.18], [-3.25, 58.43], [-4.28, 57.94],
  [-4.83, 57.32], [-4.28, 56.73], [-4.45, 55.99],
];
const pictland = region(
  "pictland", "Pictland", "#e5c484", "Forteviot · Strathearn",
  [-3.44, 56.31], [-3.38, 56.98], scottishHeartland,
  "Các vương quốc của người Pict ở phía bắc vịnh Forth. Sau thời Cináed mac Ailpín (Kenneth MacAlpin) giữa thế kỷ IX, vùng lõi này dần trở thành vương quốc Alba.",
  "context",
);
const alba = region(
  "alba", "Alba · Scotland", "#e5c484", "Scone · trung tâm hoàng gia",
  [-3.44, 56.42], [-3.38, 56.98], scottishHeartland,
  "Alba hình thành khoảng cuối thế kỷ IX và là vùng lõi của Scotland thời trung cổ. Strathclyde còn có vua riêng, Lothian nằm trong vùng ảnh hưởng Northumbria, còn phía bắc và các đảo có thế lực Scandinavia.",
  "context",
);
const cornwall = region(
  "cornwall", "Cornwall", "#b4ce92", "Tintagel · điểm định vị",
  [-4.76, 50.67], [-4.95, 50.42],
  [[-5.82, 49.94], [-5.77, 50.59], [-4.53, 50.98], [-4.26, 50.82],
    [-4.2, 50.56], [-4.23, 50.28], [-5.01, 49.88]],
  "Vùng Briton ở cực tây nam, phần còn lại của địa bàn Dumnonia cũ. Biên tây Wessex là vùng xung đột trong thế kỷ IX. Biên niên gọi vùng này là ‘West Wales’.",
  "context",
);

const humber: Point = [-0.7, 53.68];
const westernMercia: Point[] = [
  [-3.25, 53.54], ...welshFront, [-2.66, 51.7],
];
const wessexNorth: Point[] = [[-2.66, 51.7], [-2.11, 51.67], [-1.46, 51.58], [-0.79, 51.5]];
const wessexWest: Point[] = [
  [-2.66, 51.7], [-3.8, 51.34], [-4.55, 51.19], [-4.53, 50.98],
  [-4.26, 50.82], [-4.2, 50.56], [-4.23, 50.28], [-3.91, 50.13],
];
const thames: Point = [-0.02, 51.51];
const watling: Point = [-0.86, 52.06];
const treatyEdge: Point[] = [
  thames, [-0.12, 51.82], [-0.45, 51.9], [-0.47, 52.14],
  [-0.64, 52.15], watling,
];
const merciaDivision: Point[] = [watling, [-1.28, 52.41], [-1.7, 52.86], [-2.25, 53.28], [-2.45, 53.51]];
const yorkNorth: Point[] = [[-3.35, 54.37], [-2.63, 54.59], [-1.76, 54.61], [-0.79, 54.73]];

const wessexMap = {
  "ecgberht-wessex": {
    year: 825,
    title: "Đảo Britain ngay trước trận Ellendun (825)",
    note: `${mapNote} Mercia còn chi phối nhiều vùng đông nam. Wessex giành quyền tại Kent, Sussex, Surrey và Essex sau trận Ellendun.`,
    view: britainView,
    sources: [angloSaxon, cambridge, wales, scotland],
    states: [
      region(
        "wessex", "Wessex", "#72bde4", "Winchester · trung tâm hoàng gia",
        [-1.31, 51.06], [-2.54, 51.04],
        [...wessexWest, [-2.9, 50.45], [-1.52, 50.51], [-0.78, 50.67],
          [-0.83, 51.17], ...wessexNorth.slice(1).reverse()],
        "Vương quốc của người Tây Saxon ở nam và tây nam nước Anh ngày nay. Ecgberht lên ngôi năm 802. Winchester là một trung tâm của triều đình.",
      ),
      region(
        "mercia", "Mercia", "#d9b46b", "Tamworth · trung tâm hoàng gia",
        [-1.69, 52.63], [-1.98, 52.61],
        [...westernMercia, ...wessexNorth.slice(1), thames, [-0.11, 51.87],
          [0.17, 52.04], [0.22, 52.63], [0.53, 53.21], [0.39, 53.63],
          humber, [-2.04, 53.6]],
        "Thế lực lớn ở Midlands, giữa Wales và East Anglia. Biên với Northumbria ở phía đông gắn với cửa sông Humber. Ecgberht chiếm Mercia năm 829, rồi Wiglaf giành lại ngôi năm 830.",
      ),
      region(
        "northumbria", "Northumbria", "#a9ce86", "York · trung tâm phía nam",
        [-1.08, 53.96], [-1.97, 54.69],
        [[-3.47, 55.62], ...northernEdge, [-1.4, 54.62], [0.41, 53.64],
          humber, [-2.04, 53.6], [-3.25, 53.54], [-3.68, 54.28],
          [-3.77, 55.08]],
        "Vương quốc Anglo-Saxon phía bắc Humber, từ York qua Bamburgh đến Lothian ở đông nam Scotland ngày nay. Tại Dore năm 829, Northumbria thừa nhận ưu thế của Ecgberht trong một thời gian ngắn.",
      ),
      region(
        "east-anglia", "East Anglia", "#e69b8f", "Thetford · điểm định vị",
        [0.75, 52.41], [1.03, 52.52],
        [[0.17, 52.04], [0.22, 52.63], [0.56, 53.06], [1.89, 53.06],
          [1.94, 52.03], [0.71, 51.96]],
        "Vương quốc ở miền đông, gần với Norfolk và Suffolk ngày nay, giữa đầm Fen và Biển Bắc. Năm 825, người East Anglia tìm sự bảo hộ của Ecgberht trước sức ép từ Mercia.",
      ),
      region(
        "essex", "Essex", "#80c8c5", "Colchester · điểm định vị",
        [0.9, 51.89], [0.57, 51.77],
        [thames, [-0.11, 51.87], [0.17, 52.04], [0.71, 51.96], [1.52, 52.02],
          [1.35, 51.49], [0.72, 51.5]],
        "Địa bàn người Đông Saxon ở phía bắc hạ lưu Thames. Chịu ảnh hưởng Mercia trước khi rơi vào tay Wessex trong đợt mở rộng sau Ellendun.",
      ),
      region(
        "kent", "Kent", "#e4ca82", "Canterbury",
        [1.08, 51.28], [0.79, 51.28],
        [[0.13, 51.49], [1.61, 51.52], [1.6, 50.95], [0.57, 50.88],
          [0.27, 51.14]],
        "Vương quốc ở mũi đông nam, nhìn ra eo Dover. Æthelwulf đánh đuổi vua Baldred khỏi Kent sau trận Ellendun và cai trị vùng đông nam dưới quyền cha mình.",
      ),
      region(
        "sussex", "Sussex", "#e696b9", "Chichester · điểm định vị",
        [-0.78, 50.84], [-0.25, 50.92],
        [[-0.78, 50.67], [-0.83, 51.17], [0.27, 51.14], [0.57, 50.88],
          [0.58, 50.66]],
        "Địa bàn người Nam Saxon dọc bờ biển phía nam, bên kia vùng rừng Weald so với Surrey. Từ quyền chi phối của Mercia, vùng này chuyển sang Wessex sau Ellendun.",
      ),
      region(
        "surrey", "Surrey", "#aaa2e2", "Guildford · điểm định vị",
        [-0.57, 51.24], [-0.52, 51.33],
        [[-0.83, 51.17], [-0.79, 51.5], thames, [0.13, 51.49], [0.27, 51.14]],
        "Vùng giữa Thames và rừng Weald. Surrey chuyển sang Wessex sau năm 825, cùng nhóm đất đông nam. Đây là vùng phụ thuộc ngoài danh sách Thất quốc truyền thống.",
      ),
      ...welshRegions, strathclyde, pictland, cornwall,
    ],
  },
  "alfred-wessex": {
    year: 890,
    dateLabel: "Khoảng năm 890",
    title: "Khoảng 890 · Wessex, Mercia và các vùng Viking",
    note: `${mapNote} Danelaw là tên chung cho nhiều vùng dưới quyền Scandinavia. Nét vàng đánh dấu biên do Alfred và Guthrum thỏa thuận: từ Thames theo sông Lea đến nguồn, qua Bedford rồi ngược sông Great Ouse đến Watling Street. Đoạn xa hơn về phía bắc thể hiện vùng phân chia gần đúng.`,
    view: britainView,
    frontiers: [{ name: "Biên theo hiệp ước Alfred–Guthrum", points: treatyEdge }],
    sources: [
      {
        title: "Early English Laws · Hiệp ước Alfred–Guthrum",
        url: "https://earlyenglishlaws.ac.uk/law/agu",
      },
      {
        title: "White Rose eTheses · Lược đồ vương quốc Anglo-Saxon khoảng năm 900",
        url: "https://etheses.whiterose.ac.uk/id/eprint/3657/2/489865_vol1.pdf",
      },
      oxford, wales, scotland,
    ],
    states: [
      region(
        "wessex", "Wessex", "#72bde4", "Winchester · trung tâm hoàng gia",
        [-1.31, 51.06], [-2.53, 51.05],
        [...wessexWest, [-1.48, 50.43], [1.76, 50.63], [1.55, 51.8],
          [0.92, 51.96], [0.57, 51.96], ...treatyEdge, [-1.31, 51.62],
          ...wessexNorth.slice(1, 3).reverse()],
        "Wessex của Alfred gồm vùng lõi nam và tây nam, cùng Kent, Sussex, Surrey và một phần đất đông nam. Sau Edington năm 878, Alfred củng cố các thị trấn phòng thủ. Năm 886, ông nắm London rồi giao thành cho Æthelred xứ Mercia.",
      ),
      region(
        "west-mercia", "Tây Mercia", "#d9b46b", "Gloucester · trung tâm hoàng gia",
        [-2.24, 51.86], [-2.2, 52.59],
        [...westernMercia, ...wessexNorth.slice(1, 3), [-1.31, 51.62],
          ...merciaDivision, [-2.87, 53.53]],
        "Phần Mercia còn do người Anglo-Saxon cai trị, dưới quyền Æthelred, chồng của Æthelflæd. Ông thừa nhận vị thế đứng đầu của Alfred. Phía đông Mercia có các trung tâm Viking.",
      ),
      region(
        "danelaw", "Danelaw", "#e69b8f", "Thetford · Đông Anglia",
        [0.75, 52.41], [-0.14, 52.84],
        [[-2.45, 53.51], [-1.5, 53.6], humber, [0.41, 53.64],
          [1.97, 53.04], [1.98, 52.01], [0.92, 51.96], [0.57, 51.96],
          ...treatyEdge, ...merciaDivision.slice(1, -1)],
        "Guthrum cai trị East Anglia. Xa hơn về phía tây và bắc, các nhóm Viking làm chủ miền đông Mercia, quanh Derby, Leicester, Lincoln, Nottingham và Stamford. Họ có những trung tâm quyền lực riêng.",
      ),
      region(
        "jorvik", "York · Jórvík", "#dfa4d4", "York · trung tâm Scandinavia",
        [-1.08, 53.96], [-1.65, 54.17],
        [...yorkNorth, [-0.44, 54.2], [0.41, 53.64], humber, [-1.5, 53.6],
          [-2.45, 53.51], [-3.25, 53.54], [-3.6, 54.1]],
        "Quân Viking chiếm York năm 866. Vương quốc York của người Scandinavia bao trùm phần nam Northumbria cũ và có chính quyền riêng với East Anglia của Guthrum.",
      ),
      region(
        "bamburgh", "Bắc Northumbria", "#a9ce86", "Bamburgh · thành lũy",
        [-1.71, 55.61], [-2.07, 55.32],
        [[-3.47, 55.62], ...northernEdge, [-1.28, 55.18], [-0.79, 54.73],
          ...yorkNorth.slice(0, -1).reverse(), [-3.77, 55.08]],
        "Các lãnh chúa Anglo-Saxon còn giữ thế lực ở phía bắc York, quanh Bamburgh. Lothian, ở phía nam vịnh Forth, còn gắn với Northumbria. Địa bàn giữa hai vùng Northumbria biến động.",
      ),
      ...welshRegions, strathclyde, alba, cornwall,
    ],
  },
  "kingdom-of-england": {
    year: 927,
    title: "Năm 927 · Æthelstan chiếm York",
    note: `${mapNote} Màu xanh thể hiện vùng lõi của vương quốc sau khi Æthelstan chiếm York. Vùng quanh Bamburgh, Lothian và Cumbria còn có lãnh chúa riêng hoặc quyền kiểm soát chồng lấn.`,
    view: britainView,
    sources: [oxford, wales, scotland],
    states: [
      region(
        "england", "Vương quốc Anh", "#72bde4", "York · sáp nhập năm 927",
        [-1.08, 53.96], [-0.79, 52.42],
        [[-3.35, 54.37], [-3.15, 54.69], [-2.63, 54.59], [-1.76, 54.61],
          [-0.79, 54.73], [2.02, 53.45], [2.03, 50.52], [-1.49, 50.41],
          ...wessexWest.slice(1).reverse(), ...westernMercia.slice(0, -1).reverse()],
        "Æthelstan, con của Edward và cháu nội Alfred, kiểm soát Wessex, Mercia, East Anglia rồi chiếm York năm 927. Quyền cai trị ở York còn đổi chủ sau khi ông mất. Từ năm 954, York về dưới quyền các vua Anh lâu dài.",
      ),
      region(
        "bamburgh", "Bamburgh · Lothian", "#a9ce86", "Bamburgh · thành lũy",
        [-1.71, 55.61], [-1.94, 55.36],
        [[-3.47, 55.62], ...northernEdge, [-1.28, 55.18], [-0.79, 54.73],
          ...yorkNorth.slice(1, -1).reverse(), [-3.11, 54.89], [-3.77, 55.08]],
        "Lãnh chúa Bamburgh thừa nhận vị thế của Æthelstan tại cuộc gặp ở Eamont năm 927. Lothian dần chuyển sang quyền các vua Scotland trong những thế kỷ sau.",
        "context",
      ),
      ...welshRegions.filter(({ id }) => id !== "ceredigion" && id !== "dyfed"),
      region(
        "deheubarth", "Dyfed–Seisyllwg", "#8bc5a6", "Tyddewi · St Davids",
        [-5.27, 51.88], [-4.58, 52.01],
        [[-4.16, 52.68], northWalesDivide, upperSevern, [-3.87, 52.2],
          eastDyfed, southDyfed, [-4.94, 51.52], [-5.54, 51.66],
          [-5.54, 52.05], [-4.54, 52.63]],
        "Hywel Dda quy tụ Dyfed và Seisyllwg (gồm Ceredigion) dưới quyền mình vào đầu thế kỷ X. Từ các vùng này hình thành Deheubarth ở tây nam Wales.",
        "context",
      ),
      strathclyde, alba,
    ],
  },
} satisfies Record<string, HistoricalStateMapModel>;

const hadrian: Point[] = [
  [-3.23, 54.95], [-2.94, 54.93], [-2.64, 54.99], [-2.33, 55.02],
  [-2.05, 55.02], [-1.77, 54.99], [-1.53, 54.99],
];

const expandedWessex = region(
  "expanded-wessex", "Wessex & miền đông nam", "#72bde4", "Winchester · Wessex",
  [-1.31, 51.06], [-1.95, 51.12],
  [...wessexWest, [-1.48, 50.43], [1.83, 50.8], [1.72, 51.97], [0.71, 51.96],
    [0.17, 52.04], [-0.11, 51.87], thames, ...wessexNorth.slice(1).reverse()],
  "Æthelberht nắm Wessex và các vùng đông nam sau khi anh ông là Æthelbald mất năm 860. Trước đó, vùng đông nam từng do Æthelwulf, Æthelstan xứ Kent hoặc Æthelberht cai quản riêng.",
);
const southOfHumber = region(
  "edward-kingdom", "Địa bàn của Edward", "#72bde4", "Winchester · trung tâm hoàng gia",
  [-1.31, 51.06], [-0.96, 52.26],
  [...wessexWest, [-1.48, 50.43], [1.93, 50.69], [1.97, 53.25],
    [0.41, 53.64], humber, [-1.5, 53.6], [-2.45, 53.51],
    ...westernMercia.slice(0, -1)],
  "Edward giành East Anglia năm 917 và tiếp quản Mercia năm 918. Quyền kiểm soát York vẫn thuộc vua Scandinavia.",
);
const alfredMap = wessexMap["alfred-wessex"];
const yorkStates = alfredMap.states.filter(({ id }) => id === "jorvik" || id === "bamburgh");
const merciaAfter877: Point[] = [
  [-0.11, 51.87], [-0.84, 52.06], [-1.25, 52.43], [-1.62, 52.81],
  [-2.1, 53.15], [-2.45, 53.51],
];
const edwardStates = alfredMap.states.map((state) => {
  if (state.id === "wessex") return {
    ...state, summary: "Edward kế vị Alfred năm 899. Wessex phối hợp với Tây Mercia chống các lực lượng Scandinavia.",
  };
  if (state.id === "danelaw") return {
    ...state, summary: "Các nhà cai trị Scandinavia giữ East Anglia và nhiều đô thị ở đông Mercia. Vùng York có vua riêng.",
  };
  return state;
});

export const earlyEnglandStateMaps: Record<string, HistoricalStateMapModel> = {
  ...wessexMap,
  "roman-britain": {
    year: 170,
    dateLabel: "Khoảng năm 170",
    title: "Britannia sau khi quân La Mã rời Tường Antoninus",
    note: `${mapNote} Nét vàng đánh dấu tuyến Tường Hadrian. Lược đồ dùng phạm vi phía nam tường sau khi quân La Mã rút khỏi tuyến Antoninus, khoảng giữa đến cuối thế kỷ II.`,
    view: britainView,
    frontiers: [{ name: "Tường Hadrian · tuyến gần đúng", points: hadrian }],
    sources: [romanBritain],
    states: [
      region("britannia", "Britannia", "#72bde4", "Londinium", [-0.09, 51.51], [-1.6, 52.54],
        [[-5.72, 55.01], ...hadrian, [-0.8, 55.01], [2.0, 53.3], [1.93, 50.43], [-6.27, 49.74]],
        "La Mã kiểm soát phần lớn đất phía nam tuyến Solway–Tyne, gồm phần lớn England và Wales ngày nay."),
      region("north-of-wall", "Các cộng đồng Briton", "#e5c484", "Traprain Law · di chỉ",
        [-2.67, 55.96], [-3.6, 56.54], [[-6.45, 55.01], ...hadrian, [-0.75, 55.01], [-0.9, 59.22], [-6.7, 59.3]],
        "Nhiều cộng đồng sống ngoài vùng quân La Mã đồn trú thường xuyên. Ảnh hưởng và các chiến dịch của La Mã từng vươn xa hơn về phía bắc.", "context"),
    ],
  },
  "anglo-saxon": {
    ...wessexMap["ecgberht-wessex"],
    year: 790,
    dateLabel: "Khoảng năm 790",
    title: "Các vương quốc vào cuối thời Offa của Mercia",
    note: `${mapNote} Tên vùng thể hiện địa bàn từng vương quốc. Kent, Sussex và Essex có lúc chịu quyền chi phối của Mercia.`,
    states: wessexMap["ecgberht-wessex"].states.map((state) => state.id === "mercia" ? {
      ...state,
      summary: "Cuối thế kỷ VIII, Offa đưa Mercia lên vị thế nổi trội ở Midlands và chi phối nhiều đất phía đông nam. Offa’s Dyke đánh dấu một phần biên với các vương quốc Wales.",
    } : state),
  },
  "aethelwulf-wessex": {
    ...wessexMap["ecgberht-wessex"],
    year: 860,
    title: "Năm 860 · Æthelberht cai trị Wessex và miền đông nam",
    note: `${mapNote} Wessex có cùng một vua với các vùng Kent, Essex, Surrey và Sussex. Các vùng này có thể tách quyền cai trị trong những năm trước đó.`,
    sources: [saxonChronicle, englishOrigins],
    states: [
      expandedWessex,
      ...wessexMap["ecgberht-wessex"].states.filter(({ id }) =>
        !["wessex", "essex", "kent", "sussex", "surrey"].includes(id)),
    ],
  },
  "great-viking-army": {
    year: 870,
    dateLabel: "Khoảng năm 870",
    title: "Đại quân Viking đã chiếm York và đánh bại East Anglia",
    note: `${mapNote} Các vùng tím ở York và East Anglia biểu thị hai địa bàn chiến dịch. Mercia vẫn có vua riêng. Các cứ điểm của Đại quân có thể thay đổi theo mùa.`,
    view: britainView,
    sources: [saxonChronicle, alfredLife, vikingBritain, englishOrigins],
    states: [
      { ...expandedWessex, summary: "Æthelred I giữ Wessex và vùng đông nam. Cuối năm 870, quân Viking đóng tại Reading, mở đầu chiến dịch vào Wessex." },
      ...wessexMap["ecgberht-wessex"].states.flatMap((state) => {
        if (state.id === "mercia") return [{
          ...state, summary: "Burgred vẫn cai trị Mercia. Sau khi Đại quân trú tại Nottingham năm 868, Mercia và Wessex đã phối hợp đối phó. Burgred bỏ ngôi vào năm 874.",
        }];
        if (state.id === "east-anglia") return [{
          ...state, color: "#dfa4d4", summary: "Đại quân trú tại Thetford và đánh bại Edmund khoảng năm 869–870. Triều đại Anglo-Saxon cũ mất quyền ở East Anglia.",
        }];
        return [];
      }),
      ...yorkStates.map((state) => state.id === "jorvik" ? {
        ...state, name: "York do Đại quân nắm", summary: "Đại quân chiếm York năm 866 và đánh bại lực lượng của hai vua Northumbria năm 867. Vương quyền Scandinavia tại York hình thành dần về sau.",
      } : state),
      ...welshRegions, strathclyde, pictland, cornwall,
    ],
  },
  "alfred-edington": {
    year: 878,
    dateLabel: "Đầu năm 878",
    title: "Wessex và các địa bàn Viking trước trận Edington",
    note: `${mapNote} Mốc thể hiện Wessex lúc Guthrum đột kích Chippenham. Các địa điểm đánh dấu hành trình phản công trong năm 878.`,
    view: britainView,
    sources: [alfredLife, saxonChronicle, vikingBritain, englishOrigins],
    states: [
      { ...expandedWessex, name: "Wessex của Alfred", summary: "Guthrum đánh sâu vào Wessex đầu năm 878. Alfred rút về Somerset, lập căn cứ tại Athelney rồi phản công tại Edington." },
      region("west-mercia", "Tây Mercia", "#d9b46b", "Tamworth · trung tâm Mercia",
        [-1.69, 52.63], [-2.11, 52.44],
        [...westernMercia, ...wessexNorth.slice(1), thames, ...merciaAfter877, [-2.87, 53.53]],
        "Sau khi Đại quân chia đất Mercia năm 877, Ceolwulf II cai trị phần còn lại ở phía tây. Vị thế của ông được ghi khác nhau trong biên niên và qua chứng cứ tiền xu."),
      region("eastern-viking", "Đông Mercia & East Anglia", "#e69b8f", "Thetford · điểm định vị",
        [0.75, 52.41], [-0.02, 52.85],
        [...merciaAfter877, [-1.5, 53.6], humber, [0.41, 53.64], [1.97, 53.04],
          [1.98, 52.01], [0.71, 51.96], [0.17, 52.04]],
        "Các lực lượng Viking nắm nhiều địa bàn ở đông Mercia và East Anglia. Guthrum đưa quân tới Wessex và chỉ định cư ở East Anglia sau chiến dịch Edington."),
      ...yorkStates, ...welshRegions, strathclyde, pictland, cornwall,
    ],
  },
  "edward-succession": {
    year: 910,
    title: "Wessex và Mercia trước chiến thắng Tettenhall",
    note: `${mapNote} Danelaw còn trải qua East Anglia và đông Mercia. Trận Tettenhall diễn ra khi quân từ Northumbria đột kích sâu về phía nam.`,
    view: britainView,
    sources: [saxonChronicle, mercia, englishOrigins, wales, scotland],
    states: edwardStates,
  },
  "aethelflaed-mercia": {
    year: 916,
    title: "Tây Mercia dưới quyền Æthelflæd",
    note: `${mapNote} Mốc năm 916 cho thấy các địa bàn lớn trước khi Æthelflæd chiếm Derby và Edward giành East Anglia năm 917. Bấm các địa điểm để xem cả diễn biến về sau.`,
    view: britainView,
    sources: [mercia, saxonChronicle, englishOrigins, wales, scotland],
    states: edwardStates.map((state) => state.id === "west-mercia" ? {
      ...state, name: "Mercia · Æthelflæd", center: { name: "Tamworth · trung tâm của Æthelflæd", at: [-1.69, 52.63] },
      summary: "Æthelflæd cai trị Tây Mercia từ năm 911. Bà củng cố các thành như Tamworth và Stafford trước các chiến dịch lấy Derby và Leicester.",
    } : state),
  },
  "edward-aethelflaed": {
    ...wessexMap["alfred-wessex"],
    year: 920,
    dateLabel: "Khoảng năm 920",
    title: "Sau các chiến dịch của Edward và Æthelflæd",
    note: `${mapNote} Phần lớn đất phía nam Humber đã thuộc Edward. York vẫn dưới quyền Scandinavia đến năm 927.`,
    frontiers: [],
    sources: [mercia, saxonChronicle, englishOrigins, wales, scotland],
    states: [
      southOfHumber,
      ...wessexMap["alfred-wessex"].states.filter(({ id }) =>
        !["wessex", "west-mercia", "danelaw"].includes(id)),
    ],
  },
  brunanburh: {
    ...wessexMap["kingdom-of-england"],
    year: 937,
    title: "Æthelstan và các thế lực liên minh năm 937",
    note: `${mapNote} Alba, Strathclyde và vùng quanh Dublin là địa bàn của các vua tham chiến. Vị trí chiến trường còn tranh luận.`,
    view: { northwest: [-7.28, 58.1], southeast: [2.05, 49.85] },
    landCountries: [...britishLand, "Ireland"],
    sources: [brunanburhResearch, saxonChronicle, englishOrigins, wales, scotland],
    states: [
      ...wessexMap["kingdom-of-england"].states,
      region("viking-dublin", "Dublin · Anlaf", "#dfa4d4", "Dublin · trung tâm hoàng gia",
        [-6.26, 53.35], [-6.53, 53.15],
        [[-6.82, 53.05], [-6.48, 53.59], [-5.85, 53.58], [-5.89, 53.05]],
        "Anlaf (Óláfr) là vua Viking ở Dublin và một thủ lĩnh liên minh chống Æthelstan. Phạm vi màu đánh dấu vùng quanh cảng.", "context"),
    ],
  },
  "york-after-athelstan": {
    year: 952,
    title: "York trở lại dưới quyền Eric Bloodaxe",
    note: `${mapNote} York còn đổi chủ trong những năm sau khi Æthelstan mất. Từ năm 954, York thuộc vương quyền Anh lâu dài.`,
    view: britainView,
    sources: [saxonChronicle, englishOrigins, saxonKings, wales, scotland],
    states: [
      { ...southOfHumber, id: "england", name: "Vương quốc Anh", summary: "Edmund lấy lại các đô thị đông Mercia. Eadred giữ phần lớn các địa bàn phía nam Humber khi York đổi chủ." },
      ...yorkStates.map((state) => state.id === "jorvik" ? {
        ...state, name: "York · Eric Bloodaxe", summary: "Eric trở lại ngôi tại York năm 952. Năm 954, người Northumbria loại Eric và chấp nhận Eadred.",
      } : state),
      ...wessexMap["kingdom-of-england"].states.filter(({ id }) =>
        id !== "england" && id !== "bamburgh"),
    ],
  },
};
