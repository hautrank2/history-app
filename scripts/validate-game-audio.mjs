import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const compile = (path) => ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
const scoreModule = { exports: {} };
const jsonTables = Object.fromEntries(["soundtrack", "music-context"].map((name) => [`~/data/database/${name}.json`, JSON.parse(readFileSync(`src/data/database/${name}.json`, "utf8"))]));
vm.runInNewContext(compile("src/data/soundtracks.ts"), { exports: scoreModule.exports, module: scoreModule, Set, require: (name) => { assert.ok(name in jsonTables); return jsonTables[name]; } });
const effectModule = { exports: {} };
vm.runInNewContext(compile("src/data/sound-effects.ts"), { exports: effectModule.exports, module: effectModule });
const { soundtracks, soundtrackForPath } = scoreModule.exports;
assert.equal(soundtrackForPath("/").id, "atlas");
for (const country of ["vietnam", "china", "england"]) {
  assert.equal(soundtrackForPath(`/${country}`).id, `${country}-monarchy-ethereal`);
  for (const era of ["monarchy", "modern"]) for (const mood of ["majestic", "ethereal", "dramatic", "reflective"]) assert.ok(soundtracks[`${country}-${era}-${mood}`]);
}
const cases = [
  ["/vietnam/overview", "#doi-moi", "vietnam-modern-reflective"],
  ["/vietnam", "#tran-bach-dang", "vietnam-monarchy-majestic"],
  ["/vietnam", "#loan-12-su-quan", "vietnam-monarchy-dramatic"],
  ["/vietnam", "#doi-moi", "vietnam-modern-reflective"],
  ["/vietnam", "#dien-bien-phu", "vietnam-modern-majestic"],
  ["/vietnam", "#chia-cat", "vietnam-modern-dramatic"],
  ["/vietnam", "#not-a-scene", "vietnam-monarchy-ethereal"],
  ["/vietnam/bach-dang-1288", "", "vietnam-monarchy-ethereal"],
  ["/vietnam/yen-bai", "", "vietnam-modern-dramatic"],
  ["/vietnam/ly-bi", "", "vietnam-monarchy-majestic"],
  ["/characters/tran-hung-dao", "", "vietnam-monarchy-reflective"],
  ["/characters/ho-chi-minh", "", "vietnam-modern-reflective"],
  ["/characters/ma-vien", "", "china-monarchy-reflective"],
  ["/characters/dang-tieu-binh", "", "china-modern-reflective"],
  ["/characters/paul-doumer", "", "atlas"],
  ["/england", "#modern-britain", "england-modern-reflective"],
  ["/england/tudor", "", "england-monarchy-majestic"],
  ["/china", "#three-kingdoms", "china-monarchy-dramatic"],
  ["/china/modern-china", "", "china-modern-reflective"],
  ["/unknown", "", "atlas"],
];
for (const [path, hash, expected] of cases) assert.equal(soundtrackForPath(path, hash).id, expected);
assert.equal(soundtrackForPath("/vietnam/bach-dang-1288", "", { chapter: 5 }).moodId, "dramatic");
assert.equal(soundtrackForPath("/vietnam/bach-dang-1288", "", { chapter: 6 }).moodId, "majestic");
for (const track of Object.values(soundtracks)) {
  assert.ok(track.melody.length >= 32 && track.bass.length === 4);
  assert.ok(track.bpm >= 50 && track.bpm <= 120);
  for (const note of [...track.melody, ...track.bass]) assert.ok(Number.isInteger(note) && (note === 0 || note >= 21 && note <= 108));
}
const actualScenes = new Set([...readFileSync("src/data/vietnam-overview.ts", "utf8").matchAll(/id: "([a-z0-9-]+)", era:/g)].map((match) => match[1]));
for (const id of actualScenes) assert.ok(jsonTables["~/data/database/music-context.json"].scenes[id], `Missing scene music: ${id}`);
for (const layers of Object.values(effectModule.exports.effectSamples)) for (const layer of layers) {
  const file = readFileSync(`public/audio/sfx/${layer.file}.ogg`);
  assert.equal(file.subarray(0, 4).toString(), "OggS", `Invalid recorded sample ${layer.file}`);
  assert.ok(layer.level > 0 && layer.level <= .5);
}

