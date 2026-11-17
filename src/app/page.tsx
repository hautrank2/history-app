import { Image } from "@/components/ui/image";
import Link from "next/link";
import { BattleGrid } from "~/components/battle-grid";
import { HomeLink } from "~/components/home-link";

import { listedCountries } from "~/data";
import { battleDirectoryHref } from "~/data/battle-links";
import { featuredBattles } from "~/data/battles";
import { countryPresentation } from "~/data/world";

import { VietnamBanner } from "./_components/vietnam-banner";
import { CharacterLinks } from "./_components/character-links";

const countryCount = String(listedCountries.length).padStart(2, "0");

const HomePage = () => (
  <main className="atlas-page atlas-home">
    <header className="atlas-header">
      <Link href="/" className="atlas-logo"><span>H</span> HISTORY ATLAS</Link>
      <HomeLink />
      <Link href={battleDirectoryHref} className="atlas-header-link">Trận đánh ↗</Link>
    </header>
    <section className="atlas-intro"><p className="atlas-eyebrow">KHÁM PHÁ DÒNG CHẢY LỊCH SỬ</p><h1>Thế giới rộng lớn.<br /><em>Chuyện xưa sống lại.</em></h1><p>Chọn một vùng đất. Bước qua những thời đại.<br />Khám phá lịch sử bằng hình ảnh và những trận chiến tương tác.</p><span className="atlas-intro-index">BỘ SƯU TẬP <b>01 — {countryCount}</b></span></section>
    <section className="atlas-countries" aria-label="Chọn quốc gia"><VietnamBanner />{listedCountries.map((country) => {
      if (country.slug === "vietnam") return null;
      const visual = countryPresentation[country.slug];
      return <Link key={country.slug} href={`/${country.slug}`} className={`atlas-country atlas-country-${country.slug}`}><Image preview={false} src={visual.image} alt={`Minh họa lịch sử ${country.name}`} fill priority sizes="(max-width: 760px) 100vw, 33vw" /><div className="atlas-country-shade" /><div className="atlas-country-top"><span>{visual.numeral} / {visual.english}</span><span>{country.periods.length} GIAI ĐOẠN</span></div><div className="atlas-country-copy"><span>{visual.subtitle}</span><h2>{country.name}</h2><p>{visual.description}</p><div className="atlas-country-cta">Khám phá dòng thời gian <b>↗</b></div></div></Link>;
    })}</section>
    <section className="atlas-periods atlas-popular-battles" aria-labelledby="atlas-battles-heading">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="atlas-battles-heading" className="font-display text-3xl sm:text-4xl">Các trận đánh phổ biến</h2>
        <Link href={battleDirectoryHref} className="text-sm text-primary hover:underline">
          Tất cả trận đánh ↗
        </Link>
      </div>
      <BattleGrid entries={featuredBattles} />
    </section>
    <CharacterLinks />
    <footer className="atlas-footer"><span>HISTORY ATLAS</span><p>Lịch sử để khám phá. Câu chuyện để nhớ.</p><span>{countryCount} QUỐC GIA</span></footer>
  </main>
);

export default HomePage;
