"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { CountryFlag } from "~/components/country-flag";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { characterCountries } from "~/data/character-countries";
import { characters, getCharacter } from "~/data/characters";

import { CharacterCard } from "./character-card";
import { CharacterSidebar } from "./character-sidebar";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase();

const countries = characterCountries.map((country) => ({
  ...country,
  count: characters.filter((person) => person.countryId === country.id).length,
}));

export const CharacterDirectory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCountry = searchParams.get("country");
  const countryId =
    countries.find((country) => country.id === requestedCountry)?.id ?? "all";
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const previewTrigger = useRef<HTMLButtonElement | null>(null);

  const openCharacter = (id: string, trigger: HTMLButtonElement) => {
    previewTrigger.current = trigger;
    setSelectedId(id);
  };

  const setCountryId = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("country");
    } else {
      params.set("country", value);
    }
    router.replace(`/characters${params.size ? `?${params}` : ""}`, {
      scroll: false,
    });
  };

  const terms = normalize(query).trim().split(/\s+/);
  const hasFilters = Boolean(query.trim()) || countryId !== "all";
  const resetFilters = () => {
    setQuery("");
    setCountryId("all");
  };
  const filtered = characters
    .filter((person) => {
      const text = normalize(
        [person.name, ...person.aliases, person.role, person.lifespan].join(
          " ",
        ),
      );
      return (
        (countryId === "all" || person.countryId === countryId) &&
        terms.every((term) => text.includes(term))
      );
    })
    .sort(
      (a, b) => Number(b.id === "ho-chi-minh") - Number(a.id === "ho-chi-minh"),
    );
  const resultsTitle = query.trim()
    ? "Kết quả tìm kiếm"
    : (countries.find((country) => country.id === countryId)?.name ??
      "Tất cả nhân vật");

  return (
    <Tabs
      className="character-directory-tabs"
      value={countryId}
      onValueChange={setCountryId}
    >
      <div className="character-directory-toolbar sticky top-0 z-30 mt-6 border-b border-border bg-background p-3">
        <section className="character-filter" aria-label="Bộ lọc nhân vật">
          <div className="character-search-control">
            <label htmlFor="character-search">Tìm nhân vật</label>
            <div className="character-search-field">
              <Search size={19} aria-hidden="true" />
              <Input
                id="character-search"
                type="search"
                placeholder="Tên, bí danh hoặc vai trò…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-describedby="character-filter-count"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Xóa từ khóa"
                  onClick={() => setQuery("")}
                >
                  <X size={17} />
                </button>
              ) : null}
            </div>
          </div>
          <div className="character-filter-summary">
            <p id="character-filter-count" role="status">
              {filtered.length} / {characters.length} nhân vật
            </p>
            {hasFilters ? (
              <button
                className="character-filter-reset"
                type="button"
                onClick={resetFilters}
              >
                <X size={14} aria-hidden="true" />
                Xóa bộ lọc
              </button>
            ) : (
              <small>Tìm được cả khi gõ không dấu</small>
            )}
          </div>
        </section>

        <TabsList
          className="character-country-tabs border-b-0"
          variant="line"
          aria-label="Chọn quốc gia"
        >
          <TabsTrigger className="character-country-tab" value="all">
            Tất cả <span>{characters.length}</span>
          </TabsTrigger>
          {countries.map((country) => (
            <TabsTrigger
              className="character-country-tab"
              key={country.id}
              value={country.id}
            >
              <CountryFlag countryId={country.id} />
              {country.name} <span>{country.count}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <p className="character-country-note">
        Quốc gia gắn với hoạt động của nhân vật. Cờ hiện đại chỉ dùng để nhận
        diện; Champa và Nam Việt dùng biểu trưng.
      </p>

      <TabsContent value={countryId} className="character-results">
        <section aria-labelledby="character-results-heading">
          <div className="character-results-heading">
            <h2 id="character-results-heading">{resultsTitle}</h2>
            <span>{filtered.length} hồ sơ</span>
          </div>
          {filtered.length ? (
            <div className="character-grid" aria-label="Danh sách nhân vật">
              {filtered.map((person) => (
                <CharacterCard
                  id={person.id}
                  key={person.id}
                  onSelect={openCharacter}
                />
              ))}
            </div>
          ) : (
            <div className="character-filter-empty">
              <h3>Chưa tìm thấy nhân vật</h3>
              <p>Thử tên gọi khác, từ khóa ngắn hơn hoặc chọn quốc gia khác.</p>
              <button type="button" onClick={resetFilters}>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </section>
      </TabsContent>
      {selectedId ? (
        <CharacterSidebar
          person={getCharacter(selectedId)}
          onClose={() => setSelectedId(null)}
          onReturnFocus={() => previewTrigger.current?.focus()}
        />
      ) : null}
    </Tabs>
  );
};
