"use client";

import { useEffect, useRef, useState } from "react";

import { vietnamOverview } from "~/data/vietnam-overview";

export type OverviewTab = "story" | "culture" | "geography" | "people" | "sources";

export const useVietnamOverview = () => {
  const [index, setIndex] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playbackMs, setPlaybackMs] = useState(6000);
  const [tab, setTab] = useState<OverviewTab>("story");
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [contentVisible, setContentVisible] = useState(true);
  const [timelineVisible, setTimelineVisible] = useState(true);
  const [placesVisible, setPlacesVisible] = useState(false);
  const [textBudget, setTextBudget] = useState(220);
  const rail = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const scene = vietnamOverview[index];

  const go = (next: number) => {
    const safeIndex = Math.max(0, Math.min(vietnamOverview.length - 1, next));
    setIndex(safeIndex); setSelectedPlace(0); setPage(0);
    window.history.replaceState(null, "", `#${vietnamOverview[safeIndex].id}`);
    if (safeIndex === vietnamOverview.length - 1) setPlaying(false);
  };
  const changeTab = (next: OverviewTab) => { setTab(next); setPage(0); setPlaying(false); };

  useEffect(() => {
    const syncHash = () => {
      const next = vietnamOverview.findIndex((item) => item.id === window.location.hash.slice(1));
      if (next >= 0) { setIndex(next); setSelectedPlace(0); setPage(0); }
    };
    syncHash(); window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const track = rail.current;
    const active = track?.querySelector<HTMLElement>("[aria-current='step']");
    if (!track || !active) return;
    // Move only the clipped timeline, never the document or map.
    track.scrollTo({ left: active.offsetLeft - track.clientWidth / 2 + active.clientWidth / 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [index, query, timelineVisible]);

  useEffect(() => {
    const element = body.current;
    if (!element) return;
    // Reading pages fit the floating panel instead of introducing a scrollbar.
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width < 1 || height < 1) return;
      const lines = Math.max(2, Math.floor((height - 22) / 22));
      setTextBudget(Math.max(90, Math.min(560, lines * Math.floor(width / 7))));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      const next = index + 1;
      if (next >= vietnamOverview.length) { setPlaying(false); return; }
      setIndex(next); setSelectedPlace(0); setPage(0);
      window.history.replaceState(null, "", `#${vietnamOverview[next].id}`);
      if (next === vietnamOverview.length - 1) setPlaying(false);
    }, playbackMs);
    return () => window.clearTimeout(timer);
  }, [index, playbackMs, playing]);

  return { index, scene, selectedPlace, setSelectedPlace, playing, setPlaying, playbackMs, setPlaybackMs, tab, changeTab, page, setPage, query, setQuery, contentVisible, setContentVisible, timelineVisible, setTimelineVisible, placesVisible, setPlacesVisible, textBudget, rail, body, go };
};
