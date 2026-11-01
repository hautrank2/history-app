"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { TooltipProvider } from "~/components/ui/tooltip";
import { vietnamOverview } from "~/data/vietnam-overview";

import { NationalFlag } from "~/components/national-flag";

import { ContentPanel } from "./content-panel";
import { CountryStats } from "./country-stats";
import { HistoryMap } from "./history-map";
import { useVietnamOverview } from "./hook";
import "~/styles/vietnam-overview.css";
import "~/styles/vietnam-overview-content.css";

const eras = [...new Set(vietnamOverview.map((scene) => scene.era))];
const eraYears: Record<string, string> = { "Nhà Lý": "1009–1225", "Nhà Trần": "1225–1400", "Tây Sơn": "1771–1802", "Nhà Nguyễn": "1802–1945" };
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("đ", "d").replaceAll("Đ", "D").toLowerCase();

export const VietnamOverview = () => {
  const { index, scene, selectedPlace, setSelectedPlace, playing, setPlaying, playbackMs, setPlaybackMs, tab, changeTab, query, setQuery, contentVisible, setContentVisible, timelineVisible, setTimelineVisible, placesVisible, setPlacesVisible, rail, go } = useVietnamOverview();
  if (!scene) return null;
  const eraIndex = eras.indexOf(scene.era);
  const eraScenes = vietnamOverview.filter((item) => item.era === scene.era);
  const filteredEras = eras.filter((era) => normalize(vietnamOverview.filter((item) => item.era === era).map((item) => `${item.era} ${item.title} ${item.people.map((person) => person.name).join(" ")}`).join(" ")).includes(normalize(query)));
  const allHidden = !contentVisible && !timelineVisible && !placesVisible;

  return <TooltipProvider delayDuration={250}><main className="atlas-page vo-page" data-scene-id={scene.id} data-content={contentVisible} data-timeline={timelineVisible} data-clean={allHidden}>
    <h1 className="vo-sr-only">Lịch sử Việt Nam — từ Hùng Vương đến hiện đại</h1>
    <HistoryMap key={`map-${scene.id}`} scene={scene} selectedPlace={selectedPlace} contentVisible={contentVisible} timelineVisible={timelineVisible} placesVisible={placesVisible} onSelectPlace={(next) => { setSelectedPlace(next); setPlacesVisible(true); setPlaying(false); }} onHidePlaces={() => setPlacesVisible(false)} />
    <CountryStats scene={scene} />
    <Link className="vo-back vo-glass" href="/vietnam" aria-label="Về trang Việt Nam">← <NationalFlag /><span>Việt Nam</span></Link><Link className="vo-character-nav vo-glass" href="/characters">Nhân vật →</Link>
    <div className="vo-visibility" aria-label="Ẩn hiện các bảng trên bản đồ">
      <Button variant="atlas" size="atlas" type="button" className="vo-glass" aria-expanded={contentVisible} aria-controls="vo-content" onClick={() => setContentVisible((value) => !value)}><span>≋</span> Nội dung</Button>
      <Button variant="atlas" size="atlas" type="button" className="vo-glass" aria-expanded={placesVisible} aria-controls="vo-places" onClick={() => setPlacesVisible((value) => !value)}><span>⌖</span> Địa điểm</Button>
      <Button variant="atlas" size="atlas" type="button" className="vo-glass" aria-expanded={timelineVisible} aria-controls="vo-timeline" onClick={() => setTimelineVisible((value) => !value)}><span>◷</span> Timeline</Button>
      <Button variant="atlas" size="atlas" type="button" className="vo-glass vo-clean-view" aria-label={allHidden ? "Hiện các bảng" : "Ẩn tất cả, chỉ xem bản đồ"} aria-pressed={allHidden} onClick={() => { setContentVisible(allHidden); setTimelineVisible(allHidden); setPlacesVisible(false); }}>{allHidden ? "▦" : "⛶"}</Button>
    </div>
    <ContentPanel key={`content-${scene.id}`} scene={scene} chapter={eraIndex + 1} tab={tab} open={contentVisible} onTabChange={changeTab} onClose={() => setContentVisible(false)} onInteract={() => setPlaying(false)} />
    <Card role="region" id="vo-timeline" className="vo-timeline vo-glass" data-open={timelineVisible} inert={!timelineVisible} aria-label="Dòng thời gian lịch sử">
      <div className="vo-timeline-top"><div className="vo-transport" aria-label="Điều khiển các cảnh lịch sử"><Button variant="atlas" size="atlas" type="button" aria-label="Cảnh trước" disabled={index === 0} onClick={() => { setPlaying(false); go(index - 1); }}>←</Button><Button variant="atlas" size="atlas" type="button" className="vo-play-toggle" aria-label={playing ? "Tạm dừng tự chuyển cảnh" : index === vietnamOverview.length - 1 ? "Phát lại từ đầu" : `Tự chuyển cảnh sau mỗi ${playbackMs / 1000} giây`} aria-pressed={playing} onClick={() => { if (!playing && index === vietnamOverview.length - 1) go(0); setPlaying((value) => !value); }}>{playing ? "Ⅱ" : "▶"}</Button><Button variant="atlas" size="atlas" type="button" aria-label="Cảnh tiếp theo" disabled={index === vietnamOverview.length - 1} onClick={() => { setPlaying(false); go(index + 1); }}>→</Button><span className="vo-scene-counter">{String(index + 1).padStart(2, "0")} <i>/ {vietnamOverview.length}</i></span></div>
        <div className="vo-scene-picker" aria-label={`Các cảnh của ${scene.era}`}>{eraScenes.map((item, i) => <Button variant="atlas" size="atlas" key={item.id} type="button" aria-label={`Cảnh ${i + 1}: ${item.years}`} aria-pressed={scene.id === item.id} onClick={() => { setPlaying(false); go(vietnamOverview.indexOf(item)); }}><i />{eraScenes.length > 1 ? `Cảnh ${i + 1}` : scene.era}</Button>)}</div>
        <Select value={String(playbackMs)} onValueChange={(value) => setPlaybackMs(Number(value))}><SelectTrigger className="vo-speed-trigger" aria-label="Tốc độ chuyển cảnh"><SelectValue /></SelectTrigger><SelectContent className="vo-select-content" position="popper" align="end" collisionPadding={12}>{[3000, 6000, 10000, 15000].map((duration) => <SelectItem key={duration} value={String(duration)}>{duration / 1000}s</SelectItem>)}</SelectContent></Select>
        <label className="vo-search"><span aria-hidden="true">⌕</span><Input aria-label="Tìm thời kỳ hoặc nhân vật" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm triều đại, nhân vật…" /></label><Button variant="atlas" size="atlas" className="vo-timeline-close" type="button" aria-label="Ẩn timeline" onClick={() => setTimelineVisible(false)}>⌄</Button>
      </div>
      <div className="vo-timeline-track"><Button variant="atlas" size="atlas" type="button" className="vo-era-arrow" aria-label="Thời kỳ trước" disabled={eraIndex === 0} onClick={() => { setPlaying(false); go(vietnamOverview.findIndex((item) => item.era === eras[eraIndex - 1])); }}>‹</Button>
        <nav className="vo-era-rail" aria-label="Dòng thời gian các triều đại" ref={rail}><div className="vo-era-strip">
          {filteredEras.map((era, position) => { const firstIndex = vietnamOverview.findIndex((item) => item.era === era); const first = vietnamOverview[firstIndex]; const passed = eras.indexOf(era) < eraIndex; return <Button variant="atlas" size="atlas" key={era} type="button" className={passed ? "is-past" : ""} style={{ "--era-delay": `${Math.min(position, 8) * 45}ms` } as CSSProperties} aria-current={scene.era === era ? "step" : undefined} onClick={() => { setPlaying(false); go(firstIndex); }}><span className="vo-era-date">{eraYears[era] ?? first.years}</span><span className="vo-era-node"><i /><b aria-hidden="true">{scene.era === era ? "✦" : passed ? "◆" : "◇"}</b></span><strong>{era}</strong></Button>; })}
          {!filteredEras.length ? <p className="vo-no-results">Không tìm thấy. Thử từ khóa khác.</p> : null}
        </div></nav><Button variant="atlas" size="atlas" type="button" className="vo-era-arrow" aria-label="Thời kỳ tiếp theo" disabled={eraIndex === eras.length - 1} onClick={() => { setPlaying(false); go(vietnamOverview.findIndex((item) => item.era === eras[eraIndex + 1])); }}>›</Button>
      </div>
      <div className="vo-timeline-progress"><span style={{ width: `${(index + 1) / vietnamOverview.length * 100}%` }} /><i key={`${index}-${playing}-${playbackMs}`} style={{ animationDuration: `${playbackMs}ms` }} className={playing ? "is-playing" : ""} /></div>
    </Card>
    <a className="vo-map-credit" href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth · Lược đồ gần đúng ↗</a>
  </main></TooltipProvider>;
};
