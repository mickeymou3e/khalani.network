import { useState } from "react";
import { useTranslation } from "next-i18next";

import { filterOptions } from "@/utils/filter.helpers";
import { formatShortValue } from "@/utils/formatters";

import { MarketsGridRowDetails } from "../MarketsPage.selectors";
import { createColumnConfig, namespace } from "./config";

export const useRowDetails = (dataProvider: MarketsGridRowDetails) => {
  const { t } = useTranslation(namespace);
  const [filterText, setFilterText] = useState("");
  const columnConfig = createColumnConfig(t);
  const filteredAssets = filterOptions(dataProvider.assets, filterText);

  const title = t(`${namespace}:underlyingAssets`);
  const techTypeLabel = t(`${namespace}:techType`);
  const vintageLabel = t(`${namespace}:vintage`);
  const searchText = t(`${namespace}:search`);
  const noResultsFound = t(`${namespace}:noResultsFound`);

  const formatValue = (value: number) => `(${formatShortValue(value, 0)})`;

  return {
    filterText,
    columnConfig,
    filteredAssets,
    title,
    techTypeLabel,
    vintageLabel,
    searchText,
    noResultsFound,
    formatValue,
    setFilterText,
  };
};
