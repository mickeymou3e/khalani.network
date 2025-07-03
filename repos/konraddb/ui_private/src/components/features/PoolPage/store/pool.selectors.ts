import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import * as dateFns from "date-fns";

import { areAssetsEqual } from "@/definitions/config";
import { Symbols, Tokens } from "@/definitions/types";
import { RootState } from "@/store";
import {
  Attribute,
  BatchHistoryItem,
  findAttribute,
  selectEnergyAttributeTokens,
  selectPoolDeposits,
  SingleHistoryItem,
  TokenMetadataResponse,
} from "@/store/ancillary";
import { selectIsValidLogin } from "@/store/auth";
import { selectBalancesList, selectCryptoBalancesList } from "@/store/balances";
import { PoolModes, SelectionItem } from "@/store/pool/pool.types";
import { formatValue } from "@/utils/formatters";

import { selectPoolHistoryResult } from "./pool.api";
import { PoolRedeemHistoryStatus, PoolRedemptionList } from "./pool.types";

export const selectMode = (state: RootState) => state.pool.mode;

export const selectSelectedAssetKey = (state: RootState) =>
  state.pool.selectedAssetKey;

export const selectSelectedPoolKey = (state: RootState) =>
  state.pool.selectedPoolKey;

export const selectSelectionList = (state: RootState) =>
  state.pool.selectionList;

export const selectEligibleEnergyAttributeTokens = createSelector(
  [selectEnergyAttributeTokens],
  (energyAttributeTokens = []) =>
    energyAttributeTokens.filter((token) => token.eligibleForPooling)
);

export const selectSelectedAsset = createSelector(
  [
    selectMode,
    selectPoolDeposits,
    selectEnergyAttributeTokens,
    selectSelectedAssetKey,
  ],
  (
    mode = PoolModes.Deposit,
    poolDepositAssets = [],
    eatAssets = [],
    selectedAssetKey = ""
  ) => {
    const assets = mode === PoolModes.Deposit ? eatAssets : poolDepositAssets;
    return assets.find((item) => item.id === selectedAssetKey) ?? null;
  }
);

export const selectSelectedPoolDeposit = createSelector(
  [selectPoolDeposits, selectSelectedAssetKey],
  (selectedAsset, selectedAssetKey) =>
    selectedAsset.find((item) => item.id === selectedAssetKey) ?? null
);

export const selectSelectedPoolData = createSelector(
  [selectBalancesList, selectSelectedPoolKey],
  (balancesList, selectedPoolKey) => {
    if (!selectedPoolKey) return null;

    const balance = balancesList.find((item) =>
      areAssetsEqual(item.id, selectedPoolKey)
    );

    return balance || null;
  }
);

export const selectSelectedPoolBalance = createSelector(
  [selectSelectedPoolData],
  (selectedPoolData) => {
    if (!selectedPoolData) return null;

    return {
      balance: selectedPoolData.base.availableToAux,
      balanceValue: selectedPoolData.base.availableToAuxValue,
    };
  }
);

export const selectSelectedPoolDepositBalance = createSelector(
  [selectSelectedPoolDeposit],
  (poolDeposit) => ({
    balance: poolDeposit
      ? formatValue(poolDeposit.balanceValue)
      : Symbols.NoBalance,
    balanceValue: poolDeposit ? poolDeposit.balanceValue : 0,
  })
);

export const selectAssetsSelectionExists = createSelector(
  selectSelectionList,
  (selectionList) => selectionList.length > 0
);

export const selectPoolSelections = createSelector(
  [selectIsValidLogin, selectCryptoBalancesList, selectSelectionList],
  (isValidLogin, cryptoBalances, selectionList): SelectionItem[] => {
    if (!isValidLogin) return [];

    return selectionList.reduce((poolSelections, item) => {
      const balance = cryptoBalances.find((balance) =>
        areAssetsEqual(balance.id, item.poolKey)
      )!;

      const existingItem = poolSelections.find(
        (item) => item.id === balance.id
      );

      return existingItem
        ? poolSelections.map((poolSelection) => {
            if (poolSelection.id !== existingItem.id) return poolSelection;

            const newValue = new BigNumber(existingItem.amountValue)
              .plus(item.amount)
              .toNumber();

            return {
              ...poolSelection,
              amount: formatValue(newValue),
              amountValue: newValue,
            };
          })
        : [
            ...poolSelections,
            {
              id: balance.id,
              name: balance.assetName,
              icon: balance?.icon ?? "",
              amount: formatValue(item.amount),
              amountValue: item.amount,
            },
          ];
    }, [] as SelectionItem[]);
  }
);