const parameter = () => ({ value: 0, cancelScheduledValues(time) { assert.ok(Number.isFinite(time)); }, setValueAtTime(value, time) { assert.ok(Number.isFinite(value) && Number.isFinite(time)); }, exponentialRampToValueAtTime(value, time) { assert.ok(value > 0 && Number.isFinite(time)); }, linearRampToValueAtTime(value, time) { assert.ok(Number.isFinite(value) && Number.isFinite(time)); }, setTargetAtTime(value, time, constant) { assert.ok(Number.isFinite(value) && Number.isFinite(time) && constant > 0); } });
const loadEngine = (saved = null, blockedStorage = false, recorded = false) => {
  const sources = [];
  const fetched = [];
  const timers = new Map();
  const contexts = [];
  let stored = saved;
  let now = 1000;
  let timerId = 0;
  const doc = { hidden: false };
  class Source {
    frequency = parameter(); gain = parameter(); playbackRate = parameter(); pan = parameter(); Q = parameter(); threshold = parameter(); knee = parameter(); ratio = parameter();
    stopped = false;
    connect() { return this; }
    disconnect() {}
    start(time) { assert.ok(Number.isFinite(time)); }
    stop() { this.stopped = true; }
  }
  class Context {
    state = "running"; currentTime = 0; sampleRate = 48000; destination = {};
    constructor() { contexts.push(this); }
    createGain() { return new Source(); }
    createStereoPanner() { return new Source(); }
    createDynamicsCompressor() { return new Source(); }
    createBiquadFilter() { return new Source(); }
    createOscillator() { const source = new Source(); sources.push(source); return source; }
    createBufferSource() { const source = new Source(); sources.push(source); return source; }
    async decodeAudioData() { return { duration: .12 }; }
    createBuffer(channels, length) { const data = new Float32Array(length); return { getChannelData() { return data; } }; }
    async resume() { this.state = "running"; }
    async suspend() { this.state = "suspended"; }
  }
  const audioModule = { exports: {} };
  vm.runInNewContext(compile("src/lib/game-audio.ts"), {
    exports: audioModule.exports, module: audioModule,
    require: (name) => {
      if (name === "~/data/soundtracks") return scoreModule.exports;
      assert.equal(name, "~/data/sound-effects"); return effectModule.exports;
    },
    fetch: async (path) => {
      assert.match(path, /^\/audio\/(sfx\/[a-z0-9-]+\.ogg|music\/[a-z0-9-]+\.(m4a|mp3))$/);
      fetched.push(path);
      return { ok: recorded || path.includes("/music/"), arrayBuffer: async () => new ArrayBuffer(8) };
    },
    AudioContext: Context, document: doc, performance: { now: () => now += 100 },
    setInterval: (callback) => { const id = ++timerId; timers.set(id, callback); return id; },
    clearInterval: (id) => timers.delete(id),
    localStorage: { getItem: () => { if (blockedStorage) throw new Error("blocked"); return stored; }, setItem: (key, value) => { assert.equal(key, "history-atlas-audio"); if (blockedStorage) throw new Error("blocked"); stored = value; } },
  });
  const api = audioModule.exports;
  const unsubscribe = api.subscribeAudioSettings(() => undefined);
  return { api, sources, fetched, contexts, timers, doc, saved: () => stored, unsubscribe };
};

