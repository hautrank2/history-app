// Development-only importer. The website uses local files and never calls Wikipedia at runtime.
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";

const agent = { "User-Agent": "HistoryAtlasEducational/1.0 (Wikipedia portrait attribution in the application)" };
const source = await readFile(new URL("../src/data/vietnam-overview.ts", import.meta.url), "utf8");
const people = [...source.matchAll(/person\("([^"]+)",\s*"[^"]+",\s*"([^"]+)"/g)].map((match) => ({ name: match[1], wiki: match[2] }));
const titles = [...new Set(people.map((person) => person.wiki))];
const directory = new URL("../public/images/overview/", import.meta.url);
await mkdir(directory, { recursive: true });
const manifestPath = new URL("../src/data/overview-portraits.json", import.meta.url);
const manifest = await readFile(manifestPath, "utf8").then(JSON.parse).catch(() => ({}));
// Page thumbnails may show monuments, maps or tombs rather than the person.
const excluded = new Set(["Khúc Thừa Dụ", "Dương Đình Nghệ", "Trần Thái Tông", "Nguyễn Kim", "Hồ Quý Ly"]);
for (const title of excluded) delete manifest[title];
const curated = {
  "Hùng king": "Tượng Hùng Vương tại Đền Hùng, Tao Đàn, tháng 12 năm 2021 (12).jpg",
  "Ma Yuan (Han dynasty)": "Ma-Yuan.jpg",
};
const fetchWithRetry = async (url) => {
  let response = await fetch(url, { headers: agent });
  for (const delay of [5000, 15000, 30000]) {
    if (response.status !== 429) return response;
    await new Promise((resolve) => setTimeout(resolve, delay));
    response = await fetch(url, { headers: agent });
  }
  return response;
};

for (let offset = 0; offset < titles.length; offset += 30) {
  const batch = titles.slice(offset, offset + 30);
  const params = new URLSearchParams({ action: "query", format: "json", redirects: "1", prop: "pageimages|info", inprop: "url", piprop: "thumbnail|name", pithumbsize: "360", pilicense: "free", titles: batch.join("|") });
  const response = await fetchWithRetry(`https://en.wikipedia.org/w/api.php?${params}`);
  if (!response.ok) throw new Error(`Wikipedia: ${response.status}`);
  const { query } = await response.json();
  const resolveTitle = (title) => {
    const normalized = query.normalized?.find((item) => item.from === title)?.to ?? title;
    return query.redirects?.find((item) => item.from === normalized)?.to ?? normalized;
  };
  for (const title of batch) {
    if (excluded.has(title) || curated[title]) continue;
    if (manifest[title]) continue;
    const page = Object.values(query.pages).find((item) => item.title === resolveTitle(title));
    if (!page?.thumbnail || !page.pageimage) {
      console.log(`No free portrait: ${title}`);
      continue;
    }
    const existingStem = String(titles.indexOf(title) + 1).padStart(2, "0");
    const existing = await stat(new URL(`${existingStem}.jpg`, directory)).then(() => "jpg").catch(() => stat(new URL(`${existingStem}.png`, directory)).then(() => "png").catch(() => null));
    let extension = existing;
    if (!existing) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      let imageResponse = await fetch(page.thumbnail.source, { headers: agent });
      for (const delay of [4000, 10000, 20000]) {
        if (imageResponse.status !== 429) break;
        await new Promise((resolve) => setTimeout(resolve, delay));
        imageResponse = await fetch(page.thumbnail.source, { headers: agent });
      }
      if (!imageResponse.ok) { console.log(`Unavailable (${imageResponse.status}): ${title}`); continue; }
      extension = imageResponse.headers.get("content-type")?.includes("png") ? "png" : "jpg";
      await writeFile(new URL(`${existingStem}.${extension}`, directory), Buffer.from(await imageResponse.arrayBuffer()));
    }
    const filename = `${String(titles.indexOf(title) + 1).padStart(2, "0")}.${extension}`;
    manifest[title] = {
      src: `/images/overview/${filename}`,
      article: page.fullurl,
      file: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.pageimage.replaceAll(" ", "_"))}`,
      title: page.pageimage,
      remote: page.thumbnail.source,
    };
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Saved: ${title}`);
  }
}
await writeFile(new URL("../src/data/overview-portraits.json", import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${Object.keys(manifest).length}/${titles.length} portraits saved.`);

// Vietnamese articles sometimes have free photographs of statues absent from English articles.
for (const title of titles.filter((item) => !manifest[item])) {
  if (excluded.has(title) || curated[title]) continue;
  const name = people.find((person) => person.wiki === title)?.name;
  if (!name) continue;
  const params = new URLSearchParams({ action: "query", format: "json", redirects: "1", prop: "pageimages|info", inprop: "url", piprop: "thumbnail|name", pithumbsize: "360", pilicense: "free", titles: name });
  const response = await fetchWithRetry(`https://vi.wikipedia.org/w/api.php?${params}`);
  if (!response.ok) continue;
  const { query } = await response.json();
  const page = Object.values(query.pages)[0];
  if (!page?.thumbnail || !page.pageimage) continue;
  await new Promise((resolve) => setTimeout(resolve, 800));
  const imageResponse = await fetchWithRetry(page.thumbnail.source);
  if (!imageResponse.ok) continue;
  const extension = imageResponse.headers.get("content-type")?.includes("png") ? "png" : "jpg";
  const filename = `${String(titles.indexOf(title) + 1).padStart(2, "0")}.${extension}`;
  await writeFile(new URL(filename, directory), Buffer.from(await imageResponse.arrayBuffer()));
  manifest[title] = { src: `/images/overview/${filename}`, article: page.fullurl, file: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(page.pageimage.replaceAll(" ", "_"))}`, title: page.pageimage, remote: page.thumbnail.source };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Vietnamese portrait saved: ${name}`);
}

