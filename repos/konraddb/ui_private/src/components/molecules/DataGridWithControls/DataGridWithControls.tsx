import { useTranslation } from "next-i18next";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  ColumnProps,
  DataGrid,
  RowProps,
  SearchInput,
} from "@/components/molecules";

import { useDataGridWithControls } from "./useDataGridWithControls";

interface DataGridWithControlsProps {
  datagridLabel: string;
  listLength: number;
  columnConfig: ColumnProps[];
  dataProvider: RowProps[];
  emptyGridPlaceholder?: string;
  emptyGridPlaceholderIcon?: React.ReactNode;
  children?: React.ReactNode;
  onPageSizeChange: (listLength: unknown) => void;
  handleCellClicked?: (row: any, column: any) => void;
  enableHorizontalScroll?: boolean;
}

const DataGridWithControls = ({
  datagridLabel,
  listLength,
  columnConfig,
  dataProvider,
  emptyGridPlaceholder = "",
  emptyGridPlaceholderIcon = null,
  children = null,
  enableHorizontalScroll = false,
  onPageSizeChange,
  handleCellClicked = () => {},
}: DataGridWithControlsProps) => {
  const commonNamespace = "common";
  const { t } = useTranslation(commonNamespace);

  const { searchKeyword, setSearchKeyword, filteredDataProvider } =
    useDataGridWithControls({
      dataProvider,
    });

  return (
    <Stack spacing="1.5rem">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle1" color="primary.gray2">
          {datagridLabel}
        </Typography>

        <SearchInput
          setValue={setSearchKeyword}
          placeholder={t(`${commonNamespace}:search`) ?? ""}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          size="small"
          sx={{ width: "240px" }}
          value={searchKeyword}
          disabled={!filteredDataProvider.length && !searchKeyword}
        />
      </Stack>

      <DataGrid
        columns={columnConfig}
        dataProvider={filteredDataProvider}
        placeholder={emptyGridPlaceholder}
        placeholderIcon={emptyGridPlaceholderIcon}
        pageSize={listLength}
        onCellClick={(row, column) => handleCellClicked(row, column)}
        onPageSizeChange={onPageSizeChange}
        searchKeyword={searchKeyword}
        enableHorizontalScroll={enableHorizontalScroll}
      >
        {children}
      </DataGrid>
    </Stack>
  );
};

export default DataGridWithControls;
