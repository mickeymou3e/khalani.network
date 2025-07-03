import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";

import { Stack } from "@mui/material";

import type { RowProps } from "@/components/molecules";
import { DataGrid, SearchInput } from "@/components/molecules";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { BalanceData } from "@/store/balances";
import { filterOptions } from "@/utils/filter.helpers";

import { createColumnConfig, namespace } from "./config";
import { containerStyle } from "./DropdownContents.styles";

export type DropdownContentsProps = {
  data: BalanceData[];
  onSelect: (row: BalanceData) => void;
  onViewToggle: () => void;
};

const DropdownContents = ({
  data,
  onSelect,
  onViewToggle,
}: DropdownContentsProps) => {
  const { t } = useTranslation(namespace);
  const [filterText, setFilterText] = useState("");

  const columnConfig = useMemo(() => createColumnConfig(t), [t]);

  const handleRowClick = (row: RowProps) => {
    onSelect(row as BalanceData);
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
      {data.length >= 5 && (
        <Stack direction="row" p="1.5rem" spacing="1.5rem" alignItems="center">
          <SearchInput
            placeholder={searchText}
            sx={{ flexGrow: 1 }}
            value={filterText}
            setValue={setFilterText}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            size="small"
          />
        </Stack>
      )}
      <DataGrid
        columns={columnConfig}
        dataProvider={filteredAssets}
        onRowClick={handleRowClick}
      />
    </Stack>
  );
};

export default DropdownContents;
