import { Card } from "~/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import type { OverviewSceneModel } from "~/data/vietnam-overview";
import { sceneStatistics } from "~/data/vietnam-overview-details";

type CountryStatsProps = { scene: OverviewSceneModel };

export const CountryStats = ({ scene }: CountryStatsProps) => <Card className="vo-country-stats vo-glass" role="region" aria-label="Diện tích và dân số">
  <dl>{sceneStatistics(scene).map((stat, index) => <div key={stat.label} className={`vo-stat vo-stat-${index === 0 ? "area" : "population"}`}>
    <dt>{stat.label}</dt>
    <dd><Tooltip><TooltipTrigger asChild>{stat.source ? <a href={stat.source.url} target="_blank" rel="noreferrer" aria-label={`${stat.label}: ${stat.value}, ${stat.caption}. Xem nguồn`}>{stat.value}</a> : <span tabIndex={0} aria-label={`${stat.label}: Không xác định`}>{stat.value}</span>}</TooltipTrigger><TooltipContent className="vo-stat-tooltip" side="top"><p>{stat.note}</p>{stat.source ? <small>{stat.source.title}</small> : null}</TooltipContent></Tooltip><small>{stat.caption}</small></dd>
  </div>)}</dl>
</Card>;
