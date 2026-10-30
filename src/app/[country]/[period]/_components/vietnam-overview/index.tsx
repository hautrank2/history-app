"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TooltipProvider } from "~/components/ui/tooltip";
import { vietnamOverview, wikiUrl } from "~/data/vietnam-overview";
import type { OverviewPersonModel } from "~/data/vietnam-overview";
import { geographyArticles, overviewDetails } from "~/data/vietnam-overview-details";
import type { OverviewArticleModel } from "~/data/vietnam-overview-details";

import { CountryStats } from "./country-stats";
import { HistoryMap } from "./history-map";
import { useVietnamOverview } from "./hook";
import type { OverviewTab } from "./hook";
import { portraitCaption, portraitFor } from "./portraits";
import "./overview.css";

const eras = [...new Set(vietnamOverview.map((scene) => scene.era))];
const eraYears: Record<string, string> = { "Nhà Lý": "1009–1225", "Nhà Trần": "1225–1400", "Tây Sơn": "1771–1802", "Nhà Nguyễn": "1802–1945" };
const tabs: { id: OverviewTab; label: string; icon: string }[] = [{ id: "story", label: "Diễn biến", icon: "≋" }, { id: "culture", label: "Văn hóa", icon: "◇" }, { id: "geography", label: "Địa lý", icon: "⌖" }, { id: "people", label: "Nhân vật", icon: "♙" }, { id: "sources", label: "Tư liệu", icon: "↗" }];
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("đ", "d").replaceAll("Đ", "D").toLowerCase();
const textPages = (text: string, budget: number) => {
  const pages: string[] = [];
  // Split at words: preserve decimals/dates and fill pages without leaving a short sentence alone.
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const last = pages.length - 1;
    if (last < 0 || pages[last].length + word.length + 1 > budget) pages.push(word);
    else pages[last] += ` ${word}`;
  }
  return pages;
};
const articlePages = (sections: OverviewArticleModel[], budget: number) => sections.flatMap((section, topic) => textPages(section.text, budget).map((text) => ({ ...section, text, topic })));

