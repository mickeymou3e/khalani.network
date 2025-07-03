import { createSelector } from "@reduxjs/toolkit";

import { throttle } from "@/utils/functions";

import { api } from "../api";
import {
  neutralSocketClient,
  socketClient,
  SocketEventCode,
  WebSocketClient,
} from "../streaming";
import { RateResponse, TransformedRateResponse } from "./rates.types";

const ratesChannelHandler = async (
  client: WebSocketClient,
  asset: string,
  api: any
) => {
  try {
    await api.cacheDataLoaded;

    client.subscribe(
      SocketEventCode.RfqOrderBook,
      asset,
      throttle((data: unknown) => {
        const response = data as RateResponse;
        const transformedData = {
          bid: response?.bids?.[0],
          ask: response?.asks?.[0],
          timestamp: response?.timestamp.toString(),
        };

        api.updateCachedData(() => transformedData);
      }, 2000)
    );
  } catch (error) {
    console.error(error);
  }

  await api.cacheEntryRemoved;

  client.unsubscribe(SocketEventCode.RfqOrderBook, asset);
};

export const ratesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    ratesChannel: builder.query<TransformedRateResponse, string>({
      queryFn: () => ({ data: {} as TransformedRateResponse }),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(asset, api) {
        await ratesChannelHandler(socketClient, asset, api);
      },
    }),
    neutralRatesChannel: builder.query<TransformedRateResponse, string>({
      queryFn: () => ({ data: {} as TransformedRateResponse }),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(asset, api) {
        await ratesChannelHandler(neutralSocketClient, asset, api);
      },
    }),
  }),
});

export const selectRatesChannelResultData = (pair: string) =>
  createSelector(
    [
      ratesApi.endpoints.ratesChannel.select(pair),
      ratesApi.endpoints.neutralRatesChannel.select(pair),
    ],
    (ratesResult, neutralRatesResult) =>
      ratesResult?.data || neutralRatesResult?.data || []
  );

export const subscribeRates = ratesApi.endpoints.ratesChannel.initiate;
export const subscribeNeutralRates =
  ratesApi.endpoints.neutralRatesChannel.initiate;
