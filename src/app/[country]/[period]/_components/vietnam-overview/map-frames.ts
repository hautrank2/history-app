import northwestEurope from "~/data/geo/northwest-europe.json";
import geography from "~/data/geo/world.json";
import type { EuropeCountryId } from "~/data/europe-overview";

export type MapFrameId = "china" | EuropeCountryId;

export type MapFrameModel = {
  ariaLabel: string;
  project: (point: number[]) => number[];
  countries: { name: string; path: string }[];
  labels: { at: [number, number]; text: string; sea?: boolean }[];
};

export const ringPathWith = (project: MapFrameModel["project"]) =>
  (ring: number[][]) => `${ring.map((point, index) =>
    `${index ? "L" : "M"}${project(point).map((value) => value.toFixed(1)).join(",")}`,
  ).join("")}Z`;

const outline = (
  names: string[],
  project: MapFrameModel["project"],
) => {
  const ringPath = ringPathWith(project);
  return geography
    .filter((country) => names.includes(country.name))
    .map((country) => {
      const polygons = country.geometry.type === "Polygon"
        ? [country.geometry.coordinates as number[][][]]
        : country.geometry.coordinates as number[][][][];
      return {
        name: country.name,
        path: polygons.map((polygon) => polygon.map(ringPath).join("")).join(""),
      };
    });
};

// Equirectangular quanh tâm khung; nhân cos(vĩ độ) để vùng cực bắc không
// bị kéo ngang. (560, 430) là tâm mà bản đồ dùng làm điểm nhìn mặc định.
const centeredProject = (center: [number, number], scale: number) => {
  const xScale = scale * Math.cos(center[1] * Math.PI / 180);
  return ([longitude, latitude]: number[]) => [
    560 + (longitude - center[0]) * xScale,
    430 + (center[1] - latitude) * scale,
  ];
};

const chinaProject = ([longitude, latitude]: number[]) => [
  (longitude - 75) * 16,
  (55 - latitude) * 20,
];
const englandProject = centeredProject([-5.5, 54], 72);
const denmarkProject = centeredProject([9, 56], 150);
const norwayProject = centeredProject([8, 63.5], 62);

const northernEurope = [
  "United Kingdom", "Ireland", "France", "Belgium", "Netherlands",
  "Luxembourg", "Germany", "Denmark", "Norway", "Sweden", "Finland",
  "Poland", "Russia", "Estonia", "Latvia", "Lithuania", "Iceland",
];

const englandBase = [
  ...outline(northernEurope.filter((name) => name !== "United Kingdom"
    && !(name in northwestEurope)), englandProject),
  ...Object.entries(northwestEurope).map(([name, rings]) => ({
    name, path: rings.map(ringPathWith(englandProject)).join(""),
  })),
];

export const mapFrames: Record<MapFrameId, MapFrameModel> = {
  china: {
    ariaLabel: "Bản đồ lịch sử Trung Quốc hai chiều",
    project: chinaProject,
    countries: outline([
      "China", "Mongolia", "Russia", "India", "Nepal", "Bhutan", "Pakistan",
      "Afghanistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Myanmar",
      "Thailand", "Laos", "Vietnam", "Cambodia", "Taiwan", "Japan",
      "North Korea", "South Korea", "Philippines", "Bangladesh",
    ], chinaProject),
    labels: [
      { at: [112.5, 37.5], text: "ĐÔNG Á" },
      { at: [136.25, 22.5], text: "THÁI BÌNH DƯƠNG", sea: true },
    ],
  },
  england: {
    ariaLabel: "Bản đồ lịch sử nước Anh hai chiều",
    project: englandProject,
    countries: englandBase,
    labels: [
      { at: [3, 55.5], text: "BIỂN BẮC", sea: true },
      { at: [-10.5, 51], text: "ĐẠI TÂY DƯƠNG", sea: true },
      { at: [2.5, 48.6], text: "PHÁP" },
    ],
  },
  denmark: {
    ariaLabel: "Bản đồ lịch sử Đan Mạch hai chiều",
    project: denmarkProject,
    countries: outline(northernEurope, denmarkProject),
    labels: [
      { at: [6.6, 56.2], text: "BIỂN BẮC", sea: true },
      { at: [15, 55], text: "BIỂN BALTIC", sea: true },
      { at: [14.5, 57.5], text: "THỤY ĐIỂN" },
    ],
  },
  norway: {
    ariaLabel: "Bản đồ lịch sử Na Uy hai chiều",
    project: norwayProject,
    countries: outline(northernEurope, norwayProject),
    labels: [
      { at: [2.5, 63], text: "BIỂN NA UY", sea: true },
      { at: [3, 57.5], text: "BIỂN BẮC", sea: true },
      { at: [17, 62.5], text: "THỤY ĐIỂN" },
    ],
  },
};
