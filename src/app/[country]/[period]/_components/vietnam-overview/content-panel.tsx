"use client";

import { BookOpen, ChevronLeft, ChevronRight, ExternalLink, Landmark, MapPin, Users, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { Image, ImageGroup } from "@/components/ui/image";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { characterHref, getCharacter } from "~/data/characters";
import { historicalEvents } from "~/data/events";
import type { HistoricalEventModel } from "~/data/events";
import { portraitCaption, portraitFor } from "~/data/portraits";
import { geographyArticles, overviewDetails } from "~/data/vietnam-overview-details";
import type { OverviewArticleModel } from "~/data/vietnam-overview-details";
import { wikiUrl } from "~/data/vietnam-overview";
import type { OverviewPersonModel, OverviewSceneModel } from "~/data/vietnam-overview";

import type { OverviewTab } from "./hook";

const tabs = [
  { id: "story", label: "Diễn biến", icon: BookOpen },
  { id: "culture", label: "Văn hóa", icon: Landmark },
  { id: "geography", label: "Địa lý", icon: MapPin },
  { id: "people", label: "Nhân vật", icon: Users },
  { id: "sources", label: "Tư liệu", icon: ExternalLink },
] as const;
type ReadingBlockModel = { kind: "article"; article: OverviewArticleModel } | { kind: "person"; person: OverviewPersonModel } | { kind: "event"; event: HistoricalEventModel };
type ContentPanelProps = { scene: OverviewSceneModel; chapter: number; tab: OverviewTab; open: boolean; onTabChange: (tab: OverviewTab) => void; onClose: () => void; onInteract: () => void };

const PersonCard = ({ person }: { person: OverviewPersonModel }) => {
  const portrait = portraitFor(person.wiki);
  return <article className={`vo-person ${person.side === "opponent" ? "is-opponent" : ""}`} data-character-id={person.id}>
    <div className="vo-person-image">{portrait ? <Image src={portrait.src} alt={portrait.generated ? `Minh họa AI ${person.name}, không phải chân dung xác thực` : `Hình ảnh tái hiện ${person.name}`} fill sizes="100px" style={{ objectPosition: portrait.position }} /> : <Users size={30} />}{portrait?.generated ? <small className="vo-illustration-badge">MINH HỌA AI</small> : null}</div>
    <div className="vo-person-copy"><span className="vo-person-side">{person.side === "opponent" ? "PHÍA ĐỐI PHƯƠNG" : "NHÂN VẬT LỊCH SỬ"}</span><Link className="vo-person-name" href={characterHref(person.id)}>{person.name} <span>↗</span></Link><p>{person.role}</p><a className="vo-person-source" href={getCharacter(person.id).sources[0]?.url} target="_blank" rel="noreferrer">Nguồn tư liệu ↗</a></div>
    {portrait ? <small className="vo-person-credit">{portraitCaption(portrait)}</small> : null}
  </article>;
};

export const ContentPanel = ({ scene, chapter, tab, open, onTabChange, onClose, onInteract }: ContentPanelProps) => {
  const [active, setActive] = useState(0);
  const body = useRef<HTMLDivElement>(null);
  const sources = scene.sources.map((title) => ({ title, url: wikiUrl(title) }));
  const culture = [{ ...scene.culture, sources }, ...(overviewDetails[scene.id]?.culture ?? [])];
  const geography = geographyArticles(scene);
  const events = historicalEvents.filter((event) => event.sceneIds.includes(scene.id));
  const allSources = [...new Map([...culture.flatMap((item) => item.sources), ...geography.flatMap((item) => item.sources), ...events.flatMap((event) => event.sources)].map((source) => [source.url, source])).values()];
  const notes = `${scene.extent} Nền địa lý hiện đại chỉ để định vị, không dùng đo diện tích hoặc suy ra phạm vi kiểm soát lịch sử. Hoàng Sa và Trường Sa thuộc lớp tham chiếu lãnh thổ Việt Nam hiện nay. Dân số có mốc năm và phạm vi riêng; số hồi dựng không phải tổng điều tra. Minh họa AI không phải chân dung xác thực.`;
  const story: ReadingBlockModel[] = [
    { kind: "article", article: { title: "Bối cảnh lịch sử", text: scene.summary, sources } },
    ...(scene.conflict ? [{ kind: "article" as const, article: { ...scene.conflict, sources } }] : []),
    ...events.map((event) => ({ kind: "event" as const, event })),
  ];
  const blocks: ReadingBlockModel[] = tab === "story" ? story : tab === "people" ? scene.people.map((person) => ({ kind: "person", person })) : (tab === "culture" ? culture : tab === "geography" ? geography : [{ title: "Tư liệu tham khảo", text: "", sources: allSources }, { title: "Về bản đồ và số liệu", text: notes, sources: [] }]).map((article) => ({ kind: "article", article }));
  const current = Math.min(active, blocks.length - 1);
  const go = (next: number) => {
    const index = Math.max(0, Math.min(blocks.length - 1, next));
    setActive(index); onInteract();
    const target = body.current?.querySelector<HTMLElement>(`[data-reading-page="${index}"]`);
    if (target && body.current) body.current.scrollTo({ top: Math.max(0, target.offsetTop - 12), behavior: "instant" });
  };
  return <Tabs value={tab} onValueChange={(value) => { const selected = tabs.find((item) => item.id === value); if (selected) { setActive(0); onTabChange(selected.id); } }} asChild>
    <aside role="region" id="vo-content" className="vo-story-panel vo-glass" data-open={open} inert={!open} aria-label="Nội dung cảnh lịch sử">
      <header className="vo-content-header">
        <div className="vo-panel-heading"><span><i /> CHƯƠNG {String(chapter).padStart(2, "0")} · {scene.era}</span><Button variant="atlas" size="atlas" aria-label="Ẩn nội dung" onClick={onClose}><X size={16} /></Button></div>
        <p className="vo-scene-years">{scene.years}</p><h2 className="vo-content-title">{scene.title}</h2>
        <details className="vo-facts-disclosure"><summary>Quốc hiệu & kinh đô</summary><dl className="vo-facts"><div><dt>Quốc hiệu / chính quyền</dt><dd>{scene.nation}</dd></div><div><dt>Kinh đô / trung tâm</dt><dd>{scene.capital}</dd></div></dl></details>
      </header>
      <TabsList className="vo-tabs" variant="line" aria-label="Nội dung lịch sử">{tabs.map(({ id, label, icon: Icon }) => <TabsTrigger key={id} id={`vo-tab-${id}`} value={id} aria-controls="vo-reading-panel" className={`vo-tab vo-tab-${id}`}><Icon size={14} /><span>{label}</span></TabsTrigger>)}</TabsList>
      {tab === "culture" || tab === "geography" ? <div className="vo-topic-picker"><Select value={String(current)} onValueChange={(value) => go(Number(value))}><SelectTrigger className="vo-topic-trigger" aria-label={`Chọn chủ đề ${tab === "culture" ? "văn hóa" : "địa lý"}`}><SelectValue /></SelectTrigger><SelectContent className="vo-select-content" position="popper">{blocks.map((block, index) => block.kind === "article" ? <SelectItem key={index} value={String(index)}>{index + 1}. {block.article.title}</SelectItem> : null)}</SelectContent></Select></div> : null}
      <TabsContent key={tab} value={tab} ref={body} className="vo-reading-body" id="vo-reading-panel" aria-labelledby={`vo-tab-${tab}`} tabIndex={0} onWheel={onInteract} onPointerDown={onInteract} onKeyDown={onInteract} onScroll={(event) => {
        const element = event.currentTarget;
        const sections = Array.from(element.querySelectorAll<HTMLElement>("[data-reading-page]"));
        const last = sections.length - 1;
        if (element.scrollHeight - element.clientHeight - element.scrollTop < 4 && element.scrollTop > 0) { setActive(last); return; }
        const position = sections.reduce((index, section, next) => section.offsetTop <= element.scrollTop + 42 ? next : index, 0);
        setActive(position);
      }}>
        <ImageGroup><div className="vo-reading-stream">{blocks.map((block, index) => <section className="vo-reading-section" data-reading-page={index} data-active={current === index} key={index}>
          {block.kind === "article" ? <article className="vo-narrative"><span className="vo-content-label">{String(index + 1).padStart(2, "0")} / {tabs.find((item) => item.id === tab)?.label}</span><h3>{block.article.title}</h3>{block.article.text ? <p>{block.article.text}</p> : null}{block.article.sources.length ? <ul className={tab === "sources" ? "vo-source-list" : "vo-article-sources"}>{block.article.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></li>)}</ul> : null}</article> : null}
          {block.kind === "person" ? <PersonCard person={block.person} /> : null}
          {block.kind === "event" ? <article className="vo-uprising-card" data-event-id={block.event.id}><span className="vo-content-label">KHỞI NGHĨA · {block.event.years}</span><Link href={`/vietnam/${block.event.id}`}>{block.event.title} ↗</Link><small>{block.event.location}</small><p>{block.event.summary}</p><p><strong>Kết quả:</strong> {block.event.outcome}</p></article> : null}
        </section>)}</div></ImageGroup>
      </TabsContent>
      <footer className="vo-reading-footer"><div className="vo-reading-status"><strong>{String(current + 1).padStart(2, "0")} <span>/ {String(blocks.length).padStart(2, "0")} mục</span></strong><small>Cuộn để đọc tiếp</small></div><div className="vo-reading-controls"><Button variant="atlas" size="atlas" aria-label="Trang nội dung trước" disabled={current <= 0} onClick={() => go(current - 1)}><ChevronLeft size={17} /></Button><Button variant="atlas" size="atlas" aria-label="Trang nội dung tiếp theo" disabled={current >= blocks.length - 1} onClick={() => go(current + 1)}><ChevronRight size={17} /></Button></div></footer>
    </aside>
  </Tabs>;
};
