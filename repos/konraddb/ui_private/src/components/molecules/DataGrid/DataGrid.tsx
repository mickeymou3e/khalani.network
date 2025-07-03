import { forwardRef, memo } from "react";

import {
  Box,
  Pagination,
  Table,
  TableContainer,
  Typography,
} from "@mui/material";

import useDetectScrollbar from "@/hooks/useDetectScrollbar";

import { SelectBase } from "../Select";
import { Body } from "./Body";
import { pageSizeOptions } from "./config";
import {
  innerContainerStyle,
  outerTableContainerStyle,
  pageSizeContainer,
  paginationContainerStyle,
  paginationStyle,
  tableStyle,
} from "./DataGrid.styles";
import { Header } from "./Header";
import { Placeholder } from "./Placeholder";
import { DataGridProps } from "./types";
import useDataGrid from "./useDataGrid";

export const DataGrid = memo(
  forwardRef<HTMLDivElement, DataGridProps>(
    (
      {
        columns,
        dataProvider,
        placeholder = "",
        placeholderIcon = null,
        pageSize = 0,
        maxHeight = "100%",
        children = null,
        collapseHeader = false,
        enableHorizontalScroll = false,
        searchKeyword,
        inline = false,
        order = null,
        orderBy = "",
        renderRowContents,
        onHeaderClick = null,
        onCellClick = null,
        onRowClick = null,
        onPageSizeChange,
        onSort,
        isRowSelected = null,
      },
      ref
    ) => {
      const {
        state,
        visibleColumns,
        isPopulated,
        shouldShowPlaceholder,
        shouldShowBody,
        paginationSize,
        rowCountLabel,
        handleSort,
        handlePaginationChange,
      } = useDataGrid({ columns, dataProvider, children, pageSize });
      const { scrollbarDetectRef, hasScrollbar } = useDetectScrollbar();

      return (
        <>
          <TableContainer
            sx={outerTableContainerStyle(
              maxHeight,
              hasScrollbar,
              enableHorizontalScroll,
              inline
            )}
          >
            <TableContainer
              sx={innerContainerStyle(enableHorizontalScroll)}
              ref={ref || scrollbarDetectRef}
            >
              <Table sx={tableStyle(shouldShowPlaceholder)} stickyHeader>
                {!collapseHeader && (
                  <Header
                    columns={visibleColumns}
                    order={order || state.order}
                    orderBy={orderBy || state.orderBy}
                    populated={isPopulated}
                    noExtraPadding={enableHorizontalScroll}
                    onClick={onHeaderClick}
                    onRequestSort={onSort || handleSort}
                    sortedDataProvider={state.sortedDataProvider}
                    showInfoColumn={!!renderRowContents}
                    inline={inline}
                  />
                )}
                {shouldShowPlaceholder && (
                  <Placeholder
                    columns={visibleColumns}
                    placeholder={placeholder}
                    placeholderIcon={placeholderIcon}
                    searchKeyword={searchKeyword}
                  >
                    {children}
                  </Placeholder>
                )}
                {shouldShowBody && (
                  <Body
                    columns={visibleColumns}
                    dataProvider={state.sortedDataProvider || []}
                    renderRowContents={renderRowContents}
                    noExtraPadding={enableHorizontalScroll}
                    onRowClick={onRowClick}
                    onCellClick={onCellClick}
                    isRowSelected={isRowSelected}
                    inline={inline}
                  />
                )}
              </Table>
            </TableContainer>
          </TableContainer>
          {!!pageSize && (
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
                  value={state.pageSize}
                  setValue={onPageSizeChange}
                  disabled={state.sortedDataProvider?.length === 0}
                />
              </Box>
            </Box>
          )}
        </>
      );
    }
  )
);
