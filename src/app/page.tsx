import Image from "next/image";
import Link from "next/link";

import { countriesData } from "~/data";
import { countryPresentation } from "~/data/world";

const HomePage = () => (
  <main className="atlas-page atlas-home">
    <header className="atlas-header"><Link href="/" className="atlas-logo"><span>H</span> HISTORY ATLAS</Link><span className="atlas-header-note">MỖI VÙNG ĐẤT, MỘT CÂU CHUYỆN</span><Link href="/vietnam/bach-dang-1288" className="atlas-header-link">Trải nghiệm Bạch Đằng ↗</Link></header>
    <section className="atlas-intro"><p className="atlas-eyebrow">KHÁM PHÁ DÒNG CHẢY LỊCH SỬ</p><h1>Thế giới rộng lớn.<br /><em>Chuyện xưa sống lại.</em></h1><p>Chọn một vùng đất. Bước qua những thời đại.<br />Khám phá lịch sử bằng hình ảnh và những trận chiến tương tác.</p><span className="atlas-intro-index">BỘ SƯU TẬP <b>01 — 03</b></span></section>
    <section className="atlas-countries" aria-label="Chọn quốc gia">{Object.values(countriesData).map((country) => {
      if (!country) return null;
      const visual = countryPresentation[country.slug];
      return <Link key={country.slug} href={`/${country.slug}`} className={`atlas-country atlas-country-${country.slug}`}><Image src={visual.image} alt={`Minh họa lịch sử ${country.name}`} fill priority sizes="(max-width: 760px) 100vw, 33vw" /><div className="atlas-country-shade" /><div className="atlas-country-top"><span>{visual.numeral} / {visual.english}</span><span>{country.periods.length} GIAI ĐOẠN</span></div><div className="atlas-country-copy"><span>{visual.subtitle}</span><h2>{country.name}</h2><p>{visual.description}</p><div className="atlas-country-cta">Khám phá dòng thời gian <b>↗</b></div></div></Link>;
    })}</section>
    <aside className="atlas-feature"><span className="atlas-feature-mark">1288</span><div><p className="atlas-eyebrow">CÂU CHUYỆN ĐANG MỞ</p><h2>Bạch Đằng — Khi dòng sông viết sử.</h2><p>Bảy chương, một thế trận. Trải nghiệm chiến thắng qua bản đồ và mô hình 3D.</p></div><Link href="/vietnam/bach-dang-1288">Bước vào trận chiến <span>↗</span></Link></aside>
    <footer className="atlas-footer"><span>HISTORY ATLAS</span><p>Lịch sử để khám phá. Câu chuyện để nhớ.</p><span>03 QUỐC GIA · 01 TRẬN CHIẾN ĐANG MỞ</span></footer>
  </main>
);

export default HomePage;
