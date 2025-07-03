import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes } from "@/definitions/config";
import { RequestMethods, Tokens } from "@/definitions/types";
import { api, getMutationParams } from "@/services/api";
import { PollingIntervals } from "@/services/api.types";
import { graphApi } from "@/services/extraApis";
import {
  addMetadataToHistory,
  getHistoryTokenIds,
  getTokenMetadata,
  PoolHistory,
  PoolHistoryResponse,
} from "@/store/ancillary";

import { getPoolHistoryQuery } from "./pool.graphql";
import {
  PoolRequestParams,
  PoolResponse,
  RedeemRequestParams,
  RedeemResponse,
} from "./pool.types";

export const poolApi = api.injectEndpoints({
  endpoints: (builder) => ({
    redeemCall: builder.mutation<RedeemResponse, RedeemRequestParams>({
      query: ({ strategyCode, tokenIds, amounts, txSettings }) => ({
        url: ApiRoutes.CONTRACT_CALL,
        method: RequestMethods.POST,
        body: {
          strategy_code: strategyCode,
          contract_address: process.env.NEXT_PUBLIC_JASMINE_TOKEN_ADDRESS,
          method: "withdrawSpecific",
          args: {
            from: Tokens.STRATEGY_JLT_CODE,
            recipient: Tokens.STRATEGY_JLT_CODE,
            tokenIds,
            amounts,
            data: "",
          },
          tx_settings: txSettings,
        },
      }),
      ...getMutationParams(),
    }),
    poolCall: builder.mutation<PoolResponse, PoolRequestParams>({
      query: ({ strategyCode, ids, amounts, txSettings }) => ({
        url: ApiRoutes.CONTRACT_CALL,
        method: RequestMethods.POST,
        body: {
          strategy_code: strategyCode,
          contract_address: process.env.NEXT_PUBLIC_JASMINE_EAT_ADDRESS,
          method: "safeBatchTransferFrom",
          args: {
            from: Tokens.STRATEGY_JLT_CODE,
            to: process.env.NEXT_PUBLIC_JASMINE_TOKEN_ADDRESS,
            ids,
            amounts,
            data: "",
          },
          tx_settings: txSettings,
        },
      }),
      ...getMutationParams(),
    }),
  }),
});

export const historyApi = graphApi.injectEndpoints({
  endpoints: (builder) => ({
    getPoolHistory: builder.query<PoolHistory, string>({
      queryFn: async (address, api, extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: "",
          method: RequestMethods.POST,
          body: getPoolHistoryQuery(
            address,
            process.env.NEXT_PUBLIC_JASMINE_TOKEN_ADDRESS as string
          ),
        });
        const { data } = result.data as PoolHistoryResponse;

        const tokenIds = getHistoryTokenIds(data);
        const metadataResult = await getTokenMetadata(tokenIds, api);
        const response = addMetadataToHistory(data, metadataResult);

        return { data: response };
      },
      serializeQueryArgs: () => "getPoolHistory",
    }),
  }),
});

export const redeemCall = poolApi.endpoints.redeemCall.initiate;
export const poolCall = poolApi.endpoints.poolCall.initiate;

export const subscribePoolHistory = (customerAddress: string) =>
  historyApi.endpoints.getPoolHistory.initiate(customerAddress, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.THEGRAPH_POOL_HISTORY,
    },
  });

export const selectPoolHistoryResult = createSelector(
  historyApi.endpoints.getPoolHistory.select("getPoolHistory"),
  (result) => result?.data
);
