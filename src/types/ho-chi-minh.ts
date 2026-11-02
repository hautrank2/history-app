export type LifeSourceModel = { id: string; title: string; publisher: string; url: string };
export type LifeRelationKind = "companion" | "ally" | "opponent" | "diplomacy" | "influence";
export type LifePersonModel = {
  characterId: string; kind: LifeRelationKind; connection: string;
  place?: string; at?: [number, number]; locationNote?: string; sourceIds: string[];
};
export type LifeSceneModel = {
  id: string; chapter: string; date: string; year: number; name: string; title: string;
  location: { name: string; country: string; at: [number, number] };
  summary: string; meaning: string; context: string; people: LifePersonModel[];
  sourceIds: string[]; overviewId?: string;
};
