import { useCallback, useEffect, useState } from "react";

type UseBattlePlaybackProps = { total: number };

export const useBattlePlayback = ({ total }: UseBattlePlaybackProps) => {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(4);
  const jump = useCallback((index: number) => {
    setActive(Math.max(0, Math.min(total - 1, index)));
  }, [total]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (active >= total - 1) setPlaying(false);
      else setActive((current) => Math.min(current + 1, total - 1));
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
