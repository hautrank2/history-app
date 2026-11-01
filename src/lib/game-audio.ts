"use client";

import { soundtracks, soundtrackForPath } from "~/data/soundtracks";
import type { MusicPlaybackContext, SoundtrackModel } from "~/data/soundtracks";
import { effectSamples } from "~/data/sound-effects";
import type { EffectSampleModel } from "~/data/sound-effects";

export type GameSound = keyof typeof effectSamples;
type AudioSettings = {
  enabled: boolean; volume: number; music: boolean; musicVolume: number;
  effects: { click: boolean; navigate: boolean; units: boolean };
};

const defaults: AudioSettings = { enabled: false, volume: .3, music: true, musicVolume: .22, effects: { click: true, navigate: true, units: true } };
const storageKey = "history-atlas-audio";
const listeners = new Set<() => void>();
const activeSources = new Set<AudioScheduledSourceNode>();
const musicSources = new Set<AudioScheduledSourceNode>();
const effectBuffers = new Map<string, AudioBuffer>();
let effectsLoading: Promise<void> | null = null;
let settings = defaults;
let loaded = false;
let context: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let lastCue = 0;
let musicGain: GainNode | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let currentTrack = soundtracks.atlas;
let musicStep = 0;
let nextMusicTime = 0;
let musicPath = "";
let musicPlayback: MusicPlaybackContext = {};
const recordingBuffers = new Map<string, Promise<AudioBuffer>>();
let recordingGeneration = 0;
let recordingPending = false;
let recordingSource: AudioBufferSourceNode | null = null;

const stopSources = () => {
  activeSources.forEach((source) => { try { source.stop(); } catch { /* A cue may have just ended. */ } });
  activeSources.clear();
};

const stopMusic = (fade = 0) => {
  recordingGeneration++;
  recordingPending = false;
  recordingSource = null;
  if (musicTimer !== null) clearInterval(musicTimer);
  musicTimer = null;
  musicSources.forEach((source) => { try { source.stop((context?.currentTime ?? 0) + fade); } catch { /* The note has already ended. */ } });
  if (!fade) musicSources.clear();
};

const midiFrequency = (note: number) => 440 * 2 ** ((note - 69) / 12);
const musicNote = (note: number, start: number, duration: number, level: number, instrument: SoundtrackModel["instrument"] | "pad" | "drum", pan = 0) => {
  if (!context || !musicGain || !note) return;
  const voice = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const frequency = midiFrequency(note);
  voice.type = instrument === "flute" || instrument === "drum" || instrument === "celesta" || instrument === "pad" ? "sine" : instrument === "strings" || instrument === "brass" ? "sawtooth" : "triangle";
  voice.frequency.setValueAtTime(frequency, start);
  if (instrument === "drum") voice.frequency.exponentialRampToValueAtTime(38, start + duration);
  if (instrument === "flute") voice.frequency.linearRampToValueAtTime(frequency * 1.002, start + duration * .8);
  filter.type = "lowpass";
  const cutoff = instrument === "celesta" ? 3200 : instrument === "zither" ? 2300 : instrument === "piano" ? 2100 : instrument === "brass" ? 1250 : instrument === "lute" ? 1450 : 850;
  filter.frequency.setValueAtTime(cutoff, start);
  if (["piano", "zither", "lute"].includes(instrument)) filter.frequency.exponentialRampToValueAtTime(650, start + duration);
  const attack = instrument === "pad" ? .65 : instrument === "strings" ? .23 : instrument === "brass" ? .12 : instrument === "flute" ? .12 : instrument === "celesta" ? .015 : .008;
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + Math.min(attack, duration * .3));
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  voice.connect(filter); filter.connect(gain);
  const panner = typeof context.createStereoPanner === "function" ? context.createStereoPanner() : null;
  if (panner) { panner.pan.value = pan; gain.connect(panner); panner.connect(musicGain); }
  else gain.connect(musicGain);
  // Detuned bowed voices and a quiet upper partial soften the simple oscillator tone.
  if (["piano", "strings", "brass", "celesta"].includes(instrument)) {
    const overtone = context.createOscillator();
    const partialGain = context.createGain();
    overtone.type = instrument === "strings" ? "sawtooth" : "sine";
    overtone.frequency.value = frequency * (instrument === "strings" ? .996 : instrument === "celesta" ? 3 : 2.002);
    partialGain.gain.value = instrument === "strings" ? .22 : instrument === "celesta" ? .09 : .12;
    overtone.connect(partialGain); partialGain.connect(filter);
    overtone.start(start); overtone.stop(start + duration + .03);
    musicSources.add(overtone);
    overtone.onended = () => { musicSources.delete(overtone); overtone.disconnect(); partialGain.disconnect(); };
  }
  voice.start(start); voice.stop(start + duration + .03);
  musicSources.add(voice);
  voice.onended = () => { musicSources.delete(voice); voice.disconnect(); filter.disconnect(); gain.disconnect(); panner?.disconnect(); };
};

