import React from "react";

export enum TextAlignments {
  left = "left",
  center = "center",
  right = "right",
}

export enum VerticalAlignments {
  top = "top",
  center = "center",
  bottom = "bottom",
}

export enum Order {
  asc = "asc",
  desc = "desc",
}

export type RowProps = {
  [key: string]: any;
  contents?: unknown;
};

export type HeaderClickFunc = (column: ColumnProps) => void;

export type CellClickFunc = (row: RowProps, column: ColumnProps) => void;

export type RowClickFunc = (row: RowProps) => void;

export type RowSelectedPredicate = (row: RowProps) => boolean;

export type ColumnProps = {
  key: string;
  title: string;
  width?: string;
  align?: keyof typeof TextAlignments;
  invisible?: boolean;
  sortable?: boolean;
  cellRenderer?: (
    row: RowProps,
    column: ColumnProps,
    onClick: CellClickFunc
  ) => React.ReactElement | null;
  headerRenderer?: (
    column: ColumnProps,
    onClick: HeaderClickFunc
  ) => React.ReactElement | null;
};

export type CollapsibleComponentProps = {
  dataProvider?: RowProps[];
};

export type DataGridProps = {
  columns: ColumnProps[];
  dataProvider: RowProps[];
  placeholder?: string;
  placeholderIcon?: React.ReactNode;
  pageSize?: number;
  maxHeight?: number | string;
  children?: React.ReactNode;
  collapseHeader?: boolean;
  enableHorizontalScroll?: boolean;
  searchKeyword?: string;
  inline?: boolean;
  order?: Order | null;
  orderBy?: string;
  renderRowContents?: (dataProvider: any) => React.ReactNode;
  onHeaderClick?: HeaderClickFunc | null;
  onCellClick?: CellClickFunc | null;
  onRowClick?: RowClickFunc | null;
  onPageSizeChange?: (pageSize: unknown) => void;
  onSort?: (orderBy: string) => void;
  isRowSelected?: RowSelectedPredicate | null;
};
