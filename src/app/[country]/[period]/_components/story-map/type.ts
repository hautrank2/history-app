import type { StoryModel } from "~/types";

export type StoryMapProps = {
  story: StoryModel;
  backHref: string;
};

export type UseStoryMapProps = {
  story: StoryModel;
};
