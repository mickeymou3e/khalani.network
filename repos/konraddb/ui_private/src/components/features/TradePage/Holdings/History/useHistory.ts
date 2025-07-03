import { useCallback, useMemo } from "react";
import { useTranslation } from "next-i18next";

import { ColumnProps, RowProps } from "@/components/molecules";
import { ModalVariants } from "@/definitions/types";
import { downloadCSVFile } from "@/services/file.utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectIsAdminUser,
} from "@/store/account/account.selectors";
import { selectBearerToken, selectIsValidLogin } from "@/store/auth";
import { openStatefulBackdrop } from "@/store/backdrops";
import { selectUserSettledOrders } from "@/store/orders";
import { selectPageSize, selectSearchText } from "@/store/ui/ui.selectors";
import { changePageSize, openModal, setModalParams } from "@/store/ui/ui.store";
import { filterOptions } from "@/utils/filter.helpers";

import { namespace } from "../config";
import { createHistoryColumns, HistoryColumnKeys } from "./config";

export const useHistory = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const isAdmin = useAppSelector(selectIsAdminUser);
  const columns = useMemo(() => createHistoryColumns(isAdmin, t), [t]);
  const searchText = useAppSelector(selectSearchText);
  const pageSize = useAppSelector(selectPageSize);
  const dataProviderBase = useAppSelector(selectUserSettledOrders);
  const token = useAppSelector(selectBearerToken);
  const dataProvider = useMemo(
    () => filterOptions(dataProviderBase, searchText),
    [dataProviderBase, searchText]
  );

  const noDataText = t(`${namespace}:noHistory`);
  const loginText = t(`${namespace}:login`);
  const actionText = t(`${namespace}:loginToReviewHistory`);
  const csvText = t(`${namespace}:csv`);

  const handleSaveCSVClick = () => {
    downloadCSVFile(token, "history");
  };

  const handleCellClick = useCallback(
    (row: RowProps, column: ColumnProps) => {
      if (column.key !== HistoryColumnKeys.Action) return;

      dispatch(openModal(ModalVariants.OrderDetails));
      dispatch(setModalParams(row.id));
    },
    [dispatch, openStatefulBackdrop]
  );

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changePageSize(pageSize as number));
  };

  return {
    isLoggedIn,
    isAdmin,
    columns,
    noDataText,
    dataProvider,
    loginText,
    actionText,
    csvText,
    pageSize,
    handleSaveCSVClick,
    handleCellClick,
    handlePageSizeChange,
  };
};
