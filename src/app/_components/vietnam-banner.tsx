import { ArrowRight, Compass, Map, Route } from "lucide-react";
import Link from "next/link";

import { Image } from "@/components/ui/image";
import { countriesData } from "~/data";
import { getCharacter } from "~/data/characters";
import { portraitFor } from "~/data/portraits";
import { countryPresentation } from "~/data/world";

export const VietnamBanner = () => {
  const country = countriesData.vietnam;
  const visual = countryPresentation.vietnam;
  const person = getCharacter("ho-chi-minh");
  const portrait = portraitFor(person.wiki);

  return <article className="atlas-country atlas-country-vietnam atlas-vietnam-banner" data-country-id="vietnam" aria-labelledby="atlas-vietnam-title">
    <Image className="atlas-vietnam-background" src={visual.image} alt="Minh họa lịch sử Việt Nam" fill priority preview={false} />
    {portrait ? <figure className="atlas-vietnam-portrait" data-character-id={person.id}><Image src={portrait.src} alt={`Chân dung ${person.name}`} fill priority preview={false} style={{ objectPosition: portrait.position }} /></figure> : null}
    <div className="atlas-country-shade atlas-vietnam-shade" />
    {portrait ? <div className="atlas-vietnam-person-caption"><strong>{person.name}</strong><span>{person.lifespan}</span><a href={portrait.file} target="_blank" rel="noreferrer">Nguồn ảnh tư liệu ↗</a></div> : null}
    <div className="atlas-country-top"><span>{visual.numeral} / {visual.english}</span><span>{country?.periods.length} GIAI ĐOẠN</span></div>
    <div className="atlas-vietnam-copy">
      <p className="atlas-vietnam-eyebrow">MỘT ĐẤT NƯỚC · NHỮNG HÀNH TRÌNH</p>
      <h2 id="atlas-vietnam-title">Việt Nam</h2>
      <p className="atlas-vietnam-subtitle">Từ cội nguồn đến khát vọng độc lập.</p>
      <p className="atlas-vietnam-description">Khám phá những thời đại làm nên đất nước và theo dấu hành trình Hồ Chí Minh qua các mốc cuộc đời trên bản đồ.</p>
      <nav className="atlas-vietnam-navigation" aria-label="Khám phá lịch sử Việt Nam">
        <Link className="atlas-vietnam-primary" data-character-id={person.id} href="/characters/ho-chi-minh"><Route size={17} /><span>Hành trình Hồ Chí Minh</span><ArrowRight size={16} /></Link>
        <Link href="/vietnam"><Map size={16} />Tóm tắt lịch sử Việt Nam<ArrowRight size={14} /></Link>
      </nav>
    </div>
  </article>;
};
