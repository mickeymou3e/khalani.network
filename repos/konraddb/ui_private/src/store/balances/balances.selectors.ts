import { createSelector } from "@reduxjs/toolkit";

import { areAssetsEqual, getAssetDetails } from "@/definitions/config";
import { FiatCurrencies } from "@/definitions/types";
import { Balance } from "@/services/balances";
import { selectBalancesResultData } from "@/services/balances/balances.api";
import { selectNeutralCustomerCode } from "@/store/account";
import { selectAllAssetRateDetails } from "@/store/rates";
import { selectSelectedPair } from "@/store/ui/ui.selectors";
import { selectCustodyWalletCodes, selectSelectedAsset } from "@/store/wallet";

import { getBaseBalances, getQuoteBalances } from "./balance.helpers";
import { BalanceData } from "./balances.types";

export const selectBalancesList = createSelector(
  [
    selectCustodyWalletCodes,
    selectNeutralCustomerCode,
    selectBalancesResultData,
    selectAllAssetRateDetails,
  ],
  (custodyWalletCodes = [], customerCode = "", balances = [], rates = []) =>
    balances
      .map((balance): BalanceData => {
        const baseBalances = getBaseBalances(
          balance,
          custodyWalletCodes,
          customerCode
        );
        const quoteBalances = getQuoteBalances(
          baseBalances,
          rates,
          balance.code
        );
        const assetConfig = getAssetDetails(balance.code);

        return {
          id: balance.code,
          asset: balance.code,
          assetName: balance.name,
          description: assetConfig.description,
          icon: assetConfig.icon,
          isFiat: balance?.is_fiat ?? false,
          base: baseBalances,
          quote: quoteBalances,
        };
      })
      .sort((a, b) => (a.base.total < b.base.total ? 1 : -1)),
  {
    memoizeOptions: {
      resultEqualityCheck: (prev: BalanceData[], curr: BalanceData[]) => {
        const reducerFn = (acc: string, entry: BalanceData) =>
          `${acc}${entry.asset}_${entry.quote.availableToAux}_${entry.quote.availableToTrade}_${entry.quote.inOrders}_${entry.quote.total}`;
        const prevIdentifier = prev.reduce(reducerFn, "");
        const currIdentifier = curr.reduce(reducerFn, "");

        return prevIdentifier === currIdentifier;
      },
    },
  }
);

export const selectCryptoBalancesList = createSelector(
  [selectBalancesList],
  (balances) => balances.filter((balance) => !balance.isFiat)
);

export const selectIsCryptoBalancesEmpty = createSelector(
  [selectCryptoBalancesList],
  (balances) => !balances.length
);

export const selectFiatBalancesList = createSelector(
  [selectBalancesList],
  (balances) => balances.filter((balance) => balance.isFiat)
);

export const selectIsFiatBalancesEmpty = createSelector(
  [selectFiatBalancesList],
  (balances) => !balances.length
);

const createAssetValues = ({ code, name }: Balance) => ({
  value: code,
  assets: [
    {
      icon: code,
      label: code,
      description: name,
    },
  ],
});

export const selectCryptoBalanceAssets = createSelector(
  [selectBalancesResultData],
  (balances = []) =>
    balances.filter(({ is_fiat }) => !is_fiat).map(createAssetValues)
);

export const selectFiatBalanceAssets = createSelector(
  [selectBalancesResultData],
  (balances = []) =>
    balances.filter(({ is_fiat }) => is_fiat).map(createAssetValues)
);

export const selectPortfolioChartValues = createSelector(
  [selectBalancesList],
  (balances) => {
    const totalBalance = balances.reduce(
      (acc, balance) => acc + balance.quote.totalValue,
      0
    );

    return balances
      .filter((balance) => balance.quote.totalValue > 0)
      .map(({ asset, quote: { totalValue } }) => ({
        name: asset,
        value: totalValue,
        percentage: Math.round((totalValue / totalBalance) * 100),
      }))
      .sort((a, b) => (a.value < b.value ? 1 : -1));
  }
);

export const selectSelectedAssetBalance = createSelector(
  [selectSelectedPair, selectBalancesList],
  (selectedPair, balances = []) =>
    balances.find((balance) => areAssetsEqual(balance.asset, selectedPair.base))
);

export const selectEuroBalance = createSelector(
  [selectBalancesList],
  (balances = []) =>
    balances.find((balance) => balance.asset === FiatCurrencies.EUR)
);

export const selectPortfolioTotal = createSelector(
  [selectBalancesList],
  (balances = []) =>
    balances.reduce((acc, entry) => acc + entry.quote.totalValue, 0)
);

export const selectSelectedAssetAvailableBalance = createSelector(
  [selectBalancesList, selectSelectedAsset],
  (balancesList = [], selectedAsset = "") => {
    const balance = balancesList.find((item) =>
      areAssetsEqual(item.asset, selectedAsset)
    );

    if (!balance) return null;

    return {
      assetBalance: balance.base.availableToTrade,
      assetBalanceValue: balance.base.availableToTradeValue,
    };
  }
);

export const selectSelectedAssetAvailableWithdrawalBalance = createSelector(
  [selectBalancesList, selectSelectedAsset],
  (balancesList = [], selectedAsset = "") => {
    const balance = balancesList.find((item) =>
      areAssetsEqual(item.asset, selectedAsset)
    );

    if (!balance) return null;

    return {
      assetBalance: balance.base.availableToAux,
      assetBalanceValue: balance.base.availableToAuxValue,
    };
  }
);
