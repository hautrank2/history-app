"use client";

import { useEffect, useId, useRef, useState } from "react";

import { VietnamGeographyLayer, VietnamIslandLayer } from "~/components/vietnam-map-reference";
import { geographicLine, vietnamLandPath } from "~/data/vietnam-geography";
import { vietnamBattleTerritory } from "~/data/vietnam-battle-territories";
import geography from "~/data/geo/southeast-asia.json";
import type { VietnamBattleModel } from "~/data/vietnam-battles";
import { clusterMapPoints } from "~/lib/map-clusters";

type CampaignMapProps = {
  battle: VietnamBattleModel;
  stage: number;
  selected: string;
  onSelect: (place: string) => void;
};

export const CampaignMap = ({
  battle,
  stage,
  selected,
  onSelect,
}: CampaignMapProps) => {
  const id = useId().replaceAll(":", "");
  const [zoom, setZoom] = useState(1);
  const [wide, setWide] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 600, height: 520 });
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const current = battle.chapters[stage];
  const eventPlaces = battle.places.filter((place) => current.placeIds.includes(place.id));
  const viewPlaces = wide ? [[98, 8], [112, 26], ...eventPlaces.map((place) => place.at)] : eventPlaces.map((place) => place.at);
  const xs = viewPlaces.map((point) => point[0]);
  const ys = viewPlaces.map((point) => point[1]);
  const center = [(Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...ys) + Math.max(...ys)) / 2];
  const xFactor = Math.cos(center[1] * Math.PI / 180);
  const scale = Math.min(
    410 / Math.max(.08, (Math.max(...xs) - Math.min(...xs)) * xFactor),
    330 / Math.max(.08, Math.max(...ys) - Math.min(...ys)),
  );
  const project = ([longitude, latitude]: number[]) => [
    300 + (longitude - center[0]) * xFactor * scale,
    255 + (center[1] - latitude) * scale,
  ];
  const territory = vietnamBattleTerritory(battle.id, project);
  const selectedAt = battle.places.find((place) => place.name === selected)?.at;
  const [focusX, focusY] = zoom > 1 && selectedAt ? project(selectedAt) : [300, 260];
  const pixelsPerUnit = Math.max(.01, Math.min(size.width / 600, size.height / 520) * zoom);
  const clusters = clusterMapPoints(battle.places.map((place, index) => {
    const [x, y] = project(place.at);
    return { index, x: x * pixelsPerUnit, y: y * pixelsPerUnit };
  }), 48);
  const expandedCluster = clusters.find((cluster) => cluster.id === expanded);
  const activePlaces = current.placeIds.flatMap((placeId) =>
    battle.places.filter((place) => place.id === placeId),
  );
  const route = activePlaces.map((place, index) =>
    `${index ? "L" : "M"}${project(place.at).join(",")}`,
  ).join("");

  return (
    <div className="bd-campaign-map relative overflow-hidden rounded-lg border border-border bg-background">
      <svg
        ref={svg}
        className="bd-battle-map"
        viewBox={`${focusX - 300 / zoom} ${focusY - 260 / zoom} ${600 / zoom} ${520 / zoom}`}
        role="group"
        aria-label={`Bản đồ ${battle.title}, ${current.title}. Địa điểm gần đúng.`}
      >
        <defs>
          <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--atlas-line)" strokeWidth=".5" />
          </pattern>
          <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0 0 10 5 0 10Z" fill="var(--atlas-gold)" />
          </marker>
        </defs>
        <rect x="-4000" y="-4000" width="9000" height="9000" fill="var(--background)" />
        <g aria-label="Biên giới quốc gia hiện đại để định hướng">
          {geography.map((country) => {
            const polygons = country.geometry.type === "Polygon"
              ? [country.geometry.coordinates as number[][][]] : country.geometry.coordinates as number[][][][];
            return <path key={country.name} d={country.name === "Vietnam" ? vietnamLandPath(project)
              : polygons.map((polygon) => polygon.map((ring) => `${geographicLine(ring, project)}Z`).join("")).join("")}
              fill="#253b42" stroke="#82999c" strokeWidth=".8" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />;
          })}
        </g>
        <g aria-label={`Lãnh thổ lịch sử: ${territory.name}`}>
          <path d={territory.path} fill="#b7a268" fillOpacity=".28" stroke="#edc78a" strokeWidth="1.8" vectorEffect="non-scaling-stroke"><title>{territory.note}</title></path>
        </g>
        <rect x="-4000" y="-4000" width="9000" height="9000" fill={`url(#${id}-grid)`} />
        <VietnamGeographyLayer project={project} places={false} outline={false} />
        <VietnamIslandLayer project={project} unitsPerPixel={1 / pixelsPerUnit} />
        {wide && [ { name: territory.name, at: territory.label }, ...territory.neighbors ].map((label) => {
          const [x, y] = project(label.at);
          return <text key={label.name} x={x} y={y} textAnchor="middle" fill="#e4d8bc" fontSize="9" paintOrder="stroke" stroke="#162830" strokeWidth="2">{label.name}</text>;
        })}
        <path
          d={route}
          fill="none"
          stroke="var(--atlas-gold)"
          strokeWidth="2"
          strokeDasharray="6 5"
          markerEnd={activePlaces.length > 1 ? `url(#${id}-arrow)` : undefined}
          vectorEffect="non-scaling-stroke"
        />
        {clusters.map((cluster) => {
          const members = cluster.indices.map((index) => battle.places[index]);
          const place = members[0];
          const x = cluster.x / pixelsPerUnit;
          const y = cluster.y / pixelsPerUnit;
          const active = members.some((member) => current.placeIds.includes(member.id));
          const isSelected = members.some((member) => selected === member.name);
          const label = members.length > 1
            ? `${members.find((member) => current.placeIds.includes(member.id))?.name ?? place.name} · ${members.length} điểm`
            : place.name;
          const choose = () => {
            if (members.length > 1) setExpanded(cluster.id);
            else { onSelect(place.name); setExpanded(null); }
          };
          return (
            <g
              key={cluster.id}
              data-place-id={place.id}
              className={`bd-map-place ${isSelected ? "selected" : ""}`}
              transform={`translate(${x} ${y}) scale(${1 / pixelsPerUnit})`}
              role="button"
              tabIndex={0}
              aria-label={`Xem ${members.map((member) => member.name).join(", ")}`}
              aria-pressed={isSelected}
              onClick={choose}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  choose();
                }
              }}
            >
              <circle r="22" fill="transparent" />
              <circle r={active ? 14 : 8} fill="var(--atlas-gold)" fillOpacity={active ? .25 : .08} />
              <circle r="4" fill={active ? "var(--atlas-gold)" : "var(--atlas-muted)"} />
              <text y="-22" textAnchor="middle" fontSize="13">{label}</text>
              <title>{members.map((member) => member.note).join(" ")}</title>
            </g>
          );
        })}
      </svg>
      <span className="bd-campaign-date pointer-events-none absolute left-3 top-3 text-sm text-primary">
        {current.title} · {stage + 1}/{battle.chapters.length}
      </span>
      <span className="bd-campaign-note pointer-events-none absolute bottom-4 left-3 max-w-[52%] text-xs text-muted-foreground">
        {wide ? "Lãnh thổ lịch sử khái quát · Nét đứt: biên giới hiện đại" : "Định vị gần đúng · Đường nối diễn biến"}
      </span>
      {expandedCluster ? (
        <div className="bd-place-cluster absolute bottom-16 left-4 z-10 max-h-52 max-w-72 space-y-2 overflow-y-auto rounded border border-border bg-card/95 p-3 text-sm backdrop-blur" role="group" aria-label="Các địa điểm gần nhau">
          <div className="flex items-center justify-between gap-4"><strong>Chọn địa điểm</strong><button type="button" aria-label="Đóng nhóm địa điểm" onClick={() => setExpanded(null)}>×</button></div>
          {expandedCluster.indices.map((index) => (
            <button key={battle.places[index].id} className="block w-full rounded border border-border p-2 text-left text-primary" onClick={() => { onSelect(battle.places[index].name); setExpanded(null); }}>
              {battle.places[index].name}
            </button>
          ))}
        </div>
      ) : null}
      <div className="bd-campaign-tools absolute bottom-4 right-4 flex gap-2" aria-label="Điều khiển sa bàn">
        <button className="rounded border border-border bg-card px-3 py-2 text-primary" aria-pressed={wide} onClick={() => { setWide(!wide); setZoom(1); setExpanded(null); }}>{wide ? "Chiến trường" : "Quốc gia"}</button>
        <button className="rounded border border-border bg-card px-3 py-2 text-primary" aria-label="Phóng to sa bàn" disabled={zoom >= 3} onClick={() => setZoom((value) => Math.min(3, value + .5))}>+</button>
        <button className="rounded border border-border bg-card px-3 py-2 text-primary" aria-label="Thu nhỏ sa bàn" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - .5))}>−</button>
        <button className="rounded border border-border bg-card px-3 py-2 text-primary" aria-label="Đặt lại sa bàn" onClick={() => setZoom(1)}>↺</button>
      </div>
    </div>
  );
};
