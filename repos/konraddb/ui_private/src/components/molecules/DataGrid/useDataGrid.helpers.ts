import { DataGridState } from "@/components/molecules/DataGrid/useDataGrid.reducer";
import { evaluate } from "@/utils/logic";

import { Order, RowProps } from "./types";

export const sortData = (
  dataProvider: RowProps[],
  orderBy: string,
  order: Order
) =>
  [...dataProvider].sort((prev, curr) => {
    /* 
      Prefer sorting by the raw value of the column if it exists, 
      not by the formatted value. It requires [columnName]Value to exist. 
    */
    const prevValue = prev[`${orderBy}Value`] ?? prev[orderBy];
    const currValue = curr[`${orderBy}Value`] ?? curr[orderBy];
    const orderValue = order === Order.desc ? -1 : 1;

    return evaluate(
      [true, 0],
      [prevValue > currValue, orderValue],
      [prevValue < currValue, -orderValue]
    ) as number;
  });

export const sortDataProvider = (
  dataProvider: RowProps[],
  { order, orderBy, currentPage, pageSize }: DataGridState
) => {
  const sortedDataProvider =
    orderBy === "" ? dataProvider : sortData(dataProvider, orderBy, order);

  if (pageSize) {
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize;

    return sortedDataProvider.slice(from, to);
  }

  return sortedDataProvider;
};