const engine = loadEngine();
assert.equal(engine.contexts.length, 0, "No audio context before interaction");
assert.equal(engine.api.getAudioSettings().enabled, true, "Master audio is on by default");
assert.equal(engine.api.getAudioSettings().music, true, "Music is on by default");
assert.ok(Object.values(engine.api.getAudioSettings().effects).every(Boolean), "Every effect category is on by default");
engine.api.updateAudioSettings({ enabled: false });
await engine.api.unlockGameAudio();
assert.equal(engine.contexts.length, 0, "Muting before the first gesture must not initialize audio");
engine.api.updateAudioSettings({ enabled: true });
engine.api.setGameMusicPath("/vietnam");
engine.api.updateAudioSettings({ music: false });
await engine.api.unlockGameAudio();
assert.equal(engine.contexts.length, 1);
assert.equal(engine.timers.size, 0);
for (const cue of ["click", "select", "navigate", "march", "battle", "open", "close", "victory"]) {
  const before = engine.sources.length;
  engine.api.playGameSound(cue);
  assert.ok(engine.sources.length > before, `Missing ${cue} cue`);
}
engine.api.updateAudioSettings({ effects: { click: false, navigate: false, units: false } });
const silentCount = engine.sources.length;
for (const cue of ["click", "select", "navigate", "march", "battle", "open", "close", "victory"]) engine.api.playGameSound(cue);
assert.equal(engine.sources.length, silentCount, "Per-category switches must mute their cues");
engine.api.updateAudioSettings({ music: true, musicVolume: .25, volume: .4 });
await new Promise((resolve) => setImmediate(resolve));
assert.equal(engine.timers.size, 0, "Recordings loop without a synthesis scheduler");
assert.equal(engine.sources.filter((source) => source.loop && !source.stopped).length, 1);
await engine.api.unlockGameAudio();
assert.equal(engine.contexts.length, 1, "Reuse a single context");
assert.equal(engine.sources.filter((source) => source.loop && !source.stopped).length, 1, "Repeated gestures must not duplicate recordings");
engine.api.setGameMusicPath("/china");
assert.equal(engine.api.getCurrentSoundtrack().id, "china-monarchy-ethereal");
await new Promise((resolve) => setImmediate(resolve));
assert.equal(engine.timers.size, 0, "Monarchy China uses the selected playlist");
const chinaSongs = soundtrackForPath("/china").playlist;
const englandSongs = soundtrackForPath("/england").playlist;
assert.equal(chinaSongs.length, 4);
assert.equal(new Set(englandSongs).size, 4);
for (const song of [...chinaSongs, ...englandSongs]) {
  assert.ok(existsSync(`public${song}`), song);
  const head = readFileSync(`public${song}`).subarray(0, 3);
  assert.ok(head.toString() === "ID3" || (head[0] === 0xff && (head[1] & 0xe0) === 0xe0), `Not an MP3: ${song}`);
}
const playingPlaylistSongs = () => engine.sources.filter(
  (source) => source.buffer && source.onended && !source.loop && !source.stopped,
);
assert.equal(playingPlaylistSongs().length, 1, "Playlist songs play once, then chain");
assert.ok(chinaSongs.includes(engine.fetched.at(-1)));
const chinaSourceCount = engine.sources.length;
engine.api.setGameMusicPath("/china", "#ming");
await new Promise((resolve) => setImmediate(resolve));
assert.equal(engine.sources.length, chinaSourceCount, "Changing Chinese monarchy scenes must keep the song playing");
const firstSong = engine.fetched.at(-1);
const ending = playingPlaylistSongs()[0];
ending.stopped = true;
ending.onended();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(playingPlaylistSongs().length, 1, "A finished song starts the next one");
assert.notEqual(engine.fetched.at(-1), firstSong, "The next song differs from the one that ended");
engine.api.setGameMusicPath("/china", "#reform");
assert.equal(engine.api.getCurrentSoundtrack().playlist, undefined, "Modern China keeps its own score");
assert.equal(engine.timers.size, 1);
engine.api.setGameMusicPath("/england", "#alfred-wessex");
await new Promise((resolve) => setImmediate(resolve));
assert.equal(engine.timers.size, 0, "England uses recordings");
assert.equal(playingPlaylistSongs().length, 1);
const englandSong = playingPlaylistSongs()[0];
const englandSrc = engine.fetched.at(-1);
assert.ok(englandSongs.includes(englandSrc));
engine.api.setGameMusicPath("/england", "#modern-britain");
await engine.api.unlockGameAudio();
assert.equal(engine.api.getCurrentSoundtrack().playlist, englandSongs);
assert.deepEqual(playingPlaylistSongs(), [englandSong], "Timeline changes and clicks preserve the current song");
englandSong.stopped = true;
englandSong.onended();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(playingPlaylistSongs().length, 1);
assert.ok(englandSongs.includes(engine.fetched.at(-1)));
assert.notEqual(engine.fetched.at(-1), englandSrc, "The England playlist advances to a different song");

