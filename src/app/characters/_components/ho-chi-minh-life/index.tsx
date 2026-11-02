"use client";

import { ArrowLeft, ArrowRight, BookOpen, Check, ExternalLink, MapPin, Maximize2, Pause, Play, Search, Share2, Users, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ImageGroup } from "@/components/ui/image";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { getCharacter } from "~/data/characters";
import { lifeChapters, lifeScenes, lifeSources, matchesLifeScene, relationLabels } from "~/data/ho-chi-minh";
import { portraitCaption, portraitFor } from "~/data/portraits";

import { JourneyMap } from "./journey-map";
import { LifePortrait } from "./portrait";
import { useLifeMapUrl } from "./use-life-map-url";
import "~/styles/ho-chi-minh-life.css";

type ReadingTab = "story" | "people" | "sources";

export const HoChiMinhLife = () => {
  const { state: mapState, update: updateMap, shareUrl } = useLifeMapUrl();
  const index = Math.max(0, lifeScenes.findIndex((scene) => scene.id === mapState.stop));
  const [tab, setTab] = useState<ReadingTab>("story");
  const [playing, setPlaying] = useState(false);
  const query = mapState.q;
  const setQuery = (q: string) => updateMap({ q });
  const reading = mapState.view === "story";
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "manual">("idle");
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const scene = lifeScenes[index];
  const portrait = portraitFor(getCharacter("ho-chi-minh").wiki);
  const go = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(lifeScenes.length - 1, next));
    updateMap((previous) => ({ stop: lifeScenes[bounded].id, ...(previous.map === "focus" ? { camera: { zoom: 1, x: 0, y: 0 } } : {}) }));
    setSelectedPerson(null);
  }, [updateMap]);
  const choose = (next: number) => { setPlaying(false); go(next); };
  useEffect(() => {
    const pause = () => setPlaying(false);
    window.addEventListener("popstate", pause); window.addEventListener("hashchange", pause);
    return () => { window.removeEventListener("popstate", pause); window.removeEventListener("hashchange", pause); };
  }, []);
  useEffect(() => {
    if (shareStatus !== "copied") return;
    const timer = setTimeout(() => setShareStatus("idle"), 2500);
    return () => clearTimeout(timer);
  }, [shareStatus]);
  const copyShareUrl = async () => {
    try { await navigator.clipboard.writeText(shareUrl()); setShareStatus("copied"); }
    catch { setShareStatus("manual"); }
  };
  useEffect(() => {
    rail.current?.querySelector<HTMLElement>("[aria-current=step]")?.scrollIntoView({ block: "nearest", inline: "center", behavior: "instant" });
  }, [index]);
  useEffect(() => {
    if (!selectedPerson || tab !== "people") return;
    document.querySelector<HTMLElement>(`.hcm-person-card[data-character-id="${selectedPerson}"]`)?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [selectedPerson, tab]);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => { if (index < lifeScenes.length - 1) go(index + 1); else setPlaying(false); }, 14000);
    const pause = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", pause);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", pause); };
  }, [go, index, playing]);
  const showPerson = (id: string) => { setPlaying(false); setSelectedPerson(id); setTab("people"); updateMap({ view: "story" }); };
  const filtered = lifeScenes.map((item, sceneIndex) => ({ item, sceneIndex })).filter(({ item }) => matchesLifeScene(item, query));
  const sceneSources = lifeSources.filter((source) => scene.sourceIds.includes(source.id));

  return <main className="hcm-life" data-character-id="ho-chi-minh" data-scene-id={scene.id} data-reading={reading} onKeyDown={(event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLElement && event.target.closest("input, textarea, [role=combobox], [role=dialog], .hcm-map-stage, .hcm-timeline-rail")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); choose(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); choose(index - 1); }
  }}>
    <header className="hcm-header">
      <Link className="hcm-back" href="/characters"><ArrowLeft size={16} /><span>Nhân vật</span></Link>
      <div className="hcm-heading"><span className="hcm-header-portrait"><LifePortrait characterId="ho-chi-minh" /></span><div><p>CHỦ TỊCH HỒ CHÍ MINH · 1890–1969</p><h1>Một cuộc đời vì non sông</h1><span>Theo dấu hành trình · Hiểu con người · Đọc bối cảnh thế giới</span></div></div>
      <nav className="hcm-header-actions" aria-label="Điều hướng chuyên trang"><Link href="/vietnam/overview">Tổng quan Việt Nam<ExternalLink size={14} /></Link><button type="button" aria-pressed={!reading} aria-label={reading ? "Xem toàn bộ bản đồ hành trình" : "Mở câu chuyện của mốc đang chọn"} onClick={() => { updateMap({ view: reading ? "map" : "story" }); setPlaying(false); }}><Maximize2 size={16} /><span>{reading ? "Toàn bộ bản đồ" : "Mở câu chuyện"}</span></button><button className="hcm-share-button" type="button" onClick={copyShareUrl} aria-label="Sao chép liên kết bản đồ"><Share2 size={16} /><span>{shareStatus === "copied" ? "Đã sao chép" : "Chia sẻ bản đồ"}</span></button></nav>
      {shareStatus === "manual" ? <div className="hcm-share-fallback"><label htmlFor="hcm-share-url">Sao chép liên kết này để chia sẻ đúng bản đồ đang xem</label><Input id="hcm-share-url" readOnly value={shareUrl()} onFocus={(event) => event.target.select()} /><button type="button" aria-label="Đóng liên kết chia sẻ" onClick={() => setShareStatus("idle")}><X size={16} /></button></div> : null}
    </header>
    <div className="hcm-experience">
      <aside className="hcm-reader" aria-label="Câu chuyện cuộc đời" hidden={!reading}>
        <div className="hcm-scene-heading"><p>{scene.chapter}<span>{String(index + 1).padStart(2, "0")} / {lifeScenes.length}</span></p><div className="hcm-scene-date">{scene.date}</div><h2>{scene.title}</h2><span className="hcm-scene-place"><MapPin size={14} />{scene.location.name} · {scene.location.country}</span></div>
        <div className="hcm-reading-tabs" role="tablist" aria-label="Nội dung mốc cuộc đời">{([{ id: "story", label: "Câu chuyện", icon: <BookOpen size={14} /> }, { id: "people", label: `Nhân vật (${scene.people.length})`, icon: <Users size={14} /> }, { id: "sources", label: "Tư liệu", icon: <ExternalLink size={13} /> }] as const).map((item) => <button type="button" key={item.id} id={`hcm-tab-${item.id}`} role="tab" aria-selected={tab === item.id} aria-controls={`hcm-panel-${item.id}`} tabIndex={tab === item.id ? 0 : -1} onClick={() => { setTab(item.id); setPlaying(false); }} onKeyDown={(event) => {
          const tabs: ReadingTab[] = ["story", "people", "sources"];
          if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
          event.preventDefault(); event.stopPropagation();
          const next = event.key === "Home" ? "story" : event.key === "End" ? "sources" : tabs[(tabs.indexOf(tab) + (event.key === "ArrowRight" ? 1 : 2)) % tabs.length];
          setTab(next); setPlaying(false); document.getElementById(`hcm-tab-${next}`)?.focus();
        }}>{item.icon}{item.label}</button>)}</div>
        <div className="hcm-reading-body" key={`${scene.id}-${tab}`} id={`hcm-panel-${tab}`} role="tabpanel" aria-labelledby={`hcm-tab-${tab}`} tabIndex={0} onPointerDown={() => setPlaying(false)} onWheel={() => setPlaying(false)}>
          {tab === "story" ? <>
            <div className="hcm-identity"><span className="hcm-identity-icon"><MapPin size={18} /></span><div><small>BÁC Ở ĐÂU, MANG TÊN GÌ?</small><strong>{scene.name}</strong><span>{scene.location.name} · {scene.date}</span></div></div>
            <p className="hcm-story-summary">{scene.summary}</p>
            <section className="hcm-meaning"><h3>Dấu mốc của một cuộc đời</h3><p>{scene.meaning}</p></section>
            {scene.people.length ? <section className="hcm-people-preview"><h3>Những người trong bối cảnh này</h3><div>{scene.people.map((person) => <button type="button" key={person.characterId} data-character-id={person.characterId} data-relation={person.kind} onClick={() => showPerson(person.characterId)}><span className="hcm-actor-mini"><LifePortrait characterId={person.characterId} /></span><span><strong>{getCharacter(person.characterId).name}</strong><small>{relationLabels[person.kind]}</small></span><ArrowRight size={14} /></button>)}</div></section> : null}
            <section className="hcm-context-note"><h3>Đọc cùng bối cảnh</h3><p>{scene.context}</p></section>
            {scene.overviewId ? <Link className="hcm-overview-link" href={`/vietnam/overview#${scene.overviewId}`}>Đặt vào dòng lịch sử Việt Nam<ArrowRight size={15} /></Link> : null}
            <button className="hcm-inline-source" type="button" onClick={() => setTab("sources")}><Check size={13} />{sceneSources.length} nguồn cho mốc này · Mở tư liệu</button>
          </> : null}
          {tab === "people" ? <>
            <p className="hcm-section-intro">Quan hệ được ghi theo sự kiện và thời điểm. Chân dung dùng để nhận diện nhân vật, không mặc định được chụp vào năm {scene.year}.</p>
            <ImageGroup>{scene.people.map((relation) => {
              const person = getCharacter(relation.characterId);
              const photo = portraitFor(person.wiki);
              return <article className="hcm-person-card" key={person.id} data-character-id={person.id} data-relation={relation.kind} data-selected={selectedPerson === person.id}>
                <div className="hcm-person-heading"><figure className="hcm-person-photo"><LifePortrait characterId={person.id} preview /></figure><div><span className="hcm-relation-badge">{relationLabels[relation.kind]}</span><h3>{person.name}</h3><small>{person.lifespan}</small></div></div>
                <p>{relation.connection}</p><div className="hcm-person-location"><MapPin size={14} /><span>{relation.at ? `${relation.place} · ${relation.locationNote}` : "Không gán tọa độ: tư liệu ở mốc này không xác nhận vị trí hoặc cuộc gặp trực tiếp."}</span></div>
                <div className="hcm-person-links"><Link href={`/characters/${person.id}`}>Hồ sơ nhân vật<ArrowRight size={13} /></Link>{relation.sourceIds.map((id) => { const source = lifeSources.find((item) => item.id === id); return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer">Đối chiếu nguồn<ExternalLink size={12} /></a> : null; })}</div>
                {photo ? <p className="hcm-photo-credit">{portraitCaption(photo)} · <a href={photo.file} target="_blank" rel="noreferrer">Nguồn ảnh ↗</a></p> : null}
              </article>;
            })}</ImageGroup>
            {!scene.people.length ? <div className="hcm-no-people"><Users size={26} /><h3>Tập trung vào hành trình của Bác</h3><p>Mốc này chưa gán nhân vật khác. Chọn mốc Mátxcơva 1950 để xem Stalin, Mao Trạch Đông và Chu Ân Lai.</p><button type="button" onClick={() => choose(lifeScenes.findIndex((item) => item.id === "moscow-1950"))}>Đến Mátxcơva 1950<ArrowRight size={15} /></button></div> : null}
          </> : null}
          {tab === "sources" ? <>
            <p className="hcm-section-intro">Đối chiếu mốc {scene.date} qua tư liệu bảo tàng, cơ quan lưu trữ và cơ quan nghiên cứu. Chọn nguồn để đọc trong trang gốc.</p>
            <ol className="hcm-source-list">{sceneSources.map((source, i) => <li key={source.id}><span>{String(i + 1).padStart(2, "0")}</span><a href={source.url} target="_blank" rel="noreferrer"><small>{source.publisher}</small><strong>{source.title}<ExternalLink size={13} /></strong></a></li>)}</ol>
            <section className="hcm-context-note"><h3>Cách đọc lược đồ</h3><p>Địa điểm và tọa độ chỉ gần đúng. Một mốc có thể đại diện cho cả giai đoạn. Đường vàng nối các mốc tiêu biểu, không tái dựng hải trình hay tuyến đi thực tế. Nét đứt tới nhân vật là mối liên hệ theo sự kiện.</p><p>Biên giới nền phục vụ định vị hiện đại; không biểu thị chủ quyền, phạm vi kiểm soát hay đường biên lịch sử ở năm đang xem.</p></section>
            {portrait ? <section className="hcm-source-portrait"><span className="hcm-source-photo"><LifePortrait characterId="ho-chi-minh" preview /></span><div><h3>Chân dung Chủ tịch Hồ Chí Minh</h3><p>Ảnh tư liệu năm 1946 · {portrait.license}</p><a href={portrait.file} target="_blank" rel="noreferrer">Ghi công & bản gốc ↗</a></div></section> : null}
          </> : null}
        </div>
        <div className="hcm-reader-navigation"><button type="button" disabled={index === 0} onClick={() => choose(index - 1)}><ArrowLeft size={15} />Mốc trước</button><span>{index + 1} / {lifeScenes.length}</span><button type="button" disabled={index === lifeScenes.length - 1} onClick={() => choose(index + 1)}>Mốc tiếp<ArrowRight size={15} /></button></div>
      </aside>
      <JourneyMap scene={scene} index={index} state={mapState} onChange={updateMap} onGo={choose} onPerson={showPerson} onRead={() => { setTab("story"); updateMap({ view: "story" }); setPlaying(false); }} />
    </div>
    <section className="hcm-timeline" aria-label="Dòng thời gian cuộc đời Hồ Chí Minh">
      <div className="hcm-timeline-toolbar"><div className="hcm-transport"><button type="button" disabled={index === 0} aria-label="Mốc cuộc đời trước" onClick={() => choose(index - 1)}><ArrowLeft size={17} /></button><button className="hcm-play" type="button" aria-label={playing ? "Tạm dừng hành trình" : "Tự chuyển mốc mỗi 14 giây"} aria-pressed={playing} onClick={() => { if (!playing && index === lifeScenes.length - 1) go(0); setQuery(""); setPlaying((value) => !value); }}>{playing ? <Pause size={17} /> : <Play size={17} />}</button><button type="button" disabled={index === lifeScenes.length - 1} aria-label="Mốc cuộc đời tiếp theo" onClick={() => choose(index + 1)}><ArrowRight size={17} /></button><span>{playing ? "Đang tự chuyển · 14 giây / mốc" : `${lifeScenes.length} mốc cuộc đời · 1890–1969`}</span></div>
        <Select value={scene.chapter} onValueChange={(chapter) => { setQuery(""); choose(lifeScenes.findIndex((item) => item.chapter === chapter)); }}><SelectTrigger className="hcm-chapter-trigger" aria-label="Chọn chặng cuộc đời"><SelectValue /></SelectTrigger><SelectContent position="popper" collisionPadding={12}>{lifeChapters.map((chapter) => <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>)}</SelectContent></Select>
        <label className="hcm-timeline-search"><Search size={15} aria-hidden="true" /><Input type="search" aria-label="Tìm mốc, địa điểm hoặc nhân vật trong hành trình" placeholder="Tìm mốc, nơi chốn, Stalin, Mao…" value={query} onChange={(event) => { setQuery(event.target.value); setPlaying(false); }} />{query ? <button type="button" aria-label="Xóa tìm kiếm mốc" onClick={() => setQuery("")}><X size={14} /></button> : null}</label>
      </div>
      <div className="hcm-timeline-rail" ref={rail} aria-label="Chọn mốc cuộc đời"><div className="hcm-timeline-track">{filtered.map(({ item, sceneIndex }) => <button type="button" key={item.id} data-scene-id={item.id} className={sceneIndex < index ? "is-past" : ""} aria-current={sceneIndex === index ? "step" : undefined} title={`${item.date} · ${item.title}`} onClick={() => choose(sceneIndex)}><small>{item.date}</small><span className="hcm-timeline-node"><i /></span><strong>{item.location.name.split(" · ")[0]}</strong><span className="hcm-timeline-caption">{item.title}</span></button>)}{!filtered.length ? <p className="hcm-timeline-empty" role="status">Không có mốc phù hợp. Thử “Mao”, “Paris” hoặc “1945”.</p> : null}</div></div>
      <div className="hcm-timeline-progress" aria-label={`Mốc ${index + 1} trong ${lifeScenes.length}`}><span style={{ width: `${(index + 1) / lifeScenes.length * 100}%` }} /></div>
    </section>
    <p className="hcm-screen-reader" role="status">Mốc {index + 1}: {scene.date}. {scene.title}. Bác ở {scene.location.name}.</p>
    <span className="hcm-screen-reader" role="status">{shareStatus === "copied" ? "Đã sao chép liên kết kèm mốc, từ khóa và góc nhìn bản đồ." : ""}</span>
  </main>;
};
