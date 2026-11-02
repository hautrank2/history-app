"use client";

import { Popover, Tooltip } from "radix-ui";

import { lifeScenes } from "~/data/ho-chi-minh";
import { lifePhase, projectLifePoint } from "~/lib/life-map-geometry";
import { clusterMapPoints } from "~/lib/map-clusters";

type RouteInsetsProps = { countries: { name: string; path: string }[]; index: number; onGo: (index: number) => void };
const regions = [
  { id: "europe", name: "Châu Âu · những lần trở lại", bounds: [-5, 41, 42, 60] },
  { id: "vietnam", name: "Việt Nam & vùng lân cận", bounds: [99, 8, 115, 25] },
];

export const RouteInsets = ({ countries, index, onGo }: RouteInsetsProps) => <div className="hcm-route-insets" aria-label="Lược đồ phóng to các vùng có nhiều mốc">{regions.map((region) => {
  const [west, south, east, north] = region.bounds;
  const [x1, y1] = projectLifePoint([west, north]);
  const [x2, y2] = projectLifePoint([east, south]);
  const width = Math.max(x2 - x1, (y2 - y1) * 260 / 160);
  const height = width * 160 / 260;
  const left = (x1 + x2 - width) / 2;
  const top = (y1 + y2 - height) / 2;
  const places = lifeScenes.map((stop, stopIndex) => ({ stop, stopIndex })).filter(({ stop }) => stop.location.at[0] >= west && stop.location.at[0] <= east && stop.location.at[1] >= south && stop.location.at[1] <= north);
  const clusters = clusterMapPoints(places.map(({ stop }, index) => { const [x, y] = projectLifePoint(stop.location.at); return { index, x: (x - left) / width * 260, y: (y - top) / height * 160 }; }), 16);
  return <section className="hcm-route-inset" key={region.id} aria-label={region.name}><h3>{region.name}<small>Phóng to</small></h3><div className="hcm-route-inset-stage"><svg viewBox={`${left} ${top} ${width} ${height}`} aria-hidden="true"><g className="hcm-map-countries has-borders">{countries.map((country) => <path key={country.name} d={country.path} data-country={country.name} />)}</g></svg>{clusters.map((cluster) => {
    const group = cluster.indices.map((i) => places[i]);
    const selected = group.find(({ stopIndex }) => stopIndex === index);
    const main = selected ?? group[0];
    const numbers = group.map(({ stopIndex }) => stopIndex + 1);
    return <Popover.Root key={cluster.id}><Tooltip.Root><Tooltip.Trigger asChild><Popover.Trigger asChild><button className="hcm-inset-point" type="button" data-phase={lifePhase(main.stop)} data-selected={Boolean(selected)} style={{ left: `${cluster.x / 260 * 100}%`, top: `${cluster.y / 160 * 100}%` }} aria-label={`${region.name}. Mốc ${numbers.join(", ")}: ${group.map(({ stop }) => `${stop.location.name}, ${stop.date}`).join("; ")}`}><b>{main.stopIndex + 1}{group.length > 1 ? "+" : ""}</b><span>{main.stop.location.name.split(" · ")[0]}</span></button></Popover.Trigger></Tooltip.Trigger><Tooltip.Portal><Tooltip.Content className="hcm-map-tooltip" sideOffset={12} collisionPadding={12}><strong>{region.name}</strong><ol>{group.map(({ stop, stopIndex }) => <li key={stop.id}><b>{stopIndex + 1}</b><span>{stop.location.name}<small>{stop.date} · {stop.title}</small></span></li>)}</ol><p>Bấm để chọn từng lần đến theo thứ tự.</p><Tooltip.Arrow /></Tooltip.Content></Tooltip.Portal></Tooltip.Root><Popover.Portal><Popover.Content className="hcm-cluster-popup" sideOffset={12} collisionPadding={12} aria-label={`Các mốc trong ${region.name}`}><div className="hcm-cluster-heading"><strong>{region.name}</strong><Popover.Close aria-label="Đóng danh sách vùng">×</Popover.Close></div><div className="hcm-cluster-list">{group.map(({ stop, stopIndex }) => <Popover.Close asChild key={stop.id}><button type="button" aria-current={stopIndex === index ? "step" : undefined} onClick={() => onGo(stopIndex)}><b className="hcm-cluster-number">{stopIndex + 1}</b><span><strong>{stop.location.name}</strong><small>{stop.date} · {stop.title}</small></span></button></Popover.Close>)}</div></Popover.Content></Popover.Portal></Popover.Root>;
  })}</div></section>;
})}</div>;
