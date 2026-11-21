import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BachDangExperience } from "~/app/[country]/[period]/_components/bach-dang";
import { VietnamOverview } from "~/app/[country]/[period]/_components/vietnam-overview";
import { ThreeKingdomsExperience } from "~/app/period/three-kingdoms/_components";
import { battleEntries } from "~/data/battles";
import { dienBienPhuScenes } from "~/data/dien-bien-phu";
import { periodEntries } from "~/data/periods";
import { vietnamData } from "~/data/vietnam";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => battleEntries.map((battle) => ({ slug: battle.href.split("/").at(-1)! }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const battle = battleEntries.find((battle) => battle.href === `/battle/${slug}`);
  return { title: battle?.title, description: battle?.description };
}
export default async function BattleDetail({ params }: Props) {
  const { slug } = await params;
  const battle = battleEntries.find((battle) => battle.href === `/battle/${slug}`);
  if (!battle) notFound();
  if (battle.id === "bach-dang-1288") {
    const story = vietnamData.periods.find((period) => period.slug === battle.id)?.story;
    if (!story) notFound();
    return <BachDangExperience story={story} />;
  }
  if (battle.countryId === "china") return <ThreeKingdomsExperience key={battle.id} battleId={battle.sceneId} />;
  const period = periodEntries.find((period) => period.id === battle.periodId);
  if (!period) notFound();
  return <VietnamOverview key={battle.id} country="vietnam" detailScenes={dienBienPhuScenes} detail={{ title: battle.title, parentHref: period.href, parentLabel: period.title, kind: "battle" }} />;
}
