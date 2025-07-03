import { memo, useMemo } from "react";

import AirIcon from "@mui/icons-material/Air";
import { Box, Stack, Typography } from "@mui/material";

import {
  BarChart,
  DataGrid,
  Legend,
  PieChart,
  SearchInput,
} from "@/components/molecules";
import { iconStyles } from "@/styles/others/muiIconStyles";

import { MarketsGridRowDetails } from "../MarketsPage.selectors";
import {
  chartContainerStyle,
  detailsContainerStyle,
  innerChartContainerStyle,
  legendStyle,
  placeholderWrapper,
  searchInputStyle,
} from "./RowDetails.styles";
import { useRowDetails } from "./useRowDetails";

export type RowDetailsProps = {
  dataProvider: MarketsGridRowDetails;
};

const RowDetailsContents = memo(({ dataProvider }: RowDetailsProps) => {
  const {
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
  } = useRowDetails(dataProvider);

  return (
    <Stack sx={detailsContainerStyle}>
      <Typography variant="subtitle2" textTransform="uppercase">
        {title}
      </Typography>

      <Stack sx={chartContainerStyle} direction="row" gap={2}>
        <Stack sx={innerChartContainerStyle}>
          <Typography variant="body2">{techTypeLabel}</Typography>
          <PieChart dataProvider={dataProvider.techTypes} />
        </Stack>
        <Box>
          <Legend
            sx={legendStyle}
            dataProvider={dataProvider.techTypes}
            formatValue={formatValue}
          />
        </Box>
        <Stack sx={innerChartContainerStyle}>
          <Typography variant="body2">{vintageLabel}</Typography>
          <BarChart
            dataProvider={dataProvider.vintages}
            columnOrder={dataProvider.techTypeOrder}
          />
        </Stack>
      </Stack>

      <SearchInput
        placeholder={searchText}
        sx={searchInputStyle}
        value={filterText}
        setValue={setFilterText}
        size="small"
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
      <DataGrid
        columns={columnConfig}
        dataProvider={filteredAssets}
        maxHeight={300}
        inline
      >
        {filteredAssets.length === 0 && (
          <Box sx={placeholderWrapper}>
            <AirIcon sx={iconStyles()} />
            <Typography variant="body2" color="primary.gray2">
              {noResultsFound}
            </Typography>
          </Box>
        )}
      </DataGrid>
    </Stack>
  );
});

const RowDetails = ({
  dataProvider: { techTypes, techTypeOrder, vintages, assets },
}: RowDetailsProps) => {
  const memoizedDataProvider = useMemo(
    () => ({ techTypes, techTypeOrder, vintages, assets }),
    [techTypes, techTypeOrder, vintages, assets]
  );

  return <RowDetailsContents dataProvider={memoizedDataProvider} />;
};

export default RowDetails;
