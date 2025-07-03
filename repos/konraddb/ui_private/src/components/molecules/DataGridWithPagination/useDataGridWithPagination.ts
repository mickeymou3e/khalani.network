import { useEffect, useReducer } from "react";
import { useTranslation } from "next-i18next";

import { Order, RowProps } from "../DataGrid/types";
import { namespace } from "./config";
import { sortDataProvider } from "./useDataGridWithPagination.helpers";
import {
  DataGridActions,
  initialState,
  reducer,
} from "./useDataGridWithPagination.reducer";

type UseDataGridProps = {
  defaultPageSize?: number;
  dataProvider: RowProps[];
};

const useDataGridWithPagination = ({
  defaultPageSize = 0,
  dataProvider,
}: UseDataGridProps) => {
  const { t } = useTranslation(namespace);
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    pageSize: defaultPageSize,
  });

  const paginationSize = defaultPageSize
    ? Math.max(1, Math.ceil(dataProvider.length / defaultPageSize))
    : 1;
  const rowCountLabel = t(`${namespace}:rowCount`);

  useEffect(() => {
    dispatch({ type: DataGridActions.PAGE_SIZE, payload: defaultPageSize });
    dispatch({ type: DataGridActions.CURRENT_PAGE, payload: 1 });
  }, [defaultPageSize]);

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
    paginationSize,
    rowCountLabel,
    handleSort,
    handlePaginationChange,
  };
};

export default useDataGridWithPagination;
