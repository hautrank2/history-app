import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const json = (path) => JSON.parse(readFileSync(path, "utf8"));
const rows = json("src/data/database/china-dynasties.json");
const characters = json("src/data/database/character.json");
const characterIds = new Set(characters.map((person) => person.id));
const music = json("src/data/database/music-context.json").periods.china;
const compiled = ts.transpileModule(
  readFileSync("src/data/china-state-maps.ts", "utf8"),
  { compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  } },
).outputText;
const mapModule = { exports: {} };
vm.runInNewContext(compiled, {
  module: mapModule,
  exports: mapModule.exports,
});
const { chinaStateMaps } = mapModule.exports;
const rowIds = new Set(rows.map((row) => row.id));
assert.equal(rowIds.size, rows.length, "Unique dynasty/snapshot IDs");

const sixteen = [
  "han-zhao", "cheng-han", "former-liang", "later-zhao", "former-yan",
  "former-qin", "later-yan", "later-qin", "western-qin", "later-liang",
  "southern-liang", "northern-liang", "southern-yan", "western-liang",
  "xia-helian", "northern-yan",
];
const five = [
  "later-liang-five", "later-tang", "later-jin", "later-han-five", "later-zhou",
];
const ten = [
  "yang-wu", "wuyue", "min", "southern-han", "ma-chu", "northern-han",
  "jingnan", "former-shu", "later-shu", "southern-tang",
];
for (const id of [
  "xia", "shang", "western-zhou", "spring-autumn", "warring-states-260",
  "qin", "chu-han-contention", "western-han", "xin", "eastern-han",
  "western-jin", "eastern-jin",
  "liu-song", "southern-qi", "liang", "chen", "northern-wei", "eastern-wei",
  "western-wei", "northern-qi", "northern-zhou", "sui", "tang-early",
  "wu-zhou", "tang-restored", "northern-song", "southern-song", "liao",
  "western-xia", "jin-jurchen", "yuan", "ming", "qing", "republic",
  "peoples-republic", "reform", ...sixteen, ...five, ...ten,
]) assert.ok(rowIds.has(id), `Missing dynasty/state: ${id}`);

const period = (id) => rows.find((row) => row.id === id);
assert.notEqual(period("xia").era, period("shang").era,
  "Xia and Shang must have separate timeline entries");
assert.equal(new Set([
  "western-zhou", "spring-autumn", "warring-states-260",
].map((id) => period(id).era)).size, 3,
  "Western Zhou, Spring and Autumn, and Warring States need separate entries");
assert.equal(period("chu-han-contention").start, -206);
assert.equal(period("chu-han-contention").end, -202);
assert.equal(period("qin").end, period("chu-han-contention").start);
assert.equal(period("chu-han-contention").end, period("western-han").start);
assert.equal(period("chu-han-contention").mapId, "chu-han-206");
assert.notEqual(period("sui").era, period("tang-early").era);
assert.notEqual(period("yuan").era, period("ming").era);
assert.deepEqual(period("three-kingdoms").peopleIds,
  ["tao-thao", "luu-bi", "ton-quyen"]);
for (const id of ["three-kingdoms", "cao-wei", "shu-han", "eastern-wu"]) {
  assert.ok(!period(id).peopleIds.includes("si-nhiep"));
}
for (const [sceneId, ids] of Object.entries({
  xia: ["ha-vu"],
  shang: ["thanh-thang", "tru-vuong"],
  "western-zhou": ["co-xuong", "co-phat", "khuong-tu-nha"],
  qin: ["tan-thuy-hoang"],
  "chu-han-contention": ["hang-vu", "han-tin", "tieu-ha", "truong-luong"],
  "western-jin": ["tu-ma-y", "tu-ma-viem"],
  qing: ["pho-nghi"],
})) {
  for (const id of ids) assert.ok(period(sceneId).peopleIds.includes(id));
}
const modernStages = [
  "republic", "nationalist-nanjing", "war-against-japan",
  "chinese-civil-war", "peoples-republic", "reform",
];
assert.equal(new Set(modernStages.map((id) => period(id).era)).size, 6);
assert.deepEqual(modernStages.map((id) => period(id).start),
  [1912, 1927, 1937, 1945, 1949, 1978]);
const earlySequence = [
  "xia", "shang", "western-zhou", "spring-autumn", "warring-states-260",
  "qin", "chu-han-contention", "western-han",
];
for (let index = 1; index < earlySequence.length; index++) {
  assert.ok(rows.indexOf(period(earlySequence[index - 1]))
    < rows.indexOf(period(earlySequence[index])), "Early timeline order");
}