const scheduleMusic = () => {
  if (!context || context.state !== "running" || document.hidden) return;
  const stepDuration = 60 / currentTrack.bpm / 2;
  // Recover after timer throttling without queuing a burst of missed notes.
  if (nextMusicTime < context.currentTime - .2) nextMusicTime = context.currentTime + .08;
  while (nextMusicTime < context.currentTime + .35) {
    const bar = Math.floor(musicStep / 8);
    const bass = currentTrack.bass[bar % currentTrack.bass.length];
    const melody = currentTrack.melody[musicStep % currentTrack.melody.length];
    const reflective = currentTrack.moodId === "reflective";
    const ethereal = currentTrack.moodId === "ethereal";
    const majestic = currentTrack.moodId === "majestic";
    const phraseAccent = musicStep % 8 === 0 ? 1 : .8;
    const melodyDuration = stepDuration * (ethereal ? 5 : majestic ? 3.4 : reflective ? 3.1 : 1.6);
    musicNote(melody, nextMusicTime, melodyDuration, (ethereal ? .085 : .12) * phraseAccent, currentTrack.instrument, -.12);
    // Quiet, scheduled echoes give depth without a feedback buffer that could
    // replay stale reverb when a hidden tab resumes. Mute cancels every voice.
    if (melody && (ethereal || reflective)) {
      musicNote(melody, nextMusicTime + .24, melodyDuration * .8, ethereal ? .026 : .017, currentTrack.instrument, .48);
      if (ethereal) musicNote(melody + 12, nextMusicTime + .52, melodyDuration * .65, .010, "flute", -.5);
    }
    const accompaniment = currentTrack.arpeggio[Math.floor(musicStep / 2) % currentTrack.arpeggio.length];
    if (musicStep % (ethereal ? 4 : 2) === 0) musicNote(bass + 12 + accompaniment, nextMusicTime + .025, stepDuration * (ethereal ? 5 : 2.8), ethereal ? .025 : reflective ? .030 : .04, ethereal ? "celesta" : currentTrack.eraId === "modern" ? "piano" : currentTrack.countryId === "england" ? "lute" : "zither", .3);
    if (musicStep % 8 === 0) {
      musicNote(bass, nextMusicTime, stepDuration * 7.5, .08, "pad");
      musicNote(bass + 19, nextMusicTime + .035, stepDuration * 7, .028, "pad");
      if (majestic) {
        musicNote(bass + 24, nextMusicTime + .07, stepDuration * 7, .035, "strings", -.35);
        musicNote(bass + 31, nextMusicTime + .11, stepDuration * 6.5, .025, "brass", .35);
      }
      if (ethereal) musicNote(bass + 31, nextMusicTime + .12, stepDuration * 9, .021, "pad", -.4);
    }
    if (currentTrack.percussion && musicStep % 2 === 0) musicNote(currentTrack.eraId === "modern" ? 43 : 45, nextMusicTime, .23, musicStep % 8 === 0 ? .24 : .11, "drum");
    if (majestic && musicStep % 8 === 4) musicNote(bass + 24, nextMusicTime, stepDuration * 4, .05, "brass", .25);
    if (currentTrack.moodId === "dramatic" && musicStep % 8 === 6) musicNote(bass + 12, nextMusicTime, .17, .13, "drum");
    nextMusicTime += stepDuration;
    musicStep++;
  }
};

const startRecording = (src: string, delay: number) => {
  const audio = context;
  if (!audio || recordingPending || recordingSource) return;
  const generation = recordingGeneration;
  recordingPending = true;
  let buffer = recordingBuffers.get(src);
  if (!buffer) {
    buffer = fetch(src).then(async (response) => {
      if (!response.ok) throw new Error(`Music unavailable: ${response.status}`);
      return audio.decodeAudioData(await response.arrayBuffer());
    }).catch((error: unknown) => { recordingBuffers.delete(src); throw error; });
    recordingBuffers.set(src, buffer);
  }
  void buffer.then((decoded) => {
    if (generation !== recordingGeneration) return;
    recordingPending = false;
    if (document.hidden || audio.state !== "running" || !settings.enabled || !settings.music || !settings.musicVolume || !musicGain) return;
    const source = audio.createBufferSource();
    source.buffer = decoded;
    source.loop = true;
    source.connect(musicGain);
    recordingSource = source;
    musicSources.add(source);
    source.onended = () => {
      musicSources.delete(source);
      if (recordingSource === source) recordingSource = null;
      source.disconnect();
    };
    source.start(audio.currentTime + delay);
  }).catch(() => { if (generation === recordingGeneration) recordingPending = false; });
};

