import { useState } from "react";

import { filterOptions } from "@/utils/filter.helpers";

export const useFilterGrid = <T extends object>(dataProvider: T[]) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredDataProvider = filterOptions(dataProvider ?? [], searchKeyword);

  return {
    dataProvider: filteredDataProvider,
    searchKeyword,
    setSearchKeyword,
  };
};
