import { chinaStateMaps } from "~/data/china-state-maps";
import { getCharacter } from "~/data/characters";
import dynastyRows from "~/data/database/china-dynasties.json";
import type { OverviewSourceModel } from "~/data/vietnam-overview-details";
import type { OverviewSceneModel } from "~/data/vietnam-overview";

type ChinaDynastyModel = {
  id: string;
  era: string;
  name: string;
  years: string;
  start: number;
  end: number | null;
  city: string;
  cityIds?: string[];
  capital?: string;
  summary: string;
  source: string;
  sourceArticle: string;
  sourceUrl?: string;
  extraSources?: OverviewSourceModel[];
  peopleIds: string[];
  mapId?: string;
};
type ChinaCityModel = { name: string; at: [number, number]; note?: string };

const eraOrder = [...new Set(dynastyRows.map((row) => row.era))];
export const chinaDynasties: ChinaDynastyModel[] = [...dynastyRows].sort(
  (first, second) => eraOrder.indexOf(first.era) - eraOrder.indexOf(second.era)
    || first.start - second.start,
);
const cities: Record<string, ChinaCityModel> = {
  erligang: { name: "Nhị Lý Đầu · điểm khảo cổ tham chiếu", at: [112.7, 34.68], note: "Chưa có kinh đô nhà Hạ được xác định chắc chắn; di chỉ chỉ giúp định vị vùng nghiên cứu, không xác nhận niên đại hoặc đường biên." },
  pengcheng: {
    name: "Bành Thành · Tây Sở",
    at: [117.19, 34.26],
    note: "Bành Thành là trung tâm của Hạng Vũ và Tây Sở trong cuộc chiến Hán–Sở; không phải kinh đô thống nhất của toàn cõi.",
  },
  nanzheng: {
    name: "Nam Trịnh · Hán vương",
    at: [107.03, 33.07],
    note: "Trung tâm ban đầu của Hán vương Lưu Bang sau khi được phân phong năm 206 TCN, trước khi lực lượng Hán chiếm Quan Trung.",
  },
  chongqing: { name: "Trùng Khánh", at: [106.55, 29.56] },
  taipei: { name: "Đài Bắc", at: [121.56, 25.03] },
  anyang: { name: "Ân Khư · An Dương", at: [114.35, 36.1] },
  xian: { name: "Trường An / vùng Tây An", at: [108.94, 34.26] },
  xianyang: { name: "Hàm Dương", at: [108.71, 34.33] },
  luoyang: { name: "Lạc Dương", at: [112.45, 34.62] },
  nanjing: { name: "Kiến Khang / Nam Kinh", at: [118.8, 32.06] },
  chengdu: { name: "Thành Đô", at: [104.07, 30.67] },
  pingyang: { name: "Bình Dương", at: [111.52, 36.09] },
  wuwei: { name: "Cô Tang / Vũ Uy", at: [102.64, 37.93] },
  ye: { name: "Nghiệp Thành", at: [114.61, 36.29] },
  longcheng: { name: "Long Thành", at: [120.45, 41.57] },
  zhongshan: { name: "Trung Sơn", at: [114.99, 38.52] },
  jincheng: { name: "Kim Thành · vùng Lan Châu", at: [103.83, 36.06] },
  ledu: { name: "Lạc Đô", at: [102.4, 36.48] },
  zhangye: { name: "Trương Dịch", at: [100.45, 38.93] },
  guanggu: { name: "Quảng Cố · Thanh Châu", at: [118.48, 36.69] },
  dunhuang: { name: "Đôn Hoàng", at: [94.66, 40.14] },
  tongwan: { name: "Thống Vạn Thành", at: [108.85, 37.99] },
  datong: { name: "Bình Thành / Đại Đồng", at: [113.3, 40.08] },
  jiangling: { name: "Giang Lăng", at: [112.2, 30.35] },
  kaifeng: { name: "Biện Kinh / Khai Phong", at: [114.31, 34.8] },
  yangzhou: { name: "Quảng Lăng / Dương Châu", at: [119.42, 32.39] },
  hangzhou: { name: "Lâm An / Hàng Châu", at: [120.16, 30.25] },
  fuzhou: { name: "Phúc Châu", at: [119.3, 26.08] },
  guangzhou: { name: "Phiên Ngung / Quảng Châu", at: [113.26, 23.13] },
  changsha: { name: "Trường Sa", at: [112.94, 28.23] },
  taiyuan: { name: "Thái Nguyên", at: [112.55, 37.87] },
  shangjing: { name: "Thượng Kinh · Liêu", at: [119.4, 43.98] },
  yinchuan: { name: "Hưng Khánh / Ngân Xuyên", at: [106.23, 38.49] },
  beijing: { name: "Bắc Kinh / vùng Đại Đô", at: [116.4, 39.9] },
  balasagun: { name: "Balasagun · Trung Á", at: [75.3, 42.75] },
  karakorum: { name: "Karakorum · điểm tham chiếu thảo nguyên", at: [102.83, 47.2] },
  xuchang: { name: "Hứa Xương", at: [113.85, 34.03] },
  huining: { name: "Hội Ninh · Thượng Kinh nhà Kim", at: [126.95, 45.52] },
  shenyang: { name: "Thịnh Kinh / Thẩm Dương", at: [123.43, 41.8] },
  zhaoqing: { name: "Triệu Khánh", at: [112.47, 23.05] },
  kunming: { name: "Côn Minh", at: [102.71, 25.04] },
};

