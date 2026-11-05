import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CharacterAvatar } from "~/components/character-avatar";
import { CountryFlag } from "~/components/country-flag";
import { characterHref, getCharacter } from "~/data/characters";
import { portraitFor, portraitPlaceholder } from "~/data/portraits";

type CharacterCardProps = { id: string };

const cardLifespan = (lifespan: string) => {
  if (lifespan === "Không xác định") return "Không rõ năm sinh";
  if (/^Thế kỷ /i.test(lifespan)) {
    return `Không rõ năm sinh · ${lifespan}`;
  }
  // Only shorten full calendar dates; retain uncertainty and BCE qualifiers.
  return lifespan.replace(/\b\d{1,2}\/\d{1,2}\/(\d{4})\b/g, "$1");
};

export const CharacterCard = ({ id }: CharacterCardProps) => {
  const person = getCharacter(id);
  const portrait = portraitFor(person.wiki) ?? portraitPlaceholder;

  return (
    <Link
      className="character-directory-card"
      data-character-id={id}
      href={characterHref(id)}
    >
      <span className="character-card-avatar character-card-portrait">
        <CharacterAvatar
          name={person.name}
          portrait={portrait}
          preview={false}
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
        />
      </span>
      {portrait.placeholder || portrait.generated ? (
        <small className="character-card-portrait-note absolute inset-x-[22px] top-[22px] z-2 text-center text-[10px] text-muted-foreground">
          {portrait.generated ? "Minh họa AI · Tái hiện nghệ thuật" : "Ảnh đại diện tượng trưng"}
        </small>
      ) : null}
      <div className="character-card-content">
        <h2>{person.name}</h2>
        <p>{person.role}</p>
        <div className="character-card-footer">
          <span className="character-card-country">
            <CountryFlag countryId={person.countryId} />
            <small className="character-card-years" title={person.lifespan}>
              {cardLifespan(person.lifespan)}
            </small>
          </span>
          <span className="character-card-link">
            Hồ sơ<ArrowUpRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
};
