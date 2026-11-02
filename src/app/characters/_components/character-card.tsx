"use client";

import Link from "next/link";
import { Image } from "@/components/ui/image";
import { characterHref, getCharacter } from "~/data/characters";
import { portraitCaption, portraitFor } from "~/data/portraits";

export const CharacterCard = ({ id }: { id: string }) => {
  const person = getCharacter(id);
  const portrait = portraitFor(person.wiki);
  return <Link className="character-directory-card" data-character-id={id} href={characterHref(id)} onPointerMove={(event) => {
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--card-rx", `${(0.5 - y) * 12}deg`);
    card.style.setProperty("--card-ry", `${(x - 0.5) * 14}deg`);
    card.style.setProperty("--card-x", `${x * 100}%`);
    card.style.setProperty("--card-y", `${y * 100}%`);
  }} onPointerLeave={(event) => { event.currentTarget.style.removeProperty("--card-rx"); event.currentTarget.style.removeProperty("--card-ry"); }}>
    <span className="character-card-avatar">{portrait ? <Image src={portrait.src} alt={`Chân dung ${person.name}`} preview={false} width={96} height={112} title={portraitCaption(portrait)} style={{ objectPosition: portrait.position }} /> : <b aria-hidden="true">{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</b>}</span>
    <div className="character-card-content"><small className="character-card-years">{person.lifespan}</small><h2>{person.name}</h2><p>{person.role}</p><span className="character-card-link">{id === "ho-chi-minh" ? "Khám phá hành trình cuộc đời →" : "Xem hồ sơ →"}</span></div>
  </Link>;
};