const plain = (value = "") => value.replace(/<[^>]+>/g, "").replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replace(/\s+/g, " ").trim();
for (const [title, filename] of Object.entries(curated)) {
  if (manifest[title]?.title === filename.replaceAll(" ", "_")) continue;
  const params = new URLSearchParams({ action: "query", format: "json", prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "360", titles: `File:${filename}` });
  const response = await fetchWithRetry(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!response.ok) throw new Error(`Curated image: ${response.status}`);
  const { query } = await response.json();
  const info = Object.values(query.pages)[0]?.imageinfo?.[0];
  if (!info?.thumburl) throw new Error(`No image: ${filename}`);
  const imageResponse = await fetchWithRetry(info.thumburl);
  if (!imageResponse.ok) throw new Error(`Curated download: ${imageResponse.status}`);
  const extension = imageResponse.headers.get("content-type")?.includes("png") ? "png" : "jpg";
  const local = `${String(titles.indexOf(title) + 1).padStart(2, "0")}.${extension}`;
  await writeFile(new URL(local, directory), Buffer.from(await imageResponse.arrayBuffer()));
  manifest[title] = { src: `/images/overview/${local}`, title: filename.replaceAll(" ", "_"), file: info.descriptionurl, remote: info.thumburl, article: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}` };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}
const entries = Object.values(manifest);
for (let offset = 0; offset < entries.length; offset += 30) {
  const batch = entries.slice(offset, offset + 30);
  const params = new URLSearchParams({ action: "query", format: "json", prop: "imageinfo", iiprop: "url|extmetadata", titles: batch.map((entry) => `File:${entry.title}`).join("|") });
  const response = await fetchWithRetry(`https://en.wikipedia.org/w/api.php?${params}`);
  if (!response.ok) throw new Error(`Image credits: ${response.status}`);
  const { query } = await response.json();
  for (const page of Object.values(query.pages)) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const entry = batch.find((item) => item.title.replaceAll("_", " ") === page.title.replace(/^File:/, "").replaceAll("_", " "));
    if (!entry) continue;
    entry.file = info.descriptionurl;
    entry.author = plain(info.extmetadata?.Artist?.value ?? info.extmetadata?.Credit?.value ?? "Xem trang nguồn");
    entry.license = plain(info.extmetadata?.LicenseShortName?.value ?? "Xem giấy phép tại nguồn");
    entry.licenseUrl = info.extmetadata?.LicenseUrl?.value ?? entry.file;
  }
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Completed ${Object.keys(manifest).length} portraits with attribution.`);
