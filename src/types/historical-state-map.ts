export type HistoricalStateModel = {
  id: string;
  name: string;
  color: string;
  kind: "state" | "context";
  center: { name: string; at: [number, number] };
  labelAt: [number, number];
  rings: number[][][];
  landCountries?: string[];
  summary: string;
};

export type HistoricalStateMapModel = {
  year: number;
  dateLabel?: string;
  title: string;
  note: string;
  view?: { northwest: [number, number]; southeast: [number, number] };
  landCountries?: string[];
  states: HistoricalStateModel[];
  frontiers?: { name: string; points: [number, number][] }[];
  sources: { title: string; url: string }[];
};
