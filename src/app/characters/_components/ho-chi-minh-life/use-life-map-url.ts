"use client";

import { useCallback, useEffect, useState } from "react";

import { lifeScenes } from "~/data/ho-chi-minh";
import { defaultLifeMapState, readLifeMapUrl, writeLifeMapUrl } from "~/lib/life-map-url";
import type { LifeMapStateModel } from "~/lib/life-map-url";

const stopIds = lifeScenes.map((scene) => scene.id);
type MapUpdate = Partial<LifeMapStateModel> | ((previous: LifeMapStateModel) => Partial<LifeMapStateModel>);

export const useLifeMapUrl = () => {
  const [state, setState] = useState(() => defaultLifeMapState(stopIds[0]));
  const [ready, setReady] = useState(false);
  const update = useCallback((patch: MapUpdate) => setState((previous) => ({ ...previous, ...(typeof patch === "function" ? patch(previous) : patch) })), []);
  useEffect(() => {
    const sync = () => { setState(readLifeMapUrl(new URL(window.location.href), stopIds)); setReady(true); };
    const frame = requestAnimationFrame(sync);
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    // Keep dragging smooth while making the final camera position shareable.
    const timer = setTimeout(() => {
      const next = writeLifeMapUrl(new URL(window.location.href), state, stopIds[0]);
      if (next.href !== window.location.href) {
        window.history.replaceState(null, "", next);
        window.dispatchEvent(new Event("atlas:scene-change"));
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [ready, state]);
  const shareUrl = useCallback(() => writeLifeMapUrl(new URL(window.location.href), state, stopIds[0]).href, [state]);
  return { state, update, shareUrl };
};
