import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (!path.extname(file)) file += existsSync(`${file}.ts`) ? ".ts" : ".json";
  if (cache.has(file)) return cache.get(file).exports;
  if (file.endsWith(".json")) return JSON.parse(readFileSync(file, "utf8"));
  const loaded = { exports: {} };
  cache.set(file, loaded);
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { module: loaded, exports: loaded.exports, require: (id) => {
    // Period lookup does not participate in the chronology/map contracts.
    if (id === "~/data/periods") return { periodForScene: () => undefined };
    return load(id.startsWith("~/") ? path.join("src", id.slice(2)) : path.resolve(path.dirname(file), id));
  } }, { filename: file });
  return loaded.exports;
}

const { vietnamBattles, bachDangBattle, vietnamBattleStory } = load("src/data/vietnam-battles.ts");
const { vietnamData } = load("src/data/vietnam.ts");
const original = vietnamData.periods.find((period) => period.slug === "bach-dang-1288").story;
const bachDang = bachDangBattle(original);
const counts = {};
for (const battle of [...vietnamBattles, bachDang]) {
  counts[battle.id] = battle.chapters.length;
  assert.ok(battle.chapters.length >= 8, `${battle.id}: at least eight substantive events`);
  assert.equal(battle.chapters[0].phase, "context", `${battle.id}: starts with historical context`);
  assert.equal(battle.chapters.at(-1).phase, "aftermath", `${battle.id}: ends with consequences`);
  assert.equal(battle.chapters.filter((event) => event.phase).length, 2);
  assert.ok(battle.chapters.filter((event) => event.phase).every((event) => !event.routes.length), "Editorial milestones must not invent troop movements");
  assert.equal(new Set(battle.chapters.map((event) => event.title)).size, battle.chapters.length);
  const ids = new Set(battle.places.map((place) => place.id));
  assert.equal(ids.size, battle.places.length);
  for (const event of battle.chapters) {
    assert.ok(event.text.length >= 100, `${battle.id}/${event.title}: substantive copy`);
    assert.ok(event.placeIds.length && event.placeIds.every((id) => ids.has(id)), `${battle.id}/${event.title}: valid event location`);
    for (const route of event.routes ?? []) {
      assert.ok(route.places.length >= 2 && route.places.every((id) => ids.has(id)), `${battle.id}/${event.title}: valid route endpoints`);
      assert.ok(["march", "attack", "retreat", "supply", "defend"].includes(route.kind));
    }
  }
  assert.equal(vietnamBattleStory(battle).chapters.length, battle.chapters.length);
}
assert.ok(bachDang.chapters.every((event) => event.tacticalStage >= 0 && event.tacticalStage < original.chapters.length), "Expanded Bach Dang events must retain a valid 3D tactical stage");
const dienBien = vietnamBattles.find((battle) => battle.id === "dien-bien-phu-1954");
assert.equal(dienBien.chapters.find((event) => event.date === "26/1/1954").placeIds.join(), "huoi-he", "January 26 decision predates the move to Muong Phang");
for (const id of ["muong-phang", "muong-thanh", "huoi-he"]) {
  const place = dienBien.places.find((place) => place.id === id);
  assert.ok(place && place.at[0] > 102.9 && place.at[0] < 103.3 && place.at[1] > 21.3 && place.at[1] < 21.6, "Command posts belong to the Dien Bien area");
}

const { threeKingdomsBattleScenes } = load("src/data/three-kingdoms-battles.ts");
const { places, people } = load("src/data/three-kingdoms.ts");
for (const id of ["quan-do", "xich-bich", "hop-phi", "di-lang", "nhai-dinh"]) {
  const events = threeKingdomsBattleScenes(id);
  counts[id] = events.length;
  assert.ok(events.length >= 8);
  assert.equal(events[0].phase, "context");
  assert.equal(events.at(-1).phase, "aftermath");
  assert.ok(events.filter((event) => event.phase).every((event) => !event.battle && !event.routes.length));
  assert.equal(new Set(events.map((event) => event.id)).size, events.length);
  for (const event of events) {
    assert.ok(places[event.focus]);
    assert.ok(event.story.length >= 100);
    assert.ok(event.cast.every((member) => people[member.person] && places[member.place]));
    assert.ok(event.routes.every((route) => route.kind && route.places.every((place) => places[place])));
  }
}

const { zoomMapAt } = load("src/lib/map-camera.ts");
const camera = { zoom: 2, x: 35, y: -18 }, cursor = [143, 351];
const before = [300 + camera.x + (cursor[0] - 300) / camera.zoom, 260 + camera.y + (cursor[1] - 260) / camera.zoom];
const next = zoomMapAt(camera, 1.7, cursor);
const after = [300 + next.x + (cursor[0] - 300) / next.zoom, 260 + next.y + (cursor[1] - 260) / next.zoom];
assert.ok(before.every((value, index) => Math.abs(value - after[index]) < 1e-9), "Wheel zoom must preserve the world point under the pointer after panning");
assert.equal(zoomMapAt(camera, 100, cursor).zoom, 16);
assert.equal(zoomMapAt(camera, .001, cursor).zoom, .65);
const { battleRouteGeometry } = load("src/lib/battle-route.ts");
const shortRoute = battleRouteGeometry([{ x: 10, y: 10 }, { x: 12, y: 10 }], 60);
assert.ok(shortRoute && shortRoute.badgeAt.y >= 40, "Short routes must remain visible with an offset action icon");
assert.equal(battleRouteGeometry([{ x: 1, y: 2 }, { x: 1, y: 2 }]), null, "Do not draw a fictitious march between identical points");
console.log("Validated battle chronology, map locations, route types, 3D stages and pointer-centered zoom:", counts);