for (const row of rows) {
  assert.ok(Number.isFinite(row.start));
  assert.ok(row.end === null || row.end >= row.start, row.id);
  assert.ok(row.name && row.era && row.summary && row.city, row.id);
  assert.ok(row.peopleIds.length, `Empty people tab: ${row.id}`);
  assert.equal(new URL(row.sourceUrl).protocol, "https:");
  if (row.mapId) assert.ok(chinaStateMaps[row.mapId], row.mapId);
  for (const id of row.peopleIds) assert.ok(characterIds.has(id), id);
  assert.equal(music[row.id]?.era, row.start >= 1912 ? "modern" : "monarchy");
}

const coordinates = (at) => at.length === 2
  && at.every(Number.isFinite) && Math.abs(at[0]) <= 180 && Math.abs(at[1]) <= 90;
let regions = 0;
for (const [id, snapshot] of Object.entries(chinaStateMaps)) {
  assert.ok(snapshot.note && snapshot.sources.length, id);
  assert.equal(new Set(snapshot.states.map((state) => state.id)).size,
    snapshot.states.length, `Duplicate states: ${id}`);
  assert.equal(new Set(snapshot.states.map((state) => state.color)).size,
    snapshot.states.length, `Duplicate legend colors: ${id}`);
  for (const source of snapshot.sources) {
    assert.equal(new URL(source.url).protocol, "https:");
  }
  for (const state of snapshot.states) {
    regions++;
    assert.ok(state.name && state.summary && coordinates(state.capital.at));
    assert.ok(coordinates(state.labelAt));
    for (const ring of state.rings) {
      assert.ok(ring.length >= 4 && ring.every(coordinates), state.id);
      assert.equal(ring[0].join(), ring.at(-1).join(), `Open polygon: ${state.id}`);
    }
  }
}
const statesAt = (id) => new Set(chinaStateMaps[id].states.map((state) => state.id));
assert.equal(chinaStateMaps["chu-han-206"].year, -206);
assert.equal(chinaStateMaps["chu-han-206"].states.length, 19,
  "Western Chu plus eighteen enfeoffed kingdoms");
for (const id of ["han-liu-bang", "western-chu", "yong-zhang-han", "sai", "di"]) {
  assert.ok(statesAt("chu-han-206").has(id));
}
assert.equal(chinaStateMaps["three-kingdoms"].year, 262);
for (const id of ["cao-wei", "shu-han", "eastern-wu"]) {
  assert.ok(statesAt("three-kingdoms").has(id));
}
for (const year of [317, 350, 376, 391, 402, 416]) {
  assert.equal(chinaStateMaps[`sixteen-kingdoms-${year}`].year, year);
}
for (const id of ["southern-liang", "southern-yan", "former-qin", "later-yan"]) {
  assert.ok(!statesAt("sixteen-kingdoms-416").has(id), `${id} did not survive to416`);
}
assert.ok(!statesAt("sixteen-kingdoms-402").has("western-qin"),
  "Western Qin lost independence from400 to409");

const portraits = Object.assign({}, ...[
  "overview-portraits", "life-portraits", "overview-leader-portraits",
  "china-portraits", "character-portraits", "character-illustrations",
].map((name) => json(`src/data/${name}.json`)));
for (const person of characters) {
  const src = portraits[person.wiki]?.src;
  assert.ok(src && src !== "/images/character-avatar.svg", `Missing portrait: ${person.id}`);
  assert.ok(existsSync(`public${src}`) && statSync(`public${src}`).size > 100, src);
}
const overviewCode = ts.transpileModule(
  readFileSync("src/data/china-overview.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const overviewModule = { exports: {} };
vm.runInNewContext(overviewCode, {
  module: overviewModule,
  exports: overviewModule.exports,
  require: (name) => {
    if (name.endsWith("china-state-maps")) return { chinaStateMaps };
    if (name.endsWith("china-dynasties.json")) return rows;
    if (name.endsWith("characters")) return {
      getCharacter: (id) => characters.find((person) => person.id === id),
    };
    throw new Error(`Unexpected data dependency: ${name}`);
  },
});
for (const scene of overviewModule.exports.chinaOverview) {
  assert.ok(scene.culture.text, `Missing culture after era split: ${scene.id}`);
  assert.ok(scene.places.length && scene.places.every((place) =>
    place.name && coordinates(place.at)), `Missing city: ${scene.id}`);
  assert.ok(scene.people.every((person) => person?.id), scene.id);
}
console.log(`Validated ${rows.length} China periods, all16 kingdoms, five dynasties, ten kingdoms, ${Object.keys(chinaStateMaps).length} maps/${regions} regions and ${characters.length} individual portraits.`);
