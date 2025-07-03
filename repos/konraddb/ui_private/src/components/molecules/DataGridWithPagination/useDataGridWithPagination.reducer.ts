import { Order, RowProps } from "../DataGrid/types";

export enum DataGridActions {
  ORDER_DIRECTION = "ORDER_DIRECTION",
  ORDER_BY = "ORDER_BY",
  DATAPROVIDER = "DATAPROVIDER",
  CURRENT_PAGE = "CURRENT_PAGE",
  PAGE_SIZE = "PAGE_SIZE",
}

type DataGridAction = {
  type: DataGridActions;
  payload: any;
};

export type DataGridState = {
  order: Order;
  orderBy: string;
  sortedDataProvider: RowProps[];
  currentPage: number;
  pageSize: number;
};

export const initialState: DataGridState = {
  order: Order.asc,
  orderBy: "",
  sortedDataProvider: [],
  currentPage: 1,
  pageSize: 10,
};

export const reducer = (
  state: DataGridState,
  { type, payload }: DataGridAction
) => ({
  ...state,
  order: type === DataGridActions.ORDER_DIRECTION ? payload : state.order,
  orderBy: type === DataGridActions.ORDER_BY ? payload : state.orderBy,
  sortedDataProvider:
    type === DataGridActions.DATAPROVIDER ? payload : state.sortedDataProvider,
  currentPage:
    type === DataGridActions.CURRENT_PAGE ? payload : state.currentPage,
  pageSize: type === DataGridActions.PAGE_SIZE ? payload : state.pageSize,
});
