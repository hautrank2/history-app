"use client";

import Link from "next/link";
import { useState } from "react";

import { Image } from "@/components/ui/image";
import { HomeLink } from "~/components/home-link";
import { RootLink } from "~/components/root-link";
import { NationalFlag } from "~/components/national-flag";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { battlePortraitFor, characterHref } from "~/data/characters";
import { vietnamBattlePeriod } from "~/data/vietnam-battles";
import type { VietnamBattleModel } from "~/data/vietnam-battles";
import type { StoryModel } from "~/types";

import { CampaignMap } from "./campaign-map";
import { battlePlaces } from "./locations";
import { BattleMap } from "./map";
import { BattleMap3D } from "./map-3d";
import { useBattlePlayback } from "./use-battle-playback";

type BachDangExperienceProps = {
  story: StoryModel;
  battle?: VietnamBattleModel;
};
const chapterNames = ["Thế cục", "Giặc đến", "Đứt lương", "Rút quân", "Bày trận", "Triều rút", "Khải hoàn"];

export const BachDangExperience = ({ story, battle }: BachDangExperienceProps) => {
  const { active, playing, seconds, setSeconds, jump, togglePlaying } =
    useBattlePlayback({ total: story.chapters.length });
  const [mapMode, setMapMode] = useState<"3d" | "2d">("3d");
  const [selectedPlace, setSelectedPlace] = useState(
    battle?.places.find((place) => place.id === battle.chapters[0]?.placeIds[0])?.name
      ?? "Bạch Đằng",
  );
  const period = battle ? vietnamBattlePeriod(battle) : undefined;
  const title = battle?.title ?? "Bạch Đằng";
  const years = battle?.years ?? "1288";
  const chapterLabels = battle
    ? battle.chapters.map((chapter) => chapter.title)
    : chapterNames;
  const places = battle
    ? battle.places.map((place) => ({ ...place, description: place.note }))
    : battlePlaces;

  return (
    <main className="bd-experience bd-map-first">
      <header className="bd-header">
        <RootLink />
        <Link className="bd-brand" href="/#battles">
          <span className="bd-brand-symbol">H</span>
          <span>HISTORY ATLAS<small>DẤU ẤN NGÀN NĂM</small></span>
        </Link>
        <nav className="bd-page-navigation" aria-label="Điều hướng lịch sử">
          <HomeLink section="battles" />
          <Link href={`/vietnam#${battle?.sceneId ?? "tran-bach-dang"}`}><NationalFlag /> Việt Nam</Link>
          <Link href={`${period?.href ?? "/period/nha-tran"}#${battle?.sceneId ?? "tran-bach-dang"}`}>
            {period?.title ?? "Nhà Trần"}
          </Link>
          <Link href="/battle#battle-vietnam">Trận đánh</Link>
        </nav>
        <h1 id="battle-title" className="bd-battle-title">{title} <span>{years}</span></h1>
      </header>

      <section id="story" className="bd-story" aria-label="Diễn biến trận chiến">
        <div className="bd-story-layout">
          <div className="bd-map-panel" aria-label="Bản đồ chiến thuật">
            <div className="bd-map-top">
              <span><i /> BẢN ĐỒ CHIẾN THUẬT</span>
              {battle ? <span>2D · ĐỊNH VỊ DIỄN BIẾN</span> : (
                <div className="bd-map-mode" role="group" aria-label="Chế độ bản đồ">
                  <button aria-pressed={mapMode === "3d"} onClick={() => setMapMode("3d")}>3D</button>
                  <button aria-pressed={mapMode === "2d"} onClick={() => setMapMode("2d")}>2D</button>
                </div>
              )}
            </div>
            <div className="bd-map-canvas relative">
              {battle ? (
                <CampaignMap battle={battle} stage={active} selected={selectedPlace} onSelect={setSelectedPlace} />
              ) : mapMode === "3d" ? (
                <BattleMap3D stage={active} selected={selectedPlace} onSelect={setSelectedPlace} />
              ) : <BattleMap stage={active} selected={selectedPlace} onSelect={setSelectedPlace} />}
            </div>
            {battle ? (
              <nav className="bd-campaign-places flex flex-wrap gap-2 py-2" aria-label="Danh sách địa điểm chiến dịch">
                {places.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    className="rounded border border-border px-3 py-2 text-xs text-primary aria-pressed:bg-accent"
                    aria-pressed={selectedPlace === place.name}
                    onClick={() => setSelectedPlace(place.name)}
                  >
                    {place.name}
                  </button>
                ))}
                <p className="w-full text-sm text-muted-foreground" aria-live="polite">
                  {selectedPlace} · {places.find((place) => place.name === selectedPlace)?.description}
                </p>
              </nav>
            ) : null}
            {!battle ? <div className="bd-map-info">
              <span>ĐỊA ĐIỂM ĐANG XEM</span><strong>{selectedPlace}</strong>
              <p>{places.find((place) => place.name === selectedPlace)?.description}</p>
            </div> : null}
            <div className="bd-map-legend">
              <span><i /> {story.sides.home}</span><span><i /> {story.sides.enemy}</span>
              {battle ? <span>● Địa điểm của chặng đang xem</span> : <span>× Bãi cọc</span>}
              <span>Bản đồ minh họa</span>
            </div>
            <div className="bd-playback" aria-label="Điều khiển trận chiến">
              <div className="bd-playback-buttons">
                <button onClick={() => jump(active - 1)} disabled={active === 0} aria-label="Chương trước">← <span>Trước</span></button>
                <button className="bd-play-button" onClick={togglePlaying} aria-pressed={playing}>
                  {playing ? "Ⅱ Tạm dừng" : active === story.chapters.length - 1 ? "↻ Phát lại" : "▶ Tự phát"}
                </button>
                <button onClick={() => jump(active + 1)} disabled={active === story.chapters.length - 1} aria-label="Chương tiếp"><span>Tiếp</span> →</button>
              </div>
              <div className="bd-playback-caption">
                <span aria-live="polite">{playing ? "Đang tự phát" : "Đọc theo nhịp của bạn"} · {active + 1}/{story.chapters.length}</span>
                <Select value={String(seconds)} onValueChange={(value) => setSeconds(Number(value))}>
                  <SelectTrigger className="bd-speed-trigger w-36" aria-label="Thời gian mỗi chương"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Nhanh · 2 giây</SelectItem>
                    <SelectItem value="4">Vừa · 4 giây</SelectItem>
                    <SelectItem value="8">Chậm · 8 giây</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bd-playback-progress">
                {playing ? <span key={`${active}-${seconds}`} style={{ animationDuration: `${seconds}s` }} /> : null}
              </div>
            </div>
            <nav className="bd-chapter-dots" aria-label="Chọn chương">
              {chapterLabels.map((name, index) => (
                <button key={name} onClick={() => jump(index)} aria-label={`Chương ${index + 1}: ${name}`} aria-current={active === index ? "step" : undefined} className={active === index ? "is-active" : ""}>
                  <span>{String(index + 1).padStart(2, "0")}</span><small>{name}</small>
                </button>
              ))}
            </nav>
          </div>
          <aside className="bd-chapters" aria-label="Kịch bản trận chiến">
            <div className="bd-script-heading">KỊCH BẢN <span>{active + 1} / {story.chapters.length}</span></div>
            {story.chapters.map((chapter, index) => (
              <article key={chapter.title} id={`chapter-${index + 1}`} data-chapter={index} hidden={active !== index} className={`bd-chapter ${active === index ? "is-active" : ""}`}>
                <div className="bd-chapter-meta"><span>CHƯƠNG {String(index + 1).padStart(2, "0")}</span><span>{chapter.date}</span></div>
                <h3>{chapter.title}<span>.</span></h3><p>{chapter.text}</p>
                {!battle && (index === 4 || index === 5) ? (
                  <div className="bd-tide">
                    <div><span>NHỊP THỦY TRIỀU</span><strong>{index === 4 ? "Nước lên · giấu trận địa" : "Nước rút · lộ bãi cọc"}</strong></div>
                    <svg viewBox="0 0 240 45" role="img" aria-label={index === 4 ? "Minh họa triều lên" : "Minh họa triều xuống"}>
                      <path d={index === 4 ? "M0 38 Q60 38 100 15 T240 8" : "M0 8 Q70 8 120 30 T240 38"} fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                ) : null}
                <div className="bd-chapter-people">
                  {chapter.characters?.map((person) => (
                    <Link href={characterHref(person.id)} key={person.id} data-character-id={person.id} data-side={person.side} className={`bd-person-card h-full bd-commander-${person.portrait ?? "unknown"}`}>
                      {person.portrait ? (
                        <span className="bd-pin-portrait"><Image preview={false} src={battlePortraitFor(person.name)?.src ?? ""} alt="" fill sizes="256px" quality={90} /></span>
                      ) : <i />}
                      <span>{person.name}<small>{person.role}</small></span>
                    </Link>
                  ))}
                </div>
                {battle ? (
                  <nav className="bd-chapter-sources mt-6 space-y-2 border-t border-border pt-4" aria-label="Nguồn tư liệu trận đánh">
                    {battle.sources.map((source) => <a className="block text-xs leading-relaxed text-primary hover:underline" key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}
                  </nav>
                ) : null}
                <span className="bd-chapter-index">{String(index + 1).padStart(2, "0")}</span>
              </article>
            ))}
          </aside>
        </div>
      </section>
      <footer className="bd-footer">
        <Link className="bd-brand" href={`/vietnam#${battle?.sceneId ?? "tran-bach-dang"}`}>SỬ VIỆT <span> / HISTORY ATLAS</span></Link>
        <p>{story.note} Sa bàn minh họa, không dùng xác định ranh giới lịch sử.</p>
        <span>{title} · {years}</span>
      </footer>
    </main>
  );
};
