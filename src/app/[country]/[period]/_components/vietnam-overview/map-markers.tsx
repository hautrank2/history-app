import { Image } from "@/components/ui/image";

import { Button } from "~/components/ui/button";
import type { OverviewPlaceModel } from "~/data/vietnam-overview";

import { placePortrait, portraitCaption } from "./portraits";

export const placeSubtitle = (place: OverviewPlaceModel) => place.subtitle ?? ({ capital: "Kinh đô", battle: "Trận đánh", camp: "Căn cứ đóng quân", heritage: "Di tích · văn hóa" }[place.kind]);

export const PlaceIcon = ({ kind }: { kind: OverviewPlaceModel["kind"] }) => <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {kind === "battle" ? <><path d="m7 4 17 17 3-1-1-3L9 2 7 4Zm18 0L8 21l-3-1 1-3L23 2l2 2ZM4 22l6 6m12-6 6 6M7 25l-4 4m22-4 4 4" /></> : null}
  {kind === "capital" ? <><path d="M4 28V13h6v4h12v-4h6v15H4Zm8 0v-6a4 4 0 0 1 8 0v6M3 13l4-5 4 5m10 0 4-5 4 5M16 17V3m0 0h8l-2 3 2 3h-8" /></> : null}
  {kind === "camp" ? <><path d="M3 27 16 8l13 19H3Zm8 0 5-12 5 12M16 8V2m0 0h9l-3 3 3 3h-9M2 28h28" /></> : null}
  {kind === "heritage" ? <><path d="M3 12 16 4l13 8H3Zm2 4h22M7 16v9m9-9v9m9-9v9M4 25h24M2 29h28" /></> : null}
</svg>;

type MarkerModel = { place: OverviewPlaceModel; x: number; y: number };
type RectModel = { x: number; y: number; w: number; h: number };
const intersects = (a: RectModel, b: RectModel) => a.x < b.x + b.w + 8 && a.x + a.w + 8 > b.x && a.y < b.y + b.h + 8 && a.y + a.h + 8 > b.y;