const startMusic = (delay = 0) => {
  if (!context || !musicGain || context.state !== "running" || !settings.enabled || !settings.music || settings.musicVolume === 0 || document.hidden || musicTimer !== null) return;
  musicGain.gain.setTargetAtTime(settings.musicVolume * .5, context.currentTime + delay, .15);
  if (currentTrack.audioSrc) { startRecording(currentTrack.audioSrc, delay); return; }
  musicStep = 0;
  nextMusicTime = context.currentTime + .15 + delay;
  scheduleMusic();
  musicTimer = setInterval(scheduleMusic, 180);
};

export const getCurrentSoundtrack = () => currentTrack;
export const getServerSoundtrack = () => soundtracks.atlas;
export const setGameMusicPath = (pathname: string, hash = "", playback?: MusicPlaybackContext) => {
  if (pathname !== musicPath) musicPlayback = {};
  musicPath = pathname;
  if (playback) musicPlayback = playback;
  const next = soundtrackForPath(pathname, hash, musicPlayback);
  if (next.id === currentTrack.id) return;
  if (next.audioSrc && next.audioSrc === currentTrack.audioSrc) {
    currentTrack = next;
    listeners.forEach((listener) => listener());
    return;
  }
  if (context && musicGain) musicGain.gain.setTargetAtTime(.0001, context.currentTime, .025);
  stopMusic(.1);
  currentTrack = next;
  startMusic(.12);
  listeners.forEach((listener) => listener());
};

export const getAudioSettings = () => settings;
export const getServerAudioSettings = () => defaults;
export const subscribeAudioSettings = (listener: () => void) => {
  listeners.add(listener);
  if (!loaded) {
    loaded = true;
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (stored && typeof stored === "object" && "enabled" in stored && "volume" in stored && typeof stored.enabled === "boolean" && typeof stored.volume === "number" && Number.isFinite(stored.volume)) {
        const effects = "effects" in stored && stored.effects && typeof stored.effects === "object" ? stored.effects : {};
        settings = {
          enabled: stored.enabled, volume: Math.max(0, Math.min(1, stored.volume)),
          music: "music" in stored && typeof stored.music === "boolean" ? stored.music : defaults.music,
          musicVolume: "musicVolume" in stored && typeof stored.musicVolume === "number" && Number.isFinite(stored.musicVolume) ? Math.max(0, Math.min(1, stored.musicVolume)) : defaults.musicVolume,
          effects: {
            click: "click" in effects && typeof effects.click === "boolean" ? effects.click : true,
            navigate: "navigate" in effects && typeof effects.navigate === "boolean" ? effects.navigate : true,
            units: "units" in effects && typeof effects.units === "boolean" ? effects.units : true,
          },
        };
      }
    } catch { /* Audio remains usable when browser storage is unavailable. */ }
  }
  return () => { listeners.delete(listener); };
};

export const updateAudioSettings = (next: Partial<AudioSettings>) => {
  settings = { ...settings, ...next };
  settings.volume = Math.max(0, Math.min(1, settings.volume));
  settings.musicVolume = Math.max(0, Math.min(1, settings.musicVolume));
  if (next.effects) stopSources();
  if (!settings.enabled || settings.volume === 0) stopSources();
  if (context && master) master.gain.setTargetAtTime(settings.enabled ? settings.volume * .55 : 0, context.currentTime, .015);
  if (context && musicGain) {
    musicGain.gain.cancelScheduledValues(context.currentTime);
    musicGain.gain.setTargetAtTime(settings.enabled && settings.music ? settings.musicVolume * .5 : 0, context.currentTime, .04);
  }
  if (!settings.enabled || !settings.music || settings.musicVolume === 0) stopMusic(); else startMusic();
  try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch { /* Keep the in-memory preference. */ }
  listeners.forEach((listener) => listener());
};

// The context is created only from a real pointer/keyboard interaction.
export const unlockGameAudio = async () => {
  if (!settings.enabled || document.hidden || typeof AudioContext === "undefined") return;
  try {
    if (!context || context.state === "closed") {
      context = new AudioContext();
      master = context.createGain();
      musicGain = context.createGain();
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -18;
      limiter.knee.value = 15;
      limiter.ratio.value = 8;
      master.gain.value = settings.volume * .55;
      master.connect(limiter);
      musicGain.gain.value = 0;
      musicGain.connect(limiter);
      limiter.connect(context.destination);
    }
    if (context.state === "suspended") await context.resume();
    void preloadEffects();
    startMusic();
  } catch { /* An unavailable audio device must never block navigation. */ }
};

