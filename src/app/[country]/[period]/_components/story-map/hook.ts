import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import {
  createMarkerElement,
  createRegionElement,
  createUnitElement,
  fadeOutMarker,
  type GeoJsonData,
  isFort,
  pointAlong,
  toBorderData,
  toFortCollection,
  toRouteCollection,
  toTerritoryData,
} from "./map-elements";
import {
  borderSourceId,
  fortSourceId,
  mapStyle,
  routeGradient,
  routeLayerIds,
  routeSourceId,
  sides,
  territorySourceId,
} from "./map-style";
import type { UseStoryMapProps } from "./type";

const flyMs = 3200;
// Đường bắt đầu chạy khi camera đã gần tới nơi, để người xem kịp nhìn thấy chuyển động
const routeDelayMs = 1400;
const routeDrawMs = 5000;
const chapterMs = 12000;
// Quân cờ dừng trước đích một chút để không đè lên nhãn địa danh
const unitStop = 0.93;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const setSourceData = (map: MapLibreMap, id: string, data: GeoJsonData) => {
  const source = map.getSource(id);
  if (source instanceof maplibregl.GeoJSONSource) source.setData(data);
};

const setRouteProgress = (map: MapLibreMap, t: number) => {
  for (const side of sides) {
    for (const id of routeLayerIds(side)) {
      map.setPaintProperty(id, "line-gradient", routeGradient(side, t), { validate: false });
    }
  }
};

export const useStoryMap = ({ story }: UseStoryMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const total = story.chapters.length;
  const chapter = story.chapters[index];
  const initialCamera = story.chapters[0]?.camera;

  const go = (delta: number) =>
    setIndex((current) => Math.min(Math.max(current + delta, 0), total - 1));

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !initialCamera) return;

    const instance = new maplibregl.Map({
      container,
      style: mapStyle,
      ...initialCamera,
      maxPitch: 75,
      attributionControl: { compact: true },
    });

    instance.on("load", () => {
      if (story.territory) {
        setSourceData(instance, territorySourceId, toTerritoryData(story.territory));
        setSourceData(instance, borderSourceId, toBorderData(story.territory));
      }
      for (const region of story.regions ?? []) {
        new maplibregl.Marker({ element: createRegionElement(region.label) })
          .setLngLat(region.at)
          .addTo(instance);
      }
      setMap(instance);
    });

    return () => {
      instance.remove();
      setMap(null);
    };
  }, [initialCamera, story.territory, story.regions]);

  useEffect(() => {
    // Fast Refresh chạy lại effect với map cũ đã remove(); lúc đó style không còn
    if (!map || !chapter || !map.style) return;

    // Đẩy tâm bản đồ ra khỏi vùng bị khung chương che
    const container = map.getContainer();
    const padding =
      container.clientWidth < 640
        ? { top: 60, bottom: container.clientHeight * 0.45, left: 0, right: 0 }
        : { top: 0, bottom: 0, left: 380, right: 0 };
    map.flyTo({ ...chapter.camera, padding, duration: flyMs, curve: 1.2, essential: true });

    const points = chapter.points ?? [];
    const routes = chapter.routes ?? [];

    setSourceData(map, fortSourceId, toFortCollection(points, chapter.camera.zoom));
    setSourceData(map, routeSourceId, toRouteCollection(routes));
    setRouteProgress(map, 0);

    const markers = points.map((point) =>
      new maplibregl.Marker({
        element: createMarkerElement(point),
        anchor: "bottom",
        // Nhấc nhãn lên khỏi khối thành 3D bên dưới
        offset: isFort(point) ? [0, -30] : [0, 0],
      })
        .setLngLat(point.at)
        .addTo(map),
    );
    const units = routes.map((route) =>
      new maplibregl.Marker({ element: createUnitElement(route), anchor: "bottom" })
        .setLngLat(route.path[0])
        .addTo(map),
    );

    const start = performance.now() + routeDelayMs;
    let frame = 0;
    const draw = (now: number) => {
      const raw = Math.min(Math.max((now - start) / routeDrawMs, 0), 1);
      const t = easeInOut(raw);
      setRouteProgress(map, t);
      units.forEach((unit, i) => unit.setLngLat(pointAlong(routes[i].path, Math.min(t, unitStop))));
      if (raw < 1) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      [...markers, ...units].forEach(fadeOutMarker);
    };
  }, [map, chapter]);

  useEffect(() => {
    if (!playing || !map) return;
    const timer = setTimeout(() => {
      if (index >= total - 1) setPlaying(false);
      else setIndex(index + 1);
    }, chapterMs);
    return () => clearTimeout(timer);
  }, [playing, map, index, total]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((current) => Math.min(current + 1, total - 1));
      if (event.key === "ArrowLeft") setIndex((current) => Math.max(current - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const togglePlaying = () => {
    // Bấm phát ở chương cuối thì chạy lại từ đầu
    if (!playing && index >= total - 1) setIndex(0);
    setPlaying(!playing);
  };

  return { containerRef, chapter, index, total, go, setIndex, playing, togglePlaying, chapterMs, ready: Boolean(map) };
};
