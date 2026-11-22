"use client";

import { useEffect } from "react";

const sectionIds = ["intro", "countries", "periods", "battles", "characters"];

export const HomeSectionTracker = () => {
  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section) => section !== null);
    let frame = 0;
    let animation = 0;
    let positions: { id: string; top: number }[] = [];

    const measureSections = () => {
      positions = sections.map((section) => ({
        id: section.id,
        top: section.getBoundingClientRect().top + window.scrollY,
      }));
    };

    const syncSection = () => {
      frame = 0;
      const readingLine = Math.max(96, window.innerHeight * 0.3);
      const atBottom = window.scrollY + window.innerHeight
        >= document.documentElement.scrollHeight - 4;
      if (animation) return;
      const active = atBottom
        ? positions.at(-1)
        : positions.filter((section) => (
          section.top <= window.scrollY + readingLine
        )).at(-1);

      if (!active || window.location.hash === `#${active.id}`) return;
      // Giữ state của Next và không thêm lịch sử ở mỗi lần cuộn.
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}#${active.id}`,
      );
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(syncSection);
    };

    const cancelAnimation = () => {
      window.cancelAnimationFrame(animation);
      animation = 0;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
        cancelAnimation();
      }
    };

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("a[href]")
        : null;
      if (!link || link.target || link.hasAttribute("download")) return;
      const destination = new URL(link.href);
      if (destination.origin !== window.location.origin
        || destination.pathname !== window.location.pathname
        || destination.search !== window.location.search) return;
      const target = sections.find((section) => `#${section.id}` === destination.hash);
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();
      cancelAnimation();
      const start = window.scrollY;
      const end = Math.max(0, Math.min(
        target.getBoundingClientRect().top + start - 24,
        document.documentElement.scrollHeight - window.innerHeight,
      ));
      if (window.location.hash !== destination.hash) {
        window.history.pushState(window.history.state, "", destination.href);
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo({ top: end, behavior: "instant" });
        return;
      }

      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / 240);
        const eased = 1 - (1 - progress) ** 3;
        window.scrollTo({ top: start + (end - start) * eased, behavior: "instant" });
        animation = progress < 1 ? window.requestAnimationFrame(step) : 0;
      };
      animation = window.requestAnimationFrame(step);
    };

    measureSections();
    const observer = new ResizeObserver(measureSections);
    sections.forEach((section) => observer.observe(section));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureSections);
    window.addEventListener("wheel", cancelAnimation, { passive: true });
    window.addEventListener("touchstart", cancelAnimation, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onAnchorClick, true);
    if (!window.location.hash) onScroll();

    return () => {
      window.cancelAnimationFrame(frame);
      cancelAnimation();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureSections);
      window.removeEventListener("wheel", cancelAnimation);
      window.removeEventListener("touchstart", cancelAnimation);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onAnchorClick, true);
    };
  }, []);

  return null;
};
