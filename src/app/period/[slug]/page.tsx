import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VietnamOverview } from "~/app/[country]/[period]/_components/vietnam-overview";
import type { OverviewCountryId } from "~/app/[country]/[period]/_components/vietnam-overview";
import { battleEntries } from "~/data/battles";
import { periodEntries } from "~/data/periods";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => periodEntries.filter((period) => period.id !== "three-kingdoms").map((period) => ({ slug: period.id }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const period = periodEntries.find((period) => period.id === slug);
  return { title: period?.title, description: period?.description };
}
export default async function PeriodDetail({ params }: Props) {
  const { slug } = await params;
  const period = periodEntries.find((period) => period.id === slug);
  if (!period) notFound();
  return <VietnamOverview key={period.id} country={period.countryId as OverviewCountryId} detailScenes={period.scenes} detail={{ title: period.title, parentHref: `/${period.countryId}`, parentLabel: period.country, kind: "period" }} relatedEntries={battleEntries.filter((battle) => battle.periodId === period.id)} />;
}
