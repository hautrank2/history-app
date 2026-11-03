"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CountryFlag } from "~/components/country-flag";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { characterCountries } from "~/data/character-countries";
import { characters } from "~/data/characters";
import { readRecentCharacters, recentCharactersKey } from "~/lib/recent-characters";
import { CharacterCard } from "./character-card";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
const countries = characterCountries.map((country) => ({ ...country, count: characters.filter((person) => person.countryId === country.id).length }));

export const CharacterDirectory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCountry = searchParams.get("country");
  const countryId = countries.find((country) => country.id === requestedCountry)?.id ?? "all";
  const setCountryId = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("country"); else params.set("country", value);
    router.replace(`/characters${params.size ? `?${params}` : ""}`, { scroll: false });
  };
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
  const hasFilters = Boolean(query.trim()) || countryId !== "all";
  const resetFilters = () => { setQuery(""); setCountryId("all"); };
  const filtered = characters.filter((person) => {
    const text = normalize([person.name, ...person.aliases, person.role, person.lifespan].join(" "));
    return (countryId === "all" || person.countryId === countryId) && terms.every((term) => text.includes(term));
  }).sort((a, b) => Number(b.id === "ho-chi-minh") - Number(a.id === "ho-chi-minh"));
  return <>
    <section className="character-filter" aria-label="Bộ lọc nhân vật">
      <div className="character-filter-controls">
        <div className="character-search-control"><label htmlFor="character-search">Tìm nhân vật</label>
          <div className="character-search-field"><Search size={19} aria-hidden="true" /><Input id="character-search" type="search" placeholder="Tên, bí danh hoặc vai trò…" value={query} onChange={(event) => setQuery(event.target.value)} aria-describedby="character-filter-count" />{query ? <button type="button" aria-label="Xóa từ khóa" onClick={() => setQuery("")}><X size={17} /></button> : null}</div>
        </div>
        <div className="character-country-control"><label htmlFor="character-country">Quốc gia</label>
          <Select value={countryId} onValueChange={setCountryId}><SelectTrigger id="character-country" className="character-country-trigger" aria-describedby="character-country-note"><SelectValue /></SelectTrigger>
            <SelectContent className="character-country-options" position="popper" align="start"><SelectItem value="all">Tất cả quốc gia · {characters.length}</SelectItem>{countries.map((country) => <SelectItem key={country.id} value={country.id}><CountryFlag countryId={country.id} />{country.name} · {country.count}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="character-filter-summary"><p id="character-filter-count" role="status">{filtered.length} / {characters.length} nhân vật</p>{hasFilters ? <button className="character-filter-reset" type="button" onClick={resetFilters}><X size={14} aria-hidden="true" />Xóa bộ lọc</button> : <small>Tìm được cả khi gõ không dấu</small>}</div>
      <p id="character-country-note">Quốc gia gắn với hoạt động của nhân vật. Cờ hiện đại chỉ dùng để nhận diện; Champa và Nam Việt dùng biểu trưng.</p>
    </section>
    {!hasFilters ? <section className="character-recent" aria-labelledby="character-recent-heading"><div className="character-recent-heading"><h2 id="character-recent-heading">Nhân vật vừa xem</h2><small>Lưu trên trình duyệt này</small></div>{recent === null ? <p className="character-recent-empty" role="status">Đang tải lịch sử xem…</p> : recent.length ? <div className="character-grid character-recent-grid">{recent.map((id) => <CharacterCard id={id} key={id} />)}</div> : <p className="character-recent-empty">Những hồ sơ bạn mở sẽ xuất hiện ở đây.</p>}</section> : null}
    <section className="character-results" aria-labelledby="character-results-heading"><div className="character-results-heading"><h2 id="character-results-heading">{hasFilters ? "Kết quả tìm kiếm" : "Tất cả nhân vật"}</h2><span>{filtered.length} hồ sơ</span></div>
      {filtered.length ? <div className="character-grid" aria-label="Danh sách nhân vật">{filtered.map((person) => <CharacterCard id={person.id} key={person.id} />)}</div> : <div className="character-filter-empty"><h3>Chưa tìm thấy nhân vật</h3><p>Thử tên gọi khác, từ khóa ngắn hơn hoặc chọn quốc gia khác.</p><button type="button" onClick={resetFilters}>Xóa bộ lọc</button></div>}
    </section>
  </>;
};
