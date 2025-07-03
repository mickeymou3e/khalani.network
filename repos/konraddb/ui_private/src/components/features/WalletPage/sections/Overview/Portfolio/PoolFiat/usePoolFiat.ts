import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { RowProps } from "@/components/molecules";
import { AppRoutes, toDash } from "@/definitions/config";
import { FiatCurrencies, WalletPageTabs } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectCryptoBalancesList,
  selectFiatBalancesList,
} from "@/store/balances";
import {
  changeWalletPageSize,
  selectHidePortfolioValues,
  selectHideZeroBalances,
  selectWalletPageSize,
  setActiveWalletTab,
} from "@/store/ui";
import { setSelectedAsset } from "@/store/wallet";
import { filterOptions } from "@/utils/filter.helpers";

import { namespace } from "../../config";
import { createColumnConfig } from "./config";
import { PoolFiatMode } from "./PoolFiat";

export const usePoolFiat = (mode: PoolFiatMode, searchKeyword: string) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hideValues = useAppSelector(selectHidePortfolioValues);
  const hideZeroBalances = useAppSelector(selectHideZeroBalances);
  const cryptoBalancesList = useAppSelector(selectCryptoBalancesList);
  const fiatBalancesList = useAppSelector(selectFiatBalancesList);
  const listLength = useAppSelector(selectWalletPageSize);
  const isPool = mode === PoolFiatMode.Pool;
  const columns = createColumnConfig(t, hideValues, isPool);
  const balancesList = isPool ? cryptoBalancesList : fiatBalancesList;
  const rawDataProvider = hideZeroBalances
    ? balancesList.filter((balance) => balance.base.totalValue > 0)
    : balancesList;
  const dataProvider = filterOptions(rawDataProvider ?? [], searchKeyword);

  const noDataText = t(`${namespace}:noPortfolio`);
  const zeroBalanceHidden = t(`${namespace}:zeroBalanceHidden`);

  const handleCellClick = (row: RowProps) => {
    if (isPool) {
      router.push(`${AppRoutes.TRADE}/${toDash(row.id)}_${FiatCurrencies.EUR}`);
      return;
    }

    dispatch(setActiveWalletTab(WalletPageTabs.deposits));
    dispatch(setSelectedAsset(row.id));
  };

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changeWalletPageSize(pageSize as number));
  };

  return {
    columns,
    dataProvider,
    hideZeroBalances,
    listLength,
    noDataText,
    zeroBalanceHidden,
    handleCellClick,
    handlePageSizeChange,
  };
};
