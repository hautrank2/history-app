import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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
assert.match(
  readFileSync("src/data/europe-overview.ts", "utf8"),
  /"norman-plantagenet": "norman-conquest"/,
);

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
