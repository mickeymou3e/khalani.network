import { createSelector } from "@reduxjs/toolkit";

import {
  ApiRoutes,
  defaultBaseAsset,
  mvpAvailableAssetsWithoutTxToken
} from "@/definitions/config";
import { RequestMethods } from "@/definitions/types";
import { PollingIntervals } from "@/services/api.types";

import { api } from "../api";
import { AssetNameMap, Balance } from "./balances.types";

export const balancesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBalances: builder.query<Balance[], string>({
      query: (clientId) => ({
        url: `${ApiRoutes.BALANCES}${clientId}`,
        method: RequestMethods.GET,
      }),
      transformResponse: (response: Balance[]) =>
        response
          .map((balance) => {
            const code =
              balance.code === defaultBaseAsset.code
                ? defaultBaseAsset.balanceCode!
                : balance.code;

            return {
              ...balance,
              code,
            };
          })
          .filter((balance) =>
            mvpAvailableAssetsWithoutTxToken.find(
              (asset) => asset.code === balance.code
            )
          ),

      serializeQueryArgs: () => "getBalances",
    }),
  }),
});

export const selectBalancesResultData = createSelector(
  balancesApi.endpoints.getBalances.select("getBalances"),
  (result) => result?.data ?? []
);

/**
 * Returns a map of asset codes to asset names, it is only available in balances
 */
export const selectAssetNameMap = createSelector(
  [selectBalancesResultData],
  (balances = []) =>
    balances.reduce((acc: AssetNameMap, entry: Balance) => {
      acc[entry.code] = entry.name;
      return acc;
    }, {})
);

export const subscribeBalances = (clientId: string) =>
  balancesApi.endpoints.getBalances.initiate(clientId, {
    subscriptionOptions: { pollingInterval: PollingIntervals.BALANCES },
  });
