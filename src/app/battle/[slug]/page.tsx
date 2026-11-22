import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BattleExperience } from "~/components/battle-experience";
import { ThreeKingdomsExperience } from "~/app/period/three-kingdoms/_components";
import { battleEntries } from "~/data/battles";
import { vietnamBattles, vietnamBattleStory } from "~/data/vietnam-battles";
import { vietnamData } from "~/data/vietnam";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => battleEntries.map((battle) => ({ slug: battle.href.split("/").at(-1) ?? battle.id }));
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
    return <BattleExperience story={story} />;
  }
  if (battle.countryId === "china") return <ThreeKingdomsExperience key={battle.id} battleId={battle.sceneId} />;
  const campaign = vietnamBattles.find((item) => item.id === battle.id);
  if (!campaign) notFound();
  return <BattleExperience key={campaign.id} story={vietnamBattleStory(campaign)} battle={campaign} />;
}
