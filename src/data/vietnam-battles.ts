import rows from "~/data/database/vietnam-battle.json";
import { getCharacter } from "~/data/characters";
import { dienBienPhuScenes, dienBienPhuSource } from "~/data/dien-bien-phu";
import { periodForScene } from "~/data/periods";
import type { StoryModel } from "~/types";

export type VietnamBattleModel = {
  id: string;
  title: string;
  years: string;
  sceneId: string;
  leaderIds: string[];
  sides: { home: string; enemy: string };
  summary: string;
  places: { id: string; name: string; at: number[]; note: string }[];
  chapters: { title: string; date: string; text: string; placeIds: string[] }[];
  sources: { title: string; url: string }[];
};

export const vietnamBattles: VietnamBattleModel[] = [
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
    sources: [dienBienPhuSource],
  },
];

export const vietnamBattlePeriod = (battle: VietnamBattleModel) =>
  periodForScene("vietnam", battle.sceneId);

export const vietnamBattleStory = (battle: VietnamBattleModel): StoryModel => ({
  title: battle.title,
  subtitle: battle.summary,
  sides: battle.sides,
  note: "Địa điểm định vị gần đúng. Đường nối biểu thị thứ tự diễn biến, không phải tuyến hành quân thực tế.",
  chapters: battle.chapters.map((chapter) => ({
    ...chapter,
    camera: { center: [106, 17], zoom: 6 },
    characters: battle.leaderIds.map((id) => {
      const person = getCharacter(id);
      return {
        id,
        name: person.name,
        role: battle.id === "ngoc-hoi-dong-da-1789" && id === "nguyen-hue"
          ? "Quang Trung · chỉ huy chiến dịch"
          : person.role,
        side: "home",
      };
    }),
  })),
});
