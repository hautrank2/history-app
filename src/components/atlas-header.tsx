import { BookOpen, House, Swords, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { battleDirectoryHref, periodDirectoryHref } from "~/data/battle-links";
import { cn } from "~/lib/utils";

type AtlasHeaderProps = {
  active: "home" | "period" | "battle" | "characters";
  compact?: boolean;
  className?: string;
  children?: ReactNode;
  periodHref?: string;
};

const navigation = [
  { id: "home", href: "/#intro", label: "Home", icon: House },
  { id: "period", href: periodDirectoryHref, label: "Giai đoạn", icon: BookOpen },
  { id: "battle", href: battleDirectoryHref, label: "Trận đánh", icon: Swords },
  { id: "characters", href: "/characters", label: "Nhân vật", icon: Users },
] as const;

const AtlasNavigation = ({ active, periodHref = periodDirectoryHref }: Pick<AtlasHeaderProps, "active" | "periodHref">) => (
  <nav className="atlas-primary-nav" aria-label="Điều hướng chính">
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

export const AtlasHeader = ({ active, compact = false, className, children, periodHref }: AtlasHeaderProps) => (
  <header className={cn(compact ? "atlas-compact-header" : "atlas-header atlas-site-header", className)}>
    {!compact && (
      <Link href="/#intro" className="atlas-logo atlas-site-brand">
        <span aria-hidden="true">H</span>
        <div className="atlas-brand-copy">
          <strong>HISTORY ATLAS</strong>
          <small>Những trang sử sống</small>
        </div>
      </Link>
    )}
    <AtlasNavigation active={active} periodHref={periodHref} />
    {children}
  </header>
);
