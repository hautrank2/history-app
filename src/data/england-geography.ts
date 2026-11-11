import type { OverviewSourceModel } from "~/data/vietnam-overview-details";

export type EnglandFlagModel = {
  design: "st-george" | "union-1606" | "union-1801" | "commonwealth-jack";
  label: string;
  source: OverviewSourceModel;
};

type MeasureModel = {
  value: string;
  scope: string;
  note: string;
  source: OverviewSourceModel;
};

type EnglandGeographyModel = {
  realm: string;
  extent: string;
  neighbours: string;
  sources: OverviewSourceModel[];
  area?: MeasureModel;
  population?: MeasureModel;
  flag?: EnglandFlagModel;
};

const source = (title: string, url: string): OverviewSourceModel => ({ title, url });
export const naturalEarth = source(
  "Natural Earth · Địa giới tham chiếu 1:50m, public domain",
  "https://github.com/nvkelso/natural-earth-vector/blob/v5.1.2/50m_cultural/ne_50m_admin_0_map_subunits.README.html",
);
export const romanBritain = source(
  "English Heritage · Britannia và các tuyến phòng thủ La Mã",
  "https://www.english-heritage.org.uk/learn/story-of-england/romans/introduction/",
);
export const vikingBritain = source(
  "English Heritage · Người Viking ở Anh",
  "https://www.english-heritage.org.uk/visit/inspire-me/the-history-of-Vikings-in-england/",
);
export const saxonChronicle = source(
  "Anglo-Saxon Chronicle · Bản dịch các biên niên",
  "https://www.gutenberg.org/cache/epub/657/pg657.html",
);
export const alfredLife = source(
  "Asser · Cuộc đời vua Alfred",
  "https://www.gutenberg.org/files/63384/63384-h/63384-h.htm",
);
export const mercia = source(
  "Tamworth Castle · Æthelflæd và Mercia",
  "https://www.tamworthcastle.co.uk/aethelflaed",
);
export const englishOrigins = source(
  "All Souls College, Oxford · Sự hình thành Vương quốc Anh",
  "https://www.asc.ox.ac.uk/sites/default/files/migrated-files/The%20Origins%20of%20the%20English%20Kingdom.pdf",
);
export const brunanburhResearch = source(
  "University of Chester · Nghiên cứu về địa điểm trận Brunanburh",
  "https://www.chester.ac.uk/about/news/articles/new-book-paves-the-way-for-ending-the-debate-on-location-of-historic-british-battle/",
);
export const saxonKings = source("The Royal Family · Các vua Anglo-Saxon", "https://www.royal.uk/saxon-kings");
export const edgar = source("The Royal Family · Edgar", "https://www.royal.uk/edgar-r-959-975");
export const aethelredII = source(
  "The Royal Family · Æthelred II",
  "https://www.royal.uk/ethelred-ii-unready-r-978-1013-and-1014-1016",
);
export const cnut = source(
  "Viking Ship Museum · Cnut ở Anh, Đan Mạch và Na Uy",
  "https://www.vikingeskibsmuseet.dk/en/professions/education/viking-age-people/historical-characters/cnut-the-great-of-denmark-england-and-norway",
);
export const cnutRoyal = source(
  "The Royal Family · Các vương quốc của Cnut",
  "https://www.royal.uk/canute-great-r-1016-1035",
);
export const wales = source("Cadw · Wales thời trung cổ", "https://cadw.gov.wales/learn/sites-through-centuries/medieval-wales");
export const borders = source(
  "English Heritage · Biên giới Anh–Scotland",
  "https://www.english-heritage.org.uk/visit/places/housesteads-roman-fort-hadrians-wall/history/border-reivers-and-hadrians-wall/",
);
export const norms = source("The Royal Family · Các vua Norman", "https://www.royal.uk/normans");
export const anarchy = source("The Royal Family · Stephen và Matilda", "https://www.royal.uk/stephen-and-matilda");
export const angevin = source("The Royal Family · Henry II và các lãnh địa", "https://www.royal.uk/henry-ii");
export const hundredYears = source(
  "The National Archives · Lãnh địa ở Pháp của các vua Anh",
  "https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/",
);
export const bretigny = source("British Library · Văn kiện Hiệp ước Brétigny", "https://searcharchives.bl.uk/catalog/032-002059429");
export const lancaster = source("The Royal Family · Henry VI và các lãnh địa Pháp", "https://www.royal.uk/henry-vi");
export const berwick = source(
  "English Heritage · Berwick và vùng biên Tweed",
  "https://www.english-heritage.org.uk/visit/places/berwick-upon-tweed-castle-and-ramparts/history/",
);
export const unions = source(
  "Thư viện Hạ viện Anh · Các đạo luật liên hiệp và phân chia Ireland",
  "https://commonslibrary.parliament.uk/research-briefings/cbp-10649/",
);
export const crowns = source(
  "UK Parliament · Liên minh vương miện 1603",
  "https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/act-of-union-1707/overview/union-of-the-crowns/",
);
export const commonwealth = source(
  "UK Parliament · Nội chiến và thời Cộng hòa",
  "https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/act-of-union-1707/overview/revolution-and-civil-war/",
);
export const britishUnion = source(
  "UK Parliament · Liên hiệp năm 1707",
  "https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/act-of-union-1707/overview/",
);

