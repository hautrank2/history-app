import database from "~/data/database/ho-chi-minh-life.json";
import { getCharacter } from "~/data/characters";
import type { LifeRelationKind, LifeSceneModel, LifeSourceModel } from "~/types/ho-chi-minh";

export const lifeScenes = database.scenes as LifeSceneModel[];
export const lifeSources: LifeSourceModel[] = database.sources;
export const lifeChapters = [...new Set(lifeScenes.map((scene) => scene.chapter))];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
export const matchesLifeScene = (scene: LifeSceneModel, query: string) => {
  const text = normalize(`${scene.date} ${scene.title} ${scene.name} ${scene.location.name} ${scene.location.country} ${scene.people.map((person) => { const character = getCharacter(person.characterId); return [character.name, ...character.aliases].join(" "); }).join(" ")}`);
  return normalize(query).trim().split(/\s+/).every((term) => text.includes(term));
};
export const relationLabels: Record<LifeRelationKind, string> = {
  companion: "Đồng hành", ally: "Hợp tác quốc tế", opponent: "Đối đầu",
  diplomacy: "Đối thoại ngoại giao", influence: "Ảnh hưởng tư tưởng",
};
