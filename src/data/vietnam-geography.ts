import detail from "~/data/geo/vietnam-detail.json";
import rivers from "~/data/geo/vietnam-rivers.json";

export type GeographyProjectModel = (point: number[]) => number[];

// Điểm định vị gần đúng; ký hiệu đảo không phải đường ranh giới biển.
export const vietnamIslands = [
  {
    id: "hoang-sa",
    name: "Hoàng Sa",
    at: [112, 16.5],
    points: [[111.2, 15.8], [111.6, 16.53], [111.51, 16.45], [112.33, 16.84], [112.7, 16.6]],
  },
  {
    id: "truong-sa",
    name: "Trường Sa",
    at: [114.3, 10.5],
    points: [[111.92, 8.64], [112.5, 9], [113.3, 9.6], [114.3, 10.2], [114.5, 11.4], [115.8, 10.7]],
  },
  {
    id: "phu-quoc",
    name: "Phú Quốc",
    at: [104.01, 10.28],
    points: [[104.01, 10.28]],
  },
] as const;

export const vietnamReferencePlaces = [
  { name: "Hà Nội", at: [105.85, 21.03] },
  { name: "Điện Biên Phủ", at: [103.02, 21.39] },
  { name: "Vinh", at: [105.68, 18.67] },
  { name: "Huế", at: [107.58, 16.46] },
  { name: "Đà Nẵng", at: [108.2, 16.05] },
  { name: "Nha Trang", at: [109.19, 12.24] },
  { name: "TP. Hồ Chí Minh", at: [106.7, 10.78] },
  { name: "Cần Thơ", at: [105.79, 10.04] },
  { name: "Cà Mau", at: [105.15, 9.18] },
];

export const geographicLine = (
  points: readonly (readonly number[])[],
  project: GeographyProjectModel,
) => points.map((point, index) =>
  `${index ? "L" : "M"}${project([...point]).map((n) => n.toFixed(3)).join(",")}`,
).join("");

export const vietnamLandPath = (project: GeographyProjectModel) =>
  detail.geometry.coordinates.map((polygon) =>
    polygon.map((ring) => `${geographicLine(ring, project)}Z`).join(""),
  ).join("");

export const vietnamRiverPaths = (project: GeographyProjectModel) =>
  rivers.map((river) => ({
    name: river.name,
    path: river.lines.map((line) => geographicLine(line, project)).join(""),
  }));
