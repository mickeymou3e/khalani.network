import { createSelector } from "@reduxjs/toolkit";

import { ApiRoutes } from "@/definitions/config";
import { RequestMethods, Tokens } from "@/definitions/types";
import { api, getMutationParams } from "@/services/api";
import { PollingIntervals } from "@/services/api.types";
import { graphApi, neutralApi } from "@/services/extraApis";
import {
  addMetadataToHistory,
  getHistoryTokenIds,
  getTokenMetadata,
  PoolHistory,
  PoolHistoryResponse,
} from "@/store/ancillary";

import { getRetireHistoryQuery } from "./retire.graphql";
import {
  RetireConfirmRequestParams,
  RetireConfirmResponse,
  RetireEnergyAttributeTokenRequestParams,
  RetirePoolTokenRequestParams,
  RetireResponse,
} from "./retire.types";

export const retireApi = api.injectEndpoints({
  endpoints: (builder) => ({
    retireEnergyAttributeTokensCall: builder.mutation<
      RetireResponse,
      RetireEnergyAttributeTokenRequestParams
    >({
      query: ({ strategyCode, ids, values, txSettings }) => ({
        url: ApiRoutes.CONTRACT_CALL,
        method: RequestMethods.POST,
        body: {
          strategy_code: strategyCode,
          contract_address: process.env.NEXT_PUBLIC_JASMINE_EAT_ADDRESS,
          method: "burnBatch",
          args: {
            from: Tokens.STRATEGY_JLT_CODE,
            recipient: Tokens.STRATEGY_JLT_CODE,
            ids,
            values,
          },
          tx_settings: txSettings,
        },
      }),
      ...getMutationParams(),
    }),
    retirePoolTokenCall: builder.mutation<
      RetireResponse,
      RetirePoolTokenRequestParams
    >({
      query: ({ strategyCode, amount, txSettings }) => ({
        url: ApiRoutes.CONTRACT_CALL,
        method: RequestMethods.POST,
        body: {
          strategy_code: strategyCode,
          contract_address: process.env.NEXT_PUBLIC_JASMINE_TOKEN_ADDRESS,
          method: "retire",
          args: {
            from: Tokens.STRATEGY_JLT_CODE,
            beneficiary: Tokens.STRATEGY_JLT_CODE,
            amount,
            data: "",
          },
          tx_settings: txSettings,
        },
      }),
      ...getMutationParams(),
    }),
  }),
});

export const retireNeutralApi = neutralApi.injectEndpoints({
  endpoints: (builder) => ({
    confirmRetireAction: builder.query<
      RetireConfirmResponse,
      RetireConfirmRequestParams
    >({
      query: (body) => ({
        url: ApiRoutes.CONFIRM_RETIRE,
        method: RequestMethods.POST,
        body,
      }),
      extraOptions: {
        maxRetries: 1,
      },
    }),
  }),
});

export const historyApi = graphApi.injectEndpoints({
  endpoints: (builder) => ({
    getRetireHistory: builder.query<PoolHistory, string>({
      queryFn: async (address, api, extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: "",
          method: RequestMethods.POST,
          body: getRetireHistoryQuery(address),
        });
        const { data } = result.data as PoolHistoryResponse;

        const tokenIds = getHistoryTokenIds(data);
        const metadataResult = await getTokenMetadata(tokenIds, api);
        const response = addMetadataToHistory(data, metadataResult);

        return { data: response };
      },
      serializeQueryArgs: () => "getRetireHistory",
    }),
  }),
});

export const retireEnergyAttributeTokensCall =
  retireApi.endpoints.retireEnergyAttributeTokensCall.initiate;
export const retirePoolTokenCall =
  retireApi.endpoints.retirePoolTokenCall.initiate;
export const confirmRetireAction =
  retireNeutralApi.endpoints.confirmRetireAction.initiate;
export const subscribeRetireHistory = (customerAddress: string) =>
  historyApi.endpoints.getRetireHistory.initiate(customerAddress, {
    subscriptionOptions: {
      pollingInterval: PollingIntervals.THEGRAPH_POOL_HISTORY,
    },
  });

export const selectRetireHistoryResult = createSelector(
  historyApi.endpoints.getRetireHistory.select("getRetireHistory"),
  (result) => result?.data
);
