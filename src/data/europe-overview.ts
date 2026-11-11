import { getCharacter } from "~/data/characters";
import denmarkRows from "~/data/database/denmark-eras.json";
import englandRows from "~/data/database/england-eras.json";
import norwayRows from "~/data/database/norway-eras.json";
import type { OverviewSourceModel } from "~/data/vietnam-overview-details";
import type {
  OverviewPlaceModel,
  OverviewSceneModel,
} from "~/data/vietnam-overview";
import type { PeriodModel } from "~/types";

export type EuropeCountryId = "england" | "denmark" | "norway";

type EraPlaceModel = {
  name: string;
  at: number[];
  kind: string;
  note: string;
};

type EraRowModel = {
  id: string;
  era: string;
  name: string;
  years: string;
  start: number;
  end: number | null;
  capital: string;
  places: EraPlaceModel[];
  summary: string;
  culture: string;
  storySections?: OverviewSceneModel["storySections"];
  geographySections?: OverviewSceneModel["geographySections"];
  peopleIds: string[];
  sourceArticle: string;
  extraSources?: OverviewSourceModel[];
};

export type EuropeOverviewModel = {
  id: EuropeCountryId;
  name: string;
  heading: string;
  description: string;
  scenes: OverviewSceneModel[];
  periods: PeriodModel[];
  eraYears: Record<string, string>;
  // Hash cũ của các giai đoạn giữ chỗ vẫn mở đúng cảnh
  aliases: Record<string, string>;
  sourcesFor: (sceneId: string) => OverviewSourceModel[];
};

const placeKinds: OverviewPlaceModel["kind"][] = [
  "capital", "battle", "camp", "heritage",
];

export const wikipediaUrl = (article: string) =>
  `https://en.wikipedia.org/wiki/${encodeURIComponent(
    article.replaceAll(" ", "_"),
  )}`;

const toPlace = (place: EraPlaceModel): OverviewPlaceModel => ({
  name: place.name,
  at: [place.at[0] ?? 0, place.at[1] ?? 0],
  kind: placeKinds.find((kind) => kind === place.kind) ?? "heritage",
  detail: `${place.note} Tọa độ ước lượng, không biểu thị ranh giới lịch sử.`,
});

const toScene = (row: EraRowModel): OverviewSceneModel => ({
  id: row.id,
  era: row.era,
  years: row.years,
  year: row.start,
  title: row.name,
  nation: row.name,
  capital: row.capital,
  territory: "full",
  extent: `Trung tâm tham chiếu: ${row.capital}. Lãnh thổ và trung tâm quyền lực thay đổi trong giai đoạn ${row.years}; nền bản đồ hiện đại chỉ giúp định vị.`,
  summary: row.summary,
  culture: { title: "Văn hóa và cách đọc tư liệu", text: row.culture },
  storySections: row.storySections,
  geographySections: row.geographySections,
  people: row.peopleIds.map((id) => {
    const person = getCharacter(id);
    return { id: person.id, name: person.name, role: person.role, wiki: person.wiki };
  }),
  places: row.places.map(toPlace),
  sources: [row.sourceArticle],
});

const yearLabel = (year: number) => year < 0 ? `${-year} TCN` : String(year);

const buildOverview = (
  id: EuropeCountryId,
  name: string,
  heading: string,
  description: string,
  rows: EraRowModel[],
  timeline: OverviewSourceModel,
  aliases: Record<string, string> = {},
): EuropeOverviewModel => {
  const sorted = [...rows].sort((first, second) => first.start - second.start);
  const scenes = sorted.map(toScene);
  const eras = [...new Set(sorted.map((row) => row.era))];
  const eraYears = Object.fromEntries(eras.map((era) => {
    const eraRows = sorted.filter((row) => row.era === era);
    const start = Math.min(...eraRows.map((row) => row.start));
    const end = eraRows.some((row) => row.end === null)
      ? "nay"
      : yearLabel(Math.max(...eraRows.map((row) => row.end ?? row.start)));
    return [era, `${yearLabel(start)} – ${end}`];
  }));
  const periods = eras.map((era) => {
    const first = sorted.find((row) => row.era === era);
    return {
      slug: first?.id ?? id,
      title: era,
      years: eraYears[era],
      blurb: first?.summary ?? "",
    };
  });
  const sourcesFor = (sceneId: string) => {
    const row = sorted.find((item) => item.id === sceneId);
    return [
      ...(row ? [{ title: row.sourceArticle, url: wikipediaUrl(row.sourceArticle) }] : []),
      ...(row?.extraSources ?? []),
      timeline,
    ];
  };
  return {
    id,
    name,
    heading,
    description,
    scenes,
    periods,
    eraYears,
    aliases,
    sourcesFor,
  };
};

export const europeOverviews: Record<EuropeCountryId, EuropeOverviewModel> = {
  england: buildOverview(
    "england",
    "Anh",
    "Lịch sử nước Anh — từ Britannia La Mã đến hiện đại",
    "Khám phá lịch sử nước Anh từ thời La Mã, Anglo-Saxon, Viking, Norman đến hiện đại qua bản đồ 2D, văn hóa và nhân vật.",
    englandRows,
    { title: "Wikipedia · History of England", url: wikipediaUrl("History of England") },
    { "norman-plantagenet": "norman-conquest" },
  ),
  denmark: buildOverview(
    "denmark",
    "Đan Mạch",
    "Lịch sử Đan Mạch — từ thời Viking đến hiện đại",
    "Khám phá lịch sử Đan Mạch từ Danevirke, các vua Viking, Liên minh Kalmar đến hiện đại qua bản đồ 2D, văn hóa và nhân vật.",
    denmarkRows,
    { title: "Wikipedia · History of Denmark", url: wikipediaUrl("History of Denmark") },
  ),
  norway: buildOverview(
    "norway",
    "Na Uy",
    "Lịch sử Na Uy — từ thời Viking đến hiện đại",
    "Khám phá lịch sử Na Uy từ tàu Viking, Harald Tóc Đẹp, các vua Olaf đến dầu mỏ Biển Bắc qua bản đồ 2D, văn hóa và nhân vật.",
    norwayRows,
    { title: "Wikipedia · History of Norway", url: wikipediaUrl("History of Norway") },
  ),
};

export const isEuropeCountry = (id: string): id is EuropeCountryId =>
  id in europeOverviews;
