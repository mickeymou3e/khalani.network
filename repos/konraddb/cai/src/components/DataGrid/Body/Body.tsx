import React, { Fragment, useState } from "react";

import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { TableBody, TableCell, TableRow, Typography } from "@mui/material";

import {
  CellClickFunc,
  ColumnProps,
  RowClickFunc,
  RowProps,
  RowSelectedPredicate,
} from "../types";
import { rowStyle, tableBodyStyle } from "./Body.styles";
import { IconButton } from "@/components/IconButton";

type BodyProps = {
  columns: ColumnProps[];
  dataProvider: RowProps[];
  noExtraPadding: boolean;
  inline?: boolean;
  renderRowContents?: (dataProvider: unknown) => React.ReactNode;
  onCellClick: CellClickFunc | null;
  onRowClick: RowClickFunc | null;
  isRowSelected: RowSelectedPredicate | null;
};

const Body = ({
  columns,
  dataProvider,
  noExtraPadding,
  inline = false,
  renderRowContents,
  onCellClick,
  onRowClick,
  isRowSelected,
}: BodyProps) => {
  const [openedRows, setOpenedRows] = useState<string[]>([]);
  const isCellRendererAvailable = Boolean(
    columns.some((column) => Boolean(column.cellRenderer))
  );

  const handleDisplayRowContents = (id: string) => {
    openedRows.includes(id)
      ? setOpenedRows(openedRows.filter((rowId) => rowId !== id))
      : setOpenedRows([...openedRows, id]);
  };

  const isRowContentsOpened = (id: string) => openedRows.includes(id);

  return (
    <TableBody sx={tableBodyStyle}>
      {dataProvider.map((row) => (
        <Fragment key={`row-${row.id}`}>
          <TableRow
            sx={rowStyle(noExtraPadding, inline)}
            hover={Boolean(onRowClick)}
            selected={
              isRowSelected ? isRowSelected(row) : (row.selected as boolean)
            }
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((column) => {
              const isCellRenderer = Boolean(column.cellRenderer);

              const handleCellClick = () => {
                if (isCellRendererAvailable) return;

                onCellClick?.(row, column);
              };

              return (
                <TableCell
                  key={`cell-${row.id}-${column.key}`}
                  width={column?.width}
                  onClick={handleCellClick}
                  data-testid={`cell-${row.id}-${column.key}`}
                >
                  {isCellRenderer &&
                    column.cellRenderer?.(
                      row,
                      column,
                      onCellClick ?? (() => true)
                    )}
                  {!isCellRenderer && (
                    <Typography
                      variant="body2"
                      justifyContent={column?.align ?? "left"}
                    >
                      {row[column.key]}
                    </Typography>
                  )}
                </TableCell>
              );
            })}
            {renderRowContents && (
              <TableCell key={`cell-${row.id}-collapse`} width="1px">
                <IconButton
                  variant="outlined"
                  size="small"
                  disabled={!row.contents}
                  onClick={() => handleDisplayRowContents(row.id)}
                  data-testid="expanding-button"
                >
                  {isRowContentsOpened(row.id) ? (
                    <KeyboardArrowUpOutlinedIcon />
                  ) : (
                    <KeyboardArrowDownOutlinedIcon />
                  )}
                </IconButton>
              </TableCell>
            )}
          </TableRow>
          {renderRowContents && openedRows.includes(row.id) && (
            <TableRow
              key={`row-${row.id}-collapsible`}
              sx={rowStyle(noExtraPadding, false, true)}
            >
              <TableCell colSpan={columns.length + 1}>
                {renderRowContents(row.contents)}
              </TableCell>
            </TableRow>
          )}
        </Fragment>
      ))}
    </TableBody>
  );
};

export default Body;
