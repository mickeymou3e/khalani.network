import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";

import type { RowProps } from "@/components/molecules";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useAppSelector } from "@/store";
import { EnergyAttributeTokenProps } from "@/store/ancillary";
import { filterOptions } from "@/utils/filter.helpers";

import { selectSelectedAssetKey } from "../../store/retire.selectors";
import { namespace } from "../config";
import {
  createAssetsColumnConfig,
  createPoolTokensColumnConfig,
} from "./config";
import { DropdownContentsProps } from "./DropdownContents";

export const useDropdownContents = ({
  eats,
  pools,
  onSelect,
  onViewToggle,
}: DropdownContentsProps) => {
  const { t } = useTranslation(namespace);
  const [filterText, setFilterText] = useState("");
  const selectedAssetKey = useAppSelector(selectSelectedAssetKey);
  const poolTokensColumnConfig = useMemo(
    () => createPoolTokensColumnConfig(t),
    [t]
  );
  const assetsColumnConfig = useMemo(() => createAssetsColumnConfig(t), [t]);
  const shouldShowPoolTokens = Boolean(pools[0].balanceValue);
  const shouldShowEats = Boolean(eats.length);

  const handleRowClick = (row: RowProps) => {
    onSelect(row as EnergyAttributeTokenProps);
  };

  useUpdateEffect(() => {
    if (!onViewToggle) {
      return;
    }

    const timer = window.setTimeout(() => {
      onViewToggle();
    }, 1);

    return () => window.clearTimeout(timer);
  }, [onViewToggle]);

  const filteredAssets = filterOptions(eats, filterText);
  const filteredPools = filterOptions(pools, filterText);

  const searchText = t(`${namespace}:search`);
  const poolText = t(`${namespace}:pool`);
  const underlyingText = t(`${namespace}:underlying`);

  return {
    filterText,
    filteredAssets,
    filteredPools,
    selectedAssetKey,
    poolTokensColumnConfig,
    assetsColumnConfig,
    shouldShowPoolTokens,
    shouldShowEats,
    searchText,
    poolText,
    underlyingText,
    handleRowClick,
    setFilterText,
  };
};
