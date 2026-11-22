import Link from "next/link";

import { Image } from "@/components/ui/image";
import { AtlasHeader } from "~/components/atlas-header";
import { BattleGrid } from "~/components/battle-grid";
import { SectionAnchor } from "~/components/section-anchor";
import { listedCountries } from "~/data";
import { battleDirectoryHref, periodDirectoryHref } from "~/data/battle-links";
import { featuredBattles } from "~/data/battles";
import { featuredPeriods } from "~/data/periods";
import { countryPresentation } from "~/data/world";

import { CharacterLinks } from "./_components/character-links";
import { HomeSectionTracker } from "./_components/home-section-tracker";
import { VietnamBanner } from "./_components/vietnam-banner";

const countryCount = String(listedCountries.length).padStart(2, "0");

const HomePage = () => (
  <main className="atlas-page atlas-home">
    <AtlasHeader active="home" />
    <HomeSectionTracker />
    <section id="intro" className="atlas-intro scroll-mt-6"><p className="atlas-eyebrow"><SectionAnchor id="intro" label="Giới thiệu" />KHÁM PHÁ DÒNG CHẢY LỊCH SỬ</p><h1>Thế giới rộng lớn.<br /><em>Chuyện xưa sống lại.</em></h1><p>Chọn một vùng đất. Bước qua những thời đại.<br />Khám phá lịch sử bằng hình ảnh và những trận chiến tương tác.</p><span className="atlas-intro-index">BỘ SƯU TẬP <b>01 — {countryCount}</b></span></section>
    <section id="countries" className="atlas-countries scroll-mt-6" aria-label="Chọn quốc gia"><div className="atlas-countries-heading col-span-full flex items-center gap-2"><SectionAnchor id="countries" label="Quốc gia" /><h2 className="font-display text-2xl">Khám phá quốc gia</h2></div><VietnamBanner />{listedCountries.map((country) => {
      if (country.slug === "vietnam") return null;
      const visual = countryPresentation[country.slug];
      return <Link key={country.slug} href={`/${country.slug}`} className={`atlas-country h-full atlas-country-${country.slug}`}><Image preview={false} src={visual.image} alt={`Minh họa lịch sử ${country.name}`} fill priority sizes="(max-width: 760px) 100vw, 33vw" /><div className="atlas-country-shade" /><div className="atlas-country-top"><span>{visual.numeral} / {visual.english}</span><span>{country.periods.length} GIAI ĐOẠN</span></div><div className="atlas-country-copy"><span>{visual.subtitle}</span><h2>{country.name}</h2><p>{visual.description}</p><div className="atlas-country-cta">Khám phá dòng thời gian <b>↗</b></div></div></Link>;
    })}</section>
    <section id="periods" className="atlas-periods atlas-featured-periods scroll-mt-6" aria-labelledby="atlas-periods-heading">
      <div className="mb-5 space-y-2">
        <p className="text-xs font-semibold tracking-widest text-primary">NHỮNG CHƯƠNG SỬ LỚN</p>
        <div className="flex flex-wrap items-baseline justify-between gap-3"><h2 id="atlas-periods-heading" className="font-display text-3xl sm:text-4xl"><SectionAnchor id="periods" label="Thời kỳ" />Khám phá thời kỳ</h2><Link href={periodDirectoryHref} className="text-sm text-primary hover:underline">Xem tất cả giai đoạn ↗</Link></div>
        <p className="text-sm text-muted-foreground">Theo dõi một thời kỳ qua nhiều biến cố, nhân vật và trận chiến.</p>
      </div>
      <BattleGrid entries={featuredPeriods} />
    </section>
    <section id="battles" className="atlas-periods atlas-popular-battles scroll-mt-6" aria-labelledby="atlas-battles-heading">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="atlas-battles-heading" className="font-display text-3xl sm:text-4xl"><SectionAnchor id="battles" label="Trận đánh" />Các trận đánh phổ biến</h2>
        <Link href={battleDirectoryHref} className="text-sm text-primary hover:underline">
          Xem tất cả trận đánh ↗
        </Link>
      </div>
      <BattleGrid entries={featuredBattles} />
    </section>
    <CharacterLinks />
    <footer className="atlas-footer"><span>HISTORY ATLAS</span><p>Lịch sử để khám phá. Câu chuyện để nhớ.</p><span>{countryCount} QUỐC GIA</span></footer>
  </main>
);

export default HomePage;
