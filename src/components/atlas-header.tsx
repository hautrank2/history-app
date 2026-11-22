import { BookOpen, House, Swords } from "lucide-react";
import Link from "next/link";

import { battleDirectoryHref, periodDirectoryHref } from "~/data/battle-links";

type AtlasHeaderProps = {
  active: "home" | "period" | "battle";
};

const navigation = [
  { id: "home", href: "/#intro", label: "Home", icon: House },
  { id: "period", href: periodDirectoryHref, label: "Giai đoạn", icon: BookOpen },
  { id: "battle", href: battleDirectoryHref, label: "Trận đánh", icon: Swords },
] as const;

export const AtlasHeader = ({ active }: AtlasHeaderProps) => (
  <header className="atlas-header atlas-site-header">
    <Link href="/#intro" className="atlas-logo atlas-site-brand">
      <span aria-hidden="true">H</span>
      <div className="atlas-brand-copy">
        <strong>HISTORY ATLAS</strong>
        <small>Những trang sử sống</small>
      </div>
    </Link>
    <nav className="atlas-primary-nav" aria-label="Điều hướng chính">
      {navigation.map(({ id, href, label, icon: Icon }) => (
        <Link
          key={id}
          href={href}
          className="atlas-nav-link"
          aria-current={active === id ? "page" : undefined}
        >
          <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  </header>
);