const medievalPopulation = source(
  "Broadberry và cộng sự · Dân số Anh trung cổ, bảng 6",
  "https://warwick.ac.uk/fac/soc/economics/seminars/seminars/conferences/venice3/programme/english_medieval_population.pdf",
);
const stuartPopulation = source(
  "Broadberry và cộng sự · British Economic Growth, chương Dân số",
  "https://assets.cambridge.org/97811070/70783/excerpt/9781107070783_excerpt.pdf",
);
const censusArea = source(
  "GB Historical GIS · Diện tích England theo các kỳ kiểm kê",
  "https://www.visionofbritain.org.uk/unit/10061325/cube/AREA_ACRES",
);
const censusPopulation = source(
  "GB Historical GIS · Tổng dân số England theo các kỳ kiểm kê",
  "https://www.visionofbritain.org.uk/unit/10061325/cube/TOT_POP",
);
const englishFlag = source(
  "English Heritage · Lịch sử cờ Thánh George",
  "https://www.english-heritage.org.uk/visit/whats-on/st-georges-day/9-things-you-didnt-know-about-st-george",
);
const unionFlag = source("The Flag Institute · Lịch sử Union Flag", "https://www.flaginstitute.org/wp/uk-flags/union-flag-history/");
const stGeorge: EnglandFlagModel = { design: "st-george", label: "Cờ Thánh George của Anh", source: englishFlag };
const banner: EnglandFlagModel = { ...stGeorge, label: "Hiệu kỳ Thánh George của quân Anh" };
const firstUnion: EnglandFlagModel = { design: "union-1606", label: "Union Flag của Đại Anh từ 1707", source: unionFlag };
const laterUnion: EnglandFlagModel = { design: "union-1801", label: "Union Flag, mẫu từ năm 1801", source: unionFlag };

const measure = (value: string, scope: string, note: string, reference: OverviewSourceModel): MeasureModel => ({
  value, scope, note, source: reference,
});
const englishEstimate = (value: string, year: number, note = "Ước tính hồi dựng từ tư liệu điền trang và thuế.") =>
  measure(`≈ ${value} triệu người`, `England · ${year}`, note, medievalPopulation);
const census = (year: number, acres: number, people: string) => ({
  area: measure(
    `≈ ${new Intl.NumberFormat("vi-VN").format(Math.round(acres * 0.0040468564224))} km²`,
    `England · ${year}`, "Quy đổi diện tích ghi bằng acre trong kỳ kiểm kê.", censusArea,
  ),
  population: measure(people, `England · ${year}`, "Dân số ghi trong điều tra dân số, phạm vi England.", censusPopulation),
});

