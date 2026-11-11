"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

import { CompactLink } from "~/components/compact-link";
import { HomeLink } from "~/components/home-link";
import { NationalFlag } from "~/components/national-flag";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { TooltipProvider } from "~/components/ui/tooltip";
import {
  chinaEraYears,
  chinaMapIdFor,
  chinaOverview,
  chinaSceneAliases,
} from "~/data/china-overview";
import { chinaStateMaps } from "~/data/china-state-maps";
import { englandGeography } from "~/data/england-geography";
import { englandStateMaps } from "~/data/england-territories";
import { europeOverviews, isEuropeCountry } from "~/data/europe-overview";
import type { EuropeCountryId } from "~/data/europe-overview";
import { vietnamOverview } from "~/data/vietnam-overview";


import { ChinaHistoryMap } from "./china-history-map";
import { ContentPanel } from "./content-panel";
import { CountryStats } from "./country-stats";
import { EnglandSceneFlag } from "./england-scene-flag";
import { HistoryMap } from "./history-map";
import { useVietnamOverview } from "./hook";
import "~/styles/vietnam-overview.css";
import "~/styles/vietnam-overview-content.css";

const eraYears: Record<string, string> = { "Nhà Lý": "1009–1225", "Nhà Trần": "1225–1400", "Tây Sơn": "1771–1802", "Nhà Nguyễn": "1802–1945" };
const normalize = (text: string) => text.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replaceAll("đ", "d")
  .replaceAll("æ", "ae");

export type OverviewCountryId = "vietnam" | "china" | EuropeCountryId;
type VietnamOverviewProps = { country?: OverviewCountryId };

