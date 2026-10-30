import { battlePlaces } from "./locations";

type BattleMapProps = { stage: number; selected: string; onSelect: (place: string) => void };
const places = battlePlaces;

export const BattleMap = ({ stage, selected, onSelect }: BattleMapProps) => (
  <svg className={`bd-battle-map stage-${stage}`} viewBox="0 0 600 520" role="group" aria-label={`Bản đồ 2D chiến thuật Bạch Đằng, chương ${stage + 1}. Chọn địa danh để xem thông tin.`}>
    <defs>
      <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#77917d" strokeOpacity=".09" /></pattern>
      <pattern id="water-lines" width="18" height="16" patternUnits="userSpaceOnUse"><path d="M2 8h8" stroke="#7ca7a5" strokeOpacity=".13" /></pattern>
      <linearGradient id="river-depth" x2="1" y2="1"><stop stopColor="#245252" /><stop offset="1" stopColor="#102f35" /></linearGradient>
      <radialGradient id="map-glow"><stop stopColor="#b5a16c" stopOpacity=".16" /><stop offset="1" stopColor="#b5a16c" stopOpacity="0" /></radialGradient>
      <marker id="arrow-red" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#df8068" /></marker>
      <marker id="arrow-gold" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#d6bc80" /></marker>
      <g id="mountain"><path d="M-23 15L-14-8L-7-3L2-26L10-16L15-2L26 15Z" fill="#273d35" stroke="#7f8a65" strokeOpacity=".35" /><path d="M2-26L1 3L10 15M-14-8L-11 9" fill="none" stroke="#8b9474" strokeOpacity=".3" /></g>
      <g id="ship"><path d="M-12 5Q0 16 12 5Z" fill="currentColor" /><path d="M0 5V-17L9-1H2M-3-12L-10 1H-3Z" fill="currentColor" opacity=".8" /></g>
    </defs>
    <rect width="600" height="520" fill="#192c29" /><rect width="600" height="520" fill="url(#map-grid)" />
    <path d="M210-30C200 40 235 80 268 125S330 185 325 230S287 285 325 330S368 410 405 450L470 550H610V-30Z" fill="url(#river-depth)" stroke="#789c8a" strokeOpacity=".35" />
    <path d="M210-30C200 40 235 80 268 125S330 185 325 230S287 285 325 330S368 410 405 450L470 550H610V-30Z" fill="url(#water-lines)" />
    <path d="M610 180Q470 200 350 233M610 330Q470 280 338 290M395 520Q300 410 325 330" fill="none" stroke="#254b49" strokeWidth="29" /><path d="M610 180Q470 200 350 233M610 330Q470 280 338 290" fill="none" stroke="#7c9a83" strokeOpacity=".2" />
    <path d="M45 82Q180 25 275 76T560 74" fill="none" stroke="#d4b477" strokeOpacity=".35" strokeDasharray="4 6" />
    <g className={`bd-campaign-route ${stage >= 1 ? "visible" : ""}`}><path d="M350 52L130 62L95 115M105 145Q135 160 178 116" fill="none" stroke="#df8068" strokeWidth="2" strokeDasharray="6 7" markerEnd="url(#arrow-red)" /></g>
    <g transform="translate(82 135)" fill="#d4b477" stroke="#d4b477"><path d="M-14 6V-10h5v5h5v-5h8v5h5v-5h5V6Z" fill="#5b593b"/><path d="M-3 6V0a3 3 0 016 0v6" fill="#142827"/></g>
    <ellipse cx="300" cy="300" rx="210" ry="200" fill="url(#map-glow)" />
    {Array.from({ length: 19 }, (_, i) => <use key={i} href="#mountain" x={40 + (i % 4) * 43 + Math.sin(i * 2) * 13} y={170 + Math.floor(i / 4) * 51} opacity={.45 + (i % 3) * .15} />)}
    <path d="M42 125Q100 82 175 135M28 443Q140 385 230 454M410 93Q490 50 560 100" fill="none" stroke="#a9a37b" strokeOpacity=".15" /><path d="M30 137Q100 94 180 147M20 455Q140 397 230 466M410 105Q490 62 570 112" fill="none" stroke="#a9a37b" strokeOpacity=".1" />
    <text x="55" y="210" className="bd-map-region">ĐẠI VIỆT</text><text x="442" y="455" className="bd-map-sea">CỬA BIỂN</text><text x="378" y="265" className="bd-river-label" transform="rotate(39 378 265)">SÔNG BẠCH ĐẰNG</text>
    <g className={`bd-enemy-route ${stage >= 3 ? "visible" : ""}`}><path d="M250 115C280 175 350 200 320 270S340 340 360 365" fill="none" stroke="#df8068" strokeWidth="2" strokeDasharray="6 7" markerEnd="url(#arrow-red)" /><g color="#df8068"><use href="#ship" x="295" y="190" /><use href="#ship" x="320" y="230" /><use href="#ship" x="320" y="285" /></g></g>
    <g className={`bd-supply-route ${stage === 2 ? "visible" : ""}`}><path d="M575 105Q540 160 480 180" fill="none" stroke="#df8068" strokeWidth="2" strokeDasharray="6 7" markerEnd="url(#arrow-red)" /><text x="485" y="210" fill="#df8068" fontSize="22">×</text></g>
    <g className={`bd-stake-field ${stage >= 4 ? "visible" : ""}`}>{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${312 + (i % 4) * 15} ${350 + Math.floor(i / 4) * 14}l6-13m-9 2l11 9`} stroke="#dac18a" strokeWidth="2" />)}</g>
    <g className={`bd-home-route ${stage >= 5 ? "visible" : ""}`}><path d="M200 290Q250 290 301 330M425 381L370 360M365 445L350 397" fill="none" stroke="#d6bc80" strokeWidth="2" markerEnd="url(#arrow-gold)" /><use href="#ship" x="250" y="305" color="#d6bc80" /><use href="#ship" x="375" y="410" color="#d6bc80" /></g>
    {places.map((place) => <g key={place.name} role="button" tabIndex={0} aria-label={`Xem ${place.name}`} aria-pressed={selected === place.name} onClick={() => onSelect(place.name)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(place.name); } }} className={`bd-map-place ${selected === place.name ? "selected" : ""}`}><circle cx={place.x} cy={place.y} r="23" fill="transparent" /><circle className="bd-place-halo" cx={place.x} cy={place.y} r="14" /><circle cx={place.x} cy={place.y} r="4" fill="#d6bc80" /><text x={place.x} y={place.y - 22} textAnchor="middle">{place.name}</text></g>)}
    <g transform="translate(548 48)" className="bd-compass"><path d="M0-20L6 0L0-4L-6 0ZM0 20L6 0L0 4L-6 0Z" fill="#c5b88c" /><text y="-29" textAnchor="middle">B</text></g>
    <g transform="translate(32 482)" stroke="#9caa94"><path d="M0-4V0H70V-4M35 0V-4" /><text x="0" y="17" stroke="none" fill="#9caa94" fontSize="8">2D · CHIẾN DỊCH · KHÔNG THEO TỈ LỆ</text></g>
  </svg>
);
