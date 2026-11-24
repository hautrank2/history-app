"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Clock, MapPin, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { BattleMap3D } from "~/app/[country]/[period]/_components/bach-dang/map-3d";
import { CampaignMap } from "~/app/[country]/[period]/_components/bach-dang/campaign-map";
import { battlePlaces } from "~/app/[country]/[period]/_components/bach-dang/locations";
import { CharacterAvatar } from "~/components/character-avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { characterHref, getCharacter } from "~/data/characters";
import { portraitFor, portraitPlaceholder } from "~/data/portraits";
import { bachDangBattle, vietnamBattlePeriod, type VietnamBattleModel } from "~/data/vietnam-battles";
import { vietnamBattleTerritory } from "~/data/vietnam-battle-territories";
import { BattleMapLegend } from "~/components/battle-map-symbols";
import { RootLink } from "~/components/root-link";
import type { StoryModel } from "~/types";
import "~/styles/three-kingdoms.css";
import "~/styles/battle-experience.css";

export function BattleExperience({ story: originalStory, battle }: { story: StoryModel; battle?: VietnamBattleModel }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(11);
  const [storyOpen, setStoryOpen] = useState(true);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [mapMode, setMapMode] = useState<"2d" | "3d">("2d");
  const [selected, setSelected] = useState<string | null>(null);
  const [dockHeight, setDockHeight] = useState(170);
  const dock = useRef<HTMLElement>(null);
  const panel = useRef<HTMLElement>(null);
  const timeline = useRef<HTMLOListElement>(null);
  const period = battle ? vietnamBattlePeriod(battle) : undefined;
  const campaign = useMemo(() => battle ?? bachDangBattle(originalStory), [battle, originalStory]);
  const story: StoryModel = battle ? originalStory : { ...originalStory, chapters: campaign.chapters.map((frame) => ({
    ...originalStory.chapters[frame.tacticalStage ?? 0], title: frame.title, date: frame.date, text: frame.text,
  })) };
  const chapter = story.chapters[active];
  const last = story.chapters.length - 1;
  const territory = vietnamBattleTerritory(campaign.id, (point) => point);
  const locations = campaign.places.map((place) => ({ ...place, description: place.note }));
  const currentPlaces = battle
    ? battle.places.filter((place) => battle.chapters[active].placeIds.includes(place.id)).map((place) => place.name)
    : campaign.places.filter((place) => campaign.chapters[active].placeIds.includes(place.id)).map((place) => place.name);
  const selectedPlace = selected ?? currentPlaces.find((name) => locations.some((place) => place.name === name)) ?? locations[0].name;
  const goTo = (next: number) => {
    setPlaying(false);
    setSelected(null);
    setActive(Math.max(0, Math.min(last, next)));
  };

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setSelected(null);
      setActive(Math.min(last, active + 1));
      if (active + 1 >= last) setPlaying(false);
    }, seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [active, last, playing, seconds]);
  useEffect(() => {
    const pause = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, []);
  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
    const strip = timeline.current;
    const button = strip?.querySelector<HTMLButtonElement>('[aria-current="step"]');
    if (strip && button) strip.scrollTo({ left: Math.max(0, button.offsetLeft - strip.offsetLeft - strip.clientWidth / 4) });
    window.dispatchEvent(new CustomEvent("atlas:music-context", { detail: { chapter: active } }));
  }, [active]);
  useEffect(() => {
    if (!dock.current) return;
    const observer = new ResizeObserver(([entry]) => setDockHeight(entry.target.getBoundingClientRect().height));
    observer.observe(dock.current);
    return () => observer.disconnect();
  }, []);

  return <main className="tk-experience battle-experience" style={{ "--tk-dock": `${timelineOpen ? dockHeight + 18 : 20}px` } as CSSProperties}
    data-story-open={storyOpen} tabIndex={0} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault(); goTo(active + (event.key === "ArrowLeft" ? -1 : 1));
      }
    }}>
    <header className="tk-header">
      <RootLink />
      <Link href="/battle#battle-vietnam" className="tk-back"><ArrowLeft size={17} /><span>Trận đánh</span></Link>
      <div className="tk-title"><h1>{battle?.title ?? "Bạch Đằng"} <span>{battle?.years ?? "1288"}</span></h1></div>
      <div className="tk-panel-toggles">
        <button aria-label="Diễn biến" aria-expanded={storyOpen} aria-controls="battle-story" onClick={() => setStoryOpen(!storyOpen)}><BookOpen size={16} /><span>Diễn biến</span></button>
        <button aria-label="Mốc thời gian" aria-expanded={timelineOpen} aria-controls="battle-timeline" onClick={() => setTimelineOpen(!timelineOpen)}><Clock size={16} /><span>Mốc thời gian</span></button>
      </div>
    </header>
    <div className="tk-stage">
      <div className="tk-cartography">
        <div className="battle-map-surface">
          {!battle && mapMode === "3d" ? <BattleMap3D stage={campaign.chapters[active].tacticalStage ?? active}
            selected={battlePlaces.find((place) => place.name.includes(selectedPlace))?.name ?? selectedPlace}
            onSelect={(name) => setSelected(locations.find((place) => name.includes(place.name))?.name ?? name)} />
            : <CampaignMap battle={campaign} stage={active} selected={selectedPlace} onSelect={setSelected}
              leaders={chapter.characters?.map((leader) => ({ ...leader, at: chapter.points?.find((point) => point.side === leader.side)?.at }))} />}
        </div>
        {!battle && <div className="tk-map-controls" role="group" aria-label="Chế độ bản đồ">
          <button aria-pressed={mapMode === "2d"} onClick={() => setMapMode("2d")}>2D</button>
          <button aria-pressed={mapMode === "3d"} onClick={() => setMapMode("3d")}>3D</button>
        </div>}
        <details className="tk-legend-float"><summary>Chú giải</summary>
          <BattleMapLegend />
          <div className="tk-legend"><span>{story.sides.home}</span><span>{story.sides.enemy}</span></div>
          <p className="tk-disclosure">{territory.note} Điểm sáng: vị trí sự kiện đang xem. Mũi tên thể hiện hướng hành quân, tiến công, tiếp tế hoặc rút quân khái quát, không phải lộ trình chính xác. Chân dung là vị trí đại diện lực lượng.</p>
          <a className="tk-source px-2 pb-2" href={territory.source.url} target="_blank" rel="noreferrer">{territory.source.title} ↗</a>
        </details>
      </div>
      <article id="battle-story" ref={panel} className="tk-story" hidden={!storyOpen} aria-labelledby="battle-event-title" tabIndex={0}>
        <div key={active} className="tk-scene-copy" aria-live="polite">
          <p className="tk-scene-date">{chapter.date}<span>Sự kiện {active + 1}/{story.chapters.length}</span></p>
          <h2 id="battle-event-title">{chapter.title}</h2>
          <p className="tk-context"><MapPin size={15} />{currentPlaces.join(" · ")}</p>
          <p className="tk-narration">{chapter.text}</p>
        </div>
        <h3>Địa điểm</h3>
        <div className="battle-place-list">{locations.map((place) => <button key={place.id} aria-pressed={selectedPlace === place.name} onClick={() => setSelected(place.name)}>{place.name}</button>)}</div>
        <p className="tk-narration">{locations.find((place) => place.name === selectedPlace)?.description}</p>
        {!!chapter.characters?.length && <><h3>Nhân vật</h3><ul className="battle-cast">{chapter.characters.map((person) => {
          const character = getCharacter(person.id);
          return <li key={person.id}><Link href={characterHref(person.id)}><CharacterAvatar name={person.name} portrait={portraitFor(character.wiki) ?? portraitPlaceholder} width={32} height={32} preview={false} /><span><strong>{person.name}</strong><small>{person.role}</small></span></Link></li>;
        })}</ul></>}
        {campaign.sources.map((source) => <a key={source.url} className="tk-source" href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}
        <Link className="tk-source" href={`${period?.href ?? "/period/nha-tran"}#${battle?.sceneId ?? "tran-bach-dang"}`}>{period?.title ?? "Nhà Trần"} ↗</Link>
        <Link className="tk-source" href="/battle">Danh sách trận đánh ↗</Link>
      </article>
      <section ref={dock} id="battle-timeline" className="tk-timeline" hidden={!timelineOpen} aria-label="Diễn biến trận đánh">
        <div className="tk-transport">
          <div className="tk-playback">
            <button aria-label="Sự kiện trước" disabled={active === 0} onClick={() => goTo(active - 1)}><ChevronLeft size={20} /></button>
            <button className="tk-play" onClick={() => {
              if (active === last) { setActive(0); setSelected(null); }
              setPlaying(!playing);
            }}>{active === last ? <RotateCcw size={16} /> : playing ? <Pause size={16} /> : <Play size={16} />}{active === last ? "Phát lại" : playing ? "Tạm dừng" : "Phát diễn biến"}</button>
            <button aria-label="Sự kiện sau" disabled={active === last} onClick={() => goTo(active + 1)}><ChevronRight size={20} /></button>
          </div>
          <span className="tk-counter" aria-live="polite">{active + 1} / {story.chapters.length}</span>
          <input className="tk-scrubber" type="range" min={0} max={last} value={active} aria-label="Chọn sự kiện" aria-valuetext={chapter.title} onChange={(event) => goTo(Number(event.target.value))} />
          <div className="tk-speed"><span>Tốc độ</span><Select value={String(seconds)} onValueChange={(value) => setSeconds(Number(value))}>
            <SelectTrigger size="sm" aria-label="Tốc độ" className="tk-speed-trigger"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="6">Nhanh</SelectItem><SelectItem value="11">Vừa</SelectItem><SelectItem value="19">Chậm</SelectItem></SelectContent>
          </Select></div>
        </div>
        <ol className="tk-timeline-strip" ref={timeline}>{story.chapters.map((frame, index) => <li key={frame.title}><button aria-current={active === index ? "step" : undefined} onClick={() => goTo(index)}><span>{frame.date}</span><strong>{frame.title}</strong></button></li>)}</ol>
      </section>
    </div>
  </main>;
}
