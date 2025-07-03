import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import * as dateFns from "date-fns";

import { Symbols, Tokens } from "@/definitions/types";
import { RootState } from "@/store";
import {
  BatchHistoryItem,
  EnergyAttributeTokenProps,
  findAttribute,
  selectEnergyAttributeTokens,
  SingleHistoryItem,
  TokenMetadataResponse,
} from "@/store/ancillary";
import { Attribute } from "@/store/ancillary/ancillary.types";
import { selectCryptoBalancesList } from "@/store/balances";
import { formatValue } from "@/utils/formatters";

import { selectRetireHistoryResult } from "./retire.api";
import { DropdownAssets, PoolOptions, SelectionItem } from "./retire.types";

export const selectSelectionList = (state: RootState) =>
  state.retire.selectionList;

export const selectSelectedAssetKey = (state: RootState) =>
  state.retire.selectedAsset;

// TODO: Remove, use selectCryptoBalancesList instead directly
export const selectPoolTokens = createSelector(
  [selectCryptoBalancesList],
  (balanceAssets = []) =>
    balanceAssets.map((asset) => ({
      id: asset.id,
      asset: asset.asset,
      description: asset.description,
      icon: asset.icon,
      balance: asset.base.availableToAux,
      balanceValue: asset.base.availableToAuxValue,
      total: asset.base.total,
    })) as PoolOptions[]
);

export const selectSelectedAsset = createSelector(
  [selectSelectedAssetKey, selectEnergyAttributeTokens, selectPoolTokens],
  (assetKey = "", eats = [], poolTokens = []) => {
    const pool = poolTokens.find((item) => item.id === assetKey);
    const eat = eats.find((item) => item.id === assetKey);

    if (!pool && !eat) return null;

    return {
      id: pool?.id ?? eat?.id,
      asset: pool?.asset ?? eat?.generator,
      icon: pool?.icon ?? eat?.icon,
      balance: pool?.balance ?? eat?.strategyBalance,
      balanceValue: pool?.balanceValue ?? eat?.strategyBalanceValue,
      total: pool?.total ?? 0,
    } as DropdownAssets;
  }
);

export const selectSelectedAssetBalance = createSelector(
  selectSelectedAsset,
  (selectedAsset) => ({
    balance: selectedAsset?.balance,
    balanceValue: selectedAsset?.balanceValue,
    total: selectedAsset?.total,
  })
);

export const selectIsPoolTokenSelected = createSelector(
  selectSelectedAssetKey,
  (selectedAssetKey) =>
    selectedAssetKey?.toLowerCase() === Tokens.JLT.toLowerCase()
);

export const selectAssetSelections = createSelector(
  [selectSelectionList, selectPoolTokens, selectEnergyAttributeTokens],
  (selectionList, poolTokens = [], eats = []): SelectionItem[] => {
    const transformAssets = <T extends PoolOptions | EnergyAttributeTokenProps>(
      assets: T[]
    ) =>
      selectionList
        .map((listEntry) => {
          const currentAsset = assets.find(
            (asset) => asset.id === listEntry.asset
          )!;

          if (!currentAsset) return null;

          return {
            id: currentAsset.id,
            name:
              "asset" in currentAsset
                ? currentAsset.asset
                : currentAsset.generator,
            icon: currentAsset.icon,
            amount: formatValue(listEntry.amount),
            amountValue: listEntry.amount,
          };
        })
        .filter(Boolean);

    return [
      ...transformAssets(poolTokens),
      ...transformAssets(eats),
    ] as SelectionItem[];
  }
);

export const selectRemainingForRetirement = createSelector(
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
  const generator = token
    ? findAttribute(token.attributes, Attribute.Generator)
    : "";
  const registry = token
    ? findAttribute(token.attributes, Attribute.Registry)
    : "";

  return {
    id,
    timestamp: transaction.blockTimestamp,
    date: dateFns.format(date, "yyyy-MM-dd"),
    time: dateFns.format(date, "HH:mm:ss"),
    creditRetired: generator,
    registry,
    amount: value,
    status: "Completed",
    from: transaction.from,
    to: transaction.to,
  };
};

export const selectRetireHistory = createSelector(
  [selectRetireHistoryResult],
  (retireHistoryResult) => {
    if (!retireHistoryResult) return [];

    const singles = retireHistoryResult.transferSingles.map((transaction) =>
      formatHistoryEntry({
        transaction,
        id: transaction.transactionHash,
        value: formatValue(Number(transaction.value)),
        token: transaction.metadata,
      })
    );
    const batches = retireHistoryResult.transferBatches.flatMap((transaction) =>
      transaction.ids.map((id, idx) =>
        formatHistoryEntry({
          transaction,
          id: `${transaction.transactionHash}-${id}`,
          value: formatValue(Number(transaction.values[idx])),
          token: transaction.metadata?.find((data) => data.tokenId === id),
        })
      )
    );

    return [...singles, ...batches].sort((a, b) =>
      a.timestamp < b.timestamp ? 1 : -1
    );
  }
);