export const selectAssetSelections = createSelector(
  [
    selectIsValidLogin,
    selectMode,
    selectPoolDeposits,
    selectEnergyAttributeTokens,
    selectSelectionList,
  ],
  (
    isLoggedIn,
    mode = PoolModes.Deposit,
    poolDepositAssets = [],
    eatAssets = [],
    selectionList = []
  ): SelectionItem[] => {
    if (!isLoggedIn) return [];

    return selectionList.map((item) => {
      const assets = mode === PoolModes.Deposit ? eatAssets : poolDepositAssets;
      const asset = assets.find((asset) => asset.id === item.assetKey)!;

      return {
        id: asset.id,
        name: asset.generator,
        icon: asset.icon,
        amount: formatValue(item.amount),
        amountValue: item.amount,
      };
    });
  }
);

export const selectRemainingForPooling = createSelector(
  [selectSelectedAsset, selectAssetSelections],
  (selectedAsset, selections = []) => {
    if (!selectedAsset)
      return {
        value: 0,
        formattedValue: Symbols.NoBalance,
      };

    const assetSelection =
      selections.find(({ id }) => id === selectedAsset.id)?.amountValue ?? 0;

    const value = new BigNumber(selectedAsset.balanceValue)
      .minus(assetSelection)
      .toNumber();

    return {
      value,
      formattedValue: formatValue(value),
    };
  }
);

export const selectRemainingForRedemption = createSelector(
  [selectSelectedAsset, selectSelectedPoolBalance, selectAssetSelections],
  (selectedAsset, poolBalance, selections = []) => {
    if (!selectedAsset || !poolBalance)
      return {
        value: 0,
        formattedValue: Symbols.NoBalance,
      };

    const similarSelectionValue =
      selections.find(({ id }) => id === selectedAsset.id)?.amountValue ?? 0;
    const otherAssetSelectionsValue = selections.reduce(
      (acc, item) =>
        item.id === selectedAsset.id ? acc : acc.plus(item.amountValue),
      new BigNumber(0)
    );
    const maxRedeemableValue = Math.min(
      new BigNumber(poolBalance.balanceValue)
        .minus(otherAssetSelectionsValue)
        .toNumber(),
      selectedAsset.balanceValue
    );
    const value = Math.max(
      new BigNumber(maxRedeemableValue).minus(similarSelectionValue).toNumber(),
      0
    );

    return {
      value,
      formattedValue: formatValue(value),
    };
  }
);

const formatHistoryEntry = ({
  id,
  value,
  transaction,
  token,
}: {
  id: string;
  value: string;
  transaction: SingleHistoryItem | BatchHistoryItem;
  token?: TokenMetadataResponse;
}) => {
  const date = new Date(Number(transaction.blockTimestamp) * 1000);
  const isPooling =
    transaction.to.toLowerCase() ===
    process.env.NEXT_PUBLIC_JASMINE_TOKEN_ADDRESS?.toLowerCase();

  const generator = token
    ? findAttribute(token.attributes, Attribute.Generator)
    : "";

  return {
    id,
    timestamp: transaction.blockTimestamp,
    date: dateFns.format(date, "yyyy-MM-dd"),
    time: dateFns.format(date, "HH:mm:ss"),
    creditPooled: isPooling ? generator : "",
    redeemedFrom: !isPooling ? Tokens.JLT : "",
    amountPooled: isPooling ? value : "",
    amountRedeemed: !isPooling ? value : "",
    pooledInto: isPooling ? Tokens.JLT : "",
    redeemedInto: !isPooling ? generator : "",
    amountReceived: value,
    fee: formatValue(0),
    status: PoolRedeemHistoryStatus.Completed,
    from: transaction.from,
    to: transaction.to,
    isPooling,
  };
};

export const selectPoolHistory = createSelector(
  [selectIsValidLogin, selectPoolHistoryResult],
  (isLoggedIn, poolHistoryResult) => {
    if (!poolHistoryResult || !isLoggedIn)
      return { pooling: [], redemption: [] };

    const singles = poolHistoryResult.transferSingles.map((transaction) =>
      formatHistoryEntry({
        transaction,
        id: transaction.transactionHash,
        value: formatValue(Number(transaction.value)),
        token: transaction.metadata,
      })
    );
    const batches = poolHistoryResult.transferBatches.flatMap((transaction) =>
      transaction.ids.map((id, idx) =>
        formatHistoryEntry({
          transaction,
          id: `${transaction.transactionHash}-${id}`,
          value: formatValue(Number(transaction.values[idx])),
          token: transaction.metadata?.find((data) => data.tokenId === id),
        })
      )
    );

    return [...singles, ...batches]
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
      .reduce(
        (acc, item) => ({
          pooling: item.isPooling ? [...acc.pooling, item] : acc.pooling,
          redemption: item.isPooling
            ? acc.redemption
            : [...acc.redemption, item],
        }),
        { pooling: [], redemption: [] } as PoolRedemptionList
      );
  }
);
