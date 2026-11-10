import { ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";

import { CountryFlag } from "~/components/country-flag";
import { listedCountries } from "~/data";
import { characters } from "~/data/characters";

const destinations = [
  ...listedCountries.map(({ slug, name }) => ({
    countryId: slug,
    label: `Nhân vật ${name}`,
  })),
  { countryId: null, label: "Tất cả nhân vật" },
];

export const CharacterLinks = () => <section className="atlas-character-directory" aria-labelledby="atlas-characters-heading">
  <div className="atlas-section-heading"><div><p className="atlas-eyebrow">CON NGƯỜI LÀM NÊN LỊCH SỬ</p><h2 id="atlas-characters-heading">Khám phá <em>nhân vật.</em></h2></div><p>Những cuộc đời và dấu ấn qua từng thời đại.</p></div>
  <nav className="atlas-character-links" aria-label="Khám phá nhân vật theo quốc gia">{destinations.map(({ countryId, label }) => <Link key={countryId ?? "all"} href={countryId ? `/characters?country=${countryId}` : "/characters"} className="atlas-character-link" data-country-id={countryId ?? "all"}>
    {countryId ? <CountryFlag countryId={countryId} /> : <Users size={30} aria-hidden="true" />}<span><strong>{label}</strong><small>{countryId ? characters.filter((person) => person.countryId === countryId).length : characters.length} hồ sơ{countryId ? "" : " · Không lọc quốc gia"}</small></span><ArrowUpRight size={18} aria-hidden="true" />
  </Link>)}</nav>
</section>;
