import { useTranslation } from "next-i18next";

import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import {
  IconButton,
  SortAscending,
  SortDescending,
  SortNone,
} from "@/components/atoms";
import { noop } from "@/utils/functions";
import { evaluate } from "@/utils/logic";

import { namespace } from "../config";
import { ColumnProps, HeaderClickFunc, Order, RowProps } from "../types";
import { headRowStyle, sortIconStyle, sortLabelStyle } from "./Header.styles";

type HeaderProps = {
  columns: ColumnProps[];
  order: Order;
  orderBy: string;
  populated: boolean;
  noExtraPadding: boolean;
  onRequestSort: (columnName: string) => void;
  onClick: HeaderClickFunc | null;
  sortedDataProvider: RowProps[];
  showInfoColumn?: boolean;
  inline?: boolean;
};

type SortIconProps = {
  columnName: string;
  sortable: boolean;
  disabled: boolean;
  orderBy: string;
  order: string;
};

const createSortIcon = (props: SortIconProps) => () => {
  if (!props.sortable) return null;

  const SortIcon = evaluate(
    [props.order === Order.asc, SortAscending],
    [props.order === Order.desc, SortDescending],
    [props.orderBy !== props.columnName, SortNone]
  ) as React.FC;

  return (
    <IconButton sx={sortIconStyle(props.disabled)} size="small" variant="text">
      <SortIcon />
    </IconButton>
  );
};

const Header = ({
  columns,
  order,
  orderBy,
  populated,
  noExtraPadding,
  onRequestSort,
  onClick,
  sortedDataProvider,
  showInfoColumn,
  inline,
}: HeaderProps) => {
  const { t } = useTranslation(namespace);
  const createSortHandler = (columnName: string) => () => {
    onRequestSort(columnName);
  };
  const infoLabel = t(`${namespace}:info`);

  return (
    <TableHead sx={headRowStyle(noExtraPadding, inline)}>
      <TableRow>
        {columns.map((column) => {
          const SortIconComponent = createSortIcon({
            columnName: column.key,
            sortable:
              (column?.sortable && sortedDataProvider?.length > 1) ?? false,
            disabled: !populated,
            orderBy,
            order,
          });
          const isHeaderRenderer = Boolean(column.headerRenderer);

          return (
            <TableCell
              key={`col-${column.key}`}
              width={column?.width}
              sortDirection={order}
              align={column?.align ?? "left"}
            >
              <TableSortLabel
                sx={sortLabelStyle(column?.align)}
                active
                disabled={!column?.sortable || !populated}
                IconComponent={SortIconComponent}
                onClick={createSortHandler(column.key)}
              >
                {isHeaderRenderer &&
                  column.headerRenderer?.(column, onClick ?? noop)}
                {!isHeaderRenderer && (
                  <Typography
                    variant="body3"
                    color="primary.gray2"
                    textAlign={column?.align ?? "left"}
                  >
                    {column.title}
                  </Typography>
                )}
              </TableSortLabel>
            </TableCell>
          );
        })}
        {showInfoColumn && (
          <TableCell>
            <Typography variant="body3" color="primary.gray2" textAlign="left">
              {infoLabel}
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
};

export default Header;
