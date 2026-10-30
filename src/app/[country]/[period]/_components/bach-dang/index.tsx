"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { StoryModel } from "~/types";

import { battlePlaces } from "./locations";
import { BattleMap } from "./map";
import { BattleMap3D } from "./map-3d";
import { useBattlePlayback } from "./use-battle-playback";

type BachDangExperienceProps = { story: StoryModel };
const chapterNames = ["Thế cục", "Giặc đến", "Đứt lương", "Rút quân", "Bày trận", "Triều rút", "Khải hoàn"];

export const BachDangExperience = ({ story }: BachDangExperienceProps) => {
  const { active, playing, seconds, setSeconds, jump, togglePlaying } = useBattlePlayback({ total: story.chapters.length });
  const [mapMode, setMapMode] = useState<"3d" | "2d">("3d");
  const [selectedPlace, setSelectedPlace] = useState("Bạch Đằng");
  const changeMapMode = (mode: "3d" | "2d") => {
    setMapMode(mode);
  };

  return (
    <main className="bd-experience bd-map-first">
      <header className="bd-header">
        <Link className="bd-brand" href="/"><span className="bd-brand-symbol">H</span><span>HISTORY ATLAS<small>DẤU ẤN NGÀN NĂM</small></span></Link>
        <h1 id="battle-title" className="bd-battle-title">Bạch Đằng <span>1288</span></h1>
      </header>

      <section id="story" className="bd-story" aria-label="Diễn biến trận chiến">
        <div className="bd-story-layout">
          <div className="bd-map-panel" aria-label="Bản đồ chiến thuật">
            <div className="bd-map-top"><span><i /> BẢN ĐỒ CHIẾN THUẬT</span><div className="bd-map-mode" role="group" aria-label="Chế độ bản đồ"><button aria-pressed={mapMode === "3d"} onClick={() => changeMapMode("3d")}>3D</button><button aria-pressed={mapMode === "2d"} onClick={() => changeMapMode("2d")}>2D</button></div></div>
            {mapMode === "3d" ? <BattleMap3D stage={active} selected={selectedPlace} onSelect={setSelectedPlace} /> : <BattleMap stage={active} selected={selectedPlace} onSelect={setSelectedPlace} />}
            <div className="bd-map-info"><span>ĐỊA ĐIỂM ĐANG XEM</span><strong>{selectedPlace}</strong><p>{battlePlaces.find((place) => place.name === selectedPlace)?.description}</p></div>
            <div className="bd-map-legend"><span><i /> Đại Việt</span><span><i /> Quân Nguyên</span><span>× Bãi cọc</span><span>Bản đồ minh họa</span></div>
            <div className="bd-playback" aria-label="Điều khiển trận chiến"><div className="bd-playback-buttons"><button onClick={() => jump(active - 1)} disabled={active === 0} aria-label="Chương trước">← <span>Trước</span></button><button className="bd-play-button" onClick={togglePlaying} aria-pressed={playing}>{playing ? "Ⅱ Tạm dừng" : active === story.chapters.length - 1 ? "↻ Phát lại" : "▶ Tự phát"}</button><button onClick={() => jump(active + 1)} disabled={active === story.chapters.length - 1} aria-label="Chương tiếp"><span>Tiếp</span> →</button></div><div className="bd-playback-caption"><span aria-live="polite">{playing ? "Đang tự phát" : "Đọc theo nhịp của bạn"} · {active + 1}/{story.chapters.length}</span><label><span className="sr-only">Thời gian mỗi chương</span><select value={seconds} onChange={(event) => setSeconds(Number(event.target.value))}><option value={2}>Nhanh · 2 giây</option><option value={4}>Vừa · 4 giây</option><option value={8}>Chậm · 8 giây</option></select></label></div><div className="bd-playback-progress">{playing ? <span key={`${active}-${seconds}-${playing}`} style={{ animationDuration: `${seconds}s` }} /> : null}</div></div>
            <nav className="bd-chapter-dots" aria-label="Chọn chương">{chapterNames.map((name, i) => <button key={name} onClick={() => jump(i)} aria-label={`Chương ${i + 1}: ${name}`} aria-current={active === i ? "step" : undefined} className={active === i ? "is-active" : ""}><span>{String(i + 1).padStart(2, "0")}</span><small>{name}</small></button>)}</nav>
          </div>
          <aside className="bd-chapters" aria-label="Kịch bản trận chiến"><div className="bd-script-heading">KỊCH BẢN <span>{active + 1} / {story.chapters.length}</span></div>{story.chapters.map((chapter, i) => <article key={chapter.title} id={`chapter-${i + 1}`} data-chapter={i} hidden={active !== i} className={`bd-chapter ${active === i ? "is-active" : ""}`}>
            <div className="bd-chapter-meta"><span>CHƯƠNG {String(i + 1).padStart(2, "0")}</span><span>{chapter.date}</span></div>
            <h3>{chapter.title}<span>.</span></h3><p>{chapter.text}</p>
            {i === 4 || i === 5 ? <div className="bd-tide"><div><span>NHỊP THỦY TRIỀU</span><strong>{i === 4 ? "Nước lên · giấu trận địa" : "Nước rút · lộ bãi cọc"}</strong></div><svg viewBox="0 0 240 45" role="img" aria-label={i === 4 ? "Minh họa triều lên" : "Minh họa triều xuống"}><path d={i === 4 ? "M0 38 Q60 38 100 15 T240 8" : "M0 8 Q70 8 120 30 T240 38"} fill="none" stroke="currentColor" strokeWidth="2" /></svg></div> : null}
            <div className="bd-chapter-people">{chapter.characters?.map((person) => <span key={person.name} data-side={person.side} className={`bd-person-card bd-commander-${person.portrait ?? "unknown"}`}>{person.portrait ? <span className="bd-pin-portrait"><Image src={person.portrait === "tran-hung-dao" ? "/images/bach-dang-cinematic.png" : "/images/yuan-commanders.png"} alt="" fill sizes="256px" quality={90} /></span> : <i />}<span>{person.name}<small>{person.role}</small></span></span>)}</div>
            <span className="bd-chapter-index">{String(i + 1).padStart(2, "0")}</span>
          </article>)}</aside>
        </div>
      </section>

      <footer className="bd-footer"><Link className="bd-brand" href="/vietnam">SỬ VIỆT <span> / HISTORY ATLAS</span></Link><p>{story.note} Hình ảnh là tái hiện nghệ thuật; sa bàn minh họa chiến dịch, không theo tỉ lệ địa lý.</p><span>BẠCH ĐẰNG · 1288</span></footer>
    </main>
  );
};
