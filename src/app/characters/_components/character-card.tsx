import Link from "next/link";

import { CharacterAvatar } from "~/components/character-avatar";
import { CountryFlag } from "~/components/country-flag";
import { Button } from "~/components/ui/button";
import { characterHref, getCharacter } from "~/data/characters";
import { portraitFor, portraitPlaceholder } from "~/data/portraits";

type CharacterCardProps = {
  id: string;
  onSelect: (id: string, trigger: HTMLButtonElement) => void;
};

const cardLifespan = (lifespan: string) => {
  if (lifespan === "Không xác định") return "Không rõ năm sinh";
  if (/^Thế kỷ /i.test(lifespan)) {
    return `Không rõ năm sinh · ${lifespan}`;
  }
  // Only shorten full calendar dates; retain uncertainty and BCE qualifiers.
  return lifespan.replace(/\b\d{1,2}\/\d{1,2}\/(\d{4})\b/g, "$1");
};

export const CharacterCard = ({ id, onSelect }: CharacterCardProps) => {
  const person = getCharacter(id);
  const portrait = portraitFor(person.wiki) ?? portraitPlaceholder;

  return (
    <article
      className="character-directory-card h-full"
      data-character-id={id}
    >
      <button
        className="character-card-preview absolute inset-0 z-1 cursor-pointer rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        type="button"
        aria-label={`Xem nhanh ${person.name}`}
        aria-haspopup="dialog"
        aria-controls="character-sidebar"
        onClick={(event) => onSelect(id, event.currentTarget)}
      />
      <span className="character-card-avatar character-card-portrait">
        <CharacterAvatar
          name={person.name}
          portrait={portrait}
          preview={false}
          fill
          sizes="(min-width: 1024px) 180px, (min-width: 760px) 25vw, (min-width: 600px) 33vw, 50vw"
        />
      </span>
      {portrait.placeholder || portrait.generated ? (
        <small
          className="character-card-portrait-note"
          title={portrait.generated
            ? "Minh họa AI · Tái hiện nghệ thuật"
            : "Ảnh đại diện tượng trưng"}
        >
          {portrait.generated ? "Minh họa AI" : "Ảnh tượng trưng"}
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
        </div>
        <Button
          className="character-card-detail relative z-2 mt-3 w-full text-xs"
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={characterHref(id)} aria-label={`Xem chi tiết ${person.name}`}>
            Xem chi tiết
          </Link>
        </Button>
      </div>
    </article>
  );
};