const cultureByEra: Record<string, string> = {
  "Nhà Hạ": "Truyền thống chép về nhà Hạ cần được phân biệt với bằng chứng khảo cổ và văn bản cùng thời. Các di tích như Nhị Lý Đầu giúp nghiên cứu xã hội thời đại đồ đồng, nhưng việc đồng nhất một văn hóa khảo cổ với triều đại trong thư tịch vẫn còn tranh luận.",
  "Nhà Thương": "Giáp cốt văn, đồ đồng và di tích Ân Khư là những nguồn tư liệu quan trọng về thời Thương. Nội dung bói hỏi và tên người trong giáp cốt cung cấp bằng chứng trực tiếp khác với các truyền thuyết được ghi chép về sau.",
  "Tây Chu": "Lễ nghi, đồ đồng, quan hệ tông pháp và mạng lưới chư hầu gắn với trật tự Tây Chu. Tư tưởng Thiên mệnh được dùng để lý giải sự thay đổi quyền cai trị, trong khi quyền lực vẫn dựa vào nhiều trung tâm địa phương.",
  "Thời Xuân Thu": "Các nước chư hầu tranh quyền bá chủ trong khi uy quyền vương thất Chu suy giảm. Tư tưởng, lễ nghi và cách tổ chức xã hội được tranh luận; Khổng Tử sống vào cuối giai đoạn này.",
  "Thời Chiến Quốc": "Chiến tranh giữa các nước lớn đi cùng cải cách hành chính, huy động quân đội và tranh luận học thuật. Các học phái đưa ra nhiều cách trị nước khác nhau; văn hóa của những nước chư hầu không hoàn toàn đồng nhất.",
  "Nhà Tần": "Chuẩn hóa chữ viết, đo lường và văn thư gắn với bộ máy tập quyền thời Tần. Hiện vật, văn bản trên thẻ tre và di tích cung điện, lăng mộ cần được gắn với niên đại và địa điểm cụ thể.",
  "Hán – Sở tranh hùng": "Sự phân phong sau nhà Tần tạo ra nhiều chính thể, thay vì một nhà nước thống nhất ngay lập tức. Những câu chuyện về Lưu Bang, Hạng Vũ và các trận đánh được truyền lại qua sử học rồi văn học; cần phân biệt sử liệu với tình tiết được kể thêm về sau.",
  "Nhà Hán": "Chữ viết, văn thư và bộ máy hành chính có vai trò lớn trong nhà nước đế chế. Sử học, đồ tùy táng và di tích đô thành giúp nghiên cứu xã hội; hiện vật cần được gắn với niên đại và địa điểm cụ thể.",
  "Tam Quốc": "Sử liệu và văn học kể chuyện cần được đọc riêng. Tam quốc chí được biên soạn gần thời kỳ hơn; Tam quốc diễn nghĩa là tiểu thuyết nhiều thế kỷ sau, có những nhân vật và tình tiết được hư cấu.",
  "Nhà Tấn": "Thư pháp, thơ văn, hội họa và tư tưởng tôn giáo phát triển trong bối cảnh di cư và phân tranh. Đời sống trí thức miền nam gắn với tầng lớp thế gia và không đại diện toàn bộ cư dân.",
  "Thập Lục Quốc": "Nhiều cộng đồng cùng tham gia xây dựng các nhà nước phương bắc. Giao lưu trên các tuyến phía tây và hoạt động dịch kinh để lại dấu ấn; tên gọi một vương triều không đồng nghĩa một cộng đồng dân cư thuần nhất.",
  "Nam – Bắc triều": "Phật giáo, kiến trúc chùa tháp, nghệ thuật hang động và thư pháp phát triển ở nhiều vùng. Miền bắc và miền nam có điều kiện chính trị khác nhau nhưng vẫn trao đổi con người, vật phẩm và tư tưởng.",
  "Nhà Tùy": "Việc thống nhất bắc–nam và phát triển hệ thống Đại Vận Hà giúp kết nối nhiều vùng, nhưng các công trình và chiến dịch quân sự cũng tạo gánh nặng huy động lớn đối với dân cư.",
  "Nhà Đường": "Đô thành, thủy lộ và đường bộ tạo điều kiện giao lưu giữa nhiều vùng. Thơ ca, hội họa và hoạt động tôn giáo của thời Đường cần được đặt vào từng giai đoạn, kể cả thời Võ Chu xen giữa.",
  "Ngũ Đại – Thập Quốc": "Phân liệt không làm mọi hoạt động văn hóa ngừng lại. Các trung tâm vùng tiếp tục phát triển thơ văn, hội họa và nghề thủ công; mỗi nước có quan hệ riêng với mạng lưới thương mại và đô thị.",
  "Tống – Liêu – Hạ – Kim": "Thời kỳ này có nhiều nhà nước, ngôn ngữ và truyền thống cùng tồn tại. In ấn, thương mại, đồ gốm và nghệ thuật phát triển qua cả hợp tác lẫn xung đột; không nên quy mọi di sản về riêng nhà Tống.",
  "Nhà Nguyên": "Các mạng lưới giao lưu Á–Âu dưới quyền cai trị Mông Cổ nối nhiều cộng đồng và đô thị. Sân khấu, nghề thủ công và trao đổi kỹ thuật phát triển trong một xã hội có nhiều tầng lớp và địa vị pháp lý khác nhau.",
  "Nhà Minh": "Văn học, sân khấu, sách in và nghề thủ công phát triển cùng thị trường và đô thị. Chân dung cung đình và các tác phẩm về sau cần được phân biệt về tác giả, niên đại và mục đích.",
  "Nhà Thanh": "Tư liệu cung đình, sách in, đồ sứ và sinh hoạt của nhiều cộng đồng cho thấy một xã hội đa dạng. Văn hóa cung đình không thể thay cho toàn bộ trải nghiệm làng quê, đô thị và các vùng biên.",
  "Dân Quốc · Khởi lập": "Báo chí, giáo dục và các trào lưu tư tưởng mới phát triển giữa cách mạng và phân tranh quân phiệt. Phong trào Ngũ Tứ năm 1919 gắn với nhiều cuộc tranh luận về xã hội và văn hóa.",
  "Dân Quốc · Tưởng Giới Thạch": "Giáo dục, báo chí, điện ảnh và đời sống đô thị phát triển trong thập niên Nam Kinh, đồng thời chịu sự kiểm soát chính trị và các cuộc xung đột xã hội.",
  "Dân Quốc · Kháng Nhật": "Di tản trường học, hoạt động báo chí và văn nghệ kháng chiến gắn với chiến tranh. Tổn thất dân thường và phá hủy di sản cần được nhìn từ nhiều nguồn và cộng đồng.",
  "Dân Quốc · Nội chiến": "Di cư, lạm phát và chiến tranh làm thay đổi sinh hoạt văn hóa và giáo dục. Ký ức về giai đoạn này được lưu giữ khác nhau tại đại lục, Đài Loan và trong cộng đồng di dân.",
  "CHND Trung Hoa · Sau 1949": "Giáo dục đại chúng, văn nghệ và truyền thông gắn chặt với các vận động chính trị. Cách mạng Văn hóa gây gián đoạn giáo dục, đàn áp con người và phá hủy nhiều di sản.",
  "Trung Quốc · Cải cách": "Cải cách kinh tế, di cư và đô thị hóa làm thay đổi đời sống. Điện ảnh, văn học và công nghệ truyền thông mở thêm hình thức sáng tạo, đồng thời tiếp tục chịu kiểm soát chính trị.",
};

