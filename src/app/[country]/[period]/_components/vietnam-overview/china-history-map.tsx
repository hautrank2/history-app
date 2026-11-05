"use client";

import { useEffect, useId, useRef, useState } from "react";

import { CompactLink } from "~/components/compact-link";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { chinaMapIdFor } from "~/data/china-overview";
import { chinaStateMaps } from "~/data/china-state-maps";
import geography from "~/data/geo/world.json";
import type { OverviewSceneModel } from "~/data/vietnam-overview";

import { MapMarkers, PlaceIcon, placeSubtitle } from "./map-markers";

type ChinaHistoryMapProps = {
  scene: OverviewSceneModel;
  selectedPlace: number;
  contentVisible: boolean;
  timelineVisible: boolean;
  placesVisible: boolean;
  onSelectPlace: (index: number) => void;
  onHidePlaces: () => void;
};

const project = ([longitude, latitude]: number[]) => [
  (longitude - 75) * 16,
  (55 - latitude) * 20,
];
const ringPath = (ring: number[][]) => `${ring.map((point, index) =>
  `${index ? "L" : "M"}${project(point).join(",")}`,
).join("")}Z`;
const countries = geography.filter((country) => [
  "China", "Mongolia", "Russia", "India", "Nepal", "Bhutan", "Pakistan",
  "Afghanistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Myanmar",
  "Thailand", "Laos", "Vietnam", "Cambodia", "Taiwan", "Japan",
  "North Korea", "South Korea", "Philippines", "Bangladesh",
].includes(country.name)).map((country) => {
  const polygons = country.geometry.type === "Polygon"
    ? [country.geometry.coordinates as number[][][]]
    : country.geometry.coordinates as number[][][][];
  return {
    name: country.name,
    path: polygons.map((polygon) => polygon.map(ringPath).join("")).join(""),
  };
});

