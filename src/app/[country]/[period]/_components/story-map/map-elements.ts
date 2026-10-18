import type { GeoJSONSource } from "maplibre-gl";

import type { LngLatModel, MapPointModel, MapRouteModel, TerritoryModel } from "~/types";

import { pointIcon, unitSvg } from "./map-icons";
import { sideColor } from "./map-style";

export type GeoJsonData = Parameters<GeoJSONSource["setData"]>[0];
type FeatureCollectionData = Extract<GeoJsonData, { type: "FeatureCollection" }>;
type FeatureData = FeatureCollectionData["features"][number];

const leaveMs = 300;

// MapLibre tự đặt transform lên phần tử gốc của marker, nên hiệu ứng phải nằm ở phần tử con
const wrap = (inner: HTMLElement) => {
  const root = document.createElement("div");
  root.append(inner);
  return root;
};

export const isFort = (point: MapPointModel) => point.kind === "capital" || point.kind === "city";

export const createMarkerElement = (point: MapPointModel) => {
  const element = document.createElement("div");
  element.className = "map-marker";
  element.dataset.side = point.side ?? "neutral";
  element.dataset.kind = point.kind;

  const label = document.createElement("span");
  label.className = "map-marker-label";
  label.textContent = point.label;

  const badge = document.createElement("span");
  badge.className = "map-marker-icon";
  badge.innerHTML = pointIcon[point.kind];

  element.append(label, badge);
  return wrap(element);
};

export const createUnitElement = (route: MapRouteModel) => {
  const element = document.createElement("div");
  element.className = "map-unit";
  element.dataset.side = route.side;
  element.innerHTML = unitSvg[route.unit ?? "army"];
  return wrap(element);
};

export const createRegionElement = (label: string) => {
  const element = document.createElement("span");
  element.className = "map-region";
  element.textContent = label;
  return wrap(element);
};

// Cho phần tử con mờ dần rồi mới gỡ marker, tránh biến mất đột ngột khi đổi chương
export const fadeOutMarker = (marker: { getElement: () => HTMLElement; remove: () => unknown }) => {
  marker.getElement().firstElementChild?.classList.add("is-leaving");
  setTimeout(() => marker.remove(), leaveMs);
};

// Điểm trên đường tại tỉ lệ t (0..1) theo chiều dài
export const pointAlong = (path: LngLatModel[], t: number): LngLatModel => {
  const lengths = path.slice(1).map((point, i) => Math.hypot(point[0] - path[i][0], point[1] - path[i][1]));
  let remaining = lengths.reduce((sum, length) => sum + length, 0) * t;

  for (const [i, length] of lengths.entries()) {
    if (remaining > length) {
      remaining -= length;
      continue;
    }
    const ratio = length === 0 ? 0 : remaining / length;
    const from = path[i];
    const to = path[i + 1];
    return [from[0] + (to[0] - from[0]) * ratio, from[1] + (to[1] - from[1]) * ratio];
  }
  return path[path.length - 1];
};

export const toRouteCollection = (routes: MapRouteModel[]): GeoJsonData => ({
  type: "FeatureCollection",
  features: routes.map((route) => ({
    type: "Feature",
    properties: { side: route.side },
    geometry: { type: "LineString", coordinates: route.path },
  })),
});

export const toBorderData = (territory: TerritoryModel): GeoJsonData => ({
  type: "Feature",
  properties: {},
  geometry: { type: "LineString", coordinates: territory.border },
});

export const toTerritoryData = (territory: TerritoryModel): GeoJsonData => ({
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [[...territory.border, ...territory.seaClosure, territory.border[0]]],
  },
});

const square = (center: LngLatModel, half: number): LngLatModel[] => {
  const dLat = half / 111320;
  const dLng = half / (111320 * Math.cos((center[1] * Math.PI) / 180));
  const [x, y] = center;
  return [
    [x - dLng, y - dLat],
    [x + dLng, y - dLat],
    [x + dLng, y + dLat],
    [x - dLng, y + dLat],
    [x - dLng, y - dLat],
  ];
};

const block = (rings: LngLatModel[][], base: number, height: number, color: string): FeatureData => ({
  type: "Feature",
  properties: { base, height, color },
  geometry: { type: "Polygon", coordinates: rings },
});

const stone = "#a8997a";
const stoneDark = "#6f6450";
const fortPx = 15;

// Thành trì dựng từ các khối đùn: tường rỗng ruột, bốn tháp góc, điện giữa (kinh đô thêm một tầng)
const toFort = (point: MapPointModel, zoom: number): FeatureData[] => {
  const [x, y] = point.at;
  // Đổi kích thước theo zoom đích để thành luôn chiếm cỡ fortPx điểm ảnh trên màn hình
  const half = (fortPx * 78271 * Math.cos((y * Math.PI) / 180)) / 2 ** zoom;
  const dLat = (half * 0.82) / 111320;
  const dLng = (half * 0.82) / (111320 * Math.cos((y * Math.PI) / 180));
  const roof = sideColor[point.side ?? "neutral"];

  const corners: LngLatModel[] = [
    [x - dLng, y - dLat],
    [x + dLng, y - dLat],
    [x + dLng, y + dLat],
    [x - dLng, y + dLat],
  ];

  return [
    block([square(point.at, half), square(point.at, half * 0.74).reverse()], 0, half * 0.3, stone),
    ...corners.map((corner) => block([square(corner, half * 0.24)], 0, half * 0.55, stoneDark)),
    block([square(point.at, half * 0.42)], 0, half * 0.6, stoneDark),
    block([square(point.at, half * 0.5)], half * 0.6, half * 0.72, roof),
    ...(point.kind === "capital"
      ? [
          block([square(point.at, half * 0.26)], half * 0.72, half * 1.05, stoneDark),
          block([square(point.at, half * 0.34)], half * 1.05, half * 1.17, roof),
        ]
      : []),
  ];
};

export const toFortCollection = (points: MapPointModel[], zoom: number): GeoJsonData => ({
  type: "FeatureCollection",
  features: points.filter(isFort).flatMap((point) => toFort(point, zoom)),
});
