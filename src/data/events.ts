import rows from "~/data/database/event.json";

export type HistoricalEventModel = {
  id: string; title: string; years: string; sceneIds: string[]; leaderIds: string[];
  location: string; at: [number, number]; summary: string; outcome: string;
  sources: { title: string; url: string }[];
};
export const historicalEvents: HistoricalEventModel[] = rows.map((row) => ({ ...row, at: [row.at[0], row.at[1]] }));
