import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const cache = new Map();
const load = (path) => {
  if (cache.has(path)) return cache.get(path);
  if (path.endsWith(".json")) return JSON.parse(readFileSync(path, "utf8"));
  const loadedModule = { exports: {} };
  cache.set(path, loadedModule.exports);
  const compiled = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  vm.runInNewContext(compiled, {
    module: loadedModule,
    exports: loadedModule.exports,
    require: (name) => load(`src/${name.slice(2)}${name.endsWith(".json") ? "" : ".ts"}`),
    URL,
  }, { filename: path });
  return loadedModule.exports;
};

const { threeKingdomsScenes: scenes, people, places, factionLeader } =
  load("src/data/three-kingdoms.ts");
const { territoryBorders } = load("src/lib/territory-borders.ts");
const { battleEntries } = load("src/data/battles.ts");
const { featuredPeriods } = load("src/data/periods.ts");
const coordinate = (point) => point.length === 2
  && point.every(Number.isFinite)
  && Math.abs(point[0]) <= 180 && Math.abs(point[1]) <= 90;
assert.equal(new Set(scenes.map((scene) => scene.id)).size, scenes.length);
assert.equal(scenes[0].year, 184);
assert.equal(scenes.at(-1).year, 280);
for (const [index, scene] of scenes.entries()) {
  assert.ok(index === 0 || scenes[index - 1].year <= scene.year, scene.id);
  assert.ok(scene.title && scene.story && scene.context && scene.cast.length);
  assert.equal(new URL(scene.source.url).protocol, "https:");
  assert.ok(places[scene.focus], scene.id);
  assert.equal(new Set(scene.cast.map((member) => member.person)).size,
    scene.cast.length, `Duplicate cast in ${scene.id}`);
  for (const member of scene.cast) {
    assert.ok(people[member.person]?.characterId && places[member.place]);
  }
  for (const territory of scene.territories) {
    assert.ok(territory.ring.every(coordinate));
    assert.ok(people[factionLeader(territory.faction, scene.year)]);
  }
  for (const route of scene.routes ?? []) {
    assert.ok(route.places.length >= 2);
    route.places.forEach((id) => assert.ok(places[id]));
  }
}
const scene = (id) => scenes.find((item) => item.id === id);
const order = [
  "ha-bi", "xich-bich", "nam-quan-kinh-chau", "hop-phi",
  "dinh-quan-son", "phan-thanh", "quan-vu-mat", "truong-phi-mat",
  "di-lang", "bach-de-thac-co", "nhai-dinh", "ky-son",
  "ngu-truong-nguyen", "cao-binh-lang", "nguy-diet-thuc",
  "tu-ma-viem-lap-tan", "tan-diet-ngo",
];
for (let index = 1; index < order.length; index++) {
  assert.ok(scenes.indexOf(scene(order[index - 1]))
    < scenes.indexOf(scene(order[index])), `Narrative order: ${order[index]}`);
}
assert.ok(scene("ha-bi").cast.some((member) => member.person === "liao"));
assert.ok(scene("nam-quan-kinh-chau").cast.some((member) => member.person === "huang"));
for (const [id, person] of [
  ["quan-vu-mat", "guan"], ["truong-phi-mat", "fei"],
  ["bach-de-thac-co", "liu"], ["ngu-truong-nguyen", "zhuge"],
  ["tu-ma-y-mat", "sima"], ["dong-hung", "sun"],
]) assert.ok(scene(id).cast.some((member) => member.person === person && member.deceased));

const edgeKey = (a, b) => [a.join(","), b.join(",")].sort().join("/");
const edges = (region) => new Set(region.ring.flatMap((point, index) => {
  const next = region.ring[(index + 1) % region.ring.length];
  return point.join() === next.join() ? [] : [edgeKey(point, next)];
}));
const kingdoms = scene("ngu-truong-nguyen").territories;
for (let a = 0; a < kingdoms.length; a++) {
  for (let b = a + 1; b < kingdoms.length; b++) {
    const first = edges(kingdoms[a]);
    assert.ok([...edges(kingdoms[b])].some((key) => first.has(key)),
      `Adjacent kingdoms need identical shared edges: ${a}/${b}`);
  }
}
const final = scene("tan-diet-ngo").territories;
assert.ok(final.every((region) => region.faction === "jin"));
assert.ok(territoryBorders(final).length < territoryBorders(kingdoms).length,
  "Internal borders disappear after unification");
assert.ok(!battleEntries.some((entry) => entry.id === "three-kingdoms"));
assert.ok(featuredPeriods.some((entry) => entry.id === "three-kingdoms"));
for (const entry of [...battleEntries, ...featuredPeriods]) {
  assert.ok(existsSync(`public${entry.image}`), entry.image);
  if (entry.href.includes("#")) assert.ok(scene(entry.href.split("#")[1]));
}
assert.equal(featuredPeriods[0].href, "/period/three-kingdoms");
console.log(`Validated ${scenes.length} Three Kingdoms scenes, narrative order, character links, shared fronts, unification borders and separate period/battle cards.`);
