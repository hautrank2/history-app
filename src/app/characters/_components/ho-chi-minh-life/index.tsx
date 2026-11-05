"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  MapPin,
  Pause,
  Play,
  Search,
  Share2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { HomeLink } from "~/components/home-link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Image, ImageGroup } from "@/components/ui/image";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getCharacter } from "~/data/characters";
import {
  lifeChapters,
  lifeImageFor,
  lifeScenes,
  lifeSources,
  matchesLifeScene,
  relationLabels,
} from "~/data/ho-chi-minh";
import { portraitCaption, portraitFor } from "~/data/portraits";

import { JourneyMap } from "./journey-map";
import { LifePortrait } from "./portrait";
import { useLifeMapUrl } from "./use-life-map-url";
import { lifePlaybackSeconds, useLifePlayback } from "./use-life-playback";
import "~/styles/ho-chi-minh-life.css";

type ReadingTab = "story" | "people" | "sources";

const independenceIndex = lifeScenes.findIndex(
  (scene) => scene.id === "ba-dinh-1945",
);

export const HoChiMinhLife = () => {
  const { state: mapState, update: updateMap, shareUrl } = useLifeMapUrl();
  const index = Math.max(
    0,
    lifeScenes.findIndex((scene) => scene.id === mapState.stop),
  );
  const [tab, setTab] = useState<ReadingTab>("story");
  const query = mapState.q;
  const setQuery = (q: string) => updateMap({ q });
  const [popupOpen, setPopupOpen] = useState(true);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "manual">(
    "idle",
  );
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const scene = lifeScenes[index];
  const isIndependent = independenceIndex >= 0 && index >= independenceIndex;
  const activeTab = tab === "people" && !scene.people.length ? "story" : tab;
  const portrait = portraitFor(getCharacter("ho-chi-minh").wiki);
  const eventImage = lifeImageFor(scene);
  const go = useCallback(
    (next: number) => {
      const bounded = Math.max(0, Math.min(lifeScenes.length - 1, next));
      updateMap((previous) => ({
        stop: lifeScenes[bounded].id,
        ...(previous.map === "focus"
          ? { camera: { zoom: 1, x: 0, y: 0 } }
          : {}),
      }));
      setSelectedPerson(null);
      if (!lifeScenes[bounded].people.length)
        setTab((previous) => (previous === "people" ? "story" : previous));
      setPopupOpen(true);
    },
    [updateMap],
  );
  const { playing, setPlaying, seconds, setSeconds, progress } =
    useLifePlayback({
      index,
      count: lifeScenes.length,
      onGo: go,
    });
  const choose = (next: number) => {
    setPlaying(false);
    go(next);
  };
  useEffect(() => {
    const pause = () => setPlaying(false);
    window.addEventListener("popstate", pause);
    window.addEventListener("hashchange", pause);
    return () => {
      window.removeEventListener("popstate", pause);
      window.removeEventListener("hashchange", pause);
    };
  }, [setPlaying]);
  useEffect(() => {
    if (shareStatus !== "copied") return;
    const timer = setTimeout(() => setShareStatus("idle"), 2500);
    return () => clearTimeout(timer);
  }, [shareStatus]);
  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setShareStatus("copied");
    } catch {
      setShareStatus("manual");
    }
  };
  useEffect(() => {
    rail.current
      ?.querySelector<HTMLElement>("[aria-current=step]")
      ?.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "instant",
      });
  }, [index]);
  useEffect(() => {
    if (!selectedPerson || activeTab !== "people") return;
    document
      .querySelector<HTMLElement>(
        `.hcm-person-card[data-character-id="${selectedPerson}"]`,
      )
      ?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [selectedPerson, activeTab]);
  const showPerson = (id: string) => {
    setPlaying(false);
    setSelectedPerson(id);
    setTab("people");
    setPopupOpen(true);
  };
  const filtered = lifeScenes
    .map((item, sceneIndex) => ({ item, sceneIndex }))
    .filter(({ item }) => matchesLifeScene(item, query));
  const sceneSources = lifeSources.filter((source) =>
    scene.sourceIds.includes(source.id),
  );

  const readingTabs = (
    [
      { id: "story", label: "Câu chuyện", icon: <BookOpen size={14} /> },
      {
        id: "people",
        label: `Nhân vật (${scene.people.length})`,
        icon: <Users size={14} />,
      },
      { id: "sources", label: "Tư liệu", icon: <ExternalLink size={13} /> },
    ] as const
  ).filter((item) => item.id !== "people" || scene.people.length > 0);

  const infoPanel = popupOpen ? (
    <aside
      className="hcm-map-selection"
      aria-label={`Thông tin mốc ${scene.date}`}
      data-scene-id={scene.id}
    >
      <div className="hcm-selection-heading">
        <small>
          MỐC {index + 1} / {lifeScenes.length} · {scene.date}
        </small>
        <button
          type="button"
          aria-label="Đóng thông tin mốc"
          onClick={() => setPopupOpen(false)}
        >
          <X size={16} />
        </button>
      </div>
      <div className="hcm-scene-heading">
        <p>{scene.chapter}</p>
        <h2>{scene.title}</h2>
        <span className="hcm-scene-place">
          <MapPin size={14} />
          {scene.location.name} · {scene.location.country}
        </span>
      </div>
      <div
        className="hcm-reading-tabs"
        role="tablist"
        aria-label="Nội dung mốc cuộc đời"
      >
        {readingTabs.map((item) => (
          <button
            type="button"
            key={item.id}
            id={`hcm-tab-${item.id}`}
            role="tab"
            aria-selected={activeTab === item.id}
            aria-controls={`hcm-panel-${item.id}`}
            tabIndex={activeTab === item.id ? 0 : -1}
            onClick={() => {
              setTab(item.id);
              setPlaying(false);
            }}
            onKeyDown={(event) => {
              const tabs = readingTabs.map((item) => item.id);
              if (
                !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              event.stopPropagation();
              const next =
                event.key === "Home"
                  ? "story"
                  : event.key === "End"
                    ? "sources"
                    : tabs[
                        (tabs.indexOf(activeTab) +
                          (event.key === "ArrowRight" ? 1 : tabs.length - 1)) %
                          tabs.length
                      ];
              setTab(next);
              setPlaying(false);
              document.getElementById(`hcm-tab-${next}`)?.focus();
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
      <div
        className="hcm-reading-body"
        key={`${scene.id}-${activeTab}`}
        id={`hcm-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`hcm-tab-${activeTab}`}
        tabIndex={0}
        onPointerDown={() => setPlaying(false)}
        onWheel={() => setPlaying(false)}
      >
        {activeTab === "story" ? (
          <>
            {eventImage ? (
              <figure className="hcm-selection-photo">
                <Image
                  src={eventImage.src}
                  alt={eventImage.caption}
                  width={600}
                  height={360}
                />
                <figcaption>
                  <a href={eventImage.source} target="_blank" rel="noreferrer">
                    {eventImage.caption} ↗
                  </a>
                  <span>{eventImage.note}</span>
                </figcaption>
              </figure>
            ) : null}
            <div className="hcm-identity">
              <span className="hcm-identity-icon">
                <MapPin size={18} />
              </span>
              <div>
                <small>BÁC Ở ĐÂU, MANG TÊN GÌ?</small>
                <strong>{scene.name}</strong>
                <span>
                  {scene.location.name} · {scene.date}
                </span>
              </div>
            </div>
            <p className="hcm-story-summary">{scene.summary}</p>
            {scene.people.length ? (
              <section className="hcm-people-preview">
                <h3>Những người trong bối cảnh này</h3>
                <div>
                  {scene.people.map((person) => (
                    <button
                      type="button"
                      key={person.characterId}
                      data-character-id={person.characterId}
                      data-relation={person.kind}
                      onClick={() => showPerson(person.characterId)}
                    >
                      <span className="hcm-actor-mini">
                        <LifePortrait characterId={person.characterId} />
                      </span>
                      <span>
                        <strong>{getCharacter(person.characterId).name}</strong>
                        <small>{relationLabels[person.kind]}</small>
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
            {scene.overviewId ? (
              <Link
                className="hcm-overview-link"
                href={`/vietnam#${scene.overviewId}`}
              >
                Đặt vào dòng lịch sử Việt Nam
                <ArrowRight size={15} />
              </Link>
            ) : null}
          </>
        ) : null}
        {activeTab === "people" ? (
          <>
            <p className="hcm-section-intro">
              Quan hệ được ghi theo sự kiện và thời điểm. Chân dung dùng để nhận
              diện nhân vật, không mặc định được chụp vào năm {scene.year}.
            </p>
            <ImageGroup>
              {scene.people.map((relation) => {
                const person = getCharacter(relation.characterId);
                const photo = portraitFor(person.wiki);
                return (
                  <article
                    className="hcm-person-card"
                    key={person.id}
                    data-character-id={person.id}
                    data-relation={relation.kind}
                    data-selected={selectedPerson === person.id}
                  >
                    <div className="hcm-person-heading">
                      <figure className="hcm-person-photo">
                        <LifePortrait characterId={person.id} preview />
                      </figure>
                      <div>
                        <span className="hcm-relation-badge">
                          {relationLabels[relation.kind]}
                        </span>
                        <h3>{person.name}</h3>
                        <small>{person.lifespan}</small>
                      </div>
                    </div>
                    <p>{relation.connection}</p>
                    <div className="hcm-person-location">
                      <MapPin size={14} />
                      <span>
                        {relation.at
                          ? `${relation.place} · ${relation.locationNote}`
                          : "Không gán tọa độ: tư liệu ở mốc này không xác nhận vị trí hoặc cuộc gặp trực tiếp."}
                      </span>
                    </div>
                    <div className="hcm-person-links">
                      <Link href={`/characters/${person.id}`}>
                        Hồ sơ nhân vật
                        <ArrowRight size={13} />
                      </Link>
                      {relation.sourceIds.map((id) => {
                        const source = lifeSources.find(
                          (item) => item.id === id,
                        );
                        return source ? (
                          <a
                            key={id}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Đối chiếu nguồn
                            <ExternalLink size={12} />
                          </a>
                        ) : null;
                      })}
                    </div>
                    {photo ? (
                      <p className="hcm-photo-credit">
                        {portraitCaption(photo)} ·{" "}
                        <a href={photo.file} target="_blank" rel="noreferrer">
                          Nguồn ảnh ↗
                        </a>
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </ImageGroup>
          </>
        ) : null}
        {activeTab === "sources" ? (
          <>
            <p className="hcm-section-intro">
              Đối chiếu mốc {scene.date} qua tư liệu bảo tàng, cơ quan lưu trữ
              và cơ quan nghiên cứu. Chọn nguồn để đọc trong trang gốc.
            </p>
            <ol className="hcm-source-list">
              {sceneSources.map((source, i) => (
                <li key={source.id}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    <small>{source.publisher}</small>
                    <strong>
                      {source.title}
                      <ExternalLink size={13} />
                    </strong>
                  </a>
                </li>
              ))}
            </ol>
            <section className="hcm-context-note">
              <h3>Cách đọc lược đồ</h3>
              <a
                className="hcm-map-attribution"
                href="https://www.naturalearthdata.com/about/terms-of-use/"
                target="_blank"
                rel="noreferrer"
              >
                Dữ liệu bản đồ: Natural Earth ↗
              </a>
              <p>
                Địa điểm và tọa độ chỉ gần đúng. Một mốc có thể đại diện cho cả
                giai đoạn. Đường vàng nối các mốc tiêu biểu, không tái dựng hải
                trình hay tuyến đi thực tế. Nét đứt tới nhân vật là mối liên hệ
                theo sự kiện.
              </p>
              <p>
                Biên giới nền phục vụ định vị hiện đại; không biểu thị chủ
                quyền, phạm vi kiểm soát hay đường biên lịch sử ở năm đang xem.
              </p>
            </section>
            {portrait ? (
              <section className="hcm-source-portrait">
                <span className="hcm-source-photo">
                  <LifePortrait characterId="ho-chi-minh" preview />
                </span>
                <div>
                  <h3>Chân dung Chủ tịch Hồ Chí Minh</h3>
                  <p>Ảnh tư liệu năm 1946 · {portrait.license}</p>
                  <a href={portrait.file} target="_blank" rel="noreferrer">
                    Ghi công & bản gốc ↗
                  </a>
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
      <div className="hcm-reader-navigation">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => choose(index - 1)}
        >
          <ArrowLeft size={15} />
          Mốc trước
        </button>
        <span>
          {index + 1} / {lifeScenes.length}
        </span>
        <button
          type="button"
          disabled={index === lifeScenes.length - 1}
          onClick={() => choose(index + 1)}
        >
          Mốc tiếp
          <ArrowRight size={15} />
        </button>
      </div>
    </aside>
  ) : null;

  return (
    <main
      className="hcm-life"
      data-character-id="ho-chi-minh"
      data-scene-id={scene.id}
      data-independent={isIndependent}
      data-reading="false"
      onKeyDown={(event) => {
        if (
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          (event.target instanceof HTMLElement &&
            event.target.closest(
              "input, textarea, [role=combobox], [role=dialog], .hcm-map-stage, .hcm-timeline-rail",
            ))
        )
          return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          choose(index + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          choose(index - 1);
        }
      }}
    >
      <header className="hcm-header">
        <HomeLink className="hcm-back" back />
        <div className="hcm-heading">
          <span className="hcm-header-portrait">
            <LifePortrait characterId="ho-chi-minh" />
          </span>
          <div>
            <p>CHỦ TỊCH HỒ CHÍ MINH · 1890–1969</p>
            <h1>Một cuộc đời vì non sông</h1>
            <span>
              Theo dấu hành trình · Hiểu con người · Đọc bối cảnh thế giới
            </span>
          </div>
        </div>
        <nav
          className="hcm-header-actions"
          aria-label="Điều hướng chuyên trang"
        >
          <Link href="/characters">Nhân vật</Link>
          <Link href="/vietnam">
            Tổng quan Việt Nam
            <ExternalLink size={14} />
          </Link>
          <button
            className="hcm-share-button"
            type="button"
            onClick={copyShareUrl}
            aria-label="Sao chép liên kết bản đồ"
          >
            <Share2 size={16} />
            <span>
              {shareStatus === "copied" ? "Đã sao chép" : "Chia sẻ bản đồ"}
            </span>
          </button>
        </nav>
        {shareStatus === "manual" ? (
          <div className="hcm-share-fallback">
            <label htmlFor="hcm-share-url">
              Sao chép liên kết này để chia sẻ đúng bản đồ đang xem
            </label>
            <Input
              id="hcm-share-url"
              readOnly
              value={shareUrl()}
              onFocus={(event) => event.target.select()}
            />
            <button
              type="button"
              aria-label="Đóng liên kết chia sẻ"
              onClick={() => setShareStatus("idle")}
            >
              <X size={16} />
            </button>
          </div>
        ) : null}
      </header>
      <div className="hcm-experience">
        <JourneyMap
          scene={scene}
          index={index}
          state={mapState}
          onChange={updateMap}
          onGo={choose}
          onPerson={showPerson}
          infoPanel={infoPanel}
        />
      </div>
      <section
        className="hcm-timeline"
        aria-label="Dòng thời gian cuộc đời Hồ Chí Minh"
      >
        <div className="hcm-timeline-toolbar flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-(--atlas-line) px-4 py-2.5 [@media(max-height:820px)]:py-[7px] max-[760px]:gap-x-3 max-[760px]:gap-y-1.5 max-[760px]:px-2 max-[760px]:py-[7px]">
          <div className="hcm-transport flex min-w-0 items-center gap-1.5 max-[760px]:w-full">
            <button
              type="button"
              disabled={index === 0}
              aria-label="Mốc cuộc đời trước"
              className="hcm-previous grid size-8 shrink-0 place-items-center border border-(--atlas-line) text-(--atlas-gold) max-[760px]:size-7"
              onClick={() => choose(index - 1)}
            >
              <ArrowLeft size={17} />
            </button>
            <button
              className="hcm-play grid size-8 shrink-0 place-items-center border border-(--atlas-gold) bg-[image:var(--arena-selected)] text-primary-foreground max-[760px]:size-7"
              type="button"
              aria-label={
                playing
                  ? "Tạm dừng hành trình"
                  : index === lifeScenes.length - 1
                    ? "Phát lại hành trình từ đầu"
                    : `Tự chuyển mốc mỗi ${seconds} giây`
              }
              title={playing ? "Tạm dừng hành trình" : "Phát hành trình"}
              aria-pressed={playing}
              onClick={() => {
                if (!playing) {
                  if (index === lifeScenes.length - 1) go(0);
                  setQuery("");
                }
                setPlaying((value) => !value);
              }}
            >
              {playing ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <button
              type="button"
              disabled={index === lifeScenes.length - 1}
              aria-label="Mốc cuộc đời tiếp theo"
              className="hcm-next grid size-8 shrink-0 place-items-center border border-(--atlas-line) text-(--atlas-gold) max-[760px]:size-7"
              onClick={() => choose(index + 1)}
            >
              <ArrowRight size={17} />
            </button>
            <Select value={String(seconds)} onValueChange={setSeconds}>
              <SelectTrigger
                size="sm"
                className="hcm-playback-speed shrink-0 rounded-none border-(--atlas-line) px-2 text-[11px] text-(--atlas-gold) max-[760px]:data-[size=sm]:h-7"
                aria-label="Thời gian tự chuyển mỗi mốc"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" collisionPadding={12}>
                {lifePlaybackSeconds.map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value} giây / mốc
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="hcm-playback-status ml-1 flex min-w-0 flex-1 flex-col gap-1 sm:min-w-36">
              <span className="hcm-playback-caption whitespace-nowrap text-[11px] text-(--atlas-muted)">
                {playing
                  ? `${index === lifeScenes.length - 1 ? "Kết thúc" : "Mốc tiếp"} sau ${Math.max(0, Math.ceil(seconds * (1 - progress / 100)))} giây`
                  : `Mốc ${index + 1} / ${lifeScenes.length}`}
              </span>
              <div
                className="hcm-playback-progress h-1.5 overflow-hidden rounded-full bg-(--atlas-line)"
                role="progressbar"
                aria-label="Thời gian phát mốc hiện tại"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-valuetext={
                  playing
                    ? `${Math.floor((seconds * progress) / 100)} / ${seconds} giây`
                    : "Đã dừng"
                }
              >
                <span
                  className="hcm-playback-progress-fill block h-full rounded-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <Select
            value={scene.chapter}
            onValueChange={(chapter) => {
              setQuery("");
              choose(lifeScenes.findIndex((item) => item.chapter === chapter));
            }}
          >
            <SelectTrigger
              className="hcm-chapter-trigger"
              aria-label="Chọn chặng cuộc đời"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" collisionPadding={12}>
              {lifeChapters.map((chapter) => (
                <SelectItem key={chapter} value={chapter}>
                  {chapter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isIndependent ? (
            <svg
              className="hcm-national-flag h-6 w-9 shrink-0 overflow-hidden rounded-sm border border-foreground/20"
              viewBox="0 0 30 20"
              role="img"
              aria-label="Quốc kỳ Việt Nam (biểu tượng hiện đại)"
            >
              <title>Quốc kỳ Việt Nam (biểu tượng hiện đại)</title>
              <path className="fill-red-600" d="M0 0h30v20H0z" />
              <path
                className="fill-yellow-400"
                d="M15 4l1.35 4.15h4.36l-3.53 2.56 1.35 4.14L15 12.29l-3.53 2.56 1.35-4.14-3.53-2.56h4.36z"
              />
            </svg>
          ) : null}
          <label className="hcm-timeline-search">
            <Search size={15} aria-hidden="true" />
            <Input
              type="search"
              aria-label="Tìm mốc, địa điểm hoặc nhân vật trong hành trình"
              placeholder="Tìm mốc, nơi chốn, Stalin, Mao…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPlaying(false);
              }}
            />
            {query ? (
              <button
                type="button"
                aria-label="Xóa tìm kiếm mốc"
                onClick={() => setQuery("")}
              >
                <X size={14} />
              </button>
            ) : null}
          </label>
        </div>
        <div
          className="hcm-timeline-rail"
          ref={rail}
          aria-label="Chọn mốc cuộc đời"
        >
          <div className="hcm-timeline-track">
            {filtered.map(({ item, sceneIndex }) => (
              <button
                type="button"
                key={item.id}
                data-scene-id={item.id}
                className={sceneIndex < index ? "is-past" : ""}
                aria-current={sceneIndex === index ? "step" : undefined}
                title={`${item.date} · ${item.title}`}
                onClick={() => choose(sceneIndex)}
              >
                <small>{item.date}</small>
                <span className="hcm-timeline-node">
                  <i />
                </span>
                <strong>{item.location.name.split(" · ")[0]}</strong>
                <span className="hcm-timeline-caption">{item.title}</span>
              </button>
            ))}
            {!filtered.length ? (
              <p className="hcm-timeline-empty" role="status">
                Không có mốc phù hợp. Thử “Mao”, “Paris” hoặc “1945”.
              </p>
            ) : null}
          </div>
        </div>
        <div
          className="hcm-timeline-progress"
          aria-label={`Mốc ${index + 1} trong ${lifeScenes.length}`}
        >
          <span
            style={{ width: `${((index + 1) / lifeScenes.length) * 100}%` }}
          />
        </div>
      </section>
      <p className="hcm-screen-reader" role="status">
        Mốc {index + 1}: {scene.date}. {scene.title}. Bác ở{" "}
        {scene.location.name}.
      </p>
      <span className="hcm-screen-reader" role="status">
        {shareStatus === "copied"
          ? "Đã sao chép liên kết kèm mốc, từ khóa và góc nhìn bản đồ."
          : ""}
      </span>
    </main>
  );
};
