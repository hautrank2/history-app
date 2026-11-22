import { battleHref } from "~/data/battle-links";
import { threeKingdomsScenes } from "~/data/three-kingdoms";
import { vietnamBattles, vietnamBattlePeriod } from "~/data/vietnam-battles";
import type { HistoryCardModel } from "~/types/history-card";

export type BattleEntryModel = HistoryCardModel & { periodId: string; sceneId: string };

const battleTitles: Record<string, string> = {
  "quan-do": "Trận Quan Độ",
  "xich-bich": "Trận Xích Bích",
  "hop-phi": "Trận Hợp Phì",
  "di-lang": "Trận Di Lăng",
  "nhai-dinh": "Trận Nhai Đình",
};

export const battleEntries: BattleEntryModel[] = [
  {
    id: "bach-dang-1288",
    title: "Trận Bạch Đằng",
    years: "1288",
    country: "Việt Nam",
    countryId: "vietnam",
    periodId: "nha-tran",
    sceneId: "tran-bach-dang",
    href: battleHref("bach-dang-1288"),
    image: "/images/bach-dang-cinematic.png",
    description: "Theo dấu thủy chiến trên sông Bạch Đằng cùng Trần Hưng Đạo.",
  },
  {
    id: "dien-bien-phu-1954",
    title: "Trận Điện Biên Phủ",
    years: "13/3–7/5/1954",
    country: "Việt Nam",
    countryId: "vietnam",
    periodId: "khang-chien-chong-phap",
    sceneId: "dien-bien-phu",
    href: battleHref("dien-bien-phu-1954"),
    image: "/images/life/scenes/dienbien.jpg",
    imageCaption: "Ảnh tư liệu họp bàn chiến cuộc Đông Xuân cuối năm 1953 · Nguồn: hochiminh.vn",
    description: "Từ công tác chuẩn bị đến ba đợt tiến công trong chiến dịch do Võ Nguyên Giáp chỉ huy.",
  },
  ...vietnamBattles.filter((battle) => battle.id !== "dien-bien-phu-1954").map((battle) => ({
    id: battle.id,
    title: `Trận ${battle.title}`,
    years: battle.years,
    country: "Việt Nam",
    countryId: "vietnam",
    periodId: vietnamBattlePeriod(battle)?.id ?? "",
    sceneId: battle.sceneId,
    href: battleHref(battle.id),
    image: ["bach-dang-938", "rach-gam-xoai-mut-1785"].includes(battle.id)
      ? "/images/bach-dang-cinematic.png"
      : "/images/three-kingdoms-land-battle.png",
    imageCaption: "Minh họa AI dùng chung cho chủ đề chiến trận, không phải tư liệu của trận đánh.",
    description: battle.summary,
  })),
  ...threeKingdomsScenes.filter((scene) => scene.id in battleTitles).map((scene) => ({
    id: scene.id,
    title: battleTitles[scene.id],
    years: scene.date,
    country: "Trung Quốc",
    countryId: "china",
    periodId: "three-kingdoms",
    sceneId: scene.id,
    href: battleHref(scene.id),
    image: scene.id === "di-lang" ? "/images/yiling-battle.png"
      : ["xich-bich", "nhu-tu", "dong-hung"].includes(scene.id)
        ? "/images/three-kingdoms-battle.png"
        : "/images/three-kingdoms-land-battle.png",
    description: scene.context,
  })),
];

const featuredIds = ["bach-dang-1288", "ngoc-hoi-dong-da-1789", "dien-bien-phu-1954"];
export const featuredBattles = featuredIds.flatMap((id) =>
  battleEntries.filter((battle) => battle.id === id),
);