export const chinaSceneAliases: Record<string, string> = {
  "qin-han": "qin",
  "sui-tang": "sui",
  "song-yuan": "northern-song",
  "ming-qing": "ming",
};
export const chinaMapIdFor = (sceneId: string) =>
  chinaDynasties.find((row) => row.id === sceneId)?.mapId;

export const chinaOverview: OverviewSceneModel[] = chinaDynasties.map((row) => {
  const city = cities[row.city];
  const extent = row.id === "xia"
    ? city.note ?? "Chưa xác định chắc chắn phạm vi nhà Hạ."
    : `Trung tâm tham chiếu: ${city.name}. Kinh đô và vùng kiểm soát có thể thay đổi trong giai đoạn ${row.years}. Các triều đại trong cùng thời phân liệt có thể tồn tại song song; thứ tự đọc không phải chuỗi thay thế trên toàn cõi.`;
  return {
    id: row.id,
    era: row.era,
    years: row.years,
    year: row.start,
    title: row.name,
    nation: row.name,
    capital: row.capital ?? (row.id === "xia"
      ? "Chưa xác định chắc chắn"
      : `${city.name} · trung tâm tiêu biểu`),
    territory: "full",
    extent,
    summary: row.summary,
    culture: { title: "Văn hóa và cách đọc tư liệu", text: cultureByEra[row.era] },
    people: row.peopleIds.map((id) => getCharacter(id)),
    places: (row.cityIds ?? [row.city]).map((cityId) => {
      const place = cities[cityId];
      return {
        name: place.name,
        at: place.at,
        kind: row.id === "xia" ? "heritage" : "capital",
        detail: place.note ?? `Trung tâm tiêu biểu để định vị ${row.name}. Tọa độ ước lượng; không phải toàn bộ danh sách kinh đô và không biểu thị ranh giới lịch sử.`,
      };
    }),
    sources: [row.source],
  };
});

