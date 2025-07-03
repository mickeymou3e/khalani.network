import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

import { TradedPair, tradedPairs } from "@/definitions/config";
import { staticAssetNames } from "@/definitions/types";
import { AssignedAsset } from "@/services/assets";
import { selectAssignedAssets } from "@/services/assets/assets.api";
import { AssetNameMap, selectAssetNameMap } from "@/services/balances";
import { selectRatesChannelResultData } from "@/services/rates";
import { TransformedRateResponse } from "@/services/rates/rates.types";
import { selectSelectedAsset } from "@/store/assets";
import { RateData } from "@/store/rates/rates.types";
import { RootState } from "@/store/store";
import { formatValue } from "@/utils/formatters";

const createRatesWithMarketPrice = (
  state: RootState,
  asset: AssignedAsset | TradedPair,
  assetNameMap: AssetNameMap
) => {
  if (!asset) return null;

  const rates = selectRatesChannelResultData(asset.pair!)(
    state
  ) as TransformedRateResponse;
  const fullName = assetNameMap[asset.base] ?? asset.base;
  const bidPriceValue = Number(rates?.bid?.price);
  const askPriceValue = Number(rates?.ask?.price);
  const marketPriceValue = new BigNumber(bidPriceValue ?? 0)
    .plus(askPriceValue ?? 0)
    .div(2)
    .toNumber();
  const timestamp = rates?.timestamp;

  return {
    id: asset.pair!,
    base: asset.base,
    quote: asset.quote,
    pair: asset.pair!,
    fullName,
    bidPriceValue,
    bidPriceUnformatted: rates?.bid?.price,
    askPriceValue,
    askPriceUnformatted: rates?.ask?.price,
    marketPriceValue,
    bidPrice: bidPriceValue && formatValue(bidPriceValue),
    askPrice: askPriceValue && formatValue(askPriceValue),
    marketPrice: marketPriceValue && formatValue(marketPriceValue),
    timestamp,
  };
};

export const selectAllAssetRateDetails = createSelector(
  [
    (state: RootState) => state,
    selectSelectedAsset,
    selectAssetNameMap,
    selectAssignedAssets,
  ],
  (state, selectedAsset, assetNameMap = {}, assignedAssets = []) =>
    assignedAssets.map((asset) => ({
      ...createRatesWithMarketPrice(state, asset, assetNameMap),
      selected: asset.base === selectedAsset?.base,
    })) as RateData[],
  {
    memoizeOptions: {
      resultEqualityCheck: (prev: RateData[], curr: RateData[]) => {
        const reducerFn = (acc: string, entry: RateData) =>
          `${acc}${entry.id}_${entry.bidPrice}_${entry.askPrice}`;
        const prevIdentifier = prev.reduce(reducerFn, "");
        const currIdentifier = curr.reduce(reducerFn, "");

        return prevIdentifier === currIdentifier;
      },
    },
  }
);

export const selectSelectedAssetRateDetails = createSelector(
  [(state: RootState) => state, selectSelectedAsset, selectAssetNameMap],
  (state, selectedAsset, assetNameMap = {}) =>
    createRatesWithMarketPrice(state, selectedAsset!, assetNameMap) as RateData
);

export const selectUnauthenticatedAssetRateDetails = createSelector(
  [(state: RootState) => state, selectSelectedAsset],
  (state, selectedAsset) =>
    tradedPairs.map((asset) => ({
      ...createRatesWithMarketPrice(state, asset, staticAssetNames),
      selected: asset.base === selectedAsset?.base,
    })) as RateData[]
);

export const selectUnauthenticatedSelectedAssetRateDetails = createSelector(
  [selectUnauthenticatedAssetRateDetails, selectSelectedAsset],
  (assetRateDetails, selectedAsset) =>
    assetRateDetails.find((details) => details.base === selectedAsset?.base)
);
