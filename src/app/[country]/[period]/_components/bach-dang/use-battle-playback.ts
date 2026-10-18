import { useCallback, useEffect, useRef, useState } from "react";

type UseBattlePlaybackProps = { total: number };

export const useBattlePlayback = ({ total }: UseBattlePlaybackProps) => {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(20);
  const [progress, setProgress] = useState(0);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const scrollLockUntil = useRef(0);
  const jump = useCallback((index: number) => {
    const bounded = Math.max(0, Math.min(total - 1, index));
    scrollLockUntil.current = Date.now() + 1200;
    setActive(bounded);
    const section = sections.current[bounded];
    if (!section) return;
    const mobile = window.innerWidth <= 760;
    const panelHeight = mobile ? (document.querySelector(".bd-map-panel")?.getBoundingClientRect().height ?? 0) : 0;
    const top = window.scrollY + section.getBoundingClientRect().top - panelHeight - 28;
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [total]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (Date.now() < scrollLockUntil.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.chapter));
      });
    }, { rootMargin: "-45% 0px -20% 0px", threshold: 0 });
    sections.current.forEach((section) => { if (section) observer.observe(section); });
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? window.scrollY / height : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (active >= total - 1) setPlaying(false);
      else jump(active + 1);
    }, seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [active, playing, seconds, total, jump]);

  useEffect(() => {
    const pause = () => setPlaying(false);
    const onKey = (event: KeyboardEvent) => { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) pause(); };
    const onVisibility = () => { if (document.hidden) pause(); };
    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchmove", pause, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { window.removeEventListener("wheel", pause); window.removeEventListener("touchmove", pause); window.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  const togglePlaying = () => {
    if (playing) setPlaying(false);
    else { jump(active === total - 1 ? 0 : active); setPlaying(true); }
  };
  return { active, playing, seconds, setSeconds, progress, sections, jump, togglePlaying };
};
