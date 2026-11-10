import type { CountryModel } from "~/types";

import { vietnamData } from "./vietnam";
import { chinaData, denmarkData, englandData, norwayData } from "./world";

export const listedCountries = [vietnamData, englandData, chinaData];

export const countriesData: Record<string, CountryModel | undefined> = {
  [vietnamData.slug]: vietnamData,
  [englandData.slug]: englandData,
  [chinaData.slug]: chinaData,
  [denmarkData.slug]: denmarkData,
  [norwayData.slug]: norwayData,
};

export const defaultCountrySlug = vietnamData.slug;
