"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

import geography from "~/data/geo/southeast-asia.json";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Image } from "@/components/ui/image";
import { characterHref } from "~/data/characters";
import type { OverviewSceneModel } from "~/data/vietnam-overview";

import { MapMarkers, PlaceIcon, placeSubtitle } from "./map-markers";
import { placePortrait, portraitCaption } from "./portraits";

type HistoryMapProps = { scene: OverviewSceneModel; selectedPlace: number; contentVisible: boolean; timelineVisible: boolean; placesVisible: boolean; onSelectPlace: (index: number) => void; onHidePlaces: () => void };
type GeometryModel = { type: string; coordinates: number[][][] | number[][][][] };

const width = 760;
const height = 700;
// Tạm tắt lựa chọn địa hình; bật lại tại đây khi cần mở lại.
const terrainEnabled = false;
const project = ([longitude, latitude]: number[]) => [(longitude - 96) * 38, (26 - latitude) * 36];
const ringPath = (ring: number[][]) => `${ring.map((point, index) => `${index ? "L" : "M"}${project(point).map((value) => value.toFixed(1)).join(",")}`).join("")}Z`;
const geometryPath = (geometry: GeometryModel) => {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates as number[][][]] : geometry.coordinates as number[][][][];
  return polygons.map((polygon) => polygon.map(ringPath).join("")).join("");
};
const countries = geography.map((country) => ({ name: country.name, path: geometryPath(country.geometry) }));
const vietnamPath = countries.find((country) => country.name === "Vietnam")?.path ?? "";
const southernLatitude: Record<OverviewSceneModel["territory"], number> = { ancient: 18, north: 18, nanyue: 18, ly: 17.1, tran: 16, le: 12.9, split: 8, full: 8, partition: 8 };
const nanyuePath = ringPath([[103.5, 23], [106, 24], [110, 25.2], [114.7, 24], [116.3, 22], [114.3, 20.5], [108, 18], [105.5, 18], [104, 20]]);

const northNeighbor = (year: number) => {
  if (year < -221) return "CÁC NƯỚC THỜI CHIẾN QUỐC";
  if (year < -206) return "TẦN";
  if (year < -111) return "HÁN";
  if (year < 220) return "HÁN";
  if (year < 280) return "ĐÔNG NGÔ";
  if (year < 420) return "TẤN";
  if (year < 581) return "LƯƠNG · TRẦN";
  if (year < 618) return "TÙY";
  if (year < 907) return "ĐƯỜNG";
  if (year < 971) return "NAM HÁN";
  if (year < 1279) return "TỐNG";
  if (year < 1368) return "NGUYÊN";
  if (year < 1644) return "MINH";
  if (year < 1912) return "THANH";
  return "TRUNG QUỐC";
};

