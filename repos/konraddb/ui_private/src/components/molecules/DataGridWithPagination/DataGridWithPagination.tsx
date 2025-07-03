import { Box, Pagination, Typography } from "@mui/material";

import { DataGrid } from "../DataGrid";
import { DataGridProps } from "../DataGrid/types";
import { SelectBase } from "../Select";
import { pageSizeOptions } from "./config";
import {
  pageSizeContainer,
  paginationContainerStyle,
  paginationStyle,
} from "./DataGridWithPagination.styles";
import useDataGridWithPagination from "./useDataGridWithPagination";

export type DataGridWithPaginationProps = DataGridProps & {
  pageSize: number;
  endAdornment?: React.ReactNode;
  onPageSizeChange: (value: number) => void;
};

export const DataGridWithPagination = ({
  pageSize,
  endAdornment,
  onPageSizeChange,
  ...rest
}: DataGridWithPaginationProps) => {
  const {
    state,
    paginationSize,
    rowCountLabel,
    handleSort,
    handlePaginationChange,
  } = useDataGridWithPagination({
    defaultPageSize: pageSize,
    dataProvider: rest.dataProvider,
  });

  return (
    <>
      <DataGrid
        {...rest}
        dataProvider={state.sortedDataProvider}
        order={state.order}
        orderBy={state.orderBy}
        onSort={handleSort}
      />
      <Box sx={paginationContainerStyle}>
        <Pagination
          sx={paginationStyle}
          defaultPage={state.currentPage}
          page={state.currentPage}
          count={paginationSize}
          data-testid="pagination"
          onChange={handlePaginationChange}
        />
        <Box sx={pageSizeContainer}>
          <Typography variant="body2" color="primary.gray2">
            {rowCountLabel}
          </Typography>
          <SelectBase
            size="small"
            options={pageSizeOptions}
            value={pageSize}
            setValue={onPageSizeChange}
            disabled={!state.sortedDataProvider?.length}
          />
          {endAdornment}
        </Box>
      </Box>
    </>
  );
};
