"use client";

import { useCallback, useEffect, useState } from "react";
import type { SetStateAction } from "react";

type UseLifePlaybackProps = {
  index: number;
  count: number;
  onGo: (index: number) => void;
};

export const lifePlaybackSeconds = [3, 5, 10, 14, 20, 30] as const;

export const useLifePlayback = ({ index, count, onGo }: UseLifePlaybackProps) => {
  const [playing, updatePlaying] = useState(false);
  const [seconds, updateSeconds] = useState(14);
  const [progress, setProgress] = useState(0);
  const setPlaying = useCallback((value: SetStateAction<boolean>) => {
    setProgress(0);
    updatePlaying(value);
  }, []);
  const setSeconds = (value: string) => {
    const next = Number(value);
    if (!lifePlaybackSeconds.some((option) => option === next)) return;
    setProgress(0);
    updateSeconds(next);
  };

  useEffect(() => {
    if (!playing) return;
    const started = performance.now();
    const duration = seconds * 1000;
    const ticker = window.setInterval(() => {
      setProgress(Math.min(100, ((performance.now() - started) / duration) * 100));
    }, 100);
    const timer = window.setTimeout(() => {
      setProgress(0);
      if (index < count - 1) onGo(index + 1);
      else setPlaying(false);
    }, duration);
    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(timer);
    };
  }, [count, index, onGo, playing, seconds, setPlaying]);

  useEffect(() => {
    const pause = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, [setPlaying]);

  return { playing, setPlaying, seconds, setSeconds, progress };
};
