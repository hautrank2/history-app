"use client";

import {
  ArrowLeft,
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
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";

import { CharacterAvatar } from "~/components/character-avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { getCharacter } from "~/data/characters";
import { portraitFor } from "~/data/portraits";
import { factions, people, places, threeKingdomsScenes } from "~/data/three-kingdoms";
import type { PersonId } from "~/data/three-kingdoms";

import { BattleMap } from "./map";
import "~/styles/three-kingdoms.css";

const chapterStarts = threeKingdomsScenes.flatMap((scene, index) =>
  index === 0 || threeKingdomsScenes[index - 1].chapter !== scene.chapter
    ? [{ index, name: scene.chapter }] : [],
);
const lastScene = threeKingdomsScenes.length - 1;
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
const openScene = (index: number) => {
  const { id } = threeKingdomsScenes[index];
  if (getHash() === id) return;
  window.history.replaceState(window.history.state, "", `#${id}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
};

export const ThreeKingdomsExperience = () => {
  const id = useSyncExternalStore(subscribe, getHash, getServerHash);
  const index = Math.max(0, threeKingdomsScenes.findIndex((frame) => frame.id === id));
  const scene = threeKingdomsScenes[index];
  const compact = useSyncExternalStore(subscribeLayout, getCompactLayout, getServerLayout);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(11);
  const [wide, setWide] = useState(false);
  const [highlight, setHighlight] = useState<{ scene: string; person: PersonId } | null>(null);
  const [storyPreference, setStoryPreference] = useState<boolean | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const storyOpen = storyPreference ?? !compact;
  const selected = highlight?.scene === scene.id ? highlight.person : null;
  const timeline = useRef<HTMLOListElement>(null);
  const activeStep = useRef<HTMLButtonElement>(null);
  const legend = [...new Set(scene.territories.map((region) => region.faction))];

  useEffect(() => {
    if (!playing || index === lastScene) return;
    const timer = window.setTimeout(() => {
      if (index + 1 === lastScene) setPlaying(false);
      openScene(index + 1);
    }, duration * 1000);
    return () => window.clearTimeout(timer);
  }, [duration, index, playing]);

  useEffect(() => {
    if (!timeline.current || !activeStep.current) return;
    const strip = timeline.current;
    const button = activeStep.current;
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
    <main className="tk-experience" onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + (event.key === "ArrowLeft" ? -1 : 1));
      }
    }} tabIndex={0}>
      <header className="tk-header">
        <Link href="/battle" className="tk-back" aria-label="Danh sách trận đánh">
          <ArrowLeft size={17} /> <span>Trận đánh</span>
        </Link>
        <div className="tk-title">
          <h1>Tam Quốc <span>184–229</span></h1>
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
            timelineOpen={timelineOpen} onSelect={selectPerson}
            onToggleWide={() => {
              setWide((value) => !value);
              setHighlight(null);
            }}
          />
          <details className="tk-legend-float">
            <summary>Chú giải</summary>
            <div className="tk-legend">
              {legend.map((id) => (
                <span key={id}><i style={{ "--faction": factions[id].color } as CSSProperties} />{factions[id].name}</span>
              ))}
              {scene.battle && <span><Swords size={14} />Trận đánh</span>}
            </div>
            <p className="tk-disclosure">Nét đứt bao vùng ảnh hưởng hoặc vùng nổi dậy ước tính. Mũi tên chỉ hướng di chuyển khái quát. Dấu † chỉ địa điểm còn tranh luận hoặc khó xác định. Dòng sông và địa hình được giản lược.</p>
          </details>
        </div>
        <article id="tk-story" className="tk-story" aria-labelledby="tk-scene-title" hidden={!storyOpen} tabIndex={0}>
          <div className="tk-scene-copy" key={scene.id} aria-live="polite">
            <p className="tk-scene-date">{scene.date} <span>{scene.chapter}</span></p>
            <h2 id="tk-scene-title">{scene.title}</h2>
            <p className="tk-context"><MapPin size={15} /> {scene.context}</p>
            <p className="tk-narration">{scene.story}</p>
          </div>
          {scene.routes && <ul className="tk-route-list" aria-label="Hướng di chuyển">
            {scene.routes.map((route) => <li key={route.label}><i style={{ color: factions[route.faction].color }}>↗</i>{route.label}</li>)}
          </ul>}
          <h3>Nhân vật đang ở đâu?</h3>
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
                      <strong>{person.name}</strong> <small>{places[member.place].name}{member.regional ? " · vùng gần đúng" : ""}</small>
                      <span>{member.action}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <a className="tk-source" href={scene.source.url} target="_blank" rel="noreferrer">{scene.source.name} <ExternalLink size={13} /></a>
          <Link href="/china#three-kingdoms" className="tk-source">Lịch sử Trung Quốc ↗</Link>
        </article>
        <section id="tk-timeline" className="tk-timeline" aria-label="Dòng thời gian Tam Quốc" hidden={!timelineOpen}>
          <div className="tk-transport">
            <div className="tk-playback">
              <button type="button" aria-label="Cảnh trước" disabled={index === 0} onClick={() => goTo(index - 1)}><ChevronLeft size={20} /></button>
              <button type="button" className="tk-play" onClick={togglePlayback}>
                {index === lastScene ? <RotateCcw size={16} /> : playing ? <Pause size={16} /> : <Play size={16} />}
                {index === lastScene ? "Phát lại" : playing ? "Tạm dừng" : "Phát diễn biến"}
              </button>
              <button type="button" aria-label="Cảnh sau" disabled={index === lastScene} onClick={() => goTo(index + 1)}><ChevronRight size={20} /></button>
            </div>
            <span className="tk-counter" aria-label={`Cảnh ${index + 1} trên ${threeKingdomsScenes.length}`}>{index + 1} / {threeKingdomsScenes.length}</span>
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
            {threeKingdomsScenes.map((frame, position) => (
              <li key={frame.id} data-event-id={frame.id}>
                <button type="button" onClick={() => goTo(position)} aria-current={index === position ? "step" : undefined} ref={index === position ? activeStep : undefined}>
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
