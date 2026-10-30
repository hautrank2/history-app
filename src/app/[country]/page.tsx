import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { countriesData } from "~/data";
import { countryPresentation } from "~/data/world";

import "./overview-entry.css";

type CountryPageProps = { params: Promise<{ country: string }> };
export const generateStaticParams = () => Object.keys(countriesData).map((country) => ({ country }));
export const generateMetadata = async ({ params }: CountryPageProps): Promise<Metadata> => ({ title: countriesData[(await params).country]?.name });

const CountryPage = async ({ params }: CountryPageProps) => {
  const country = countriesData[(await params).country];
  if (!country) notFound();
  const visual = countryPresentation[country.slug];
  const featured = country.periods.find((period) => period.story);
  return <main className="atlas-page atlas-period-page">
    <header className="atlas-header"><Link href="/" className="atlas-logo"><span>H</span> HISTORY ATLAS</Link><Link href="/" className="atlas-header-link">← Chọn quốc gia</Link><nav aria-label="Đổi quốc gia">{Object.values(countriesData).map((item) => item ? <Link key={item.slug} aria-current={item.slug === country.slug ? "page" : undefined} href={`/${item.slug}`}>{item.name}</Link> : null)}</nav></header>
    <section className={`atlas-country-hero atlas-country-${country.slug}`}><Image src={visual.image} alt={`Minh họa ${country.name} qua các thời đại`} fill priority sizes="100vw" /><div className="atlas-period-hero-shade" /><div className="atlas-country-hero-copy"><p className="atlas-eyebrow">{visual.english} / BIÊN NIÊN SỬ</p><h1>{country.name}<em>{visual.subtitle}.</em></h1><p>{visual.description}</p>{country.slug === "vietnam" ? <Link href="/vietnam/overview" className="atlas-overview-cta"><span><strong>Xem lịch sử các triều đại</strong><small>Từ Hùng Vương đến hiện đại · Bản đồ 2D tương tác</small></span><b aria-hidden="true">↗</b></Link> : null}<a href="#periods" className="atlas-outline-link">Khám phá các thời đại ↓</a></div><span className="atlas-hero-number">{visual.numeral}</span></section>
    <section id="periods" className="atlas-periods"><div className="atlas-section-heading"><div><p className="atlas-eyebrow">CHỌN MỘT CHƯƠNG LỊCH SỬ</p><h2>Dọc theo <em>dòng thời gian.</em></h2></div><p>{country.periods.length} giai đoạn <span> / </span> {featured ? "1 trải nghiệm đang mở" : "Các trải nghiệm đang được chuẩn bị"}</p></div>
      {featured ? <Link href={`/${country.slug}/${featured.slug}`} className="atlas-featured-period"><div className="atlas-featured-image"><Image src={visual.image} alt="Trần Hưng Đạo và trận địa Bạch Đằng" fill sizes="(max-width: 760px) 100vw, 50vw" /></div><div className="atlas-featured-copy"><span className="atlas-available"><i /> CÓ THỂ KHÁM PHÁ</span><span className="atlas-featured-year">1288</span><h3>Bạch Đằng<em>Trí tuệ trên dòng nước.</em></h3><p>{featured.blurb}</p><span className="atlas-featured-action">Bản đồ 3D · 7 chương <b>Vào trận ↗</b></span></div></Link> : <div className="atlas-coming-banner"><span>ĐANG BIÊN SOẠN</span><p>Dòng thời gian đã sẵn sàng để khám phá. Các câu chuyện tương tác của {country.name} sẽ được bổ sung sau.</p></div>}
      <ol className="atlas-period-grid">{country.periods.map((period, index) => <li key={period.slug} className={period.story ? "is-open" : ""}><span className="atlas-period-number">{String(index + 1).padStart(2, "0")}</span><div><p className="atlas-period-years">{period.years}</p><h3>{period.title}</h3><p className="atlas-period-description">{period.blurb}</p>{period.story ? <Link href={`/${country.slug}/${period.slug}`} className="atlas-period-status">Khám phá trận chiến ↗</Link> : <span className="atlas-period-status">Đang chuẩn bị <span>◷</span></span>}</div></li>)}</ol>
    </section><footer className="atlas-footer"><Link href="/">← Tất cả quốc gia</Link><p>Những trang sử tiếp theo đang được viết.</p><span>{visual.english} / HISTORY ATLAS</span></footer>
  </main>;
};

export default CountryPage;
