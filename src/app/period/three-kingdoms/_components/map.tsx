"use client";

import { Crown, Crosshair, Minus, Plus, Swords } from "lucide-react";
import { BattleRoute } from "~/components/battle-map-symbols";
import { battleRouteGeometry } from "~/lib/battle-route";
import { useEffect, useId, useRef, useState } from "react";
import type { PointerEvent } from "react";

import { Image } from "@/components/ui/image";
import { mapFrames, ringPathWith } from "~/app/[country]/[period]/_components/vietnam-overview/map-frames";
import { portraitCaption, portraitFor, portraitPlaceholder } from "~/data/portraits";
import { factionLeader, factions, people, places } from "~/data/three-kingdoms";
import type { Coordinate, PersonId, ThreeKingdomsScene } from "~/data/three-kingdoms";
import { VietnamIslandLayer } from "~/components/vietnam-map-reference";
import { clusterMapPoints } from "~/lib/map-clusters";
import { territoryBorders } from "~/lib/territory-borders";

const { countries, project } = mapFrames.china;
const ringPath = ringPathWith(project);
const riverPaths: { name: string; label: Coordinate; points: Coordinate[] }[] = [
  { name: "Hoàng Hà", label: [111.8, 35.15], points: [[101.3, 36.1], [103.7, 36.1], [104.7, 36.55], [105.7, 37.4], [106.5, 38.7], [107.1, 40.6], [109, 40.65], [111, 40.3], [110.45, 39.2], [110.7, 37.4], [110.42, 36.1], [110.22, 34.83], [111.8, 34.86], [112.78, 34.94], [113.62, 34.96], [114.2, 35.3], [115.1, 36.1], [116.1, 37.35], [117.2, 38.12], [118.4, 38.3]] },
  { name: "Trường Giang", label: [115.1, 30.05], points: [[102.2, 27.6], [104.6, 28.75], [106.58, 29.56], [108.4, 30.8], [109.57, 31], [110.4, 30.99], [111.3, 30.65], [112.2, 30.28], [112.9, 29.65], [113.2, 29.45], [113.64, 29.94], [114.31, 30.59], [115.06, 30.45], [116.04, 29.72], [117.05, 30.49], [117.9, 31.2], [118.73, 32.06], [120.95, 31.79], [121.8, 31.4]] },
  { name: "Vị Thủy", label: [109.12, 34.9], points: [[104.6, 35], [106.1, 34.53], [107.76, 34.31], [108.95, 34.42], [110.22, 34.83]] },
  { name: "Hán Thủy", label: [111, 31.82], points: [[106, 33.3], [107.03, 33.07], [108.7, 32.7], [110.3, 32.72], [112.14, 32.04], [112.65, 31.06], [114.31, 30.59]] },
  { name: "Hoài Hà", label: [116.95, 32.72], points: [[113.32, 32.4], [114.1, 32.48], [115.6, 32.46], [117, 32.96], [118.24, 33.08], [119.35, 33.65], [120.1, 33.95]] },
];
const landscapes: { name: string; at: Coordinate }[] = [
  { name: "QUAN TRUNG", at: [108.3, 35.02] },
  { name: "DÃY TẦN LĨNH", at: [108.5, 33.65] },
  { name: "DÃY THÁI HÀNH", at: [113.25, 37.65] },
  { name: "ĐỒNG BẰNG TRUNG NGUYÊN", at: [115, 34.95] },
  { name: "BỒN ĐỊA TỨ XUYÊN", at: [105, 30] },
  { name: "KÝ CHÂU", at: [115.9, 38.6] },
  { name: "KINH CHÂU", at: [112, 31.6] },
  { name: "GIANG ĐÔNG", at: [118.7, 30.2] },
  { name: "HOÀNG HẢI", at: [123.3, 35.7] },
];
const ridges: Coordinate[][] = [
  [[105.2, 33.9], [106.8, 33.75], [108.25, 33.9], [109.61, 33.73], [110.7, 33.72]],
  [[112.18, 35.22], [112.87, 36.45], [113.55, 37.6], [114.06, 38.63], [115.32, 39.9]],
  [[105.1, 32.66], [106.1, 32.17], [107.4, 32.26], [108.7, 31.94], [110.15, 31.69]],
];
const linePath = (points: number[][]) => points.map((point, index) =>
  `${index ? "L" : "M"}${project(point).join(",")}`,
).join("");
const riverLines = riverPaths.map((river) => linePath(river.points));
const ridgeLines = ridges.map(linePath);

