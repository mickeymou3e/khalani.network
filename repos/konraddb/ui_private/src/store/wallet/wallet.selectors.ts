import { createSelector } from "@reduxjs/toolkit";

import { areAssetsEqual, getAssetDetails } from "@/definitions/config";
import { AddressState, FiatCurrencies } from "@/definitions/types";
import { selectUsers } from "@/services/admin/admin.api";
import { selectBalancesResultData } from "@/services/balances";
import {
  selectAvailableAssetsListData,
  WalletAssetProps,
} from "@/services/wallet";
import { RootState } from "@/store/store";

import { removeDuplicates } from "./wallet.store";
import { DepositHistoryRecordProps } from "./wallet.types";

const selectAvailableAssetsList = createSelector(
  selectAvailableAssetsListData,
  (availableAssetsList = []): WalletAssetProps[] =>
    removeDuplicates(availableAssetsList, "code").map((obj) => ({
      ...obj,
      code: obj.code.toUpperCase(),
    }))
);

export const selectRawCryptoDepositAddresses = (state: RootState) =>
  state.wallet.cryptoDepositAddresses;

const selectDepositsHistory = (state: RootState) =>
  state.wallet.depositsHistory;

export const selectSelectedAsset = (state: RootState) =>
  state.wallet.selectedAsset;
export const selectSelectedAssetDetails = (state: RootState) =>
  state.wallet.selectedAssetDetails;

// get list of all withdrawal addresses
export const selectRawCryptoWithdrawalAddresses = (state: RootState) =>
  state.wallet.cryptoWithdrawalAddresses;
export const selectFetchCryptoDepositAddressesStatus = (state: RootState) =>
  state.wallet.fetchCryptoDepositAddressesStatus;

export const selectWithdrawalsHistory = (state: RootState) =>
  state.wallet.withdrawalsHistory;

export const selectRequestStatus = (state: RootState) =>
  state.wallet.requestStatus;

export const selectCustodyWalletCodes = createSelector(
  selectRawCryptoDepositAddresses,
  (wallets = []) => wallets.map((wallet) => wallet.code)
);

// find deposit address for selected asset
// Note: selects first address from the list because we gonna have only one wallet per asset per user
export const selectCryptoDepositAddress = createSelector(
  [selectRawCryptoDepositAddresses, selectSelectedAsset],
  (cryptoDepositAddresses, selectedAsset) => {
    const selectedAssetDetails = getAssetDetails(selectedAsset);
    const filteredElement = cryptoDepositAddresses.find(
      (item) => item.label === selectedAssetDetails.walletLabel
    );

    if (!filteredElement) return null;

    return filteredElement.compliance_addresses[0].address;
  }
);

// find blockchain network for selected asset
export const selectBlockchainNetwork = createSelector(
  [selectAvailableAssetsList, selectSelectedAsset],
  (availableAssetsList, selectedAsset) => {
    const filteredElement = availableAssetsList.find((item) =>
      areAssetsEqual(item.code, selectedAsset)
    );

    if (!filteredElement) return null;

    return filteredElement.blockchain_network;
  }
);

// find wallet to which you can assign withdrawal address
export const selectFirstAwailableWalletCode = createSelector(
  [selectRawCryptoDepositAddresses, selectSelectedAsset],
  (cryptoDepositAddresses, selectedAsset) => {
    const selectedAssetDetails = getAssetDetails(selectedAsset);
    const filteredElement = cryptoDepositAddresses.find(
      (item) => item.label === selectedAssetDetails.walletLabel
    );

    if (!filteredElement) return null;

    return filteredElement.code;
  }
);

// check if selected asset is FIAT or not
export const selectIsAssetFiat = createSelector(
  [selectBalancesResultData, selectSelectedAsset],
  (balancesList, selectedAsset) => {
    if (!balancesList) return null;

    const filteredElement = balancesList.find((item) =>
      areAssetsEqual(item.code, selectedAsset)
    );

    if (!filteredElement) return null;

    return filteredElement.is_fiat;
  }
);

// add explorer url to each deposit history item
export const selectDepositsHistoryWithExplorerUrl = createSelector(
  [selectDepositsHistory, selectAvailableAssetsList],
  (depositsHistory, availableAssetsList) => {
    if (availableAssetsList.length === 0) return depositsHistory;

    return depositsHistory.map((item) => {
      const filteredElement = availableAssetsList.find((asset) =>
        areAssetsEqual(asset.code, item.currency_code)
      );

      if (!filteredElement) return { item };

      return {
        ...item,
        explorerUrl: filteredElement.tx_explorer_url,
        isFiat: [FiatCurrencies.EUR, FiatCurrencies.USD].includes(
          filteredElement.code as FiatCurrencies
        ),
      };
    }) as DepositHistoryRecordProps[];
  }
);

// get list of all withdrawal addresses for selected asset and adjusted for the Select component
export const selectCryptoWithdrawalAddresses = createSelector(
  [selectRawCryptoWithdrawalAddresses, selectSelectedAsset],
  (addressesList, selectedAsset) =>
    addressesList
      .filter(
        (obj) =>
          areAssetsEqual(obj.currency, selectedAsset) &&
          obj.wallet_code !== null &&
          obj.state === AddressState.approved
      )
      .map((obj) => ({
        value: `${obj.label}-${obj.address}`,
        assets: [
          {
            label: obj.label,
            description: obj.address,
            state: obj.state,
          },
        ],
      }))
);

// add explorer url to each withdrawal history item
export const selectWithdrawalsHistoryWithExplorerUrl = createSelector(
  [selectWithdrawalsHistory, selectAvailableAssetsList, selectUsers],
  (withdrawalsHistory, availableAssetsList, users) => {
    if (availableAssetsList.length === 0) return withdrawalsHistory;

    return withdrawalsHistory.map((item) => {
      const filteredElement = availableAssetsList.find((asset) =>
        areAssetsEqual(asset.code, item.currency_code)
      );
      const user = users.find((user) => user.code === item.creator_code);

      if (!filteredElement) return { item };

      return {
        ...item,
        explorerUrl: filteredElement.tx_explorer_url,
        user: user?.name ?? "",
        role: user?.role ?? "",
        isFiat:
          filteredElement.code === FiatCurrencies.EUR ||
          filteredElement.code === FiatCurrencies.USD,
      };
    });
  }
);
