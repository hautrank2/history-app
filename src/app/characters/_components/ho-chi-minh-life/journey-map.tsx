"use client";

import { ArrowRight, Compass, Focus, Globe2, Layers, ListOrdered, MapPin, Minus, Plus, RotateCcw, Route, X } from "lucide-react";
import { Popover, Tooltip } from "radix-ui";
import { useEffect, useEffectEvent, useId, useRef, useState } from "react";

import type { ReactNode } from "react";

import { getCharacter } from "~/data/characters";
import geography from "~/data/geo/world.json";
import { lifeScenes, matchesLifeScene } from "~/data/ho-chi-minh";
import { lifeMapLegs, lifePhase, projectLifePoint } from "~/lib/life-map-geometry";
import type { LifeMapCameraModel, LifeMapStateModel } from "~/lib/life-map-url";
import { clampLifeMapCamera } from "~/lib/life-map-url";
import { clusterMapPoints } from "~/lib/map-clusters";
import type { LifeSceneModel } from "~/types/ho-chi-minh";

import { LifePortrait } from "./portrait";

type GeometryModel = { type: string; coordinates: number[][][] | number[][][][] };
type MapPointModel = { id: string; label: string; at: [number, number]; sceneIndex?: number; characterId?: string; kind?: string; detail?: string };
type JourneyMapProps = {
  scene: LifeSceneModel; index: number; state: LifeMapStateModel;
  onChange: (patch: Partial<LifeMapStateModel> | ((previous: LifeMapStateModel) => Partial<LifeMapStateModel>)) => void;
  onGo: (index: number) => void; onPerson: (id: string) => void; infoPanel: ReactNode;
};
const project = projectLifePoint;
const ringPath = (ring: number[][]) => `${ring.map((point, index) => `${index ? "L" : "M"}${project(point).map((value) => value.toFixed(2)).join(",")}`).join("")}Z`;
const countryPath = (geometry: GeometryModel) => (geometry.type === "Polygon" ? [geometry.coordinates as number[][][]] : geometry.coordinates as number[][][][]).map((polygon) => polygon.map(ringPath).join("")).join("");
const countries = geography.filter((country) => country.name !== "Antarctica").map((country) => ({ name: country.name, path: countryPath(country.geometry) }));
const legs = lifeMapLegs(lifeScenes);

const MapControl = ({ label, children, onClick, pressed, expanded, controls }: { label: string; children: ReactNode; onClick: () => void; pressed?: boolean; expanded?: boolean; controls?: string }) => <Tooltip.Root><Tooltip.Trigger asChild><button type="button" aria-label={label} aria-pressed={pressed} aria-expanded={expanded} aria-controls={controls} onClick={onClick}>{children}</button></Tooltip.Trigger><Tooltip.Portal><Tooltip.Content className="hcm-control-tooltip" side="left" sideOffset={10}>{label}<Tooltip.Arrow /></Tooltip.Content></Tooltip.Portal></Tooltip.Root>;

