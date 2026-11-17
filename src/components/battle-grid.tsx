import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { BattleEntryModel } from "~/data/battles";

type BattleGridProps = { entries: BattleEntryModel[] };

export const BattleGrid = ({ entries }: BattleGridProps) => (
  <ul className="atlas-battle-grid grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3">
    {entries.map((battle) => (
      <li key={battle.id} data-event-id={battle.id}>
        <Link
          href={battle.href}
          className="atlas-battle-card flex h-full flex-col gap-2 rounded border border-border bg-card/45 p-4 transition-colors hover:border-primary hover:bg-card focus-visible:outline-2 focus-visible:outline-primary"
        >
          <span className="flex items-center justify-between gap-2 text-xs text-primary">
            {battle.years}
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
          <strong className="grow font-display text-xl leading-snug text-foreground">{battle.title}</strong>
          <small className="text-muted-foreground">{battle.country}</small>
        </Link>
      </li>
    ))}
  </ul>
);
