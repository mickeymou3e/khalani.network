import { useTranslation } from "next-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";
import { selectBalancesList } from "@/store/balances";
import {
  selectHideZeroBalances,
  selectPageSize,
  selectSearchText,
} from "@/store/ui/ui.selectors";
import { changePageSize } from "@/store/ui/ui.store";
import { filterOptions } from "@/utils/filter.helpers";

import { namespace } from "../config";
import { createPortfolioColumns } from "./config";

export const usePortfolio = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const searchText = useAppSelector(selectSearchText);
  const pageSize = useAppSelector(selectPageSize);
  const balancesList = useAppSelector(selectBalancesList);
  const columns = createPortfolioColumns(t);
  const hideZeroBalances = useAppSelector(selectHideZeroBalances);
  const dataProviderBase = hideZeroBalances
    ? balancesList.filter((balance) => balance.base.totalValue > 0)
    : balancesList;
  const dataProvider = filterOptions(dataProviderBase, searchText) ?? [];
  const noDataText = t(`${namespace}:noPortfolio`);
  const loginText = t(`${namespace}:login`);
  const actionText = t(`${namespace}:loginToReviewPortfolio`);

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changePageSize(pageSize as number));
  };

  return {
    isLoggedIn,
    columns,
    dataProvider,
    noDataText,
    loginText,
    actionText,
    pageSize,
    handlePageSizeChange,
  };
};
