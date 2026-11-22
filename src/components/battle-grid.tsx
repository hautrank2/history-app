import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Image } from "@/components/ui/image";
import type { HistoryCardModel } from "~/types/history-card";
import { CountryFlag } from "~/components/country-flag";

type BattleGridProps = { entries: HistoryCardModel[] };

export const BattleGrid = ({ entries }: BattleGridProps) => (
  <ul className="atlas-battle-grid grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
    {entries.map((battle) => (
      <li className="h-full" key={battle.id} data-event-id={battle.id}>
        <Link
          href={battle.href}
          className="atlas-battle-card group relative isolate flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-primary sm:min-h-80 sm:p-8"
        >
          <Image
            src={battle.image}
            alt=""
            title={battle.imageCaption ?? "Minh họa AI · Tái hiện nghệ thuật"}
            preview={false}
            fill
            className="atlas-battle-background -z-20 object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          />
          <div className="atlas-battle-shade absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/5" />
          <span className="atlas-battle-meta mb-auto flex items-center justify-between gap-3 text-xs text-foreground">
            <span className="rounded border border-primary/40 bg-background/70 px-3 py-1.5 text-primary backdrop-blur-sm">{battle.years}</span>
            <span className="flex items-center gap-2"><CountryFlag countryId={battle.countryId} />{battle.country}</span>
          </span>
          <strong className="mt-12 font-display text-3xl leading-snug text-foreground sm:text-4xl">{battle.title}</strong>
          <p className="mt-3 line-clamp-3 max-w-md text-sm leading-relaxed text-foreground/80">{battle.description}</p>
          <span className="atlas-battle-cta mt-6 flex items-center justify-between border-t border-primary/25 pt-4 text-xs font-semibold text-primary">
            Xem chi tiết
            <ArrowUpRight size={20} aria-hidden="true" />
          </span>
        </Link>
      </li>
    ))}
  </ul>
);
