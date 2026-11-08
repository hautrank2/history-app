import { chinaPeriods } from "~/data/china-overview";
import { europeOverviews } from "~/data/europe-overview";
import type { CountryModel } from "~/types";

export const englandData: CountryModel = {
  slug: "england", name: "Anh",
  periods: europeOverviews.england.periods,
};

export const chinaData: CountryModel = {
  slug: "china", name: "Trung Quốc",
  periods: chinaPeriods,
};

export const denmarkData: CountryModel = {
  slug: "denmark", name: "Đan Mạch",
  periods: europeOverviews.denmark.periods,
};

export const norwayData: CountryModel = {
  slug: "norway", name: "Na Uy",
  periods: europeOverviews.norway.periods,
};

export const countryPresentation: Record<string, { english: string; numeral: string; image: string; subtitle: string; description: string }> = {
  vietnam: { english: "VIETNAM", numeral: "01", image: "/images/bach-dang-cinematic.png", subtitle: "Hào khí ngàn năm", description: "Từ những dòng sông huyền thoại đến ý chí giữ nước. Theo dấu những trang sử làm nên một dân tộc." },
  england: { english: "ENGLAND", numeral: "02", image: "/images/england-cinematic.png", subtitle: "Vương quyền & huyền thoại", description: "Qua những thành lũy phủ sương, các vương triều và những bước ngoặt định hình nước Anh." },
  china: { english: "CHINA", numeral: "03", image: "/images/china-cinematic.png", subtitle: "Dấu ấn các vương triều", description: "Hành trình qua những triều đại, các đô thành cổ và một nền văn minh trải dài hàng thiên niên kỷ." },
  denmark: { english: "DENMARK", numeral: "04", image: "/images/denmark-cinematic.svg", subtitle: "Đá rune & đế chế Biển Bắc", description: "Từ Danevirke và đá Jelling đến Liên minh Kalmar và một vương quốc hiện đại." },
  norway: { english: "NORWAY", numeral: "05", image: "/images/norway-cinematic.svg", subtitle: "Vịnh hẹp & tàu dài Viking", description: "Theo những con tàu Viking, các vua Olaf và hành trình từ liên minh đến độc lập." },
};
