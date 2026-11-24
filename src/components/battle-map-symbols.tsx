"use client";

import { Footprints, Swords, Undo2, Truck, Shield } from "lucide-react";
import { useId } from "react";
import "~/styles/battle-map-symbols.css";

export type BattleAction = "march" | "attack" | "retreat" | "supply" | "defend";
export const battleActions = {
  march: { label: "Hành quân", color: "#7dd3fc", Icon: Footprints },
  attack: { label: "Tiến công", color: "#ffad85", Icon: Swords },
  retreat: { label: "Rút quân", color: "#d8b4fe", Icon: Undo2 },
  supply: { label: "Tiếp tế", color: "#fde68a", Icon: Truck },
  defend: { label: "Phòng ngự", color: "#86efac", Icon: Shield },
};

export function BattleRoute({ path, kind, label, scale = 1, badgeAt }: {
  path: string; kind: BattleAction; label: string; scale?: number; badgeAt?: { x: number; y: number };
}) {
  const id = useId().replaceAll(":", "");
  const { color, Icon } = battleActions[kind];
  return <g className={`battle-route is-${kind}`} style={{ color }} aria-label={label}>
    <title>{`${battleActions[kind].label} · ${label} · Hướng khái quát`}</title>
    <defs><marker id={`${id}-arrow`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L11 6L1 11Z" fill={color} /></marker></defs>
    <path d={path} className="battle-route-halo" vectorEffect="non-scaling-stroke" />
    <path d={path} className="battle-route-line" stroke={color} markerEnd={`url(#${id}-arrow)`} vectorEffect="non-scaling-stroke" />
    {badgeAt && <g transform={`translate(${badgeAt.x} ${badgeAt.y}) scale(${scale})`} pointerEvents="none">
      <circle r="11" fill="#101d2a" stroke={color} strokeWidth="1.5" />
      <Icon x={-6} y={-6} width={12} height={12} color={color} />
    </g>}
    <g className="battle-route-traveler" pointerEvents="none">
      <animateMotion dur="7s" repeatCount="indefinite" path={path} />
      <g transform={`scale(${scale})`}>
        <circle r="4" fill={color} stroke="#101d2a" strokeWidth="1.5" />
      </g>
    </g>
  </g>;
}

export function BattleMapLegend() {
  return <div className="battle-symbol-legend" aria-label="Ký hiệu bản đồ">
    <span><i className="battle-leader-symbol">♛</i>Lãnh đạo</span>
    {Object.entries(battleActions).map(([kind, { label, color, Icon }]) => <span key={kind} style={{ color }}><Icon size={14} />{label}</span>)}
  </div>;
}
