import { threeKingdomsHref } from "~/data/battle-links";
import { chinaEraYears, chinaOverview } from "~/data/china-overview";
import { europeOverviews } from "~/data/europe-overview";
import { vietnamOverview } from "~/data/vietnam-overview";
import type { OverviewSceneModel } from "~/data/vietnam-overview";
import { countryPresentation } from "~/data/world";
import type { HistoryCardModel } from "~/types/history-card";

export type PeriodEntryModel = HistoryCardModel & { scenes: OverviewSceneModel[] };
const countries = [
  { id: "vietnam", name: "Việt Nam", scenes: vietnamOverview, years: { "Nhà Trần": "1225–1400", "Nhà Lý": "1009–1225", "Nhà Nguyễn": "1802–1945", "Tây Sơn": "1771–1802" } as Record<string, string> },
  { id: "china", name: "Trung Quốc", scenes: chinaOverview, years: chinaEraYears },
  ...Object.values(europeOverviews).map((country) => ({ id: country.id, name: country.name, scenes: country.scenes, years: country.eraYears })),
];
const specialIds: Record<string, string> = {
  "vietnam/Loạn 12 sứ quân": "loan-12-su-quan",
  "vietnam/Nhà Trần": "nha-tran",
  "vietnam/Kháng chiến chống Pháp": "khang-chien-chong-phap",
  "china/Tam Quốc": "three-kingdoms",
};

export const periodEntries: PeriodEntryModel[] = countries.flatMap((country) =>
  [...new Set(country.scenes.map((scene) => scene.era))].map((era) => {
    const scenes = country.scenes.filter((scene) => scene.era === era);
    const first = scenes[0];
    const id = specialIds[`${country.id}/${era}`] ?? `${country.id}-${first.id}`;
    return {
      id,
      title: era === "Tam Quốc" ? "Thời kỳ Tam Quốc" : era,
      years: country.years[era] ?? (scenes.length > 1 ? `${first.years} · ${scenes.at(-1)!.years}` : first.years),
      country: country.name,
      countryId: country.id,
      href: id === "three-kingdoms" ? threeKingdomsHref : `/period/${id}`,
      image: id === "three-kingdoms" ? "/images/three-kingdoms-battle.png"
        : id === "khang-chien-chong-phap" ? "/images/life/scenes/dienbien.jpg"
        : id === "loan-12-su-quan" ? "/images/overview/leaders/dinh-bo-linh.webp"
        : countryPresentation[country.id].image,
      description: first.summary,
      imageCaption: id === "khang-chien-chong-phap" ? "Ảnh tư liệu họp bàn chiến cuộc Đông Xuân cuối năm 1953 · Nguồn: hochiminh.vn" : undefined,
      scenes,
    };
  }),
);
export const periodForScene = (countryId: string, sceneId: string) =>
  periodEntries.find((period) => period.countryId === countryId && period.scenes.some((scene) => scene.id === sceneId));
const featuredIds = ["three-kingdoms", "loan-12-su-quan", "nha-tran"];
export const featuredPeriods = featuredIds.flatMap((id) => periodEntries.filter((period) => period.id === id));
