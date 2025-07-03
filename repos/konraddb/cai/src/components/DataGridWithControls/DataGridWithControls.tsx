import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ColumnProps, RowProps } from "../DataGrid/types";
import { useFilterGrid } from "../DataGrid/useFilterGrid";
import { getKeys } from "@/utils/filter";
import { DataGrid } from "../DataGrid/DataGrid";
import { SearchInput } from "../SearchInput";
import { ToggleButtonGroup } from "../ToggleButtonGroup";
import { ValuesProps } from "../ToggleButtonGroup/ToggleButtonGroup";
import { Button } from "../Button";

interface DataGridWithControlsProps {
  listLength: number;
  columnConfig: ColumnProps[];
  dataProvider: RowProps[];
  datagridLabel?: string;
  gridTabs?: ValuesProps[];
  selectedGridTab?: string;
  handleGridTabChange?: (_: any, value: string) => void;
  filterExclusions?: string[];
  emptyGridPlaceholder?: string;
  emptyGridPlaceholderIcon?: React.ReactNode;
  children?: React.ReactNode;
  collapseHeader?: boolean;
  showCsvButton?: boolean;
  onPageSizeChange: (listLength: unknown) => void;
  handleCellClicked?: (row: any, column: any) => void;
  buttonText?: string;
  handleButtonClick?: () => void;
  enableHorizontalScroll?: boolean;
}

const DataGridWithControls = ({
  listLength,
  columnConfig,
  dataProvider,
  datagridLabel,
  gridTabs = [],
  selectedGridTab,
  handleGridTabChange,
  filterExclusions = [],
  emptyGridPlaceholder = "",
  emptyGridPlaceholderIcon = null,
  children = null,
  enableHorizontalScroll = false,
  collapseHeader = false,
  showCsvButton = false,
  onPageSizeChange,
  handleCellClicked = () => {},
  buttonText = "",
  handleButtonClick = () => {},
}: DataGridWithControlsProps) => {
  const gridValues = useFilterGrid(dataProvider ?? [], {
    include: !filterExclusions.length ? getKeys(columnConfig) : [],
    exclude: filterExclusions,
  });

  return (
    <Stack spacing="1.5rem">
      <Stack direction="row" justifyContent="space-between">
        {datagridLabel && (
          <Typography variant="subtitle1" color="primary.gray2">
            {datagridLabel}
          </Typography>
        )}

        {gridTabs.length > 0 && selectedGridTab && handleGridTabChange && (
          <ToggleButtonGroup
            values={gridTabs}
            currentValue={selectedGridTab}
            handleAction={handleGridTabChange}
          />
        )}

        <Stack direction="row" alignItems="center" gap={3}>
          <SearchInput
            setValue={gridValues.setSearchText}
            placeholder={"Search"}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{ width: "240px" }}
            value={gridValues.searchText}
            disabled={!gridValues.dataProvider.length && !gridValues.searchText}
          />
          {buttonText && (
            <Button variant="contained" onClick={handleButtonClick}>
              {buttonText}
            </Button>
          )}
        </Stack>
      </Stack>

      <DataGrid
        columns={columnConfig}
        dataProvider={gridValues.dataProvider}
        placeholder={emptyGridPlaceholder}
        placeholderIcon={emptyGridPlaceholderIcon}
        pageSize={listLength}
        onCellClick={(row, column) => handleCellClicked(row, column)}
        onPageSizeChange={onPageSizeChange}
        searchKeyword={gridValues.searchText}
        enableHorizontalScroll={enableHorizontalScroll}
        collapseHeader={collapseHeader}
        showCsvButton={showCsvButton}
      >
        {children}
      </DataGrid>
    </Stack>
  );
};

export default DataGridWithControls;
