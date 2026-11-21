import type { Metadata } from "next";
import Link from "next/link";
import { BattleGrid } from "~/components/battle-grid";
import { CountryFlag } from "~/components/country-flag";
import { countriesData } from "~/data";
import { periodEntries } from "~/data/periods";

export const metadata: Metadata = { title: "Các giai đoạn lịch sử", description: "Khám phá các giai đoạn lịch sử theo quốc gia, từ loạn 12 sứ quân đến thời kỳ Tam Quốc." };
type Props = { searchParams: Promise<{ country?: string }> };
export default async function PeriodDirectory({ searchParams }: Props) {
  const { country } = await searchParams;
  const selected = countriesData[country ?? ""];
  const groups = Object.values(countriesData).filter((item) => item && (!selected || selected.slug === item.slug));
  return <main className="atlas-page">
    <header className="atlas-header"><Link href="/" className="atlas-logo"><span>H</span> HISTORY ATLAS</Link><nav><Link href="/">Trang chủ</Link><Link href="/battle">Trận đánh ↗</Link></nav></header>
    <div className="atlas-periods space-y-10">
      <div className="space-y-3"><p className="atlas-eyebrow">QUỐC GIA → GIAI ĐOẠN → TRẬN ĐÁNH</p><h1 className="font-display text-4xl sm:text-5xl">Các giai đoạn lịch sử</h1><p className="text-sm text-muted-foreground">Chọn một giai đoạn để khám phá bản đồ, nhân vật và những trận đánh liên quan.</p></div>
      <nav aria-label="Lọc theo quốc gia" className="flex flex-wrap gap-4 text-sm text-primary"><Link href="/period" aria-current={!selected ? "page" : undefined}>Tất cả</Link>{Object.values(countriesData).map((item) => item ? <Link key={item.slug} href={`/period?country=${item.slug}`} aria-current={selected?.slug === item.slug ? "page" : undefined}>{item.name}</Link> : null)}</nav>
      {groups.map((item) => item ? <section key={item.slug} className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-3 font-display text-2xl"><CountryFlag countryId={item.slug} />{item.name}</h2><Link href={`/${item.slug}`} className="text-sm text-primary">Lịch sử {item.name} ↗</Link></div><BattleGrid entries={periodEntries.filter((period) => period.countryId === item.slug)} /></section> : null)}
    </div>
  </main>;
}
