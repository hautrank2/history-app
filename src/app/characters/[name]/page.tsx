import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BackButton } from "~/components/back-button";
import { CharacterAvatar } from "~/components/character-avatar";
import { threeKingdomsHref } from "~/data/battle-links";
import { battleEntries } from "~/data/battles";
import { getCharacterCountry } from "~/data/character-countries";
import { characters, findCharacter } from "~/data/characters";
import { chinaOverview } from "~/data/china-overview";
import { europeOverviews } from "~/data/europe-overview";
import { historicalEvents } from "~/data/events";
import { lifeScenes } from "~/data/ho-chi-minh";
import { periodForScene } from "~/data/periods";
import { portraitCaption, portraitFor } from "~/data/portraits";
import { people as kingdomPeople, threeKingdomsScenes } from "~/data/three-kingdoms";
import { vietnamData } from "~/data/vietnam";
import { vietnamOverview } from "~/data/vietnam-overview";

import { CharacterVisit } from "../_components/character-visit";
import { HoChiMinhLife } from "../_components/ho-chi-minh-life";
import "~/styles/characters.css";

type Props = { params: Promise<{ name: string }> };

// Mỗi cảnh tổng quan gắn với route quốc gia chứa nó.
const overviewScenes = [
  ...vietnamOverview.map((scene) => ({ scene, country: "vietnam" })),
  ...chinaOverview.map((scene) => ({ scene, country: "china" })),
  ...Object.values(europeOverviews).flatMap((overview) =>
    overview.scenes.map((scene) => ({ scene, country: overview.id }))),
];
const overviewCountries = new Set(overviewScenes.map((item) => item.country));

export const generateStaticParams = () => characters.map((person) => ({
  name: person.id,
}));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => ({
  title: findCharacter((await params).name)?.name ?? "Nhân vật",
});

