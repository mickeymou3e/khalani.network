import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes } from "@/definitions/config";
import { RequestMethods, Tokens } from "@/definitions/types";
import { api, getMutationParams } from "@/services/api";
import { PollingIntervals } from "@/services/api.types";
import { neutralApi } from "@/services/extraApis";

import {
  ApproveOperatorRequest,
  BridgeHistoryResponse,
  BridgeInRequest,
  BridgeOutRequest,
  BridgeRequestsResponse,
  EligibilityRequestProps,
  EligibilityResponseProps,
  SignatureResponse,
} from "./bridge.types";

export const poolApi = api.injectEndpoints({
  endpoints: (builder) => ({
    bridgeInCall: builder.mutation<any, BridgeInRequest>({
      query: ({
        strategyCode,
        tokenId,
        amount,
        oracleData,
        deadline,
        nonce,
        sig,
        txSettings,
      }) => ({
        url: ApiRoutes.CONTRACT_CALL,
        method: RequestMethods.POST,
        body: {
          strategy_code: strategyCode,
          contract_address:
            process.env.NEXT_PUBLIC_ASSETS_JASMINE_MINTER_ADDRESS,
          method: "mint",
          args: {
            receiver: Tokens.STRATEGY_JLT_CODE,
            id: tokenId,
            amount,
            transferData: "",
            oracleData,
            deadline,
            nonce,
            sig,
          },
          tx_settings: txSettings,
        },
      }),
      ...getMutationParams(),
    }),
    checkBridgeOutEligibility: builder.query<
      EligibilityResponseProps,
      EligibilityRequestProps
    >({
      query: ({ strategyCode, methodName, params }) => ({
        url: ApiRoutes.BRIDGEOFF_ELIGIBILITY.replace(
          "%strategyCode%",
          strategyCode
        )
          .replace(
            "%contractAddress%",
            process.env.NEXT_PUBLIC_JASMINE_EAT_ADDRESS as string
          )
          .replace("%methodName%", methodName),
        method: RequestMethods.GET,
        params,
      }),
      extraOptions: {
        maxRetries: 0,
      },
    }),
    approveOperator: builder.mutation<any, ApproveOperatorRequest>({
      query: ({ strategyCode, operator, txSettings }) => ({
        url: ApiRoutes.CONTRACT_CALL,
        method: RequestMethods.POST,
        body: {
          strategy_code: strategyCode,
          contract_address: process.env.NEXT_PUBLIC_JASMINE_EAT_ADDRESS,
          method: "setApprovalForAll",
          args: {
            operator,
            approved: "true",
          },
          tx_settings: txSettings,
        },
      }),
      ...getMutationParams(),
    }),
    bridgeOutCall: builder.mutation<any, BridgeOutRequest>({
      query: ({ strategyCode, ids, values, metadata, txSettings }) => ({
        url: ApiRoutes.CONTRACT_CALL,
        method: RequestMethods.POST,
        body: {
          strategy_code: strategyCode,
          contract_address:
            process.env.NEXT_PUBLIC_ASSETS_JASMINE_MINTER_ADDRESS,
          method: "burnBatch",
          args: {
            ids,
            amounts: values,
            metadata,
          },
          tx_settings: txSettings,
        },
      }),
      ...getMutationParams(),
    }),
  }),
});

export const neutralBridgeApi = neutralApi.injectEndpoints({
  endpoints: (builder) => ({
    getBridgeRequests: builder.query<BridgeRequestsResponse, void>({
      query: () => ({
        url: ApiRoutes.BRIDGE_REQUESTS,
        method: RequestMethods.GET,
      }),
    }),
    getSignature: builder.query<SignatureResponse, string>({
      query: (certificateId) => ({
        url: ApiRoutes.NEUTRAL_BRIDGE_SIGNATURE.replace(
          "%certificateId%",
          certificateId
        ),
        method: RequestMethods.GET,
      }),
      serializeQueryArgs: () => "getSignature",
      forceRefetch: () => true,
    }),
    getHistory: builder.query<BridgeHistoryResponse, void>({
      query: () => ({
        url: ApiRoutes.BRIDGE_HISTORY,
        method: RequestMethods.GET,
      }),
    }),
  }),
});

export const bridgeInCall = poolApi.endpoints.bridgeInCall.initiate;
export const bridgeOutCall = poolApi.endpoints.bridgeOutCall.initiate;
export const checkEligibility =
  poolApi.endpoints.checkBridgeOutEligibility.initiate;
export const approveOperator = poolApi.endpoints.approveOperator.initiate;

export const subscribeBridgeRequests = () =>
  neutralBridgeApi.endpoints.getBridgeRequests.initiate(undefined, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.JASMINE_POOL_DEPOSITS,
    },
  });

export const getSignature = neutralBridgeApi.endpoints.getSignature.initiate;

export const subscribeBridgeHistory = () =>
  neutralBridgeApi.endpoints.getHistory.initiate(undefined, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.BRIDGE_HISTORY,
    },
  });

export const selectBridgeRequests = createSelector(
  neutralBridgeApi.endpoints.getBridgeRequests.select(),
  (result) => result?.data?.requests ?? []
);

export const selectBridgeHistoryResponse = createSelector(
  neutralBridgeApi.endpoints.getHistory.select(),
  (result) => result?.data?.history ?? []
);
