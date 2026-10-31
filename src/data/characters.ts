import rows from "~/data/database/character.json";

export type HistoricalCharacterModel = {
  battlePortrait?: { src: string; generated: boolean };
  id: string; name: string; aliases: string[]; wiki: string; role: string;
  biography: string; lifespan: string; sources: { title: string; url: string }[];
};
export const characters: HistoricalCharacterModel[] = rows;
export const findCharacter = (value: string) => characters.find((person) => person.id === value || person.name === value || person.wiki === value || person.aliases.includes(value));
export const getCharacter = (id: string): HistoricalCharacterModel => {
  const character = findCharacter(id);
  if (!character) throw new Error(`Unknown character: ${id}`);
  return character;
};
export const characterHref = (value: string) => {
  const person = findCharacter(value);
  return person ? `/characters/${person.id}` : "/characters";
};

export const battlePortraitFor = (value: string) => findCharacter(value)?.battlePortrait;
