import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";

import { Stack } from "@mui/material";

import type { RowProps } from "@/components/molecules";
import { DataGrid, SearchInput } from "@/components/molecules";
import { EcoAssetToggleGroup } from "@/components/molecules/EcoAssetToggleGroup";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useAppSelector } from "@/store";
import { RenewableEnergyCertificate } from "@/store/pool/pool.types";
import { filterOptions } from "@/utils/filter.helpers";

import { selectSelectedAssetKey } from "../store/pool.selectors";
import { createColumnConfig, namespace } from "./config";
import { containerStyle } from "./DropdownContents.styles";

export type DropdownContentsProps = {
  data: RenewableEnergyCertificate[];
  isRedeem: boolean;
  onSelect: (row: RenewableEnergyCertificate) => void;
  onViewToggle: () => void;
};

const DropdownContents = ({
  data,
  isRedeem,
  onSelect,
  onViewToggle,
}: DropdownContentsProps) => {
  const { t } = useTranslation(namespace);
  const [filterText, setFilterText] = useState("");
  const selectedAssetKey = useAppSelector(selectSelectedAssetKey);

  const columnConfig = useMemo(
    () => createColumnConfig(t, isRedeem),
    [t, isRedeem]
  );

  const handleRowClick = (row: RowProps) => {
    onSelect(row as RenewableEnergyCertificate);
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

  return (
    <Stack sx={containerStyle}>
      <Stack direction="row" p="1.5rem" spacing="1.5rem" alignItems="center">
        <EcoAssetToggleGroup />
        {data.length >= 5 && (
          <SearchInput
            placeholder={searchText}
            sx={{ flexGrow: 1 }}
            value={filterText}
            setValue={setFilterText}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            size="small"
          />
        )}
      </Stack>
      <DataGrid
        columns={columnConfig}
        dataProvider={filteredAssets}
        onRowClick={handleRowClick}
        isRowSelected={(row) => row.id === selectedAssetKey}
      />
    </Stack>
  );
};

export default DropdownContents;
