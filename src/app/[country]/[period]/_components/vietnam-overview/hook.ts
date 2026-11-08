"use client";

import { useEffect, useRef, useState } from "react";

import { vietnamOverview } from "~/data/vietnam-overview";
import type { OverviewSceneModel } from "~/data/vietnam-overview";
import { playGameSound } from "~/lib/game-audio";

export type OverviewTab = "story" | "culture" | "geography" | "people" | "sources";

// Hằng ở cấp module để effect đồng bộ hash không chạy lại mỗi lần render
const noAliases: Record<string, string> = {};

export const useVietnamOverview = (
  scenes: OverviewSceneModel[] = vietnamOverview,
  aliases: Record<string, string> = noAliases,
) => {
  const [index, setIndex] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackMs, setPlaybackMs] = useState(6000);
  const [tab, setTab] = useState<OverviewTab>("story");
  const [query, setQuery] = useState("");
  const [contentVisible, setContentVisible] = useState(true);
  const [timelineVisible, setTimelineVisible] = useState(true);
  const [placesVisible, setPlacesVisible] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const scene = scenes[index];

  const go = (next: number) => {
    const safeIndex = Math.max(0, Math.min(scenes.length - 1, next));
    setIndex(safeIndex);
    setSelectedPlace(0);
    if (safeIndex !== index) playGameSound("navigate");
    window.history.replaceState(null, "", `#${scenes[safeIndex].id}`);
    window.dispatchEvent(new Event("atlas:scene-change"));
    if (safeIndex === scenes.length - 1) setPlaying(false);
  };
  const changeTab = (next: OverviewTab) => {
    setTab(next);
    setPlaying(false);
  };

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      const next = scenes.findIndex(
        (item) => item.id === (aliases[hash] ?? hash),
      );
      if (next >= 0) {
        setIndex(next);
        setSelectedPlace(0);
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [aliases, scenes]);

  useEffect(() => {
    const track = rail.current;
    const active = track?.querySelector<HTMLElement>("[aria-current='step']");
    if (!track || !active) return;
    // Move only the clipped timeline, never the document or map.
    track.scrollTo({
      left: active.offsetLeft - track.clientWidth / 2 + active.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [index, query, timelineVisible]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      const next = index + 1;
      if (next >= scenes.length) {
        setPlaying(false);
        return;
      }
      setIndex(next);
      setSelectedPlace(0);
      playGameSound("navigate");
      window.history.replaceState(null, "", `#${scenes[next].id}`);
      window.dispatchEvent(new Event("atlas:scene-change"));
      if (next === scenes.length - 1) setPlaying(false);
    }, playbackMs);
    return () => window.clearTimeout(timer);
  }, [index, playbackMs, playing, scenes]);

  return {
    index,
    scene,
    selectedPlace,
    setSelectedPlace,
    playing,
    setPlaying,
    playbackMs,
    setPlaybackMs,
    tab,
    changeTab,
    query,
    setQuery,
    contentVisible,
    setContentVisible,
    timelineVisible,
    setTimelineVisible,
    placesVisible,
    setPlacesVisible,
    rail,
    go,
  };
};
