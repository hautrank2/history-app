"use client";

import { ArrowRight, Compass, Focus, Globe2, ListOrdered, Minus, Plus, RotateCcw, X } from "lucide-react";
import { Popover, Tooltip } from "radix-ui";
import { useEffect, useEffectEvent, useId, useRef, useState } from "react";

import { getCharacter } from "~/data/characters";
import geography from "~/data/geo/world.json";
import { lifeScenes, matchesLifeScene, relationLabels } from "~/data/ho-chi-minh";
import { lifeMapLegs, lifePhase, lifePhaseLabels, projectLifePoint } from "~/lib/life-map-geometry";
import type { LifeMapCameraModel, LifeMapStateModel } from "~/lib/life-map-url";
import { clampLifeMapCamera } from "~/lib/life-map-url";
import { clusterMapPoints } from "~/lib/map-clusters";
import type { LifeSceneModel } from "~/types/ho-chi-minh";

import { LifePortrait } from "./portrait";
import { RouteInsets } from "./route-insets";

type GeometryModel = { type: string; coordinates: number[][][] | number[][][][] };
type MapPointModel = { id: string; label: string; at: [number, number]; sceneIndex?: number; characterId?: string; kind?: string; detail?: string };
type JourneyMapProps = {
  scene: LifeSceneModel; index: number; state: LifeMapStateModel;
  onChange: (patch: Partial<LifeMapStateModel> | ((previous: LifeMapStateModel) => Partial<LifeMapStateModel>)) => void;
  onGo: (index: number) => void; onPerson: (id: string) => void; onRead: () => void;
};
const project = projectLifePoint;
const ringPath = (ring: number[][]) => `${ring.map((point, index) => `${index ? "L" : "M"}${project(point).map((value) => value.toFixed(2)).join(",")}`).join("")}Z`;
const countryPath = (geometry: GeometryModel) => (geometry.type === "Polygon" ? [geometry.coordinates as number[][][]] : geometry.coordinates as number[][][][]).map((polygon) => polygon.map(ringPath).join("")).join("");
const countries = geography.filter((country) => country.name !== "Antarctica").map((country) => ({ name: country.name, path: countryPath(country.geometry) }));
const legs = lifeMapLegs(lifeScenes);

