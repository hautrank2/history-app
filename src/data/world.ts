import type { CountryModel } from "~/types";

export const englandData: CountryModel = {
  slug: "england", name: "Anh",
  periods: [
    { slug: "anglo-saxon", years: "Thế kỷ V – 1066", title: "Thời Anglo-Saxon", blurb: "Các vương quốc hình thành trên đảo Anh và hành trình thống nhất." },
    { slug: "norman-plantagenet", years: "1066 – 1485", title: "Norman & Plantagenet", blurb: "Lâu đài, hiệp sĩ và những cuộc tranh giành vương quyền." },
    { slug: "tudor", years: "1485 – 1603", title: "Nhà Tudor", blurb: "Một vương triều định hình tôn giáo, hàng hải và văn hóa Anh." },
    { slug: "stuart", years: "1603 – 1714", title: "Thời Stuart", blurb: "Vương quyền, nghị viện và những bước ngoặt của thể chế." },
    { slug: "modern-britain", years: "Từ thế kỷ XVIII", title: "Nước Anh thời cận đại", blurb: "Công nghiệp, khám phá và một xã hội chuyển mình." },
  ],
};

export const chinaData: CountryModel = {
  slug: "china", name: "Trung Quốc",
  periods: [
    { slug: "qin-han", years: "221 TCN – 220", title: "Tần – Hán", blurb: "Thống nhất lãnh thổ và nền móng của nhà nước đế chế." },
    { slug: "three-kingdoms", years: "220 – 280", title: "Tam Quốc", blurb: "Ngụy, Thục, Ngô và một thời đại phân tranh." },
    { slug: "sui-tang", years: "581 – 907", title: "Tùy – Đường", blurb: "Tái thống nhất, đô thị phồn thịnh và giao lưu trên Con đường Tơ lụa." },
    { slug: "song-yuan", years: "960 – 1368", title: "Tống – Nguyên", blurb: "Những phát minh, thương mại và biến động của các vương triều." },
    { slug: "ming-qing", years: "1368 – 1912", title: "Minh – Thanh", blurb: "Cung điện, hải trình và những chương cuối của thời đế chế." },
  ],
};

export const countryPresentation: Record<string, { english: string; numeral: string; image: string; subtitle: string; description: string }> = {
  vietnam: { english: "VIETNAM", numeral: "01", image: "/images/bach-dang-cinematic.png", subtitle: "Hào khí ngàn năm", description: "Từ những dòng sông huyền thoại đến ý chí giữ nước. Theo dấu những trang sử làm nên một dân tộc." },
  england: { english: "ENGLAND", numeral: "02", image: "/images/england-cinematic.png", subtitle: "Vương quyền & huyền thoại", description: "Qua những thành lũy phủ sương, các vương triều và những bước ngoặt định hình nước Anh." },
  china: { english: "CHINA", numeral: "03", image: "/images/china-cinematic.png", subtitle: "Dấu ấn các vương triều", description: "Hành trình qua những triều đại, các đô thành cổ và một nền văn minh trải dài hàng thiên niên kỷ." },
};
