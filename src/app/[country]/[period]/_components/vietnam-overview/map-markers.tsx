"use client";

import { Image } from "@/components/ui/image";

import { List, X } from "lucide-react";
import { Popover } from "radix-ui";
import { useState } from "react";
import type { ReactElement } from "react";

import { clusterMapPoints } from "~/lib/map-clusters";
import type { OverviewPlaceModel } from "~/data/vietnam-overview";

import { placePortrait, portraitCaption } from "./portraits";

export const placeSubtitle = (place: OverviewPlaceModel) => place.subtitle ?? ({ capital: "Kinh đô", battle: "Trận đánh", camp: "Căn cứ đóng quân", heritage: "Di tích · văn hóa" }[place.kind]);
const placeLabel = (place: OverviewPlaceModel) => place.kind === "battle" && !place.eventId && !/^trận\s/i.test(place.name) ? `Trận ${place.name}` : place.name;

export const PlaceIcon = ({ kind }: { kind: OverviewPlaceModel["kind"] }) => <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {kind === "battle" ? <><path d="m7 4 17 17 3-1-1-3L9 2 7 4Zm18 0L8 21l-3-1 1-3L23 2l2 2ZM4 22l6 6m12-6 6 6M7 25l-4 4m22-4 4 4" /></> : null}
  {kind === "capital" ? <><path d="M4 28V13h6v4h12v-4h6v15H4Zm8 0v-6a4 4 0 0 1 8 0v6M3 13l4-5 4 5m10 0 4-5 4 5M16 17V3m0 0h8l-2 3 2 3h-8" /></> : null}
  {kind === "camp" ? <><path d="M3 27 16 8l13 19H3Zm8 0 5-12 5 12M16 8V2m0 0h9l-3 3 3 3h-9M2 28h28" /></> : null}
  {kind === "heritage" ? <><path d="M3 12 16 4l13 8H3Zm2 4h22M7 16v9m9-9v9m9-9v9M4 25h24M2 29h28" /></> : null}
</svg>;

type MarkerModel = { place: OverviewPlaceModel; x: number; y: number };
type MapMarkersProps = {
  points: MarkerModel[]; selectedPlace: number; viewport: { width: number; height: number };
  onSelectPlace: (index: number) => void;
  showMarkers?: boolean;
};

const PlaceSymbol = ({ place }: { place: OverviewPlaceModel }) => {
  const portrait = placePortrait(place);
  return <span className="vo-point-symbol">{portrait ? <Image src={portrait.src} alt="" preview={false} fill sizes="36px" title={portraitCaption(portrait)} style={{ objectPosition: portrait.position }} /> : <PlaceIcon kind={place.kind} />}</span>;
};

export const MapMarkers = ({
  points,
  selectedPlace,
  viewport,
  onSelectPlace,
  showMarkers = true,
}: MapMarkersProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const clusters = clusterMapPoints(points.map((point, index) => ({ index, x: point.x, y: point.y })), viewport.width <= 760 ? 48 : 58);
  const choose = (index: number) => { setExpanded(null); onSelectPlace(index); };
  const list = (indices: number[]) => <div className="vo-cluster-list">{indices.map((index) => {
    const place = points[index].place;
    return <button className="vo-cluster-item" type="button" key={index} data-place-id={place.eventId ?? place.leader?.id ?? index} aria-pressed={index === selectedPlace} onClick={() => choose(index)}>
      <PlaceSymbol place={place} /><span className="vo-cluster-item-copy"><strong>{place.name}</strong><small>{place.leader?.name ?? placeSubtitle(place)}</small></span><span className="vo-cluster-item-index">{String(index + 1).padStart(2, "0")}</span>
    </button>;
  })}</div>;
  const picker = (id: string, title: string, indices: number[], trigger: ReactElement) => <Popover.Root key={id} open={expanded === id} onOpenChange={(open) => setExpanded(open ? id : null)}>
    <Popover.Trigger asChild>{trigger}</Popover.Trigger>
    <Popover.Portal><Popover.Content className="vo-cluster-popup vo-glass" sideOffset={12} collisionPadding={14} avoidCollisions aria-label={title}>
      <div className="vo-cluster-heading"><div><span>ĐỊA ĐIỂM LỊCH SỬ</span><strong>{title}</strong></div><Popover.Close className="vo-cluster-close" aria-label="Đóng danh sách địa điểm"><X size={16} /></Popover.Close></div>
      {list(indices)}<p className="vo-cluster-caption">Chọn một địa điểm để xem thông tin · Phóng to để tách cụm</p>
      <Popover.Arrow className="vo-cluster-arrow" />
    </Popover.Content></Popover.Portal>
  </Popover.Root>;

  return <div className="vo-map-markers vo-cluster-layer" data-place-count={points.length}>
    {showMarkers ? clusters.filter((cluster) => cluster.x >= -24 && cluster.y >= 64 && cluster.x <= viewport.width + 24 && cluster.y <= viewport.height - 24).map((cluster) => {
      if (cluster.indices.length === 1) {
        const index = cluster.indices[0]; const place = points[index].place;
        return <button key={cluster.id} className={`vo-map-point is-${place.kind} ${selectedPlace === index ? "is-selected" : ""}`} data-place-id={place.eventId ?? place.leader?.id ?? index} type="button" style={{ left: cluster.x, top: cluster.y }} aria-label={`${place.name} · ${place.leader?.name ?? placeSubtitle(place)}`} aria-pressed={selectedPlace === index} title={`${place.name} · ${place.leader?.name ?? placeSubtitle(place)}`} onClick={() => choose(index)}>
          <PlaceSymbol place={place} /><span className="vo-point-label">{placeLabel(place)}</span>
        </button>;
      }
      return <div key={cluster.id} className="vo-map-cluster" data-cluster-count={cluster.indices.length} style={{ left: cluster.x, top: cluster.y }} role="group" aria-label="Địa điểm lịch sử">
        {cluster.indices.slice(0, 3).map((index) => {
          const place = points[index].place;
          const description = place.leader?.name ?? placeSubtitle(place);
          return <button key={index} className="vo-cluster-place" type="button" data-place-id={place.eventId ?? place.leader?.id ?? index} aria-pressed={selectedPlace === index} aria-label={`${place.name} · ${description}`} title={`${place.name} · ${description}`} onClick={() => choose(index)}>
            <span className="vo-cluster-place-icon"><PlaceIcon kind={place.kind} /></span>
            <span className="vo-cluster-place-name">{placeLabel(place)}</span>
            <span className="vo-cluster-place-detail">{description}</span>
          </button>;
        })}
        {cluster.indices.length > 3 ? picker(cluster.id, "Địa điểm trong cụm", cluster.indices, <button className="vo-cluster-place vo-cluster-more" type="button" aria-label={`Xem thêm ${cluster.indices.length - 3} địa điểm`} title={`Xem thêm ${cluster.indices.length - 3} địa điểm`}>+{cluster.indices.length - 3}</button>) : null}
      </div>;
    }) : null}
    {picker("all", `Tất cả ${points.length} địa điểm`, points.map((_, index) => index), <button type="button" className="vo-map-directory-trigger vo-glass" aria-label={`Danh sách ${points.length} địa điểm`}><List size={15} /><span>{points.length} địa điểm</span></button>)}
  </div>;
};
