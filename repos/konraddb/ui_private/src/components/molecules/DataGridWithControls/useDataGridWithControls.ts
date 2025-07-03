import { useState } from "react";

import { filterOptions } from "@/utils/filter.helpers";

interface useDataGridWithControlsProps {
  dataProvider: any[];
}

export const useDataGridWithControls = ({
  dataProvider,
}: useDataGridWithControlsProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredDataProvider = filterOptions(dataProvider ?? [], searchKeyword);

  return {
    searchKeyword,
    setSearchKeyword,
    filteredDataProvider,
  };
};
