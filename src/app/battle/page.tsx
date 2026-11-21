import type { Metadata } from "next";
import Link from "next/link";

import { BattleGrid } from "~/components/battle-grid";
import { threeKingdomsHref } from "~/data/battle-links";
import { battleEntries } from "~/data/battles";

export const metadata: Metadata = {
  title: "Danh sách trận đánh",
  description: "Khám phá Bạch Đằng 1288, Điện Biên Phủ 1954 và các trận đánh thời Tam Quốc qua bản đồ tương tác.",
};

const BattleDirectoryPage = () => (
  <main className="atlas-page atlas-battle-directory">
    <header className="atlas-header">
      <Link href="/" className="atlas-logo"><span>H</span> HISTORY ATLAS</Link>
      <nav><Link href="/" className="atlas-header-link">← Trang chủ</Link><Link href="/period" className="atlas-header-link">Các giai đoạn ↗</Link></nav>
    </header>
    <div className="atlas-periods space-y-10">
      <div className="space-y-3">
        <h1 className="font-display text-4xl sm:text-5xl">Danh sách trận đánh</h1>
        <p className="text-sm text-muted-foreground">Mỗi trận đánh là một cuộc giao chiến cụ thể. Chọn trận để xem diễn biến trên bản đồ.</p>
      </div>
      <section className="space-y-4" aria-labelledby="battle-vietnam">
        <h2 id="battle-vietnam" className="font-display text-2xl">Việt Nam</h2>
        <BattleGrid entries={battleEntries.filter((battle) => battle.country === "Việt Nam")} />
      </section>
      <section className="space-y-4" aria-labelledby="battle-three-kingdoms">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="battle-three-kingdoms" className="font-display text-2xl">Các trận đánh ở Trung Quốc</h2>
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
