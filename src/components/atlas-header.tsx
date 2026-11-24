import { BookOpen, House, Swords, Users } from "lucide-react";
import Link from "next/link";

import { battleDirectoryHref, periodDirectoryHref } from "~/data/battle-links";
import { RootLink } from "~/components/root-link";

type AtlasHeaderProps = {
  active: "home" | "period" | "battle" | "characters";
};

const navigation = [
  { id: "home", href: "/#intro", label: "Home", icon: House },
  { id: "period", href: periodDirectoryHref, label: "Giai đoạn", icon: BookOpen },
  { id: "battle", href: battleDirectoryHref, label: "Trận đánh", icon: Swords },
  { id: "characters", href: "/characters", label: "Nhân vật", icon: Users },
] as const;

export const AtlasNavigation = ({ active, periodHref = periodDirectoryHref }: AtlasHeaderProps & { periodHref?: string }) => (
    <nav className="atlas-primary-nav" aria-label="Điều hướng chính">
      <RootLink />
      {navigation.map(({ id, href, label, icon: Icon }) => (
        <Link
          key={id}
          href={id === "period" ? periodHref : href}
          className="atlas-nav-link"
          aria-current={active === id ? "page" : undefined}
        >
          <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
);

export const AtlasHeader = ({ active }: AtlasHeaderProps) => (
  <header className="atlas-header atlas-site-header">
    <Link href="/#intro" className="atlas-logo atlas-site-brand">
      <span aria-hidden="true">H</span>
      <div className="atlas-brand-copy">
        <strong>HISTORY ATLAS</strong>
        <small>Những trang sử sống</small>
      </div>
    </Link>
    <AtlasNavigation active={active} />
  </header>
);
