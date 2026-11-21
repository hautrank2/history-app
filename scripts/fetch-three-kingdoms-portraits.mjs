// Development-only importer. The website uses local files and never calls
// Wikipedia at runtime. Only free-licensed page images are accepted.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const agent = {
  "User-Agent": "HistoryAtlasEducational/1.0 (Wikipedia portrait attribution in the application)",
};
const sceneData = await readFile(new URL("../src/data/three-kingdoms.ts", import.meta.url), "utf8");
const castIds = new Set([...sceneData.matchAll(/characterId: "([^"]+)"/g)].map((match) => match[1]));
const characters = JSON.parse(
  await readFile(new URL("../src/data/database/character.json", import.meta.url), "utf8"),
);
const people = characters.filter((person) => castIds.has(person.id));
const directory = new URL("../public/images/china/", import.meta.url);
await mkdir(directory, { recursive: true });
const manifestPath = new URL("../src/data/china-portraits.json", import.meta.url);
const manifest = await readFile(manifestPath, "utf8")
  .then(JSON.parse)
  .catch(() => ({}));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchWithRetry = async (url) => {
  for (let attempt = 0; attempt < 4; attempt++) {
    await wait(1100 + attempt * 5000);
    try {
      const response = await fetch(url, {
        headers: agent,
        signal: AbortSignal.timeout(25000),
      });
      if (response.status === 429 && attempt < 3) continue;
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
      return response;
    } catch (error) {
      if (attempt === 3) throw error;
    }
  }
  throw new Error("Unreachable retry state");
};
const stripHtml = (value = "") => value
  .replace(/<[^>]+>/g, "")
  .replace(/\s+/g, " ")
  .trim();

const titles = people.map((person) => person.wiki);
for (let offset = 0; offset < titles.length; offset += 20) {
  const batch = titles.slice(offset, offset + 20).filter((title) => !manifest[title]);
  if (!batch.length) continue;
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    redirects: "1",
    prop: "pageimages|info",
    inprop: "url",
    piprop: "thumbnail|name",
    pithumbsize: "400",
    pilicense: "free",
    titles: batch.join("|"),
  });
  const response = await fetchWithRetry(`https://en.wikipedia.org/w/api.php?${params}`);
  if (!response.ok) throw new Error(`Wikipedia: ${response.status}`);
  const { query } = await response.json();
  const resolveTitle = (title) => {
    const normalized = query.normalized?.find((item) => item.from === title)?.to ?? title;
    return query.redirects?.find((item) => item.from === normalized)?.to ?? normalized;
  };

  for (const title of batch) {
    const person = people.find((item) => item.wiki === title);
    const page = Object.values(query.pages)
      .find((item) => item.title === resolveTitle(title));
    if (!person || !page?.thumbnail || !page.pageimage) {
      console.log(`No free portrait: ${title}`);
      continue;
    }
    const infoParams = new URLSearchParams({
      action: "query",
      format: "json",
      prop: "imageinfo",
      iiprop: "extmetadata",
      titles: `File:${page.pageimage}`,
    });
    const info = await fetchWithRetry(`https://commons.wikimedia.org/w/api.php?${infoParams}`)
      .then((item) => item.json()).catch(() => null);
    if (!info) continue;
    const metadata = Object.values(info.query?.pages ?? {})[0]?.imageinfo?.[0]?.extmetadata;
    const license = stripHtml(metadata?.LicenseShortName?.value);
    if (!license) {
      console.log(`No license metadata: ${title}`);
      continue;
    }
    await wait(350);
    const sourceUrl = new URL(page.thumbnail.source);
    sourceUrl.search = "";
    const image = await fetchWithRetry(sourceUrl.href).catch((error) => {
      console.log(`Download skipped: ${title}: ${error.message}`);
      return null;
    });
    if (!image) continue;
    if (!image.ok) {
      console.log(`Unavailable (${image.status}): ${title}`);
      continue;
    }
    const extension = image.headers.get("content-type")?.includes("png") ? "png" : "jpg";
    await writeFile(
      new URL(`${person.id}.${extension}`, directory),
      Buffer.from(await image.arrayBuffer()),
    );
    manifest[title] = {
      src: `/images/china/${person.id}.${extension}`,
      file: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.pageimage.replaceAll(" ", "_"))}`,
      article: page.fullurl,
      author: stripHtml(metadata?.Artist?.value) || "KhÃ´ng rÃµ tÃ¡c giáº£",
      license,
    };
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Saved: ${title}`);
  }
}
console.log(`${Object.keys(manifest).length}/${titles.length} portraits saved.`);
