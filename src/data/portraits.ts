import illustrations from "~/data/overview-leader-portraits.json";
import archive from "~/data/overview-portraits.json";
import lifeArchive from "~/data/life-portraits.json";
import lifeAvatars from "~/data/database/ho-chi-minh-avatars.json";
import lifeImages from "~/data/database/ho-chi-minh-images.json";
import type { LifeSceneModel } from "~/types/ho-chi-minh";
import type { OverviewPlaceModel } from "~/data/vietnam-overview";

export type PortraitModel = { src: string; file: string; article: string; author: string; license: string; position: string; generated?: boolean };
const archivePortraits: Record<string, { src: string; file: string; article: string; author: string; license: string }> = { ...archive, ...lifeArchive };
const leaderIllustrations: Record<string, { src: string; position: string }> = illustrations;

export const portraitFor = (wiki: string): PortraitModel | undefined => {
  const illustration = leaderIllustrations[wiki];
  const original = archivePortraits[wiki];
  if (illustration) return { ...illustration, file: illustration.src, article: original?.article ?? `https://vi.wikipedia.org/wiki/${encodeURIComponent(wiki.replaceAll(" ", "_"))}`, author: "Minh họa AI", license: "Tái hiện nghệ thuật", generated: true };
  return original ? { ...original, position: "50% 20%" } : undefined;
};

export const placePortrait = (place: OverviewPlaceModel) => place.leader ? portraitFor(place.leader.wiki) : undefined;
export const portraitCaption = (portrait: PortraitModel) => portrait.generated ? "Minh họa AI · Tái hiện nghệ thuật, không phải chân dung xác thực" : `${portrait.author} · ${portrait.license} · Ảnh cắt theo khung`;

type LifeAvatarModel = { year: number; src: string; source: string; crop?: [number, number, number, number] };
// Crop coordinates isolate Bác's face while retaining the original archival image.
const lifeAvatarPortraits: LifeAvatarModel[] = [
  { year: 1920, ...lifeAvatars["1920"] },
  { year: 1923, ...lifeImages.moscow },
  { year: 1930, ...lifeImages.hongkong },
  { year: 1931, ...lifeImages.arrest },
  { year: 1934, ...lifeImages["return-russia"], crop: [39, 12, 23, 15.7] },
  { year: 1945, ...lifeAvatars["1945"] },
  { year: 1946, src: archive["Ho Chi Minh"].src, source: archive["Ho Chi Minh"].file },
  { year: 1950, ...lifeImages["1950"], crop: [32, 23, 18, 25.6] },
  { year: 1958, ...lifeImages["hanoi-1958"], crop: [4, 3, 14, 18.1] },
  { year: 1967, ...lifeImages["1967"], crop: [78.2, 40, 9.5, 12.7] },
  { year: 1969, ...lifeImages["1969"], crop: [7.4, 30.5, 8.5, 22.9] },
];
export const lifeAvatarFor = (scene: LifeSceneModel) => {
  const portrait = lifeAvatarPortraits.findLast((item) => item.year <= scene.year) ?? lifeAvatarPortraits[0];
  return { ...portrait, caption: `Chân dung Hồ Chí Minh · ảnh năm ${portrait.year}`, note: portrait.year === scene.year ? "Ảnh cùng năm với mốc đang xem." : scene.year < portrait.year ? `Ảnh đại diện năm ${portrait.year}; chưa có chân dung xác thực tại mốc ${scene.date}.` : `Ảnh đại diện giai đoạn, chụp năm ${portrait.year}; mốc đang xem: ${scene.date}.` };
};
