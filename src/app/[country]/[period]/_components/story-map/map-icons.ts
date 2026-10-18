import type { PointKindModel, UnitKindModel } from "~/types";

// Chuỗi SVG tĩnh, gán bằng innerHTML cho marker MapLibre tạo ngoài React.
// Màu phe lấy qua currentColor; các màu còn lại là màu vật liệu cố định.

const icon = (d: string) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

export const pointIcon: Record<PointKindModel, string> = {
  capital: icon("M3 21h18M6 21v-6h12v6M4 15l8-4 8 4M8 11V8h8v3M6 8l6-4 6 4M12 21v-3"),
  city: icon("M4 21V9h3v3h3V9h4v3h3V9h3v12zM10 21v-5h4v5"),
  battle: icon("M5 4l11 11M19 4L8 15M14 17l4-4M10 17l-4-4M17 18l2 2M7 18l-2 2"),
  ambush: icon("M3 20l6-10 4 6 2-3 6 7zM9 3v4M15 5v4"),
  stakes: icon("M3 21h18M5 21l2-12 2 12M11 21l2-16 2 16M17 21l1.5-10L20 21"),
  port: icon("M12 7v13M12 7a2 2 0 100-4 2 2 0 000 4zM5 13a7 7 0 0014 0M8 11h8"),
};

const flag = (x: number) =>
  `<path d="M${x} 3V50" stroke="#e8e2d0" stroke-width="2"/><g class="map-unit-flag"><path d="M${x} 4l15 5-15 6z" fill="currentColor"/></g>`;

const soldier = (x: number) =>
  `<path d="M${x + 9} 20V50" stroke="#e8e2d0" stroke-width="1.5"/><path d="M${x + 9} 15l-2.5 6h5z" fill="#e8e2d0"/>` +
  `<path d="M${x - 6} 50V38q6-7 12 0v12z" fill="currentColor" stroke="#14181f"/>` +
  `<circle cx="${x}" cy="30" r="4.5" fill="#e8c9a0"/><path d="M${x - 8} 29l8-8 8 8z" fill="#3b2a1a"/>`;

export const unitSvg: Record<UnitKindModel, string> = {
  army:
    `<svg viewBox="0 0 70 56" width="60" height="48">${flag(52)}${soldier(12)}${soldier(30)}` +
    `<circle cx="22" cy="44" r="7" fill="#3b2a1a" stroke="#e8e2d0" stroke-width="1.5"/></svg>`,
  cavalry:
    `<svg viewBox="0 0 70 56" width="60" height="48">${flag(34)}` +
    `<path d="M8 32q3-6 12-6h18l7-11 6 2-2 6 5 6-4 3-5-3-1 7 3 13h-4l-5-11H24l-3 11h-4l2-13q-8-2-11-10z" fill="#5a3d28" stroke="#14181f"/>` +
    `<path d="M9 31q-5 4-4 12" stroke="#2a1c12" stroke-width="2.5" fill="none"/>` +
    `<path d="M24 28V17q5-5 10 0v11z" fill="currentColor" stroke="#14181f"/>` +
    `<circle cx="29" cy="11" r="4.5" fill="#e8c9a0"/><path d="M23 9h12l-2-5h-8z" fill="#6b4a2b"/></svg>`,
  fleet:
    `<svg viewBox="0 0 70 56" width="64" height="52">${flag(36)}` +
    `<path d="M38 15q16 9 0 21z" fill="#e8e2d0"/><path d="M34 15q-13 9 0 21z" fill="#cfc7b0"/>` +
    `<path d="M22 22q-8 6 0 14z" fill="#cfc7b0"/><path d="M22 20v17" stroke="#3b2a1a" stroke-width="1.5"/>` +
    `<path d="M26 22h20M26 29h22M27 36h18" stroke="#8c7a5b" stroke-width="1"/>` +
    `<path d="M6 38h54l4-4-9 16H14z" fill="#3b2a1a" stroke="currentColor" stroke-width="2"/>` +
    `<path d="M18 44h34" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 4"/></svg>`,
};
