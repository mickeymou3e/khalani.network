import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import * as dateFns from "date-fns";

import { Registries } from "@/definitions/config/registry";
import { BridgeStatus, Symbols } from "@/definitions/types";
import { BridgeMode } from "@/features/BridgePage/BridgePage.types";
import { DropdownAssets } from "@/features/BridgePage/store";
import { RootState } from "@/store";
import { selectEnergyAttributeTokens } from "@/store/ancillary";
import { selectIsValidLogin } from "@/store/auth";
import { formatValue } from "@/utils/formatters";

import {
  selectBridgeHistoryResponse,
  selectBridgeRequests,
} from "./bridge.api";
import { AssetTypes } from "./bridge.definitions";
import { SelectionItem } from "./bridge.types";

export const selectBridgeMode = (state: RootState) => state.bridge.mode;

export const selectSelectedBridgeInAsset = (state: RootState) =>
  state.bridge.asset
    ? AssetTypes.find((asset) => asset.id === state.bridge.asset)!
    : null;

export const selectSelectionList = (state: RootState) =>
  state.bridge.selectionList;

export const selectIsSelectionListPopulated = (state: RootState) =>
  Boolean(state.bridge.selectionList.length);

export const selectSelectedBridgeOutAsset = (state: RootState) =>
  state.bridge.asset;

export const selectSelectedTab = (state: RootState) => state.bridge.tab;

export const selectSelectedRegistry = (state: RootState) =>
  state.bridge.registry
    ? Registries.find((registry) => registry.name === state.bridge.registry)!
    : null;

export const selectSelectedRegistryAsset = createSelector(
  selectSelectedRegistry,
  (selectedRegistry) =>
    selectedRegistry
      ? {
          asset: {
            icon: selectedRegistry?.icon,
            label: selectedRegistry?.name,
          },
        }
      : undefined
);

export const selectSelectedBridgeOutAssetDetails = createSelector(
  [selectSelectedBridgeOutAsset, selectEnergyAttributeTokens],
  (asset = "", eats = []) => {
    const eat = eats.find((item) => item.id === asset);

    if (!eat) return null;

    return {
      id: eat?.id,
      asset: eat?.generator,
      registry: eat?.registry,
      icon: eat?.icon,
      balance: eat?.strategyBalance,
      balanceValue: eat?.strategyBalanceValue,
    } as DropdownAssets;
  }
);

export const selectSelectedBridgeOutAssetBalance = createSelector(
  selectSelectedBridgeOutAssetDetails,
  (selectedAsset) => ({
    balance: selectedAsset?.balance,
    balanceValue: selectedAsset?.balanceValue,
  })
);

export const selectAssetSelections = createSelector(
  [selectSelectionList, selectEnergyAttributeTokens],
  (selectionList, eats = []): SelectionItem[] =>
    selectionList
      .map((listEntry) => {
        const currentAsset = eats.find(
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
      .filter(Boolean) as SelectionItem[]
);

export const selectRemainingForBridgeOut = createSelector(
  [selectSelectedBridgeOutAssetDetails, selectAssetSelections],
  (selectedAssetDetails, selections = []) => {
    if (!selectedAssetDetails)
      return {
        value: 0,
        formattedValue: Symbols.NoBalance,
      };

    const assetSelection =
      selections.find(({ id }) => id === selectedAssetDetails.id)
        ?.amountValue ?? 0;

    const value = new BigNumber(selectedAssetDetails.balanceValue)
      .minus(assetSelection)
      .toNumber();

    return {
      value,
      formattedValue: formatValue(value),
    };
  }
);

export const selectBridgeInOpenRequests = createSelector(
  [selectIsValidLogin, selectBridgeRequests],
  (isLoggedIn, bridgeRequests = []) => {
    if (!isLoggedIn) return [];

    return bridgeRequests.map((request) => {
      const type = request.direction.toLowerCase() as BridgeMode;

      return {
        id: request.id,
        credit: request.facilityName,
        type,
        registry: request.registry,
        amount: formatValue(request.quantity),
        amountValue: request.quantity,
        status:
          type === BridgeMode.In
            ? BridgeStatus.READY_TO_BRIDGE
            : BridgeStatus.IN_PROGRESS,
        vintage: new Date(request.vintage),
        icon: "jasmine",
      };
    });
  }
);

export const selectBridgeHistory = createSelector(
  [selectIsValidLogin, selectBridgeHistoryResponse],
  (isLoggedIn, bridgeHistory = []) => {
    if (!isLoggedIn) return [];

    return bridgeHistory.map((entry) => ({
      id: entry.id,
      date: entry.completedAt
        ? dateFns.format(new Date(entry.completedAt), "yyyy-MM-dd")
        : Symbols.NoValue,
      time: entry.completedAt
        ? dateFns.format(new Date(entry.completedAt), "HH:mm:ss")
        : Symbols.NoValue,
      type: entry.direction.toLowerCase() as BridgeMode,
      registry: entry.registry,
      creditBridged: entry.facilityName,
      amount: formatValue(entry.quantity),
      amountValue: entry.quantity,
      status: BridgeStatus.COMPLETED,
    }));
  }
);
