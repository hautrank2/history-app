"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type PointerEvent } from "react";
import { BookOpen, Crown, Flag, MapPin } from "lucide-react";
import { CharacterAvatar } from "~/components/character-avatar";
import { BattleRoute, battleActions } from "~/components/battle-map-symbols";
import { characterHref, getCharacter } from "~/data/characters";
import { portraitFor, portraitPlaceholder } from "~/data/portraits";
import { zoomMapAt } from "~/lib/map-camera";
import { battleRouteGeometry } from "~/lib/battle-route";
import type { CharacterModel } from "~/types";

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
  leaders?: (CharacterModel & { at?: number[] })[];
};

export const CampaignMap = ({
  battle,
  stage,
  selected,
  onSelect,
  leaders = [],
}: CampaignMapProps) => {
  const id = useId().replaceAll(":", "");
  const isDienBienPhu = battle.id === "dien-bien-phu-1954";
  const [wide, setWide] = useState(!isDienBienPhu);
  const viewKey = `${battle.id}/${stage}/${wide}`;
  const [manual, setManual] = useState({ key: "", zoom: 1, x: 0, y: 0 });
  const camera = manual.key === viewKey ? manual : { key: viewKey, zoom: 1, x: 0, y: 0 };
  const { zoom } = camera;
  const drag = useRef<{ x: number; y: number; camera: typeof camera; unit: number; moved: boolean } | null>(null);
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
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      const bounds = element.getBoundingClientRect();
      const unit = Math.min(bounds.width / 600, bounds.height / 520);
      const point: [number, number] = [
        (event.clientX - bounds.left - (bounds.width - 600 * unit) / 2) / unit,
        (event.clientY - bounds.top - (bounds.height - 520 * unit) / 2) / unit,
      ];
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1);
      setManual((previous) => ({ key: viewKey, ...zoomMapAt(previous.key === viewKey ? previous : { zoom: 1, x: 0, y: 0 }, Math.exp(-delta * .0015), point) }));
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [viewKey]);
  const startDrag = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 || (event.target as Element).closest('[role="button"], a')) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    drag.current = { x: event.clientX, y: event.clientY, camera, unit: Math.min(bounds.width / 600, bounds.height / 520), moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: PointerEvent<SVGSVGElement>) => {
    const start = drag.current;
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) < 3 && !start.moved) return;
    start.moved = true;
    setManual({ ...start.camera, x: start.camera.x - dx / start.unit / start.camera.zoom, y: start.camera.y - dy / start.unit / start.camera.zoom });
  };
  const stopDrag = (event: PointerEvent<SVGSVGElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const zoomBy = (factor: number) => setManual({ key: viewKey, ...zoomMapAt(camera, factor, [300, 260]) });
  const current = battle.chapters[stage];
  const eventPlaces = battle.places.filter((place) => current.placeIds.includes(place.id));
  const visibleLeaders: (CharacterModel & { at?: number[] })[] = leaders.length ? leaders : battle.leaderIds.map((id) => ({ ...getCharacter(id), side: "home" as const }));
  const leaderAt = (leader: typeof visibleLeaders[number]) => leader.at
    ?? (battle.id === "dien-bien-phu-1954" ? battle.places.find((place) => place.id === (leader.side === "enemy" ? "muong-thanh" : "muong-phang"))?.at : undefined)
    ?? (battle.id === "chi-lang-xuong-giang-1427" && leader.side === "enemy" ? battle.places.find((place) => place.id === "dong-quan")?.at : undefined)
    ?? (battle.id === "ngoc-hoi-dong-da-1789" && leader.side === "enemy" ? battle.places.find((place) => place.id === "thang-long")?.at : undefined)
    ?? eventPlaces[0]?.at ?? battle.places[0].at;
  const focusPlaces = [...eventPlaces.map((place) => place.at), ...visibleLeaders.map(leaderAt)];
  const viewPlaces = wide ? [[98, 8], [112, 26], ...focusPlaces] : isDienBienPhu ? battle.places.map((place) => place.at) : focusPlaces;
  const xs = viewPlaces.map((point) => point[0]);
  const ys = viewPlaces.map((point) => point[1]);
  const center = [(Math.min(...xs) + Math.max(...xs)) / 2,
    (Math.min(...ys) + Math.max(...ys)) / 2];
  const xFactor = Math.cos(center[1] * Math.PI / 180);
  const scale = Math.min(
    410 / Math.max(.08, (Math.max(...xs) - Math.min(...xs)) * xFactor),
    330 / Math.max(.08, Math.max(...ys) - Math.min(...ys)),
  );
  const [centerLongitude, centerLatitude] = center;
  const project = useCallback(([longitude, latitude]: number[]) => [
    300 + (longitude - centerLongitude) * xFactor * scale,
    255 + (centerLatitude - latitude) * scale,
  ], [centerLongitude, centerLatitude, xFactor, scale]);
  const countryPaths = useMemo(() => geography.map((country) => {
    const polygons = country.geometry.type === "Polygon"
      ? [country.geometry.coordinates as number[][][]] : country.geometry.coordinates as number[][][][];
    return { name: country.name, path: country.name === "Vietnam" ? vietnamLandPath(project)
      : polygons.map((polygon) => polygon.map((ring) => `${geographicLine(ring, project)}Z`).join("")).join("") };
  }), [project]);
  const territory = vietnamBattleTerritory(battle.id, project);
  const [focusX, focusY] = [300 + camera.x, 260 + camera.y];
  const pixelsPerUnit = Math.max(.01, Math.min(size.width / 600, size.height / 520) * zoom);
  const clusters = clusterMapPoints(battle.places.map((place, index) => {
    const [x, y] = project(place.at);
    return { index, x: x * pixelsPerUnit, y: y * pixelsPerUnit };
  }), 48);
  const expandedCluster = clusters.find((cluster) => cluster.id === expanded);
  const activePlaces = current.placeIds.flatMap((placeId) =>
    battle.places.filter((place) => place.id === placeId),
  );
  const eventPoint = activePlaces[0] ?? battle.places[0];
  const [eventX, eventY] = project(eventPoint.at);
  const EventIcon = current.phase === "context" ? BookOpen : current.phase === "aftermath" ? Flag : battleActions[current.kind ?? "attack"].Icon;
  const commandPosts = isDienBienPhu ? [
    { person: getCharacter("vo-nguyen-giap"), place: battle.places.find((place) => place.id === (current.placeIds.includes("huoi-he") ? "huoi-he" : "muong-phang"))!,
      label: current.placeIds.includes("huoi-he") ? "Sở chỉ huy Việt Nam · 18–30/1/1954" : "Sở chỉ huy Việt Nam · 31/1–15/5/1954" },
    { person: getCharacter("christian-de-castries"), place: battle.places.find((place) => place.id === "muong-thanh")!, label: "Sở chỉ huy Pháp · trong chiến dịch" },
  ] : [];

  return (
    <div className="bd-campaign-map relative overflow-hidden rounded-lg border border-border bg-background">
      <svg
        ref={svg}
        className="bd-battle-map battle-map-interactive"
        data-map-zoom={zoom.toFixed(3)} data-map-pan={`${camera.x.toFixed(2)},${camera.y.toFixed(2)}`}
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag}
        onLostPointerCapture={() => { drag.current = null; }}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (["+", "=", "-", "0", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) event.preventDefault();
          if (event.key === "+" || event.key === "=") zoomBy(1.25);
          if (event.key === "-") zoomBy(.8);
          if (event.key === "0") setManual({ key: viewKey, zoom: 1, x: 0, y: 0 });
          const step = 35 / zoom;
          if (event.key.startsWith("Arrow")) setManual({ ...camera, x: camera.x + (event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0), y: camera.y + (event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0) });
        }}
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
          {countryPaths.map((country) => <path key={country.name} d={country.path}
            fill="#9caeb5" fillOpacity=".14" stroke="#b5c5cb" strokeOpacity=".55" strokeWidth=".8" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />)}
        </g>
        <g aria-label={`Lãnh thổ lịch sử: ${territory.name}`}>
          <path d={territory.path} fill="#d5c8a2" fillOpacity=".16" stroke="#edc78a" strokeWidth="1.8" vectorEffect="non-scaling-stroke"><title>{territory.note}</title></path>
        </g>
        <rect x="-4000" y="-4000" width="9000" height="9000" fill={`url(#${id}-grid)`} />
        <VietnamGeographyLayer project={project} places={false} outline={false} />
        <VietnamIslandLayer project={project} unitsPerPixel={1 / pixelsPerUnit} />
        {wide && [ { name: territory.name, at: territory.label }, ...territory.neighbors ].map((label) => {
          const [x, y] = project(label.at);
          return <g key={label.name} transform={`translate(${x} ${y}) scale(${1 / pixelsPerUnit})`}><text className="battle-country-label" textAnchor="middle" fill="#e4d8bc" fontSize="10" paintOrder="stroke" stroke="#162830" strokeWidth="2">{label.name}</text></g>;
        })}
        {current.routes?.map((route, index) => {
          const points = route.places.flatMap((placeId) => battle.places.filter((place) => place.id === placeId));
          if (points.length < 2) return null;
          const geometry = battleRouteGeometry(points.map((place) => { const [x, y] = project(place.at); return { x, y }; }), 48 / pixelsPerUnit);
          if (!geometry) return null;
          return <BattleRoute key={`${stage}-${index}`} {...geometry} kind={route.kind} label={`${route.side === "home" ? battle.sides.home : battle.sides.enemy}: ${route.label}`} scale={1 / pixelsPerUnit} />;
        })}
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
        {!isDienBienPhu && visibleLeaders.map((leader, index) => {
          const person = getCharacter(leader.id);
          const [leaderX, leaderY] = project(leaderAt(leader));
          const angle = -Math.PI + (index + .5) * Math.PI / Math.max(1, visibleLeaders.length);
          const dx = Math.cos(angle) * (visibleLeaders.length > 2 ? 128 : 110), dy = Math.sin(angle) * 72 - 26;
          const color = leader.side === "enemy" ? "#fca5a5" : "#86efac";
          return <g key={leader.id} transform={`translate(${leaderX} ${leaderY}) scale(${1 / pixelsPerUnit})`}>
            <path d={`M0 0L${dx},${dy}`} stroke={color} strokeOpacity=".6" strokeDasharray="3 3" />
            <g transform={`translate(${dx} ${dy})`}><a href={characterHref(leader.id)} className="battle-map-leader" data-character-id={leader.id} aria-label={`${leader.name} · ${leader.role} · vị trí đại diện lực lượng`}>
              <title>{`${leader.name} · ${leader.role} · Vị trí đại diện lực lượng, không phải tọa độ chỉ huy chính xác`}</title>
              <circle className="battle-leader-ring" r="24" fill="#12202c" stroke={color} strokeWidth="2.5" />
              <foreignObject x="-21" y="-21" width="42" height="42"><div className="overflow-hidden rounded-full"><CharacterAvatar name={leader.name} portrait={portraitFor(person.wiki) ?? portraitPlaceholder} width={42} height={42} preview={false} /></div></foreignObject>
              <circle cx="18" cy="-19" r="9" fill="#152534" stroke={color} /><Crown x={12} y={-25} width={12} height={12} color={color} />
              <text y="39" textAnchor="middle">{leader.name.split(" ").length > 3 ? <><tspan x="0">{leader.name.split(" ").slice(0, -2).join(" ")}</tspan><tspan x="0" dy="13">{leader.name.split(" ").slice(-2).join(" ")}</tspan></> : leader.name}</text>
            </a></g>
          </g>;
        })}
        {commandPosts.map(({ person, place }, index) => {
          const [x, y] = project(place.at);
          return <g key={person.id} transform={`translate(${x} ${y}) scale(${1 / pixelsPerUnit})`} className="battle-command-pin"
            data-command-place={place.id} role="button" tabIndex={0} aria-label={`${person.name} · Sở chỉ huy ${place.name}, Điện Biên, Việt Nam`}
            onClick={() => { onSelect(place.name); setWide(false); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(place.name); setWide(false); } }}>
            <circle r="8" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
            <path d="M0 0V-31" stroke="var(--primary)" strokeWidth="1.5" />
            <rect x="-12" y="-45" width="24" height="24" rx="5" fill="var(--background)" stroke="var(--primary)" />
            <text x="0" y="-29" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--primary)">{index + 1}</text>
            <title>{`${person.name} · ${place.name}, Điện Biên, Việt Nam. ${place.note}`}</title>
          </g>;
        })}
        <g className="battle-map-event" transform={`translate(${eventX} ${eventY}) scale(${1 / pixelsPerUnit})`} aria-label={`Sự kiện: ${current.title} · ${eventPoint.name}`}>
          <circle r="21" className="battle-event-pulse" /><circle r="14" fill="#302423" stroke={battleActions[current.kind ?? "attack"].color} strokeWidth="2" />
          <EventIcon x={-8} y={-8} width={16} height={16} />
          <title>{`${current.date} · ${current.title} · ${eventPoint.name}`}</title>
        </g>
      </svg>
      {isDienBienPhu && <details className="battle-command-posts" open={size.width > 600} aria-label="Sở chỉ huy tại Điện Biên, Việt Nam">
        <summary>Sở chỉ huy · Điện Biên, Việt Nam</summary>
        {commandPosts.map(({ person, place, label }, index) => <button type="button" key={person.id} onClick={() => {
          onSelect(place.name); setWide(false); setManual({ key: "", zoom: 1, x: 0, y: 0 });
        }} aria-pressed={selected === place.name}>
          <CharacterAvatar name={person.name} portrait={portraitFor(person.wiki) ?? portraitPlaceholder} width={32} height={32} preview={false} />
          <span><b>{index + 1}. {person.name}</b><small><MapPin size={11} />{place.name}</small><small>{label}</small></span>
        </button>)}
        <small>Điểm ghim là địa điểm sở chỉ huy; tọa độ gần đúng.</small>
      </details>}
      <span className="bd-campaign-date pointer-events-none absolute left-3 top-3 max-w-[50%] text-sm text-primary">
        {current.title} · {stage + 1}/{battle.chapters.length}
      </span>
      <span className="bd-campaign-note pointer-events-none absolute bottom-4 left-3 max-w-[52%] text-xs text-muted-foreground">
        {wide ? "Lãnh thổ khái quát · Nét đứt: biên giới hiện đại" : "Hướng tiến/rút quân khái quát · Vị trí gần đúng"}
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
        <button className="rounded border border-border bg-card px-3 py-2 text-primary" aria-pressed={wide} onClick={() => { setWide(!wide); setManual({ key: "", zoom: 1, x: 0, y: 0 }); setExpanded(null); }}>{wide ? "Chiến trường" : "Quốc gia"}</button>
        <button className="rounded border border-border bg-card px-3 py-2 text-primary" aria-label="Phóng to sa bàn" disabled={zoom >= 16} onClick={() => zoomBy(1.25)}>+</button>
        <button className="rounded border border-border bg-card px-3 py-2 text-primary" aria-label="Thu nhỏ sa bàn" disabled={zoom <= .65} onClick={() => zoomBy(.8)}>−</button>
        <button className="rounded border border-border bg-card px-3 py-2 text-primary" aria-label="Đặt lại sa bàn" onClick={() => setManual({ key: viewKey, zoom: 1, x: 0, y: 0 })}>↺</button>
      </div>
      <span className="battle-map-hint">Cuộn để zoom · Giữ và kéo để di chuyển</span>
    </div>
  );
};
