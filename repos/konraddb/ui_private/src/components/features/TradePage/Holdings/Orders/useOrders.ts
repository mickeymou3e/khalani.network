import { useTranslation } from "next-i18next";

import { ColumnProps, RowProps } from "@/components/molecules";
import { Backdrops } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account/account.selectors";
import { selectIsValidLogin } from "@/store/auth";
import { openStatefulBackdrop } from "@/store/backdrops";
import { selectUserOpenOrders } from "@/store/orders";
import { selectPageSize, selectSearchText } from "@/store/ui/ui.selectors";
import { changePageSize } from "@/store/ui/ui.store";
import { filterOptions } from "@/utils/filter.helpers";

import { namespace } from "../config";
import { createOrdersColumns, OrdersColumnKeys } from "./config";

export const useOrders = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const isAdmin = useAppSelector(selectIsAdminUser);
  const columns = createOrdersColumns(isAdmin, t);
  const searchText = useAppSelector(selectSearchText);
  const pageSize = useAppSelector(selectPageSize);
  const dataProviderBase = useAppSelector(selectUserOpenOrders);
  const dataProvider = filterOptions(dataProviderBase, searchText);
  const noDataText = t(`${namespace}:noOrders`);
  const loginText = t(`${namespace}:login`);
  const actionText = t(`${namespace}:loginToTrade`);

  const handleCellClick = (row: RowProps, column: ColumnProps) => {
    if (column.key !== OrdersColumnKeys.Action) return;

    dispatch(
      openStatefulBackdrop({
        backdrop: Backdrops.CANCEL_ORDERS,
        parameters: row.orderId,
      })
    );
  };

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changePageSize(pageSize as number));
  };

  return {
    isLoggedIn,
    columns,
    noDataText,
    dataProvider,
    loginText,
    actionText,
    pageSize,
    handleCellClick,
    handlePageSizeChange,
  };
};
