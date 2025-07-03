import { useEffect, useReducer } from "react";
import { useTranslation } from "next-i18next";

import { namespace } from "./config";
import { ColumnProps, Order, RowProps } from "./types";
import { sortDataProvider } from "./useDataGrid.helpers";
import { DataGridActions, initialState, reducer } from "./useDataGrid.reducer";

type UseDataGridProps = {
  columns: ColumnProps[];
  dataProvider: RowProps[];
  children?: React.ReactNode;
  pageSize?: number;
};

const useDataGrid = ({
  columns,
  dataProvider,
  children,
  pageSize = 0,
}: UseDataGridProps) => {
  const { t } = useTranslation(namespace);
  const [state, dispatch] = useReducer(reducer, { ...initialState, pageSize });
  const visibleColumns = columns.filter((column) => !column?.invisible);
  const isPopulated = !!dataProvider.length;
  const shouldShowPlaceholder = !isPopulated || !!children;
  const shouldShowBody = isPopulated && !children;
  const paginationSize = pageSize
    ? Math.max(1, Math.ceil(dataProvider.length / pageSize))
    : 1;
  const rowCountLabel = t(`${namespace}:rowCount`);

  useEffect(() => {
    dispatch({ type: DataGridActions.PAGE_SIZE, payload: pageSize });
    dispatch({ type: DataGridActions.CURRENT_PAGE, payload: 1 });
  }, [pageSize]);

  useEffect(() => {
    const sortedDataProvider = sortDataProvider(dataProvider, state);
    dispatch({
      type: DataGridActions.DATAPROVIDER,
      payload: sortedDataProvider,
    });
  }, [
    dataProvider,
    state.order,
    state.orderBy,
    state.currentPage,
    state.pageSize,
  ]);

  const handleSort = (columnName: string) => {
    const isDesc = state.orderBy === columnName && state.order === Order.desc;
    if (isDesc) {
      dispatch({ type: DataGridActions.ORDER_BY, payload: "" });
      return;
    }

    const isAsc = state.orderBy === columnName && state.order === Order.asc;
    dispatch({
      type: DataGridActions.ORDER_DIRECTION,
      payload: isAsc ? Order.desc : Order.asc,
    });
    dispatch({ type: DataGridActions.ORDER_BY, payload: columnName });
  };

  const handlePaginationChange = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    dispatch({ type: DataGridActions.CURRENT_PAGE, payload: value });
  };

  return {
    state,
    visibleColumns,
    isPopulated,
    shouldShowPlaceholder,
    shouldShowBody,
    paginationSize,
    rowCountLabel,
    handleSort,
    handlePaginationChange,
  };
};

export default useDataGrid;
