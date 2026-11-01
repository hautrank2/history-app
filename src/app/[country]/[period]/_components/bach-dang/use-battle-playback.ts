import { useCallback, useEffect, useState } from "react";
import { playGameSound } from "~/lib/game-audio";

type UseBattlePlaybackProps = { total: number };

export const useBattlePlayback = ({ total }: UseBattlePlaybackProps) => {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(4);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("atlas:music-context", { detail: { chapter: active } }));
  }, [active]);
  const jump = useCallback((index: number) => {
    const next = Math.max(0, Math.min(total - 1, index));
    setActive(next);
    playGameSound(next === 6 ? "victory" : next === 5 ? "battle" : "march");
  }, [total]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (active >= total - 1) setPlaying(false);
      else { setActive(Math.min(active + 1, total - 1)); playGameSound(active + 1 === 6 ? "victory" : active + 1 === 5 ? "battle" : "march"); }
    }, seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [active, playing, seconds, total]);

  useEffect(() => {
    const onVisibility = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const togglePlaying = () => {
    if (playing) setPlaying(false);
    else {
      // Start with an immediate scene change so playback responds to the click.
      jump(active >= total - 1 ? 0 : active + 1);
      setPlaying(true);
    }
  };
  return { active, playing, seconds, setSeconds, jump, togglePlaying };
};
