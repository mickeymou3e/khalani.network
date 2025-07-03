import { useState } from "react";

import { FilterOptions } from "./types";
import { filterOptions, getKeys } from "@/utils/filter";

export const useFilterGrid = <T extends object>(
  dataProvider: T[],
  options?: FilterOptions
) => {
  const [searchText, setSearchText] = useState("");

  const filteredDataProvider = filterOptions({
    data: dataProvider ?? [],
    filter: searchText,
    ...(options?.columnConfig
      ? { include: getKeys(options.columnConfig) }
      : {}),
    ...options,
  });

  return {
    dataProvider: filteredDataProvider,
    searchText,
    setSearchText,
  };
};