type Position = { x: number; y: number };
type Box = Position & { width: number; height: number };
type MapView = { scale: number; x: number; y: number };
const maxZoom = 5;
const neighborLabels: { name: string; at: Coordinate }[] = [
  { name: "MÔNG CỔ", at: [103.5, 46] },
  { name: "NGA", at: [115, 55] },
  { name: "ẤN ĐỘ", at: [79, 25] },
  { name: "MYANMAR", at: [95.5, 21] },
  { name: "VIỆT NAM", at: [106, 17] },
  { name: "LÀO", at: [102.5, 18] },
  { name: "BÁN ĐẢO TRIỀU TIÊN", at: [129, 38.3] },
  { name: "NHẬT BẢN", at: [138, 36] },
];
const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width && a.x + a.width > b.x
  && a.y < b.y + b.height && a.y + a.height > b.y;

function labelPosition(text: string, at: Position, offset: number, size: number, frame: Box, obstacles: Box[]) {
  const width = text.length * size * 0.65 + 8;
  const height = size + 5;
  const offsets = [
    [offset, -height / 2], [-width - offset, -height / 2],
    [-width / 2, offset], [-width / 2, -height - offset],
  ];
  for (const [dx, dy] of offsets) {
    const box = { x: at.x + dx, y: at.y + dy, width, height };
    if (box.x < frame.x || box.y < frame.y || box.x + width > frame.x + frame.width
      || box.y + height > frame.y + frame.height || obstacles.some((obstacle) => overlaps(box, obstacle))) continue;
    obstacles.push(box);
    return { x: box.x + 4, y: box.y + size };
  }
}

function fitMap(scene: ThreeKingdomsScene, frame: Box, person: PersonId | null, wide: boolean): MapView {
  const selected = scene.cast.find((member) => member.person === person);
  const selectedRegion = scene.territories.find((region) =>
    factionLeader(region.faction, scene.year) === person,
  );
  const points = wide ? [project([73, 54]), project([136, 17])] : [
    places[scene.focus].at,
    ...scene.nearby.map((place) => places[place].at),
    ...(scene.routes ?? []).flatMap((route) => route.places.map((place) => places[place].at)),
    ...(selected ? [places[selected.place].at] : []),
    ...(!selected && selectedRegion ? [selectedRegion.label] : []),
  ].map(project);
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const scale = Math.min(
    Math.max(40, frame.width - 90) / Math.max(50, right - left),
    Math.max(40, frame.height - 82) / Math.max(52, bottom - top),
  );
  return {
    scale,
    x: frame.x + frame.width / 2 - (left + right) * scale / 2,
    y: frame.y + frame.height / 2 - (top + bottom) * scale / 2,
  };
}

type BattleMapProps = {
  scene: ThreeKingdomsScene;
  selected: PersonId | null;
  wide: boolean;
  storyOpen: boolean;
  timelineOpen: boolean;
  timelineInset: number;
  onSelect: (person: PersonId) => void;
  onToggleWide: () => void;
};

