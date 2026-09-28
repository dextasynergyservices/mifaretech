import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const catalogueSearchParams = {
  category: parseAsString.withDefault("all"),
  q: parseAsString.withDefault(""),
  product: parseAsString.withDefault(""),
};

export const searchParamsCache = createSearchParamsCache(catalogueSearchParams);
