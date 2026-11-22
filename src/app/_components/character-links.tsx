import { BookOpen, Users } from "lucide-react";
import Link from "next/link";

import { Image } from "@/components/ui/image";
import { CountryFlag } from "~/components/country-flag";
import { SectionAnchor } from "~/components/section-anchor";
import { listedCountries } from "~/data";
import { characters } from "~/data/characters";
import { countryPresentation } from "~/data/world";

const destinations = [
  {
    countryId: null,
    label: "Tất cả nhân vật",
    image: "/images/three-kingdoms-battle.png",
    description: "Những cuộc đời nối liền các thời đại",
  },
  ...listedCountries.map(({ slug, name }) => ({
    countryId: slug,
    label: `Nhân vật ${name}`,
    image: countryPresentation[slug].image,
    description: countryPresentation[slug].subtitle,
  })),
];

export const CharacterLinks = () => (
  <section
    id="characters"
    className="atlas-character-directory scroll-mt-6"
    aria-labelledby="atlas-characters-heading"
  >
    <div className="atlas-section-heading">
      <div>
        <p className="atlas-eyebrow">CON NGƯỜI LÀM NÊN LỊCH SỬ</p>
        <h2 id="atlas-characters-heading">
          <SectionAnchor id="characters" label="Nhân vật" />
          Khám phá <em>nhân vật.</em>
        </h2>
      </div>
      <p>Những cuộc đời và dấu ấn qua từng thời đại.</p>
    </div>
    <nav
      className="atlas-character-links"
      aria-label="Khám phá nhân vật theo quốc gia"
    >
      {destinations.map(({ countryId, label, image, description }) => {
        const count = countryId
          ? characters.filter((person) => person.countryId === countryId).length
          : characters.length;

        return (
          <Link
            key={countryId ?? "all"}
            href={countryId ? `/characters?country=${countryId}` : "/characters"}
            className="atlas-character-link atlas-character-cover group relative isolate flex min-h-80 flex-col justify-between overflow-hidden border border-border p-7 sm:p-8"
            data-country-id={countryId ?? "all"}
          >
            <Image
              src={image}
              alt=""
              title="Minh họa AI · Tái hiện nghệ thuật"
              preview={false}
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              className="atlas-character-background -z-20 object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
            />
            <div className="atlas-character-shade pointer-events-none absolute inset-0 -z-10" />
            <div className="atlas-character-cover-top flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 border border-border bg-background/90 px-3 py-2 text-xs text-foreground">
                {countryId
                  ? <CountryFlag countryId={countryId} />
                  : <Users size={18} aria-hidden="true" />}
                {count} hồ sơ
              </span>
              <BookOpen size={22} strokeWidth={1.4} aria-hidden="true" />
            </div>
            <div className="atlas-character-cover-copy mt-20">
              <h3 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
                {label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <span className="atlas-character-cover-cta mt-6 block border-t border-border/60 pt-4 text-xs font-semibold text-primary">
                Khám phá hồ sơ
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  </section>
);
