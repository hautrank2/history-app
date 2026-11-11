import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

import ts from "typescript";

const json = (path) => JSON.parse(readFileSync(path, "utf8"));
const characters = json("src/data/database/character.json");
const characterById = new Map(characters.map((person) => [person.id, person]));
const music = json("src/data/database/music-context.json").periods;

// Khung bao gần đúng để bắt lỗi đảo kinh/vĩ độ khi nhập tọa độ
const bounds = {
  england: { lng: [-11, 4], lat: [49, 61] },
  denmark: { lng: [-1, 17], lat: [51, 58] },
  norway: { lng: [4, 32], lat: [57, 72] },
};
const requiredIds = {
  england: [
    "roman-britain", "anglo-saxon", "alfred-wessex", "norman-conquest",
    "angevin", "tudor", "elizabethan", "stuart", "victorian",
    "modern-britain",
  ],
  denmark: [
    "viking-denmark", "harald-bluetooth", "north-sea-empire",
    "kalmar-union", "modern-denmark",
  ],
  norway: [
    "viking-norway", "harald-fairhair", "christian-norway",
    "norway-1814", "modern-norway",
  ],
};
const placeKinds = new Set(["capital", "battle", "camp", "heritage"]);
const allIds = new Set();

for (const [country, box] of Object.entries(bounds)) {
  const rows = json(`src/data/database/${country}-eras.json`);
  const ids = new Set(rows.map((row) => row.id));
  assert.equal(ids.size, rows.length, `${country}: unique scene IDs`);
  for (const id of requiredIds[country]) {
    assert.ok(ids.has(id), `${country}: missing scene ${id}`);
  }
  const sorted = [...rows].sort((first, second) => first.start - second.start);
  sorted.forEach((row, index) => {
    const label = `${country}/${row.id}`;
    assert.match(row.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, label);
    assert.ok(!allIds.has(row.id), `${label}: ID reused across countries`);
    allIds.add(row.id);
    assert.ok(row.era && row.name && row.years && row.capital, label);
    assert.ok(row.summary.length > 80, `${label}: summary too short`);
    assert.ok(row.culture.length > 40, `${label}: culture missing`);
    assert.ok(row.sourceArticle, `${label}: missing source article`);
    assert.ok(row.end === null || row.end > row.start, `${label}: years`);
    if (index < sorted.length - 1) {
      assert.ok(row.end !== null, `${label}: only the last scene is open-ended`);
    }
    for (const source of row.extraSources ?? []) {
      assert.equal(new URL(source.url).protocol, "https:", label);
    }
    assert.ok(row.places.length, `${label}: needs at least one place`);
    for (const place of row.places) {
      assert.ok(placeKinds.has(place.kind), `${label}: kind ${place.kind}`);
      const [lng, lat] = place.at;
      assert.ok(
        lng >= box.lng[0] && lng <= box.lng[1]
          && lat >= box.lat[0] && lat <= box.lat[1],
        `${label}: ${place.name} outside map frame`,
      );
      assert.ok(place.note, `${label}: ${place.name} needs a note`);
    }
    for (const personId of row.peopleIds) {
      assert.ok(characterById.has(personId), `${label}: unknown ${personId}`);
    }
    if (country === "england") {
      assert.ok(music.england[row.id], `${label}: missing music context`);
    }
  });
  // Eras must be contiguous on the timeline, otherwise the rail splits them.
  const eras = sorted.map((row) => row.era);
  const seen = new Set();
  eras.forEach((era, index) => {
    if (era !== eras[index - 1]) {
      assert.ok(!seen.has(era), `${country}: era "${era}" is split`);
      seen.add(era);
    }
  });
}

// Hash và route cũ của các giai đoạn giữ chỗ nước Anh vẫn phải mở được.
const englandIds = new Set(json("src/data/database/england-eras.json")
  .map((row) => row.id));
for (const slug of ["anglo-saxon", "tudor", "stuart", "modern-britain"]) {
  assert.ok(englandIds.has(slug), `Legacy England slug ${slug}`);
}
const angloSaxon = json("src/data/database/england-eras.json")
  .filter(({ start }) => start >= 410 && start < 1066);
assert.equal(angloSaxon[0].start, 410);
assert.equal(angloSaxon.at(-1).end, 1066);
for (const [index, row] of angloSaxon.slice(1).entries()) {
  assert.equal(angloSaxon[index].end, row.start, `Timeline gap or overlap at ${row.id}`);
}
assert.match(
  readFileSync("src/data/europe-overview.ts", "utf8"),
  /"norman-plantagenet": "norman-conquest"/,
);

const loadMapData = (path, dependencies = {}) => {
  const loadedModule = { exports: {} };
  const { outputText } = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  vm.runInNewContext(outputText, {
    module: loadedModule, exports: loadedModule.exports,
    require(name) {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected map dependency ${name}`);
      return dependencies[name];
    },
  });
  return loadedModule.exports;
};
const englandGeography = loadMapData("src/data/england-geography.ts");
const earlyEngland = loadMapData("src/data/england-state-maps.ts", {
  "~/data/england-geography": englandGeography,
});
const { englandStateMaps } = loadMapData("src/data/england-territories.ts", {
  "~/data/england-geography": englandGeography,
  "~/data/england-state-maps": earlyEngland,
  "~/data/geo/northwest-europe.json": json("src/data/geo/northwest-europe.json"),
});
assert.deepEqual(new Set(Object.keys(englandStateMaps)), englandIds);
assert.deepEqual(new Set(Object.keys(englandGeography.englandGeography)), englandIds);
for (const row of json("src/data/database/england-eras.json")) {
  const map = englandStateMaps[row.id];
  const geography = englandGeography.englandGeography[row.id];
  assert.ok(map.year >= row.start && (row.end === null || map.year <= row.end), row.id);
  assert.ok(map.view && map.sources.length && map.states.length, row.id);
  assert.equal(new Set(map.states.map(({ id }) => id)).size, map.states.length, row.id);
  assert.ok(geography.realm && geography.extent && geography.neighbours, row.id);
  for (const entry of [geography.area, geography.population, geography.flag]) {
    if (entry) assert.equal(new URL(entry.source.url).protocol, "https:", row.id);
  }
}
const cnutRealms = englandStateMaps["cnut-north-sea"].states.filter(({ kind }) => kind === "state");
assert.deepEqual(Array.from(cnutRealms, ({ id }) => id), ["england", "denmark", "norway"]);
assert.equal(new Set(cnutRealms.map(({ color }) => color)).size, 1);
assert.equal(englandGeography.englandGeography["cnut-north-sea"].flag, undefined);

for (const id of ["cnut", "harald-hardrada", "margaret-i", "christian-iv"]) {
  assert.ok(characterById.has(id), `Shared Nordic character ${id}`);
}
for (const country of ["denmark", "norway"]) {
  assert.match(
    readFileSync("src/data/character-countries.ts", "utf8"),
    new RegExp(`id: "${country}"`),
  );
}

console.log(`Europe history validated: ${allIds.size} scenes`);
