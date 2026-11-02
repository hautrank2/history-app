import { Image } from "@/components/ui/image";
import { getCharacter } from "~/data/characters";
import type { LifeSceneModel } from "~/types/ho-chi-minh";
import { lifeAvatarFor, portraitCaption, portraitFor } from "~/data/portraits";

export const LifePortrait = ({ characterId, preview = false, scene }: { characterId: string; preview?: boolean; scene?: LifeSceneModel }) => {
  const person = getCharacter(characterId);
  if (characterId === "ho-chi-minh" && scene) {
    const image = lifeAvatarFor(scene);
    const crop = image.crop;
    return <span className="hcm-scene-avatar" data-portrait-year={image.year}><Image src={image.src} alt={image.caption} preview={preview} width={120} height={120} style={crop ? { position: "absolute", maxWidth: "none", width: `${10000 / crop[2]}%`, height: `${10000 / crop[3]}%`, left: `${-crop[0] / crop[2] * 100}%`, top: `${-crop[1] / crop[3] * 100}%`, objectFit: "fill", borderRadius: 0 } : { objectPosition: "50% 25%" }} title={`${image.caption}. ${image.note}`} /></span>;
  }
  const portrait = portraitFor(person.wiki);
  return portrait ? <Image src={portrait.src} alt={`Chân dung ${person.name}`} preview={preview} width={120} height={150} style={{ objectPosition: portrait.position }} title={portraitCaption(portrait)} /> : <span className="hcm-portrait-initials" aria-label={person.name}>{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>;
};
