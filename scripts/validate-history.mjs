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
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
for (const file of walk("src").filter((file) => file.endsWith(".tsx"))) {
  const source = readFileSync(file, "utf8");
  assert.ok(!source.includes('from "next/image"'), `Direct next/image: ${file}`);
  if (!file.replaceAll("\\", "/").endsWith("components/ui/image.tsx")) assert.ok(!/<img\b/.test(source), `Bare img: ${file}`);
  for (const match of source.matchAll(/getCharacter\("([^"]+)"\)/g)) assert.ok(ids.has(match[1]), `Unknown character: ${file}: ${match[1]}`);
}
console.log(`Validated ${characters.length} characters, ${events.length} events, 12 warlords, ${sceneIds.size} scenes and the shared image renderer.`);
