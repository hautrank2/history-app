import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const cache = new Map();
const load = (path) => {
  if (cache.has(path)) return cache.get(path);
  if (path.endsWith(".json")) return JSON.parse(readFileSync(path, "utf8"));
  const mod = { exports: {} };
  cache.set(path, mod.exports);
  const code = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { module: mod, exports: mod.exports,
    require: (name) => load(`${name.startsWith("~/") ? `src/${name.slice(2)}` : `${path.slice(0, path.lastIndexOf("/"))}/${name}`}${name.endsWith(".json") ? "" : ".ts"}`), URL,
  }, { filename: path });
  return mod.exports;
};
const { periodEntries, featuredPeriods, periodForScene } = load("src/data/periods.ts");
const { battleEntries, featuredBattles } = load("src/data/battles.ts");
const { countriesData } = load("src/data/index.ts");
const { dienBienPhuScenes } = load("src/data/dien-bien-phu.ts");
const { battleLinksFor } = load("src/data/battle-links.ts");
const { soundtrackForPath } = load("src/data/soundtracks.ts");
const all = [...periodEntries, ...battleEntries];
assert.equal(new Set(all.map((entry) => entry.href)).size, all.length, "Each detail has its own URL");
for (const entry of all) {
  assert.ok(countriesData[entry.countryId], `Country / flag: ${entry.id}`);
  assert.equal(countriesData[entry.countryId].name, entry.country);
  assert.ok(existsSync(`public${entry.image}`), entry.image);
  assert.ok(!entry.href.includes("#"), "Cards open dedicated pages");
}
for (const period of periodEntries) {
  assert.equal(period.href, `/period/${period.id}`);
  assert.ok(period.scenes.length);
  for (const scene of period.scenes) assert.equal(periodForScene(period.countryId, scene.id)?.id, period.id);
}
for (const battle of battleEntries) {
  assert.match(battle.href, /^\/battle\/[^/]+$/);
  const parent = periodEntries.find((period) => period.id === battle.periodId);
  assert.ok(parent, `Missing parent period: ${battle.id}`);
  assert.equal(parent.countryId, battle.countryId);
  assert.notEqual(soundtrackForPath(battle.href).id, "atlas", `Battle soundtrack: ${battle.id}`);
}
assert.ok(featuredPeriods.length >= 3 && featuredBattles.length >= 3);
assert.ok(featuredPeriods.some((entry) => entry.id === "loan-12-su-quan"));
assert.ok(featuredBattles.some((entry) => entry.id === "dien-bien-phu-1954"));
assert.equal(periodEntries.find((entry) => entry.id === "loan-12-su-quan").scenes[0].places.length, 13);
assert.equal(dienBienPhuScenes.length, 4);
assert.equal(new Set(dienBienPhuScenes.map((scene) => scene.id)).size, 4);
for (const id of ["tran-bach-dang", "dien-bien-phu"]) {
  for (const link of battleLinksFor("vietnam", id)) assert.ok(battleEntries.some((battle) => battle.href === link.href));
}
assert.equal(soundtrackForPath("/battle/tran-bach-dang-1288", "", { chapter: 6 }).moodId, "majestic");
assert.equal(soundtrackForPath("/battle/tran-dien-bien-phu-1954").eraId, "modern");
assert.equal(soundtrackForPath("/period/loan-12-su-quan").countryId, "vietnam");
assert.equal(soundtrackForPath("/period/nha-tran").countryId, "vietnam");
console.log(`Validated ${periodEntries.length} periods and ${battleEntries.length} battles: unique detail URLs, country flags, parent periods, images, featured cards, scene navigation and audio.`);
