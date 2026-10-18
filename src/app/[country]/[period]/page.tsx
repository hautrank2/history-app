import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { countriesData } from "~/data";

import { StoryMap } from "./_components/story-map";
import { BachDangExperience } from "./_components/bach-dang";

type PeriodPageProps = { params: Promise<{ country: string; period: string }> };

const findStory = (country: string, period: string) =>
  countriesData[country]?.periods.find((item) => item.slug === period)?.story;

export const generateStaticParams = () =>
  Object.values(countriesData).flatMap((country) =>
    (country?.periods ?? [])
      .filter((period) => period.story)
      .map((period) => ({ country: country?.slug ?? "", period: period.slug })),
  );

export const generateMetadata = async ({ params }: PeriodPageProps): Promise<Metadata> => {
  const { country, period } = await params;
  return { title: findStory(country, period)?.title };
};

const PeriodPage = async ({ params }: PeriodPageProps) => {
  const { country, period } = await params;
  const story = findStory(country, period);
  if (!story) notFound();

  return period === "bach-dang-1288" ? <BachDangExperience story={story} /> : <StoryMap story={story} backHref={`/${country}`} />;
};

export default PeriodPage;
