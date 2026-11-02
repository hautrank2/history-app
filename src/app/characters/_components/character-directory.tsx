"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Input } from "~/components/ui/input";
import { characters } from "~/data/characters";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase();

export const CharacterDirectory = () => {
  const [query, setQuery] = useState("");
  const terms = normalize(query).trim().split(/\s+/);
  const filtered = characters.filter((person) => {
    const text = normalize([person.name, ...person.aliases, person.role, person.lifespan].join(" "));
    return terms.every((term) => text.includes(term));
  });
  return <>
    <div className="character-filter">
      <label htmlFor="character-search">Tìm nhân vật</label>
      <div className="character-search-field"><Search size={19} aria-hidden="true" /><Input id="character-search" type="search" placeholder="Tên, bí danh hoặc vai trò…" value={query} onChange={(event) => setQuery(event.target.value)} aria-describedby="character-filter-count" />{query ? <button type="button" aria-label="Xóa bộ lọc" onClick={() => setQuery("")}><X size={17} /></button> : null}</div>
      <p id="character-filter-count" role="status">{filtered.length} / {characters.length} nhân vật · Tìm được cả khi gõ không dấu</p>
    </div>
    <section className="character-grid" aria-label="Danh sách nhân vật">{filtered.map((person) => <Link className="character-directory-card" data-character-id={person.id} href={`/characters/${person.id}`} key={person.id}><h2>{person.name}</h2><p>{person.role}</p><span>{person.id === "ho-chi-minh" ? "Khám phá hành trình cuộc đời →" : "Xem hồ sơ →"}</span></Link>)}</section>
    {!filtered.length ? <div className="character-filter-empty"><h2>Chưa tìm thấy nhân vật</h2><p>Thử tên gọi khác hoặc từ khóa ngắn hơn.</p><button type="button" onClick={() => setQuery("")}>Xóa bộ lọc</button></div> : null}
  </>;
};