export const englandGeography: Record<string, EnglandGeographyModel> = {
  "roman-britain": {
    realm: "Britannia · Đế quốc La Mã",
    extent: "Khoảng năm 170, La Mã kiểm soát phần lớn đất phía nam tuyến Solway–Tyne, gồm phần lớn England và Wales ngày nay. Tường Hadrian là một tuyến quân sự. Trong thế kỷ II, La Mã từng tiến lên tuyến Forth–Clyde ở Tường Antoninus rồi rút về phía nam.",
    neighbours: "Các cộng đồng Briton ở phía bắc tường và các cộng đồng trên đảo Ireland nằm ngoài quyền cai trị thường xuyên của La Mã. Bờ bên kia eo Manche là các tỉnh Gallia của cùng đế quốc.",
    sources: [romanBritain],
    population: measure("≈ 3–4 triệu người", "Britannia thời La Mã", "Khoảng ước tính của English Heritage cho Britannia, không gắn với một năm kiểm kê cụ thể.", romanBritain),
  },
  "anglo-saxon": {
    realm: "Các vương quốc Anglo-Saxon",
    extent: "Các vương quốc thay đổi nhiều trong giai đoạn này. Cuối thế kỷ VIII, Mercia chi phối phần lớn miền trung, Wessex ở nam, Northumbria ở bắc Humber và East Anglia ở phía đông. Kent, Essex và Sussex có những giai đoạn chịu quyền bá chủ của Mercia.",
    neighbours: "Phía tây có các vương quốc Briton ở Wales và Cornwall. Quanh Clyde là Alt Clut. Pictland ở phía bắc Forth. Northumbria vươn tới Lothian, vượt qua biên giới Anh–Scotland hiện nay.",
    sources: [vikingBritain, englishOrigins, wales],
  },
  "ecgberht-wessex": {
    realm: "Wessex và các vùng phụ thuộc phía đông nam",
    extent: "Wessex có lõi ở nam và tây nam. Sau trận Ellendun năm 825, Æthelwulf đưa Kent, Sussex, Surrey và Essex về dưới quyền cha. Ecgberht trực tiếp nắm Mercia năm 829–830. Sự quy thuận của Northumbria tại Dore là thừa nhận ưu thế trong thời gian ngắn.",
    neighbours: "Phía bắc là Mercia rồi Northumbria. East Anglia tìm sự bảo hộ trước Mercia. Phía tây là Cornwall và các chính thể Wales, trong đó Gwynedd ở tây bắc và Powys ở miền giữa. Pictland và Alt Clut ở phía bắc đảo.",
    sources: [saxonChronicle, englishOrigins, wales],
  },
  "aethelwulf-wessex": {
    realm: "Wessex và các vùng đông nam",
    extent: "Wessex giữ vùng đông nam từ sau Ellendun. Khi Æthelwulf mất năm 858, Æthelbald giữ miền tây, còn Æthelberht cai trị Kent và các đất phía đông nam. Năm 860 Æthelberht nắm cả hai phần. Khi Æthelred I lên ngôi, Đại quân Viking bắt đầu làm thay đổi địa bàn phía bắc và đông.",
    neighbours: "Mercia vẫn có vua riêng và phối hợp với Æthelwulf trong chiến dịch Wales năm 853. Northumbria và East Anglia còn độc lập ở mốc 860, trước khi quân Viking chiếm York năm 866 và hạ East Anglia khoảng 869–870.",
    sources: [alfredLife, saxonChronicle, vikingBritain],
  },
  "great-viking-army": {
    realm: "Wessex, Mercia và các vùng Đại quân Viking chiếm",
    extent: "York là căn cứ của quân Viking sau năm 866. Khoảng năm 870, Đông Anglia cũng thất thủ. Mercia còn dưới quyền Burgred, còn Æthelred I giữ Wessex và các vùng phụ thuộc đông nam. Reading là cứ điểm của chiến dịch vào Wessex.",
    neighbours: "Bamburgh ở Bắc Northumbria tiếp tục là thành lũy Anglo-Saxon. Pictland và vương quốc Briton quanh sông Clyde nằm xa hơn về phía bắc. Gwynedd và Powys ở phía tây Mercia.",
    sources: [saxonChronicle, alfredLife, vikingBritain, englishOrigins],
  },
  "alfred-edington": {
    realm: "Wessex của Alfred và các vùng Đại quân Viking kiểm soát",
    extent: "Sau năm 877, Ceolwulf II còn cai trị phần Mercia phía tây, trong khi lực lượng Scandinavia nắm nhiều đất ở phía đông. Cuộc đột kích Chippenham đầu năm 878 mở đường cho Guthrum tiến sâu vào Wessex. Alfred tổ chức phản công từ Somerset.",
    neighbours: "York do các thế lực Scandinavia kiểm soát. Các lãnh chúa quanh Bamburgh, những người cai trị Wales và vương quốc Briton quanh Clyde tiếp tục có địa bàn riêng.",
    sources: [alfredLife, saxonChronicle, vikingBritain],
  },
  "alfred-wessex": {
    realm: "Wessex và Tây Mercia dưới quyền bá chủ Alfred",
    extent: "Wessex giữ miền nam. Æthelred cai quản Tây Mercia dưới quyền bá chủ của Alfred. Sau trận Edington năm 878, một hiệp ước về sau xác định biên Alfred–Guthrum qua Thames, Lea, Bedford và Great Ouse đến Watling Street.",
    neighbours: "Guthrum giữ East Anglia. Các nhóm Viking khác kiểm soát đông Mercia và York, còn Bamburgh là trung tâm của Bắc Northumbria. Ở Wales và phía bắc đảo, Gwynedd, Powys, Dyfed, Strathclyde và Alba vẫn có nhà cai trị riêng.",
    sources: [alfredLife, vikingBritain, englishOrigins],
  },
  "edward-succession": {
    realm: "Wessex dưới thời Edward · Tây Mercia dưới quyền Æthelred",
    extent: "Edward giữ Wessex sau khi Alfred mất năm 899. Tây Mercia do Æthelred và Æthelflæd cai quản, phối hợp với Edward. Sau khi Æthelwold tử trận năm 902, thế lực Edward củng cố ở miền nam.",
    neighbours: "York và nhiều đô thị ở đông Mercia vẫn thuộc các nhà cai trị Scandinavia. East Anglia cũng còn dưới quyền người Scandinavia. Tettenhall năm 910 là trận thắng trước lực lượng từ Northumbria.",
    sources: [saxonChronicle, englishOrigins, mercia],
  },
  "aethelflaed-mercia": {
    realm: "Mercia dưới quyền Æthelflæd · Wessex dưới quyền Edward",
    extent: "Æthelflæd giữ miền tây Mercia và củng cố các tuyến thành quanh Tamworth, Stafford và biên Wales. Từ các căn cứ này, bà đánh chiếm Derby rồi thu phục Leicester. Edward mở đường qua Great Ouse để chiếm các cứ điểm ở miền đông.",
    neighbours: "Các đô thị vùng Danelaw còn nhiều nhà cai trị riêng khi chiến dịch bắt đầu. East Anglia mất quyền tự trị sau chiến dịch năm 917, còn York tiếp tục có vua Scandinavia đến năm 927. Gwynedd và Powys nằm phía tây Mercia.",
    sources: [mercia, saxonChronicle, englishOrigins],
  },
  "edward-aethelflaed": {
    realm: "Wessex và Mercia · hợp nhất dưới Edward từ năm 918",
    extent: "Wessex và Tây Mercia phối hợp chiếm lại các cứ điểm Viking ở Midlands. Edward kiểm soát East Anglia sau chiến dịch năm 917 và tiếp quản Mercia năm 918. Khoảng năm 920, phần lớn đất phía nam Humber đã về một quyền cai trị.",
    neighbours: "York còn do vua Scandinavia nắm. Bắc Northumbria quanh Bamburgh, Alba và Strathclyde tiếp tục giữ chính quyền riêng. Gwynedd và các chính thể Wales nằm về phía tây của vùng Mercia.",
    sources: [mercia, englishOrigins, saxonChronicle],
  },
  "kingdom-of-england": {
    realm: "Vương quốc Anh",
    extent: "Æthelstan chiếm York năm 927, thống nhất phần lớn các địa bàn Anglo-Saxon. Vùng biên Cumbria và Lothian biến động theo những quỹ đạo riêng. Các nhà cai trị địa phương vẫn có vai trò ở phía bắc.",
    neighbours: "Alba, Strathclyde và các chính thể Wales có người cai trị riêng. Cuộc gặp tại Eamont năm 927 thể hiện uy thế của Æthelstan. Đường biên Anh–Scotland về sau được định hình chủ yếu qua Hiệp ước York năm 1237.",
    sources: [englishOrigins, saxonChronicle, borders],
  },
  brunanburh: {
    realm: "Vương quốc Anh dưới thời Æthelstan",
    extent: "Khi giao chiến năm 937, Æthelstan đã nắm York khoảng một thập kỷ. Chiến thắng giữ được quyền cai trị của ông trong phần đời còn lại. Vị trí chính xác của trận Brunanburh còn tranh luận, với Bromborough là một giả thuyết.",
    neighbours: "Liên minh chống Æthelstan do Anlaf xứ Dublin, Constantine II của Alba và Owain xứ Strathclyde đứng đầu. Các chính thể Wales ở phía tây và có nhà cai trị riêng.",
    sources: [brunanburhResearch, englishOrigins, saxonChronicle],
  },
  "york-after-athelstan": {
    realm: "Vương quốc Anh và ngôi vua York đang tranh chấp",
    extent: "Các vua Anh và Scandinavia tranh nhau York từ sau năm 939. Edmund tái lập quyền ở đông Mercia năm 942. Khi người Northumbria loại Eric Bloodaxe năm 954, York về dưới quyền Eadred lâu dài.",
    neighbours: "Vua Scandinavia ở Dublin nhiều lần can dự vào York. Alba và Strathclyde có chính quyền riêng ở phía bắc. Wales vẫn gồm nhiều chính thể, dù Hywel Dda có lúc kiểm soát nhiều vùng.",
    sources: [saxonChronicle, englishOrigins, saxonKings, wales],
  },
  "edgar-england": {
    realm: "Vương quốc Anh dưới thời Eadred, Eadwig, Edgar và Edward",
    extent: "York đã thuộc các vua Anh từ năm 954. Sau khi Edgar kế vị Eadwig năm 959, một triều đình nắm cả Wessex, Mercia và York. Bộ luật và tiền xu giúp củng cố quyền cai trị trên phạm vi này.",
    neighbours: "Alba và Strathclyde ở phía bắc. Các vương công Wales ở phía tây. Việc những nhà cai trị này thừa nhận uy thế của Edgar có ý nghĩa ngoại giao, trong khi họ vẫn cai quản lãnh thổ của mình.",
    sources: [edgar, saxonChronicle, englishOrigins],
  },
  "aethelred-sweyn": {
    realm: "Vương quốc Anh · ngôi vua đổi chủ năm 1013–1014",
    extent: "Æthelred cai trị một vương quốc trải tới Northumbria. Các cuộc tấn công ở Essex và vùng duyên hải dần chuyển thành cuộc tranh ngôi. Sweyn được thừa nhận làm vua năm 1013. Æthelred trở lại sau khi Sweyn mất năm 1014.",
    neighbours: "Alba và các chính thể Wales ở cạnh Anh. Normandy ở bên kia eo Manche từng tiếp nhận Æthelred khi ông lưu vong. Sweyn đem lực lượng từ Đan Mạch qua Biển Bắc.",
    sources: [aethelredII, saxonChronicle, englishOrigins],
  },
  "cnut-north-sea": {
    realm: "Anh, Đan Mạch và Na Uy dưới cùng vua Cnut",
    extent: "Ở mốc 1029, Cnut giữ ba ngai vàng. Ông giành Anh năm 1016, kế vị Đan Mạch khoảng 1018–1019 và nắm Na Uy từ năm 1028. Ba vương quốc dùng các bộ máy cai trị riêng. Quyền tại Na Uy sụp đổ năm 1035 và liên kết Anh–Đan Mạch chấm dứt khi Harthacnut mất năm 1042.",
    neighbours: "Alba và các vương quốc Wales ở cạnh Anh. Công quốc Normandy nằm bên kia eo Manche. Vương quốc Thụy Điển nằm về phía đông của Na Uy và đất Đan Mạch quanh eo Øresund. Đế quốc La Mã Thần thánh ở phía nam Jutland. Ngoài các vùng Đan Mạch lịch sử, tuyên bố của Cnut đối với một phần người Thụy Điển có phạm vi còn tranh luận.",
    sources: [cnut, cnutRoyal, englishOrigins],
  },
  "late-anglo-saxon": {
    realm: "Vương quốc Anh",
    extent: "Vương quốc Anh trải từ Cornwall tới vùng biên phía bắc, với các bá tước lớn ở Wessex, Mercia và Northumbria. Phạm vi ở Cumbria còn biến động. Năm 1066, cuộc tranh ngôi kết thúc bằng chiến thắng của William xứ Normandy.",
    neighbours: "Scotland ở phía bắc, các chính thể Wales ở phía tây. Gruffudd ap Llywelyn thống nhất phần lớn Wales một thời gian ngắn đến năm 1063. Normandy bên kia eo Manche và Na Uy bên kia Biển Bắc là hai nơi xuất phát các cuộc xâm lược năm 1066.",
    sources: [englishOrigins, wales, norms],
  },
  "norman-conquest": {
    realm: "Vương quốc Anh và Công quốc Normandy",
    extent: "Vua William nắm Anh và Công quốc Normandy. Sau khi ông mất năm 1087 hai ngai tách ra, rồi Henry I giành lại Normandy năm 1106. Biên giới Wales có các lãnh chúa Marches, còn Carlisle được William II kiểm soát từ năm 1092.",
    neighbours: "Scotland vẫn là vương quốc riêng. Gwynedd, Powys và Deheubarth tiếp tục tồn tại cạnh những vùng do người Norman chiếm ở Wales. Normandy là một công quốc dưới quyền bá chủ của vua Pháp.",
    sources: [norms, wales, borders],
    population: englishEstimate("1,71", 1086, "Ước tính từ Domesday Book và hiệu chỉnh địa bàn bỏ sót. Domesday kiểm kê đất và hộ."),
  },
  "the-anarchy": {
    realm: "Vương quốc Anh · ngôi vua tranh chấp",
    extent: "Các phe Stephen và Matilda tranh ngôi trong cùng Vương quốc Anh. Stephen mạnh ở đông và đông nam, còn phe Matilda có chỗ đứng ở miền tây. Geoffrey xứ Anjou chiếm Normandy năm 1144. David I của Scotland nắm Carlisle và các vùng phía bắc của Anh trong nội chiến.",
    neighbours: "Scotland tiếp giáp vùng đang tranh chấp ở phía bắc. Các vương công Wales khôi phục nhiều đất ở phía tây khi quyền của Stephen suy yếu. Normandy và Anjou ở bên kia Manche.",
    sources: [anarchy, angevin, wales],
    population: englishEstimate("1,71", 1086, "Mốc tham chiếu trước nội chiến. Chưa có tổng dân số riêng được kiểm chứng cho 1135–1154."),
  },
  "angevin": {
    realm: "Vương quốc Anh và các lãnh địa Angevin",
    extent: "Henry II nắm Anh, Normandy, Anjou, Maine, Touraine và Aquitaine thông qua quyền thừa kế và hôn nhân. Brittany nằm trong quỹ đạo triều đình qua con trai Geoffrey. Vua John mất Normandy và phần lớn đất ở miền bắc sông Loire năm 1204, giữ được một phần Aquitaine.",
    neighbours: "Scotland và các vương công Wales ở sát England. Henry II bắt đầu thiết lập quyền ở một phần Ireland từ năm 1171. Vua Pháp cai trị lãnh địa hoàng gia quanh Paris và là lãnh chúa tối cao theo danh nghĩa đối với các thái ấp của Henry tại Pháp.",
    sources: [angevin, unions, wales],
    population: englishEstimate("3,10", 1190, "Chỉ tính England. Các lãnh địa trên lục địa và Ireland nằm ngoài phạm vi của ước tính."),
  },
  "plantagenet": {
    realm: "Vương quốc Anh và các lãnh địa vương thất",
    extent: "Hiệp ước York năm 1237 định hình phần lớn biên Anh–Scotland. Edward I chinh phục Gwynedd năm 1282–1283. Quy chế Rhuddlan năm 1284 đưa các đất chinh phục trực tiếp vào quyền của vương thất, còn các lãnh địa Marches tồn tại. Ở lục địa, Anh có Calais và quyền với một vùng Aquitaine mở rộng theo Hiệp ước Brétigny năm 1360.",
    neighbours: "Scotland giữ vương quyền riêng sau các cuộc chiến giành độc lập. Pháp là láng giềng qua eo Manche và trên biên Aquitaine. Quyền của vua Anh tại Ireland tập trung ở một số vùng do người Anh–Norman định cư.",
    sources: [borders, wales, hundredYears, bretigny, unions],
    population: englishEstimate("2,50", 1377, "Ước tính từ thuế thân sau Cái Chết Đen. Cùng chuỗi số liệu ước tính 4,81 triệu người năm 1348."),
    flag: banner,
  },
  "lancaster": {
    realm: "Vương quốc Anh · nhà Lancaster",
    extent: "Năm 1422, Henry VI kế thừa vương miện Anh và được phe Anh công nhận là vua Pháp theo Hiệp ước Troyes. Quyền thực tế tập trung ở Normandy, một phần bắc Pháp và Gascony. Pháp lấy lại Normandy năm 1450 và Gascony năm 1453. Anh giữ Calais.",
    neighbours: "Scotland ở phía bắc và có quan hệ đồng minh với Pháp. Bourgogne liên minh với Anh trong một phần thời kỳ, rồi hòa giải với Charles VII năm 1435. Wales và các Marches có chế độ cai trị riêng trong phạm vi quyền lực vương thất Anh.",
    sources: [lancaster, hundredYears, borders, wales],
    population: englishEstimate("1,90", 1450), flag: banner,
  },
  "wars-of-the-roses": {
    realm: "Vương quốc Anh · Lancaster và York tranh ngôi",
    extent: "Lancaster và York tranh cùng một ngai vàng. Ranh đối ngoại của vương quốc thay đổi ít hơn quyền kiểm soát giữa hai phe. Calais là tiền đồn chính còn lại ở Pháp. Berwick qua tay Anh và Scotland trước khi trở về Anh năm 1482.",
    neighbours: "Scotland ở phía bắc, Pháp và Bourgogne ở bên kia eo Manche. Các lãnh chúa biên giới Wales và các cộng đồng vùng biên Scotland có vai trò trong những chiến dịch của hai phe.",
    sources: [lancaster, berwick, wales],
    population: englishEstimate("1,90", 1450, "Mốc tham chiếu trước năm 1455. Tư liệu điền trang sau 1450 thưa hơn."), flag: banner,
  },
  tudor: {
    realm: "Vương quốc Anh · gồm Wales theo các luật thời Tudor",
    extent: "Các luật thế kỷ XVI hợp nhất Wales và các lãnh địa Marches vào hệ thống pháp luật và hạt của Anh. Henry VIII nhận tước vua Ireland năm 1541–1542, nhưng quyền cai trị thực tế trên đảo vẫn không đồng đều. Pháp lấy Calais năm 1558.",
    neighbours: "Scotland tiếp tục độc lập ở phía bắc. Pháp nằm bên kia eo Manche và có liên minh với Scotland. Trên đảo Ireland, quyền của vương thất Anh và các lãnh chúa bản địa cùng tồn tại, mức kiểm soát thay đổi theo địa phương.",
    sources: [unions, wales, hundredYears],
    population: englishEstimate("2,83", 1541, "Hồi dựng từ sổ giáo xứ cho England."), flag: stGeorge,
  },
  elizabethan: {
    realm: "Vương quốc Anh và Vương quốc Ireland dưới cùng nữ vương",
    extent: "England và Wales dùng chung hệ thống pháp luật. Calais đã mất vào tay Pháp. Các chiến dịch cuối triều mở rộng quyền kiểm soát của vương thất tại Ireland, đặc biệt sau Chiến tranh Chín Năm kết thúc năm 1603.",
    neighbours: "Scotland là vương quốc độc lập đến hết đời Elizabeth. Pháp và các vùng ở bờ nam Biển Bắc ở bên kia biển. Tây Ban Nha là đối thủ hải quân, nổi bật trong chiến dịch Armada năm 1588.",
    sources: [unions, crowns],
    population: measure("≈ 4,1 triệu người", "England · 1600", "Ước tính hồi dựng cho England.", source("Clark · The macroeconomic aggregates for England, bảng 4", "https://www.econstor.eu/bitstream/10419/58383/1/612520374.pdf")),
    flag: stGeorge,
  },
  stuart: {
    realm: "Ba vương quốc Anh, Scotland và Ireland dưới cùng vương miện",
    extent: "James VI của Scotland kế vị ngôi Anh năm 1603. England và Wales, Scotland, và Ireland dùng chung quốc vương với thể chế riêng. Nội chiến từ thập niên 1640 làm quyền kiểm soát địa phương thay đổi nhanh.",
    neighbours: "Ranh giới Solway–Tweed tiếp tục phân định hai vương quốc trên đảo. Pháp và Cộng hòa Hà Lan ở bên kia eo Manche và Biển Bắc. Sự hiện diện của vương thất ở Ireland vấp phải các cuộc nổi dậy và liên minh Công giáo.",
    sources: [crowns, commonwealth, unions],
    population: measure("≈ 5,4 triệu người", "England · thập niên 1650", "Ước tính ngay sau giai đoạn nội chiến trong cảnh, dành cho England.", stuartPopulation),
    flag: { ...firstUnion, label: "Union Flag 1606 · hiệu kỳ hàng hải thời James I" },
  },
  commonwealth: {
    realm: "Cộng hòa rồi Thời Bảo hộ Anh, Scotland và Ireland",
    extent: "Sau khi quân của Nghị viện chiếm ưu thế ở Scotland và Ireland, thời Bảo hộ đưa England, Wales, Scotland và Ireland vào cùng một chính quyền. Mốc 1654 thể hiện phạm vi sau các chiến dịch, với đại diện của Scotland và Ireland tại Westminster.",
    neighbours: "Pháp ở bên kia eo Manche và Cộng hòa Hà Lan ở bên kia Biển Bắc. Biên trên đảo còn là ranh quản lý giữa England và Scotland. Các thế lực quân chủ lưu vong tiếp tục hoạt động từ lục địa.",
    sources: [commonwealth, unions],
    population: measure("≈ 5,4 triệu người", "England · thập niên 1650", "Ước tính cho England, phần dân cư Scotland, Wales và Ireland nằm ngoài phạm vi con số.", stuartPopulation),
    flag: {
      design: "commonwealth-jack",
      label: "Hiệu kỳ hải quân Commonwealth · chữ thập và đàn hạc",
      source: source("Royal Museums Greenwich · Hiệu kỳ thời Commonwealth", "https://www.rmg.co.uk/collections/objects/rmgc-object-800"),
    },
  },
  restoration: {
    realm: "Vương quốc Anh, hợp nhất thành Đại Anh năm 1707",
    extent: "Charles II khôi phục quân chủ năm 1660 và Scotland có lại nghị viện riêng. Năm 1707, England và Scotland hợp nhất thành Vương quốc Đại Anh, bao gồm Wales. Ireland tiếp tục là một vương quốc riêng dưới cùng vương miện.",
    neighbours: "Ireland ở phía tây qua biển Ireland. Pháp và Cộng hòa Hà Lan là các láng giềng qua eo Manche và Biển Bắc. Sau 1707, ranh Anh–Scotland nằm trong Đại Anh.",
    sources: [britishUnion, unions],
    population: measure("≈ 5,2 triệu người", "England · 1700", "Ước tính hồi dựng ngay trước Liên hiệp 1707.", source("Cambridge University Press · Ước tính dân số đến năm 1700", "https://www.cambridge.org/core/books/great-divergence-reconsidered/contribution-good-as-the-foundation-of-the-industrial-revolution/5BA1C9D1A6FC59650290EF0A6775E1FC")),
    flag: firstUnion,
  },
  georgian: {
    realm: "Đại Anh · từ 1801 là Vương quốc Liên hiệp Đại Anh và Ireland",
    extent: "Từ 1714, Đại Anh bao gồm England, Wales và Scotland. Năm 1801, liên hiệp với Ireland tạo Vương quốc Liên hiệp Đại Anh và Ireland. Thuộc địa và lãnh thổ hải ngoại có quy chế riêng, thay đổi qua các cuộc chiến và chuyển nhượng.",
    neighbours: "Pháp và Hà Lan nằm bên kia eo Manche và Biển Bắc. Sau 1801, toàn đảo Ireland thuộc Vương quốc Liên hiệp. Bờ biển bao quanh khối lãnh thổ chính tại châu Âu.",
    sources: [unions, britishUnion], ...census(1831, 32_404_808, "≈ 13,1 triệu người"), flag: laterUnion,
  },
  victorian: {
    realm: "Vương quốc Liên hiệp Đại Anh và Ireland",
    extent: "Vương quốc Liên hiệp gồm Đại Anh và toàn đảo Ireland. Đế quốc mở rộng ra nhiều châu lục với các thuộc địa, lãnh thổ bảo hộ và xứ tự trị. Bản đồ khu vực tập trung vào các đảo châu Âu.",
    neighbours: "Pháp nằm bên kia eo Manche, Bỉ và Hà Lan bên kia Biển Bắc. Ranh England–Wales và England–Scotland là ranh giới nội bộ. Toàn đảo Ireland vẫn thuộc Vương quốc Liên hiệp trong kỳ này.",
    sources: [unions], ...census(1881, 32_148_915, "≈ 24,6 triệu người"), flag: laterUnion,
  },
  "world-wars": {
    realm: "Vương quốc Liên hiệp · Bắc Ireland ở lại sau phân chia",
    extent: "Đầu giai đoạn, Vương quốc Liên hiệp gồm cả Ireland. Sau khi Nhà nước Tự do Ireland thành lập năm 1922, sáu hạt Bắc Ireland ở lại Vương quốc Liên hiệp. Thỏa thuận năm 1925 giữ đường biên được lập sau phân chia.",
    neighbours: "Từ 1922, Bắc Ireland tiếp giáp Nhà nước Tự do Ireland trên bộ. Pháp, Bỉ và Hà Lan nằm bên kia eo Manche và Biển Bắc. Những thay đổi ở đế quốc hải ngoại có phạm vi ngoài khung bản đồ.",
    sources: [unions], ...census(1931, 32_208_768, "≈ 37,4 triệu người"), flag: laterUnion,
  },
  "modern-britain": {
    realm: "Vương quốc Liên hiệp Đại Anh và Bắc Ireland",
    extent: "England là một trong bốn xứ của Vương quốc Liên hiệp, cùng Scotland, Wales và Bắc Ireland. Các vùng tô trên bản đồ thể hiện phạm vi tại châu Âu. Lãnh thổ hải ngoại và các lãnh địa phụ thuộc Vương quyền có quy chế riêng.",
    neighbours: "England giáp Wales về phía tây và Scotland về phía bắc. Biên giới trên bộ của Vương quốc Liên hiệp với một quốc gia khác nằm giữa Bắc Ireland và Cộng hòa Ireland. Pháp nằm bên kia eo Manche.",
    sources: [unions, naturalEarth],
    area: measure("≈ 130.000 km²", "England · hiện đại", "Diện tích địa lý của England. Vương quốc Liên hiệp có diện tích khoảng 244.000 km².", source("GOV.UK · Diện tích các xứ của Vương quốc Liên hiệp", "https://www.gov.uk/government/publications/toponymic-guidelines-for-map-and-other-editors-united-kingdom-of-great-britain-and-northern-ireland--2")),
    population: measure("58.834.800 người", "England · giữa năm 2025", "Ước tính giữa năm của ONS. Tổng dân số Vương quốc Liên hiệp ở cùng mốc khoảng 69,48 triệu người.", source("ONS · Ước tính dân số giữa năm 2025", "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/bulletins/annualmidyearpopulationestimates/latest")),
    flag: laterUnion,
  },
};

export const englandMeasuresFor = (id: string) => {
  const geography = englandGeography[id];
  return [
    { label: "Diện tích", measure: geography?.area, missing: "Chưa có số km² kiểm chứng được cho phạm vi lịch sử trong cảnh. Vùng tô chỉ biểu thị địa bàn gần đúng." },
    { label: "Dân số", measure: geography?.population, missing: "Chưa có ước tính đáng tin cậy cho đúng niên đại và địa bàn trong cảnh." },
  ];
};
