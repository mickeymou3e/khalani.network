import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes, mvpAvailableAssets } from "@/definitions/config";

import { api, getMutationParams } from "../api";
import { PollingIntervals } from "../api.types";
import {
  AddressDeleteRequestProps,
  CreateWalletRequestProps,
  CreateWalletResponseProps,
  CryptoDepositHistoryRecordProps,
  CryptoDepositWalletsProps,
  CryptoWithdrawalHistoryRecordProps,
  CryptoWithdrawalsWalletsProps,
  WalletAssetProps,
  WhitelistAddressRequestProps,
  WhitelistAddressResponseProps,
  WithdrawalRequestProps,
  WithdrawalResponseProps,
} from "./wallet.types";

interface GetCryptoDepositsAddressessProps {
  records: CryptoDepositWalletsProps[];
}

export const walletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // DEPOSITS --------------------------------------------
    getAvailableAssetsList: builder.query<WalletAssetProps[], void>({
      query: () => ({
        url: ApiRoutes.ASSETS_LIST,
      }),
      transformResponse: (response: WalletAssetProps[]) =>
        response.filter((asset) =>
          mvpAvailableAssets.find((mvpAsset) => mvpAsset.code === asset.code)
        ),
      extraOptions: {
        maxRetries: 0,
      },
    }),

    getCryptoDepositsAddressess: builder.query<
      CryptoDepositWalletsProps[],
      string
    >({
      query: (clientId) => ({
        url: `${ApiRoutes.CRYPTO_DEPOSIT_ADRESSESS.replace(
          "%clientId%",
          clientId
        )}`,
      }),
      extraOptions: {
        maxRetries: 0,
      },
      transformResponse: (
        response: GetCryptoDepositsAddressessProps
      ): CryptoDepositWalletsProps[] =>
        response.records.filter((record) =>
          Boolean(
            mvpAvailableAssets.find(
              (asset) => asset.walletLabel === record.label
            )
          )
        ),
    }),

    getDepositsHistory: builder.query<CryptoDepositHistoryRecordProps[], void>({
      query: () => ({
        url: ApiRoutes.DEPOSITS_HISTORY,
      }),
      transformResponse: (response: any): CryptoDepositHistoryRecordProps[] =>
        response.records,
    }),

    //  WITHDRAWALS --------------------------------------------
    getCryptoWithdrawalAddressess: builder.query<
      CryptoWithdrawalsWalletsProps[],
      void
    >({
      query: () => ({
        url: ApiRoutes.CRYPTO_WITHDRAWAL_ADDRESSESS,
      }),
      extraOptions: {
        maxRetries: 0,
      },
      transformResponse: (response: {
        records: CryptoWithdrawalsWalletsProps[];
      }): CryptoWithdrawalsWalletsProps[] => response.records,
    }),
    getWithdrawalsHistory: builder.query<
      CryptoWithdrawalHistoryRecordProps[],
      void
    >({
      query: () => ({
        url: ApiRoutes.WITHDRAWALS_HISTORY,
      }),
      transformResponse: (response: {
        records: CryptoWithdrawalHistoryRecordProps[];
      }): CryptoWithdrawalHistoryRecordProps[] => response.records,
    }),

    // BACKDROPS ------------------------------------------------
    whitelistAddress: builder.mutation<
      WhitelistAddressResponseProps,
      WhitelistAddressRequestProps
    >({
      query: (requestBody) => ({
        url: ApiRoutes.REQUEST_WHITELIST_ADDRESS,
        method: "POST",
        body: requestBody,
      }),
      ...getMutationParams(),
    }),
    requestWithdrawal: builder.mutation<
      WithdrawalResponseProps,
      WithdrawalRequestProps
    >({
      query: (requestBody) => ({
        url: ApiRoutes.REQUEST_WITHDRAWAL,
        method: "POST",
        body: requestBody,
      }),
      ...getMutationParams(),
    }),
    requestWithdrawalDelete: builder.mutation<void, { withdrawalId: string }>({
      query: (requestBody: { withdrawalId: string }) => ({
        url: ApiRoutes.REQUEST_WITHDRAWAL_DELETE.replace(
          "%withdrawalId%",
          requestBody.withdrawalId
        ),
        method: "DELETE",
      }),
      ...getMutationParams(),
    }),
    requestAddressDelete: builder.mutation<any, AddressDeleteRequestProps>({
      query: (requestBody: AddressDeleteRequestProps) => ({
        url: ApiRoutes.REQUEST_ADDRESS_DELETE.replace(
          "%addressId%",
          requestBody.addressId
        ),
        method: "POST",
        body: {
          state: "pending_admin_delete",
        },
      }),
      ...getMutationParams(),
    }),

    // CREATE WALLET --------------------------------------------
    createWallet: builder.mutation<
      CreateWalletResponseProps,
      CreateWalletRequestProps
    >({
      query: (requestBody) => ({
        url: ApiRoutes.CREATE_WALLET,
        method: "POST",
        body: requestBody,
      }),
      ...getMutationParams(),
    }),
  }),
});

export const getAvailableAssetsList =
  walletApi.endpoints.getAvailableAssetsList.initiate;

export const getCryptoDepositsAddressess = (neutralClientCode: string) =>
  walletApi.endpoints.getCryptoDepositsAddressess.initiate(neutralClientCode, {
    forceRefetch: true,
  });

export const subscribeCryptoDepositsAddressess = (neutralClientCode: string) =>
  walletApi.endpoints.getCryptoDepositsAddressess.initiate(neutralClientCode, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.DEPOSIT_ADDRESSES,
    },
  });

export const subscribeDepositsHistory = () =>
  walletApi.endpoints.getDepositsHistory.initiate(undefined, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.DEPOSIT_HISTORY,
    },
  });

export const whitelistAddress = walletApi.endpoints.whitelistAddress.initiate;

export const getCryptoWithdrawalAddressess =
  walletApi.endpoints.getCryptoWithdrawalAddressess.initiate;

export const subscribeCryptoWithdrawalAddressess = () =>
  walletApi.endpoints.getCryptoWithdrawalAddressess.initiate(undefined, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.WITHDRAWALS_ADRESSESS,
    },
  });

export const subscribeWithdrawalsHistory = () =>
  walletApi.endpoints.getWithdrawalsHistory.initiate(undefined, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.WITHDRAWAL_HISTORY,
    },
  });

export const requestWithdrawal = walletApi.endpoints.requestWithdrawal.initiate;
export const createWallet = walletApi.endpoints.createWallet.initiate;
export const requestWithdrawalDelete =
  walletApi.endpoints.requestWithdrawalDelete.initiate;
export const requestAddressDelete =
  walletApi.endpoints.requestAddressDelete.initiate;

export const selectAvailableAssetsListData = createSelector(
  walletApi.endpoints.getAvailableAssetsList.select(),
  (result) => result?.data ?? []
);
