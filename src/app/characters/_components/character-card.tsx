"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { CountryFlag } from "~/components/country-flag";
import { characterHref, getCharacter } from "~/data/characters";
import { portraitCaption, portraitFor } from "~/data/portraits";

export const CharacterCard = ({ id }: { id: string }) => {
  const person = getCharacter(id);
  const portrait = portraitFor(person.wiki);
  const years = person.lifespan.match(/\b\d{4}\b/g);
  const lifespan = years?.length === 2 ? years.join("–") : person.lifespan;
  return <Link className="character-directory-card" data-character-id={id} href={characterHref(id)} onPointerMove={(event) => {
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--card-rx", `${(0.5 - y) * 4}deg`);
    card.style.setProperty("--card-ry", `${(x - 0.5) * 5}deg`);
    card.style.setProperty("--card-x", `${x * 100}%`);
    card.style.setProperty("--card-y", `${y * 100}%`);
  }} onPointerLeave={(event) => { event.currentTarget.style.removeProperty("--card-rx"); event.currentTarget.style.removeProperty("--card-ry"); }}>
    <span className="character-card-avatar character-card-portrait">{portrait ? <Image src={portrait.src} alt={`Chân dung ${person.name}`} preview={false} fill sizes="(max-width: 760px) 100vw, 33vw" title={portraitCaption(portrait)} style={{ objectPosition: portrait.position }} /> : <b aria-hidden="true">{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</b>}</span>
    <div className="character-card-content"><h2>{person.name}</h2><p>{person.role}</p><div className="character-card-footer"><span className="character-card-country"><CountryFlag countryId={person.countryId} /><small className="character-card-years" title={person.lifespan}>{lifespan}</small></span><span className="character-card-link">Hồ sơ<ArrowUpRight size={14} aria-hidden="true" /></span></div></div>
  </Link>;
};
