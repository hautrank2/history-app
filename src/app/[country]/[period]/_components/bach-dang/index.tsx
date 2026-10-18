"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { StoryModel } from "~/types";

import { BattleMap } from "./map";
import { BattleMap3D } from "./map-3d";
import { useBattlePlayback } from "./use-battle-playback";

type BachDangExperienceProps = { story: StoryModel };
const chapterNames = ["Thế cục", "Giặc đến", "Đứt lương", "Rút quân", "Bày trận", "Triều rút", "Khải hoàn"];

export const BachDangExperience = ({ story }: BachDangExperienceProps) => {
  const { active, playing, seconds, setSeconds, progress, sections, jump, togglePlaying } = useBattlePlayback({ total: story.chapters.length });
  const [mapMode, setMapMode] = useState<"3d" | "2d">("3d");
  const [selectedPlace, setSelectedPlace] = useState("Bạch Đằng");
  const changeMapMode = (mode: "3d" | "2d") => {
    setMapMode(mode);
    // Re-align after the map changes height so scroll tracking keeps the same chapter.
    window.requestAnimationFrame(() => jump(active));
  };

  return (
    <main className="bd-experience">
      <header className="bd-header">
        <Link className="bd-brand" href="/"><span className="bd-brand-symbol">H</span><span>HISTORY ATLAS<small>DẤU ẤN NGÀN NĂM</small></span></Link>
        <nav aria-label="Điều hướng chính"><a href="#story">Diễn biến</a><a href="#commander">Danh tướng</a><a href="#legacy">Di sản</a></nav>
        <span className="bd-edition">BIÊN NIÊN SỬ <span>—</span> 01</span>
        <div className="bd-reading-progress" style={{ width: `${progress * 100}%` }} />
      </header>

      <section className="bd-hero" aria-labelledby="battle-title">
        <Image src="/images/bach-dang-cinematic.png" alt="Minh họa Trần Hưng Đạo trước dòng Bạch Đằng, thuyền chiến và núi đá trong sương" fill priority sizes="100vw" className="bd-hero-image" />
        <div className="bd-hero-shade" />
        <div className="bd-hero-content">
          <p className="bd-eyebrow"><span /> ĐẠI VIỆT · THỜI TRẦN</p>
          <p className="bd-hero-pretitle">Một dòng sông. Một kỳ tích.</p>
          <h1 id="battle-title">Bạch Đằng<span>1288</span></h1>
          <p className="bd-hero-description">Khi con nước trở thành vũ khí.<br />Và trí tuệ làm nên một trang sử bất diệt.</p>
          <a className="bd-primary-button" href="#story">Bước vào trận chiến <span>↗</span></a>
          <div className="bd-hero-facts"><div><strong>09.04</strong><span>NĂM 1288</span></div><i /><div><strong>Bạch Đằng</strong><span>CHIẾN TRƯỜNG SÔNG NƯỚC</span></div><i /><div><strong>Nhà Trần</strong><span>HÀO KHÍ ĐÔNG A</span></div></div>
        </div>
        <span className="bd-hero-side">ĐỊA LINH · NHÂN KIỆT · SỬ THI</span>
        <div className="bd-hero-bottom"><a href="#story"><span className="bd-scroll-icon">↓</span> CUỘN ĐỂ KHÁM PHÁ</a><span>TRẬN CHIẾN THAY ĐỔI LỊCH SỬ <b>01 / 01</b></span></div>
      </section>

      <section id="story" className="bd-story" aria-label="Diễn biến trận chiến">
        <div className="bd-story-heading"><div><p className="bd-eyebrow">THEO DÒNG LỊCH SỬ</p><h2>Bảy bước đến <em>chiến thắng.</em></h2></div><p>Cuộn qua từng chương.<br />Theo dấu thế trận trên dòng sông.</p></div>
        <div className="bd-story-layout">
          <aside className="bd-map-panel">
            <div className="bd-map-top"><span><i /> BẢN ĐỒ CHIẾN THUẬT</span><div className="bd-map-mode" role="group" aria-label="Chế độ bản đồ"><button aria-pressed={mapMode === "3d"} onClick={() => changeMapMode("3d")}>3D</button><button aria-pressed={mapMode === "2d"} onClick={() => changeMapMode("2d")}>Sơ đồ</button></div></div>
            {mapMode === "3d" ? <BattleMap3D stage={active} selected={selectedPlace} onSelect={setSelectedPlace} /> : <BattleMap stage={active} selected={selectedPlace} onSelect={setSelectedPlace} />}
            <div className="bd-map-info"><span>ĐỊA ĐIỂM ĐANG XEM</span><strong>{selectedPlace}</strong><p>{selectedPlace === "Bạch Đằng" ? "Dòng sông quyết chiến · cửa ngõ ra biển" : selectedPlace === "Tràng Kênh" ? "Núi đá và hai bờ sông · nơi bố trí phục binh" : selectedPlace === "Yên Giang" ? "Khu vực bãi cọc · trận địa ngăn thuyền" : selectedPlace === "Vạn Kiếp" ? "Căn cứ quân Nguyên · điểm khởi đầu rút quân" : "Đoàn thuyền lương bị đánh tan · bước ngoặt chiến dịch"}</p></div>
            <div className="bd-map-legend"><span><i /> Đại Việt</span><span><i /> Quân Nguyên</span><span>× Bãi cọc</span><span>Bản đồ minh họa</span></div>
            <div className="bd-playback" aria-label="Điều khiển trận chiến"><div className="bd-playback-buttons"><button onClick={() => jump(active - 1)} disabled={active === 0} aria-label="Chương trước">← <span>Trước</span></button><button className="bd-play-button" onClick={togglePlaying} aria-pressed={playing}>{playing ? "Ⅱ Tạm dừng" : active === story.chapters.length - 1 ? "↻ Phát lại" : "▶ Tự phát"}</button><button onClick={() => jump(active + 1)} disabled={active === story.chapters.length - 1} aria-label="Chương tiếp"><span>Tiếp</span> →</button></div><div className="bd-playback-caption"><span aria-live="polite">{playing ? "Đang tự phát" : "Đọc theo nhịp của bạn"} · {active + 1}/{story.chapters.length}</span><label><span className="sr-only">Thời gian mỗi chương</span><select value={seconds} onChange={(event) => setSeconds(Number(event.target.value))}><option value={12}>12 giây/chương</option><option value={20}>20 giây/chương</option><option value={30}>30 giây/chương</option></select></label></div><div className="bd-playback-progress">{playing ? <span key={`${active}-${seconds}`} style={{ animationDuration: `${seconds}s` }} /> : null}</div></div>
            <nav className="bd-chapter-dots" aria-label="Chọn chương">{chapterNames.map((name, i) => <button key={name} onClick={() => jump(i)} aria-label={`Chương ${i + 1}: ${name}`} aria-current={active === i ? "step" : undefined} className={active === i ? "is-active" : ""}><span>{String(i + 1).padStart(2, "0")}</span><small>{name}</small></button>)}</nav>
          </aside>
          <div className="bd-chapters">{story.chapters.map((chapter, i) => <article key={chapter.title} id={`chapter-${i + 1}`} data-chapter={i} ref={(element) => { sections.current[i] = element; }} className={`bd-chapter ${active === i ? "is-active" : ""}`}>
            <div className="bd-chapter-meta"><span>CHƯƠNG {String(i + 1).padStart(2, "0")}</span><span>{chapter.date}</span></div>
            <h3>{chapter.title}<span>.</span></h3><p>{chapter.text}</p>
            {i === 4 || i === 5 ? <div className="bd-tide"><div><span>NHỊP THỦY TRIỀU</span><strong>{i === 4 ? "Nước lên · giấu trận địa" : "Nước rút · lộ bãi cọc"}</strong></div><svg viewBox="0 0 240 45" role="img" aria-label={i === 4 ? "Minh họa triều lên" : "Minh họa triều xuống"}><path d={i === 4 ? "M0 38 Q60 38 100 15 T240 8" : "M0 8 Q70 8 120 30 T240 38"} fill="none" stroke="currentColor" strokeWidth="2" /></svg></div> : null}
            <div className="bd-chapter-people">{chapter.characters?.map((person) => <span key={person.name} data-side={person.side} className={`bd-person-card bd-commander-${person.portrait ?? "unknown"}`}>{person.portrait ? <span className="bd-pin-portrait"><Image src={person.portrait === "tran-hung-dao" ? "/images/bach-dang-cinematic.png" : "/images/yuan-commanders.png"} alt="" fill sizes="48px" /></span> : <i />}<span>{person.name}<small>{person.role}</small></span></span>)}</div>
            <span className="bd-chapter-index">{String(i + 1).padStart(2, "0")}</span>
          </article>)}</div>
        </div>
      </section>

      <section id="commander" className="bd-commander"><div className="bd-portrait"><Image src="/images/bach-dang-cinematic.png" alt="Chân dung minh họa Trần Hưng Đạo với giáp trụ thời Trần" fill sizes="(max-width: 760px) 100vw, 45vw" /><span>CHÂN DUNG MINH HỌA · TÁI HIỆN NGHỆ THUẬT</span></div><div className="bd-commander-copy"><p className="bd-eyebrow">LINH HỒN CỦA THẾ TRẬN</p><h2>Trần<br /><em>Hưng Đạo.</em></h2><span className="bd-commander-role">QUỐC CÔNG TIẾT CHẾ · TRẦN QUỐC TUẤN</span><p>Hiểu dòng sông, nắm con nước, đoán đường lui của đối phương. Ông biến địa thế Bạch Đằng thành một thế trận mà sức mạnh của chiến thuyền cũng không thể vượt qua.</p><div className="bd-commander-traits"><span>01 <b>Địa lợi</b></span><span>02 <b>Thiên thời</b></span><span>03 <b>Nhân hòa</b></span></div></div></section>

      <section id="legacy" className="bd-legacy"><p className="bd-eyebrow">DƯ ÂM MỘT CHIẾN THẮNG</p><h2>Sóng nước qua đi.<br /><em>Hào khí còn mãi.</em></h2><p>Chiến thắng Bạch Đằng khép lại cuộc kháng chiến chống Nguyên lần thứ ba, ghi dấu nghệ thuật quân sự và ý chí giữ nước của Đại Việt.</p><a href="#battle-title" className="bd-text-link">Trở lại đầu câu chuyện ↑</a></section>
      <footer className="bd-footer"><Link className="bd-brand" href="/vietnam">SỬ VIỆT <span> / HISTORY ATLAS</span></Link><p>{story.note} Hình ảnh là tái hiện nghệ thuật; bản đồ sơ đồ không theo tỉ lệ.</p><span>BẠCH ĐẰNG · 1288</span></footer>
    </main>
  );
};
