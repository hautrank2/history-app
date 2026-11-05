import { chinaPeriods } from "~/data/china-overview";
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
  periods: chinaPeriods,
};

export const countryPresentation: Record<string, { english: string; numeral: string; image: string; subtitle: string; description: string }> = {
  vietnam: { english: "VIETNAM", numeral: "01", image: "/images/bach-dang-cinematic.png", subtitle: "Hào khí ngàn năm", description: "Từ những dòng sông huyền thoại đến ý chí giữ nước. Theo dấu những trang sử làm nên một dân tộc." },
  england: { english: "ENGLAND", numeral: "02", image: "/images/england-cinematic.png", subtitle: "Vương quyền & huyền thoại", description: "Qua những thành lũy phủ sương, các vương triều và những bước ngoặt định hình nước Anh." },
  china: { english: "CHINA", numeral: "03", image: "/images/china-cinematic.png", subtitle: "Dấu ấn các vương triều", description: "Hành trình qua những triều đại, các đô thành cổ và một nền văn minh trải dài hàng thiên niên kỷ." },
};
