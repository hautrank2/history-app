"use client";

import { createContext, useContext, useEffect, useEffectEvent, useRef, useState } from "react";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";

type Item = { src: string; alt: string };
type Transform = { x: number; y: number; scale: number; rotate: number; flipX: number; flipY: number };
const initial: Transform = { x: 0, y: 0, scale: 1, rotate: 0, flipX: 1, flipY: 1 };
const GroupContext = createContext<((element: HTMLElement) => void) | null>(null);
type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string; previewSrc?: string; preview?: boolean; fill?: boolean; quality?: number; priority?: boolean };

export const ImagePreview = ({ items, start, onClose }: { items: Item[]; start: number; onClose: () => void }) => {
  const [index, setIndex] = useState(start);
  const [transform, setTransform] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; original: Transform } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const anchor = (next: Transform): Transform => {
    const image = photo.current; const frame = stage.current;
    if (!image || !frame) return next;
    const sideways = Math.abs(next.rotate % 180) === 90;
    const w = (sideways ? image.offsetHeight : image.offsetWidth) * next.scale;
    const h = (sideways ? image.offsetWidth : image.offsetHeight) * next.scale;
    const limitX = Math.max(0, (w - frame.clientWidth) / 2);
    const limitY = Math.max(0, (h - frame.clientHeight) / 2);
    return { ...next, x: Math.max(-limitX, Math.min(limitX, next.x)), y: Math.max(-limitY, Math.min(limitY, next.y)) };
  };
  const zoom = (factor: number, px = 0, py = 0) => setTransform((current) => {
    const scale = Math.max(.25, Math.min(8, current.scale * factor));
    return anchor({ ...current, scale, x: px - (px - current.x) * scale / current.scale, y: py - (py - current.y) * scale / current.scale });
  });
  const change = (next: number) => { setIndex((next + items.length) % items.length); setTransform(initial); setDragging(false); drag.current = null; };
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = old; };
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(() => setTransform((current) => anchor(current)));
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  const pointer = (event: { clientX: number; clientY: number }) => {
    const rect = stage.current?.getBoundingClientRect();
    return rect ? [event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2] : [0, 0];
  };
  const wheelZoom = useEffectEvent((event: WheelEvent) => {
    event.preventDefault();
    const [x, y] = pointer(event);
    zoom(Math.exp(-event.deltaY * .002), x, y);
  });
  useEffect(() => {
    const element = photo.current;
    const handleWheel = (event: WheelEvent) => wheelZoom(event);
    element?.addEventListener("wheel", handleWheel, { passive: false });
    return () => element?.removeEventListener("wheel", handleWheel);
  }, [index]);
  const item = items[index];
  return createPortal(<dialog ref={dialog} className="image-preview" aria-label="Trình xem ảnh" onCancel={(event) => { event.preventDefault(); onClose(); }} onKeyDown={(event) => {
    if (["ArrowLeft", "ArrowRight", "+", "=", "-"].includes(event.key)) event.preventDefault();
    if (event.key === "ArrowLeft") change(index - 1);
    if (event.key === "ArrowRight") change(index + 1);
    if (event.key === "+" || event.key === "=") zoom(1.25);
    if (event.key === "-") zoom(.8);
  }}>
    <div ref={stage} className="image-preview-stage">
      {/* This is the sole native image renderer, including the preview. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={photo} src={item.src} alt={item.alt} draggable={false} className="image-preview-photo" onLoad={() => setTransform(initial)} style={{ transform: `translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotate}deg) scale(${transform.scale * transform.flipX}, ${transform.scale * transform.flipY})`, transition: dragging ? "none" : "transform 180ms ease" }}
        onDoubleClick={(event) => { const [x, y] = pointer(event); if (transform.scale > 1) setTransform(initial); else zoom(2, x, y); }}
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, original: transform }; setDragging(true); }}
        onPointerMove={(event) => { if (drag.current) setTransform({ ...drag.current.original, x: drag.current.original.x + event.clientX - drag.current.x, y: drag.current.original.y + event.clientY - drag.current.y }); }}
        onPointerUp={() => { drag.current = null; setDragging(false); setTransform((current) => anchor(current)); }} onPointerCancel={() => { drag.current = null; setDragging(false); setTransform((current) => anchor(current)); }} />
    </div>
    <div className="image-preview-top"><span>{index + 1} / {items.length} · {item.alt}</span><button type="button" autoFocus onClick={onClose} aria-label="Đóng trình xem ảnh">×</button></div>
    {items.length > 1 ? <><button type="button" className="image-preview-prev" aria-label="Ảnh trước" onClick={() => change(index - 1)}>←</button><button type="button" className="image-preview-next" aria-label="Ảnh tiếp" onClick={() => change(index + 1)}>→</button></> : null}
    <div className="image-preview-bottom"><div className="image-preview-toolbar">
      <button type="button" aria-label="Thu nhỏ" onClick={() => zoom(.8)}>−</button><button type="button" aria-label="Phóng to" onClick={() => zoom(1.25)}>+</button>
      <button type="button" aria-label="Xoay trái" onClick={() => setTransform((current) => anchor({ ...current, rotate: current.rotate - 90 }))}>↶</button><button type="button" aria-label="Xoay phải" onClick={() => setTransform((current) => anchor({ ...current, rotate: current.rotate + 90 }))}>↷</button>
      <button type="button" aria-label="Lật ngang" onClick={() => setTransform((current) => anchor({ ...current, flipX: -current.flipX }))}>↔</button><button type="button" aria-label="Lật dọc" onClick={() => setTransform((current) => anchor({ ...current, flipY: -current.flipY }))}>↕</button><button type="button" onClick={() => setTransform(initial)}>Reset</button>
    </div>{items.length > 1 ? <div className="image-preview-thumbnails">{items.map((item, i) => <button type="button" key={`${item.src}-${i}`} aria-label={`Xem ảnh ${i + 1}`} aria-current={index === i} onClick={() => change(i)}><Image src={item.src} alt={item.alt} preview={false} /></button>)}</div> : null}</div>
  </dialog>, document.body);
};

export const Image = ({ src, alt = "", previewSrc, preview = true, fill, quality, priority, style, onClick, ...props }: ImageProps) => {
  const group = useContext(GroupContext);
  const [open, setOpen] = useState(false);
  void quality;
  return <>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img {...props} src={src} alt={alt} loading={priority ? "eager" : props.loading ?? "lazy"} style={{ ...(fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : {}), ...style, ...(preview ? { cursor: "zoom-in" } : {}) }} data-preview-src={preview ? previewSrc ?? src : undefined} tabIndex={preview ? 0 : props.tabIndex} role={preview ? "button" : props.role} aria-label={preview ? `Xem ảnh: ${alt}` : props["aria-label"]} onClick={(event) => { onClick?.(event); if (preview) { if (group) group(event.currentTarget); else setOpen(true); } }} onKeyDown={(event) => { if (preview && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); if (group) group(event.currentTarget); else setOpen(true); } props.onKeyDown?.(event); }} />
    {open ? <ImagePreview items={[{ src: previewSrc ?? src, alt }]} start={0} onClose={() => setOpen(false)} /> : null}
  </>;
};

export const ImageGroup = ({ children }: { children: ReactNode }) => {
  const container = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<{ items: Item[]; start: number } | null>(null);
  return <GroupContext.Provider value={(element) => {
    const elements = Array.from(container.current?.querySelectorAll<HTMLImageElement>("[data-preview-src]") ?? []);
    setPreview({ items: elements.map((image) => ({ src: image.dataset.previewSrc ?? image.src, alt: image.alt })), start: elements.indexOf(element as HTMLImageElement) });
  }}><div ref={container} className="image-group" style={{ display: "contents" }}>{children}</div>{preview ? <ImagePreview {...preview} onClose={() => setPreview(null)} /> : null}</GroupContext.Provider>;
};
