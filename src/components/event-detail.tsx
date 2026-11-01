import Link from "next/link";
import { characterHref, getCharacter } from "~/data/characters";
import type { HistoricalEventModel } from "~/data/events";
import "~/styles/characters.css";

export const EventDetail = ({ event }: { event: HistoricalEventModel }) => <main className="character-page event-detail" data-event-id={event.id}>
  <nav className="character-breadcrumbs"><Link href={`/vietnam/overview#${event.sceneIds[0]}`}>← Về bản đồ thời kỳ</Link><Link href="/characters">Nhân vật</Link></nav>
  <p className="character-eyebrow">KHỞI NGHĨA · {event.years}</p><h1>{event.title}</h1>
  <dl className="character-facts"><dt>Địa điểm</dt><dd>{event.location}</dd><dt>Định vị gần đúng</dt><dd>{event.at[1]}°B, {event.at[0]}°Đ</dd><dt>Lãnh đạo</dt><dd>{event.leaderIds.map((id) => <Link className="event-leader" style={{ marginRight: 20 }} key={id} href={characterHref(id)}>{getCharacter(id).name} →</Link>)}</dd></dl>
  <section className="event-narrative"><h2>Diễn biến</h2><p>{event.summary}</p><h2>Kết quả</h2><p>{event.outcome}</p></section>
  <nav className="character-breadcrumbs" aria-label="Xem trên bản đồ">{event.sceneIds.map((id) => <Link key={id} href={`/vietnam/overview#${id}`}>Xem thời kỳ trên bản đồ →</Link>)}<Link href="/vietnam/bach-dang-1288">Khám phá Bạch Đằng 1288 →</Link></nav>
  <section className="character-sources"><h2>Tư liệu</h2>{event.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}</section>
</main>;
