import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";

import type { RowProps } from "@/components/molecules";
import { selectSelectedBridgeOutAsset } from "@/features/BridgePage/store";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useAppSelector } from "@/store";
import { EnergyAttributeTokenProps } from "@/store/ancillary";
import { filterOptions } from "@/utils/filter.helpers";

import { namespace } from "../../config";
import { createAssetsColumnConfig } from "./config";
import { DropdownContentsProps } from "./DropdownContents";

export const useDropdownContents = ({
  data,
  onSelect,
  onViewToggle,
}: DropdownContentsProps) => {
  const { t } = useTranslation(namespace);
  const [filterText, setFilterText] = useState("");
  const selectedAsset = useAppSelector(selectSelectedBridgeOutAsset);
  const assetsColumnConfig = useMemo(() => createAssetsColumnConfig(t), [t]);

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

  const filteredAssets = filterOptions(data, filterText);

  const searchText = t(`${namespace}:search`);

  return {
    filterText,
    filteredAssets,
    selectedAsset,
    assetsColumnConfig,
    searchText,
    handleRowClick,
    setFilterText,
  };
};