type PersonCardProps = { person: OverviewPersonModel };
const PersonCard = ({ person }: PersonCardProps) => {
  const portrait = portraitFor(person.wiki);
  const article = portrait?.article ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(person.wiki.replaceAll(" ", "_"))}`;
  return <article className={`vo-person ${person.side === "opponent" ? "is-opponent" : ""}`}>
    <a className="vo-person-image" href={portrait?.file ?? article} target="_blank" rel="noreferrer" aria-label={`Nguồn hình ảnh ${person.name}`}>
      {portrait ? <><Image src={portrait.src} alt={portrait.generated ? `Minh họa AI tái hiện ${person.name}, không phải chân dung xác thực` : `Hình ảnh ${person.name}; có thể là tranh hoặc tượng tái hiện về sau`} fill sizes="130px" style={{ objectPosition: portrait.position }} />{portrait.generated ? <small className="vo-illustration-badge">MINH HỌA AI</small> : null}</> : <span className="vo-person-missing">◇<small>Chưa có ảnh tư liệu</small></span>}
    </a>
    <div className="vo-person-copy"><span className="vo-person-side">{person.side === "opponent" ? "PHÍA ĐỐI PHƯƠNG" : "NHÂN VẬT LỊCH SỬ"}</span><a className="vo-person-name" href={article} target="_blank" rel="noreferrer">{person.name} ↗</a><p>{person.role}</p></div>
  </article>;
};

export const VietnamOverview = () => {
  const { index, scene, selectedPlace, setSelectedPlace, playing, setPlaying, playbackMs, setPlaybackMs, tab, changeTab, page, setPage, query, setQuery, contentVisible, setContentVisible, timelineVisible, setTimelineVisible, placesVisible, setPlacesVisible, textBudget, rail, body, go } = useVietnamOverview();
  if (!scene) return null;
  const eraIndex = eras.indexOf(scene.era);
  const eraScenes = vietnamOverview.filter((item) => item.era === scene.era);
  const filteredEras = eras.filter((era) => normalize(vietnamOverview.filter((item) => item.era === era).map((item) => `${item.era} ${item.title} ${item.people.map((person) => person.name).join(" ")}`).join(" ")).includes(normalize(query)));
  const storyPages = [
    ...textPages(scene.summary, textBudget).map((text) => ({ label: "DÒNG CHẢY LỊCH SỬ", title: "", text, conflict: false })),
    ...(scene.conflict ? [{ label: "CHIẾN TRANH & QUYỀN LỰC", title: scene.conflict.title, text: "", conflict: true }, ...textPages(scene.conflict.text, textBudget).map((text) => ({ label: "CHIẾN TRANH & QUYỀN LỰC", title: "", text, conflict: true }))] : []),
  ];
  const cultureSections: OverviewArticleModel[] = [{ ...scene.culture, sources: scene.sources.map((title) => ({ title, url: wikiUrl(title) })) }, ...(overviewDetails[scene.id]?.culture ?? [])];
  const geographySections = geographyArticles(scene);
  const culturePages = articlePages(cultureSections, textBudget);
  const geographyPages = articlePages(geographySections, textBudget);
  const sections = tab === "culture" ? cultureSections : geographySections;
  const articles = tab === "culture" ? culturePages : geographyPages;
  const mapNotes = `${scene.extent} Lược đồ gần đúng trên nền địa lý hiện đại, không dùng để đo diện tích hay xác định chủ quyền. Chưa thể hiện đầy đủ các đảo và quần đảo. Tóm lược biên soạn lại từ các nguồn được liên kết. Dân số có mốc năm và phạm vi riêng; số hồi dựng không phải tổng điều tra. Ảnh có nhãn AI là tái hiện nghệ thuật, không phải chân dung xác thực; ảnh tư liệu giữ ghi công gốc.`;
  const notesPages = textPages(mapNotes, Math.max(90, textBudget - 30));
  const sources = [...new Map([...cultureSections, ...geographySections].flatMap((section) => section.sources).map((source) => [source.url, source])).values()];
  const sourcePageCount = sources.length;
  const pageCount = tab === "story" ? storyPages.length : tab === "culture" ? culturePages.length : tab === "geography" ? geographyPages.length : tab === "people" ? scene.people.length : sourcePageCount + notesPages.length;
  const currentPage = Math.min(page, pageCount - 1);
  const story = storyPages[currentPage];
  const readingArticle = articles[currentPage];
  const personPortrait = tab === "people" && scene.people[currentPage] ? portraitFor(scene.people[currentPage].wiki) : undefined;
  const allHidden = !contentVisible && !timelineVisible && !placesVisible;

  return <TooltipProvider delayDuration={250}><main className="atlas-page vo-page" data-content={contentVisible} data-timeline={timelineVisible} data-clean={allHidden}>
    <h1 className="vo-sr-only">Lịch sử Việt Nam — từ Hùng Vương đến hiện đại</h1>
    <HistoryMap key={scene.id} scene={scene} selectedPlace={selectedPlace} contentVisible={contentVisible} timelineVisible={timelineVisible} placesVisible={placesVisible} onSelectPlace={(next) => { setSelectedPlace(next); setPlacesVisible(true); setPlaying(false); }} onHidePlaces={() => setPlacesVisible(false)} />
    <CountryStats scene={scene} />
    <Link className="vo-back vo-glass" href="/vietnam" aria-label="Về trang Việt Nam">← <span>Việt Nam</span></Link>
    <div className="vo-visibility" aria-label="Ẩn hiện các bảng trên bản đồ">
      <Button variant="atlas" size="atlas" type="button" className="vo-glass" aria-expanded={contentVisible} aria-controls="vo-content" onClick={() => setContentVisible((value) => !value)}><span>≋</span> Nội dung</Button>
      <Button variant="atlas" size="atlas" type="button" className="vo-glass" aria-expanded={placesVisible} aria-controls="vo-places" onClick={() => setPlacesVisible((value) => !value)}><span>⌖</span> Địa điểm</Button>
      <Button variant="atlas" size="atlas" type="button" className="vo-glass" aria-expanded={timelineVisible} aria-controls="vo-timeline" onClick={() => setTimelineVisible((value) => !value)}><span>◷</span> Timeline</Button>
      <Button variant="atlas" size="atlas" type="button" className="vo-glass vo-clean-view" aria-label={allHidden ? "Hiện các bảng" : "Ẩn tất cả, chỉ xem bản đồ"} aria-pressed={allHidden} onClick={() => { setContentVisible(allHidden); setTimelineVisible(allHidden); setPlacesVisible(false); }}>{allHidden ? "▦" : "⛶"}</Button>
    </div>
    <Tabs value={tab} onValueChange={(value) => { const next = tabs.find((item) => item.id === value); if (next) changeTab(next.id); }} asChild><Card role="region" id="vo-content" className="vo-story-panel vo-glass" data-open={contentVisible} inert={!contentVisible} aria-label="Nội dung cảnh lịch sử">
      <div className="vo-panel-heading"><span><i /> CHƯƠNG {String(eraIndex + 1).padStart(2, "0")} · {scene.era}</span><Button variant="atlas" size="atlas" type="button" aria-label="Ẩn nội dung" onClick={() => setContentVisible(false)}>×</Button></div>
      <div className="vo-scene-copy" key={scene.id} aria-live="polite" aria-atomic="true"><p className="vo-scene-years">{scene.years}</p><h2>{scene.title}</h2></div>
      <div className="vo-facts"><div><span>QUỐC HIỆU / CHÍNH QUYỀN</span><strong>{scene.nation}</strong></div><div><span>KINH ĐÔ / TRUNG TÂM</span><strong>{scene.capital}</strong></div></div>
      <TabsList className="vo-tabs" variant="line" aria-label="Nội dung lịch sử">{tabs.map((item) => <TabsTrigger key={item.id} id={`vo-tab-${item.id}`} value={item.id} aria-controls="vo-reading-panel"><span aria-hidden="true">{item.icon}</span>{item.label}</TabsTrigger>)}</TabsList>
      {tab === "culture" || tab === "geography" ? <div className="vo-topic-picker"><span>{sections.length} CHỦ ĐỀ</span><Select value={String(readingArticle?.topic ?? 0)} onValueChange={(value) => { setPage(articles.findIndex((item) => item.topic === Number(value))); setPlaying(false); }}><SelectTrigger className="vo-topic-trigger" aria-label={tab === "culture" ? "Chọn chủ đề văn hóa" : "Chọn chủ đề địa lý"}><SelectValue /></SelectTrigger><SelectContent className="vo-select-content" position="popper" align="end" collisionPadding={12}>{sections.map((section, topic) => <SelectItem key={section.title} value={String(topic)}>{topic + 1}. {section.title}</SelectItem>)}</SelectContent></Select></div> : null}
      <TabsContent value={tab} ref={body} className="vo-reading-body" id="vo-reading-panel" aria-labelledby={`vo-tab-${tab}`}>
        <div key={`${scene.id}-${tab}-${currentPage}`} className="vo-reading-page" aria-live="polite">
          {tab === "story" && story ? <div className={story.conflict ? "vo-narrative is-conflict" : "vo-narrative"}><span className="vo-content-label">{story.conflict ? "⚑" : "≋"} {story.label}</span>{story.title ? <h3>{story.title}</h3> : null}<p>{story.text}</p></div> : null}
          {(tab === "culture" || tab === "geography") && readingArticle ? <div className="vo-narrative vo-culture"><span className="vo-content-label">{tab === "culture" ? "◇ VĂN HÓA & ĐỜI SỐNG" : "⌖ ĐỊA LÝ & DÂN CƯ"} · MỤC {readingArticle.topic + 1}/{sections.length}</span><p>{readingArticle.text}</p></div> : null}
          {tab === "people" && scene.people[currentPage] ? <PersonCard person={scene.people[currentPage]} /> : null}
          {tab === "sources" ? <div className="vo-narrative vo-source-content"><span className="vo-content-label">{currentPage < sourcePageCount ? "↗ TƯ LIỆU THAM KHẢO" : "⌖ VỀ LƯỢC ĐỒ & SỐ LIỆU"}</span>{currentPage < sourcePageCount ? <ul>{sources.slice(currentPage, currentPage + 1).map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<span>↗</span></a></li>)}</ul> : <p>{notesPages[currentPage - sourcePageCount]}</p>}</div> : null}
        </div>
      </TabsContent>
      <div className="vo-reading-footer"><span>{tab === "people" ? "NHÂN VẬT" : "TRANG"} {String(currentPage + 1).padStart(2, "0")} <i>/ {String(pageCount).padStart(2, "0")}</i></span>{(tab === "culture" || tab === "geography") && readingArticle?.sources[0] ? <a className="vo-footer-credit" href={readingArticle.sources[0].url} target="_blank" rel="noreferrer" title={readingArticle.sources.map((source) => source.title).join(" · ")}>Nguồn: {readingArticle.sources[0].title} ↗</a> : null}{personPortrait ? <a className="vo-footer-credit" href={personPortrait.file} target="_blank" rel="noreferrer" title={portraitCaption(personPortrait)}>{personPortrait.author} · {personPortrait.license} ↗</a> : null}<div>{scene.id === "tran-bach-dang" && tab === "sources" ? <Link href="/vietnam/bach-dang-1288" className="vo-battle-link">Vào trận ↗</Link> : null}<Button variant="atlas" size="atlas" type="button" aria-label="Trang nội dung trước" disabled={currentPage === 0} onClick={() => { setPage(currentPage - 1); setPlaying(false); }}>←</Button><Button variant="atlas" size="atlas" type="button" aria-label="Trang nội dung tiếp theo" disabled={currentPage >= pageCount - 1} onClick={() => { setPage(currentPage + 1); setPlaying(false); }}>→</Button></div></div>
    </Card></Tabs>
    <Card role="region" id="vo-timeline" className="vo-timeline vo-glass" data-open={timelineVisible} inert={!timelineVisible} aria-label="Dòng thời gian lịch sử">
      <div className="vo-timeline-top"><div className="vo-transport" aria-label="Điều khiển các cảnh lịch sử"><Button variant="atlas" size="atlas" type="button" aria-label="Cảnh trước" disabled={index === 0} onClick={() => { setPlaying(false); go(index - 1); }}>←</Button><Button variant="atlas" size="atlas" type="button" className="vo-play-toggle" aria-label={playing ? "Tạm dừng tự chuyển cảnh" : index === vietnamOverview.length - 1 ? "Phát lại từ đầu" : `Tự chuyển cảnh sau mỗi ${playbackMs / 1000} giây`} aria-pressed={playing} onClick={() => { if (!playing && index === vietnamOverview.length - 1) go(0); setPlaying((value) => !value); }}>{playing ? "Ⅱ" : "▶"}</Button><Button variant="atlas" size="atlas" type="button" aria-label="Cảnh tiếp theo" disabled={index === vietnamOverview.length - 1} onClick={() => { setPlaying(false); go(index + 1); }}>→</Button><span className="vo-scene-counter">{String(index + 1).padStart(2, "0")} <i>/ {vietnamOverview.length}</i></span></div>
        <div className="vo-scene-picker" aria-label={`Các cảnh của ${scene.era}`}>{eraScenes.map((item, i) => <Button variant="atlas" size="atlas" key={item.id} type="button" aria-label={`Cảnh ${i + 1}: ${item.years}`} aria-pressed={scene.id === item.id} onClick={() => { setPlaying(false); go(vietnamOverview.indexOf(item)); }}><i />{eraScenes.length > 1 ? `Cảnh ${i + 1}` : scene.era}</Button>)}</div>
        <Select value={String(playbackMs)} onValueChange={(value) => setPlaybackMs(Number(value))}><SelectTrigger className="vo-speed-trigger" aria-label="Tốc độ chuyển cảnh"><SelectValue /></SelectTrigger><SelectContent className="vo-select-content" position="popper" align="end" collisionPadding={12}>{[3000, 6000, 10000, 15000].map((duration) => <SelectItem key={duration} value={String(duration)}>{duration / 1000}s</SelectItem>)}</SelectContent></Select>
        <label className="vo-search"><span aria-hidden="true">⌕</span><Input aria-label="Tìm thời kỳ hoặc nhân vật" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm triều đại, nhân vật…" /></label><Button variant="atlas" size="atlas" className="vo-timeline-close" type="button" aria-label="Ẩn timeline" onClick={() => setTimelineVisible(false)}>⌄</Button>
      </div>
      <div className="vo-timeline-track"><Button variant="atlas" size="atlas" type="button" className="vo-era-arrow" aria-label="Thời kỳ trước" disabled={eraIndex === 0} onClick={() => { setPlaying(false); go(vietnamOverview.findIndex((item) => item.era === eras[eraIndex - 1])); }}>‹</Button>
        <nav className="vo-era-rail" aria-label="Dòng thời gian các triều đại" ref={rail}><div className="vo-era-strip">
          {filteredEras.map((era, position) => { const firstIndex = vietnamOverview.findIndex((item) => item.era === era); const first = vietnamOverview[firstIndex]; const passed = eras.indexOf(era) < eraIndex; return <Button variant="atlas" size="atlas" key={era} type="button" className={passed ? "is-past" : ""} style={{ "--era-delay": `${Math.min(position, 8) * 45}ms` } as CSSProperties} aria-current={scene.era === era ? "step" : undefined} onClick={() => { setPlaying(false); go(firstIndex); }}><span className="vo-era-date">{eraYears[era] ?? first.years}</span><span className="vo-era-node"><i /><b aria-hidden="true">{scene.era === era ? "✦" : passed ? "◆" : "◇"}</b></span><strong>{era}</strong></Button>; })}
          {!filteredEras.length ? <p className="vo-no-results">Không tìm thấy. Thử từ khóa khác.</p> : null}
        </div></nav><Button variant="atlas" size="atlas" type="button" className="vo-era-arrow" aria-label="Thời kỳ tiếp theo" disabled={eraIndex === eras.length - 1} onClick={() => { setPlaying(false); go(vietnamOverview.findIndex((item) => item.era === eras[eraIndex + 1])); }}>›</Button>
      </div>
      <div className="vo-timeline-progress"><span style={{ width: `${(index + 1) / vietnamOverview.length * 100}%` }} /><i key={`${index}-${playing}-${playbackMs}`} style={{ animationDuration: `${playbackMs}ms` }} className={playing ? "is-playing" : ""} /></div>
    </Card>
    <a className="vo-map-credit" href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth · Lược đồ gần đúng ↗</a>
  </main></TooltipProvider>;
};
