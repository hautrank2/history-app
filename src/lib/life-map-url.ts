export type LifeMapCameraModel = { zoom: number; x: number; y: number };
export type LifeMapStateModel = {
  stop: string; view: "map" | "story"; map: "world" | "focus";
  q: string; routes: boolean; points: boolean; borders: boolean; camera: LifeMapCameraModel;
};
export const defaultLifeMapState = (stop: string): LifeMapStateModel => ({
  stop, view: "map", map: "world", q: "", routes: false, points: false, borders: true, camera: { zoom: 1, x: 0, y: 0 },
});
const numberInRange = (value: string | null, fallback: number, min: number, max: number) => {
  if (value === null || !value.trim()) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
};
export const clampLifeMapCamera = (camera: LifeMapCameraModel): LifeMapCameraModel => ({
  zoom: numberInRange(String(camera.zoom), 1, .65, 12),
  x: numberInRange(String(camera.x), 0, -1000, 1000),
  y: numberInRange(String(camera.y), 0, -600, 600),
});
export const readLifeMapUrl = (url: URL, stopIds: string[]): LifeMapStateModel => {
  const params = url.searchParams;
  const legacyStop = url.hash.slice(1);
  const stop = params.get("stop");
  return {
    stop: stop && stopIds.includes(stop) ? stop : stopIds.includes(legacyStop) ? legacyStop : stopIds[0],
    view: params.get("view") === "story" || !params.has("view") && stopIds.includes(legacyStop) ? "story" : "map",
    map: params.get("map") === "focus" ? "focus" : "world",
    q: (params.get("q") ?? "").slice(0, 120),
    routes: params.get("routes") === "1", points: params.get("points") === "1", borders: params.get("borders") !== "0",
    camera: { zoom: numberInRange(params.get("z"), 1, .65, 12), x: numberInRange(params.get("x"), 0, -1000, 1000), y: numberInRange(params.get("y"), 0, -600, 600) },
  };
};
export const writeLifeMapUrl = (url: URL, state: LifeMapStateModel): URL => {
  const next = new URL(url);
  const params = next.searchParams;
  params.set("view", state.view); params.set("stop", state.stop); params.set("map", state.map);
  const optional = (key: string, value: string | null) => { if (value === null) params.delete(key); else params.set(key, value); };
  optional("q", state.q.trim() || null);
  optional("routes", state.routes ? "1" : null); optional("points", state.points ? "1" : null); optional("borders", state.borders ? null : "0");
  optional("z", state.camera.zoom === 1 ? null : state.camera.zoom.toFixed(3));
  optional("x", Math.abs(state.camera.x) < .01 ? null : state.camera.x.toFixed(2));
  optional("y", Math.abs(state.camera.y) < .01 ? null : state.camera.y.toFixed(2));
  next.hash = "";
  return next;
};