export const JourneyMap = ({ scene, index, state, onChange, onGo, onPerson, onRead }: JourneyMapProps) => {
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
  const related = scene.people.filter((person) => person.at);
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
    ...lifeScenes.map((stop, sceneIndex) => ({ id: stop.id, label: `${stop.date} · ${stop.location.name}`, at: stop.location.at, sceneIndex, characterId: sceneIndex === index ? "ho-chi-minh" : undefined, detail: stop.title })),
    ...related.map((person) => ({ id: person.characterId, label: getCharacter(person.characterId).name, at: person.at ?? scene.location.at, characterId: person.characterId, kind: person.kind, detail: person.connection })),
  ];
  const clusters = clusterMapPoints(points.map((point, index) => ({ index, ...toScreen(point.at) })), 48);
  const matches = lifeScenes.map((stop, stopIndex) => ({ stop, stopIndex })).filter(({ stop }) => matchesLifeScene(stop, state.q));
  const matchingIds = new Set(matches.map(({ stop }) => stop.id));
  const choose = (point: MapPointModel) => { setExpanded(null); if (point.sceneIndex !== undefined) onGo(point.sceneIndex); else if (point.characterId) onPerson(point.characterId); };

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
    <div className="hcm-map-toolbar">
      <div className="hcm-map-modes" aria-label="Phạm vi bản đồ"><button type="button" aria-pressed={mode === "world"} onClick={() => onChange({ map: "world", camera: { zoom: 1, x: 0, y: 0 } })}><Globe2 size={15} />Toàn hành trình</button><button type="button" aria-pressed={mode === "focus"} onClick={() => onChange({ map: "focus", camera: { zoom: 1, x: 0, y: 0 } })}><Focus size={15} />Mốc đang xem</button></div>
      <div className="hcm-map-layers"><button type="button" aria-pressed={routesVisible} onClick={() => onChange({ routes: !routesVisible })}>Mũi tên & thứ tự</button><button type="button" aria-pressed={bordersVisible} onClick={() => onChange({ borders: !bordersVisible })}>Biên giới nền</button><button type="button" className="hcm-route-directory-toggle" aria-expanded={directoryVisible} aria-controls="hcm-route-directory" onClick={() => setDirectoryVisible((previous) => !previous)}><ListOrdered size={13} />{state.q ? `${matches.length} kết quả` : `${lifeScenes.length} mốc theo thứ tự`}</button></div>
    </div>
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
        <g className="hcm-map-geographic-labels"><text x="500" y="100">CHÂU ÂU</text><text x="780" y="110">CHÂU Á</text><text x="570" y="240">CHÂU PHI</text><text x="240" y="120">BẮC MỸ</text><text x="310" y="280">NAM MỸ</text><text x="130" y="230">THÁI BÌNH DƯƠNG</text><text x="415" y="170">ĐẠI TÂY DƯƠNG</text></g>
        <circle cx={focusX} cy={focusY} r={85 / view.zoom} fill={`url(#${id}-glow)`} />
        {routesVisible ? <>
          <g className="hcm-route-legs">{legs.map((leg) => <g key={leg.id} data-route-leg={leg.id} data-phase={leg.phase} data-selected={leg.to === index} data-hovered={hoveredLeg === leg.id} data-dimmed={state.q && !matchingIds.has(lifeScenes[leg.to].id) ? "true" : undefined}>
            <title>{`${leg.from + 1} → ${leg.to + 1} · ${lifeScenes[leg.from].location.name} (${lifeScenes[leg.from].date}) → ${lifeScenes[leg.to].location.name} (${lifeScenes[leg.to].date}). Nối mốc theo thứ tự, không phải tuyến đi thực tế.`}</title>
            <path d={leg.path} className="hcm-route-line" />
            {Math.hypot(...project(lifeScenes[leg.to].location.at).map((value, i) => value - project(lifeScenes[leg.from].location.at)[i])) / viewWidth * viewport.width > 28 ? <path d={leg.arrow} className="hcm-route-direction" markerEnd={`url(#${id}-arrow-${leg.phase})`} /> : null}
            <path d={leg.path} className="hcm-route-hit" tabIndex={0} role="button" aria-label={`Chặng ${leg.from + 1} đến ${leg.to + 1}: ${lifeScenes[leg.to].location.name}, ${lifeScenes[leg.to].date}`} onPointerEnter={() => setHoveredLeg(leg.id)} onPointerLeave={() => setHoveredLeg(null)} onFocus={() => setHoveredLeg(leg.id)} onBlur={() => setHoveredLeg(null)} onClick={() => onGo(leg.to)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onGo(leg.to); } }} />
          </g>)}</g>
          {related.filter((person) => person.at && Math.hypot(...project(person.at).map((value, i) => value - [focusX, focusY][i])) > 5).map((person) => <path key={person.characterId} d={`M${focusX},${focusY}L${project(person.at ?? scene.location.at).join(",")}`} className="hcm-relation-line" data-relation={person.kind} />)}
        </> : null}
        <g className="hcm-map-islands">{[[112,16.5],[114,10]].map((at, i) => { const [x, y] = project(at); return <g key={i} transform={`translate(${x},${y})`}><path d="m-2 0 2-2 2 2-2 2Z" /><text x="5" y="2">{i === 0 ? "Hoàng Sa" : "Trường Sa"} (Việt Nam)</text></g>; })}</g>
      </svg>
      <div className="hcm-map-markers">{clusters.filter((cluster) => cluster.x > -20 && cluster.x < viewport.width + 20 && cluster.y > 15 && cluster.y < viewport.height - 25).map((cluster) => {
        const current = cluster.indices.find((i) => points[i].sceneIndex === index);
        const actors = cluster.indices.filter((i) => points[i].sceneIndex === undefined);
        const main = points[current ?? actors[0] ?? cluster.indices[0]];
        const stopIndices = cluster.indices.flatMap((i) => points[i].sceneIndex !== undefined ? [points[i].sceneIndex ?? 0] : []);
        const numbers = stopIndices.map((i) => i + 1);
        const trigger = <button className={`hcm-map-marker ${current !== undefined ? "is-current" : actors.length ? "is-person" : "is-stop"}`} type="button" data-place-id={main.id} data-relation={main.kind} data-phase={main.sceneIndex !== undefined ? lifePhase(lifeScenes[main.sceneIndex]) : undefined} data-dimmed={state.q && !cluster.indices.some((i) => matchingIds.has(points[i].id)) ? "true" : undefined} style={{ left: cluster.x, top: cluster.y }} aria-label={`${numbers.length ? `Mốc ${numbers.join(", ")}. ` : ""}${main.label}${cluster.indices.length > 1 ? ` · ${cluster.indices.length} mục, mở danh sách` : ""}`} onClick={cluster.indices.length === 1 ? () => choose(main) : undefined}>
          <span className="hcm-marker-symbol">{main.characterId ? <LifePortrait characterId={main.characterId} /> : <span>{(main.sceneIndex ?? 0) + 1}</span>}</span>{cluster.indices.length > 1 ? <b className="hcm-cluster-count">+{cluster.indices.length - 1}</b> : null}<span className="hcm-marker-label">{numbers.length > 1 ? <b className="hcm-marker-orders">{numbers.slice(0, 5).join(" · ")}{numbers.length > 5 ? " …" : ""}</b> : null}{current !== undefined ? <><b>MỐC {index + 1} · {scene.date}</b>{scene.location.name}</> : actors.length ? main.label : lifeScenes[main.sceneIndex ?? 0].location.name.split(" · ")[0]}</span>
        </button>;
        const hint = <Tooltip.Portal><Tooltip.Content className="hcm-map-tooltip" sideOffset={14} collisionPadding={12}><strong>{cluster.indices.length === 1 ? main.label : `${cluster.indices.length} mốc / nhân vật ở khu vực này`}</strong><ol>{cluster.indices.slice(0, 7).map((i) => <li key={points[i].id}><b>{points[i].sceneIndex !== undefined ? (points[i].sceneIndex ?? 0) + 1 : "↔"}</b><span>{points[i].label}<small>{points[i].detail}</small></span></li>)}</ol>{cluster.indices.length > 7 ? <p>+{cluster.indices.length - 7} mục khác · Bấm để xem tất cả theo thứ tự.</p> : null}<p>{cluster.indices.length > 1 ? "Các lần đến được ghi riêng theo thời gian. Bấm để chọn từng mốc." : "Bấm để chọn mốc · Mở câu chuyện để đọc thêm."}</p><Tooltip.Arrow /></Tooltip.Content></Tooltip.Portal>;
        if (cluster.indices.length === 1) return <Tooltip.Root key={cluster.id}><Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>{hint}</Tooltip.Root>;
        return <Popover.Root key={cluster.id} open={expanded === cluster.id} onOpenChange={(open) => setExpanded(open ? cluster.id : null)}>
          <Tooltip.Root><Tooltip.Trigger asChild><Popover.Trigger asChild>{trigger}</Popover.Trigger></Tooltip.Trigger>{hint}</Tooltip.Root>
          <Popover.Portal><Popover.Content className="hcm-cluster-popup" sideOffset={12} collisionPadding={16} aria-label="Các mốc và nhân vật cùng khu vực"><div className="hcm-cluster-heading"><strong>Cùng khu vực · chọn theo thứ tự</strong><Popover.Close aria-label="Đóng danh sách"><X size={17} /></Popover.Close></div><div className="hcm-cluster-list">{cluster.indices.map((i) => <button type="button" key={points[i].id} aria-current={points[i].sceneIndex === index ? "step" : undefined} onClick={() => choose(points[i])}><span className="hcm-cluster-number">{points[i].sceneIndex !== undefined ? (points[i].sceneIndex ?? 0) + 1 : "↔"}</span>{points[i].characterId ? <span className="hcm-cluster-portrait"><LifePortrait characterId={points[i].characterId ?? "ho-chi-minh"} /></span> : null}<span><strong>{points[i].label}</strong><small>{points[i].detail}</small></span></button>)}</div><p>Các lần đến cùng địa điểm không diễn ra đồng thời. Số thứ tự ứng với toàn bộ dòng thời gian.</p><Popover.Arrow /></Popover.Content></Popover.Portal>
        </Popover.Root>;
      })}</div>
      <div className="hcm-map-zoom" aria-label="Thu phóng bản đồ"><button type="button" aria-label="Phóng to bản đồ" onClick={() => setView((value) => ({ ...value, zoom: Math.min(12, value.zoom * 1.4) }))}><Plus size={18} /></button><button type="button" aria-label="Thu nhỏ bản đồ" onClick={() => setView((value) => ({ ...value, zoom: Math.max(.65, value.zoom / 1.4) }))}><Minus size={18} /></button><button type="button" aria-label="Đặt lại góc nhìn bản đồ" onClick={reset}><RotateCcw size={16} /></button></div>
      <span className="hcm-map-compass"><Compass size={28} strokeWidth={1} /><b>BẮC</b></span>
    </div>
    <div className="hcm-map-footer"><div className="hcm-route-legend">{Object.entries(lifePhaseLabels).map(([phase, label]) => <span key={phase} data-phase={phase}><i />{label}</span>)}<span className="hcm-dashed-key">┄ Quan hệ, không phải đường Bác đi</span></div><small>{lifeScenes.length} mốc có tư liệu · Rê chuột / chạm điểm để xem thời gian · Mũi tên nối thứ tự, không phải tuyến đi thực tế · Biên giới nền hiện đại</small><a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth ↗</a></div>
    <div className="hcm-island-note">Hoàng Sa · Trường Sa — Việt Nam<br /><small>Nhãn định vị địa lý hiện đại</small></div>
    <div className="hcm-map-selection"><small>MỐC {index + 1} / {lifeScenes.length} · {scene.date}</small><strong>{scene.location.name}</strong><p>{scene.title}</p><button type="button" onClick={onRead}>Đọc câu chuyện<ArrowRight size={14} /></button></div>
    {hoveredLeg ? <div className="hcm-route-hover" role="status">{(() => { const leg = legs.find((item) => item.id === hoveredLeg); return leg ? <><b>{leg.from + 1} → {leg.to + 1}</b><span>{lifeScenes[leg.from].location.name} ({lifeScenes[leg.from].date})<ArrowRight size={13} />{lifeScenes[leg.to].location.name} ({lifeScenes[leg.to].date})</span></> : null; })()}</div> : null}
    {directoryVisible || state.q ? <aside className="hcm-route-directory" id="hcm-route-directory" aria-label="Danh sách đầy đủ các mốc trên bản đồ"><div className="hcm-route-directory-heading"><strong><ListOrdered size={15} />{matches.length} mốc · thứ tự thời gian</strong><button type="button" aria-label="Đóng danh sách mốc và xóa tìm kiếm" onClick={() => { setDirectoryVisible(false); if (state.q) onChange({ q: "" }); }}><X size={16} /></button></div><ol>{matches.map(({ stop, stopIndex }) => <li key={stop.id}><button type="button" data-phase={lifePhase(stop)} aria-current={stopIndex === index ? "step" : undefined} onClick={() => onGo(stopIndex)}><b>{stopIndex + 1}</b><span><small>{stop.date}</small><strong>{stop.location.name}</strong></span></button></li>)}</ol>{!matches.length ? <p className="hcm-route-directory-empty" role="status">Không có mốc phù hợp. Xóa từ khóa để xem lại toàn hành trình.</p> : null}</aside> : null}
    {state.view === "map" && mode === "world" && !directoryVisible && !state.q ? <RouteInsets countries={countries} index={index} onGo={onGo} /> : null}
    {scene.people.length && state.view === "story" ? <div className="hcm-map-actor-summary" aria-label="Nhân vật gắn với mốc đang xem"><span>THẾ GIỚI QUANH BÁC · {scene.year}</span><div>{scene.people.map((person) => <button key={person.characterId} type="button" data-character-id={person.characterId} data-relation={person.kind} onClick={() => onPerson(person.characterId)}><span className="hcm-actor-mini"><LifePortrait characterId={person.characterId} /></span><span><strong>{getCharacter(person.characterId).name}</strong><small>{relationLabels[person.kind]}{!person.at ? " · không định vị trên bản đồ" : ` · ${person.place}`}</small></span></button>)}</div></div> : null}
  </section></Tooltip.Provider>;
};
