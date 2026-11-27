"use client";

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Swords,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";

import { CharacterAvatar } from "~/components/character-avatar";
import { BattleGrid } from "~/components/battle-grid";
import { battleEntries } from "~/data/battles";
import { CountryFlag } from "~/components/country-flag";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { characterHref, getCharacter } from "~/data/characters";
import { portraitFor } from "~/data/portraits";
import { factions, people, places, threeKingdomsMapSources, threeKingdomsScenes } from "~/data/three-kingdoms";
import type { PersonId } from "~/data/three-kingdoms";
import { threeKingdomsBattleScenes } from "~/data/three-kingdoms-battles";
import { BattleMapLegend } from "~/components/battle-map-symbols";
import { BackButton } from "~/components/back-button";

import { BattleMap } from "./map";
import "~/styles/three-kingdoms.css";

const subscribe = (listener: () => void) => {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
};
const getHash = () => window.location.hash.slice(1);
const getServerHash = () => "";
const compactLayout = "(max-width: 810px)";
const subscribeLayout = (listener: () => void) => {
  const media = window.matchMedia(compactLayout);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
const getCompactLayout = () => window.matchMedia(compactLayout).matches;
const getServerLayout = () => false;
const setSceneHash = (id: string) => {
  if (getHash() === id) return;
  window.history.replaceState(window.history.state, "", `#${id}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
};

export const ThreeKingdomsExperience = ({ battleId }: { battleId?: string }) => {
  const scenes = useMemo(() => battleId ? threeKingdomsBattleScenes(battleId) : threeKingdomsScenes, [battleId]);
  const battle = battleEntries.find((entry) => entry.id === battleId);
  const chapterStarts = scenes.flatMap((scene, index) => index === 0 || scenes[index - 1].chapter !== scene.chapter ? [{ index, name: scene.chapter }] : []);
  const lastScene = scenes.length - 1;
  const openScene = useCallback((next: number) => setSceneHash(scenes[next].id), [scenes]);
  const id = useSyncExternalStore(subscribe, getHash, getServerHash);
  const index = Math.max(0, scenes.findIndex((frame) => frame.id === id));
  const scene = scenes[index];
  const compact = useSyncExternalStore(subscribeLayout, getCompactLayout, getServerLayout);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(11);
  const [wide, setWide] = useState(Boolean(battleId));
  const [highlight, setHighlight] = useState<{ scene: string; person: PersonId } | null>(null);
  const [storyPreference, setStoryPreference] = useState<boolean | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const storyOpen = storyPreference ?? !compact;
  const selected = highlight?.scene === scene.id ? highlight.person : null;
  const timeline = useRef<HTMLOListElement>(null);
  const storyPanel = useRef<HTMLElement>(null);
  const dockPanel = useRef<HTMLElement>(null);
  const [dockHeight, setDockHeight] = useState<number | null>(null);
  const dockInset = timelineOpen
    ? (dockHeight ?? (compact ? 235 : 185)) + 18
    : 20;
  const legend = [...new Set(scene.territories.map((region) => region.faction))];

  useEffect(() => {
    storyPanel.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    if (!dockPanel.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setDockHeight(entry.target.getBoundingClientRect().height);
    });
    observer.observe(dockPanel.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || index === lastScene) return;
    const timer = window.setTimeout(() => {
      if (index + 1 === lastScene) setPlaying(false);
      openScene(index + 1);
    }, duration * 1000);
    return () => window.clearTimeout(timer);
  }, [duration, index, playing, lastScene, openScene]);

  useEffect(() => {
    if (!timeline.current) return;
    const strip = timeline.current;
    const button = strip.querySelector<HTMLButtonElement>('[aria-current="step"]');
    if (!button) return;
    const left = button.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
    const right = left + button.offsetWidth;
    if (left < strip.scrollLeft || right > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({
        left: Math.max(0, left - strip.clientWidth / 4),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }
  }, [compact, index, timelineOpen]);

  const goTo = (next: number) => {
    setPlaying(false);
    setHighlight(null);
    openScene(Math.min(lastScene, Math.max(0, next)));
  };
  const selectPerson = (person: PersonId) => {
    setPlaying(false);
    setHighlight(selected === person ? null : { scene: scene.id, person });
  };
  const togglePlayback = () => {
    setHighlight(null);
    if (index === lastScene) {
      openScene(0);
      setPlaying(true);
    } else {
      setPlaying((previous) => !previous);
    }
  };

  return (
    <main className="tk-experience" style={{ "--tk-dock": `${dockInset}px` } as CSSProperties} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + (event.key === "ArrowLeft" ? -1 : 1));
      }
    }} tabIndex={0}>
      <header className="tk-header">
        <BackButton placement="header" fallbackHref={battleId ? "/period/three-kingdoms" : "/period"} />
        <Link href={battleId ? `/period/three-kingdoms#${battleId}` : "/period#china"} className="tk-back" aria-label="Các thời kỳ lịch sử">
          <span>{battleId ? "Tam Quốc" : "Thời kỳ"}</span>
        </Link>
        <div className="tk-title">
          <h1>{battle?.title ?? "Tam Quốc"} <span>{battle?.years ?? "220–280"}</span></h1>
        </div>
        <div className="tk-panel-toggles">
          <button type="button" aria-label="Diễn biến" aria-expanded={storyOpen} aria-controls="tk-story" title="Diễn biến" onClick={() => setStoryPreference(!storyOpen)}>
            <BookOpen size={16} /> <span>Diễn biến</span>
          </button>
          <button type="button" aria-label="Mốc thời gian" aria-expanded={timelineOpen} aria-controls="tk-timeline" title="Mốc thời gian" onClick={() => setTimelineOpen(!timelineOpen)}>
            <Clock size={16} /> <span>Mốc thời gian</span>
          </button>
        </div>
      </header>
      <div className="tk-stage">
        <div className="tk-cartography">
          <BattleMap scene={scene} selected={selected} wide={wide} storyOpen={storyOpen}
            timelineOpen={timelineOpen} timelineInset={dockInset} onSelect={selectPerson}
            onToggleWide={() => {
              setWide((value) => !value);
              setHighlight(null);
            }}
          />
          <details className="tk-legend-float">
            <summary>Chú giải</summary>
            <BattleMapLegend />
            <div className="tk-legend">
              {legend.map((id) => (
                <span key={id}><i style={{ "--faction": factions[id].color } as CSSProperties} />{factions[id].name}</span>
              ))}
              {scene.battle && <span><Swords size={14} />Trận đánh</span>}
            </div>
            <p className="tk-disclosure">Màu thể hiện vùng ảnh hưởng ước tính; avatar ở vùng là vị trí đại diện của thủ lĩnh. Cụm có số: bấm để chuyển nhân vật. Mũi tên chỉ hướng di chuyển khái quát. Dấu † chỉ địa điểm còn tranh luận. Biên giới và tên quốc gia hiện đại chỉ để định hướng, không phải ranh giới thời Tam Quốc.</p>
            {threeKingdomsMapSources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="tk-source px-2 pb-2">
                Lược đồ tham khảo: {source.title} ↗
              </a>
            ))}
          </details>
        </div>
        <article ref={storyPanel} id="tk-story" className="tk-story" aria-labelledby="tk-scene-title" hidden={!storyOpen} tabIndex={0}>
          <div className="tk-scene-copy" key={scene.id} aria-live="polite">
            <p className="tk-scene-date">{scene.date} <span>{scene.chapter}</span></p>
            <h2 id="tk-scene-title">{scene.title}</h2>
            <p className="tk-context"><MapPin size={15} /> {scene.context}</p>
            <p className="tk-narration">{scene.story}</p>
          </div>
          {scene.routes && <ul className="tk-route-list" aria-label="Hướng di chuyển">
            {scene.routes.map((route) => <li key={route.label}><i style={{ color: factions[route.faction].color }}>↗</i>{route.label}</li>)}
          </ul>}
          <h3>Trong lúc đó</h3>
          <ul className="tk-cast">
            {scene.cast.map((member) => {
              const person = people[member.person];
              const character = "characterId" in person ? getCharacter(person.characterId) : null;
              const portrait = character ? portraitFor(character.wiki) : undefined;
              return (
                <li key={member.person} data-character-id={character?.id ?? member.person}>
                  <button
                    type="button"
                    aria-pressed={selected === member.person}
                    onClick={() => selectPerson(member.person)}
                    style={{ "--person": person.color } as CSSProperties}
                  >
                    <span className="tk-avatar">
                      {portrait
                        ? <CharacterAvatar name={person.name} portrait={portrait} width={32} height={32} preview={false} />
                        : person.name.split(" ").at(-1)?.[0]}
                    </span>
                    <span>
                      <strong>{person.name}</strong>{member.deceased && <small className="tk-death-label ml-2 text-primary">† Qua đời</small>}
                      <small className="block">{places[member.place].name}{member.regional ? " · vùng gần đúng" : ""}</small>
                      <span>{member.action}</span>
                    </span>
                  </button>
                  <Link
                    href={characterHref(person.characterId)}
                    className="tk-character-link ml-11 block w-fit pb-1 text-[10px] text-muted-foreground hover:text-primary hover:underline"
                  >
                    Hồ sơ nhân vật ↗
                  </Link>
                </li>
              );
            })}
          </ul>
          <a className="tk-source" href={scene.source.url} target="_blank" rel="noreferrer">{scene.source.name} <ExternalLink size={13} /></a>
          <Link href="/china#three-kingdoms" className="tk-source">Lịch sử Trung Quốc ↗</Link>
          {!battleId && battleEntries.find((entry) => entry.id === scene.id) ? <Link href={battleEntries.find((entry) => entry.id === scene.id)!.href} className="tk-source"><CountryFlag countryId="china" /> Chi tiết trận đánh ↗</Link> : null}
          {battleId ? <Link href={`/period/three-kingdoms#${battleId}`} className="tk-source">Trở về thời kỳ Tam Quốc ↗</Link> : null}
          <Link href="/battle" className="tk-source">Danh sách trận đánh ↗</Link>
          {!battleId ? <details className="mt-5 space-y-3"><summary className="cursor-pointer text-sm text-primary">Các trận đánh trong thời kỳ Tam Quốc</summary><BattleGrid entries={battleEntries.filter((entry) => entry.periodId === "three-kingdoms")} /></details> : null}
        </article>
        <section ref={dockPanel} id="tk-timeline" className="tk-timeline" aria-label="Dòng thời gian Tam Quốc" hidden={!timelineOpen}>
          <div className="tk-transport">
            <div className="tk-playback">
              <button type="button" aria-label="Cảnh trước" disabled={index === 0} onClick={() => goTo(index - 1)}><ChevronLeft size={20} /></button>
              <button type="button" className="tk-play" onClick={togglePlayback} disabled={lastScene === 0}>
                {index === lastScene ? <RotateCcw size={16} /> : playing ? <Pause size={16} /> : <Play size={16} />}
                {index === lastScene ? "Phát lại" : playing ? "Tạm dừng" : "Phát diễn biến"}
              </button>
              <button type="button" aria-label="Cảnh sau" disabled={index === lastScene} onClick={() => goTo(index + 1)}><ChevronRight size={20} /></button>
            </div>
            <span className="tk-counter" aria-label={`Cảnh ${index + 1} trên ${scenes.length}`}>{index + 1} / {scenes.length}</span>
            <input className="tk-scrubber" type="range" aria-label="Chọn mốc thời gian" aria-valuetext={`${scene.date} · ${scene.title}`}
              min={0} max={lastScene} value={index} onChange={(event) => goTo(Number(event.target.value))} />
            <div className="tk-speed">
              <span>Tốc độ</span>
              <Select value={String(duration)} onValueChange={(value) => setDuration(Number(value))}>
                <SelectTrigger aria-label="Tốc độ" size="sm" className="tk-speed-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="6">Nhanh</SelectItem>
                  <SelectItem value="11">Vừa</SelectItem>
                  <SelectItem value="19">Chậm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="tk-chapters" aria-label="Chọn chương">
            {chapterStarts.map((chapter) => <button type="button" key={chapter.name} aria-pressed={scene.chapter === chapter.name} onClick={() => goTo(chapter.index)}>{chapter.name}</button>)}
          </div>
          <ol className="tk-timeline-strip" ref={timeline}>
            {scenes.map((frame, position) => (
              <li key={frame.id} data-event-id={frame.id}>
                <button type="button" onClick={() => goTo(position)} aria-current={index === position ? "step" : undefined}>
                  <span>{frame.date}{frame.battle && <Swords size={12} aria-label="Trận đánh" />}</span>
                  <strong>{frame.title}</strong>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
};
