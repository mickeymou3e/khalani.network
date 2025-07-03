import { createSlice } from "@reduxjs/toolkit";
import * as R from "ramda";

import {
  areAssetsEqual,
  mvpAvailableAssetsWithoutTxToken,
} from "@/definitions/config";
import { AddressState, RequestStatusProps } from "@/definitions/types";
import {
  CryptoDepositHistoryRecordProps,
  CryptoDepositWalletsProps,
  CryptoWithdrawalHistoryRecordProps,
  CryptoWithdrawalsWalletsProps,
  walletApi,
} from "@/services/wallet";

// function to remove duplicates from array basing on on the object's key
export const removeDuplicates = (array: any[], key: string) =>
  R.uniqWith(R.eqProps(key), array);

export interface WalletState {
  cryptoDepositAddresses: CryptoDepositWalletsProps[];
  fetchCryptoDepositAddressesStatus: RequestStatusProps;
  depositsHistory: CryptoDepositHistoryRecordProps[];
  selectedAsset: string;
  selectedAssetDetails: null | CryptoWithdrawalsWalletsProps;
  cryptoWithdrawalAddresses: CryptoWithdrawalsWalletsProps[];
  withdrawalsHistory: CryptoWithdrawalHistoryRecordProps[];
  requestStatus: RequestStatusProps;
}

export const initialState: WalletState = {
  cryptoDepositAddresses: [],
  fetchCryptoDepositAddressesStatus: RequestStatusProps.IDLE,
  depositsHistory: [],
  selectedAsset: "",
  selectedAssetDetails: null,
  cryptoWithdrawalAddresses: [],
  withdrawalsHistory: [],
  requestStatus: RequestStatusProps.IDLE,
};

const mvpFilterFn = (
  entry: CryptoDepositHistoryRecordProps | CryptoWithdrawalHistoryRecordProps
) =>
  mvpAvailableAssetsWithoutTxToken.find((asset) =>
    areAssetsEqual(asset.code, entry.currency_code)
  );

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setSelectedAsset: (state, action) => {
      state.selectedAsset = action.payload;
    },
    setSelectedAssetDetails: (state, action) => {
      state.selectedAssetDetails = action.payload;
    },
    resetWalletRequestStatus: (state) => {
      state.requestStatus = RequestStatusProps.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      walletApi.endpoints.getCryptoDepositsAddressess.matchFulfilled,
      (state, action) => {
        state.cryptoDepositAddresses = [...action.payload]
          .sort((a, b) =>
            new Date(b.created_at).getTime() > new Date(a.created_at).getTime()
              ? 1
              : -1
          )
          .map((obj) => ({
            ...obj,
            // Note: transform currency code to uppercase to be consistent with other responses
            currency_code: obj.currency_code.toUpperCase(),
            id: `${obj.label}-${obj.created_at}`,
          }));
        state.fetchCryptoDepositAddressesStatus = RequestStatusProps.SUCCESS;
      }
    );
    builder.addMatcher(
      walletApi.endpoints.getDepositsHistory.matchFulfilled,
      (state, action) => {
        state.depositsHistory = action.payload
          .filter(mvpFilterFn)
          .map((obj) => ({
            ...obj,
            // Note: in response missing id property which is required by Datagrid component
            id: `${obj.client_uuid}-${obj.compliance_received_at}`,
            // Note: transform currency code to uppercase to be consistent with other responses
            currency_code: obj.currency_code.toUpperCase(),
          }));
      }
    );
    builder.addMatcher(
      walletApi.endpoints.getCryptoWithdrawalAddressess.matchFulfilled,
      (state, action) => {
        const filteredList = action.payload.filter(
          (element) => element.state !== AddressState.pending_admin_delete
        );

        state.cryptoWithdrawalAddresses = filteredList.map((obj) => ({
          ...obj,
          // Note: transform currency code to uppercase to be consistent with other responses
          currency: obj.currency.toUpperCase(),
          id: `${obj.label}-${obj.created_at}`,
        }));
      }
    );
    builder.addMatcher(
      walletApi.endpoints.getWithdrawalsHistory.matchFulfilled,
      (state, action) => {
        state.withdrawalsHistory = action.payload
          .filter(mvpFilterFn)
          .filter((element) => element.destination_type === "address")
          .map((obj) => ({
            ...obj,
            // Note: in response missing id property which is required by Datagrid component
            id: `${obj.client_uuid}-${obj.created_at}`,
            // Note: transform currency code to uppercase to be consistent with other responses
            currency_code: obj.currency_code.toUpperCase(),
          }));
      }
    );
    builder.addMatcher(
      walletApi.endpoints.whitelistAddress.matchFulfilled,
      (state) => {
        state.requestStatus = RequestStatusProps.SUCCESS;
      }
    );
    builder.addMatcher(
      walletApi.endpoints.whitelistAddress.matchRejected,
      (state) => {
        state.requestStatus = RequestStatusProps.FAILED;
      }
    );
    builder.addMatcher(
      walletApi.endpoints.requestWithdrawal.matchFulfilled,
      (state) => {
        state.requestStatus = RequestStatusProps.SUCCESS;
      }
    );
    builder.addMatcher(
      walletApi.endpoints.requestWithdrawal.matchRejected,
      (state) => {
        state.requestStatus = RequestStatusProps.FAILED;
      }
    );
    builder.addMatcher(
      walletApi.endpoints.requestWithdrawalDelete.matchFulfilled,
      (state) => {
        state.requestStatus = RequestStatusProps.SUCCESS;
      }
    );
  },
});

const { reducer } = walletSlice;

export const {
  setSelectedAsset,
  setSelectedAssetDetails,
  resetWalletRequestStatus,
} = walletSlice.actions;

export { reducer as walletReducer };
