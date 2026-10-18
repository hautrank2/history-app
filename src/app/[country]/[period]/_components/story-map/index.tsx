"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";

import type { SideModel } from "~/types";

import { CharacterPortrait } from "./character-portrait";
import { useStoryMap } from "./hook";
import type { StoryMapProps } from "./type";

const buttonClass =
  "border border-primary px-4 py-2 text-sm font-semibold tracking-widest uppercase transition enabled:hover:bg-primary enabled:hover:text-primary-foreground disabled:opacity-30";

const sideClass: Record<SideModel, string> = {
  home: "border-home text-home",
  enemy: "border-enemy text-enemy",
  neutral: "border-border text-foreground",
};

export const StoryMap = ({ story, backHref }: StoryMapProps) => {
  const { containerRef, chapter, index, total, go, setIndex, playing, togglePlaying, chapterMs, ready } =
    useStoryMap({ story });

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* maplibre-gl.css ép container thành position: relative nên phải dùng kích thước, không dùng inset */}
      <div ref={containerRef} className="size-full" />

      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 bg-linear-to-b from-background to-transparent p-4 pb-12">
        <div>
          <Link
            href={backHref}
            className="pointer-events-auto text-xs tracking-widest text-primary uppercase hover:underline"
          >
            ◀ Dòng thời gian
          </Link>
          <h1 className="mt-1 font-display text-3xl font-bold">{story.title}</h1>
          <p className="text-sm text-muted-foreground">{story.subtitle}</p>
        </div>
        <ul className="flex flex-col gap-1 border border-border bg-card/90 px-3 py-2 text-xs">
          <li className="flex items-center gap-2">
            <span className="h-1 w-5 bg-home" />
            {story.sides.home}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-5 bg-enemy" />
            {story.sides.enemy}
          </li>
          {story.territory ? (
            <li className="flex items-center gap-2">
              <span className="w-5 border-t-2 border-dashed border-home" />
              Biên giới (ước lượng)
            </li>
          ) : null}
        </ul>
      </header>

      {chapter ? (
        <section className="absolute inset-x-2 bottom-2 border-2 border-border bg-card/95 p-3 shadow-2xl sm:inset-x-auto sm:bottom-8 sm:left-4 sm:w-104 sm:p-5">
          {/* key đổi theo chương để nội dung chạy lại hiệu ứng hiện dần */}
          <div key={index} className="chapter-fade">
            <p className="text-xs tracking-widest text-primary uppercase">
              Chương {index + 1}/{total} · {chapter.date}
            </p>
            <h2 className="mt-1 font-display text-lg font-bold sm:text-2xl">{chapter.title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-foreground/85 sm:mt-3 sm:text-sm">{chapter.text}</p>

            {chapter.characters ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {chapter.characters.map((character) => (
                  <li key={character.name} className={`flex items-center gap-2 pr-2 ${sideClass[character.side]}`}>
                    <CharacterPortrait
                      portrait={character.portrait}
                      className="h-12 w-10 shrink-0 border-2 border-current bg-background sm:h-[4.2rem] sm:w-14"
                    />
                    <span className="text-foreground">
                      <span className="block text-sm leading-tight font-semibold">{character.name}</span>
                      <span className="hidden text-[11px] text-muted-foreground sm:block">{character.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mt-3 h-1 bg-border/30 sm:mt-5">
            {playing && ready ? (
              <div
                key={index}
                className="chapter-progress h-full bg-primary"
                style={{ animationDuration: `${chapterMs}ms` }}
              />
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button type="button" className={buttonClass} disabled={index === 0} onClick={() => go(-1)}>
              Trước
            </button>
            <button
              type="button"
              className={buttonClass}
              aria-label={playing ? "Tạm dừng" : "Tự động phát"}
              onClick={togglePlaying}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <div className="flex gap-2">
              {story.chapters.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Chương ${i + 1}: ${item.title}`}
                  onClick={() => setIndex(i)}
                  className={`size-3 rotate-45 border border-primary transition ${i === index ? "bg-primary" : ""}`}
                />
              ))}
            </div>
            <button
              type="button"
              className={buttonClass}
              disabled={index === total - 1}
              onClick={() => go(1)}
            >
              Tiếp
            </button>
          </div>

          {story.note ? (
            <p className="mt-4 hidden text-[11px] text-muted-foreground sm:block">{story.note}</p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
};
