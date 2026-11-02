"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "~/components/ui/input";
import { characters } from "~/data/characters";
import { readRecentCharacters, recentCharactersKey } from "~/lib/recent-characters";
import { CharacterCard } from "./character-card";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase();

export const CharacterDirectory = () => {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[] | null>(null);
  useEffect(() => {
    const refresh = () => setRecent(readRecentCharacters().filter((id) => characters.some((person) => person.id === id)));
    refresh();
    const storage = (event: StorageEvent) => { if (event.key === recentCharactersKey || event.key === null) refresh(); };
    window.addEventListener("storage", storage);
    window.addEventListener("atlas:recent-characters", refresh);
    return () => { window.removeEventListener("storage", storage); window.removeEventListener("atlas:recent-characters", refresh); };
  }, []);
  const terms = normalize(query).trim().split(/\s+/);
  const filtered = characters.filter((person) => {
    const text = normalize([person.name, ...person.aliases, person.role, person.lifespan].join(" "));
    return terms.every((term) => text.includes(term));
  }).sort((a, b) => Number(b.id === "ho-chi-minh") - Number(a.id === "ho-chi-minh"));
  return <>
    <div className="character-filter">
      <label htmlFor="character-search">Tìm nhân vật</label>
      <div className="character-search-field"><Search size={19} aria-hidden="true" /><Input id="character-search" type="search" placeholder="Tên, bí danh hoặc vai trò…" value={query} onChange={(event) => setQuery(event.target.value)} aria-describedby="character-filter-count" />{query ? <button type="button" aria-label="Xóa bộ lọc" onClick={() => setQuery("")}><X size={17} /></button> : null}</div>
      <p id="character-filter-count" role="status">{filtered.length} / {characters.length} nhân vật · Tìm được cả khi gõ không dấu</p>
    </div>
    {!query.trim() ? <section className="character-recent" aria-labelledby="character-recent-heading"><div className="character-recent-heading"><h2 id="character-recent-heading">Nhân vật vừa xem</h2><small>Lưu trên trình duyệt này</small></div>{recent === null ? <p className="character-recent-empty" role="status">Đang tải lịch sử xem…</p> : recent.length ? <div className="character-grid character-recent-grid">{recent.map((id) => <CharacterCard id={id} key={id} />)}</div> : <p className="character-recent-empty">Những hồ sơ bạn mở sẽ xuất hiện ở đây.</p>}</section> : null}
    <section className="character-grid" aria-label="Danh sách nhân vật">{filtered.map((person) => <CharacterCard id={person.id} key={person.id} />)}</section>
    {!filtered.length ? <div className="character-filter-empty"><h2>Chưa tìm thấy nhân vật</h2><p>Thử tên gọi khác hoặc từ khóa ngắn hơn.</p><button type="button" onClick={() => setQuery("")}>Xóa bộ lọc</button></div> : null}
  </>;
};