for (const scene of ["tran-bach-dang", "van-lang", "doi-moi", "chia-cat"]) {
  engine.api.setGameMusicPath("/vietnam", `#${scene}`);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(engine.timers.size, 0, "Vietnam uses the selected recordings");
  assert.equal(engine.sources.filter((source) => source.loop && !source.stopped).length, 1);
}
const sameEraSourceCount = engine.sources.length;
engine.api.setGameMusicPath("/vietnam", "#doi-moi");
await new Promise((resolve) => setImmediate(resolve));
assert.equal(engine.sources.length, sameEraSourceCount, "Changing scenes within an era must keep the recording playing");
for (const scene of ["van-lang", "doi-moi"]) {
  const track = soundtrackForPath("/vietnam", `#${scene}`);
  assert.ok(existsSync(`public${track.audioSrc}`));
  assert.equal(readFileSync(`public${track.audioSrc}`).subarray(4, 8).toString(), "ftyp");
}
const pendingMusic = loadEngine();
pendingMusic.api.updateAudioSettings({ enabled: true });
pendingMusic.api.setGameMusicPath("/vietnam", "#ngo");
await pendingMusic.api.unlockGameAudio();
pendingMusic.doc.hidden = true;
pendingMusic.api.suspendGameAudio();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(pendingMusic.sources.filter((source) => source.loop && !source.stopped).length, 0, "A late download must not start music on a hidden tab");
const restored = loadEngine(engine.saved());
assert.deepEqual(JSON.parse(JSON.stringify(restored.api.getAudioSettings())), JSON.parse(engine.saved()), "Restore all preferences");
assert.equal(restored.contexts.length, 0, "Reload must not autoplay");
engine.doc.hidden = true;
engine.api.suspendGameAudio();
assert.equal(engine.timers.size, 0);
assert.ok(engine.sources.every((source) => source.stopped), "Hidden tab must cancel pending sources");
const hiddenCount = engine.sources.length;
engine.api.playGameSound("battle");
assert.equal(engine.sources.length, hiddenCount);
const broken = loadEngine("{invalid-json");
assert.equal(broken.api.getAudioSettings().volume, .3);
assert.equal(broken.api.getAudioSettings().enabled, true, "Invalid saved settings fall back to enabled audio");
const savedMute = loadEngine(JSON.stringify({ enabled: false, volume: .3, music: false }));
assert.equal(savedMute.api.getAudioSettings().enabled, false, "Keep an existing saved master mute");
assert.equal(savedMute.api.getAudioSettings().music, false, "Keep an existing saved music preference");
const blocked = loadEngine(null, true);
assert.doesNotThrow(() => blocked.api.updateAudioSettings({ music: false }));
const clamped = loadEngine(JSON.stringify({ enabled: true, volume: 4, musicVolume: -3 }));
assert.equal(clamped.api.getAudioSettings().volume, 1);
assert.equal(clamped.api.getAudioSettings().musicVolume, 0);
for (const cursor of ["default", "pointer", "grab", "grabbing", "text"]) {
  const path = `public/cursors/arena-${cursor}.svg`;
  assert.ok(existsSync(path));
  assert.match(readFileSync(path, "utf8"), /width="32" height="32"/);
}
console.log(`Validated ${Object.keys(soundtracks).length} contextual scores, effect categories, volume persistence, autoplay guard, source cleanup and five cursors.`);

const samples = loadEngine(null, false, true);
samples.api.updateAudioSettings({ enabled: true, music: false });
await samples.api.unlockGameAudio();
await new Promise((resolve) => setImmediate(resolve));
for (const cue of ["click", "select", "navigate", "march", "battle", "open", "close", "victory"]) samples.api.playGameSound(cue);
assert.ok(samples.sources.length > 0 && samples.sources.every((source) => source.buffer), "Use decoded recordings when ready");
samples.api.suspendGameAudio();
console.log("Validated local Kenney recordings, music eras/moods and all historical scene mappings.");