const CharacterPage = async ({ params }: Props) => {
  const person = findCharacter((await params).name);
  if (!person) notFound();
  if (person.id === "ho-chi-minh") {
    return (
      <div className="character-life-page flex min-h-svh flex-col">
        <CharacterVisit id={person.id} />
        <HoChiMinhLife />
      </div>
    );
  }

  const lifeConnections = lifeScenes.filter((scene) =>
    scene.people.some((item) => item.characterId === person.id));
  const kingdomConnections = threeKingdomsScenes.flatMap((scene) => {
    const member = scene.cast.find((item) =>
      kingdomPeople[item.person].characterId === person.id);
    return member ? [{ scene, member }] : [];
  });
  const portrait = portraitFor(person.wiki);
  const scenes = overviewScenes.filter(({ scene }) =>
    scene.people.some((item) => item.id === person.id)
    || scene.places.some((place) => place.leader?.id === person.id));
  const homeCountry = overviewCountries.has(person.countryId)
    ? person.countryId
    : "vietnam";
  const events = historicalEvents.filter((event) =>
    event.leaderIds.includes(person.id));
  const battleChapters = vietnamData.periods
    .find((period) => period.slug === "bach-dang-1288")?.story?.chapters
    .filter((chapter) => chapter.characters?.some((character) =>
      character.id === person.id)) ?? [];
  const index = characters.indexOf(person);

  return (
    <>
      <main className="character-page character-profile" data-character-id={person.id}>
        <CharacterVisit id={person.id} />
        <nav className="character-breadcrumbs" aria-label="Điều hướng nhân vật">
          <BackButton placement="header" fallbackHref="/characters" />
          <Link
            className="character-back-link inline-flex items-center gap-2"
            href="/characters"
          >
            Tất cả nhân vật
          </Link>
          <Link href={`/${homeCountry}`}>
            Tổng quan {getCharacterCountry(homeCountry).name}
          </Link>
        </nav>
        <header className="character-hero">
          {portrait ? (
            <figure className="character-portrait">
              <CharacterAvatar
                name={person.name}
                portrait={portrait}
                width={360}
                height={440}
              />
              <figcaption>
                {portraitCaption(portrait)} · {" "}
                <a href={portrait.file} target="_blank" rel="noreferrer">
                  Nguồn ảnh ↗
                </a>
              </figcaption>
            </figure>
          ) : null}
          <div className="character-hero-content">
            <p className="character-eyebrow">NHÂN VẬT LỊCH SỬ</p>
            <h1>{person.name}</h1>
            <p className="character-role">{person.role}</p>
            <dl className="character-facts">
              <dt>Niên đại</dt><dd>{person.lifespan}</dd>
              {person.aliases.length ? (
                <>
                  <dt>Tên gọi khác</dt><dd>{person.aliases.join(" · ")}</dd>
                </>
              ) : null}
            </dl>
            <p className="character-biography">{person.biography}</p>
          </div>
        </header>
        <section className="character-related-scenes">
          <h2>Dấu ấn trong lịch sử</h2>
          {scenes.length ? scenes.map(({ scene, country }) => (
            <article className="character-scene" key={`${country}-${scene.id}`}>
              <Link href={battleEntries.find((battle) =>
                battle.countryId === country && battle.sceneId === scene.id
              )?.href ?? periodForScene(country, scene.id)?.href
                ?? `/${country}#${scene.id}`}>
                <small>{scene.years} · {scene.era}</small>
                <h3>{scene.title} →</h3>
              </Link>
              <p>{scene.summary}</p>
              <p>{scene.people.find((item) => item.id === person.id)?.role}</p>
              {scene.id === "tran-bach-dang" ? (
                <Link className="character-battle-link" href="/battle/tran-bach-dang-1288">
                  Vào sa bàn Bạch Đằng 1288 →
                </Link>
              ) : null}
            </article>
          )) : <p>Chưa có cảnh liên quan.</p>}
        </section>
        {kingdomConnections.length > 0 && (
          <section className="character-kingdom-connections" aria-labelledby="character-kingdom-heading">
            <h2 id="character-kingdom-heading">Trong thời kỳ Tam Quốc</h2>
            {kingdomConnections.map(({ scene, member }) => (
              <article className="character-scene" key={scene.id} data-event-id={scene.id}>
                <Link href={battleEntries.find((battle) =>
                  battle.id === scene.id)?.href ?? `${threeKingdomsHref}#${scene.id}`}>
                  <small>{scene.date} · {scene.chapter}</small>
                  <h3>{scene.title} →</h3>
                </Link>
                <p>{member.action}</p>
              </article>
            ))}
          </section>
        )}
        {battleChapters.length ? (
          <section className="character-battle-chapters">
            <h2>Chiến dịch Bạch Đằng 1288</h2>
            <Link href="/battle/tran-bach-dang-1288">Mở sa bàn chiến dịch →</Link>
            {battleChapters.map((chapter) => (
              <article className="character-scene" key={chapter.title}>
                <h3>{chapter.title}</h3>
                <small>{chapter.date}</small>
                <p>{chapter.text}</p>
              </article>
            ))}
          </section>
        ) : null}
        {events.length ? (
          <section className="character-events">
            <h2>Các cuộc khởi nghĩa</h2>
            {events.map((event) => (
              <article className="character-scene" key={event.id}>
                <Link href={`/vietnam/${event.id}`}><h3>{event.title} →</h3></Link>
                <p>{event.years} · {event.location}</p>
                <p>Kết quả: {event.outcome}</p>
              </article>
            ))}
          </section>
        ) : null}
        {lifeConnections.length ? (
          <section className="character-life-connections">
            <h2>Trong hành trình Hồ Chí Minh</h2>
            {lifeConnections.map((scene) => (
              <article className="character-scene" key={scene.id}>
                <Link href={`/characters/ho-chi-minh#${scene.id}`}>
                  <small>{scene.date} · {scene.location.name}</small>
                  <h3>{scene.title} →</h3>
                </Link>
                <p>{scene.people.find((item) =>
                  item.characterId === person.id)?.connection}</p>
              </article>
            ))}
          </section>
        ) : null}
        <section className="character-sources">
          <h2>Tư liệu</h2>
          {person.sources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              {source.title} ↗
            </a>
          ))}
        </section>
        <nav className="character-pagination" aria-label="Nhân vật trước và sau">
          {characters[index - 1] ? (
            <Link href={`/characters/${characters[index - 1].id}`}>
              ← {characters[index - 1].name}
            </Link>
          ) : <span />}
          {characters[index + 1] ? (
            <Link href={`/characters/${characters[index + 1].id}`}>
              {characters[index + 1].name} →
            </Link>
          ) : null}
        </nav>
      </main>
    </>
  );
};

export default CharacterPage;
