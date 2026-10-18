import type { CountryModel } from "~/types";

import { vietnamData } from "./vietnam";
import { chinaData, englandData } from "./world";

export const countriesData: Record<string, CountryModel | undefined> = {
  [vietnamData.slug]: vietnamData,
  [englandData.slug]: englandData,
  [chinaData.slug]: chinaData,
};

export const defaultCountrySlug = vietnamData.slug;