const preloadEffects = (): Promise<void> => {
  if (effectsLoading) return effectsLoading;
  const audio = context;
  if (!audio || typeof fetch !== "function" || typeof audio.decodeAudioData !== "function") return Promise.resolve();
  const files = [...new Set(Object.values(effectSamples).flatMap((layers) => layers.map((layer) => layer.file)))];
  effectsLoading = Promise.allSettled(files.map(async (file) => {
    const response = await fetch(`/audio/sfx/${file}.ogg`);
    if (!response.ok) return;
    const decoded = await audio.decodeAudioData(await response.arrayBuffer());
    effectBuffers.set(file, decoded);
  })).then(() => undefined);
  return effectsLoading;
};

const recordedEffect = (cue: GameSound) => {
  if (!context || !master) return false;
  const layers: readonly EffectSampleModel[] = effectSamples[cue];
  if (!layers.every((layer) => effectBuffers.has(layer.file))) return false;
  for (const layer of layers) {
    const buffer = effectBuffers.get(layer.file);
    if (!buffer) continue;
    const source = context.createBufferSource();
    const gain = context.createGain();
    const start = context.currentTime + (layer.offset ?? 0);
    source.buffer = buffer;
    source.playbackRate.value = layer.rate ?? 1;
    gain.gain.value = layer.level;
    source.connect(gain); gain.connect(master);
    source.start(start); source.stop(start + buffer.duration / (layer.rate ?? 1) + .01);
    activeSources.add(source);
    source.onended = () => { activeSources.delete(source); source.disconnect(); gain.disconnect(); };
  }
  return true;
};

const tone = (frequency: number, endFrequency: number, duration: number, level: number, offset = 0, wave: OscillatorType = "sine") => {
  if (!context || !master) return;
  const start = context.currentTime + offset;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), start + duration);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + .008);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(master);
  oscillator.start(start);
  activeSources.add(oscillator);
  oscillator.stop(start + duration + .02);
  oscillator.onended = () => { activeSources.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
};

const rustle = (duration: number, level: number, frequency: number, offset = 0) => {
  if (!context || !master) return;
  if (!noise) {
    noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  }
  const start = context.currentTime + offset;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = noise;
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  filter.Q.value = .7;
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + .012);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  source.connect(filter); filter.connect(gain); gain.connect(master);
  source.start(start); source.stop(start + duration + .02);
  activeSources.add(source);
  source.onended = () => { activeSources.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
};

// Local CC0 recordings are primary; synthesis covers the first gesture or offline cache misses.
export const playGameSound = (cue: GameSound) => {
  if (!context || context.state !== "running" || !settings.enabled || settings.volume === 0 || document.hidden) return;
  const category = cue === "navigate" ? "navigate" : cue === "march" || cue === "battle" || cue === "victory" ? "units" : "click";
  if (!settings.effects[category]) return;
  const now = performance.now();
  if (now - lastCue < 65) return;
  lastCue = now;
  if (recordedEffect(cue)) return;
  if (cue === "click") {
    tone(1050, 620, .065, .18, 0, "triangle");
    tone(2200, 1450, .045, .045);
  } else if (cue === "select" || cue === "open" || cue === "close" || cue === "victory") {
    tone(560, 720, .11, .12, 0, "triangle");
    tone(1120, 1440, .12, .055, .04);
  } else if (cue === "navigate") {
    rustle(.23, .15, 1400);
    tone(330, 660, .2, .12, .035, "triangle");
    tone(990, 1320, .18, .06, .10);
  } else {
    const steps = cue === "battle" ? 8 : 6;
    for (let step = 0; step < steps; step++) {
      const offset = step * .12;
      tone(step % 2 ? 100 : 125, 45, .10, .24, offset);
      rustle(.075, .12, 650, offset + .018);
      if (step % 2 === 0) tone(1800, 500, .06, .035, offset + .025, "triangle");
    }
    if (cue === "battle") {
      tone(146.8, 146.8, .65, .09, .05, "sawtooth");
      tone(220, 220, .6, .055, .09, "triangle");
      rustle(.35, .13, 2300, .35);
    }
  }
};

export const suspendGameAudio = () => {
  stopSources();
  stopMusic();
  if (context?.state === "running") void context.suspend().catch(() => undefined);
};
