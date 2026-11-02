import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const table = (name) => JSON.parse(readFileSync(`src/data/database/${name}.json`, "utf8"));
const characters = table("character");
const events = table("event");
const warlords = table("warlord");
const ids = new Set(characters.map((person) => person.id));
assert.equal(ids.size, characters.length, "Character IDs must be unique");
assert.equal(new Set(events.map((event) => event.id)).size, events.length, "Event IDs must be unique");
assert.equal(warlords.length, 12, "Exactly twelve historical warlords");
assert.equal(new Set(warlords.map((row) => row.characterId)).size, 12);
const overview = readFileSync("src/data/vietnam-overview.ts", "utf8");
const sceneIds = new Set([...overview.matchAll(/id: "([a-z0-9-]+)", era:/g)].map((match) => match[1]));
for (const person of characters) {
  assert.match(person.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(person.sources.length, `Missing sources: ${person.id}`);
  assert.ok(person.biography && person.role && person.lifespan);
  for (const source of person.sources) assert.ok(new URL(source.url).protocol === "https:");
}
for (const row of warlords) assert.ok(ids.has(row.characterId), `Unknown warlord: ${row.characterId}`);
for (const event of events) {
  for (const id of event.leaderIds) assert.ok(ids.has(id), `Unknown leader: ${id}`);
  for (const id of event.sceneIds) assert.ok(sceneIds.has(id), `Unknown scene: ${id}`);
  assert.ok(event.summary && event.outcome && event.location && event.sources.length);
  assert.ok(event.at.length === 2 && event.at[0] >= 102 && event.at[0] <= 110 && event.at[1] >= 8 && event.at[1] <= 24);
}
const life = table("ho-chi-minh-life");
const sourceIds = new Set(life.sources.map((source) => source.id));
assert.equal(sourceIds.size, life.sources.length, "Life source IDs must be unique");
assert.equal(new Set(life.scenes.map((scene) => scene.id)).size, life.scenes.length, "Life scene IDs must be unique");
const checkCoordinates = (at) => assert.ok(at.length === 2 && at.every(Number.isFinite) && Math.abs(at[0]) <= 180 && Math.abs(at[1]) <= 90, `Invalid life coordinates: ${at}`);
const checkSources = (row) => { assert.ok(row.sourceIds.length, `Missing life sources: ${row.id ?? row.characterId}`); for (const id of row.sourceIds) assert.ok(sourceIds.has(id), `Unknown life source: ${id}`); };
for (const source of life.sources) assert.equal(new URL(source.url).protocol, "https:");
life.scenes.forEach((scene, index) => {
  assert.ok(scene.year >= 1890 && scene.year <= 1969);
  assert.ok(index === 0 || life.scenes[index - 1].year <= scene.year, "Life timeline must be chronological");
  assert.ok(scene.title && scene.summary && scene.meaning && scene.context && scene.location.name);
  checkCoordinates(scene.location.at); checkSources(scene);
  if (scene.overviewId) assert.ok(sceneIds.has(scene.overviewId), `Unknown overview scene in life: ${scene.overviewId}`);
  for (const relation of scene.people) {
    assert.ok(ids.has(relation.characterId), `Unknown life character: ${relation.characterId}`);
    assert.ok(["companion", "ally", "opponent", "diplomacy", "influence"].includes(relation.kind));
    assert.ok(relation.connection); checkSources(relation);
    if (relation.at) { checkCoordinates(relation.at); assert.ok(relation.place && relation.locationNote, "Located people need a location qualification"); }
    if (relation.kind === "influence") assert.ok(!relation.at, "An intellectual influence must not imply a physical encounter");
  }
});
const moscow = life.scenes.find((scene) => scene.id === "moscow-1950");
for (const id of ["joseph-stalin", "mao-trach-dong"]) {
  const person = moscow.people.find((person) => person.characterId === id);
  assert.deepEqual(person.at, moscow.location.at, `The 1950 encounter belongs in Moscow: ${id}`);
}
for (const id of ["truman-1946", "johnson-1967"]) {
  const scene = life.scenes.find((scene) => scene.id === id);
  assert.ok(scene.location.at[0] > 100 && scene.people[0].at[0] < 0, "Correspondence must keep Ho in Vietnam and the US government in Washington");
}
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
for (const file of walk("src").filter((file) => file.endsWith(".tsx"))) {
  const source = readFileSync(file, "utf8");
  assert.ok(!source.includes('from "next/image"'), `Direct next/image: ${file}`);
  if (!file.replaceAll("\\", "/").endsWith("components/ui/image.tsx")) assert.ok(!/<img\b/.test(source), `Bare img: ${file}`);
  for (const match of source.matchAll(/getCharacter\("([^"]+)"\)/g)) assert.ok(ids.has(match[1]), `Unknown character: ${file}: ${match[1]}`);
}
console.log(`Validated ${characters.length} characters, ${events.length} events, 12 warlords, ${sceneIds.size} overview scenes, ${life.scenes.length} life scenes and the shared image renderer.`);
