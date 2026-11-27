import rows from "~/data/database/vietnam-battle.json";
import { getCharacter } from "~/data/characters";
import { dienBienPhuScenes, dienBienPhuSource } from "~/data/dien-bien-phu";
import { periodForScene } from "~/data/periods";
import type { StoryModel } from "~/types";
import type { BattleAction } from "~/components/battle-map-symbols";
import { expandVietnamBattle } from "~/data/vietnam-battle-expansion";

export type VietnamBattleChapter = {
  title: string; date: string; text: string; placeIds: string[];
  phase?: "context" | "aftermath";
  kind?: BattleAction;
  tacticalStage?: number;
  routes?: { places: string[]; side: "home" | "enemy"; kind: BattleAction; label: string }[];
};

export type VietnamBattleModel = {
  id: string;
  title: string;
  years: string;
  sceneId: string;
  leaderIds: string[];
  sides: { home: string; enemy: string };
  summary: string;
  places: { id: string; name: string; at: number[]; note: string }[];
  chapters: VietnamBattleChapter[];
  sources: { title: string; url: string }[];
};

const campaigns: VietnamBattleModel[] = [
  ...rows,
  {
    id: "dien-bien-phu-1954",
    title: "Điện Biên Phủ",
    years: "13/3–7/5/1954",
    sceneId: "dien-bien-phu",
    leaderIds: ["vo-nguyen-giap"],
    sides: { home: "Quân đội nhân dân Việt Nam", enemy: "Quân đội Pháp" },
    summary: "Theo dõi ba đợt tiến công và sự phát triển của thế trận bao vây Điện Biên Phủ.",
    places: [
      { id: "him-lam", name: "Him Lam", at: [103.04, 21.41], note: "Cụm cứ điểm mở đầu chiến dịch." },
      { id: "doc-lap", name: "Độc Lập", at: [103.01, 21.43], note: "Cứ điểm phía bắc bị đánh trong đợt 1." },
      { id: "a1", name: "Đồi A1", at: [103.02, 21.39], note: "Cao điểm phía đông, nơi giao tranh kéo dài." },
      { id: "muong-thanh", name: "Mường Thanh", at: [103.01, 21.39], note: "Trung tâm tập đoàn cứ điểm và sở chỉ huy Pháp." },
    ],
    chapters: dienBienPhuScenes.map((scene, index) => ({
      title: scene.title,
      date: scene.years,
      text: scene.summary,
      placeIds: [["muong-thanh"], ["him-lam", "doc-lap"], ["a1"], ["a1", "muong-thanh"]][index],
    })),
    sources: [dienBienPhuSource,
      { title: "Sở VH-TT-DL Điện Biên · Sở chỉ huy chiến dịch tại Mường Phăng", url: "https://svhttdl.dienbien.gov.vn/ditich/pages/2012/So-chi-huy-chien-dich-8547.aspx" },
      { title: "Bảo tàng Chiến thắng Điện Biên Phủ · Di tích Mường Thanh và Mường Phăng", url: "https://btctdbp.svhttdl.dienbien.gov.vn/portal/pages/2014/Du-lich-Dien-Bien-Phu-hanh-trinh-tro-ve-coi-nguonx6d3xebyqom6.aspx" },
      { title: "Ban Quản lý di tích Điện Biên · Hang Huổi He và quyết định ngày 26/1/1954", url: "https://bqldt.svhttdl.dienbien.gov.vn/portal/pages/2022-7-25/Di-tich-So-Chi-huy-Chien-dich-Dien-Bien-Phu-o-hangwnb6rcrb99ng.aspx" },
    ],
  },
];
export const vietnamBattles = campaigns.map(expandVietnamBattle);

export function bachDangBattle(story: StoryModel): VietnamBattleModel {
  return expandVietnamBattle({
    id: "bach-dang-1288", title: "Bạch Đằng", years: "1288", sceneId: "tran-bach-dang",
    leaderIds: ["tran-hung-dao"], sides: story.sides, summary: story.subtitle,
    places: [...new Map(story.chapters.flatMap((frame) => (frame.points ?? []).map((point) => [point.label, {
      id: point.label, name: point.label, at: point.at,
      note: `Địa điểm ${point.label}, định vị gần đúng trong chiến dịch năm 1288.`,
    }] as const))).values()],
    chapters: story.chapters.map((frame) => ({ title: frame.title, date: frame.date, text: frame.text, placeIds: (frame.points ?? []).map((point) => point.label) })),
    sources: [{ title: "Đại Việt sử ký toàn thư · Bản kỷ, quyển V", url: "https://vi.wikisource.org/wiki/Đại_Việt_sử_ký_toàn_thư" }],
  });
}

export const vietnamBattlePeriod = (battle: VietnamBattleModel) =>
  periodForScene("vietnam", battle.sceneId);

export const vietnamBattleStory = (battle: VietnamBattleModel): StoryModel => ({
  title: battle.title,
  subtitle: battle.summary,
  sides: battle.sides,
  note: "Địa điểm và vị trí đại diện lãnh đạo được định vị gần đúng. Mũi tên thể hiện hướng hành quân, tiến công hoặc rút quân khái quát, không phải lộ trình thực tế của từng đơn vị.",
  chapters: battle.chapters.map((chapter) => ({
    ...chapter,
    routes: chapter.routes?.map((route) => ({ side: route.side, path: route.places.flatMap((id) => battle.places.filter((place) => place.id === id).map((place) => [place.at[0], place.at[1]] as [number, number])) })),
    camera: { center: [106, 17], zoom: 6 },
    characters: [
      ...battle.leaderIds.map((id) => {
      const person = getCharacter(id);
      return {
        id,
        name: person.name,
        role: battle.id === "ngoc-hoi-dong-da-1789" && id === "nguyen-hue"
          ? "Quang Trung · chỉ huy chiến dịch"
          : person.role,
        side: "home" as const,
      };
      }),
      ...((battle.id === "dien-bien-phu-1954" ? ["christian-de-castries"] : battle.id === "ngoc-hoi-dong-da-1789" ? ["ton-si-nghi"] : battle.id === "chi-lang-xuong-giang-1427" ? ["vuong-thong"] : [])
        .map((id) => ({ ...getCharacter(id), side: "enemy" as const, role: "Đại diện bộ chỉ huy đối phương" }))),
    ],
  })),
});
