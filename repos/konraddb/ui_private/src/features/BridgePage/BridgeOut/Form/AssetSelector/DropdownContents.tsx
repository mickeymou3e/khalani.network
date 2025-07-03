import { Stack } from "@mui/material";

import { DataGrid, SearchInput } from "@/components/molecules";
import { EcoAssetToggleGroup } from "@/components/molecules/EcoAssetToggleGroup";
import { EnergyAttributeTokenProps } from "@/store/ancillary";

import { containerStyle, gridContainerStyle } from "./DropdownContents.styles";
import { useDropdownContents } from "./useDropdownContents";

export type DropdownContentsProps = {
  data: EnergyAttributeTokenProps[];
  onSelect: (row: EnergyAttributeTokenProps) => void;
  onViewToggle: () => void;
};

const DropdownContents = (props: DropdownContentsProps) => {
  const {
    filterText,
    filteredAssets,
    selectedAsset,
    assetsColumnConfig,
    searchText,
    handleRowClick,
    setFilterText,
  } = useDropdownContents(props);

  return (
    <Stack sx={containerStyle}>
      <Stack direction="row" p="1.5rem" spacing="1.5rem" alignItems="center">
        <EcoAssetToggleGroup />
        {props.data.length >= 5 && (
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
      <Stack sx={gridContainerStyle}>
        <DataGrid
          columns={assetsColumnConfig}
          dataProvider={filteredAssets}
          onRowClick={handleRowClick}
          isRowSelected={(row) => row.id === selectedAsset}
        />
      </Stack>
    </Stack>
  );
};

export default DropdownContents;