const yearLabel = (year: number) => year < 0 ? `${-year} TCN` : String(year);
export const chinaEraYears: Record<string, string> = Object.fromEntries(
  [...new Set(chinaDynasties.map((row) => row.era))].map((era) => {
    const rows = chinaDynasties.filter((row) => row.era === era);
    const start = Math.min(...rows.map((row) => row.start));
    const end = rows.some((row) => row.end === null)
      ? "nay"
      : yearLabel(Math.max(...rows.map((row) => row.end ?? row.start)));
    return [era, `${yearLabel(start)} – ${end}`];
  }),
);
export const chinaPeriods = [...new Set(chinaOverview.map((scene) => scene.era))]
  .map((era) => {
    const scene = chinaOverview.find((item) => item.era === era);
    return {
      slug: scene?.id ?? "xia",
      title: era,
      years: chinaEraYears[era],
      blurb: scene?.summary ?? "",
    };
  });

export const chinaTimelineSource = {
  title: "Columbia University · Timeline of Chinese Historical Periods",
  url: "https://afe.easia.columbia.edu/timelines/china_timeline.htm",
};
export const chinaSourcesFor = (sceneId: string): OverviewSourceModel[] => {
  const row = chinaDynasties.find((item) => item.id === sceneId);
  return [
    ...(row?.sourceUrl ? [{ title: row.source, url: row.sourceUrl }] : []),
    ...(row?.extraSources ?? []),
    chinaTimelineSource,
    ...(chinaStateMaps[row?.mapId ?? ""]?.sources ?? []),
  ];
};
