import { Image } from "@/components/ui/image";
import { getCharacter } from "~/data/characters";
import { portraitCaption, portraitFor } from "~/data/portraits";

export const LifePortrait = ({ characterId, preview = false }: { characterId: string; preview?: boolean }) => {
  const person = getCharacter(characterId);
  const portrait = portraitFor(person.wiki);
  return portrait ? <Image src={portrait.src} alt={`Chân dung ${person.name}`} preview={preview} width={120} height={150} style={{ objectPosition: portrait.position }} title={portraitCaption(portrait)} /> : <span className="hcm-portrait-initials" aria-label={person.name}>{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>;
};