export const MapMarkers = ({ points, selectedPlace, viewport, contentVisible, timelineVisible, onSelectPlace }: {
  points: MarkerModel[]; selectedPlace: number; viewport: { width: number; height: number }; contentVisible: boolean; timelineVisible: boolean; onSelectPlace: (index: number) => void;
}) => {
  const mobile = viewport.width <= 760;
  const dock = timelineVisible ? viewport.height <= 650 ? 136 : mobile ? 155 : 188 : mobile ? 20 : 24;
  const panelWidth = viewport.width >= 1500 ? 440 : viewport.width <= 1050 ? 355 : Math.min(400, viewport.width * .34);
  const right = viewport.width - (contentVisible && !mobile ? panelWidth + 42 : 16);
  const storyHeight = Math.min(viewport.height * (viewport.height <= 650 ? .6 : .54), viewport.height <= 650 ? 370 : 450, viewport.height - dock - 192);
  const bottom = viewport.height - dock - (contentVisible && mobile ? storyHeight + 15 : 20);
  const occupied: RectModel[] = mobile && contentVisible ? [] : [{ x: mobile ? 12 : 24, y: 65, w: mobile ? 165 : 240, h: mobile ? 105 : 150 }];
  occupied.push(mobile ? { x: 12, y: 58, w: viewport.width - 24, h: 56 } : { x: 24, y: viewport.height - dock - 128, w: 310, h: 100 });
  if (mobile && contentVisible) occupied.push({ x: viewport.width - 52, y: 170, w: 42, h: 135 });
  const selectedWidth = Math.max(100, Math.min(178, viewport.width - 24));
  const rowStart = (viewport.width - selectedWidth - (points.length - 1) * 52) / 2;
  const dense = points.length > 6;
  const layout = points.map((point, index) => ({ ...point, index })).sort((a, b) => Number(b.index === selectedPlace) - Number(a.index === selectedPlace)).map((point, order) => {
    const compact = mobile && contentVisible && point.index !== selectedPlace;
    const w = compact ? 44 : mobile && contentVisible ? selectedWidth : mobile ? 178 : 202;
    const h = 58;
    const candidates = [0, -62, 62, -124, 124, -186, 186].flatMap((dy) => [0, -w - 8, w + 8, -80, 80].map((dx) => ({ x: Math.max(12, Math.min(right - w, point.x - 22 + dx)), y: Math.max(65, Math.min(Math.max(65, bottom - h), point.y - 22 + dy)), w, h })));
    const score = (rect: RectModel) => occupied.reduce((sum, other) => sum + (intersects(rect, other) ? 100000 : 0), 0) + Math.hypot(rect.x + 22 - point.x, rect.y + 22 - point.y);
    const rect = mobile && contentVisible && !dense ? { x: rowStart + (order ? selectedWidth + 8 + (order - 1) * 52 : 0), y: Math.max(65, bottom - h), w, h } : candidates.reduce((best, candidate) => score(candidate) < score(best) ? candidate : best);
    if (dense) {
      const left = mobile ? 12 : 280;
      const columns = mobile ? 3 : Math.max(2, Math.floor((right - left) / 205));
      const cellWidth = mobile ? (viewport.width - 24) / columns : 205;
      rect.x = left + (order % columns) * cellWidth;
      rect.y = (mobile ? contentVisible ? 122 : 250 : 80) + Math.floor(order / columns) * (mobile ? contentVisible ? 36 : 64 : 76);
      rect.w = Math.min(cellWidth - 6, 195);
    }
    occupied.push(rect);
    return { ...point, ...rect, anchorX: point.x, anchorY: point.y, compact };
  });

  return <div className={`vo-map-markers ${dense ? "is-dense" : ""}`} data-place-count={points.length}>
    <svg className="vo-marker-lines" width={viewport.width} height={viewport.height} aria-hidden="true">{layout.map((point) => <g key={point.index}><path d={`M${point.anchorX} ${point.anchorY}L${point.x + 22} ${point.y + 22}`} /><circle cx={point.anchorX} cy={point.anchorY} r="3" /></g>)}</svg>
    {layout.map(({ place, index, x, y, compact }) => {
      const portrait = placePortrait(place);
      return <Button variant="atlas" size="atlas" key={place.name} data-place-id={place.leader?.id ?? place.eventId ?? index} type="button" className={`vo-map-pin is-${place.kind} ${index === selectedPlace ? "is-selected" : ""} ${compact ? "is-compact" : ""}`} style={{ left: x, top: y, maxWidth: dense ? (mobile ? (viewport.width - 24) / 3 - 6 : 195) : mobile && contentVisible && !compact ? selectedWidth : undefined }} aria-label={`${place.name} · ${placeSubtitle(place)}${place.leader ? ` · ${place.leader.name}` : ""}`} aria-pressed={index === selectedPlace} title={`${place.name} — ${placeSubtitle(place)}${place.leader ? ` · ${place.leader.name}` : ""}\n${place.detail}`} onClick={() => onSelectPlace(index)}>
        <span className={`vo-pin-symbol ${portrait ? "has-portrait" : ""}`}>{portrait ? <><span className="vo-pin-photo" title={portraitCaption(portrait)}><Image preview={false} src={portrait.src} alt={`Hình ${place.leader?.name}${portrait.generated ? " · minh họa AI" : ""}`} fill sizes="44px" style={{ objectPosition: portrait.position }} /></span>{portrait.generated ? <span className="vo-pin-ai" aria-hidden="true">AI</span> : null}<span className="vo-pin-rank"><PlaceIcon kind={place.kind} /></span></> : <PlaceIcon kind={place.kind} />}</span>
        <span className="vo-pin-label"><strong>{place.name}</strong><small>{placeSubtitle(place)}</small>{place.leader ? <span>{place.leader.name}</span> : null}</span>
      </Button>;
    })}
  </div>;
};