export const JourneyMap = ({ scene, index, state, onChange, onGo, onPerson, infoPanel }: JourneyMapProps) => {
  const id = useId().replaceAll(":", "");
  const stage = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 1000, height: 650 });
  const mode = state.map;
  const view = state.camera;
  const setView = (change: LifeMapCameraModel | ((previous: LifeMapCameraModel) => LifeMapCameraModel)) => onChange((previous) => ({ camera: clampLifeMapCamera(typeof change === "function" ? change(previous.camera) : change) }));
  const [drag, setDrag] = useState<{ x: number; y: number; originX: number; originY: number } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [directoryVisible, setDirectoryVisible] = useState(false);
  const [hoveredLeg, setHoveredLeg] = useState<string | null>(null);
  const routesVisible = state.routes;
  const bordersVisible = state.borders;
  const [focusX, focusY] = project(scene.location.at);
  const selectScene = (next: number) => onGo(next);
  const related = scene.people.filter((person) => person.at && state.points);
  const focusPoints = [project(scene.location.at), ...related.flatMap((person) => person.at ? [project(person.at)] : [])];
  const xs = focusPoints.map((point) => point[0]);
  const ys = focusPoints.map((point) => point[1]);
  const aspect = viewport.width / Math.max(viewport.height, 1);
  const baseWidth = mode === "world" ? Math.max(880, 340 * aspect) : Math.max(110, Math.max(...xs) - Math.min(...xs) + 130, (Math.max(...ys) - Math.min(...ys) + 100) * aspect);
  const centerX = (mode === "world" ? 570 : (Math.max(...xs) + Math.min(...xs)) / 2) + view.x;
  const centerY = (mode === "world" ? 165 : (Math.max(...ys) + Math.min(...ys)) / 2) + view.y;
  const viewWidth = baseWidth / view.zoom;
  const viewHeight = viewWidth / aspect;
  const left = centerX - viewWidth / 2;
  const top = centerY - viewHeight / 2;
  const toScreen = (at: [number, number]) => { const [x, y] = project(at); return { x: (x - left) / viewWidth * viewport.width, y: (y - top) / viewHeight * viewport.height }; };
  const points: MapPointModel[] = [
    ...lifeScenes.flatMap((stop, sceneIndex) => state.points || sceneIndex === index ? [{ id: stop.id, label: `${stop.date} · ${stop.location.name}`, at: stop.location.at, sceneIndex, characterId: sceneIndex === index ? "ho-chi-minh" : undefined, detail: stop.title }] : []),
    ...related.map((person) => ({ id: person.characterId, label: getCharacter(person.characterId).name, at: person.at ?? scene.location.at, characterId: person.characterId, kind: person.kind, detail: person.connection })),
  ];
  const clusters = clusterMapPoints(points.map((point, index) => ({ index, ...toScreen(point.at) })), 48);
  const matches = lifeScenes.map((stop, stopIndex) => ({ stop, stopIndex })).filter(({ stop }) => matchesLifeScene(stop, state.q));
  const matchingIds = new Set(matches.map(({ stop }) => stop.id));
  const choose = (point: MapPointModel) => { setExpanded(null); if (point.sceneIndex !== undefined) selectScene(point.sceneIndex); else if (point.characterId) onPerson(point.characterId); };

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setViewport({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const wheelZoom = useEffectEvent((event: WheelEvent) => {
    if ((event.target as Element).closest("button, a, .hcm-cluster-popup")) return;
    event.preventDefault();
    const bounds = stage.current?.getBoundingClientRect();
    if (!bounds) return;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1);
    setView((previous) => {
      const zoom = Math.max(.65, Math.min(12, previous.zoom * Math.exp(-Math.max(-240, Math.min(240, delta)) * .002)));
      const factor = 1 - previous.zoom / zoom;
      return { zoom, x: previous.x + ((event.clientX - bounds.left) / bounds.width - .5) * viewWidth * factor, y: previous.y + ((event.clientY - bounds.top) / bounds.height - .5) * viewHeight * factor };
    });
  });
  useEffect(() => {
    const element = stage.current;
    const handle = (event: WheelEvent) => wheelZoom(event);
    element?.addEventListener("wheel", handle, { passive: false });
    return () => element?.removeEventListener("wheel", handle);
  }, []);
  const reset = () => { setView({ zoom: 1, x: 0, y: 0 }); setExpanded(null); };

  return <Tooltip.Provider delayDuration={150} skipDelayDuration={100}><section className="hcm-map-region" aria-label="Bản đồ toàn bộ hành trình và quan hệ quốc tế" data-map-mode={mode}>
    <div className={`hcm-map-stage ${drag ? "is-dragging" : ""}`} ref={stage} tabIndex={0} aria-label="Bản đồ có thể kéo và phóng to. Dùng các phím mũi tên để di chuyển bản đồ." onKeyDown={(event) => {
      const direction: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (event.target !== event.currentTarget || !direction[event.key]) return;
      event.preventDefault(); event.stopPropagation();
      const [x, y] = direction[event.key]; setView((previous) => ({ ...previous, x: previous.x + x * viewWidth * .08, y: previous.y + y * viewHeight * .08 }));
    }} onPointerDown={(event) => {
      if (event.button !== 0 || (event.target as Element).closest("button, a, [data-route-leg]")) return;
      event.currentTarget.setPointerCapture(event.pointerId); setDrag({ x: event.clientX, y: event.clientY, originX: view.x, originY: view.y });
    }} onPointerMove={(event) => {
      if (drag) setView((previous) => ({ ...previous, x: Math.max(-1000, Math.min(1000, drag.originX - (event.clientX - drag.x) / viewport.width * viewWidth)), y: Math.max(-600, Math.min(600, drag.originY - (event.clientY - drag.y) / viewport.height * viewHeight)) }));
    }} onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}>
      <svg className="hcm-world-map" viewBox={`${left} ${top} ${viewWidth} ${viewHeight}`} role="group" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>Hành trình Hồ Chí Minh · {scene.date}</title><desc id={`${id}-desc`}>Bác ở {scene.location.name}. Tọa độ gần đúng; địa lý nền hiện đại. Đường nối các mốc không phải tuyến di chuyển thực tế. {scene.people.map((person) => `${getCharacter(person.characterId).name}: ${person.connection}`).join(" ")}</desc>
        <defs><pattern id={`${id}-grid`} width="90" height="60" patternUnits="userSpaceOnUse"><path d="M90 0H0V60" className="hcm-map-grid" fill="none" /></pattern><radialGradient id={`${id}-glow`}><stop stopColor="var(--atlas-gold)" stopOpacity=".2" /><stop offset="1" stopColor="var(--atlas-gold)" stopOpacity="0" /></radialGradient>{(["roots", "journey", "leadership"] as const).map((phase) => <marker key={phase} id={`${id}-arrow-${phase}`} viewBox="0 -4 8 8" refX="7" refY="0" markerWidth={9 * viewWidth / viewport.width} markerHeight={9 * viewWidth / viewport.width} orient="auto" markerUnits="userSpaceOnUse"><path d="M0,-3.5L7,0L0,3.5Z" className="hcm-route-arrowhead" data-phase={phase} /></marker>)}</defs>
        <rect x="-2000" y="-2000" width="5000" height="5000" className="hcm-map-water" />
        <rect x="-2000" y="-2000" width="5000" height="5000" fill={`url(#${id}-grid)`} />
        <g className={`hcm-map-countries ${bordersVisible ? "has-borders" : ""}`}>{countries.map((country) => <path key={country.name} d={country.path} data-country={country.name} />)}</g>
        <circle cx={focusX} cy={focusY} r={85 / view.zoom} fill={`url(#${id}-glow)`} />
        {routesVisible ? <>
          <g className="hcm-route-legs">{legs.map((leg) => <g key={leg.id} data-route-leg={leg.id} data-phase={leg.phase} data-selected={leg.to === index} data-hovered={hoveredLeg === leg.id} data-dimmed={state.q && !matchingIds.has(lifeScenes[leg.to].id) ? "true" : undefined}>
            <title>{`${leg.from + 1} → ${leg.to + 1} · ${lifeScenes[leg.from].location.name} (${lifeScenes[leg.from].date}) → ${lifeScenes[leg.to].location.name} (${lifeScenes[leg.to].date}). Nối mốc theo thứ tự, không phải tuyến đi thực tế.`}</title>
            <path d={leg.path} className="hcm-route-line" />
            {Math.hypot(...project(lifeScenes[leg.to].location.at).map((value, i) => value - project(lifeScenes[leg.from].location.at)[i])) / viewWidth * viewport.width > 28 ? <path d={leg.arrow} className="hcm-route-direction" markerEnd={`url(#${id}-arrow-${leg.phase})`} /> : null}
            <path d={leg.path} className="hcm-route-hit" tabIndex={0} role="button" aria-label={`Chặng ${leg.from + 1} đến ${leg.to + 1}: ${lifeScenes[leg.to].location.name}, ${lifeScenes[leg.to].date}`} onPointerEnter={() => setHoveredLeg(leg.id)} onPointerLeave={() => setHoveredLeg(null)} onFocus={() => setHoveredLeg(leg.id)} onBlur={() => setHoveredLeg(null)} onClick={() => selectScene(leg.to)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectScene(leg.to); } }} />
          </g>)}</g>
          {related.filter((person) => person.at && Math.hypot(...project(person.at).map((value, i) => value - [focusX, focusY][i])) > 5).map((person) => <path key={person.characterId} d={`M${focusX},${focusY}L${project(person.at ?? scene.location.at).join(",")}`} className="hcm-relation-line" data-relation={person.kind} />)}
        </> : null}
        <g className="hcm-map-islands">{[[112,16.5],[114,10]].map((at, i) => { const [x, y] = project(at); return <g key={i} transform={`translate(${x},${y})`}><path d="m-2 0 2-2 2 2-2 2Z" /><title>{i === 0 ? "Hoàng Sa" : "Trường Sa"} (Việt Nam)</title></g>; })}</g>
      </svg>
      <div className="hcm-map-markers">{clusters.filter((cluster) => cluster.x > -20 && cluster.x < viewport.width + 20 && cluster.y > 15 && cluster.y < viewport.height - 25).map((cluster) => {
        const current = cluster.indices.find((i) => points[i].sceneIndex === index);
        const actors = cluster.indices.filter((i) => points[i].sceneIndex === undefined);
        const main = points[current ?? actors[0] ?? cluster.indices[0]];
        const stopIndices = cluster.indices.flatMap((i) => points[i].sceneIndex !== undefined ? [points[i].sceneIndex ?? 0] : []);
        const numbers = stopIndices.map((i) => i + 1);
        const trigger = <button className={`hcm-map-marker ${current !== undefined ? "is-current" : actors.length ? "is-person" : "is-stop"}`} type="button" data-place-id={main.id} data-relation={main.kind} data-phase={main.sceneIndex !== undefined ? lifePhase(lifeScenes[main.sceneIndex]) : undefined} data-dimmed={state.q && !cluster.indices.some((i) => matchingIds.has(points[i].id)) ? "true" : undefined} style={{ left: cluster.x, top: cluster.y }} aria-label={`${numbers.length ? `Mốc ${numbers.join(", ")}. ` : ""}${main.label}${cluster.indices.length > 1 ? ` · ${cluster.indices.length} mục, mở danh sách` : ""}`} onClick={cluster.indices.length === 1 ? () => choose(main) : undefined}>
          <span className="hcm-marker-symbol">{main.characterId ? <LifePortrait characterId={main.characterId} scene={main.characterId === "ho-chi-minh" ? scene : undefined} /> : <span>{(main.sceneIndex ?? 0) + 1}</span>}</span>{cluster.indices.length > 1 ? <b className="hcm-cluster-count">+{cluster.indices.length - 1}</b> : null}<span className="hcm-marker-label">{numbers.length > 1 ? <b className="hcm-marker-orders">{numbers.slice(0, 5).join(" · ")}{numbers.length > 5 ? " …" : ""}</b> : null}{current !== undefined ? <><b>MỐC {index + 1} · {scene.date}</b>{scene.location.name}</> : actors.length ? main.label : lifeScenes[main.sceneIndex ?? 0].location.name.split(" · ")[0]}</span>
        </button>;
        const hint = <Tooltip.Portal><Tooltip.Content className="hcm-map-tooltip" sideOffset={14} collisionPadding={12}><strong>{cluster.indices.length === 1 ? main.label : `${cluster.indices.length} mốc / nhân vật ở khu vực này`}</strong><ol>{cluster.indices.slice(0, 7).map((i) => <li key={points[i].id}><b>{points[i].sceneIndex !== undefined ? (points[i].sceneIndex ?? 0) + 1 : "↔"}</b><span>{points[i].label}<small>{points[i].detail}</small></span></li>)}</ol>{cluster.indices.length > 7 ? <p>+{cluster.indices.length - 7} mục khác · Bấm để xem tất cả theo thứ tự.</p> : null}<p>{cluster.indices.length > 1 ? "Các lần đến được ghi riêng theo thời gian. Bấm để chọn từng mốc." : "Bấm để xem thông tin mốc."}</p><Tooltip.Arrow /></Tooltip.Content></Tooltip.Portal>;
        if (cluster.indices.length === 1) return <Tooltip.Root key={cluster.id}><Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>{hint}</Tooltip.Root>;
        return <Popover.Root key={cluster.id} open={expanded === cluster.id} onOpenChange={(open) => setExpanded(open ? cluster.id : null)}>
          <Tooltip.Root><Tooltip.Trigger asChild><Popover.Trigger asChild>{trigger}</Popover.Trigger></Tooltip.Trigger>{hint}</Tooltip.Root>
          <Popover.Portal><Popover.Content className="hcm-cluster-popup" sideOffset={12} collisionPadding={16} aria-label="Các mốc và nhân vật cùng khu vực"><div className="hcm-cluster-heading"><strong>Cùng khu vực · chọn theo thứ tự</strong><Popover.Close aria-label="Đóng danh sách"><X size={17} /></Popover.Close></div><div className="hcm-cluster-list">{cluster.indices.map((i) => <button type="button" key={points[i].id} aria-current={points[i].sceneIndex === index ? "step" : undefined} onClick={() => choose(points[i])}><span className="hcm-cluster-number">{points[i].sceneIndex !== undefined ? (points[i].sceneIndex ?? 0) + 1 : "↔"}</span>{points[i].characterId ? <span className="hcm-cluster-portrait"><LifePortrait characterId={points[i].characterId ?? "ho-chi-minh"} scene={points[i].characterId === "ho-chi-minh" ? scene : undefined} /></span> : null}<span><strong>{points[i].label}</strong><small>{points[i].detail}</small></span></button>)}</div><p>Các lần đến cùng địa điểm không diễn ra đồng thời. Số thứ tự ứng với toàn bộ dòng thời gian.</p><Popover.Arrow /></Popover.Content></Popover.Portal>
        </Popover.Root>;
      })}</div>
      <div className="map-control" role="group" aria-label="Tương tác với bản đồ">
        <MapControl label="Toàn hành trình" onClick={() => { onChange({ map: "world", camera: { zoom: 1, x: 0, y: 0 } }); setExpanded(null); }}><Globe2 size={18} /></MapControl>
        <MapControl label="Đến mốc đang xem" onClick={() => { onChange({ map: "focus", camera: { zoom: 1, x: 0, y: 0 } }); setExpanded(null); }}><Focus size={18} /></MapControl>
        <span className="map-control-divider" />
        <MapControl label="Phóng to bản đồ" onClick={() => setView((value) => ({ ...value, zoom: Math.min(12, value.zoom * 1.4) }))}><Plus size={18} /></MapControl>
        <MapControl label="Thu nhỏ bản đồ" onClick={() => setView((value) => ({ ...value, zoom: Math.max(.65, value.zoom / 1.4) }))}><Minus size={18} /></MapControl>
        <MapControl label="Đặt lại góc nhìn" onClick={reset}><RotateCcw size={17} /></MapControl>
        <span className="map-control-divider" />
        <MapControl label={routesVisible ? "Ẩn mũi tên và đường nối" : "Hiện mũi tên và đường nối"} pressed={routesVisible} onClick={() => onChange({ routes: !routesVisible })}><Route size={18} /></MapControl>
        <MapControl label={state.points ? "Ẩn các điểm chưa chọn" : "Hiện các điểm chưa chọn"} pressed={state.points} onClick={() => { setExpanded(null); onChange({ points: !state.points }); }}><MapPin size={18} /></MapControl>
        <MapControl label={bordersVisible ? "Ẩn biên giới nền hiện đại" : "Hiện biên giới nền hiện đại"} pressed={bordersVisible} onClick={() => onChange({ borders: !bordersVisible })}><Layers size={18} /></MapControl>
        <MapControl label={`Danh sách ${matches.length} mốc theo thứ tự`} expanded={directoryVisible} controls="hcm-route-directory" onClick={() => setDirectoryVisible((previous) => !previous)}><ListOrdered size={18} /></MapControl>
      </div>
      <span className="hcm-map-compass"><Compass size={28} strokeWidth={1} /><b>BẮC</b></span>
    </div>
    {infoPanel}

    {hoveredLeg ? <div className="hcm-route-hover" role="status">{(() => { const leg = legs.find((item) => item.id === hoveredLeg); return leg ? <><b>{leg.from + 1} → {leg.to + 1}</b><span>{lifeScenes[leg.from].location.name} ({lifeScenes[leg.from].date})<ArrowRight size={13} />{lifeScenes[leg.to].location.name} ({lifeScenes[leg.to].date})</span></> : null; })()}</div> : null}
    {directoryVisible || state.q ? <aside className="hcm-route-directory" id="hcm-route-directory" aria-label="Danh sách đầy đủ các mốc trên bản đồ"><div className="hcm-route-directory-heading"><strong><ListOrdered size={15} />{matches.length} mốc · thứ tự thời gian</strong><button type="button" aria-label="Đóng danh sách mốc và xóa tìm kiếm" onClick={() => { setDirectoryVisible(false); if (state.q) onChange({ q: "" }); }}><X size={16} /></button></div><ol>{matches.map(({ stop, stopIndex }) => <li key={stop.id}><button type="button" data-phase={lifePhase(stop)} aria-current={stopIndex === index ? "step" : undefined} onClick={() => selectScene(stopIndex)}><b>{stopIndex + 1}</b><span><small>{stop.date}</small><strong>{stop.location.name}</strong></span></button></li>)}</ol>{!matches.length ? <p className="hcm-route-directory-empty" role="status">Không có mốc phù hợp. Xóa từ khóa để xem lại toàn hành trình.</p> : null}</aside> : null}
  </section></Tooltip.Provider>;
};
