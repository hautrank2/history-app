import illustrations from "~/data/overview-leader-portraits.json";
import archive from "~/data/overview-portraits.json";
import lifeArchive from "~/data/life-portraits.json";
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
