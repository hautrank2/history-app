import { threeKingdomsHref } from "~/data/battle-links";
import { threeKingdomsScenes } from "~/data/three-kingdoms";

export type BattleEntryModel = {
  id: string;
  title: string;
  years: string;
  country: string;
  href: string;
};

const featuredIds = ["bach-dang-1288", "quan-do", "xich-bich", "ha-bi", "di-lang"];

export const battleEntries: BattleEntryModel[] = [
  {
    id: "bach-dang-1288",
    title: "Trận Bạch Đằng",
    years: "1288",
    country: "Việt Nam",
    href: "/vietnam/bach-dang-1288",
  },
  ...threeKingdomsScenes.filter((scene) => scene.battle).map((scene) => ({
    id: scene.id,
    title: scene.title,
    years: scene.date,
    country: "Trung Quốc",
    href: `${threeKingdomsHref}#${scene.id}`,
  })),
];

export const featuredBattles = featuredIds.flatMap((id) =>
  battleEntries.filter((battle) => battle.id === id),
);
