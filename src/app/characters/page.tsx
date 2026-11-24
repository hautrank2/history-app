import { Suspense } from "react";

import { AtlasHeader } from "~/components/atlas-header";

import { CharacterDirectory } from "./_components/character-directory";
import "~/styles/characters.css";

export const metadata = { title: "Nhân vật lịch sử" };

const CharactersPage = () => (
  <>
    <AtlasHeader active="characters" />
    <main className="character-page character-directory">
      <header className="character-directory-header">
        <p className="character-eyebrow">HISTORY ATLAS · HỒ SƠ LỊCH SỬ</p>
        <h1>Những con người.<br /><em>Những dấu ấn lịch sử.</em></h1>
        <p>
          Khám phá nhân vật qua từng quốc gia, thời kỳ và những sự kiện
          gắn với cuộc đời họ.
        </p>
      </header>
      <Suspense fallback={<p role="status">Đang tải danh sách nhân vật…</p>}>
        <CharacterDirectory />
      </Suspense>
    </main>
  </>
);

export default CharactersPage;
