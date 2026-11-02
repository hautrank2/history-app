import database from "~/data/database/ho-chi-minh-life.json";
import images from "~/data/database/ho-chi-minh-images.json";
import { getCharacter } from "~/data/characters";
import type { LifeRelationKind, LifeSceneModel, LifeSourceModel } from "~/types/ho-chi-minh";

export const lifeScenes = database.scenes as LifeSceneModel[];
export const lifeSources: LifeSourceModel[] = database.sources;
const sceneImages: Record<string, keyof typeof images> = {
  "ben-nha-rong": "departure", "singapore-1911": "departure", "colombo-1911": "departure", "port-said-1911": "departure", "marseille-1911": "departure", "le-havre-1911": "departure", "dunkerque-1911": "departure", "new-york-1912": "departure", london: "departure",
  "paris-1919": "paris", "tours-1920": "tours", "moscow-1923": "moscow", "quang-chau": "guangzhou", "phichit-1928": "siam", "udon-1928": "siam", "nakhon-phanom-1929": "siam", "hong-kong-1930": "hongkong", "hong-kong-1931": "arrest", "moscow-1934": "return-russia", "con-minh-1940": "kunming", "pac-bo-1941": "pacbo", "quang-tay-1942": "prison", "tan-trao-1945": "tantrao", "ba-dinh-1945": "independence", "truman-1946": "hanoi-1946", "so-bo-1946": "agreement", "paris-1946": "france", "hai-phong-1946": "return-1946", "bac-kinh-1950": "1950", "moscow-1950": "1950", "dien-bien-1954": "dienbien", "ha-noi-1958": "hanoi-1958", "new-delhi-1958": "india", "rangoon-1958": "burma", "jakarta-1959": "indonesia", "johnson-1967": "1967", "di-chuc-1969": "1969",
};
export const lifeImageFor = (scene: LifeSceneModel) => {
  const key = sceneImages[scene.id];
  return key ? images[key] : undefined;
};
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
