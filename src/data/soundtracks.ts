import catalog from "~/data/database/soundtrack.json";
import contexts from "~/data/database/music-context.json";

export type MusicInstrument = "flute" | "zither" | "lute" | "piano" | "strings" | "brass" | "celesta";
export type SoundtrackModel = {
  id: string; title: string; country: string; countryId: string;
  era: string; eraId: "monarchy" | "modern" | "timeless";
  mood: string; moodId: "majestic" | "ethereal" | "dramatic" | "reflective"; bpm: number;
  melody: number[]; bass: number[]; instrument: MusicInstrument;
  percussion: boolean; arpeggio: number[];
  audioSrc?: string;
  playlist?: string[];
  playlistTitles?: Readonly<Record<string, string>>;
};
export type MusicPlaybackContext = { chapter?: number };
type MusicContextModel = { country: string; era: string; mood: string };

// One shared array lets the engine keep playing while moving between
// Chinese monarchy scenes instead of restarting on every scene change.
const chinaMonarchyTitles = {
  "/audio/music/yeu-giang-son-cang-yeu-my-nhan.mp3": "Yêu Giang Sơn Càng Yêu Mỹ Nhân",
  "/audio/music/trung-hoa-phan-doan-5.mp3": "Bài số 5",
  "/audio/music/trung-hoa-phan-doan-9.mp3": "Bài số 9",
};
const chinaMonarchyPlaylist = Object.keys(chinaMonarchyTitles);

// Keep one playlist across England's eras so scene changes preserve playback.
const englandPlaylist = [
  "/audio/music/long-live-the-king.mp3",
  "/audio/music/only-on-the-dead.mp3",
  "/audio/music/pull.mp3",
  "/audio/music/aethelflaed.mp3",
];

const recordingFor = (row: (typeof catalog)[number]) => {
  if (row.countryId === "vietnam") {
    return row.eraId === "modern"
      ? { title: "Nỗi Đau Giữa Hoà Bình Piano", audioSrc: "/audio/music/noi-dau-giua-hoa-binh.m4a" }
      : { title: "Hào Khí Việt Nam Piano", audioSrc: "/audio/music/hao-khi-viet-nam-piano.m4a" };
  }
  if (row.countryId === "china" && row.eraId === "monarchy") {
    return {
      playlist: chinaMonarchyPlaylist,
      playlistTitles: chinaMonarchyTitles,
    };
  }
  if (row.countryId === "england") {
    return {
      title: "Âm vang Wessex",
      playlist: englandPlaylist,
    };
  }
  return {};
};

export const soundtracks: Record<string, SoundtrackModel> = Object.fromEntries(catalog.map((row) => {
  const recording = recordingFor(row);
  return [row.id, { ...row, ...recording } as SoundtrackModel];
}));
const sceneContexts: Record<string, MusicContextModel> = contexts.scenes;
const eventContexts: Record<string, MusicContextModel> = contexts.events;
const characterContexts: Record<string, MusicContextModel> = contexts.characters;
const periodContexts: Record<string, Record<string, MusicContextModel>> = contexts.periods;
const battleMoods = ["ethereal", "dramatic", "majestic", "dramatic", "ethereal", "dramatic", "majestic"];
const resolve = (context?: MusicContextModel) => context ? soundtracks[`${context.country}-${context.era}-${context.mood}`] ?? soundtracks.atlas : soundtracks.atlas;

export const soundtrackForPath = (pathname: string, hash = "", playback: MusicPlaybackContext = {}): SoundtrackModel => {
  const [, country, page] = pathname.replace(/\/$/, "").split("/");
  if (country === "battle" && page === "tran-bach-dang-1288") return soundtrackForPath("/vietnam/bach-dang-1288", hash, playback);
  if (country === "battle" && page === "tran-dien-bien-phu-1954") return resolve(sceneContexts["dien-bien-phu"]);
  if (country === "battle" && page?.startsWith("tran-")) return resolve(periodContexts.china["three-kingdoms"]);
  if (country === "period" && page === "loan-12-su-quan") return resolve(sceneContexts[page]);
  if (country === "period" && page === "nha-tran") return resolve(sceneContexts[hash.replace(/^#/, "")] ?? sceneContexts["tran-dung-nuoc"]);
  if (country === "period" && page === "khang-chien-chong-phap") return resolve(sceneContexts["dien-bien-phu"]);
  if (country === "period") {
    const sourceCountry = ["vietnam", "china", "england", "denmark", "norway"].find((id) => page?.startsWith(`${id}-`));
    if (sourceCountry) return soundtrackForPath(`/${sourceCountry}`, hash || `#${page.slice(sourceCountry.length + 1)}`, playback);
  }
  if ((country === "period" || country === "battle") && page === "three-kingdoms") {
    return resolve(periodContexts.china[page]);
  }
  if (country === "characters") return page ? resolve(characterContexts[page]) : soundtracks["vietnam-monarchy-reflective"];
  if (!["vietnam", "china", "england"].includes(country)) return soundtracks.atlas;
  const scene = hash.replace(/^#/, "");
  if (country === "vietnam" && page === "bach-dang-1288") {
    const chapter = playback.chapter ?? 0;
    return resolve({ country, era: "monarchy", mood: battleMoods[chapter] ?? "dramatic" });
  }
  if (country === "vietnam" && (!page || page === "overview")) return resolve(sceneContexts[scene] ?? sceneContexts["van-lang"]);
  if (country === "vietnam" && page && eventContexts[page]) return resolve(eventContexts[page]);
  const period = periodContexts[country]?.[page || scene];
  if (period) return resolve(period);
  // Country selection opens a mystical world; unknown pages never imply a battle.
  return soundtracks[`${country}-monarchy-ethereal`];
};