export const ChinaHistoryMap = ({
  scene,
  selectedPlace,
  contentVisible,
  timelineVisible,
  placesVisible,
  onSelectPlace,
  onHidePlaces,
}: ChinaHistoryMapProps) => {
  const id = useId().replaceAll(":", "");
  const snapshot = chinaStateMaps[chinaMapIdFor(scene.id) ?? ""];
  const places = snapshot ? snapshot.states.map((state) => ({
    name: state.capital.name,
    at: state.capital.at,
    kind: "capital" as const,
    subtitle: `Kinh đô / trung tâm ${state.name}`,
    detail: state.summary,
  })) : scene.places;
  const selectedState = placesVisible ? snapshot?.states[selectedPlace] : undefined;
  const svg = useRef<SVGSVGElement>(null);
  const pointerMoved = useRef(false);
  const [viewport, setViewport] = useState({ width: 1400, height: 900 });
  const initialZoom = snapshot?.states.length && snapshot.states.length > 12 ? 2.2 : 1;
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [drag, setDrag] = useState<{
    x: number; y: number; pan: [number, number];
  } | null>(null);
  const [modernBorders, setModernBorders] = useState(!snapshot);
  const [historicalBorders, setHistoricalBorders] = useState(true);
  const mobile = viewport.width <= 760;
  const fitScale = mobile ? initialZoom : 1;
  const viewHeight = mobile ? 1100 * fitScale : timelineVisible ? 1100 : 950;
  const viewWidth = viewHeight * viewport.width / Math.max(1, viewport.height);
  const centerX = 560 + (!mobile && contentVisible ? 180 : 0) + pan[0];
  const centerY = 430 + (mobile && contentVisible ? 190 : 0) + pan[1];
  const left = centerX - viewWidth / (2 * zoom);
  const top = centerY - viewHeight / (2 * zoom);
  const currentPlace = places[selectedPlace] ?? places[0];
  const selectState = (index: number) => {
    onSelectPlace(index);
    const state = snapshot?.states[index];
    if (!state) return;
    const [x, y] = project(state.labelAt);
    setPan([x - 560, y - 430]);
  };

  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setViewport({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const delta = event.deltaY * (
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1
      );
      const next = Math.max(0.5, Math.min(8, zoom * Math.exp(-delta * 0.002)));
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      setPan((previous) => [
        previous[0] + x * viewWidth * (1 / zoom - 1 / next),
        previous[1] + y * viewHeight * (1 / zoom - 1 / next),
      ]);
      setZoom(next);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [viewHeight, viewWidth, zoom]);

  return (
    <section
      className="vo-map-panel china-history-map"
      data-map-variant="simple"
      aria-label="Bản đồ lịch sử Trung Quốc hai chiều"
    >
      <svg
        ref={svg}
        className={`vo-map ${drag ? "is-dragging" : ""}`}
        viewBox={`${left} ${top} ${viewWidth / zoom} ${viewHeight / zoom}`}
        role="group"
        aria-labelledby={`${id}-title ${id}-description`}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          pointerMoved.current = false;
          setDrag({ x: event.clientX, y: event.clientY, pan });
        }}
        onPointerMove={(event) => {
          if (!drag) return;
          if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 4) {
            return;
          }
          pointerMoved.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          const ratio = viewWidth / viewport.width / zoom;
          setPan([
            drag.pan[0] - (event.clientX - drag.x) * ratio,
            drag.pan[1] - (event.clientY - drag.y) * ratio,
          ]);
        }}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
        onLostPointerCapture={() => setDrag(null)}
        onPointerLeave={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
            setDrag(null);
          }
        }}
      >
        <title id={`${id}-title`}>{snapshot?.title ?? `${scene.nation} · ${scene.years}`}</title>
        <desc id={`${id}-description`}>
          {snapshot?.note ?? `${scene.extent} Các đô thành được định vị gần đúng trên nền Natural Earth.`}
        </desc>
        <defs>
          <clipPath id={`${id}-land`}>
            {countries.map((country) => <path key={country.name} d={country.path} />)}
          </clipPath>
          <pattern
            id={`${id}-grid`}
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path d="M80 0H0V80" fill="none" className="vo-grid-line" />
          </pattern>
        </defs>
        <rect x="-5000" y="-5000" width="10000" height="10000" className="vo-water" />
        <g className={`vo-countries ${modernBorders ? "has-borders" : ""}`}>
          {countries.map((country) => (
            <path key={country.name} d={country.path} data-country={country.name} />
          ))}
        </g>
        <rect x="-5000" y="-5000" width="10000" height="10000" fill={`url(#${id}-grid)`} />
        {snapshot ? (
          <g
            className="china-historical-states"
            data-map-year={snapshot.year}
            clipPath={`url(#${id}-land)`}
          >
            {snapshot.states.map((state, index) => (
              <path
                key={state.id}
                data-state-id={state.id}
                d={state.rings.map(ringPath).join("")}
                fill={state.color}
                fillOpacity={selectedState?.id === state.id ? 0.68 : 0.36}
                stroke={historicalBorders ? state.color : "none"}
                strokeWidth={selectedState?.id === state.id ? 3 : 1.5}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                role="button"
                tabIndex={0}
                aria-label={`${state.name} · năm ${snapshot.year < 0 ? `${-snapshot.year} TCN` : snapshot.year} · ${state.capital.name}`}
                onClick={() => {
                  if (!pointerMoved.current) selectState(index);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectState(index);
                  }
                }}
              >
                <title>{`${state.name} · ${state.summary}`}</title>
              </path>
            ))}
          </g>
        ) : null}
        {snapshot ? (
          <g className="china-state-labels pointer-events-none" aria-hidden="true">
            {snapshot.states.map((state) => {
              const [x, y] = project(state.labelAt);
              return (
                <text
                  key={state.id}
                  x={x}
                  y={y}
                  fill={state.color}
                  stroke="var(--background)"
                  strokeWidth="3"
                  paintOrder="stroke"
                  textAnchor="middle"
                  fontSize={snapshot.states.length > 12 ? 8 : 12}
                  fontWeight="600"
                >
                  {state.name}
                </text>
              );
            })}
          </g>
        ) : null}
        <g className="vo-country-labels" aria-hidden="true">
          <text x="600" y="350">ĐÔNG Á</text>
          <text x="980" y="650" className="vo-sea-label">THÁI BÌNH DƯƠNG</text>
        </g>
      </svg>
      <MapMarkers
        showMarkers={!snapshot || placesVisible || zoom / fitScale >= 3}
        points={places.map((place) => {
          const [x, y] = project(place.at);
          return {
            place,
            x: (x - left) / (viewWidth / zoom) * viewport.width,
            y: (y - top) / (viewHeight / zoom) * viewport.height,
          };
        })}
        selectedPlace={selectedPlace}
        viewport={viewport}
        onSelectPlace={selectState}
      />
      <div className="vo-map-badge">
        <span><i /> KHÔNG GIAN LỊCH SỬ / 2D</span>
        <strong>{snapshot ? `Mốc ${snapshot.year < 0 ? `${-snapshot.year} TCN` : snapshot.year}` : scene.nation}</strong>
        <small>{snapshot ? "Ranh giới lịch sử giản lược · chọn vùng màu để xem" : `${scene.years} · Nền địa lý hiện đại`}</small>
      </div>
      {snapshot ? (
        <details
          className="china-state-legend vo-glass absolute bottom-[calc(var(--vo-dock)+18px)] left-6 z-5 flex max-h-[240px] w-[310px] flex-col gap-2 overflow-hidden rounded-lg p-3 max-[760px]:top-[90px] max-[760px]:bottom-auto max-[760px]:left-3 max-[760px]:max-h-[64px] max-[760px]:gap-1 max-[760px]:p-2 max-[760px]:w-[calc(100vw-24px)]"
          aria-label="Chú giải các nước trên bản đồ"
        >
          <summary className="china-state-legend-toggle flex cursor-pointer list-none items-center justify-between gap-2 text-xs text-primary [&::-webkit-details-marker]:hidden">
            <span className="text-xs">Chú giải · {snapshot.states.length} nước / thế lực</span>
            <span aria-hidden="true">⌄</span>
          </summary>
          <div
            className="china-state-legend-list mt-2 grid max-h-[150px] min-h-0 grid-cols-2 gap-1 overflow-y-auto max-[760px]:mt-1 max-[760px]:flex max-[760px]:max-h-6 max-[760px]:overflow-x-auto max-[760px]:overflow-y-hidden"
            style={{ scrollbarWidth: mobile ? "none" : "thin" }}
          >
            {snapshot.states.map((state, index) => (
              <button
                key={state.id}
                className="china-state-legend-item flex min-h-7 items-center gap-2 rounded px-1.5 py-1 text-left text-[11px] text-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring max-[760px]:min-h-6 max-[760px]:shrink-0 max-[760px]:py-0.5"
                type="button"
                data-state-id={state.id}
                aria-pressed={selectedState?.id === state.id}
                onClick={() => selectState(index)}
              >
                <i className="size-2.5 shrink-0 rounded-sm" style={{ background: state.color }} />
                <span className="text-[11px] font-normal leading-relaxed">{state.name}</span>
              </button>
            ))}
          </div>
          {snapshot.sources[0] ? (
            <CompactLink
              className="max-[760px]:hidden"
              href={snapshot.sources[0].url}
              label={`Nguồn bản đồ: ${snapshot.sources[0].title}`}
            />
          ) : null}
        </details>
      ) : null}
      <Card
        className="vo-map-tools vo-glass max-[760px]:!top-[156px] max-[760px]:!right-auto max-[760px]:!bottom-auto max-[760px]:!left-3 max-[760px]:!flex-row"
        aria-label="Điều khiển bản đồ"
      >
        <Button
          variant="atlas"
          size="atlas"
          aria-label="Phóng to bản đồ"
          disabled={zoom >= 8}
          onClick={() => setZoom((value) => Math.min(8, value + 0.5))}
        >
          +
        </Button>
        <Button
          variant="atlas"
          size="atlas"
          aria-label="Thu nhỏ bản đồ"
          disabled={zoom <= 0.5}
          onClick={() => setZoom((value) => Math.max(0.5, value - 0.5))}
        >
          −
        </Button>
        <Button
          variant="atlas"
          size="atlas"
          aria-label="Đặt lại góc nhìn bản đồ"
          onClick={() => {
            setZoom(initialZoom);
            setPan([0, 0]);
          }}
        >
          ↺
        </Button>
        {snapshot ? (
          <Button
            variant="atlas"
            size="atlas"
            aria-label="Ranh giới lịch sử"
            aria-pressed={historicalBorders}
            onClick={() => setHistoricalBorders((value) => !value)}
          >
            ▧
          </Button>
        ) : null}
        <Button
          variant="atlas"
          size="atlas"
          aria-label="Biên giới hiện đại"
          aria-pressed={modernBorders}
          onClick={() => setModernBorders((value) => !value)}
        >
          ▱
        </Button>
      </Card>
      <Card
        role="complementary"
        id="vo-places"
        className="vo-place-detail vo-glass"
        data-open={placesVisible}
        inert={!placesVisible}
        aria-label="Các địa điểm trong cảnh"
      >
        <div className="vo-panel-heading">
          <span>⌖ ĐỊA ĐIỂM TRÊN BẢN ĐỒ</span>
          <Button variant="atlas" size="atlas" aria-label="Ẩn địa điểm" onClick={onHidePlaces}>×</Button>
        </div>
        {currentPlace ? (
          <>
            <strong>{selectedState?.name ?? currentPlace.name}</strong>
            <small className="vo-place-subtitle">{placeSubtitle(currentPlace)}</small>
            <p>{currentPlace.detail}</p>
          </>
        ) : null}
        <div className="vo-place-list flex-wrap">
          {places.map((place, index) => (
            <Button
              variant="atlas"
              size="atlas"
              key={place.name}
              type="button"
              aria-label={place.name}
              title={place.name}
              aria-pressed={selectedPlace === index}
              onClick={() => selectState(index)}
            >
              <PlaceIcon kind={place.kind} />
            </Button>
          ))}
        </div>
      </Card>
    </section>
  );
};
