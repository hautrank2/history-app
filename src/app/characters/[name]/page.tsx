import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Image } from "@/components/ui/image";
import { characters, findCharacter } from "~/data/characters";
import { historicalEvents } from "~/data/events";
import { portraitCaption, portraitFor } from "~/data/portraits";
import { vietnamOverview } from "~/data/vietnam-overview";
import { vietnamData } from "~/data/vietnam";
import { lifeScenes } from "~/data/ho-chi-minh";
import { CharacterVisit } from "../_components/character-visit";
import { HoChiMinhLife } from "../_components/ho-chi-minh-life";
import "~/styles/characters.css";

type Props = { params: Promise<{ name: string }> };
export const generateStaticParams = () => characters.map((person) => ({ name: person.id }));
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => ({ title: findCharacter((await params).name)?.name ?? "Nhân vật" });
const CharacterPage = async ({ params }: Props) => {
  const person = findCharacter((await params).name);
  if (!person) notFound();
  if (person.id === "ho-chi-minh") return <><CharacterVisit id={person.id} /><HoChiMinhLife /></>;
  const lifeConnections = lifeScenes.filter((scene) => scene.people.some((item) => item.characterId === person.id));
  const portrait = portraitFor(person.wiki);
  const scenes = vietnamOverview.filter((scene) => scene.people.some((item) => item.id === person.id) || scene.places.some((place) => place.leader?.id === person.id));
  const events = historicalEvents.filter((event) => event.leaderIds.includes(person.id));
  const battleChapters = vietnamData.periods.find((period) => period.slug === "bach-dang-1288")?.story?.chapters.filter((chapter) => chapter.characters?.some((character) => character.id === person.id)) ?? [];
  const index = characters.indexOf(person);
  return <main className="character-page character-profile" data-character-id={person.id}>
    <CharacterVisit id={person.id} />
    <nav className="character-breadcrumbs" aria-label="Điều hướng nhân vật"><Link href="/characters">← Tất cả nhân vật</Link><Link href="/vietnam">Tổng quan Việt Nam</Link></nav>
    <header className="character-hero">{portrait ? <figure className="character-portrait"><Image src={portrait.src} alt={portrait.generated ? `Minh họa AI ${person.name}, không phải chân dung xác thực` : `Hình ảnh tái hiện ${person.name}`} width={360} height={440} style={{ objectPosition: portrait.position }} /><figcaption>{portraitCaption(portrait)} · <a href={portrait.file} target="_blank" rel="noreferrer">Nguồn ảnh ↗</a></figcaption></figure> : null}<div><p className="character-eyebrow">NHÂN VẬT LỊCH SỬ</p><h1>{person.name}</h1><p className="character-role">{person.role}</p><dl className="character-facts"><dt>Niên đại</dt><dd>{person.lifespan}</dd>{person.aliases.length ? <><dt>Tên gọi khác</dt><dd>{person.aliases.join(" · ")}</dd></> : null}</dl><p className="character-biography">{person.biography}</p></div></header>
    <section className="character-related-scenes"><h2>Dấu ấn trong lịch sử</h2>{scenes.length ? scenes.map((scene) => <article className="character-scene" key={scene.id}><Link href={`/vietnam#${scene.id}`}><small>{scene.years} · {scene.era}</small><h3>{scene.title} →</h3></Link><p>{scene.summary}</p><p>{scene.people.find((item) => item.id === person.id)?.role}</p>{scene.id === "tran-bach-dang" ? <Link className="character-battle-link" href="/vietnam/bach-dang-1288">Vào sa bàn Bạch Đằng 1288 →</Link> : null}</article>) : <p>Chưa có cảnh liên quan.</p>}</section>
    {battleChapters.length ? <section className="character-battle-chapters"><h2>Chiến dịch Bạch Đằng 1288</h2><Link href="/vietnam/bach-dang-1288">Mở sa bàn chiến dịch →</Link>{battleChapters.map((chapter) => <article className="character-scene" key={chapter.title}><h3>{chapter.title}</h3><small>{chapter.date}</small><p>{chapter.text}</p></article>)}</section> : null}
    {events.length ? <section className="character-events"><h2>Các cuộc khởi nghĩa</h2>{events.map((event) => <article className="character-scene" key={event.id}><Link href={`/vietnam/${event.id}`}><h3>{event.title} →</h3></Link><p>{event.years} · {event.location}</p><p>Kết quả: {event.outcome}</p></article>)}</section> : null}
    {lifeConnections.length ? <section className="character-life-connections"><h2>Trong hành trình Hồ Chí Minh</h2>{lifeConnections.map((scene) => <article className="character-scene" key={scene.id}><Link href={`/characters/ho-chi-minh#${scene.id}`}><small>{scene.date} · {scene.location.name}</small><h3>{scene.title} →</h3></Link><p>{scene.people.find((item) => item.characterId === person.id)?.connection}</p></article>)}</section> : null}
    <section className="character-sources"><h2>Tư liệu</h2>{person.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}</section>
    <nav className="character-pagination" aria-label="Nhân vật trước và sau">{characters[index - 1] ? <Link href={`/characters/${characters[index - 1].id}`}>← {characters[index - 1].name}</Link> : <span />}{characters[index + 1] ? <Link href={`/characters/${characters[index + 1].id}`}>{characters[index + 1].name} →</Link> : null}</nav>
  </main>;
};
export default CharacterPage;
