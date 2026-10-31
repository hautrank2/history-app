"use client";

import { Image } from "@/components/ui/image";
import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { battlePortraitFor, getCharacter } from "~/data/characters";

import { battlePlaces } from "./locations";
import { BattleMap } from "./map";
import type { createBattleScene } from "./scene-3d";

type BattleMap3DProps = { stage: number; selected: string; onSelect: (place: string) => void };
type BattleScene = ReturnType<typeof createBattleScene>;
const places = battlePlaces;
const commanders = [
  { ...getCharacter("tran-hung-dao"), role: "Quốc công Tiết chế · chỉ huy Đại Việt", side: "home" },
  { ...getCharacter("o-ma-nhi"), role: "Chỉ huy thủy quân Nguyên", side: "enemy" },
  { ...getCharacter("thoat-hoan"), role: "Tổng chỉ huy quân Nguyên", side: "enemy" },
];

export const BattleMap3D = ({ stage, selected, onSelect }: BattleMap3DProps) => {
  const host = useRef<HTMLDivElement>(null);
  const pins = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const scene = useRef<BattleScene | null>(null);
  const latestStage = useRef(stage);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [commander, setCommander] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const selectedCommander = commanders.find((person) => person.id === commander);

  useEffect(() => {
    if (!expanded) return;
    const previousFocus = document.activeElement;
    wrapper.current?.querySelector<HTMLButtonElement>("[aria-expanded='true']")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
      if (event.key !== "Tab") return;
      const buttons = wrapper.current?.querySelectorAll<HTMLButtonElement>("button");
      const first = buttons?.[0]; const last = buttons?.[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = previousOverflow; if (previousFocus instanceof HTMLElement) previousFocus.focus(); };
  }, [expanded]);

  useEffect(() => {
    latestStage.current = stage;
    scene.current?.setStage(stage);
  }, [stage]);

  useEffect(() => {
    let cancelled = false;
    let activeScene: BattleScene | null = null;
    import("./scene-3d").then(({ createBattleScene }) => {
      if (cancelled || !host.current || !pins.current) return;
      try {
        activeScene = createBattleScene({ host: host.current, pins: pins.current });
        activeScene.setStage(latestStage.current); scene.current = activeScene; setStatus("ready");
      } catch { setStatus("fallback"); }
    }).catch(() => { if (!cancelled) setStatus("fallback"); });
    return () => { cancelled = true; activeScene?.dispose(); scene.current = null; };
  }, []);

  if (status === "fallback") return <div><p className="bd-map-fallback">Thiết bị chưa hỗ trợ 3D. Bạn có thể theo dõi trận chiến bằng bản đồ 2D.</p><BattleMap stage={stage} selected={selected} onSelect={onSelect} /></div>;

  return <div ref={wrapper} className={`bd-3d-wrapper ${expanded ? "is-expanded" : ""}`} role={expanded ? "dialog" : undefined} aria-modal={expanded ? true : undefined} aria-label={expanded ? "Sa bàn Bạch Đằng mở rộng" : undefined}>
    <div className="bd-3d-stage"><div ref={host} className="bd-3d-canvas" /><div ref={pins} className={`bd-3d-pins ${status !== "ready" ? "is-loading" : ""}`}>{places.map((place) => <button key={place.id} className={`bd-3d-place ${place.id === "thang-long" || place.id === "china" ? "bd-strategic-place" : ""}`} data-anchor={place.id} aria-pressed={selected === place.name} onClick={() => onSelect(place.name)}>{place.name}</button>)}{commanders.map((person) => <button key={person.id} data-anchor={person.id} data-side={person.side} aria-label={`Xem danh tướng ${person.name}`} aria-pressed={commander === person.id} className={`bd-3d-commander bd-commander-${person.id}`} onClick={() => setCommander(commander === person.id ? null : person.id)}><span className="bd-pin-portrait"><Image preview={false} src={battlePortraitFor(person.id)?.src ?? ""} alt="" fill sizes="256px" quality={90} /></span><span className="bd-pin-name">{person.name}</span></button>)}</div>
    {status === "loading" ? <div className="bd-3d-loading"><span /> Đang dựng sa bàn 3D…</div> : null}
    <span className="bd-3d-badge">3D · TOÀN CẢNH CHIẾN DỊCH</span><div className="bd-3d-tools"><button onClick={() => scene.current?.zoom(.85)} aria-label="Phóng to bản đồ">+</button><button onClick={() => scene.current?.zoom(1.18)} aria-label="Thu nhỏ bản đồ">−</button><button onClick={() => scene.current?.reset()} aria-label="Đặt lại góc nhìn">↺</button><button onClick={() => setExpanded(!expanded)} aria-label={expanded ? "Thu gọn sa bàn" : "Mở rộng sa bàn"} aria-expanded={expanded}>{expanded ? "×" : "⛶"}</button></div>
    {selectedCommander ? <div className="bd-commander-tooltip"><div><strong>{selectedCommander.name}</strong><p>{selectedCommander.role}</p><small>Chân dung tái hiện nghệ thuật</small><Link href={`/characters/${selectedCommander.id}`}>Hồ sơ nhân vật →</Link></div><button aria-label="Đóng thông tin danh tướng" onClick={() => setCommander(null)}>×</button></div> : null}</div>
    <p className="bd-3d-hint">Kéo để xoay · + / − để thu phóng · Chọn chân dung để xem tướng</p>
  </div>;
};
