import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const load = (file) => {
  const loadedModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, URL, Number, Map });
  return loadedModule.exports;
};
const plain = (value) => JSON.parse(JSON.stringify(value));
const life = JSON.parse(readFileSync("src/data/database/ho-chi-minh-life.json", "utf8"));
const ids = life.scenes.map((scene) => scene.id);
const { readLifeMapUrl, writeLifeMapUrl, clampLifeMapCamera } = load("src/lib/life-map-url.ts");
const defaults = readLifeMapUrl(new URL("https://atlas.example/characters/ho-chi-minh"), ids);
assert.equal(defaults.view, "map", "The map must be the initial view");
assert.equal(defaults.map, "focus");
assert.equal(defaults.stop, ids[0]);
assert.equal(defaults.routes, false, "Route lines start hidden");
assert.equal(defaults.points, false, "Unselected points start hidden");
assert.equal(defaults.borders, true, "Modern borders remain visible");
const bare = new URL("https://atlas.example/characters/ho-chi-minh");
assert.equal(writeLifeMapUrl(bare, defaults, ids[0]).search, "", "All default values must produce a bare URL");
const explicitDefaults = new URL(`${bare}?view=map&stop=${ids[0]}&map=focus&q=&routes=0&points=0&borders=1&z=1&x=0&y=0`);
assert.equal(writeLifeMapUrl(explicitDefaults, readLifeMapUrl(explicitDefaults, ids), ids[0]).search, "", "Strip explicit defaults from existing URLs");
const world = { ...defaults, map: "world" };
assert.equal(writeLifeMapUrl(bare, world, ids[0]).search, "?map=world");
assert.deepEqual(plain(readLifeMapUrl(writeLifeMapUrl(bare, world, ids[0]), ids)), plain(world), "Preserve explicit world mode");
const visibleLayers = { ...defaults, routes: true, points: true };
assert.deepEqual(plain(readLifeMapUrl(writeLifeMapUrl(new URL("https://atlas.example/characters/ho-chi-minh"), visibleLayers, ids[0]), ids)), plain(visibleLayers), "Explicitly enabled lines and points survive sharing and reload");
const shared = new URL("https://atlas.example/characters/ho-chi-minh?view=map&stop=moscow-1950&map=focus&q=Mao+Tr%E1%BA%A1ch+%C4%90%C3%B4ng&z=2.4&x=42&y=-12&routes=0&borders=0&utm_source=test");
const state = readLifeMapUrl(shared, ids);
assert.equal(state.stop, "moscow-1950");
assert.equal(state.q, "Mao Trạch Đông");
assert.equal(state.routes, false); assert.equal(state.borders, false);
assert.deepEqual(plain(state.camera), { zoom: 2.4, x: 42, y: -12 });
assert.deepEqual(plain(readLifeMapUrl(writeLifeMapUrl(shared, state, ids[0]), ids)), plain(state), "Sharing and reloading must restore the map, stop, Unicode query, layers and camera");
assert.equal(writeLifeMapUrl(shared, state, ids[0]).searchParams.get("utm_source"), "test", "Keep unrelated search parameters");
for (const id of ids) {
  const url = writeLifeMapUrl(shared, { ...defaults, stop: id }, ids[0]);
  assert.equal(readLifeMapUrl(url, ids).stop, id, `Every stop must be shareable: ${id}`);
}
const legacy = readLifeMapUrl(new URL("https://atlas.example/characters/ho-chi-minh#moscow-1950"), ids);
assert.equal(legacy.stop, "moscow-1950"); assert.equal(legacy.view, "story", "Existing character profile hash links must still open the story");
assert.equal(writeLifeMapUrl(shared, legacy, ids[0]).hash, "", "Normalize legacy links to search params");
const malformed = readLifeMapUrl(new URL("https://atlas.example/characters/ho-chi-minh?stop=unknown&map=bad&view=bad&z=Infinity&x=900000&y=NaN"), ids);
assert.equal(malformed.stop, ids[0]); assert.equal(malformed.map, "focus");
assert.deepEqual(plain(malformed.camera), { zoom: 1, x: 1000, y: 0 });
assert.deepEqual(plain(clampLifeMapCamera({ zoom: 400, x: -2000, y: 900 })), { zoom: 12, x: -1000, y: 600 });
const { lifeMapLegs, projectLifePoint } = load("src/lib/life-map-geometry.ts");
const legs = lifeMapLegs(life.scenes);
assert.ok(legs.length > 20);
for (const leg of legs) {
  assert.equal(leg.to, leg.from + 1, "Arrows must follow consecutive chronological stops");
  assert.ok(!/NaN|Infinity/.test(leg.path + leg.arrow));
  assert.ok(leg.path.startsWith(`M${projectLifePoint(life.scenes[leg.from].location.at).join(",")}`));
}
const coincident = lifeMapLegs([{ ...life.scenes[0], id: "first", location: { at: [105, 21] } }, { ...life.scenes[0], id: "second", location: { at: [105, 21] } }]);
assert.equal(coincident.length, 0, "Repeated events at one place must not produce a zero-length arrow");
assert.ok(!life.scenes.some((scene) => Math.abs(scene.location.at[0] + 77.037) < .05 && Math.abs(scene.location.at[1] - 38.898) < .05), "Correspondence with US presidents must never become a claimed visit to Washington");
console.log(`Validated ${ids.length} shareable stops, ordered route arrows, repeated locations, legacy hashes, camera limits and full URL restoration.`);
