"use client";

import { Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { getAudioSettings, getCurrentSoundtrack, getServerAudioSettings, getServerSoundtrack, playGameSound, setGameMusicPath, subscribeAudioSettings, suspendGameAudio, unlockGameAudio, updateAudioSettings } from "~/lib/game-audio";

export const GameAudio = () => {
  const { enabled, volume, music, musicVolume, effects } = useSyncExternalStore(subscribeAudioSettings, getAudioSettings, getServerAudioSettings);
  const soundtrack = useSyncExternalStore(subscribeAudioSettings, getCurrentSoundtrack, getServerSoundtrack);
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unlock = () => { void unlockGameAudio(); };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") unlock();
    };
    const click = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest(".game-audio")) return;
      const control = target.closest("button, a[href], [role='tab'], [role='button'], [role='option']");
      if (!control || control.matches(":disabled, [aria-disabled='true']")) return;
      playGameSound(control.closest(".vo-reading-footer") ? "navigate" : control.matches("[role='tab'], [role='option']") || control.closest(".vo-map-markers, .bd-3d-pins") ? "select" : "click");
    };
    const visibility = () => { if (document.hidden) suspendGameAudio(); };
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !container.current?.contains(event.target)) setExpanded(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && container.current?.querySelector("#game-audio-panel")) { setExpanded(false); container.current.querySelector<HTMLButtonElement>(".game-audio-trigger")?.focus(); } };
    const syncMusic = () => setGameMusicPath(window.location.pathname, window.location.hash);
    const battleMusic = (event: Event) => {
      const detail: unknown = event instanceof CustomEvent ? event.detail : undefined;
      if (detail && typeof detail === "object" && "chapter" in detail && typeof detail.chapter === "number" && Number.isInteger(detail.chapter)) {
        setGameMusicPath(window.location.pathname, window.location.hash, { chapter: detail.chapter });
      }
    };
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", keyboard, true);
    document.addEventListener("click", click);
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("hashchange", syncMusic);
    window.addEventListener("popstate", syncMusic);
    window.addEventListener("atlas:scene-change", syncMusic);
    window.addEventListener("atlas:music-context", battleMusic);
    return () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", keyboard, true);
      document.removeEventListener("click", click);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("hashchange", syncMusic);
      window.removeEventListener("popstate", syncMusic);
      window.removeEventListener("atlas:scene-change", syncMusic);
      window.removeEventListener("atlas:music-context", battleMusic);
      suspendGameAudio();
    };
  }, []);

  useEffect(() => {
    if (lastPath.current !== pathname) playGameSound("navigate");
    lastPath.current = pathname;
    setGameMusicPath(pathname, window.location.hash);
  }, [pathname]);

  const audible = enabled && (volume > 0 || music && musicVolume > 0);
  return <div ref={container} className="game-audio" data-enabled={audible} data-soundtrack={soundtrack.id}>
    <button className="game-audio-trigger" type="button" aria-label="Cài đặt" title="Cài đặt" aria-expanded={expanded} aria-controls="game-audio-panel" onClick={() => { playGameSound(expanded ? "close" : "open"); setExpanded((value) => !value); }}><Settings size={19} /><span className="game-audio-indicator" aria-hidden="true" /></button>
    {expanded ? <section id="game-audio-panel" className="game-audio-panel" aria-label="Thiết lập âm thanh">
      <div className="game-audio-heading"><strong>THIẾT LẬP ÂM THANH</strong><span>{enabled ? "ĐANG BẬT" : "ĐÃ TẮT"}</span></div>
      <label className="game-audio-master"><span>Âm thanh toàn bộ</span><input type="checkbox" checked={enabled} onChange={async (event) => { updateAudioSettings({ enabled: event.target.checked }); if (event.target.checked) { await unlockGameAudio(); playGameSound("select"); } }} /></label>
      <fieldset className="game-audio-effects"><legend>Hiệu ứng</legend>
        <label><span>Click & chọn mục</span><input type="checkbox" checked={effects.click} onChange={(event) => updateAudioSettings({ effects: { ...effects, click: event.target.checked } })} /></label>
        <label><span>Chuyển trang & cảnh</span><input type="checkbox" checked={effects.navigate} onChange={(event) => updateAudioSettings({ effects: { ...effects, navigate: event.target.checked } })} /></label>
        <label><span>Quân lính & trận chiến</span><input type="checkbox" checked={effects.units} onChange={(event) => updateAudioSettings({ effects: { ...effects, units: event.target.checked } })} /></label>
      </fieldset>
      <label className="game-audio-volume"><span>Âm lượng hiệu ứng <output>{Math.round(volume * 100)}%</output></span><input aria-label="Âm lượng hiệu ứng" type="range" min="0" max="100" value={Math.round(volume * 100)} onChange={(event) => updateAudioSettings({ volume: Number(event.target.value) / 100 })} onPointerUp={() => playGameSound("select")} /></label>
      <div className="game-audio-music">
        <label className="game-audio-music-toggle"><span>Nhạc nền</span><input type="checkbox" checked={music} onChange={async (event) => { updateAudioSettings({ music: event.target.checked }); await unlockGameAudio(); }} /></label>
        <p className="game-audio-track"><strong>{soundtrack.title}</strong><span>{soundtrack.country} · {soundtrack.era} · {soundtrack.mood}</span></p>
        <label className="game-audio-volume"><span>Âm lượng nhạc <output>{Math.round(musicVolume * 100)}%</output></span><input aria-label="Âm lượng nhạc nền" type="range" min="0" max="100" value={Math.round(musicVolume * 100)} onChange={(event) => updateAudioSettings({ musicVolume: Number(event.target.value) / 100 })} /></label>
      </div>
      <button className="game-audio-preview" type="button" disabled={!enabled || volume === 0 || !effects.units} onClick={async () => { await unlockGameAudio(); playGameSound("march"); }}>Nghe thử hành quân</button>
      <p className="game-audio-saved">Tự lưu cài đặt cho lần ghé sau</p>
    </section> : null}
  </div>;
};
