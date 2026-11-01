import Link from "next/link";
import { characters } from "~/data/characters";
import "~/styles/characters.css";

export const metadata = { title: "Nhân vật lịch sử | History Atlas" };
const CharactersPage = () => <main className="character-page character-directory">
  <nav className="character-breadcrumbs"><Link href="/vietnam/overview">← Tổng quan Việt Nam</Link><Link href="/vietnam/bach-dang-1288">Bạch Đằng 1288 →</Link></nav>
  <p className="character-eyebrow">HISTORY ATLAS · HỒ SƠ LỊCH SỬ</p><h1>Nhân vật</h1><p>Khám phá nhân vật, những thời kỳ và sự kiện gắn với họ.</p>
  <section className="character-grid" aria-label="Danh sách nhân vật">{characters.map((person) => <Link className="character-directory-card" data-character-id={person.id} href={`/characters/${person.id}`} key={person.id}><h2>{person.name}</h2><p>{person.role}</p><span>Xem hồ sơ →</span></Link>)}</section>
</main>;
export default CharactersPage;