export const VietnamOverview = ({
  country = "vietnam",
}: VietnamOverviewProps) => {
  const europe = isEuropeCountry(country) ? europeOverviews[country] : undefined;
  // Việt Nam giữ bản đồ riêng; các nước còn lại dùng bản đồ theo khung
  const atlasMap = country !== "vietnam";
  const scenes = europe?.scenes
    ?? (country === "china" ? chinaOverview : vietnamOverview);
  const eras = [...new Set(scenes.map((scene) => scene.era))];
  const yearsByEra: Record<string, string> = europe?.eraYears
    ?? (country === "china" ? chinaEraYears : eraYears);
  const aliases = europe?.aliases
    ?? (country === "china" ? chinaSceneAliases : undefined);
  const heading = europe?.heading ?? (country === "china"
    ? "Lịch sử Trung Quốc — từ nhà Hạ đến hiện đại"
    : "Lịch sử Việt Nam — từ Hùng Vương đến hiện đại");
  const {
    index, scene, selectedPlace, setSelectedPlace,
    playing, setPlaying, playbackMs, setPlaybackMs,
    tab, changeTab, query, setQuery,
    contentVisible, setContentVisible, timelineVisible, setTimelineVisible,
    placesVisible, setPlacesVisible, rail, go,
  } = useVietnamOverview(scenes, aliases);
  if (!scene) return null;
  const snapshot = country === "china"
    ? chinaStateMaps[chinaMapIdFor(scene.id) ?? ""]
    : country === "england" ? englandStateMaps[scene.id] : undefined;
  const sceneFlag = country === "england" ? englandGeography[scene.id]?.flag : undefined;
  const eraIndex = eras.indexOf(scene.era);
  const eraScenes = scenes.filter((item) => item.era === scene.era);
  const search = normalize(query.trim());
  const matchingScenes = scenes.filter((item) => {
    const angloSaxon = country === "england" && item.year >= 410 && item.year < 1066;
    const terms = [item.era, item.title, ...item.people.map(({ name }) => name)];
    if (angloSaxon) {
      terms.push("Anglo-Saxon", ...item.places.map(({ name }) => name),
        ...(item.storySections ?? []).map(({ title }) => title));
    }
    return normalize(terms.join(" ")).includes(search);
  });
  const filteredEras = eras.filter((era) => matchingScenes.some((item) => item.era === era));
  const allHidden = !contentVisible && !timelineVisible && !placesVisible;
  const showVietnamFlag = country === "vietnam"
    && (scene.id === "cach-mang-1945" || scene.year > 1945);

  return <TooltipProvider delayDuration={250}><main className="atlas-page vo-page" data-country-id={country} data-scene-id={scene.id} data-content={contentVisible} data-timeline={timelineVisible} data-clean={allHidden}>
    <h1 className="vo-sr-only">{heading}</h1>
    {atlasMap ? (
      <ChinaHistoryMap
        key={`map-${scene.id}`}
        frameId={country}
        scene={scene}
        snapshot={snapshot}
        selectedPlace={selectedPlace}
        contentVisible={contentVisible}
        timelineVisible={timelineVisible}
        placesVisible={placesVisible}
        onSelectPlace={(next) => {
          setSelectedPlace(next);
          setPlacesVisible(true);
          setPlaying(false);
        }}
        onHidePlaces={() => setPlacesVisible(false)}
      />
    ) : (
      <HistoryMap
        key={`map-${scene.id}`}
        scene={scene}
        selectedPlace={selectedPlace}
        contentVisible={contentVisible}
        timelineVisible={timelineVisible}
        placesVisible={placesVisible}
        onSelectPlace={(next) => {
          setSelectedPlace(next);
          setPlacesVisible(true);
          setPlaying(false);
        }}
        onHidePlaces={() => setPlacesVisible(false)}
      />
    )}
    {!snapshot
      ? <CountryStats scene={scene} />
      : null}
    <HomeLink className="vo-back vo-glass" back />
    <div className="vo-header-links absolute top-5 left-[190px] z-6 flex items-center gap-3 max-[760px]:top-2.5 max-[760px]:left-[135px]">
      <Link className="vo-character-nav vo-glass" href="/characters">Nhân vật →</Link>
      {showVietnamFlag ? (
        <NationalFlag className="vo-national-flag shrink-0 rounded-sm" />
      ) : null}
    </div>
    <div className="vo-visibility" aria-label="Ẩn hiện các bảng trên bản đồ">
      <Button variant="atlas" size="atlas" type="button" className="vo-glass" aria-expanded={contentVisible} aria-controls="vo-content" onClick={() => setContentVisible((value) => !value)}><span>≋</span> Nội dung</Button>
      <Button variant="atlas" size="atlas" type="button" className="vo-glass" aria-expanded={placesVisible} aria-controls="vo-places" onClick={() => setPlacesVisible((value) => !value)}><span>⌖</span> Địa điểm</Button>
      <Button variant="atlas" size="atlas" type="button" className="vo-glass" aria-expanded={timelineVisible} aria-controls="vo-timeline" onClick={() => setTimelineVisible((value) => !value)}><span>◷</span> Timeline</Button>
      <Button variant="atlas" size="atlas" type="button" className="vo-glass vo-clean-view" aria-label={allHidden ? "Hiện các bảng" : "Ẩn tất cả, chỉ xem bản đồ"} aria-pressed={allHidden} onClick={() => { setContentVisible(allHidden); setTimelineVisible(allHidden); setPlacesVisible(false); }}>{allHidden ? "▦" : "⛶"}</Button>
    </div>
    <ContentPanel
      key={`content-${scene.id}`}
      country={country}
      scene={scene}
      snapshot={snapshot}
      chapter={eraIndex + 1}
      tab={tab}
      open={contentVisible}
      onTabChange={changeTab}
      onClose={() => setContentVisible(false)}
      onInteract={() => setPlaying(false)}
    />
    <Card role="region" id="vo-timeline" className="vo-timeline vo-glass" data-open={timelineVisible} inert={!timelineVisible} aria-label="Dòng thời gian lịch sử">
      <div className="vo-timeline-top"><div className="vo-transport" aria-label="Điều khiển các cảnh lịch sử"><Button variant="atlas" size="atlas" type="button" aria-label="Cảnh trước" disabled={index === 0} onClick={() => { setPlaying(false); go(index - 1); }}>←</Button><Button variant="atlas" size="atlas" type="button" className="vo-play-toggle" aria-label={playing ? "Tạm dừng tự chuyển cảnh" : index === scenes.length - 1 ? "Phát lại từ đầu" : `Tự chuyển cảnh sau mỗi ${playbackMs / 1000} giây`} aria-pressed={playing} onClick={() => { if (!playing && index === scenes.length - 1) go(0); setPlaying((value) => !value); }}>{playing ? "Ⅱ" : "▶"}</Button><Button variant="atlas" size="atlas" type="button" aria-label="Cảnh tiếp theo" disabled={index === scenes.length - 1} onClick={() => { setPlaying(false); go(index + 1); }}>→</Button><span className="vo-scene-counter">{String(index + 1).padStart(2, "0")} <i>/ {scenes.length}</i></span></div>
        {atlasMap ? (
          <div className="vo-dynasty-selector flex min-w-0 flex-1 items-center gap-2">
            <Select
              value={scene.id}
              onValueChange={(id) => {
                setPlaying(false);
                go(scenes.findIndex((item) => item.id === id));
              }}
            >
              <SelectTrigger
                className="china-dynasty-picker min-w-0 flex-1 text-xs max-[760px]:w-24"
                aria-label="Chọn triều đại hoặc mốc bản đồ"
              >
                <SelectValue>{scene.title} · {scene.years}</SelectValue>
              </SelectTrigger>
              <SelectContent className="vo-select-content" position="popper">
                {matchingScenes.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title} · {item.years}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {sceneFlag ? <EnglandSceneFlag flag={sceneFlag} /> : null}
          </div>
        ) : (
        <div className="vo-scene-picker" aria-label={`Các cảnh của ${scene.era}`}>{eraScenes.map((item, i) => <Button variant="atlas" size="atlas" key={item.id} type="button" aria-label={`Cảnh ${i + 1}: ${item.years}`} aria-pressed={scene.id === item.id} onClick={() => { setPlaying(false); go(scenes.indexOf(item)); }}><i />{eraScenes.length > 1 ? `Cảnh ${i + 1}` : scene.era}</Button>)}</div>
        )}
        <Select value={String(playbackMs)} onValueChange={(value) => setPlaybackMs(Number(value))}><SelectTrigger className="vo-speed-trigger" aria-label="Tốc độ chuyển cảnh"><SelectValue /></SelectTrigger><SelectContent className="vo-select-content" position="popper" align="end" collisionPadding={12}>{[3000, 6000, 10000, 15000].map((duration) => <SelectItem key={duration} value={String(duration)}>{duration / 1000}s</SelectItem>)}</SelectContent></Select>
        <label className={`vo-search ${atlasMap ? "max-[760px]:!hidden" : ""}`}><span aria-hidden="true">⌕</span><Input aria-label="Tìm thời kỳ hoặc nhân vật" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm triều đại, nhân vật…" /></label><Button variant="atlas" size="atlas" className="vo-timeline-close" type="button" aria-label="Ẩn timeline" onClick={() => setTimelineVisible(false)}>⌄</Button>
      </div>
      <div className="vo-timeline-track"><Button variant="atlas" size="atlas" type="button" className="vo-era-arrow" aria-label="Thời kỳ trước" disabled={eraIndex === 0} onClick={() => { setPlaying(false); go(scenes.findIndex((item) => item.era === eras[eraIndex - 1])); }}>‹</Button>
        <nav className="vo-era-rail" aria-label="Dòng thời gian các triều đại" ref={rail}><div className="vo-era-strip">
          {filteredEras.map((era, position) => {
            const first = matchingScenes.find((item) => item.era === era);
            if (!first) return null;
            const passed = eras.indexOf(era) < eraIndex;
            return (
              <Button
                variant="atlas"
                size="atlas"
                key={era}
                type="button"
                className={passed ? "is-past" : ""}
                style={{ "--era-delay": `${Math.min(position, 8) * 45}ms` } as CSSProperties}
                aria-current={scene.era === era ? "step" : undefined}
                onClick={() => {
                  setPlaying(false);
                  go(scenes.indexOf(first));
                }}
              >
                <span className="vo-era-date">{yearsByEra[era] ?? first.years}</span>
                <span className="vo-era-node">
                  <i /><b aria-hidden="true">{scene.era === era ? "✦" : passed ? "◆" : "◇"}</b>
                </span>
                <strong>{era}</strong>
              </Button>
            );
          })}
          {!filteredEras.length ? <p className="vo-no-results">Không tìm thấy. Thử từ khóa khác.</p> : null}
        </div></nav><Button variant="atlas" size="atlas" type="button" className="vo-era-arrow" aria-label="Thời kỳ tiếp theo" disabled={eraIndex === eras.length - 1} onClick={() => { setPlaying(false); go(scenes.findIndex((item) => item.era === eras[eraIndex + 1])); }}>›</Button>
      </div>
      <div className="vo-timeline-progress"><span style={{ width: `${(index + 1) / scenes.length * 100}%` }} /><i key={`${index}-${playing}-${playbackMs}`} style={{ animationDuration: `${playbackMs}ms` }} className={playing ? "is-playing" : ""} /></div>
    </Card>
    <CompactLink
      className="vo-map-credit"
      href="https://www.naturalearthdata.com/about/terms-of-use/"
      label="Natural Earth · Nền địa lý public domain, lược đồ gần đúng"
    />
  </main></TooltipProvider>;
};