export const BattleMap = ({ scene, selected, wide, storyOpen, timelineOpen, timelineInset, onSelect, onToggleWide }: BattleMapProps) => {
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; dx: number; dy: number } | null>(null);
  const unique = useId().replaceAll(":", "");
  const [{ width, height }, resize] = useState({ width: 860, height: 540 });
  const [manual, setManual] = useState({ view: "", zoom: 1, x: 0, y: 0 });
  const viewKey = `${scene.id}/${selected}/${wide}`;
  const adjustment = manual.view === viewKey ? manual : { view: viewKey, zoom: 1, x: 0, y: 0 };
  const rightInset = storyOpen && width > 810 ? Math.min(365, width * 0.35) + 15 : 0;
  const bottomInset = timelineOpen ? timelineInset + 8 : 28;
  const frame = { x: 8, y: 102, width: width - rightInset - 16, height: Math.max(105, height - 102 - bottomInset) };
  const base = fitMap(scene, frame, selected, wide);
  const overview = fitMap(scene, frame, null, true);
  const minZoom = Math.min(1, overview.scale / base.scale);
  const center = { x: frame.x + frame.width / 2, y: frame.y + frame.height / 2 };
  const view = {
    scale: base.scale * adjustment.zoom,
    x: center.x + (base.x - center.x) * adjustment.zoom + adjustment.x,
    y: center.y + (base.y - center.y) * adjustment.zoom + adjustment.y,
  };
  const screen = (coordinate: Coordinate) => {
    const [x, y] = project(coordinate);
    return { x: x * view.scale + view.x, y: y * view.scale + view.y };
  };
  const move = ({ x, y }: Position) => ({ transform: `translate(${x}px, ${y}px)` });
  const focus = screen(places[scene.focus].at);
  const mapPeople = [
    ...scene.cast.filter((member) => !member.deceased).map((member) => ({
      ...member,
      at: places[member.place].at,
      location: places[member.place].name,
    })),
    ...scene.territories.flatMap((region) => {
      const person = factionLeader(region.faction, scene.year);
      if (scene.cast.some((member) => member.person === person)) return [];
      return [{
        person,
        at: region.label,
        location: factions[region.faction].name,
        action: "Thủ lĩnh · vị trí đại diện vùng ảnh hưởng",
        regional: true,
      }];
    }),
  ];
  // A ruler can appear in several influence polygons, but gets one marker.
  const locatedPeople = mapPeople.filter((member, index) =>
    mapPeople.findIndex((other) => other.person === member.person) === index,
  );
  const markers = clusterMapPoints(
    locatedPeople.map((member, index) => ({ index, ...screen(member.at) })),
    42,
  ).flatMap((cluster) => cluster.indices.map((index, position) => {
    const member = locatedPeople[index];
    const anchor = screen(member.at);
    const crowded = cluster.indices.length > 1;
    const nearFocus = Math.hypot(anchor.x - focus.x, anchor.y - focus.y) < 55;
    const angle = -Math.PI / 2 + position * Math.PI * 2 / cluster.indices.length;
    const radius = crowded ? Math.max(66, cluster.indices.length * 16) : nearFocus ? 65 : 0;
    return {
      x: crowded ? cluster.x + Math.cos(angle) * radius : anchor.x,
      y: crowded ? cluster.y + Math.sin(angle) * radius : anchor.y + (nearFocus ? (focus.y + 90 < frame.y + frame.height ? 65 : -65) : 0),
      anchor, members: [member],
    };
  })).filter(({ x, y }) => x > 12 && x < width - 12 && y > 12 && y < height - 12);
  const boxes: Box[] = [
    { x: focus.x - 14, y: focus.y - 14, width: 28, height: 28 },
    ...markers.map(({ x, y }) => ({ x: x - 22, y: y - 22, width: 44, height: 44 })),
  ];
  const cities = [...new Set([scene.focus, ...scene.nearby, ...scene.cast.map((member) => member.place)])]
    .map((id) => {
      const place = places[id];
      const at = screen(place.at);
      return { id, place, at, label: labelPosition(place.name, at, id === scene.focus ? 17 : 7, 12, frame, boxes) };
    });
  const names = [
    ...neighborLabels.map((place) => ({ ...place, kind: "neighbor", color: "#b5bfbd" })),
    ...riverPaths.map((river) => ({ ...river, at: river.label, kind: "river", color: "#83b5c2" })),
    ...landscapes.map((place) => ({ ...place, kind: "terrain", color: "#aead91" })),
  ].filter(({ at }) => {
    const position = screen(at);
    return position.x > 0 && position.x < width && position.y > 0 && position.y < height;
  }).map((place) => ({
    ...place,
    label: labelPosition(place.name, screen(place.at), 0, 10, frame, boxes),
  }));

  useEffect(() => {
    if (!svg.current) return;
    const observer = new ResizeObserver(([entry]) => {
      resize({ width: Math.max(260, entry.contentRect.width), height: Math.max(260, entry.contentRect.height) });
    });
    observer.observe(svg.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      const bounds = element.getBoundingClientRect();
      const x = event.clientX - bounds.left - center.x;
      const y = event.clientY - bounds.top - center.y;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1;
      setManual((previous) => {
        const current = previous.view === viewKey ? previous : { view: viewKey, zoom: 1, x: 0, y: 0 };
        const zoom = Math.max(minZoom, Math.min(maxZoom, current.zoom * Math.exp(-event.deltaY * unit * .0015)));
        if (zoom <= minZoom) {
          return {
            view: viewKey,
            zoom: minZoom,
            x: overview.x - center.x - (base.x - center.x) * minZoom,
            y: overview.y - center.y - (base.y - center.y) * minZoom,
          };
        }
        if (zoom === current.zoom) return previous;
        const ratio = zoom / current.zoom;
        return {
          view: viewKey,
          zoom,
          x: current.x * ratio + x * (1 - ratio),
          y: current.y * ratio + y * (1 - ratio),
        };
      });
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [viewKey, minZoom, center.x, center.y, base.x, base.y, overview.x, overview.y]);

  const startDrag = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 || (event.target as Element).closest("[role=button]")) return;
    drag.current = { x: event.clientX, y: event.clientY, dx: adjustment.x, dy: adjustment.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    setManual({ ...adjustment, x: drag.current.dx + event.clientX - drag.current.x, y: drag.current.dy + event.clientY - drag.current.y });
  };
  const zoomBy = (multiplier: number) => {
    const zoom = Math.max(minZoom, Math.min(maxZoom, adjustment.zoom * multiplier));
    setManual({
      ...adjustment,
      zoom,
      x: zoom === minZoom
        ? overview.x - center.x - (base.x - center.x) * zoom
        : adjustment.x,
      y: zoom === minZoom
        ? overview.y - center.y - (base.y - center.y) * zoom
        : adjustment.y,
    });
  };

  return (
    <section className="tk-map" aria-label="Bản đồ diễn biến">
      <svg
        ref={svg} viewBox={`0 0 ${width} ${height}`} role="group"
        aria-label={`${scene.title} · ${places[scene.focus].name}`}
        className="tk-map-svg"
        data-manual={manual.view === viewKey}
        onPointerDown={startDrag} onPointerMove={moveDrag}
        onPointerUp={(event) => { drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}
        data-map-zoom={adjustment.zoom.toFixed(3)} data-map-pan={`${adjustment.x.toFixed(2)},${adjustment.y.toFixed(2)}`}
      >
        <defs>
          <clipPath id={`${unique}-land`}>{countries.map((country) => <path key={country.name} d={country.path} />)}</clipPath>
          <pattern id={`${unique}-grid`} patternUnits="userSpaceOnUse" width="32" height="40">
            <path d="M32 0H0V40" fill="none" stroke="#a1aba2" strokeWidth="0.45" opacity="0.27" />
          </pattern>
          <radialGradient id={`${unique}-shade`}>
            <stop offset="40%" stopColor="#060e15" stopOpacity="0" />
            <stop offset="100%" stopColor="#060e15" stopOpacity=".45" />
          </radialGradient>
          {scene.routes?.map((route, index) => (
            <marker key={index} id={`${unique}-arrow-${index}`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M1 1L11 6L1 11Z" fill={factions[route.faction].color} />
            </marker>
          ))}
        </defs>
        <rect width={width} height={height} fill="#122835" />
        <g className="tk-camera" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}>
          <g clipPath={`url(#${unique}-land)`}>
            {countries.map((country) => (
              <path
                key={country.name}
                d={country.path}
                fill="#a6b9c2" fillOpacity={country.name === "China" ? .16 : .1}
              />
            ))}
            <g key={scene.id} className="tk-territories">
              {scene.territories.map((region, index) => {
                const faction = factions[region.faction];
                const uprising = "uprising" in faction;
                return <path key={index} d={ringPath(region.ring)} fill={faction.color}
                  fillOpacity={uprising ? .23 : .14} />;
              })}
              {territoryBorders(scene.territories).map((border, index) => (
                <path
                  key={`border-${index}`}
                  d={linePath(border.points)}
                  fill="none"
                  stroke={factions[border.faction].color}
                  strokeOpacity={0.7}
                  strokeWidth={1.1}
                  strokeDasharray="6 3"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
            {ridgeLines.map((path, index) => <path key={index} d={path} className="tk-ridge" />)}
          </g>
          <rect x="-1500" y="-1500" width="3500" height="3500" fill={`url(#${unique}-grid)`} />
          <g className="tk-modern-borders" aria-label="Biên giới quốc gia hiện đại để định hướng">
            {countries.map((country) => (
              <path
                key={country.name}
                data-country={country.name}
                d={country.path}
                fill="none"
                stroke="#a5b8b0"
                strokeOpacity={0.5}
                strokeWidth={0.8}
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          {riverLines.map((path, index) => <path key={index} d={path} className="tk-river" />)}
        </g>
        <rect width={width} height={height} fill={`url(#${unique}-shade)`} pointerEvents="none" />
        <g key={scene.id} aria-hidden="true">
          {scene.routes?.map((route, index) => {
            const points = route.places.map((id) => screen(places[id].at));
            const geometry = battleRouteGeometry(points, 60);
            if (!geometry) return null;
            return <BattleRoute key={index} {...geometry} kind={route.kind ?? "march"} label={`${factions[route.faction].name}: ${route.label}`} />;
          })}
        </g>
        {names.map(({ name, label, color, kind }, index) => label && (
          <text key={`${name}-${index}`} className={`tk-map-name is-${kind}`} fill={color} style={move(label)}>{name}</text>
        ))}
        {cities.map(({ id, place, at, label }) => (
          <g key={id} data-place-id={id}>
            {id !== scene.focus && <circle className="tk-city-dot" r="3.2" style={move(at)} />}
            {label && !(wide && id === scene.focus) && <text className={`tk-city-label ${id === scene.focus ? "is-focus" : ""}`} style={move(label)}>{place.name}</text>}
          </g>
        ))}
        {markers.filter(({ x, y, anchor }) => x !== anchor.x || y !== anchor.y).map(({ members, x, y, anchor }) => (
          <path key={`leader-${members[0].person}`} d={`M${anchor.x},${anchor.y}L${x},${y}`} stroke="#c8bea1" strokeDasharray="3 3" fill="none" />
        ))}
        {markers.map(({ members, x, y }) => {
          const selectedIndex = members.findIndex((member) => member.person === selected);
          const active = selectedIndex >= 0;
          const member = members[Math.max(0, selectedIndex)];
          const person = people[member.person];
          const portrait = portraitFor(person.wiki) ?? portraitPlaceholder;
          const cluster = members.length > 1;
          const label = cluster
            ? members.map(({ person }) => people[person].name).join(", ")
            : `${person.name} · ${member.location}`;
          const activate = () => onSelect(members[(selectedIndex + 1) % members.length].person);
          return (
            <g
              key={members.map(({ person }) => person).join("-")}
              className="tk-person-marker"
              data-character-id={person.characterId}
              style={move({ x, y })}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={label}
              onClick={activate}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  activate();
                }
              }}
            >
              <title>{cluster ? label : `${label} · ${member.action}`}</title>
              <circle
                r={20}
                fill="#18242d"
                stroke={cluster && !active ? "#e3cdb3" : person.color}
                strokeWidth={active ? 3 : 1.5}
                strokeDasharray={!cluster && member.regional ? "2 2" : undefined}
              />
              <foreignObject x={-18} y={-18} width={36} height={36} pointerEvents="none">
                <div className="tk-marker-portrait h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={portrait.src}
                    alt=""
                    title={portraitCaption(portrait)}
                    preview={false}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: portrait.position }}
                  />
                </div>
              </foreignObject>
              <circle cx="18" cy="-19" r="9" fill="#152534" stroke={person.color} />
              <Crown x={12} y={-25} width={12} height={12} color={person.color} />
              {cluster && <g className="tk-marker-count" pointerEvents="none">
                <circle cx={16} cy={-15} r={8} fill="#e3cdb3" stroke="#18242d" />
                <text x={16} y={-12} textAnchor="middle" fill="#18242d">{members.length}</text>
              </g>}
              <text className="tk-marker-name" y="32" textAnchor="middle" fill={person.color}>
                {person.name}
              </text>
            </g>
          );
        })}
        <g className="tk-map-focus" style={move(focus)} aria-label={`Vị trí sự kiện: ${places[scene.focus].name}`}>
          <circle r="17" className="tk-focus-ring" />
          <circle r="10" fill="#2b211b" stroke="#faad76" strokeWidth="1.5" />
          {scene.battle ? <Swords x={-6} y={-6} width={12} height={12} /> : <circle r="3" fill="currentColor" />}
          <title>{`${scene.title} · ${places[scene.focus].name}`}</title>
        </g>
        {wide && <text className="tk-city-label is-focus" style={move({ x: focus.x + 20, y: focus.y - 18 })}>{places[scene.focus].name}</text>}
        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          <VietnamIslandLayer project={project} unitsPerPixel={1 / view.scale} />
        </g>
      </svg>
      <div className="tk-map-mode"><Crosshair size={15} /> <span>{wide ? "Toàn cảnh Trung Quốc" : places[scene.focus].name}</span></div>
      <div className="tk-map-controls" aria-label="Điều khiển bản đồ">
        <button type="button" onClick={onToggleWide} aria-pressed={wide}>{wide ? "Về sự kiện" : "Toàn cảnh"}</button>
        <button type="button" aria-label="Thu nhỏ bản đồ" disabled={adjustment.zoom <= minZoom} onClick={() => zoomBy(1 / 1.25)}><Minus size={16} /></button>
        <button type="button" aria-label="Phóng to bản đồ" disabled={adjustment.zoom >= maxZoom} onClick={() => zoomBy(1.25)}><Plus size={16} /></button>
        <button type="button" aria-label="Đặt lại góc nhìn" onClick={() => setManual({ view: "", zoom: 1, x: 0, y: 0 })}><Crosshair size={16} /></button>
      </div>
      <div className="tk-map-caption" aria-hidden="true"><span>↑ BẮC · Cuộn để zoom · Giữ và kéo để di chuyển</span><span>Biên giới hiện đại để định hướng · Natural Earth</span></div>
    </section>
  );
};
