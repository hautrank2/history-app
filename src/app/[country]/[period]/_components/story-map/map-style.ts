import type {
  ExpressionSpecification,
  GeoJSONSourceSpecification,
  LineLayerSpecification,
  RasterDEMSourceSpecification,
  StyleSpecification,
} from "maplibre-gl";

import type { SideModel } from "~/types";

// MapLibre không đọc được CSS custom property nên màu bản đồ khai báo ở đây
export const sideColor: Record<SideModel, string> = {
  home: "#f2c14e",
  enemy: "#e0465a",
  neutral: "#e8e2d0",
};

export const sides: SideModel[] = ["home", "enemy", "neutral"];

export const routeSourceId = "routes";
export const fortSourceId = "forts";
export const territorySourceId = "territory";
export const borderSourceId = "border";

export const routeLayerIds = (side: SideModel) => [`routes-${side}-glow`, `routes-${side}`];

const dem: RasterDEMSourceSpecification = {
  type: "raster-dem",
  tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
  encoding: "terrarium",
  tileSize: 256,
  maxzoom: 13,
  attribution: "Địa hình: Mapzen / AWS Terrain Tiles",
};

const empty: GeoJSONSourceSpecification = { type: "geojson", data: { type: "FeatureCollection", features: [] } };

// Phần đường từ 0 tới t có màu của phe, phần còn lại trong suốt
export const routeGradient = (side: SideModel, t: number): ExpressionSpecification => [
  "step",
  ["line-progress"],
  sideColor[side],
  t,
  "rgba(0,0,0,0)",
];

// line-gradient không nhận thuộc tính của feature nên mỗi phe cần một cặp layer màu cố định
const routeLayer = (id: string, side: SideModel, paint: LineLayerSpecification["paint"]): LineLayerSpecification => ({
  id,
  type: "line",
  source: routeSourceId,
  filter: ["==", ["get", "side"], side],
  layout: { "line-cap": "round", "line-join": "round" },
  paint: { "line-gradient": routeGradient(side, 0), ...paint },
});

const routeLayers = sides.flatMap((side) => {
  const [glow, line] = routeLayerIds(side);
  return [
    routeLayer(glow, side, { "line-width": 12, "line-opacity": 0.3, "line-blur": 8 }),
    routeLayer(line, side, { "line-width": 3.5 }),
  ];
});

export const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    // Hai nguồn riêng: MapLibre khuyến cáo không dùng chung nguồn cho terrain và hillshade
    terrain: dem,
    relief: dem,
    water: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
    [territorySourceId]: empty,
    [borderSourceId]: empty,
    // lineMetrics cần cho line-gradient, dùng để vẽ đường chạy dần mà không dựng lại dữ liệu
    [routeSourceId]: { ...empty, lineMetrics: true },
    [fortSourceId]: empty,
  },
  terrain: { source: "terrain", exaggeration: 2.5 },
  sky: {
    "sky-color": "#0d1626",
    "horizon-color": "#3b3423",
    "fog-color": "#1b2230",
    "fog-ground-blend": 0.6,
  },
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#22382c" } },
    {
      id: "relief-color",
      type: "color-relief",
      source: "relief",
      paint: {
        "color-relief-color": [
          "interpolate",
          ["linear"],
          ["elevation"],
          0, "#2a4533",
          40, "#47663c",
          150, "#7d8548",
          400, "#9a7b48",
          900, "#b39a78",
          2000, "#e6dccb",
        ],
      },
    },
    {
      id: "relief-shade",
      type: "hillshade",
      source: "relief",
      paint: {
        "hillshade-exaggeration": 0.7,
        "hillshade-shadow-color": "#0a120d",
        "hillshade-highlight-color": "#fff3cf",
      },
    },
    // Nằm dưới lớp nước để bờ biển tự cắt vùng tô
    {
      id: "territory-fill",
      type: "fill",
      source: territorySourceId,
      paint: { "fill-color": sideColor.home, "fill-opacity": 0.13 },
    },
    { id: "water", type: "fill", source: "water", "source-layer": "water", paint: { "fill-color": "#14354a" } },
    {
      id: "waterway",
      type: "line",
      source: "water",
      "source-layer": "waterway",
      paint: { "line-color": "#1d4a63", "line-width": 1.2 },
    },
    {
      id: "border-glow",
      type: "line",
      source: borderSourceId,
      paint: { "line-color": sideColor.home, "line-width": 10, "line-opacity": 0.45, "line-blur": 6 },
    },
    {
      id: "border",
      type: "line",
      source: borderSourceId,
      layout: { "line-join": "round" },
      paint: { "line-color": sideColor.home, "line-width": 3, "line-dasharray": [3, 2] },
    },
    ...routeLayers,
    {
      id: "forts",
      type: "fill-extrusion",
      source: fortSourceId,
      paint: {
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "base"],
      },
    },
  ],
};