export const HistoryMap = ({ scene, selectedPlace, contentVisible, timelineVisible, placesVisible, onSelectPlace, onHidePlaces }: HistoryMapProps) => {
  const id = useId().replaceAll(":", "");
  const [zoom, setZoom] = useState(1);
  const [modernBorders, setModernBorders] = useState(true);
  const [variant, setVariant] = useState<"terrain" | "simple">(terrainEnabled ? "terrain" : "simple");
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [drag, setDrag] = useState<{ x: number; y: number; pan: [number, number] } | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [viewport, setViewport] = useState({ width: 1400, height: 900 });
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setViewport({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const mobile = viewport.width <= 760;
  const viewHeight = height + (timelineVisible ? 250 : 0);
  const viewWidth = viewHeight * viewport.width / Math.max(1, viewport.height);
  const [capitalX, capitalY] = project(scene.places[0]?.at ?? [106, 17]);
  const baseCenterX = (mobile ? 440 : width / 2 + (contentVisible ? 190 : 0));
  const baseCenterY = height / 2 + (timelineVisible ? 100 : 0) + (mobile && contentVisible ? 35 : 0);
  const centerX = capitalX + (baseCenterX - capitalX) / zoom + pan[0];
  const centerY = capitalY + (baseCenterY - capitalY) / zoom + pan[1];
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const handleWheel = (event: WheelEvent) => {
      const map = svg.current;
      if (!map || !event.deltaY || (event.target instanceof Element && event.target.closest(".vo-map-tools, .vo-cluster-popup, .vo-map-directory-trigger"))) return;
      event.preventDefault();
      const bounds = map.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1);
      const next = Math.max(.5, Math.min(8, zoom * Math.exp(-Math.max(-240, Math.min(240, delta)) * .002)));
      if (next === zoom) return;
      const view = map.viewBox.baseVal;
      const pointerX = view.x + (event.clientX - bounds.left) / bounds.width * view.width;
      const pointerY = view.y + (event.clientY - bounds.top) / bounds.height * view.height;
      const focusChange = 1 / next - 1 / zoom;
      // Compensate for the button zoom's capital focus so the point under the cursor stays put.
      setPan((previous) => [previous[0] + (pointerX - view.x - view.width / 2) * (1 - zoom / next) - focusChange * (baseCenterX - capitalX), previous[1] + (pointerY - view.y - view.height / 2) * (1 - zoom / next) - focusChange * (baseCenterY - capitalY)]);
      setZoom(next);
    };
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [baseCenterX, baseCenterY, capitalX, capitalY, zoom]);
  const southY = project([106, southernLatitude[scene.territory]])[1];
  const currentPlace = scene.places[selectedPlace] ?? scene.places[0];
  const currentPortrait = currentPlace ? placePortrait(currentPlace) : undefined;
  const year = scene.year;
  const westLabel = year < 1353 ? (year < 600 ? "CÁC CỘNG ĐỒNG PHÍA TÂY" : "CÁC MƯỜNG TAI") : year < 1707 ? "LAN XANG" : year < 1893 ? "CÁC VƯƠNG QUỐC LÀO" : "LÀO";
  const southLabel = year < 192 ? "VĂN HÓA SA HUỲNH" : year < 1471 ? "CHAMPA" : year < 1832 ? "CHAMPA · PANDURANGA" : "";

  return <section className="vo-map-panel" data-map-variant={variant} aria-label="Bản đồ lịch sử hai chiều">
      <svg ref={svg} className={`vo-map ${drag ? "is-dragging" : ""}`} viewBox={`${centerX - viewWidth / (2 * zoom)} ${centerY - viewHeight / (2 * zoom)} ${viewWidth / zoom} ${viewHeight / zoom}`} role="group" aria-labelledby={`${id}-title ${id}-desc`}
        onPointerDown={(event) => { if ((event.target as Element).closest("[data-place]")) return; event.currentTarget.setPointerCapture(event.pointerId); setDrag({ x: event.clientX, y: event.clientY, pan }); }}
        onPointerMove={(event) => { if (!drag) return; const ratio = viewWidth / event.currentTarget.getBoundingClientRect().width / zoom; setPan([Math.max(-700, Math.min(700, drag.pan[0] - (event.clientX - drag.x) * ratio)), Math.max(-700, Math.min(700, drag.pan[1] - (event.clientY - drag.y) * ratio))]); }}
        onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}>
        <title id={`${id}-title`}>{`${scene.nation} — ${scene.years}`}</title>
        <desc id={`${id}-desc`}>{`Lược đồ phạm vi đất liền gần đúng. Nền địa lý hiện đại Natural Earth; tên láng giềng theo thời kỳ. Các điểm: ${scene.places.map((point) => point.name).join(", ")}. ${scene.extent}`}</desc>
        <defs>
          <pattern id={`${id}-grid`} width="76" height="72" patternUnits="userSpaceOnUse"><path d="M76 0H0V72" fill="none" className="vo-grid-line" /></pattern>
          <pattern id={`${id}-occupied`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="8" height="8" fill="var(--vo-territory)" /><path d="M0 0V8" stroke="var(--atlas-gold)" strokeOpacity=".3" strokeWidth="2" /></pattern>
          <clipPath id={`${id}-land`}>{countries.map((country) => <path key={country.name} d={country.path} />)}</clipPath>
          <clipPath id={`${id}-extent`}><rect width="1200" height={southY} x="0" y="0" /></clipPath>
          <clipPath id={`${id}-vietnam`}><path d={vietnamPath} /></clipPath>
          <radialGradient id={`${id}-glow`}><stop stopColor="var(--atlas-gold)" stopOpacity=".08" /><stop offset="1" stopColor="var(--atlas-gold)" stopOpacity="0" /></radialGradient>
        </defs>
        <rect x="-1500" y="-1500" width="4000" height="4000" className="vo-water" />
        {variant === "terrain" ? <foreignObject className="vo-relief" x="0" y="0" width="1140" height="936"><Image src="/maps/vietnam-relief.jpg" alt="Địa hình Đông Nam Á · Esri World Shaded Relief" preview={false} width={1500} height={1300} style={{ width: "100%", height: "100%" }} /></foreignObject> : null}
        <g className={modernBorders ? "vo-countries has-borders" : "vo-countries"}>{countries.map((country) => <path key={country.name} d={country.path} data-country={country.name} />)}</g>
        <rect x="-1500" y="-1500" width="4000" height="4000" fill={`url(#${id}-grid)`} />
        <circle cx={capitalX} cy={capitalY} r="240" fill={`url(#${id}-glow)`} />
        <g key={scene.id} className="vo-territory-in">
          {scene.territory === "nanyue" ? <path d={nanyuePath} clipPath={`url(#${id}-land)`} className="vo-territory" /> : <g clipPath={`url(#${id}-extent)`}><path d={vietnamPath} className="vo-territory" fill={scene.conflict && year < 905 ? `url(#${id}-occupied)` : undefined} /></g>}
          {scene.territory === "split" || scene.territory === "partition" ? <g clipPath={`url(#${id}-vietnam)`}>
            <rect x="0" y={project([106, scene.territory === "split" ? 17.72 : 17])[1]} width="1200" height="1000" className="vo-south-territory" />
            <path d={`M0 ${project([106, scene.territory === "split" ? 17.72 : 17])[1]}H1200`} className="vo-partition-line" />
          </g> : null}
        </g>
        <g className="vo-country-labels" aria-hidden="true">
          <text x="558" y="62">{northNeighbor(year)}</text>
          <text x="225" y="295" className="vo-small-label">{westLabel}</text>
          <text x="165" y="480">{year < 1238 ? "CÁC QUỐC GIA MÔN" : year < 1939 ? "XIÊM" : "THÁI LAN"}</text>
          <text x="355" y="535">{year < 1 ? "HẠ LƯU MÊ KÔNG" : year < 550 ? "PHÙ NAM" : year < 802 ? "CHÂN LẠP" : year < 1431 ? "ĐẾ QUỐC KHMER" : year < 1900 ? "CHÂN LẠP" : "CAMPUCHIA"}</text>
          {southLabel ? <text x="525" y="440" className="vo-small-label" transform="rotate(52 525 440)">{southLabel}</text> : null}
          <text x="630" y="345" className="vo-sea-label" transform="rotate(-20 630 345)">BIỂN ĐÔNG</text>
          <text x="205" y="640" className="vo-sea-label">VỊNH THÁI LAN</text>
          {scene.territory === "partition" ? <><text x="477" y="206" className="vo-zone-label">MIỀN BẮC</text><text x="555" y="497" className="vo-zone-label">MIỀN NAM</text></> : null}
          {scene.territory === "split" ? <><text x="470" y="212" className="vo-zone-label">ĐÀNG NGOÀI</text><text x="570" y="485" className="vo-zone-label">ĐÀNG TRONG</text></> : null}
        </g>
        <g className="vo-rivers" aria-hidden="true"><path d="M328 104Q354 136 380 158T430 194" /><path d="M235 298Q218 350 264 398T331 474T419 550" /></g>
        <g className="vo-vietnam-islands" aria-label="Hoàng Sa và Trường Sa thuộc lãnh thổ Việt Nam hiện nay">
          <title>Hai quần đảo của Việt Nam · lớp tham chiếu hiện đại; không biểu thị phạm vi kiểm soát của từng triều đại</title>
          {([{ name: "HOÀNG SA", at: [112, 16.5], islands: [[111.2, 15.8], [111.6, 16.5], [112.3, 16.9], [112.7, 16.6]] }, { name: "TRƯỜNG SA", at: [114, 10], islands: [[111.9, 8.65], [112.5, 9], [113.3, 9.6], [114.3, 10.2], [114.5, 11.4], [115.8, 10.7]] }]).map((group) => { const [x, y] = project(group.at); return <g key={group.name} className="vo-archipelago" data-territory="vietnam"><text x={x} y={y - 14}>{group.name}</text><text className="vo-island-country" x={x} y={y}>VIỆT NAM</text>{group.islands.map((at) => { const [cx, cy] = project(at); return <path key={at.join(",")} d={`M${cx - 3},${cy}l3,-2 3,2 -1,3 -4,0Z`} />; })}</g>; })}
        </g>
        <g className="vo-compass" transform="translate(690 620)" aria-hidden="true"><text y="-30" textAnchor="middle">B</text><path d="M0-20L7 8 0 3-7 8Z" /><path d="M0 3V20" /></g>
      </svg>
      <MapMarkers points={scene.places.map((place) => { const [x, y] = project(place.at); return { place, x: (x - centerX + viewWidth / (2 * zoom)) / (viewWidth / zoom) * viewport.width, y: (y - centerY + viewHeight / (2 * zoom)) / (viewHeight / zoom) * viewport.height }; })} selectedPlace={selectedPlace} viewport={viewport} onSelectPlace={onSelectPlace} />
      <div className="vo-map-badge"><span><i /> KHÔNG GIAN LỊCH SỬ / 2D</span><strong>{scene.nation}</strong><small>{scene.years}</small></div>
      <Card className="vo-map-tools vo-glass" aria-label="Điều khiển bản đồ"><Button variant="atlas" size="atlas" type="button" aria-label="Phóng to bản đồ" disabled={zoom >= 8} onClick={() => setZoom((value) => Math.min(8, value + .5))}>+</Button><Button variant="atlas" size="atlas" type="button" aria-label="Thu nhỏ bản đồ" disabled={zoom <= .5} onClick={() => setZoom((value) => Math.max(.5, value - .5))}>−</Button><Button variant="atlas" size="atlas" type="button" aria-label="Đặt lại góc nhìn bản đồ" onClick={() => { setZoom(1); setPan([0, 0]); }}>↺</Button><Button variant="atlas" size="atlas" type="button" aria-label="Biên giới hiện đại" aria-pressed={modernBorders} onClick={() => setModernBorders((value) => !value)}>▱</Button></Card>
      <div className="vo-map-variants vo-glass" role="group" aria-label="Kiểu bản đồ">{terrainEnabled ? <Button className="vo-variant-terrain" variant="atlas" size="atlas" aria-pressed={variant === "terrain"} onClick={() => setVariant("terrain")}>Địa hình</Button> : null}<Button className="vo-variant-simple" variant="atlas" size="atlas" aria-pressed={variant === "simple"} onClick={() => setVariant("simple")}>Đơn giản</Button></div>
      <aside className="vo-islands-inset vo-glass" aria-label="Lãnh thổ biển đảo Việt Nam"><strong>BIỂN ĐẢO VIỆT NAM</strong><span>✦ Hoàng Sa · Việt Nam</span><span>✦ Trường Sa · Việt Nam</span><small>Lớp tham chiếu hiện đại · đảo phóng đại để định vị</small></aside>
    <Card role="complementary" id="vo-places" className="vo-place-detail vo-glass" data-open={placesVisible} inert={!placesVisible} aria-label="Các địa điểm trong cảnh">
      <div className="vo-panel-heading"><span>⌖ ĐỊA ĐIỂM TRÊN BẢN ĐỒ</span><Button variant="atlas" size="atlas" type="button" aria-label="Ẩn địa điểm" onClick={onHidePlaces}>×</Button></div>
      {currentPlace ? <><strong>{currentPlace.name}</strong><small className="vo-place-subtitle">{placeSubtitle(currentPlace)}{currentPlace.leader ? ` · ${currentPlace.leader.name}` : ""}</small><p>{currentPlace.detail}</p>{currentPortrait ? <a className="vo-pin-credit" href={currentPortrait.file} target="_blank" rel="noreferrer" title={portraitCaption(currentPortrait)}>{currentPortrait.generated ? "Minh họa AI · Tái hiện nghệ thuật" : `Ảnh: ${currentPortrait.author} · ${currentPortrait.license}`} ↗</a> : null}</> : null}
      <nav className="vo-place-navigation" aria-label="Tìm hiểu địa điểm">{currentPlace?.leader ? <Link href={characterHref(currentPlace.leader.id)}>Hồ sơ {currentPlace.leader.name} →</Link> : null}{currentPlace?.eventId ? <Link href={`/vietnam/${currentPlace.eventId}`}>Xem cuộc khởi nghĩa →</Link> : null}{scene.id === "tran-bach-dang" ? <Link href="/vietnam/bach-dang-1288">Khám phá trận Bạch Đằng 1288 →</Link> : null}</nav>
      <div className="vo-place-list">{scene.places.map((point, index) => <Button variant="atlas" size="atlas" key={point.name} type="button" aria-label={point.name} title={`${point.name} · ${placeSubtitle(point)}`} aria-pressed={selectedPlace === index} onClick={() => onSelectPlace(index)}><PlaceIcon kind={point.kind} /></Button>)}</div>
    </Card>
  </section>;
};
