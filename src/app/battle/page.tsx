import type { Metadata } from "next";
import Link from "next/link";

import { AtlasHeader } from "~/components/atlas-header";
import { BattleGrid } from "~/components/battle-grid";
import { threeKingdomsHref } from "~/data/battle-links";
import { battleEntries } from "~/data/battles";

export const metadata: Metadata = {
  title: "Danh sách trận đánh",
  description: "Khám phá bảy trận đánh Việt Nam từ Bạch Đằng 938 tới Điện Biên Phủ 1954 và các trận thời Tam Quốc qua bản đồ tương tác.",
};

const BattleDirectoryPage = () => (
  <main className="atlas-page atlas-battle-directory">
    <AtlasHeader active="battle" />
    <div className="atlas-periods space-y-10">
      <div className="space-y-3">
        <h1 className="font-display text-4xl sm:text-5xl">Danh sách trận đánh</h1>
        <p className="text-sm text-muted-foreground">Mỗi trận đánh là một cuộc giao chiến cụ thể. Chọn trận để xem diễn biến trên bản đồ.</p>
      </div>
      <section id="battle-vietnam" className="space-y-4 scroll-mt-6" aria-labelledby="battle-vietnam-heading">
        <h2 id="battle-vietnam-heading" className="font-display text-2xl">Việt Nam</h2>
        <BattleGrid entries={battleEntries.filter((battle) => battle.country === "Việt Nam")} />
      </section>
      <section id="battle-three-kingdoms" className="space-y-4 scroll-mt-6" aria-labelledby="battle-three-kingdoms-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="battle-three-kingdoms-heading" className="font-display text-2xl">Các trận đánh ở Trung Quốc</h2>
          <Link href={threeKingdomsHref} className="text-sm text-primary hover:underline">
            Khám phá thời kỳ Tam Quốc ↗
          </Link>
        </div>
        <BattleGrid entries={battleEntries.filter((battle) => battle.country === "Trung Quốc")} />
      </section>
    </div>
  </main>
);

export default BattleDirectoryPage;
