import Link from "next/link";
import { CharacterDirectory } from "./_components/character-directory";
import "~/styles/characters.css";

export const metadata = { title: "Nhân vật lịch sử | History Atlas" };
const CharactersPage = () => <main className="character-page character-directory">
  <nav className="character-breadcrumbs"><Link href="/vietnam">← Tổng quan Việt Nam</Link><Link href="/vietnam/bach-dang-1288">Bạch Đằng 1288 →</Link></nav>
  <p className="character-eyebrow">HISTORY ATLAS · HỒ SƠ LỊCH SỬ</p><h1>Nhân vật</h1><p>Khám phá nhân vật, những thời kỳ và sự kiện gắn với họ.</p>
  <CharacterDirectory />
</main>;
export default CharactersPage;
