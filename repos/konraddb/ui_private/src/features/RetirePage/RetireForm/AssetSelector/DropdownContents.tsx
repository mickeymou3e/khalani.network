import { Box, Stack, Typography } from "@mui/material";

import { DataGrid, SearchInput } from "@/components/molecules";
import { EcoAssetToggleGroup } from "@/components/molecules/EcoAssetToggleGroup";
import { EnergyAttributeTokenProps } from "@/store/ancillary";

import { PoolOptions } from "../../store/retire.types";
import {
  containerStyle,
  dividerStyle,
  gridContainerStyle,
  sectionTitleStyle,
} from "./DropdownContents.styles";
import { useDropdownContents } from "./useDropdownContents";

export type DropdownContentsProps = {
  eats: EnergyAttributeTokenProps[];
  pools: PoolOptions[];
  onSelect: (row: EnergyAttributeTokenProps) => void;
  onViewToggle: () => void;
};

const DropdownContents = (props: DropdownContentsProps) => {
  const {
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
  } = useDropdownContents(props);

  return (
    <Stack sx={containerStyle}>
      <Stack direction="row" p="1.5rem" spacing="1.5rem" alignItems="center">
        <EcoAssetToggleGroup />
        {(props.eats.length >= 5 || props.pools.length >= 5) && (
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
        {shouldShowPoolTokens && (
          <Stack>
            <Typography sx={sectionTitleStyle} variant="body2">
              {poolText}
            </Typography>
            <DataGrid
              columns={poolTokensColumnConfig}
              dataProvider={filteredPools}
              onRowClick={handleRowClick}
              isRowSelected={(row) => row.id === selectedAssetKey}
            />
          </Stack>
        )}
        {shouldShowEats && shouldShowPoolTokens && <Box sx={dividerStyle} />}
        {shouldShowEats && (
          <Stack>
            <Typography sx={sectionTitleStyle} variant="body2">
              {underlyingText}
            </Typography>
            <DataGrid
              columns={assetsColumnConfig}
              dataProvider={filteredAssets}
              onRowClick={handleRowClick}
              isRowSelected={(row) => row.id === selectedAssetKey}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default DropdownContents;
